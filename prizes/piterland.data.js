/**
 * VitePress Data Loader для Призотеки — Питерлэнд
 * 
 * Файл должен лежать рядом с piterland.md:
 *   prizes/piterland.data.js
 *   prizes/piterland.md
 * 
 * VitePress автоматически подхватывает .data.js файлы
 * и вызывает load() на этапе сборки (Node.js).
 */
import fs from 'node:fs'
import path from 'node:path'

const PARK = 'piterlend'

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
