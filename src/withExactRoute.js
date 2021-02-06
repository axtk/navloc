import route from './route';

/**
 * @param {string | RegExp} routePath
 * @param {*} x
 * @returns {*}
 */
export default (routePath, x) => route.matches(routePath, true) ? x : null;
