import fg from 'fast-glob'

import { docsDir, exists } from './fs.mjs'
import { getResourceDrivers } from './resources.mjs'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import { ReachedRoot } from './errors.mjs'

const defaultVersion = '0.0.0'
const distDir = 'dist'
const packageFile = 'package.json'
const packageSources = ['packages/*']

export const getDistDir = root => join(root, distDir)
export const getDocsDir = root => join(getDistDir(root), docsDir)

const hasPackageFile = dir => exists(join(dir, packageFile))
const isUnique = (item, index, array) => array.indexOf(item) === index

export const getRoot = dir => {
  if (!dir || dir === '/') {
    throw new ReachedRoot('Reached root while looking for package.json')
  }
  if (hasPackageFile(dir)) {
    return dir
  }
  return getRoot(resolve(dir, '..'))
}

const getPackageDirs = root =>
  [
    root,
    ...fg.sync(
      packageSources.map(src => join(root, src)),
      { onlyFiles: false }
    ),
  ]
    .filter(hasPackageFile)
    .filter(isUnique)

const getPackageResources = pkg =>
  getResourceDrivers(pkg)
    .map(driver => driver.detect(pkg))
    .flat()
    .filter(Boolean)

const getPackageMetaData = (root, dir) => {
  const npm = JSON.parse(readFileSync(join(dir, packageFile)))
  const version = npm.version || defaultVersion
  const identity = `${npm.name}-${version}`
  const docsPath = getDocsDir(root)
  const pkg = {
    archive: join(docsPath, `${identity}.zip`),
    dependencies: npm.dependencies,
    dir,
    name: npm.name,
    identity,
    root,
    outputs: [],
    cleanups: [],
    distDir: join(docsPath, identity),
    version,
  }
  pkg.resources = getPackageResources(pkg)
  return pkg
}

export const getPackages = root =>
  getPackageDirs(root).map(dir => getPackageMetaData(root, dir))
