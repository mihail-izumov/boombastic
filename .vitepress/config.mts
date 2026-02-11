import { defineConfig } from 'vitepress'

export default defineConfig({
  appearance: false,
  title: 'БумБастик',
  locales: {
    '/': {
      lang: 'ru-RU',
      title: 'БумБастик',
      description: 'Игровые парки для детей и их родителей',
    },
  },
  transformPageData(pageData) { return pageData },
  buildEnd(siteConfig) {},

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/boombastic/shark-eyes-icon-electric.svg' }],
    ['link', { rel: 'shortcut icon', href: '/boombastic/shark-eyes-icon-electric.svg' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],

    // Шрифты: Inter (тело), Montserrat (заголовки), Space Mono (технический/сайдбар)
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;900&family=Space+Mono:wght@400;700&display=swap' }],

    ['script', {}, `
    (function() {
      document.documentElement.classList.add('dark');

      /* === МОДАЛЬНОЕ ОКНО «Войти» === */
      function createLoginModal() {
        if (document.getElementById('bb-login-modal')) return;
        var overlay = document.createElement('div');
        overlay.id = 'bb-login-modal';
        overlay.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;align-items:center;justify-content:center;';
        var backdrop = document.createElement('div');
        backdrop.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,10,30,0.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);cursor:pointer;';
        backdrop.addEventListener('click', function() { closeLoginModal(); });
        var modal = document.createElement('div');
        modal.style.cssText = 'position:relative;width:90%;max-width:480px;height:80vh;max-height:700px;border-radius:16px;overflow:hidden;background:white;box-shadow:0 25px 60px rgba(0,0,0,0.5);';
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '\\u2715';
        closeBtn.style.cssText = 'position:absolute;top:12px;right:12px;z-index:10;background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.1);color:#333;width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;';
        closeBtn.addEventListener('mouseenter', function() { this.style.background='rgba(0,0,0,0.12)'; this.style.color='#000'; });
        closeBtn.addEventListener('mouseleave', function() { this.style.background='rgba(0,0,0,0.06)'; this.style.color='#333'; });
        closeBtn.addEventListener('click', function() { closeLoginModal(); });
        var iframe = document.createElement('iframe');
        iframe.src = 'https://lk.b00m.fun';
        iframe.style.cssText = 'width:100%;height:100%;border:none;';
        modal.appendChild(closeBtn); modal.appendChild(iframe);
        overlay.appendChild(backdrop); overlay.appendChild(modal);
        document.body.appendChild(overlay);
      }
      window.openLoginModal = function() {
        var m = document.getElementById('bb-login-modal');
        if (m) { m.style.display='flex'; document.body.style.overflow='hidden'; }
      };
      function closeLoginModal() {
        var m = document.getElementById('bb-login-modal');
        if (m) { m.style.display='none'; document.body.style.overflow=''; }
      }
      document.addEventListener('keydown', function(e) { if (e.key==='Escape') closeLoginModal(); });

      /* === КНОПКА «Войти» === */
      function setupLoginButton() {
        document.querySelectorAll('.VPSocialLink[aria-label="apply-link"]').forEach(function(btn) {
          if (btn.dataset.loginReady) return;
          btn.dataset.loginReady = 'true';
          btn.removeAttribute('href'); btn.style.cursor = 'pointer';
          btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); window.openLoginModal(); });
        });
      }

      /* === ПЕРЕВОД UI === */
      function translateUI() {
        document.querySelectorAll('.pager-link .desc').forEach(function(el) {
          if (el.textContent.trim()==='Next page') el.textContent='Следующая страница';
          if (el.textContent.trim()==='Previous page') el.textContent='Предыдущая страница';
        });
        document.querySelectorAll('.VPBackToTop span, [class*="back-to-top"]').forEach(function(el) {
          if (el.textContent.trim()==='Return to top') el.textContent='Наверх';
        });
        document.querySelectorAll('.VPLocalNav .menu-text').forEach(function(el) {
          if (el.textContent.trim()==='Menu') el.textContent='Меню';
        });
        document.querySelectorAll('.outline-title').forEach(function(el) {
          if (el.textContent.trim()==='On this page') el.textContent='На этой странице';
          if (el.textContent.trim()==='Table of Contents') el.textContent='Содержание';
        });
      }

      /* === INIT === */
      function init() { createLoginModal(); setupLoginButton(); translateUI(); }
      if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
      else init();
      window.addEventListener('load', init);
      setTimeout(init, 500); setTimeout(init, 1500);
      var lastUrl = location.href;
      new MutationObserver(function() {
        var url = location.href;
        if (url !== lastUrl) { lastUrl = url; document.documentElement.classList.add('dark'); setTimeout(init, 100); setTimeout(init, 500); }
      }).observe(document, { subtree: true, childList: true });
    })();
    `],
  ],

  base: '/boombastic/',
  cleanUrls: true,
  outDir: '.vitepress/dist',
  description: 'Игровые парки для детей и их родителей.',

  themeConfig: {
    logo: '/boombastic-icon-white.svg',
    siteTitle: false,

    notFound: {
      title: 'Страница не найдена',
      quote: 'Похоже, вы зашли не туда. Но не переживайте — даже лучшие навигаторы иногда теряются.',
      linkLabel: 'Вернуться на главную',
      linkText: 'На главную',
      code: '404'
    },

    docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
    darkModeSwitchLabel: 'Тема',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Наверх',
    outlineTitle: 'На этой странице',
    lastUpdatedText: 'Обновлено',

    sidebar: {
      '/about/': [{
        text: 'О парках',
        collapsed: false,
        items: [
          { text: 'Концепция', link: '/about/concept' },
          { text: 'Локации', link: '/about/locations' },
          { text: 'Партнёрам', link: '/about/partners' }
        ]
      }]
    },

    search: {
      provider: 'local',
      options: {
        placeholder: 'Найти приз?',
        translations: {
          button: { buttonText: 'Найти приз?', buttonAriaLabel: 'Поиск' },
          modal: {
            displayDetails: 'Показать подробные результаты',
            resetButtonTitle: 'Сбросить поиск',
            backButtonTitle: 'Закрыть поиск',
            noResultsText: 'Результаты не найдены для',
            footer: { selectText: 'выбрать', navigateText: 'навигация', closeText: 'закрыть' }
          }
        }
      }
    },

    nav: [
      { text: 'Контакт', link: '/contact-us' },
      {
        text: 'О парках',
        items: [
          { text: 'Концепция', link: '/about/concept' },
          { text: 'Локации', link: '/about/locations' },
          { text: 'Партнёрам', link: '/about/partners' }
        ]
      }
    ],

    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.366 1.26 2.18 1.817.616.422 1.084.33 1.084.33l2.178-.03s1.14-.071.599-.972c-.044-.074-.314-.667-1.617-1.886-1.364-1.276-1.181-1.07.462-3.278.999-1.344 1.398-2.164 1.273-2.516-.12-.335-.858-.247-.858-.247l-2.45.015s-.182-.025-.317.056c-.131.079-.216.263-.216.263s-.387 1.03-.903 1.906c-1.089 1.85-1.524 1.948-1.702 1.834-.414-.265-.31-1.066-.31-1.634 0-1.777.27-2.518-.524-2.71-.264-.064-.457-.106-1.13-.113-.864-.009-1.595.003-2.009.205-.276.135-.488.434-.359.451.16.02.52.097.711.358.247.336.238 1.09.238 1.09s.142 2.093-.331 2.352c-.325.178-.77-.185-1.725-1.846-.489-.851-.858-1.792-.858-1.792s-.071-.175-.198-.268c-.154-.113-.369-.149-.369-.149l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.815 4.244 3.87 6.381c1.883 1.96 4.024 1.832 4.024 1.832l.001-.001z"/></svg>'
        },
        link: 'https://vk.com/boombastic_parks',
        ariaLabel: 'vk-link'
      },
      { icon: 'github', link: '/community', ariaLabel: 'login-link' },
      { icon: 'github', link: '#', ariaLabel: 'apply-link' },
    ],
  }
})
