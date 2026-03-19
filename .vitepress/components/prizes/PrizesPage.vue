<script setup>
/**
 * PrizesPage — главный компонент Призотеки
 * 
 * Получает данные через props от data loader.
 * Делает provide() всего state для дочерних компонентов.
 * Содержит: header, tabs, bottom bar, модалки, анимации.
 * 
 * Использование:
 *   <PrizesPage v-bind="data" park="piterlend" />
 */
import { ref, computed, provide, onMounted, watch } from 'vue'
import { PRIZE_KEYS, lsGet, lsSet, fmtNum } from './prizoteka'
import './prizes.css'

// Components
import PrizeIcons from './PrizeIcons.vue'
import TabCatalog from './TabCatalog.vue'
import TabCollections from './TabCollections.vue'
import TabDream from './TabDream.vue'
import BoomExplosion from './BoomExplosion.vue'
import FavAddAnimation from './FavAddAnimation.vue'
import QueueModal from './QueueModal.vue'
import TicketModal from './TicketModal.vue'
import CartDrawer from './CartDrawer.vue'

// ── PROPS ────────────────────────────────────────────────────────
const props = defineProps({
  park:        { type: String, required: true },
  prizes:      { type: Array, required: true },
  collections: { type: Object, required: true },
  settings:    { type: Object, required: true },
  registry:    { type: Array, required: true },
  categories:  { type: Array, required: true },
})

// ── REACTIVE STATE ───────────────────────────────────────────────
const tickets       = ref(0)
const collected     = ref([])
const cart          = ref([])
const taking        = ref([])
const tab           = ref('catalog')
const ticketHistory = ref([])

const boom          = ref(false)
const queuePrize    = ref(null)
const addAnim       = ref(null)       // 'cart' | 'collect' | null
const cartAnimKey   = ref(0)
const catalogFilter = ref(null)
const catalogFilterCol   = ref(null)
const catalogFilterDream = ref(null)
const ticketModal   = ref(false)
const trophyOpen    = ref(false)

// ── LOAD FROM localStorage (SSR-safe) ────────────────────────────
onMounted(() => {
  try {
    const t  = localStorage.getItem(`boom_${props.park}_tickets`)
    const c  = localStorage.getItem(`boom_${props.park}_collected`)
    const tb = localStorage.getItem(`boom_${props.park}_tab`)
    const th = localStorage.getItem(`boom_${props.park}_ticket_history`)
    const cr = localStorage.getItem(`boom_${props.park}_cart`)
    const tk = localStorage.getItem(`boom_${props.park}_taking`)

    if (t)  tickets.value = parseInt(t, 10)
    if (c)  collected.value = JSON.parse(c)
    if (tb) tab.value = tb
    if (th) {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
      const parsed = JSON.parse(th)
      ticketHistory.value = parsed.filter(e => !e.ts || e.ts > cutoff)
    }
    if (cr) cart.value = JSON.parse(cr)
    if (tk) taking.value = JSON.parse(tk)
  } catch {}
})

// ── PERSIST TO localStorage ──────────────────────────────────────
watch(tickets,       (v) => { try { localStorage.setItem(`boom_${props.park}_tickets`, String(v)) } catch {} })
watch(collected,     (v) => { try { localStorage.setItem(`boom_${props.park}_collected`, JSON.stringify(v)) } catch {} }, { deep: true })
watch(tab,           (v) => { try { localStorage.setItem(`boom_${props.park}_tab`, v) } catch {} })
watch(ticketHistory, (v) => { try { localStorage.setItem(`boom_${props.park}_ticket_history`, JSON.stringify(v)) } catch {} }, { deep: true })
watch(cart,          (v) => { try { localStorage.setItem(`boom_${props.park}_cart`, JSON.stringify(v)) } catch {} }, { deep: true })
watch(taking,        (v) => { try { localStorage.setItem(`boom_${props.park}_taking`, JSON.stringify(v)) } catch {} }, { deep: true })

// ── COMPUTED ─────────────────────────────────────────────────────
const prizeMap = computed(() => {
  const m = new Map()
  for (const p of props.prizes) m.set(p.id, p)
  return m
})

const prizeByIdFn = (id) => prizeMap.value.get(id) || null

const allCollectionPrizeIds = computed(() => {
  const ids = new Set()
  for (const key of Object.keys(props.collections)) {
    for (const id of props.collections[key]) ids.add(id)
  }
  return [...ids]
})

const trophyCount = computed(() =>
  cart.value.filter(id => prizeByIdFn(id)).length
)

// ── ACTIONS ──────────────────────────────────────────────────────
function handleCart(id) {
  if (collected.value.includes(id)) return
  const adding = !cart.value.includes(id)
  if (adding) {
    cart.value = [...cart.value, id]
    addAnim.value = 'cart'
    cartAnimKey.value++
    setTimeout(() => { addAnim.value = null }, 2100)
  } else {
    cart.value = cart.value.filter(x => x !== id)
  }
  taking.value = taking.value.filter(x => x !== id)
}

function removeFromCart(id) {
  cart.value = cart.value.filter(x => x !== id)
  taking.value = taking.value.filter(x => x !== id)
}

function handleCollect(id) {
  collected.value = [...collected.value, id]
  cart.value = cart.value.filter(x => x !== id)
  taking.value = taking.value.filter(x => x !== id)
  boom.value = true
  addAnim.value = 'collect'
}

function handleCollectQuiet(id) {
  collected.value = [...collected.value, id]
  cart.value = cart.value.filter(x => x !== id)
  taking.value = taking.value.filter(x => x !== id)
  boom.value = true
}

function handleSpend(amount) {
  tickets.value = Math.max(0, tickets.value - amount)
}

function handleUndo(id) {
  const p = prizeByIdFn(id)
  if (p) tickets.value += p.tickets
  collected.value = collected.value.filter(x => x !== id)
  if (!cart.value.includes(id)) cart.value = [...cart.value, id]
}

function handleReset() {
  const totalSpent = collected.value.reduce((s, id) => {
    const p = prizeByIdFn(id)
    return s + (p ? p.tickets : 0)
  }, 0)
  if (totalSpent > 0) tickets.value = Math.max(0, tickets.value + totalSpent)
  collected.value = []
  cart.value = []
  taking.value = []
}

function setTakingFn(val) {
  taking.value = typeof val === 'function' ? val(taking.value) : val
}

function commitTickets(n) {
  tickets.value = n
  // Add to history
  const now = new Date()
  const ts = now.getTime()
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
  const isToday = (d) => {
    const t = new Date(d)
    const n2 = new Date()
    return t.getDate() === n2.getDate() && t.getMonth() === n2.getMonth() && t.getFullYear() === n2.getFullYear()
  }
  const label = isToday(ts) ? time : `${now.getDate()} ${months[now.getMonth()]} · ${time}`
  const prev = ticketHistory.value.length > 0 ? ticketHistory.value[ticketHistory.value.length - 1].value : 0
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  const filtered = ticketHistory.value.filter(e => !e.ts || e.ts > cutoff)
  ticketHistory.value = [...filtered, { value: n, label, diff: n - prev, ts }]
}

function setTabFn(t) {
  tab.value = t
  catalogFilter.value = null
  catalogFilterCol.value = null
  catalogFilterDream.value = null
}

function setCatalogFilterFn(v) {
  catalogFilter.value = v
}

function setTrophyOpenFn(v) {
  trophyOpen.value = v
}

// ── PROVIDE ──────────────────────────────────────────────────────
provide(PRIZE_KEYS.TICKETS, tickets)
provide(PRIZE_KEYS.COLLECTED, collected)
provide(PRIZE_KEYS.CART, cart)
provide(PRIZE_KEYS.TAKING, taking)
provide(PRIZE_KEYS.TAB, tab)
provide(PRIZE_KEYS.TICKET_HISTORY, ticketHistory)

provide(PRIZE_KEYS.PRIZES, props.prizes)
provide(PRIZE_KEYS.SETTINGS, props.settings)
provide(PRIZE_KEYS.REGISTRY, props.registry)
provide(PRIZE_KEYS.CATEGORIES, props.categories)
provide(PRIZE_KEYS.COLLECTIONS, props.collections)
provide(PRIZE_KEYS.PARK, props.park)

provide(PRIZE_KEYS.HANDLE_CART, handleCart)
provide(PRIZE_KEYS.HANDLE_COLLECT, handleCollect)
provide(PRIZE_KEYS.HANDLE_COLLECT_QUIET, handleCollectQuiet)
provide(PRIZE_KEYS.HANDLE_SPEND, handleSpend)
provide(PRIZE_KEYS.HANDLE_UNDO, handleUndo)
provide(PRIZE_KEYS.HANDLE_RESET, handleReset)
provide(PRIZE_KEYS.REMOVE_FROM_CART, removeFromCart)
provide(PRIZE_KEYS.SET_QUEUE_PRIZE, (p) => { queuePrize.value = p })
provide(PRIZE_KEYS.SET_BOOM, (v) => { boom.value = v })
provide(PRIZE_KEYS.SET_ADD_ANIM, (v) => { addAnim.value = v })
provide(PRIZE_KEYS.SET_TAKING, setTakingFn)
provide(PRIZE_KEYS.SET_TAB, setTabFn)
provide(PRIZE_KEYS.SET_CATALOG_FILTER, setCatalogFilterFn)
provide(PRIZE_KEYS.SET_TROPHY_OPEN, setTrophyOpenFn)
provide(PRIZE_KEYS.COMMIT_TICKETS, commitTickets)

provide(PRIZE_KEYS.PRIZE_BY_ID, prizeByIdFn)
provide(PRIZE_KEYS.ALL_COLLECTION_PRIZES, allCollectionPrizeIds)

// ── TABS CONFIG ──────────────────────────────────────────────────
const TABS = [
  { id: 'catalog',     label: 'Витрина',   iconName: 'tab_catalog' },
  { id: 'collections', label: 'Коллекции', iconName: 'tab_collections' },
  { id: 'dream',       label: 'Джекпот',   iconName: 'tab_dream' },
]

// Open ticket modal
function openTicketModal() {
  ticketModal.value = true
}
</script>

<template>
  <div class="prizoteka vp-raw">
    <!-- Overlays -->
    <BoomExplosion v-if="boom" @done="boom = false" />
    <FavAddAnimation v-if="addAnim" :type="addAnim" @done="addAnim = null" />
    <QueueModal v-if="queuePrize" :prize="queuePrize" @close="queuePrize = null" />

    <div class="pz-page">
      <!-- Header -->
      <div class="pz-header">
        <h1 class="pz-header__title">ПРИЗОТЕКА</h1>
        <h2 class="pz-header__park">{{ settings.park_name?.toUpperCase() || park.toUpperCase() }}</h2>
      </div>

      <!-- Content -->
      <div class="pz-content">
        <!-- Tabs -->
        <div class="pz-tabs">
          <button
            v-for="t in TABS"
            :key="t.id"
            class="pz-tab"
            :class="{ 'pz-tab--active': tab === t.id }"
            @click="setTabFn(t.id)"
          >
            <span class="pz-tab__icon" :class="{ 'pz-tab__icon--active': tab === t.id }">
              <PrizeIcons :name="t.iconName" :size="32" />
            </span>
            {{ t.label }}
          </button>
        </div>

        <!-- Tab content -->
        <div class="pz-fade-up pz-tab-content" :key="tab">
          <TabCatalog
            v-if="tab === 'catalog'"
            :catalog-filter="catalogFilter"
            @update:catalog-filter="catalogFilter = $event"
          />
          <TabCollections v-if="tab === 'collections'" />
          <TabDream v-if="tab === 'dream'" />
        </div>
      </div>
    </div>

    <!-- ── BOTTOM BAR ── -->
    <div class="pz-bottom-bar">
      <div class="pz-bottom-bar__inner">
        <!-- Ticket button -->
        <button class="pz-bb-btn pz-bottom-ticket" @click="openTicketModal">
          <span class="pz-bb-label pz-bottom-ticket__label">Тикеты</span>
          <span class="pz-bb-badge pz-bottom-ticket__badge">
            <PrizeIcons name="ui_ticket" :size="16" />
            {{ tickets > 0 ? String(tickets) : '0' }}
          </span>
        </button>

        <!-- Prizes button -->
        <button
          class="pz-bb-btn pz-bottom-prizes"
          :class="{
            'pz-bottom-prizes--pulse': addAnim === 'cart',
            'pz-bottom-prizes--empty': trophyCount === 0 && addAnim !== 'cart',
          }"
          @click="trophyOpen = true"
        >
          <span class="pz-bb-label pz-bottom-prizes__label">Призы</span>
          <span
            class="pz-bb-badge pz-bottom-prizes__badge"
            :key="cartAnimKey"
            :class="{ 'pz-bottom-prizes__badge--pop': addAnim === 'cart' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="#C5F946" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/>
              <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/>
              <path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>
            </svg>
            {{ trophyCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- ── TICKET MODAL ── -->
    <TicketModal v-if="ticketModal" @close="ticketModal = false" />

    <!-- ── CART DRAWER ── -->
    <CartDrawer v-if="trophyOpen" @close="trophyOpen = false" />
  </div>
</template>

<style scoped>
.pz-page {
  min-height: 100vh;
  background: var(--pz-bg);
  overflow-x: hidden;
}

/* ── HEADER ── */
.pz-header {
  max-width: 900px;
  margin: 0 auto;
  padding: 120px 20px 24px;
  position: relative;
  z-index: 1;
  text-align: center;
}
.pz-header__title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 8vw, 48px);
  line-height: 1;
  color: #FFD60A;
  letter-spacing: 0.12em;
  margin: 0;
  text-transform: uppercase;
}
.pz-header__park {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 8vw, 48px);
  line-height: 1;
  color: #F0F4FF;
  letter-spacing: 0.12em;
  margin: 0;
  text-transform: uppercase;
}

/* ── CONTENT ── */
.pz-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 20px 80px;
  position: relative;
  z-index: 1;
}

/* ── TABS ── */
.pz-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: rgba(10, 8, 28, 0.65);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid rgba(74, 90, 173, 0.15);
}
.pz-tab {
  flex: 1;
  padding: 18px 5px 14px;
  border-radius: 9px;
  border: none;
  border-top: 1px solid transparent;
  background: radial-gradient(ellipse 120% 80% at 50% -10%, rgba(106,120,200,0.35) 0%, rgba(74,90,173,0.12) 45%, rgba(28,26,62,0.0) 100%);
  box-shadow: inset 0 1px 0 rgba(106,120,200,0.30), inset 0 -1px 0 rgba(0,0,0,0.25);
  color: #8090c8;
  font-family: 'Inter', sans-serif;
  font-size: clamp(10px, 2.5vw, 13px);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  overflow: hidden;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.pz-tab--active {
  background: radial-gradient(ellipse 120% 80% at 50% -10%, rgba(197,249,70,0.45) 0%, rgba(197,249,70,0.12) 45%, rgba(74,90,173,0.08) 100%);
  box-shadow: inset 0 1px 0 rgba(197,249,70,0.45), inset 0 -1px 0 rgba(0,0,0,0.4);
  color: var(--pz-lime);
  border-top-color: rgba(197,249,70,0.24);
}
.pz-tab__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8090c8;
  opacity: 0.85;
  filter: drop-shadow(0 -1px 0px rgba(255,255,255,0.15)) drop-shadow(0 2px 3px rgba(0,0,0,0.6));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.pz-tab:not(.pz-tab--active):hover .pz-tab__icon {
  transform: translateY(-2px) scale(1.08);
  filter: drop-shadow(0 -1px 0px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
}
.pz-tab__icon--active {
  color: var(--pz-lime);
  opacity: 1;
  filter: drop-shadow(0 0 6px rgba(197,249,70,0.5)) drop-shadow(0 -1px 0px rgba(255,255,255,0.4));
  transform: translateY(-2px) scale(1.08);
}
.pz-tab:not(.pz-tab--active):hover .pz-tab__icon {
  transform: translateY(-2px) scale(1.08);
  filter: drop-shadow(0 -1px 0px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
}
.pz-tab:not(.pz-tab--active):hover {
  background: radial-gradient(ellipse 120% 80% at 50% -10%, rgba(106,120,200,0.5) 0%, rgba(74,90,173,0.18) 45%, rgba(28,26,62,0.0) 100%);
}
.pz-tab-content {
  padding-bottom: 120px;
}

/* ── BOTTOM BAR ── */
.pz-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: rgba(10, 8, 26, 0.97);
  backdrop-filter: blur(20px) saturate(160%);
  border-top: 1px solid rgba(74, 90, 173, 0.22);
  padding: 10px 16px max(16px, env(safe-area-inset-bottom));
  width: 100%;
  box-sizing: border-box;
}
.pz-bottom-bar__inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  align-items: stretch;
}

/* Ticket button */
.pz-bottom-ticket {
  flex: 1;
  border-radius: 14px;
  padding: 0 16px;
  min-height: 68px;
  min-width: 0;
  background: linear-gradient(135deg, rgba(255,214,10,0.22), rgba(255,150,0,0.14));
  border: 2px solid rgba(255,214,10,0.75);
  box-shadow: 0 0 22px rgba(255,214,10,0.18);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  transition: all 0.18s;
  overflow: hidden;
}
.pz-bottom-ticket__label {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: rgba(255, 214, 10, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.pz-bottom-ticket__badge {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  background: rgba(255, 214, 10, 0.2);
  border: 1px solid rgba(255, 214, 10, 0.6);
  border-radius: 10px;
  padding: 8px 14px;
  color: var(--pz-yellow);
  font-family: 'Space Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 0 14px rgba(255, 214, 10, 0.5);
  line-height: 1;
}

/* Prizes button */
.pz-bottom-prizes {
  flex: 1;
  border-radius: 14px;
  padding: 0 16px;
  min-height: 68px;
  min-width: 0;
  background: linear-gradient(135deg, rgba(197,249,70,0.22), rgba(100,180,30,0.14));
  border: 2px solid rgba(197,249,70,0.7);
  box-shadow: 0 0 20px rgba(197,249,70,0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  transition: all 0.22s ease;
  overflow: hidden;
}
.pz-bottom-prizes--pulse {
  border-color: rgba(197,249,70,1);
  box-shadow: 0 0 34px rgba(197,249,70,0.45);
  animation: pz-btnPulse 0.7s ease-out;
}
.pz-bottom-prizes--empty {
  border-color: rgba(197,249,70,0.4);
  animation: pz-cartEmpty 2.5s ease-in-out infinite;
}
.pz-bottom-prizes__label {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: rgba(197, 249, 70, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.pz-bottom-prizes__badge {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  background: rgba(197, 249, 70, 0.18);
  border: 1px solid rgba(197, 249, 70, 0.6);
  border-radius: 10px;
  padding: 8px 14px;
  color: var(--pz-lime);
  font-family: 'Space Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}
.pz-bottom-prizes__badge--pop {
  animation: pz-countPop 0.4s ease-out;
}
</style>
