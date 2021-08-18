import type {
    Event as EventManagerEvent,
    EventPayload,
    EventListener,
    MatchParams,
} from '@axtk/event-manager';

export type RoutePattern = string | RegExp | Array<string | RegExp>;

export type RouteEvent<T extends EventPayload = {}> = Omit<EventManagerEvent<T>, 'type'> & {
    path: string | null;
};

export type RouteHandler = (payload?: RouteEvent) => void;
export type RouteListener = EventListener;
export type RoutePayload = EventPayload;

export type PathProps = {
    pathname?: boolean;
    search?: boolean;
    hash?: boolean;
};

export type RemoveRouteSubscription = () => void;

export type LinkProps = {
    href?: string | null;
    target?: string | null;
};
