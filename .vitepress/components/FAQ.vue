<script setup>
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import SectionHeader from './SectionHeader.vue'

const { elRef, visible } = useReveal()
const openIdx = ref(null)

const sections = [
  {
    label: 'Карта и игра',
    icon: 'card',
    color: '#C5F946',
    items: [
      {
        q: 'Что такое B00M!-карта и как её получить?',
        a: 'Пластиковая карта гостя — твой «паспорт» в парке. На ней хранятся заряды (для игры на автоматах) и тикеты (выигрыш, который обмениваешь на призы). Получить карту можно на кассе любого парка за 30₽. Заряды и тикеты на карте не сгорают — можешь вернуться хоть через месяц.'
      },
      {
        q: 'Сколько стоит одна игра?',
        a: 'Одна игра стоит от 40 до 80₽ в зависимости от автомата. По вторникам в Турбо Режиме — всего 33₽ за любой автомат, независимо от обычной цены.'
      },
      {
        q: 'Заряды и тикеты на карте сгорают?',
        a: 'Нет. Заряды на карте не сгорают и хранятся бессрочно. Тикеты тоже остаются на карте — копи сколько хочешь и забирай призы когда будешь готов.'
      },
      {
        q: 'Есть ли возрастные ограничения?',
        a: 'Играть могут все — от 3 до 99 лет. Дети до 7 лет играют в сопровождении взрослых.'
      },
    ]
  },
  {
    label: 'Зарядка карты',
    icon: 'charge',
    color: '#FF6B00',
    items: [
      {
        q: 'Какие пакеты зарядов есть и какой выгоднее?',
        a: 'Шесть пакетов — чем больше сумма, тем больше бонусных зарядов:\n\n• 500₽ → 625 зарядов (+25%)\n• 1 000₽ → 1 300 зарядов (+30%)\n• 1 500₽ → 2 025 зарядов (+35%)\n• 2 000₽ → 2 800 зарядов (+40%)\n• 3 000₽ → 4 500 зарядов (+50%, PRO)\n• 5 000₽ → 8 000 зарядов (+60%, GOD MODE)\n\nСамый выгодный — GOD MODE за 5 000₽: получаешь на 60% больше зарядов. Но даже минимальный пакет за 500₽ уже даёт +25% бонусом.'
      },
      {
        q: 'Можно зарядить карту онлайн?',
        a: 'Да — через личный кабинет на lk.b00m.fun. Зарегистрируй аккаунт, привяжи карту и пополняй онлайн с теми же бонусами. Не нужно стоять в очереди на кассе.'
      },
      {
        q: 'Что такое «Турбо Режим» по вторникам?',
        a: 'Каждый вторник любой автомат в парке стоит 33₽ за игру — вместо обычных 40–80₽. Это лучший день для длинных сессий: ты получаешь заметно больше игр за те же деньги.'
      },
    ]
  },
  {
    label: 'Статусы и скидки',
    icon: 'status',
    color: '#FFD60A',
    items: [
      {
        q: 'Как работает система статусов?',
        a: 'Четыре уровня — каждый даёт скидку на все игры (расчёт при средней цене игры ~70₽):\n\n• Стандарт — базовые цены, ~21 игра за 1 500₽\n• Серебро (от 5 000₽) — скидка 15%, ~25 игр за 1 500₽\n• Золото (от 10 500₽) — скидка 30%, ~30 игр за 1 500₽\n• Платина (от 40 000₽) — скидка 50%, ~42 игры за 1 500₽\n\nСтатус растёт автоматически по сумме всех пополнений. Скидка применяется ко всем автоматам.'
      },
      {
        q: 'Как повысить статус?',
        a: 'Статус считается по общей сумме пополнений за всё время. Просто заряжай карту — система сама повысит уровень, когда накопится нужная сумма. Зарегистрируйся на сайте, чтобы следить за прогрессом до следующего статуса.'
      },
      {
        q: 'Статус может понизиться?',
        a: 'Статус считается по общей сумме всех твоих пополнений за всё время. Эта сумма только растёт — а значит и статус не понижается.'
      },
      {
        q: 'Как получить +500 бонусов при регистрации?',
        a: 'Создай аккаунт на сайте или в личном кабинете lk.b00m.fun — 500 бонусов начислятся автоматически. Регистрация занимает 30 секунд.'
      },
    ]
  },
  {
    label: 'Призы и тикеты',
    icon: 'prize',
    color: '#00FF88',
    items: [
      {
        q: 'Как получить приз?',
        a: 'Играй на автоматах → выигрывай тикеты → копи на карте → обменяй на приз на стойке в парке. В каждом парке более 250 призов на выбор.'
      },
      {
        q: 'Как пользоваться Призотекой на сайте?',
        a: 'Призотека — каталог всех призов парка у тебя в телефоне. Добавляй призы в корзину, введи свои тикеты — система покажет что можно забрать сейчас и сколько осталось до цели. Можно планировать до визита и прямо в парке у стойки.'
      },
      {
        q: 'Зачем копить тикеты, а не забирать мелочь сразу?',
        a: 'Чем больше накопишь — тем круче приз. На большие тикеты можно забрать колонки, часы или большие конструкторы. Не сливай тикеты на мелочь — копи на мечту. В Призотеке удобно следить за прогрессом.'
      },
    ]
  },
]

const SECTION_ICONS = {
  card: `<path d="M2 10V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"/><path d="M2 10v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7"/><path d="M2 10h20"/><rect x="6" y="14" width="4" height="2" rx="0.5"/>`,
  charge: `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>`,
  status: `<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>`,
  prize: `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>`,
}

function toggle(key) {
  openIdx.value = openIdx.value === key ? null : key
}

function formatAnswer(text) {
  return text.replace(/\n/g, '<br>')
}
</script>

<template>
  <section ref="elRef" class="boom-section">
    <div class="boom-wrap">
      <SectionHeader tag="FAQ" title="Частые вопросы">
        <template #icon>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><path d="M12 17h.01"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/></svg>
        </template>
      </SectionHeader>

      <div style="max-width: 680px; margin: 0 auto">
        <div
          v-for="(section, si) in sections"
          :key="si"
          class="faq-section"
          :style="{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(14px)', transition: `all 0.5s ease ${si * 0.1}s` }"
        >
          <!-- Section header -->
          <div class="faq-section-header">
            <div class="faq-section-icon" :style="{ background: section.color + '18', borderColor: section.color + '30' }">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" :stroke="section.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="SECTION_ICONS[section.icon]" />
            </div>
            <span class="faq-section-label" :style="{ color: section.color }">{{ section.label }}</span>
          </div>

          <!-- Items -->
          <div
            v-for="(item, ii) in section.items"
            :key="ii"
            style="margin-bottom: 6px"
          >
            <button
              class="faq-q"
              :class="{ open: openIdx === `${si}-${ii}` }"
              :style="{ '--sec-color': section.color }"
              @click="toggle(`${si}-${ii}`)"
            >
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0">
                <div class="faq-num" :class="{ open: openIdx === `${si}-${ii}` }" :style="openIdx === `${si}-${ii}` ? { color: 'var(--bg-deep)', background: section.color } : {}">
                  {{ String(ii + 1).padStart(2, '0') }}
                </div>
                <span class="faq-text" :class="{ open: openIdx === `${si}-${ii}` }" :style="openIdx === `${si}-${ii}` ? { color: section.color } : {}">{{ item.q }}</span>
              </div>
              <div class="faq-icon" :class="{ open: openIdx === `${si}-${ii}` }" :style="openIdx === `${si}-${ii}` ? { borderColor: section.color + '55', background: section.color + '12' } : {}">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="3" y1="7" x2="11" y2="7" :stroke="openIdx === `${si}-${ii}` ? section.color : 'var(--blue-3)'" stroke-width="2" stroke-linecap="round" />
                  <line x1="7" y1="3" x2="7" y2="11" :stroke="openIdx === `${si}-${ii}` ? section.color : 'var(--blue-3)'" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
            </button>
            <div class="faq-a-wrap" :style="{ height: openIdx === `${si}-${ii}` ? 'auto' : '0' }">
              <div class="faq-a" :style="{ borderLeftColor: section.color + '20' }">
                <p class="faq-a-text" v-html="formatAnswer(item.a)"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section { margin-bottom: 24px; }
.faq-section:last-child { margin-bottom: 0; }

.faq-section-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 10px; padding-left: 2px;
}
.faq-section-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid; flex-shrink: 0;
}
.faq-section-label {
  font-family: var(--font-mono, 'Space Mono', monospace);
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
}

.faq-q {
  width: 100%; padding: 14px 16px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: linear-gradient(135deg, rgba(50,48,100,0.7), rgba(40,38,80,0.85));
  border-radius: 8px; border-left: 3px solid rgba(90,100,180,0.4); transition: all 0.25s ease;
}
.faq-q.open {
  background: linear-gradient(135deg, rgba(197,249,70,0.04), rgba(34,32,80,0.95));
  border-radius: 8px 8px 0 0; border-left-color: var(--sec-color, var(--lime));
}
.faq-num {
  font-family: var(--font-mono, 'Space Mono', monospace); font-size: 10px; font-weight: 700;
  color: #9AA0C0; background: rgba(90,100,180,0.3);
  padding: 3px 7px; border-radius: 3px; transition: all 0.25s; flex-shrink: 0;
}
.faq-num.open { color: var(--bg-deep); }
.faq-text {
  font-family: var(--font-body, 'Inter', sans-serif); font-size: 15px; font-weight: 700;
  color: var(--text-pri, #F0F4FF); text-align: left; transition: color 0.25s;
}
.faq-icon {
  width: 34px; height: 34px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid rgba(90,100,180,0.4); border-radius: 5px;
  background: transparent; transition: all 0.25s; transform: rotate(0deg);
}
.faq-icon.open {
  transform: rotate(45deg);
}
.faq-a-wrap { overflow: hidden; transition: height 0.3s ease; }
.faq-a {
  padding: 14px 16px 18px;
  background: rgba(34,32,80,0.5);
  border-radius: 0 0 8px 8px;
  border-left: 3px solid rgba(197,249,70,0.12);
}
.faq-a-text {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 14px; color: var(--text-pri, #F0F4FF);
  line-height: 1.75; margin: 0; opacity: 0.85;
}

@media (max-width: 768px) {
  .faq-q { padding: 12px 14px; }
  .faq-text { font-size: 14px; }
  .faq-a { padding: 12px 14px 16px; }
  .faq-a-text { font-size: 13px; }
}
</style>
