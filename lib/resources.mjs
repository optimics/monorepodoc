import { MermaidManager } from './resources/mermaid.mjs'
import { ReadmeManager } from './resources/readme.mjs'
import { RedocManager } from './resources/redoc.mjs'
import { TutorialManager } from './resources/tutorials.mjs'

export const getResourceDrivers = pkg =>
  [MermaidManager, ReadmeManager, RedocManager, TutorialManager]
    .map(Cls => new Cls())
    .filter(driver => driver.isAvailable(pkg))

export const compileResources = async pkg => {
  for (const resource of pkg.resources) {
    await resource.driver.compile(pkg, resource)
  }
}
