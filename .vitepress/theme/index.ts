// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // Можно добавить глобальные компоненты здесь
  }
}
