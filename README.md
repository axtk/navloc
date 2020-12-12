# router

*A lightweight browser history router*

The `route` singleton object exposes a `window.location`-like API to browser history navigation. The API of the `Router` class also inherits from a native JS Event API and offers customization of the route pattern matching.

## `class Router`

### Constructor

#### `Router(props?: object)`

Returns an instance of a browser history router, an object that helps control how the URL history is handled.

`props.baseRoute?: string`

`props.shouldCallListener?: (routePattern, path) => boolean`<br>
defines custom route pattern matching.

`props.toHandlerPayload?: (routePattern, path) => any`<br>
defines the payload that the route handlers will receive.

By default, routes are matched via regular expressions:

```js
const router = new Router({baseRoute: '/section'});

router.addRouterListener(/^\/\d+$/, ({path, params}) => {
    console.log(path, params);
});
```

The constructor options can be used to enable capturing named route parameters:

```js
// @see https://www.npmjs.com/package/route-parser
import Route from 'route-parser';

const router = new Router({
    shouldCallListener: (routePattern, path) => {
        return new Route(routePattern).match(path) !== false;
    },
    toHandlerPayload: (routePattern, path) => ({
        params: new Route(routePattern).match(path),
        path
    })
});
```

### Methods

#### `addRouteListener(routePattern: any, handler: function | function[]): object | objects[]`

Adds a `handler` (or multiple handlers) to the specified `routePattern`. In the default setting, a route pattern is a `string` or a regular expression. (This can be changed with a custom `shouldCallListener` constructor option.) If a handler is not a function, it is silently ignored.

This method returns a listener object (or an array thereof) with a `remove()` method that removes the listener from the router.

#### `removeRouteListener(routePattern: any, handler?: function | function[])`

Removes a route listener of the specified `routePattern` and route `handler` (or an array of handlers). If the handler is not specified, all subscriptions to the specified `routePattern` are removed.

#### `dispatchRoute(path: string)`

Notifies the router of the specified `path`.

#### `setBaseRoute(baseRoute: string)`

Sets the router's base route.

## `route`

A singleton providing a [`window.location`](https://developer.mozilla.org/en-US/docs/Web/API/Location)-like browser history navigation API and notifying instances of the `Router` class whenever such navigation occurs.

### Methods

#### `assign(path: string)`

Causes the navigation to the specified `path`, as in [`window.location.assign`](https://developer.mozilla.org/en-US/docs/Web/API/Location/assign) and [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState).

#### `replace(path: string)`

Causes the navigation to the specified `path` without saving it on the browser history session, as in [`window.location.replace`](https://developer.mozilla.org/en-US/docs/Web/API/Location/replace) and [`history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).

#### `reload()`

Re-sends the current path to instances of the `Router` class.

#### `subscribe(target: any)`

Subscribes links to the `route` object to enable history navigation without page reloading. The argument is a specific DOM node, or a collection of DOM nodes, or a selector.

```js
// subscribing existing and future links
route.subscribe('a');
```

#### `unsubscribe(target: any)`

Unsubscribes links from the `route` object.

#### `toString(): string`

Returns the current full path.

#### `go(delta: number)`

See [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).

#### `back()`

Same as `go(-1)`. See [`history.back`](https://developer.mozilla.org/en-US/docs/Web/API/History/back).

#### `forward()`

Same as `go(1)`. See [`history.forward`](https://developer.mozilla.org/en-US/docs/Web/API/History/forward).

## Installation

```
npm i github:axtk/router
```
