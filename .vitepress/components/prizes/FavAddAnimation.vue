<script setup>
/**
 * FavAddAnimation — анимация при добавлении в корзину / получении
 * Teleport to body + inline-стили
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
})
const emit = defineEmits(['done'])

const isCart = computed(() => props.type === 'cart')
const color = computed(() => isCart.value ? '#C5F946' : '#00FF88')
const label = computed(() => isCart.value ? 'Добавлено в корзину!' : 'Получено!')

const phase = ref(0)

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
  requestAnimationFrame(() => { phase.value = 1 })
  timer = setTimeout(() => emit('done'), 2000)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (styleEl) styleEl.remove()
})
</script>

<template>
  <Teleport to="body">
    <div style="position:fixed;inset:0;z-index:50000;pointer-events:none;">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.72);" />
      <!-- Radial glow -->
      <div :style="{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:'100vw', height:'100vw', maxWidth:'800px', maxHeight:'800px',
        borderRadius:'50%', filter:'blur(48px)', pointerEvents:'none',
        background: `radial-gradient(circle, ${color}33 0%, ${color}0a 55%, transparent 72%)`,
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
      }" />
      <!-- Center -->
      <div :style="{
        position:'absolute', top:'42%', left:'50%',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'20px',
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0.2)',
        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }">
        <!-- Chevrons -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;line-height:0;">
          <svg v-for="n in 3" :key="n" xmlns="http://www.w3.org/2000/svg" width="120" height="60"
            viewBox="-2 -2 28 16" fill="none" :stroke="color" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"
            :style="{ opacity: 0.7, marginTop: n > 1 ? '-20px' : 0 }">
            <path d="m7 1 5 5 5-5" />
          </svg>
        </div>
        <div :style="{
          fontSize:'clamp(28px, 7vw, 44px)', fontWeight:800, fontFamily:'Inter,sans-serif',
          letterSpacing:'-0.02em', whiteSpace:'nowrap', textAlign:'center',
          color: color, textShadow: `0 0 20px ${color}, 0 0 50px ${color}`,
        }">{{ label }}</div>
        <div style="font-size:clamp(14px,3.5vw,18px);font-weight:600;color:rgba(255,255,255,0.6);font-family:'Inter',sans-serif;white-space:nowrap;">
          ищи в кнопке «Призы» ↓
        </div>
      </div>
      <!-- Bouncing arrow -->
      <div :style="{
        position:'absolute', bottom:'max(80px, calc(16px + env(safe-area-inset-bottom) + 68px))', left:'75%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
        color: color, filter: `drop-shadow(0 0 14px ${color})`,
        animation: 'fav-bounce 1s ease-in-out infinite',
      }">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m7 6 5 5 5-5" /><path d="m7 13 5 5 5-5" />
        </svg>
      </div>
      <!-- Particles -->
      <span
        v-for="p in particles" :key="p.id"
        :style="{
          position:'absolute', top:'50%', left:'50%',
          fontSize: p.size + 'px', color: color,
          fontFamily: 'Space Mono, monospace',
          filter: `drop-shadow(0 0 4px ${color})`,
          animation: `fly_${p.id} 1.4s ${p.delay}ms ease-out forwards`,
        }"
      >{{ p.char }}</span>
    </div>
  </Teleport>
</template>

<style>
@keyframes fav-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(12px); }
}
</style>
