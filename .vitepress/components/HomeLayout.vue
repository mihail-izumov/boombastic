<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './HomePage.vue'

const { frontmatter } = useData()
</script>

<template>
  <!-- Если в index.md стоит layout: boom-home → наша страница -->
  <div v-if="frontmatter.layout === 'boom-home'" class="boom-home-layout">
    <HomePage />
  </div>
  <!-- Иначе — стандартный VitePress (для других страниц) -->
  <DefaultTheme.Layout v-else />
</template>
