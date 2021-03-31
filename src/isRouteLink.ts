import type {HTMLLinkLikeElement} from './types';

interface AbstractLink {
    href?: string | null;
    target?: string;
}

export const isRouteLink = (element: AbstractLink | Node): boolean => {
    if (!element)
        return false;

    let {target, href} = element as AbstractLink | HTMLLinkLikeElement;

    if (href == null || (target && target !== '_self'))
        return false;

    try {
        let {origin} = window.location;
        return new URL(href, origin).origin === origin;
    }
    catch(e) {}
};
