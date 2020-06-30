const Webpack = require("webpack");
const fs = require("fs");
const Path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
// const FileManagerPlugin = require("filemanager-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const opts = {
  rootDir: process.cwd(),
  devBuild: process.env.NODE_ENV !== "production"
};

function generateHtmlPlugins(templateDir) {
  const templateDirents = fs.readdirSync(Path.resolve(__dirname, templateDir), { withFileTypes: true });

  const templateFiles = templateDirents
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);

  return templateFiles.map(item => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    const templatePath = Path.resolve(__dirname, `${templateDir}/${name}.${extension}`);

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: templatePath,
      inject: false,
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/html");

module.exports = {
  entry: {
    admin: [
      "./src/js/admin.js",
      "./src/scss/admin.scss",
    ],
    main: [
      "./src/js/main.js",
      "./src/scss/main.scss",
    ],
    app: [
      "./src/js/app.js",
      "./src/scss/app.scss",
    ],
    settings: [
      "./src/js/settings.js",
    ],
    classic: [
      "./src/scss/classic.scss",
    ],
    modern: [
      "./src/scss/modern.scss",
    ],
    corporate: [
      "./src/scss/corporate.scss",
    ],
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devtool:
    process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map",
  output: {
    path: Path.join(opts.rootDir, "dist"),
    pathinfo: opts.devBuild,
    filename: "js/[name].js"
  },
  performance: { hints: false },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 5
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // Remove empty js files from /dist
    new FixStyleOnlyEntriesPlugin(),
    // Extract css files to seperate bundle
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    // jQuery and PopperJS
    new Webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      jquery: "jquery",
      "window.$": "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"]
    }),
    // Copy fonts and images to dist
    new CopyWebpackPlugin([
      { from: "src/fonts", to: "fonts" },
      { from: "src/img", to: "img" }
    ]),
    // Speed up webpack build
    new HardSourceWebpackPlugin(),
    // // Copy dist folder to docs/dist
    // new FileManagerPlugin({
    //   onEnd: {
    //     copy: [{ source: "./dist/**/*", destination: "./docs" }]
    //   }
    // }),
    // Ignore momentjs locales
    new Webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
  ].concat(htmlPlugins),
  module: {
    rules: [
      // Babel-loader
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader?cacheDirectory=true"]
      },
      // Css-loader & sass-loader
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      // Load fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "/[name].[ext]",
              outputPath: "fonts/",
              publicPath: "../fonts/"
            }
          }
        ]
      },
      // Load images
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/",
              publicPath: "../img/"
            }
          }
        ]
      },
      // Expose loader
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: "jQuery"
          },
          {
            loader: "expose-loader",
            options: "$"
          }
        ]
      },
      {
        test:/\.html$/,
      //   include: [
      //     Path.resolve(__dirname, "src/html/main-includes"),
      //     Path.resolve(__dirname, "src/html/admin-includes"),
      //   ],
        use: [
          'raw-loader',
          {
            loader: 'twig-html-loader',
            options: {
            //   data: {
            //     page: {
            //       title: 'page title'
            //     },
            //     title: 'hello'
            //   },
              namespaces: {
                // layouts: path.resolve(__dirname, './app/twig/templates'),
                components: Path.resolve(__dirname, './src/html/main-includes'),
                components: Path.resolve(__dirname, './src/html/admin-includes'),
              },
            },
          },
        ]
      },
    ]
  },
  resolve: {
    extensions: [".js", ".scss"],
    modules: ["node_modules"],
    alias: {
      request$: "xhr"
    }
  },
  devServer: {
    // contentBase: Path.join(__dirname, "docs"),
    contentBase: Path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
    open: true
  }
};
