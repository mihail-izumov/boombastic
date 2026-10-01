<script setup>
/**
 * PopolnitPage — страница «Пополнить карту» для гостя с телефона.
 * Адрес: b00m.fun/popolnit/<парк>, файл popolnit/<парк>.md
 *
 * Зачем она есть: гость сканирует QR с ТВ-экрана у кассы (boom-cmd/media/
 * kassa/). На экране — три суммы, которые кассир называет по числу гостей,
 * и подарок за каждую. Здесь — те же суммы и те же числа, плюс дорога в
 * личный кабинет: пополнять можно с телефона, подарки те же, что на кассе.
 *
 * Образец устройства — KartaPage.vue: вёрстка здесь, тексты и переключатели
 * по паркам — в .vitepress/data/popolnit.js, название, цвет и кабинет —
 * в data/parks.js.
 *
 * ⚠ СТРАНИЦА — ПРОДОЛЖЕНИЕ ТВ-ЭКРАНА (01.10, как «Твоя карта»): плашка
 *   «ПАРК РАЗВЛЕЧЕНИЙ | парк», оффер «Заряди карту онлайн ⇄ сейчас» с
 *   табло, кнопка кабинета на первом экране, карточки X1 / X2 / X4–6 в
 *   цветах экрана с пиксельными лицами, бейджи бонусов, «Не хватило?
 *   Докинем…». Тексты — popolnit.js, сверены с kassa.data.json экрана.
 *
 * ⚠ СЧЁТЧИК. Три события: «Пополнение — открыл» (страница показалась),
 *   «Пополнение — кабинет» (нажал кнопку кабинета) и «Пополнение — бонус»
 *   (нажал «Нет карты? +500»). Все вписаны в EVENTS
 *   apps-script-boom-stat.js. Источник (?from=kassa-tv) счётчик берёт из
 *   адреса сам — по списку SOURCES в boom-stat.js.
 *   «Нажал кнопку» ≠ «пополнил»: счётчика в кабинетах нет.
 *
 * ⚠ ТИКЕТЫ — ТОЛЬКО ЗА НАЛИЧНЫЕ НА КАССЕ. С 01.10 (решение владельца) они
 *   пишутся прямо в карточке суммы, как на ТВ-экране, и всегда со словами
 *   «за наличные» — чтобы никто не прочёл, что тикеты дают и за
 *   онлайн-пополнение. Рядом — «≈ +N игр бонус» (бонус / 70 ₽). Тикеты —
 *   только за точную сумму: из трёх карточек они есть лишь у 5 000 ₽.
 */
import { onMounted, onUnmounted, reactive } from 'vue'
import { popolnitPage, POPOLNIT_TEXT as T } from '../data/popolnit'
import { track } from '../analytics/boom-stat'

const props = defineProps({
  /* Имя страницы: 'ohtamall'. Совпадает с именем файла в popolnit/. */
  page: { type: String, required: true }
})

const data = popolnitPage(props.page)

/* 1500 → «1 500». Неразрывный пробел: число не рвётся по строкам.
   Не toLocaleString: на сборке и в браузере он даёт разные пробелы. */
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')

/* Строка «докинем»: до «?» — крупный вопрос, после — ответ, как на экране */
const hallCut = T.topupInHall.indexOf('?') + 1
const hallQ = hallCut > 0 ? T.topupInHall.slice(0, hallCut) : ''
const hallA = (hallCut > 0 ? T.topupInHall.slice(hallCut) : T.topupInHall).trim()
const [hallA1, hallA2] = hallA.includes('без очереди') ? hallA.split('без очереди') : [hallA, null]

/* Молния владельца — та же, что на экране (после «на карте» и в «0 ⚡») */
const BOLT = 'M491.3,387.2 L735.7,0 L0,578.8 L376.5,558.1 L202,926.5 L784.1,366.6Z'

/* ── Пиксельные лица — те же, что на экране (kassa.js, FACES/CREWS):
   сетка 12×12, белые пиксели на цветной плашке; моргают вразнобой. */
const FACES = {
  happy:   [[2,4,1,1],[3,3,1,1],[4,4,1,1],[7,4,1,1],[8,3,1,1],[9,4,1,1],[3,7,1,1],[4,8,4,1],[8,7,1,1]],
  wink:    [[2,4,1,1],[3,3,1,1],[4,4,1,1],[7,3,2,2],[4,7,1,1],[5,8,2,1],[7,7,1,1]],
  love:    [[2,3,1,1],[4,3,1,1],[2,4,3,1],[3,5,1,1],[7,3,1,1],[9,3,1,1],[7,4,3,1],[8,5,1,1],[3,7,1,1],[4,8,4,1],[8,7,1,1]],
  laugh:   [[2,3,1,1],[3,4,1,1],[2,5,1,1],[9,3,1,1],[8,4,1,1],[9,5,1,1],[3,7,6,1],[4,8,4,1]],
  wow:     [[3,3,2,2],[7,3,2,2],[5,7,2,1],[4,8,1,1],[7,8,1,1],[5,9,2,1]],
  cool:    [[2,4,8,1],[2,5,3,1],[7,5,3,1],[5,8,3,1],[8,7,1,1]],
  tongue:  [[3,4,1,1],[8,4,1,1],[3,7,6,1],[6,8,2,2]],
  excited: [[3,3,1,2],[8,3,1,2],[3,7,6,1],[3,8,1,1],[8,8,1,1],[4,9,4,1]],
  game:    [[2,2,1,1],[3,3,1,1],[9,2,1,1],[8,3,1,1],[3,4,1,1],[8,4,1,1],[3,7,6,1],[3,8,1,1],[5,8,1,1],[7,8,1,1]]
}
const BLINK = [[2,4,3,1],[7,4,3,1]]
const CREWS = {
  one:   [['happy', '#3d47a0']],
  two:   [['wink', '#c2187a'], ['love', '#1b8a6b']],
  group: [['laugh', '#7a3fd1'], ['wow', '#d9480f'], ['cool', '#1864ab'], ['tongue', '#a61e4d'], ['excited', '#0b7285'], ['game', '#5c940d']]
}
const rects = (list) => list.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')
let avaN = 0
const crew = (key) => (CREWS[key] || []).map(([face, color]) => {
  const k = avaN++
  const eyes = FACES[face].filter((r) => r[1] < 6)
  const mouth = FACES[face].filter((r) => r[1] >= 6)
  return {
    color,
    t: (4.4 + ((k * 0.53) % 1.4)).toFixed(2) + 's',
    d: (-((k * 1.37) % 4.4)).toFixed(2) + 's',
    svg: `<g class="f-eyes">${rects(eyes)}</g><g class="f-blink">${rects(face === 'cool' ? eyes : BLINK)}</g>${rects(mouth)}`
  }
})
const offers = data ? data.offers.map((o) => ({ ...o, crew: crew(o.key) })) : []

/* ── Табло «онлайн ⇄ сейчас» — как на экране: каждая буква прокручивает
   случайные и встаёт на новую, слева направо. Слово стоит HOLD_MS. Ширина
   слова — по более широкому из двух (оба лежат невидимо в той же ячейке),
   поэтому заголовок не дёргается. Без движения (reduced motion) — стоит
   «онлайн». */
const WORDS = T.words
const LEN = Math.max(...WORDS.map((w) => [...w].length))
const word = (k) => [...WORDS[k]].concat(Array(LEN).fill('')).slice(0, LEN)
const board = reactive(word(0).map((ch) => ({ ch, spin: false, tick: false, land: false })))
const HOLD_MS = 4200
const LETTER_MS = 420
const STAGGER_MS = 80
const TICK_MS = 55
const SCRAMBLE = [...'абвгдезиклнопрстухчэя']
let cur = 0
let timers = []
let loop = 0
const later = (fn, ms) => timers.push(setTimeout(fn, ms))
function flip () {
  const to = word(1 - cur)
  cur = 1 - cur
  board.forEach((cell, i) => {
    const t0 = i * STAGGER_MS
    for (let t = 0; t < LETTER_MS; t += TICK_MS) {
      later(() => { cell.ch = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]; cell.spin = true; cell.tick = !cell.tick }, t0 + t)
    }
    later(() => { cell.ch = to[i]; cell.spin = false; cell.land = true }, t0 + LETTER_MS)
    later(() => { cell.land = false }, t0 + LETTER_MS + 260)
  })
}

onMounted(() => {
  if (data) track('Пополнение — открыл', { park: data.park })
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!still) loop = setInterval(flip, HOLD_MS + LETTER_MS + (LEN - 1) * STAGGER_MS)
})
onUnmounted(() => { clearInterval(loop); timers.forEach(clearTimeout); timers = [] })

/* Ссылки не отменяем — события уходят через sendBeacon. */
const openLk = () => data && track('Пополнение — кабинет', { park: data.park })
const openBonus = () => data && track('Пополнение — бонус', { park: data.park })
</script>

<template>
  <div v-if="data" class="pp" :style="{ '--pk': data.accent }">
    <!-- ── 1. Первый экран: плашка парка, оффер, кнопка ─────────────────── -->
    <header class="pp-hero">
      <!-- Плашка парка — как у «Твоей карты» -->
      <div class="pp-park">
        <span class="pp-park-brand">ПАРК<br>РАЗВЛЕЧЕНИЙ</span>
        <span class="pp-park-name">{{ data.name }}</span>
      </div>
      <!-- Оффер — как на экране: «Заряди карту» + слово-табло лаймом -->
      <h1 class="pp-title" :aria-label="T.titleA + ' ' + WORDS[0]">
        <span class="pp-t">{{ T.titleA }}</span>
        <span class="pp-word" aria-hidden="true">
          <span v-for="w in WORDS" :key="w" class="pp-word-size">{{ w }}</span>
          <span class="pp-word-live"><span
            v-for="(c, i) in board"
            :key="i"
            class="pp-l"
            :class="{ spin: c.spin, ta: c.spin && c.tick, tb: c.spin && !c.tick, land: c.land }"
          >{{ c.ch }}</span></span>
        </span>
      </h1>
      <p class="pp-lead">{{ T.lead }}</p>
    </header>

    <template v-if="data.online">
      <a class="pp-cta" :href="data.lk" target="_blank" rel="noopener noreferrer" @click="openLk">{{ T.cta }}</a>
      <div class="pp-note">{{ T.note }}</div>
    </template>
    <!-- Онлайн выключен — честно говорим, где пополнить -->
    <section v-else class="pp-offline">{{ T.offline }}</section>

    <!-- ── 2. Нет карты — бонус на старт (как на «Твоей карте») ────────── -->
    <a v-if="data.bonus" class="pp-bonus" :href="data.bonus.href" @click="openBonus">
      <span class="pp-bonus-txt">
        <span class="pp-bonus-k">{{ T.bonusKicker }}</span>
        <span class="pp-bonus-t">{{ T.bonusT }} <span class="pp-bonus-arr">→</span></span>
      </span>
      <span class="pp-ticket"><b>+{{ data.bonus.amount }}</b><small>{{ T.bonusUnit.toUpperCase() }}</small></span>
    </a>

    <!-- ── 3. Три суммы — как карточки на экране у кассы ───────────────── -->
    <section class="pp-offers">
      <div class="pp-sub">{{ T.offersSub }}</div>
      <div
        v-for="o in offers"
        :key="o.key"
        class="pp-offer"
        :class="['tone-' + o.tone, { 'is-main': o.main }]"
        :aria-label="o.label + ' — ' + o.who"
      >
        <div class="pp-x">
          <span class="pp-xl"><i>{{ o.label.slice(0, 1) }}</i>{{ o.label.slice(1) }}</span>
          <!-- Основная сумма — три стрелки-поворотника, как на экране -->
          <span v-if="o.main" class="pp-chevs" aria-hidden="true">
            <i v-for="n in 3" :key="n" class="pp-chev"><svg viewBox="0 0 40 18"><path d="M3 3 L20 14 L37 3"/></svg></i>
          </span>
          <span class="pp-crew" :class="'crew-' + o.key" aria-hidden="true">
            <span v-for="(f, i) in o.crew" :key="i" class="pp-ava" :style="{ '--av': f.color, '--t': f.t, '--d': f.d }">
              <svg viewBox="0 0 12 12" v-html="f.svg"></svg>
            </span>
          </span>
        </div>

        <div class="pp-row">
          <div class="pp-seg">
            <div class="pp-lbl">{{ T.labelSum }}</div>
            <div class="pp-sum">{{ fmt(o.sum) }}&nbsp;₽</div>
          </div>
          <div class="pp-seg pp-seg-b">
            <div class="pp-lbl">{{ T.labelCard }}</div>
            <!-- Пополнение — в рублях, на карте — заряды: после числа молния -->
            <div class="pp-card">{{ fmt(o.onCard) }}<svg class="pp-bolt" viewBox="0 0 784.1 926.5" aria-hidden="true"><path :d="BOLT"/></svg></div>
          </div>
        </div>

        <!-- Бейджи бонуса — как плашка под сосудами на экране -->
        <div class="pp-badges">
          <div class="pp-b"><span class="pp-pill">{{ T.badgeGift }}</span><b>+{{ fmt(o.gift) }}</b></div>
          <div v-if="o.games" class="pp-b"><span class="pp-pill">{{ T.badgeGames }}</span><b>≈&nbsp;+{{ fmt(o.games) }}</b></div>
          <div v-if="o.tickets" class="pp-b"><span class="pp-pill">{{ T.badgeTickets }}</span><b>+{{ fmt(o.tickets) }}</b></div>
        </div>
      </div>
    </section>

    <!-- ── 4. Не хватило? Докинем — как строка на экране ───────────────── -->
    <section v-if="data.topupInHall" class="pp-hall">
      <span class="pp-zero" aria-hidden="true">0<svg viewBox="0 0 784.1 926.5"><path :d="BOLT"/></svg></span>
      <div class="pp-hall-txt">
        <div v-if="hallQ" class="pp-hall-q">{{ hallQ }}</div>
        <div class="pp-hall-a"><template v-if="hallA2 !== null">{{ hallA1 }}<b>без очереди</b>{{ hallA2 }}</template><template v-else>{{ hallA }}</template></div>
      </div>
    </section>

    <!-- ── 5. Бонус за сумму — ступени ──────────────────────────────────── -->
    <section class="pp-steps">
      <div class="pp-sub">{{ T.stepsSub }}</div>
      <div class="pp-ladder">
        <div
          v-for="(s, i) in data.steps"
          :key="s.sum"
          class="pp-step"
          :style="{ '--lv': (i + 1) / data.steps.length }"
        >
          <span class="pp-step-sum">{{ fmt(s.sum) }}&nbsp;₽</span>
          <span class="pp-step-gift">+{{ fmt(s.gift) }}</span>
          <span class="pp-step-lbl">{{ T.bonus }}</span>
        </div>
      </div>
      <p class="pp-round">{{ T.round }}</p>
    </section>

    <!-- ── 6. Как пополнить с телефона ──────────────────────────────────── -->
    <section v-if="data.online" class="pp-howw">
      <div class="pp-sub">{{ T.howSub }}</div>
      <ol class="pp-how">
        <li v-for="(h, i) in T.how" :key="i" class="pp-how-i">
          <span class="pp-how-n">{{ i + 1 }}</span>
          <span class="pp-how-t">{{ h }}</span>
        </li>
      </ol>
    </section>
  </div>

  <!-- Парка нет в popolnit.js или parks.js: лучше честная надпись, чем пустой экран -->
  <div v-else class="pp pp-empty">
    <h1 class="pp-title">Страница готовится</h1>
    <p class="pp-lead">Загляни на <a href="/parks">страницу парков</a>.</p>
  </div>
</template>

<style scoped>
/* Палитра — из theme/boom-styles.css, как у KartaPage.vue. Цвета карточек
   (лайм / голубой / розовый) — как на ТВ-экране (.tone-… в kassa/index.html). */

.pp {
  --blue: #2d6bff;   /* как у «Твоей карты» (KartaPage.vue): в общей палитре его нет */
  max-width: 560px;
  margin: 0 auto;
  padding: 26px 20px 64px;
  color: var(--text-pri);
  font-family: var(--font-body);
}

/* ── 1. Первый экран ── */
.pp-hero { text-align: center; }

/* Плашка парка — как у «Твоей карты» (KartaPage.vue, .kt-park) */
.pp-park {
  display: inline-flex;
  align-items: stretch;
  margin-bottom: 22px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--lime);
  box-shadow: 0 6px 22px rgba(197, 249, 70, 0.15);
}
.pp-park-brand {
  display: flex; align-items: center;
  padding: 8px 12px;
  background: var(--lime); color: var(--bg-deep);
  font-family: var(--font-head); font-weight: 900; font-size: 12px; line-height: 1.15; letter-spacing: 0.06em;
  text-align: left;
}
.pp-park-name {
  display: flex; align-items: center;
  padding: 8px 16px;
  background: var(--bg-deep); color: #fff;
  font-family: var(--font-head); font-weight: 900; font-size: 22px; letter-spacing: -0.01em;
  white-space: nowrap;
}

.pp-title {
  font-family: var(--font-head);
  font-size: clamp(34px, 11vw, 56px);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  border: none;   /* VitePress рисует h1 с подчёркиванием — здесь оно лишнее */
}
.pp-t { display: block; }
/* Слово-табло: оба слова лежат невидимо в одной ячейке и задают ширину,
   живые буквы — поверх */
.pp-word { display: inline-grid; color: var(--lime); }
.pp-word > span { grid-area: 1 / 1; }
.pp-word-size { visibility: hidden; }
.pp-word-live { display: block; text-align: center; white-space: nowrap; }
.pp-l { display: inline-block; transform-origin: 50% 55%; }
.pp-l.spin { color: #eaffb0; text-shadow: 0 0 0.12em rgba(197, 249, 70, 0.7); }
.pp-l.ta { animation: pp-flap-a 0.055s linear; }
.pp-l.tb { animation: pp-flap-b 0.055s linear; }
.pp-l.land { animation: pp-land 0.26s cubic-bezier(0.3, 1.6, 0.5, 1); text-shadow: 0 0 0.25em rgba(197, 249, 70, 0.9); }
@keyframes pp-flap-a { from { transform: scaleY(0.35) translateY(-0.12em); } to { transform: none; } }
@keyframes pp-flap-b { from { transform: scaleY(0.35) translateY(-0.12em); } to { transform: none; } }
@keyframes pp-land { 0% { transform: scale(1.3, 0.7); } 60% { transform: scale(0.95, 1.1); } 100% { transform: none; } }

.pp-lead {
  font-size: 16px;
  line-height: 1.5;
  margin: 0 auto 22px;
  max-width: 400px;
}

/* Кнопка — как у «Твоей карты»: лайм, на первом экране */
.pp-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 22px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--lime), var(--lime-dim));
  color: var(--bg-deep);
  font-family: var(--font-head);
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  box-shadow: 0 8px 26px rgba(197, 249, 70, 0.25);
}
/* ⚠ Общее правило сайта `.VPContent a:hover` (theme/style.css) красит
   ссылки синим и рисует нижнюю линию — на кнопках это ломало вид (поймали
   на «Твоей карте» 01.10). Цвет и рамка заданы заново, с селектором сильнее
   общего. */
.pp .pp-cta, .pp .pp-cta:hover, .pp .pp-cta:focus-visible { color: var(--bg-deep); border: none; }
.pp .pp-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(197, 249, 70, 0.4); filter: brightness(1.06); }
.pp .pp-cta:active { transform: translateY(1px) scale(0.99); filter: brightness(0.96); }
.pp .pp-cta:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

.pp-note {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-sec);
  text-align: center;
  margin-top: 10px;
}

/* ── 2. Нет карты — бонус на старт (как .kt-bonus у «Твоей карты») ── */
.pp-bonus {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  padding: 16px 16px 16px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(45, 107, 255, 0.16), var(--bg-card) 75%);
  text-decoration: none;
  text-align: left;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.pp .pp-bonus, .pp .pp-bonus:hover, .pp .pp-bonus:focus-visible { color: #fff; border: 1px solid rgba(45, 107, 255, 0.35); }
.pp .pp-bonus:hover { border-color: var(--blue); box-shadow: 0 10px 30px rgba(45, 107, 255, 0.3); transform: translateY(-2px); }
.pp .pp-bonus:active { transform: translateY(1px); }
.pp .pp-bonus:focus-visible { outline: 3px solid var(--blue); outline-offset: 3px; }
.pp-bonus-arr { display: inline-block; transition: transform 0.2s; }
.pp .pp-bonus:hover .pp-bonus-arr { transform: translateX(4px); }
.pp-bonus-txt { flex: 1; min-width: 0; }
.pp-bonus-k {
  display: block;
  font-family: var(--font-head); font-weight: 800; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--cyan); margin-bottom: 4px;
}
.pp-bonus-t { display: block; font-family: var(--font-head); font-weight: 800; font-size: 17px; white-space: nowrap; }
.pp-ticket {
  flex: none;
  padding: 8px 14px;
  border-radius: 10px;
  background: var(--blue); color: #fff;
  text-align: center;
  transform: rotate(-6deg);
  box-shadow: 0 8px 20px rgba(45, 107, 255, 0.35);
}
.pp-ticket b { display: block; font-family: var(--font-head); font-weight: 900; font-size: 26px; line-height: 1; }
.pp-ticket small { display: block; font-family: var(--font-head); font-weight: 900; font-size: 10px; letter-spacing: 0.05em; }

.pp-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-sec);
  margin-bottom: 10px;
}

/* ── 3. Карточки X1 / X2 / X4–6 ──
   --c — цвет карточки, --cr — он же числами для полупрозрачных оттенков. */
.tone-lime { --c: #c6f52e; --cr: 198, 245, 46; }
.tone-cyan { --c: #00d4ff; --cr: 0, 212, 255; }
.tone-pink { --c: #ff4fd8; --cr: 255, 79, 216; }

.pp-offers { margin: 30px 0 0; display: flex; flex-direction: column; gap: 12px; }
.pp-offer {
  padding: 14px 16px 16px;
  border-radius: 18px;
  background: var(--bg-card);
  border: 2px solid rgba(var(--cr), 0.22);
}
/* Основная сумма (1 500) — рамка своего цвета и свечение, как на экране */
.pp-offer.is-main {
  border: 3px solid var(--c);
  background: linear-gradient(150deg, rgba(var(--cr), 0.16), var(--bg-card) 60%);
  box-shadow: 0 10px 30px rgba(var(--cr), 0.18);
}

.pp-x { display: flex; align-items: center; gap: 10px; }
.pp-xl {
  font-family: var(--font-head); font-weight: 900; font-size: 40px; line-height: 0.95; letter-spacing: -0.02em;
  color: #fff; white-space: nowrap;
}
.pp-xl i { font-style: normal; color: var(--c); margin-right: 0.04em; }
/* Три стрелки-поворотника — острые, жирные, каждая следующая ярче, волна */
.pp-chevs { display: inline-flex; flex-direction: column; align-items: center; height: 38px; justify-content: center; }
.pp-chev { display: block; width: 24px; height: 11px; margin: -1px 0; color: var(--c); opacity: var(--o); animation: pp-chev 0.9s linear infinite; animation-delay: var(--dl); }
.pp-chev svg { display: block; width: 100%; height: 100%; overflow: visible; fill: none; stroke: currentColor; stroke-width: 8; stroke-linecap: butt; stroke-linejoin: miter; }
.pp-chev:nth-child(1) { --o: 0.16; --dl: 0s; }
.pp-chev:nth-child(2) { --o: 0.45; --dl: 0.15s; }
.pp-chev:nth-child(3) { --o: 0.8; --dl: 0.3s; }
@keyframes pp-chev { 0%, 100% { opacity: var(--o); } 30% { opacity: 1; } }

/* Пиксельные лица — как на экране; компания 4–6 стоит колодой */
.pp-crew { margin-left: auto; display: flex; }
.pp-ava {
  width: 34px; height: 34px; flex: none;
  border-radius: 24%; background: var(--av);
  display: grid; place-items: center;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.25), 0 0 0 2px var(--bg-card);
}
.pp-ava + .pp-ava { margin-left: 4px; }
.crew-group .pp-ava + .pp-ava { margin-left: -12px; }
.pp-ava svg { width: 72%; height: 72%; fill: #fff; shape-rendering: crispEdges; }
.pp-ava :deep(.f-blink) { opacity: 0; }
.pp-ava :deep(.f-eyes) { animation: pp-eyes var(--t) steps(1) var(--d) infinite; }
.pp-ava :deep(.f-blink) { animation: pp-blink var(--t) steps(1) var(--d) infinite; }
@keyframes pp-eyes { 0%, 17% { opacity: 1; } 18%, 21% { opacity: 0; } 22%, 84% { opacity: 1; } 85%, 88% { opacity: 0; } 89%, 100% { opacity: 1; } }
@keyframes pp-blink { 0%, 17% { opacity: 0; } 18%, 21% { opacity: 1; } 22%, 84% { opacity: 0; } 85%, 88% { opacity: 1; } 89%, 100% { opacity: 0; } }

/* Два окна, как сосуды на экране: «пополнение» и «на карте». Подписи у
   каждого числа обязательны: без них гости читали сумму на карте как цену. */
.pp-row { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 8px; margin-top: 12px; }
.pp-seg {
  min-width: 0;
  padding: 10px 12px 12px;
  border-radius: 12px 12px 18px 18px;
  background: rgba(255, 255, 255, 0.05);
}
.pp-seg-b { background: rgba(var(--cr), 0.12); }
.pp-lbl {
  font-family: var(--font-head);
  font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--c); opacity: 0.9;
}
.pp-sum {
  font-family: var(--font-head); font-weight: 800; font-size: 22px; line-height: 1.15; margin-top: 4px; white-space: nowrap;
}
.pp-card {
  font-family: var(--font-head); font-weight: 900; font-size: 34px; line-height: 1; margin-top: 4px;
  color: var(--c); white-space: nowrap;
}
.pp-bolt { display: inline-block; width: 0.5em; height: 0.6em; margin-left: 0.08em; vertical-align: baseline; fill: var(--c); }

/* Бейджи бонуса: чёрный бейдж — сверху, цифра — крупно, как на экране */
.pp-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.pp-b {
  flex: 1 1 140px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
  padding: 10px 12px 12px;
  border-radius: 12px;
  background: rgba(var(--cr), 0.14);
}
.is-main .pp-b:first-child { background: var(--c); }
.is-main .pp-b:first-child b { color: var(--bg-deep); }
.pp-pill {
  font-family: var(--font-head); font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--c); background: #0d0a2e; border-radius: 999px; padding: 4px 10px 5px; white-space: nowrap;
}
.pp-b b { font-family: var(--font-head); font-weight: 900; font-size: 28px; line-height: 1; color: var(--c); white-space: nowrap; }

/* ── 4. Не хватило? Докинем ── */
.pp-hall {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
/* «0 ⚡» — баланс кончился (на экране тут счётчик стекает до нуля) */
.pp-zero {
  flex: none;
  display: inline-flex; align-items: center;
  padding: 6px 12px;
  border-radius: 12px;
  font-family: var(--font-head); font-weight: 900; font-size: 30px; line-height: 1;
  color: #ff3d68; background: rgba(255, 61, 104, 0.14); box-shadow: inset 0 0 0 2px rgba(255, 61, 104, 0.55);
  animation: pp-zero 1.4s steps(1) infinite;
}
.pp-zero svg { width: 0.5em; height: 0.6em; margin-left: 0.1em; fill: currentColor; opacity: 0.35; }
@keyframes pp-zero { 0%, 49% { color: #ff3d68; } 50%, 100% { color: rgba(255, 61, 104, 0.4); } }
.pp-hall-txt { min-width: 0; }
.pp-hall-q { font-family: var(--font-head); font-weight: 900; font-size: 22px; line-height: 1.1; }
.pp-hall-a { margin-top: 4px; font-size: 15px; line-height: 1.4; font-weight: 700; }
.pp-hall-a b { color: var(--lime); font-weight: 900; }

/* ── 5. Ступени ── */
.pp-steps { margin: 30px 0 0; }
.pp-ladder { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
/* Чем больше ступень — тем гуще лайм: «больше сумма — больше бонус» */
.pp-step {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 11px 6px 10px;
  border-radius: 12px;
  background: rgba(197, 249, 70, calc(0.04 + var(--lv) * 0.14));
  border: 1px solid rgba(197, 249, 70, calc(0.12 + var(--lv) * 0.4));
}
.pp-step-sum { font-family: var(--font-head); font-weight: 800; font-size: 16px; white-space: nowrap; }
.pp-step-gift { font-family: var(--font-head); font-weight: 900; font-size: 18px; color: var(--lime); white-space: nowrap; }
.pp-step-lbl { font-size: 11px; color: var(--text-sec); }
.pp-round { margin: 12px 0 0; font-size: 14px; line-height: 1.45; }

/* ── 6. Как пополнить ── */
.pp-howw { margin: 30px 0 0; }
.pp-how { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.pp-how-i {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; margin: 0;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.pp-how-n {
  flex-shrink: 0;
  width: 30px; height: 30px; border-radius: 50%;
  display: grid; place-items: center;
  font-family: var(--font-head); font-weight: 900; font-size: 14px;
  color: var(--cyan); border: 1.5px solid var(--cyan);
}
.pp-how-t { font-size: 15px; line-height: 1.4; }

/* ── Онлайн выключен ── */
.pp-offline {
  margin: 4px 0 0;
  padding: 18px 20px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
  font-family: var(--font-head); font-weight: 800; font-size: 18px;
}

.pp-empty { padding-top: 80px; text-align: center; }
.pp-empty a { color: var(--cyan); }

@media (prefers-reduced-motion: reduce) {
  .pp-l, .pp-chev, .pp-zero, .pp-ava :deep(.f-eyes), .pp-ava :deep(.f-blink) { animation: none; }
  .pp-cta, .pp-bonus, .pp-bonus-arr { transition: none; }
}
</style>
