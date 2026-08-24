/**
 * boom-stat — собственный счётчик b00m.fun. Заменил Plausible (решение
 * владельца 24.08: платить за внешний сервис не за что, а данные нужны
 * в той же Google-таблице, где живёт вся остальная отчётность).
 *
 * Куда пишет: Google Apps Script, код — рядом в apps-script-boom-stat.js.
 * Адрес берётся из переменной сборки VITE_STAT_API (GitHub → Variables).
 *
 * ⚠ ПЕРЕМЕННОЙ НЕТ — СЧЁТЧИК МОЛЧА ВЫКЛЮЧЕН. Так и задумано: локально
 *   у владельца её нет, и незачем засорять боевую таблицу отладкой.
 *   Но именно на этих граблях уже стояли с Plausible (см. комментарий
 *   в TurboSubscribe.vue): проверка `if (window.plausible)` не отличала
 *   работающую аналитику от выключенной. Поэтому здесь есть честный
 *   признак: window.boomStat.enabled — true только когда адрес задан.
 *
 * ⚠ ЧТО СОБИРАЕМ. Случайный номер браузера (visitor) и номер визита
 *   (session). Ни имени, ни почты, ни телефона, ни IP — их у нас просто
 *   нет. Номер визита живёт до закрытия вкладки, номер браузера — год.
 *
 * ⚠ СОБЫТИЯ ПРОВЕРЯЮТСЯ НА СТОРОНЕ ТАБЛИЦЫ. Добавил новую кнопку —
 *   впиши её событие в список EVENTS в apps-script-boom-stat.js,
 *   иначе строка до таблицы не доедет.
 */

const API = import.meta.env.VITE_STAT_API || ''

const VISITOR_KEY = 'boom_stat_vid'
const SESSION_KEY = 'boom_stat_sid'
const SOURCE_KEY  = 'boom_stat_src'   // источник запоминаем на весь визит

/* Известные источники. Пишем в таблицу только их: иначе в колонку source
   попадёт всё, что кто угодно допишет в адресную строку, и свод превратится
   в помойку. Наклейка на двери Охты = 'sticker-ohta'. */
const SOURCES = [
  'sticker-ohta',      // наклейки на дверях парковки, Охта Молл
  'sticker-piterland',
  'sticker-june',
  'sticker-mari',
  'tv',                // экраны в парках
  'tent',              // тейблтенты на столах
  'qr',                // прочие печатные QR
  'vk',
  'yandex'
]

let visitor = ''
let session = ''
let source  = ''
let first   = false

/* Очередь. Между открытием страницы и первым кликом браузер может ещё не
   успеть отдать запрос — накопленное шлём одной пачкой. */
let queue = []
let flushTimer = null

function rnd () {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

function readStore (store, key) {
  try { return store.getItem(key) || '' } catch (e) { return '' }
}
function writeStore (store, key, value) {
  try { store.setItem(key, value) } catch (e) { /* приватный режим — переживём */ }
}

/** Один раз при загрузке сайта: завести номера браузера и визита. */
function init () {
  if (typeof window === 'undefined') return

  visitor = readStore(localStorage, VISITOR_KEY)
  if (!visitor) {
    visitor = rnd()
    first = true
    writeStore(localStorage, VISITOR_KEY, visitor)
  }

  session = readStore(sessionStorage, SESSION_KEY)
  if (!session) {
    session = rnd()
    writeStore(sessionStorage, SESSION_KEY, session)
  }

  /* Источник: ?from=sticker-ohta в ссылке QR. Запоминаем на визит, чтобы
     он не потерялся, когда гость уйдёт со страницы бонуса вглубь сайта. */
  const fromUrl = new URLSearchParams(location.search).get('from') || ''
  if (SOURCES.indexOf(fromUrl) !== -1) {
    source = fromUrl
    writeStore(sessionStorage, SOURCE_KEY, source)
  } else {
    source = readStore(sessionStorage, SOURCE_KEY)
  }
}

function device () {
  return window.matchMedia && window.matchMedia('(max-width: 820px)').matches
    ? 'mobile' : 'desktop'
}

/** Сайт-источник. Свои же страницы в него не пишем — это не переход извне. */
function referrer () {
  try {
    const r = document.referrer
    if (!r) return ''
    if (new URL(r).hostname === location.hostname) return ''
    return r.slice(0, 120)
  } catch (e) { return '' }
}

function flush () {
  flushTimer = null
  if (!API || !queue.length) return

  const body = JSON.stringify(queue)
  queue = []

  /* sendBeacon переживает уход со страницы — а именно в этот момент чаще
     всего и случается интересное («Войти» открывает чужой сайт).
     Content-Type текстовый: так браузер не спрашивает у Google разрешения
     заранее (preflight), которого Apps Script всё равно не даёт. */
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' })
      if (navigator.sendBeacon(API, blob)) return
    }
  } catch (e) { /* упало — уходим в fetch ниже */ }

  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    redirect: 'follow',
    keepalive: true,
    body
  }).catch(() => {})
}

/**
 * Отправить событие.
 * @param {string} name  — ровно как в списке EVENTS в Apps Script
 * @param {object} props — { park } и что угодно ещё из колонок hits
 */
export function track (name, props) {
  if (typeof window === 'undefined' || !API) return
  if (!visitor) init()

  queue.push({
    event: name,
    page: location.pathname,
    park: (props && props.park) || '',
    source,
    ref: referrer(),
    visitor,
    session,
    first: first ? 1 : 0,
    device: device()
  })
  first = false   // «впервые» бывает только у одного события

  /* Клик по ссылке наружу ждать не может — шлём сразу. Открытие страницы
     подождёт полсекунды: вдруг гость тут же нажмёт кнопку, и уедет пачка. */
  if (name === 'pageview') {
    if (!flushTimer) flushTimer = setTimeout(flush, 500)
  } else {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null }
    flush()
  }
}

/** Открытие страницы. Зовётся из theme/index.ts на каждый переход. */
export function pageview () {
  track('pageview')
}

/** Подключение. Один раз, из theme/index.ts. */
export function setup () {
  if (typeof window === 'undefined') return

  init()

  /* Глобальный доступ — им пользуется ванильный скрипт в config.mts,
     который живёт вне Vue и импортировать модуль не может. */
  window.boomStat = { track, enabled: !!API }
  window.boomTrack = track

  /* Успеть отправить накопленное, когда вкладку закрывают или сворачивают. */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
  window.addEventListener('pagehide', flush)
}
