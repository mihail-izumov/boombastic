<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { lkParks, PARK_STORAGE_KEY } from '../data/parks'

const isOpen = ref(false)
const savedPark = ref(null)

/* #RRGGBB → rgba(...) — так же, как в ParkCard.vue.
   Не используем color-mix(): не заводится в старых мобильных браузерах. */
function rgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* Выбранный ранее парк — первым в списке */
const orderedParks = computed(() => {
  if (!savedPark.value) return lkParks
  const hit = lkParks.filter((p) => p.id === savedPark.value)
  const rest = lkParks.filter((p) => p.id !== savedPark.value)
  return [...hit, ...rest]
})

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

/* Клик по активному парку: ссылка отрабатывает сама (новая вкладка),
   мы только запоминаем выбор, шлём событие и закрываем модалку. */
function pickPark(park) {
  savedPark.value = park.id
  try {
    localStorage.setItem(PARK_STORAGE_KEY, park.id)
  } catch (e) {}
  track('Войти — парк', { park: park.id })
  close()
}

/* Ховер: подсветка цветом парка (цвет приходит из данных, не из CSS) */
function hoverOn(e, park) {
  e.currentTarget.style.background = rgba(park.accent, 0.14)
  e.currentTarget.style.borderColor = rgba(park.accent, 0.5)
}
function hoverOff(e, park) {
  e.currentTarget.style.background = rgba(park.accent, 0.05)
  e.currentTarget.style.borderColor = rgba(park.accent, 0.25)
}

function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => {
  try {
    savedPark.value = localStorage.getItem(PARK_STORAGE_KEY)
  } catch (e) {}
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
            <template v-for="park in orderedParks" :key="park.id">
              <!-- ЛК работает → настоящая ссылка в новую вкладку -->
              <a
                v-if="park.lk.status === 'active'"
                class="bb-park bb-park-active"
                :href="park.lk.url"
                target="_blank"
                rel="noopener noreferrer"
                :style="{ color: park.accent, borderColor: rgba(park.accent, 0.25), background: rgba(park.accent, 0.05) }"
                @mouseenter="hoverOn($event, park)"
                @mouseleave="hoverOff($event, park)"
                @click="pickPark(park)"
              >
                <span class="bb-park-name">{{ park.name }}</span>
                <span v-if="park.address" class="bb-park-hint">{{ park.address }}</span>
                <span v-if="savedPark === park.id" class="bb-park-badge" :style="{ color: park.accent, background: rgba(park.accent, 0.15) }">ТВОЙ ПАРК</span>
              </a>

              <!-- ЛК ещё нет -->
              <div
                v-else
                class="bb-park bb-park-soon"
                :style="{ color: park.accent, borderColor: rgba(park.accent, 0.25), background: rgba(park.accent, 0.05) }"
                aria-disabled="true"
              >
                <span class="bb-park-name">{{ park.name }}</span>
                <span class="bb-park-hint">Личный кабинет скоро</span>
                <span class="bb-park-badge bb-park-badge-soon">СКОРО</span>
              </div>
            </template>
          </div>

          <div class="bb-login-note">Кабинет откроется в новой вкладке</div>
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
  padding: 14px 20px;
  border-radius: 10px;
  border: 1.5px solid transparent;
  text-align: center;
  text-decoration: none;
  transition: all 0.25s;
}

.bb-park-active {
  cursor: pointer;
}
.bb-park-active:hover {
  transform: translateY(-2px);
}

.bb-park-soon {
  cursor: not-allowed;
  opacity: 0.45;
}

.bb-park-name {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: inherit;
  line-height: 1.4;
}

.bb-park-hint {
  display: block;
  margin-top: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.3;
}

.bb-park-badge {
  position: absolute;
  top: 8px;
  right: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.bb-park-badge-soon {
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
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
    padding: 16px 20px;
  }
}
</style>
