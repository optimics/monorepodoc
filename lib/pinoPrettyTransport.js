const pretty = require('pino-pretty')

const levelColorize = pretty.colorizerFactory(true)
const levelPrettifier = logLevel => `LEVEL: ${levelColorize(logLevel)}`

module.exports = opts =>
  pretty({
    ...opts,
    ignore: 'level,time,pid,hostname',
    customPrettifiers: { level: levelPrettifier },
  })
