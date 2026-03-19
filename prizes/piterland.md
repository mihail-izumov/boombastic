---
layout: page
title: Призотека — Питерлэнд
description: Каталог призов парка «Бумбастик» в Питерлэнде
aside: false
---

<script setup>
import { loadPrizeData } from '../.vitepress/data-loaders/prizes.data.js'
import PrizesPage from '../.vitepress/components/prizes/PrizesPage.vue'
const data = loadPrizeData('piterlend')
</script>

<PrizesPage v-bind="data" park="piterlend" />

<style>
/* Hide VitePress default chrome for full-bleed prizoteka */
.VPDoc .container { max-width: 100% !important; }
.VPDoc .content { padding: 0 !important; }
.VPDoc .content-container { max-width: 100% !important; }
.VPContent { padding-top: 0 !important; }
</style>
