import { dirname } from 'path'
import { file } from 'tmp-promise'
import { writeFile } from 'fs/promises'
import { execute } from './cli.mjs'

const configBase = {
  source: {
    includePattern: '.+\\.(js|mjs)(doc|x)?$',
    excludePattern: 'node_modules',
  },
  templates: {
    default: {
      staticFiles: {
        includePattern: '.+\\.(jpg|jpeg|gif|webp|png)',
      },
    },
  },
}

export const getTmpConfig = async () => {
  const fp = await file()
  await writeFile(fp.path, JSON.stringify(configBase))
  return fp
}

const isUnique = (item, index, array) => array.indexOf(item) === index
export const compileDocs = async pkg => {
  const tmpConfig = await getTmpConfig(pkg)
  pkg.outputs.push(tmpConfig)
  const cmd = [
    `jsdoc ${pkg.dir}`,
    pkg.resources
      .filter(r => r.type === 'readme')
      .map(r => `-r ${r.src}`)
      .join(' '),
    `-d ${pkg.tmpDir.path}`,
    `-c ${tmpConfig.path}`,
    pkg.resources
      .filter(r => r.type === 'tutorial')
      .map(r => dirname(r.src))
      .filter(isUnique)
      .map(r => `-u ${r}`)
      .join(' '),
  ].join(' ')
  await execute(cmd)
  await tmpConfig.cleanup()
}
