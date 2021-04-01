[![npm](https://img.shields.io/npm/v/@axtk/router?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/@axtk/router)
![browser](https://img.shields.io/badge/browser-✓-blue?labelColor=dodgerblue&color=dodgerblue&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-✓-blue?labelColor=dodgerblue&color=dodgerblue&style=flat-square)

*A lightweight browser history router*

Based on the History API, an instance of the `Route` class helps control how changes in the URL are handled. An application will typically have a single instance of this class (which is similar to the `window.location` singleton).

## Usage

Initialization:

```js
// route.js
import {Route} from '@axtk/router';
export const route = new Route();
```

Adding a handler of an exact URL path:

```js
import {route} from './route';

route.addListener('/home', ({path}) => {
    console.log(path);
});
```

and of a specific URL path pattern:

```js
route.addListener(/^\/section\/(?<id>\d+)\/?$/, ({path, params}) => {
    console.log(path, params.id);
});
```

Tracking all changes:

```js
route.onChange(({path}) => {
    console.log(path);
});
```

Retrieving the current location:

```js
console.log(route.href);
```

Enabling history navigation on existing and future links:

```js
route.subscribe('.app a');
```

Checking a route pattern (or an array thereof) if it matches the current path:

```js
// Provided that the current location is '/section/42':
route.match('/home'); // null
route.match('/section/42'); // {}
route.match(/^\/section\/(?<id>\d+)\/?$/); // {0: '42', id: '42'}
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
