import EventManager from 'event-manager';
import getFullPath from './getFullPath';
import route from './route';

class Router {
    constructor(props = {}) {
        this.setBaseRoute(props.baseRoute);

        this.eventManager = new EventManager({
            shouldCallListener: (listener, event) => {
                if (!this.matchesBaseRoute(event.type))
                    return false;

                let routePattern = listener.type;
                let path = this.truncateBaseRoute(event.type);

                if (props.shouldCallListener)
                    return props.shouldCallListener.call(this, routePattern, path);

                return routePattern instanceof RegExp ?
                    routePattern.test(path) :
                    routePattern === path;
            },
            toHandlerPayload: (listener, event) => {
                let routePattern = listener.type;
                let path = this.truncateBaseRoute(event.type);

                if (props.toHandlerPayload)
                    return props.toHandlerPayload.call(this, routePattern, path);

                let params = routePattern instanceof RegExp ?
                    path.match(routePattern) || [] :
                    [];

                return {params, path};
            },
        });

        route.subscribe(this);
    }
    setBaseRoute(baseRoute) {
        this.baseRoute = (baseRoute || '').replace(/\/$/, '');
    }
    matchesBaseRoute(path) {
        const {baseRoute} = this;

        return !baseRoute || path === baseRoute ||
            (path && ['/', '?', '#'].some(c => path.startsWith(baseRoute + c)));
    }
    truncateBaseRoute(path) {
        const {baseRoute} = this;

        if (!path || !baseRoute || !path.startsWith(baseRoute))
            return path;

        return path.slice(baseRoute.length);
    }
    addRouteListener(routePattern, handler) {
        return this.eventManager.addEventListener(routePattern, handler);
    }
    removeRouteListener(routePattern, handler) {
        return this.eventManager.removeEventListener(routePattern, handler);
    }
    dispatchRoute(path) {
        return this.eventManager.dispatchEvent(path === undefined ? getFullPath() : path);
    }
}

export default Router;
