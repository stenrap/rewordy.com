var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: ['./public/js/entry'],
  output: {
    path: '/Users/rob/code/rewordy.com/public/js',
    filename: 'bundle.js',
    publicPath: '/js/'
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
  resolve: {
    extensions: ['', '.js', '.less']
  },
  plugins: [
    new ExtractTextPlugin("../css/bundle.min.css")
  ]
};