<script setup>
/**
 * AvailBadge — бейдж статуса приза
 * В наличии (зелёный) / Скоро (циан) / Архив (серый)
 */
defineProps({
  status: { type: String, required: true },
})

const MAP = {
  available: { label: 'В наличии', bg: 'rgba(0,255,136,0.11)',   border: 'rgba(0,255,136,0.38)',   color: '#00FF88' },
  soon:      { label: 'Скоро',     bg: 'rgba(0,212,255,0.11)',   border: 'rgba(0,212,255,0.38)',   color: '#00D4FF' },
  oos:       { label: 'Архив',     bg: 'rgba(122,139,168,0.09)', border: 'rgba(122,139,168,0.28)', color: '#7A8BA8' },
  was:       { label: 'Архив',     bg: 'rgba(122,139,168,0.09)', border: 'rgba(122,139,168,0.28)', color: '#7A8BA8' },
}
</script>

<template>
  <span
    class="avail-badge"
    :style="{
      color: (MAP[status] || MAP.oos).color,
      background: (MAP[status] || MAP.oos).bg,
      borderColor: (MAP[status] || MAP.oos).border,
    }"
  >
    {{ (MAP[status] || MAP.oos).label }}
  </span>
</template>

<style scoped>
.avail-badge {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid;
  border-radius: 4px;
  padding: 2px 8px;
  white-space: nowrap;
  line-height: 1.4;
}
</style>
