const SYNTHETIC_ORIGIN = 'https://c.cc';

export default (location, pathProps = {}) => {
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
            typeof URL === 'undefined' && typeof require !== 'undefined' ?
                // for Node prior to v10.0 without URL in the global scope
                require('url').URL :
                URL
        );
    }
    catch(e) {}
};
