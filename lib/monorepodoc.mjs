#!/usr/bin/env node

import log from './logger.mjs'

import { bold } from 'colorette'
import { getDistDir, getDocsDir, getPackages, getRoot } from './paths.mjs'
import { expectDirs } from './artifacts.mjs'
import { compileResources } from './resources.mjs'
import { compileDocs } from './jsdoc.mjs'

const cleanupOutput = async output => {
  if (output.cleanup) {
    log.debug(`Cleanup ${output.path}`)
    await output.cleanup()
  }
}

const cleanupOutputs = outputs => Promise.all(outputs.map(cleanupOutput))

const cleanupPackage = pkg => cleanupOutputs(pkg.outputs)

const generatePackageDocs = async pkg => {
  pkg.tmpDir = { path: pkg.distDir }
  log.info(
    `Compiling ${bold(`${pkg.name}-${pkg.version}`)} with ${
      pkg.resources.length
    } resources`
  )
  await compileResources(pkg)
  await compileDocs(pkg)
}

const main = async () => {
  const root = getRoot(process.cwd())
  const packages = getPackages(root)
  let cleaned = false

  const exitHandler = async (options, exitInfo) => {
    if (options.exit && exitInfo instanceof Error) {
      log.error(exitInfo)
      log.error(exitInfo.stdout)
      log.error(exitInfo.stderr)
    }
    if (!cleaned) {
      cleaned = true
      try {
        await Promise.all(packages.map(cleanupPackage))
      } catch (e) {
        log.error(e)
      }
    }
    if (options.exit) {
      process.exit(exitInfo)
    }
  }
  process.on('exit', exitHandler.bind(null, { cleanup: true }))
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

  await expectDirs(getDistDir(root), getDocsDir(root))
  for (const pkg of packages) {
    await generatePackageDocs(pkg)
  }
}

main()
