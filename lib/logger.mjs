import pino from 'pino'

export default pino({
  level: process.env.MONOREPODOC_DEBUG || 'info',
  transport: {
    target: './pinoPrettyTransport',
  },
})
