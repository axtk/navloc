import EventManager from 'event-manager';
import getFullPath from '../lib/getFullPath';
import getRoute from '../lib/getRoute';
import getPath from '../lib/getPath';
import route from './route';

class Router extends EventManager {
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
    addListener(routePattern, handler) {
        if (Array.isArray(routePattern))
            return routePattern.map(r => super.addListener(r, handler));
        return super.addListener(routePattern, handler);
    }
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
    getRoute(path = getFullPath()) {
        return getRoute(path, this.baseRoute);
    }
    getPath(route) {
        return getPath(route, this.baseRoute);
    }
    matches(path) {
        return getRoute(path, this.baseRoute) != null;
    }
}

export default Router;
