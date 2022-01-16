/* eslint-disable */

const path = require('path');
const { EnvironmentPlugin, ProvidePlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV = 'development', HOST = '0.0.0.0', PORT = '8000' } = process.env;

/** @type {import('webpack').Configuration} */
const config = (module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: {
    main: './src/index.tsx',
    worker: './src/worker.ts',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es6',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    //
    new EnvironmentPlugin(),
    new ProvidePlugin({ React: 'react' }),
    new HtmlWebpackPlugin({ chunks: ['main'] }),
  ],
});

if (NODE_ENV === 'development') {
  config.plugins.push(new ReactRefreshWebpackPlugin());

  config.devServer = {
    host: HOST,
    port: Number(PORT),
    client: {
      logging: 'warn',
    },
  };
}

if (NODE_ENV === 'production') {
  config.mode = 'production';
}
