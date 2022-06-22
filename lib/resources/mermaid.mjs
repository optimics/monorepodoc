import fg from 'fast-glob'

import { docsDir } from '../fs.mjs'
import { execute, isBinaryAvailable } from '../cli.mjs'
import { basename, join } from 'path'
import { expectDir } from '../artifacts.mjs'
import { ResourceManager } from './ResourceManager.mjs'

export class MermaidManager extends ResourceManager {
  type = 'static'

  detectResources(pkg) {
    return fg.sync([join(pkg.dir, docsDir, '**', '*.mermaid')])
  }

  isAvailable(pkg) {
    return isBinaryAvailable(pkg.root, 'mmdc')
  }

  async compileResource(pkg, resource) {
    const fileName = basename(resource.src, '.mermaid')
    const distDir = join(pkg.tmpDir.path, this.type)
    const distFile = join(distDir, `${fileName}.png`)
    expectDir(distDir)
    await execute(`mmdc -i ${resource.src} -o ${distFile}`)
    resource.outputs.push(distFile)
  }
}
