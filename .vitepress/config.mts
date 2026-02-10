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
    ['link', { rel: 'icon', type: 'image/png', href: 'public/prkx-icon.png' }],
    ['link', { rel: 'shortcut icon', href: '/prkx-icon.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],

    // ═══════════════════════════════════════════════════════════════════
    // JS: Тёмная тема, навбар при скролле, футер, модал «Войти»,
    //     перевод UI элементов на русский
    // ═══════════════════════════════════════════════════════════════════
    ['script', {}, `
    (function() {
      document.documentElement.classList.add('dark');

      /* === 4) НАВБАР: добавляем класс bb-scrolled при скролле === */
      function handleNavbarScroll() {
        var navbar = document.querySelector('.VPNavBar');
        if (!navbar) return;
        function onScroll() {
          if (window.scrollY > 10) {
            navbar.classList.add('bb-scrolled');
          } else {
            navbar.classList.remove('bb-scrolled');
          }
        }
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }

      /* === ФУТЕР === */
      function createFooterContent() {
        var links = [
          { text: '↗ Контакт', href: '/contact-us' },
          { text: 'ВКонтакте', href: 'https://vk.com/boombastic_parks', target: '_blank' }
        ];
        var html = '<hr style="border:0;border-top:1px solid rgba(74,90,173,0.15);margin:24px 0;">';
        html += '<div class="custom-footer-links"><div class="footer-row">';
        links.forEach(function(link, i) {
          if (i > 0) html += '<span class="dot-separator">•</span>';
          html += '<a href="' + link.href + '"' + (link.target ? ' target="' + link.target + '" rel="noopener noreferrer"' : '') + '>' + link.text + '</a>';
        });
        html += '</div></div>';
        html += '<div style="margin-top:24px;text-align:center;">';
        html += '<div style="color:#5a68b8;font-size:14px;">Игровые парки для детей и их родителей</div>';
        html += '<div style="color:#4a5aad;margin-top:4px;font-size:14px;">© БумБастик 2025</div>';
        return html;
      }

      function replaceFooter() {
        var footer = document.querySelector('.VPFooter');
        if (!footer) { footer = document.createElement('footer'); footer.className = 'VPFooter'; document.body.appendChild(footer); }
        footer.innerHTML = createFooterContent();
        if (window.location.pathname !== '/') {
          footer.style.position = 'relative'; footer.style.bottom = '70px';
          footer.style.zIndex = '10'; footer.style.marginBottom = '-70px';
        } else {
          footer.style.position = ''; footer.style.bottom = '';
          footer.style.zIndex = ''; footer.style.paddingBottom = '30px';
        }
      }

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

        /* 10) Кнопка закрытия — тёмная на светлом фоне */
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = 'position:absolute;top:12px;right:12px;z-index:10;background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.1);color:#333;width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;';
        closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(0,0,0,0.12)'; this.style.color = '#000'; });
        closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(0,0,0,0.06)'; this.style.color = '#333'; });
        closeBtn.addEventListener('click', function() { closeLoginModal(); });

        var iframe = document.createElement('iframe');
        iframe.src = 'https://lk.b00m.fun';
        iframe.style.cssText = 'width:100%;height:100%;border:none;';

        modal.appendChild(closeBtn);
        modal.appendChild(iframe);
        overlay.appendChild(backdrop);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
      }

      window.openLoginModal = function() {
        var m = document.getElementById('bb-login-modal');
        if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
      };
      function closeLoginModal() {
        var m = document.getElementById('bb-login-modal');
        if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
      }
      document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLoginModal(); });

      /* === КНОПКА «Войти» — перехват клика === */
      function setupLoginButton() {
        var btns = document.querySelectorAll('.VPSocialLink[aria-label="apply-link"]');
        btns.forEach(function(btn) {
          if (btn.dataset.loginReady) return;
          btn.dataset.loginReady = 'true';
          btn.removeAttribute('href');
          btn.style.cursor = 'pointer';
          btn.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            window.openLoginModal();
          });
        });
      }

      /* === 6) ПЕРЕВОД UI НА РУССКИЙ === */
      function translateUI() {
        /* Next page / Previous page */
        document.querySelectorAll('.pager-link .desc').forEach(function(el) {
          if (el.textContent.trim() === 'Next page') el.textContent = 'Следующая страница';
          if (el.textContent.trim() === 'Previous page') el.textContent = 'Предыдущая страница';
        });
        /* Return to top */
        document.querySelectorAll('.VPBackToTop span, [class*="back-to-top"]').forEach(function(el) {
          if (el.textContent.trim() === 'Return to top') el.textContent = 'Наверх';
        });
        /* Menu */
        document.querySelectorAll('.VPLocalNav .menu-text, .VPNavBarHamburger + span').forEach(function(el) {
          if (el.textContent.trim() === 'Menu') el.textContent = 'Меню';
        });
        /* On this page */
        document.querySelectorAll('.VPDocOutlineDropdown button span, .VPDocAsideOutline .content .outline-title').forEach(function(el) {
          if (el.textContent.trim() === 'On this page') el.textContent = 'На этой странице';
        });
        /* Table of Contents */
        document.querySelectorAll('.outline-title').forEach(function(el) {
          if (el.textContent.trim() === 'On this page') el.textContent = 'На этой странице';
          if (el.textContent.trim() === 'Table of Contents') el.textContent = 'Содержание';
        });
        /* Sidebar toggle */
        document.querySelectorAll('.VPLocalNav .VPLocalNavOutlineDropdown button span').forEach(function(el) {
          if (el.textContent.trim() === 'On this page') el.textContent = 'На этой странице';
        });
      }

      /* === INIT === */
      function init() {
        handleNavbarScroll();
        replaceFooter();
        createLoginModal();
        setupLoginButton();
        translateUI();
      }
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
      else { init(); }
      window.addEventListener('load', init);
      setTimeout(init, 500);
      setTimeout(init, 1500);

      var lastUrl = location.href;
      new MutationObserver(function() {
        var url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          document.documentElement.classList.add('dark');
          setTimeout(init, 100);
          setTimeout(init, 500);
        }
      }).observe(document, { subtree: true, childList: true });
    })();
    `],
  ],

  base: '/boombastic/',
  cleanUrls: true,
  outDir: '.vitepress/dist',
  description: 'Игровые парки для детей и их родителей.',

  themeConfig: {
    logo: '/prkx-favicon.png',
    siteTitle: 'БумБастик',

    // 6) 404 на русском
    notFound: {
      title: 'Страница не найдена',
      quote: 'Похоже, вы зашли не туда. Но не переживайте — даже лучшие навигаторы иногда теряются.',
      linkLabel: 'Вернуться на главную',
      linkText: 'На главную',
      code: '404'
    },

    // 6) Перевод навигации
    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница'
    },
    darkModeSwitchLabel: 'Тема',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Наверх',
    outlineTitle: 'На этой странице',
    lastUpdatedText: 'Обновлено',

    // Sidebar для «О парках»
    sidebar: {
      '/about/': [
        {
          text: 'О парках',
          collapsed: false,
          items: [
            { text: 'Концепция', link: '/about/concept' },
            { text: 'Локации', link: '/about/locations' },
            { text: 'Партнёрам', link: '/about/partners' }
          ]
        }
      ]
    },

    search: {
      provider: 'local',
      options: {
        placeholder: 'Поиск…',
        translations: {
          button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
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
      { icon: 'github', link: '/community', ariaLabel: 'login-link' },
      { icon: 'github', link: '#', ariaLabel: 'apply-link' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.366 1.26 2.18 1.817.616.422 1.084.33 1.084.33l2.178-.03s1.14-.071.599-.972c-.044-.074-.314-.667-1.617-1.886-1.364-1.276-1.181-1.07.462-3.278.999-1.344 1.398-2.164 1.273-2.516-.12-.335-.858-.247-.858-.247l-2.45.015s-.182-.025-.317.056c-.131.079-.216.263-.216.263s-.387 1.03-.903 1.906c-1.089 1.85-1.524 1.948-1.702 1.834-.414-.265-.31-1.066-.31-1.634 0-1.777.27-2.518-.524-2.71-.264-.064-.457-.106-1.13-.113-.864-.009-1.595.003-2.009.205-.276.135-.488.434-.359.451.16.02.52.097.711.358.247.336.238 1.09.238 1.09s.142 2.093-.331 2.352c-.325.178-.77-.185-1.725-1.846-.489-.851-.858-1.792-.858-1.792s-.071-.175-.198-.268c-.154-.113-.369-.149-.369-.149l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.815 4.244 3.87 6.381c1.883 1.96 4.024 1.832 4.024 1.832l.001-.001z"/></svg>'
        },
        link: 'https://vk.com/boombastic_parks',
        ariaLabel: 'vk-link'
      }
    ],
  }
})
