export default x => {
    try {
        let url;

        if (!x)
            url = new URL(window.location.href);
        else if (x.href !== undefined)
            url = new URL(x.href);
        else
            url = new URL(x, window.location.origin);

        let {pathname, search, hash} = url;
        return pathname + search + hash;
    }
    catch(e) {}
};
