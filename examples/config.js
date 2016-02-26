const nconf = require('nconf');
const path = require('path');

// Load settings
nconf
    .file({
        file: '.env',
        format: nconf.formats.ini,
    })
    .env()
    .defaults({
        DEV_HOST: 'localhost',
        DEV_PORT: 8000,
        ASSETS_PATH: path.join(__dirname, './assets/'),
        ASSETS_PUBLIC_PATH: '/assets/',
        BUNDLE_FILENAME: 'bundle.js',
    });

nconf.set('DEV_URL', 'http://' +  nconf.get('DEV_HOST') + ':' + nconf.get('DEV_PORT'));

module.exports = nconf;
