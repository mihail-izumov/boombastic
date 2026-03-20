<script setup>
/**
 * TabCatalog — вкладка «Витрина»
 * 
 * Показывает призы с is_jackpot=false.
 * Фильтры: категория, статус, диапазон тикетов, сортировка.
 * Зоны: «Хватает сейчас» / «Надо подкопить» (если tickets > 0).
 */
import { ref, computed, watch, inject, onMounted, onUnmounted } from 'vue'
import { PRIZE_KEYS, fmtNum, matchesStatus as matchStatus, matchesRange as matchRange, sortPrizes, TICKET_RANGE_OPTS } from './prizoteka'
import PrizeIcons from './PrizeIcons.vue'
import StatusDropdown from './StatusDropdown.vue'
import TicketRangeDropdown from './TicketRangeDropdown.vue'
import SortChips from './SortChips.vue'
import ZoneToggles from './ZoneToggles.vue'
import ZoneHeader from './ZoneHeader.vue'
import PrizeGrid from './PrizeGrid.vue'

const props = defineProps({
  catalogFilter: { type: Number, default: null },
})
const emit = defineEmits(['update:catalogFilter'])

const tickets    = inject(PRIZE_KEYS.TICKETS)
const collected  = inject(PRIZE_KEYS.COLLECTED)
const prizes     = inject(PRIZE_KEYS.PRIZES)
const categories = inject(PRIZE_KEYS.CATEGORIES)

// Local filter state
const cat          = ref('all')
const sort         = ref('tickets-asc')
const statusFilter = ref('available')
const ticketRange  = ref('all')
const zone         = ref('all')

function setStatusAndReset(v) {
  statusFilter.value = v
  zone.value = 'all'
}

// When catalogFilter activates — switch ticketRange to 'my-tickets'
watch(() => props.catalogFilter, (val) => {
  if (val != null) {
    ticketRange.value = 'my-tickets'
    zone.value = 'all'
  }
})

const myTicketsMax = computed(() =>
  props.catalogFilter != null ? props.catalogFilter : tickets.value
)

// Category chips with counts
const catChips = computed(() =>
  categories.filter(c => c.has_filter).map(c => {
    const count = c.id === 'all' ? null : prizes.filter(p =>
      !p.is_jackpot && p.category === c.id && p.status === 'available' && !collected.value.includes(p.id)
    ).length
    return { ...c, count }
  })
)

// Filtering pipeline
// baseAll: status + category only (for ZoneToggles counts)
const baseAll = computed(() =>
  prizes
    .filter(p => !p.is_jackpot && !collected.value.includes(p.id))
    .filter(p => cat.value === 'all' || p.category === cat.value)
    .filter(p => matchStatus(p, statusFilter.value))
)

// base: all filters + sort (for display)
const base = computed(() =>
  baseAll.value
    .filter(p => props.catalogFilter == null || p.tickets <= props.catalogFilter)
    .filter(p => matchRange(p, ticketRange.value, myTicketsMax.value))
    .sort((a, b) => sortPrizes(a, b, sort.value))
)

const canNow = computed(() =>
  base.value.filter(p => tickets.value > 0 && p.tickets <= tickets.value)
)
const needSave = computed(() =>
  base.value.filter(p => !(tickets.value > 0 && p.tickets <= tickets.value))
)
const canNowCount = computed(() => canNow.value.length)
const needSaveCount = computed(() => needSave.value.length)
const hasTickets = computed(() => tickets.value > 0)

// "My tickets" toggle
function toggleMyTickets() {
  ticketRange.value = ticketRange.value === 'my-tickets' ? 'all' : 'my-tickets'
}

function handleTicketRangeChange(v) {
  ticketRange.value = v
  if (v !== 'my-tickets') emit('update:catalogFilter', null)
}

function resetFilters() {
  statusFilter.value = 'available'
  ticketRange.value = 'all'
  cat.value = 'all'
}

const sortOptions = [
  { id: 'tickets-asc',  label: 'Дешевле', icon: '↑' },
  { id: 'tickets-desc', label: 'Дороже',  icon: '↓' },
]

// Scroll fade tracking
const catScrollEl = ref(null)
const catFadeHidden = ref(false)

function checkCatScroll() {
  const el = catScrollEl.value
  if (!el) return
  catFadeHidden.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

onMounted(() => {
  const el = catScrollEl.value
  if (el) {
    el.addEventListener('scroll', checkCatScroll, { passive: true })
    checkCatScroll()
  }
})
onUnmounted(() => {
  const el = catScrollEl.value
  if (el) el.removeEventListener('scroll', checkCatScroll)
})

const catLabel = computed(() => {
  if (cat.value === 'all') return 'Все призы'
  return categories.find(c => c.id === cat.value)?.label || 'Все призы'
})
</script>

<template>
  <div>
    <!-- Category chips -->
    <div style="position: relative; margin-bottom: 10px;">
      <div ref="catScrollEl" class="pz-hscroll">
        <button
          v-for="c in catChips"
          :key="c.id"
          class="pz-chip"
          :class="{ 'pz-chip--active': cat === c.id }"
          @click="cat = c.id; zone = 'all'"
        >
          <span style="display: inline-flex; align-items: center; gap: 5px; vertical-align: middle;">
            <PrizeIcons v-if="c.id !== 'all'" :name="c.icon_name" :size="14" />
            {{ c.label }}
            <span v-if="c.count != null" class="pz-chip__count">{{ c.count }}</span>
          </span>
        </button>
      </div>
      <div class="pz-hscroll-fade" :class="{ 'pz-hscroll-fade--hidden': catFadeHidden }" />
    </div>

    <!-- Filter panel -->
    <div class="pz-filter-panel">
      <div class="pz-filter-panel__title">
        <h2>{{ catLabel }}</h2>
      </div>

      <div class="pz-filter-row" :style="{ marginBottom: hasTickets ? '10px' : 0 }">
        <div style="display: flex; gap: 5px; align-items: center; flex-wrap: wrap;">
          <StatusDropdown v-model="statusFilter" @update:model-value="setStatusAndReset" />
          <TicketRangeDropdown v-model="ticketRange" @update:model-value="handleTicketRangeChange" />
          <!-- "До X тик" button -->
          <button
            v-if="tickets > 0"
            class="pz-my-tickets-btn"
            :class="{ 'pz-my-tickets-btn--active': ticketRange === 'my-tickets' }"
            @click="toggleMyTickets"
          >
            <PrizeIcons name="ui_ticket" :size="14" />
            До {{ fmtNum(myTicketsMax) }}
          </button>
        </div>
        <SortChips v-model="sort" :options="sortOptions" />
      </div>

      <ZoneToggles
        v-if="hasTickets"
        v-model="zone"
        :tickets="tickets"
        :can-count="canNowCount"
        :save-count="needSaveCount"
      />
    </div>

    <!-- Content -->
    <div class="pz-fade-up" :key="`${cat}-${sort}-${statusFilter}-${ticketRange}`">
      <!-- Empty state -->
      <template v-if="base.length === 0">
        <!-- catalogFilter active but nothing fits → show all without filter -->
        <template v-if="catalogFilter != null && baseAll.length > 0">
          <div class="tab-catalog__hint">
            В этой категории нет призов до {{ fmtNum(catalogFilter) }} тик.
            <span class="tab-catalog__hint-link" @click="emit('update:catalogFilter', null)">
              Смотреть все
            </span>
          </div>
          <!-- Render full baseAll split by zones -->
          <template v-if="hasTickets">
            <div v-if="canNow.length > 0" style="margin-bottom: 22px;">
              <ZoneHeader label="Хватает сейчас" color="var(--pz-green)" :count="canNow.length" />
              <PrizeGrid :items="canNow" />
            </div>
            <div v-if="needSave.length > 0">
              <ZoneHeader label="Надо подкопить" color="var(--pz-cyan)" :count="needSave.length" />
              <PrizeGrid :items="needSave" />
            </div>
          </template>
          <template v-else>
            <PrizeGrid :items="baseAll" />
          </template>
        </template>

        <!-- Truly empty -->
        <div v-else style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.4;">🔍</div>
          <div style="color: var(--pz-tx1); font-size: 15px; font-weight: 700; font-family: 'Inter',sans-serif; margin-bottom: 6px;">
            Ничего не нашлось
          </div>
          <div style="color: var(--pz-tx2); font-size: 13px; font-family: 'Inter',sans-serif; margin-bottom: 16px;">
            Попробуй изменить фильтры или выбрать другую категорию
          </div>
          <button class="tab-catalog__reset-btn" @click="resetFilters">
            Сбросить фильтры
          </button>
        </div>
      </template>

      <!-- Has results + has tickets → zones -->
      <template v-else-if="hasTickets">
        <div
          v-if="(zone === 'all' || zone === 'can') && canNow.length > 0"
          style="margin-top: 48px; margin-bottom: 40px;"
        >
          <ZoneHeader v-if="zone === 'all'" label="Хватает сейчас" color="var(--pz-green)" />
          <PrizeGrid :items="canNow" />
        </div>
        <div
          v-if="(zone === 'all' || zone === 'save') && needSave.length > 0"
          :style="{ marginTop: zone === 'all' && canNow.length > 0 ? '48px' : 0 }"
        >
          <ZoneHeader v-if="zone === 'all'" label="Надо подкопить" color="var(--pz-cyan)" />
          <PrizeGrid :items="needSave" />
        </div>
      </template>

      <!-- Has results + no tickets → flat list -->
      <template v-else>
        <PrizeGrid :items="base" />
      </template>
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
.tab-catalog__hint {
  text-align: center;
  margin-bottom: 16px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(0, 212, 255, 0.07);
  border: 1px solid rgba(0, 212, 255, 0.22);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--pz-tx2);
  line-height: 1.5;
}
.tab-catalog__hint-link {
  color: var(--pz-cyan);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
}
.tab-catalog__reset-btn {
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid rgba(197, 249, 70, 0.4);
  background: transparent;
  color: var(--pz-lime);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}
</style>
