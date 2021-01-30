export default (path, baseRoute) => {
    if (!baseRoute || !path)
        return path;

    let normalizedBaseRoute = baseRoute.replace(/\/$/, '');

    if (!path.startsWith(normalizedBaseRoute))
        return null;

    let subpath = path.substring(normalizedBaseRoute.length);

    if (subpath && !/^[\/\?#]/.test(subpath))
        return null;

    return (subpath.startsWith('/') ? '' : '/') + subpath;
};
