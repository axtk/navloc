import {IsomorphicURL} from '../lib/IsomorphicURL';
import type {LocationString, PathProps} from './types';

const SYNTHETIC_ORIGIN = 'https://c.cc';

export const getPath = (
    location: LocationString,
    pathProps: PathProps = {},
): LocationString => {
    let url = location == null ?
        (typeof window === 'undefined' ? undefined : new IsomorphicURL(window.location.href)) :
        new IsomorphicURL(location, SYNTHETIC_ORIGIN);

    if (!url) return;

    return (
        (pathProps.pathname === false ? '' : url.pathname) +
        (pathProps.search === false ? '' : url.search) +
        (pathProps.hash === false ? '' : url.hash)
    );
};
