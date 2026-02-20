<template>
  <DefaultLayout>
    <!-- B00M homepage: вставляем через слот home-hero-before -->
    <template #home-hero-before>
      <HomePage v-if="isBoomHome" />
    </template>

    <!-- Обычные страницы: баннер -->
    <template #doc-before>
      <div v-if="shouldShowBanner && !isBoomHome" class="notification-container">
        <NotificationSlider v-if="frontmatter.notification === 'brew'" />
        <NotificationsClients v-if="frontmatter.notification === 'clients'" />
        <GeneralNotification v-else />
      </div>
    </template>

    <template #layout-bottom>
      <BbFooter />
    </template>
  </DefaultLayout>
  
  <SignalModalButton v-if="!isBoomHome" />

  <!-- Прелоадер -->
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
import HomePage from '../components/HomePage.vue'

const DefaultLayout = DefaultTheme.Layout
const { frontmatter } = useData()
const router = useRouter()

// ── B00M Home: определяем по флагу в frontmatter ──
const isBoomHome = computed(() => frontmatter.value.boomHome === true)

const shouldShowBanner = computed(() => 
  ['brew', 'general', 'clients'].includes(frontmatter.value?.notification)
)

watch(shouldShowBanner, (newVal) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('has-banner', newVal)
  }
}, { immediate: true })

// ── Добавляем/убираем класс для CSS-скрытия дефолтного контента ──
watch(isBoomHome, (val) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('boom-home-active', val)
  }
}, { immediate: true })

const showPreloader = ref(false)
let preloaderTimeout = null
let preloaderStart = 0
const PRELOADER_MIN_MS = 600

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

  injectSharkEyes()
  setupMobileSignalButton()
  setupDropdownPosition()
  hideLocalNavWhenMenuOpen()

  const observer = new MutationObserver(() => {
    injectSharkEyes()
    setupDropdownPosition()
    hideLocalNavWhenMenuOpen()
    if (window.innerWidth <= 1024) setupMobileSignalButton()
  })
  observer.observe(document.body, { childList: true, subtree: true, attributes: true })

  router.onBeforeRouteChange = () => {
    showPreloader.value = true
    preloaderStart = Date.now()
    clearTimeout(preloaderTimeout)
    preloaderTimeout = setTimeout(() => { showPreloader.value = false }, 2000)
  }

  router.onAfterRouteChanged = () => {
    const elapsed = Date.now() - preloaderStart
    const remaining = Math.max(0, PRELOADER_MIN_MS - elapsed)

    clearTimeout(preloaderTimeout)
    preloaderTimeout = setTimeout(() => {
      showPreloader.value = false
    }, remaining)

    nextTick(() => {
      const nb = document.querySelector('.VPNavBar')
      if (nb) nb.classList.toggle('bb-scrolled', window.scrollY > 10)
      injectSharkEyes()
      setupDropdownPosition()
    })
    if (window.innerWidth <= 1024) {
      setTimeout(setupMobileSignalButton, 300)
    }
  }
})

onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
  clearTimeout(preloaderTimeout)
})

function injectSharkEyes() {
  if (typeof document === 'undefined') return
  const titleLink = document.querySelector('.VPNavBarTitle a')
  if (titleLink && !titleLink.querySelector('.shark-eyes')) {
    const eyes = document.createElement('img')
    eyes.src = '/boombastic/shark-eyes-icon-electric.svg'
    eyes.alt = ''
    eyes.className = 'shark-eyes'
    eyes.setAttribute('aria-hidden', 'true')
    titleLink.insertBefore(eyes, titleLink.firstChild)
  }
}

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

// Принудительное позиционирование dropdown по левому краю кнопки
function setupDropdownPosition() {
  if (typeof window === 'undefined' || window.innerWidth <= 1024) return
  
  const flyouts = document.querySelectorAll('.VPNavBar .VPNavBarMenu .VPFlyout')
  
  flyouts.forEach((flyout) => {
    if (flyout.dataset.dropdownFixed) return
    flyout.dataset.dropdownFixed = 'true'
    
    const menu = flyout.querySelector('.VPMenu')
    if (!menu) return
    
    // Применяем inline стили для максимального приоритета
    const applyPosition = () => {
      menu.style.cssText = `
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: auto !important;
        transform: none !important;
        margin-top: 8px !important;
      `
    }
    
    // Применяем сразу и при hover
    applyPosition()
    flyout.addEventListener('mouseenter', applyPosition)
  })
}

// Скрываем VPLocalNav когда открыто мобильное меню
function hideLocalNavWhenMenuOpen() {
  if (typeof window === 'undefined') return
  
  const navScreen = document.querySelector('.VPNavScreen')
  const localNav = document.querySelector('.VPLocalNav')
  
  if (!localNav) return
  
  if (navScreen && navScreen.classList.contains('open')) {
    localNav.style.display = 'none'
    localNav.style.visibility = 'hidden'
  } else {
    // Восстанавливаем только если не на странице с sidebar
    const hasSidebar = document.body.classList.contains('has-sidebar') || 
                       document.querySelector('.has-sidebar')
    if (!hasSidebar) {
      localNav.style.display = ''
      localNav.style.visibility = ''
    }
  }
}
</script>

<style>
/* ── Скрываем дефолтный VitePress home-контент когда наша страница активна ── */
body.boom-home-active .VPHome .VPHomeHero .container {
  display: none !important;
}
body.boom-home-active .VPHome .VPHomeFeatures {
  display: none !important;
}
body.boom-home-active .VPHome {
  padding: 0 !important;
  margin: 0 !important;
}
body.boom-home-active .VPContent.is-home {
  padding: 0 !important;
}

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

.VPNavBarTitle a {
  display: flex !important;
  align-items: center !important;
}

.shark-eyes {
  width: 28px;
  height: 18px;
  margin-right: 5px;
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
    filter: drop-shadow(0 0 8px rgba(197, 249, 70, 0.6))
           drop-shadow(0 0 16px rgba(197, 249, 70, 0.25));
    transform: scale(1.04);
  }
}

.bb-preloader {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 9998;
  background: #1c1a3e;
  display: flex; align-items: center; justify-content: center;
}

.bb-preloader-eyes {
  width: 72px; height: 48px; object-fit: contain;
  animation: preloader-pulse 0.5s ease-in-out infinite alternate;
}

@keyframes preloader-pulse {
  0% { transform: scale(0.92); opacity: 0.7; }
  100% { transform: scale(1.08); opacity: 1; }
}

.preloader-fade-enter-active { transition: opacity 0.1s ease; }
.preloader-fade-leave-active { transition: opacity 0.35s ease; }
.preloader-fade-enter-from,
.preloader-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .shark-eyes { width: 24px; height: 16px; margin-right: 4px; }
  .bb-preloader-eyes { width: 56px; height: 38px; }
  .notification-container { max-width: 100%; margin: 12px 0 36px 0; height: 72px; }
  body.has-banner .VPDoc { padding-top: 20px; }
  .VPNavScreen .VPSocialLink[aria-label="signal-link"]::after { pointer-events: none !important; }
}

@media (max-width: 960px) and (min-width: 769px) {
  .notification-container { max-width: calc(100% - 24px); margin: 14px 12px 42px 12px; height: 58px; }
  body.has-banner .VPDoc { padding-top: 18px; }
}

/* ═══ [FIX 2] DROPDOWN: принудительное выравнивание ═══ */
.VPNavBar .VPNavBarMenu .VPFlyout .VPMenu {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: auto !important;
  transform: none !important;
  margin-top: 8px !important;
}

/* ═══ [FIX 3,4] Убираем двойные рамки в dropdown ═══ */
.VPMenu .VPMenuLink a,
.VPFlyout .VPMenuLink a {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
.VPMenu .VPMenuLink a:hover,
.VPFlyout .VPMenuLink a:hover,
.VPMenu .VPMenuLink a:focus,
.VPFlyout .VPMenuLink a:focus {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
</style>
