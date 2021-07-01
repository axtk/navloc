import type {DispatchedEvent, Event as EventManagerEvent, EventParams, Listener} from '@axtk/event-manager';

export type RoutePattern = string | RegExp | Array<string | RegExp>;
export type RouteEvent<P> = Omit<EventManagerEvent<string, P>, 'type' | 'params'> & {path: string, params: EventParams};
export type RouteHandler<P> = (payload?: RouteEvent<P>) => void;
export type RouteListener<P> = Omit<Listener<RoutePattern, P>, 'handler'> & {handler: RouteHandler<P>};

export type PathProps = {
    pathname?: boolean;
    search?: boolean;
    hash?: boolean;
}

export type RouteSubscription = {
    id: string;
    eventType: string;
    target: string | Node;
    scope: HTMLElement | Document;
    handler: (e: Event) => void;
}

export type RemoveRouteSubscription = () => void;

export type AbstractLink = {
    href?: string | null;
    target?: string;
}
