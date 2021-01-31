# router

*A lightweight browser history router*

The two essential parts of this package are
- the `route` singleton object that exposes a `window.location`-like API to browser history navigation, and
- the `Router` class whose instances will assign handlers to specific path locations.

## Exports

### `class Router`

An instance of the `Router` class is a browser history router, an object that helps control how the URL history is handled. Internally, the `Router` class is an extension of the [`EventManager`](https://github.com/axtk/event-manager) class.

```js
const router = new Router({baseRoute: '/section'});

router.addListener(/^\/\d+$/, ({path, params}) => {
    console.log(path, params);
});
```

By default, routes are matched via regular expressions. A router can be configured to enable capturing named route parameters by overriding a couple of its helper methods:

```js
import Router from 'router';
// @see https://www.npmjs.com/package/route-parser
import Route from 'route-parser';

class PatternRouter extends Router {
    shouldCallListener(listener, event) {
        return new Route(listener.type).match(event.type) !== false;
    }
    toHandlerPayload(listener, event) {
        return {
            params: new Route(listener.type).match(event.type),
            route: event.type,
            path: event.path
        };
    }
}

const router = new PatternRouter({baseRoute: '/section'});

router.addListener('/:sectionId', ({params, route, path}) => {
    console.log(params, route, path);
});
```

- **`new Router(props)`**
  - **`props?: object`**
  - **`props.baseRoute?: string`**
    - A base route, a prefix for all paths handled on this router.
    - Default: `undefined` (same as `'/'`).
- **`.addListener(routePattern, handler)`**
  - **`routePattern: string | string[] | RegExp | RegExp[]`**
  - **`handler: function`**
  - Returns: **`listener: object | object[]`**
  - Adds a `handler` (or multiple handlers) to the specified `routePattern`. In the default setting, a route pattern is a `string` or a regular expression. (This can be changed with a custom `shouldCallListener` method in descendant classes.) If a handler is not a function, it is silently ignored.
  - This method returns a listener object with a `remove()` method that removes the listener from the router. It returns an array of listeners for an array of route patterns.
- **`.removeListener(routePattern, handler?)`**
  - **`routePattern: string | string[] | RegExp | RegExp[]`**
  - **`handler?: function`**
  - Removes a route listener of the specified `routePattern` and route `handler`. If the handler is not specified, all subscriptions to the specified `routePattern` are removed.
- **`.dispatch(path)`**
  - **`path: string`**
  - Notifies the router of the specified `path`.
- **`.setBaseRoute(baseRoute)`**
  - **`baseRoute: string`**
  - Sets the router's base route.
- **`.getRoute(path)`**
  - **`path: string | undefined`**
  - Returns: **`string | null`**
  - Returns a route matching the `path` location (or the current location if the `path` is not specified) relative to the router's base route. If the location doesn't match the router's base route, the returned value is `null`.
- **`.matches(path)`**
  - **`path: string`**
  - Returns: **`boolean`**
  - Checks whether the `path` location matches the router's base route.

### `route`

A singleton object providing a [`window.location`](https://developer.mozilla.org/en-US/docs/Web/API/Location)-like browser history navigation API and notifying instances of the `Router` class whenever such navigation occurs.

- **`.assign(path)`**
  - **`path: string`**
  - Navigates to the specified `path`, as in [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState), and notifies `Router` instances.
- **`.replace(path)`**
  - **`path: string`**
  - Navigates to the specified `path` without saving it on the browser history session, as in [`history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState), and notifies `Router` instances.
- **`.reload()`**
  - Re-sends the current path to instances of the `Router` class.
- **`.subscribe(target)`**
  - **`target: any`**
  - Subscribes links to the `route` object to enable history navigation without page reloading. The argument is a specific DOM node, or a collection of DOM nodes, or a selector.
  - 
    ```js
    // subscribing existing and future links
    route.subscribe('a');
    ```
- **`.unsubscribe(target)`**
  - **`target: any`**
  - Unsubscribes links from the `route` object.
- **`.onChange(handler)`**
  - **`handler: function`**
  - Returns: **`function | undefined`**
  - Subscribes the `handler` function to all route changes and returns a function that removes the subscription. If the `handler` is not a function the returned value is `undefined`.
- **`.toString()`**
  - Returns: **`string`**
  - Returns the current full path.
- **`.go(delta)`**
  - **`delta: number`**
  - See [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).
- **`.back()`**
  - Same as `go(-1)`. See [`history.back`](https://developer.mozilla.org/en-US/docs/Web/API/History/back).
- **`.forward()`**
  - Same as `go(1)`. See [`history.forward`](https://developer.mozilla.org/en-US/docs/Web/API/History/forward).

## Installation

```
npm i github:axtk/router
```
