import {
    EventManager,
    Event as EventManagerEvent,
    matchPattern,
    MatchParams,
} from 'evtm';
import {getPath} from './getPath';
import {isSameOrigin} from './isSameOrigin';
import {Transition, TransitionType} from './Transition';
import {
    LocationPattern,
    LocationEvent,
    LocationEventHandler,
    LocationListener,
    LocationString,
    MatchHandler,
} from './types';

const toLocationEvent = (event: EventManagerEvent): LocationEvent => {
    const {type, ...eventProps} = event;
    return {
        ...eventProps,
        href: type == null || typeof type === 'object' ? null : String(type),
    };
}

export class Location {
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
        if (typeof window === 'undefined' || nextLocation == null || type == null)
            return;

        if (!window.history || !isSameOrigin(nextLocation)) {
            switch (type) {
                case Transition.ASSIGN:
                    window.location.assign(nextLocation);
                    return;
                case Transition.REPLACE:
                    window.location.replace(nextLocation);
                    return;
            }
        }

        switch (type) {
            case Transition.ASSIGN:
                window.history.pushState({}, '', nextLocation);
                return;
            case Transition.REPLACE:
                window.history.replaceState({}, '', nextLocation);
                return;
        }
    }
    /*
     * Jumps the specified number of history entries away from the current entry
     * (see [`history.go(delta)`](https://developer.mozilla.org/en-US/docs/Web/API/History/go)
     * and dispatches a new location event (within the `popstate` event handler added in `initialize()`).
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
     * is based on the second argument, otherwise on the third argument.
     *
     * `.evaluate(locationPattern, x, y)` returns either `x({path, params})` or
     * `y({path, params})` if they are functions, `x` or `y` themselves otherwise.
     */
    evaluate<X = undefined, Y = undefined>(
        locationPattern: LocationPattern,
        matchOutput?: X | MatchHandler<X>,
        mismatchOutput?: Y | MatchHandler<Y>,
    ): X | Y {
        let matches = matchPattern(locationPattern, this.href);
        let payload = {path: this.href, params: matches || {}};

        return matches === null ?
            (typeof mismatchOutput === 'function' ? (mismatchOutput as MatchHandler<Y>)(payload) : mismatchOutput) :
            (typeof matchOutput === 'function' ? (matchOutput as MatchHandler<X>)(payload) : matchOutput);
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
     * Returns the current full path, same as `.href`.
     */
    toString(): string {
        return this.href || '';
    }
}
