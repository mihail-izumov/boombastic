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
  setupMobileNavButtons()
  
  // Скрываем VPLocalNav когда открыто мобильное меню
  const navScreenObserver = new MutationObserver(() => {
    const navScreen = document.querySelector('.VPNavScreen')
    const localNav = document.querySelector('.VPLocalNav')
    if (navScreen && localNav) {
      if (navScreen.classList.contains('open')) {
        localNav.style.display = 'none'
      } else {
        localNav.style.display = ''
      }
    }
  })
  const navScreen = document.querySelector('.VPNavScreen')
  if (navScreen) {
    navScreenObserver.observe(navScreen, { attributes: true, attributeFilter: ['class'] })
  }

  const observer = new MutationObserver(() => {
    injectSharkEyes()
    if (window.innerWidth <= 960) {
      setupMobileSignalButton()
      setupMobileNavButtons()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })

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
    })
    if (window.innerWidth <= 960) {
      setTimeout(setupMobileSignalButton, 300)
      setTimeout(setupMobileNavButtons, 300)
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
    eyes.src = '/shark-eyes-icon-electric.svg'
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

// Мобильные кнопки "Войти" и "Игровой режим"
function setupMobileNavButtons() {
  if (typeof window === 'undefined' || window.innerWidth > 768) return

  // Кнопка "Войти" (apply-link)
  document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="apply-link"]').forEach((link) => {
    if (link.dataset.loginProcessed) return
    link.dataset.loginProcessed = 'true'
    link.removeAttribute('href')
    link.style.position = 'relative'
    link.style.cursor = 'pointer'

    link.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      const navScreen = document.querySelector('.VPNavScreen')
      if (navScreen) navScreen.classList.remove('open')
      document.body.classList.remove('overflow-hidden')
      
      const menuButton = document.querySelector('.VPNavBarHamburger button')
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false')

      setTimeout(() => {
        if (window.openLoginModal) window.openLoginModal()
      }, 150)
    })
  })

  // Кнопка "Игровой режим" (gamemode-link)
  document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="gamemode-link"]').forEach((link) => {
    if (link.dataset.gamemodeProcessed) return
    link.dataset.gamemodeProcessed = 'true'
    link.removeAttribute('href')
    link.style.position = 'relative'
    link.style.cursor = 'pointer'

    link.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      const navScreen = document.querySelector('.VPNavScreen')
      if (navScreen) navScreen.classList.remove('open')
      document.body.classList.remove('overflow-hidden')
      
      const menuButton = document.querySelector('.VPNavBarHamburger button')
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false')

      setTimeout(() => {
        if (window.openGameModeModal) window.openGameModeModal()
      }, 150)
    })
  })
}
</script>

<style>
/* ══════════════════════════════════════════════════════════════════
   КРИТИЧЕСКИЕ ПЕРЕОПРЕДЕЛЕНИЯ — максимальный приоритет
   Эти стили в Layout.vue имеют приоритет над внешними CSS файлами
   ══════════════════════════════════════════════════════════════════ */

/* ═══ [1] МОБИЛЬНОЕ МЕНЮ: Empty 18px лаймовый ═══ */
@media (max-width: 960px) {
  .VPNavScreen .VPNavScreenMenuGroup button,
  .VPNavScreen .VPNavScreenMenuGroup button .text,
  .VPNavScreen .VPNavScreenMenuGroup > button,
  .VPNavScreen .VPNavScreenMenuGroup > button > .text,
  .VPNavScreen .VPNavScreenMenuGroup > button > span.text {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #C5F946 !important;
  }
  
  /* Подпункты Empty1, Empty2, Empty3 - белые */
  .VPNavScreen .VPNavScreenMenuGroup .item a,
  .VPNavScreen .VPNavScreenMenuGroup .items .item a {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #F0F4FF !important;
  }
  .VPNavScreen .VPNavScreenMenuGroup .item a:hover,
  .VPNavScreen .VPNavScreenMenuGroup .items .item a:hover {
    color: #C5F946 !important;
  }
  
  /* [FIX 7] Мобильная навигация: закреплена при скролле с blur — ВЕЗДЕ */
  .VPNavBar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 100 !important;
    background: rgba(20, 18, 50, 0.85) !important;
    backdrop-filter: blur(12px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(12px) saturate(160%) !important;
  }
  
  /* [FIX 6] VPLocalNav под главной навигацией */
  .VPLocalNav {
    position: sticky !important;
    top: 64px !important;
    z-index: 50 !important;
    margin-top: 64px !important;
  }
  
  /* Отступ для контента */
  .VPContent {
    padding-top: 64px !important;
  }
  
  /* На главной без двойного отступа */
  body.boom-home-active .VPContent {
    padding-top: 0 !important;
  }
  body.boom-home-active .boom-page {
    padding-top: 64px !important;
  }
  
  /* На страницах с сайдбаром отступ уже через VPLocalNav */
  .has-sidebar .VPContent {
    padding-top: 0 !important;
  }
  
  /* Скрыть VPLocalNav когда открыто мобильное меню */
  body:has(.VPNavScreen.open) .VPLocalNav {
    display: none !important;
  }
  
  /* Скрыть "..." в мобильной версии */
  .VPNavBarExtra {
    display: none !important;
  }
}

/* ═══ [2] Активная страница в выпадающем меню — лаймовая ═══ */
.VPMenuLink a.active,
.VPMenuLink a.active span,
.VPLink.link.active,
.VPLink.link.active span,
.VPMenu .VPMenuLink a.active span,
.VPFlyout .VPMenuLink a.active span {
  color: #C5F946 !important;
  font-weight: 700 !important;
}

/* Активная ссылка при hover — тёмный текст на лаймовом фоне */
.VPMenuLink a.active:hover,
.VPMenuLink a.active:hover span,
.VPMenu .VPMenuLink a.active:hover span,
.VPFlyout .VPMenuLink a.active:hover span {
  color: #1a1840 !important;
}

/* Empty в обычном состоянии */
.VPNavBar .VPNavBarMenu .VPFlyout > button .text,
.VPNavBar .VPNavBarMenu .VPNavBarMenuGroup > button .text {
  color: #F0F4FF !important;
}

/* Empty когда на активной странице из группы */
.VPNavBar .VPNavBarMenu .VPFlyout.active > button .text,
.VPNavBar .VPNavBarMenu .VPNavBarMenuGroup.active > button .text {
  color: #C5F946 !important;
}

/* Empty при hover: лаймовый фон, тёмный текст */
.VPNavBar .VPNavBarMenu .VPFlyout > button:hover,
.VPNavBar .VPNavBarMenu .VPNavBarMenuGroup > button:hover {
  background: #C5F946 !important;
}
.VPNavBar .VPNavBarMenu .VPFlyout > button:hover .text,
.VPNavBar .VPNavBarMenu .VPNavBarMenuGroup > button:hover .text,
.VPNavBar .VPNavBarMenu .VPFlyout.active > button:hover .text,
.VPNavBar .VPNavBarMenu .VPNavBarMenuGroup.active > button:hover .text {
  color: #1a1840 !important;
}

/* ═══ [3] ДЕСКТОП: Кнопки навигации +20% ═══ */
.VPSocialLink[aria-label="gamemode-link"]::after {
  font-size: 15px !important;
  padding: 8px 18px !important;
}
.VPSocialLink[aria-label="apply-link"]::after {
  font-size: 15px !important;
  padding: 8px 18px !important;
}

/* ═══ [4] Hero "Б0000000М!" — моноширинный шрифт ═══ */
.hero-section h1,
.boom-page .hero-section h1 {
  font-family: 'Space Mono', monospace !important;
}

/* ══════════════════════════════════════════════════════════════════
   БАЗОВЫЕ СТИЛИ (оригинальные)
   ══════════════════════════════════════════════════════════════════ */

/* Скрываем дефолтный VitePress home-контент */
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

/* Shark Eyes +20% */
.shark-eyes {
  width: 34px;
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
  .shark-eyes { width: 29px; height: 19px; margin-right: 5px; }
  .bb-preloader-eyes { width: 56px; height: 38px; }
  .notification-container { max-width: 100%; margin: 12px 0 36px 0; height: 72px; }
  body.has-banner .VPDoc { padding-top: 20px; }
  .VPNavScreen .VPSocialLink[aria-label="signal-link"]::after { pointer-events: none !important; }
}

@media (max-width: 960px) and (min-width: 769px) {
  .notification-container { max-width: calc(100% - 24px); margin: 14px 12px 42px 12px; height: 58px; }
  body.has-banner .VPDoc { padding-top: 18px; }
}
</style>
