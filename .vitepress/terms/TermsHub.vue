<template>
  <div class="terms-hub">
    <!-- Page header -->
    <div class="hub-header">
      <p class="hub-eyebrow">ЮРИДИЧЕСКАЯ ЗОНА</p>
      <h1 class="hub-title">Документы</h1>
      <p class="hub-sub">
        Всё прозрачно. Читай сколько хочешь — или просто глянь главное вверху каждого раздела.
      </p>
    </div>

    <!-- Neon divider -->
    <div class="neon-divider"></div>

    <!-- Tab navigation -->
    <div class="tabs-wrap">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span
            class="tab-dot"
            :style="{ background: tab.color }"
          ></span>
        </button>
      </div>
    </div>

    <!-- Tab content -->
    <div class="tab-content">
      <TermsOfertaOhta v-if="activeTab === 'ohta'" />
      <TermsOfertaPiterland v-if="activeTab === 'piterland'" />
      <TermsPolicy v-if="activeTab === 'policy'" />
      <TermsPrivacy v-if="activeTab === 'privacy'" />
    </div>

    <!-- Footer note -->
    <div class="hub-footer">
      <div class="neon-divider" style="margin-bottom: 24px;"></div>
      <div class="footer-grid">
        <div class="footer-item">
          <span class="footer-icon">📞</span>
          <div>
            <div class="footer-label">Охта Молл</div>
            <a href="tel:+79643211100" class="footer-link">+7 (964) 321-11-00</a>
          </div>
        </div>
        <div class="footer-item">
          <span class="footer-icon">📞</span>
          <div>
            <div class="footer-label">Питерлэнд</div>
            <a href="tel:+79650457555" class="footer-link">+7 (965) 045-75-55</a>
          </div>
        </div>
        <div class="footer-item">
          <span class="footer-icon">✉️</span>
          <div>
            <div class="footer-label">Email</div>
            <a href="mailto:spb@bumbastiki.ru" class="footer-link">spb@bumbastiki.ru</a>
          </div>
        </div>
      </div>
      <p class="footer-note">
        Остались вопросы? Напиши или позвони — ответим в рабочие часы.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TermsOfertaOhta from './TermsOfertaOhta.vue'
import TermsOfertaPiterland from './TermsOfertaPiterland.vue'
import TermsPolicy from './TermsPolicy.vue'
import TermsPrivacy from './TermsPrivacy.vue'

const activeTab = ref('ohta')

const tabs = [
  {
    id: 'ohta',
    icon: '📄',
    label: 'Оферта · Охта Молл',
    color: '#C5F946',
  },
  {
    id: 'piterland',
    icon: '📄',
    label: 'Оферта · Питерлэнд',
    color: '#00D4FF',
  },
  {
    id: 'policy',
    icon: '🔒',
    label: 'Политика конфиденциальности',
    color: '#FF0080',
  },
  {
    id: 'privacy',
    icon: '✅',
    label: 'Согласие на данные',
    color: '#00FF88',
  },
]
</script>

<style scoped>
.terms-hub {
  font-family: 'Inter', sans-serif;
  max-width: 860px;
  margin: 0 auto;
  padding: 0 0 60px;
}

/* Header */
.hub-header {
  padding: 40px 0 28px;
  text-align: left;
}
.hub-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #4a5aad;
  margin: 0 0 12px;
}
.hub-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: #F0F4FF;
  margin: 0 0 12px;
  line-height: 1.1;
}
.hub-sub {
  font-size: 15px;
  color: #7A8BA8;
  margin: 0;
  max-width: 520px;
  line-height: 1.6;
}

/* Neon divider */
.neon-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #00D4FF 15%,
    #C5F946 35%,
    #FFD60A 50%,
    #FF0080 65%,
    #00FF88 85%,
    transparent 100%
  );
  opacity: 0.35;
  margin-bottom: 28px;
}

/* Tabs */
.tabs-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 28px;
  /* hide scrollbar */
  scrollbar-width: none;
}
.tabs-wrap::-webkit-scrollbar { display: none; }

.tabs {
  display: flex;
  gap: 8px;
  min-width: max-content;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(74,90,173,0.25);
  border-radius: 10px;
  color: #7A8BA8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
  position: relative;
}
.tab:hover {
  background: rgba(255,255,255,0.07);
  color: #F0F4FF;
  border-color: rgba(74,90,173,0.5);
}
.tab.active {
  background: rgba(197,249,70,0.08);
  border-color: rgba(197,249,70,0.25);
  color: #F0F4FF;
}

.tab-icon { font-size: 15px; }
.tab-label { }
.tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.7;
}
.tab.active .tab-dot { opacity: 1; }

/* Override active color per tab */
.tab[data-id="ohta"].active { background: rgba(197,249,70,0.07); border-color: rgba(197,249,70,0.25); }
.tab[data-id="piterland"].active { background: rgba(0,212,255,0.07); border-color: rgba(0,212,255,0.25); }
.tab[data-id="policy"].active { background: rgba(255,0,128,0.07); border-color: rgba(255,0,128,0.25); }
.tab[data-id="privacy"].active { background: rgba(0,255,136,0.07); border-color: rgba(0,255,136,0.25); }

/* Content */
.tab-content {
  min-height: 400px;
}

/* Footer */
.hub-footer {
  margin-top: 48px;
}
.footer-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.footer-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.footer-icon { font-size: 18px; margin-top: 2px; }
.footer-label {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #4a5aad;
  margin-bottom: 4px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.footer-link {
  font-size: 14px;
  font-weight: 600;
  color: #C5F946;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover { color: #F0F4FF; }
.footer-note {
  font-size: 13px;
  color: #4a5aad;
  margin: 0;
}

@media (max-width: 600px) {
  .hub-title { font-size: 28px; }
  .hub-header { padding: 24px 0 20px; }
  .footer-grid { flex-direction: column; gap: 14px; }
}
</style>
