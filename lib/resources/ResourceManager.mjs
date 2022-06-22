class NotImplemented extends Error {}

export class ResourceManager {
  type = 'resource'

  detect(pkg) {
    const resources = this.detectResources(pkg)
    if (Array.isArray(resources)) {
      return resources.map(resource => this.normalizeResource(resource))
    } else if (resources) {
      return this.normalizeResource(resources)
    }
    return null
  }

  async compile(pkg, resource) {
    await this.compileResource(pkg, resource)
  }

  async compileResource() {}

  isAvailable() {
    return true
  }

  normalizeResource(src) {
    return this.normalizeSrcObject(typeof src === 'string' ? { src } : src)
  }

  normalizeSrcObject(obj) {
    const outputs = []
    return { ...obj, driver: this, outputs, type: this.type }
  }

  detectResources() {
    throw new NotImplemented()
  }
}
