[![npm](https://img.shields.io/npm/v/@axtk/router?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/@axtk/router)
![browser](https://img.shields.io/badge/browser-✓-blue?labelColor=dodgerblue&color=dodgerblue&style=flat-square)

*A lightweight browser history router*

Based on the History API, an instance of the `Route` class helps control how changes in the URL are handled. An application will typically have a single instance of this class (which is similar to the `window.location` singleton).

# Usage

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

Of a specific URL path pattern:

```js
route.addListener(/^\/section\/(?<id>\d+)\/?$/, ({path, params}) => {
    console.log(path, params.id);
});
```

Enabling history navigation on existing and future links:

```js
route.subscribe('a');
```

*See also the [source code JSDoc](https://github.com/axtk/router/tree/master/src).*

# Also

- *[react-router](https://github.com/axtk/react-router)*, an extension of *router* with React hooks
