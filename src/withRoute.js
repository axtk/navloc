import route from './route';

export default (routePath, x) => route.matches(routePath) ? x : null;
