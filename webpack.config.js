var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  cache: true,
  entry: {
    app: './src/main.jsx',
    vendor: [
      'three', 
      'react', 
      'react-router', 
      'q', 
      './src/reset.css'
    ],
  },
  output: {
    path: 'build',
    // publicPath: 'build/',
    filename: '[name]-[hash].js',
    chunkFilename: 'chunk-[chunkhash].js',
    sourceMapFilename: '[name]-[hash].map'
  },
  module: {
    noParse: [
      /[\-\.]min\.js/, 
    ],
    loaders: [
      { test: /\.html$/, loader: 'html' },
      // required to write "require('./style.css')"
      { test: /\.css$/, loader: 'style!css!autoprefixer-loader?{"browsers":["last 2 version", "IE 9"]}' },
      { test: /\.scss$/, loader: 'style!css!autoprefixer-loader?{"browsers":["last 2 version", "IE 9"]}!sass' },
      // react jsx
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' },

      // required for bootstrap icons
      { test: /\.woff/,loader: 'url-loader' },
      { test: /\.ttf/, loader: 'file-loader' },
      { test: /\.eot/, loader: 'file-loader' },
      { test: /\.svg/, loader: 'file-loader' },
      { test: /\.jpg/, loader: 'file-loader' },
      { test: /\.png/, loader: 'file-loader' },
      { test: /\.jpeg/, loader: 'file-loader' },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      comments: /liuyanghejerry/
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor-[chunkhash].js'),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
