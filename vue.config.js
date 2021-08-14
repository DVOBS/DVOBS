/* eslint-disable*/
const config= {
  publicPath: '',
  pages: {
    index: 'src/main.ts'
  },
  transpileDependencies: [
    'resize-detector'
  ]
}

if (process.env.NODE_ENV !== 'production') {
  config.pages = {
    index: 'src/main.ts',
    dev: 'tests/dev/main.ts'
  }
}

module.exports = config
