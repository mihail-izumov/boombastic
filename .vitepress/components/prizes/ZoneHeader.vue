<script setup>
/**
 * ZoneHeader — разделитель-заголовок «Хватает сейчас» / «Надо подкопить»
 */
defineProps({
  label: { type: String, required: true },
  color: { type: String, default: 'var(--pz-green)' },
  count: { type: Number, default: null },
})
</script>

<template>
  <div class="zone-header">
    <div class="zone-header__line" />
    <h3 class="zone-header__label">
      {{ label }}
      <span v-if="count != null" class="zone-header__count">{{ count }}</span>
    </h3>
    <div class="zone-header__line" />
  </div>
</template>

<style scoped>
.zone-header {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 24px;
}
.zone-header__line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
}
.zone-header__label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #F0F4FF;
  font-weight: 700;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.zone-header__count {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #F0F4FF;
}
</style>
