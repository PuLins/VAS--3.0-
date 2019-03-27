// 配置文件
const path = require('path')

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    baseUrl: process.env.baseUrl,
    outputDir: process.env.outputDir,
    assetsDir: process.env.assetsDir,
    lintOnSave: true,

    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
        } else {
            // 为开发环境修改配置...
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('api', resolve('src/api'))
            .set('utils', resolve('src/utils'))
            .set('store', resolve('src/store'))
            .set('router', resolve('src/router'))

        config.resolve.extensions
            .add('.js')
            .add('.vue')
            .add('.styl')
            .add('.css')

        config.module.rule('svg').uses.clear()
        config.module.rule('svg').use('raw-loader').loader('raw-loader')
        // config.module.rule('url')
        //   .test(/\.(eot|svg|ttf|woff|woff2?)(\?.*)?$/)
        //   .use('url')
        //     .loader('url-loader')
        //     .end()


        //config.when(process.env.NODE_ENV === 'production', config =>
        //  config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
        //)
    },

    productionSourceMap: true,
    css: {
        sourceMap: false
    },

    devServer: {
        open: process.platform === 'darwin',
        // host: '0.0.0.0',
        port: 10000,
        https: false,
        hotOnly: false,
        proxy: {
            '/admin': {//用户 中心
                target: 'http://dev.wwvas.com:9999',//测试服务器
            },
            '/insurance': {
                target: 'http://dev.wwvas.com:9999',//测试服务器
            },
            '/business':{
                target: 'http://dev.wwvas.com:9999',//测试服务器
                // target: 'http://192.168.50.97:9999',//刘林
                // target: 'http://192.168.50.232:9999',//张洋
            },
            '/workflow':{
                target: 'http://dev.wwvas.com:9999',//测试服务器
                // target: 'http://192.168.50.232:9999',//张洋
            },
             '/sto': {
                target: 'http://dev.wwvas.com:9999',//测试服务器
                // target: 'http://192.168.50.232:9999',//张洋
                // target: 'http://192.168.50.198:9999',//廖
            },
            '/template': {
                target: 'http://dev.wwvas.com',//测试服务器
            },
            '/auth': {//登陆
                target: 'http://dev.wwvas.com:9999',//测试服务器
                changeOrigin: true,
                pathRewrite: {
                    '^/auth': '/auth'
                }
            },
            '/admindept': {//行政管理
                target: 'http://dev.wwvas.com:4100',//测试服务器
            },
            '/vasms-web/': {
                /*****测试环境******/
                target: 'http://dev.wwvas.com',
                secure: false
            },
            '/oauth/': {
                target: 'http://openapi.qzone.qq.com/',
                secure: false
            },
            '/image/': {
                target: 'http://dev.wwvas.com',
                secure: false
            },
            '/img/': {
                target: 'http://222.212.141.40:9104',
                secure: false
            },
            '/gisapiservice/': {
                target: 'http://139.219.109.157:9204'
            },
            '/ueditor/': {
                target: 'http://192.168.0.213:8080/vasms-web/',
                secure: false
            },
            '/iData/': {
                target: 'http://test.wwvas.com/',
                secure: false
            },
            '/jim/': {
                target: 'http://139.219.98.197:2002',
                secure: false
            }
        },
    }
}
