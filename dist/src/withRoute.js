export const withRoute = (route) => {
    return (routePattern, matchOutput, unmatchOutput) => {
        let matches = route.match(routePattern);
        let payload = { path: route.href, params: matches || {} };
        return matches === null ?
            (typeof unmatchOutput === 'function' ? unmatchOutput(payload) : unmatchOutput) :
            (typeof matchOutput === 'function' ? matchOutput(payload) : matchOutput);
    };
};
