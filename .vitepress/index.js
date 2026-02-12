// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import HomeLayout from './components/HomeLayout.vue'
import './boom-styles.css'

export default {
  extends: DefaultTheme,
  Layout: HomeLayout,
}
