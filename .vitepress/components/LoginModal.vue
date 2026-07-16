<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { lkParks, PARK_STORAGE_KEY } from '../data/parks'

const isOpen = ref(false)

/* #RRGGBB → rgba(...) — так же, как в ParkCard.vue.
   Не используем color-mix(): не заводится в старых мобильных браузерах. */
function rgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* Осветлить цвет парка к белому. Нужно для адреса: чистая магента на тёмной
   карточке даёт контраст 3.8:1, пастельная — 4.5:1 (норма для мелкого текста). */
function tint(hex, t) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const m = c.map((v) => Math.round(v + (255 - v) * t))
  return `rgb(${m[0]},${m[1]},${m[2]})`
}

/* Цвет парка уезжает в CSS-переменные — дальше всё решает CSS, без JS-ховеров */
function parkVars(p) {
  return {
    '--pk': p.accent,
    '--pk-soft': tint(p.accent, 0.3),
    '--pk-05': rgba(p.accent, 0.05),
    '--pk-14': rgba(p.accent, 0.14),
    '--pk-16': rgba(p.accent, 0.16),
    '--pk-22': rgba(p.accent, 0.22),
    '--pk-28': rgba(p.accent, 0.28),
    '--pk-60': rgba(p.accent, 0.6),
  }
}

function track(name, props) {
  try {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(name, props ? { props } : undefined)
    }
  } catch (e) {}
}

function open() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  track('Войти')
}

function close() {
  isOpen.value = false
  document.body.style.overflow = ''
}

/* Клик по активному парку: ссылка отрабатывает сама (новое окно),
   мы только пишем выбор в localStorage, шлём событие и закрываем модалку.
   Ключ boom_park общий — по UI-гайду 15.6 его будут читать фильтры на других страницах. */
function pickPark(park) {
  try {
    localStorage.setItem(PARK_STORAGE_KEY, park.id)
  } catch (e) {}
  track('Войти — парк', { park: park.id })
  close()
}

function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => {
  window.openLoginModal = open
  window.closeLoginModal = close
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  if (window.openLoginModal === open) delete window.openLoginModal
  if (window.closeLoginModal === close) delete window.closeLoginModal
})
</script>

<template>
  <Teleport to="body">
    <Transition name="bb-login-fade">
      <div v-if="isOpen" id="bb-login-modal" class="bb-login-overlay" role="dialog" aria-modal="true" aria-label="Личный кабинет">
        <div class="bb-login-backdrop" @click="close" />

        <div class="bb-login-modal">
          <button class="bb-login-close" aria-label="Закрыть" @click="close">✕</button>

          <div class="bb-login-title">ЛИЧНЫЙ КАБИНЕТ</div>
          <div class="bb-login-subtitle">Выбери свой парк</div>

          <div class="bb-login-list">
            <template v-for="park in lkParks" :key="park.id">
              <!-- ЛК работает → настоящая ссылка в новое окно -->
              <a
                v-if="park.lk.status === 'active'"
                class="bb-park bb-park-active"
                :href="park.lk.url"
                target="_blank"
                rel="noopener noreferrer"
                :style="parkVars(park)"
                @click="pickPark(park)"
              >
                <span class="bb-park-name">{{ park.name }}</span>
                <span v-if="park.address" class="bb-park-addr">{{ park.address }}</span>
                <svg class="bb-park-ext" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </a>

              <!-- ЛК ещё нет -->
              <div v-else class="bb-park bb-park-soon" :style="parkVars(park)" aria-disabled="true">
                <span class="bb-park-name">{{ park.name }}</span>
                <span v-if="park.address" class="bb-park-addr">{{ park.address }}</span>
                <span class="bb-park-badge">СКОРО</span>
              </div>
            </template>
          </div>

          <div class="bb-login-note">Откроется в новом окне</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bb-login-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bb-login-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 30, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  cursor: pointer;
}

.bb-login-modal {
  position: relative;
  width: 90%;
  max-width: 400px;
  box-sizing: border-box;
  padding: 36px 28px 28px;
  border-radius: 16px;
  background: linear-gradient(165deg, #222050, #1c1a3e);
  border: 1.5px solid rgba(197, 249, 70, 0.25);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(197, 249, 70, 0.08);
}

.bb-login-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.bb-login-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.bb-login-title {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #c5f946;
  letter-spacing: 0.12em;
  text-align: center;
  margin-bottom: 8px;
}

.bb-login-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #f0f4ff;
  text-align: center;
  margin-bottom: 28px;
}

.bb-login-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bb-park {
  position: relative;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 15px 44px;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.25s ease, filter 0.2s ease;
}

/* ── Активный парк: залитая кнопка цветом парка, тёмный текст ── */
.bb-park-active {
  cursor: pointer;
  background: var(--pk-14);
  border: 1.5px solid var(--pk-60);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 0 18px var(--pk-16);
}
.bb-park-active:hover {
  transform: translateY(-2px);
  background: var(--pk-22);
  border-color: var(--pk);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 24px var(--pk-28);
}
.bb-park-active:active {
  transform: translateY(0) scale(0.985);
}
.bb-park-active .bb-park-name {
  color: #f0f4ff;
}
.bb-park-active .bb-park-addr {
  color: var(--pk-soft);
}

/* Иконка «откроется снаружи» */
.bb-park-ext {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  color: var(--pk);
  opacity: 0.7;
}

/* ── Парк без ЛК: пунктир, нажимать нечего ── */
.bb-park-soon {
  cursor: not-allowed;
  background: var(--pk-05);
  border: 1.5px dashed var(--pk-22);
}
.bb-park-soon .bb-park-name {
  color: rgba(240, 244, 255, 0.42);
}
.bb-park-soon .bb-park-addr {
  color: var(--pk-soft);
  opacity: 0.45;
}

.bb-park-name {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}

.bb-park-addr {
  display: block;
  margin-top: 3px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
}

.bb-park-badge {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.07);
}

.bb-login-note {
  margin-top: 18px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}

.bb-login-fade-enter-active,
.bb-login-fade-leave-active {
  transition: opacity 0.25s ease;
}
.bb-login-fade-enter-from,
.bb-login-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .bb-login-modal {
    padding: 32px 20px 24px;
  }
  .bb-park {
    padding: 17px 44px;
  }
}
</style>
