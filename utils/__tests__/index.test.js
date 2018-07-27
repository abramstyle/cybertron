const path = require('path');
const {
  getBaseDir, processConfig, generateCdnPath,
} = require('..');

describe('utils/generateCdnPath', () => {
  test('normal config', () => {
    const normalConfig = {
      build: {
        host: 'localhost',
        port: 1234,
        path: 'build/',
      },
    };

    const cdnUrl = generateCdnPath(normalConfig);
    expect(cdnUrl).toBe('//localhost:1234/build/');
  });

  test('without port', () => {
    const noPortConfig = {
      build: {
        host: 'localhost',
        path: 'build/',
      },
    };

    const cdnUrl = generateCdnPath(noPortConfig);
    expect(cdnUrl).toBe('//localhost/build/');
  });

  test('without path', () => {
    const noPathConfig = {
      build: {
        host: 'localhost',
        port: 1234,
      },
    };

    const cdnUrl = generateCdnPath(noPathConfig);
    expect(cdnUrl).toBe('//localhost:1234/');
  });
  test('no port, no path', () => {
    const pureHostConfig = {
      build: {
        host: 'localhost',
      },
    };

    const cdnUrl = generateCdnPath(pureHostConfig);
    expect(cdnUrl).toBe('//localhost/');
  });
});

describe('utils/processConfig', () => {
  const baseDir = getBaseDir();

  const finalConfig = {
    ssr: true,
    onlyServer: false,
    renderer: {
      template: path.resolve(__dirname, '../../isomorphic/template'),
    },
    app: {
      name: 'Kaon Config Template (production)',
      shortName: 'rib',
      port: 1827,
      routes: `${baseDir}/app/routes`,
      middlewares: `${baseDir}/app/middlewares`,
    },
    resources: {
      root: `${baseDir}/public`,
    },
    isomorphic: {
      routes: `${baseDir}/src/routes`,
      store: `${baseDir}/src/store/configureStore.js`,
      main: `${baseDir}/src/client`,
    },
    postcss: {
      path: `${baseDir}/config/postcss.config.js`,
    },
    webpack: {
      client: `${baseDir}/config/webpack.client.config.js`,
      server: `${baseDir}/config/webpack.server.config.js`,
    },
    build: {
      host: 'localhost',
      port: 1592,
      path: 'build/',
      target: `${baseDir}/public/build`,
    },
  };

  test('process normal config', () => {
    const customizeConfig = {
      ssr: false,
      app: {
        name: 'Customize app name',
        shortName: 'can',
        port: 14159,
        routes: '/project/path/app',
        middlewares: '/project/path/middlewares',
      },
      resources: {
        root: '/project/path/static',
      },
      isomorphic: {
        routes: '/project/routes/server',
        store: '/project/client/store/configureStore',
        main: '/project/client/index.js',
      },
      webpack: {
        client: '/project/config/webpack.client.js',
      },
      build: {
        host: 'static.domain.com',
        port: '',
        path: '/project/build/',
        target: '/project/build/',
      },
    };

    const config = processConfig(customizeConfig);

    expect(config).toEqual({
      ssr: false,
      onlyServer: false,
      renderer: {
        template: path.resolve(__dirname, '../../isomorphic/template'),
      },
      app: {
        name: 'Customize app name',
        shortName: 'can',
        port: 14159,
        routes: '/project/path/app',
        middlewares: '/project/path/middlewares',
      },
      resources: {
        root: '/project/path/static',
      },
      isomorphic: {
        routes: '/project/routes/server',
        store: '/project/client/store/configureStore',
        main: '/project/client/index.js',
      },
      postcss: {
        path: `${baseDir}/config/postcss.config.js`,
      },
      webpack: {
        client: '/project/config/webpack.client.js',
        server: `${baseDir}/config/webpack.server.config.js`,
      },
      build: {
        host: 'static.domain.com',
        port: '',
        path: '/project/build/',
        target: '/project/build/',
      },
    });
  });
  test('all with default config', () => {
    const config = processConfig();
    expect(config).toEqual(finalConfig);
  });
});
