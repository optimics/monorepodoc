import log from './logger.mjs'
import which from 'which'

import { exec } from 'child_process'
import { join } from 'path'

export const getBinaryPath = (pkgRoot, binary) =>
  which.sync(binary, {
    path: `${join(pkgRoot, 'node_modules', '.bin')}:${process.env.PATH}`,
  })

export const isBinaryAvailable = (pkgRoot, binary) => {
  try {
    return Boolean(getBinaryPath(pkgRoot, binary))
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    }
    throw e
  }
}

export const execute = async (cmd, options) =>
  await new Promise((resolve, reject) => {
    log.debug(cmd)
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        err.stderr = stdout
        err.stderr = stderr
        reject(err)
      } else {
        resolve({ stderr, stdout })
      }
    })
  })

export const bindExitHandler = handler => {
  process.on('exit', handler.bind(null, { cleanup: true }))
  process.on('SIGINT', handler.bind(null, { exit: 3 }))
  process.on('SIGUSR1', handler.bind(null, { exit: 1 }))
  process.on('SIGUSR2', handler.bind(null, { exit: 2 }))
  process.on('uncaughtException', handler.bind(null, { exit: 255 }))
}
