import { IsomorphicURL } from '../lib/IsomorphicURL';
export const isSameOrigin = (url) => {
    try {
        return new IsomorphicURL(url, window.location.href).origin === window.location.origin;
    }
    catch (e) {
        return false;
    }
};
