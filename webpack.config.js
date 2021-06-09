const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'http://localhost:3000/dist/',
        filename: 'computedZindex.js'
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                include: [
                    path.join(__dirname, 'src')
                ],
                loader: 'babel-loader'
            }, {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /.styl(us)?$/,
                use: ['style-loader', 'css-loader', 'stylus-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.join(__dirname, 'src')
        }
    },
    devtool: 'source-map',
    context: __dirname,
    target: 'web',
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, OPTIONS',
            'Access-Control-Allow-Credentials': 'true'
        },
        disableHostCheck: true,
        contentBase: path.join(__dirname, 'public/'),
        port: 3000,
        publicPath: 'http://localhost:3000/dist/',
        hotOnly: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};