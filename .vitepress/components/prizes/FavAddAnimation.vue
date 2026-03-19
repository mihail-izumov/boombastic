<script setup>
/**
 * FavAddAnimation — анимация частиц при добавлении в корзину / получении
 * type="cart" → лайм «Добавлено в корзину!»
 * type="collect" → зелёный «Получено!»
 */
import { onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  type: { type: String, required: true }, // 'cart' | 'collect'
})
const emit = defineEmits(['done'])

const isCart = computed(() => props.type === 'cart')
const color = computed(() => isCart.value ? '#C5F946' : '#00FF88')
const label = computed(() => isCart.value ? 'Добавлено в корзину!' : 'Получено!')

// Generate particles
const count = 12
const uid = Date.now()
const particles = Array.from({ length: count }, (_, i) => {
  const angle = (i / count) * 360 + Math.random() * 20
  const dist = 120 + Math.random() * 160
  const tx = Math.round(Math.cos(angle * Math.PI / 180) * dist)
  const ty = Math.round(Math.sin(angle * Math.PI / 180) * dist)
  const tr = Math.round((Math.random() - 0.5) * 600)
  const delay = Math.round(Math.random() * 150)
  const size = 20 + Math.round(Math.random() * 18)
  const chars = isCart.value ? ['🛒', '✦', '·', '★'] : ['✓', '⚡', '·', '✦']
  const char = chars[i % 4]
  const id = `p${i}_${uid}`
  return { tx, ty, tr, delay, size, char, id }
})

// Inject per-particle keyframes + auto-close
let styleEl = null
let timer = null

onMounted(() => {
  styleEl = document.createElement('style')
  styleEl.id = 'fav-anim-styles'
  styleEl.textContent = particles.map(p =>
    `@keyframes fly_${p.id} {
      0%   { opacity:1; transform:translate(-50%,-50%) scale(1) rotate(0deg); }
      100% { opacity:0; transform:translate(calc(-50% + ${p.tx}px), calc(-50% + ${p.ty}px)) scale(0) rotate(${p.tr}deg); }
    }`
  ).join('\n')
  document.head.appendChild(styleEl)
  timer = setTimeout(() => emit('done'), 2000)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (styleEl) styleEl.remove()
})
</script>

<template>
  <div class="fav-overlay">
    <div class="fav-bg" />
    <!-- Radial glow -->
    <div
      class="fav-glow"
      :style="{
        background: `radial-gradient(circle, ${color}33 0%, ${color}0a 55%, transparent 72%)`,
      }"
    />
    <!-- Center content -->
    <div class="fav-center">
      <!-- Chevrons -->
      <div class="fav-chevrons">
        <svg v-for="n in 3" :key="n" xmlns="http://www.w3.org/2000/svg" width="120" height="60"
          viewBox="-2 -2 28 16" fill="none" :stroke="color" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round"
          :style="{
            animation: `fav-chevron-trail 1.2s ${(n-1)*0.2}s ease-in-out infinite`,
            opacity: 0.2,
            marginTop: n > 1 ? '-20px' : 0,
          }">
          <path d="m7 1 5 5 5-5" />
        </svg>
      </div>
      <!-- Label -->
      <div
        class="fav-label"
        :style="{
          color: color,
          textShadow: `0 0 20px ${color}, 0 0 50px ${color}`,
        }"
      >{{ label }}</div>
      <!-- Hint -->
      <div class="fav-hint">ищи в кнопке «Призы» ↓</div>
    </div>
    <!-- Bouncing arrow -->
    <div class="fav-arrow" :style="{ color: color, filter: `drop-shadow(0 0 14px ${color})` }">
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m7 6 5 5 5-5" /><path d="m7 13 5 5 5-5" />
      </svg>
    </div>
    <!-- Particles -->
    <span
      v-for="p in particles"
      :key="p.id"
      class="fav-particle"
      :style="{
        fontSize: p.size + 'px',
        color: color,
        filter: `drop-shadow(0 0 4px ${color})`,
        animation: `fly_${p.id} 1.4s ${p.delay}ms ease-out forwards`,
      }"
    >{{ p.char }}</span>
  </div>
</template>

<style scoped>
.fav-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  pointer-events: none;
}
.fav-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
}
.fav-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vw;
  max-width: 800px;
  max-height: 800px;
  border-radius: 50%;
  filter: blur(48px);
  animation: fav-starburst 1.8s ease-out forwards;
  pointer-events: none;
}
.fav-center {
  position: absolute;
  top: 42%;
  left: 50%;
  animation: fav-starburst 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.fav-chevrons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  line-height: 0;
}
.fav-label {
  font-size: clamp(28px, 7vw, 44px);
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
  white-space: nowrap;
  text-align: center;
}
.fav-hint {
  font-size: clamp(14px, 3.5vw, 18px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
}
.fav-arrow {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  animation: fav-bounce-down 1s ease-in-out infinite;
}
.fav-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-family: 'Space Mono', monospace;
}
</style>

<!-- Non-scoped keyframes for reliable animation -->
<style>
@keyframes fav-starburst {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
  15%  { opacity: 1; transform: translate(-50%, -50%) scale(1.25); }
  50%  { opacity: 1; transform: translate(-50%, -50%) scale(1.0); }
  80%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
}
@keyframes fav-chevron-trail {
  0%   { opacity: 0.2; filter: drop-shadow(0 0 4px currentColor); }
  30%  { opacity: 1;   filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor); }
  60%  { opacity: 1;   filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor); }
  100% { opacity: 0.2; filter: drop-shadow(0 0 4px currentColor); }
}
@keyframes fav-bounce-down {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(12px); }
}
</style>
