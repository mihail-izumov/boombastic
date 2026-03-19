<script setup>
/**
 * CollectionChips — горизонтальные чипы выбора коллекции
 * Показывает «Все» + каждую коллекцию с прогрессом собранных
 */
import { inject, computed } from 'vue'
import { PRIZE_KEYS } from './prizoteka'
import PrizeIcons from './PrizeIcons.vue'

const props = defineProps({
  modelValue: { type: String, required: true }, // active collection id or 'all'
})
const emit = defineEmits(['update:modelValue'])

const prizes     = inject(PRIZE_KEYS.PRIZES)
const collected  = inject(PRIZE_KEYS.COLLECTED)
const registry   = inject(PRIZE_KEYS.REGISTRY)
const collections = inject(PRIZE_KEYS.COLLECTIONS) // { harry_potter: ['PL-00085', ...] }

const prizeMap = computed(() => {
  const m = new Map()
  for (const p of prizes) m.set(p.id, p)
  return m
})

// Build display data for each collection
const collectionList = computed(() => {
  return registry
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter(r => collections[r.id] && collections[r.id].length > 0)
    .map(r => {
      const ids = collections[r.id] || []
      const allPrizes = ids.map(id => prizeMap.value.get(id)).filter(Boolean)
      const activePrizes = allPrizes.filter(p => p.status === 'available' || p.status === 'soon')
      const collectedCount = allPrizes.filter(p => collected.value.includes(p.id)).length
      return {
        ...r,
        total: activePrizes.length,
        collected: collectedCount,
      }
    })
})
</script>

<template>
  <div style="position: relative; margin-bottom: 16px;">
    <div class="pz-hscroll">
      <!-- "Все" chip -->
      <button
        class="pz-chip"
        :class="{ 'pz-chip--active': modelValue === 'all' }"
        @click="emit('update:modelValue', 'all')"
      >
        Все
      </button>

      <!-- Collection chips -->
      <button
        v-for="c in collectionList"
        :key="c.id"
        class="pz-chip"
        :class="{ 'pz-chip--active': modelValue === c.id }"
        @click="emit('update:modelValue', c.id)"
      >
        <span style="display: inline-flex; align-items: center; gap: 5px; vertical-align: middle;">
          <PrizeIcons :name="c.icon_name" :size="14" />
          {{ c.name }}
          <span v-if="c.total > 0" class="pz-chip__count">
            {{ c.collected }}/{{ c.total }}
          </span>
        </span>
      </button>
    </div>
    <div class="pz-hscroll-fade" />
  </div>
</template>
