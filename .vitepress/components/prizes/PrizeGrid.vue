<script setup>
/**
 * PrizeGrid — сетка карточек призов
 * Рендерит массив призов через PrizeCard
 */
import { inject } from 'vue'
import { PRIZE_KEYS } from './prizoteka'
import PrizeCard from './PrizeCard.vue'

defineProps({
  items:     { type: Array, required: true },
  showEmoji: { type: Boolean, default: false },
})

const collected  = inject(PRIZE_KEYS.COLLECTED)
const cart       = inject(PRIZE_KEYS.CART)
const handleCart = inject(PRIZE_KEYS.HANDLE_CART)
const setQueue   = inject(PRIZE_KEYS.SET_QUEUE_PRIZE)
const handleCollect = inject(PRIZE_KEYS.HANDLE_COLLECT)
</script>

<template>
  <div class="prize-grid">
    <PrizeCard
      v-for="p in items"
      :key="p.id"
      :prize="p"
      :is-collected="collected.includes(p.id)"
      :in-cart="cart.includes(p.id)"
      :show-emoji="showEmoji"
      :stretch-full="true"
      @cart="handleCart"
      @queue="setQueue"
      @collect="handleCollect"
    />
  </div>
</template>

<style scoped>
.prize-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 11px;
  align-items: stretch;
}
</style>
