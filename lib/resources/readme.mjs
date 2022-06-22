import { ResourceManager } from './ResourceManager.mjs'
import { exists } from '../fs.mjs'
import { join } from 'path'

export const readmeFile = 'README.md'

export class ReadmeManager extends ResourceManager {
  type = 'readme'

  detectResources(pkg) {
    const readmePath = join(pkg.dir, readmeFile)
    return exists(readmePath) && readmePath
  }
}
