import route from './route';
import getFullPath from '../lib/getFullPath';

/**
 * Checks whether the current path matches the route pattern.
 * Returns `x` if it does, and `y` otherwise.
 *
 * If `x` is a function, it is invoked with a `{path, params}` object as an argument.
 * The same applies to `y`.
 *
 * @param {string | RegExp} routePath
 * @param {*} x
 * @param {*} y
 * @returns {*}
 */
export default (routePattern, x, y) => {
    let payload = route.toHandlerPayload({type: routePattern}, {type: getFullPath()});
    return route.matches(routePattern) ?
        (typeof x === 'function' ? x(payload) : x) :
        (typeof y === 'function' ? y(payload) : y);
};
