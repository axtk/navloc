export const withIsomorphicURL = (callback) => {
    try {
        return callback(
        // for Node prior to v10.0 without URL in the global scope
        // @ts-ignore: require without type definition
        typeof URL === 'undefined' && typeof require !== 'undefined' ? require('url') : { URL, URLSearchParams });
    }
    catch (e) { }
};
