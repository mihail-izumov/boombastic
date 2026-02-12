<script setup>
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
</script>

<template>
  <div style="background: red; color: white; padding: 40px; font-size: 20px; min-height: 100vh">
    <p>LAYOUT РАБОТАЕТ!</p>
    <p>frontmatter.layout = "{{ frontmatter.layout }}"</p>
    <p>page.relativePath = "{{ page.relativePath }}"</p>
  </div>
</template>
