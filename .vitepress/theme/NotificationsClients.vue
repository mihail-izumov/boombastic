<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const notifications = [
    { 
    text: 'Каждый Сигнал помогает бизнесу стать лучше для Вас уже сегодня.', 
    hasButton: false 
  },
  { 
    text: 'Делимся новостями в Телеграм.', 
    hasButton: true,
    buttonText: 'Подписаться',
    buttonUrl: 'https://t.me/runScale'
  },
  { 
    text: 'Поддержите место, которое Вы любите.', 
    hasButton: true,
    buttonText: 'Все возможности',
    buttonUrl: '/invest/pulse'
  }

]

const currentIndex = ref(0)
let timer = null
const currentNotification = computed(() => notifications[currentIndex.value])

const nextNotification = () => {
  currentIndex.value = (currentIndex.value + 1) % notifications.length
}

const goToSlide = (index) => {
  currentIndex.value = index
  restartTimer()
}

const openLink = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const startTimer = () => {
  timer = setInterval(nextNotification, 5000)
}

const restartTimer = () => {
  clearInterval(timer)
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="iso-brew-slider">
    <div class="iso-brew-slider__content">
      <transition name="iso-brew-fade" mode="out-in">
        <div class="iso-brew-slider__wrapper" :key="currentIndex">
          <p class="iso-brew-slider__text">
            {{ currentNotification.text }}
            <a 
              v-if="currentNotification.hasButton"
              :href="currentNotification.buttonUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="iso-brew-slider__link-mobile"
            >
              {{ currentNotification.buttonText }}
            </a>
          </p>
          <button 
            v-if="currentNotification.hasButton" 
            @click="openLink(currentNotification.buttonUrl)"
            class="iso-brew-slider__button"
          >
            {{ currentNotification.buttonText }}
          </button>
        </div>
      </transition>
    </div>
    
    <div class="iso-brew-slider__indicators">
      <button
        v-for="(_, index) in notifications"
        :key="`indicator-${index}`"
        class="iso-brew-slider__indicator"
        :class="{ 'active': currentIndex === index }"
        @click="goToSlide(index)"
        :aria-label="`Переключиться на уведомление ${index + 1}`"
      />
    </div>
  </div>
</template>

<style scoped>
/* Новые изолированные стили с вашим золотым фоном и темным текстом */
.iso-brew-slider {
  background: linear-gradient(90deg, #c4a373 0%, #f5dfb1 50%, #c4a373 100%) !important;
  color: #171a20 !important;
  width: 100% !important;
  height: 44px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  min-height: 44px !important;
}

.iso-brew-slider__content {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 1rem !important;
  min-width: 0;
}

.iso-brew-slider__wrapper {
  display: flex !important;
  align-items: center !important;
  justify-content: center;
  gap: 16px !important;
  width: 100%;
}

.iso-brew-slider__text {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #171a20 !important;
  line-height: 1.3 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Кнопка для десктопа */
.iso-brew-slider__button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #171a20 !important; 
  color: #fff !important;
  border: none !important; 
  padding: 0 14px !important;
  margin: 0 !important;
  border-radius: 4px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  height: 28px !important;
  transition: background-color 0.2s ease !important;
  flex-shrink: 0;
}

.iso-brew-slider__button:hover {
  background-color: #333 !important;
}

/* Ссылка для мобильных (по умолчанию скрыта) */
.iso-brew-slider__link-mobile {
  display: none !important;
}

/* Индикаторы */
.iso-brew-slider__indicators {
  display: flex !important;
  gap: 6px !important;
  margin-right: 1rem !important;
  align-items: center !important;
  flex-shrink: 0;
}

.iso-brew-slider__indicator {
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  border: none !important;
  background-color: rgba(23, 26, 32, 0.4) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  padding: 0 !important;
}

.iso-brew-slider__indicator:hover {
  background-color: rgba(23, 26, 32, 0.6) !important;
}

.iso-brew-slider__indicator.active {
  background-color: #171a20 !important;
}

/* Fade анимация */
.iso-brew-fade-enter-active, 
.iso-brew-fade-leave-active { 
  transition: opacity 0.6s ease !important; 
}

.iso-brew-fade-enter-from, 
.iso-brew-fade-leave-to { 
  opacity: 0 !important; 
}

/* Мобильная версия */
@media (max-width: 768px) {
  .iso-brew-slider {
    flex-direction: column !important;
    height: auto !important;
    padding: 12px 1rem 8px 1rem !important;
    border-radius: 8px !important;
    min-height: 60px !important;
  }
  .iso-brew-slider__content {
    margin-bottom: 8px !important;
    width: 100%;
  }
  .iso-brew-slider__wrapper {
    text-align: center !important;
  }
  .iso-brew-slider__text {
    font-size: 13px !important;
    white-space: normal;
    text-align: center;
  }
  .iso-brew-slider__button {
    display: none !important;
  }
  .iso-brew-slider__link-mobile {
    display: inline !important;
    /* ИСПРАВЛЕНИЕ: Убираем text-decoration и используем только border-bottom */
    text-decoration: none !important;
    border-bottom: 1px solid #171a20 !important;
    font-weight: 500 !important;
    margin-left: 4px !important;
    color: #171a20 !important;
  }
  .iso-brew-slider__indicators {
    display: flex !important;
    margin-right: 0 !important;
    justify-content: center !important;
  }
}
</style>
