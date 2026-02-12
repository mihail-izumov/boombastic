// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import './boom-styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
  }
}
