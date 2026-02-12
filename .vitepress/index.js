// .vitepress/theme/index.js
// Кастомная тема: расширяем дефолтную + добавляем наши стили и компоненты

import DefaultTheme from 'vitepress/theme'
import HomeLayout from './components/HomeLayout.vue'
import './boom-styles.css'

// Если у тебя уже есть style.css / custom.css — оставь их:
// import './style.css'
// import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: HomeLayout,
}
