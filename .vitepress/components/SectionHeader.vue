<script setup>
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'

defineProps({
  tag: String,
  title: String,
  subtitle: { type: String, default: '' },
  linkText: { type: String, default: '' },
})

const { elRef, visible } = useReveal()
const hoverLink = ref(false)
</script>

<template>
  <div ref="elRef" style="text-align: center; margin-bottom: 44px">
    <!-- Бейдж -->
    <div :style="{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 14px', borderRadius: '4px',
      background: 'rgba(197,249,70,0.08)', border: '1px solid rgba(197,249,70,0.2)',
      marginBottom: '14px',
      opacity: visible ? 1 : 0, transition: 'opacity 0.5s'
    }">
      <slot name="icon" />
      <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--lime); letter-spacing: 0.12em">{{ tag }}</span>
    </div>

    <!-- Заголовок -->
    <h2 :style="{
      fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800,
      color: 'var(--text-pri)', margin: 0, lineHeight: 1.2,
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(12px)',
      transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1) 0.1s'
    }">{{ title }}</h2>

    <!-- Подзаголовок -->
    <p v-if="subtitle" :style="{
      fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-sec)',
      marginTop: '10px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto',
      opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.2s'
    }">{{ subtitle }}</p>

    <!-- Ссылка -->
    <div v-if="linkText" style="margin-top: 10px">
      <span
        @mouseenter="hoverLink = true"
        @mouseleave="hoverLink = false"
        :style="{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
          color: hoverLink ? 'var(--lime)' : '#fff', cursor: 'pointer',
          letterSpacing: '0.06em', transition: 'all 0.3s',
          borderBottom: `1px solid ${hoverLink ? 'rgba(197,249,70,0.4)' : 'rgba(255,255,255,0.25)'}`,
          paddingBottom: '2px'
        }"
      >
        {{ linkText }} ◇
      </span>
    </div>
  </div>
</template>
