---
title: Личный кабинет — ТРЦ «Лето»
description: Переход в личный кабинет парка «БумБастик» в ТРЦ «Лето»
layout: page
sidebar: false
aside: false
outline: false
head:
  # Страница служебная: гость на ней не задерживается, и в поиске ей делать
  # нечего. Без этого Google начнёт показывать её вместо страницы парка.
  - - meta
    - name: robots
      content: noindex, nofollow
---

<script setup>
import GoRedirect from '../.vitepress/components/GoRedirect.vue'
</script>

<GoRedirect
  to="https://leto.b00m.fun/"
  event="Переход — ЛК"
  park="leto"
  label="Открываем личный кабинет ТРЦ «Лето»"
/>

<!--
  Адрес страницы: b00m.fun/go/leto — он зашит в QR на игровой карте
  ТРЦ «Лето». Файл переименовывать нельзя без перепечатки карт.

  Ссылка для печати (с меткой источника, по ней считается переход):
  https://b00m.fun/go/leto?from=card-leto

  Зачем страница нужна: leto.b00m.fun — отдельный сайт, счётчика там нет.
  QR, ведущий туда напрямую, невидим. Этот турникет пишет строку в таблицу
  и тут же уводит гостя дальше.

  Событие «Переход — ЛК» обязано быть в списке EVENTS в
  .vitepress/analytics/apps-script-boom-stat.js, метка card-leto —
  в списке SOURCES в .vitepress/analytics/boom-stat.js. Оба уже вписаны.
  Новое событие не заводим: парки различаются колонкой park.
-->
