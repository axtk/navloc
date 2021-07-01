import { withIsomorphicURL } from '../lib/withIsomorphicURL';
const SYNTHETIC_ORIGIN = 'https://c.cc';
export const getPath = (location, pathProps = {}) => {
    return withIsomorphicURL(({ URL }) => {
        let url = location == null ?
            (typeof window === 'undefined' ? undefined : new URL(window.location.href)) :
            new URL(location, SYNTHETIC_ORIGIN);
        if (!url)
            return;
        return ((pathProps.pathname === false ? '' : url.pathname) +
            (pathProps.search === false ? '' : url.search) +
            (pathProps.hash === false ? '' : url.hash));
    });
};
