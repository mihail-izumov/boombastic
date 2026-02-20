<script setup>
import { ref, computed } from 'vue'

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */
const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу']
const today = new Date()
const dayOfWeek = dayNames[today.getDay()]
const dateStr = `${today.getDate()}.${String(today.getMonth() + 1).padStart(2, '0')}`

const parks = [
  {
    id: 'ohta',
    name: 'Охта Молл',
    city: 'spb',
    address: 'Брантовская дор., 3, этаж 3',
    hours: '10:00 – 22:00',
    machines: 131,
    mapUrl: 'https://yandex.ru/maps/org/bumbastik/206862982241/',
    topMachines: ['Big Bass Wheel', 'Funky Box', 'Treasure Quest'],
    nearby: ['Todes', 'Joki Joya', 'КИНО-5D', 'MIR VR'],
    tagColor: '#FF0080',
    accent: '#FF0080',
    shortDesc: 'Жёсткая арена. Конкуренция в каждом углу.',
    fullDesc: 'Плотная конкурентная среда: 9 соседей в ТЦ. Танцевальный Dance Baze собирает фанатов со всего города. Рядом Todes — дети забегают после занятий.',
    glowColor1: 'rgba(255,0,128,0.08)',
    glowColor2: 'rgba(255,0,128,0.15)',
  },
  {
    id: 'piterland',
    name: 'Питерлэнд',
    city: 'spb',
    address: 'Приморский пр., 72',
    hours: '10:00 – 22:00',
    machines: 134,
    mapUrl: 'https://yandex.ru/maps/org/bumbastik/1733659584/',
    topMachines: ['Big Bass Wheel', 'Funky Box', 'Small Bass Wheel'],
    nearby: ['Аквапарк', 'Отель', 'Фудкорт'],
    tagColor: '#C5F946',
    accent: '#C5F946',
    shortDesc: 'Курортная арена. Аквапарк и отель рядом.',
    fullDesc: 'Самый стабильный парк сети. Аквапарк и отель рядом — семьи совмещают визиты. Pump It Up притягивает фанатов танцевальных аркад со всего города.',
    glowColor1: 'rgba(197,249,70,0.06)',
    glowColor2: 'rgba(197,249,70,0.12)',
  },
  {
    id: 'mari',
    name: 'MARI',
    city: 'msk',
    address: 'ул. Поречная, 10, этаж 5',
    hours: '10:00 – 22:00',
    machines: 183,
    mapUrl: 'https://yandex.ru/maps/org/bumbastik/85769777303/',
    topMachines: ['Funky Box', 'Treasure Quest', 'Big Bass Wheel'],
    nearby: ['Кинотеатр', 'Фудкорт', 'Каток'],
    tagColor: '#FFD60A',
    accent: '#FFD60A',
    shortDesc: 'Флагман. Максимум автоматов в сети.',
    fullDesc: 'Самый большой парк Бумбастик. 183 автомата — максимум в сети. 5 этаж ТРК MARI. Danz Base для любителей танцевальных баттлов.',
    glowColor1: 'rgba(255,214,10,0.06)',
    glowColor2: 'rgba(255,214,10,0.12)',
  },
]

const cities = [
  { id: 'spb', label: 'Санкт-Петербург', parks: 2, vk: 'bumbastik_spb', vkUrl: 'https://vk.com/bumbastik_spb' },
  { id: 'msk', label: 'Москва', parks: 1, vk: 'bumbastik_msc', vkUrl: 'https://vk.com/bumbastik_msc' },
]

/* ═══════════════════════════════════════
   STATE
   ═══════════════════════════════════════ */
const activeCity = ref('spb')
const modalPark = ref(null)
const animKey = ref(0)

const filteredParks = computed(() => parks.filter(p => p.city === activeCity.value))
const currentCity = computed(() => cities.find(c => c.id === activeCity.value))

function switchCity(cityId) {
  activeCity.value = cityId
  animKey.value++
}

function openModal(park) {
  modalPark.value = park
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
}

function closeModal() {
  modalPark.value = null
  if (typeof document !== 'undefined') document.body.style.overflow = ''
}
</script>

<template>
  <div class="parks-page">

    <!-- Header -->
    <div class="parks-header">
      <!-- Заголовок как вход в портал -->
      <div class="parks-title">
        <span class="parks-title-line1">Аркадные</span>
        <span class="parks-title-line2">парки</span>
      </div>
      <p class="parks-subtitle">3 парка · 448 машин</p>

      <!-- City Tabs -->
      <div class="parks-tabs">
        <button
          v-for="city in cities"
          :key="city.id"
          class="parks-tab"
          :class="{ active: activeCity === city.id }"
          @click="switchCity(city.id)"
        >
          {{ city.label }}
          <span class="parks-tab-count">{{ city.parks }}</span>
        </button>
      </div>
    </div>

    <!-- Parks Grid -->
    <div class="parks-grid" :key="animKey">
      <div
        v-for="(park, i) in filteredParks"
        :key="park.id"
        class="park-card"
        :style="{ '--accent': park.accent, '--glow1': park.glowColor1, '--glow2': park.glowColor2, '--delay': i * 0.12 + 's' }"
      >
        <!-- Card Header — геймерский стиль -->
        <div class="park-card-header">
          <div class="park-card-grid"></div>
          <div class="park-card-glow"></div>
          <!-- Название парка — большое, в цвете акцента -->
          <div class="park-card-title-block">
            <h3 class="park-card-name" :style="{ color: park.accent }">{{ park.name }}</h3>
          </div>
        </div>

        <!-- Card Content -->
        <div class="park-card-body">
          <!-- Описание — в цвете акцента, крупнее -->
          <div class="park-card-desc" :style="{ color: park.accent }">{{ park.shortDesc }}</div>
          
          <!-- Бейдж с машинами + кнопка АРЕНЫ -->
          <div class="park-card-stat-row" :style="{ '--chip-color': park.accent }">
            <span class="park-card-stat-number">{{ park.machines }}</span>
            <span class="park-card-stat-label">машин</span>
            <a href="/machines" class="park-card-stat-btn">
              <span class="park-card-stat-btn-bracket">[</span>
              <svg class="park-card-stat-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m20 17-5-5 5-5"/><path d="m4 17 5-5-5-5"/></svg>
              <span class="park-card-stat-btn-text">арены</span>
              <span class="park-card-stat-btn-bracket">]</span>
            </a>
          </div>

          <!-- Top Machines -->
          <div class="park-top-label">
            <svg class="park-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
            Топ за {{ dayOfWeek }}, {{ dateStr }}
          </div>
          <div class="park-top-list">
            <div
              v-for="(m, j) in park.topMachines"
              :key="m"
              class="park-top-item"
              :class="{ first: j === 0 }"
              :style="j === 0 ? { background: park.accent + '10', borderColor: park.accent + '15' } : {}"
            >
              <span class="park-top-num" :style="{ color: j === 0 ? park.accent : 'rgba(255,255,255,0.25)', fontSize: j === 0 ? '14px' : '11px' }">{{ j + 1 }}</span>
              <span class="park-top-name" :class="{ 'first-name': j === 0 }">{{ m }}</span>
            </div>
          </div>

          <!-- CTA — только Подробнее -->
          <div class="park-card-ctas">
            <button class="park-btn-primary" :style="{ '--accent': park.accent }" @click="openModal(park)">
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VK Section -->
    <div class="parks-vk-section">
      <div class="parks-vk-label">Сообщество · {{ currentCity.label }}</div>
      <a :href="currentCity.vkUrl" target="_blank" rel="noopener noreferrer" class="parks-vk-card">
        <div class="parks-vk-icon">VK</div>
        <div class="parks-vk-info">
          <div class="parks-vk-name">Бумбастик</div>
          <div class="parks-vk-handle">@{{ currentCity.vk }}</div>
        </div>
      </a>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalPark" class="park-modal-overlay" @click="closeModal">
        <div class="park-modal" @click.stop :style="{ '--accent': modalPark.accent }">

          <!-- Close -->
          <button class="park-modal-close" @click="closeModal">✕</button>

          <!-- Modal Header — геймерский стиль -->
          <div class="park-modal-header">
            <div class="park-modal-grid"></div>
            <div class="park-modal-glow" :style="{ '--accent': modalPark.accent }"></div>
            <!-- Название парка — большое, в цвете акцента -->
            <h2 class="park-modal-name" :style="{ color: modalPark.accent }">{{ modalPark.name }}</h2>
          </div>

          <!-- Modal Body -->
          <div class="park-modal-body">
            <!-- Бейдж с машинами — на всю ширину, яркий -->
            <div class="park-modal-stat-bar" :style="{ '--bar-color': modalPark.accent }">
              <span class="park-modal-stat-number">{{ modalPark.machines }}</span>
              <span class="park-modal-stat-label">машин</span>
            </div>

            <p class="park-modal-desc">{{ modalPark.fullDesc }}</p>
            <div class="park-modal-nearby">Рядом: {{ modalPark.nearby.join(' · ') }}</div>

            <!-- Top machines -->
            <div class="park-top-label" style="margin-top: 16px;">
              <svg class="park-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
              Топ автоматов сегодня
            </div>
            <div class="park-top-list">
              <div
                v-for="(m, j) in modalPark.topMachines"
                :key="m"
                class="park-top-item"
                :class="{ first: j === 0 }"
                :style="j === 0 ? { background: modalPark.accent + '10', borderColor: modalPark.accent + '15' } : {}"
              >
                <span class="park-top-num" :style="{ color: j === 0 ? modalPark.accent : 'rgba(255,255,255,0.25)', fontSize: j === 0 ? '16px' : '12px' }">{{ j + 1 }}</span>
                <span class="park-top-name" :class="{ 'first-name': j === 0 }" :style="{ fontSize: j === 0 ? '15px' : '13px' }">{{ m }}</span>
              </div>
            </div>

            <!-- Info + CTAs block -->
            <div class="park-modal-info-block">
              <!-- Адрес — КЛИКАБЕЛЬНЫЙ со стрелкой -->
              <a :href="modalPark.mapUrl" target="_blank" rel="noopener noreferrer" class="park-modal-info-card park-modal-info-link">
                <svg class="park-icon-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>
                <div class="park-modal-info-text">{{ modalPark.address }}</div>
                <svg class="park-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </a>
              <!-- Время работы -->
              <div class="park-modal-info-card">
                <svg class="park-icon-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6l4 2"/><path d="M22 12a10 10 0 1 0-11 9.95"/><path d="m22 16-5.5 5.5L14 19"/></svg>
                <div class="park-modal-info-time">
                  <div class="park-modal-info-text">{{ modalPark.hours }}</div>
                  <div class="park-modal-info-sub">ежедневно</div>
                </div>
              </div>
              <div class="park-modal-ctas">
                <button class="park-modal-btn-accent" :style="{ background: modalPark.accent }">
                  Автоматы
                  <svg class="park-icon-btn-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
                <a :href="modalPark.mapUrl" target="_blank" rel="noopener noreferrer" class="park-modal-btn-route">Маршрут</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */
.parks-page {
  min-height: 100vh;
  background: var(--bg-deep, #1c1a3e);
  color: var(--text-pri, #F0F4FF);
  font-family: var(--font-body, 'Inter', sans-serif);
  padding-bottom: 20px;
}

/* ═══════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════ */
.park-icon-sm {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  vertical-align: -1px;
}

.park-icon-btn {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.park-icon-btn-dark {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #1a1840;
}

.park-icon-info {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #7A8BA8;
  transition: color 0.2s ease;
}

.park-icon-arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #7A8BA8;
  margin-left: auto;
  opacity: 0;
  transition: all 0.2s ease;
}

/* ═══════════════════════════════════════
   HEADER
   ═══════════════════════════════════════ */
.parks-header {
  padding: 48px 24px 0;
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
  animation: fadeSlideUp 0.4s ease;
}

/* Заголовок как вход в портал — 2 строки */
.parks-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  line-height: 1;
}

.parks-title-line1,
.parks-title-line2 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(32px, 6vw, 52px);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.parks-title-line1 {
  color: #F0F4FF;
}

.parks-title-line2 {
  color: #C5F946;
  text-shadow: 0 0 30px rgba(197,249,70,0.3);
}

.parks-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #7A8BA8;
  margin-top: 12px;
}

/* ═══════════════════════════════════════
   CITY TABS
   ═══════════════════════════════════════ */
.parks-tabs {
  display: inline-flex;
  gap: 4px;
  margin-top: 20px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  padding: 4px;
}

.parks-tab {
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #7A8BA8;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.parks-tab.active {
  background: rgba(197,249,70,0.12);
  color: #C5F946;
}

.parks-tab-count {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  opacity: 0.6;
}

/* ═══════════════════════════════════════
   PARKS GRID
   ═══════════════════════════════════════ */
.parks-grid {
  max-width: 960px;
  margin: 0 auto;
  padding: 28px 24px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

/* ═══════════════════════════════════════
   PARK CARD
   ═══════════════════════════════════════ */
.park-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid transparent;
  background-image:
    linear-gradient(145deg, rgba(28,26,62,0.95), rgba(34,32,80,0.9)),
    linear-gradient(145deg, rgba(255,255,255,0.1), rgba(74,90,173,0.18), rgba(255,255,255,0.04));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  transition: all 0.35s ease;
  width: 100%;
  max-width: 440px;
  min-width: 280px;
  animation: fadeSlideUp 0.45s ease var(--delay, 0s) both;
}

.park-card:hover {
  transform: translateY(-3px);
  background-image:
    linear-gradient(145deg, rgba(28,26,62,0.92), rgba(40,38,90,0.88)),
    linear-gradient(145deg, color-mix(in srgb, var(--accent) 28%, transparent), rgba(74,90,173,0.25), color-mix(in srgb, var(--accent) 12%, transparent));
  box-shadow: 0 10px 35px rgba(0,0,0,0.4), 0 0 25px color-mix(in srgb, var(--accent) 8%, transparent);
}

/* ═══════════════════════════════════════
   CARD HEADER — геймерский стиль
   ═══════════════════════════════════════ */
.park-card-header {
  height: 80px;
  position: relative;
  overflow: hidden;
  background: #1c1a3e;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.park-card-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--accent) 7%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--accent) 7%, transparent) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.park-card-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 260px; height: 140px;
  background: radial-gradient(ellipse, var(--glow2), var(--glow1), transparent 70%);
  filter: blur(25px);
  transition: opacity 0.4s ease;
}

.park-card:hover .park-card-glow { opacity: 1.4; }

/* Название парка — большое, в цвете акцента */
.park-card-title-block {
  position: relative;
  z-index: 1;
}

.park-card-name {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 26px;
  margin: 0;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 30px currentColor;
}

/* Card Body */
.park-card-body {
  padding: 16px 20px 18px;
}

/* Описание — крупное, в цвете акцента */
.park-card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 14px;
  opacity: 0.9;
}

/* Бейдж с машинами + кнопка */
.park-card-stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--chip-color) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--chip-color) 20%, transparent);
  margin-bottom: 16px;
}

.park-card-stat-row .park-card-stat-number {
  font-family: 'Space Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: var(--chip-color);
}

.park-card-stat-row .park-card-stat-label {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--chip-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.85;
}

/* Кнопка в стиле Marathon [ ⟷ АРЕНЫ ] */
.park-card-stat-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none !important;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--chip-color) !important;
  transition: all 0.2s ease;
}

.park-card-stat-btn-bracket {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.park-card-stat-btn-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.park-card-stat-btn-text {
  padding: 3px 8px;
  border-radius: 4px;
  background: transparent;
  transition: all 0.2s ease;
}

.park-card-stat-btn:hover {
  color: var(--chip-color) !important;
}

.park-card-stat-btn:hover .park-card-stat-btn-bracket {
  opacity: 1;
}

.park-card-stat-btn:hover .park-card-stat-btn-icon {
  transform: scaleX(1.2);
}

.park-card-stat-btn:hover .park-card-stat-btn-text {
  background: var(--chip-color);
  color: #1a1840 !important;
}

/* Top Machines */
.park-top-label {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  color: #7A8BA8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.park-top-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 14px;
}

.park-top-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.park-top-item.first { padding: 6px 10px; }

.park-top-num {
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  width: 18px;
  text-align: right;
  font-size: 11px;
}

.park-top-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #7A8BA8;
}

.park-top-name.first-name {
  font-size: 14px;
  font-weight: 700;
  color: #F0F4FF;
}

/* ═══════════════════════════════════════
   CARD CTA
   ═══════════════════════════════════════ */
.park-card-ctas {
  display: flex;
}

.park-btn-primary {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  background: #3d47a0;
  color: #F0F4FF;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.park-btn-primary:hover {
  background: var(--accent);
  color: #1a1840;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--accent) 40%, transparent);
}

.park-btn-primary:active { transform: scale(0.96); }

/* ═══════════════════════════════════════
   VK SECTION
   ═══════════════════════════════════════ */
.parks-vk-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px 0 40px;
  animation: fadeSlideUp 0.4s ease 0.3s both;
}

.parks-vk-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: #7A8BA8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.parks-vk-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(74,90,173,0.15);
  text-decoration: none;
  transition: all 0.3s ease;
}

.parks-vk-card:hover {
  border-color: #C5F946;
  background: rgba(197,249,70,0.05);
  transform: translateY(-2px);
}

.parks-vk-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0077FF, #0055CC);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 900;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  flex-shrink: 0;
}

.parks-vk-name {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #F0F4FF;
}

.parks-vk-handle {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: #C5F946;
}

/* ═══════════════════════════════════════
   MODAL
   ═══════════════════════════════════════ */
.park-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.25s ease;
}

.park-modal {
  background: #0D1421;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  border: 1px solid color-mix(in srgb, var(--accent) 12%, transparent);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px color-mix(in srgb, var(--accent) 5%, transparent);
  animation: slideUp 0.3s ease;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--accent) 40%, transparent) transparent;
}

.park-modal::-webkit-scrollbar {
  width: 6px;
}

.park-modal::-webkit-scrollbar-track {
  background: transparent;
}

.park-modal::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: 3px;
}

.park-modal::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--accent) 60%, transparent);
}

.park-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 32px; height: 32px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  background: rgba(0,0,0,0.4);
  color: color-mix(in srgb, var(--accent) 50%, #7A8BA8);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.park-modal-close:hover {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 35%, transparent);
}

/* ═══════════════════════════════════════
   MODAL HEADER — геймерский стиль
   ═══════════════════════════════════════ */
.park-modal-header {
  height: 140px;
  position: relative;
  overflow: visible; /* грид выходит за пределы */
  border-radius: 16px 16px 0 0;
  background: #0D1421;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

/* Грид на всю ширину + fade внизу */
.park-modal-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px; /* выходит за header */
  background-image:
    linear-gradient(color-mix(in srgb, var(--accent) 15%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--accent) 15%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: 0 0;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}

.park-modal-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 350px; height: 150px;
  background: radial-gradient(ellipse,
    color-mix(in srgb, var(--accent) 20%, transparent),
    color-mix(in srgb, var(--accent) 8%, transparent),
    transparent 65%);
  filter: blur(25px);
}

/* Название парка — большое, в цвете акцента */
.park-modal-name {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 32px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 40px currentColor;
}

/* Modal Body */
.park-modal-body {
  padding: 20px 24px 24px;
}

/* Бейдж с машинами — строка на всю ширину */
.park-modal-stat-bar {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--bar-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--bar-color) 25%, transparent);
  margin-bottom: 16px;
}

.park-modal-stat-bar .park-modal-stat-number {
  font-family: 'Space Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  color: var(--bar-color);
}

.park-modal-stat-bar .park-modal-stat-label {
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--bar-color);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.park-modal-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #F0F4FF;
  line-height: 1.5;
  margin: 0 0 10px;
  opacity: 0.9;
}

.park-modal-nearby {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #7A8BA8;
  margin-bottom: 4px;
}

/* Modal Info Block */
.park-modal-info-block {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(74,90,173,0.12);
  margin-top: 18px;
}

.park-modal-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(74,90,173,0.1);
  margin-bottom: 8px;
  text-decoration: none;
}

/* Кликабельный адрес */
.park-modal-info-link {
  cursor: pointer;
  transition: all 0.2s ease;
}

.park-modal-info-link:hover {
  background: rgba(0,212,255,0.06);
  border-color: rgba(0,212,255,0.2);
}

.park-modal-info-link:hover .park-icon-info {
  color: #00D4FF;
}

.park-modal-info-link:hover .park-icon-arrow {
  opacity: 1;
  color: #00D4FF;
}

.park-modal-info-link:hover .park-modal-info-text {
  color: #00D4FF;
}

.park-modal-info-text {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #F0F4FF;
  transition: color 0.2s ease;
}

/* Время работы — компактный межстрочный */
.park-modal-info-time {
  line-height: 1.15;
}

.park-modal-info-sub {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #7A8BA8;
  margin-top: 1px;
}

.park-modal-ctas {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.park-modal-btn-accent {
  flex: 1;
  padding: 13px 20px;
  border-radius: 10px;
  border: none;
  color: #1a1840;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.park-modal-btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 35%, transparent);
  filter: brightness(1.1);
}

.park-modal-btn-accent:active { transform: scale(0.96); }

.park-modal-btn-route {
  padding: 13px 20px;
  border-radius: 10px;
  border: 1px solid rgba(0,212,255,0.3);
  background: transparent;
  color: #00D4FF;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.25s ease;
}

.park-modal-btn-route:hover {
  background: rgba(0,212,255,0.08);
  border-color: #00D4FF;
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════ */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════
   SCROLLBAR
   ═══════════════════════════════════════ */
.park-modal::-webkit-scrollbar { width: 4px; }
.park-modal::-webkit-scrollbar-track { background: transparent; }
.park-modal::-webkit-scrollbar-thumb { background: rgba(197,249,70,0.2); border-radius: 2px; }

/* ═══════════════════════════════════════
   MOBILE
   ═══════════════════════════════════════ */
@media (max-width: 768px) {
  .parks-header { padding-top: 32px; }
  .parks-title-line1,
  .parks-title-line2 { font-size: clamp(28px, 8vw, 40px); }
  .parks-grid { padding: 20px 16px; }
  .park-card { max-width: 100%; }
  .park-card-name { font-size: 22px; letter-spacing: 1.5px; }
  .park-card-desc { font-size: 14px; }
  .park-card-stat-row { padding: 8px 12px; }
  .park-card-stat-row .park-card-stat-number { font-size: 22px; }
  .park-card-stat-row .park-card-stat-label { font-size: 10px; }
  .park-card-stat-btn { font-size: 10px; }
  .park-card-stat-btn-icon { width: 12px; height: 12px; }
  .park-card-stat-btn-text { padding: 2px 6px; }
  .park-modal-name { font-size: 24px; letter-spacing: 2px; }
  .park-modal-stat-bar .park-modal-stat-number { font-size: 28px; }
  .park-modal-ctas { flex-direction: column; }
  .park-modal-btn-accent, .park-modal-btn-route { width: 100%; justify-content: center; text-align: center; }
}
</style>
