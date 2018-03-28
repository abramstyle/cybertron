const loadConfig = require('../utils/loadConfig');
const loadBuildConfig = require('../utils/loadBuildConfig');
const Compiler = require('../lib/compiler');
const cleanBuildDir = require('../utils/cleanBuildDir');

async function build(options) {
  await cleanBuildDir(options);
  // const { env: { NODE_ENV: env } } = process;
  const { config: configPath } = options;
  let config = null;
  try {
    config = loadConfig(configPath);
  } catch (e) {
    console.error('configuration can not be found.');
    process.exit();
  }

  if (!config) {
    throw new Error('config not found');
  }

  const buildConfig = loadBuildConfig(config);

  const compiler = new Compiler(buildConfig.client);

  console.log('building resources...');
  return compiler.run()
    .then((stats) => {
      console.log('build success.');
      return Promise.resolve(stats.toJson());
    });
}

module.exports = build;
