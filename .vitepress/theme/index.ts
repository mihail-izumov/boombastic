import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRouter } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'

// Стили
import './style.css'
import './boom-styles.css'   // ← НОВОЕ: стили для HomePage

import Layout from './Layout.vue'
import ShareButton from '../components/ShareButton.vue'
import ParksPage from '../components/ParksPage.vue'
import ChargeCardPage from '../components/ChargeCardPage.vue'
import BoomRewards from '../components/BoomRewards.vue'
import PrizotekaOnboarding from '../components/PrizotekaOnboarding.vue'
import CookieConsent from '../components/CookieConsent.vue'
import TermsHub from '../terms/TermsHub.vue'
import TermsOfertaOhta from '../terms/TermsOfertaOhta.vue'
import TermsOfertaPiterland from '../terms/TermsOfertaPiterland.vue'
import TermsPolicy from '../terms/TermsPolicy.vue'
import TermsPrivacy from '../terms/TermsPrivacy.vue'
import TurboSubscribe from '../turbo/TurboSubscribe.vue'
import Bonus500Page from '../components/Bonus500Page.vue'

// Свой счётчик вместо Plausible. Код и объяснения — в .vitepress/analytics/
import { setup as setupStat, pageview as statPageview } from '../analytics/boom-stat'

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
    app.component('ParksPage', ParksPage)
    app.component('ChargeCardPage', ChargeCardPage)
    app.component('BoomRewards', BoomRewards)
    app.component('PrizotekaOnboarding', PrizotekaOnboarding)
    app.component('CookieConsent', CookieConsent)
    app.component('TermsHub', TermsHub)
    app.component('TermsOfertaOhta', TermsOfertaOhta)
    app.component('TermsOfertaPiterland', TermsOfertaPiterland)
    app.component('TermsPolicy', TermsPolicy)
    app.component('TermsPrivacy', TermsPrivacy)
    app.component('TurboSubscribe', TurboSubscribe)
    app.component('Bonus500Page', Bonus500Page)

    /* === Счётчик посещений ===
       Первое открытие считаем сами: onAfterRouteChanged срабатывает только
       на переходах внутри сайта, а на самый первый заход — нет. Именно этот
       заход нам и нужен: гость приходит с наклейки сразу на нужную страницу
       и часто уходит с неё же в личный кабинет, не кликнув больше никуда. */
    if (typeof window !== 'undefined') {
      setupStat()
      statPageview()

      const prevAfter = router.onAfterRouteChanged
      router.onAfterRouteChanged = (to) => {
        if (prevAfter) prevAfter(to)
        statPageview()
      }
    }

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
