module.exports = {
  module: {
    loaders: [
      {test: /\.js$/, loader: 'eslint-loader'}
    ]
  },
  entry: './app/index.js',
  output: {
    filename: './app/static/index.js'
  },
  eslint: {
    configFile: '.eslintrc'
  }
}
