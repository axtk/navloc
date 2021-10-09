import {
    EventManager,
    Event as EventManagerEvent,
    matchPattern,
    MatchParams,
} from '@axtk/event-manager';
import {getPath} from './getPath';
import {isSameOrigin} from './isSameOrigin';
import {Transition, TransitionType} from './Transition';
import {
    RoutePattern,
    RouteEvent,
    RouteHandler,
    RouteListener,
    LocationString,
} from './types';

const toRouteEvent = (event: EventManagerEvent): RouteEvent => {
    const {type, ...eventProps} = event;
    return {
        ...eventProps,
        href: type == null || typeof type === 'object' ? null : String(type),
    };
}

export class Route {
    href: LocationString;
    eventManager: EventManager;

    constructor(location?: LocationString) {
        this.href = this.calcHref(location);
        this.eventManager = new EventManager();
        this.init();
    }
    init(): void {
        if (typeof window !== 'undefined')
            window.addEventListener('popstate', () => this.dispatch());
    }
    /**
     * Performs the route change.
     * It can be overridden to apply custom behavior. Returning `false` in certain cases
     * will prevent the Route instance from updating its `href` and notifying its listeners.
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
     * and dispatches a new route event (within the `popstate` event handler added in `init()`).
     */
    go(delta: number): void {
        if (typeof window !== 'undefined' && window.history)
            window.history.go(delta);
    }
    calcHref(location?: LocationString): LocationString {
        return getPath(location);
    }
    onChange(handler: RouteHandler): () => void {
        let listener = this.eventManager.addListener('*', event => {
            handler(toRouteEvent(event));
        });
        return () => listener.remove();
    }
    addListener(routePattern: RoutePattern, handler: RouteHandler): RouteListener {
        return this.eventManager.addListener(routePattern, event => {
            handler(toRouteEvent(event));
        });
    }
    dispatch(location?: LocationString, transitionType?: TransitionType): void {
        if (this.transition(location, transitionType) !== false) {
            this.href = this.calcHref(location);
            this.eventManager.dispatch(this.href);
        }
    }
    match(routePattern: RoutePattern, location: LocationString = this.href): MatchParams | null {
        return matchPattern(routePattern, location);
    }
    /**
     * Adds an entry to the browser's session history
     * (see [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
     * and dispatches a new route event.
     */
    assign(location: LocationString): void {
        this.dispatch(location, Transition.ASSIGN);
    }
    /**
     * Replaces the current history entry
     * (see [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
     * and dispatches a new route event.
     */
    replace(location: LocationString): void {
        this.dispatch(location, Transition.REPLACE);
    }
    /**
     * Re-dispatches the current route event.
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
