<template>
  <div class="terms-hub">

    <div class="hub-header">
      <p class="hub-eyebrow">ЮРИДИЧЕСКАЯ ЗОНА</p>
      <h1 class="hub-title">Документы</h1>
      <p class="hub-sub">Всё прозрачно. Читай сколько хочешь — или просто глянь главное вверху каждого раздела.</p>
    </div>

    <div class="neon-divider"></div>

    <!-- Primary nav -->
    <div class="primary-nav">
      <button
        v-for="s in sections"
        :key="s.id"
        class="primary-tab"
        :class="{ active: activeSection === s.id }"
        @click="activeSection = s.id"
      >{{ s.label }}</button>
    </div>

    <!-- Park switcher — only for Оферта -->
    <div class="park-switcher" v-if="activeSection === 'oferta'">
      <button class="park-btn" :class="{ active: activePark === 'ohta' }"      @click="activePark = 'ohta'">Охта Молл</button>
      <button class="park-btn" :class="{ active: activePark === 'piterland' }" @click="activePark = 'piterland'">Питерлэнд</button>
    </div>

    <div class="tab-content">
      <TermsOfertaOhta      v-if="activeSection === 'oferta'  && activePark === 'ohta'" />
      <TermsOfertaPiterland v-if="activeSection === 'oferta'  && activePark === 'piterland'" />
      <TermsPolicy          v-if="activeSection === 'policy'" />
      <TermsPrivacy         v-if="activeSection === 'privacy'" />
    </div>

    <!-- Footer -->
    <div class="hub-footer">
      <div class="neon-divider" style="margin-bottom: 28px;"></div>
      <div class="footer-grid">
        <div class="footer-item">
          <span class="footer-icon" :style="{ maskImage: phoneIcon, WebkitMaskImage: phoneIcon }"></span>
          <div>
            <div class="footer-label">Охта Молл</div>
            <a href="tel:+79643211100" class="footer-link">+7 (964) 321-11-00</a>
          </div>
        </div>
        <div class="footer-item">
          <span class="footer-icon" :style="{ maskImage: phoneIcon, WebkitMaskImage: phoneIcon }"></span>
          <div>
            <div class="footer-label">Питерлэнд</div>
            <a href="tel:+79650457555" class="footer-link">+7 (965) 045-75-55</a>
          </div>
        </div>
        <div class="footer-item">
          <span class="footer-icon" :style="{ maskImage: mailIcon, WebkitMaskImage: mailIcon }"></span>
          <div>
            <div class="footer-label">Email</div>
            <a href="mailto:spb@bumbastiki.ru" class="footer-link">spb@bumbastiki.ru</a>
          </div>
        </div>
      </div>
      <p class="footer-note">Остались вопросы? Напиши или позвони — ответим в рабочие часы.</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import TermsOfertaOhta      from './TermsOfertaOhta.vue'
import TermsOfertaPiterland from './TermsOfertaPiterland.vue'
import TermsPolicy          from './TermsPolicy.vue'
import TermsPrivacy         from './TermsPrivacy.vue'

const activeSection = ref('oferta')
const activePark    = ref('ohta')

const sections = [
  { id: 'oferta',  label: 'Оферта' },
  { id: 'policy',  label: 'Политика конфиденциальности' },
  { id: 'privacy', label: 'Согласие на данные' },
]

const ic = (paths) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const phoneIcon = ic(`<path d="m16 8 6-6"/><path d="M22 8V2h-6"/><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>`)

const mailIcon = ic(`<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>`)
</script>

<style scoped>
.terms-hub {
  font-family: 'Inter', sans-serif;
  max-width: 860px;
  margin: 0 auto;
  padding: 0 0 60px;
}

/* Header */
.hub-header { padding: 48px 0 32px; text-align: center; }
.hub-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 3px;
  color: #7A8BA8; margin: 0 0 14px;
}
.hub-title {
  font-family: 'Montserrat', sans-serif; font-size: 36px;
  font-weight: 900; color: #F0F4FF; margin: 0 0 14px;
}
.hub-sub {
  font-size: 15px; color: #7A8BA8; margin: 0 auto;
  max-width: 500px; line-height: 1.65;
}

/* Divider */
.neon-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #00D4FF 15%, #C5F946 35%, #FFD60A 50%, #FF0080 65%, #00FF88 85%, transparent 100%);
  opacity: 0.35;
  margin-bottom: 28px;
}

/* Primary nav */
.primary-nav { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.primary-tab {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(74, 90, 173, 0.3);
  border-radius: 10px;
  color: #7A8BA8; font-family: 'Inter', sans-serif;
  font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.primary-tab:hover { color: #F0F4FF; border-color: rgba(74,90,173,0.6); background: rgba(255,255,255,0.04); }
.primary-tab.active { color: #F0F4FF; background: rgba(197,249,70,0.08); border-color: rgba(197,249,70,0.35); }

/* Park switcher */
.park-switcher {
  display: inline-flex; margin-bottom: 28px;
  border: 1px solid rgba(74, 90, 173, 0.3);
  border-radius: 8px; overflow: hidden;
}
.park-btn {
  padding: 7px 20px; background: transparent; border: none;
  color: #7A8BA8; font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.park-btn + .park-btn { border-left: 1px solid rgba(74,90,173,0.3); }
.park-btn:hover { color: #F0F4FF; background: rgba(255,255,255,0.04); }
.park-btn.active { color: #1a1840; background: #C5F946; }

.tab-content { min-height: 400px; }

/* Footer */
.hub-footer { margin-top: 52px; }
.footer-grid { display: flex; gap: 28px; flex-wrap: wrap; margin-bottom: 16px; align-items: flex-start; }

.footer-item { display: flex; align-items: flex-start; gap: 10px; }

/* Mask icon in footer — lime color */
.footer-icon {
  display: block; width: 18px; height: 18px; min-width: 18px;
  background-color: #7A8BA8;
  mask-repeat: no-repeat; mask-size: contain; mask-position: center;
  -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain; -webkit-mask-position: center;
  margin-top: 3px;
}

.footer-label {
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; color: #7A8BA8; margin-bottom: 3px;
}
.footer-link { font-size: 14px; font-weight: 600; color: #C5F946; text-decoration: none; transition: color 0.2s; }
.footer-link:hover { color: #F0F4FF; }
.footer-note { font-size: 13px; color: #7A8BA8; margin: 0; line-height: 1.5; }

@media (max-width: 600px) {
  .hub-title { font-size: 28px; }
  .hub-header { padding: 28px 0 24px; }
  .primary-tab { font-size: 13px; padding: 9px 14px; }
  .footer-grid { gap: 18px; }
}
</style>
