<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './HomePage.vue'

const { frontmatter } = useData()
const isHome = computed(() => frontmatter.value.layout === 'boom-home')

// Получаем компонент Layout из дефолтной темы
const DefaultLayout = DefaultTheme.Layout
</script>

<template>
  <HomePage v-if="isHome" />
  <DefaultLayout v-else />
</template>
