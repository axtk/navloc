[![npm](https://img.shields.io/npm/v/@axtk/router?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/@axtk/router) [![GitHub](https://img.shields.io/badge/-GitHub-royalblue?labelColor=royalblue&color=royalblue&style=flat-square&logo=github)](https://github.com/axtk/router) ![browser](https://img.shields.io/badge/browser-✓-345?labelColor=345&color=345&style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-✓-345?labelColor=345&color=345&style=flat-square)

# @axtk/router

Core ideas:

- The route navigation interface might be similar to `window.location` (`route.href`, `route.assign()`, `route.replace()`).
- Routes might be handled as arbitrary plain strings, with their nestedness being irrelevant.
- Regular expressions might be sufficient to express pattern-wise route matching (especially with the advent of the named capturing groups) instead of pattern strings, reserving fixed strings for exact route matching.

## Usage

### Initialization

```js
// route.js
import {Route} from '@axtk/router';
export const route = new Route();
```

### Subscription to URL changes

Adding a handler of an exact URL path:

```js
import {route} from './route';

let routeListener = route.addListener('/home', ({href}) => {
    console.log(href);
});
```

of a specific URL path pattern:

```js
route.addListener(/^\/section\/(?<id>\d+)\/?$/, ({href, params}) => {
    console.log(href, params.id);
});
```

and removing a previously created route listener:

```js
routeListener.remove();
```

Tracking all route changes:

```js
let unsubscribe = route.onChange(({href}) => {
    console.log(href);
});
```

and unsubscribing from them:

```js
unsubscribe();
```

### Matching

Checking a route pattern (or an array thereof) if it matches the current path:

```js
// Provided that the current location is '/section/42':
route.match('/home'); // null
route.match('/section/42'); // {}
route.match(/^\/section\/(?<id>\d+)\/?$/); // {0: '42', id: '42'}
```

### Navigation

Getting the current location:

```js
console.log(route.href);
```

Changing the current location:

```js
// With the current location saved in the browser history
route.assign('/home');
```

```js
// Without saving the current location in the browser history
route.replace('/home');
```

Reloading the current location (by re-dispatching the current location event to the subscribers of `route`):

```js
route.reload();
```

Jumping to browser history entries:

```js
route.go(-2); // to go 2 entries back in the browser history
route.back(); // = route.go(-1);
route.forward(); // = route.go(+1);
```

### Modifying the behavior

The interaction of a `Route` instance with `window.history` or `window.location` is isolated in a couple of methods that can be overriden in descendant classes to apply custom routing behavior. These methods are: `init`, `transition`, `go`, `calcHref`.

For example: by default, a `Route` instance takes into account changes in the `pathname`, `search`, and `hash` portions of the URL combined. To make a `Route` instance disregard the URL `search` and `hash`, the `Route` class can be extended to redefine the `calcHref` method:

```js
import {Route, getPath} from '@axtk/router';

export class PathRoute extends Route {
    calcHref(location) {
        return getPath(location, {search: false, hash: false});
    }
}
```

## Also

- *[@axtk/react-router](https://github.com/axtk/react-router)*, an extension of *router* with React hooks
