const webpack = require('webpack');
const base = require('./webpack.base.config.js');

const config = Object.assign(base, {
  entry: './src/main.js',
  output: {
    path: `${__dirname}/src/build/`,
    publicPath: '/build/',
    filename: '[name].js',
  },
  devtool: 'cheap-source-map',
  devServer: {
    port: 8080,
    historyApiFallback: true
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true })
  ],
  module: Object.assign({
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      }
    ]
  }, base.module)
});

module.exports = config;
