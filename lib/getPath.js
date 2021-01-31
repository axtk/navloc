import toPath from './toPath';

export default (route, baseRoute) => {
    let base = toPath(baseRoute).replace(/\/$/, '');
    let normalizedRoute = toPath(route).replace(/^\//, '');

    return base + (normalizedRoute ? '/' + normalizedRoute : '') || '/';
};
