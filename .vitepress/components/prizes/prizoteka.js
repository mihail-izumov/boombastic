/**
 * Призотека — Provide/Inject ключи и хелперы
 * 
 * PrizesPage.vue делает provide() всего state.
 * Дочерние компоненты делают inject() только то, что нужно.
 * 
 * Использование в PrizesPage.vue:
 *   import { PRIZE_KEYS, createPrizeState } from './prizoteka'
 *   const state = createPrizeState(props)
 *   provide(PRIZE_KEYS.TICKETS, state.tickets)
 *   ...
 * 
 * Использование в дочерних:
 *   import { PRIZE_KEYS } from './prizoteka'
 *   const tickets = inject(PRIZE_KEYS.TICKETS)
 */

// ── INJECTION KEYS ─────────────────────────────────────────────
export const PRIZE_KEYS = {
  // Reactive state (ref)
  TICKETS:        Symbol('pz-tickets'),
  COLLECTED:      Symbol('pz-collected'),
  CART:           Symbol('pz-cart'),
  TAKING:         Symbol('pz-taking'),
  TAB:            Symbol('pz-tab'),
  TICKET_HISTORY: Symbol('pz-ticket-history'),

  // Static data (readonly)
  PRIZES:     Symbol('pz-prizes'),
  SETTINGS:   Symbol('pz-settings'),
  REGISTRY:   Symbol('pz-registry'),
  CATEGORIES: Symbol('pz-categories'),
  COLLECTIONS:Symbol('pz-collections'),
  PARK:       Symbol('pz-park'),

  // Actions (functions)
  HANDLE_CART:          Symbol('pz-handle-cart'),
  HANDLE_COLLECT:       Symbol('pz-handle-collect'),
  HANDLE_COLLECT_QUIET: Symbol('pz-handle-collect-quiet'),
  HANDLE_SPEND:         Symbol('pz-handle-spend'),
  HANDLE_UNDO:          Symbol('pz-handle-undo'),
  HANDLE_RESET:         Symbol('pz-handle-reset'),
  REMOVE_FROM_CART:     Symbol('pz-remove-from-cart'),
  SET_QUEUE_PRIZE:      Symbol('pz-set-queue-prize'),
  SET_BOOM:             Symbol('pz-set-boom'),
  SET_ADD_ANIM:         Symbol('pz-set-add-anim'),
  SET_TAKING:           Symbol('pz-set-taking'),
  SET_TAB:              Symbol('pz-set-tab'),
  SET_CATALOG_FILTER:   Symbol('pz-set-catalog-filter'),
  SET_TROPHY_OPEN:      Symbol('pz-set-trophy-open'),
  SET_TICKET_MODAL:     Symbol('pz-set-ticket-modal'),
  COMMIT_TICKETS:       Symbol('pz-commit-tickets'),

  // Computed helpers
  PRIZE_BY_ID:          Symbol('pz-prize-by-id'),
  ALL_COLLECTION_PRIZES:Symbol('pz-all-collection-prizes'),
}

// ── HELPER: оценка визитов ─────────────────────────────────────
export function visitsEst(rem, avgPerVisit = 2000) {
  if (rem <= 0) return null
  const v = Math.ceil(rem / avgPerVisit)
  if (v === 1) return '~1 визит'
  if (v >= 2 && v <= 4) return `~${v} визита`
  return `~${v} визитов`
}

// ── HELPER: плюрализация ───────────────────────────────────────
export function pluralPrize(n) {
  const abs = Math.abs(n) % 100
  const mod10 = abs % 10
  if (abs >= 11 && abs <= 19) return 'призов'
  if (mod10 === 1) return 'приз'
  if (mod10 >= 2 && mod10 <= 4) return 'приза'
  return 'призов'
}

export function pluralWait(n) {
  const abs = Math.abs(n) % 100
  const mod10 = abs % 10
  if (abs >= 11 && abs <= 19) return 'ждут'
  if (mod10 === 1) return 'ждёт'
  return 'ждут'
}

export function pluralThem(n) {
  const abs = Math.abs(n) % 100
  const mod10 = abs % 10
  if (abs >= 11 && abs <= 19) return 'они твои'
  if (mod10 === 1) return 'он твой'
  return 'они твои'
}

// ── HELPER: форматирование числа ───────────────────────────────
export function fmtNum(n) {
  return n.toLocaleString('ru-RU')
}

// ── HELPER: статусы ────────────────────────────────────────────
export const STATUS_OPTS = [
  { id: 'available', label: 'В наличии' },
  { id: 'soon',      label: 'Скоро' },
  { id: 'archive',   label: 'Архив' },
]

export const TICKET_RANGE_OPTS = [
  { id: 'all',       label: 'Все тикеты',    min: 0,    max: Infinity },
  { id: '500-1000',  label: '500 – 1 000',   min: 500,  max: 1000 },
  { id: '1000-3000', label: '1 000 – 3 000', min: 1000, max: 3000 },
  { id: '3000-5000', label: '3 000 – 5 000', min: 3000, max: 5000 },
  { id: '5000+',     label: '5 000+',        min: 5000, max: Infinity },
]

// ── HELPER: фильтрация и сортировка ────────────────────────────
export function matchesStatus(p, statusFilter) {
  if (statusFilter === 'available') return p.status === 'available'
  if (statusFilter === 'soon')      return p.status === 'soon'
  if (statusFilter === 'archive')   return p.status === 'oos' || p.status === 'was'
  return true
}

export function matchesRange(p, ticketRange, ticketsMax = Infinity) {
  if (ticketRange === 'my-tickets') return p.tickets <= ticketsMax
  const opt = TICKET_RANGE_OPTS.find(o => o.id === ticketRange) || TICKET_RANGE_OPTS[0]
  return p.tickets >= opt.min && p.tickets <= opt.max
}

export function sortPrizes(a, b, sortMode) {
  const statusOrder = { available: 0, soon: 1, oos: 2, was: 3 }
  const sd = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3)
  if (sd !== 0) return sd
  if (sortMode === 'tickets-asc') return a.tickets - b.tickets
  return b.tickets - a.tickets
}

// ── HELPER: localStorage с префиксом парка ─────────────────────
export function lsKey(park, key) {
  return `boom_${park}_${key}`
}

export function lsGet(park, key, fallback = null) {
  try {
    const raw = localStorage.getItem(lsKey(park, key))
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function lsSet(park, key, value) {
  try {
    localStorage.setItem(lsKey(park, key), JSON.stringify(value))
  } catch {}
}
