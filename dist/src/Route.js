import { EventManager, matchPattern, } from '@axtk/event-manager';
import { getPath } from './getPath';
import { isLinkElement } from './isLinkElement';
import { hasRouteLinkProps } from './hasRouteLinkProps';
export const DefaultPathProps = {
    pathname: true,
    search: false,
    hash: false,
};
const toRouteEvent = (event) => {
    const { type, ...eventProps } = event;
    return {
        ...eventProps,
        path: type == null || typeof type === 'object' ? null : String(type),
    };
};
export class Route {
    href;
    pathProps;
    eventManager;
    constructor(initialPath, pathProps) {
        this.pathProps = {
            ...DefaultPathProps,
            ...pathProps,
        };
        this.eventManager = new EventManager();
        this.dispatch(initialPath); // sets this.href
        if (typeof window !== 'undefined')
            window.addEventListener('popstate', () => this.dispatch());
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
    dispatch(path, payload) {
        this.href = getPath(path, this.pathProps);
        this.eventManager.dispatch(this.href, payload);
    }
    match(routePattern, path = this.href) {
        return matchPattern(routePattern, path);
    }
    /**
     * Subscribes HTML links to route changes in order to enable history navigation
     * without page reloading.
     *
     * The target can be a selector, or an HTML element, or a collection of HTML elements.
     *
     * @example
     * ```js
     * // subscribing existing and future links
     * route.subscribe('a');
     * ```
     */
    subscribe(target, scope = document, eventType = 'click') {
        if (typeof window === 'undefined')
            return () => { };
        let handler;
        // `target` is a selector
        if (typeof target === 'string') {
            scope.addEventListener(eventType, handler = (event) => {
                let element = event.target instanceof Element ? event.target.closest(target) : null;
                if (isLinkElement(element) && hasRouteLinkProps(element)) {
                    event.preventDefault();
                    this.assign(getPath(element.href));
                }
            });
            return () => {
                scope.removeEventListener(eventType, handler);
            };
        }
        else if (isLinkElement(target)) {
            target.addEventListener(eventType, handler = (event) => {
                if (hasRouteLinkProps(target)) {
                    event.preventDefault();
                    this.assign(getPath(target.href));
                }
            });
            return () => {
                target.removeEventListener(eventType, handler);
            };
        }
        else if (Array.isArray(target) || target instanceof NodeList || target instanceof HTMLCollection) {
            let unsubscriptions = Array.from(target).map(item => this.subscribe(item, scope, eventType));
            return () => {
                for (let unsubscribe of unsubscriptions)
                    unsubscribe();
            };
        }
        return () => { };
    }
    /**
     * Adds an entry to the browser's session history
     * (see [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
     * and dispatches a new path event.
     */
    assign(path) {
        if (typeof history !== 'undefined') {
            history.pushState({}, '', path);
            this.dispatch(path);
        }
    }
    /**
     * Replaces the current history entry
     * (see [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
     * and dispatches a new path event.
     */
    replace(path) {
        if (typeof history !== 'undefined') {
            history.replaceState({}, '', path);
            this.dispatch(path);
        }
    }
    /**
     * Re-dispatches the current path event.
     */
    reload() {
        this.dispatch();
    }
    /*
     * Jumps the specified number of history entries away from the current entry
     * (see [`history.go(delta)`](https://developer.mozilla.org/en-US/docs/Web/API/History/go)
     * and dispatches a new path event (within the `popstate` handler).
     */
    go(delta) {
        if (typeof history !== 'undefined')
            history.go(delta);
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
        return this.href;
    }
}
