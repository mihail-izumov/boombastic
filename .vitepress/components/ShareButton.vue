<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const showShareModal = ref(false)
const showCopyToast = ref(false)
const showCopyTooltip = ref(false)
const showTelegramTooltip = ref(false)

const openShareModal = () => {
  showShareModal.value = true
}

const closeShareModal = () => {
  showShareModal.value = false
  showCopyTooltip.value = false
  showTelegramTooltip.value = false
}

watch(showShareModal, (isOpen) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    closeShareModal()
    showCopyToast.value = true
    setTimeout(() => (showCopyToast.value = false), 3000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

const shareTelegram = () => {
  const text = 'Проверьте новую возможность поддержать Корж'
  const url = window.location.href
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    '_blank'
  )
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && showShareModal.value) closeShareModal()
}

onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <div class="share-only">
    <button class="btn-share" @click="openShareModal">
      Поделиться
      <span class="icon-circle" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v12"/>
          <path d="m17 8-5-5-5 5"/>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        </svg>
      </span>
    </button>

    <!-- МОДАЛКА SHARE -->
    <div v-if="showShareModal" class="modal-overlay blur-bg" @click.self="closeShareModal">
      <div class="modal-card white-theme relative">
        <button class="modal-close-icon dark" @click="closeShareModal" aria-label="Закрыть">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>

        <h3>Поделитесь</h3>
        <p>Пригласите друзей отправить подарок в Корж</p>

        <div class="share-buttons">
          <div
            class="share-btn-circle"
            @click="copyLink"
            @mouseenter="showCopyTooltip = true"
            @mouseleave="showCopyTooltip = false"
            role="button"
            tabindex="0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <div v-if="showCopyTooltip" class="tooltip">Скопировать ссылку</div>
          </div>

          <div
            class="share-btn-circle telegram"
            @click="shareTelegram"
            @mouseenter="showTelegramTooltip = true"
            @mouseleave="showTelegramTooltip = false"
            role="button"
            tabindex="0"
            style="background: #f0f0f0;"
          >
            <div
              class="niftybutton-telegram-black-white"
              style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;color:#000;transition:.3s;opacity:1;padding:18px;pointer-events:none;"
            >
              <svg viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"
                   style="display:block;fill:#000;width:100%;height:100%;" role="img" aria-label="telegram-black-white">
                <title>Telegram social icon</title>
                <path d="M 200.894531 323.863281 L 192.425781 442.988281 C 204.542969 442.988281 209.792969 437.78125 216.085938 431.53125 L 272.894531 377.238281 L 390.613281 463.445312 C 412.203125 475.476562 427.414062 469.140625 433.238281 443.585938 L 510.507812 81.515625 L 510.527344 81.492188 C 517.375 49.578125 498.988281 37.097656 477.953125 44.929688 L 23.765625 218.816406 C -7.230469 230.847656 -6.761719 248.128906 18.496094 255.957031 L 134.613281 292.074219 L 404.332031 123.308594 C 417.023438 114.902344 428.566406 119.550781 419.070312 127.957031 Z M 200.894531 323.863281 " />
              </svg>
            </div>

            <div v-if="showTelegramTooltip" class="tooltip">Отправить в Telegram</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ТОСТ -->
    <Transition name="fade">
      <div v-if="showCopyToast" class="toast-notification">
        <div class="check-circle">✓</div>
        <div>
          <strong>Скопировано в буфер</strong><br />
          Поделитесь ссылкой с друзьями.
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>

.share-only {
  display: inline-block;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}


/* КНОПКА */
.btn-share {
  padding: 16px 32px;
  border-radius: 46px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: 2px solid #424242;
  background: transparent;
  color: #e0e0e0;
}

.btn-share:hover {
  border-color: #616161;
  background: #3a3a3a;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 32px;
  height: 32px;
}

.icon-circle::before {
  content: '';
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: #e0e0e0;
}

.btn-share:hover .icon-circle::before {
  opacity: 1;
}

.icon-circle svg {
  position: relative;
  z-index: 1;
  transition: stroke 0.3s ease;
}

.btn-share:hover .icon-circle svg {
  stroke: #1a1a1a;
}

/* МОДАЛКА */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay.blur-bg {
  backdrop-filter: blur(10px);
  background: rgba(0,0,0,0.6);
}

.modal-card {
  background: #fff;
  color: #000;
  padding: 40px;
  border-radius: 24px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
}

.modal-close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: opacity 0.2s;
  opacity: 0.6;
  color: #000;
}

.modal-close-icon:hover {
  opacity: 1;
}

.modal-card h3 {
  margin-top: 12px;
  font-size: 24px;
  margin-bottom: 16px;
}

.modal-card p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 32px;
  opacity: 0.8;
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.share-btn-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  color: #000;
}

.share-btn-circle:hover {
  transform: scale(1.1);
  background: #e0e0e0;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  margin-bottom: 10px;
}

/* ТОСТ */
.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 16px 24px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  z-index: 2000;
  width: max-content;
  max-width: 90vw;
  text-align: left;
}

.check-circle {
  width: 24px;
  height: 24px;
  background: #fff;
  color: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
