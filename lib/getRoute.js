import toPath from './toPath';

export default (path, baseRoute) => {
    let base = toPath(baseRoute);
    let normalizedPath = toPath(path);

    if (base[base.length - 1] === '/')
        base = base.slice(0, -1);

    if (!normalizedPath.startsWith(base))
        return null;

    let route = normalizedPath.substring(base.length);

    if (route === '')
        return '/';

    return route[0] === '/' ? route : null;
};
