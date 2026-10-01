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
 * ⚠ СЧЁТЧИК. Два события: «Пополнение — открыл» (страница показалась) и
 *   «Пополнение — кабинет» (нажал кнопку). Оба вписаны в EVENTS
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
import { onMounted } from 'vue'
import { popolnitPage, plural, POPOLNIT_TEXT as T } from '../data/popolnit'
import { track } from '../analytics/boom-stat'

const props = defineProps({
  /* Имя страницы: 'ohtamall'. Совпадает с именем файла в popolnit/. */
  page: { type: String, required: true }
})

const data = popolnitPage(props.page)

/* Заголовок в две строки, как на ТВ-экране: «Пополни карту —» / «играй
   больше» (лаймом). Так тире не перескакивает в начало строки. */
const [titleA, titleB] = T.title.split(' — ')

/* 1500 → «1 500». Неразрывный пробел: число не рвётся по строкам.
   Не toLocaleString: на сборке и в браузере он даёт разные пробелы. */
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')

onMounted(() => {
  if (data) track('Пополнение — открыл', { park: data.park })
})

function openLk () {
  if (data) track('Пополнение — кабинет', { park: data.park })
  /* Ссылку не отменяем — событие уходит через sendBeacon. */
}
</script>

<template>
  <div v-if="data" class="pp" :style="{ '--pk': data.accent }">
    <header class="pp-hero">
      <div class="pp-park">БУМБАСТИК · {{ data.name.toUpperCase() }}</div>
      <h1 class="pp-title">
        <template v-if="titleB"><span class="pp-t">{{ titleA }}&nbsp;—</span> <span class="pp-t pp-t-b">{{ titleB }}</span></template>
        <template v-else>{{ T.title }}</template>
      </h1>
      <p class="pp-lead">{{ T.lead }}</p>
    </header>

    <!-- ── Три суммы — те же, что на экране у кассы ──────────────────── -->
    <section class="pp-offers">
      <div class="pp-sub">{{ T.offersSub }}</div>
      <div
        v-for="o in data.offers"
        :key="o.key"
        class="pp-offer"
        :class="{ 'is-main': o.main }"
      >
        <div class="pp-offer-l">
          <div class="pp-who">
            {{ o.who }}
            <svg v-if="o.main" class="pp-star" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/>
            </svg>
          </div>
          <div class="pp-sum">{{ fmt(o.sum) }}&nbsp;₽</div>
          <div class="pp-lbl">пополнение</div>
        </div>
        <div class="pp-offer-r">
          <div class="pp-lbl">на карте</div>
          <!-- Пополнение — в рублях, на карте — заряды: после числа молния -->
          <div class="pp-card">{{ fmt(o.onCard) }}<svg class="pp-bolt" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
          <div class="pp-gift">+{{ fmt(o.gift) }} {{ T.bonus }}</div>
        </div>
        <!-- Тот же подарок с других сторон: игры и тикеты за наличные -->
        <div v-if="o.games || o.tickets" class="pp-extra">
          <span v-if="o.games" class="pp-chip">≈&nbsp;+{{ o.games }}&nbsp;{{ plural(o.games, 'игра', 'игры', 'игр') }} {{ T.bonus }}</span>
          <span v-if="o.tickets" class="pp-chip pp-chip-t">+{{ fmt(o.tickets) }}&nbsp;{{ plural(o.tickets, 'тикет', 'тикета', 'тикетов') }} {{ T.ticketsCash }}</span>
        </div>
      </div>
    </section>

    <!-- ── Полоса ступеней ───────────────────────────────────────────── -->
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

    <!-- ── Онлайн: кнопка кабинета и три шага ────────────────────────── -->
    <section v-if="data.online" class="pp-online">
      <a
        class="pp-cta"
        :href="data.lk"
        target="_blank"
        rel="noopener noreferrer"
        @click="openLk"
      >
        {{ T.cta }}
      </a>
      <div class="pp-note">{{ T.note }}</div>

      <ol class="pp-how">
        <li v-for="(h, i) in T.how" :key="i" class="pp-how-i">
          <span class="pp-how-n">{{ i + 1 }}</span>
          <span class="pp-how-t">{{ h }}</span>
        </li>
      </ol>

      <div v-if="data.regBonus" class="pp-reg">{{ T.regBonus }}</div>
    </section>

    <!-- Онлайн выключен — честно говорим, где пополнить -->
    <section v-else class="pp-offline">{{ T.offline }}</section>

    <!-- ── На кассе: докидка в зале (тикеты за наличные — в карточках) ── -->
    <section v-if="data.topupInHall" class="pp-hall">
      <div class="pp-sub">{{ T.hallSub }}</div>
      <div class="pp-hall-row">
        <span class="pp-hall-ico pp-ico-hall">
          <!-- Человек — сотрудник в зале -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
          </svg>
        </span>
        <span class="pp-hall-t">{{ T.topupInHall }}</span>
      </div>
    </section>
  </div>

  <!-- Парка нет в popolnit.js или parks.js: лучше честная надпись, чем пустой экран -->
  <div v-else class="pp pp-empty">
    <h1 class="pp-title">Страница готовится</h1>
    <p class="pp-lead">Загляни на <a href="/parks">страницу парков</a>.</p>
  </div>
</template>

<style scoped>
/* Палитра — из theme/boom-styles.css, как у KartaPage.vue и Bonus500Page.vue.
   Лайм — цвет подарка и главной кнопки, как на /charge. */

.pp {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  color: var(--text-pri);
  font-family: var(--font-body);
}

.pp-hero { text-align: center; }

.pp-park {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--text-sec);
  margin-bottom: 20px;
}

.pp-title {
  font-family: var(--font-head);
  font-size: clamp(28px, 9vw, 50px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  border: none;   /* VitePress рисует h1 с подчёркиванием — здесь оно лишнее */
}
.pp-t { display: block; }
.pp-t-b { color: var(--lime); }

.pp-lead {
  font-size: 16px;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 400px;
}

.pp-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-sec);
  margin-bottom: 10px;
}

/* ── Три суммы ── */
.pp-offers {
  margin: 30px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pp-offer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 14px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
/* Основная сумма (1 500) — лаймовая рамка и подсветка, как лучший тариф на /charge */
.pp-offer.is-main {
  border: 2px solid var(--lime);
  background: linear-gradient(135deg, rgba(197, 249, 70, 0.14), var(--bg-card) 70%);
  box-shadow: 0 10px 30px rgba(197, 249, 70, 0.14);
}
.pp-offer { flex-wrap: wrap; }
.pp-offer-l { min-width: 0; }
.pp-offer-r { text-align: right; flex-shrink: 0; }

.pp-who {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-sec);
}
.is-main .pp-who { color: var(--lime); }
.pp-star { width: 15px; height: 15px; fill: var(--lime); }

.pp-sum {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 24px;
  line-height: 1.15;
  margin-top: 4px;
  white-space: nowrap;
}

/* Подпись к каждому числу: «пополнение» / «на карте». Без неё гости уже
   читали сумму на карте как цену. */
.pp-lbl {
  font-size: 12px;
  line-height: 1.3;
  color: var(--text-sec);
}

.pp-card {
  font-family: var(--font-head);
  font-weight: 900;
  font-size: 38px;
  line-height: 1;
  color: var(--lime);
  white-space: nowrap;
  margin: 2px 0 6px;
}
/* Игры и тикеты за наличные — строкой под суммами, во всю ширину карточки */
.pp-extra {
  flex-basis: 100%;
  display: flex;
  flex-direction: column;   /* каждая плашка — на всю ширину карточки */
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.pp-chip {
  font-size: 13px;
  font-weight: 700;
  color: var(--lime);
  background: rgba(197, 249, 70, 0.1);
  border: 1px solid rgba(197, 249, 70, 0.35);
  border-radius: 8px;
  padding: 7px 12px;
  white-space: nowrap;
}
.pp-chip-t { color: var(--yellow); background: rgba(255, 214, 10, 0.08); border-color: rgba(255, 214, 10, 0.4); }

.pp-bolt {
  display: inline-block;
  width: 0.5em;
  height: 0.62em;
  margin-left: 0.08em;
  vertical-align: baseline;
  fill: var(--lime);
}

.pp-gift {
  display: inline-block;
  font-size: 13px;
  font-weight: 800;
  color: var(--bg-deep);
  background: var(--lime);
  border-radius: 8px;
  padding: 3px 8px;
  white-space: nowrap;
}

/* ── Полоса ступеней ── */
.pp-steps { margin: 30px 0 0; }
.pp-ladder {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
/* Чем больше ступень — тем гуще лайм: «больше сумма — больше подарок» */
.pp-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 11px 6px 10px;
  border-radius: 12px;
  background: rgba(197, 249, 70, calc(0.04 + var(--lv) * 0.14));
  border: 1px solid rgba(197, 249, 70, calc(0.12 + var(--lv) * 0.4));
}
.pp-step-sum {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 16px;
  white-space: nowrap;
}
.pp-step-gift {
  font-family: var(--font-head);
  font-weight: 900;
  font-size: 18px;
  color: var(--lime);
  white-space: nowrap;
}
.pp-step-lbl { font-size: 11px; color: var(--text-sec); }

.pp-round {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text-pri);
}

/* ── Онлайн ── */
.pp-online { margin: 34px 0 0; text-align: center; }

/* Кнопка лаймовая, как у «Твоей карты» и бонуса: единственное яркое пятно */
.pp-cta {
  display: block;
  padding: 19px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--lime), var(--lime-dim));
  color: var(--bg-deep);
  font-family: var(--font-head);
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 26px rgba(197, 249, 70, 0.22);
}
.pp-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(197, 249, 70, 0.32); }
.pp-cta:active { transform: translateY(0); }

.pp-note {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-sec);
  margin-top: 10px;
}

.pp-how {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}
.pp-how-i {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
  margin: 0;
}
.pp-how-n {
  flex-shrink: 0;
  width: 30px; height: 30px;
  border-radius: 50%;
  display: grid; place-items: center;
  font-family: var(--font-head);
  font-weight: 900;
  font-size: 14px;
  color: var(--cyan);
  border: 1.5px solid var(--cyan);
}
.pp-how-t { font-size: 15px; line-height: 1.4; }

.pp-reg {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px dashed rgba(197, 249, 70, 0.45);
  color: var(--lime);
  font-weight: 700;
  font-size: 15px;
}

/* ── Онлайн выключен ── */
.pp-offline {
  margin: 34px 0 0;
  padding: 18px 20px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 18px;
}

/* ── На кассе ── */
.pp-hall { margin: 34px 0 0; }
.pp-hall-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.pp-hall-row + .pp-hall-row { margin-top: 8px; }
.pp-hall-ico {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 10px;
  display: grid; place-items: center;
  border: 1.5px solid currentColor;
  background: rgba(255, 255, 255, 0.04);
}
.pp-hall-ico svg { width: 22px; height: 22px; }
.pp-ico-hall { color: var(--cyan); }
.pp-hall-t { font-size: 15px; line-height: 1.45; font-weight: 600; }

.pp-empty { padding-top: 80px; text-align: center; }
.pp-empty a { color: var(--cyan); }
</style>
