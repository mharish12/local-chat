const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  // Your entry point (adjust as necessary)
  entry: './src/index.js',
  devtool: 'source-map',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Resolve fallback configuration
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      // Add other fallbacks as necessary
    },
  },

  // Plugins for polyfills
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],

  // Module rules (if needed for loaders)
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      // Add other rules as necessary
    ],
  },

  // Development mode for easier debugging
  mode: 'development',
};
