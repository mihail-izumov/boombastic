<template>
  <!-- Модальное окно БЕЗ wrapper -->
  <div 
    v-if="isModalOpen" 
    class="signal2-review-modal-overlay"
    @click="closeModal"
  >
    <div 
      class="signal2-review-modal-content"
      @click.stop
    >
      <div class="signal2-modal-scrollable-content">
        <SignalT9Configurator />
      </div>
      
      <div class="signal2-modal-close-section">
        <!-- Крестик для мобильной версии -->
        <button @click="closeModal" class="signal2-modal-close-icon" aria-label="Закрыть">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        <button @click="closeModal" class="signal2-modal-close-button">Закрыть и вернуться</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SignalT9Configurator from './SignalT9Configurator.vue'

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = 'auto'
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  
  // Регистрируем глобальную функцию для открытия модалки из конфига
  if (typeof window !== 'undefined') {
    window.openSignalModal = openModal
    console.log('✓ window.openSignalModal registered')
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  
  // Очищаем глобальную функцию при размонтировании
  if (typeof window !== 'undefined' && window.openSignalModal === openModal) {
    delete window.openSignalModal
  }
})
</script>

<style scoped>
/* Стили модального окна */
.signal2-review-modal-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh; 
  background: rgba(0, 0, 0, 0.8); 
  backdrop-filter: blur(4px); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  z-index: 9999; 
  padding: 8px; 
  box-sizing: border-box; 
}

.signal2-review-modal-content { 
  background: #1e1e20; 
  border-radius: 16px; 
  width: 650px; 
  height: clamp(85vh, 90vh, 85vh); 
  max-width: 95vw; 
  max-height: clamp(85vh, 90vh, 85vh); 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); 
  box-sizing: border-box; 
  color: white; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
}

.signal2-modal-scrollable-content { 
  flex: 1; 
  overflow-y: auto; 
  padding: 20px 16px 16px 16px; 
}

:deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(p), :deep(span), :deep(label), :deep(.title), :deep(.subtitle), :deep(.description), :deep(.example-text), :deep(.hint-text) { 
  text-align: initial !important; 
  padding-left: 0 !important; 
  padding-right: 0 !important; 
}

:deep(.container), :deep(.content) { 
  padding-left: 0 !important; 
  padding-right: 0 !important; 
  margin-left: 0 !important; 
  margin-right: 0 !important; 
}

:deep(.form-section), :deep(.form-group), :deep(.section-wrapper) { 
  margin-bottom: clamp(10px, 2vw, 10px) !important; 
}

:deep(.card), :deep(.block), :deep(.content-block) { 
  margin-bottom: clamp(8px, 1.6vw, 8px) !important; 
}

.signal2-modal-close-section { 
  flex-shrink: 0; 
  padding: 20px 16px 24px 16px; 
  background: #1e1e20; 
  border-top: 1px solid rgba(255, 255, 255, 0.1); 
  display: flex; 
  justify-content: center; 
}

.signal2-modal-close-button {
  background-color: #272727;
  border: none;
  color: #888;
  padding: 14px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.3s ease, background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: none;
  animation: none;
}

.signal2-modal-close-button:hover {
  background-color: #333333;
  color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  transform: translateY(-2px);
}

/* Базовые стили — крестик скрыт на десктопе */
.signal2-modal-close-icon { display: none; }

@media (max-width: 768px) {
  .signal2-review-modal-overlay { padding: 4px; }
  .signal2-review-modal-content { 
    width: 95vw; 
    height: clamp(85vh, 90vh, 85vh); 
    max-width: 95vw; 
    max-height: clamp(85vh, 90vh, 85vh); 
  }
  .signal2-modal-scrollable-content { padding: 20px 12px 12px 12px; }
  .signal2-modal-close-section { padding: 12px; }
  
  /* Крестик для мобильной версии */
  .signal2-modal-close-icon {
    display: flex !important;
    position: fixed !important;
    top: 2vh !important;
    right: 2.5vw !important;
    width: 44px !important;
    height: 44px !important;
    background: #1a1a1c !important;
    border: none !important;
    border-radius: 8px !important;
    color: #4a4a4c !important;
    cursor: pointer !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.3s ease;
    z-index: 10001 !important;
    backdrop-filter: none !important;
    opacity: 1 !important;
  }

  .signal2-modal-close-icon:hover {
    background: #252527 !important;
    color: #6a6a6c !important;
    transform: scale(1.05) !important;
  }

  .signal2-modal-close-icon svg {
    stroke-width: 2.5 !important;
  }

  /* Скрываем текстовую кнопку на мобильных */
  .signal2-modal-close-button {
    display: none;
  }
  
  /* Убираем фон секции */
  .signal2-modal-close-section {
    padding: 0;
    border-top: none;
    background: transparent;
  }
}

@media screen and (max-height: 700px) {
  .signal2-review-modal-content { height: 80vh !important; max-height: 80vh !important; }
}

@media screen and (max-height: 600px) {
  .signal2-review-modal-content { height: 75vh !important; max-height: 75vh !important; }
}
</style>
