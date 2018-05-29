'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

const glob = require('glob')
// 页面模板
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 取得相应的页面路径，因为之前的配置，所以是src文件夹下的views文件夹
const PAGE_PATH = path.resolve(__dirname, '../src/views')
// 用于做相应的merge处理
const merge = require('webpack-merge')

// 多页面入口配置，通过glob模块读取views文件夹下所有对应文件夹下的js后缀文件，作为入口文件处理
exports.entries = function () {
  var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
  var entries = {},
    basename,
    tmp,
    pathname;
  entryFiles.forEach((entry) => {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split("/").splice(-3);
    pathname = tmp.splice(1, 1) + "/" + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  })
  return entries
}

// 多页面输出配置,与上面的多页面入口配置相同，读取views文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function () {
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
  let htmlentries = []
  let basename,
    tmp;
  entryHtml.forEach((filePath) => {
    basename = path.basename(filePath, path.extname(filePath));
    tmp = filePath.split("/").splice(-3);
    let filename = tmp.splice(1, 1) + "/" + basename; // 正确输出js和html的路径
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      inject: true
    }
    if (process.env.NODE_ENV === 'product') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }
    htmlentries.push(new HtmlWebpackPlugin(conf))
  })
  return htmlentries
}


exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    process.env.NODE_ENV === 'testing' ? 
    "test" : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
