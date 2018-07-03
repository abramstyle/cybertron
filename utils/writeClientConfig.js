const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const ISOMORPHIC_PATH = '../isomorphic/clientConfig.js';

const template = (config) => {
  const { isomorphic } = config;
  const { routes, store, app } = isomorphic;
  return `
const { default: getRoutes } = require('${routes}');
const { default: configureStore } = require('${store}');
const { default: App } = ${!!app} ? require('${app}') : {};

exports.getRoutes = getRoutes;
exports.configureStore = configureStore;
exports.App = App;
  `;
};

async function writeConfig(config = {}) {
  const content = template(config);

  return fs.writeFileAsync(path.resolve(__dirname, ISOMORPHIC_PATH), content);
}

module.exports = writeConfig;
