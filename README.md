# kaon.js
Kaon.js is an react isomorphic app solution. it contains webpack build, hot reloading, code splitting and server side rendering.

# From
Kaon is a Decepticon-controlled city-state in the southern hemisphere of Cybertron. Under Decepticon rule, its capitol is the fortress of Kolkular.

# The pronounce
['keɑn]

# The main stack
- koa
- react
- redux
- react-router
- react-helmet
- webpack
- postcss
- react-hot-loader
- react-loadable
- babel

# Usage
## install
```
npm install kaonjs
```
or with yarn
```
yarn add kaon
```
## add your config
Config is a js file that default exported a Javascript object, it specified a lot ot configurations. The default path is `<project_root>/config/cybertron.config.js`. But you can put it into anywhere of your project.

An configuration specified these optons:

###  app
- app.name - The app name
- app.shortName - The short app name.
- app.port - App listening port.
- app.routes - Customize koa routes.
- app.middlewares - the js file that will apply your middlewares.

### resources
- resources.root - If resources.root is exist, kaon will serve all files inside the path as static server.

### isomorphic
- isomorphic.routes - The client routes path, should be an string, the default value is `<project_root>/src/routes`.
- isomorphic.store - The client store path, should be an string, the default value is `<project_root>/src/store/configureStore`
- isomorphic.main - The client entry

### postcss
- postcss.path - If use postcss, shoud specify postcss path.

### webpack
- webpack.client - your client webpack configuration, object or function.
- webpack.server - your server webpack configuration, object or function.

### build
- build.host - The dev server will server at this host.
- build.port - the dev server port.
- build.path - the dev server url path.
- build.target - the build result path.

## command line
command: `kaon <cmd> [options]`

### commands
#### `kaon start [options]`

available options:

- config - specify config path

#### `kaon build [options]`

available options:

- config - specify config path

## nodejs APIs
You can use kaon as an npm modules instead of cli.

```javascript
const Kaon = require('kaon');
const kaon = new Kaon(config);

kaon.start();
```

## apply your middleware.
First, configure your middleware path, it should be a javascript file like below:

```javascript
const logger = require('koa-logger');
const favicon = require('koa-favicon');
const path = require('path');

function applyMiddlewares(app) {
  app.use(logger());
  app.use(favicon(path.join(__dirname, '../../public/favicon.ico')));
}

module.exports = applyMiddlewares;
```

The app instance will be passed to your function, then just call `app.use` to apply the middlewares.
