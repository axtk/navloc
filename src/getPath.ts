import {withIsomorphicURL} from '../lib/withIsomorphicURL';
import type {PathProps} from './types';

const SYNTHETIC_ORIGIN = 'https://c.cc';

export const getPath = (
    location: string | null | undefined,
    pathProps: PathProps = {},
): string | undefined => {
    return withIsomorphicURL(({URL}) => {
        let url = location == null ?
            (typeof window === 'undefined' ? undefined : new URL(window.location.href)) :
            new URL(location, SYNTHETIC_ORIGIN);

        if (!url) return;

        return (
            (pathProps.pathname === false ? '' : url.pathname) +
            (pathProps.search === false ? '' : url.search) +
            (pathProps.hash === false ? '' : url.hash)
        );
    });
};
