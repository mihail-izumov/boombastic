/**
 * БумБастик · СЧЁТЧИК — приём событий с сайта b00m.fun в Google-таблицу.
 *
 * Это код для Google Apps Script, а НЕ для сайта. Файл лежит в репозитории
 * только чтобы не потеряться: он ничего не делает, пока владелец не вставит
 * его в Apps Script своей таблицы (инструкция — в СЧЁТЧИК.md в корне проекта).
 *
 * Что делает:
 *   doPost — принимает событие от сайта и дописывает строку в лист `hits`.
 *   doGet  — отдаёт свод по дням в CSV (для выгрузки в boom-cmd-data).
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

var HITS_SHEET  = 'hits';   // сырые события, одна строка = одно событие
var DAILY_SHEET = 'daily';  // свод по дням, пересобирается функцией ниже

var HITS_HEADER = [
  'ts',        // когда пришло (время таблицы)
  'date',      // дата, по ней строится свод
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

/* ── Свод по дням ─────────────────────────────────────────────────────── */

/**
 * Пересобирает лист `daily` из `hits`. Запускается из меню «БумБастик»
 * и раз в сутки по расписанию (триггер настраивается один раз).
 *
 * Одна строка = один день + одна страница + одно событие. В таком виде
 * из свода одинаково легко собрать и воронку, и график посещаемости.
 */
function rebuildDaily() {
  var ss = ss_();
  var hits = hitsSheet_().getDataRange().getValues();
  if (hits.length < 2) return;

  var iDate    = HITS_HEADER.indexOf('date');
  var iEvent   = HITS_HEADER.indexOf('event');
  var iPage    = HITS_HEADER.indexOf('page');
  var iPark    = HITS_HEADER.indexOf('park');
  var iSource  = HITS_HEADER.indexOf('source');
  var iVisitor = HITS_HEADER.indexOf('visitor');

  var SEP = String.fromCharCode(1);   // разделитель ключа: в данных такого символа не бывает
  var agg = {};   // ключ → { hits: n, visitors: {} }
  for (var r = 1; r < hits.length; r++) {
    var row = hits[r];
    var d = row[iDate];
    if (d instanceof Date) {
      d = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    var key = [d, row[iPage], row[iPark], row[iSource], row[iEvent]].join(SEP);
    if (!agg[key]) agg[key] = { n: 0, v: {} };
    agg[key].n++;
    if (row[iVisitor]) agg[key].v[row[iVisitor]] = 1;
  }

  var out = [['date', 'page', 'park', 'source', 'event', 'hits', 'visitors']];
  Object.keys(agg).sort().forEach(function (key) {
    var parts = key.split(SEP);
    out.push(parts.concat([agg[key].n, Object.keys(agg[key].v).length]));
  });

  var sh = ss.getSheetByName(DAILY_SHEET) || ss.insertSheet(DAILY_SHEET);
  sh.clear();
  sh.getRange(1, 1, out.length, out[0].length).setValues(out);
  sh.setFrozenRows(1);
}

/* ── Выгрузка ─────────────────────────────────────────────────────────── */

/**
 * Открыть адрес веб-приложения в браузере — скачается CSV со сводом.
 * Кладётся в ~/work-2026/boombastic/boom-cmd-data.
 *
 *   ...?csv=daily            — свод по дням (по умолчанию)
 *   ...?csv=hits             — сырые события
 *   ...?csv=daily&from=2026-08-01&to=2026-08-31  — за период
 */
function doGet(e) {
  var q = (e && e.parameter) || {};
  var which = q.csv === 'hits' ? HITS_SHEET : DAILY_SHEET;

  if (which === DAILY_SHEET) rebuildDaily();

  var sh = ss_().getSheetByName(which);
  if (!sh) return ContentService.createTextOutput('нет данных');

  var values = sh.getDataRange().getValues();
  var from = q.from || '';
  var to   = q.to   || '';

  var lines = values.filter(function (row, i) {
    if (i === 0) return true;                     // заголовок всегда
    if (!from && !to) return true;
    var d = row[0];
    if (d instanceof Date) {
      d = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    d = String(d).slice(0, 10);
    if (from && d < from) return false;
    if (to   && d > to)   return false;
    return true;
  }).map(function (row) {
    return row.map(function (cell) {
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
    .downloadAsFile('boom-stat-' + which + '.csv');
}

/* ── Меню в таблице ───────────────────────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('БумБастик')
    .addItem('Пересобрать свод по дням', 'rebuildDaily')
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
