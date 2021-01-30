import EventManager from 'event-manager';
import getFullPath from '../lib/getFullPath';
import getSubpath from '../lib/getSubpath';
import route from './route';

class Router extends EventManager {
    constructor(props = {}) {
        super();
        this.setBaseRoute(props.baseRoute);
        route.subscribe(this);
    }
    shouldCallListener(listener, event) {
        let routePattern = listener.type, path = event.type;
        return routePattern instanceof RegExp ? routePattern.test(path) : routePattern === path;
    }
    toHandlerPayload(listener, event) {
        let routePattern = listener.type, path = event.type;
        let params = routePattern instanceof RegExp ? path.match(routePattern) || [] : [];
        return {params, path};
    }
    setBaseRoute(baseRoute) {
        this.baseRoute = baseRoute;
    }
    dispatch(path) {
        let route = this.getRoute(path);
        return route == null ? undefined : super.dispatch(route);
    }
    getRoute(path = getFullPath()) {
        return getSubpath(path, this.baseRoute);
    }
    matches(path) {
        return getSubpath(path, this.baseRoute) != null;
    }
}

export default Router;
