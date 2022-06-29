[![npm](https://img.shields.io/npm/v/histloc?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/histloc) [![GitHub](https://img.shields.io/badge/-GitHub-royalblue?labelColor=royalblue&color=royalblue&style=flat-square&logo=github)](https://github.com/axtk/histloc) ![browser](https://img.shields.io/badge/browser-✓-345?labelColor=345&color=345&style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-✓-345?labelColor=345&color=345&style=flat-square)

# histloc

The `Location` class introduced in this package produces a browser history location object with an API similar to `window.location` (`.href`, `.assign()`, `.replace()`).

As an extension to the `window.location` interface, this class exposes methods for subscription to changes of the browser history and for pattern matching.

## Usage

### Initialization

```js
import {Location} from 'histloc';
export const location = new Location();
```

### Subscription to URL changes

Adding a handler of an exact URL path:

```js
// We are using the `location` instance declared above.
let locationListener = location.addListener('/home', ({href}) => {
    console.log(href);
});
```

of a specific URL path pattern:

```js
location.addListener(/^\/section\/(?<id>\d+)\/?$/, ({href, params}) => {
    console.log(href, params.id);
});
```

and removing a previously created location listener:

```js
locationListener.remove();
```

Tracking all location changes:

```js
let unsubscribe = location.onChange(({href}) => {
    console.log(href);
});
```

and unsubscribing from them:

```js
unsubscribe();
```

### Matching

Checking a location pattern (or an array thereof) if it matches the current path:

```js
// Provided that the current location is '/section/42':
location.match('/home'); // null
location.match('/section/42'); // {}
location.match(/^\/section\/(?<id>\d+)\/?$/); // {0: '42', id: '42'}

location.matches('/home'); // false
location.matches('/section/42'); // true
location.matches(/^\/section\/(?<id>\d+)\/?$/); // true
```

### Navigation

Getting the current location:

```js
console.log(location.href);
```

Changing the current location:

```js
// With the current location saved in the browser history
location.assign('/home');
```

```js
// Without saving the current location in the browser history
location.replace('/home');
```

Reloading the current location (by re-dispatching the current location event to the subscribers of the `location` instance):

```js
location.reload();
```

Jumping to browser history entries:

```js
location.go(-2); // to go 2 entries back in the browser history
location.back(); // = location.go(-1);
location.forward(); // = location.go(+1);
```

### Custom behavior

The interaction of a `Location` instance with `window.history` or `window.location` is isolated in a number of methods that can be overriden in descendant classes to apply custom behavior. These methods are: `initialize`, `transition`, `go`, `deriveHref`.

For example: By default, a `Location` instance derives its `href` from the `pathname`, `search`, and `hash` portions of the URL combined. To make a `Location` instance disregard the URL `search` and `hash`, the `Location` class can be extended to redefine the `deriveHref` method:

```js
import {Location, getPath} from 'histloc';

export class PathLocation extends Location {
    deriveHref(location) {
        return getPath(location, {search: false, hash: false});
    }
}
```
