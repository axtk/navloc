import EventManager from 'event-manager';
import getFullPath from '../lib/getFullPath';
import getRoute from '../lib/getRoute';
import isNavigable from '../lib/isNavigable';
import isCollection from '../lib/isCollection';
import Event from '../lib/Event';

class Route {
    constructor() {
        this.eventManager = new EventManager();
        this.subscriptions = [];

        window.addEventListener('popstate', () => this.dispatch());
    }
    dispatch(path = getFullPath()) {
        this.eventManager.dispatch(Event.ROUTE_CHANGE, {path});
    }
    /**
     * Subscribes the handler to all route changes.
     * @param {function} handler
     * @returns {function} - A function that removes the subscription.
     */
    onChange(handler) {
        let listener = this.eventManager.addListener(Event.ROUTE_CHANGE, handler);
        return () => listener.remove();
    }
    /**
     * Checks whether the current path matches the specified route path or route pattern.
     * @param {string | RegExp | (string | RegExp)[]} routePath
     * @param {boolean} [exact]
     * @returns {boolean}
     */
    matches(routePath, exact) {
        if (Array.isArray(routePath))
            return routePath.some(r => this.matches(r, exact));

        let currentPath = getFullPath();

        if (exact)
            return currentPath === routePath;

        if (routePath instanceof RegExp)
            return routePath.test(currentPath);

        return getRoute(currentPath, routePath) != null;
    }
    /**
     * Subscribes (mostly) links to route changes in order to enable history navigation
     * without page reloading.
     *
     * The target can be a selector, or an HTML element, or a collection of HTML elements,
     * or an EventManager instance.
     *
     * @param {string | string[] | HTMLElement | HTMLElement[] | HTMLCollection | NodeList | EventManager} target
     * @returns {function} - A function that removes the subscription.
     *
     * @example
     * ```js
     * // subscribing existing and future links
     * route.subscribe('a');
     * ```
     */
    subscribe(target) {
        let handler;

        // array-like collection
        if (isCollection(target)) {
            let unsubscribe = Array.from(target).map(t => this.subscribe(t));
            return () => unsubscribe.forEach(f => f());
        }

        // selector
        else if (typeof target === 'string')
            document.addEventListener('click', handler = event => {
                for (let t = event.target; t; t = t.parentNode) {
                    if (t.matches && t.matches(target) && isNavigable(t)) {
                        event.preventDefault();
                        this.assign(getFullPath(t));
                    }
                }
            });

        else if (target instanceof HTMLElement)
            target.addEventListener('click', handler = event => {
                if (isNavigable(target)) {
                    event.preventDefault();
                    this.assign(getFullPath(target));
                }
            });

        // routers and other event managers
        else if (target instanceof EventManager)
            this.eventManager.addListener(Event.ROUTE_CHANGE, handler = event => {
                target.dispatch(event.path);
            });

        if (!handler)
            return () => {};

        let id = Math.random().toString(36).slice(2);
        this.subscriptions.push({target, handler, id});

        return () => {
            for (let i = this.subscriptions.length - 1; i >= 0; i--) {
                if (this.subscriptions[i].id !== id)
                    continue;

                let {target: t, handler: f} = this.subscriptions[i];

                if (typeof t === 'string')
                    document.removeEventListener('click', f);

                else if (t instanceof HTMLElement)
                    t.removeEventListener('click', f);

                else if (t instanceof EventManager)
                    this.eventManager.removeListener(Event.ROUTE_CHANGE, f);

                this.subscriptions.slice(i, 1);
            }
        };
    }
    /**
     * Causes the navigation to the specified path and saves it to the browser history.
     * @see history.pushState()
     * @see location.assign()
     */
    assign(path) {
        history.pushState({}, '', path);
        this.dispatch();
    }
    /**
     * Causes the navigation to the specified path without saving it to the browser history.
     * @see history.replaceState()
     * @see location.replace()
     */
    replace(path) {
        history.replaceState({}, '', path);
        this.dispatch();
    }
    /**
     * Re-sends the current path to subscribers (which includes existing Routers).
     * @see location.reload()
     */
    reload() {
        this.dispatch();
    }
    /**
     * Returns the current full path.
     * @see location.toString()
     */
    toString() {
        return getFullPath();
    }
    go(delta) {
        history.go(delta);
    }
    back() {
        history.go(-1);
    }
    forward() {
        history.go(1);
    }
}

export default new Route();
