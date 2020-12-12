import EventManager from 'event-manager';
import getFullPath from './getFullPath';
import isNavigable from './isNavigable';

const Event = {
    ROUTE_CHANGE: 'ROUTE_CHANGE',
};

function isCollection(x) {
    return Array.isArray(x) || x instanceof NodeList || x instanceof HTMLCollection;
}

class Route {
    constructor() {
        this.eventManager = new EventManager();
        this.subscriptions = [];
        window.addEventListener('popstate', () => this.dispatchRoute());
    }
    dispatchRoute(path) {
        this.eventManager.dispatchEvent(Event.ROUTE_CHANGE, {
            path: path === undefined ? getFullPath() : path,
        });
    }
    subscribe(target) {
        let handler;

        if (!target)
            return;

        // array-like collection
        else if (isCollection(target)) {
            for (let t of target) this.subscribe(t);
        }

        // selector
        else if (typeof target === 'string')
            document.addEventListener('click', handler = event => {
                for (let t = event.target; t; t = t.parentNode) {
                    if (t.matches && t.matches(target) && isNavigable(t)) {
                        event.preventDefault();
                        this.dispatchRoute(getFullPath(t.href));
                    }
                }
            });

        else if (target instanceof HTMLElement)
            target.addEventListener('click', handler = event => {
                if (isNavigable(target)) {
                    event.preventDefault();
                    this.dispatchRoute(getFullPath(target.href));
                }
            });

        // Router
        else if (target.dispatchRoute)
            this.eventManager.addEventListener(Event.ROUTE_CHANGE, handler = event => {
                target.dispatchRoute(event.path);
            });

        if (handler)
            this.subscriptions.push({target, handler});
    }
    unsubscribe(target) {
        if (!target)
            return;

        if (isCollection(target)) {
            for (let t of target) this.unsubscribe(t);
            return;
        }

        for (let i = this.subscriptions.length - 1; i >= 0; i--) {
            let {target: t, handler: f} = this.subscriptions[i];

            if (t !== target)
                continue;

            if (typeof t === 'string')
                document.removeEventListener('click', f);

            else if (t instanceof HTMLElement)
                t.removeEventListener('click', f);

            else if (t.dispatchRoute)
                this.eventManager.removeEventListener(Event.ROUTE_CHANGE, f);

            this.subscriptions.splice(i, 1);
        }
    }
    assign(path) {
        history.pushState({}, '', path);
        this.dispatchRoute();
    }
    replace(path) {
        history.replaceState({}, '', path);
        this.dispatchRoute();
    }
    reload() {
        this.dispatchRoute();
    }
    toString() {
        return getFullPath();
    }
    go(delta) {
        history.go(delta);
    }
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
}

export default new Route();
