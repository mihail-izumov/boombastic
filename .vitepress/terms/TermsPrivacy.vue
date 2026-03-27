<template>
  <div class="terms-doc">

    <div class="doc-header">
      <h2 class="doc-title">Согласие на обработку персональных данных</h2>
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

    <h3 class="details-heading">Детали Согласия</h3>

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
  { title: 'Зачем нужно согласие',     text: 'Для регистрации в кабинете, пополнения карты и работы парка',  mask: ic(`<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/><path d="M12 17v-6"/>`) },
  { title: 'Кому передаём',             text: 'Только ЮKassa для онлайн-платежей. Больше никому',               mask: ic(`<path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/>`) },
  { title: 'Отзыв в любой момент',     text: 'Email на spb@bumbastiki.ru или лично — прекратим за 30 дней',   mask: ic(`<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>`) },
  { title: 'Нажал кнопку — согласился', text: 'Регистрация или оплата означают принятие условий',               mask: ic(`<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>`) },
]

const sections = [
  { title: 'Кто даёт согласие и кому', html: `<p>Регистрируясь или оплачивая услуги, ты даёшь согласие следующим Операторам:</p><ul><li><b>ИП Завернин Эдуард Игоревич</b> (ИНН 290217217403) — парк Охта Молл;</li><li><b>ИП Завернин Лев Эдуардович</b> (ИНН 290218807250) — парк Питерлэнд.</li></ul>` },
  { title: 'Какие данные обрабатываются', html: `<ul><li>Фамилия, имя, отчество;</li><li>номер мобильного телефона;</li><li>адрес электронной почты;</li><li>дата рождения;</li><li>номер и баланс Игровой карты;</li><li>история транзакций;</li><li>IP-адрес, cookies, информация о браузере.</li></ul>` },
  { title: 'Для чего используются данные', html: `<ul><li>Регистрация и авторизация в Личном кабинете;</li><li>исполнение договора публичной оферты;</li><li>обработка платежей через ЮKassa;</li><li>уведомления об изменениях в работе парков;</li><li>рекламные рассылки — только при отдельном согласии;</li><li>ответы на обращения, исполнение требований закона.</li></ul>` },
  { title: 'Способы обработки', html: `<p>Сбор, запись, систематизация, хранение, уточнение, извлечение, использование, передача (согласно п. 5), блокирование, удаление. Обработка ведётся автоматически и вручную в случаях, предусмотренных законом.</p>` },
  { title: 'Кому передаются данные', html: `<ul><li><b>ЮKassa</b> — для онлайн-платежей;</li><li><b>Яндекс.Метрика</b> — обезличенные данные о посещаемости;</li><li><b>Хостинг-провайдеры</b> — для работы сайта;</li><li><b>Государственные органы</b> — только по требованию закона.</li></ul><p>Продажа персональных данных не осуществляется.</p>` },
  { title: 'Срок действия согласия', html: `<p>Согласие действует с момента предоставления до отзыва или достижения целей обработки. Сроки хранения — в Политике: b00m.fun/terms/policy</p>` },
  { title: 'Как отозвать согласие', html: `<ul><li>по email: spb@bumbastiki.ru;</li><li>лично в любом из парков с документом.</li></ul><p>Обработку прекратим в течение 30 дней. Данные транзакций могут храниться 5 лет согласно налоговому законодательству.</p>` },
  { title: 'Права пользователя', html: `<ul><li>Получать информацию об обработке данных;</li><li>требовать исправления, блокирования или удаления;</li><li>отозвать согласие в любой момент;</li><li>обжаловать в Роскомнадзор или суд.</li></ul><p>Полный перечень — в Политике: <b>b00m.fun/terms/policy</b></p>` },
  { title: 'Заключительные положения', html: `<p>Регистрируясь или оплачивая услуги, ты подтверждаешь, что:</p><ul><li>ознакомлен с Согласием и Политикой конфиденциальности;</li><li>действуешь добровольно и в своём интересе;</li><li>достиг 18 лет, либо действуешь с согласия законного представителя.</li></ul>` },
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
  background-color: #00FF88;
  mask-repeat: no-repeat; mask-size: contain; mask-position: center;
  -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain; -webkit-mask-position: center;
  margin-top: 1px;
}
.tldr-item-title { font-size: 12px; font-weight: 700; color: #00FF88; margin-bottom: 2px; }
.tldr-item-text  { font-size: 12px; color: #9aaabb; line-height: 1.5; }

.details-heading {
  font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; color: #7A8BA8; margin: 28px 0 10px;
}

.sections { display: flex; flex-direction: column; gap: 4px; }
.section { border: 1px solid rgba(74,90,173,0.2); border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
.section.open { border-color: rgba(0,255,136,0.25); }

.section-toggle {
  width: 100%; display: flex; align-items: center; gap: 14px;
  padding: 13px 16px; background: rgba(28,26,62,0.5);
  border: none; cursor: pointer; text-align: left; transition: background 0.2s;
}
.section-toggle:hover { background: rgba(0,255,136,0.05); }
.section-num { font-size: 11px; font-weight: 700; color: #00FF88; min-width: 22px; flex-shrink: 0; }
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
