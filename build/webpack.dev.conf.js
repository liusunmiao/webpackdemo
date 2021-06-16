'use strict'
const webpack = require('webpack')
const config = require('../config')
// 引入webpack-merge模块。这个模块用于把多个webpack配置合并成一个配置，后面的配置会覆盖前面的配置。
const {merge} = require('webpack-merge')
const path = require('path')
// 引入webpack的基本设置，这个设置文件包含了开发环境和生产环境的一些公共配置
const baseWebpackConfig = require('./webpack.base.conf')
//获取端口
const portfinder = require('portfinder')
// 获取host环境变量，用于配置开发环境域名
const HOST = process.env.HOST;
// 获取post环境变量，用于配置开发环境时候的端口号
const PORT = process.env.PORT && Number(process.env.PORT)
// 开发环境的完整的配置文件，
const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    module: {
        // 为那些独立的css类型文件添加loader配置（没有写在vue文件的style标签中的样式）
        rules: []
    },
    // 开发环境使用'eval-source-map'模式的source map
    // 因为速度快
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/indextest.mjs
    // 下面是对webpack-dev-server选项的基本配置，这些配置信息，我们可以在/config/index.js
    // 文件中进行自定义配置。
    devServer: {
        //开发环境配置

        // 用于配置在开发工具的控制台中显示的日志级别
        // 注意这个不是对bundle的错误和警告的配置，而是对它生成之前的消息的配置
        clientLogLevel: "warning",
        // 表示当使用html5的history api的时候，任意的404响应都需要被替代为index.html
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: path.posix.join(config.dev.assetsPublicPath, "index.html"),
                },
            ],
        },
        // 启用webpack的热替换特性
        hot: true,
        // 一切服务都需要使用gzip压缩
        // 可以在js，css等文件的response header中发现有Content-Encoding:gzip响应头
        contentBase: false,
        compress: true,
        // 指定使用一个 host。默认是 localhost
        // 如果希望服务器外部可以访问(通过我们电脑的ip地址和端口号访问我们的应用)
        // 可以指定0.0.0.0
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? {warnings: false, errors: true}
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        },
    },
    output: {
        //输出
        filename: '[name]-[hash:8].js', // 每次保存 hash 都变化
        path: path.resolve(__dirname, '../dist')
    },
    plugins: []
})
module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port;
            // add port to devServer config
            devWebpackConfig.devServer.port = port;

            resolve(devWebpackConfig);
        }
    });
});
