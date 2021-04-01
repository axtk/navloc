import type {Route} from './Route';
import type {RoutePattern} from './types';

export interface MatchPayload {
    path: string;
    params: {
        [key: string]: string;
    };
}

export type MatchHandler<T> = (payload?: MatchPayload) => T;

export const withRoute = (route: Route) => {
    return <X = undefined, Y = undefined>(
        routePattern: RoutePattern,
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
