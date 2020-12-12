import EventManager from 'event-manager';
import getFullPath from './getFullPath';
import route from './route';

class Router {
    constructor(props = {}) {
        this.baseRoute = props.baseRoute || '';

        this.eventManager = new EventManager({
            shouldCallListener: props.shouldCallListener || (
                (listener, event) => {
                    if (listener.type instanceof RegExp)
                        return listener.type.test(event.type);

                    return listener.type === event.type;
                }
            ),
            toHandlerPayload: props.toHandlerPayload || (
                (listener, event) => {
                    let params = listener.type instanceof RegExp ?
                        event.type.match(listener.type) || [] :
                        [];

                    return {params, path: event.type};
                }
            ),
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
