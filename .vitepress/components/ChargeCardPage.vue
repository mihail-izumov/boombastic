<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isModalOpen = ref(false)

function openLoginModal() {
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLoginModal() {
  isModalOpen.value = false
  document.body.style.overflow = ''
}

function handleKeydown(e) {
  if (e.key === 'Escape') closeLoginModal()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="topup-page">
    <!-- Заголовок -->
    <header class="page-header">
      <h1 class="title">
        <span class="title-accent">ЗАРЯДКА</span>
        <span class="title-main">КАРТЫ</span>
      </h1>
      <p class="subtitle">Чем больше заряжаешь — тем больше играешь</p>
    </header>

    <!-- Объяснение валют -->
    <div class="currency-explainer">
      <div class="currency-item charges">
        <div class="currency-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="currency-text">
          <span class="currency-name">Заряды</span>
          <span class="currency-desc"><strong>Играй</strong> на автоматах. Покупаешь за рубли, тратишь на игры.</span>
        </div>
      </div>
      <div class="currency-item tickets">
        <div class="currency-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
            <path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
          </svg>
        </div>
        <div class="currency-text">
          <span class="currency-name">Тикеты</span>
          <span class="currency-desc"><strong>Выигрывай</strong> на автоматах, <strong>копи</strong> и забирай призы. Не сгорают!</span>
        </div>
      </div>
    </div>

    <!-- Баннер призов -->
    <div class="prizes-banner">
      <div class="prizes-content">
        <div class="prizes-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/>
            <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/>
            <path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>
          </svg>
        </div>
        <div class="prizes-text">
          <span class="prizes-title">КОПИ ТИКЕТЫ НА ПРИЗЫ</span>
          <span class="prizes-desc">Больше играешь → больше тикетов → круче призы</span>
        </div>
      </div>
      <a href="/prizes" class="prizes-link">ВИТРИНА ПРИЗОВ</a>
    </div>

    <!-- Основной контент -->
    <div class="content-grid">
      
      <!-- Левая колонка: таблица пополнений -->
      <section class="topup-section">
        <div class="section-header">
          <span class="section-icon">⚡</span>
          <h2 class="section-title">КУПИТЬ ЗАРЯДЫ</h2>
        </div>

        <div class="topup-container">
          <div class="charge-bar-vertical">
            <div class="charge-fill"></div>
            <div class="charge-pulse"></div>
          </div>

          <div class="topup-table">
            <!-- 5000 - GOD MODE -->
            <div class="topup-row tier-max" @click="openLoginModal">
              <div class="row-content">
                <div class="row-left">
                  <span class="charges-value">8 000</span>
                  <span class="charges-label">зарядов</span>
                </div>
                <div class="row-right">
                  <div class="row-badge badge-lime">GOD MODE</div>
                  <div class="row-percent"><span class="percent-value">+60%</span></div>
                  <div class="row-price">
                    <span class="price-value">5 000</span>
                    <span class="price-currency">₽</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3000 - PRO -->
            <div class="topup-row tier-best" @click="openLoginModal">
              <div class="row-content">
                <div class="row-left">
                  <span class="charges-value">4 500</span>
                  <span class="charges-label">зарядов</span>
                </div>
                <div class="row-right">
                  <div class="row-badge badge-magenta">PRO</div>
                  <div class="row-percent"><span class="percent-value">+50%</span></div>
                  <div class="row-price">
                    <span class="price-value">3 000</span>
                    <span class="price-currency">₽</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2000 -->
            <div class="topup-row tier-medium" @click="openLoginModal">
              <div class="row-content">
                <div class="row-left">
                  <span class="charges-value">2 800</span>
                  <span class="charges-label">зарядов</span>
                </div>
                <div class="row-right">
                  <div class="row-percent"><span class="percent-value">+40%</span></div>
                  <div class="row-price">
                    <span class="price-value">2 000</span>
                    <span class="price-currency">₽</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 1500 -->
            <div class="topup-row tier-medium" @click="openLoginModal">
              <div class="row-content">
                <div class="row-left">
                  <span class="charges-value">2 025</span>
                  <span class="charges-label">зарядов</span>
                </div>
                <div class="row-right">
                  <div class="row-percent"><span class="percent-value">+35%</span></div>
                  <div class="row-price">
                    <span class="price-value">1 500</span>
                    <span class="price-currency">₽</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 1000 -->
            <div class="topup-row" @click="openLoginModal">
              <div class="row-content">
                <div class="row-left">
                  <span class="charges-value">1 300</span>
                  <span class="charges-label">зарядов</span>
                </div>
                <div class="row-right">
                  <div class="row-percent"><span class="percent-value">+30%</span></div>
                  <div class="row-price">
                    <span class="price-value">1 000</span>
                    <span class="price-currency">₽</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 500 -->
            <div class="topup-row" @click="openLoginModal">
              <div class="row-content">
                <div class="row-left">
                  <span class="charges-value">625</span>
                  <span class="charges-label">зарядов</span>
                </div>
                <div class="row-right">
                  <div class="row-percent"><span class="percent-value">+25%</span></div>
                  <div class="row-price">
                    <span class="price-value">500</span>
                    <span class="price-currency">₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-note">
          <svg class="note-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
          <span class="note-text">Новая карта — <strong>30₽</strong>. Заряды на карте не сгорают.</span>
        </div>
      </section>

      <!-- Правая колонка: TURBO BLOCK -->
      <section class="turbo-section">
        <div class="turbo-block">
          <div class="turbo-header">
            <div class="turbo-badge-row">
              <div class="turbo-badge">ВТОРНИК</div>
              <h2 class="turbo-title">ТУРБО РЕЖИМ</h2>
            </div>
            <div class="turbo-price">
              <span class="turbo-price-value">33</span>
              <span class="turbo-price-currency">₽</span>
            </div>
            <p class="turbo-desc">за <strong>любой</strong> автомат вместо 40–80₽</p>
          </div>
          
          <div class="turbo-comparison">
            <h3 class="comparison-subtitle">СКОЛЬКО ИГР?</h3>
            <div class="comparison-table">
              <div class="comparison-header">
                <div class="comp-col">ЗАРЯДЫ</div>
                <div class="comp-col">ОБЫЧНО</div>
                <div class="comp-col">ВТОРНИК</div>
                <div class="comp-col comp-highlight">+ИГРЫ</div>
              </div>
              <!-- 8000 -->
              <div class="comparison-row row-highlight">
                <div class="comp-col">8 000</div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle three-quarter"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle three-quarter"></div>
                  </div>
                </div>
                <div class="comp-col comp-highlight">+97</div>
              </div>
              <!-- 4500 -->
              <div class="comparison-row row-highlight">
                <div class="comp-col">4 500</div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle quarter"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle half"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col comp-highlight">+54</div>
              </div>
              <!-- 2800 -->
              <div class="comparison-row">
                <div class="comp-col">2 800</div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle half"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col comp-highlight">+34</div>
              </div>
              <!-- 2025 -->
              <div class="comparison-row">
                <div class="comp-col">2 025</div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle half"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle full"></div>
                    <div class="circle half"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col comp-highlight">+24</div>
              </div>
              <!-- 1300 -->
              <div class="comparison-row">
                <div class="comp-col">1 300</div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle full"></div>
                    <div class="circle half"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col comp-highlight">+15</div>
              </div>
              <!-- 625 -->
              <div class="comparison-row">
                <div class="comp-col">625</div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle half"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col">
                  <div class="circle-bar">
                    <div class="circle three-quarter"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
                <div class="comp-col comp-highlight">+8</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- CTA -->
    <section class="cta-section">
      <h3 class="cta-title">ПОРА ЗАРЯДИТЬСЯ!</h3>
      <p class="cta-text">Заряжай игровую карту на кассе в парке и через личный кабинет</p>
      
      <div class="welcome-bonus">
        <svg class="welcome-bonus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/>
          <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/>
          <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/>
        </svg>
        <span class="welcome-bonus-text"><strong>+500</strong> бонусов при регистрации</span>
      </div>
      
      <div class="cta-buttons">
        <button class="cta-btn primary" @click="openLoginModal">ЗАРЕГИСТРИРОВАТЬСЯ</button>
        <button class="cta-btn secondary" @click="openLoginModal">ПОПОЛНИТЬ ОНЛАЙН</button>
      </div>
    </section>

    <!-- Баннер проверки баланса -->
    <div class="balance-banner">
      <div class="balance-content">
        <div class="balance-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
        </div>
        <div class="balance-text">
          <span class="balance-title">УЖЕ ЕСТЬ КАРТА?</span>
          <span class="balance-desc">Проверь баланс и историю в личном кабинете</span>
        </div>
      </div>
      <button class="balance-btn" @click="openLoginModal">ПРОВЕРИТЬ БАЛАНС</button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div class="modal-overlay" :class="{ active: isModalOpen }">
        <div class="modal-backdrop" @click="closeLoginModal"></div>
        <div class="modal-content">
          <button class="modal-close" @click="closeLoginModal">✕</button>
          <iframe class="modal-iframe" src="https://lk.b00m.fun"></iframe>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════
   ГЛОБАЛЬНЫЕ НАСТРОЙКИ
   ═══════════════════════════════════════ */
.topup-page {
  padding: 40px 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: hidden;
}

/* ═══════════════════════════════════════
   ЗАГОЛОВОК
   ═══════════════════════════════════════ */
.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 0 0 12px;
  line-height: 1;
}

.title-accent {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(36px, 8vw, 52px);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-lime);
  text-shadow: 0 0 40px rgba(197, 249, 70, 0.5);
}

.title-main {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 6vw, 42px);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary);
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: var(--text-primary);
  margin: 0;
}

/* ═══════════════════════════════════════
   ВАЛЮТЫ
   ═══════════════════════════════════════ */
.currency-explainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.currency-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
}

.currency-item.charges {
  background: rgba(197, 249, 70, 0.08);
  border: 1px solid rgba(197, 249, 70, 0.2);
}

.currency-item.tickets {
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.currency-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.currency-item.charges .currency-icon {
  background: rgba(197, 249, 70, 0.15);
}

.currency-item.tickets .currency-icon {
  background: rgba(0, 212, 255, 0.15);
}

.currency-icon svg {
  width: 22px;
  height: 22px;
}

.currency-item.charges .currency-icon svg {
  fill: var(--accent-lime);
}

.currency-item.tickets .currency-icon svg {
  stroke: var(--neon-cyan);
  fill: none;
}

.currency-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.currency-name {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.currency-item.charges .currency-name {
  color: var(--accent-lime);
}

.currency-item.tickets .currency-name {
  color: var(--neon-cyan);
}

.currency-desc {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.currency-desc strong {
  color: var(--text-primary);
}

/* ═══════════════════════════════════════
   БАННЕР ПРИЗОВ
   ═══════════════════════════════════════ */
.prizes-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  margin-bottom: 28px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 255, 136, 0.06));
  border-radius: 14px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.prizes-content {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.prizes-icon {
  width: 44px;
  height: 44px;
  background: rgba(0, 212, 255, 0.12);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.prizes-icon svg {
  width: 26px;
  height: 26px;
  stroke: var(--neon-cyan);
  fill: none;
}

.prizes-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.prizes-title {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--neon-cyan);
}

.prizes-desc {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text-secondary);
}

.prizes-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--neon-cyan);
  text-decoration: none;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.prizes-link:hover {
  background: var(--neon-cyan);
  color: var(--bg-night);
}

/* ═══════════════════════════════════════
   ОСНОВНОЙ ГРИД
   ═══════════════════════════════════════ */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

@media (min-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

/* ═══════════════════════════════════════
   СЕКЦИЯ ЗАРЯДОВ
   ═══════════════════════════════════════ */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 22px;
}

.section-title {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin: 0;
}

.topup-container {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.charge-bar-vertical {
  width: 18px;
  min-width: 18px;
  background: var(--bg-night);
  border-radius: 9px;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(197, 249, 70, 0.15);
}

.charge-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to top, var(--text-secondary) 0%, var(--neon-cyan) 30%, var(--neon-magenta) 65%, var(--accent-lime) 100%);
  border-radius: 7px;
}

.charge-pulse {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to top, transparent, rgba(255, 255, 255, 0.7));
  filter: blur(3px);
  animation: pulse-up 1.4s ease-in-out infinite;
}

@keyframes pulse-up {
  0% { bottom: -10%; opacity: 0.9; }
  100% { bottom: 110%; opacity: 0; }
}

/* ═══════════════════════════════════════
   ТАБЛИЦА ЗАРЯДОВ — БЕЗ OVERFLOW
   ═══════════════════════════════════════ */
.topup-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.topup-row {
  position: relative;
  padding: 14px 16px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

/* Hover ТОЛЬКО на десктопе, БЕЗ scale */
@media (min-width: 769px) {
  .topup-row:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.topup-row.tier-max {
  background: linear-gradient(135deg, rgba(197, 249, 70, 0.15), rgba(197, 249, 70, 0.05));
  border-color: rgba(197, 249, 70, 0.3);
}

.topup-row.tier-max:hover {
  border-color: var(--accent-lime);
  box-shadow: 0 0 30px rgba(197, 249, 70, 0.2);
}

.topup-row.tier-best {
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.1), rgba(255, 0, 128, 0.03));
  border-color: rgba(255, 0, 128, 0.25);
}

.topup-row.tier-best:hover {
  border-color: var(--neon-magenta);
  box-shadow: 0 0 25px rgba(255, 0, 128, 0.2);
}

.topup-row.tier-medium {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(0, 212, 255, 0.02));
  border-color: rgba(0, 212, 255, 0.15);
}

.topup-row.tier-medium:hover {
  border-color: var(--neon-cyan);
}

/* Контент строки — flex с правильным сжатием */
.row-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

.row-left {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  flex-shrink: 1;
}

.charges-value {
  font-family: 'Space Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.tier-max .charges-value { color: var(--accent-lime); }
.tier-best .charges-value { color: var(--neon-magenta); }
.tier-medium .charges-value { color: var(--neon-cyan); }

.charges-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

/* Правая часть — бейдж + процент + цена ВНУТРИ */
.row-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Бейджи ВНУТРИ строки */
.row-badge {
  padding: 4px 8px;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  white-space: nowrap;
}

.row-badge.badge-lime {
  background: var(--accent-lime);
  color: var(--bg-night);
}

.row-badge.badge-magenta {
  background: var(--neon-magenta);
  color: white;
}

.row-percent {
  min-width: 48px;
  padding: 4px 8px;
  background: rgba(0, 255, 136, 0.12);
  border-radius: 6px;
  border: 1px solid rgba(0, 255, 136, 0.2);
  text-align: center;
}

.percent-value {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--neon-green);
}

.row-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 55px;
  justify-content: flex-end;
}

.price-value {
  font-family: 'Space Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.price-currency {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

/* Примечание */
.card-note {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--bg-night);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.note-icon {
  width: 24px;
  height: 24px;
  stroke: var(--text-secondary);
  fill: none;
  flex-shrink: 0;
}

.note-text {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text-secondary);
}

.note-text strong {
  color: var(--text-primary);
}

/* ═══════════════════════════════════════
   ТУРБО БЛОК
   ═══════════════════════════════════════ */
.turbo-block {
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.12), rgba(255, 0, 128, 0.04));
  border-radius: 16px;
  border: 1px solid rgba(255, 0, 128, 0.25);
  overflow: hidden;
}

.turbo-header {
  padding: 20px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 0, 128, 0.15);
}

.turbo-badge-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.turbo-badge {
  padding: 5px 10px;
  background: var(--neon-magenta);
  color: white;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
}

.turbo-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--neon-magenta);
  text-shadow: 0 0 25px rgba(255, 0, 128, 0.5);
  margin: 0;
}

.turbo-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.turbo-price-value {
  font-family: 'Space Mono', monospace;
  font-size: 48px;
  font-weight: 700;
  color: var(--accent-lime);
  text-shadow: 0 0 30px rgba(197, 249, 70, 0.5);
  line-height: 1;
}

.turbo-price-currency {
  font-family: 'Space Mono', monospace;
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-lime);
  opacity: 0.8;
}

.turbo-desc {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.turbo-desc strong {
  color: var(--text-primary);
}

/* Сравнительная таблица */
.turbo-comparison {
  padding: 16px 20px;
  overflow-x: hidden;
}

.comparison-subtitle {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin: 0 0 12px;
  text-align: center;
}

.comparison-table {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.comparison-header {
  display: grid;
  grid-template-columns: 65px 1fr 1fr 45px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 12px;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.comparison-row {
  display: grid;
  grid-template-columns: 65px 1fr 1fr 45px;
  padding: 8px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--text-primary);
  align-items: center;
}

.comparison-row.row-highlight {
  background: rgba(197, 249, 70, 0.05);
}

.comp-col {
  text-align: center;
}

.comp-col:first-child {
  text-align: left;
}

.comp-col.comp-highlight {
  color: var(--neon-magenta);
  font-weight: 700;
}

/* Кружки прогресса */
.circle-bar {
  display: flex;
  gap: 2px;
  justify-content: center;
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid rgba(197, 249, 70, 0.3);
  flex-shrink: 0;
}

.circle.full {
  background: var(--accent-lime);
  border-color: var(--accent-lime);
  box-shadow: 0 0 6px rgba(197, 249, 70, 0.4);
}

.circle.half {
  background: linear-gradient(90deg, var(--accent-lime) 50%, transparent 50%);
  border-color: var(--accent-lime);
}

.circle.quarter {
  background: linear-gradient(90deg, var(--accent-lime) 25%, transparent 25%);
  border-color: rgba(197, 249, 70, 0.5);
}

.circle.three-quarter {
  background: linear-gradient(90deg, var(--accent-lime) 75%, transparent 75%);
  border-color: var(--accent-lime);
}

/* ═══════════════════════════════════════
   CTA СЕКЦИЯ
   ═══════════════════════════════════════ */
.cta-section {
  padding: 32px 24px;
  background: linear-gradient(135deg, rgba(197, 249, 70, 0.08), rgba(0, 212, 255, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(197, 249, 70, 0.2);
  text-align: center;
  margin-bottom: 24px;
}

.cta-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  margin: 0 0 10px;
}

.cta-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
}

.welcome-bonus {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  margin-bottom: 20px;
  background: rgba(197, 249, 70, 0.12);
  border: 1px solid rgba(197, 249, 70, 0.3);
  border-radius: 10px;
}

.welcome-bonus-icon {
  width: 24px;
  height: 24px;
  stroke: var(--accent-lime);
  flex-shrink: 0;
}

.welcome-bonus-text {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}

.welcome-bonus-text strong {
  color: var(--accent-lime);
  font-size: 16px;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.cta-btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.cta-btn.primary {
  background: var(--accent-lime);
  color: var(--bg-night);
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(197, 249, 70, 0.3);
}

.cta-btn.secondary {
  background: transparent;
  border: 1px solid rgba(197, 249, 70, 0.4);
  color: var(--accent-lime);
}

.cta-btn.secondary:hover {
  background: var(--accent-lime);
  color: var(--bg-night);
  border-color: var(--accent-lime);
}

/* ═══════════════════════════════════════
   БАННЕР БАЛАНСА
   ═══════════════════════════════════════ */
.balance-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.balance-content {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.balance-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 214, 10, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.balance-icon svg {
  width: 24px;
  height: 24px;
  stroke: var(--neon-yellow);
  fill: none;
}

.balance-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.balance-title {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--neon-yellow);
}

.balance-desc {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--text-secondary);
}

.balance-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--neon-yellow);
  text-decoration: none;
  background: rgba(255, 214, 10, 0.1);
  border: 1px solid rgba(255, 214, 10, 0.3);
  border-radius: 8px;
  transition: all 0.15s ease;
  white-space: nowrap;
  cursor: pointer;
  flex-shrink: 0;
}

.balance-btn:hover {
  background: var(--neon-yellow);
  color: var(--bg-night);
}

/* ═══════════════════════════════════════
   МОДАЛЬНОЕ ОКНО
   ═══════════════════════════════════════ */
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  align-items: center;
  justify-content: center;
}

.modal-overlay.active {
  display: flex;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 30, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
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
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.12);
  color: #000;
}

.modal-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* ═══════════════════════════════════════
   МОБИЛЬНАЯ АДАПТАЦИЯ
   ═══════════════════════════════════════ */
@media (max-width: 768px) {
  .topup-page {
    padding: 24px 16px 40px;
  }

  .currency-explainer {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .currency-item {
    padding: 12px 14px;
  }

  .prizes-banner {
    flex-direction: column;
    text-align: center;
    padding: 16px;
    gap: 14px;
  }

  .prizes-content {
    flex-direction: column;
    gap: 10px;
  }

  .prizes-link {
    width: 100%;
    justify-content: center;
  }

  .topup-container {
    flex-direction: column;
  }

  .charge-bar-vertical {
    width: 100%;
    height: 12px;
    order: -1;
    margin-bottom: 12px;
  }

  .charge-fill {
    background: linear-gradient(to right, var(--text-secondary) 0%, var(--neon-cyan) 30%, var(--neon-magenta) 65%, var(--accent-lime) 100%);
  }

  .charge-pulse {
    width: 50px;
    height: 100%;
    bottom: 0;
    left: -10%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.7));
    animation: pulse-right 1.4s ease-in-out infinite;
  }

  @keyframes pulse-right {
    0% { left: -10%; opacity: 0.9; }
    100% { left: 110%; opacity: 0; }
  }

  .topup-row {
    padding: 12px 14px;
  }

  /* Мобильный hover отключён */
  .topup-row:hover {
    transform: none;
  }

  .charges-value {
    font-size: 18px;
  }

  .charges-label {
    font-size: 9px;
  }

  .row-badge {
    font-size: 7px;
    padding: 3px 5px;
  }

  .row-percent {
    min-width: 42px;
    padding: 3px 5px;
  }

  .percent-value {
    font-size: 10px;
  }

  .row-price {
    min-width: 50px;
  }

  .price-value {
    font-size: 14px;
  }

  .price-currency {
    font-size: 10px;
  }

  .card-note {
    padding: 10px 14px;
  }

  .turbo-header {
    padding: 16px 18px;
  }

  .turbo-badge-row {
    flex-direction: column;
    gap: 8px;
  }

  .turbo-price-value {
    font-size: 40px;
  }

  .turbo-comparison {
    padding: 14px 12px;
  }

  .comparison-header,
  .comparison-row {
    grid-template-columns: 50px 1fr 1fr 38px;
    font-size: 10px;
    padding: 6px 8px;
  }

  .comparison-header {
    font-size: 7px;
  }

  .circle {
    width: 8px;
    height: 8px;
    border-width: 1.5px;
  }

  .circle-bar {
    gap: 1px;
  }

  .cta-section {
    padding: 24px 18px;
  }

  .cta-title {
    font-size: 20px;
  }

  .welcome-bonus {
    padding: 10px 16px;
    flex-direction: column;
    gap: 8px;
  }

  .welcome-bonus-text {
    font-size: 12px;
    text-align: center;
  }

  .welcome-bonus-text strong {
    font-size: 14px;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-btn {
    width: 100%;
    padding: 14px 20px;
  }

  .balance-banner {
    flex-direction: column;
    text-align: center;
    padding: 16px;
    gap: 14px;
  }

  .balance-content {
    flex-direction: column;
    gap: 10px;
  }

  .balance-btn {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
  }
}

@media (max-width: 380px) {
  .charges-value {
    font-size: 16px;
  }

  .row-badge {
    font-size: 6px;
    padding: 2px 4px;
  }

  .row-percent {
    min-width: 38px;
    padding: 2px 4px;
  }

  .percent-value {
    font-size: 9px;
  }

  .price-value {
    font-size: 13px;
  }

  .row-price {
    min-width: 45px;
  }

  .comparison-header,
  .comparison-row {
    grid-template-columns: 45px 1fr 1fr 35px;
    font-size: 9px;
    padding: 5px 6px;
  }

  .circle {
    width: 6px;
    height: 6px;
    border-width: 1px;
  }
}
</style>
