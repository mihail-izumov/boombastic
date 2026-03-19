/**
 * Призотека — Data Loader для VitePress
 * 
 * Загружает данные призов для конкретного парка.
 * 
 * Использование в prizes/piterlend.md:
 *   <script setup>
 *   import { loadPrizeData } from '../.vitepress/data-loaders/prizes.data.js'
 *   import PrizesPage from '../.vitepress/components/prizes/PrizesPage.vue'
 *   const data = loadPrizeData('piterlend')
 *   </script>
 *   <PrizesPage v-bind="data" park="piterlend" />
 * 
 * Возвращает: { prizes, collections, settings, registry, categories }
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PRIZES_DIR = path.resolve(__dirname, '../prizes')

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function loadPrizeData(park) {
  const parkDir = path.join(PRIZES_DIR, park)
  const sharedDir = path.join(PRIZES_DIR, 'shared')

  return {
    // Park-specific data
    prizes: readJSON(path.join(parkDir, 'prizes.json')),
    collections: readJSON(path.join(parkDir, 'collections.json')),
    settings: readJSON(path.join(parkDir, 'settings.json')),

    // Shared data
    registry: readJSON(path.join(sharedDir, 'collections-registry.json')),
    categories: readJSON(path.join(sharedDir, 'categories.json')),
  }
}
