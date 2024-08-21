import {IsomorphicURL} from '../lib/IsomorphicURL';
import {syntheticOrigin} from '../lib/syntheticOrigin';
import type {LocationString, PathProps} from './types';

export const getPath = (
    location: LocationString,
    pathProps: PathProps = {},
): LocationString => {
    let url = location === undefined || location === null
        ? typeof window === 'undefined' ? undefined : new IsomorphicURL(window.location.href)
        : new IsomorphicURL(location, syntheticOrigin);

    if (!url) return;

    return (
        (pathProps.pathname === false ? '' : url.pathname) +
        (pathProps.search === false ? '' : url.search) +
        (pathProps.hash === false ? '' : url.hash)
    );
};
