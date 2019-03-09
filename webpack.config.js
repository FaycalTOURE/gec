'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineSourcePlugin = require('html-webpack-inline-source-plugin');



const dev = process.env.NODE_ENV === 'dev';
const cssLoaders = [{loader: 'css-loader', options : { importLoaders: 1, hashPrefix: 'hash', sourceMap: dev } }];

let config = {
    mode: dev ? 'development' : 'production',
    watch: dev,
    devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: true,
    },
    entry : {
        app: ['./assets/scss/app.scss', './assets/js/app.js']
    },
    output : {
        path: path.resolve('./dist'),
        filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [...cssLoaders]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [...cssLoaders, 'sass-loader']
                })
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                },
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve('./'),
            verbose: true,
            dry: false
        }),
        new ExtractTextPlugin({filename: dev ? '[name].css' : '[name].[contenthash:8].css', disable: dev}),
        new ManifestPlugin(),
        new HtmlWebpackPlugin({
            inlineSource: 'runtime~.+\\.js',
        }),
        new InlineSourcePlugin()
    ]
};

if(!dev){
    cssLoaders.push({
        loader: 'postcss-loader',
        options: {
            plugins: [ require('autoprefixer')({
                browsers: ['last 2 versions', 'ie > 8']
            })]
        }
    });
}

module.exports = config;