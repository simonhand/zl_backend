 'use strict';
 const webpack = require('webpack');
 const path = require('path');
 const cleanWebpackPlugin = require('clean-webpack-plugin');
 var nodeExternals = require('webpack-node-externals');
 const MinifyPlugin = require('babel-minify-webpack-plugin');
 module.exports = {
     entry: path.resolve(__dirname, 'service.js'), //入口文件
     output: {
         path: path.resolve(__dirname), //输出路径
         filename: 'app.js'             // 输出项目根目录
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             use: [{
                 loader: 'babel-loader',
                 options: {
                     presets: ['es2015', 'stage-3'] //兼容es6，并添加.babelrc
                 }
             }]
 
         }]
     },
     target: 'node', // 服务端打包
     externals: [nodeExternals()], //node 打包可去除一些警告
     resolve: {
         modules: [
             'node_modules',
             path.resolve(__dirname, 'src')
         ]
     },
     plugins: [
         new cleanWebpackPlugin(['app.js'], {
             root: path.resolve(__dirname, './')
         }),
         new MinifyPlugin() //压缩js
     ]
 };