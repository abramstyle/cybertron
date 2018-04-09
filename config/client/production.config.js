const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const { generateCdnPath } = require('../../utils');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const getConfig = config => ({
  mode: 'production',
  entry: {
    app: [
      // 'babel-polyfill',
      config.isomorphic.main,
    ],
    commons: [
      'react',
      'redux',
      'react-redux',
      'react-dom',
      'react-router',
      'react-router-dom',
      'react-helmet',
      'react-loadable',
    ],
  },
  output: {
    filename: '[name]-[contenthash].bundle.js',

    chunkFilename: '[name]-[contenthash].chunk.js',

    path: config.build.target,

    publicPath: generateCdnPath(config),
    // necessary for HMR to know where to load the hot update chunks
    sourceMapFilename: '[name]-[contenthash].js.map',
  },

  // context: resolve('sources'),

  // devtool: 'eval-source-map',
  devtool: 'source-map',

  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      }],
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true,
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            config: {
              path: config.postcss.path,
            },
          },
        }],
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          minetype: 'application/font-woff',
        },
      },
    }, {
      test: /\.jpe?g$|\.gif$|\.png$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: {
        loader: 'file-loader',
      },
    }],
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    // new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APP_ENV: JSON.stringify(process.env.NODE_ENV),
      },
      __IS_SERVER__: JSON.stringify(false),
      __DEV__: JSON.stringify(__DEV__),
      __STAGING__: JSON.stringify(__STAGING__),
      __RELEASE__: JSON.stringify(__RELEASE__),
      __PROD__: JSON.stringify(__PROD__),
    }),
    // new ExtractTextPlugin({
    //   filename: '[name]-[contenthash].css',
    //   allChunks: true,
    // }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[id]-[contenthash].css',
    }),
    // prints more readable module names in the browser console on HMR updates
    new ReactLoadablePlugin({
      filename: `${config.build.target}/react-loadable.json`,
    }),
    new ManifestPlugin(),
  ],
  optimization: {
    namedModules: true,
    splitChunks: {
      name: 'commons',
      minChunks: 2,
      // cacheGroups: {
      //   styles: {
      //     name: 'styles',
      //     test: /\.css$/,
      //     chunks: 'all',
      //     enforce: true,
      //   },
      // },
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
    ],
  },
});

module.exports = getConfig;
