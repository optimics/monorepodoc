import { mkdir } from 'fs/promises'

export const expectDir = async dir => {
  try {
    await mkdir(dir)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}
export const expectDirs = async (...dirs) => Promise.all(dirs.map(expectDir))
