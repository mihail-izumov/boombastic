<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './HomePage.vue'

const { frontmatter } = useData()

const VPLayout = DefaultTheme.Layout
</script>

<template>
  <HomePage v-if="frontmatter.layout === 'boom-home'" />
  <VPLayout v-else />
</template>
