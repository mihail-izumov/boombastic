<script setup>
/**
 * Bonus500Page — посадочная страница бонуса за регистрацию.
 * Адрес: b00m.fun/bonus500/<парк>, файл bonus500/<парк>.md
 *
 * Зачем она есть: на дверях парковки Охта Молла висят наклейки с QR. Гость
 * сканирует код у машины, за минуту до входа в ТЦ. У него один вопрос —
 * «что мне за это будет и что нажать». Страница отвечает ровно на него и
 * ведёт в личный кабинет. Всё остальное — лишний повод закрыть вкладку.
 *
 * ⚠ АДРЕС СТРАНИЦЫ ЗАШИТ В НАПЕЧАТАННЫЙ QR. Переименовать bonus500/ohtamall
 *   нельзя без перепечатки наклеек. Те же грабли уже были с turbo/index.md.
 *
 * ⚠ ТЕКСТЫ И ЦИФРЫ ЗДЕСЬ НЕ ПРАВИМ — они в .vitepress/data/bonus500.js.
 *   В этом файле только вёрстка, общая для всех парков.
 *
 * ⚠ КНОПКА ВЕДЁТ ПРЯМО В ЛИЧНЫЙ КАБИНЕТ, а не в модалку «Войти». Модалка
 *   существует, чтобы выбрать парк, — а здесь парк уже известен из адреса.
 *   Лишний экран с выбором на этом пути стоил бы части регистраций.
 *
 * ⚠ СЧЁТЧИК. Два события: «Бонус — открыл» (страница показалась) и
 *   «Бонус — забрать» (нажал кнопку). Разница между ними — вся воронка
 *   наклейки. Дальше видно только то, что покажет сам личный кабинет:
 *   счётчика на lk.b00m.fun пока нет (решение владельца 24.08 — вторым
 *   этапом). Поэтому «нажал кнопку» ≠ «зарегистрировался», и сводить эти
 *   две цифры в один процент нельзя.
 */
import { onMounted } from 'vue'
import { bonusPage } from '../data/bonus500'
import { track } from '../analytics/boom-stat'

const props = defineProps({
  /* Имя страницы: 'ohtamall'. Совпадает с именем файла в bonus500/. */
  page: { type: String, required: true }
})

const data = bonusPage(props.page)

onMounted(() => {
  if (data) track('Бонус — открыл', { park: data.park })
})

function claim () {
  if (data) track('Бонус — забрать', { park: data.park })
  /* Ссылку не отменяем — браузер откроет её сам. Событие успеет уйти:
     boom-stat отправляет его через sendBeacon. */
}
</script>

<template>
  <div v-if="data" class="b5" :style="{ '--pk': data.accent }">
    <!-- ── Шапка: ровно то же, что на наклейке ───────────────────────── -->
    <header class="b5-hero">
      <div class="b5-floor">{{ data.floor }} ЭТАЖ · {{ data.name.toUpperCase() }}</div>

      <div class="b5-badge">НА СТАРТ</div>
      <h1 class="b5-title">БОНУС</h1>

      <div class="b5-amount">
        <span class="b5-plus">+</span>{{ data.amount }}
        <span class="b5-unit">{{ data.unit }}</span>
      </div>

      <p class="b5-lead">
        Зарегистрируйся в личном кабинете — бонус придёт на карту сам.
      </p>

      <a
        class="b5-cta"
        :href="data.lk"
        target="_blank"
        rel="noopener noreferrer"
        @click="claim"
      >
        Забрать {{ data.amount }} {{ data.unit }}
      </a>

      <div class="b5-note">Откроется в новом окне · регистрация по номеру телефона</div>
    </header>

    <!-- ── Три шага ──────────────────────────────────────────────────── -->
    <section class="b5-steps">
      <div class="b5-step">
        <span class="b5-num">01</span>
        <div>
          <div class="b5-step-t">Введи номер телефона</div>
          <div class="b5-step-d">Больше ничего не нужно — ни почты, ни анкеты.</div>
        </div>
      </div>
      <div class="b5-step">
        <span class="b5-num">02</span>
        <div>
          <div class="b5-step-t">Система проверит, впервые ли ты у нас</div>
          <div class="b5-step-d">
            Если такого номера в базе нет — бонус начислится автоматически.
          </div>
        </div>
      </div>
      <div class="b5-step">
        <span class="b5-num">03</span>
        <div>
          <div class="b5-step-t">Приходи играть</div>
          <div class="b5-step-d">
            {{ data.name }}, {{ data.address }}. Каждый день с 10 до 22.
          </div>
        </div>
      </div>
    </section>

    <!-- ── Мелким шрифтом ────────────────────────────────────────────── -->
    <section class="b5-fine">
      <p>
        Бонус — один на номер телефона и только для тех, кто регистрируется
        впервые. Если карта уже была оформлена на этот номер, бонус не начислится.
      </p>
      <p>
        <a href="/charge">Как устроены заряды</a> ·
        <a href="/prizes">Призы</a> ·
        <a href="/terms">Условия использования</a>
      </p>
    </section>
  </div>

  <!-- Парка нет в bonus500.js: лучше честная надпись, чем пустой экран -->
  <div v-else class="b5 b5-empty">
    <h1 class="b5-title">Страница готовится</h1>
    <p class="b5-lead">Загляни на <a href="/parks">страницу парков</a>.</p>
  </div>
</template>

<style scoped>
/* Палитра берётся из theme/boom-styles.css (--lime, --cyan, --text-pri...).
   Вторая система переменных из theme/style.css здесь НЕ используется. */

.b5 {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  color: var(--text-pri);
  font-family: var(--font-body);
  text-align: center;
}

/* ── Шапка ── */
.b5-hero { padding-bottom: 8px; }

.b5-floor {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--text-sec);
  margin-bottom: 22px;
}

.b5-badge {
  display: inline-block;
  padding: 6px 18px;
  border-radius: 999px;
  background: var(--pk);
  color: #fff;
  font-family: var(--font-head);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  transform: rotate(-2deg);
  margin-bottom: 6px;
}

.b5-title {
  font-family: var(--font-head);
  font-size: clamp(46px, 16vw, 76px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
  border: none;   /* VitePress рисует h1 с подчёркиванием — здесь оно лишнее */
}

.b5-amount {
  display: inline-block;
  padding: 14px 26px 12px;
  background: #fff;
  color: var(--pk);
  border-radius: 10px;
  transform: rotate(-2deg);
  font-family: var(--font-head);
  font-size: clamp(38px, 12vw, 56px);
  font-weight: 900;
  line-height: 1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
.b5-plus { font-size: 0.7em; vertical-align: 0.12em; }
.b5-unit {
  display: block;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
  margin-top: 2px;
}

.b5-lead {
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-pri);
  margin: 26px auto 22px;
  max-width: 380px;
}

/* Кнопка — лаймовая, как на наклейке. Единственное яркое пятно на экране. */
.b5-cta {
  display: block;
  padding: 18px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--lime), var(--lime-dim));
  color: var(--bg-deep);
  font-family: var(--font-head);
  font-size: 17px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 26px rgba(197, 249, 70, 0.22);
}
.b5-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(197, 249, 70, 0.32); }
.b5-cta:active { transform: translateY(0); }

.b5-note {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-sec);
  margin-top: 12px;
}

/* ── Шаги ── */
.b5-steps {
  margin-top: 44px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: left;
}

.b5-step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.b5-num {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--lime);
  padding-top: 2px;
}

.b5-step-t { font-weight: 700; font-size: 15px; margin-bottom: 3px; }
.b5-step-d { font-size: 13px; line-height: 1.5; color: var(--text-sec); }

/* ── Мелкий шрифт ── */
.b5-fine {
  margin-top: 32px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-sec);
}
.b5-fine a { color: var(--cyan); text-decoration: none; }
.b5-fine a:hover { text-decoration: underline; }

.b5-empty { padding-top: 80px; }
</style>
