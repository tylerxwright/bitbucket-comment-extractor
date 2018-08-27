var webpack = require('webpack');
var devConfig = require('./webpack.config.js');

console.log('prod');

devConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
            warnings: false,
            drop_console: true
        }
    })
);

module.exports = devConfig;