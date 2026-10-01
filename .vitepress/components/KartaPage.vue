<script setup>
/**
 * KartaPage — страница «Твоя карта».
 * Адрес: b00m.fun/karta/<парк>, файл karta/<парк>.md
 *
 * Зачем она есть: гость сканирует QR с ТВ-экрана в парке (boom-cmd/media/
 * loyalty/). Страница продолжает экран теми же словами и картинками:
 *   1. карта владельца + «Есть карта? Заряжено» + кнопка кабинета — сразу,
 *      на первом экране;
 *   2. вторая дорожка «Нет карты? +500 на старт» (где бонус включён);
 *   3. игровой статус — те же 4 ступени и цифры, что на экране;
 *   4. Призотека и турбо-часы.
 *
 * Тексты, адреса и цифры — в .vitepress/data/karta.js, здесь только вёрстка.
 *
 * ⚠ СЧЁТЧИК. Четыре события, все вписаны в EVENTS apps-script-boom-stat.js:
 *   «Карта — открыл» (страница показалась), «Карта — кабинет» (кнопка
 *   кабинета), «Карта — бонус» (дорожка +500), «Карта — призы» (Призотека).
 *   Источник (?from=loyalty-tv) счётчик берёт из адреса сам — по списку
 *   SOURCES в boom-stat.js. «Нажал кнопку» ≠ «вошёл в кабинет».
 */
import { onMounted } from 'vue'
import { kartaPage, KARTA_TEXT as T, LEVELS } from '../data/karta'
import { bonusPage } from '../data/bonus500'
import { track } from '../analytics/boom-stat'

const props = defineProps({
  /* Имя страницы: 'ohtamall'. Совпадает с именем файла в karta/. */
  page: { type: String, required: true }
})

const data = kartaPage(props.page)
/* Сумму бонуса берём со страницы бонуса — она напечатана на наклейках,
   держать её в двух местах нельзя. */
const bonus = data && data.bonus ? bonusPage(props.page) : null

const fmt = (n) => n.toLocaleString('ru-RU').replace(/ |,/g, ' ')
const plural = (n) => {
  const a = n % 10, b = n % 100
  if (a === 1 && b !== 11) return 'игра'
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'игры'
  return 'игр'
}

/* Иконки статусов — те же, что на ТВ-экране (lucide) */
const ICONS = {
  crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
  medal: '<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>',
  swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
  bow: '<path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/>'
}

onMounted(() => {
  if (data) track('Карта — открыл', { park: data.park })
})

/* Ссылки не отменяем — события уходят через sendBeacon. */
const openLk = () => data && track('Карта — кабинет', { park: data.park })
const openBonus = () => data && track('Карта — бонус', { park: data.park })
const openPrizes = () => data && track('Карта — призы', { park: data.park })
</script>

<template>
  <div v-if="data" class="kt" :style="{ '--pk': data.accent }">
    <!-- ── 1. Первый экран: карта + вопрос + кнопка ───────────────────── -->
    <header class="kt-hero">
      <!-- Плашка парка: «парк развлечений» на лайме + название парка крупно -->
      <div class="kt-park">
        <span class="kt-park-brand">ПАРК<br>РАЗВЛЕЧЕНИЙ</span>
        <span class="kt-park-name">{{ data.name }}</span>
      </div>

      <div class="kt-card" aria-hidden="true">
        <img src="/karta/card.svg" alt="" width="674" height="1063">
        <i class="kt-card-glint"></i>
      </div>

      <h1 class="kt-title">{{ T.titleA }} <span>{{ T.titleB }}</span></h1>
      <p class="kt-lead">{{ T.lead }}</p>
    </header>

    <a class="kt-cta" :href="data.lk" target="_blank" rel="noopener noreferrer" @click="openLk">
      {{ T.cta }}
    </a>
    <div class="kt-note">{{ T.note }}</div>

    <!-- ── 2. Нет карты — бонус на старт (как плашка на ТВ) ───────────── -->
    <a v-if="bonus" class="kt-bonus" :href="'/bonus500/' + page" @click="openBonus">
      <span class="kt-bonus-txt">
        <span class="kt-bonus-k">{{ T.bonusKicker }}</span>
        <span class="kt-bonus-t">{{ T.bonusT }} <span class="kt-bonus-arr">→</span></span>
      </span>
      <span class="kt-ticket"><b>+{{ bonus.amount }}</b><small>{{ T.bonusUnit.toUpperCase() }}</small></span>
    </a>

    <!-- ── 3. Игровой статус — те же ступени, что на экране ───────────── -->
    <section class="kt-lvl">
      <div class="kt-lvl-head">
        <span class="kt-lvl-t">{{ T.lvlT }}</span>
        <span class="kt-lvl-badge">{{ T.lvlBadge }}</span>
      </div>
      <div class="kt-steps">
        <div v-for="l in LEVELS" :key="l.id" class="kt-step" :class="'s-' + l.id" :style="{ '--c': l.color }">
          <i v-if="l.id === 'platinum'" class="kt-charge"></i>
          <svg class="kt-step-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICONS[l.icon]"></svg>
          <div class="kt-step-name">{{ l.name }}</div>
          <div class="kt-step-disc">{{ l.discount ? '−' + l.discount + '%' : '0%' }}</div>
          <div v-if="l.threshold" class="kt-step-thr">от {{ fmt(l.threshold) }}&nbsp;₽</div>
          <span v-if="l.plus" class="kt-step-plus">+{{ l.plus }}&nbsp;{{ plural(l.plus) }}<sup>*</sup></span>
        </div>
      </div>
      <div class="kt-lvl-note">{{ T.lvlNote }}</div>
    </section>

    <!-- ── 4. Призотека и турбо ───────────────────────────────────────── -->
    <a v-if="data.prizes" class="kt-link kt-link-prizes" :href="'/prizes/' + page" @click="openPrizes">
      <span class="kt-link-t">{{ T.prizesT }} →</span>
      <span class="kt-link-d">{{ T.prizesD }}</span>
    </a>
    <a class="kt-link" href="/turbo/">
      <span class="kt-link-t">{{ T.turboT }} →</span>
      <span class="kt-link-d">{{ T.turboD }}</span>
    </a>
  </div>

  <!-- Парка нет в karta.js: лучше честная надпись, чем пустой экран -->
  <div v-else class="kt kt-empty">
    <h1 class="kt-title">Страница готовится</h1>
    <p class="kt-lead">Загляни на <a href="/parks">страницу парков</a>.</p>
  </div>
</template>

<style scoped>
/* Палитра — из theme/boom-styles.css, как у Bonus500Page.vue.
   Синий бонуса и цвета статусов — те же, что на ТВ-экране. */

.kt {
  --blue: #2d6bff;
  max-width: 560px;
  margin: 0 auto;
  padding: 20px 20px 120px;   /* снизу место под полосу cookies */
  color: var(--text-pri);
  font-family: var(--font-body);
  text-align: center;
}

.kt-park {
  display: inline-flex;
  align-items: stretch;
  margin-bottom: 22px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--lime);
  box-shadow: 0 6px 22px rgba(197, 249, 70, 0.15);
}
.kt-park-brand {
  display: flex; align-items: center;
  padding: 8px 12px;
  background: var(--lime); color: var(--bg-deep);
  font-family: var(--font-head); font-weight: 900; font-size: 12px; line-height: 1.15; letter-spacing: 0.06em;
  text-align: left;   /* «ПАРК / РАЗВЛЕЧЕНИЙ» в две строки — плашка не шире экрана */
}
.kt-park-name {
  display: flex; align-items: center;
  padding: 8px 16px;
  background: var(--bg-deep); color: #fff;
  font-family: var(--font-head); font-weight: 900; font-size: 22px; letter-spacing: -0.01em;
  white-space: nowrap;
}

/* ── 1. Карта владельца ── */
.kt-card {
  position: relative;
  width: 132px;
  aspect-ratio: 674 / 1063;
  margin: 0 auto 18px;
  border-radius: 12px;
  overflow: hidden;
  transform: rotate(-6deg);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 34px rgba(197, 249, 70, 0.28);
  animation: kt-float 5s ease-in-out infinite;
}
.kt-card img { display: block; width: 100%; height: 100%; }
.kt-card-glint {
  position: absolute; top: -30%; bottom: -30%; left: -60%; width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: rotate(18deg);
  animation: kt-glint 5s ease-in-out infinite;
}
@keyframes kt-float { 0%, 100% { transform: rotate(-6deg) translateY(0) } 50% { transform: rotate(-4deg) translateY(-6px) } }
@keyframes kt-glint { 0%, 60% { left: -60% } 80%, 100% { left: 130% } }

.kt-title {
  font-family: var(--font-head);
  font-size: clamp(32px, 10vw, 48px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  border: none;   /* VitePress рисует h1 с подчёркиванием — здесь оно лишнее */
}
.kt-title span { color: var(--lime); white-space: nowrap; }

.kt-lead {
  font-size: 15px;
  line-height: 1.45;
  margin: 0 auto 18px;
  max-width: 400px;
  color: var(--text-pri);
}

/* ── Кнопка кабинета — лаймовая, единственное яркое пятно первого экрана ── */
.kt-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 22px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--lime), var(--lime-dim));
  color: var(--bg-deep);
  font-family: var(--font-head);
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 26px rgba(197, 249, 70, 0.25);
}
/* ⚠ Общее правило сайта `.VPContent a:hover` (theme/style.css) красит
   ссылки синим и рисует нижнюю линию — на кнопках это ломало вид. Здесь
   цвет и рамка заданы заново, с селектором сильнее общего. */
.kt .kt-cta, .kt .kt-cta:hover, .kt .kt-cta:focus-visible { color: var(--bg-deep); border: none; }
.kt .kt-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(197, 249, 70, 0.4); filter: brightness(1.06); }
.kt .kt-cta:active { transform: translateY(1px) scale(0.99); filter: brightness(0.96); }
.kt .kt-cta:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

.kt-note {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-sec);
  margin-top: 10px;
}

/* ── 2. Бонус на старт — тёмная плашка с синим билетом, как на экране ── */
.kt-bonus {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  padding: 14px 14px 14px 18px;
  border-radius: 14px;
  background: #0d0a2e;
  border: 1px solid rgba(45, 107, 255, 0.35);
  text-align: left;
  text-decoration: none;
  color: #fff;
}
.kt .kt-bonus, .kt .kt-bonus:hover, .kt .kt-bonus:focus-visible { color: #fff; border: 1px solid rgba(45, 107, 255, 0.35); }
.kt-bonus { transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; }
.kt .kt-bonus:hover { border-color: var(--blue); box-shadow: 0 10px 30px rgba(45, 107, 255, 0.3); transform: translateY(-2px); }
.kt .kt-bonus:active { transform: translateY(1px); }
.kt .kt-bonus:focus-visible { outline: 3px solid var(--blue); outline-offset: 3px; }
.kt-bonus-arr { display: inline-block; transition: transform 0.2s; }
.kt .kt-bonus:hover .kt-bonus-arr { transform: translateX(4px); }
.kt-bonus-txt { flex: 1; min-width: 0; }
.kt-bonus-k {
  display: block;
  font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
  color: #4a85ff;
  margin-bottom: 3px;
}
.kt-bonus-t { display: block; font-family: var(--font-head); font-weight: 800; font-size: 17px; white-space: nowrap; }
.kt-ticket {
  flex: none;
  position: relative;
  background: var(--blue);
  color: #fff;
  border-radius: 10px;
  padding: 6px 14px 5px;
  text-align: center;
  transform: rotate(-4deg);
  transform-origin: 85% 50%;
  animation: kt-tk 4s ease-in-out infinite;
  -webkit-mask: radial-gradient(circle 7px at 0 50%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 7px at 100% 50%, #0000 98%, #000) right / 51% 100% no-repeat;
          mask: radial-gradient(circle 7px at 0 50%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 7px at 100% 50%, #0000 98%, #000) right / 51% 100% no-repeat;
}
.kt-ticket b { display: block; font-family: var(--font-head); font-weight: 900; font-size: 26px; line-height: 1; }
.kt-ticket small { display: block; font-family: var(--font-head); font-weight: 900; font-size: 10px; letter-spacing: 0.05em; }
@keyframes kt-tk {
  0%, 45% { transform: rotate(-4deg) }
  55% { transform: rotate(-9deg) scale(1.25) }
  60%, 72% { transform: rotate(-7deg) scale(1.18) }
  85%, 100% { transform: rotate(-4deg) }
}

/* ── 3. Игровой статус — лаймовая полоса + рамка, как на экране ── */
.kt-lvl {
  margin-top: 40px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: inset 0 0 0 3px var(--lime);
  text-align: left;
  padding-bottom: 14px;
}
.kt-lvl-head {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  padding: 11px 14px;
  background: var(--lime); color: var(--bg-deep);
}
.kt-lvl-t { font-family: var(--font-head); font-weight: 900; font-size: 17px; text-transform: uppercase; letter-spacing: 0.02em; }
.kt-lvl-badge {
  background: var(--bg-deep); color: var(--lime);
  border-radius: 999px; padding: 4px 10px;
  font-size: 11px; font-weight: 800; white-space: nowrap;
}
.kt-steps {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  padding: 14px 14px 0;
}
.kt-step {
  --c: #fff;
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 12px 12px 13px;
  border: 2px solid var(--c);
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 18%, transparent), rgba(255, 255, 255, 0.03));
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
}
.kt-step > :not(.kt-charge) { position: relative; z-index: 1; }
.kt-step-ico { width: 30px; height: 30px; color: var(--c); }
.kt-step-name { font-family: var(--font-head); font-weight: 900; font-size: 15px; color: var(--c); }
.s-standard .kt-step-name { color: #d0d0de; }
.kt-step-disc { font-family: var(--font-head); font-weight: 900; font-size: 34px; line-height: 1; }
.kt-step-thr { font-size: 12px; font-weight: 700; color: var(--text-sec); }
.kt-step-plus {
  margin-top: 3px;
  background: var(--c); color: var(--bg-deep);
  border-radius: 7px; padding: 3px 8px;
  font-family: var(--font-head); font-weight: 900; font-size: 13px; white-space: nowrap;
}
.kt-step-plus sup { font-size: 0.65em; }

/* Платина — «батарейка»: раз в 6 с заливается зарядом и вспыхивает.
   Надписи на заливке — белые, бейдж — тёмный (как на ТВ-экране). */
.kt-charge {
  position: absolute; inset: 0; z-index: 0;
  background: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.16) 0 10px, transparent 10px 20px), linear-gradient(0deg, var(--c), color-mix(in srgb, var(--c) 70%, #fff));
  clip-path: inset(100% 0 0 0);
  animation: kt-charge 6s linear infinite;
}
@keyframes kt-charge {
  0%, 15% { clip-path: inset(100% 0 0 0); opacity: 1; filter: none }
  55% { clip-path: inset(0 0 0 0); opacity: 1; filter: none }
  70% { clip-path: inset(0 0 0 0); opacity: 1; filter: brightness(1.8) }
  78%, 100% { clip-path: inset(0 0 0 0); opacity: 0; filter: brightness(1.8) }
}
.s-platinum { animation: kt-boom 6s ease-out infinite; }
@keyframes kt-boom {
  0%, 68% { box-shadow: none }
  70% { box-shadow: 0 0 0 3px #fff, 0 0 40px 10px var(--c) }
  85%, 100% { box-shadow: none }
}
.s-platinum .kt-step-ico, .s-platinum .kt-step-name { animation: kt-ink-c 6s linear infinite; }
.s-platinum .kt-step-thr { animation: kt-ink-s 6s linear infinite; }
.s-platinum .kt-step-plus { animation: kt-ink-p 6s linear infinite; }
@keyframes kt-ink-c { 0%, 18% { color: var(--c) } 25%, 72% { color: #fff } 80%, 100% { color: var(--c) } }
@keyframes kt-ink-s { 0%, 18% { color: var(--text-sec) } 25%, 72% { color: #fff } 80%, 100% { color: var(--text-sec) } }
@keyframes kt-ink-p { 0%, 18% { background: var(--c); color: var(--bg-deep) } 25%, 72% { background: var(--bg-deep); color: #fff } 80%, 100% { background: var(--c); color: var(--bg-deep) } }

.kt-lvl-note { padding: 10px 14px 0; font-size: 11px; color: var(--text-sec); opacity: 0.75; }

/* ── 4. Ссылки ── */
.kt-link {
  display: block;
  margin-top: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  text-align: left;
  text-decoration: none;
  color: var(--text-pri);
  transition: border-color 0.2s;
}
.kt-link-prizes { margin-top: 28px; }
.kt .kt-link:hover { color: var(--text-pri); border-color: var(--cyan); }
.kt-link-t {
  display: block;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 16px;
  color: var(--cyan);
  margin-bottom: 3px;
}
.kt-link-prizes .kt-link-t { color: var(--magenta); }
.kt-link-d { display: block; font-size: 13px; line-height: 1.45; color: var(--text-sec); }

.kt-empty { padding-top: 80px; }
.kt-empty a { color: var(--cyan); }

@media (prefers-reduced-motion: reduce) {
  .kt-card, .kt-card-glint, .kt-ticket, .kt-charge, .s-platinum,
  .s-platinum .kt-step-ico, .s-platinum .kt-step-name, .s-platinum .kt-step-thr, .s-platinum .kt-step-plus { animation: none; }
}
</style>
