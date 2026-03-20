<script setup>
/**
 * SortChips — чипы сортировки (Дешевле ↑ / Дороже ↓)
 */
defineProps({
  modelValue: { type: String, required: true },
  options: {
    type: Array,
    required: true,
    // [{ id: 'tickets-asc', label: 'Дешевле', icon: '↑' }, ...]
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="sort-chips">
    <button
      v-for="s in options"
      :key="s.id"
      class="sort-chip"
      :class="{ 'sort-chip--active': modelValue === s.id }"
      @click="emit('update:modelValue', s.id)"
    >
      <span v-if="s.icon" class="sort-chip__icon">{{ s.icon }}</span>
      {{ s.label }}
    </button>
  </div>
</template>

<style scoped>
.sort-chips {
  display: flex;
  gap: 5px;
  flex-wrap: nowrap;
}
.sort-chip {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  border: 1px solid rgba(74, 90, 173, 0.25);
  background: transparent;
  color: var(--pz-tx1);
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.18s;
  font-weight: 500;
  white-space: nowrap;
}
.sort-chip--active {
  border-color: rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.10);
  font-weight: 700;
}
.sort-chip__icon {
  margin-right: 2px;
}
@media (max-width: 768px) {
  .sort-chip {
    padding: 10px 14px;
    font-size: 13px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}
</style>
