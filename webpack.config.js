const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    devServer: {
      static: './dist',
      hot: true,
      port: 3000
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern'
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        title: 'Mueblecito - MDF Cut Plan Generator'
      }),
      new HtmlWebpackPlugin({
        template: './src/how-to-use.html',
        filename: 'how-to-use.html',
        inject: false
      }),
      new HtmlWebpackPlugin({
        template: './src/como-usar.html',
        filename: 'como-usar.html',
        inject: false
      }),
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css'
      })] : [])
    ],
    resolve: {
      extensions: ['.js']
    }
  };
};
