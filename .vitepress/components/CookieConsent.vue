<script setup>
/**
 * CookieConsent.vue — баннер согласия на cookies для b00m.fun
 *
 * КАК ПОДКЛЮЧИТЬ:
 *   В .vitepress/theme/Layout.vue добавь:
 *   <template>
 *     <Layout>
 *       ...
 *       <CookieConsent />
 *     </Layout>
 *   </template>
 *
 * КАК РАБОТАЕТ "НЕ ПОКАЗЫВАТЬ ПОВТОРНО":
 *   При нажатии любой кнопки значение ("accepted" / "declined")
 *   сохраняется в localStorage по ключу "boom_cookie_consent".
 *   При следующем визите компонент проверяет этот ключ —
 *   если он есть, баннер не показывается.
 *
 * ЛОГИРОВАНИЕ:
 *   При каждом выборе отправляется POST на Google Apps Script
 *   с анонимными данными: timestamp, consent, url, session_id.
 */

import { ref, onMounted } from 'vue'

// ⬇️ ВСТАВЬ СВОЙ URL ИЗ GOOGLE APPS SCRIPT ⬇️
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwwaTXCT2X7Fwu8OHhWHCTufUn_2EIIrEiw1Mu-MXQsxhzDrMsj3-H5DqfkqC4ADSc/exec'
const CONSENT_KEY = 'boom_cookie_consent'

const visible = ref(false)
const phase = ref('idle')      // idle → in → out
const flashMsg = ref(null)     // { text, type }

function generateSessionId() {
  return 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function logConsent(consent) {
  try {
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        consent,
        url: window.location.href,
        session_id: generateSessionId()
      })
    }).catch(() => {})
  } catch {}
}

function handleChoice(choice) {
  try { localStorage.setItem(CONSENT_KEY, choice) } catch {}
  logConsent(choice)
  phase.value = 'out'
  flashMsg.value = choice === 'accepted'
    ? { text: '✓ Принято. Играем!', type: 'accept' }
    : { text: 'OK. Без cookies.', type: 'decline' }
  setTimeout(() => { visible.value = false }, 480)
  setTimeout(() => { flashMsg.value = null }, 2800)
}

onMounted(() => {
  try {
    if (localStorage.getItem(CONSENT_KEY)) return
  } catch {}
  setTimeout(() => {
    visible.value = true
    phase.value = 'in'
  }, 900)
})
</script>

<template>
  <!-- Баннер -->
  <Teleport to="body">
    <div v-if="visible" class="boom-cookie-overlay">
      <div :class="['boom-cookie-banner', `phase-${phase}`]">

        <div class="boom-cookie-head">
          <span class="boom-cookie-eyes">👀</span>
          <span class="boom-cookie-badge">cookies</span>
        </div>

        <div class="boom-cookie-title">
          Мы используем <span>cookies</span>
        </div>

        <div class="boom-cookie-text">
          Чтобы сайт работал быстро и запоминал твои настройки —
          нам нужны cookie-файлы. Ничего лишнего.
          <a href="/terms" target="_blank" rel="noopener">Подробнее →</a>
        </div>

        <div class="boom-cookie-actions">
          <button class="boom-btn-accept" @click="handleChoice('accepted')">
            Б00М! Принять
          </button>
          <button class="boom-btn-decline" @click="handleChoice('declined')">
            Отказаться
          </button>
        </div>
      </div>
    </div>

    <!-- Flash-уведомление -->
    <div v-if="flashMsg" :class="['boom-cookie-flash', flashMsg.type]">
      {{ flashMsg.text }}
    </div>
  </Teleport>
</template>

<style scoped>
/* ══════════════════════════════════════
   Overlay
   ══════════════════════════════════════ */
.boom-cookie-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  pointer-events: none;
}

/* ══════════════════════════════════════
   Banner — glassmorphism card
   ══════════════════════════════════════ */
.boom-cookie-banner {
  pointer-events: all;
  width: 100%;
  max-width: 500px;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 22px 24px 24px;
  position: relative;
  overflow: hidden;

  background-image:
    linear-gradient(150deg, rgba(13,20,33,0.97), rgba(34,32,80,0.95)),
    linear-gradient(150deg, rgba(255,255,255,0.12), rgba(74,90,173,0.22), rgba(255,255,255,0.04));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;

  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);

  box-shadow:
    0 8px 40px rgba(0,0,0,0.55),
    0 0 80px rgba(28,26,62,0.3),
    inset 0 1px 0 rgba(255,255,255,0.05);
}

/* ── Animations ── */
.boom-cookie-banner.phase-in {
  animation: boomSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.boom-cookie-banner.phase-out {
  animation: boomSlideDown 0.45s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}
@keyframes boomSlideUp {
  from { transform: translateY(140%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
@keyframes boomSlideDown {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(140%); opacity: 0; }
}

/* ── Неоновая полоса сверху ── */
.boom-cookie-banner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%, #00D4FF 15%, #C5F946 35%,
    #FFD60A 50%, #FF0080 65%, #00FF88 85%, transparent 100%
  );
  opacity: 0.55;
}

/* ── Glow-пульс ── */
.boom-cookie-banner::after {
  content: '';
  position: absolute;
  top: -1px; left: 50%;
  transform: translateX(-50%);
  width: 55%;
  height: 3px;
  background: radial-gradient(ellipse, rgba(197,249,70,0.35), transparent);
  animation: boomGlowPulse 3.5s ease-in-out infinite;
}
@keyframes boomGlowPulse {
  0%, 100% { opacity: 0.25; width: 45%; }
  50%      { opacity: 0.65; width: 65%; }
}

/* ══════════════════════════════════════
   Header: eyes + badge
   ══════════════════════════════════════ */
.boom-cookie-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.boom-cookie-eyes {
  font-size: 20px;
  line-height: 1;
  animation: boomBlink 4.5s ease-in-out infinite;
}
@keyframes boomBlink {
  0%, 43%, 47%, 100% { opacity: 1; }
  45% { opacity: 0.08; }
}
.boom-cookie-badge {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--neon-cyan, #00D4FF);
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  padding: 3px 8px;
  border-radius: 4px;
}

/* ══════════════════════════════════════
   Title + Text
   ══════════════════════════════════════ */
.boom-cookie-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 17px;
  color: var(--accent-lime, #C5F946);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.boom-cookie-title span {
  color: var(--text-primary, #F0F4FF);
}

.boom-cookie-text {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary, #7A8BA8);
  margin-bottom: 18px;
}
.boom-cookie-text a {
  color: var(--neon-cyan, #00D4FF);
  text-decoration: none;
  border-bottom: 1px solid rgba(0,212,255,0.25);
  transition: all 0.25s ease;
}
.boom-cookie-text a:hover {
  color: var(--accent-lime, #C5F946);
  border-color: rgba(197,249,70,0.4);
}

/* ══════════════════════════════════════
   Buttons
   ══════════════════════════════════════ */
.boom-cookie-actions {
  display: flex;
  gap: 10px;
}

.boom-btn-accept {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(135deg, #C5F946, #85a931, #C5F946);
  background-size: 300% 300%;
  color: #1a1840;
  animation: boomLiquid 6s ease infinite;
  box-shadow: 0 0 18px rgba(197,249,70,0.18);
  transition: all 0.3s ease;
}
.boom-btn-accept:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 28px rgba(197,249,70,0.35), 0 4px 12px rgba(0,0,0,0.25);
}
.boom-btn-accept:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
@keyframes boomLiquid {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

.boom-btn-decline {
  padding: 12px 20px;
  background: transparent;
  border: 1px solid rgba(74,90,173,0.35);
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-secondary, #7A8BA8);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.boom-btn-decline:hover {
  border-color: rgba(255,255,255,0.18);
  color: var(--text-primary, #F0F4FF);
  background: rgba(74,90,173,0.08);
  transform: translateY(-2px);
}
.boom-btn-decline:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}

/* ══════════════════════════════════════
   Flash notification
   ══════════════════════════════════════ */
.boom-cookie-flash {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 100000;
  pointer-events: none;
  animation: boomFlashIn 0.3s ease forwards, boomFlashOut 0.35s ease 2s forwards;
}
.boom-cookie-flash.accept {
  color: var(--neon-green, #00FF88);
  background: rgba(0,255,136,0.1);
  border: 1px solid rgba(0,255,136,0.25);
  box-shadow: 0 0 20px rgba(0,255,136,0.12);
}
.boom-cookie-flash.decline {
  color: var(--text-secondary, #7A8BA8);
  background: rgba(74,90,173,0.12);
  border: 1px solid rgba(74,90,173,0.25);
}
@keyframes boomFlashIn {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes boomFlashOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
</style>
