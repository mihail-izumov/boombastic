<template>
  <DefaultLayout>
    <template #doc-before>
      <div v-if="shouldShowBanner" class="notification-container">
        <NotificationSlider v-if="frontmatter.notification === 'brew'" />
        <NotificationsClients v-if="frontmatter.notification === 'clients'" />
        <GeneralNotification v-else />
      </div>
    </template>
  </DefaultLayout>
  
  <!-- Модальное окно -->
  <SignalModalButton />
</template>

<script setup>
import { computed, watch, onMounted, nextTick } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NotificationSlider from './NotificationSlider.vue'
import GeneralNotification from './GeneralNotification.vue'
import NotificationsClients from './NotificationsClients.vue'  
import SignalModalButton from '../components/SignalModalButton.vue'

const DefaultLayout = DefaultTheme.Layout
const { frontmatter } = useData()
const router = useRouter()

const shouldShowBanner = computed(() => 
  ['brew', 'general', 'clients'].includes(frontmatter.value?.notification)
)

watch(shouldShowBanner, (newVal) => {
  if (typeof document !== 'undefined') {
    if (newVal) {
      document.body.classList.add('has-banner')
    } else {
      document.body.classList.remove('has-banner')
    }
  }
}, { immediate: true })

// Обработка мобильной кнопки "Отправить Сигнал"
onMounted(() => {
  if (typeof window === 'undefined') return
  
  const setupMobileSignalButton = () => {
    // Проверяем, что это мобильное устройство
    if (window.innerWidth > 768) {
      console.log('Not mobile, skipping mobile setup')
      return
    }
    
    console.log('Mobile detected, setting up signal button...')
    
    // Ждём, пока window.openSignalModal станет доступна
    let attempts = 0
    const checkModal = setInterval(() => {
      attempts++
      
      if (window.openSignalModal) {
        clearInterval(checkModal)
        console.log('✓ Modal function found, setting up buttons...')
        
        // Находим кнопку в мобильном меню
        const signalLinks = document.querySelectorAll('.VPNavScreen .VPSocialLink[aria-label="signal-link"]')
        console.log('Found signal links:', signalLinks.length)
        
        if (signalLinks.length === 0) {
          console.log('No signal links found yet, will retry on next mutation')
          return
        }
        
        signalLinks.forEach((link, index) => {
          console.log('Processing link', index, link)
          
          // Проверяем, не обработана ли уже эта кнопка
          if (link.dataset.signalProcessed) {
            console.log('Link already processed, skipping')
            return
          }
          
          // Помечаем как обработанную
          link.dataset.signalProcessed = 'true'
          
          // Отключаем стандартное поведение ссылки
          link.removeAttribute('href')
          link.style.position = 'relative'
          
          // Создаём overlay-кнопку поверх псевдоэлемента ::after
          const overlay = document.createElement('button')
          overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            cursor: pointer;
            z-index: 100;
            -webkit-tap-highlight-color: transparent;
          `
          overlay.setAttribute('aria-label', 'Отправить Сигнал')
          
          overlay.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            
            console.log('✓ Mobile signal button clicked!')
            
            // Закрываем мобильное меню
            const navScreen = document.querySelector('.VPNavScreen')
            if (navScreen) {
              navScreen.classList.remove('open')
              console.log('✓ Mobile menu closed')
            }
            
            // Убираем блокировку скролла
            document.body.classList.remove('overflow-hidden')
            
            // Сбрасываем состояние кнопки меню
            const menuButton = document.querySelector('.VPNavBarHamburger button')
            if (menuButton) {
              menuButton.setAttribute('aria-expanded', 'false')
            }
            
            // Открываем модальное окно с небольшой задержкой
            setTimeout(() => {
              if (window.openSignalModal) {
                window.openSignalModal()
                console.log('✓ Modal opened')
              } else {
                console.error('✗ window.openSignalModal not found')
              }
            }, 100)
          })
          
          // Добавляем обработчик на touchstart для лучшей работы на мобильных
          overlay.addEventListener('touchstart', (e) => {
            console.log('Touch detected on signal button')
          }, { passive: true })
          
          link.appendChild(overlay)
          console.log('✓ Overlay button added to link', index)
        })
      } else if (attempts > 50) {
        clearInterval(checkModal)
        console.error('✗ Modal function not found after 5 seconds')
      }
    }, 100)
  }
  
  // Запускаем при загрузке
  nextTick(() => {
    setTimeout(setupMobileSignalButton, 500)
  })
  
  // Следим за изменениями в DOM для SPA-навигации
  const observer = new MutationObserver(() => {
    if (window.innerWidth <= 768) {
      setupMobileSignalButton()
    }
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  // Обработка изменения роутов
  router.onAfterRouteChanged = () => {
    if (window.innerWidth <= 768) {
      setTimeout(setupMobileSignalButton, 300)
    }
  }
})
</script>

<style>
/* ФИКСИРОВАННАЯ ВЫСОТА - ключ к решению проблемы прыжков */
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

/* Мобильная версия */
@media (max-width: 768px) {
  .notification-container {
    max-width: 100%;
    margin: 12px 0 36px 0;
    height: 72px;
  }
  
  body.has-banner .VPDoc {
    padding-top: 20px;
  }
  
  /* Убираем pointer-events с псевдоэлемента, чтобы overlay мог принимать клики */
  .VPNavScreen .VPSocialLink[aria-label="signal-link"]::after {
    pointer-events: none !important;
  }
}

/* Планшеты */
@media (max-width: 960px) and (min-width: 769px) {
  .notification-container {
    max-width: calc(100% - 24px);
    margin: 14px 12px 42px 12px;
    height: 58px;
  }
  
  body.has-banner .VPDoc {
    padding-top: 18px;
  }
}
</style>
