import { execute, isBinaryAvailable } from '../cli.mjs'
import { exists } from '../fs.mjs'
import { join } from 'path'
import { ResourceManager } from './ResourceManager.mjs'

export const specsDir = 'specs'

export class RedocManager extends ResourceManager {
  type = 'specs'

  detectResources(pkg) {
    const src = join(pkg.dir, specsDir, 'index.yaml')
    return exists(src) && src
  }

  isAvailable(pkg) {
    return isBinaryAvailable(pkg.root, 'redoc-cli')
  }

  async compileResource(pkg, resource) {
    const distFile = join(pkg.tmpDir.path, `${this.type}.html`)
    await execute(`redoc-cli bundle -o ${distFile} ${resource.src}`)
    resource.outputs.push(distFile)
  }
}
