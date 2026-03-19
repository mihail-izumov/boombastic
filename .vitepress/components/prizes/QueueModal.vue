<script setup>
/**
 * QueueModal — модалка «Хочу этот приз» / «Первым узнать»
 * Открывает Google Form для email-подписки.
 */
import { ref, computed, inject } from 'vue'
import { PRIZE_KEYS } from './prizoteka'

const props = defineProps({
  prize: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const settings = inject(PRIZE_KEYS.SETTINGS)

const email = ref('')
const sent = ref(false)

const isArchive = computed(() => props.prize.status === 'oos' || props.prize.status === 'was')
const headline = computed(() => isArchive.value ? 'Хочу этот приз' : 'Первым узнать')
const subtext = computed(() => isArchive.value
  ? 'Сейчас нет в витрине — оставь email, сообщим когда он появится.'
  : 'Скоро в витрине — оставь email, сообщим первым как только появится.'
)

function handleSend() {
  if (!email.value.trim()) return
  const url = settings.queue_form_url || ''
  window.open(`${url}?entry.EMAIL=${encodeURIComponent(email.value)}&entry.PRIZE=${encodeURIComponent(props.prize.name)}`, '_blank')
  sent.value = true
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
        <button class="queue-close" @click="emit('close')">×</button>
        <!-- Emoji -->
        <div style="font-size: 36px; margin-bottom: 12px;">{{ prize.emoji }}</div>
        <!-- Headline -->
        <div class="queue-headline">{{ headline }}</div>
        <!-- Subtext -->
        <div class="queue-subtext">
          <strong style="color: var(--pz-tx1);">{{ prize.name }}</strong> — {{ subtext }}
        </div>
        <!-- Queue count -->
        <div v-if="prize.queue > 0" class="queue-waiting">
          Уже ждут: {{ prize.queue }} чел.
        </div>

        <!-- Form or success -->
        <template v-if="!sent">
          <input
            v-model="email"
            type="email"
            placeholder="email@example.com"
            class="queue-input"
          />
          <button
            class="queue-send"
            :class="{ 'queue-send--active': email.trim() }"
            :disabled="!email.trim()"
            @click="handleSend"
          >Сообщите мне →</button>
          <div class="queue-note">Откроется Google Forms · данные только у нас</div>
        </template>
        <template v-else>
          <div class="queue-success">
            <div style="font-size: 28px; margin-bottom: 7px;">✓</div>
            <div style="color: var(--pz-green); font-family: 'Inter',sans-serif; font-weight: 700;">Записали!</div>
            <div style="font-size: 12px; color: var(--pz-tx2); margin-top: 5px;">Напишем на email когда приз появится</div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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
  background: var(--pz-night);
  border: 1px solid rgba(255, 214, 10, 0.3);
  border-radius: 16px;
  padding: 28px 24px;
  width: calc(100% - 40px);
  max-width: 420px;
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
  top: 14px; right: 16px;
  background: transparent;
  border: none;
  color: var(--pz-txm);
  cursor: pointer;
  font-size: 20px;
}
.queue-headline {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: var(--pz-tx1);
  margin-bottom: 8px;
}
.queue-subtext {
  font-size: 13px;
  color: var(--pz-tx2);
  margin-bottom: 14px;
  line-height: 1.55;
}
.queue-waiting {
  font-size: 12px;
  color: var(--pz-yellow);
  font-family: 'Inter', sans-serif;
  margin-bottom: 14px;
}
.queue-input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 12px;
  background: rgba(74, 90, 173, 0.15);
  border: 1px solid rgba(0, 212, 255, 0.28);
  border-radius: 8px;
  color: var(--pz-tx1);
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
}
.queue-send {
  width: 100%;
  padding: 13px;
  border-radius: 10px;
  background: rgba(74, 90, 173, 0.18);
  border: 1px solid rgba(74, 90, 173, 0.3);
  color: var(--pz-txm);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  cursor: default;
  transition: all 0.2s;
}
.queue-send--active {
  background: linear-gradient(135deg, rgba(197,249,70,0.22), rgba(74,90,173,0.22));
  border-color: rgba(197,249,70,0.5);
  color: var(--pz-lime);
  cursor: pointer;
}
.queue-note {
  font-size: 11px;
  color: var(--pz-txm);
  text-align: center;
  margin-top: 9px;
}
.queue-success {
  text-align: center;
  padding: 16px;
  background: rgba(0, 255, 136, 0.06);
  border: 1px solid rgba(0, 255, 136, 0.22);
  border-radius: 10px;
}
</style>
