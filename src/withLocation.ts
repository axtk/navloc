import type {MatchParams} from 'evtm';
import type {Location} from './Location';
import type {LocationPattern} from './types';

export type MatchPayload = {
    path: string;
    params: MatchParams;
};

export type MatchHandler<T> = (payload?: MatchPayload) => T;

export const withLocation = (route: Location) => {
    return <X = undefined, Y = undefined>(
        routePattern: LocationPattern,
        matchOutput?: X | MatchHandler<X>,
        unmatchOutput?: Y | MatchHandler<Y>,
    ): X | Y => {
        let matches = route.match(routePattern);
        let payload = {path: route.href, params: matches || {}};

        return matches === null ?
            (typeof unmatchOutput === 'function' ? (unmatchOutput as MatchHandler<Y>)(payload) : unmatchOutput) :
            (typeof matchOutput === 'function' ? (matchOutput as MatchHandler<X>)(payload) : matchOutput);
    };
};
