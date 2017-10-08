const webpack = require('webpack');
const nib = require('nib')();
const path = require('path');
const basePath = path.resolve('./src');

module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['es2015', 'react'],
        plugins: ['transform-object-rest-spread']
      }
    },
    {
      test: /\.svg$/,
      loader: 'svg-url-loader',
      options: { noquotes: true }
    },
    {
      test: /\.styl$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader',
          options: { sourceMap: true, modules: true, imporLoaders: 1 }
        },
        { loader: 'stylus-loader',
          options: {
            paths: `${basePath}/common/styles`,
            use: [nib],
            import: ['~nib/lib/nib/index.styl']
          }
        }
      ]
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }
    ]
  },
  resolve: {
    extensions: ['.js', '.styl'],
    alias: {
      '@base': basePath,
      '@resources': `${basePath}/resources`,
      '@common': `${basePath}/common`
    }
  },
  cache: true
};
