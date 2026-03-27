<template>
  <div class="terms-doc">
    <div class="tldr-card">
      <div class="tldr-header">
        <span class="tldr-badge">TL;DR</span>
        <h2 class="tldr-title">Что мы делаем с твоими данными</h2>
        <p class="tldr-sub">Политика конфиденциальности · Редакция от 05 февраля 2026 г.</p>
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
      <h1 class="doc-title">Политика конфиденциальности</h1>
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
  { icon: '🔒', title: 'Берём только нужное', text: 'Телефон, email, история карты — только для работы кабинета и парка' },
  { icon: '🚫', title: 'Не продаём данные', text: 'Третьим лицам передаём только платёжной системе ЮKassa' },
  { icon: '🗑️', title: 'Удалим по запросу', text: 'Пишешь на spb@bumbastiki.ru — обработку прекратим за 30 дней' },
  { icon: '📧', title: 'Рассылка отключаема', text: 'Откажись в любой момент — пришли письмо или скажи на кассе' },
  { icon: '🛡️', title: 'Данные защищены', text: 'SSL, ограниченный доступ, хранение на защищённых серверах' },
]

const sections = [
  {
    title: 'Общие положения',
    html: `
      <p>Настоящая Политика конфиденциальности устанавливает порядок обработки персональных данных посетителей сайта b00m.fun и парков «Бумбастик».</p>
      <p><b>Операторы данных:</b></p>
      <ul>
        <li>ИП Завернин Эдуард Игоревич (ИНН 290217217403) — парк Охта Молл</li>
        <li>ИП Завернин Лев Эдуардович (ИНН 290218807250) — парк Питерлэнд</li>
      </ul>
      <p>Политика распространяется на все персональные данные, обрабатываемые Операторами при оказании услуг.</p>
      <p>Использование сайта и услуг означает согласие с настоящей Политикой.</p>
    `
  },
  {
    title: 'Какие данные мы обрабатываем',
    html: `
      <p><b>При регистрации и использовании Личного кабинета:</b></p>
      <ul>
        <li>ФИО;</li>
        <li>номер мобильного телефона;</li>
        <li>адрес электронной почты;</li>
        <li>дата рождения.</li>
      </ul>
      <p><b>При использовании Игровой карты:</b></p>
      <ul>
        <li>номер карты и баланс;</li>
        <li>история транзакций и посещений.</li>
      </ul>
      <p><b>Технические данные (автоматически):</b></p>
      <ul>
        <li>IP-адрес;</li>
        <li>cookies и информация о браузере;</li>
        <li>данные о посещаемых страницах (Яндекс.Метрика).</li>
      </ul>
    `
  },
  {
    title: 'Для чего мы используем данные',
    html: `
      <ul>
        <li>Регистрация и идентификация в Личном кабинете.</li>
        <li>Управление Игровой картой: баланс, история операций, пополнение.</li>
        <li>Обработка платежей через ЮKassa.</li>
        <li>Уведомления об изменениях в работе парков.</li>
        <li>Рекламные рассылки — только с отдельного согласия, отказ в любой момент.</li>
        <li>Улучшение сайта и качества услуг.</li>
        <li>Ответы на обращения.</li>
        <li>Исполнение требований законодательства РФ.</li>
      </ul>
    `
  },
  {
    title: 'Правовые основания обработки',
    html: `
      <p>Обработка персональных данных осуществляется на основании:</p>
      <ul>
        <li>Федерального закона № 152-ФЗ «О персональных данных»;</li>
        <li>согласия субъекта персональных данных (ст. 9 ФЗ-152);</li>
        <li>необходимости исполнения договора (оферты), стороной которого является субъект;</li>
        <li>законных интересов Оператора (обеспечение безопасности, улучшение услуг).</li>
      </ul>
    `
  },
  {
    title: 'Способы и сроки обработки',
    html: `
      <p>Данные обрабатываются с использованием средств автоматизации (серверы, базы данных) и без таковых (бумажные носители в случаях, предусмотренных законодательством).</p>
      <p><b>Сроки хранения:</b></p>
      <ul>
        <li>Данные Личного кабинета — до удаления аккаунта или отзыва согласия;</li>
        <li>Данные транзакций — 5 лет (требование налогового законодательства);</li>
        <li>Технические логи — 1 год;</li>
        <li>Данные для рассылок — до отзыва согласия.</li>
      </ul>
    `
  },
  {
    title: 'Кому мы передаём данные',
    html: `
      <p>Данные передаются только в следующих случаях:</p>
      <ul>
        <li><b>ЮKassa (ООО «НКО ЮМани»)</b> — для обработки онлайн-платежей;</li>
        <li><b>Яндекс.Метрика и аналоги</b> — обезличенные данные о посещаемости сайта;</li>
        <li><b>Хостинг-провайдеры</b> — для хранения и обработки данных;</li>
        <li><b>Государственные органы</b> — только в случаях, прямо предусмотренных законодательством РФ.</li>
      </ul>
      <p>Продажа персональных данных третьим лицам не осуществляется ни при каких условиях.</p>
    `
  },
  {
    title: 'Трансграничная передача',
    html: `
      <p>Трансграничная передача персональных данных (за пределы РФ) не осуществляется.</p>
      <p>Все данные хранятся на серверах, расположенных на территории Российской Федерации.</p>
    `
  },
  {
    title: 'Защита данных',
    html: `
      <p>Для защиты персональных данных применяются:</p>
      <ul>
        <li>шифрование передаваемых данных (SSL/TLS);</li>
        <li>ограниченный доступ сотрудников к персональным данным — только по служебной необходимости;</li>
        <li>регулярная проверка систем безопасности;</li>
        <li>хранение данных на защищённых серверах с резервным копированием.</li>
      </ul>
    `
  },
  {
    title: 'Твои права',
    html: `
      <p>Ты вправе в любой момент:</p>
      <ul>
        <li>запросить информацию о том, какие данные обрабатываются;</li>
        <li>потребовать исправления неточных данных;</li>
        <li>отозвать согласие — обработка прекратится в течение 30 дней;</li>
        <li>потребовать удаления данных (за исключением тех, что хранятся по требованию закона);</li>
        <li>пожаловаться в Роскомнадзор или обратиться в суд.</li>
      </ul>
      <p><b>Контакт:</b> spb@bumbastiki.ru — опиши запрос в свободной форме, ответим в течение 10 рабочих дней.</p>
    `
  },
  {
    title: 'Cookies',
    html: `
      <p>Сайт использует cookies для:</p>
      <ul>
        <li>авторизации в Личном кабинете;</li>
        <li>запоминания настроек (выбранный парк, количество тикетов);</li>
        <li>анализа посещаемости (Яндекс.Метрика).</li>
      </ul>
      <p>Отключить cookies можно в настройках браузера. Это может ограничить функциональность Личного кабинета.</p>
    `
  },
  {
    title: 'Данные несовершеннолетних',
    html: `
      <p>Сайт b00m.fun не предназначен для лиц моложе 18 лет.</p>
      <p>Если тебе нет 18 лет — регистрацию в Личном кабинете и онлайн-платежи должен совершать родитель или законный представитель.</p>
      <p>При обнаружении данных несовершеннолетнего, полученных без согласия родителей, мы удалим их незамедлительно.</p>
    `
  },
  {
    title: 'Изменения политики',
    html: `
      <p>Оператор вправе вносить изменения в Политику в одностороннем порядке. Актуальная версия всегда доступна по адресу: <b>b00m.fun/terms/policy</b></p>
      <p>При существенных изменениях уведомим по email (если он указан в Личном кабинете).</p>
    `
  },
  {
    title: 'Контакты',
    html: `
      <div class="requisites">
        <p><b>По вопросам обработки данных:</b></p>
        <p>✉️ spb@bumbastiki.ru</p>
        <p>📞 +7 (964) 321-11-00 (Охта Молл)</p>
        <p>📞 +7 (965) 045-75-55 (Питерлэнд)</p>
        <br>
        <p><b>Адреса парков:</b></p>
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
    linear-gradient(145deg, rgba(255,0,128,0.2), rgba(74,90,173,0.2), rgba(0,212,255,0.15));
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
  background: #FF0080;
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
  border: 1px solid rgba(255,0,128,0.1);
  border-radius: 10px;
  padding: 12px 14px;
}
.tldr-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.tldr-item-title { font-size: 13px; font-weight: 700; color: #FF0080; margin-bottom: 3px; }
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
.section.open { border-color: rgba(255,0,128,0.2); }

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
.section-toggle:hover { background: rgba(255,0,128,0.06); }

.section-num {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #FF0080;
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
.section-content :deep(.requisites b) { color: #FF0080; }

@media (max-width: 600px) {
  .tldr-grid { grid-template-columns: 1fr; }
  .tldr-card { padding: 18px; }
}
</style>
