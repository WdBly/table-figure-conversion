var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname, '../');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

var PROD_GLOBAL_CONFIG = require('../client/config/server.env.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "production",
    entry: {
        index: path.resolve(ROOT_PATH, 'client/index.jsx')
    },
    output: {
        path: BUILD_PATH
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: 'css-loader'
                })
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 20000,
            minChunks: 1, 
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 20,
                    name: "vendors",
                    chunks: "all"
                },
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin(PROD_GLOBAL_CONFIG),
        new ExtractTextPlugin('[name].bundle.css'),
        new HtmlWebpackPlugin({
            filename:"index.html",
            template: path.resolve(path.resolve(ROOT_PATH, 'server/template'), 'index.templete.html')
        })
    ]
};
