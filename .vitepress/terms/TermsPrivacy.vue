<template>
  <div class="terms-doc">
    <div class="tldr-card">
      <div class="tldr-header">
        <span class="tldr-badge">TL;DR</span>
        <h2 class="tldr-title">Согласие на данные — коротко</h2>
        <p class="tldr-sub">Редакция от 05 февраля 2026 г.</p>
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
      <h1 class="doc-title">Согласие на обработку персональных данных</h1>
      <p class="doc-meta">Редакция от 05 февраля 2026 г.</p>
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
  { icon: '📋', title: 'Зачем нужно согласие', text: 'Для регистрации в кабинете, пополнения карты и работы парка' },
  { icon: '📤', title: 'Кому передаём', text: 'Только ЮKassa — для проведения онлайн-платежей. Больше никому' },
  { icon: '🔄', title: 'Отзыв в любой момент', text: 'Email на spb@bumbastiki.ru или лично в парке — прекратим за 30 дней' },
  { icon: '✅', title: 'Нажал кнопку = согласился', text: 'Регистрация или оплата означают принятие условий' },
]

const sections = [
  {
    title: 'Кто даёт согласие и кому',
    html: `
      <p>Нажимая кнопку регистрации, оплаты или пополнения карты, ты (субъект персональных данных) даёшь согласие следующим Операторам:</p>
      <ul>
        <li><b>ИП Завернин Эдуард Игоревич</b> (ИНН 290217217403, ОГРНИП 304290201600071) — парк «Охта Молл»;</li>
        <li><b>ИП Завернин Лев Эдуардович</b> (ИНН 290218807250, ОГРНИП 325290000025349) — парк «Питерлэнд».</li>
      </ul>
      <p>Согласие действует в связи с использованием сайта b00m.fun и/или посещением парков «Бумбастик».</p>
    `
  },
  {
    title: 'Какие данные обрабатываются',
    html: `
      <ul>
        <li>Фамилия, имя, отчество;</li>
        <li>номер мобильного телефона;</li>
        <li>адрес электронной почты;</li>
        <li>дата рождения;</li>
        <li>номер и баланс Игровой карты;</li>
        <li>история транзакций и использования услуг парков;</li>
        <li>IP-адрес, данные cookies, информация о браузере и устройстве;</li>
        <li>иные данные, добровольно предоставленные тобой.</li>
      </ul>
    `
  },
  {
    title: 'Для чего используются данные',
    html: `
      <ul>
        <li>Регистрация и авторизация на сайте и в Личном кабинете;</li>
        <li>исполнение договора публичной оферты (управление картой, выдача призов);</li>
        <li>обработка платежей через ЮKassa;</li>
        <li>уведомления об изменениях в работе парков и состоянии заказа;</li>
        <li>рекламные рассылки — только при наличии отдельного согласия;</li>
        <li>ответы на обращения;</li>
        <li>улучшение сайта и анализ его использования;</li>
        <li>безопасность и предотвращение мошенничества;</li>
        <li>исполнение требований законодательства РФ.</li>
      </ul>
    `
  },
  {
    title: 'Способы обработки',
    html: `
      <p>Операторы вправе осуществлять следующие действия с данными:</p>
      <p>сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача (только согласно п. 5), обезличивание, блокирование, удаление, уничтожение.</p>
      <p>Обработка ведётся как автоматически (серверы, базы данных), так и вручную (в случаях, предусмотренных законом).</p>
    `
  },
  {
    title: 'Кому передаются данные',
    html: `
      <p>Данные передаются только:</p>
      <ul>
        <li><b>ЮKassa (ООО «НКО ЮМани»)</b> — для обработки онлайн-платежей;</li>
        <li><b>Сервисы аналитики</b> (Яндекс.Метрика) — обезличенные данные о посещаемости;</li>
        <li><b>Хостинг-провайдеры</b> — для технического обеспечения работы сайта;</li>
        <li><b>Государственные органы</b> — только в случаях, прямо предусмотренных законодательством РФ.</li>
      </ul>
      <p>Продажа персональных данных третьим лицам не осуществляется.</p>
    `
  },
  {
    title: 'Срок действия согласия',
    html: `
      <p>Согласие действует с момента его предоставления (нажатия кнопки) и до достижения целей обработки или до момента его отзыва.</p>
      <p>Сроки хранения данных определяются Политикой конфиденциальности (b00m.fun/terms/policy).</p>
    `
  },
  {
    title: 'Как отозвать согласие',
    html: `
      <p><b>Отзыв согласия:</b></p>
      <ul>
        <li>по электронной почте: spb@bumbastiki.ru</li>
        <li>лично в любом из парков (паспорт или другой документ).</li>
      </ul>
      <p><b>В заявлении укажи:</b> ФИО, контактный телефон и/или email, указание на отзыв согласия.</p>
      <p><b>Срок:</b> обработку прекратим в течение 30 (тридцати) дней с момента получения заявления. Часть данных может сохраниться в соответствии с требованиями законодательства (например, данные транзакций — 5 лет).</p>
      <p>Отзыв согласия не влияет на законность обработки, осуществлённой до момента отзыва.</p>
    `
  },
  {
    title: 'Твои права',
    html: `
      <ul>
        <li>Получать информацию об обработке своих персональных данных;</li>
        <li>требовать уточнения, блокирования или удаления данных;</li>
        <li>отозвать согласие в любой момент;</li>
        <li>обжаловать действия Оператора в Роскомнадзор или в суд.</li>
      </ul>
      <p>Полный перечень прав — в Политике конфиденциальности: <b>b00m.fun/terms/policy</b></p>
    `
  },
  {
    title: 'Заключительные положения',
    html: `
      <p>Нажимая кнопку регистрации, оплаты или пополнения карты, ты подтверждаешь, что:</p>
      <ul>
        <li>ознакомлен с настоящим Согласием и Политикой конфиденциальности;</li>
        <li>понимаешь и принимаешь условия обработки;</li>
        <li>действуешь добровольно и в своём интересе;</li>
        <li>достиг 18 лет, либо действуешь с согласия законного представителя.</li>
      </ul>
    `
  },
  {
    title: 'Контакты',
    html: `
      <div class="requisites">
        <p>✉️ spb@bumbastiki.ru</p>
        <p>📞 +7 (964) 321-11-00 (Охта Молл)</p>
        <p>📞 +7 (965) 045-75-55 (Питерлэнд)</p>
        <br>
        <p>📍 Братиславская дорога, д. 3, ТРК «Охта Молл», 3 этаж, оф. 3.15</p>
        <p>📍 Приморский проспект, д. 72, ТРК «Питерлэнд»</p>
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
    linear-gradient(145deg, rgba(0,255,136,0.2), rgba(74,90,173,0.2), rgba(0,255,136,0.08));
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
  background: #00FF88;
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
  border: 1px solid rgba(0,255,136,0.1);
  border-radius: 10px;
  padding: 12px 14px;
}
.tldr-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.tldr-item-title { font-size: 13px; font-weight: 700; color: #00FF88; margin-bottom: 3px; }
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
.section.open { border-color: rgba(0,255,136,0.2); }

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
.section-toggle:hover { background: rgba(0,255,136,0.06); }

.section-num {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #00FF88;
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

@media (max-width: 600px) {
  .tldr-grid { grid-template-columns: 1fr; }
  .tldr-card { padding: 18px; }
}
</style>
