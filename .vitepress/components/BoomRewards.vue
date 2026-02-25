<script setup>
import { ref, computed } from 'vue'

// State
const userSpent = ref(0)
const openFaq = ref(null)
const isModalOpen = ref(false)

// Data
const levels = [
  { id: 'platinum', name: 'ПЛАТИНА', nameGenitive: 'ПЛАТИНЫ', threshold: 45000, discount: 50, color: '#FF0080', gamesAt1500: 42, icon: 'crown' },
  { id: 'gold', name: 'ЗОЛОТО', nameGenitive: 'ЗОЛОТА', threshold: 10500, discount: 30, color: '#FFD60A', gamesAt1500: 30, icon: 'medal' },
  { id: 'silver', name: 'СЕРЕБРО', nameGenitive: 'СЕРЕБРА', threshold: 5000, discount: 15, color: '#00D4FF', gamesAt1500: 25, icon: 'swords' },
  { id: 'standard', name: 'СТАНДАРТ', nameGenitive: 'СТАНДАРТА', threshold: 0, discount: 0, color: '#6B6B7C', gamesAt1500: 21, icon: 'bow' },
]

const levelsAsc = [...levels].reverse()
const maxGames = 42

const steps = [
  { num: '01', title: 'Зарегистрируйся', desc: 'Создай аккаунт за 30 секунд', icon: 'register' },
  { num: '02', title: 'Заряжай карту', desc: 'Онлайн + бонусы до +60%', icon: 'battery' },
  { num: '03', title: 'Играй и экономь', desc: 'Уровень растёт → скидки до 50%', icon: 'joystick' },
]

const faqs = [
  { q: 'Как повысить уровень?', a: 'Пополняй карту и трать заряды на игры. Уровень повышается автоматически при достижении порога потраченных средств.' },
  { q: 'Скидка применяется сразу?', a: 'Да! При достижении уровня скидка автоматически применяется ко всем играм.' },
  { q: 'Уровень может понизиться?', a: 'Нет, твой уровень сохраняется навсегда.' },
  { q: 'Работает во всех парках?', a: 'Да, карта и уровень работают везде.' },
]

const reviews = [
  { text: 'Дочка накопила на Платину за полгода — теперь играем вдвое дольше!', author: 'Алексей' },
  { text: 'Золотой уровень — это кайф. −30% реально чувствуется.', author: 'Данил, 14 лет' },
  { text: 'Теперь всегда пополняю онлайн — удобно и с бонусами.', author: 'Ирина' },
  { text: 'За 3 месяца дошли до Серебра. Дети довольны, кошелёк тоже!', author: 'Марина' },
  { text: 'Раньше не знал про скидки. Теперь экономим на каждом визите.', author: 'Сергей' },
  { text: 'Отличная система! Ребёнок сам следит за уровнем и копит.', author: 'Анна' },
]

// Computed
const currentLevel = computed(() => {
  return [...levelsAsc].reverse().find(l => userSpent.value >= l.threshold) || levelsAsc[0]
})

const currentIdxAsc = computed(() => {
  return levelsAsc.findIndex(l => l.id === currentLevel.value.id)
})

const nextLevel = computed(() => {
  return currentIdxAsc.value < levelsAsc.length - 1 ? levelsAsc[currentIdxAsc.value + 1] : null
})

const remainingToNext = computed(() => {
  return nextLevel.value ? Math.max(0, nextLevel.value.threshold - userSpent.value) : 0
})

const progressToNext = computed(() => {
  if (!nextLevel.value) return 100
  return Math.min(100, Math.max(0, ((userSpent.value - currentLevel.value.threshold) / (nextLevel.value.threshold - currentLevel.value.threshold)) * 100))
})

// Methods
const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

const getProgressPercent = (games) => (games / maxGames) * 100

const scrollToCta = () => {
  document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })
}

const handleInput = (e) => {
  userSpent.value = parseInt(e.target.value.replace(/\D/g, '')) || 0
}

const toggleFaq = (idx) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="rewards-page">
    <div class="rewards-container">
      
      <!-- Hero -->
      <header class="hero">
        <!-- Badge -->
        <div class="hero-badge-wrapper">
          <div class="hero-badge">
            <span>B00M! REWARDS</span>
          </div>
        </div>
        
        <h1 class="hero-title">
          <span class="hero-title-white">ИГРАЙ БОЛЬШЕ</span>
          <span class="hero-title-yellow">ПЛАТИ МЕНЬШЕ</span>
        </h1>
        
        <!-- Subtitle -->
        <p class="hero-subtitle">
          Повышай уровень и экономь<br/>до 50% на каждой игре
        </p>
        
        <!-- 3 Steps -->
        <div class="steps-container">
          <template v-for="(step, idx) in steps" :key="step.num">
            <div class="step-card">
              <div class="step-icon">
                <!-- Register Icon -->
                <svg v-if="step.icon === 'register'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 14a2 2 0 0 0 2-2V8h-2"/><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M8 14a2 2 0 0 0 2-2V8H8"/>
                </svg>
                <!-- Battery Icon -->
                <svg v-else-if="step.icon === 'battery'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/>
                </svg>
                <!-- Joystick Icon -->
                <svg v-else-if="step.icon === 'joystick'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z"/><path d="M6 15v-2"/><path d="M12 15V9"/><circle cx="12" cy="6" r="3"/>
                </svg>
              </div>
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
            <div v-if="idx < 2" class="step-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </template>
        </div>
        
        <!-- Join Button -->
        <button class="join-button" @click="scrollToCta">
          <span class="join-button-text">ПРИСОЕДИНИТЬСЯ</span>
          <span class="join-button-bonus">+500 бонусов</span>
        </button>
      </header>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Levels Section -->
      <section class="levels-section">
        <div class="section-header">
          <div class="section-badge section-badge-lime">
            <span>УРОВНИ</span>
          </div>
          <h2 class="section-title">ЧТО ДАЁТ КАЖДЫЙ СТАТУС</h2>
        </div>
        
        <div class="levels-table">
          <!-- Header - Desktop -->
          <div class="levels-header">
            <div>УРОВЕНЬ</div>
            <div style="text-align: center;">СКИДКА</div>
            <div>≈ ИГР ЗА 1500₽</div>
            <div style="text-align: right;">+ИГР</div>
          </div>
          
          <!-- Rows - Desktop -->
          <div class="levels-desktop">
            <div 
              v-for="(level, idx) in levels" 
              :key="level.id"
              class="level-row"
              :class="{ 'level-row-active': level.id === currentLevel.id }"
              :style="{ borderBottom: idx < levels.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }"
            >
              <!-- Level Info -->
              <div class="level-info">
                <div 
                  class="level-icon-box"
                  :style="{ 
                    background: level.id === currentLevel.id ? level.color : 'rgba(255,255,255,0.05)',
                    borderColor: level.color
                  }"
                >
                  <!-- Crown -->
                  <svg v-if="level.icon === 'crown'" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>
                  </svg>
                  <!-- Medal -->
                  <svg v-else-if="level.icon === 'medal'" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>
                  </svg>
                  <!-- Swords -->
                  <svg v-else-if="level.icon === 'swords'" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>
                  </svg>
                  <!-- Bow -->
                  <svg v-else-if="level.icon === 'bow'" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/>
                  </svg>
                </div>
                <div>
                  <div class="level-name-row">
                    <span class="level-name" :style="{ color: level.color }">{{ level.name }}</span>
                    <span v-if="level.id === currentLevel.id" class="level-badge" :style="{ background: level.color }">ТВОЙ</span>
                  </div>
                  <div class="level-threshold">
                    {{ level.threshold === 0 ? 'Базовый' : `от ${fmt(level.threshold)} ₽` }}
                  </div>
                </div>
              </div>
              
              <!-- Discount -->
              <div class="level-discount">
                <span v-if="level.discount > 0" class="discount-value" :style="{ color: level.color, textShadow: `0 0 15px ${level.color}40` }">−{{ level.discount }}%</span>
                <span v-else class="discount-none">—</span>
              </div>
              
              <!-- Progress Bar -->
              <div class="level-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${getProgressPercent(level.gamesAt1500)}%`, background: level.color }"></div>
                </div>
                <span class="progress-games" :style="{ color: level.color }">≈{{ level.gamesAt1500 }}</span>
              </div>
              
              <!-- Extra Games -->
              <div class="level-extra" :style="{ color: level.gamesAt1500 - 21 > 0 ? level.color : 'rgba(255,255,255,0.2)' }">
                {{ level.gamesAt1500 - 21 > 0 ? `+${level.gamesAt1500 - 21}` : '—' }}
              </div>
            </div>
          </div>
          
          <!-- Rows - Mobile -->
          <div class="levels-mobile">
            <div 
              v-for="(level, idx) in levels" 
              :key="level.id"
              class="level-row-mobile"
              :class="{ 'level-row-active': level.id === currentLevel.id }"
              :style="{ borderBottom: idx < levels.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }"
            >
              <div class="level-mobile-top">
                <div class="level-info">
                  <div 
                    class="level-icon-box level-icon-box-mobile"
                    :style="{ 
                      background: level.id === currentLevel.id ? level.color : 'rgba(255,255,255,0.05)',
                      borderColor: level.color
                    }"
                  >
                    <svg v-if="level.icon === 'crown'" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>
                    </svg>
                    <svg v-else-if="level.icon === 'medal'" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>
                    </svg>
                    <svg v-else-if="level.icon === 'swords'" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>
                    </svg>
                    <svg v-else-if="level.icon === 'bow'" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="level.id === currentLevel.id ? '#0D1421' : level.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/>
                    </svg>
                  </div>
                  <div>
                    <div class="level-name-row">
                      <span class="level-name level-name-mobile" :style="{ color: level.color }">{{ level.name }}</span>
                      <span v-if="level.id === currentLevel.id" class="level-badge" :style="{ background: level.color }">ТВОЙ</span>
                    </div>
                    <div class="level-threshold">
                      {{ level.threshold === 0 ? 'Базовый' : `от ${fmt(level.threshold)} ₽` }}
                    </div>
                  </div>
                </div>
                <div class="level-discount">
                  <span v-if="level.discount > 0" class="discount-value discount-value-mobile" :style="{ color: level.color }">−{{ level.discount }}%</span>
                  <span v-else class="discount-none">—</span>
                </div>
              </div>
              <div class="level-mobile-bottom">
                <div class="progress-bar progress-bar-mobile">
                  <div class="progress-fill" :style="{ width: `${getProgressPercent(level.gamesAt1500)}%`, background: level.color }"></div>
                </div>
                <span class="progress-games" :style="{ color: level.color }">≈{{ level.gamesAt1500 }}</span>
                <span v-if="level.gamesAt1500 - 21 > 0" class="progress-extra" :style="{ color: level.color }">+{{ level.gamesAt1500 - 21 }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="levels-note">
          ≈ расчёт при средней цене игры ~70₽
        </div>
      </section>

      <!-- Topup Banner -->
      <div class="topup-banner">
        <div class="topup-content">
          <div class="topup-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/>
            </svg>
          </div>
          <div class="topup-text">
            <div class="topup-title">ЗАРЯЖАЙ ОНЛАЙН — НЕ СТОЙ В ОЧЕРЕДИ</div>
            <div class="topup-desc">Бонусы до +60% при пополнении от 500₽</div>
          </div>
        </div>
        <button class="topup-button" @click="scrollToCta">ЗАРЯДИТЬ →</button>
      </div>

      <!-- Calculator -->
      <section class="calculator-section">
        <div class="section-header">
          <div class="section-badge section-badge-cyan">
            <span>КАЛЬКУЛЯТОР</span>
          </div>
          <h2 class="section-title">УЗНАЙ СВОЙ УРОВЕНЬ</h2>
        </div>
        
        <div class="calculator-box">
          <div class="calculator-input-wrapper">
            <label class="calculator-label">Сколько ты уже потратил на игры?</label>
            <div class="calculator-input-box">
              <input 
                type="text" 
                inputmode="numeric" 
                pattern="[0-9]*" 
                :value="userSpent || ''" 
                @input="handleInput"
                placeholder="0" 
                class="calculator-input"
              />
              <span class="calculator-currency">₽</span>
            </div>
          </div>

          <div class="calculator-grid">
            <!-- Current Level -->
            <div class="calc-card" :style="{ borderColor: `${currentLevel.color}30` }">
              <div class="calc-card-label">ТВОЙ УРОВЕНЬ</div>
              <div class="calc-card-level">
                <div class="calc-level-icon" :style="{ background: currentLevel.color }">
                  <svg v-if="currentLevel.icon === 'crown'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D1421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>
                  </svg>
                  <svg v-else-if="currentLevel.icon === 'medal'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D1421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>
                  </svg>
                  <svg v-else-if="currentLevel.icon === 'swords'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D1421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>
                  </svg>
                  <svg v-else-if="currentLevel.icon === 'bow'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D1421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/>
                  </svg>
                </div>
                <div class="calc-level-name" :style="{ color: currentLevel.color }">{{ currentLevel.name }}</div>
              </div>
              <div v-if="currentLevel.discount > 0" class="calc-card-info" :style="{ background: `${currentLevel.color}15`, borderColor: `${currentLevel.color}30` }">
                <div class="calc-info-discount" :style="{ color: currentLevel.color }">−{{ currentLevel.discount }}% скидка</div>
                <div class="calc-info-games">≈{{ currentLevel.gamesAt1500 }} игр за 1500₽</div>
              </div>
              <div v-else class="calc-card-info calc-card-info-default">
                <div class="calc-info-default-title">Базовые цены</div>
                <div class="calc-info-games">≈21 игра за 1500₽</div>
              </div>
            </div>

            <!-- Next Level -->
            <div v-if="nextLevel" class="calc-card">
              <div class="calc-card-label">ДО {{ nextLevel.nameGenitive }}</div>
              <div class="calc-remaining" :style="{ color: nextLevel.color }">{{ fmt(remainingToNext) }} ₽</div>
              
              <div class="calc-progress-bar">
                <div class="calc-progress-fill" :style="{ width: `${progressToNext}%`, background: `linear-gradient(90deg, ${nextLevel.color}, ${nextLevel.color}dd)` }"></div>
                <div class="calc-progress-stripes" :style="{ width: `${progressToNext}%` }"></div>
              </div>
              
              <div class="calc-next-info">
                <span>Получишь:</span>
                <span class="calc-next-badge" :style="{ background: `${nextLevel.color}20`, borderColor: `${nextLevel.color}40`, color: nextLevel.color }">−{{ nextLevel.discount }}%</span>
                <span>и</span>
                <span :style="{ fontWeight: 700, color: nextLevel.color }">≈{{ nextLevel.gamesAt1500 }} игр</span>
                <span>за 1500₽</span>
              </div>
            </div>
            
            <!-- Max Level -->
            <div v-else class="calc-card">
              <div class="calc-card-label">СТАТУС</div>
              <div class="calc-max-row">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF0080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4"/><path d="M14 11V9a2 2 0 1 0-4 0v2"/><path d="M10 10.5V5a2 2 0 1 0-4 0v9"/><path d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5"/>
                </svg>
                <div>
                  <div class="calc-max-title">МАКСИМУМ!</div>
                </div>
              </div>
              <div class="calc-max-info">
                <span>≈42 игры за 1500₽</span>
                <span class="calc-max-badge">−50%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section id="cta-section" class="cta-section">
        <h3 class="cta-title">НАЧНИ ЗАРАБАТЫВАТЬ СКИДКИ!</h3>
        <p class="cta-subtitle">Присоединяйся к тысячам игроков</p>
        <div class="cta-bonus">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999"/><path d="M15.973 4.027A13 13 0 0 0 5.902 2.373c-1.398.342-1.092 2.158.277 2.601a19.9 19.9 0 0 1 5.822 3.024"/><path d="M16.001 11.999a19.9 19.9 0 0 1 3.024 5.824c.444 1.369 2.26 1.676 2.603.278A13 13 0 0 0 20 8.069"/><path d="M18.352 3.352a1.205 1.205 0 0 0-1.704 0l-5.296 5.296a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l5.296-5.296a1.205 1.205 0 0 0 0-1.704z"/>
          </svg>
          <span><strong>+500</strong> бонусов</span>
        </div>
        <div class="cta-buttons">
          <button class="cta-button-primary" @click="openModal">СОЗДАТЬ АККАУНТ</button>
          <button class="cta-button-secondary" @click="openModal">ВОЙТИ</button>
        </div>
      </section>

      <!-- Reviews -->
      <section class="reviews-section">
        <div class="section-header">
          <div class="section-badge section-badge-lime">
            <span>ОТЗЫВЫ</span>
          </div>
          <h2 class="section-title">ЧТО ГОВОРЯТ ИГРОКИ</h2>
        </div>
        
        <div class="reviews-slider">
          <div class="reviews-track">
            <div v-for="(review, idx) in [...reviews, ...reviews]" :key="idx" class="review-card-wrapper">
              <div class="review-card">
                <div class="review-bg">
                  <img src="https://b00m.fun/shark-eyes-icon-electric.svg" alt="" />
                </div>
                <p class="review-text">{{ review.text }}</p>
                <div class="review-author">— {{ review.author }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="faq-section">
        <div class="section-header">
          <div class="section-badge section-badge-lime">
            <span>FAQ</span>
          </div>
          <h2 class="section-title">ЧАСТЫЕ ВОПРОСЫ</h2>
        </div>
        
        <div class="faq-list">
          <div 
            v-for="(faq, idx) in faqs" 
            :key="idx" 
            class="faq-item"
            :class="{ 'faq-item-open': openFaq === idx }"
            @click="toggleFaq(idx)"
          >
            <div class="faq-question">
              <span>{{ faq.q }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="openFaq === idx ? '#C5F946' : 'rgba(255,255,255,0.4)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)' }">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            <div v-if="openFaq === idx" class="faq-answer">{{ faq.a }}</div>
          </div>
        </div>
      </section>

    </div>
    
    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">✕</button>
          <iframe src="https://lk.b00m.fun" class="modal-iframe"></iframe>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.rewards-page {
  min-height: 100vh;
  background: #1c1a3e;
  color: #F0F4FF;
  font-family: system-ui, -apple-system, sans-serif;
}

.rewards-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px 48px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 56px 0 48px;
}

.hero-badge-wrapper {
  margin-bottom: 32px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  background: linear-gradient(135deg, rgba(255,214,10,0.15), rgba(255,0,128,0.1));
  border: 1px solid rgba(255,214,10,0.3);
  border-radius: 24px;
}

.hero-badge span {
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #FFD60A;
  line-height: 1;
}

.hero-title {
  margin: 0 0 24px;
  line-height: 1;
}

.hero-title-white {
  display: block;
  font-size: clamp(32px, 8vw, 48px);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #F0F4FF;
}

.hero-title-yellow {
  display: block;
  font-size: clamp(32px, 8vw, 48px);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #FFD60A;
  text-shadow: 0 0 40px rgba(255,214,10,0.4);
  margin-top: 8px;
}

.hero-subtitle {
  font-size: clamp(18px, 4vw, 24px);
  color: #FFFFFF;
  margin: 0 0 48px;
  font-weight: 500;
  line-height: 1.5;
}

/* Steps */
.steps-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: stretch;
  gap: 0;
  margin-bottom: 16px;
}

.step-card {
  padding: 24px 16px;
  background: #222050;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.step-icon {
  color: #C5F946;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.step-title {
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
  color: #F0F4FF;
  margin-bottom: 6px;
}

.step-desc {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  line-height: 1.3;
}

.step-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  color: rgba(197,249,70,0.6);
}

/* Join Button */
.join-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 18px 32px;
  background: #FFD60A;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
}

.join-button-text {
  font-family: monospace;
  font-size: 15px;
  font-weight: 700;
  color: #0D1421;
  line-height: 1;
}

.join-button-bonus {
  font-family: monospace;
  font-size: 11px;
  color: rgba(13,20,33,0.6);
  line-height: 1;
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(197,249,70,0.3) 20%, rgba(0,212,255,0.3) 50%, rgba(255,0,128,0.3) 80%, transparent);
  margin: 0 0 40px;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 16px;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.section-badge span {
  font-family: monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1;
}

.section-badge-lime {
  background: rgba(197,249,70,0.1);
  border: 1px solid rgba(197,249,70,0.2);
}

.section-badge-lime span {
  color: #C5F946;
}

.section-badge-cyan {
  background: rgba(0,212,255,0.1);
  border: 1px solid rgba(0,212,255,0.2);
}

.section-badge-cyan span {
  color: #00D4FF;
}

.section-title {
  font-family: monospace;
  font-size: 18px;
  font-weight: 700;
  color: #F0F4FF;
  margin: 0;
}

/* Levels Section */
.levels-section {
  margin-bottom: 24px;
}

.levels-table {
  background: #222050;
  border-radius: 14px;
  border: 1px solid rgba(197,249,70,0.15);
  overflow: hidden;
}

.levels-header {
  display: grid;
  grid-template-columns: minmax(140px, 180px) 80px 1fr 60px;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(197,249,70,0.08);
  border-bottom: 1px solid rgba(197,249,70,0.15);
  align-items: center;
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.05em;
}

.levels-desktop {
  display: block;
}

.levels-mobile {
  display: none;
}

.level-row {
  display: grid;
  grid-template-columns: minmax(140px, 180px) 80px 1fr 60px;
  gap: 12px;
  padding: 14px 20px;
  align-items: center;
}

.level-row-active {
  background: rgba(197,249,70,0.05);
}

.level-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.level-icon-box-mobile {
  width: 40px;
  height: 40px;
}

.level-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.level-name {
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
}

.level-name-mobile {
  font-size: 14px;
}

.level-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 7px;
  font-weight: 700;
  color: #0D1421;
  line-height: 1;
}

.level-threshold {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
}

.level-discount {
  text-align: center;
}

.discount-value {
  font-family: monospace;
  font-size: 18px;
  font-weight: 700;
}

.discount-value-mobile {
  font-size: 20px;
}

.discount-none {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: rgba(255,255,255,0.08);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-mobile {
  height: 8px;
  border-radius: 4px;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-games {
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
  min-width: 30px;
}

.progress-extra {
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  opacity: 0.7;
}

.level-extra {
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  text-align: right;
}

/* Mobile Levels */
.level-row-mobile {
  padding: 16px;
}

.level-mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.level-mobile-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
}

.levels-note {
  margin-top: 12px;
  text-align: center;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

/* Topup Banner */
.topup-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px;
  margin-bottom: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(197,249,70,0.1), rgba(197,249,70,0.03));
  border: 1px solid rgba(197,249,70,0.25);
}

.topup-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.topup-icon {
  color: #C5F946;
}

.topup-title {
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
  color: #C5F946;
}

.topup-desc {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

.topup-button {
  padding: 10px 18px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  background: #C5F946;
  color: #0D1421;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
}

/* Calculator */
.calculator-section {
  margin-bottom: 40px;
}

.calculator-box {
  background: #222050;
  border-radius: 14px;
  border: 1px solid rgba(0,212,255,0.2);
  padding: 24px;
}

.calculator-input-wrapper {
  margin-bottom: 24px;
}

.calculator-label {
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 8px;
}

.calculator-input-box {
  display: flex;
  align-items: center;
  background: #0D1421;
  border: 1px solid rgba(0,212,255,0.3);
  border-radius: 10px;
  padding: 3px;
}

.calculator-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  font-family: monospace;
  font-size: 24px;
  font-weight: 700;
  color: #F0F4FF;
  outline: none;
}

.calculator-currency {
  font-family: monospace;
  font-size: 20px;
  color: rgba(255,255,255,0.4);
  padding-right: 16px;
}

.calculator-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.calc-card {
  padding: 20px;
  background: #0D1421;
  border-radius: 12px;
  border: 1px solid transparent;
}

.calc-card-label {
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
  margin-bottom: 10px;
  letter-spacing: 0.05em;
}

.calc-card-level {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.calc-level-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calc-level-name {
  font-family: monospace;
  font-size: 18px;
  font-weight: 700;
}

.calc-card-info {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid;
}

.calc-card-info-default {
  background: rgba(255,255,255,0.03);
  border-color: transparent;
}

.calc-info-discount {
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
}

.calc-info-games {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

.calc-info-default-title {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

.calc-remaining {
  font-family: monospace;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.calc-progress-bar {
  position: relative;
  height: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.calc-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.calc-progress-stripes {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 10px);
  border-radius: 6px;
  animation: moveStripes 1s linear infinite;
}

@keyframes moveStripes {
  0% { background-position: 0 0; }
  100% { background-position: 14px 0; }
}

.calc-next-info {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.calc-next-badge {
  padding: 2px 8px;
  border: 1px solid;
  border-radius: 4px;
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
}

.calc-max-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.calc-max-title {
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
  color: #FF0080;
  text-shadow: 0 0 20px rgba(255,0,128,0.5);
}

.calc-max-info {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.calc-max-badge {
  padding: 2px 8px;
  background: rgba(255,0,128,0.2);
  border: 1px solid rgba(255,0,128,0.4);
  border-radius: 4px;
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
  color: #FF0080;
}

/* CTA Section */
.cta-section {
  padding: 32px 20px;
  background: linear-gradient(135deg, rgba(255,214,10,0.08), rgba(255,0,128,0.05));
  border-radius: 16px;
  border: 1px solid rgba(255,214,10,0.2);
  text-align: center;
  margin-bottom: 40px;
}

.cta-title {
  font-size: 22px;
  font-weight: 700;
  color: #F0F4FF;
  margin: 0 0 8px;
  letter-spacing: 0.05em;
}

.cta-subtitle {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin: 0 0 20px;
}

.cta-bonus {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  margin-bottom: 20px;
  background: rgba(197,249,70,0.1);
  border: 1px solid rgba(197,249,70,0.3);
  border-radius: 10px;
  color: #C5F946;
  font-family: monospace;
  font-size: 11px;
}

.cta-bonus strong {
  color: #C5F946;
  font-size: 14px;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.cta-button-primary {
  padding: 12px 24px;
  border-radius: 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  background: #FFD60A;
  color: #0D1421;
  border: none;
  cursor: pointer;
}

.cta-button-secondary {
  padding: 12px 24px;
  border-radius: 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  background: transparent;
  color: #FFD60A;
  border: 1px solid rgba(255,214,10,0.4);
  cursor: pointer;
}

/* Reviews */
.reviews-section {
  margin-bottom: 40px;
}

.reviews-slider {
  overflow: hidden;
  position: relative;
}

.reviews-track {
  display: flex;
  animation: marquee 30s linear infinite;
  width: fit-content;
}

.reviews-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.review-card-wrapper {
  width: 300px;
  flex-shrink: 0;
  padding: 0 8px;
  box-sizing: border-box;
}

.review-card {
  padding: 20px;
  background: #222050;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  position: relative;
  overflow: hidden;
  height: 100%;
  min-height: 110px;
}

.review-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.08;
  pointer-events: none;
}

.review-bg img {
  width: 80px;
  height: auto;
}

.review-text {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  line-height: 1.5;
  margin: 0 0 12px;
  position: relative;
  z-index: 1;
}

.review-author {
  font-family: monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  position: relative;
  z-index: 1;
}

/* FAQ */
.faq-section {
  margin-bottom: 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  background: #222050;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
}

.faq-item-open {
  border-color: #C5F946;
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.faq-question span {
  font-size: 13px;
  font-weight: 600;
  color: #F0F4FF;
}

.faq-question svg {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.faq-answer {
  padding: 0 16px 14px;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  line-height: 1.4;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,10,30,0.75);
  backdrop-filter: blur(12px);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 480px;
  height: 80vh;
  max-height: 700px;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 36px;
  height: 36px;
  background: rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  color: #333;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .steps-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .step-card {
    width: 100%;
  }
  
  .step-arrow {
    transform: rotate(90deg);
    padding: 8px 0;
  }
  
  .levels-header {
    display: none;
  }
  
  .levels-desktop {
    display: none;
  }
  
  .levels-mobile {
    display: block;
  }
  
  .calculator-grid {
    grid-template-columns: 1fr;
  }
  
  .topup-banner {
    flex-direction: column;
    text-align: center;
  }
  
  .topup-content {
    flex-direction: column;
    text-align: center;
  }
  
  .topup-icon {
    margin-bottom: 8px;
  }
  
  .topup-text {
    text-align: center;
  }
}
</style>
