[![npm](https://img.shields.io/npm/v/@axtk/router?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/@axtk/router) [![GitHub](https://img.shields.io/badge/-GitHub-royalblue?labelColor=royalblue&color=royalblue&style=flat-square&logo=github)](https://github.com/axtk/router) ![browser](https://img.shields.io/badge/browser-✓-345?labelColor=345&color=345&style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-✓-345?labelColor=345&color=345&style=flat-square)

# @axtk/router

*A lightweight browser history router*

## Usage

### Initialization

```js
// route.js
import {Route} from '@axtk/router';
export const route = new Route();
```

### Events

Adding a handler of an exact URL path:

```js
import {route} from './route';

let routeListener = route.addListener('/home', ({path}) => {
    console.log(path);
});
```

of a specific URL path pattern:

```js
route.addListener(/^\/section\/(?<id>\d+)\/?$/, ({path, params}) => {
    console.log(path, params.id);
});
```

and removing a previously created route listener:

```js
routeListener.remove();
```

Tracking all changes:

```js
let unsubscribe = route.onChange(({path}) => {
    console.log(path);
});
```

and unsubscribing from them:

```js
unsubscribe();
```

Enabling history navigation on existing and future links:

```js
let unsubscribeLinks = route.subscribe('.app a');

// Within a scope of a fixed element:
route.subscribe('.content a', document.querySelector('#main'));
```

and canceling it:

```js
unsubscribeLinks();
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

Retrieving the current location:

```js
console.log(route.href);
```

Changing the current location to another path:

```js
// With the current location saved in the browser history
route.assign('/home');
```

```js
// Without saving the current location in the browser history
route.replace('/home');
```

Reloading the current location (by re-dispatching the current path event to the subscribers of `route`):

```js
route.reload();
```

Jumping to browser history entries:

```js
route.go(-2); // to go 2 entries back in the browser history
route.back(); // = route.go(-1);
route.forward(); // = route.go(+1);
```

## Also

- *[@axtk/react-router](https://github.com/axtk/react-router)*, an extension of *router* with React hooks
