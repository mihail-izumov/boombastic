---
layout: page
title: Призотека — Охта Молл
description: Каталог призов парка «Бумбастик» в Охта Молл
aside: false
---

<script setup>
import { loadPrizeData } from '../.vitepress/data-loaders/prizes.data.js'
import PrizesPage from '../.vitepress/components/prizes/PrizesPage.vue'
const data = loadPrizeData('ohta')
</script>

<PrizesPage v-bind="data" park="ohta" />

<style>
/* Hide VitePress default chrome for full-bleed prizoteka */
.VPDoc .container { max-width: 100% !important; }
.VPDoc .content { padding: 0 !important; }
.VPDoc .content-container { max-width: 100% !important; }
.VPContent { padding-top: 0 !important; }
</style>
