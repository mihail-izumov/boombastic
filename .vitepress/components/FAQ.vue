<script setup>
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import SectionHeader from './SectionHeader.vue'

const { elRef, visible } = useReveal()
const openIdx = ref(-1)

const items = [
  { q: 'Что такое B00M!-карта?', a: 'Пластиковая карта гостя. На ней хранятся заряды (для игры) и бонусы (выигрыш). Получи бесплатно на кассе.' },
  { q: 'Сколько стоит играть?', a: '1 заряд = 10₽. Автомат потребляет от 2 до 8 зарядов за игру.' },
  { q: 'Как обменять бонусы на призы?', a: 'Подойди на стойку призов, назови номер карты или покажи QR. Более 270 призов в каждом парке.' },
  { q: 'Есть ли возрастные ограничения?', a: 'Играть могут все — от 3 до 99 лет. Дети до 7 лет — в сопровождении взрослых.' },
  { q: 'Можно ли вернуть заряды?', a: 'Неиспользованные заряды остаются на карте бессрочно.' },
  { q: 'Где находятся парки?', a: 'Самара — 3 локации. Следи за обновлениями.' },
]

function toggle(i) { openIdx.value = openIdx.value === i ? -1 : i }
</script>

<template>
  <section ref="elRef" class="boom-section">
    <div class="boom-wrap">
      <SectionHeader tag="FAQ" title="Частые вопросы">
        <template #icon>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><path d="M12 17h.01"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/></svg>
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
          <button class="faq-q" :class="{ open: openIdx === i }" @click="toggle(i)">
            <div style="display: flex; align-items: center; gap: 10px">
              <div class="faq-num" :class="{ open: openIdx === i }">{{ String(i + 1).padStart(2, '0') }}</div>
              <span class="faq-text" :class="{ open: openIdx === i }">{{ item.q }}</span>
            </div>
            <div class="faq-icon" :class="{ open: openIdx === i }">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="3" y1="7" x2="11" y2="7" :stroke="openIdx === i ? 'var(--lime)' : 'var(--blue-3)'" stroke-width="2" stroke-linecap="round" />
                <line x1="7" y1="3" x2="7" y2="11" :stroke="openIdx === i ? 'var(--lime)' : 'var(--blue-3)'" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
          </button>
          <div class="faq-a-wrap" :style="{ height: openIdx === i ? 'auto' : '0' }">
            <div class="faq-a">
              <p style="font-family: var(--font-body); font-size: 14px; color: var(--text-pri); line-height: 1.7; margin: 0">{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-q {
  width: 100%; padding: 14px 16px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: linear-gradient(135deg, rgba(50,48,100,0.7), rgba(40,38,80,0.85));
  border-radius: 8px; border-left: 3px solid rgba(90,100,180,0.4); transition: all 0.25s ease;
}
.faq-q.open {
  background: linear-gradient(135deg, rgba(197,249,70,0.07), rgba(34,32,80,0.95));
  border-radius: 8px 8px 0 0; border-left-color: var(--lime);
}
.faq-num {
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  color: #9AA0C0; background: rgba(90,100,180,0.3);
  padding: 3px 7px; border-radius: 3px; transition: all 0.25s;
}
.faq-num.open { color: var(--bg-deep); background: var(--lime); }
.faq-text {
  font-family: var(--font-body); font-size: 15px; font-weight: 700;
  color: var(--text-pri); text-align: left; transition: color 0.25s;
}
.faq-text.open { color: var(--lime); }
.faq-icon {
  width: 34px; height: 34px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid rgba(90,100,180,0.4); border-radius: 5px;
  background: transparent; transition: all 0.25s; transform: rotate(0deg);
}
.faq-icon.open {
  border-color: rgba(197,249,70,0.4); background: rgba(197,249,70,0.08); transform: rotate(45deg);
}
.faq-a-wrap { overflow: hidden; transition: height 0.3s ease; }
.faq-a {
  padding: 14px 16px 18px;
  background: rgba(34,32,80,0.5);
  border-radius: 0 0 8px 8px;
  border-left: 3px solid rgba(197,249,70,0.12);
}
</style>
