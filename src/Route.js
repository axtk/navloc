import EventManager from 'event-manager';
import getPath from '../lib/getPath';
import isNavigable from '../lib/isNavigable';

class Route extends EventManager {
    constructor() {
        super();

        this.href = getPath();
        this.subscriptions = [];

        if (typeof window !== 'undefined')
            window.addEventListener('popstate', () => this.dispatch());
    }
    /**
     * @param {string | string[] | RegExp | RegExp[]} routePattern
     * @param {function} handler
     * @returns {object} - A listener object with a `remove()` method that removes the subscription.
     */
    addListener(routePattern, handler) {
        if (Array.isArray(routePattern)) {
            let listeners = routePattern.map(r => super.addListener(r, handler));
            return {remove: () => listeners.forEach(listener => listener.remove())};
        }
        return super.addListener(routePattern, handler);
    }
    /**
     * Subscribes the handler to all route changes.
     * @param {function} handler
     * @returns {function} - A function that removes the subscription.
     */
    onChange(handler) {
        let listener = super.addListener('*', handler);
        return () => listener.remove();
    }
    /**
     * Checks whether the current path matches the specified route path(s) or route pattern(s).
     * @param {string | RegExp | string[] | RegExp[]} routePattern
     * @returns {boolean}
     */
    matches(routePattern) {
        if (Array.isArray(routePattern))
            return routePattern.some(r => this.matches(r));
        return this.shouldCallListener({type: routePattern}, {type: this.href});
    }
    toHandlerPayload(listener, event) {
        let {type, ...props} = super.toHandlerPayload(listener, event);
        return {...props, path: type};
    }
    dispatch(path) {
        this.href = path === undefined ? getPath() : path;
        super.dispatch(this.href);
    }
    /**
     * Subscribes HTML links to route changes in order to enable history navigation
     * without page reloading.
     *
     * The target can be a selector, or an HTML element, or a collection of HTML elements.
     *
     * @param {string | string[] | HTMLElement | HTMLElement[] | HTMLCollection | NodeList} target
     * @returns {function} - A function that removes the subscription.
     *
     * @example
     * ```js
     * // subscribing existing and future links
     * route.subscribe('a');
     * ```
     */
    subscribe(target) {
        if (typeof window === 'undefined')
            return () => {};

        let handler;

        // selector
        if (typeof target === 'string')
            document.addEventListener('click', handler = event => {
                for (let t = event.target; t; t = t.parentNode) {
                    if (t.matches && t.matches(target) && isNavigable(t)) {
                        event.preventDefault();
                        this.assign(getPath(t.href));
                    }
                }
            });

        else if (target instanceof HTMLElement)
            target.addEventListener('click', handler = event => {
                if (isNavigable(target)) {
                    event.preventDefault();
                    this.assign(getPath(target.href));
                }
            });

        else if (Array.isArray(target) || target instanceof NodeList || target instanceof HTMLCollection) {
            let unsubscribe = Array.from(target).map(t => this.subscribe(t));
            return () => unsubscribe.forEach(f => f());
        }

        if (!handler)
            return () => {};

        let id = Math.random().toString(36).slice(2);
        this.subscriptions.push({target, handler, id});

        return () => {
            for (let i = this.subscriptions.length - 1; i >= 0; i--) {
                if (this.subscriptions[i].id !== id)
                    continue;

                let {target, handler} = this.subscriptions[i];

                if (typeof target === 'string')
                    document.removeEventListener('click', handler);

                else if (target instanceof HTMLElement)
                    target.removeEventListener('click', handler);

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
        if (typeof history !== 'undefined') {
            history.pushState({}, '', path);
            this.dispatch();
        }
    }
    /**
     * Causes the navigation to the specified path without saving it to the browser history.
     * @see history.replaceState()
     * @see location.replace()
     */
    replace(path) {
        if (typeof history !== 'undefined') {
            history.replaceState({}, '', path);
            this.dispatch();
        }
    }
    /**
     * Re-sends the current path to subscribers (which includes existing Routers).
     * @see location.reload()
     */
    reload() {
        this.dispatch();
    }
    go(delta) {
        if (typeof history !== 'undefined') {
            history.go(delta);
            this.dispatch();
        }
    }
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
    getPath() {
        return this.href;
    }
    /**
     * Returns the current full path.
     * @see location.toString()
     */
    toString() {
        return this.href;
    }
}

export default Route;
