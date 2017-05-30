var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtracttextPlugin = require('Extract-text-webpack-plugin');
var cssnano = require('cssnano');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./src/app'],
    vendors: ['react', 'react-dom', 'react-router'],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },

  module: {
    loaders: [{
      test: /\.js?$/,
      include: [path.resolve(__dirname, 'js')],
      exclude: ['node_modules'],
      loaders: ['react-hot', 'babel'],
    },{
      test: /\.scss$/,
      include: [path.resolve(__dirname, 'src')],
      loaders: ExtracttextPlugin.extract('style-loader','css!postcss!sass'),
    }],
  },

  postcss: [
    cssnano({
      sourcemap:true,
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 version', 'Chrome 31', 'Safari 8'],
        discardComments: {
          removerAll: true,
        },
      }
    })
  ],

  resolve: {
    extension: ['', '.js', '.jsx', '.scss', '.css'],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: false,
    }),
    new ExtracttextPlugin('style.css', {
      allChunks: true,
    }),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        unuse: true,
        dead_code: true,
      },
    }),
  ],
}
