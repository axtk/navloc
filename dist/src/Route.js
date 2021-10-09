import { EventManager, matchPattern, } from '@axtk/event-manager';
import { getPath } from './getPath';
import { isSameOrigin } from './isSameOrigin';
import { Transition } from './Transition';
const toRouteEvent = (event) => {
    const { type, ...eventProps } = event;
    return {
        ...eventProps,
        href: type == null || typeof type === 'object' ? null : String(type),
    };
};
export class Route {
    href;
    eventManager;
    constructor(location) {
        this.href = this.calcHref(location);
        this.eventManager = new EventManager();
        this.init();
    }
    init() {
        if (typeof window !== 'undefined')
            window.addEventListener('popstate', () => this.dispatch());
    }
    /**
     * Performs the route change.
     * It can be overridden to apply custom behavior. Returning `false` in certain cases
     * will prevent the Route instance from updating its `href` and notifying its listeners.
     */
    transition(nextLocation, type) {
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
    go(delta) {
        if (typeof window !== 'undefined' && window.history)
            window.history.go(delta);
    }
    calcHref(location) {
        return getPath(location);
    }
    onChange(handler) {
        let listener = this.eventManager.addListener('*', event => {
            handler(toRouteEvent(event));
        });
        return () => listener.remove();
    }
    addListener(routePattern, handler) {
        return this.eventManager.addListener(routePattern, event => {
            handler(toRouteEvent(event));
        });
    }
    dispatch(location, transitionType) {
        if (this.transition(location, transitionType) !== false) {
            this.href = this.calcHref(location);
            this.eventManager.dispatch(this.href);
        }
    }
    match(routePattern, location = this.href) {
        return matchPattern(routePattern, location);
    }
    /**
     * Adds an entry to the browser's session history
     * (see [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
     * and dispatches a new route event.
     */
    assign(location) {
        this.dispatch(location, Transition.ASSIGN);
    }
    /**
     * Replaces the current history entry
     * (see [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
     * and dispatches a new route event.
     */
    replace(location) {
        this.dispatch(location, Transition.REPLACE);
    }
    /**
     * Re-dispatches the current route event.
     */
    reload() {
        this.dispatch();
    }
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
    /**
     * Returns the current full path, same as `.href`.
     */
    toString() {
        return this.href || '';
    }
}
