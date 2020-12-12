import EventManager from 'event-manager';
import getFullPath from './getFullPath';
import route from './route';

class Router {
    constructor(props = {}) {
        this.baseRoute = props.baseRoute || '';

        this.eventManager = new EventManager({
            shouldCallListener: (listener, event) => {
                let routePattern = listener.type, path = event.type;

                if (props.shouldCallListener)
                    return props.shouldCallListener.call(this, routePattern, path);

                return routePattern instanceof RegExp ?
                    routePattern.test(path) :
                    routePattern === path;
            },
            toHandlerPayload: (listener, event) => {
                let routePattern = listener.type, path = event.type;

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
