<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted } from 'vue'

const { Layout } = DefaultTheme

let observer = null

onMounted(() => {
  // [ПРАВКА 1] Инжектим Shark Eyes в навбар
  injectSharkEyes()
  
  // [ПРАВКА 4] Настраиваем мобильные кнопки
  setupMobileButtons()
  
  // Наблюдатель за изменениями DOM (для SPA-навигации)
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

// [ПРАВКА 1] Добавляем Shark Eyes слева от логотипа
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

// [ПРАВКА 4] Мобильные кнопки открывают модальные окна
function setupMobileButtons() {
  // Кнопка "Войти" в мобильном меню
  document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="apply-link"]').forEach(btn => {
    if (btn.dataset.mobileReady) return
    btn.dataset.mobileReady = 'true'
    
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      closeMobileMenu()
      setTimeout(() => {
        if (window.openLoginModal) window.openLoginModal()
      }, 150)
    })
  })
  
  // Кнопка "Игровой режим" в мобильном меню
  document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="gamemode-link"]').forEach(btn => {
    if (btn.dataset.mobileReady) return
    btn.dataset.mobileReady = 'true'
    
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      closeMobileMenu()
      setTimeout(() => {
        if (window.openGameModeModal) window.openGameModeModal()
      }, 150)
    })
  })
}

function closeMobileMenu() {
  // Закрываем мобильное меню VitePress
  const hamburger = document.querySelector('.VPNavBarHamburger')
  if (hamburger && hamburger.classList.contains('active')) {
    hamburger.click()
  }
}
</script>

<template>
  <Layout />
</template>
