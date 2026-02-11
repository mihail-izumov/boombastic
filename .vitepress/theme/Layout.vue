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
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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

  // ── Мобильная кнопка «Отправить Сигнал» ──
  setupMobileSignalButton()

  const observer = new MutationObserver(() => {
    if (window.innerWidth <= 768) {
      setupMobileSignalButton()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })

  router.onAfterRouteChanged = () => {
    nextTick(() => {
      const nb = document.querySelector('.VPNavBar')
      if (nb) nb.classList.toggle('bb-scrolled', window.scrollY > 10)
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
})

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

@media (max-width: 768px) {
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

