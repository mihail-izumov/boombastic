// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    console.log('🔥 ТЕМА ЗАГРУЖЕНА!')
  }
}
