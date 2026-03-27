<template>
  <div class="terms-doc">
    <div class="tldr-card">
      <div class="tldr-header">
        <span class="tldr-badge">TL;DR</span>
        <h2 class="tldr-title">Главное — за 10 секунд</h2>
        <p class="tldr-sub">Питерлэнд · Приморский проспект, 72</p>
      </div>
      <div class="tldr-grid">
        <div class="tldr-item" v-for="item in tldr" :key="item.icon">
          <span class="tldr-icon">{{ item.icon }}</span>
          <div>
            <div class="tldr-item-title">{{ item.title }}</div>
            <div class="tldr-item-text">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-header">
      <h1 class="doc-title">Договор публичной оферты</h1>
      <p class="doc-meta">Редакция от 05 февраля 2026 г. · ИП Завернин Лев Эдуардович</p>
    </div>

    <div class="sections">
      <div
        v-for="(section, i) in sections"
        :key="i"
        class="section"
        :class="{ open: openIndex === i }"
      >
        <button class="section-toggle" @click="toggle(i)">
          <span class="section-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="section-title">{{ section.title }}</span>
          <span class="section-arrow">{{ openIndex === i ? '▲' : '▼' }}</span>
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

const tldr = [
  { icon: '🎫', title: 'Вход свободный', text: 'Платишь только за карту и её пополнение' },
  { icon: '💳', title: 'Тикеты не сгорают', text: 'Баланс карты сохраняется между визитами' },
  { icon: '💸', title: 'Возврат есть', text: 'В течение 3 дней — заявление на кассе или email' },
  { icon: '🧒', title: 'Дети до 14', text: 'Только со взрослым (18+). Взрослый отвечает за ребёнка' },
  { icon: '⚡', title: 'Проблема с автоматом?', text: 'Позвони +7 (965) 045-75-55 или скажи на кассе' },
]

const sections = [
  {
    title: 'Термины и определения',
    html: `
      <p><b>Исполнитель</b> — ИП Завернин Лев Эдуардович (ИНН 290218807250, ОГРНИП 325290000025349).</p>
      <p><b>Заказчик (Посетитель)</b> — любой человек, который пришёл в парк и пользуется игровыми автоматами.</p>
      <p><b>Парк</b> — «Бумбастик» в ТРК «Питерлэнд», г. Санкт-Петербург, Приморский проспект, д. 72.</p>
      <p><b>Игровая карта</b> — пластиковая карта с чипом: носитель кредитов для запуска автоматов.</p>
      <p><b>Игровые единицы (кредиты)</b> — условные единицы в рублях, которые списываются за каждую игру.</p>
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
      <p>🕙 <b>Режим работы:</b> актуальное расписание — на сайте и в парке.</p>
      <p>🧒 <b>Дети до 14 лет</b> — только со взрослым от 18 лет. Взрослый несёт полную ответственность за безопасность ребёнка.</p>
      <p>🆓 <b>Вход в парк бесплатный.</b> Оплачивается только карта и кредиты на ней.</p>
      <br>
      <p><b>На территории парка запрещено:</b></p>
      <ul>
        <li>приходить в состоянии алкогольного или наркотического опьянения;</li>
        <li>курить, в том числе вейпы и электронные сигареты;</li>
        <li>приносить и употреблять еду и напитки (детское питание — исключение);</li>
        <li>ударять, раскачивать или вскрывать автоматы;</li>
        <li>мешать другим посетителям и проявлять агрессию.</li>
      </ul>
      <p>Сотрудники вправе попросить покинуть парк нарушителей без возврата средств.</p>
    `
  },
  {
    title: 'Карты, тарифы и оплата',
    html: `
      <p><b>Получение карты:</b> на кассе парка или онлайн в Личном кабинете.</p>
      <p><b>Пополнение:</b> на кассе, через терминал самообслуживания или онлайн.</p>
      <p><b>Бонусы:</b> при пополнении на сумму от 3 000 ₽ — бонусные кредиты согласно действующей акции.</p>
      <p><b>Тарифы</b> на каждый автомат указаны на нём самом. Стоимость игры списывается в момент запуска.</p>
      <p><b>Важно:</b> неиспользованные кредиты не имеют срока сгорания — баланс сохраняется.</p>
      <p>Приём платежей осуществляется через ЮKassa (ООО «НКО ЮМани»).</p>
    `
  },
  {
    title: 'Возврат денежных средств',
    html: `
      <p><b>Срок подачи заявки:</b> не позднее 3 (трёх) рабочих дней с момента оплаты.</p>
      <p><b>Как подать заявку:</b></p>
      <ul>
        <li>лично на кассе с документом, удостоверяющим личность;</li>
        <li>по email: spb@bumbastiki.ru с указанием ФИО, номера карты и суммы.</li>
      </ul>
      <p><b>Срок возврата:</b> 10 рабочих дней с момента получения заявки.</p>
      <p><b>Ограничения:</b> частично использованные кредиты — возврат пропорционально неиспользованному остатку. Бонусные кредиты возврату не подлежат.</p>
      <p><b>Технические сбои:</b> если автомат не сработал и кредиты списались — сообщите на кассе, сотрудники разберутся.</p>
    `
  },
  {
    title: 'Права и обязанности сторон',
    html: `
      <p><b>Исполнитель обязуется:</b></p>
      <ul>
        <li>обеспечить доступ к исправному оборудованию в часы работы;</li>
        <li>отображать корректный баланс карты и историю операций;</li>
        <li>не передавать персональные данные третьим лицам (кроме платёжной системы);</li>
        <li>рассматривать претензии в течение 10 рабочих дней.</li>
      </ul>
      <p><b>Заказчик обязуется:</b></p>
      <ul>
        <li>соблюдать правила посещения и использования оборудования;</li>
        <li>предоставлять достоверные данные при регистрации;</li>
        <li>не допускать использования карты третьими лицами без согласия.</li>
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
    title: 'Ответственность и споры',
    html: `
      <p>Исполнитель не несёт ответственности за форс-мажор: отключение электричества, интернета, действия третьих лиц.</p>
      <p><b>Претензионный порядок обязателен.</b> Срок ответа на претензию — 10 рабочих дней.</p>
      <p>При невозможности договориться — спор передаётся в суд по месту нахождения Исполнителя или по месту жительства Заказчика (на выбор Заказчика по Закону о защите прав потребителей).</p>
    `
  },
  {
    title: 'Срок действия и изменения',
    html: `
      <p>Договор действует с момента публикации на сайте бессрочно.</p>
      <p>Исполнитель вправе изменять условия в одностороннем порядке. Изменения публикуются на сайте и вступают в силу с момента публикации.</p>
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
        <p>📍 ТРК «Питерлэнд», Приморский проспект, д. 72</p>
        <p>📞 +7 (965) 045-75-55</p>
        <p>✉️ spb@bumbastiki.ru</p>
        <p>🌐 b00m.fun</p>
      </div>
    `
  },
]
</script>

<style scoped>
.terms-doc { font-family: 'Inter', sans-serif; color: #F0F4FF; }

.tldr-card {
  border: 1px solid transparent;
  background-image:
    linear-gradient(145deg, rgba(28,26,62,0.97), rgba(34,32,80,0.95)),
    linear-gradient(145deg, rgba(0,212,255,0.25), rgba(74,90,173,0.2), rgba(0,212,255,0.08));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 32px;
}
.tldr-header { margin-bottom: 20px; }
.tldr-badge {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #0D1421;
  background: #00D4FF;
  padding: 3px 10px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 10px;
}
.tldr-title { font-size: 20px; font-weight: 700; margin: 0 0 4px; color: #F0F4FF; }
.tldr-sub { font-family: 'Space Mono', monospace; font-size: 12px; color: #7A8BA8; margin: 0; }

.tldr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.tldr-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(0,212,255,0.1);
  border-radius: 10px;
  padding: 12px 14px;
}
.tldr-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.tldr-item-title { font-size: 13px; font-weight: 700; color: #00D4FF; margin-bottom: 3px; }
.tldr-item-text { font-size: 12px; color: #7A8BA8; line-height: 1.5; }

.doc-header { margin-bottom: 24px; }
.doc-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #F0F4FF;
  margin: 0 0 6px;
}
.doc-meta { font-family: 'Space Mono', monospace; font-size: 12px; color: #7A8BA8; margin: 0; }

.sections { display: flex; flex-direction: column; gap: 8px; }
.section {
  border: 1px solid rgba(74,90,173,0.25);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.25s;
}
.section.open { border-color: rgba(0,212,255,0.2); }

.section-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: rgba(28,26,62,0.6);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}
.section-toggle:hover { background: rgba(0,212,255,0.06); }

.section-num {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #00D4FF;
  min-width: 24px;
}
.section-title { flex: 1; font-size: 14px; font-weight: 600; color: #F0F4FF; }
.section-arrow { font-size: 10px; color: #7A8BA8; }

.section-body { border-top: 1px solid rgba(74,90,173,0.2); }
.section-content {
  padding: 18px 22px;
  font-size: 14px;
  line-height: 1.75;
  color: #b0bcd4;
}
.section-content :deep(p) { margin: 0 0 10px; }
.section-content :deep(ul) { padding-left: 20px; margin: 8px 0 12px; }
.section-content :deep(li) { margin-bottom: 5px; }
.section-content :deep(b) { color: #F0F4FF; font-weight: 600; }
.section-content :deep(.requisites) {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  line-height: 2;
  color: #7A8BA8;
}
.section-content :deep(.requisites b) { color: #00D4FF; }

@media (max-width: 600px) {
  .tldr-grid { grid-template-columns: 1fr; }
  .tldr-card { padding: 18px; }
}
</style>
