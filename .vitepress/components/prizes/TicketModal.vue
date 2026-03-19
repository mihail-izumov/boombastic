<script setup>
/**
 * TicketModal — модалка ввода тикетов + история визитов
 */
import { ref, computed, inject, watch } from 'vue'
import { PRIZE_KEYS, fmtNum } from './prizoteka'
import PrizeIcons from './PrizeIcons.vue'

const emit = defineEmits(['close'])

const tickets       = inject(PRIZE_KEYS.TICKETS)
const ticketHistory = inject(PRIZE_KEYS.TICKET_HISTORY)
const commitTickets = inject(PRIZE_KEYS.COMMIT_TICKETS)

const tmVal          = ref(tickets.value > 0 ? String(tickets.value) : '')
const tmFocused      = ref(false)
const tmErr          = ref(false)
const tmConfirmReset = ref(false)
const tmConfirmZero  = ref(false)
const tmSuccess      = ref(false)

function handleChange(v) {
  tmVal.value = v.replace(/\D/g, '')
  tmErr.value = false
}

function handleConfirm() {
  const n = parseInt(tmVal.value, 10)
  if (isNaN(n)) return
  if (n === 0 && tickets.value > 0) { tmConfirmZero.value = true; return }
  if (n === 0 && tickets.value === 0) return
  if (tickets.value > 0 && n < tickets.value) { tmErr.value = true; return }
  if (n === tickets.value && tickets.value > 0) return
  doCommit(n)
}

function doCommit(n) {
  commitTickets(n)
  tmConfirmZero.value = false
  tmSuccess.value = true
  setTimeout(() => { tmSuccess.value = false }, 700)
}

function handleCancel() {
  tmVal.value = tickets.value > 0 ? String(tickets.value) : ''
  tmErr.value = false
  tmConfirmZero.value = false
}

function handleKeyDown(e) {
  if (e.key === 'Enter') handleConfirm()
}

function handleClearHistory() {
  tmVal.value = ''
  tickets.value = 0
  tmErr.value = false
  ticketHistory.value = []
  tmConfirmReset.value = false
  emit('close')
}

// History reversed (newest first)
const historyRev = computed(() => {
  const h = ticketHistory.value
  return [...h].reverse().map((entry, i) => ({
    ...entry,
    isNewest: i === 0,
    idx: h.length - 1 - i,
  }))
})
</script>

<template>
  <Teleport to="body">
    <div class="tm-overlay vp-raw" @click="emit('close')">
    <div class="tm-backdrop" />
    <div class="tm-modal" @click.stop>
      <!-- Label -->
      <div class="tm-label">введи количество тикетов</div>

      <!-- Big input -->
      <input
        ref="inputRef"
        type="text"
        inputmode="numeric"
        :value="tmVal"
        placeholder="0"
        class="tm-input"
        :class="{
          'tm-input--err': tmErr,
          'tm-input--focused': tmFocused,
        }"
        @input="handleChange($event.target.value)"
        @focus="tmFocused = true"
        @blur="tmFocused = false"
        @keydown="handleKeyDown"
      />
      <div v-if="tmErr" class="tm-err">
        нельзя вводить меньше текущих {{ fmtNum(tickets) }}
      </div>

      <!-- Two buttons -->
      <div class="tm-buttons" :style="{ marginTop: tmErr ? '4px' : '14px' }">
        <button class="tm-btn-cancel" @click="handleCancel">Отменить</button>
        <button
          class="tm-btn-confirm"
          :class="{
            'tm-btn-confirm--active': !!tmVal,
            'tm-btn-confirm--success': tmSuccess,
          }"
          @click="handleConfirm"
        >
          <span>{{ tmSuccess ? '✓ Сохранено' : 'Ввод' }}</span>
          <span class="tm-enter-key" :class="{ 'tm-enter-key--active': !!tmVal }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" :stroke="tmVal ? '#0a0a0a' : 'rgba(74,90,173,0.5)'" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 4v7a4 4 0 0 1-4 4H4" /><path d="m9 10-5 5 5 5" />
            </svg>
          </span>
        </button>
      </div>

      <!-- Zero confirm -->
      <div v-if="tmConfirmZero" class="tm-zero-confirm pz-fade-up">
        <div class="tm-zero-title">Обнулить все тикеты?</div>
        <div class="tm-zero-btns">
          <button class="tm-zero-cancel" @click="tmConfirmZero = false">Отмена</button>
          <button class="tm-zero-ok" @click="doCommit(0)">Да, обнулить</button>
        </div>
      </div>

      <!-- History -->
      <div v-if="historyRev.length > 0" class="tm-history">
        <div class="tm-history-header">
          <div>
            <div class="tm-history-title">История визитов</div>
            <div class="tm-history-sub">за последние 30 дней</div>
          </div>
          <button
            class="tm-history-trash"
            :class="{ 'tm-history-trash--active': tmConfirmReset }"
            @click="tmConfirmReset = !tmConfirmReset"
          >
            <PrizeIcons name="ui_trash" :size="16" />
          </button>
        </div>

        <!-- Confirm clear history -->
        <div v-if="tmConfirmReset" class="tm-reset-confirm pz-fade-up">
          <div class="tm-reset-title">Удалить все тикеты и историю?</div>
          <div class="tm-reset-btns">
            <button class="tm-reset-cancel" @click="tmConfirmReset = false">Отмена</button>
            <button class="tm-reset-ok" @click="handleClearHistory">Да, удалить</button>
          </div>
        </div>

        <!-- Timeline -->
        <div class="tm-timeline">
          <div v-for="(h, i) in historyRev" :key="i" class="tm-timeline-item">
            <div v-if="i > 0" class="tm-timeline-line" />
            <div
              class="tm-timeline-entry"
              :class="{
                'tm-timeline-entry--newest': h.isNewest,
                'tm-timeline-entry--up': !h.isNewest && h.diff > 0,
              }"
            >
              <div class="tm-timeline-val" :class="{ 'tm-timeline-val--newest': h.isNewest }">
                {{ fmtNum(h.value) }}
              </div>
              <div
                class="tm-timeline-diff"
                :class="{
                  'tm-timeline-diff--newest': h.isNewest,
                  'tm-timeline-diff--up': !h.isNewest && h.diff > 0,
                }"
              >
                {{ h.idx === 0 ? 'старт' : h.diff > 0 ? '+' + fmtNum(h.diff) : '—' }}
              </div>
              <div class="tm-timeline-date">{{ h.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close button -->
      <button class="tm-close-btn" @click="emit('close')">Закрыть</button>
    </div>
  </div>
  </Teleport>
</template>

<style scoped>
.tm-overlay {
  position: fixed;
  inset: 0;
  z-index: 400;
}
.tm-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(14px);
}
.tm-modal {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: min(92vw, 380px);
  background: linear-gradient(180deg, #161430 0%, #0D0B28 100%);
  border: 1px solid rgba(255, 214, 10, 0.28);
  border-radius: 20px;
  padding: 20px 24px 24px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.65), 0 0 40px rgba(255,214,10,0.08);
  animation: pz-modalIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 90vh;
  overflow-y: auto;
}
.tm-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: var(--pz-txm);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
  text-align: center;
}
.tm-input {
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background: rgba(74, 90, 173, 0.12);
  border: 2px solid rgba(255, 214, 10, 0.3);
  border-radius: 12px;
  padding: 16px 12px;
  color: var(--pz-yellow);
  font-family: 'Space Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  outline: none;
  transition: border-color 0.15s, color 0.15s;
  margin-bottom: 6px;
}
.tm-input--focused {
  border-color: rgba(255, 214, 10, 0.8);
  box-shadow: 0 0 20px rgba(255, 214, 10, 0.15);
}
.tm-input--err {
  border-color: rgba(255, 107, 0, 0.8);
  color: var(--pz-orange);
}
.tm-err {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: var(--pz-orange);
  text-align: center;
  margin-bottom: 8px;
}
.tm-buttons {
  display: flex;
  gap: 10px;
}
.tm-btn-cancel {
  flex: 1;
  padding: 15px 0;
  border-radius: 12px;
  background: rgba(74, 90, 173, 0.15);
  border: 1px solid rgba(74, 90, 173, 0.35);
  color: var(--pz-tx2);
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.tm-btn-cancel:hover { background: rgba(74, 90, 173, 0.25); }
.tm-btn-confirm {
  flex: 1;
  padding: 15px 0;
  border-radius: 12px;
  background: rgba(74, 90, 173, 0.1);
  border: 2px solid rgba(74, 90, 173, 0.2);
  color: var(--pz-txm);
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 900;
  cursor: default;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.tm-btn-confirm--active {
  background: linear-gradient(135deg, #FFD60A, #FF9500);
  border-color: rgba(255, 214, 10, 0.9);
  color: #0a0a0a;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 214, 10, 0.4);
}
.tm-btn-confirm--success {
  background: linear-gradient(135deg, #00FF88, #00CC66);
  border-color: rgba(0, 255, 136, 0.9);
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.5);
  color: #0a0a0a;
}
.tm-enter-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid rgba(74, 90, 173, 0.3);
  background: rgba(74, 90, 173, 0.08);
  flex-shrink: 0;
}
.tm-enter-key--active {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.12);
}
/* Zero confirm */
.tm-zero-confirm {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(255, 107, 0, 0.08);
  border: 1px solid rgba(255, 107, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tm-zero-title {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--pz-orange);
}
.tm-zero-btns { display: flex; gap: 8px; }
.tm-zero-cancel, .tm-zero-ok {
  flex: 1;
  padding: 10px 0;
  border-radius: 9px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}
.tm-zero-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--pz-tx2);
  font-weight: 600;
}
.tm-zero-ok {
  background: rgba(255, 107, 0, 0.18);
  border: 1px solid rgba(255, 107, 0, 0.55);
  color: var(--pz-orange);
  font-weight: 700;
}
/* History */
.tm-history { margin-top: 22px; }
.tm-history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.tm-history-header > div:first-child { flex: 1; }
.tm-history-title {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: var(--pz-tx2);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.tm-history-sub {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: var(--pz-txm);
  margin-top: 1px;
}
.tm-history-trash {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 5px 7px;
  cursor: pointer;
  color: rgba(255, 255, 255, 1);
  border-radius: 7px;
  transition: all 0.18s;
  line-height: 0;
  flex-shrink: 0;
}
.tm-history-trash--active {
  background: rgba(220, 38, 38, 0.18);
  border-color: rgba(220, 38, 38, 0.55);
  color: rgba(255, 80, 80, 0.95);
}
.tm-reset-confirm {
  margin-bottom: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(220, 38, 38, 0.10);
  border: 1px solid rgba(220, 38, 38, 0.35);
}
.tm-reset-title {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 120, 120, 0.9);
  margin-bottom: 10px;
  font-weight: 600;
}
.tm-reset-btns { display: flex; gap: 8px; }
.tm-reset-cancel, .tm-reset-ok {
  flex: 1;
  padding: 9px 0;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}
.tm-reset-cancel {
  background: rgba(74, 90, 173, 0.15);
  border: 1px solid rgba(74, 90, 173, 0.3);
  color: var(--pz-tx2);
  font-weight: 600;
}
.tm-reset-ok {
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.55);
  color: rgba(255, 100, 100, 1);
  font-weight: 700;
}
/* Timeline */
.tm-timeline {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  padding-bottom: 4px;
}
.tm-timeline-item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.tm-timeline-line {
  width: 18px;
  height: 1px;
  background: rgba(255, 214, 10, 0.18);
  flex-shrink: 0;
}
.tm-timeline-entry {
  background: rgba(74, 90, 173, 0.1);
  border: 1px solid rgba(74, 90, 173, 0.2);
  border-radius: 8px;
  padding: 7px 11px;
  text-align: center;
  flex-shrink: 0;
}
.tm-timeline-entry--newest {
  background: rgba(255, 214, 10, 0.08);
  border-color: rgba(255, 214, 10, 0.4);
}
.tm-timeline-entry--up {
  background: rgba(0, 255, 136, 0.06);
  border-color: rgba(0, 255, 136, 0.22);
}
.tm-timeline-val {
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--pz-tx2);
  line-height: 1;
}
.tm-timeline-val--newest { color: var(--pz-yellow); }
.tm-timeline-diff {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  margin-top: 2px;
  color: var(--pz-txm);
}
.tm-timeline-diff--newest { color: var(--pz-yellow); }
.tm-timeline-diff--up { color: var(--pz-green); }
.tm-timeline-date {
  font-family: 'Space Mono', monospace;
  font-size: 8px;
  color: var(--pz-txm);
  margin-top: 1px;
}
/* Close */
.tm-close-btn {
  width: 100%;
  padding: 15px 0;
  border-radius: 12px;
  margin-top: 8px;
  background: rgba(74, 90, 173, 0.55);
  border: 2px solid rgba(74, 90, 173, 0.85);
  color: var(--pz-tx1);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 16px rgba(74, 90, 173, 0.3);
  transition: all 0.15s;
}
</style>
