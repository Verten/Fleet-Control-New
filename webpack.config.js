var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');
//var pathToReact = path.resolve(node_modules, 'react/dist/react.js');

//独立打包样式文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//拷贝文件
var TransferWebpackPlugin = require('transfer-webpack-plugin');

var debug = process.env.NODE_ENV !== "prod"; // or set NODE_ENV=dev

var config = {
    plugins: [
        /*new webpack.HotModuleReplacementPlugin(),*/
        new ExtractTextPlugin("style.css"),
        new TransferWebpackPlugin([
            {from: 'Asset',to:'Asset'}
        ], path.resolve(__dirname,"src")),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],

    entry: debug ? ['webpack/hot/dev-server',path.resolve(__dirname, 'src/App.js')] : [path.resolve(__dirname, 'src/App.js')],

    //devtool: 'source-map',

    //debug: true,

    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.scss'],
        //alias: {
        //    'react': pathToReact
        //}
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'fleetcontrol.js',
    },
    module: {
        loaders: [
            {
                //编译js或者jsx文件
                test: /\.jsx?$/,
                loader: 'babel'
            },
            {
                //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理, "-loader"其实是可以省略不写的，多个loader之间用“!”连接起来 'style!css!sass?sourceMap'
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(['css','sass'])
            }
        ],
        //noParse:[pathToReact]
    }
};

module.exports = config;