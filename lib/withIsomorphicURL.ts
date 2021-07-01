type URLUtils = {
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
}

export const withIsomorphicURL = <T>(callback: (url: URLUtils) => T): T => {
    try {
        return callback(
            // for Node prior to v10.0 without URL in the global scope
            // @ts-ignore: require without type definition
            typeof URL === 'undefined' && typeof require !== 'undefined' ? require('url') : {URL, URLSearchParams}
        );
    }
    catch(e) {}
};
