import archiver from 'archiver'

import { compileDocs } from './jsdoc.mjs'
import { compileResources } from './resources.mjs'
import { createWriteStream } from 'fs'
import { stat } from 'fs/promises'

const archiveDocs = async pkg => {
  const output = createWriteStream(pkg.archive)
  const archive = archiver('zip')
  await new Promise((resolve, reject) => {
    output.on('close', resolve)
    output.on('error', reject)
    archive.directory(pkg.distDir, false)
    archive.pipe(output)
    archive.finalize()
  })
  pkg.outputs.push({
    path: pkg.archive,
    stat: await stat(pkg.archive),
  })
}

export const generatePackageDocs = async pkg => {
  pkg.tmpDir = { path: pkg.distDir }
  await compileResources(pkg)
  await compileDocs(pkg)
  await archiveDocs(pkg)
}
