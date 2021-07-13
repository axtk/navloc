import { IsomorphicURL } from '../lib/IsomorphicURL';
export const hasRouteLinkProps = ({ href, target }) => {
    if (href == null || (target && target !== '_self'))
        return false;
    try {
        return new IsomorphicURL(href, window.location.href).origin === window.location.origin;
    }
    catch (e) { }
};
