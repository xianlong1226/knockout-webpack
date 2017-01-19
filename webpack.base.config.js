var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var glob = require('glob');
var extractCss = new ExtractTextPlugin('assets/css/[name].css');
var extractHtml = new ExtractTextPlugin('[name].html');

var config = {
  entry: {
    vendors: [
      __dirname + '/components/browser-helper',
      'jquery',
      'knockout',
      __dirname + '/vendors/knockout.mapping.js',
      __dirname + '/vendors/jqPaginator.min.js',
      __dirname + '/common/base.js',
      __dirname + '/common/base.scss',
      __dirname + '/vendors/jquery.cookie.js',
      __dirname + '/vendors/notify/notify.js',
      __dirname + '/vendors/notify/notify.css'
    ]
  },
  output: {
    path: path.join(__dirname , '../public/'),
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/chunk_[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: require.resolve('jquery'),
      loader: 'expose?$!expose?jQuery'
    }, 
    {
      test: require.resolve('knockout'),
      loader: 'expose?ko'
    }, 
    {
      test: require.resolve(__dirname + '/vendors/knockout.mapping.js'),
      loader: 'expose?komapping'
    }, 
    {
      test: require.resolve(__dirname + '/common/base.js'),
      loader: 'expose?base'
    }, 
    // {
    //   test: /\.js$/,
    //   loader: 'babel',
    //   exclude: /node_modules/,
    //   query: {
    //     presets: ['es2015']
    //   }
    // }, 
    {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.s?css$/,
      loader: extractCss.extract('style', 'css?{"discardComments":{"removeAll":true}}!sass')
    }, {
      test: /\.html$/,
      exclude: /page\.html$/,
      loader: 'html?minimize=true&removeComments=false'
    }, {
      test: /page\.html$/,
      loader: extractHtml.extract('html?minimize=true&removeComments=false')
    }, {
      test: /\.woff2?(\?[\s\S]+)?$/,
      loader: 'url?limit=10000&name=assets/fonts/[name].[ext]'
    }, {
      test: /\.(svg|ttf|eot)(\?[\s\S]+)?$/,
      loader: 'file?limit=10000&name=assets/fonts/[name].[ext]'
    }, {
      test: /\.(png|gif|jpg|jpeg)$/,
      loader: 'url?limit=10000&name=assets/images/[name].[ext]'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'ko': 'knockout',
      'ko.mapping': 'vendors/knockout.mapping.js',
      'base': 'common/base.js'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    extractCss,
    extractHtml,
    new CopyWebpackPlugin([
      {from: __dirname + '/vendors/knockout-3.4.1.js',to:'assets/js/knockout.js'},
      {from: __dirname + '/vendors/knockout.mapping.js',to:'assets/js/knockout.mapping.js'}
    ])
  ],
  resolve: {
    root: [
      __dirname
    ],
    alias: {
      datatables: path.resolve(__dirname + '/vendors/remark/global/vendor/datatables/jquery.dataTables.js'),
      'datatables.net': path.resolve(__dirname + '/vendors/remark/global/vendor/datatables/jquery.dataTables.js')
    }
  }
};

var entries = glob.sync(__dirname + '/pages/*').map(function (entry) {
  return {
    name: path.basename(entry),
    path: entry
  }
});
entries.forEach(function (entry) {
  config.entry[entry.name] = entry.path
});
entries = entries.map(function (entry) {
  return entry.name
});

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'common',
  chunks: entries,
  minChunks: entries.length > 3 ? Math.ceil(entries.length * 2.0 / 3) : 3 // common chunks should be refered by more than 2/3 entries
}));
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'vendors',
  minChunks: Infinity
}));

module.exports = config;
