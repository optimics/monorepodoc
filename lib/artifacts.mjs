import { mkdir } from 'fs/promises'

export const expectDir = async dir => {
  try {
    await mkdir(dir, { recursive: true })
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}
export const expectDirs = (...dirs) => Promise.all(dirs.map(expectDir))
