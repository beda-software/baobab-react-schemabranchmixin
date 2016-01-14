var path = require('path');
var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['phantomjs-shim', 'mocha', 'chai'],
    files: [
      'test/*.spec.js'
    ],
    preprocessors: {
      'test/*.spec.js': 'webpack'
    },
    reporters: ['coverage', 'dots'],
    notifyReporter: {
      reportEachFailure: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    webpack: {
      babel: {
        presets: ['es2015']
      },
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: {
          presets: ['es2015']
        }
      },
      module: {
        preLoaders: [
          // Transpile only tests
          {
            test: /\.spec\.jsx?/,
            loader: 'babel',
            exclude: /node_modules/
          },
          // Transpile all project without tests and index.js
          {
            test: /\.jsx?$/,
            exclude: [
              /node_modules/,
              /\.spec\.jsx?/
            ],
            loader: 'isparta'
          }
        ]
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};
