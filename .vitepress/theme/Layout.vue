<template>
  <DefaultLayout>
    <template #home-hero-before>
      <HomePage v-if="isBoomHome" />
    </template>

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

  <Teleport to="body">
    <Transition name="preloader-fade">
      <div v-if="showPreloader" class="bb-preloader">
        <img src="https://b00m.fun/shark-eyes-icon-electric.svg" alt="" class="bb-preloader-eyes" aria-hidden="true" />
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

const isBoomHome = computed(() => frontmatter.value.boomHome === true)
const shouldShowBanner = computed(() => ['brew', 'general', 'clients'].includes(frontmatter.value?.notification))

watch(shouldShowBanner, (newVal) => {
  if (typeof document !== 'undefined') document.body.classList.toggle('has-banner', newVal)
}, { immediate: true })

watch(isBoomHome, (val) => {
  if (typeof document !== 'undefined') document.body.classList.toggle('boom-home-active', val)
}, { immediate: true })

const showPreloader = ref(false)
let preloaderTimeout = null
let preloaderStart = 0
const PRELOADER_MIN_MS = 600
let onScroll = null
let savedScrollY = 0
let mutationThrottle = null
let scrollLockInterval = null

onMounted(() => {
  if (typeof window === 'undefined') return

  const navbar = document.querySelector('.VPNavBar')
  if (navbar) {
    onScroll = () => navbar.classList.toggle('bb-scrolled', window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  injectSharkEyes()
  setupMobileSignalButton()
  fixNavigation()
  injectMobileLoginButton()
  setupScrollLock()

  // MutationObserver с throttle 150ms
  const observer = new MutationObserver(() => {
    if (mutationThrottle) return
    mutationThrottle = setTimeout(() => {
      mutationThrottle = null
      injectSharkEyes()
      fixNavigation()
      injectMobileLoginButton()
      if (window.innerWidth <= 768) setupMobileSignalButton()
    }, 150)
  })
  observer.observe(document.body, { childList: true, subtree: true })
  window.addEventListener('resize', () => {
  if (mutationThrottle) return
  mutationThrottle = setTimeout(() => {
    mutationThrottle = null
    if (window.innerWidth > 960) {
      fixNavigation()
    }
  }, 150)
}, { passive: true })

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
    preloaderTimeout = setTimeout(() => { showPreloader.value = false }, remaining)
    nextTick(() => {
      const nb = document.querySelector('.VPNavBar')
      if (nb) nb.classList.toggle('bb-scrolled', window.scrollY > 10)
      injectSharkEyes()
      fixNavigation()
      injectMobileLoginButton()
    })
    if (window.innerWidth <= 768) setTimeout(setupMobileSignalButton, 300)
  }
})

onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
  clearTimeout(preloaderTimeout)
  clearTimeout(mutationThrottle)
  clearInterval(scrollLockInterval)
})

function injectSharkEyes() {
  if (typeof document === 'undefined') return
  const titleLink = document.querySelector('.VPNavBarTitle a')
  if (titleLink && !titleLink.querySelector('.shark-eyes')) {
    const eyes = document.createElement('img')
    eyes.src = 'https://b00m.fun/shark-eyes-icon-electric.svg'
    eyes.alt = ''
    eyes.className = 'shark-eyes'
    eyes.setAttribute('aria-hidden', 'true')
    titleLink.insertBefore(eyes, titleLink.firstChild)
  }
}

/* ════════════════════════════════════════════════════════════════
   Мобильная кнопка «Войти» в навбаре
   Только при ≤768px (когда виден гамбургер)
   ════════════════════════════════════════════════════════════════ */
function injectMobileLoginButton() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  if (window.innerWidth > 768) return

  // Прячем поиск на мобилке
  const searchBtn = document.querySelector('.VPNavBar .VPNavBarSearchButton')
  if (searchBtn) searchBtn.style.cssText = 'display:none !important;'

  // Проверяем, не вставлена ли уже кнопка
  if (document.querySelector('.bb-mobile-login-btn')) return

  const hamburger = document.querySelector('.VPNavBarHamburger')
  if (!hamburger) return

  const loginBtn = document.createElement('button')
  loginBtn.className = 'bb-mobile-login-btn'
  loginBtn.textContent = 'Войти'
  loginBtn.style.cssText = `
    font-family: Inter, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #1a1840;
    padding: 6px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    background-image: linear-gradient(-45deg, #c5f946, #85a931, #c5f946, #85a931);
    background-size: 400% 400%;
    animation: liquid-fluid 6s ease infinite;
    margin-right: 8px;
    flex-shrink: 0;
  `

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof window.openLoginModal === 'function') {
      window.openLoginModal()
    }
  })

  hamburger.parentElement.insertBefore(loginBtn, hamburger)
}

/* ════════════════════════════════════════════════════════════════
   Блокировка скролла при модальных окнах
   
   Простой подход: каждые 300ms проверяем DOM.
   Если модалка видна — блокируем скролл.
   Если нет — разблокируем.
   Не перехватываем функции, не используем defineProperty.
   ════════════════════════════════════════════════════════════════ */
function setupScrollLock() {
  if (typeof window === 'undefined') return

  scrollLockInterval = setInterval(() => {
    const login = document.getElementById('bb-login-modal')
    const gamemode = document.getElementById('bb-gamemode-modal')
    const loginOpen = login && login.style.display === 'flex'
    const gamemodeOpen = gamemode && gamemode.style.display === 'flex'
    const anyOpen = loginOpen || gamemodeOpen
    const isLocked = document.body.classList.contains('bb-scroll-locked')

    if (anyOpen && !isLocked) lockScroll()
    if (!anyOpen && isLocked) unlockScroll()
  }, 300)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setTimeout(unlockScroll, 50)
  })
}

function lockScroll() {
  if (document.body.classList.contains('bb-scroll-locked')) return
  savedScrollY = window.scrollY
  document.body.classList.add('bb-scroll-locked')
  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedScrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.overflow = 'hidden'
}

function unlockScroll() {
  if (!document.body.classList.contains('bb-scroll-locked')) return
  document.body.classList.remove('bb-scroll-locked')
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.overflow = ''
  window.scrollTo(0, savedScrollY)
}

/* ════════════════════════════════════════════════════════════════
   fixNavigation
   ════════════════════════════════════════════════════════════════ */
function fixNavigation() {
  if (typeof document === 'undefined') return

  // ══════════════════════════════════════════
  // 1. МОБИЛЬНОЕ МЕНЮ: Призотека
  // ══════════════════════════════════════════
  const mobileGroups = document.querySelectorAll('.VPNavScreen .VPNavScreenMenuGroup')
  mobileGroups.forEach((group) => {
    const btn = group.querySelector('button')
    if (!btn) return

    const isOpen = group.classList.contains('open')

    const textEl = btn.querySelector('.button-text')
    if (textEl) {
      textEl.style.setProperty('font-family', 'Inter, sans-serif', 'important')
      textEl.style.setProperty('font-size', '18px', 'important')
      textEl.style.setProperty('font-weight', '600', 'important')
      textEl.style.setProperty('color', isOpen ? '#C5F946' : '#F0F4FF', 'important')
    }

    const iconEl = btn.querySelector('.button-icon')
    if (iconEl) iconEl.style.cssText = 'display:none !important;'

    let chevron = btn.querySelector('.bb-chevron-wrap')
    if (!chevron) {
      chevron = document.createElement('span')
      chevron.className = 'bb-chevron-wrap'
      chevron.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;margin-left:6px;'
      chevron.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8BA8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.25s ease"><path d="m6 9 6 6 6-6"/></svg>'
      btn.appendChild(chevron)
    }

    const svg = chevron.querySelector('svg')
    if (svg) {
      svg.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
      svg.setAttribute('stroke', isOpen ? '#C5F946' : '#7A8BA8')
    }

    if (!btn.dataset.chevronClickFixed) {
      btn.dataset.chevronClickFixed = 'true'
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const nowOpen = group.classList.contains('open')
          const s = chevron.querySelector('svg')
          if (s) {
            s.style.transform = nowOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            s.setAttribute('stroke', nowOpen ? '#C5F946' : '#7A8BA8')
          }
          if (textEl) {
            textEl.style.setProperty('color', nowOpen ? '#C5F946' : '#F0F4FF', 'important')
          }
        }, 50)
      })
    }
  })

  // ══════════════════════════════════════════
  // 2. ДЕСКТОП: dropdown Призотеки
  // ══════════════════════════════════════════
  if (window.innerWidth > 960) {
    const desktopFlyouts = document.querySelectorAll('.VPNavBar .VPNavBarMenu .VPFlyout')
    desktopFlyouts.forEach((flyout) => {
      const menuDiv = flyout.querySelector(':scope > div.menu')
      if (menuDiv) {
        menuDiv.style.cssText = 'position:absolute;top:100%;left:0;right:auto;transform:none;margin:0;min-width:160px;border-radius:0;'
        menuDiv.querySelectorAll('*').forEach(el => {
          if (getComputedStyle(el).borderRadius !== '0px') el.style.borderRadius = '0'
        })
      }

      const btn = flyout.querySelector(':scope > button')
      if (btn && !btn.dataset.hoverFixed) {
        btn.dataset.hoverFixed = 'true'

        btn.addEventListener('mouseenter', () => {
          btn.style.setProperty('background', '#C5F946', 'important')
          btn.style.setProperty('color', '#1a1840', 'important')
          const txt = btn.querySelector('.text')
          if (txt) txt.style.setProperty('color', '#1a1840', 'important')
          const icon = btn.querySelector('.text-icon')
          if (icon) icon.style.setProperty('color', '#1a1840', 'important')
          btn.querySelectorAll('svg').forEach(s => {
            s.style.setProperty('color', '#1a1840', 'important')
            s.style.setProperty('fill', '#1a1840', 'important')
          })
        })

        btn.addEventListener('mouseleave', () => {
          btn.style.setProperty('background', 'transparent', 'important')
          btn.style.removeProperty('color')
          const txt = btn.querySelector('.text')
          if (txt) txt.style.removeProperty('color')
          const icon = btn.querySelector('.text-icon')
          if (icon) icon.style.removeProperty('color')
          btn.querySelectorAll('svg').forEach(s => {
            s.style.removeProperty('color')
            s.style.removeProperty('fill')
          })
        })
      }
    })
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
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:transparent;border:none;cursor:pointer;z-index:100;-webkit-tap-highlight-color:transparent;'
    overlay.setAttribute('aria-label', 'Отправить Сигнал')
    overlay.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation()
      const navScreen = document.querySelector('.VPNavScreen')
      if (navScreen) navScreen.classList.remove('open')
      document.body.classList.remove('overflow-hidden')
      const menuButton = document.querySelector('.VPNavBarHamburger button')
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false')
      setTimeout(() => { if (typeof window.openSignalModal === 'function') window.openSignalModal() }, 100)
    })
    overlay.addEventListener('touchstart', () => {}, { passive: true })
    link.appendChild(overlay)
  })
}
</script>

<style>
body.boom-home-active .VPHome .VPHomeHero .container { display: none !important; }
body.boom-home-active .VPHome .VPHomeFeatures { display: none !important; }
body.boom-home-active .VPHome { padding: 0 !important; margin: 0 !important; }
body.boom-home-active .VPContent.is-home { padding: 0 !important; }

.notification-container { max-width: 688px; width: 100%; margin: 16px auto 48px auto; padding: 0; box-sizing: border-box; height: 44px; overflow: hidden; }
.notification-container > * { height: 100%; display: flex; align-items: center; justify-content: center; }
body.has-banner .VPDoc { margin-top: 0; padding-top: 16px; }
.VPDoc, .VPContent { border-radius: 5px; }
.VPNavBarTitle a { display: flex !important; align-items: center !important; }

.shark-eyes { width: 28px; height: 18px; margin-right: 5px; flex-shrink: 0; object-fit: contain; animation: eyes-breathe 4s ease-in-out infinite; filter: drop-shadow(0 0 3px rgba(197,249,70,0.3)); }
@keyframes eyes-breathe {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(197,249,70,0.2)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 8px rgba(197,249,70,0.6)) drop-shadow(0 0 16px rgba(197,249,70,0.25)); transform: scale(1.04); }
}

.bb-preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9998; background: #1c1a3e; display: flex; align-items: center; justify-content: center; }
.bb-preloader-eyes { width: 72px; height: 48px; object-fit: contain; animation: preloader-pulse 0.5s ease-in-out infinite alternate; }
@keyframes preloader-pulse { 0% { transform: scale(0.92); opacity: 0.7; } 100% { transform: scale(1.08); opacity: 1; } }
.preloader-fade-enter-active { transition: opacity 0.1s ease; }
.preloader-fade-leave-active { transition: opacity 0.35s ease; }
.preloader-fade-enter-from, .preloader-fade-leave-to { opacity: 0; }

body.bb-scroll-locked { position: fixed !important; overflow: hidden !important; width: 100% !important; -webkit-overflow-scrolling: none !important; touch-action: none !important; }

/* Мобильная кнопка «Войти» — только при ≤768px */
.bb-mobile-login-btn { display: none !important; }
@media (max-width: 768px) {
  .bb-mobile-login-btn { display: inline-flex !important; }
}

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

.VPMenu .VPMenuLink a, .VPFlyout .VPMenuLink a { border: none !important; outline: none !important; box-shadow: none !important; }
.VPMenu .VPMenuLink a:hover, .VPFlyout .VPMenuLink a:hover, .VPMenu .VPMenuLink a:focus, .VPFlyout .VPMenuLink a:focus { border: none !important; outline: none !important; box-shadow: none !important; }
</style>
