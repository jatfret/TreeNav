var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'webpack-hot-middleware/client',
      './src/app',
      './src/style'
    ],
    vendors: ['react', 'react-dom', 'react-router'],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/static'),
    publicPath: '/static/',
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: ['node_modules'],
      use: ['react-hot-loader', 'babel-loader'],
    },{
      test: /\.scss$/,
      include: [path.resolve(__dirname, 'src')],
      use: [
        {loader: 'style-loader'},
        {
          loader:'css-loader',
          options: {
            //modules: true,
            //localIdentName: '[name]__[local]-[hash:base64:5]'
          }
        },
        {
          loader: 'sass-loader',
          options: {sourceMap: true, sourceMapContents:true}
        }
      ]
    }],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js'}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
