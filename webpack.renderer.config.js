const path = require('node:path');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
	test: /\.css$/,
	use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
	target: 'electron-renderer',
	module: {
		rules,
	},
	plugins: plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
		modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
	},
};
