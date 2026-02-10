<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
const notifications = [
  { 
    text: '<strong>Сигнал для Фитнеса.</strong> Гид по экстра-удержанию клиентов.', 
    hasButton: true,
    buttonText: 'Читать',
    buttonUrl: '/pro/guide/fitness'
  },
    { 
    text: 'Перехват 94% проблем до того, как они попадают в Яндекс.', 
    hasButton: true,
    buttonText: 'Сигнал Диалоги',
    buttonUrl: '/pro/dialogs'
  },
  { 
    text: 'Ваш Сигнал. <strong>Не коробка, а конструктор.</strong>', 
    hasButton: true, 
    buttonText: 'Настроить Сейчас',
    buttonUrl: '/pro/reserve'
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
  // Перезапуск таймера, чтобы избежать немедленного переключения
  clearInterval(timer)
  startTimer()
}
const openLink = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
const startTimer = () => {
  timer = setInterval(nextNotification, 5000)
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
      <!-- Transition теперь снова оборачивает весь блок, который меняется -->
      <transition name="iso-brew-fade" mode="out-in">
        <div class="iso-brew-slider__wrapper" :key="currentIndex">
          <p class="iso-brew-slider__text">
  <span v-html="currentNotification.text"></span>
  <!-- Ссылка для мобильной версии -->
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

          <!-- Кнопка для десктопной версии -->
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
/* ВСЕ СТИЛИ ПОЛНОСТЬЮ ИЗОЛИРОВАНЫ С УНИКАЛЬНЫМИ КЛАССАМИ И !important */
.iso-brew-slider {
  background-color: #1a2e29 !important;
  background-image: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.35) 0%, transparent 70%) !important;
  color: #fff !important;
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
  /* ДОБАВЛЯЕМ СКРУГЛЕНИЯ В САМ КОМПОНЕНТ */
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  min-height: 44px !important; /* Предотвращает прыжки */
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
  color: #fff !important;
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
  /* Контрастный черный фон */
  background-color: #000 !important; 
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
  transition: none !important;
  flex-shrink: 0; /* Предотвращает сжатие кнопки */
}
/* Убран ховер */
.iso-brew-slider__button:hover {
  background-color: #000 !important;
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
  background-color: rgba(255, 255, 255, 0.4) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  padding: 0 !important;
}
.iso-brew-slider__indicator:hover {
  background-color: rgba(255, 255, 255, 0.6) !important;
}
.iso-brew-slider__indicator.active {
  background-color: #fff !important;
}
/* Fade анимация */
.iso-brew-fade-enter-active, 
.iso-brew-fade-leave-active { 
  /* Увеличена продолжительность для большей плавности */
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
    border-radius: 8px !important; /* Больше скругления на мобильных */
    min-height: 60px !important; /* Больше высота на мобильных */
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
    /* ИСПРАВЛЕНИЕ: Замена text-decoration на border-bottom */
    text-decoration: none !important;
    border-bottom: 1px solid #fff !important;
    font-weight: 500 !important;
    margin-left: 4px !important;
    color: #fff !important;
  }
  .iso-brew-slider__indicators {
    display: flex !important;
    margin-right: 0 !important;
    justify-content: center !important;
  }
}
</style>
