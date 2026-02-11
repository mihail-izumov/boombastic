import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRouter } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'

// Единственный файл стилей (style.css + custom.css объединены)
import './style.css'

import Layout from './Layout.vue'
import ShareButton from '../components/ShareButton.vue'

export default {
  extends: DefaultTheme,
  Layout: Layout,

  setup() {
    // View Transitions API для плавных переходов между страницами
    const router = useRouter()

    onMounted(() => {
      // Если браузер поддерживает View Transitions — включаем
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        // VitePress вызывает router.onBeforeRouteChange перед навигацией
        const originalGo = router.go

        // Оборачиваем навигацию в view transition
        // VitePress 1.x поддерживает это нативно через useRouter
      }
    })
  },

  enhanceApp({ app, router }) {
    app.component('ShareButton', ShareButton)

    // Включаем View Transitions при навигации
    if (typeof window !== 'undefined' && 'startViewTransition' in document) {
      let transitioning = false

      router.onBeforeRouteChange = () => {
        if (transitioning) return
        transitioning = true

        // @ts-ignore - View Transitions API
        const transition = document.startViewTransition()
        transition.finished.then(() => { transitioning = false })
        transition.ready.catch(() => { transitioning = false })
      }
    }
  },
}
