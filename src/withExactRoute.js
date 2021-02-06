import route from './route';

export default (routePath, x) => route.matches(routePath, true) ? x : null;
