# router

*A lightweight browser history router*

The `route` singleton object:
- exposes a `window.location`-like API to browser history navigation,
- allows to subscribe to changes in the URL.

## Usage

```js
import {route} from 'router';

// adding a handler to an exact URL path
route.addListener('/home', ({path}) => {
    console.log(path);
});

// adding a handler to a specific URL path pattern
route.addListener(/^\/section\/(?<id>\d+)\/?$/, ({path, params}) => {
    console.log(path, params.id);
});

// enabling history navigation on existing and future links
route.subscribe('a');
```

## API

*See JSDoc in [`./src`](/src).*

## Installation

```
npm i github:axtk/router
```

## Also

- *[react-router](https://github.com/axtk/react-router)*, an extension of *router* with React hooks
