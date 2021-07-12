export const withIsomorphicURL = (callback) => {
    return callback(
    // for Node prior to v10.0 without URL in the global scope
    // @ts-ignore: require without type definition
    typeof URL === 'undefined' && typeof require === 'function' ? require('url') : { URL, URLSearchParams });
};
