const path = require('node:path');
const plugins = require('./webpack.plugins');
const rules = require('./webpack.rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	target: 'electron-renderer',
	entry: './workspaces/sound-capture-app/src/sound-capture.ts',
	output: {
		filename: 'sound-capture.js',
		path: path.resolve(__dirname, 'workspaces/sound-capture-app/.dist'),
	},
	module: {
		rules: rules,
	},
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx'],
		modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
	},
	plugins: [
		...plugins,
		new HtmlWebpackPlugin({
			filename: 'sound-capture.html',
			template: path.resolve(
				__dirname,
				'workspaces/sound-capture-app/src/sound-capture.html'
			),
		}),
	],
};
