const SYNTHETIC_ORIGIN = 'https://c.cc';

export default location => {
    try {
        let {pathname, search, hash} = location == null ?
            new URL(window.location.href) :
            new URL(location, SYNTHETIC_ORIGIN);

        return pathname + search + hash;
    }
    catch(e) {}
};
