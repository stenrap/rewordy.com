var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: './public/js/index.js',
  output: {
    path: '/Users/rob/code/rewordy.com/public/js',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },
      {
        test: /.js$/,
        loader: 'jsx-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("../css/bundle.min.css")
  ]
};