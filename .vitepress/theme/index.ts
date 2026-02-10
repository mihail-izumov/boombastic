import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Layout from './Layout.vue'

import ShareButton from '../components/ShareButton.vue'


export default {
  extends: DefaultTheme,

  // Используем Layout напрямую (модальное окно добавлено в Layout.vue)
  Layout: Layout,

  enhanceApp({ app }) {  
    app.component('ShareButton', ShareButton)   
    
  },
}
