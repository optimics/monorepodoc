import { statSync } from 'fs'

export const docsDir = 'docs'
export const exists = file => {
  try {
    return Boolean(statSync(file))
  } catch (e) {
    return false
  }
}
