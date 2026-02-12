<script setup>
import { useReveal } from '../composables/useReveal'
import CutBtn from './CutBtn.vue'

const { elRef, visible } = useReveal()
</script>

<template>
  <section ref="elRef" style="padding: 60px 0 100px; text-align: center">
    <div
      class="boom-wrap"
      :style="{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1)',
      }"
    >
      <!-- Badge -->
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: 4px; background: rgba(197,249,70,0.08); border: 1px solid rgba(197,249,70,0.2); margin-bottom: 14px">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--lime); letter-spacing: 0.12em">КТО ЗДЕСЬ</span>
      </div>

      <div style="font-family: var(--font-head); font-size: 28px; font-weight: 800; color: var(--text-pri); margin-bottom: 8px">
        Заходи в сообщество
      </div>
      <p style="font-family: var(--font-body); font-size: 15px; color: var(--text-sec); max-width: 360px; margin: 0 auto 32px">
        Там всё движение — новости, призы и обновления
      </p>

      <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap">
        <CutBtn label="Сообщество VK" primary />
        <CutBtn label="Контакт" />
      </div>
    </div>
  </section>
</template>
