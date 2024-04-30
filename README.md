[![npm](https://img.shields.io/npm/v/navloc?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/navloc) [![GitHub](https://img.shields.io/badge/-GitHub-royalblue?labelColor=royalblue&color=royalblue&style=flat-square&logo=github)](https://github.com/axtk/navloc) ![browser](https://img.shields.io/badge/browser-✓-345?labelColor=345&color=345&style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-✓-345?labelColor=345&color=345&style=flat-square)

# navloc

The `NavigationLocation` class introduced in this package produces a browser history location object with an API similar to `window.location` (`.href`, `.assign()`, `.replace()`).

As an extension to the `window.location` interface, this class exposes methods for subscription to changes of the browser history and for pattern matching.

## Usage

### Initialization

```js
import { NavigationLocation } from 'navloc';
export const location = new NavigationLocation();
```

### Subscription to URL changes

Adding a handler of an exact URL path:

```js
// We are using the `location` instance declared above.
let locationListener = location.addListener('/home', ({ href }) => {
    console.log(href);
});
```

of a specific URL path pattern:

```js
location.addListener(/^\/section\/(?<id>\d+)\/?$/, ({ href, params }) => {
    console.log(href, params.id);
});
```

and removing a previously created location listener:

```js
locationListener.remove();
```

Tracking all location changes:

```js
let unsubscribe = location.onChange(({ href }) => {
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
// Provided that the current location is '/item/42':
location.match('/home'); // null
location.match('/item/42'); // {}
location.match(/^\/item\/(?<id>\d+)\/?$/); // { 0: '42', id: '42' }

location.matches('/home'); // false
location.matches('/item/42'); // true
location.matches(/^\/item\/(?<id>\d+)\/?$/); // true
```

The `evaluate()` method works much like the conditional ternary operator (`condition ? x : y`): if the current location matches the given location pattern its returned value is based on the second parameter and falls back to the third parameter otherwise.

```js
// Provided that the current location is '/item/42':
location.evaluate('/home', 1, 0); // 0
location.evaluate('/item/42', 'a', 'b'); // 'a'
location.evaluate(/^\/item\/(?<id>\d+)\/?$/, 5); // 5

// If the second or the third parameter is a function it will be
// called with `{ href, params }` as its parameter.
location.evaluate('/home', () => 1, ({ href }) => href); // '/item/42'
location.evaluate(/^\/item\/(?<id>\d+)\/?$/, ({ params }) => params.id);
// 42
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

The interaction of a `NavigationLocation` instance with `window.history` or `window.location` is isolated in a number of methods that can be overriden in descendant classes to apply custom behavior. These methods are: `initialize()`, `transition()`, `go()`, `deriveHref()`.

By default, a `NavigationLocation` instance derives its `href` from the `pathname`, `search`, and `hash` portions of the URL combined. To make a `NavigationLocation` instance disregard the URL `search` and `hash`, the `NavigationLocation` class can be extended to redefine the `deriveHref()` method:

```js
import { NavigationLocation, getPath } from 'navloc';

export class PathLocation extends NavigationLocation {
    deriveHref(location) {
        return getPath(location, { search: false, hash: false });
    }
}
```
