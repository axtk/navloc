export default element => {
    if (!element)
        return false;

    let {target, href} = element;

    if (href == null || (target && target !== '_self'))
        return false;

    try {
        let {origin} = window.location;
        return new URL(href, origin).origin === origin;
    }
    catch(e) {}
};
