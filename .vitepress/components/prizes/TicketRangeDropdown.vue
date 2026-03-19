<script setup>
/**
 * TicketRangeDropdown — дропдаун фильтра диапазона тикетов
 */
import { ref, computed } from 'vue'
import { TICKET_RANGE_OPTS } from './prizoteka'
import PrizeIcons from './PrizeIcons.vue'

const props = defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const active = computed(() => props.modelValue !== 'all')

const current = computed(() =>
  TICKET_RANGE_OPTS.find(o => o.id === props.modelValue) || TICKET_RANGE_OPTS[0]
)

function select(id) {
  emit('update:modelValue', id)
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function blur() {
  setTimeout(() => { open.value = false }, 120)
}
</script>

<template>
  <div style="position: relative; display: inline-block;">
    <button
      class="pz-dropdown-btn"
      :class="{ 'pz-dropdown-btn--open': open || active }"
      @click="toggle"
      @blur="blur"
    >
      {{ current.label }}
      <PrizeIcons name="ui_chevron_down" :size="11" />
    </button>
    <div v-if="open" class="pz-dropdown-menu" style="min-width: 160px;">
      <div
        v-for="o in TICKET_RANGE_OPTS"
        :key="o.id"
        class="pz-dropdown-item"
        :class="{ 'pz-dropdown-item--active': o.id === modelValue }"
        @mousedown="select(o.id)"
      >
        {{ o.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.pz-dropdown-btn {
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.05);
}
.pz-dropdown-btn--open {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.10);
}
</style>
