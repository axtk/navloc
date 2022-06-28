import type {
    Event as EventManagerEvent,
    EventListener,
} from 'evtm';

export type LocationPattern = string | RegExp | Array<string | RegExp>;

export type LocationEvent<T = unknown> = Omit<EventManagerEvent<T>, 'type'> & {
    href: string | null;
};

export type LocationEventHandler = (event?: LocationEvent) => void;
export type LocationListener = EventListener;

export type PathProps = {
    pathname?: boolean;
    search?: boolean;
    hash?: boolean;
};

export type LocationString = string | null | undefined;
