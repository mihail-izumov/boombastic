<template>
  <div class="terms-hub">

    <div class="hub-header">
      <p class="hub-eyebrow">ЮРИДИЧЕСКАЯ ЗОНА</p>
      <h1 class="hub-title">Документы</h1>
      <p class="hub-sub">Всё прозрачно. Читай сколько хочешь — или просто глянь главное вверху.</p>
    </div>

    <!-- Primary nav: 3 tabs, centered, filled when active -->
    <div class="primary-nav">
      <button
        v-for="s in sections"
        :key="s.id"
        class="primary-tab"
        :class="{ active: activeSection === s.id, [`tab-${s.id}`]: true }"
        @click="activeSection = s.id"
      >
        <span
          class="tab-icon-wrap"
          :style="{ maskImage: s.mask, WebkitMaskImage: s.mask, backgroundColor: activeSection === s.id ? s.iconActiveColor : s.color }"
        ></span>
        {{ s.label }}
      </button>
    </div>

    <!-- Park switcher: centered, Охта=#FF0080, Питерлэнд=#00D4FF -->
    <div class="park-wrap" v-if="activeSection === 'oferta'">
      <div class="park-switcher">
        <button class="park-btn park-ohta"      :class="{ active: activePark === 'ohta' }"      @click="activePark = 'ohta'">Охта Молл</button>
        <button class="park-btn park-piterland"  :class="{ active: activePark === 'piterland' }" @click="activePark = 'piterland'">Питерлэнд</button>
      </div>
    </div>

    <div class="tab-content">
      <TermsOfertaOhta      v-if="activeSection === 'oferta'  && activePark === 'ohta'" />
      <TermsOfertaPiterland v-if="activeSection === 'oferta'  && activePark === 'piterland'" />
      <TermsPolicy          v-if="activeSection === 'policy'" />
      <TermsPrivacy         v-if="activeSection === 'privacy'" />
    </div>

    <!-- Footer: centered columns -->
    <div class="hub-footer">
      <div class="footer-grid">
        <div class="footer-item">
          <span class="footer-icon" :style="{ maskImage: phoneIcon, WebkitMaskImage: phoneIcon }"></span>
          <div class="footer-col">
            <div class="footer-label">Охта Молл</div>
            <a href="tel:+79643211100" class="footer-link">+7 (964) 321-11-00</a>
          </div>
        </div>
        <div class="footer-item">
          <span class="footer-icon" :style="{ maskImage: phoneIcon, WebkitMaskImage: phoneIcon }"></span>
          <div class="footer-col">
            <div class="footer-label">Питерлэнд</div>
            <a href="tel:+79650457555" class="footer-link">+7 (965) 045-75-55</a>
          </div>
        </div>
        <div class="footer-item">
          <span class="footer-icon" :style="{ maskImage: mailIcon, WebkitMaskImage: mailIcon }"></span>
          <div class="footer-col">
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

const ic = (paths) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const sections = [
  {
    id: 'oferta',
    label: 'Оферта',
    // white tab — active bg is white, inactive icon is white-ish
    color: 'rgba(255,255,255,0.55)',
    iconActiveColor: '#1a1840',
    mask: ic(`<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>`)
  },
  {
    id: 'policy',
    label: 'Политика конфиденциальности',
    color: '#C5F946',
    iconActiveColor: '#1a1840',
    mask: ic(`<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`)
  },
  {
    id: 'privacy',
    label: 'Согласие на данные',
    color: '#00FF88',
    iconActiveColor: '#1a1840',
    mask: ic(`<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>`)
  },
]

const phoneIcon = ic(`<path d="m16 8 6-6"/><path d="M22 8V2h-6"/><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>`)
const mailIcon  = ic(`<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>`)
</script>

<style scoped>
.terms-hub {
  font-family: 'Inter', sans-serif;
  max-width: 860px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* ── Header ── */
.hub-header { padding: 48px 0 32px; text-align: center; }
.hub-eyebrow { font-size: 22px; font-weight: 700; letter-spacing: 3px; color: #7A8BA8; margin: 0 0 14px; }
.hub-title { font-family: 'Montserrat', sans-serif; font-size: 36px; font-weight: 700; line-height: 36px; color: #F0F4FF; margin: 0 0 16px; }
.hub-sub { font-size: 15px; color: #7A8BA8; margin: 0 auto; max-width: 440px; line-height: 1.65; }

/* ── Primary nav ── */
.primary-nav { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }

.primary-tab {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  color: #7A8BA8;
  font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.primary-tab:hover { color: #F0F4FF; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); }

/* active states per tab */
.primary-tab.active.tab-oferta  { background: rgba(255,255,255,0.92); color: #1a1840; border-color: rgba(255,255,255,0.92); }
.primary-tab.active.tab-policy  { background: #C5F946; color: #1a1840; border-color: #C5F946; }
.primary-tab.active.tab-privacy { background: #00FF88; color: #1a1840; border-color: #00FF88; }

/* hover hints for inactive */
.primary-tab.tab-oferta:not(.active):hover  { border-color: rgba(255,255,255,0.4); }
.primary-tab.tab-policy:not(.active):hover  { border-color: rgba(197,249,70,0.4); }
.primary-tab.tab-privacy:not(.active):hover { border-color: rgba(0,255,136,0.4); }

.tab-icon-wrap {
  display: block; width: 16px; height: 16px; min-width: 16px;
  mask-repeat: no-repeat; mask-size: contain; mask-position: center;
  -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain; -webkit-mask-position: center;
}

/* ── Park switcher ── */
.park-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
.park-switcher { display: inline-flex; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); }

.park-btn {
  padding: 9px 24px; background: rgba(255,255,255,0.05); border: none;
  color: #7A8BA8; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.park-btn + .park-btn { border-left: 1px solid rgba(255,255,255,0.1); }
.park-btn:hover { color: #F0F4FF; background: rgba(255,255,255,0.08); }

.park-ohta.active      { color: #fff;    background: #FF0080; }
.park-piterland.active { color: #0D1421; background: #00D4FF; }

/* ── Content ── */
.tab-content { min-height: 400px; }

/* ── Footer ── */
.hub-footer { margin-top: 52px; display: flex; flex-direction: column; align-items: center; text-align: center; }

.footer-grid { display: flex; gap: 40px; flex-wrap: wrap; justify-content: center; margin-bottom: 16px; }

/* each footer column: icon + text stacked, all centered */
.footer-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }

.footer-icon {
  display: block; width: 20px; height: 20px;
  background-color: #7A8BA8;
  mask-repeat: no-repeat; mask-size: contain; mask-position: center;
  -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain; -webkit-mask-position: center;
}

.footer-col { display: flex; flex-direction: column; align-items: center; }

.footer-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8BA8; margin-bottom: 3px; }
.footer-link { font-size: 14px; font-weight: 600; color: #C5F946; text-decoration: none; transition: color 0.2s; }
.footer-link:hover { color: #F0F4FF; }
.footer-note { font-size: 13px; color: #7A8BA8; margin: 0; }

/* ── Mobile ── */
@media (max-width: 600px) {
  .terms-hub { padding: 0 16px 48px; }
  .hub-title { font-size: 28px; line-height: 32px; }
  .hub-eyebrow { font-size: 16px; }
  .hub-header { padding: 28px 0 24px; }
  .primary-nav { gap: 8px; }
  .primary-tab { font-size: 13px; padding: 10px 14px; }
  .footer-grid { gap: 24px; }
  .park-btn { padding: 9px 18px; }
}
</style>
