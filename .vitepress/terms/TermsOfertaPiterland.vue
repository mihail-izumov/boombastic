<template>
  <div class="terms-doc">

    <div class="doc-header">
      <h2 class="doc-title">Договор публичной оферты</h2>
      <p class="doc-meta">Редакция от 05 февраля 2026 г. · ИП Завернин Лев Эдуардович · Питерлэнд</p>
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
      <a class="tldr-anchor" href="#oferta-piterland-full">Читать полностью
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </a>
    </div>

    <div class="sections" id="oferta-piterland-full">
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
  {
    title: 'Вход свободный',
    text: 'Платишь только за карту и её пополнение',
    mask: ic(`<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>`)
  },
  {
    title: 'Тикеты не сгорают',
    text: 'Баланс карты сохраняется между визитами',
    mask: ic(`<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>`)
  },
  {
    title: 'Возврат есть',
    text: 'В течение 3 дней — заявление на кассе или по email',
    mask: ic(`<path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/><path d="m16 19 3 3 3-3"/><path d="M18 12h.01"/><path d="M19 16v6"/><path d="M6 12h.01"/><circle cx="12" cy="12" r="2"/>`)
  },
  {
    title: 'Дети до 14',
    text: 'Только со взрослым от 18 лет. Взрослый отвечает за ребёнка',
    mask: ic(`<path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M15 12h.01"/><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/><path d="M9 12h.01"/>`)
  },
  {
    title: 'Проблема с автоматом',
    text: 'Скажи на кассе или звони +7 (965) 045-75-55',
    mask: ic(`<path d="M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317"/><path d="M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773"/><path d="M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643"/><path d="m2 2 20 20"/>`)
  },
]

const sections = [
  {
    title: 'Термины и определения',
    html: `
      <p><b>Исполнитель</b> — ИП Завернин Лев Эдуардович (ИНН 290218807250, ОГРНИП 325290000025349).</p>
      <p><b>Заказчик (Посетитель)</b> — любой человек, пользующийся услугами парка.</p>
      <p><b>Парк</b> — «Бумбастик» в ТРК «Питерлэнд», г. Санкт-Петербург, Приморский проспект, д. 72.</p>
      <p><b>Игровая карта</b> — пластиковая карта с чипом, носитель кредитов для запуска автоматов.</p>
      <p><b>Игровые единицы (кредиты)</b> — условные единицы в рублях, списываемые за каждую игру.</p>
      <p><b>Личный кабинет</b> — lk.b00m.fun: управление картой, история операций, пополнение онлайн.</p>
      <p><b>Акцепт оферты</b> — согласие с условиями договора путём любого действия из п. 2.3.</p>
    `
  },
  {
    title: 'Предмет договора и акцепт',
    html: `
      <p>Исполнитель предоставляет доступ к игровому оборудованию, Заказчик оплачивает услуги.</p>
      <p><b>Договор считается заключённым</b> при любом из действий:</p>
      <ul>
        <li>оплата или пополнение карты онлайн или на кассе;</li>
        <li>регистрация в Личном кабинете;</li>
        <li>фактическое использование автомата.</li>
      </ul>
      <p>Принимая оферту, Заказчик подтверждает, что ознакомлен с условиями и Политикой конфиденциальности (b00m.fun/terms/policy).</p>
    `
  },
  {
    title: 'Правила посещения парка',
    html: `
      <p><b>Режим работы:</b> актуальное расписание — на сайте и в парке.</p>
      <p><b>Дети до 14 лет</b> допускаются только со взрослым от 18 лет. Взрослый несёт полную ответственность.</p>
      <p><b>Вход в парк бесплатный.</b> Оплачивается только карта и кредиты на ней.</p>
      <br>
      <p><b>На территории парка запрещено:</b></p>
      <ul>
        <li>приходить в состоянии алкогольного или наркотического опьянения;</li>
        <li>курить, в том числе вейпы и электронные сигареты;</li>
        <li>приносить и употреблять еду и напитки (детское питание — исключение);</li>
        <li>ударять, раскачивать или вскрывать автоматы;</li>
        <li>мешать другим посетителям, проявлять агрессию.</li>
      </ul>
      <p>Сотрудники вправе попросить покинуть парк нарушителей без возврата средств.</p>
    `
  },
  {
    title: 'Карты, тарифы и оплата',
    html: `
      <p><b>Получение карты:</b> на кассе парка или онлайн в Личном кабинете.</p>
      <p><b>Пополнение:</b> на кассе, через терминал самообслуживания или онлайн.</p>
      <p><b>Бонусы:</b> при пополнении от 3 000 ₽ — бонусные кредиты согласно действующей акции.</p>
      <p><b>Тарифы</b> на каждый автомат указаны на нём самом. Стоимость игры списывается в момент запуска.</p>
      <p><b>Неиспользованные кредиты не сгорают</b> — баланс сохраняется.</p>
      <p>Приём платежей осуществляется через ЮKassa (ООО «НКО ЮМани»).</p>
    `
  },
  {
    title: 'Возврат денежных средств',
    html: `
      <p><b>Срок подачи заявки:</b> не позднее 3 рабочих дней с момента оплаты.</p>
      <p><b>Как подать заявку:</b></p>
      <ul>
        <li>лично на кассе с документом, удостоверяющим личность;</li>
        <li>по email: spb@bumbastiki.ru с указанием ФИО, номера карты и суммы.</li>
      </ul>
      <p><b>Срок возврата:</b> 10 рабочих дней с момента получения заявки.</p>
      <p>Частично использованные кредиты — возврат пропорционально остатку. Бонусные кредиты возврату не подлежат.</p>
    `
  },
  {
    title: 'Права и обязанности сторон',
    html: `
      <p><b>Исполнитель обязуется:</b></p>
      <ul>
        <li>обеспечить доступ к исправному оборудованию в часы работы;</li>
        <li>отображать корректный баланс карты и историю операций;</li>
        <li>не передавать персональные данные третьим лицам без согласия (кроме платёжной системы);</li>
        <li>рассматривать претензии в течение 10 рабочих дней.</li>
      </ul>
      <p><b>Заказчик обязуется:</b></p>
      <ul>
        <li>соблюдать правила посещения и использования оборудования;</li>
        <li>предоставлять достоверные данные при регистрации.</li>
      </ul>
    `
  },
  {
    title: 'Персональные данные',
    html: `
      <p>Заказчик даёт согласие на обработку персональных данных согласно ФЗ № 152-ФЗ «О персональных данных».</p>
      <p>Полный порядок — в Политике конфиденциальности: <b>b00m.fun/terms/policy</b></p>
      <p>Данные передаются только платёжной системе ЮKassa для проведения оплаты.</p>
    `
  },
  {
    title: 'Ответственность и разрешение споров',
    html: `
      <p>Исполнитель не несёт ответственности за форс-мажор: отключение электричества, интернета, действия третьих лиц.</p>
      <p><b>Претензионный порядок обязателен.</b> Срок ответа — 10 рабочих дней.</p>
      <p>При невозможности договориться — спор передаётся в суд по месту нахождения Исполнителя или по выбору Заказчика.</p>
    `
  },
  {
    title: 'Срок действия и изменения',
    html: `
      <p>Договор действует с момента публикации на сайте бессрочно.</p>
      <p>Исполнитель вправе изменять условия в одностороннем порядке. Изменения вступают в силу с момента публикации.</p>
      <p>Продолжение использования услуг после изменения условий означает согласие с новой редакцией.</p>
    `
  },
  {
    title: 'Реквизиты исполнителя',
    html: `
      <div class="requisites">
        <p><b>ИП Завернин Лев Эдуардович</b></p>
        <p>ОГРНИП: 325290000025349 · ИНН: 290218807250</p>
        <p>г. Санкт-Петербург, Приморский проспект, д. 72, лит. А</p>
        <br>
        <p>ТРК «Питерлэнд», Приморский проспект, д. 72</p>
        <p>Телефон: +7 (965) 045-75-55</p>
        <p>Email: spb@bumbastiki.ru</p>
        <p>Сайт: b00m.fun</p>
      </div>
    `
  },
]
</script>

<style scoped>
.terms-doc { font-family: 'Inter', sans-serif; color: #F0F4FF; }

.doc-header { margin-bottom: 24px; }
.doc-title { font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: #F0F4FF; margin: 0 0 6px; }
.doc-meta { font-size: 12px; color: #7A8BA8; margin: 0; }

.tldr-block {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 24px 28px 20px;
  margin-bottom: 28px;
}
.tldr-heading { font-size: 16px; font-weight: 700; color: #F0F4FF; margin: 0 0 16px; }
.tldr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; margin-bottom: 18px; }

.tldr-item {
  display: flex; align-items: flex-start; gap: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px; padding: 12px 14px;
}

.tldr-icon {
  display: block; width: 20px; height: 20px; min-width: 20px;
  background-color: #00D4FF;
  mask-repeat: no-repeat; mask-size: contain; mask-position: center;
  -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain; -webkit-mask-position: center;
  margin-top: 1px;
}

.tldr-item-title { font-size: 13px; font-weight: 700; color: #00D4FF; margin-bottom: 3px; }
.tldr-item-text  { font-size: 12px; color: #9aaabb; line-height: 1.5; }

.tldr-anchor {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 13px; font-weight: 600; color: #7A8BA8;
  text-decoration: none; transition: color 0.2s;
}
.tldr-anchor:hover { color: #F0F4FF; }

.sections { display: flex; flex-direction: column; gap: 4px; }
.section { border: 1px solid rgba(74,90,173,0.2); border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
.section.open { border-color: rgba(0,212,255,0.25); }

.section-toggle {
  width: 100%; display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; background: rgba(28,26,62,0.5);
  border: none; cursor: pointer; text-align: left; transition: background 0.2s;
}
.section-toggle:hover { background: rgba(0,212,255,0.05); }

.section-num { font-size: 11px; font-weight: 700; color: #00D4FF; min-width: 22px; flex-shrink: 0; }
.section-title { flex: 1; font-size: 14px; font-weight: 600; color: #F0F4FF; }
.chevron { color: #7A8BA8; flex-shrink: 0; transition: transform 0.25s; }
.section.open .chevron { transform: rotate(180deg); }

.section-body { border-top: 1px solid rgba(74,90,173,0.15); }
.section-content { padding: 18px 22px; font-size: 14px; line-height: 1.75; color: #b0bcd4; }
.section-content :deep(p)  { margin: 0 0 10px; }
.section-content :deep(ul) { padding-left: 20px; margin: 8px 0 12px; }
.section-content :deep(li) { margin-bottom: 5px; }
.section-content :deep(b)  { color: #F0F4FF; font-weight: 600; }
.section-content :deep(.requisites) { font-size: 13px; line-height: 2; color: #9aaabb; }
.section-content :deep(.requisites b) { color: #F0F4FF; }

@media (max-width: 600px) {
  .tldr-grid { grid-template-columns: 1fr; }
  .tldr-block { padding: 18px; }
}
</style>
