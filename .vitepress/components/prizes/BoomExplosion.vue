<script setup>
/**
 * BoomExplosion — полноэкранная анимация «Б00000М!» при получении приза
 * Конфетти + текст + автозакрытие через 3.2с
 */
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['done'])

let timer = null
onMounted(() => { timer = setTimeout(() => emit('done'), 3200) })
onUnmounted(() => { if (timer) clearTimeout(timer) })

// Generate confetti bits
const bits = Array.from({ length: 28 }, (_, i) => ({
  left: `${2 + Math.random() * 96}%`,
  delay: `${Math.random() * 0.8}s`,
  dur: `${1.5 + Math.random() * 1.2}s`,
  char: ['🎟️', '✨', '⚡', '🎯', '🏆', '🎁', '🎮'][i % 7],
  size: `${32 + Math.floor(Math.random() * 22)}px`,
}))
</script>

<template>
  <div class="boom-overlay">
    <!-- Dark bg -->
    <div class="boom-bg" />
    <!-- Confetti -->
    <span
      v-for="(b, i) in bits"
      :key="i"
      class="boom-bit"
      :style="{
        left: b.left,
        fontSize: b.size,
        animation: `pz-confettiFall ${b.dur} ${b.delay} ease-in forwards`,
      }"
    >{{ b.char }}</span>
    <!-- Centered text -->
    <div class="boom-center">
      <!-- BOOM text -->
      <div class="boom-text-wrap">
        <div class="boom-text">
          <span>Б</span>
          <span>00</span>
          <span class="boom-zeros">000000000</span>
          <span>М!</span>
        </div>
      </div>
      <div class="boom-subtitle">Лови приз!</div>
    </div>
  </div>
</template>

<style scoped>
.boom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.boom-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  transition: opacity 0.3s;
}
.boom-bit {
  position: absolute;
  top: -8%;
}
.boom-center {
  position: relative;
  z-index: 1;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  animation: pz-boomPop 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.boom-text-wrap {
  padding: 0 60px;
  margin: 0 -60px;
  filter: drop-shadow(0 0 18px #FFD60A) drop-shadow(0 0 50px rgba(255, 214, 10, 0.55));
}
.boom-text {
  font-size: clamp(48px, 11vw, 88px);
  color: #FFD60A;
  letter-spacing: -2px;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  white-space: nowrap;
  display: inline-flex;
  align-items: baseline;
}
.boom-zeros {
  display: inline-block;
  overflow: hidden;
  max-width: 0;
  vertical-align: bottom;
  animation: pz-boomZeros 2s ease-in-out forwards;
}
.boom-subtitle {
  font-size: 18px;
  color: #FFD60A;
  margin-top: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 214, 10, 0.6), 0 0 40px rgba(255, 214, 10, 0.3);
  letter-spacing: 0.05em;
}

/* Keyframes must be in the same scope to work reliably */
@keyframes pz-boomPop {
  0%   { opacity: 0; transform: scale(0.5) translateY(30px); }
  40%  { opacity: 1; transform: scale(1.12) translateY(-8px); }
  70%  { opacity: 1; transform: scale(0.97) translateY(2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes pz-boomZeros {
  0%   { max-width: 0; }
  30%  { max-width: 6.5em; }
  70%  { max-width: 6.5em; }
  100% { max-width: 0; }
}
@keyframes pz-confettiFall {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  50%  { opacity: 0.9; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}
</style>
