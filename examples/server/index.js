const express = require('express');
const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('../webpack.config');

var app = express();

if (config.get('NODE_ENV') !== 'production') {
    const compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.get('DEV_URL') + config.get('ASSETS_PUBLIC_PATH'),
        filename: config.get('BUNDLE_FILENAME'),
        hot: true,
        noInfo: true,
        stats: {
            colors: true,
        },
    }));
    app.use(require('webpack-hot-middleware')(compiler));
}

app.use(config.get('ASSETS_PUBLIC_PATH'), express.static(config.get('ASSETS_PATH')));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../assets/index.html'));
});

app.listen(config.get('DEV_PORT'));
