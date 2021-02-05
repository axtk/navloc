# router

*A lightweight browser history router*

The two essential parts of this package are:
- the `route` singleton object that exposes a `window.location`-like API to browser history navigation, and
- the `Router` class whose instances will assign handlers to specific path locations.

## Usage

An instance of the `Router` class is a browser history router, an object that helps control how changes in the URL are handled.

```js
import {Router, route} from 'router';

const router = new Router({baseRoute: '/section'});

router.addListener(/^\/(\d+)$/, ({path, params}) => {
    console.log(path, params);
});

// enabling history navigation on existing and future links
route.subscribe('a');
```

### Custom route matching

By default, routes are matched via regular expressions. Here's an example of how to enable capturing of named route parameters in string route patterns:

```js
import {Router} from 'router';
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

## API

*See JSDoc in [`./src`](/src).*

## Installation

```
npm i github:axtk/router
```
