import {PathProps} from './types';

const SYNTHETIC_ORIGIN = 'https://c.cc';

export const getPath = (
    location: string | null | undefined,
    pathProps: PathProps = {},
): string | undefined => {
    try {
        return (URL => {
            let url = location == null ?
                (typeof window === 'undefined' ? undefined : new URL(window.location.href)) :
                new URL(location, SYNTHETIC_ORIGIN);

            if (!url) return;

            return (
                (pathProps.pathname === false ? '' : url.pathname) +
                (pathProps.search === false ? '' : url.search) +
                (pathProps.hash === false ? '' : url.hash)
            );
        })(
            // for Node prior to v10.0 without URL in the global scope
            // @ts-ignore: require without type definition
            typeof URL === 'undefined' && typeof require !== 'undefined' ? require('url').URL : URL
        );
    }
    catch(e) {}
};
