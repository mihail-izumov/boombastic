<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  primary: Boolean,
  compact: Boolean,
  lime: Boolean,
  cyan: Boolean,
  rounded: Boolean,
  onClick: Function,
})

const h = ref(false)
const cut = 14

function handleClick(e) {
  if (props.onClick) props.onClick(e)
}
</script>

<template>
  <div
    @mouseenter="h = true" @mouseleave="h = false" @click="handleClick"
    :style="{ position: 'relative', cursor: 'pointer', display: 'inline-block', transform: h ? 'translateY(-2px)' : 'none', transition: 'transform 0.3s ease' }"
  >
    <div :style="{
      position: 'absolute', inset: '-1px',
      clipPath: rounded ? undefined : `polygon(${cut}px 0,100% 0,100% calc(100% - ${cut}px),calc(100% - ${cut}px) 100%,0 100%,0 ${cut}px)`,
      borderRadius: rounded ? '11px' : undefined,
      background: cyan ? 'var(--cyan)' : lime ? 'var(--lime)' : primary ? 'var(--lime)' : (h ? 'rgba(240,244,255,0.35)' : 'rgba(74,90,173,0.35)'),
      transition: 'background 0.3s',
    }" />
    <div :style="{
      position: 'relative',
      clipPath: rounded ? undefined : `polygon(${cut}px 0,100% 0,100% calc(100% - ${cut}px),calc(100% - ${cut}px) 100%,0 100%,0 ${cut}px)`,
      borderRadius: rounded ? '10px' : undefined,
      background: cyan ? (h ? 'linear-gradient(135deg, #00eeff, var(--cyan))' : 'linear-gradient(135deg, var(--cyan), #0099cc)') : lime ? 'linear-gradient(135deg, var(--lime), var(--lime-dim))' : primary ? (h ? 'var(--lime)' : 'linear-gradient(135deg, var(--lime), var(--lime-dim))') : 'transparent',
      padding: compact ? '12px 24px' : '14px 36px',
      fontFamily: 'var(--font-body)', fontSize: compact ? '14px' : '15px', fontWeight: 700,
      color: (cyan || lime || primary) ? 'var(--bg-deep)' : (h ? '#fff' : 'rgba(240,244,255,0.55)'),
      letterSpacing: '0.02em', transition: 'all 0.3s', margin: '1px',
    }">
      <span style="position: relative; z-index: 1">{{ label }}</span>
    </div>
  </div>
</template>
