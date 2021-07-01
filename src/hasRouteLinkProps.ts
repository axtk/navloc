import type {LinkProps} from './types';

export const hasRouteLinkProps = ({href, target}: LinkProps): boolean => {
    if (href == null || (target && target !== '_self'))
        return false;

    try {
        return new URL(href, window.location.href).origin === window.location.origin;
    }
    catch(e) {}
};
