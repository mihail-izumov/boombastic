---
layout: page
title: Призотека — Питерлэнд
description: Каталог призов парка «Бумбастик» в Питерлэнде
aside: false
---

<script setup>
import { data } from './piterland.data.js'
import PrizesPage from '../.vitepress/components/prizes/PrizesPage.vue'
</script>

<PrizesPage v-bind="data" :park="data.park" />
