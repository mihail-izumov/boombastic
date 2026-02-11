<template>
  <DefaultLayout>
    <template #doc-before>
      <div v-if="shouldShowBanner" class="notification-container">
        <NotificationSlider v-if="frontmatter.notification === 'brew'" />
        <NotificationsClients v-if="frontmatter.notification === 'clients'" />
        <GeneralNotification v-else />
      </div>
    </template>

    <!-- Футер теперь Vue-компонент через слот -->
    <template #layout-bottom>
      <BbFooter />
    </template>
  </DefaultLayout>
  
  <!-- Модальное окно -->
  <SignalModalButton />

  <!-- Прелоадер: shark eyes при переходе между страницами -->
  <Teleport to="body">
    <Transition name="preloader-fade">
      <div v-if="showPreloader" class="bb-preloader">
        <img 
          src="/shark-eyes-icon-electric.svg" 
          alt="" 
          class="bb-preloader-eyes"
          aria-hidden="true"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NotificationSlider from './NotificationSlider.vue'
import GeneralNotification from './GeneralNotification.vue'
import NotificationsClients from './NotificationsClients.vue'  
import SignalModalButton from '../components/SignalModalButton.vue'
import BbFooter from '../components/BbFooter.vue'

const DefaultLayout = DefaultTheme.Layout
const { frontmatter } = useData()
const router = useRouter()

const shouldShowBanner = computed(() => 
  ['brew', 'general', 'clients'].includes(frontmatter.value?.notification)
)

watch(shouldShowBanner, (newVal) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('has-banner', newVal)
  }
}, { immediate: true })

// ── Прелоадер ──
const showPreloader = ref(false)
let preloaderTimeout = null

// ── Навбар: glassmorphism при скролле ──
let onScroll = null

onMounted(() => {
  if (typeof window === 'undefined') return

  const navbar = document.querySelector('.VPNavBar')
  if (navbar) {
    onScroll = () => {
      navbar.classList.toggle('bb-scrolled', window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  // ── Shark Eyes рядом с лого ──
  injectSharkEyes()

  // ── Мобильная кнопка «Отправить Сигнал» ──
  setupMobileSignalButton()

  const observer = new MutationObserver(() => {
    injectSharkEyes()
    if (window.innerWidth <= 768) {
      setupMobileSignalButton()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })

  // ── Прелоадер при смене маршрута ──
  router.onBeforeRouteChange = () => {
    showPreloader.value = true
    // Подстраховка: убрать через 1.5s если что-то застряло
    clearTimeout(preloaderTimeout)
    preloaderTimeout = setTimeout(() => { showPreloader.value = false }, 1500)
  }

  router.onAfterRouteChanged = () => {
    // Даём контенту отрисоваться, потом убираем прелоадер
    nextTick(() => {
      setTimeout(() => {
        showPreloader.value = false
        clearTimeout(preloaderTimeout)
      }, 300)

      const nb = document.querySelector('.VPNavBar')
      if (nb) nb.classList.toggle('bb-scrolled', window.scrollY > 10)
      injectSharkEyes()
    })
    if (window.innerWidth <= 768) {
      setTimeout(setupMobileSignalButton, 300)
    }
  }
})

onUnmounted(() => {
  if (onScroll) {
    window.removeEventListener('scroll', onScroll)
  }
  clearTimeout(preloaderTimeout)
})

// ── Shark Eyes: вставляем SVG-иконку перед логотипом ──
function injectSharkEyes() {
  if (typeof document === 'undefined') return

  // Десктоп навбар
  const titleLink = document.querySelector('.VPNavBarTitle a')
  if (titleLink && !titleLink.querySelector('.shark-eyes')) {
    const eyes = document.createElement('img')
    eyes.src = '/boombastic/shark-eyes-icon-electric.svg'
    eyes.alt = ''
    eyes.className = 'shark-eyes'
    eyes.setAttribute('aria-hidden', 'true')
    titleLink.insertBefore(eyes, titleLink.firstChild)
  }

  // Сайдбар лого (на страницах с sidebar)
  const sidebarTitle = document.querySelector('.VPSidebar .VPNavBarTitle a')
  if (sidebarTitle && !sidebarTitle.querySelector('.shark-eyes')) {
    const eyes2 = document.createElement('img')
    eyes2.src = '/boombastic/shark-eyes-icon-electric.svg'
    eyes2.alt = ''
    eyes2.className = 'shark-eyes'
    eyes2.setAttribute('aria-hidden', 'true')
    sidebarTitle.insertBefore(eyes2, sidebarTitle.firstChild)
  }
}

// ── Мобильная кнопка «Сигнал» ──
function setupMobileSignalButton() {
  if (typeof window === 'undefined' || window.innerWidth > 768) return
  if (!window.openSignalModal) return

  const signalLinks = document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="signal-link"]')
  signalLinks.forEach((link) => {
    if (link.dataset.signalProcessed) return
    link.dataset.signalProcessed = 'true'
    link.removeAttribute('href')
    link.style.position = 'relative'

    const overlay = document.createElement('button')
    overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: transparent; border: none; cursor: pointer; z-index: 100;
      -webkit-tap-highlight-color: transparent;
    `
    overlay.setAttribute('aria-label', 'Отправить Сигнал')

    overlay.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()

      const navScreen = document.querySelector('.VPNavScreen')
      if (navScreen) navScreen.classList.remove('open')
      document.body.classList.remove('overflow-hidden')

      const menuButton = document.querySelector('.VPNavBarHamburger button')
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false')

      setTimeout(() => {
        if (window.openSignalModal) window.openSignalModal()
      }, 100)
    })

    overlay.addEventListener('touchstart', () => {}, { passive: true })
    link.appendChild(overlay)
  })
}
</script>

<style>
.notification-container {
  max-width: 688px;
  width: 100%;
  margin: 16px auto 48px auto;
  padding: 0;
  box-sizing: border-box;
  height: 44px;
  overflow: hidden;
}

.notification-container > * {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

body.has-banner .VPDoc {
  margin-top: 0;
  padding-top: 16px;
}

.VPDoc,
.VPContent {
  border-radius: 5px;
}

/* ── Shark Eyes иконка (одинаковый размер везде) ── */
.VPNavBarTitle a {
  display: flex !important;
  align-items: center !important;
}

.shark-eyes {
  width: 32px;
  height: 22px;
  margin-right: 6px;
  flex-shrink: 0;
  object-fit: contain;
  animation: eyes-breathe 4s ease-in-out infinite;
  filter: drop-shadow(0 0 3px rgba(197, 249, 70, 0.3));
}

@keyframes eyes-breathe {
  0%, 100% {
    filter: drop-shadow(0 0 2px rgba(197, 249, 70, 0.2));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(197, 249, 70, 0.7))
           drop-shadow(0 0 20px rgba(197, 249, 70, 0.3));
    transform: scale(1.05);
  }
}

/* ── Прелоадер: вход в игру ── */
.bb-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background: rgba(28, 26, 62, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bb-preloader-eyes {
  width: 80px;
  height: 54px;
  object-fit: contain;
  animation: preloader-pulse 0.6s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 15px rgba(197, 249, 70, 0.6))
         drop-shadow(0 0 30px rgba(197, 249, 70, 0.3));
}

@keyframes preloader-pulse {
  0% {
    transform: scale(0.9);
    filter: drop-shadow(0 0 10px rgba(197, 249, 70, 0.4))
           drop-shadow(0 0 20px rgba(197, 249, 70, 0.2));
  }
  100% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 25px rgba(197, 249, 70, 0.8))
           drop-shadow(0 0 50px rgba(197, 249, 70, 0.4));
  }
}

.preloader-fade-enter-active { transition: opacity 0.15s ease; }
.preloader-fade-leave-active { transition: opacity 0.3s ease; }
.preloader-fade-enter-from,
.preloader-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .shark-eyes {
    width: 26px;
    height: 18px;
    margin-right: 5px;
  }

  .bb-preloader-eyes {
    width: 60px;
    height: 40px;
  }

  .notification-container {
    max-width: 100%;
    margin: 12px 0 36px 0;
    height: 72px;
  }
  body.has-banner .VPDoc { padding-top: 20px; }

  .VPNavScreen .VPSocialLink[aria-label="signal-link"]::after {
    pointer-events: none !important;
  }
}

@media (max-width: 960px) and (min-width: 769px) {
  .notification-container {
    max-width: calc(100% - 24px);
    margin: 14px 12px 42px 12px;
    height: 58px;
  }
  body.has-banner .VPDoc { padding-top: 18px; }
}
</style>
