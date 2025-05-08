const path = require("node:path");
const plugins = require("./webpack.plugins");
const rules = require("./webpack.rules");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "electron-renderer",
  entry: {
    "sound-capture": "./workspaces/sound-capture-app/src/sound-capture.ts",
    "sound-capture-preload":
      "./workspaces/sound-capture-app/src/sound-capture.preload.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "workspaces/sound-capture-app/.dist"),
  },
  module: {
    rules: rules,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
  },
  plugins: [
    ...plugins,
    new HtmlWebpackPlugin({
      filename: "sound-capture.html",
      template: path.resolve(
        __dirname,
        "workspaces/sound-capture-app/src/sound-capture.html",
      ),
      chunks: ["sound-capture"],
    }),
  ],
};
