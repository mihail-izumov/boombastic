import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRouter } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'

// Стили
import './style.css'
import './boom-styles.css'   // ← НОВОЕ: стили для HomePage

import Layout from './Layout.vue'
import ShareButton from '../components/ShareButton.vue'

export default {
  extends: DefaultTheme,
  Layout: Layout,

  setup() {
    const router = useRouter()

    onMounted(() => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      }
    })
  },

  enhanceApp({ app, router }) {
    app.component('ShareButton', ShareButton)

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
