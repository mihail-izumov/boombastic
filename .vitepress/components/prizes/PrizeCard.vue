<script setup>
/**
 * PrizeCard — карточка приза
 * 
 * Показывает: emoji, бейджи, название, тикеты, прогресс, кнопки действий.
 * inject: tickets, settings для расчётов.
 */
import { ref, computed, inject } from 'vue'
import { PRIZE_KEYS, visitsEst, fmtNum } from './prizoteka'
import AvailBadge from './AvailBadge.vue'
import PrizeIcons from './PrizeIcons.vue'

const props = defineProps({
  prize:       { type: Object, required: true },
  isCollected: { type: Boolean, default: false },
  inCart:      { type: Boolean, default: false },
  showEmoji:   { type: Boolean, default: false },
  stretchFull: { type: Boolean, default: false },
})

const emit = defineEmits(['collect', 'queue', 'cart'])

const tickets  = inject(PRIZE_KEYS.TICKETS)
const settings = inject(PRIZE_KEYS.SETTINGS)

const hov = ref(false)

const remaining = computed(() => {
  if (tickets.value <= 0) return null
  return props.prize.tickets - tickets.value
})

const canAfford = computed(() => remaining.value !== null && remaining.value <= 0)
const isJackpot = computed(() => props.prize.is_jackpot === true)
const showHit   = computed(() => props.prize.monthly_sold >= settings.hit_threshold)

const progressPct = computed(() => {
  if (tickets.value <= 0) return 0
  return Math.min(100, (tickets.value / props.prize.tickets) * 100)
})

const remainAfford = computed(() => {
  if (!canAfford.value || tickets.value <= 0) return 0
  return tickets.value - props.prize.tickets
})

// Card background
const cardBg = computed(() => {
  if (props.isCollected) return 'linear-gradient(145deg,rgba(20,18,40,0.88),rgba(28,26,55,0.7))'
  if (isJackpot.value)   return 'linear-gradient(145deg,rgba(10,8,28,0.98),rgba(20,16,46,0.96))'
  return 'linear-gradient(145deg,rgba(28,26,62,0.95),rgba(34,32,80,0.9))'
})

const cardBorder = computed(() => {
  if (canAfford.value) return 'rgba(197,249,70,0.58)'
  if (isJackpot.value) return 'rgba(255,214,10,0.42)'
  return 'rgba(74,90,173,0.32)'
})

// Button style helper
function btnStyle(bg, color, border) {
  return {
    padding: '5px 11px',
    borderRadius: '6px',
    border: `1px solid ${border}`,
    background: bg,
    color,
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
    cursor: 'pointer',
    transition: 'all 0.18s',
    whiteSpace: 'nowrap',
    flex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  }
}

const cartBtnStyle = computed(() => {
  if (props.inCart) return btnStyle('#C5F946', '#1a1840', '#C5F946')
  if (canAfford.value) return btnStyle('rgba(197,249,70,0.14)', 'var(--pz-lime)', 'rgba(197,249,70,0.5)')
  return btnStyle('rgba(74,90,173,0.18)', 'var(--pz-tx1)', 'rgba(74,90,173,0.45)')
})
</script>

<template>
  <div
    class="prize-card"
    :class="{
      'prize-card--collected': isCollected,
      'prize-card--jackpot': isJackpot && !isCollected,
      'prize-card--stretch': stretchFull,
    }"
    :style="{
      background: cardBg,
      borderColor: cardBorder,
      transform: hov && !isCollected ? 'translateY(-3px)' : 'none',
      boxShadow: hov && !isCollected ? '0 10px 32px rgba(0,0,0,0.42)' : '0 4px 14px rgba(0,0,0,0.28)',
      opacity: 1,
    }"
    @mouseenter="hov = true"
    @mouseleave="hov = false"
  >
    <!-- Shimmer for jackpot -->
    <div v-if="isJackpot && !isCollected" class="prize-card__shimmer" />

    <!-- Lime top-line for affordable -->
    <div v-if="canAfford && !isCollected" class="prize-card__afford-line" />

    <!-- Top row: emoji + badges -->
    <div class="prize-card__top">
      <span v-if="showEmoji" class="prize-card__emoji">{{ prize.emoji }}</span>
      <div v-if="!isCollected" class="prize-card__badges" :style="{ marginLeft: showEmoji ? 0 : 'auto' }">
        <AvailBadge :status="prize.status" />
        <span v-if="showHit" class="prize-card__hit-badge">Хит</span>
      </div>
    </div>

    <!-- Name -->
    <div
      class="prize-card__name"
      :class="{ 'prize-card__name--collected': isCollected }"
    >
      {{ prize.name }}
    </div>

    <!-- Bottom group (pinned to bottom) -->
    <div class="prize-card__bottom">
      <!-- Tickets -->
      <div class="prize-card__tickets" :class="{ 'prize-card__tickets--collected': isCollected }">
        {{ fmtNum(prize.tickets) }} тик
      </div>

      <!-- Progress -->
      <div v-if="remaining !== null && !isCollected" class="prize-card__progress">
        <div class="prize-card__progress-text">
          <span v-if="canAfford" class="prize-card__can-afford">
            <PrizeIcons name="ui_smile" :size="13" />
            Хватает
          </span>
          <span v-else class="prize-card__need-more">
            ещё {{ fmtNum(remaining) }} тик · {{ visitsEst(remaining, settings.avg_tickets_per_visit) }}
          </span>
        </div>
        <!-- Remainder after taking -->
        <div v-if="canAfford && tickets > 0" class="prize-card__remainder">
          останется {{ fmtNum(remainAfford) }} тик
        </div>
        <!-- Progress bar -->
        <div v-if="!canAfford" class="pz-progress">
          <div class="pz-progress__fill" :style="{ width: progressPct + '%' }" />
        </div>
      </div>

      <!-- Actions -->
      <div v-if="!isCollected" class="prize-card__actions">
        <!-- Available → В корзину -->
        <button
          v-if="prize.status === 'available'"
          :style="cartBtnStyle"
          @click.stop="emit('cart', prize.id)"
        >
          <template v-if="inCart">
            <PrizeIcons name="ui_check" :size="11" />
            Добавлено
          </template>
          <template v-else>
            <PrizeIcons name="ui_plus" :size="11" />
            В корзину
          </template>
        </button>

        <!-- Soon → Узнать первым -->
        <button
          v-if="prize.status === 'soon'"
          :style="btnStyle('rgba(0,212,255,0.1)', 'var(--pz-cyan)', 'rgba(0,212,255,0.4)')"
          @click.stop="emit('queue', prize)"
        >
          Узнать первым
          <PrizeIcons name="ui_arrow_right" :size="11" />
        </button>

        <!-- Was/OOS → Хочу этот приз -->
        <button
          v-if="prize.status === 'oos' || prize.status === 'was'"
          :style="btnStyle('rgba(122,139,168,0.1)', 'var(--pz-tx1)', 'rgba(122,139,168,0.3)')"
          @click.stop="emit('queue', prize)"
        >
          Хочу этот приз
          <PrizeIcons name="ui_arrow_right" :size="11" />
        </button>
      </div>

      <!-- Collected state -->
      <div v-if="isCollected" class="prize-card__collected-label">
        <PrizeIcons name="ui_check" :size="12" />
        ПОЛУЧЕНО
      </div>
    </div>
  </div>
</template>

<style scoped>
.prize-card {
  border: 1px solid;
  border-radius: 12px;
  padding: 14px;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.prize-card--stretch {
  height: 100%;
  box-sizing: border-box;
}
.prize-card__shimmer {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(105deg, transparent 40%, rgba(255,214,10,0.06) 50%, transparent 60%);
  background-size: 200% 100%;
  animation: pz-shimmer 3s linear infinite;
  pointer-events: none;
}
.prize-card__afford-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--pz-lime), transparent);
}
.prize-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.prize-card__emoji {
  font-size: 26px;
  line-height: 1;
  flex-shrink: 0;
}
.prize-card__badges {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
}
.prize-card__hit-badge {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pz-yellow);
  background: rgba(255, 214, 10, 0.11);
  border: 1px solid rgba(255, 214, 10, 0.32);
  border-radius: 4px;
  padding: 2px 8px;
  white-space: nowrap;
  line-height: 1.4;
}
.prize-card__name {
  font-weight: 700;
  font-size: 13px;
  line-height: 1.35;
  color: var(--pz-tx1);
  font-family: 'Inter', sans-serif;
}
.prize-card__name--collected {
  color: #7A8BA8;
}
.prize-card__bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.prize-card__tickets {
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 16px;
  color: var(--pz-yellow);
  text-shadow: 0 0 8px rgba(255, 214, 10, 0.32);
}
.prize-card__tickets--collected {
  color: #7a7a5a;
  text-shadow: none;
}
.prize-card__progress {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.prize-card__progress-text {
  font-size: 11px;
  font-family: 'Inter', sans-serif;
}
.prize-card__can-afford {
  color: var(--pz-green);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}
.prize-card__need-more {
  color: var(--pz-tx2);
}
.prize-card__remainder {
  font-size: 11px;
  font-family: 'Inter', sans-serif;
  color: var(--pz-txm);
}
.prize-card__actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.prize-card__collected-label {
  font-size: 11px;
  color: var(--pz-green);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}
@media (max-width: 768px) {
  .prize-card__name { font-size: 14px; }
  .prize-card__tickets { font-size: 18px; }
  .prize-card__actions button { padding: 8px 14px !important; font-size: 13px !important; min-height: 40px; }
  .prize-card__progress-text { font-size: 12px; }
  .prize-card__remainder { font-size: 12px; }
}
</style>
