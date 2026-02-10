import { defineConfig, DefaultTheme } from 'vitepress'

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

    // ═══════════════════════════════════════════════════════════════════════
    // СКРИПТ
    // ═══════════════════════════════════════════════════════════════════════
    ['script', {}, `
    (function() {
      document.documentElement.classList.add('dark');

      function createFooterContent() {
        var links = [
          { text: '↗ Контакт', href: '/contact-us' },
          { text: 'Телеграм-канал', href: 'https://t.me/boombastic_parks', target: '_blank' }
        ];
        var html = '<hr style="border:0;border-top:1px solid rgba(67,97,238,0.2);margin:24px 0;">';
        html += '<div class="custom-footer-links"><div class="footer-row">';
        links.forEach(function(link, i) {
          if (i > 0) html += '<span class="dot-separator">•</span>';
          html += '<a href="' + link.href + '"' + (link.target ? ' target="' + link.target + '" rel="noopener noreferrer"' : '') + '>' + link.text + '</a>';
        });
        html += '</div></div>';
        html += '<div style="margin-top:24px;text-align:center;">';
        html += '<div style="color:#b3b3b3;font-size:14px;">Игровые парки для детей и их родителей</div>';
        html += '<div style="color:#b3b3b3;margin-top:4px;font-size:14px;">© БумБастик 2025</div>';
        return html;
      }

      function replaceFooter() {
        var footer = document.querySelector('.VPFooter');
        if (!footer) { footer = document.createElement('footer'); footer.className = 'VPFooter'; document.body.appendChild(footer); }
        footer.innerHTML = createFooterContent();
        if (window.location.pathname !== '/') {
          footer.style.position = 'relative'; footer.style.bottom = '70px'; footer.style.zIndex = '10'; footer.style.marginBottom = '-70px';
        } else {
          footer.style.position = ''; footer.style.bottom = ''; footer.style.zIndex = ''; footer.style.paddingBottom = '30px';
        }
      }

      function updateApplyLinkTarget() {
        var applyLinks = document.querySelectorAll('.VPSocialLink[aria-label="apply-link"]');
        applyLinks.forEach(function(applyLink) {
          applyLink.href = '/run-prkx'; applyLink.setAttribute('target', '_self'); applyLink.removeAttribute('rel');
          var newLink = document.createElement('a');
          newLink.href = '/run-prkx'; newLink.className = applyLink.className;
          newLink.setAttribute('aria-label', 'apply-link'); newLink.setAttribute('target', '_self');
          Array.from(applyLink.attributes).forEach(function(attr) {
            if (attr.name !== 'href' && attr.name !== 'target' && attr.name !== 'rel') newLink.setAttribute(attr.name, attr.value);
          });
          applyLink.parentNode.replaceChild(newLink, applyLink);
        });
      }

      function init() { replaceFooter(); updateApplyLinkTarget(); }
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
      window.addEventListener('load', init);
      setTimeout(init, 1000); setTimeout(init, 2000);

      var lastUrl = location.href;
      new MutationObserver(function() {
        var url = location.href;
        if (url !== lastUrl) { lastUrl = url; document.documentElement.classList.add('dark'); setTimeout(init, 100); }
      }).observe(document, { subtree: true, childList: true });
    })();
    `],

    // ═══════════════════════════════════════════════════════════════════════
    // СТИЛИ: Deep Blue + Lime
    // ═══════════════════════════════════════════════════════════════════════
    ['style', {}, `

    /* ============================================================
       ЦВЕТА: Глубокий синий + лаймовый акцент
       ============================================================ */
    :root {
      --bb-bg-deep: #292562;
      --bb-bg-card: #1e1b4b;
      --bb-blue-1: #4361ee;
      --bb-blue-2: #3b4cc0;
      --bb-blue-3: #5a72f5;
      --bb-lime: #C5F946;
      --bb-lime-dim: #85a931;

      --vp-c-brand-1: #4361ee;
      --vp-c-brand-2: #C5F946;
      --vp-c-brand-3: #3b4cc0;
      --vp-c-brand-soft: rgba(67, 97, 238, 0.14);
      --vp-c-bg: #292562;
      --vp-c-bg-alt: #211e54;
      --vp-c-bg-elv: #1e1b4b;
      --vp-c-bg-mute: rgba(67, 97, 238, 0.1);
      --vp-c-bg-soft: rgba(67, 97, 238, 0.1);
      --vp-c-divider: rgba(67, 97, 238, 0.2);
      --vp-c-gutter: rgba(67, 97, 238, 0.1);
      --vp-c-text-2: #b3b3b3;
    }

    /* Принудительный фон страницы — глубокий синий */
    html, body,
    .dark,
    .VPApp,
    .Layout,
    .VPContent,
    .VPHome,
    .VPDoc { background-color: var(--bb-bg-deep) !important; }

    /* ============================================================
       СКРЫТЬ APPEARANCE ВЕЗДЕ
       ============================================================ */
    .VPSwitchAppearance,
    .VPNavScreenAppearance,
    .VPNavBarExtra .appearance,
    .appearance-action { display: none !important; }

    /* ============================================================
       НАВБАР: СТЕКЛЯННЫЙ ЭФФЕКТ (Glassmorphism)
       ============================================================ */
    .VPNavBar {
      background: transparent !important;
      border-bottom: 1px solid rgba(67, 97, 238, 0.15) !important;
      transition: background 0.3s ease, backdrop-filter 0.3s ease !important;
    }

    /* При прокрутке — размытое стекло */
    .VPNavBar.has-sidebar,
    .VPNavBar.fill,
    .VPNavBar[style*="background"] {
      background: rgba(41, 37, 98, 0.65) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border-bottom: 1px solid rgba(67, 97, 238, 0.15) !important;
    }

    /* Контейнер навбара тоже прозрачный */
    .VPNavBar .wrapper,
    .VPNavBar .container,
    .VPNavBar .content-body {
      background: transparent !important;
    }

    /* Дополнительный селектор: VitePress добавляет фон через divider */
    .VPNavBar .divider-line { background: rgba(67, 97, 238, 0.15) !important; }

    /* ============================================================
       ЛОГОТИП
       ============================================================ */
    .VPNavBarTitle .logo { height: 32px !important; width: auto !important; }

    /* ============================================================
       НАВИГАЦИЯ: ПУНКТЫ МЕНЮ
       ============================================================ */
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink { color: white !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink:hover { color: var(--bb-lime) !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.active { color: var(--bb-lime) !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.has-dropdown { color: white !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.has-dropdown:hover { color: var(--bb-lime) !important; }

    /* ============================================================
       ВЫПАДАЮЩЕЕ МЕНЮ: Лаймовый UX
       ============================================================ */
    .VPMenu {
      background: rgba(30, 27, 75, 0.95) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(197, 249, 70, 0.15) !important;
    }
    .VPMenuGroup .title { color: var(--bb-lime) !important; }
    .VPMenuItem .text { color: rgba(255, 255, 255, 0.85) !important; }
    .VPMenuItem:hover .text { color: var(--bb-lime) !important; }
    .VPMenuItem:hover { background-color: rgba(197, 249, 70, 0.08) !important; }
    .VPMenuItem .text.active,
    .VPMenuItem.active .text { color: var(--bb-lime) !important; }

    /* Flyout (выпадающий контейнер) */
    .VPFlyout .VPMenu {
      background: rgba(30, 27, 75, 0.95) !important;
      border: 1px solid rgba(197, 249, 70, 0.15) !important;
    }

    /* ============================================================
       HERO СЕКЦИЯ
       ============================================================ */
    .VPHero .name, .VPHero .text, .VPHero .tagline { color: white !important; }
    .VPHero .tagline a { color: var(--bb-lime) !important; text-decoration: none; transition: all 0.3s ease; }
    .VPHero .tagline a:hover { color: var(--bb-blue-3) !important; text-decoration: underline; }
    .VPHero .VPButton {
      background-color: var(--bb-blue-2) !important;
      border-color: var(--bb-blue-2) !important;
      color: white !important;
      transition: all 0.3s ease;
      text-decoration: none !important;
    }
    .VPHero .VPButton:hover {
      background-color: var(--bb-lime) !important;
      border-color: var(--bb-lime) !important;
      color: #1a1744 !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(197, 249, 70, 0.3);
      text-decoration: none !important;
    }

    /* ============================================================
       ССЫЛКИ В КОНТЕНТЕ
       ============================================================ */
    .VPContent a { color: var(--bb-lime); text-decoration: none; border-bottom: 1px solid transparent; transition: all 0.3s ease; }
    .VPContent a:hover { color: var(--bb-blue-3); border-bottom-color: var(--bb-blue-3); }

    /* ============================================================
       КАРТОЧКИ (FEATURES): Градиентный фон как в Сигнале
       ============================================================ */
    .VPFeature {
      background: linear-gradient(145deg, rgba(30, 27, 75, 0.9) 0%, rgba(67, 97, 238, 0.25) 50%, rgba(123, 47, 247, 0.15) 100%) !important;
      border: 1px solid rgba(197, 249, 70, 0.15) !important;
      transition: all 0.3s ease !important;
    }
    .VPFeature .title { color: #C5F946 !important; transition: color 0.25s ease-in-out; }
    .VPFeature .details { color: rgba(255, 255, 255, 0.7) !important; }
    .VPFeature .link-text { color: var(--bb-blue-3) !important; transition: color 0.25s ease-in-out; }
    .VPFeature .link-text .icon { fill: var(--bb-blue-3) !important; }
    a.VPFeature.link:hover {
      background: linear-gradient(145deg, rgba(30, 27, 75, 0.95) 0%, rgba(67, 97, 238, 0.35) 50%, rgba(123, 47, 247, 0.25) 100%) !important;
      border-color: rgba(197, 249, 70, 0.35) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(67, 97, 238, 0.2);
    }
    a.VPFeature.link:hover .title,
    a.VPFeature.link:hover .link-text { color: var(--bb-lime) !important; }

    /* ============================================================
       SOCIAL LINKS: СКРЫВАЕМ GITHUB ИКОНКИ
       ============================================================ */
    .VPSocialLink .vpi-social-github { display: none !important; }
    .VPSocialLink { width: auto !important; height: auto !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }

    /* Кнопка «Сообщество» — тёмно-синяя */
    .VPSocialLink[aria-label="login-link"]::after {
      content: "Сообщество";
      font-size: 14px;
      color: #f0f0f0 !important;
      padding: 8px 16px;
      border: none !important;
      border-radius: 12px;
      background: rgba(67, 97, 238, 0.25) !important;
      border: 1px solid rgba(67, 97, 238, 0.3) !important;
      transition: all 0.3s ease;
      white-space: nowrap;
      margin: 0;
      flex-shrink: 0;
      font-weight: 600;
    }
    .VPSocialLink[aria-label="login-link"]:hover::after {
      background: rgba(67, 97, 238, 0.4) !important;
      color: var(--bb-lime) !important;
      border-color: rgba(197, 249, 70, 0.3) !important;
    }

    /* Кнопка «Поддержать» — лаймовая с анимацией */
    .VPSocialLink[aria-label="apply-link"]::after {
      content: "Поддержать";
      font-size: 14px;
      color: #1a1744;
      padding: 8px 16px;
      border-radius: 12px;
      background-image: linear-gradient(-45deg, #c5f946, #85a931, #c5f946, #85a931);
      background-size: 400% 400%;
      animation: liquid-fluid 6s ease infinite;
      transition: all 0.3s ease;
      white-space: nowrap;
      margin: 0;
      flex-shrink: 0;
      font-weight: 600;
      border: none;
    }
    .VPSocialLink[aria-label="apply-link"]:hover::after {
      background-image: linear-gradient(-45deg, #85a931, #c5f946, #85a931, #c5f946);
      color: #1a1744;
      transform: translateY(-2px);
    }

    @keyframes liquid-fluid {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* SVG иконки (Telegram и др.) */
    .VPSocialLinks .VPSocialLink svg { fill: white !important; }
    .VPSocialLinks .VPSocialLink:hover svg { fill: var(--bb-lime) !important; }

    /* ============================================================
       ДЕСКТОП НАВБАР: КОМПОНОВКА
       ============================================================ */
    @media (min-width: 961px) {
      .VPNavBar .content { gap: 0 !important; }
      .VPNavBarMenu { margin-right: 0 !important; }
      .VPNavBarSocialLinks { min-width: auto !important; justify-content: flex-end !important; gap: 16px !important; margin-left: 0 !important; flex-shrink: 0 !important; }
      .VPSocialLink:not(:last-child) { margin-right: 4px !important; }
    }

    /* ============================================================
       ПЛАНШЕТ
       ============================================================ */
    @media (max-width: 960px) and (min-width: 769px) {
      .VPNavBar .content { gap: 0 !important; }
      .VPNavBarMenu { margin-right: 0 !important; }
      .VPNavBarSocialLinks { margin-left: 4px !important; gap: 12px !important; flex-shrink: 0 !important; }
      .VPSocialLink:not(:last-child) { margin-right: 2px !important; }
    }

    /* ============================================================
       МОБИЛЬНОЕ МЕНЮ
       ============================================================ */
    @media (max-width: 768px) {
      .VPNavBar .VPNavBarSocialLinks { display: none !important; }
      .VPNavScreen { overflow-y: auto !important; background: rgba(41, 37, 98, 0.95) !important; }
      .VPNavScreen .VPNavScreenMenu { padding-bottom: 16px !important; }

      .VPNavScreen .VPNavScreenSocialLinks {
        margin: 16px !important;
        padding: 16px !important;
        border: 1px solid rgba(67, 97, 238, 0.2) !important;
        border-radius: 8px !important;
        background: rgba(67, 97, 238, 0.08) !important;
      }
      .VPNavScreen .VPNavScreenAppearance { display: none !important; }

      .VPNavScreen .VPNavScreenSocialLinks {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
      }
      .VPNavScreen .VPSocialLink {
        display: flex !important; align-items: center !important; justify-content: center !important;
        padding: 0 !important; background: transparent !important; border-radius: 0 !important;
        border: none !important; transition: all 0.3s ease !important; text-decoration: none !important;
      }
      .VPNavScreen .VPSocialLink:hover { background: transparent !important; border-color: transparent !important; }

      .VPNavScreen .VPSocialLink[aria-label="login-link"]::after,
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]::after {
        display: flex !important; align-items: center !important; justify-content: center !important;
        width: 100% !important; min-width: 0 !important; box-sizing: border-box !important;
        font-size: 18px !important; font-weight: 600 !important; border-radius: 12px !important;
        padding: 18px !important; margin: 0 !important; height: 52px !important; min-height: 52px !important;
      }

      .VPNavScreen .VPSocialLink[aria-label="login-link"]::after {
        content: "Сообщество" !important;
        background: rgba(67, 97, 238, 0.25) !important;
        color: #f0f0f0 !important;
        border: 1px solid rgba(67, 97, 238, 0.3) !important;
        transition: background 0.2s, color 0.2s !important;
      }
      .VPNavScreen .VPSocialLink[aria-label="login-link"]:hover::after {
        background: rgba(67, 97, 238, 0.4) !important;
        color: #c5f946 !important;
      }

      .VPNavScreen .VPSocialLink[aria-label="apply-link"]::after {
        content: "Поддержать" !important;
        background-image: linear-gradient(-45deg, #c5f946, #85a931, #c5f946, #85a931);
        background-size: 400% 400%;
        animation: liquid-fluid 6s ease infinite;
        color: #1a1744 !important;
        border: none !important;
        transition: all 0.2s !important;
      }
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]:hover::after {
        background-image: linear-gradient(-45deg, #85a931, #c5f946, #85a931, #c5f946);
        color: #1a1744 !important; font-weight: 700 !important;
      }

      .VPNavScreen .VPSocialLink[aria-label="telegram"] {
        width: auto !important; height: auto !important; justify-content: center !important;
      }

      .footer-row { flex-direction: column !important; gap: 8px !important; }
      .dot-separator { display: none !important; }
    }

    /* ============================================================
       SIDEBAR — синяя гамма
       ============================================================ */
    .VPSidebar { background: rgba(30, 27, 75, 0.95) !important; border-right: 1px solid rgba(67, 97, 238, 0.15) !important; }
    .VPSidebar .VPSidebarItem .text { color: rgba(255, 255, 255, 0.8) !important; }
    .VPSidebar .VPSidebarItem.is-active .text { color: var(--bb-lime) !important; }

    /* ============================================================
       УБРАТЬ РАЗДЕЛИТЕЛИ В НАВБАРЕ
       ============================================================ */
    .VPNavBarSocialLinks::before,
    .VPNavBarSocialLinks .divider,
    .VPNavBar .divider { display: none !important; }

    /* ============================================================
       ФУТЕР
       ============================================================ */
    .custom-footer-links { display: flex; flex-direction: column; gap: 3px; align-items: center; }
    .footer-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
    .footer-row a { color: #b3b3b3; text-decoration: none; transition: color 0.3s ease; }
    .footer-row a:hover { color: var(--bb-lime); }
    .dot-separator { color: rgba(255,255,255,0.3); font-weight: bold; }
    .VPFooter { background: transparent !important; }
    .VPFooter .copyright { margin-top: 2px !important; }

    /* ============================================================
       VPNavBarExtra (троеточие) — тоже стекло
       ============================================================ */
    .VPNavBarExtra .VPFlyout .VPMenu {
      background: rgba(30, 27, 75, 0.95) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(67, 97, 238, 0.2) !important;
    }
    `]
  ],

  base: '/boombastic/',
  cleanUrls: true,
  outDir: '.vitepress/dist',
  description: 'Игровые парки для детей и их родителей.',

  themeConfig: {
    logo: '/prkx-favicon.png',
    siteTitle: 'БумБастик',

    sidebar: {},

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
      { icon: 'github', link: '/run-prkx', ariaLabel: 'apply-link' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
        },
        link: 'https://t.me/boombastic_parks',
        ariaLabel: 'telegram'
      }
    ],
  }
})
