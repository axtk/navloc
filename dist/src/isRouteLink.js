export const isRouteLink = (element) => {
    if (!element)
        return false;
    let { target, href } = element;
    if (href == null || (target && target !== '_self'))
        return false;
    try {
        return new URL(href, window.location.href).origin === window.location.origin;
    }
    catch (e) { }
};
