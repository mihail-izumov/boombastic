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
    motto: 'ГРОХОТ И АЗАРТ',
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
    motto: 'ВОЛНА УДАЧИ',
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
    name: 'ТРК MARI',
    city: 'msk',
    address: 'ул. Поречная, 10, этаж 5',
    hours: '10:00 – 22:00',
    machines: 183,
    mapUrl: 'https://yandex.ru/maps/org/bumbastik/85769777303/',
    motto: 'КОРОЛЕВСКИЙ РАЗМАХ',
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
      <div class="parks-breadcrumb">b00m.fun / парки</div>
      <h1 class="parks-title">
        Аркадные <span class="parks-title-accent">арены</span>
      </h1>
      <p class="parks-subtitle">3 парка · 448 автоматов · 2 города</p>

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
        <!-- Card Header -->
        <div class="park-card-header">
          <div class="park-card-grid"></div>
          <div class="park-card-glow"></div>
          <div class="park-card-glow-bottom"></div>
          <div class="park-card-header-content">
            <div class="park-card-header-left">
              <h3 class="park-card-name">{{ park.name }}</h3>
              <div class="park-card-desc">{{ park.shortDesc }}</div>
            </div>
            <div class="park-card-machines" :style="{ color: park.accent }">{{ park.machines }}</div>
          </div>
          <div class="park-card-badge-wrap">
            <span class="park-badge" :style="{ color: park.tagColor, background: park.tagColor + '18', borderColor: park.tagColor + '25' }">
              {{ park.motto }}
            </span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="park-card-body">
          <!-- Top Machines -->
          <div class="park-top-label">🔥 Топ за {{ dayOfWeek }}, {{ dateStr }}</div>
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

          <!-- CTAs -->
          <div class="park-card-ctas">
            <button class="park-btn-primary" :style="{ '--accent': park.accent }" @click="openModal(park)">
              Подробнее
            </button>
            <button class="park-btn-secondary">
              Автоматы →
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

          <!-- Modal Header -->
          <div class="park-modal-header">
            <div class="park-modal-grid" :style="{ '--accent': modalPark.accent }"></div>
            <div class="park-modal-glow" :style="{ '--accent': modalPark.accent }"></div>
            <div class="park-modal-header-bottom">
              <div>
                <span class="park-badge" :style="{ color: modalPark.tagColor, background: modalPark.tagColor + '18', borderColor: modalPark.tagColor + '25' }">
                  {{ modalPark.motto }}
                </span>
                <h2 class="park-modal-name">{{ modalPark.name }}</h2>
              </div>
              <div class="park-modal-machines">{{ modalPark.machines }}</div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="park-modal-body">
            <p class="park-modal-desc">{{ modalPark.fullDesc }}</p>
            <div class="park-modal-nearby">Рядом: {{ modalPark.nearby.join(' · ') }}</div>

            <!-- Top machines -->
            <div class="park-top-label" style="margin-top: 16px;">🔥 Топ автоматов</div>
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
              <div class="park-modal-info-card">
                <span class="park-modal-info-icon">📍</span>
                <div class="park-modal-info-text">{{ modalPark.address }}</div>
              </div>
              <div class="park-modal-info-card">
                <span class="park-modal-info-icon">🕐</span>
                <div>
                  <div class="park-modal-info-text">{{ modalPark.hours }}</div>
                  <div class="park-modal-info-sub">ежедневно</div>
                </div>
              </div>
              <div class="park-modal-ctas">
                <button class="park-modal-btn-accent" :style="{ background: modalPark.accent }">Автоматы →</button>
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
   PAGE — uses vars from boom-styles.css
   ═══════════════════════════════════════ */
.parks-page {
  min-height: 100vh;
  background: var(--bg-deep, #1c1a3e);
  color: var(--text-pri, #F0F4FF);
  font-family: var(--font-body, 'Inter', sans-serif);
  padding-bottom: 20px;
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

.parks-breadcrumb {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #7A8BA8;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.parks-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: clamp(28px, 5vw, 44px);
  color: #F0F4FF;
  margin: 0;
  line-height: 1.1;
}

.parks-title-accent {
  color: #C5F946;
  text-shadow: 0 0 25px rgba(197,249,70,0.25);
}

.parks-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #7A8BA8;
  margin-top: 6px;
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

/* Card Header */
.park-card-header {
  height: 130px;
  position: relative;
  overflow: hidden;
  background: #1c1a3e;
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

.park-card:hover .park-card-glow {
  opacity: 1.4;
}

.park-card-glow-bottom {
  position: absolute;
  bottom: -20px; left: 50%;
  transform: translateX(-50%);
  width: 200px; height: 40px;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%);
  filter: blur(12px);
}

.park-card-header-content {
  position: absolute;
  top: 16px; left: 20px; right: 20px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.park-card-header-left {
  flex: 1;
}

.park-card-name {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #F0F4FF;
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.park-card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #7A8BA8;
  margin-top: 5px;
  line-height: 1.3;
  opacity: 0.8;
}

.park-card-machines {
  font-family: 'Space Mono', monospace;
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
  margin-left: 12px;
}

.park-card-badge-wrap {
  position: absolute;
  bottom: 12px; left: 20px;
  z-index: 1;
}

/* Badge */
.park-badge {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
}

/* Card Body */
.park-card-body {
  padding: 14px 20px 18px;
}

/* Top Machines */
.park-top-label {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  color: #7A8BA8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
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

.park-top-item.first {
  padding: 6px 10px;
}

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

/* Card CTAs */
.park-card-ctas {
  display: flex;
  gap: 8px;
}

.park-btn-primary {
  flex: 1;
  padding: 11px 16px;
  border-radius: 10px;
  border: none;
  background: #3d47a0;
  color: #F0F4FF;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.park-btn-primary:hover {
  background: var(--accent);
  color: #1a1840;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--accent) 40%, transparent);
}

.park-btn-primary:active { transform: scale(0.96); }

.park-btn-secondary {
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid rgba(0,212,255,0.25);
  background: transparent;
  color: #00D4FF;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.park-btn-secondary:hover {
  background: rgba(0,212,255,0.08);
  border-color: #00D4FF;
}

.park-btn-secondary:active { transform: scale(0.96); }

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
}

.park-modal-close {
  position: sticky;
  top: 12px;
  float: right;
  margin-right: 12px;
  z-index: 10;
  width: 30px; height: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
  color: #7A8BA8;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.park-modal-close:hover {
  background: rgba(255,255,255,0.12);
  color: #F0F4FF;
}

/* Modal Header */
.park-modal-header {
  height: 120px;
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  background: #0D1421;
}

.park-modal-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--accent) 10%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--accent) 10%, transparent) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.park-modal-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 300px; height: 140px;
  background: radial-gradient(ellipse,
    color-mix(in srgb, var(--accent) 18%, transparent),
    color-mix(in srgb, var(--accent) 7%, transparent),
    transparent 65%);
  filter: blur(20px);
}

.park-modal-header-bottom {
  position: absolute;
  bottom: 16px; left: 24px; right: 24px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.park-modal-name {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #F0F4FF;
  margin: 6px 0 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.park-modal-machines {
  font-family: 'Space Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

/* Modal Body */
.park-modal-body {
  padding: 20px 24px 24px;
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
}

.park-modal-info-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.park-modal-info-text {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #F0F4FF;
}

.park-modal-info-sub {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #7A8BA8;
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
  transition: all 0.2s ease;
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
  transition: all 0.2s ease;
}

.park-modal-btn-route:hover {
  background: rgba(0,212,255,0.08);
  border-color: #00D4FF;
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
  .parks-grid { padding: 20px 16px; }
  .park-card { max-width: 100%; }
  .park-card-ctas { flex-direction: column; }
  .park-btn-primary, .park-btn-secondary { width: 100%; text-align: center; }
  .park-modal-ctas { flex-direction: column; }
  .park-modal-btn-accent, .park-modal-btn-route { width: 100%; justify-content: center; text-align: center; }
}
</style>
