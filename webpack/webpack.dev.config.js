var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname, '../');
var CLIENT_PATH = path.resolve(ROOT_PATH, 'client');
var DEV_PATH = path.resolve(ROOT_PATH, '/dist');

var DEV_GLOBAL_CONFIG = require('../client/config/dev.env.js');

module.exports = {
    context: path.resolve(__dirname, ".."),
    mode: "development",
    entry:{
        index:[
            "eventsource-polyfill",
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true",
            path.resolve(CLIENT_PATH, 'index.jsx')
        ],
        vendor: ['react', 'react-dom']
    },
    output: {
        path: DEV_PATH
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader','less-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(DEV_GLOBAL_CONFIG),
        new webpack.HotModuleReplacementPlugin(), // 热替换
        new HtmlWebpackPlugin({
            filename:"index.html",
            template: path.resolve(path.resolve(ROOT_PATH, 'server/template'), 'index.templete.html'),
            chunks: ['index', 'vendor'],
            hash: true
        })
    ]
};