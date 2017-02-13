var path = require('path');
var webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');
var htmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var glob = require('glob');

//将css提取出来保存为单独的文件
var extractCss = new extractTextPlugin('assets/css/[name].css');
//html提取出来保存为单独的文件
var extractHtml = new extractTextPlugin('[name].html');

var config = {
    //入口文件配置
    entry: {
        'vendors': [
            path.resolve(__dirname, 'components/browser-helper'),
            'jquery',
            'knockout',
            path.resolve(__dirname, 'common/base.js'),
            path.resolve(__dirname, 'common/base.scss'),
            path.resolve(__dirname, 'vendors/knockout.mapping.js'),
            path.resolve(__dirname, 'vendors/jqPaginator.min.js'),
            path.resolve(__dirname, 'vendors/jquery.cookie.js'),
            path.resolve(__dirname, 'vendors/notify/notify.js'),
            path.resolve(__dirname, 'vendors/notify/notify.css')
        ]
    },
    //入口文件输出配置
    output: {
        publicPath: '/', //静态资源前添加的路径，例如css中引用的图片路径会加上publicPath设置的值
        path: path.resolve(__dirname, 'build'), //打包后的文件存放的路径
        filename: 'assets/js/[name].js', //文件名
        chunkFilename: 'assets/js/chunks/[name].js' //入口文件中动态加载的模块
    },
    module: {
        //加载器配置
        loaders: [{
                //把你的模块中引用的jquery模块公布到全局作用域，可以通过$和jQuery访问。
                //如果你的模块中没有引用jquery模块，那它将不起作用。
                test: require.resolve('jquery'),
                loader: 'expose?$!expose?jQuery'
            }, {
                test: require.resolve('knockout'),
                loader: 'expose?ko'
            }, {
                test: require.resolve(__dirname + '/vendors/knockout.mapping.js'),
                loader: 'expose?komapping'
            }, {
                test: require.resolve(__dirname + '/common/base.js'),
                loader: 'expose?base'
            }, {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.s?css$/,
                loader: extractCss.extract(['css?{"discardComments":{"removeAll":true}}!sass'])
            },
            {
                test: /\.html$/,
                exclude: /page\.html$/,
                loader: 'html?collapseWhitespace=true&removeComments=false'//删除标签之间的空格和页面中的注释
            }, 
            // {
            //     test: /page\.html$/,
            //     loader: extractHtml.extract('html?collapseWhitespace=true&removeComments=false')
            // }, 
            {
                test: /\.woff2?(\?[\s\S]+)?$/,
                loader: 'url?limit=10000&name=assets/fonts/[name].[ext]'
            }, {
                test: /\.(svg|ttf|eot)(\?[\s\S]+)?$/,
                loader: 'file?limit=10000&name=assets/fonts/[name].[ext]'
            }, {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader?limit=10000&name=assets/images/[name].[ext]' //css中引用的图片路径将被替换为output.publicPath+这里的name
            }
        ]
    },
    //插件项
    plugins: [
        extractCss,
        // extractHtml,
        new webpack.ProvidePlugin({
            //一般如果我们要在某个模块中使用jquery这个模块的话要这样写：var $=require('jquery');
            //某些第三方库可能也直接依赖了jquery；
            //而我们通过ProvidePlugin这个插件的话就不需要自己引用jquery模块了，插件会自动帮我们引用;
            //ProvidePlugin插件将会把jquery模块的module.exports赋值给$;
            //所以，我们直接在模块中使用$就行了。
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'ko': 'knockout',
            'ko.mapping': 'vendors/knockout.mapping.js',
            'base': path.resolve(__dirname, 'common/base.js')
        }),
        new CopyWebpackPlugin([{
            from: __dirname + '/vendors/knockout-3.4.1.js',
            to: 'assets/js/knockout.js'
        }, {
            from: __dirname + '/vendors/knockout.mapping.js',
            to: 'assets/js/knockout.mapping.js'
        }])
    ],
    resolve: {
        root: [
            //指定你的入口文件中要引用的模块的根目录
            //例如a.js中的require('js/lazyload/lazyload1')
            //如下设置就告诉webpack引用模块时从项目的根目录下查找
            path.resolve('.')
        ],
        alias: {

        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        publicPath: '/',
        stats: {
            colors: true
        },
        proxy: require(path.resolve(__dirname, 'locals/index.js')),
        historyApiFallback: false,
        inline: true,
        progress: true
    },
    devtool: 'cheap-module-source-map',
    compress: true,
    colors: true,
    progress: true,
    debug: true
};

//业务入口文件所在的目录
var entryDir = path.join(__dirname, 'pages/');
var entries = glob.sync(entryDir + '*').map(function(entry) {
    return {
        name: path.basename(entry),
        path: entry
    }
});

entries.forEach(function(entry) {
    //添加entry
    config.entry[entry.name] = [entry.path];

    //生成html
    config.plugins.push(new htmlWebpackPlugin({
        filename: entry.name + '.html',
        template: entry.path + '/page.html',
        chunks: ['vendors', 'common', entry.name],
        hash: true,
        minify: {
            removeComments: false,//千万不能去掉注释，因为knockout在页面中加了很多注释引入
            collapseWhitespace: true
        }
    }));

});

entries = entries.map(function(entry) {
    return entry.name;
});

//默认会把所有入口文件中的中公共的代码提取出来，生成一个common.js文件
//new webpack.optimize.CommonsChunkPlugin('js/common.js'),
//我们也可以指定某几个入口来提取公共代码，生成一个common.js文件
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    chunks: entries
}));
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    minChunks: Infinity
}));

module.exports = config;