#!/usr/bin/env node

import log from './logger.mjs'
import ora from 'ora'
import prettyBytes from 'pretty-bytes'

import { bold } from 'colorette'
import { relative } from 'path'
import { getDistDir, getDocsDir, getPackages, getRoot } from './paths.mjs'
import { expectDirs } from './artifacts.mjs'
import { generatePackageDocs } from './docs.mjs'

const cleanupOutput = async output => {
  if (output.cleanup) {
    log.debug(`Cleanup ${output.path}`)
    await output.cleanup()
  }
}

const cleanupOutputs = outputs => Promise.all(outputs.map(cleanupOutput))

const cleanupPackage = pkg => cleanupOutputs(pkg.cleanups)

const getSpinnerLabel = (pkg, index, total) => {
  const length = pkg.resources.length
  const progress = `${index}/${total}`
  const label = bold(`${pkg.identity}`)
  return `Compiling ${label} with ${length} resources (${progress})`
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
  const spinner = ora('Compiling package documentation').start()

  for (const [index, pkg] of packages.entries()) {
    spinner.text = getSpinnerLabel(pkg, index, packages.length)
    await generatePackageDocs(pkg)
  }
  const outputs = packages.map(pkg => pkg.outputs).flat()
  spinner.stopAndPersist({
    symbol: '✓',
    text: `Generated ${bold(`${outputs.length} artifacts`)}`,
  })
  log.info()
  for (const output of outputs) {
    const size = prettyBytes(output.stat.size)
    log.info(`${relative(root, output.path)}(${size})`)
  }
}

main()
