<script setup>
/**
 * TabDream — вкладка «Джекпот»
 * 
 * Показывает призы с is_jackpot=true.
 * Карточки с анимацией float, крупнее обычных.
 * Фильтры: статус, диапазон тикетов, сортировка.
 */
import { ref, computed, inject } from 'vue'
import { PRIZE_KEYS, fmtNum, matchesStatus as matchStatus, matchesRange as matchRange } from './prizoteka'
import PrizeIcons from './PrizeIcons.vue'
import StatusDropdown from './StatusDropdown.vue'
import TicketRangeDropdown from './TicketRangeDropdown.vue'
import SortChips from './SortChips.vue'
import ZoneToggles from './ZoneToggles.vue'
import PrizeCard from './PrizeCard.vue'

const tickets   = inject(PRIZE_KEYS.TICKETS)
const collected = inject(PRIZE_KEYS.COLLECTED)
const prizes    = inject(PRIZE_KEYS.PRIZES)
const cart      = inject(PRIZE_KEYS.CART)
const handleCart = inject(PRIZE_KEYS.HANDLE_CART)
const setQueue   = inject(PRIZE_KEYS.SET_QUEUE_PRIZE)
const handleCollect = inject(PRIZE_KEYS.HANDLE_COLLECT)

// Local state
const statusFilter = ref('available')
const ticketRange  = ref('all')
const sort         = ref('tickets-desc')
const zone         = ref('all')

function setStatusAndReset(v) {
  statusFilter.value = v
  zone.value = 'all'
}

// "My tickets" toggle
function toggleMyTickets() {
  ticketRange.value = ticketRange.value === 'my-tickets' ? 'all' : 'my-tickets'
}

// Filtering
const base = computed(() =>
  prizes
    .filter(p => p.is_jackpot === true)
    .filter(p => !collected.value.includes(p.id))
    .filter(p => matchStatus(p, statusFilter.value))
    .filter(p => matchRange(p, ticketRange.value, tickets.value))
    .sort((a, b) => sort.value === 'tickets-desc' ? b.tickets - a.tickets : a.tickets - b.tickets)
)

const canNow = computed(() =>
  base.value.filter(p => tickets.value > 0 && p.tickets <= tickets.value)
)
const needSave = computed(() =>
  base.value.filter(p => !(tickets.value > 0 && p.tickets <= tickets.value))
)
const hasTickets = computed(() => tickets.value > 0)

// Items to display based on zone
const displayItems = computed(() => {
  if (zone.value === 'can') return canNow.value
  if (zone.value === 'save') return needSave.value
  return base.value
})

const sortOptions = [
  { id: 'tickets-asc',  label: 'Дешевле', icon: '↑' },
  { id: 'tickets-desc', label: 'Дороже',  icon: '↓' },
]
</script>

<template>
  <div>
    <!-- Filter panel -->
    <div class="pz-filter-panel">
      <div class="pz-filter-panel__title">
        <h2>Джекпот</h2>
      </div>

      <div class="pz-filter-row" :style="{ marginBottom: hasTickets ? '10px' : 0 }">
        <div style="display: flex; gap: 5px; align-items: center; flex-wrap: wrap;">
          <StatusDropdown v-model="statusFilter" @update:model-value="setStatusAndReset" />
          <TicketRangeDropdown v-model="ticketRange" />
          <button
            v-if="tickets > 0"
            class="pz-my-tickets-btn"
            :class="{ 'pz-my-tickets-btn--active': ticketRange === 'my-tickets' }"
            @click="toggleMyTickets"
          >
            <PrizeIcons name="ui_ticket" :size="14" />
            До {{ fmtNum(tickets) }}
          </button>
        </div>
        <SortChips v-model="sort" :options="sortOptions" />
      </div>

      <ZoneToggles
        v-if="hasTickets"
        v-model="zone"
        :tickets="tickets"
        :can-count="canNow.length"
        :save-count="needSave.length"
      />
    </div>

    <!-- Cards grid with float animation -->
    <div class="dream-grid">
      <div
        v-for="p in displayItems"
        :key="p.id"
        class="dream-card-wrap"
      >
        <PrizeCard
          :prize="p"
          :is-collected="collected.includes(p.id)"
          :in-cart="cart.includes(p.id)"
          :show-emoji="true"
          :stretch-full="true"
          @cart="handleCart"
          @queue="setQueue"
          @collect="handleCollect"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="base.length === 0" style="text-align: center; padding: 40px 20px;">
      <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.4;">💎</div>
      <div style="color: var(--pz-tx1); font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; margin-bottom: 6px;">
        Ничего не нашлось
      </div>
      <div style="color: var(--pz-tx2); font-size: 13px; font-family: 'Inter',sans-serif;">
        Попробуй изменить фильтры
      </div>
    </div>
  </div>
</template>

<style scoped>
.dream-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
  align-items: stretch;
}
.dream-card-wrap {
  animation: pz-float 4s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.pz-my-tickets-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid rgba(255, 214, 10, 0.25);
  background: transparent;
  color: #7a6a1a;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
}
.pz-my-tickets-btn--active {
  border-color: rgba(255, 214, 10, 0.7);
  background: rgba(255, 214, 10, 0.15);
  color: #FFD60A;
}
</style>
