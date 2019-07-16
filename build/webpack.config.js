const path = require('path')
const os = require('os')
const CleanPlugin = require('clean-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const createHappyPlugin = (id, loaders) => new HappyPack({
  id: id,
  loaders: loaders,
  threadPool: happyThreadPool,
  verbose: process.env.HAPPY_VERBOSE === '1' // make happy more verbose with HAPPY_VERBOSE=1
});

module.exports = {
  entry: {
    'app': path.resolve(__dirname, '../src/index.js')
  },
  output: {
    library: 'NetworkGraph',
    libraryTarget: 'umd',
    libraryExport: 'default', // if use export default need to add this config

    filename: 'network-graph.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js(x?))$/,
        exclude: /node_modules/,
        loader: "happypack/loader?id=happy-babel"
      },
      {
        test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CleanPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
    }),
    createHappyPlugin('happy-babel', [{
      loader: 'babel-loader',
      options: {
        babelrc: true,
        cacheDirectory: true // start cache
      }
    }])
  ],
  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({ // multi process compress
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          warnings: false,
          compress: {
            drop_console: false,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      }),
    ]
  }
}