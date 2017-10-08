const base = require('./webpack.base.config.js');
const webpack = require('webpack');

process.env.NODE_ENV = 'production';

const config = Object.assign({
  entry: './src/main.js',
  output: {
    path: './src/build/',
    filename: '[name].js',
  },
  debug: false,
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ]
}, base);

module.exports = config;
