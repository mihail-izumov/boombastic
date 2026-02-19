<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted } from 'vue'

const { Layout } = DefaultTheme

let observer = null

onMounted(() => {
  // Инжектим Shark Eyes в навбар
  injectSharkEyes()
  
  // Настраиваем scroll-эффект для навбара
  setupScrollEffect()
  
  // Настраиваем кнопки на мобильном
  setupMobileButtons()
  
  // Наблюдатель за изменениями DOM
  observer = new MutationObserver(() => {
    injectSharkEyes()
    setupMobileButtons()
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

function injectSharkEyes() {
  const titleEl = document.querySelector('.VPNavBarTitle .title')
  if (titleEl && !titleEl.querySelector('.shark-eyes')) {
    const img = document.createElement('img')
    img.src = '/shark-eyes-icon-electric.svg'
    img.alt = 'Shark Eyes'
    img.className = 'shark-eyes'
    titleEl.insertBefore(img, titleEl.firstChild)
  }
}

function setupScrollEffect() {
  const navbar = document.querySelector('.VPNavBar')
  if (!navbar) return
  
  const handleScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('bb-scrolled')
    } else {
      navbar.classList.remove('bb-scrolled')
    }
  }
  
  window.addEventListener('scroll', handleScroll)
  handleScroll()
}

function setupMobileButtons() {
  // Кнопка "Войти" в мобильном меню
  document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="apply-link"]').forEach(btn => {
    if (btn.dataset.mobileReady) return
    btn.dataset.mobileReady = 'true'
    
    // Создаём прозрачную кнопку поверх
    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:100;cursor:pointer;'
    btn.style.position = 'relative'
    btn.appendChild(overlay)
    
    overlay.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      closeMobileMenu()
      setTimeout(() => {
        if (window.openLoginModal) window.openLoginModal()
      }, 100)
    })
  })
  
  // Кнопка "Игровой режим" в мобильном меню
  document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="gamemode-link"]').forEach(btn => {
    if (btn.dataset.mobileReady) return
    btn.dataset.mobileReady = 'true'
    
    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:100;cursor:pointer;'
    btn.style.position = 'relative'
    btn.appendChild(overlay)
    
    overlay.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      closeMobileMenu()
      setTimeout(() => {
        if (window.openGameModeModal) window.openGameModeModal()
      }, 100)
    })
  })
}

function closeMobileMenu() {
  const navScreen = document.querySelector('.VPNavScreen')
  if (navScreen) {
    navScreen.classList.remove('open')
  }
  document.body.classList.remove('overflow-hidden')
}
</script>

<template>
  <Layout />
</template>

<style>
/* Прелоадер */
.bb-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1c1a3e;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.bb-preloader.hidden {
  opacity: 0;
  pointer-events: none;
}

.bb-preloader img {
  width: 72px;
  height: 48px;
  animation: preloader-pulse 0.5s ease-in-out infinite alternate;
}

@keyframes preloader-pulse {
  from {
    transform: scale(0.92);
    opacity: 0.7;
  }
  to {
    transform: scale(1.08);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .bb-preloader img {
    width: 56px;
    height: 38px;
  }
}
</style>
