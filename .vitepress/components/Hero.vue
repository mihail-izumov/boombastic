<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useReveal } from '../composables/useReveal'
import CutBtn from './CutBtn.vue'

const { elRef, visible } = useReveal()
const startHover = ref(false)

const chars = ref(Array(7).fill('0'))
const locked = ref(Array(7).fill(false))
const exploded = ref(false)
const glyphs = '0123456789@#%&?$*'
let spinInterval = null
let initTimeout = null
const lockedArr = Array(7).fill(false)

function scrollToParks() {
  document.getElementById('parks')?.scrollIntoView({ behavior: 'smooth' })
}
function openLogin() {
  if (typeof window !== 'undefined' && window.openLoginModal) window.openLoginModal()
}
function openGameMode() {
  if (typeof window !== 'undefined' && window.openGameModeModal) window.openGameModeModal()
}

onMounted(() => {
  initTimeout = setTimeout(() => {
    spinInterval = setInterval(() => {
      chars.value = chars.value.map((_, i) =>
        lockedArr[i] ? '0' : glyphs[Math.floor(Math.random() * glyphs.length)]
      )
    }, 60)
    const delays = [600, 900, 1200, 1500, 1800, 2100, 2400]
    delays.forEach((d, i) => {
      setTimeout(() => {
        lockedArr[i] = true
        locked.value = [...lockedArr]
        chars.value = chars.value.map((v, j) => j === i ? '0' : v)
      }, d)
    })
    setTimeout(() => {
      if (spinInterval) clearInterval(spinInterval)
      chars.value = Array(7).fill('0')
      locked.value = Array(7).fill(true)
      lockedArr.fill(true)
      exploded.value = true
      setTimeout(() => { exploded.value = false }, 900)
    }, 2600)
  }, 600)
})

onUnmounted(() => {
  clearTimeout(initTimeout)
  if (spinInterval) clearInterval(spinInterval)
})
</script>

<template>
  <section ref="elRef" class="hero-section">
    <svg width="100%" height="100%" style="position: absolute; inset: 0; pointer-events: none">
      <defs><pattern id="hG" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--lime)" stroke-width="0.6" opacity="0.15" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#hG)" />
    </svg>
    <div style="position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, var(--bg-deep) 100%)" />

    <h1 :style="{ fontSize: 'clamp(36px, 9vw, 68px)', lineHeight: 1, margin: '0 0 16px', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.23,1,0.32,1) 0.15s', position: 'relative', fontFamily: 'var(--font-mono)', fontWeight: 700 }">
      <span style="position: relative; display: inline-block">
        <span style="color: var(--yellow); text-shadow: 0 0 20px rgba(255,214,10,0.6), 0 0 60px rgba(255,214,10,0.2)">Б</span>
        <span v-for="(c, i) in chars" :key="i" :style="{ display: 'inline-block', minWidth: '0.55em', textAlign: 'center', color: locked[i] ? 'var(--lime)' : 'rgba(133,169,49,0.5)', textShadow: locked[i] ? '0 0 20px rgba(197,249,70,0.7), 0 0 50px rgba(197,249,70,0.3)' : '0 0 8px rgba(197,249,70,0.3)', transition: locked[i] ? 'color 0.3s, text-shadow 0.3s' : 'none', transform: exploded ? `scale(1.2) translateY(${(i % 2 ? -1 : 1) * 4}px)` : 'none' }">{{ c }}</span>
        <span style="color: var(--cyan); text-shadow: 0 0 20px rgba(0,212,255,0.6), 0 0 60px rgba(0,212,255,0.2)">М</span>
        <span style="color: var(--magenta); text-shadow: 0 0 20px rgba(255,0,128,0.7), 0 0 60px rgba(255,0,128,0.3)">!</span>
        <div v-if="exploded" style="position: absolute; top: 50%; left: 50%; width: 400px; height: 400px; border-radius: 50%; transform: translate(-50%,-50%) scale(0); background: radial-gradient(circle, rgba(197,249,70,0.3) 0%, rgba(255,0,128,0.12) 40%, transparent 70%); animation: boomRing 0.9s ease-out forwards; pointer-events: none" />
      </span>
    </h1>

    <p class="hero-subtitle" :style="{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.3s', position: 'relative' }">
      Аркадные парки БумБастик<br>каждый день с 10 до 22
    </p>

    <div :style="{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', opacity: visible ? 1 : 0, transition: 'all 0.7s ease 0.45s', position: 'relative' }">
      <CutBtn label="Войти" primary :onClick="openLogin" />
      <CutBtn label="Игровой режим" cyan :onClick="openGameMode" />
    </div>

    <div class="hero-start" @click="scrollToParks" @mouseenter="startHover = true" @mouseleave="startHover = false" :style="{ opacity: visible ? 0.8 : 0, transition: 'opacity 0.5s ease 1s' }">
      <div :style="{ padding: '8px 24px 10px', border: `1.5px solid ${startHover ? 'var(--magenta)' : 'rgba(255,0,128,0.4)'}`, borderRadius: '6px', background: startHover ? 'rgba(255,0,128,0.12)' : 'transparent', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }">
        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--magenta); letter-spacing: 0.15em">СТАРТ</span>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 2L7 10M7 10L2 6M7 10L12 6" stroke="var(--magenta)" stroke-width="1.5" stroke-linecap="round" /></svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative; min-height: 100vh; min-height: 100dvh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 100px 24px 70px; overflow: hidden;
}
.hero-subtitle {
  font-family: var(--font-head); font-size: clamp(20px, 4vw, 34px); font-weight: 600;
  color: #fff; margin: 0 0 36px; max-width: 560px; line-height: 1.3;
}
.hero-start {
  position: absolute; bottom: 20px; cursor: pointer;
  animation: float 2s ease-in-out infinite;
}

@media (max-width: 768px) {
  .hero-section { padding: 56px 16px 64px; }
  .hero-subtitle { font-size: clamp(17px, 5vw, 24px); margin: 0 0 28px; }
  .hero-start { bottom: 12px; }
}
@media (max-height: 680px) {
  .hero-section { padding: 48px 16px 56px; }
  .hero-subtitle { margin: 0 0 20px; }
}
</style>
