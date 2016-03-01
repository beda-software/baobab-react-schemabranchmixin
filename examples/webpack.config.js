var path = require('path');
var webpack = require('webpack');
var PolyfillsPlugin = require('webpack-polyfills-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('./config');

module.exports = {
  entry: {
    app: [
      'webpack-hot-middleware/client?reload=true&path=' + config.get('DEV_URL') + '/__webpack_hmr',
      './app/index',
    ],
  },
  resolve: {
    modulesDirectories: ['node_modules', 'app/'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      app: path.resolve('./app/js/'),
      libs: path.resolve('./app/js/libs/'),
    },
  },
  output: {
    path: config.get('ASSETS_PATH'),
    publicPath: config.get('DEV_URL') + config.get('ASSETS_PUBLIC_PATH'),
    filename: config.get('BUNDLE_FILENAME'),
    sourceMapFilename: 'bundle.map',
    devtoolLineToLine: true,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'react-hot!babel?presets[]=react&presets[]=es2015',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?minimize!autoprefixer-loader!sass-loader?outputStyle=expanded&' +
        'includePaths[]=' +
        (path.resolve(__dirname, './node_modules')),
      },
      {
        test: /\.(eot|woff|ttf)$/,
        loader: 'url-loader?limit&name=[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: ['url?limit=1', 'image-webpack?bypassOnDebug&progressive=true'],
      },
      {
        test: /\.svg$/i,
        loaders: ['url?limit=10240', 'svgo'],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
    new PolyfillsPlugin([
      '_enqueueMicrotask',
      'Promise',
      'String/prototype/startsWith',
    ]),
    new HtmlWebpackPlugin({
      template: './server/index.html',
      hash: true,
      inject: 'body',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};
