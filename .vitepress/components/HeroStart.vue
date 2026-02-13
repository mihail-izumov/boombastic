<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
const hovered = ref(false)

onMounted(() => {
  setTimeout(() => { visible.value = true }, 1200)
})

function scrollToParks() {
  document.getElementById('parks')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="hero-start-wrap" :style="{ opacity: visible ? 0.8 : 0, transition: 'opacity 0.5s ease' }">
    <div
      class="hero-start"
      :class="{ hovered }"
      @click="scrollToParks"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <span class="hero-start-text">СТАРТ</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2L7 10M7 10L2 6M7 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.hero-start-wrap {
  display: flex;
  justify-content: center;
  margin-top: -40px;
  margin-bottom: 0;
  position: relative;
  z-index: 10;
  animation: float 2s ease-in-out infinite;
}

.hero-start {
  padding: 10px 28px 14px;
  border: 1.5px solid rgba(255, 0, 128, 0.4);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
  color: var(--magenta);
}
.hero-start.hovered {
  border-color: var(--magenta);
  background: rgba(255, 0, 128, 0.12);
}

.hero-start-text {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--magenta);
}
</style>
