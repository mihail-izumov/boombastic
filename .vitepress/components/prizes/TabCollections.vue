<script setup>
/**
 * TabCollections — вкладка «Коллекции»
 * 
 * Показывает призы по франшизам (коллекциям).
 * Фильтр по коллекции (CollectionChips), статус, тикеты, сортировка.
 * Секция «В коллекции» для собранных призов.
 */
import { ref, computed, inject } from 'vue'
import { PRIZE_KEYS, fmtNum, matchesStatus as matchStatus, matchesRange as matchRange, sortPrizes } from './prizoteka'
import PrizeIcons from './PrizeIcons.vue'
import CollectionChips from './CollectionChips.vue'
import StatusDropdown from './StatusDropdown.vue'
import TicketRangeDropdown from './TicketRangeDropdown.vue'
import SortChips from './SortChips.vue'
import ZoneToggles from './ZoneToggles.vue'
import ZoneHeader from './ZoneHeader.vue'
import PrizeGrid from './PrizeGrid.vue'

const tickets     = inject(PRIZE_KEYS.TICKETS)
const collected   = inject(PRIZE_KEYS.COLLECTED)
const prizes      = inject(PRIZE_KEYS.PRIZES)
const collections = inject(PRIZE_KEYS.COLLECTIONS)
const registry    = inject(PRIZE_KEYS.REGISTRY)
const allColPrizeIds = inject(PRIZE_KEYS.ALL_COLLECTION_PRIZES)
const prizeById   = inject(PRIZE_KEYS.PRIZE_BY_ID)

// Local state
const activeCol    = ref('all')
const sort         = ref('tickets-asc')
const statusFilter = ref('available')
const ticketRange  = ref('all')
const zone         = ref('all')

function setStatusAndReset(v) {
  statusFilter.value = v
  zone.value = 'all'
}

function setActiveCollection(id) {
  activeCol.value = id
  zone.value = 'all'
}

// Prizes for the active collection
const colPrizes = computed(() => {
  if (activeCol.value === 'all') {
    return allColPrizeIds.value.map(id => prizeById(id)).filter(Boolean)
  }
  const ids = collections[activeCol.value] || []
  return ids.map(id => prizeById(id)).filter(Boolean)
})

// Title
const title = computed(() => {
  if (activeCol.value === 'all') return 'Все коллекции'
  const r = registry.find(r => r.id === activeCol.value)
  return r?.name || 'Коллекция'
})

// Filtered + sorted
const base = computed(() =>
  colPrizes.value
    .filter(p => !collected.value.includes(p.id))
    .filter(p => matchStatus(p, statusFilter.value))
    .filter(p => matchRange(p, ticketRange.value, tickets.value))
    .sort((a, b) => sortPrizes(a, b, sort.value))
)

const canNow = computed(() =>
  base.value.filter(p => tickets.value > 0 && p.tickets <= tickets.value)
)
const needSave = computed(() =>
  base.value.filter(p => !(tickets.value > 0 && p.tickets <= tickets.value))
)
const done = computed(() =>
  colPrizes.value.filter(p => collected.value.includes(p.id))
)
const hasTickets = computed(() => tickets.value > 0)

// Count "soon" prizes in current collection (not collected)
const soonCount = computed(() =>
  colPrizes.value.filter(p => !collected.value.includes(p.id) && p.status === 'soon').length
)

// Is collection fully collected?
const isFullyCollected = computed(() => {
  const uncollected = colPrizes.value.filter(
    p => !collected.value.includes(p.id) && (p.status === 'available' || p.status === 'soon')
  )
  return uncollected.length === 0 && done.value.length > 0
})

// "My tickets" toggle
function toggleMyTickets() {
  ticketRange.value = ticketRange.value === 'my-tickets' ? 'all' : 'my-tickets'
}

const sortOptions = [
  { id: 'tickets-asc',  label: 'Дешевле', icon: '↑' },
  { id: 'tickets-desc', label: 'Дороже',  icon: '↓' },
]

// Zone header label when no tickets
function zoneLabel() {
  if (statusFilter.value === 'soon') return 'Скоро появятся'
  if (statusFilter.value === 'archive') return 'Архив'
  return 'Доступно сегодня'
}
</script>

<template>
  <div>
    <!-- Collection chips -->
    <CollectionChips v-model="activeCol" @update:model-value="setActiveCollection" />

    <!-- Filter panel -->
    <div class="pz-filter-panel">
      <div class="pz-filter-panel__title">
        <h2>{{ title }}</h2>
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
        v-if="hasTickets && (canNow.length > 0 || needSave.length > 0)"
        v-model="zone"
        :tickets="tickets"
        :can-count="canNow.length"
        :save-count="needSave.length"
      />
    </div>

    <!-- Content -->
    <div class="pz-fade-up" :key="`${activeCol}-${statusFilter}-${ticketRange}-${sort}`">
      <!-- Empty state -->
      <div v-if="base.length === 0" style="text-align: center; padding: 30px 20px;">
        <!-- Fully collected -->
        <template v-if="isFullyCollected">
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            style="display: block; margin: 0 auto 16px; opacity: 0.45;
              filter: drop-shadow(0 -1px 0px rgba(255,255,255,0.15)) drop-shadow(0 2px 3px rgba(0,0,0,0.6));">
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
            <path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>
          </svg>
          <div style="font-weight: 700; color: var(--pz-tx1); font-size: 15px; margin-bottom: 4px; font-family: 'Inter',sans-serif;">
            Коллекция собрана
          </div>
          <div style="color: var(--pz-tx2); font-size: 13px; font-family: 'Inter',sans-serif;">
            Скоро добавим новые призы
          </div>
        </template>

        <!-- No results with current filters -->
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            style="display: block; margin: 0 auto 16px; opacity: 0.45;
              filter: drop-shadow(0 -1px 0px rgba(255,255,255,0.15)) drop-shadow(0 2px 3px rgba(0,0,0,0.6));">
            <rect width="20" height="5" x="2" y="3" rx="1"/>
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
            <path d="m9.5 17 5-5"/><path d="m9.5 12 5 5"/>
          </svg>
          <div style="color: var(--pz-tx2); font-size: 13px; font-family: 'Inter',sans-serif;">
            Нет призов с такими фильтрами
          </div>
          <!-- Hint: switch to "soon" if available is empty but soon exists -->
          <div
            v-if="statusFilter !== 'soon' && soonCount > 0"
            style="margin-top: 16px; font-family: 'Inter',sans-serif; font-size: 14px; color: #F0F4FF;"
          >
            <span style="color: #00D4FF;">{{ soonCount }}</span>
            {{ soonCount === 1 ? 'приз' : soonCount < 5 ? 'приза' : 'призов' }} скоро появится —
            <span
              style="color: #C5F946; cursor: pointer; text-decoration: underline; text-underline-offset: 3px;"
              @click="statusFilter = 'soon'"
            >посмотреть</span>
          </div>
        </template>
      </div>

      <!-- Zones -->
      <template v-if="base.length > 0">
        <div
          v-if="(zone === 'all' || zone === 'can') && canNow.length > 0"
          style="margin-top: 48px; margin-bottom: 40px;"
        >
          <ZoneHeader
            v-if="zone === 'all'"
            :label="hasTickets ? 'Хватает сейчас' : zoneLabel()"
            color="var(--pz-green)"
          />
          <PrizeGrid :items="canNow" :show-emoji="true" />
        </div>

        <div
          v-if="(zone === 'all' || zone === 'save') && needSave.length > 0"
          :style="{ marginBottom: '20px', marginTop: zone === 'all' && canNow.length > 0 ? '48px' : 0 }"
        >
          <ZoneHeader
            v-if="zone === 'all' && hasTickets"
            label="Надо подкопить"
            color="var(--pz-cyan)"
          />
          <ZoneHeader
            v-if="!hasTickets"
            :label="zoneLabel()"
            color="var(--pz-cyan)"
          />
          <PrizeGrid :items="needSave" :show-emoji="true" />
        </div>
      </template>
    </div>

    <!-- Collected section -->
    <div v-if="done.length > 0" style="margin-top: 4px;">
      <ZoneHeader label="В коллекции" color="var(--pz-tx2)" :count="done.length" />
      <PrizeGrid :items="done" :show-emoji="true" />
    </div>
  </div>
</template>

<style scoped>
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
