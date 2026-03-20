<script setup>
/**
 * CartDrawer — панель «Корзина»
 * Teleport to body, полный экран на мобильном, блокировка скролла фона
 */
import { ref, watch, onMounted, onUnmounted, inject } from 'vue'
import { PRIZE_KEYS } from './prizoteka'
import TabTrophy from './TabTrophy.vue'
import PrizeIcons from './PrizeIcons.vue'

const emit = defineEmits(['close', 'goToCatalog'])

const cart      = inject(PRIZE_KEYS.CART)
const collected = inject(PRIZE_KEYS.COLLECTED)
const setTab    = inject(PRIZE_KEYS.SET_TAB)
const setCatalogFilter = inject(PRIZE_KEYS.SET_CATALOG_FILTER)
const setTrophyOpen = inject(PRIZE_KEYS.SET_TROPHY_OPEN)

const scrollRef = ref(null)
const wasOpen = ref(false)

// Lock body scroll
onMounted(() => {
  document.body.style.overflowY = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflowY = ''
})

// Auto-close when cart + collected both empty
watch([cart, collected], ([c, col]) => {
  const isEmpty = c.length === 0 && col.length === 0
  if (wasOpen.value && isEmpty) {
    setTimeout(() => emit('close'), 1400)
  }
  if (!isEmpty) wasOpen.value = true
})

function handleGoToCatalog(max) {
  setCatalogFilter(max)
  setTab('catalog')
  setTrophyOpen(false)
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
}
</script>

<template>
  <Teleport to="body">
    <div class="drawer-overlay vp-raw" style="touch-action:none;">
      <div class="drawer-panel" @click.stop style="touch-action:auto;">
        <!-- Header -->
        <div class="drawer-header">
          <div class="drawer-header-row">
            <div class="drawer-title">Корзина</div>
            <button class="drawer-close" @click="emit('close')">
              <PrizeIcons name="ui_x" :size="18" />
            </button>
          </div>
        </div>
        <!-- Scrollable content -->
        <div ref="scrollRef" class="drawer-content">
          <TabTrophy @go-to-catalog="handleGoToCatalog" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  touch-action: none;
}
.drawer-panel {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #141230 0%, #0D0B28 100%);
  display: flex;
  flex-direction: column;
  touch-action: auto;
}
.drawer-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(20, 18, 50, 0.98);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(74, 90, 173, 0.18);
  padding: 16px 20px;
  flex-shrink: 0;
}
.drawer-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drawer-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: #F0F4FF;
}
.drawer-close {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  color: #F0F4FF;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
}
.drawer-content {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 16px 20px 80px;
  flex: 1;
  touch-action: pan-y;
}
</style>
