// for the given `Route` class instance,
// returns a ternary function which resolves to `x` if `routePattern`
// matches the current route, and `y` otherwise;
// if `x` (or `y`) is a function it's invoked with `{path, params}`
// as an argument
export default route => (routePattern, x, y) => {
    let payload = route.toHandlerPayload({type: routePattern}, {type: route.href});
    return route.matches(routePattern) ?
        (typeof x === 'function' ? x(payload) : x) :
        (typeof y === 'function' ? y(payload) : y);
};
