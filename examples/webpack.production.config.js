var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var PolyfillsPlugin = require('webpack-polyfills-plugin');
var config = require('./config');

module.exports = {
  entry: {
    app: ['./app/index'],
  },
  output: {
    path: config.get('ASSETS_PATH'),
    publicPath: config.get('ASSETS_PUBLIC_PATH'),
    filename: config.get('BUNDLE_FILENAME'),
  },
  resolve: webpackConfig.resolve,
  module: webpackConfig.module,
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: './server/index.html',
      hash: true,
      inject: 'body',
    }),
    new PolyfillsPlugin([
      '_enqueueMicrotask',
      'Promise',
      'String/prototype/startsWith',
    ]),
  ],
};
