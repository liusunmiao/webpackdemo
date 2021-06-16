'use strict'
// 基础配置
const path = require('path')
const config = require('../config')
//配置预览插件
//导入生成预览页面的插件 得到一个构造函数
const HtmlWebpacklPlugin = require('html-webpack-plugin');
//创建插件的实例
const htmlPlugin = new HtmlWebpacklPlugin({
    template: path.resolve(__dirname,'../index.html'),//指定要用到的模块文件
    //指定要生成的文件名称，该文件存在于内存中，在目录中不显示
    // filename: 'index.html'
});
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 生成相对于根目录的绝对路径
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//eslint的规则
const createLintingRule = () => ({
    // 对.js和.vue结尾的文件进行eslint检查
    test: /\.(js|vue)$/,
    // 使用eslint-loader
    loader: 'eslint-loader',
    // enforce的值可能是pre和post。其中pre有点和webpack@1中的preLoader配置含义相似。
    // post和v1中的postLoader配置含义相似。表示loader的调用时机
    // 这里表示在调用其他loader之前需要先调用这个规则进行代码风格的检查
    enforce: 'pre',
    // 需要进行eslint检查的文件的目录存在的地方
    include: [resolve('src'), resolve('test')],
    // eslint-loader配置过程中需要指定的选项
    options: {
        // 文件风格的检查的格式化程序，这里使用的是第三方的eslint-friendly-formatter
        formatter: require('eslint-formatter-friendly'),
        // 是否需要eslint输出警告信息
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})
// 下面就是webpack基本的配置信息（可以立即成是开发环境和生产环境公共的配置）
module.exports = {
    mode: process.env.NODE_ENV,
    // webpack解析文件时候的根目录(如果把webpack.config.js)放在了项目的根目录下面，这个配置可以省略
    // context: path.resolve(__dirname, '../'),
    // 指定项目的入口文件
    entry: path.join(__dirname, '../src/main.js'),
    // 项目的输出配置
    output: {
        // 项目build的时候，生成的文件的存放路径(这里的路径是../dist)
        path: config.build.assetsRoot,
        // 生成文件的名称
        filename: "[name]-[hash:8].js",
        // 输出解析文件的目录，url 相对于 HTML 页面(生成的html文件中，css和js等静态文件的url前缀)
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    // 配置模块解析时候的一些选项
    resolve: {
        // 指定哪些类型的文件可以引用的时候省略后缀名
        extensions: ['.js', '.vue', '.json'],
        // 别名，在引入文件的时候可以使用
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            // 可以在引入文件的时候使用@符号引入src文件夹中的文件
            '@': resolve('src'),
        }
    },
    // 下面是针对具体的模块进行的具体的配置
    //进行一些loader的配置
    module: {
        rules: [
            // ...(config.dev.useEslint ? [createLintingRule()] : []),
            //其中，test表示匹配的文件类型，use表示对应要调用的loader
            {test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader']},
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
            {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
            {test: /.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2$/, use: ['url-loader?limit=16940']},
            {test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/},
            {test: /\.vue$/, use: "vue-loader"}
        ]
    },
    plugins: [htmlPlugin, new VueLoaderPlugin()],
    // 这些选项用于配置polyfill或mock某些node.js全局变量和模块。
    // 这可以使最初为nodejs编写的代码可以在浏览器端运行
    node: {
        // 这个配置是一个对象，其中的每个属性都是nodejs全局变量或模块的名称
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        // false表示什么都不提供。如果获取此对象的代码，可能会因为获取不到此对象而触发ReferenceError错误
        // setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        // 设置成empty则表示提供一个空对象
        // dgram: 'empty',
        // fs: 'empty',
        // net: 'empty',
        // tls: 'empty',
        // child_process: 'empty'
    }
}
