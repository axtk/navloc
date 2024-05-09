import {
    Event as EventManagerEvent,
    EventManager,
    MatchParams,
    matchPattern,
} from 'evtm';
import {getPath} from './getPath';
import {isSameOrigin} from './isSameOrigin';
import {Transition, TransitionType} from './Transition';
import {
    LocationEvent,
    LocationEventHandler,
    LocationListener,
    LocationPattern,
    LocationString,
    MatchHandler,
} from './types';

const toLocationEvent = (event: EventManagerEvent): LocationEvent => {
    let {type, ...eventProps} = event;

    return {
        ...eventProps,
        href: typeof type === 'string' ? type : null,
    };
};

export class NavigationLocation {
    href: LocationString;
    eventManager: EventManager;

    constructor(location?: LocationString) {
        this.href = this.deriveHref(location);
        this.eventManager = new EventManager();
        this.initialize();
    }

    initialize(): void {
        if (typeof window !== 'undefined')
            window.addEventListener('popstate', () => this.dispatch());
    }

    /**
     * Performs the location change.
     * It can be overridden to apply custom behavior. Returning `false` in certain cases
     * will prevent the Location instance from updating its `href` and notifying its listeners.
     */
    transition(nextLocation: LocationString, type?: TransitionType): boolean | void | undefined {
        if (
            typeof window === 'undefined' ||
            nextLocation === undefined || nextLocation === null ||
            type === undefined || type === null
        )
            return;

        if (!window.history || !isSameOrigin(nextLocation)) {
            switch (type) {
                case Transition.ASSIGN:
                    window.location.assign(nextLocation);

                    break;
                case Transition.REPLACE:
                    window.location.replace(nextLocation);

                    break;
            }

            return;
        }

        switch (type) {
            case Transition.ASSIGN:
                window.history.pushState({}, '', nextLocation);

                break;
            case Transition.REPLACE:
                window.history.replaceState({}, '', nextLocation);

                break;
        }
    }

    /*
     * Jumps the specified number of history entries away from the current entry
     * (see [`history.go(delta)`](https://developer.mozilla.org/en-US/docs/Web/API/History/go)
     * and dispatches a new location event (within the `popstate` event handler
     * added in `initialize()`).
     */
    go(delta: number): void {
        if (typeof window !== 'undefined' && window.history)
            window.history.go(delta);
    }

    deriveHref(location?: LocationString): LocationString {
        return getPath(location);
    }

    onChange(handler: LocationEventHandler): () => void {
        let listener = this.eventManager.addListener('*', event => {
            handler(toLocationEvent(event));
        });

        return () => listener.remove();
    }

    addListener(locationPattern: LocationPattern, handler: LocationEventHandler): LocationListener {
        return this.eventManager.addListener(locationPattern, event => {
            handler(toLocationEvent(event));
        });
    }

    dispatch(location?: LocationString, transitionType?: TransitionType): void {
        if (this.transition(location, transitionType) !== false) {
            this.href = this.deriveHref(location);
            this.eventManager.dispatch(this.href);
        }
    }

    /**
     * Matches the current location against the location pattern.
     */
    match(locationPattern: LocationPattern): MatchParams | null {
        return matchPattern(locationPattern, this.href);
    }

    /**
     * Checks whether the current location matches the location pattern.
     */
    matches(locationPattern: LocationPattern): boolean {
        return matchPattern(locationPattern, this.href) !== null;
    }

    /**
     * Loosely resembles the conditional ternary operator (`condition ? x : y`):
     * if the current location matches the location pattern the returned value
     * is based on the second parameter, otherwise on the third parameter.
     *
     * `.evaluate(locationPattern, x, y)` returns either `x({href, params})` or
     * `y({href, params})` if they are functions, `x` or `y` themselves otherwise.
     */
    evaluate<X = undefined, Y = undefined>(
        locationPattern: LocationPattern,
        matchOutput?: X | MatchHandler<X>,
        mismatchOutput?: Y | MatchHandler<Y>,
    ): X | Y | undefined {
        let matches = matchPattern(locationPattern, this.href);
        let payload = {href: this.href, params: matches || {}};

        if (matches === null)
            return typeof mismatchOutput === 'function'
                ? (mismatchOutput as MatchHandler<Y>)(payload)
                : mismatchOutput;

        return typeof matchOutput === 'function'
            ? (matchOutput as MatchHandler<X>)(payload)
            : matchOutput;
    }

    /**
     * Adds an entry to the browser's session history
     * (see [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
     * and dispatches a new location event.
     */
    assign(location: LocationString): void {
        this.dispatch(location, Transition.ASSIGN);
    }

    /**
     * Replaces the current history entry
     * (see [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
     * and dispatches a new location event.
     */
    replace(location: LocationString): void {
        this.dispatch(location, Transition.REPLACE);
    }

    /**
     * Re-dispatches the current location event.
     */
    reload(): void {
        this.dispatch();
    }

    back(): void {
        this.go(-1);
    }

    forward(): void {
        this.go(1);
    }

    /**
     * Returns the current location, equals `.href` with a fallback to an empty string.
     */
    toString(): string {
        return this.href || '';
    }
}
