var path = require('path');
var webpackMerge = require('webpack-merge');

var ROOT_PATH = path.resolve(__dirname, '../');
var additionalConfigPath = {
    development: './webpack.dev.config.js',
    production: './webpack.prod.config.js'
};
var baseConfig = {
    output: {
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkHash:6].bundle.js'
    },
    resolve: {
        modules: [path.resolve(ROOT_PATH, 'node_modules')],
        extensions: ['.js','.jsx','.webpack.js', '.less']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                  'presets': ['env', 'stage-0', 'react'],
                  'env': {
                    'development': {
                      'presets': ['react-hmre']
                    }
                  }
                },
                include: path.resolve(ROOT_PATH, 'client'),
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                  'presets': ['env', 'stage-0']
                },
                include: path.resolve(ROOT_PATH, 'client'),
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "font/[name].[hash:6].[ext]"
                }
            },
        ]
    }
};

module.exports = webpackMerge(
    baseConfig,
    require(additionalConfigPath[process.env.NODE_ENV])
);