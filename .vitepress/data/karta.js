/**
 * Страницы «Твоя карта» — по одной на парк. Гость сканирует QR с ТВ-экрана
 * в парке (boom-cmd/media/loyalty/) и попадает сюда. Страница — продолжение
 * экрана: та же карта, те же слова, те же статусы.
 *
 * Устроено так же, как bonus500.js: это ЕДИНСТВЕННОЕ место с текстами и
 * адресами, страница karta/<парк>.md — три строки, вёрстка — KartaPage.vue.
 *
 * ⚠ ЦИФРЫ СТАТУСОВ (LEVELS ниже) — те же, что на ТВ-экране:
 *   boom-cmd/media/loyalty/loyalty.js, константа LEVELS. Владелец подтвердил
 *   их для экрана и разрешил вынести на сайт (01.10). Меняются на кассе —
 *   править ОБА файла в один день, иначе экран и телефон гостя разойдутся.
 *
 * ⚠ ПРОЧЕГО НЕ ОБЕЩАЕМ: ни сгорания или несгорания зарядов, ни розыгрышей.
 * *
 * ⚠ АДРЕС СТРАНИЦЫ ЗАШИТ В QR ТВ-ЭКРАНА (boom-cmd/media/loyalty/):
 *   https://b00m.fun/karta/<парк>?from=loyalty-tv
 *   Метка loyalty-tv должна быть в SOURCES (.vitepress/analytics/boom-stat.js),
 *   иначе источник молча станет пустым. Переименовать файл karta/<парк>.md —
 *   значит сломать QR на экране.
 */

/* Общие тексты — одинаковые для всех парков. */
export const KARTA_TEXT = {
  titleA: 'Есть карта?',
  titleB: 'Заряжено.',
  lead: 'Баланс, тикеты и статус — в телефоне. Не выкидывай карту — она всё помнит.',
  cta: 'Личный кабинет',
  note: 'вход по номеру телефона · откроется в новом окне',

  /* Вторая дорожка — для тех, у кого карты ещё нет (как плашка на экране) */
  bonusKicker: 'Нет карты? Бонус на старт',
  bonusT: 'Регайся и забирай',
  bonusUnit: 'зарядов',

  /* Статусы */
  lvlT: 'Игровой статус',
  lvlBadge: 'Всегда растёт на твоей карте',
  lvlNote: '* дополнительные игры при каждом пополнении на 1\u2009500\u00a0₽',

  /* Призотека */
  prizesT: 'Дроп призов',
  prizesD: 'Что можно забрать за тикеты — каталог парка.',

  turboT: 'Турбо-часы',
  turboD: 'Расписание на неделю — загляни, когда будешь планировать поход.'
}

/* Статусы — снизу вверх. Те же цифры, что на ТВ-экране (см. ⚠ выше).
   threshold — от какой суммы пополнений, ₽; plus — сколько игр сверху
   при каждом пополнении на 1 500 ₽ (сноска lvlNote). */
export const LEVELS = [
  { id: 'standard', name: 'Новая карта', discount: 0,  threshold: 0,     plus: 0,  color: '#9A9AB0', icon: 'bow' },
  { id: 'silver',   name: 'Серебро',     discount: 15, threshold: 5000,  plus: 4,  color: '#00D4FF', icon: 'swords' },
  { id: 'gold',     name: 'Золото',      discount: 30, threshold: 10500, plus: 9,  color: '#FFD60A', icon: 'medal' },
  { id: 'platinum', name: 'Платина',     discount: 50, threshold: 45000, plus: 21, color: '#FF0080', icon: 'crown' }
]

export const KARTA_PAGES = {
  /* ── Охта Молл ── */
  ohtamall: {
    park: 'ohta',                    // код парка — тот же, что в data/parks.js
    name: 'Охта Молл',
    accent: '#FF0080',               // цвет парка, тот же, что в bonus500.js
    lk: 'https://lk.b00m.fun',
    bonus: true,                     // дорожка «+500 на старт» → /bonus500/ohtamall
    prizes: true                     // ссылка в Призотеку → /prizes/ohtamall
  },

  /* ── Питерлэнд ──
     Бонус на старт выключен — так же, как на ТВ-экране (PARKS в
     boom-cmd/media/loyalty/loyalty.js, bonus:false). Включать — в обоих. */
  piterland: {
    park: 'piterland',
    name: 'Питерлэнд',
    accent: '#00FF88',
    lk: 'https://ptl.b00m.fun',
    bonus: false,
    prizes: true
  },

  /* ── Июнь ──
     Слуг june, а не iyun — как у bonus500/june.md: по коду june считает
     таблица. ТВ-страница знает этот парк как ?park=iyun и ведёт сюда.
     Призотеки у Июня пока нет — ссылки не будет. */
  june: {
    park: 'june',
    name: 'Июнь',
    accent: '#00D4FF',
    lk: 'https://jun.b00m.fun',
    bonus: true,
    prizes: false
  }
}

/** Данные страницы по её имени. Нет такого парка — пусто, страница скажет об этом. */
export function kartaPage (slug) {
  return KARTA_PAGES[slug] || null
}
