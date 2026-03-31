/**
 * VitePress Data Loader для Призотеки — Охта Молл
 * 
 * Файл должен лежать рядом с ohtamall.md:
 *   prizes/ohtamall.data.js
 *   prizes/ohtamall.md
 */
import fs from 'node:fs'
import path from 'node:path'

const PARK = 'ohtamall'

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export default {
  load() {
    const base = path.resolve(__dirname, '../.vitepress/prizes')
    const parkDir = path.join(base, PARK)
    const sharedDir = path.join(base, 'shared')

    return {
      park: PARK,
      prizes: readJSON(path.join(parkDir, 'prizes.json')),
      collections: readJSON(path.join(parkDir, 'collections.json')),
      settings: readJSON(path.join(parkDir, 'settings.json')),
      registry: readJSON(path.join(sharedDir, 'collections-registry.json')),
      categories: readJSON(path.join(sharedDir, 'categories.json')),
    }
  }
}
