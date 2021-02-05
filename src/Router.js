import EventManager from 'event-manager';
import getFullPath from '../lib/getFullPath';
import getRoute from '../lib/getRoute';
import getPath from '../lib/getPath';
import route from './route';

class Router extends EventManager {
    /**
     * @param {object} props
     * @param {string} props.baseRoute - A path prefix for all paths handled on this router.
     */
    constructor(props = {}) {
        super();
        this.setBaseRoute(props.baseRoute);
        route.subscribe(this);
    }
    shouldCallListener(listener, event) {
        let routePattern = listener.type, route = event.type;
        return routePattern instanceof RegExp ? routePattern.test(route) : routePattern === route;
    }
    toHandlerPayload(listener, event) {
        let routePattern = listener.type, route = event.type;
        let params = routePattern instanceof RegExp ? route.match(routePattern) || [] : [];
        return {params, route, path: event.path};
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
     * If the handler is not specified, all subscriptions to the specified route pattern(s) are removed.
     * @param {string | string[] | RegExp | RegExp[]} routePattern
     * @param {function} handler
     */
    removeListener(routePattern, handler) {
        if (Array.isArray(routePattern))
            return routePattern.forEach(r => super.removeListener(r, handler));
        return super.removeListener(routePattern, handler);
    }
    setBaseRoute(baseRoute) {
        this.baseRoute = baseRoute;
    }
    dispatch(path) {
        let route = this.getRoute(path);
        return route == null ? undefined : super.dispatch(route, {path});
    }
    matches(path) {
        return getRoute(path, this.baseRoute) != null;
    }
    getRoute(path = getFullPath()) {
        return getRoute(path, this.baseRoute);
    }
    getPath(route) {
        return getPath(route, this.baseRoute);
    }
}

export default Router;
