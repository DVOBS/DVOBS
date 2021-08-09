/* eslint-disable*/
const config= {

}

if (process.env.NODE_ENV !== 'production') {
  config.pages = {
    index: 'src/main.ts',
    dev: 'tests/dev/main.ts'
  }
}

module.exports = config
