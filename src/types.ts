import type {
    Event as EventManagerEvent,
    EventPayload,
    EventListener,
} from '@axtk/event-manager';

export type RoutePattern = string | RegExp | Array<string | RegExp>;

export type RouteEvent<T extends EventPayload = {}> = Omit<EventManagerEvent<T>, 'type'> & {
    href: string | null;
};

export type RouteHandler = (event?: RouteEvent) => void;
export type RouteListener = EventListener;

export type PathProps = {
    pathname?: boolean;
    search?: boolean;
    hash?: boolean;
};

export type LocationString = string | null | undefined;
