/**
 * БумБастик · СЧЁТЧИК — приём событий с сайта b00m.fun в Google-таблицу.
 *
 * Это код для Google Apps Script, а НЕ для сайта. Файл лежит в репозитории
 * только чтобы не потеряться: он ничего не делает, пока владелец не вставит
 * его в Apps Script своей таблицы (инструкция — в СЧЁТЧИК.md в корне проекта).
 *
 * Что делает:
 *   doPost — принимает событие от сайта и дописывает строку в лист `hits`.
 *   doGet  — отдаёт `hits` в CSV (для выгрузки в boom-cmd-data).
 *
 * Лист один. Свод по дням тут когда-то собирался автоматически во второй
 * лист `daily`, но 24.08 его убрали (решение владельца): всё считается из
 * `hits` сводными таблицами, а лист, в который никто не заглядывает, только
 * плодит вопросы «какая из двух цифр правильная».
 *
 * Чего НЕ делает: не хранит имена, почты и телефоны. В таблицу попадает
 * только случайный номер посетителя (visitor), который живёт в его браузере,
 * и никак не связан с человеком. Это заменa Plausible, а не CRM.
 *
 * ⚠ Адрес веб-приложения публичный — иначе браузер гостя не сможет в него
 *   писать. Спрятать его нельзя: любой скрипт на сайте виден в исходниках.
 *   Поэтому здесь нет ни одного секрета, а событие проверяется по «белому
 *   списку» EVENTS: чужой мусор в таблицу не попадёт.
 */

/* ── Настройки ────────────────────────────────────────────────────────── */

var HITS_SHEET = 'hits';   // единственный лист: одна строка = одно событие

var HITS_HEADER = [
  'ts',        // когда пришло, строкой по московскому времени
  'date',      // та же дата отдельно — по ней удобно группировать
  'event',     // что произошло: 'pageview', 'Войти', 'Войти — парк', ...
  'page',      // адрес страницы без домена: /bonus500/ohtamall
  'park',      // код парка: ohta / piterland / june / mari / '' если не про парк
  'source',    // откуда пришёл: sticker-ohta, qr, vk, '' если прямой заход
  'ref',       // сайт-источник, если гость пришёл по ссылке
  'visitor',   // случайный номер браузера — считать людей, а не клики
  'session',   // случайный номер визита — считать визиты
  'first',     // 1, если этот браузер у нас впервые
  'device'     // mobile / desktop
];

/* Белый список событий. Всё, чего здесь нет, отбрасывается.
   Добавляешь новую кнопку на сайте — добавь её событие сюда, иначе
   счётчик молча его проигнорирует. */
var EVENTS = [
  'pageview',          // открытие любой страницы
  'Бонус — открыл',    // открыл страницу бонуса (дубль pageview, для воронки)
  'Бонус — забрать',   // нажал главную кнопку на странице бонуса
  'Войти',             // открыл модалку «Войти»
  'Войти — парк',      // выбрал парк в модалке = ушёл в личный кабинет
  'Зарядить карту',
  'Игровой статус',
  'Призотека',
  'Призотека — парк'
];

/* ── Приём событий ────────────────────────────────────────────────────── */

function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents);

    // Событий может прийти сразу пачка — браузер копит их, если гость
    // быстро кликает. Приводим к массиву, чтобы код был один.
    var list = Array.isArray(p) ? p : [p];
    if (list.length > 20) list = list.slice(0, 20);

    var rows = [];
    for (var i = 0; i < list.length; i++) {
      var row = buildRow_(list[i]);
      if (row) rows.push(row);
    }
    if (rows.length) {
      var sh = hitsSheet_();
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, HITS_HEADER.length)
        .setValues(rows);
    }
    return json_({ ok: true, saved: rows.length });
  } catch (err) {
    // Гостю ошибка не важна — он её всё равно не увидит. Главное не упасть.
    return json_({ ok: false });
  }
}

function buildRow_(p) {
  var event = String(p.event || '').slice(0, 60);
  if (EVENTS.indexOf(event) === -1) return null;   // чужое событие — мимо

  var now = new Date();
  var tz  = Session.getScriptTimeZone();

  /* ⚠ ВРЕМЯ ПИШЕМ СТРОКОЙ, А НЕ ОБЪЕКТОМ ДАТЫ. Часовых поясов в Google
     ДВА и они не связаны: у скрипта (Настройки проекта) и у таблицы
     (Файл → Настройки). Объект даты — это момент времени, и таблица
     показывает его по СВОЕМУ поясу. 24.08 из-за этого событие 13:23 по
     Москве отображалось как 02:23: у таблицы после импорта стоял GMT-08:00.
     Готовая строка так не съезжает — что записали, то и видно. */
  return [
    Utilities.formatDate(now, tz, 'yyyy-MM-dd HH:mm:ss'),
    Utilities.formatDate(now, tz, 'yyyy-MM-dd'),
    event,
    clean_(p.page, 120),
    clean_(p.park, 30),
    clean_(p.source, 40),
    clean_(p.ref, 120),
    clean_(p.visitor, 24),
    clean_(p.session, 24),
    p.first ? 1 : 0,
    p.device === 'mobile' ? 'mobile' : 'desktop'
  ];
}

function clean_(v, max) {
  if (v == null) return '';
  return String(v).replace(/[\r\n\t]/g, ' ').slice(0, max);
}

/**
 * Таблица, с которой работаем.
 *
 * ⚠ ПОЧЕМУ НЕ ПРОСТО getActiveSpreadsheet(). Он возвращает таблицу только
 *   если проект скрипта создан ИЗ НЕЁ (Расширения → Apps Script). Если
 *   завести скрипт отдельно, на script.google.com, он вернёт null, и всё
 *   упадёт с «Cannot read properties of null» — понять по этой строке, что
 *   именно не так, невозможно. Ровно на этом застряли 24.08.
 *
 *   Поэтому: сначала пробуем свою таблицу, потом — ту, чей ID лежит в
 *   свойствах скрипта (SHEET_ID), а если нет ни того ни другого — говорим
 *   человеческим языком, что делать.
 *
 *   ID держим в свойствах, а не в коде: репозиторий публичный.
 */
function ss_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;

  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);

  throw new Error(
    'Скрипт не привязан к таблице. Либо создайте его заново из самой ' +
    'таблицы (Расширения → Apps Script), либо в «Настройки проекта» → ' +
    '«Свойства скрипта» добавьте SHEET_ID — это набор символов из адреса ' +
    'таблицы между /d/ и /edit.'
  );
}

function hitsSheet_() {
  var ss = ss_();
  var sh = ss.getSheetByName(HITS_SHEET);
  if (!sh) {
    sh = ss.insertSheet(HITS_SHEET);
    sh.appendRow(HITS_HEADER);
    sh.setFrozenRows(1);
  }
  return sh;
}

/* ── Выгрузка ─────────────────────────────────────────────────────────── */

/**
 * Открыть адрес веб-приложения в браузере — скачается CSV со всеми событиями.
 * Кладётся в ~/work-2026/boombastic/boom-cmd-data.
 *
 *   ...exec                                  — всё, что накопилось
 *   ...exec?from=2026-08-01&to=2026-08-31     — только за период
 *
 * Свода по дням здесь нет намеренно: считаем сводными таблицами прямо
 * по этим строкам, чтобы цифра была одна и её нельзя было пересобрать
 * «не так».
 */
function doGet(e) {
  var q = (e && e.parameter) || {};

  var sh = ss_().getSheetByName(HITS_SHEET);
  if (!sh) return ContentService.createTextOutput('нет данных');

  var values = sh.getDataRange().getValues();
  var iDate = HITS_HEADER.indexOf('date');
  var from = q.from || '';
  var to   = q.to   || '';

  var lines = values.filter(function (row, i) {
    if (i === 0) return true;                     // заголовок всегда
    if (!from && !to) return true;
    var d = row[iDate];
    if (d instanceof Date) {
      d = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    d = String(d).slice(0, 10);
    if (from && d < from) return false;
    if (to   && d > to)   return false;
    return true;
  }).map(function (row) {
    return row.map(function (cell) {
      /* Старые строки, записанные до 24.08, лежат объектами даты — приводим
         их к тому же виду, что и новые, иначе в CSV поедет разный формат. */
      if (cell instanceof Date) {
        return Utilities.formatDate(cell, Session.getScriptTimeZone(),
          'yyyy-MM-dd HH:mm:ss');
      }
      var s = String(cell);
      return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',');
  });

  return ContentService
    .createTextOutput('﻿' + lines.join('\n'))   // BOM — чтобы Excel не ломал кириллицу
    .setMimeType(ContentService.MimeType.CSV)
    .downloadAsFile('boom-stat.csv');
}

/* ── Меню в таблице ───────────────────────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('БумБастик')
    .addItem('Проверить приём событий', 'testHit')
    .addToUi();
}

/**
 * Пишет одну тестовую строку — проверить, что всё настроено.
 *
 * ⚠ БЕЗ ВСПЛЫВАЮЩИХ ОКОН. Раньше здесь был SpreadsheetApp.getUi().alert() —
 *   он работает из меню таблицы, но падает при запуске из редактора скрипта
 *   («Cannot call SpreadsheetApp.getUi() from this context»), а именно так
 *   эту функцию и запускают первый раз, чтобы выдать Google разрешения.
 *   Результат теперь пишется в журнал выполнения — он виден в обоих случаях.
 */
function testHit() {
  var res = doPost({ postData: { contents: JSON.stringify({
    event: 'pageview', page: '/тест', park: 'ohta', source: 'тест',
    visitor: 'test-visitor', session: 'test-session', first: 1, device: 'mobile'
  }) } });

  Logger.log('Ответ скрипта: ' + res.getContent());
  Logger.log('Строк в листе hits: ' + hitsSheet_().getLastRow());
  Logger.log('Готово. Открой лист «hits» — там должна быть строка «/тест».');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
