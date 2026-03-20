<script setup>
/**
 * TabTrophy — содержимое корзины (внутри CartDrawer)
 * 
 * Секции: дашборд (Есть/Беру/Останется), онбординг, 
 * «Можно получить», «Надо подкопить», «Мои трофеи», сброс.
 */
import { ref, computed, watch, inject } from 'vue'
import { PRIZE_KEYS, fmtNum, visitsEst } from './prizoteka'
import PrizeIcons from './PrizeIcons.vue'

const emit = defineEmits(['goToCatalog'])

const tickets     = inject(PRIZE_KEYS.TICKETS)
const collected   = inject(PRIZE_KEYS.COLLECTED)
const cart        = inject(PRIZE_KEYS.CART)
const taking      = inject(PRIZE_KEYS.TAKING)
const setTaking   = inject(PRIZE_KEYS.SET_TAKING)
const settings    = inject(PRIZE_KEYS.SETTINGS)
const prizeById   = inject(PRIZE_KEYS.PRIZE_BY_ID)
const handleCollectQuiet = inject(PRIZE_KEYS.HANDLE_COLLECT_QUIET)
const handleUndo  = inject(PRIZE_KEYS.HANDLE_UNDO)
const handleCart  = inject(PRIZE_KEYS.HANDLE_CART)
const removeFromCart = inject(PRIZE_KEYS.REMOVE_FROM_CART)
const handleSpend = inject(PRIZE_KEYS.HANDLE_SPEND)
const handleReset = inject(PRIZE_KEYS.HANDLE_RESET)
const collections = inject(PRIZE_KEYS.COLLECTIONS)
const registry    = inject(PRIZE_KEYS.REGISTRY)

const confirmReset    = ref(false)
const confirmRemoveId = ref(null)
const confirmUndoId   = ref(null)

// Keep taking in sync with cart
watch(cart, (c) => {
  setTaking(taking.value.filter(id => c.includes(id)))
})

// Clean taking when tickets decrease
watch(tickets, () => {
  let budget = tickets.value
  setTaking(taking.value.filter(id => {
    const p = prizeById(id)
    if (!p || p.tickets > budget) return false
    budget -= p.tickets
    return true
  }))
})

// Derived data
const cartItems = computed(() => cart.value.map(id => prizeById(id)).filter(Boolean))
const takingItems = computed(() => taking.value.map(id => prizeById(id)).filter(Boolean))
const takingTotal = computed(() => takingItems.value.reduce((s, p) => s + p.tickets, 0))
const remainder = computed(() => tickets.value - takingTotal.value)
const collectedItems = computed(() => [...collected.value].reverse().map(id => prizeById(id)).filter(Boolean))
const totalTickets = computed(() => collectedItems.value.reduce((s, p) => s + p.tickets, 0))
const isEmpty = computed(() => collectedItems.value.length === 0 && cartItems.value.length === 0)
const afterTaking = computed(() => tickets.value - takingTotal.value)

function toggleTaking(id) {
  const prize = prizeById(id)
  if (!prize) return
  if (taking.value.includes(id)) {
    setTaking(taking.value.filter(x => x !== id))
  } else if (tickets.value > 0 && remainder.value >= prize.tickets) {
    setTaking([...taking.value, id])
  }
}

function handleCollectOne(id) {
  const prize = prizeById(id)
  if (!prize || tickets.value < prize.tickets) return
  handleSpend(prize.tickets)
  handleCollectQuiet(id)
  removeFromCart(id)
  setTaking(taking.value.filter(x => x !== id))
}

// Find collection for a prize
function findCollection(prizeId) {
  for (const r of registry) {
    if (collections[r.id]?.includes(prizeId)) return r
  }
  return null
}

function colProgress(colId) {
  const ids = collections[colId] || []
  return ids.filter(id => collected.value.includes(id)).length
}

// Dashboard hint
const hint = computed(() => {
  if (tickets.value === 0) return { text: 'Сколько у тебя тикетов? Введи в кнопке снизу', color: 'var(--pz-yellow)', icon: '🎟️' }
  if (afterTaking.value < 0) return { text: 'Тикетов не хватает — сними лишние галочки', color: 'var(--pz-orange)', icon: '⚠️' }
  return null
})

// Sorted cart items
const sortedCartItems = computed(() => {
  const at = afterTaking.value
  return [...cartItems.value].sort((a, b) => {
    const aChk = taking.value.includes(a.id), bChk = taking.value.includes(b.id)
    if (aChk && !bChk) return -1
    if (!aChk && bChk) return 1
    const aNeed = Math.max(0, a.tickets - at)
    const bNeed = Math.max(0, b.tickets - at)
    if (aNeed === 0 && bNeed === 0) return a.tickets - b.tickets
    return aNeed - bNeed
  })
})

const checkedItems = computed(() => sortedCartItems.value.filter(p => taking.value.includes(p.id)))
const affordableItems = computed(() => sortedCartItems.value.filter(p => !taking.value.includes(p.id) && tickets.value > 0 && p.tickets <= afterTaking.value))
const savingItems = computed(() => sortedCartItems.value.filter(p => !taking.value.includes(p.id) && (tickets.value <= 0 || p.tickets > afterTaking.value)))
</script>

<template>
  <!-- EMPTY STATE -->
  <div v-if="isEmpty" class="trophy-empty">
    <div class="trophy-empty__title">Планируй свои призы</div>
    <div class="trophy-empty__sub">
      Покажем <span class="c-lime">что забрать сейчас</span><br />
      и <span class="c-yellow">сколько осталось до мечты</span>.
    </div>
    <div class="trophy-empty__steps">
      <div v-for="(step, i) in [
        { n: '1', title: 'Выбирай.', text: 'Добавляй в корзину всё что нравится — из витрины, коллекций или джекпота.' },
        { n: '2', title: 'Считай.', text: 'Введи свои тикеты — корзина сама всё пересчитает.' },
        { n: '3', title: 'Забирай.', text: 'Отмечай что берёшь — остальное сохранится на следующий визит.' },
      ]" :key="i">
        <div v-if="i > 0" class="trophy-empty__divider" />
        <div class="trophy-empty__step">
          <span class="trophy-empty__step-n">{{ step.n }}</span>
          <span class="trophy-empty__step-text">
            <span class="trophy-empty__step-bold">{{ step.title }}</span> {{ step.text }}
          </span>
        </div>
      </div>
    </div>
    <button class="trophy-empty__cta" @click="emit('goToCatalog', tickets > 0 ? tickets : null)">
      <span style="position:relative;">Добавить призы</span>
    </button>
  </div>

  <!-- MAIN CONTENT -->
  <div v-else>
    <!-- DASHBOARD -->
    <div style="margin-bottom: 20px;">
      <div class="trophy-dash" :class="{ 'trophy-dash--hint': hint }">
        <div class="trophy-dash__cell">
          <div class="trophy-dash__label">Есть</div>
          <div class="trophy-dash__val trophy-dash__val--yellow">{{ tickets > 0 ? fmtNum(tickets) : '—' }}</div>
          <div class="trophy-dash__unit">тик</div>
        </div>
        <div class="trophy-dash__sep" />
        <div class="trophy-dash__cell">
          <div class="trophy-dash__label" :style="{ color: takingTotal > 0 ? 'var(--pz-lime)' : undefined }">Беру</div>
          <div class="trophy-dash__val" :class="{ 'trophy-dash__val--lime': takingTotal > 0 }">{{ takingTotal > 0 ? fmtNum(takingTotal) : '—' }}</div>
          <div class="trophy-dash__unit">тик</div>
        </div>
        <div class="trophy-dash__sep" />
        <div class="trophy-dash__cell">
          <div class="trophy-dash__label">Останется</div>
          <div
            class="trophy-dash__val"
            :class="{
              'trophy-dash__val--orange': tickets > 0 && afterTaking < 0,
              'trophy-dash__val--green': afterTaking === 0 && tickets > 0,
              'trophy-dash__val--cyan': afterTaking > 0 && tickets > 0,
            }"
          >{{ tickets === 0 ? '—' : fmtNum(afterTaking) }}</div>
          <div class="trophy-dash__unit">тик</div>
        </div>
      </div>
      <div v-if="hint" class="trophy-dash__hint-row">
        <span style="font-size: 12px;">{{ hint.icon }}</span>
        <span :style="{ color: hint.color }" class="trophy-dash__hint-text">{{ hint.text }}</span>
      </div>
    </div>

    <!-- Go to catalog button -->
    <button
      v-if="tickets > 0 && afterTaking > 0"
      class="trophy-goto-catalog"
      @click="emit('goToCatalog', afterTaking)"
    >
      <div style="text-align: left;">
        <div class="trophy-goto-catalog__label">Что ещё взять?</div>
        <div class="trophy-goto-catalog__val">{{ fmtNum(afterTaking) }} тик остаток</div>
      </div>
      <div class="trophy-goto-catalog__arrow">
        в каталог
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </button>

    <!-- CART ITEMS -->
    <template v-if="cartItems.length > 0">
      <!-- Можно получить -->
      <div v-if="checkedItems.length > 0 || affordableItems.length > 0" style="margin-top: 24px;" :style="{ marginBottom: savingItems.length > 0 ? '20px' : 0 }">
        <div class="trophy-section-header">
          <div class="trophy-section-header__label trophy-section-header__label--lime">Можно получить — {{ checkedItems.length + affordableItems.length }}</div>
          <div class="trophy-section-header__line trophy-section-header__line--lime" />
        </div>

        <!-- Onboarding hint -->
        <div v-if="checkedItems.length === 0 && affordableItems.length > 0" style="display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:12px;padding:10px 12px;border-radius:10px;background:rgba(197,249,70,0.04);border:1px solid rgba(197,249,70,0.12);">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;">
            <span style="display:inline-flex;align-items:center;gap:5px;font-family:'Inter',sans-serif;font-size:11px;color:#F0F4FF;">
              <span style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#C5F946;background:rgba(197,249,70,0.15);border-radius:4px;padding:1px 5px;">1</span>
              Отметь что берёшь
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5F946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            <span style="display:inline-flex;align-items:center;gap:5px;font-family:'Inter',sans-serif;font-size:11px;color:#F0F4FF;">
              <span style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#C5F946;background:rgba(197,249,70,0.15);border-radius:4px;padding:1px 5px;">2</span>
              Проверь остаток
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5F946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            <span style="display:inline-flex;align-items:center;gap:5px;font-family:'Inter',sans-serif;font-size:11px;color:#F0F4FF;">
              <span style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#C5F946;background:rgba(197,249,70,0.15);border-radius:4px;padding:1px 5px;">3</span>
              Нажми «Беру!» у кассы
            </span>
          </div>
        </div>

        <!-- Cards -->
        <div class="trophy-cards">
          <div v-for="(p, idx) in [...checkedItems, ...affordableItems]" :key="p.id" class="trophy-card" :class="{ 'trophy-card--afford': !taking.includes(p.id), 'trophy-card--checked': taking.includes(p.id) }" :style="{ animation: (taking.includes(p.id) || (!taking.includes(p.id) && tickets > 0 && p.tickets <= afterTaking)) ? `pz-cartAfford 2.5s ${idx * 0.3}s ease-in-out infinite` : 'none' }" @click="toggleTaking(p.id)">
            <!-- Shimmer -->
            <div class="trophy-card__shimmer" />
            <div class="trophy-card__row">
              <!-- Checkbox -->
              <div class="trophy-card__check" :class="{ 'trophy-card__check--on': taking.includes(p.id) }">
                <PrizeIcons v-if="taking.includes(p.id)" name="ui_check" :size="12" />
              </div>
              <!-- Info -->
              <div class="trophy-card__info">
                <div class="trophy-card__name" :class="{ 'trophy-card__name--bold': taking.includes(p.id) }">{{ p.name }}</div>
                <div class="trophy-card__meta">
                  <span class="trophy-card__tik" :class="{ 'trophy-card__tik--lime': taking.includes(p.id) }">{{ fmtNum(p.tickets) }} тик</span>
                  <span v-if="findCollection(p.id)" class="trophy-card__col" :class="{ 'trophy-card__col--lime': taking.includes(p.id) }">{{ findCollection(p.id).name }}</span>
                </div>
              </div>
              <!-- Right: Беру or remove -->
              <template v-if="taking.includes(p.id)">
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                  <span class="pz-beru-desk-hint" style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(197,249,70,0.5);white-space:nowrap;line-height:1.4;text-align:right;">нажми<br/>у кассы</span>
                  <button class="trophy-card__beru" @click.stop="handleCollectOne(p.id)">
                    <PrizeIcons name="ui_trophy" :size="14" />
                    Беру!
                  </button>
                </div>
              </template>
              <button v-else class="trophy-card__remove" :class="{ 'trophy-card__remove--active': confirmRemoveId === p.id }" @click.stop="confirmRemoveId = confirmRemoveId === p.id ? null : p.id">✕</button>
            </div>
            <!-- Confirm remove -->
            <div v-if="confirmRemoveId === p.id" class="trophy-card__confirm pz-fade-up">
              <div class="trophy-card__confirm-title">Убрать из корзины?</div>
              <div class="trophy-card__confirm-text">Приз останется в каталоге — сможешь добавить снова в любой момент.</div>
              <div class="trophy-card__confirm-btns">
                <button class="trophy-card__confirm-no" @click.stop="confirmRemoveId = null">Оставить</button>
                <button class="trophy-card__confirm-yes" @click.stop="handleCart(p.id); confirmRemoveId = null">Да, убрать</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Надо подкопить -->
      <div v-if="savingItems.length > 0" :style="{ marginTop: (checkedItems.length > 0 || affordableItems.length > 0) ? 0 : '24px' }">
        <div class="trophy-section-header">
          <div class="trophy-section-header__label">Надо подкопить — {{ savingItems.length }}</div>
          <div class="trophy-section-header__line" />
        </div>
        <div class="trophy-cards">
          <div v-for="p in savingItems" :key="p.id" class="trophy-card trophy-card--saving">
            <div class="trophy-card__row" style="padding: 11px 12px;">
              <div class="trophy-card__info">
                <div class="trophy-card__name">{{ p.name }}</div>
                <div class="trophy-card__meta">
                  <span class="trophy-card__tik">{{ fmtNum(p.tickets) }} тик</span>
                  <span v-if="findCollection(p.id)" class="trophy-card__col">{{ findCollection(p.id).name }}</span>
                </div>
              </div>
              <button class="trophy-card__remove" :class="{ 'trophy-card__remove--active': confirmRemoveId === p.id }" @click.stop="confirmRemoveId = confirmRemoveId === p.id ? null : p.id">✕</button>
            </div>
            <!-- Confirm remove -->
            <div v-if="confirmRemoveId === p.id" class="trophy-card__confirm pz-fade-up">
              <div class="trophy-card__confirm-title">Убрать из корзины?</div>
              <div class="trophy-card__confirm-text">Приз останется в каталоге — сможешь добавить снова в любой момент.</div>
              <div class="trophy-card__confirm-btns">
                <button class="trophy-card__confirm-no" @click.stop="confirmRemoveId = null">Оставить</button>
                <button class="trophy-card__confirm-yes" @click.stop="handleCart(p.id); confirmRemoveId = null">Да, убрать</button>
              </div>
            </div>
            <!-- Progress bar -->
            <div v-if="tickets > 0" class="trophy-card__progress">
              <div class="trophy-card__progress-bar">
                <div class="trophy-card__progress-fill" :style="{ width: Math.min(98, Math.round(afterTaking / p.tickets * 100)) + '%' }" />
              </div>
              <span class="trophy-card__progress-need">−{{ fmtNum(Math.max(0, p.tickets - afterTaking)) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- TROPHIES -->
    <div v-if="collectedItems.length > 0" class="trophy-trophies" :style="{ marginTop: cartItems.length === 0 ? '16px' : '24px' }">
      <div class="trophy-trophies__header">
        <div class="trophy-trophies__title">Мои трофеи</div>
        <div style="text-align: right;">
          <div class="trophy-trophies__label">Выигрыш</div>
          <div class="trophy-trophies__total">{{ fmtNum(totalTickets) }} тик</div>
        </div>
      </div>
      <div class="trophy-cards">
        <div v-for="p in collectedItems" :key="p.id" class="trophy-trophy-card">
          <div class="trophy-trophy-card__row">
            <div class="trophy-trophy-card__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/></svg>
            </div>
            <div class="trophy-trophy-card__info">
              <div class="trophy-trophy-card__name">{{ p.name }}</div>
              <div class="trophy-trophy-card__meta">
                <span class="trophy-trophy-card__tik">{{ fmtNum(p.tickets) }} тик</span>
                <span v-if="findCollection(p.id)" class="trophy-trophy-card__col">{{ findCollection(p.id).name }} {{ colProgress(findCollection(p.id).id) }}/{{ (collections[findCollection(p.id).id] || []).length }}</span>
              </div>
            </div>
            <button class="trophy-trophy-card__undo" :class="{ 'trophy-trophy-card__undo--active': confirmUndoId === p.id }" @click="confirmUndoId = confirmUndoId === p.id ? null : p.id">отмена</button>
          </div>
          <!-- Confirm undo -->
          <div v-if="confirmUndoId === p.id" class="trophy-trophy-card__confirm pz-fade-up">
            <div class="trophy-trophy-card__confirm-title">Вернуть приз в корзину?</div>
            <div class="trophy-trophy-card__confirm-text">Приз вернётся в список «Можно получить», а {{ fmtNum(p.tickets) }} тикетов — обратно на баланс.</div>
            <div class="trophy-trophy-card__confirm-btns">
              <button class="trophy-trophy-card__confirm-no" @click="confirmUndoId = null">Оставить</button>
              <button class="trophy-trophy-card__confirm-yes" @click="handleUndo(p.id); confirmUndoId = null">Да, вернуть</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RESET -->
    <div v-if="cart.length > 0 || collected.length > 0" class="trophy-reset-area">
      <button v-if="!confirmReset" class="trophy-reset-btn" @click="confirmReset = true">Сбросить корзину</button>
      <div v-else class="trophy-reset-confirm pz-fade-up">
        <div class="trophy-reset-confirm__title">Сбросить всю корзину?</div>
        <div class="trophy-reset-confirm__text">Списки «Можно получить» и «Надо подкопить» очистятся. Полученные трофеи вернутся в каталог, а списанные тикеты — на баланс.</div>
        <div class="trophy-reset-confirm__btns">
          <button class="trophy-reset-confirm__no" @click="confirmReset = false">Отмена</button>
          <button class="trophy-reset-confirm__yes" @click="handleReset(); confirmReset = false">Да, сбросить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* ── EMPTY STATE ── */
.trophy-empty { text-align: center; padding: 48px 24px 40px; }
.trophy-empty__title { font-family: 'Inter',sans-serif; font-weight: 800; font-size: 20px; color: var(--pz-tx1); margin-bottom: 8px; }
.trophy-empty__sub { font-size: 14px; color: var(--pz-tx2); font-family: 'Inter',sans-serif; line-height: 1.5; margin-bottom: 28px; max-width: 300px; margin-left: auto; margin-right: auto; }
.c-lime { color: var(--pz-lime); font-weight: 600; }
.c-yellow { color: var(--pz-yellow); font-weight: 600; }
.trophy-empty__steps { max-width: 320px; margin: 0 auto 32px; text-align: left; }
.trophy-empty__divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(74,90,173,0.25) 20%, rgba(74,90,173,0.25) 80%, transparent); }
.trophy-empty__step { display: flex; gap: 10px; align-items: flex-start; padding: 14px 0; }
.trophy-empty__step-n { font-family: 'Space Mono',monospace; font-size: 11px; font-weight: 700; color: var(--pz-lime); background: rgba(197,249,70,0.12); border-radius: 6px; padding: 3px 8px; flex-shrink: 0; margin-top: 1px; }
.trophy-empty__step-text { font-family: 'Inter',sans-serif; font-size: 13px; color: var(--pz-tx2); line-height: 1.5; }
.trophy-empty__step-bold { font-weight: 700; color: var(--pz-tx1); }
.trophy-empty__cta { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; max-width: 320px; margin: 0 auto; padding: 16px 32px; border-radius: 12px; cursor: pointer; background: var(--pz-lime); border: none; color: #1a1840; font-family: 'Inter',sans-serif; font-size: 16px; font-weight: 700; box-shadow: 0 0 20px rgba(197,249,70,0.3); animation: pz-btnPulse 2.5s ease-in-out infinite; position: relative; overflow: hidden; }

/* ── DASHBOARD ── */
.trophy-dash { border-radius: 14px; background: rgba(10,8,28,0.7); border: 1px solid rgba(74,90,173,0.3); padding: 14px 16px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; }
.trophy-dash--hint { border-radius: 14px 14px 0 0; border-bottom: none; }
.trophy-dash__cell { text-align: center; }
.trophy-dash__label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--pz-txm); margin-bottom: 4px; font-family: 'Inter',sans-serif; }
.trophy-dash__val { font-family: 'Space Mono',monospace; font-size: 22px; font-weight: 700; color: var(--pz-tx2); line-height: 1; }
.trophy-dash__val--yellow { color: var(--pz-yellow); text-shadow: 0 0 12px rgba(255,214,10,0.35); }
.trophy-dash__val--lime { color: var(--pz-lime); text-shadow: 0 0 12px rgba(197,249,70,0.3); }
.trophy-dash__val--orange { color: var(--pz-orange); text-shadow: 0 0 12px rgba(255,107,0,0.4); }
.trophy-dash__val--green { color: var(--pz-green); }
.trophy-dash__val--cyan { color: var(--pz-cyan); text-shadow: 0 0 12px rgba(0,212,255,0.2); }
.trophy-dash__unit { font-size: 10px; color: var(--pz-txm); margin-top: 3px; font-family: 'Inter',sans-serif; }
.trophy-dash__sep { width: 1px; height: 40px; background: rgba(74,90,173,0.3); margin: 0 12px; }
.trophy-dash__hint-row { border-radius: 0 0 14px 14px; background: rgba(10,8,28,0.5); border: 1px solid rgba(74,90,173,0.3); border-top: 1px solid rgba(74,90,173,0.15); padding: 8px 16px; display: flex; align-items: center; gap: 8px; }
.trophy-dash__hint-text { font-family: 'Inter',sans-serif; font-size: 12px; line-height: 1.4; }

/* ── GO TO CATALOG ── */
.trophy-goto-catalog { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 10px; padding: 13px 18px; border-radius: 12px; cursor: pointer; background: linear-gradient(135deg,rgba(0,212,255,0.1),rgba(74,90,173,0.15)); border: 1px solid rgba(0,212,255,0.4); box-shadow: 0 0 20px rgba(0,212,255,0.1); transition: all 0.2s; }
.trophy-goto-catalog__label { font-family: 'Inter',sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(0,212,255,0.7); margin-bottom: 3px; }
.trophy-goto-catalog__val { font-family: 'Space Mono',monospace; font-size: 14px; font-weight: 700; color: var(--pz-cyan); }
.trophy-goto-catalog__arrow { display: flex; align-items: center; gap: 6px; color: var(--pz-cyan); font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 700; }

/* ── SECTION HEADERS ── */
.trophy-section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.trophy-section-header__label { font-family: 'Inter',sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--pz-tx2); }
.trophy-section-header__label--lime { color: var(--pz-lime); }
.trophy-section-header__line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(122,139,168,0.2), transparent); }
.trophy-section-header__line--lime { background: linear-gradient(90deg, rgba(197,249,70,0.15), transparent); }

/* ── ONBOARDING ── */
.trophy-onboard { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 12px; padding: 8px 12px; border-radius: 10px; background: rgba(197,249,70,0.04); border: 1px solid rgba(197,249,70,0.12); }
.trophy-onboard__steps { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.trophy-onboard__step { display: inline-flex; align-items: center; gap: 5px; font-family: 'Inter',sans-serif; font-size: 11px; color: var(--pz-tx1); }
.trophy-onboard__n { font-family: 'Space Mono',monospace; font-size: 10px; font-weight: 700; color: var(--pz-lime); background: rgba(197,249,70,0.15); border-radius: 4px; padding: 1px 5px; }

/* ── CART CARDS ── */
.trophy-cards { display: flex; flex-direction: column; gap: 8px; }
.trophy-card { border-radius: 12px; position: relative; overflow: hidden; background: rgba(28,26,62,0.7); border: 1px solid rgba(255,214,10,0.15); transition: all 0.2s; }
.trophy-card--checked, .trophy-card--afford { background: linear-gradient(135deg,rgba(197,249,70,0.06),rgba(28,26,62,0.85)); border: 2px solid rgba(197,249,70,0.5); box-shadow: 0 0 16px rgba(197,249,70,0.15), inset 0 0 20px rgba(197,249,70,0.03); }
.trophy-card__shimmer { position: absolute; inset: 0; border-radius: 12px; pointer-events: none; overflow: hidden; }
.trophy-card--checked .trophy-card__shimmer::after,
.trophy-card--afford .trophy-card__shimmer::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 60%;
  background: linear-gradient(90deg, transparent, rgba(197,249,70,0.07), transparent);
  animation: pz-cartShimmer 3s ease-in-out infinite;
}
.trophy-card__row { display: flex; align-items: center; gap: 10px; padding: 13px 12px; cursor: pointer; position: relative; z-index: 1; }
.trophy-card--saving .trophy-card__row { cursor: default; }
.trophy-card__check { width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0; border: 2px solid var(--pz-lime); background: rgba(197,249,70,0.12); display: flex; align-items: center; justify-content: center; transition: all 0.18s; color: #1c1a3e; }
.trophy-card__check--on { background: var(--pz-lime); }
.trophy-card__info { flex: 1; min-width: 0; }
.trophy-card__name { font-size: 13px; font-weight: 600; color: var(--pz-tx1); font-family: 'Inter',sans-serif; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 3px; }
.trophy-card__name--bold { font-weight: 700; }
.trophy-card__meta { font-size: 11px; font-family: 'Inter',sans-serif; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.trophy-card__tik { color: var(--pz-yellow); font-weight: 700; font-family: 'Space Mono',monospace; font-size: 14px; }
.trophy-card__tik--lime { color: var(--pz-lime); text-shadow: 0 0 8px rgba(197,249,70,0.3); }
.trophy-card__col { font-size: 10px; font-weight: 700; font-family: 'Inter',sans-serif; color: var(--pz-tx2); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 1px 7px; white-space: nowrap; }
.trophy-card__col--lime { color: var(--pz-lime); background: rgba(197,249,70,0.1); border-color: rgba(197,249,70,0.25); }
.trophy-card__beru { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; cursor: pointer; background: var(--pz-lime); border: 1px solid rgba(197,249,70,0.8); color: #1a1840; font-family: 'Inter',sans-serif; font-size: 13px; font-weight: 700; white-space: nowrap; box-shadow: 0 0 16px rgba(197,249,70,0.3); }
.trophy-card__remove { background: transparent; border: none; color: rgba(255,255,255,0.35); cursor: pointer; font-size: 15px; padding: 2px 8px; line-height: 1; transition: color 0.18s; flex-shrink: 0; align-self: flex-start; margin-top: 2px; }
.trophy-card__remove:hover, .trophy-card__remove--active { color: rgba(255,100,100,0.7); }
.trophy-card__confirm { margin: 0 12px 10px; padding: 10px 14px; border-radius: 9px; background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.25); position: relative; z-index: 1; }
.trophy-card__confirm-title { font-family: 'Inter',sans-serif; font-size: 12px; color: var(--pz-tx1); margin-bottom: 3px; font-weight: 600; }
.trophy-card__confirm-text { font-family: 'Inter',sans-serif; font-size: 11px; color: var(--pz-tx2); margin-bottom: 10px; line-height: 1.4; }
.trophy-card__confirm-btns { display: flex; gap: 8px; }
.trophy-card__confirm-no { flex: 1; padding: 8px 0; border-radius: 8px; cursor: pointer; background: rgba(74,90,173,0.15); border: 1px solid rgba(74,90,173,0.3); color: var(--pz-tx2); font-family: 'Inter',sans-serif; font-size: 11px; font-weight: 600; }
.trophy-card__confirm-yes { flex: 1; padding: 8px 0; border-radius: 8px; cursor: pointer; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); color: rgba(255,100,100,0.9); font-family: 'Inter',sans-serif; font-size: 11px; font-weight: 700; }
.trophy-card__progress { display: flex; align-items: center; gap: 8px; margin: 0 12px 10px; position: relative; z-index: 1; }
.trophy-card__progress-bar { flex: 1; height: 7px; background: rgba(255,255,255,0.25); border-radius: 4px; overflow: hidden; }
.trophy-card__progress-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, rgba(255,214,10,0.3) 0%, var(--pz-yellow) 40%, var(--pz-yellow) 100%); box-shadow: 0 0 8px rgba(255,214,10,0.4); animation: pz-progressGlow 2s ease-in-out infinite; transition: width 0.4s ease; }
.trophy-card__progress-need { font-family: 'Space Mono',monospace; font-size: 10px; font-weight: 700; color: var(--pz-tx1); flex-shrink: 0; white-space: nowrap; }

/* ── TROPHIES ── */
.trophy-trophies { background: linear-gradient(145deg,rgba(255,214,10,0.04),rgba(28,26,62,0.6)); border: 1px solid rgba(255,214,10,0.18); border-radius: 14px; padding: 18px 18px 14px; }
.trophy-trophies__header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
.trophy-trophies__title { font-family: 'Inter',sans-serif; font-weight: 700; font-size: 18px; color: var(--pz-yellow); }
.trophy-trophies__label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--pz-txm); margin-bottom: 3px; font-family: 'Inter',sans-serif; }
.trophy-trophies__total { font-family: 'Space Mono',monospace; font-weight: 700; font-size: 20px; color: var(--pz-yellow); text-shadow: 0 0 12px rgba(255,214,10,0.3); }
.trophy-trophy-card { display: flex; flex-direction: column; border-radius: 9px; background: rgba(255,214,10,0.03); border: 1px solid rgba(255,214,10,0.1); overflow: hidden; }
.trophy-trophy-card__row { display: flex; align-items: center; gap: 10px; padding: 9px 12px; }
.trophy-trophy-card__icon { flex-shrink: 0; width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid rgba(255,214,10,0.3); background: rgba(255,214,10,0.07); display: flex; align-items: center; justify-content: center; color: var(--pz-yellow); }
.trophy-trophy-card__info { flex: 1; min-width: 0; }
.trophy-trophy-card__name { font-size: 12px; font-weight: 600; color: var(--pz-tx1); font-family: 'Inter',sans-serif; }
.trophy-trophy-card__meta { display: flex; align-items: center; gap: 6px; margin-top: 3px; flex-wrap: wrap; }
.trophy-trophy-card__tik { font-size: 10px; color: var(--pz-tx1); font-family: 'Space Mono',monospace; }
.trophy-trophy-card__col { font-size: 10px; font-weight: 700; font-family: 'Inter',sans-serif; color: rgba(255,214,10,0.7); background: rgba(255,214,10,0.08); border: 1px solid rgba(255,214,10,0.2); border-radius: 6px; padding: 1px 7px; white-space: nowrap; }
.trophy-trophy-card__undo { background: rgba(255,214,10,0.06); border: 1px solid rgba(255,214,10,0.18); border-radius: 8px; color: rgba(255,214,10,0.6); cursor: pointer; font-size: 12px; font-weight: 600; padding: 7px 14px; font-family: 'Inter',sans-serif; transition: all 0.18s; flex-shrink: 0; }
.trophy-trophy-card__undo:hover, .trophy-trophy-card__undo--active { background: rgba(255,214,10,0.12); border-color: rgba(255,214,10,0.35); }
.trophy-trophy-card__confirm { margin: 0 12px 10px; padding: 10px 14px; border-radius: 9px; background: rgba(255,214,10,0.04); border: 1px solid rgba(255,214,10,0.15); }
.trophy-trophy-card__confirm-title { font-family: 'Inter',sans-serif; font-size: 12px; color: var(--pz-tx1); margin-bottom: 3px; font-weight: 600; }
.trophy-trophy-card__confirm-text { font-family: 'Inter',sans-serif; font-size: 11px; color: var(--pz-tx2); margin-bottom: 10px; line-height: 1.4; }
.trophy-trophy-card__confirm-btns { display: flex; gap: 8px; }
.trophy-trophy-card__confirm-no { flex: 1; padding: 8px 0; border-radius: 8px; cursor: pointer; background: rgba(74,90,173,0.15); border: 1px solid rgba(74,90,173,0.3); color: var(--pz-tx2); font-family: 'Inter',sans-serif; font-size: 11px; font-weight: 600; }
.trophy-trophy-card__confirm-yes { flex: 1; padding: 8px 0; border-radius: 8px; cursor: pointer; background: rgba(255,214,10,0.12); border: 1px solid rgba(255,214,10,0.35); color: var(--pz-yellow); font-family: 'Inter',sans-serif; font-size: 11px; font-weight: 700; }

/* ── RESET ── */
.trophy-reset-area { display: flex; flex-direction: column; align-items: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); gap: 10px; }
.trophy-reset-btn { background: transparent; border: 1px solid rgba(255,100,100,0.2); border-radius: 10px; color: rgba(255,100,100,0.5); cursor: pointer; padding: 9px 24px; font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 600; transition: all 0.2s; }
.trophy-reset-btn:hover { border-color: rgba(255,100,100,0.5); color: rgba(255,100,100,0.85); background: rgba(255,100,100,0.06); }
.trophy-reset-confirm { width: 100%; max-width: 320px; padding: 14px 18px; border-radius: 12px; background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.3); }
.trophy-reset-confirm__title { font-family: 'Inter',sans-serif; font-size: 13px; color: rgba(255,120,120,0.9); margin-bottom: 6px; font-weight: 600; text-align: center; }
.trophy-reset-confirm__text { font-family: 'Inter',sans-serif; font-size: 11px; color: var(--pz-tx2); margin-bottom: 12px; text-align: center; line-height: 1.4; }
.trophy-reset-confirm__btns { display: flex; gap: 8px; }
.trophy-reset-confirm__no { flex: 1; padding: 10px 0; border-radius: 9px; cursor: pointer; background: rgba(74,90,173,0.15); border: 1px solid rgba(74,90,173,0.3); color: var(--pz-tx2); font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 600; }
.trophy-reset-confirm__yes { flex: 1; padding: 10px 0; border-radius: 9px; cursor: pointer; background: rgba(220,38,38,0.18); border: 1px solid rgba(220,38,38,0.5); color: rgba(255,100,100,1); font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 700; }

/* ── Mobile: bigger fonts in cart ── */
@media (max-width: 768px) {
  .trophy-card__name { font-size: 15px !important; }
  .trophy-card__name--bold { font-size: 15px !important; }
  .trophy-card__tik { font-size: 16px !important; }
  .trophy-card__col { font-size: 12px !important; }
  .trophy-card__beru { font-size: 15px !important; padding: 11px 20px !important; }
  .trophy-card__check { width: 30px !important; height: 30px !important; }
  .trophy-section-header__label { font-size: 12px !important; }
  .trophy-trophies__title { font-size: 20px !important; }
  .trophy-trophies__total { font-size: 22px !important; }
  .trophy-trophy-card__name { font-size: 14px !important; }
  .trophy-trophy-card__tik { font-size: 12px !important; }
  .trophy-trophy-card__col { font-size: 12px !important; }
  .trophy-trophy-card__undo { font-size: 14px !important; padding: 9px 18px !important; }
  .trophy-dash__val { font-size: 24px !important; }
  .trophy-dash__label { font-size: 12px !important; }
  .trophy-goto-catalog__val { font-size: 16px !important; }
  .trophy-goto-catalog__arrow { font-size: 14px !important; }
  .trophy-card__progress-need { font-size: 12px !important; }
}
</style>
