---
layout: page
title: Призотека — Охта Молл
description: Каталог призов парка «Бумбастик» в Охта Молле
aside: false
---

<script setup>
import { data } from './ohtamall.data.js'
import PrizesPage from '../.vitepress/components/prizes/PrizesPage.vue'
</script>

<PrizesPage v-bind="data" :park="data.park" />
