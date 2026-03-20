<script setup>
/**
 * QueueModal — модалка «Скоро в призотеке»
 * Отправляет email + приз в Google Sheets через Apps Script.
 */
import { ref, computed, inject } from 'vue'
import { PRIZE_KEYS } from './prizoteka'

const props = defineProps({
  prize: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const settings = inject(PRIZE_KEYS.SETTINGS)
const queued = inject(PRIZE_KEYS.QUEUED)

const email = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref(false)

const isArchive = computed(() => props.prize.status === 'oos' || props.prize.status === 'was')
const subtext = computed(() => isArchive.value
  ? 'Сейчас нет в призотеке — оставь email и мы сообщим когда появится.'
  : 'Оставь email и мы сообщим первым, когда появится в призотеке.'
)

async function handleSend() {
  const trimmed = email.value.trim()
  if (!trimmed) return

  const encoded = settings.queue_form_url
  if (!encoded) {
    error.value = true
    return
  }
  const url = atob(encoded)

  sending.value = true
  error.value = false

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: trimmed,
        prize: props.prize.name,
        tickets: props.prize.tickets || 0,
        status: props.prize.status,
        park: settings.park_id || 'piterlend',
      }),
    })
    // no-cors always returns opaque response, so we assume success
    sent.value = true
    if (!queued.value.includes(props.prize.id)) {
      queued.value = [...queued.value, props.prize.id]
    }
  } catch (err) {
    error.value = true
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="queue-overlay vp-raw" @click="emit('close')">
      <div class="queue-backdrop" />
      <div class="queue-modal" @click.stop>
        <!-- Shimmer -->
        <div class="queue-shimmer" />
        <!-- Close -->
        <button class="queue-close" @click="emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <!-- Topic -->
        <div class="queue-topic">Скоро в призотеке</div>
        <!-- Emoji -->
        <div style="font-size: 44px; margin-bottom: 14px; text-align: center;">{{ prize.emoji }}</div>
        <!-- Prize name as headline -->
        <div class="queue-headline">{{ prize.name }}</div>
        <!-- Subtext -->
        <div class="queue-subtext">{{ subtext }}</div>
        <!-- Queue count -->
        <div v-if="prize.queue > 0" class="queue-waiting">
          Уже ждут: {{ prize.queue }} чел.
        </div>

        <!-- Form, sending, error, or success -->
        <template v-if="!sent">
          <input
            v-model="email"
            type="email"
            placeholder="email@example.com"
            class="queue-input"
            :disabled="sending"
            @keydown.enter="handleSend"
          />
          <button
            class="queue-send"
            :class="{ 'queue-send--active': email.trim() && !sending }"
            :disabled="!email.trim() || sending"
            @click="handleSend"
          >{{ sending ? 'Отправляю...' : 'Сообщите мне →' }}</button>
          <div v-if="error" style="text-align:center;margin-top:10px;font-size:13px;color:#FF6B00;font-family:'Inter',sans-serif;">
            Не удалось отправить. Попробуй ещё раз.
          </div>
          <div class="queue-note">
            Продолжая, я даю согласие с <a href="/terms" target="_blank" class="queue-note-link">Правилами обработки персональных данных</a> и <a href="/terms" target="_blank" class="queue-note-link">Правилами посещения</a>
          </div>
        </template>
        <template v-else>
          <div class="queue-success">
            <div style="margin-bottom: 8px; color: #00FF88;">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
            </div>
            <div style="color: #00FF88; font-family: 'Inter',sans-serif; font-weight: 700; font-size: 18px;">Записали!</div>
            <div style="font-size: 14px; color: #7A8BA8; margin-top: 6px;">Сообщим, когда приз появится в парке</div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style>
.queue-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1000;
}
.queue-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(10px);
}
.queue-modal {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background: #0D1421;
  border: 1px solid rgba(255, 214, 10, 0.3);
  border-radius: 16px;
  padding: 32px 28px;
  width: calc(100% - 40px);
  max-width: 420px;
  text-align: center;
  animation: pz-modalIn 0.28s ease-out forwards;
}
.queue-shimmer {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(105deg, transparent 40%, rgba(255,214,10,0.04) 50%, transparent 60%);
  background-size: 200% 100%;
  animation: pz-shimmer 3s linear infinite;
  pointer-events: none;
}
.queue-close {
  position: absolute;
  top: 10px; right: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.queue-topic {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.36);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 18px;
}
.queue-headline {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: #F0F4FF;
  margin-bottom: 10px;
}
.queue-subtext {
  font-size: 15px;
  color: #7A8BA8;
  margin-bottom: 18px;
  line-height: 1.55;
}
.queue-waiting {
  font-size: 14px;
  color: #FFD60A;
  font-family: 'Inter', sans-serif;
  margin-bottom: 16px;
}
.queue-input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 14px;
  background: rgba(74, 90, 173, 0.15);
  border: 1px solid rgba(0, 212, 255, 0.28);
  border-radius: 10px;
  color: #F0F4FF;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  text-align: center;
}
.queue-send {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  background: rgba(74, 90, 173, 0.18);
  border: 1px solid rgba(74, 90, 173, 0.3);
  color: rgba(255,255,255,0.45);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: default;
  transition: all 0.2s;
}
.queue-send--active {
  background: linear-gradient(135deg, rgba(197,249,70,0.22), rgba(74,90,173,0.22));
  border-color: rgba(197,249,70,0.5);
  color: #C5F946;
  cursor: pointer;
}
.queue-note {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  text-align: center;
  margin-top: 14px;
  line-height: 1.5;
}
.queue-note-link {
  color: rgba(255,255,255,0.45) !important;
  text-decoration: underline !important;
  text-decoration-color: rgba(255,255,255,0.2) !important;
  border-bottom: none !important;
  transition: color 0.2s;
}
.queue-note-link:hover {
  color: #C5F946 !important;
  text-decoration-color: rgba(197,249,70,0.4) !important;
}
.queue-success {
  text-align: center;
  padding: 16px;
  background: rgba(0, 255, 136, 0.06);
  border: 1px solid rgba(0, 255, 136, 0.22);
  border-radius: 10px;
}
</style>
