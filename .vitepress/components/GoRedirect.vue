<script setup>
/**
 * GoRedirect — страница-турникет. Считает переход и уходит на чужой сайт.
 *
 * ЗАЧЕМ ОНА ВООБЩЕ ЕСТЬ. Личные кабинеты парков (ptl.b00m.fun, lk.b00m.fun,
 * jun.b00m.fun) — отдельные сайты, нашего счётчика там нет и поставить его
 * мы не можем. Значит QR, который ведёт в ЛК напрямую, невидим: сколько
 * человек его отсканировало, узнать неоткуда.
 *
 * Поэтому QR на печати ведёт не в ЛК, а сюда: страница пишет строку в
 * таблицу-счётчик и тут же переадресует гостя дальше. Гость видит наш адрес
 * доли секунды.
 *
 * ⚠ СОБЫТИЕ ДОЛЖНО БЫТЬ В СПИСКЕ `EVENTS`. Имя из `event` обязано слово в
 *   слово совпадать со списком в .vitepress/analytics/apps-script-boom-stat.js,
 *   иначе таблица молча выбросит строку. Это два места, а не одно.
 *
 * ⚠ МЕТКА ИСТОЧНИКА В АДРЕСЕ, А НЕ ЗДЕСЬ. Откуда пришёл гость, счётчик берёт
 *   сам из `?from=` (см. список SOURCES в boom-stat.js). Один и тот же
 *   турникет обслуживает и тейбл-тент, и наклейку, и экран — различает их
 *   только метка в ссылке QR.
 */
import { onMounted } from 'vue'
import { track } from '../analytics/boom-stat'

const props = defineProps({
  /** Куда уводим. Полный адрес с https:// — это чужой сайт. */
  to:    { type: String, required: true },
  /** Имя события ровно как в EVENTS. */
  event: { type: String, required: true },
  /** Код парка для колонки park: piterland / ohta / june / mari. */
  park:  { type: String, default: '' },
  /** Что показать гостю, пока браузер переключается. */
  label: { type: String, default: 'Открываем личный кабинет' }
})

onMounted(() => {
  track(props.event, { park: props.park })

  /* Пауза перед уходом. Счётчик шлёт событие через sendBeacon, который
     переживает уход со страницы, но не на всех браузерах — где его нет,
     в дело идёт обычный запрос, и ему нужно успеть стартовать.
     150 мс человек не замечает, а запрос за это время уходит. */
  setTimeout(() => { window.location.replace(props.to) }, 150)
})
</script>

<template>
  <div class="go">
    <div class="go-dot" aria-hidden="true"></div>
    <p class="go-label">{{ label }}…</p>

    <!-- Ссылка видна всегда и не зависит от JS: если переадресация не
         сработала (режим чтения, встроенный браузер соцсети, отключённые
         скрипты) — гость просто нажимает сам, и страница остаётся рабочей. -->
    <a class="go-link" :href="to" rel="noopener">Не открылось — нажмите здесь</a>
  </div>
</template>

<style scoped>
.go {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 40px 20px;
  text-align: center;
}

.go-dot {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid rgba(197, 249, 70, 0.18);
  border-top-color: var(--accent-lime, #C5F946);
  animation: go-spin 0.8s linear infinite;
}

@keyframes go-spin { to { transform: rotate(360deg); } }

/* Уважаем системную настройку «меньше движения»: там, где анимации
   отключены, кружок просто стоит — смысла он не несёт. */
@media (prefers-reduced-motion: reduce) {
  .go-dot { animation: none; }
}

.go-label {
  margin: 0;
  font-size: 17px;
  color: var(--text-primary, #F0F4FF);
}

.go-link {
  font-size: 14px;
  color: var(--text-secondary, #7A8BA8);
  text-decoration: underline;
}

.go-link:hover { color: var(--accent-lime, #C5F946); }
</style>
