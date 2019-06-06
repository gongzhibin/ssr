const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd
        ? false
        : '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            public: path.resolve(__dirname, '../public')
        }
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.styl(us)?$/,
                use: isProd
                    ? [
                        { loader: MiniCssExtractPlugin.loader },
                        'css-loader', 'less-loader', 'vue-style-loader'
                    ]
                    : ['vue-style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    performance: {
        hints: false
    },
    plugins: isProd
        ? [
            new VueLoaderPlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new MiniCssExtractPlugin({
                filename: 'common.[chunkhash].css'
            })
        ]
        : [
            new VueLoaderPlugin(),
            new FriendlyErrorsPlugin()
        ],
    optimization: isProd
        ? {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    exclude: /node_modules/,
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                    terserOptions: {
                        ecma: 6,
                        compress: true,
                        output: {
                            warnings: false,
                            comments: false,
                            beautify: false
                        }
                    }
                })
            ]
        }
        : {}
};
