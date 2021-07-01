export const hasRouteLinkProps = ({ href, target }) => {
    if (href == null || (target && target !== '_self'))
        return false;
    try {
        return new URL(href, window.location.href).origin === window.location.origin;
    }
    catch (e) { }
};
