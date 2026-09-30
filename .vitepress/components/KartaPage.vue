<script setup>
/**
 * KartaPage — страница «Твоя карта» для постоянных гостей.
 * Адрес: b00m.fun/karta/<парк>, файл karta/<парк>.md
 *
 * Зачем она есть: гость сканирует QR с ТВ-экрана в парке (boom-cmd/media/
 * loyalty/). Карта у него уже на руках. Задача страницы — одна: объяснить,
 * что карта хранит счёт, и отвести в личный кабинет, где этот счёт видно.
 *
 * Образец устройства — Bonus500Page.vue: вёрстка здесь, тексты и адреса —
 * в .vitepress/data/karta.js.
 *
 * ⚠ СЧЁТЧИК. Два события: «Карта — открыл» (страница показалась) и
 *   «Карта — кабинет» (нажал кнопку). Оба вписаны в EVENTS
 *   apps-script-boom-stat.js. Источник (?from=loyalty-tv) счётчик берёт из
 *   адреса сам — по списку SOURCES в boom-stat.js.
 *   Как и у бонуса: «нажал кнопку» ≠ «вошёл в кабинет», счётчика в
 *   кабинетах нет.
 */
import { onMounted } from 'vue'
import { kartaPage, KARTA_TEXT as T } from '../data/karta'
import { track } from '../analytics/boom-stat'

const props = defineProps({
  /* Имя страницы: 'ohtamall'. Совпадает с именем файла в karta/. */
  page: { type: String, required: true }
})

const data = kartaPage(props.page)

onMounted(() => {
  if (data) track('Карта — открыл', { park: data.park })
})

function openLk () {
  if (data) track('Карта — кабинет', { park: data.park })
  /* Ссылку не отменяем — событие уходит через sendBeacon. */
}
</script>

<template>
  <div v-if="data" class="kt" :style="{ '--pk': data.accent }">
    <header class="kt-hero">
      <div class="kt-park">БУМБАСТИК · {{ data.name.toUpperCase() }}</div>

      <!-- Карта-«пластик»: сразу видно, о каком предмете речь -->
      <div class="kt-card" aria-hidden="true">
        <span class="kt-card-chip"></span>
        <span class="kt-card-brand">B00M</span>
        <span class="kt-card-line"></span>
      </div>

      <h1 class="kt-title">{{ T.title }}</h1>
      <p class="kt-lead">{{ T.lead }}</p>
    </header>

    <!-- ── Что видно в кабинете ──────────────────────────────────────── -->
    <section class="kt-points">
      <div class="kt-sub">Что видно в кабинете</div>
      <div v-for="p in T.points" :key="p.key" class="kt-point">
        <span class="kt-ico" :class="'kt-ico-' + p.key">
          <!-- Заряды — молния -->
          <svg v-if="p.key === 'charges'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <!-- Тикеты — билет -->
          <svg v-else-if="p.key === 'tickets'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
          </svg>
          <!-- Статус — корона, как у уровней на /rewards -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>
          </svg>
        </span>
        <div>
          <div class="kt-point-t">{{ p.t }}</div>
          <div class="kt-point-d">{{ p.d }}</div>
        </div>
      </div>
    </section>

    <a
      class="kt-cta"
      :href="data.lk"
      target="_blank"
      rel="noopener noreferrer"
      @click="openLk"
    >
      {{ T.cta }}
    </a>
    <div class="kt-note">{{ T.note }}</div>

    <!-- ── Повод заглядывать регулярно ───────────────────────────────── -->
    <a class="kt-turbo" href="/turbo/">
      <span class="kt-turbo-t">{{ T.turboT }} →</span>
      <span class="kt-turbo-d">{{ T.turboD }}</span>
    </a>
  </div>

  <!-- Парка нет в karta.js: лучше честная надпись, чем пустой экран -->
  <div v-else class="kt kt-empty">
    <h1 class="kt-title">Страница готовится</h1>
    <p class="kt-lead">Загляни на <a href="/parks">страницу парков</a>.</p>
  </div>
</template>

<style scoped>
/* Палитра — из theme/boom-styles.css, как у Bonus500Page.vue. */

.kt {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  color: var(--text-pri);
  font-family: var(--font-body);
  text-align: center;
}

.kt-park {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--text-sec);
  margin-bottom: 24px;
}

/* ── Карта ── */
.kt-card {
  position: relative;
  display: block;
  width: 200px;
  height: 126px;
  margin: 0 auto 26px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--pk), var(--bg-card) 78%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.4);
  transform: rotate(-4deg);
}
.kt-card-chip {
  position: absolute; left: 18px; top: 42px;
  width: 30px; height: 22px; border-radius: 5px;
  background: var(--yellow); opacity: 0.85;
}
.kt-card-brand {
  position: absolute; right: 16px; top: 12px;
  font-family: var(--font-head); font-weight: 900; font-size: 16px;
  letter-spacing: 0.04em; color: #fff;
}
.kt-card-line {
  position: absolute; left: 18px; right: 18px; bottom: 18px;
  height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.35);
}

.kt-title {
  font-family: var(--font-head);
  font-size: clamp(34px, 10.5vw, 52px);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
  border: none;   /* VitePress рисует h1 с подчёркиванием — здесь оно лишнее */
}

.kt-lead {
  font-size: 16px;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 400px;
}

/* ── Пункты ── */
.kt-points {
  margin: 34px 0 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}
.kt-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-sec);
  margin-bottom: 4px;
}
.kt-point {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.kt-ico {
  flex-shrink: 0;
  width: 42px; height: 42px;
  border-radius: 10px;
  display: grid; place-items: center;
  border: 1.5px solid currentColor;
  background: rgba(255, 255, 255, 0.04);
}
.kt-ico svg { width: 22px; height: 22px; }
.kt-ico-charges { color: var(--lime); }
.kt-ico-tickets { color: var(--yellow); }
.kt-ico-status  { color: var(--cyan); }

.kt-point-t { font-weight: 700; font-size: 16px; margin-bottom: 2px; }
.kt-point-d { font-size: 13px; line-height: 1.45; color: var(--text-sec); }

/* ── Кнопка ── лаймовая, как у бонуса: единственное яркое пятно. */
.kt-cta {
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
.kt-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(197, 249, 70, 0.32); }
.kt-cta:active { transform: translateY(0); }

.kt-note {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-sec);
  margin-top: 12px;
}

/* ── Турбо-часы ── */
.kt-turbo {
  display: block;
  margin-top: 36px;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  text-align: left;
  text-decoration: none;
  color: var(--text-pri);
  transition: border-color 0.2s;
}
.kt-turbo:hover { border-color: var(--cyan); }
.kt-turbo-t {
  display: block;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 16px;
  color: var(--cyan);
  margin-bottom: 3px;
}
.kt-turbo-d { display: block; font-size: 13px; line-height: 1.45; color: var(--text-sec); }

.kt-empty { padding-top: 80px; }
.kt-empty a { color: var(--cyan); }
</style>
