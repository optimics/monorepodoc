import fg from 'fast-glob'

import { ResourceManager } from './ResourceManager.mjs'
import { docsDir } from '../fs.mjs'
import { join } from 'path'

export class TutorialManager extends ResourceManager {
  type = 'tutorial'

  detectResources(pkg) {
    return fg.sync([join(pkg.dir, docsDir, '**', '*.md')])
  }
}
