---
layout: doc
title: Парки
aside: false
outline: false
---

<style>
/* Скрываем элементы VitePress doc layout для полноэкранного компонента */
.parks-doc-page .VPDoc .aside,
.parks-doc-page .VPDoc .outline { display: none !important; }
.parks-doc-page .VPDoc .container { max-width: 100% !important; padding: 0 !important; }
.parks-doc-page .VPDoc .content { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
.parks-doc-page .VPDoc .content-container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
.parks-doc-page .vp-doc { padding-bottom: 0 !important; }
.parks-doc-page .VPDoc { padding-top: 0 !important; }

/* Убираем заголовок страницы из VitePress */
.parks-doc-page .vp-doc h1 { display: none !important; }
</style>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('parks-doc-page')
})
onUnmounted(() => {
  document.body.classList.remove('parks-doc-page')
})
</script>

<ParksPage />
