<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: String,
  primary: Boolean,
  lime: Boolean,
  compact: Boolean,
  rounded: Boolean,
})

const hovered = ref(false)
const cut = 14

const clipPath = computed(() =>
  props.rounded
    ? undefined
    : `polygon(${cut}px 0,100% 0,100% calc(100% - ${cut}px),calc(100% - ${cut}px) 100%,0 100%,0 ${cut}px)`
)
const radius = computed(() => props.rounded ? '10px' : undefined)

const colors = computed(() => {
  const h = hovered.value
  if (props.lime || props.primary) {
    return {
      bg: h ? 'var(--lime)' : 'linear-gradient(135deg, var(--lime), var(--lime-dim))',
      text: 'var(--bg-deep)',
      brd: 'var(--lime)',
    }
  }
  // outline
  return {
    bg: 'transparent',
    text: h ? '#fff' : 'rgba(240,244,255,0.55)',
    brd: h ? 'rgba(240,244,255,0.35)' : 'rgba(74,90,173,0.35)',
  }
})
</script>

<template>
  <div
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :style="{
      position: 'relative', cursor: 'pointer', display: 'inline-block',
      transform: hovered ? 'translateY(-2px)' : 'none',
      transition: 'transform 0.3s ease',
    }"
  >
    <!-- Border layer -->
    <div :style="{
      position: 'absolute', inset: '-1px',
      clipPath: clipPath,
      borderRadius: rounded ? '11px' : undefined,
      background: colors.brd,
      transition: 'background 0.3s',
    }" />
    <!-- Fill layer -->
    <div :style="{
      position: 'relative',
      clipPath: clipPath,
      borderRadius: radius,
      background: colors.bg,
      padding: compact ? '12px 24px' : '14px 36px',
      fontFamily: 'var(--font-body)',
      fontSize: compact ? '14px' : '15px',
      fontWeight: 700, color: colors.text,
      letterSpacing: '0.02em',
      transition: 'all 0.3s',
      margin: '1px',
    }">
      <span style="position: relative; z-index: 1">{{ label }}</span>
    </div>
  </div>
</template>
