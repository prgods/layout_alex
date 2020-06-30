const path = require('path')
const mix = require('laravel-mix')
const OnlyIfChangedPlugin = require('only-if-changed-webpack-plugin');

const opts = {
  rootDir: path.join(__dirname, 'backend/web/'),
  devBuild: process.env.NODE_ENV !== 'production',
};
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

mix.config.vue.esModule = true
mix.config.fileLoaderDirs.fonts = './build/fonts';

mix
    .js('src/admin/scripts/app.js', 'backend/web/build/js')
    .sass('src/admin/style/app.scss', 'backend/web/build/css')
    .copyDirectory('src/admin/fonts/', 'backend/web/build/fonts')
    .copyDirectory('src/admin/img/', 'backend/web/build/img')

    .sourceMaps()
    .setPublicPath('backend/web/')
    .disableNotifications()

if (mix.inProduction()) {
  mix.version()

  mix.extract([
    'jquery',
    'popper.js',
    'js-cookie',
    'bootstrap',
  ])
}

mix.webpackConfig({
  // plugins: [
  //   new OnlyIfChangedPlugin({
  //     cacheDirectory: path.join(opts.rootDir, '/tmp/cache'),
  //     cacheIdentifier: opts, // all variable opts/environment should be used in cache key
  //   })
  // ],
  resolve: {
    extensions: ['.js', '.json',],
    alias: {
      '~': path.join(__dirname, './src/admin/scripts')
    }
  },
  output: {
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: mix.config.hmr ? '//localhost:8080' : '/'
  }
})
