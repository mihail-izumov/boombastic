<template>
  <div class="terms-doc">

    <div class="doc-header">
      <h2 class="doc-title">Политика конфиденциальности</h2>
      <p class="doc-meta">Редакция от 05 февраля 2026 г.</p>
    </div>

    <div class="tldr-block">
      <h3 class="tldr-heading">Главное за 10 секунд</h3>
      <div class="tldr-grid">
        <div class="tldr-item" v-for="item in tldr" :key="item.title">
          <span class="tldr-icon" :style="{ maskImage: item.mask, WebkitMaskImage: item.mask }"></span>
          <div>
            <div class="tldr-item-title">{{ item.title }}</div>
            <div class="tldr-item-text">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="details-heading">Детали Политики</h3>

    <div class="sections">
      <div v-for="(section, i) in sections" :key="i" class="section" :class="{ open: openIndex === i }">
        <button class="section-toggle" @click="toggle(i)">
          <span class="section-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="section-title">{{ section.title }}</span>
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="section-body" v-show="openIndex === i">
          <div class="section-content" v-html="section.html"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)
const toggle = (i) => { openIndex.value = openIndex.value === i ? null : i }

const ic = (paths) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const tldr = [
  { title: 'Берём только нужное',  text: 'Телефон, email, история карты — только для работы парка',      mask: ic(`<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`) },
  { title: 'Не продаём данные',    text: 'Передаём только платёжной системе ЮKassa',                      mask: ic(`<path d="m2 2 20 20"/><path d="M8.35 2.69A10 10 0 0 1 21.3 15.65"/><path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/>`) },
  { title: 'Удалим по запросу',    text: 'Пиши на spb@bumbastiki.ru — прекратим за 30 дней',             mask: ic(`<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`) },
  { title: 'Рассылка отключаема', text: 'Откажись в любой момент — письмом или лично',                   mask: ic(`<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="m9.5 17 5-5"/><path d="m9.5 12 5 5"/>`) },
  { title: 'Данные защищены',      text: 'SSL, ограниченный доступ, защищённые серверы',                  mask: ic(`<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M6.376 18.91a6 6 0 0 1 11.249.003"/><circle cx="12" cy="11" r="4"/>`) },
]

const sections = [
  { title: 'Общие положения', html: `<p>Политика устанавливает порядок обработки персональных данных посетителей b00m.fun и парков «Бумбастик».</p><p><b>Операторы:</b></p><ul><li>ИП Завернин Эдуард Игоревич (ИНН 290217217403) — Охта Молл;</li><li>ИП Завернин Лев Эдуардович (ИНН 290218807250) — Питерлэнд.</li></ul>` },
  { title: 'Какие данные обрабатываются', html: `<p><b>При регистрации:</b> ФИО, номер телефона, email, дата рождения.</p><p><b>При использовании карты:</b> номер, баланс, история транзакций.</p><p><b>Технические данные:</b> IP-адрес, cookies, информация о браузере (Яндекс.Метрика).</p>` },
  { title: 'Для чего используются данные', html: `<ul><li>Регистрация и авторизация в Личном кабинете.</li><li>Управление картой и обработка платежей через ЮKassa.</li><li>Уведомления об изменениях в работе парков.</li><li>Рекламные рассылки — только с отдельного согласия.</li><li>Улучшение сайта, ответы на обращения, исполнение требований закона.</li></ul>` },
  { title: 'Правовые основания обработки', html: `<ul><li>Федеральный закон № 152-ФЗ «О персональных данных»;</li><li>согласие субъекта (ст. 9 ФЗ-152);</li><li>необходимость исполнения договора (оферты);</li><li>законные интересы Оператора.</li></ul>` },
  { title: 'Способы и сроки обработки', html: `<p>Автоматически (серверы, базы данных) и вручную в случаях, предусмотренных законом.</p><p><b>Сроки хранения:</b></p><ul><li>Данные Личного кабинета — до удаления аккаунта или отзыва согласия;</li><li>Данные транзакций — 5 лет (налоговое законодательство);</li><li>Технические логи — 1 год.</li></ul>` },
  { title: 'Передача данных третьим лицам', html: `<ul><li><b>ЮKassa</b> — для обработки онлайн-платежей;</li><li><b>Яндекс.Метрика</b> — обезличенные данные о посещаемости;</li><li><b>Хостинг-провайдеры</b> — для хранения данных;</li><li><b>Государственные органы</b> — только по требованию закона.</li></ul><p>Продажа персональных данных третьим лицам не осуществляется.</p>` },
  { title: 'Трансграничная передача', html: `<p>Передача данных за пределы РФ не осуществляется. Все данные хранятся на серверах на территории России.</p>` },
  { title: 'Защита данных', html: `<ul><li>Шифрование (SSL/TLS);</li><li>ограниченный доступ сотрудников;</li><li>регулярная проверка систем безопасности;</li><li>резервное копирование.</li></ul>` },
  { title: 'Права субъектов данных', html: `<ul><li>Запросить, какие данные обрабатываются;</li><li>потребовать исправления или удаления;</li><li>отозвать согласие — прекратим обработку за 30 дней;</li><li>пожаловаться в Роскомнадзор или суд.</li></ul><p><b>Контакт:</b> spb@bumbastiki.ru — ответим за 10 рабочих дней.</p>` },
  { title: 'Cookies', html: `<p>Используются для авторизации, запоминания настроек и аналитики (Яндекс.Метрика). Отключаются в настройках браузера.</p>` },
  { title: 'Данные несовершеннолетних', html: `<p>Сайт не предназначен для лиц моложе 18 лет. Регистрацию и платежи должен совершать родитель или законный представитель.</p>` },
  { title: 'Изменения политики', html: `<p>Актуальная версия всегда доступна по адресу: <b>b00m.fun/terms/policy</b>. При существенных изменениях уведомим по email.</p>` },
  { title: 'Контактная информация', html: `<div class="requisites"><p>Email: spb@bumbastiki.ru</p><p>Телефон: +7 (964) 321-11-00 (Охта Молл)</p><p>Телефон: +7 (965) 045-75-55 (Питерлэнд)</p><br><p>Братиславская дорога, д. 3, ТРК «Охта Молл», этаж 3, оф. 3.15</p><p>Приморский проспект, д. 72, ТРК «Питерлэнд»</p></div>` },
]
</script>

<style scoped>
.terms-doc { font-family: 'Inter', sans-serif; color: #F0F4FF; }

.doc-header { margin-bottom: 20px; }
.doc-title { font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: #F0F4FF; margin: 0 0 6px; }
.doc-meta { font-size: 12px; color: #7A8BA8; margin: 0; }

.tldr-block {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; padding: 22px 24px; margin-bottom: 0;
}
.tldr-heading { font-size: 15px; font-weight: 700; color: #F0F4FF; margin: 0 0 14px; }
.tldr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.tldr-item {
  display: flex; align-items: flex-start; gap: 11px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px; padding: 11px 13px;
}
.tldr-icon {
  display: block; width: 18px; height: 18px; min-width: 18px;
  background-color: #FF0080;
  mask-repeat: no-repeat; mask-size: contain; mask-position: center;
  -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain; -webkit-mask-position: center;
  margin-top: 1px;
}
.tldr-item-title { font-size: 12px; font-weight: 700; color: #FF0080; margin-bottom: 2px; }
.tldr-item-text  { font-size: 12px; color: #9aaabb; line-height: 1.5; }

.details-heading {
  font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; color: #7A8BA8; margin: 28px 0 10px;
}

.sections { display: flex; flex-direction: column; gap: 4px; }
.section { border: 1px solid rgba(74,90,173,0.2); border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
.section.open { border-color: rgba(255,0,128,0.25); }

.section-toggle {
  width: 100%; display: flex; align-items: center; gap: 14px;
  padding: 13px 16px; background: rgba(28,26,62,0.5);
  border: none; cursor: pointer; text-align: left; transition: background 0.2s;
}
.section-toggle:hover { background: rgba(255,0,128,0.05); }
.section-num { font-size: 11px; font-weight: 700; color: #FF0080; min-width: 22px; flex-shrink: 0; }
.section-title { flex: 1; font-size: 14px; font-weight: 600; color: #F0F4FF; }
.chevron { color: #7A8BA8; flex-shrink: 0; transition: transform 0.25s; }
.section.open .chevron { transform: rotate(180deg); }

.section-body { border-top: 1px solid rgba(74,90,173,0.15); }
.section-content { padding: 16px 20px; font-size: 14px; line-height: 1.75; color: #b0bcd4; }
.section-content :deep(p)  { margin: 0 0 10px; }
.section-content :deep(ul) { padding-left: 20px; margin: 8px 0 12px; }
.section-content :deep(li) { margin-bottom: 5px; }
.section-content :deep(b)  { color: #F0F4FF; font-weight: 600; }
.section-content :deep(.requisites) { font-size: 13px; line-height: 2; color: #9aaabb; }

@media (max-width: 600px) {
  .tldr-grid { grid-template-columns: 1fr; }
  .tldr-block { padding: 16px; }
  .section-content { padding: 14px 16px; }
}
</style>
