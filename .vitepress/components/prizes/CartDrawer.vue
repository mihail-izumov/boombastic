<script setup>
/**
 * CartDrawer — выдвижная панель «Корзина» (снизу вверх)
 * Обёртка над TabTrophy. Свайп вниз = закрытие.
 */
import { ref, watch, onMounted, inject } from 'vue'
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
const startY = ref(null)
const wasOpen = ref(false)

// Auto-close when cart + collected both empty
watch([cart, collected], ([c, col]) => {
  const isEmpty = c.length === 0 && col.length === 0
  if (wasOpen.value && isEmpty) {
    setTimeout(() => emit('close'), 1400)
  }
  if (!isEmpty) wasOpen.value = true
})

// Touch events for swipe-to-close
function onTouchStart(e) { startY.value = e.touches[0].clientY }
function onTouchMove(e) {
  if (startY.value !== null && scrollRef.value) {
    const dy = e.touches[0].clientY - startY.value
    if (dy > 0 && scrollRef.value.scrollTop === 0) e.preventDefault()
  }
}
function onTouchEnd(e) {
  if (startY.value !== null) {
    const dy = e.changedTouches[0].clientY - startY.value
    const atTop = !scrollRef.value || scrollRef.value.scrollTop === 0
    if (dy > 60 && atTop) emit('close')
    startY.value = null
  }
}

function handleGoToCatalog(max) {
  setCatalogFilter(max)
  setTab('catalog')
  setTrophyOpen(false)
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
}
</script>

<template>
  <Teleport to="body">
    <div class="drawer-overlay vp-raw" @click="emit('close')">
      <div class="drawer-backdrop" />
      <div class="drawer-panel" @click.stop>
        <!-- Sticky header -->
        <div
          class="drawer-header"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="drawer-handle-wrap">
            <div class="drawer-handle" />
          </div>
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

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
}
.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(10px);
}
.drawer-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #141230 0%, #0D0B28 100%);
  border-top: 1px solid rgba(197, 249, 70, 0.22);
  border-radius: 18px 18px 0 0;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  animation: pz-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(20, 18, 50, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 18px 18px 0 0;
  border-bottom: 1px solid rgba(74, 90, 173, 0.18);
  padding: 12px 20px 14px;
  flex-shrink: 0;
}
.drawer-handle-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  cursor: grab;
}
.drawer-handle {
  width: 44px;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.22);
}
.drawer-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drawer-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--pz-tx1);
}
.drawer-close {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  color: var(--pz-tx1);
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
  padding: 16px 20px 60px;
  flex: 1;
}
</style>
