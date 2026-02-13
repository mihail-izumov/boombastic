<script setup>
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import SectionHeader from './SectionHeader.vue'

const { elRef, visible } = useReveal()
const openIdx = ref(-1)

function toggle(i) {
  openIdx.value = openIdx.value === i ? -1 : i
}

const items = [
  { q: 'Что такое B00M!-карта?', a: 'Пластиковая карта гостя. На ней хранятся заряды (для игры) и бонусы (выигрыш). Получи бесплатно на кассе.' },
  { q: 'Сколько стоит играть?', a: '1 заряд = 10₽. Автомат потребляет от 2 до 8 зарядов за игру.' },
  { q: 'Как обменять бонусы на призы?', a: 'Подойди на стойку призов, назови номер карты или покажи QR. Более 270 призов в каждом парке.' },
  { q: 'Есть ли возрастные ограничения?', a: 'Играть могут все — от 3 до 99 лет. Дети до 7 лет — в сопровождении взрослых.' },
  { q: 'Можно ли вернуть заряды?', a: 'Неиспользованные заряды остаются на карте бессрочно.' },
  { q: 'Где находятся парки?', a: 'Самара — 3 локации. Следи за обновлениями.' },
]
</script>

<template>
  <section ref="elRef" class="boom-section">
    <div class="boom-wrap">
      <SectionHeader tag="FAQ" title="Частые вопросы">
        <template #icon>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M12 17h.01"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/></svg>
        </template>
      </SectionHeader>

      <div class="boom-content-narrow">
        <div
          v-for="(item, i) in items"
          :key="i"
          :style="{
            marginBottom: '8px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(10px)',
            transition: `all 0.4s ease ${i * 0.05}s`,
          }"
        >
          <button
            @click="toggle(i)"
            :style="{
              width: '100%', padding: '14px 16px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
              background: openIdx === i
                ? 'linear-gradient(135deg, rgba(197,249,70,0.07), rgba(34,32,80,0.95))'
                : 'linear-gradient(135deg, rgba(50,48,100,0.7), rgba(40,38,80,0.85))',
              borderRadius: openIdx === i ? '8px 8px 0 0' : '8px',
              borderLeft: `3px solid ${openIdx === i ? 'var(--lime)' : 'rgba(90,100,180,0.4)'}`,
              transition: 'all 0.25s ease',
            }"
          >
            <div style="display: flex; align-items: center; gap: 10px">
              <div :style="{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                color: openIdx === i ? 'var(--bg-deep)' : '#9AA0C0',
                background: openIdx === i ? 'var(--lime)' : 'rgba(90,100,180,0.3)',
                padding: '3px 7px', borderRadius: '3px', transition: 'all 0.25s',
              }">{{ String(i + 1).padStart(2, '0') }}</div>
              <span :style="{
                fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: 700,
                color: openIdx === i ? 'var(--lime)' : 'var(--text-pri)',
                textAlign: 'left', transition: 'color 0.25s',
              }">{{ item.q }}</span>
            </div>
            <div :style="{
              width: '34px', height: '34px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1.5px solid ${openIdx === i ? 'rgba(197,249,70,0.4)' : 'rgba(90,100,180,0.4)'}`,
              borderRadius: '5px',
              background: openIdx === i ? 'rgba(197,249,70,0.08)' : 'transparent',
              transition: 'all 0.25s',
              transform: openIdx === i ? 'rotate(45deg)' : 'none',
            }">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="3" y1="7" x2="11" y2="7" :stroke="openIdx === i ? 'var(--lime)' : 'var(--blue-3)'" stroke-width="2" stroke-linecap="round" />
                <line x1="7" y1="3" x2="7" y2="11" :stroke="openIdx === i ? 'var(--lime)' : 'var(--blue-3)'" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
          </button>
          <Transition name="faq">
            <div v-if="openIdx === i" style="overflow: hidden">
              <div :style="{
                padding: '14px 16px 18px',
                background: 'rgba(34,32,80,0.5)',
                borderRadius: '0 0 8px 8px',
                borderLeft: '3px solid rgba(197,249,70,0.12)',
              }">
                <p style="font-family: var(--font-body); font-size: 14px; color: var(--text-pri); line-height: 1.7; margin: 0">{{ item.a }}</p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-enter-active,
.faq-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}
.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
