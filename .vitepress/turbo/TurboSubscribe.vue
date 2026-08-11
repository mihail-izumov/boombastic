<script setup>
/**
 * TurboSubscribe — страница подписки на расписание турбо-часов.
 * Адрес: b00m.fun/turbo/index  (файл turbo/index.md)
 *
 * ⚠ КУДА ВЕДЁТ QR — НЕ ПРОСТО НАСТРОЙКА. Код зашит одним <path> в носителе
 *   boom-cmd/media/turbo/index.html и кодирует ровно https://b00m.fun/turbo/index.
 *   Поменяется адрес — QR надо перегенерировать и переиздать носители в трёх
 *   парках. Поэтому путь turbo/index.md менять нельзя без этой работы.
 *
 * ⚠ ПАРК ПРИХОДИТ ИЗ ССЫЛКИ И ТОГДА НЕ МЕНЯЕТСЯ. QR каждого парка кодирует
 *   свой адрес (?park=ohta и т.д.), и гость, отсканировавший код у кассы Охты,
 *   подписывается на Охту — переключателя ему не нужно.
 *
 *   Заход БЕЗ параметра остаётся рабочим и показывает выбор: по прямой ссылке,
 *   из репоста или набранный руками адрес не должен превращаться в тупик.
 *
 * ⚠ ОПЕЧАТКА В ?park= НЕ ПОДМЕНЯЕТ ПАРК МОЛЧА. Ровно эти грабли ловили на
 *   носителе ТУРБО в бою (v1.8): `piterlend` показывал Охту, и понять это по
 *   экрану было нельзя. Здесь неизвестный код скатывается к выбору вручную —
 *   лучше лишний вопрос гостю, чем подписка не на тот парк.
 *
 * ⚠ ДИЗАЙН — ЭТО СТИЛЬ b00m.fun, А НЕ boom-cmd. Сайт принудительно тёмный
 *   (appearance:false + classList.add('dark') в config.mts), палитра —
 *   циан/маджента/лайм. DESIGN-STANDARD boom-cmd (светлая тема, LEGO-палитра,
 *   монохромный текст) описывает ДРУГОЙ продукт и на этот домен не переносится.
 */
import { ref, computed, onMounted } from 'vue'

const PARKS = [
  { code: 'ohta', name: 'Охта Молл' },
  { code: 'piterland', name: 'Питерленд' },
  { code: 'iyun', name: 'ТЦ Июнь' }
]

/* Откуда пришёл гость. Пишется в колонку source и отвечает на вопрос, который
   иначе не задать: работает экран у кассы или печатный тейблтент. Чужое
   значение не пропускаем — в таблицу должно попадать только известное. */
const SOURCES = { tv: 'turbo-tv', tent: 'turbo-tent', qr: 'turbo-qr' }

/* Версия страницы. Нужна не для красоты: сегодня мы полдня выясняли, доехала
   ли сборка до боя. Теперь это видно в DOM — data-v на корне. */
const PAGE_VERSION = 'v1.2-visits'

/* Эндпойнт приходит из переменной сборки, а не лежит строкой в репозитории.
   Секретом он не является — гость с телефона дёргает его сам, — но и
   индексировать его в публичном репо незачем. */
const API = import.meta.env.VITE_SUBSCRIBE_API || ''

const email = ref('')
const park = ref('')
const parkLocked = ref(false) // парк пришёл из QR — переключатель не нужен
const source = ref('turbo-qr')
const consent = ref(false)
const hp = ref('')          // honeypot: человек его не видит и не заполняет
const openedAt = ref(0)     // сколько форма была открыта — фильтр от скриптов
const state = ref('idle')   // idle | sending | done | error
const errorText = ref('')

/* Страница статическая: на сервере параметра ?park= ещё нет, и блок парка
   отрисовался бы выбором из трёх кнопок, которые сразу после гидратации
   схлопнулись бы в один зафиксированный парк. Гость успевает заметить это
   мигание. Поэтому блок парка ждёт монтирования — место под него держит CSS,
   чтобы форма не прыгала. */
const ready = ref(false)

const parkName = computed(() => (PARKS.find(p => p.code === park.value) || {}).name || '')

onMounted(() => {
  openedAt.value = Date.now()
  try {
    // window.location, а не голый location: явнее и не зависит от того, есть
    // ли глобальная переменная с таким именем в окружении, где идёт приёмка.
    const q = new URLSearchParams(window.location.search)

    const p = q.get('park')
    if (p && PARKS.some(x => x.code === p)) {
      park.value = p
      parkLocked.value = true
    }
    // Неизвестный код НЕ подставляем: parkLocked остаётся false, гость видит
    // выбор. Молчаливая подмена парка — та самая грабля носителя v1.8.

    const s = q.get('src')
    if (s && SOURCES[s]) source.value = SOURCES[s]
  } catch (e) { /* ссылка без параметров — обычный случай */ }
  ready.value = true
  trackVisit()
})

/**
 * Отметка перехода по QR. Нужна, чтобы знать знаменатель: сколько человек
 * отсканировало код и сколько из них дошло до подписки. Без неё у нас есть
 * только те, кто подписался, — и непонятно, плохой QR или плохая страница.
 *
 * ⚠ Не блокирует и не может сломать форму. Ошибка сети, отвалившийся скрипт,
 *   выключенные квоты — всё глотается молча. Статистика не стоит того, чтобы
 *   из-за неё гость не смог подписаться.
 *
 * ⚠ Один раз за вкладку. Гость крутит страницу, возвращается назад,
 *   перезагружает — это один переход, а не пять. Иначе первый же человек,
 *   у которого страница висит открытой, накрутит статистику до бессмыслицы.
 */
function trackVisit () {
  if (!API) return
  try {
    // Везде window.*, а не голые глобалы: ровно на этом уже спотыкались с
    // location — ошибка уходила в catch, и парк из QR молча не подставлялся.
    if (window.sessionStorage.getItem('boom-turbo-visit')) return
    window.sessionStorage.setItem('boom-turbo-visit', '1')

    // Первый ли это заход с устройства. Не идентификатор гостя, а один флаг:
    // сквозной id связал бы визит с подпиской, но это уже слежение за
    // человеком, и решать такое должен владелец, а не разработчик.
    const first = !window.localStorage.getItem('boom-turbo-seen')
    if (first) window.localStorage.setItem('boom-turbo-seen', '1')

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      keepalive: true, // гость может уйти со страницы раньше, чем запрос дойдёт
      body: JSON.stringify({
        kind: 'visit',
        park: park.value,
        source: source.value,
        first
      })
    }).catch(() => {})

    /* ⚠ Дубля в Plausible здесь НЕТ намеренно (решение владельца 11.08:
       «Plausible пока отключён, собираем данные самостоятельно»).
       И убран он не только поэтому: в config.mts стоит заглушка
       `window.plausible = window.plausible || function(){…q.push…}`, из-за
       которой объект определён ВСЕГДА — даже когда скрипт не загрузился.
       То есть проверка `if (window.plausible)` не отличает работающую
       аналитику от выключенной: события молча копились бы в очереди
       в памяти вкладки, а по коду выглядело бы, будто счёт идёт.
       Включат Plausible — вернуть можно одной строкой, но проверять надо
       не наличие функции, а факт загрузки скрипта. */
  } catch (e) { /* приватный режим, запрет storage — не наша забота */ }
}

const emailLooksOk = computed(() => /^[^\s@,;]+@[^\s@,;.]+\.[a-z]{2,}$/i.test(email.value.trim()))
const canSend = computed(() =>
  state.value !== 'sending' && emailLooksOk.value && !!park.value && consent.value
)

async function submit () {
  if (!canSend.value) return
  if (!API) { state.value = 'error'; errorText.value = 'Форма ещё не подключена'; return }

  state.value = 'sending'
  errorText.value = ''

  try {
    /* text/plain — намеренно. application/json превращает запрос в
       preflighted и Apps Script на OPTIONS не отвечает: отправка упадёт
       на CORS ещё до сервера. Тело всё равно разбирается как JSON. */
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify({
        email: email.value.trim(),
        park: park.value,
        consent: consent.value === true,
        dwell: Date.now() - openedAt.value,
        hp: hp.value,
        source: source.value
      })
    })
    const data = await res.json()

    if (data && data.ok) { state.value = 'done'; return }

    state.value = 'error'
    errorText.value = ({
      consent_required: 'Без согласия на обработку данных подписать не можем',
      bad_email: 'Проверь адрес — кажется, в нём опечатка',
      bad_park: 'Выбери парк',
      rate_limited: 'Слишком много запросов. Попробуй через минуту',
      not_public: 'Форма настроена неверно — скажи на кассе'
    })[data && data.error] || 'Не дошло. Попробуй ещё раз'
  } catch (e) {
    /* Честное состояние: «не дошло», а не молчаливый успех. Гость, который
       думает, что подписался, а письма нет, — хуже, чем гость, который
       нажмёт кнопку второй раз. */
    state.value = 'error'
    errorText.value = 'Не дошло. Проверь связь и попробуй ещё раз'
  }
}

function retry () { state.value = 'idle'; errorText.value = '' }
</script>

<template>
  <div class="ts-page" :data-v="PAGE_VERSION">
    <div class="ts-wrap">

      <header class="ts-head">
        <div class="ts-kicker">ТУРБО-ЧАСЫ</div>
        <h1 class="ts-title">Узнавай первым</h1>
        <p class="ts-lead">
          Публично объявляем только турбо-вторник. Остальные часы недели —
          на почту подписчикам.
        </p>
      </header>

      <!-- ─────────── УСПЕХ ─────────── -->
      <section v-if="state === 'done'" class="ts-card ts-done">
        <div class="ts-done-mark" aria-hidden="true">✓</div>
        <h2 class="ts-done-title">Адрес записан</h2>
        <p class="ts-done-text">
          Пришлём расписание турбо-часов на неделю, как только парк его утвердит.
          Письмо придёт с адреса БумБастика — если не увидишь, загляни в «Промоакции».
        </p>
        <p class="ts-done-sub">
          Ошибся адресом? <button class="ts-linkbtn" type="button" @click="retry">Отправить заново</button>
        </p>
      </section>

      <!-- ─────────── ФОРМА ─────────── -->
      <form v-else class="ts-card" @submit.prevent="submit">

        <div class="ts-field ts-parkslot" role="group" aria-label="Твой парк">
          <div class="ts-label">Твой парк</div>

          <!-- Парк из QR: не выбор, а факт. Показываем, чтобы гость видел, на
               что подписывается, — но переключать нечего. -->
          <div v-if="ready && parkLocked" class="ts-parklock">{{ parkName }}</div>

          <div v-else-if="ready" class="ts-parks">
            <button
              v-for="p in PARKS"
              :key="p.code"
              type="button"
              class="ts-park"
              :class="{ 'is-on': park === p.code }"
              :aria-pressed="park === p.code"
              @click="park = p.code"
            >{{ p.name }}</button>
          </div>

          <p class="ts-hint">Расписание у каждого парка своё</p>
        </div>

        <div class="ts-field">
          <label class="ts-label" for="ts-email">Почта</label>
          <input
            id="ts-email"
            v-model="email"
            class="ts-input"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="you@example.com"
            :disabled="state === 'sending'"
          >
        </div>

        <!-- Honeypot. Скрыт от человека и от скринридера, но не display:none:
             часть ботов такие поля игнорирует. Заполнено — запрос отбивается. -->
        <div class="ts-hp" aria-hidden="true">
          <label for="ts-company">Компания</label>
          <input id="ts-company" v-model="hp" type="text" tabindex="-1" autocomplete="off">
        </div>

        <label class="ts-consent">
          <input v-model="consent" type="checkbox" class="ts-check">
          <span>
            Согласен на обработку адреса для рассылки расписания —
            <a href="/terms" target="_blank" rel="noopener">условия и политика</a>.
            Отписаться можно в любой момент.
          </span>
        </label>

        <button class="ts-submit" type="submit" :disabled="!canSend">
          {{ state === 'sending' ? 'Отправляем…' : 'Присылать расписание' }}
        </button>

        <p v-if="state === 'error'" class="ts-error" role="alert">{{ errorText }}</p>
      </form>

      <!-- ─────────── РОЗЫГРЫШ: УСЛОВИЕ ЦЕЛИКОМ ───────────
           На панели у кассы написано «Каждую неделю разыгрываем 15 турбо-игр
           БЕСПЛАТНО» — без условий. Гость сканирует QR с этим ожиданием и
           попадает сюда. Если здесь условие тоже не назвать, страница подписки
           закрепит обещание, которого механика (§6в) не даёт: там нужны
           пополнение от 1 500 ₽ и покупка турбо-пакета. Блок стоит ПОСЛЕ формы
           намеренно — он уточняет, а не отпугивает на входе. -->
      <section class="ts-note">
        <h2 class="ts-note-title">Про розыгрыш 15 игр</h2>
        <p>
          Каждую неделю разыгрываем пакет «Турбо S» — 15 игр. Участвуют гости с
          пополнением карты <b>от 1 500 ₽</b> и покупкой турбо-пакета.
        </p>
        <p class="ts-note-dim">
          Подписка на расписание — отдельная вещь: она бесплатная и в розыгрыш
          сама по себе не вводит.
        </p>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Палитра — сайта b00m.fun (config.mts: тема принудительно тёмная).
   Контраст каждой пары посчитан по WCAG 2.1, цифры — в отчёте о поставке. */
.ts-page{
  --ink:#F0F4FF;      /* основной текст   — 15.07:1 на --bg, 13.73:1 на --card */
  --dim:#B9C0E0;      /* вторичный текст  —  9.22:1 на --bg,  8.40:1 на --card */
  --cyan:#00D4FF;     /* акцент и ссылки  —  8.53:1 на --card */
  --lime:#C5F946;     /* кнопка-заливка; текст по ней тёмный — 15.13:1 */
  --pink:#FF0080;     /* ТОЛЬКО рамка и подложка. Текстом даёт 4.00:1 — не AA */
  --bg:#1C1A3E;
  --card:#222050;
  --line:rgba(255,255,255,.14);
  --dark:#101026;

  background:linear-gradient(165deg,#222050,#1c1a3e);
  min-height:100vh;
  padding:
    calc(24px + env(safe-area-inset-top)) 16px
    calc(40px + env(safe-area-inset-bottom));
  color:var(--ink);
  font-family:'Inter',system-ui,sans-serif;
}
/* ПК не целевой: та же мобильная колонка по центру. */
.ts-wrap{max-width:430px;margin:0 auto}

.ts-head{margin-bottom:20px}
.ts-kicker{
  font-family:'Space Mono',monospace;font-size:13px;font-weight:700;
  color:var(--cyan);letter-spacing:.12em;margin-bottom:8px;
}
.ts-title{
  font-family:'Montserrat',sans-serif;font-weight:900;
  font-size:30px;line-height:1.12;margin:0 0 10px;color:var(--ink);
}
.ts-lead{font-size:15px;line-height:1.5;color:var(--dim);margin:0}

.ts-card{
  background:var(--card);
  border:1.5px solid rgba(0,212,255,.25);
  border-radius:16px;
  padding:20px 18px;
  display:flex;flex-direction:column;gap:18px;
}

.ts-field{border:0;padding:0;margin:0;min-width:0}

/* Место под блок парка держится заранее: он появляется после монтирования,
   и без резерва форма дёргалась бы вверх-вниз на глазах у гостя.
   52px — высота плашки/кнопок, 10px — отступ до подсказки. */
.ts-parkslot{min-height:calc(52px + 10px + 34px)}
.ts-label{
  display:block;font-size:13px;font-weight:700;color:var(--dim);
  letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px;padding:0;
}

/* Три парка в строку. minmax(0,1fr), а не 1fr: «Питерленд» длиннее соседей и
   на 1fr раздвинул бы свою колонку, сжав остальные. */
.ts-parks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ts-park{
  min-height:52px;                 /* ≥44pt тач-таргет */
  padding:8px 6px;border-radius:10px;
  border:1.5px solid var(--line);
  background:rgba(255,255,255,.04);
  color:var(--ink);
  font-family:inherit;font-size:13px;font-weight:600;line-height:1.25;
  cursor:pointer;transition:border-color .18s,background .18s;
}
.ts-park.is-on{
  border-color:var(--cyan);
  background:rgba(0,212,255,.14);
}
.ts-hint{font-size:12.5px;color:var(--dim);margin:8px 0 0}

/* Зафиксированный парк. Намеренно НЕ похож на кнопку: если он выглядит
   нажимаемым, гость будет по нему стучать и решит, что страница сломана. */
.ts-parklock{
  min-height:52px;display:flex;align-items:center;
  padding:12px 14px;border-radius:10px;
  border:1.5px solid rgba(0,212,255,.35);
  background:rgba(0,212,255,.10);
  font-family:'Montserrat',sans-serif;font-size:17px;font-weight:700;
  color:var(--ink);
}

.ts-input{
  width:100%;min-height:52px;box-sizing:border-box;
  padding:14px 14px;border-radius:10px;
  border:1.5px solid var(--line);
  background:rgba(255,255,255,.04);
  color:var(--ink);
  font-family:inherit;font-size:16px;   /* <16px iOS зумит страницу при фокусе */
}
.ts-input::placeholder{color:#8E97BE}
.ts-input:focus{outline:none;border-color:var(--cyan)}

/* Honeypot: уводим за пределы экрана, а не display:none. */
.ts-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}

.ts-consent{
  display:flex;gap:12px;align-items:flex-start;
  font-size:13.5px;line-height:1.45;color:var(--dim);cursor:pointer;
}
.ts-check{
  flex:0 0 auto;width:22px;height:22px;margin:1px 0 0;
  accent-color:var(--cyan);cursor:pointer;
}
.ts-consent a{color:var(--cyan);text-decoration:underline}

.ts-submit{
  min-height:52px;border:0;border-radius:12px;
  background:var(--lime);color:var(--dark);
  font-family:inherit;font-size:16px;font-weight:700;
  cursor:pointer;transition:opacity .18s;
}
.ts-submit:disabled{opacity:.45;cursor:not-allowed}

.ts-error{
  margin:0;font-size:13.5px;font-weight:600;line-height:1.4;
  color:#FFB4B4;   /* осветлённый красный — 8.95:1. Чистый #D92D20 дал бы 3.13:1 */
}

.ts-done{align-items:center;text-align:center}
.ts-done-mark{
  width:56px;height:56px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:rgba(197,249,70,.16);border:1.5px solid var(--lime);
  color:var(--lime);font-size:26px;font-weight:700;
}
.ts-done-title{font-family:'Montserrat',sans-serif;font-size:21px;font-weight:700;margin:0}
.ts-done-text{font-size:14.5px;line-height:1.5;color:var(--dim);margin:0}
.ts-done-sub{font-size:13.5px;color:var(--dim);margin:0}
.ts-linkbtn{
  background:none;border:0;padding:0;cursor:pointer;
  color:var(--cyan);font:inherit;text-decoration:underline;
}

.ts-note{
  margin-top:22px;padding:16px 18px;border-radius:14px;
  border:1px solid rgba(255,0,128,.28);background:rgba(255,0,128,.06);
}
.ts-note-title{
  font-family:'Montserrat',sans-serif;font-size:16px;font-weight:700;
  margin:0 0 8px;color:var(--ink);
}
.ts-note p{font-size:13.5px;line-height:1.5;color:var(--dim);margin:0 0 6px}
.ts-note p:last-child{margin-bottom:0}
.ts-note-dim{color:#9AA3C8 !important}
.ts-note b{color:var(--ink)}
</style>
