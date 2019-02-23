/*
	config for build umd module to use
* */
const path = require('path');
const base = require('./webpack.base');
const merge = require('webpack-merge');
const root = p => path.join(__dirname, '..', p);
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  entry: root('src/package/main.js'),
  output: {
	path: path.resolve(__dirname, '../lib'),
	filename: 'toast.js',
	publicPath: '/',
	library: 'Toast',
	libraryTarget: 'umd',
	libraryExport: 'default', // 需要暴露的模块
	umdNamedDefine: true,
  },
  performance: false,
  optimization: {
	minimize: true,
  },
  plugins: [
	// new BundleAnalyzerPlugin(),
	new OptimizeCSSAssetsPlugin({
	  assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
	  cssProcessor: require('cssnano'),
	  cssProcessorOptions: {
		discardComments: {removeAll: true},
		safe: true,
		autoprefixer: false,
	  },
	  canPrint: true,
	}),
  ],
});

