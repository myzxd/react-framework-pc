const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ProdConfig = require('./bin/webpack.prod.config')
const DevConfig = require('./bin/webpack.dev.config');
const modifyVars = require('./lessVars');


const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";

module.exports = merge({
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash:8].js',
        clean: true, // 每次构建清除dist包
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".less", ".scss", ".css", ".json"], // 省略文件后缀
        alias: { // 配置别名
            "@": path.resolve(__dirname, "./src"),
        },
        fallback: {
            buffer: false
        }
    },
    cache: {
        type: 'filesystem',
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                styles: {
                    name: "styles",
                    type: "css/mini-extract",
                    chunks: "async",
                    enforce: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                }
            }
        },
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: false
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx?)$/,
                use: ['babel-loader?cacheDirectory'],
                exclude: /node_modules/,
            },
            {
                test: /\.(css|less)$/,
                include: /src/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: ["autoprefixer"], // 添加兼容前缀
                            },
                        },
                    },
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: false,
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars
                            }
                        }
                    }
                ],
            },
            {
                test: /\.(css|less)$/,
                include: /node_module/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: ["autoprefixer"], // 添加兼容前缀
                            },
                        },
                    },
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: false,
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars
                            }
                        }
                    }
                ],
            },
            {
                test: /\.(md)$/,
                use: [
                    "raw-loader",
                ]
            },
            {
                test: /\.(yml)$/i,
                type: "asset/inline",
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset",
                generator: {
                    filename: "static/[name].[contenthash:6][ext]",
                },
                // parser: {
                //     dataUrlCondition: {
                //       maxSize: 4 * 1024 // 4kb
                //     }
                // }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                type: "asset",
                generator: {
                    filename: "static/[name].[contenthash:6][ext]",
                }
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true, // 删除双引号
                removeComments: true, // 删除注释
                collapseWhitespace: true // 压缩代码
            }
        }),
    ]
}, isProd ? ProdConfig : DevConfig)