import EventManager from '@axtk/event-manager';
import getPath from './lib/getPath';
import isNavigable from './lib/isNavigable';

class Route extends EventManager {
    /**
     * @param {string | null} [path] - Initial path. Default: from the global context.
     * @param {object} [pathProps] - Which path components should be taken into account.
     * @param {boolean} [pathProps.pathname=true]
     * @param {boolean} [pathProps.search=false]
     * @param {boolean} [pathProps.hash=false]
     */
    constructor(path, pathProps) {
        super();

        this.pathProps = {
            pathname: true,
            search: false,
            hash: false,
            ...pathProps,
        };

        this.dispatch(path); // sets this.href
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
    /**
     * Returns the second argument if the current path matches the specified route path(s)
     * or route pattern(s), and the third argument otherwise.
     *
     * If the second or the third argument is a function, it is invoked with a
     * `{path, params}` object as an argument.
     *
     * @param {string | RegExp | string[] | RegExp[]} routePattern
     * @param {*} [matchOutput=true]
     * @param {*} [unmatchOutput=false]
     * @returns {*}
     */
    match(routePattern, matchOutput = true, unmatchOutput = false) {
        let matched = false, matchEvent = {type: this.href}, payload;

        if (Array.isArray(routePattern)) {
            for (let i = 0; i < routePattern.length && !matched; i++) {
                if ((matched |= this.matches(routePattern[i])))
                    payload = this.toHandlerPayload({type: routePattern[i]}, matchEvent);
            }
        }
        else {
            matched = this.matches(routePattern);
            payload = this.toHandlerPayload({type: routePattern}, matchEvent);
        }

        return matched ?
            (typeof matchOutput === 'function' ? matchOutput(payload) : matchOutput) :
            (typeof unmatchOutput === 'function' ? unmatchOutput(payload) : unmatchOutput);
    }
    toHandlerPayload(listener, event) {
        let {type, ...props} = super.toHandlerPayload(listener, event);
        return {...props, path: type};
    }
    /**
     * Dispatches a path event.
     * @param {string} [path] - Default: the current path.
     */
    dispatch(path) {
        this.href = getPath(path, this.pathProps);
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

        // `target` is a selector
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
     * Adds an entry to the browser's session history
     * (see [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
     * and dispatches a new path event.
     */
    assign(path) {
        if (typeof history !== 'undefined') {
            history.pushState({}, '', path);
            this.dispatch();
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
            this.dispatch();
        }
    }
    /**
     * Re-dispatches the current path event.
     */
    reload() {
        this.dispatch();
    }
    /*
     * Loads a specific page from the session history
     * (see [`history.go(delta)`](https://developer.mozilla.org/en-US/docs/Web/API/History/go)
     * and dispatches a new path event.
     * @param {number} delta - A number of history entries to jump away from the current entry.
     */
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
    /**
     * Returns the current full path, same as `.href`.
     */
    toString() {
        return this.href;
    }
}

export default Route;
