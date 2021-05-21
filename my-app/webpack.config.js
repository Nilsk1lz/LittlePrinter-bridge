const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const Autoprefixer = require("autoprefixer");

module.exports = (env, { mode = "development" }) => ({
  resolve: {
    symlinks: false,
    modules: ["node_modules"],
  },
  entry: "./main.js",
  devtool: mode === "production" ? "" : "inline-source-map",
  output: {
    publicPath: "/",
    path: `${__dirname}/build/${mode === "production" ? "dist" : "dev"}`,
    filename: `[name].js`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`,
    }),
    new CleanWebpackPlugin([`build/${mode === "production" ? "dist" : "dev"}`]),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inlineSource: ".(js|css)$", // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.(scss|css)$/,
        use: [
          mode === "production"
            ? { loader: MiniCssExtractPlugin.loader }
            : { loader: "style-loader", options: { sourceMap: true } },
          {
            loader: "css-loader",
            options: { sourceMap: mode === "development" }, // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run post css actions
            options: {
              sourceMap: mode === "development",
              ident: "postcss",
              plugins() {
                // post css plugins, can be exported to postcss.config.js
                return [Autoprefixer];
              },
            },
          },
        ],
      },
    ],
  },
  optimization:
    mode === "production"
      ? {
          minimizer: [new UglifyJsPlugin({}), new OptimizeCSSAssetsPlugin({})],
        }
      : {},
});
