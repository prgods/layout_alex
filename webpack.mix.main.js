const path = require('path')
const mix = require('laravel-mix')
const OnlyIfChangedPlugin = require('only-if-changed-webpack-plugin');

const opts = {
  rootDir: path.join(__dirname, 'frontend/web/'),
  devBuild: process.env.NODE_ENV !== 'production',
};

mix.config.vue.esModule = true
mix.config.fileLoaderDirs.fonts = './build/fonts';

mix
    .js('src/main/scripts/app.js', 'frontend/web/build/js')
    .sass('src/main/style/app.scss', 'frontend/web/build/css')
    .copyDirectory('src/main/fonts/', 'frontend/web/build/fonts')
    .copyDirectory('src/main/img/', 'frontend/web/build/img')

    .sourceMaps()
    .setPublicPath('frontend/web/')
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
      '~': path.join(__dirname, './src/main/scripts')
    }
  },
  output: {
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: mix.config.hmr ? '//localhost:8080' : '/'
  }
})
