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
 * ⚠ ДИЗАЙН ВЕДЁТСЯ ОТ ТВ-ПАНЕЛИ ТУРБО, А НЕ ОТ ОСТАЛЬНОГО b00m.fun И НЕ ОТ
 *   boom-cmd. Гость видит панель у кассы и через три секунды — эту страницу.
 *   Решение владельца 11.08: тянем полную преемственность — токены и гарнитуру
 *   панели (boom-cmd/media/turbo/index.html). Раньше здесь стояла палитра сайта
 *   (#1C1A3E / циан #00D4FF / Montserrat), и стык читался как переход на чужой
 *   ресурс. DESIGN-STANDARD boom-cmd (светлая тема, LEGO-палитра, монохромный
 *   текст) описывает ТРЕТИЙ продукт и сюда не переносится вовсе.
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

/* Версия страницы. Нужна не для красоты: 11.08 мы полдня выясняли, доехала
   ли сборка до боя. Теперь это видно в DOM — data-v на корне. */
const PAGE_VERSION = 'v1.7-live-cta'

/**
 * ПРАВИЛА РОЗЫГРЫША — три документа, по одному на парк.
 *
 * Почему три, а не один: у парков разные организаторы, а «сроки, организатор,
 * порядок определения победителя» — это ровно то, что требует назвать закон о
 * рекламе. Один общий текст на три юрлица был бы неправдой.
 *
 * Почему модалкой, а не страницей в /terms (решение владельца 11.08): ссылка
 * наружу уводит гостя с формы, а вернётся он вряд ли. Документ нужен, чтобы
 * он был доступен и назван, — читать его почти никто не будет.
 *
 * ⚠ ТЕКСТА ПОКА НЕТ — слоты пустые, и это НЕ забытая заглушка. Пока
 *   `blocks` пуст, кнопка «Правила розыгрыша» не отображается вовсе: пустая
 *   модалка хуже отсутствующей. Текст готовится отдельной задачей по ТЗ
 *   `boom-cmd-data/tasks/ТЗ-правила-розыгрыша-турбо-игр.md` — вставить его
 *   сюда, и кнопка появится сама, без правок разметки.
 *
 * ⚠ Формат намеренно структурный, а не строка HTML. Через `v-html` сюда можно
 *   было бы вставить что угодно, включая скрипт; заголовки и абзацы отдельными
 *   полями такой возможности не дают в принципе.
 */
const RULES = {
  ohta:      { org: '', updated: '', blocks: [] },
  piterland: { org: '', updated: '', blocks: [] },
  iyun:      { org: '', updated: '', blocks: [] }
}

/* Эндпойнт приходит из переменной сборки, а не лежит строкой в репозитории.
   Секретом он не является — гость с телефона дёргает его сам, — но и
   индексировать его в публичном репо незачем. */
const API = import.meta.env.VITE_SUBSCRIBE_API || ''

const email = ref('')
const park = ref('')
const parkLocked = ref(false) // парк пришёл из QR — переключатель не нужен
const source = ref('turbo-qr')
/* ДВА СОГЛАСИЯ, А НЕ ОДНО (решение владельца 11.08).
   `privacy.md` §3.1 разделяет цели: обработка адреса — одно, «направление
   рекламных и информационных материалов, специальных предложений» — другое,
   и оно требует ОТДЕЛЬНОГО согласия. Рассылка расписания — вторая цель, и
   общая галочка про обработку её не покрывает.

   Оба обязательны: услуга, за которой пришёл гость, и есть рассылка, так что
   «обработать адрес, но не писать» — не сценарий, а тупик.

   ⚠ `consent` уходит в скрипт под прежним именем и с прежним смыслом —
     контракт `doPost` не тронут. `mailing` — новое поле, см. submit(). */
const consent = ref(false)
const mailing = ref(false)
const hp = ref('')          // honeypot: человек его не видит и не заполняет
const openedAt = ref(0)     // сколько форма была открыта — фильтр от скриптов
const state = ref('idle')   // idle | sending | done | error
const errorText = ref('')

/* Страница статическая: на сервере параметра ?park= ещё нет. Блок, зависящий
   от парка, ждёт монтирования, иначе гость успевает заметить, как выбор из
   трёх кнопок схлопывается в один зафиксированный парк. */
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
  state.value !== 'sending' && emailLooksOk.value && !!park.value &&
  consent.value && mailing.value
)

/**
 * Чего не хватает для отправки. Пустая строка — всё на месте.
 *
 * Порядок сверху вниз повторяет порядок полей на экране: гость получает
 * подсказку про первое незаполненное, а не про случайное.
 */
const missing = computed(() => {
  if (!park.value) return 'Выбери парк'
  if (!email.value.trim()) return 'Впиши почту — на неё придёт расписание'
  if (!emailLooksOk.value) return 'Проверь адрес — кажется, опечатка'
  if (!consent.value && !mailing.value) return 'Поставь обе галочки'
  if (!consent.value) return 'Без согласия на обработку адреса подписать не можем'
  return 'Отметь согласие на получение писем — иначе присылать нечего и некуда'
})

async function submit () {
  /* Кнопка НЕ выключается, пока форма пуста (решение владельца 11.08).
     Выключенная кнопка на этой странице оказалась хуже: единственное яркое
     пятно гасло, форма выглядела плоской, а гость не понимал ни того, что
     это кнопка, ни того, чего ей не хватает. Теперь она всегда лаймовая, а
     на нажатие отвечает — называет первое незаполненное поле. */
  if (!canSend.value) {
    if (state.value === 'sending') return
    state.value = 'error'
    errorText.value = missing.value
    return
  }
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
        /* ⚠ Новое поле. Apps Script `boom-subscribers` до v1.2 его не знает и
           молча выбросит: лист `subscribers` — это ts | email | park | status |
           consent_at | source, колонки под рассылку в нём нет. Значит порядок
           выкладки обязателен: СНАЧАЛА скрипт v1.2, ПОТОМ эта страница.
           Наоборот — гость ставит вторую галочку, а согласие никуда не
           попадает, и доказать его потом нечем. Задание — в
           boom-cmd-data/tasks/ЗАДАНИЕ-boom-subscribers-v1.2-mailing.md */
        mailing: mailing.value === true,
        dwell: Date.now() - openedAt.value,
        hp: hp.value,
        source: source.value
      })
    })
    const data = await res.json()

    if (data && data.ok) { state.value = 'done'; return }

    state.value = 'error'
    errorText.value = ({
      consent_required: 'Без согласия подписать не можем',
      bad_email: 'Проверь адрес — кажется, опечатка',
      bad_park: 'Выбери парк',
      rate_limited: 'Слишком часто. Попробуй через минуту',
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

/* Возврат к форме. Вопрос «Ошибся адресом?» с экрана убран (решение владельца
   11.08: аудитория молодая, объяснять не нужно), но сам путь оставлен тихой
   ссылкой внизу карточки. Цена опечатки несимметрична: адрес с опечаткой —
   это мёртвая подписка навсегда, и узнать о ней нам не по чему. */
function retry () { state.value = 'idle'; errorText.value = '' }

/* ─────────── МОДАЛКА С ПРАВИЛАМИ ───────────
   Правила показываются только у того парка, который уже известен: по QR он
   приходит из ссылки, при прямом заходе — после выбора. Показывать чужие
   правила или все три сразу нельзя: организаторы разные. */
const rulesOpen = ref(false)
const rules = computed(() => RULES[park.value] || null)
const rulesReady = computed(() => !!(rules.value && rules.value.blocks.length))

/* Элемент, которому возвращаем фокус после закрытия. Без этого фокус после
   Esc уезжает в начало документа, и клавиатурный гость теряет место. */
let rulesOpener = null

function openRules (e) {
  if (!rulesReady.value) return
  rulesOpener = (e && e.currentTarget) || null
  rulesOpen.value = true
  try {
    // window.document, а не голый document — та же грабля, на которой уже
    // спотыкались с location и sessionStorage: ошибка ушла бы в catch молча.
    window.document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onRulesKey)
  } catch (e2) { /* модалка не должна ронять страницу ни при каких условиях */ }
}

function closeRules () {
  rulesOpen.value = false
  try {
    window.document.body.style.overflow = ''
    window.removeEventListener('keydown', onRulesKey)
    if (rulesOpener && rulesOpener.focus) rulesOpener.focus()
  } catch (e) { /* см. выше */ }
  rulesOpener = null
}

function onRulesKey (e) { if (e.key === 'Escape') closeRules() }
</script>

<template>
  <div class="ts-page" :data-v="PAGE_VERSION">
    <div class="ts-wrap">

      <header class="ts-head">

        <!-- ─────────── ПЛАШКА ПАРКА ───────────
             Раньше здесь стоял логотип БумБастика и бейдж «БУМБАСТИК // парк»
             — копия шапки ТВ-панели. На сайте это оказалось дублем: наверху
             страницы уже висит навбар b00m.fun с тем же логотипом и тем же
             словом. Осталось единственное, чего в навбаре нет, — парк.

             Ответ на вопрос «на что я подписываюсь» при заходе по QR: парк
             назван здесь, а не отдельным блоком внутри формы.

             ⚠ Класс .ts-parklock обёрнут ровно вокруг имени парка и ни вокруг
               чего больше: приёмка сверяет его textContent с названием.

             Место держится всегда: плашка появляется после монтирования, и без
             резерва шапка при заходе по QR дёргалась бы вниз на глазах. -->
        <div class="ts-parkslot">
          <span v-if="ready && parkLocked" class="ts-badge">
            <span class="ts-parklock">{{ parkName }}</span>
          </span>
        </div>

        <!-- Локап панели: «ТУРБО» и лаймовый бейдж под наклоном — приём, который
             гость запоминает с экрана у кассы целиком.
             ⚠ Слово в бейдже НЕ «ИГРЫ», хотя на панели именно оно. Панель
               продаёт турбо-игры, а эта страница — подписка на турбо-часы, и
               подменять предмет ради буквального совпадения нельзя: гость
               решит, что подписывается на игры. Узнаваемость держит форма
               локапа, а не слово (решение владельца 11.08). -->
        <div class="ts-lockup">
          <div class="ts-lockup-main">ТУРБО</div>
          <div class="ts-lockup-sub">ЧАСЫ</div>
        </div>

        <h1 class="ts-title">Узнавай первым</h1>
        <p class="ts-lead">
          На экране в парке — только турбо-вторник.
          Остальные турбо-часы недели приходят на почту.
        </p>
      </header>

      <!-- ─────────── УСПЕХ ───────────
           Подписка — часть игры, а не квитанция. Поэтому здесь не «адрес
           записан», а короткий праздник и три шага в ритме блока «Как это
           работает» с панели: гость уже читал такой список и прочитает второй.
           Прикладная цель у шагов одна — чтобы письмо потом открыли: заранее
           сказано, от кого оно придёт и в какой вкладке искать. -->
      <section v-if="state === 'done'" class="ts-card ts-done">
        <div class="ts-burst" aria-hidden="true">
          <span v-for="n in 8" :key="n" class="ts-spark" :style="{ '--i': n }"></span>
          <div class="ts-mark">✓</div>
        </div>

        <h2 class="ts-done-title">Ты в списке</h2>

        <ol class="ts-steps">
          <li class="ts-step">
            <span class="ts-num">1</span>
            <span class="ts-step-body">
              <b>Ждём расписание</b>
              парк утверждает турбо-часы на неделю
            </span>
          </li>
          <li class="ts-step">
            <span class="ts-num">2</span>
            <span class="ts-step-body">
              <b>Пишем тебе</b>
              письмо придёт с адреса <span class="ts-mail">turbo@b00m.fun</span> —
              если не видишь, загляни во вкладку «Промоакции»
            </span>
          </li>
          <li class="ts-step">
            <span class="ts-num">3</span>
            <span class="ts-step-body">
              <b>Играешь дешевле</b>
              берёшь турбо-пакет заранее и приходишь в свои часы
            </span>
          </li>
        </ol>

        <button class="ts-quiet" type="button" @click="retry">Изменить адрес</button>
      </section>

      <!-- ─────────── ФОРМА ─────────── -->
      <form v-else class="ts-card" @submit.prevent="submit">

        <!-- Блок парка живёт здесь ТОЛЬКО при прямом заходе: по QR парк уже
             назван в шапке, и повторять его над полем почты незачем.
             Резерва высоты под этот блок нет намеренно: заход по QR —
             основной сценарий, и в нём ничего не появляется и не прыгает.
             Прямой заход редкий, там форма один раз доедет вниз. -->
        <div v-if="ready && !parkLocked" class="ts-field" role="group" aria-label="Какой парк">
          <div class="ts-label">Какой парк</div>
          <div class="ts-parks">
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
          <p class="ts-hint">У каждого парка своё расписание</p>
        </div>

        <div class="ts-field">
          <label class="ts-label" for="ts-email">Куда присылать</label>
          <input
            id="ts-email"
            v-model="email"
            class="ts-input"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="твоя@почта.ру"
            :disabled="state === 'sending'"
          >
        </div>

        <!-- Honeypot. Скрыт от человека и от скринридера, но не display:none:
             часть ботов такие поля игнорирует. Заполнено — запрос отбивается. -->
        <div class="ts-hp" aria-hidden="true">
          <label for="ts-company">Компания</label>
          <input id="ts-company" v-model="hp" type="text" tabindex="-1" autocomplete="off">
        </div>

        <!-- Два согласия: обработка адреса и рассылка — разные цели по
             `privacy.md` §3.1, и вторая требует отдельного согласия.
             Безличная формула вместо «Согласен»: страница на «ты» и обращена
             к кому угодно, родовое окончание тут лишнее. Длинную юридическую
             фразу держит страница /terms, а не форма. -->
        <div class="ts-consents">
          <label class="ts-consent">
            <input v-model="consent" type="checkbox" class="ts-check">
            <span>Согласие на обработку адреса — <a href="/terms" target="_blank" rel="noopener">условия и политика</a>.</span>
          </label>
          <label class="ts-consent">
            <input v-model="mailing" type="checkbox" class="ts-check">
            <span>Согласие получать письма с расписанием.</span>
          </label>
        </div>

        <!-- `disabled` только на время отправки — чтобы не улетело два запроса.
             Незаполненную форму кнопка не блокирует, а объясняет: см. submit(). -->
        <button class="ts-submit" type="submit" :disabled="state === 'sending'">
          {{ state === 'sending' ? 'Отправляем…' : 'Хочу знать первым' }}
        </button>

        <p v-if="state === 'error'" class="ts-error" role="alert">{{ errorText }}</p>
      </form>

      <!-- ─────────── РОЗЫГРЫШ: УСЛОВИЕ ЦЕЛИКОМ ───────────
           На панели у кассы написано «Каждую неделю разыгрываем 15 турбо-игр
           БЕСПЛАТНО» — без условий. Гость сканирует QR с этим ожиданием и
           попадает сюда. Если здесь условие тоже не назвать, страница подписки
           закрепит обещание, которого механика (§6в) не даёт: там нужны
           пополнение от 1 500 ₽ и покупка турбо-пакета. Блок стоит ПОСЛЕ формы
           намеренно — он уточняет, а не отпугивает на входе, и оформлен тише
           лаймовой кнопки, чтобы не спорить с ней за внимание. -->
      <section class="ts-note">
        <h2 class="ts-note-title">Розыгрыш 15 игр</h2>
        <p>
          Каждую неделю разыгрываем пакет «Турбо S» — 15 игр. Участвуют гости с
          пополнением карты <b>от 1 500 ₽</b> и покупкой турбо-пакета.
        </p>
        <p class="ts-note-dim">
          Подписка бесплатная и в розыгрыш сама по себе не вводит.
        </p>
        <!-- Кнопки нет, пока у парка не заполнены правила: пустая модалка
             хуже отсутствующей ссылки. Вставят текст — появится сама. -->
        <p v-if="rulesReady" class="ts-note-link">
          <button class="ts-rules-btn" type="button" @click="openRules">Правила розыгрыша</button>
        </p>
      </section>

      <!-- ─────────── ПРАВИЛА: МОДАЛКА ───────────
           Не страница в /terms, а слой поверх (решение владельца 11.08):
           ссылка наружу уводит гостя с формы, и обратно он не возвращается.
           Закрывается тремя способами — крестиком, кликом по подложке и Esc:
           модалка, из которой не выйти привычным жестом, читается как
           поломка страницы. -->
      <div
        v-if="rulesOpen && rulesReady"
        class="ts-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ts-rules-title"
        @click.self="closeRules"
      >
        <div class="ts-modal-box">
          <div class="ts-modal-head">
            <h2 id="ts-rules-title" class="ts-modal-title">Правила розыгрыша<br>{{ parkName }}</h2>
            <button class="ts-modal-x" type="button" aria-label="Закрыть" @click="closeRules">×</button>
          </div>

          <div class="ts-modal-body">
            <section v-for="(b, i) in rules.blocks" :key="i" class="ts-rblock">
              <h3 class="ts-rblock-title">{{ b.h }}</h3>
              <p v-for="(t, j) in b.p" :key="j">{{ t }}</p>
            </section>
            <p class="ts-modal-meta">
              Организатор: {{ rules.org }}<span v-if="rules.updated"> · редакция от {{ rules.updated }}</span>
            </p>
          </div>

          <button class="ts-modal-close" type="button" @click="closeRules">Понятно</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ── Токены ТВ-панели ТУРБО (boom-cmd/media/turbo/index.html), один в один.
      Контраст каждой пары посчитан формулой WCAG 2.1, цифры — в отчёте.
      Две производные, которых на панели нет, потому что там нет такого текста:
      --link  — осветлённый синий: чистый #2d6bff даёт 3.87:1 и мелким
                текстом не проходит AA. Заливкой он остался прежним.
      --err   — осветлённый розовый: #ff3d68 проходит (5.08:1), но текст
                ошибки мелкий и критичный, берём запас. */
.ts-page{
  --bg:#0d0a2e;       /* фон страницы */
  --tile:#171243;     /* карточка              — белый 17.44:1, --muted 6.26:1 */
  --tile2:#1e1856;    /* поля и вложенные плитки */
  --white:#ffffff;
  /* Вторичный текст. На панели стоит #9b94d0, и здесь он тоже стоял — но
     панель кладёт его на плитку, а шапка страницы лежит на градиенте с синей
     подсветкой. Фактический фон под лидом — не #0d0a2e, а ~#1b297a, и на нём
     #9b94d0 даёт 4.58:1: формально AA, на телефоне — «плохо читается».
     Осветлён до 6.43:1 на пике подсветки и 8.78:1 на карточке.
     ⚠ Считать контраст надо на СОСТАВНОМ фоне, а не на токене --bg. */
  --muted:#b9b2e6;
  --lime:#c6f52e;     /* кнопка и бейдж ИГРЫ   — тёмный по ней 15.00:1 */
  --blue:#2d6bff;     /* синий панели: свечение фона, искры — текста по нему нет */
  --blue-ink:#2757d2; /* заливка под белую цифру — 6.21:1. Чистый #2d6bff даёт
                         4.51:1: формально AA, но запас 0.01 при кегле 13 px —
                         это не запас, а совпадение. Оттенок тот же, темнее. */
  --link:#6f9bff;     /* ссылки текстом        — 6.49:1 на --tile */
  --pink:#ff3d68;     /* рамка и подложка */
  --err:#ffa8b8;      /* текст ошибки          — 9.59:1 на --tile */
  --dark:#0d0a2e;
  --line:rgba(255,255,255,.14);

  /* Своей заливки у страницы НЕТ — намеренно.
     Раньше здесь стоял сплошной фон панели (#0d0a2e), а фон сайта b00m.fun —
     #1c1a3e (--bg-deep в theme/style.css). Страница вырезала на сайте тёмный
     прямоугольник и обрывалась в подвал ступенькой.

     Теперь остаётся только подсветка сверху, затухающая в ПРОЗРАЧНОСТЬ:
     страница лежит на фоне сайта, и стыка не существует физически — его
     нечему образовать. Подсветка заодно прижата к ширине колонки (80%
     вместо 120%), иначе на десктопе она расплывалась в широкое пятно.

     ⚠ Контраст пересчитан на новом фоне: худший случай — текст на пике
       подсветки #1f275d, лид даёт 7.02:1. */
  background:
    radial-gradient(80% 42% at 50% 0%, rgba(45,107,255,.16) 0%, rgba(45,107,255,0) 70%);
  min-height:100vh;
  padding:
    calc(20px + env(safe-area-inset-top)) 16px
    calc(40px + env(safe-area-inset-bottom));
  color:var(--white);
  font-family:'Inter',system-ui,sans-serif;
}
/* ПК не целевой: та же мобильная колонка по центру. */
.ts-wrap{max-width:430px;margin:0 auto}

/* ── шапка ── */
.ts-head{margin-bottom:20px;text-align:center}

/* Резерв под плашку парка: 30px плашка + 16px отступ. Держится всегда, чтобы
   шапка не дёргалась после монтирования. */
.ts-parkslot{min-height:46px}
.ts-badge{
  display:inline-flex;align-items:center;
  font-family:'Unbounded',sans-serif;font-weight:700;font-size:12px;letter-spacing:.6px;
  background:rgba(198,245,46,.12);
  border:1px solid rgba(198,245,46,.35);
  border-radius:10px;padding:6px 12px;
  color:var(--white);white-space:nowrap;
}

.ts-lockup{margin-bottom:20px;line-height:1}
.ts-lockup-main{
  font-family:'Unbounded',sans-serif;font-weight:900;
  font-size:44px;line-height:.95;letter-spacing:1px;color:var(--white);
}
.ts-lockup-sub{
  display:inline-block;margin-top:8px;
  font-family:'Unbounded',sans-serif;font-weight:900;
  font-size:15px;letter-spacing:7px;text-indent:7px;
  color:var(--dark);background:var(--lime);
  padding:5px 15px;border-radius:11px;
  transform:rotate(-2deg);
  box-shadow:0 6px 18px rgba(198,245,46,.22);
}

.ts-title{
  font-family:'Unbounded',sans-serif;font-weight:900;
  font-size:26px;line-height:1.15;margin:0 0 10px;color:var(--white);
}
.ts-lead{font-size:15px;line-height:1.5;color:var(--muted);margin:0}

/* ── карточка ── */
.ts-card{
  background:var(--tile);
  border:1px solid rgba(255,255,255,.10);
  border-radius:22px;              /* --radius панели */
  padding:20px 18px;
  display:flex;flex-direction:column;gap:20px;
}

.ts-field{border:0;padding:0;margin:0;min-width:0}
.ts-label{
  display:block;font-size:12px;font-weight:700;color:var(--muted);
  letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px;padding:0;
}

/* Три парка в строку. minmax(0,1fr), а не 1fr: «Питерленд» длиннее соседей и
   на 1fr раздвинул бы свою колонку, сжав остальные. */
.ts-parks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ts-park{
  min-height:52px;                 /* ≥44pt тач-таргет */
  padding:8px 6px;border-radius:12px;
  border:1px solid var(--line);
  background:var(--tile2);
  color:var(--white);
  font-family:inherit;font-size:13px;font-weight:600;line-height:1.25;
  cursor:pointer;transition:border-color .18s,background .18s;
}
.ts-park.is-on{
  border-color:var(--lime);
  background:rgba(198,245,46,.14);
}
.ts-hint{font-size:13px;color:var(--muted);margin:8px 0 0}

.ts-input{
  width:100%;min-height:52px;box-sizing:border-box;
  padding:14px;border-radius:12px;
  border:1px solid var(--line);
  background:var(--tile2);
  color:var(--white);
  font-family:inherit;font-size:16px;   /* <16px iOS зумит страницу при фокусе */
}
.ts-input::placeholder{color:#8a83c2}   /* 4.81:1 на --tile2 */
.ts-input:focus{outline:none;border-color:var(--lime)}

/* Honeypot: уводим за пределы экрана, а не display:none. */
.ts-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}

/* Две галочки идут группой с меньшим зазором, чем между полями формы:
   иначе они читаются как два независимых блока, а это одно решение из двух
   частей. */
.ts-consents{display:flex;flex-direction:column;gap:12px}
.ts-consent{
  display:flex;gap:12px;align-items:center;
  font-size:14px;line-height:1.45;color:var(--muted);cursor:pointer;
}
/* Свой вид, а не системный. `accent-color` красит только ОТМЕЧЕННЫЙ чекбокс;
   пустой остаётся серым системным квадратом, который на тёмном фоне почти не
   виден — гость не понимает, что галочку надо ставить, и упирается в
   выключенную кнопку. */
.ts-check{
  flex:0 0 auto;width:22px;height:22px;margin:0;
  -webkit-appearance:none;appearance:none;
  border:1.5px solid var(--muted);border-radius:6px;
  background:var(--tile2);cursor:pointer;
  display:grid;place-content:center;
  transition:background .15s,border-color .15s;
}
.ts-check::before{
  content:'';width:11px;height:11px;
  clip-path:polygon(14% 44%,0 60%,39% 100%,100% 18%,84% 0,39% 68%);
  background:var(--dark);transform:scale(0);transition:transform .12s ease-out;
}
.ts-check:checked{background:var(--lime);border-color:var(--lime)}
.ts-check:checked::before{transform:scale(1)}
.ts-check:focus-visible{outline:2px solid var(--lime);outline-offset:2px}
.ts-consent a{color:var(--link);text-decoration:underline}

.ts-submit{
  min-height:54px;border:0;border-radius:14px;
  background:var(--lime);color:var(--dark);
  font-family:'Unbounded',sans-serif;font-size:15px;font-weight:700;
  cursor:pointer;transition:opacity .18s,transform .15s;
  box-shadow:0 8px 24px rgba(198,245,46,.18);
}
.ts-submit:not(:disabled):active{transform:scale(.985)}
/* Кнопка гаснет ТОЛЬКО на время отправки. Незаполненная форма её больше не
   выключает — история этого места: сначала стоял `opacity:.4`, дававший
   фактический #57682e (лайм, смешанный с фоном) и 3.11:1, то есть провал AA
   и вид сломанной кнопки; замена на серую плашку контраст починила, но убила
   единственное яркое пятно страницы. Правильным оказалось третье: не гасить
   вовсе, а отвечать на нажатие. */
.ts-submit:disabled{opacity:.6;cursor:progress}

.ts-error{
  margin:0;font-size:14px;font-weight:600;line-height:1.4;
  color:var(--err);   /* 9.59:1. Чистый #ff3d68 дал бы 5.08:1 */
}

/* ── экран успеха ── */
.ts-done{align-items:center;text-align:center;gap:18px}

.ts-burst{position:relative;width:76px;height:76px;display:grid;place-items:center}
.ts-mark{
  width:64px;height:64px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:var(--lime);color:var(--dark);
  font-size:30px;font-weight:800;line-height:1;
  box-shadow:0 0 0 0 rgba(198,245,46,.45);
  animation:ts-pop .5s cubic-bezier(.2,1.5,.4,1) both, ts-glow 1.4s ease-out .35s both;
}
/* Восемь искр по кругу. Чистый CSS: конфетти-библиотеке здесь делать нечего,
   это 20 строк и ни одного килобайта зависимостей. */
.ts-spark{
  position:absolute;width:7px;height:7px;border-radius:2px;
  background:var(--lime);
  transform:rotate(calc(var(--i) * 45deg)) translateY(-14px) scale(0);
  animation:ts-fly .7s ease-out calc(.18s + var(--i) * .02s) both;
}
.ts-spark:nth-child(2n){background:var(--blue)}
.ts-spark:nth-child(3n){background:var(--pink)}

@keyframes ts-pop{
  0%{transform:scale(.3);opacity:0}
  60%{transform:scale(1.12);opacity:1}
  100%{transform:scale(1);opacity:1}
}
@keyframes ts-glow{
  0%{box-shadow:0 0 0 0 rgba(198,245,46,.5)}
  100%{box-shadow:0 0 0 22px rgba(198,245,46,0)}
}
@keyframes ts-fly{
  0%{transform:rotate(calc(var(--i) * 45deg)) translateY(-14px) scale(0);opacity:0}
  35%{opacity:1}
  100%{transform:rotate(calc(var(--i) * 45deg)) translateY(-44px) scale(1);opacity:0}
}

.ts-done-title{
  font-family:'Unbounded',sans-serif;font-size:22px;font-weight:900;
  margin:0;color:var(--white);
}

/* Три шага — тот же приём, что в блоке «Как это работает» на панели:
   синий кружок с номером, жирная строка-действие, пояснение под ней. */
.ts-steps{
  list-style:none;margin:0;padding:0;width:100%;
  display:flex;flex-direction:column;gap:14px;text-align:left;
}
.ts-step{display:flex;gap:12px;align-items:flex-start;animation:ts-rise .45s ease-out both}
.ts-step:nth-child(1){animation-delay:.30s}
.ts-step:nth-child(2){animation-delay:.40s}
.ts-step:nth-child(3){animation-delay:.50s}
.ts-num{
  flex:0 0 auto;width:24px;height:24px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:var(--blue-ink);color:var(--white);   /* 6.21:1 */
  /* 700, а не 800: Inter приходит из config.mts без веса 800, и просить его
     отдельным запросом ради одной цифры в кружке — плохая сделка. */
  font-size:13px;font-weight:700;
}
.ts-step-body{font-size:14px;line-height:1.45;color:var(--muted)}
.ts-step-body b{display:block;color:var(--white);font-weight:700;margin-bottom:2px}

@keyframes ts-rise{
  0%{opacity:0;transform:translateY(8px)}
  100%{opacity:1;transform:translateY(0)}
}

/* Тихий выход к форме. Намеренно неяркий: это аварийный путь, а не действие,
   к которому мы зовём. */
.ts-quiet{
  background:none;border:0;padding:0;cursor:pointer;
  color:var(--muted);font:inherit;font-size:13px;text-decoration:underline;
}

/* ── розыгрыш ── */
.ts-note{
  margin-top:18px;padding:16px 18px;border-radius:18px;
  border:1px solid rgba(255,61,104,.26);background:rgba(255,61,104,.07);
}
.ts-note-title{
  font-family:'Unbounded',sans-serif;font-size:15px;font-weight:700;
  margin:0 0 8px;color:var(--white);
}
.ts-note p{font-size:14px;line-height:1.5;color:var(--muted);margin:0 0 6px}
.ts-note p:last-child{margin-bottom:0}
.ts-note-dim{opacity:.8}
.ts-note b{color:var(--white)}
.ts-note-link{margin-top:10px}
.ts-rules-btn{
  background:none;border:0;padding:0;cursor:pointer;
  color:var(--link);font:inherit;font-size:14px;text-decoration:underline;
}

/* ── модалка с правилами ──
   position:fixed, а не absolute: подложка обязана накрыть весь экран, иначе
   на длинной странице сквозь неё виден и кликается контент под ней. */
.ts-modal{
  position:fixed;inset:0;z-index:60;
  display:flex;align-items:flex-end;justify-content:center;
  background:rgba(6,4,22,.72);
  padding:24px 12px calc(12px + env(safe-area-inset-bottom));
}
.ts-modal-box{
  width:100%;max-width:430px;max-height:82vh;
  display:flex;flex-direction:column;
  background:var(--tile);
  border:1px solid rgba(255,255,255,.12);
  border-radius:22px;padding:18px 16px 16px;
}
.ts-modal-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
.ts-modal-title{
  flex:1;margin:0;
  font-family:'Unbounded',sans-serif;font-size:16px;font-weight:700;
  line-height:1.3;color:var(--white);
}
/* 44×44 — тач-таргет по HIG. Крестик мельче выглядит аккуратнее и не
   нажимается, а это единственный видимый выход из модалки. */
.ts-modal-x{
  flex:0 0 auto;width:44px;height:44px;margin:-10px -8px 0 0;
  background:none;border:0;cursor:pointer;
  color:var(--muted);font-size:26px;line-height:1;
}
/* Единственное место со скроллом. Внутренняя прокрутка здесь оправдана:
   иначе правовой текст растянет страницу и уедет за пределы экрана. */
.ts-modal-body{overflow-y:auto;-webkit-overflow-scrolling:touch;padding-right:2px}
.ts-rblock{margin-bottom:14px}
.ts-rblock-title{
  margin:0 0 6px;font-size:14px;font-weight:700;color:var(--white);
}
.ts-rblock p{margin:0 0 6px;font-size:14px;line-height:1.5;color:var(--muted)}
.ts-modal-meta{
  margin:14px 0 0;padding-top:12px;
  border-top:1px solid rgba(255,255,255,.10);
  font-size:13px;line-height:1.45;color:var(--muted);
}
.ts-modal-close{
  margin-top:14px;min-height:52px;flex:0 0 auto;
  border:1px solid var(--line);border-radius:14px;
  background:var(--tile2);color:var(--white);
  font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;
}
.ts-mail{color:var(--white);white-space:nowrap}

/* Праздник не должен настигать того, кто просил его не устраивать.
   Системная настройка «уменьшить движение» гасит всю анимацию целиком —
   контент при этом остаётся на месте и видимым. */
@media (prefers-reduced-motion: reduce){
  .ts-mark,.ts-spark,.ts-step{animation:none}
  .ts-spark{display:none}
  .ts-step{opacity:1;transform:none}
  .ts-submit{transition:none}
}
</style>
