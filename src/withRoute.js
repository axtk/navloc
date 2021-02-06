import route from './route';

/**
 * @param {string | RegExp | (string | RegExp)[]} routePath
 * @param {*} x
 * @param {*} y
 * @returns {*}
 */
export default (routePath, x, y) => route.matches(routePath) ? x : y;
