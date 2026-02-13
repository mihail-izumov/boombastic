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

    <!-- Ссылка с arrowDash иконкой -->
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
        {{ linkText }}
        <!-- arrowDash icon -->
        <span :style="{ display: 'inline-flex', transition: 'all 0.3s', transform: hoverLink ? 'translateX(3px)' : 'none' }">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/><path d="M4 9v6"/></svg>
        </span>
      </span>
    </div>
  </div>
</template>
