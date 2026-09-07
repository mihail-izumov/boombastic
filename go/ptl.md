---
title: Личный кабинет — Питерлэнд
description: Переход в личный кабинет парка «БумБастик» в Питерлэнде
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
  to="https://ptl.b00m.fun/"
  event="Переход — ЛК"
  park="piterland"
  label="Открываем личный кабинет Питерлэнда"
/>

<!--
  Адрес страницы: b00m.fun/go/ptl — он зашит в QR тейбл-тента на кассе
  Питерлэнда. Файл переименовывать нельзя без перепечатки тентов.

  Ссылка для тейбл-тента (с меткой источника, по ней считается переход):
  https://b00m.fun/go/ptl?from=tent-piterland

  Зачем страница нужна: ptl.b00m.fun — отдельный сайт, счётчика там нет.
  QR, ведущий туда напрямую, невидим. Этот турникет пишет строку в таблицу
  и тут же уводит гостя дальше.

  Событие «Переход — ЛК» обязано быть в списке EVENTS в
  .vitepress/analytics/apps-script-boom-stat.js, метка tent-piterland —
  в списке SOURCES в .vitepress/analytics/boom-stat.js. Оба уже вписаны.

  Новый парк = копия этого файла (go/oht.md, go/jun.md) с другим to= и park=.
  Событие менять не надо: парки различаются колонкой park.
-->
