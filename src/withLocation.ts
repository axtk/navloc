import type {MatchParams} from 'evtm';
import type {Location} from './Location';
import type {LocationPattern} from './types';

export type MatchPayload = {
    path: string;
    params: MatchParams;
};

export type MatchHandler<T> = (payload?: MatchPayload) => T;

export const withLocation = (location: Location) => {
    return <X = undefined, Y = undefined>(
        locationPattern: LocationPattern,
        matchOutput?: X | MatchHandler<X>,
        unmatchOutput?: Y | MatchHandler<Y>,
    ): X | Y => {
        let matches = location.match(locationPattern);
        let payload = {path: location.href, params: matches || {}};

        return matches === null ?
            (typeof unmatchOutput === 'function' ? (unmatchOutput as MatchHandler<Y>)(payload) : unmatchOutput) :
            (typeof matchOutput === 'function' ? (matchOutput as MatchHandler<X>)(payload) : matchOutput);
    };
};
