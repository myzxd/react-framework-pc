const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 

// 生产环境配置
module.exports = {
    mode: 'production',
    devtool: false,
    plugins: [
        new MiniCssExtractPlugin({ // 拆分css文件
            filename: 'css/[name].[contenthash:6].css'
        }),
        new CssMinimizerPlugin(), // 压缩css文件
        new WebpackBar(),
        new CopyWebpackPlugin({
            patterns: [ // 拷贝文件
                { from: './src/static/*', to: "static/[name][ext]" },
                { from: './src/static/business/*', to: "static/[name][ext]" },
                { from: './public/countly.min.js', to: '' }
            ]
        })
        // new BundleAnalyzerPlugin(), // 依赖分析
    ]
}