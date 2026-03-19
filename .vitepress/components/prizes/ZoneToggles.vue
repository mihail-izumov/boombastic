<script setup>
/**
 * ZoneToggles — переключатель «Хватает сейчас» / «Надо подкопить»
 * Показывается только если tickets > 0
 */
import { watch } from 'vue'
import { pluralPrize, pluralWait, pluralThem } from './prizoteka'

const props = defineProps({
  tickets:   { type: Number, required: true },
  canCount:  { type: Number, required: true },
  saveCount: { type: Number, required: true },
  modelValue:{ type: String, required: true }, // 'all' | 'can' | 'save'
})

const emit = defineEmits(['update:modelValue'])

// Auto-set zone when one side is empty
watch([() => props.canCount, () => props.saveCount], ([can, save]) => {
  if (can === 0 && save > 0) emit('update:modelValue', 'save')
  else if (save === 0 && can > 0) emit('update:modelValue', 'can')
  else emit('update:modelValue', 'all')
})

const zones = [
  {
    id: 'can',
    label: 'ХВАТАЕТ СЕЙЧАС',
    color: '#C5F946',
    border: 'rgba(197,249,70,0.7)',
    bg: 'rgba(197,249,70,0.22)',
    pillBg: '#C5F946',
    pillColor: '#1a1840',
  },
  {
    id: 'save',
    label: 'НАДО ПОДКОПИТЬ',
    color: '#00D4FF',
    border: 'rgba(0,212,255,0.7)',
    bg: 'rgba(0,212,255,0.22)',
    pillBg: '#00D4FF',
    pillColor: '#1a1840',
  },
]

function getCount(z) {
  return z.id === 'can' ? props.canCount : props.saveCount
}

function isEmpty(z) {
  return getCount(z) === 0
}

function isAlwaysOn(z) {
  return (z.id === 'save' && props.canCount === 0) || (z.id === 'can' && props.saveCount === 0)
}

function handleClick(z) {
  if (isEmpty(z) || isAlwaysOn(z)) return
  const active = props.modelValue === z.id
  emit('update:modelValue', active ? 'all' : z.id)
}
</script>

<template>
  <template v-if="tickets > 0">
    <div class="zone-toggles">
      <button
        v-for="z in zones"
        :key="z.id"
        class="zone-toggle"
        :class="{
          'zone-toggle--active': modelValue === z.id,
          'zone-toggle--empty': isEmpty(z),
        }"
        :style="{
          background: modelValue === z.id ? z.bg : isEmpty(z) ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
          borderColor: modelValue === z.id ? z.border : 'transparent',
          cursor: isEmpty(z) ? 'default' : 'pointer',
          opacity: isEmpty(z) ? 0.35 : 1,
          fontWeight: modelValue === z.id ? 800 : 700,
        }"
        @click="handleClick(z)"
      >
        <div class="zone-toggle__label" :style="{ opacity: modelValue === z.id ? 1 : 0.55 }">
          {{ z.label }}
        </div>
        <span
          class="zone-toggle__pill"
          :style="{
            background: modelValue === z.id ? z.pillBg : 'rgba(255,255,255,0.06)',
            color: modelValue === z.id ? z.pillColor : '#F0F4FF',
          }"
        >
          {{ getCount(z) }}
        </span>
      </button>
    </div>

    <!-- Summary text -->
    <div v-if="canCount > 0 || saveCount > 0" class="zone-summary">
      <template v-if="canCount > 0 && saveCount > 0">
        Можешь взять <span class="zone-summary--lime">{{ canCount }}</span> {{ pluralPrize(canCount) }} прямо сейчас.
        Ещё <span class="zone-summary--cyan">{{ saveCount }}</span> — копи дальше.
      </template>
      <template v-else-if="canCount > 0 && saveCount === 0">
        Сегодня твой день. <span class="zone-summary--lime">{{ canCount }}</span> {{ pluralPrize(canCount) }}
        доступ{{ canCount % 10 === 1 && !(canCount % 100 >= 11 && canCount % 100 <= 19) ? 'ен' : 'ны' }}.
      </template>
      <template v-else-if="canCount === 0 && saveCount > 0">
        <span class="zone-summary--cyan">{{ saveCount }}</span> {{ pluralPrize(saveCount) }}
        {{ pluralWait(saveCount) }}. Ещё немного — и {{ pluralThem(saveCount) }}.
      </template>
    </div>
  </template>
</template>

<style scoped>
.zone-toggles {
  display: flex;
  gap: 8px;
}
.zone-toggle {
  flex: 1;
  padding: 14px 10px;
  border-radius: 16px;
  border: 2px solid transparent;
  color: #F0F4FF;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  box-shadow: none;
  text-align: center;
}
.zone-toggle__label {
  font-size: 10px;
  margin-bottom: 8px;
  letter-spacing: 0.08em;
}
.zone-toggle__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  min-width: 48px;
  height: 40px;
  padding: 0 16px;
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
}
.zone-summary {
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  color: var(--pz-tx2);
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
}
.zone-summary--lime {
  color: var(--pz-lime);
  font-weight: 700;
}
.zone-summary--cyan {
  color: var(--pz-cyan);
  font-weight: 700;
}
</style>
