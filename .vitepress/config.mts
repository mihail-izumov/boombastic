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

    // ═══════════════════════════════════════════════════════════════════
    // СКРИПТ: Тёмная тема + футер + модальное окно «Войти»
    // ═══════════════════════════════════════════════════════════════════
    ['script', {}, `
    (function() {
      document.documentElement.classList.add('dark');

      /* ---------- ФУТЕР ---------- */
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
        html += '<div style="color:rgba(255,255,255,0.35);font-size:14px;">Игровые парки для детей и их родителей</div>';
        html += '<div style="color:rgba(255,255,255,0.25);margin-top:4px;font-size:14px;">© БумБастик 2025</div>';
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

      /* ---------- МОДАЛЬНОЕ ОКНО «Войти» ---------- */
      function createLoginModal() {
        if (document.getElementById('bb-login-modal')) return;

        var overlay = document.createElement('div');
        overlay.id = 'bb-login-modal';
        overlay.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;align-items:center;justify-content:center;';

        var backdrop = document.createElement('div');
        backdrop.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,10,30,0.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);cursor:pointer;';
        backdrop.addEventListener('click', function() { closeLoginModal(); });

        var modal = document.createElement('div');
        modal.style.cssText = 'position:relative;width:90%;max-width:480px;height:80vh;max-height:700px;border-radius:16px;overflow:hidden;background:#1c1a3e;box-shadow:0 25px 60px rgba(0,0,0,0.5);border:1px solid rgba(74,90,173,0.25);';

        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = 'position:absolute;top:12px;right:12px;z-index:10;background:rgba(28,26,62,0.8);border:1px solid rgba(74,90,173,0.25);color:white;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;';
        closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(197,249,70,0.15)'; this.style.color = '#C5F946'; });
        closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(28,26,62,0.8)'; this.style.color = 'white'; });
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

      /* ---------- КНОПКА «Войти» — перехват клика ---------- */
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

      /* ---------- INIT ---------- */
      function init() { replaceFooter(); createLoginModal(); setupLoginButton(); }
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
      else { init(); }
      window.addEventListener('load', init);
      setTimeout(init, 1000);
      setTimeout(init, 2000);

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

    // ═══════════════════════════════════════════════════════════════════
    // СТИЛИ
    // ═══════════════════════════════════════════════════════════════════
    ['style', {}, `

    /* ============================================================
       ЦВЕТА: Приглушённый тёмно-синий + лаймовый акцент
       ============================================================ */
    :root {
      --bb-bg: #1c1a3e;
      --bb-bg-card: #222050;
      --bb-blue-1: #4a5aad;
      --bb-blue-2: #3d47a0;
      --bb-blue-3: #6a78c8;
      --bb-lime: #C5F946;
      --bb-lime-dim: #85a931;

      --vp-c-brand-1: #4a5aad;
      --vp-c-brand-2: #C5F946;
      --vp-c-brand-3: #3d47a0;
      --vp-c-brand-soft: rgba(74, 90, 173, 0.14);
      --vp-c-bg: #1c1a3e;
      --vp-c-bg-alt: #19173a;
      --vp-c-bg-elv: #222050;
      --vp-c-bg-mute: rgba(74, 90, 173, 0.06);
      --vp-c-bg-soft: rgba(74, 90, 173, 0.06);
      --vp-c-divider: rgba(74, 90, 173, 0.15);
      --vp-c-gutter: rgba(74, 90, 173, 0.08);
      --vp-c-text-2: rgba(255, 255, 255, 0.45);
    }

    /* 2) Фон — приглушённый */
    html, body, .dark, .VPApp, .Layout, .VPContent, .VPHome, .VPDoc {
      background-color: var(--bb-bg) !important;
    }

    /* СКРЫТЬ APPEARANCE */
    .VPSwitchAppearance, .VPNavScreenAppearance,
    .VPNavBarExtra .appearance, .appearance-action { display: none !important; }

    /* ============================================================
       1) НАВБАР: GLASSMORPHISM
       ============================================================ */
    .VPNavBar,
    .VPNavBar .wrapper,
    .VPNavBar .container,
    .VPNavBar .content-body,
    .VPNavBar .content {
      background: transparent !important;
    }
    .VPNavBar {
      border-bottom: 1px solid rgba(74, 90, 173, 0.1) !important;
      transition: all 0.4s ease !important;
    }

    /* При скролле — стекло. VitePress ставит has-sidebar или меняет bg */
    .VPNavBar.has-sidebar,
    .VPNavBar.fill {
      background: rgba(28, 26, 62, 0.5) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
      border-bottom: 1px solid rgba(74, 90, 173, 0.1) !important;
    }
    /* VitePress также может ставить фон через inline style на .VPNavBar */
    .VPNavBar[style*="background"] {
      background: rgba(28, 26, 62, 0.5) !important;
      backdrop-filter: blur(24px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
    }
    .VPNavBar .divider-line { background: rgba(74, 90, 173, 0.1) !important; }

    /* ЛОГОТИП */
    .VPNavBarTitle .logo { height: 32px !important; width: auto !important; }

    /* ============================================================
       НАВИГАЦИЯ: ПУНКТЫ МЕНЮ
       ============================================================ */
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink { color: rgba(255,255,255,0.85) !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink:hover { color: var(--bb-lime) !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.active { color: var(--bb-lime) !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.has-dropdown { color: rgba(255,255,255,0.85) !important; }
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.has-dropdown:hover { color: var(--bb-lime) !important; }

    /* ============================================================
       3+7) ВЫПАДАЮЩЕЕ МЕНЮ: лаймовый hover, БЕЗ обводки
       ============================================================ */
    .VPMenu {
      background: rgba(28, 26, 62, 0.92) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border: none !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35) !important;
    }
    .VPFlyout .VPMenu {
      background: rgba(28, 26, 62, 0.92) !important;
      border: none !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35) !important;
    }
    .VPMenuGroup .title { color: rgba(255,255,255,0.35) !important; font-size: 12px !important; }
    .VPMenuItem .text { color: rgba(255,255,255,0.8) !important; }
    .VPMenuItem:hover .text { color: var(--bb-lime) !important; }
    .VPMenuItem:hover { background-color: rgba(197, 249, 70, 0.06) !important; }
    .VPMenuItem .text.active, .VPMenuItem.active .text { color: var(--bb-lime) !important; }

    /* ============================================================
       HERO
       ============================================================ */
    .VPHero .name, .VPHero .text, .VPHero .tagline { color: white !important; }
    .VPHero .tagline a { color: var(--bb-lime) !important; text-decoration: none; transition: all 0.3s ease; }
    .VPHero .tagline a:hover { color: var(--bb-blue-3) !important; text-decoration: underline; }
    .VPHero .VPButton {
      background-color: var(--bb-blue-2) !important;
      border-color: var(--bb-blue-2) !important;
      color: white !important;
      transition: all 0.3s ease;
    }
    .VPHero .VPButton:hover {
      background-color: var(--bb-lime) !important;
      border-color: var(--bb-lime) !important;
      color: #1a1840 !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(197, 249, 70, 0.2);
    }

    /* ССЫЛКИ */
    .VPContent a { color: var(--bb-lime); text-decoration: none; border-bottom: 1px solid transparent; transition: all 0.3s ease; }
    .VPContent a:hover { color: var(--bb-blue-3); border-bottom-color: var(--bb-blue-3); }

    /* ============================================================
       5) КАРТОЧКИ: Glassmorphism Border (из документа)
       Два слоя background-image + background-clip
       ============================================================ */
    .VPFeature {
      border: 1px solid transparent !important;
      background-image:
        /* Слой 1: фон карточки (обрезается по padding-box) */
        linear-gradient(145deg, rgba(28,26,62,0.95), rgba(34,32,80,0.9)),
        /* Слой 2: градиент рамки (обрезается по border-box) — эффект светящейся грани */
        linear-gradient(145deg, rgba(255,255,255,0.15), rgba(74,90,173,0.2), rgba(255,255,255,0.05)) !important;
      background-origin: padding-box, border-box !important;
      background-clip: padding-box, border-box !important;
      transition: all 0.35s ease !important;
    }
    .VPFeature .title { color: #C5F946 !important; }
    .VPFeature .details { color: rgba(255,255,255,0.6) !important; }
    .VPFeature .link-text { color: var(--bb-blue-3) !important; transition: color 0.25s; }

    a.VPFeature.link:hover {
      background-image:
        linear-gradient(145deg, rgba(28,26,62,0.9), rgba(40,38,90,0.85)),
        linear-gradient(145deg, rgba(197,249,70,0.35), rgba(74,90,173,0.25), rgba(197,249,70,0.15)) !important;
      background-origin: padding-box, border-box !important;
      background-clip: padding-box, border-box !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    }
    a.VPFeature.link:hover .title,
    a.VPFeature.link:hover .link-text { color: var(--bb-lime) !important; }

    /* ============================================================
       SOCIAL LINKS
       ============================================================ */
    .VPSocialLink .vpi-social-github { display: none !important; }
    .VPSocialLink { width: auto !important; height: auto !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }

    /* Кнопка «Сообщество» */
    .VPSocialLink[aria-label="login-link"]::after {
      content: "Сообщество";
      font-size: 14px; color: rgba(255,255,255,0.85) !important;
      padding: 8px 16px; border-radius: 12px;
      background: rgba(74, 90, 173, 0.15) !important;
      border: 1px solid rgba(74, 90, 173, 0.2) !important;
      transition: all 0.3s ease;
      white-space: nowrap; margin: 0; flex-shrink: 0; font-weight: 600;
    }
    .VPSocialLink[aria-label="login-link"]:hover::after {
      background: rgba(74, 90, 173, 0.25) !important;
      color: var(--bb-lime) !important;
      border-color: rgba(197, 249, 70, 0.15) !important;
    }

    /* 11) Кнопка «Войти» — лаймовая */
    .VPSocialLink[aria-label="apply-link"]::after {
      content: "Войти";
      font-size: 14px; color: #1a1840;
      padding: 8px 16px; border-radius: 12px;
      background-image: linear-gradient(-45deg, #c5f946, #85a931, #c5f946, #85a931);
      background-size: 400% 400%;
      animation: liquid-fluid 6s ease infinite;
      transition: all 0.3s ease;
      white-space: nowrap; margin: 0; flex-shrink: 0; font-weight: 600;
      border: none; cursor: pointer;
    }
    .VPSocialLink[aria-label="apply-link"]:hover::after {
      background-image: linear-gradient(-45deg, #85a931, #c5f946, #85a931, #c5f946);
      color: #1a1840; transform: translateY(-2px);
    }

    @keyframes liquid-fluid {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* 4+8) VK иконка — увеличенная */
    .VPSocialLinks .VPSocialLink[aria-label="vk-link"] {
      width: 38px !important; height: 38px !important;
    }
    .VPSocialLinks .VPSocialLink[aria-label="vk-link"] svg {
      width: 28px !important; height: 28px !important;
    }
    .VPSocialLinks .VPSocialLink svg { fill: rgba(255,255,255,0.6) !important; }
    .VPSocialLinks .VPSocialLink:hover svg { fill: var(--bb-lime) !important; }

    /* ============================================================
       ДЕСКТОП
       ============================================================ */
    @media (min-width: 961px) {
      .VPNavBar .content { gap: 0 !important; }
      .VPNavBarMenu { margin-right: 0 !important; }
      .VPNavBarSocialLinks { min-width: auto !important; justify-content: flex-end !important; gap: 16px !important; margin-left: 0 !important; flex-shrink: 0 !important; }
      .VPSocialLink:not(:last-child) { margin-right: 4px !important; }
    }

    /* ПЛАНШЕТ */
    @media (max-width: 960px) and (min-width: 769px) {
      .VPNavBar .content { gap: 0 !important; }
      .VPNavBarMenu { margin-right: 0 !important; }
      .VPNavBarSocialLinks { margin-left: 4px !important; gap: 12px !important; flex-shrink: 0 !important; }
    }

    /* ============================================================
       МОБИЛЬНОЕ МЕНЮ
       ============================================================ */
    @media (max-width: 768px) {
      .VPNavBar .VPNavBarSocialLinks { display: none !important; }
      .VPNavScreen { overflow-y: auto !important; background: rgba(28, 26, 62, 0.95) !important; }
      .VPNavScreen .VPNavScreenMenu { padding-bottom: 16px !important; }
      .VPNavScreen .VPNavScreenAppearance { display: none !important; }

      .VPNavScreen .VPNavScreenSocialLinks {
        margin: 16px !important; padding: 16px !important;
        border: 1px solid rgba(74, 90, 173, 0.12) !important;
        border-radius: 8px !important;
        background: rgba(74, 90, 173, 0.05) !important;
        display: flex !important; flex-direction: column !important; gap: 12px !important;
      }
      .VPNavScreen .VPSocialLink {
        display: flex !important; align-items: center !important; justify-content: center !important;
        padding: 0 !important; background: transparent !important;
        border: none !important; text-decoration: none !important;
      }
      .VPNavScreen .VPSocialLink:hover { background: transparent !important; }

      .VPNavScreen .VPSocialLink[aria-label="login-link"]::after,
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]::after {
        display: flex !important; align-items: center !important; justify-content: center !important;
        width: 100% !important; box-sizing: border-box !important;
        font-size: 18px !important; font-weight: 600 !important; border-radius: 12px !important;
        padding: 18px !important; margin: 0 !important; height: 52px !important;
      }

      .VPNavScreen .VPSocialLink[aria-label="login-link"]::after {
        content: "Сообщество" !important;
        background: rgba(74, 90, 173, 0.15) !important;
        color: rgba(255,255,255,0.85) !important;
        border: 1px solid rgba(74, 90, 173, 0.2) !important;
      }
      .VPNavScreen .VPSocialLink[aria-label="login-link"]:hover::after {
        background: rgba(74, 90, 173, 0.25) !important; color: #c5f946 !important;
      }
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]::after {
        content: "Войти" !important;
        background-image: linear-gradient(-45deg, #c5f946, #85a931, #c5f946, #85a931);
        background-size: 400% 400%; animation: liquid-fluid 6s ease infinite;
        color: #1a1840 !important; border: none !important;
      }
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]:hover::after {
        background-image: linear-gradient(-45deg, #85a931, #c5f946, #85a931, #c5f946);
        font-weight: 700 !important;
      }

      .footer-row { flex-direction: column !important; gap: 8px !important; }
      .dot-separator { display: none !important; }
    }

    /* ============================================================
       SIDEBAR — приглушённый синий
       ============================================================ */
    .VPSidebar {
      background: rgba(28, 26, 62, 0.95) !important;
      border-right: 1px solid rgba(74, 90, 173, 0.1) !important;
    }
    .VPSidebar .VPSidebarItem .text { color: rgba(255,255,255,0.6) !important; }
    .VPSidebar .VPSidebarItem.is-active .text { color: var(--bb-lime) !important; }
    .VPSidebar .VPSidebarItem .indicator { background: var(--bb-lime) !important; }

    /* OUTLINE (On this page) */
    .VPDocOutlineItem a { color: rgba(255,255,255,0.5) !important; }
    .VPDocOutlineItem a:hover { color: var(--bb-lime) !important; }
    .VPDocOutlineItem a.active { color: var(--bb-lime) !important; }

    /* РАЗДЕЛИТЕЛИ */
    .VPNavBarSocialLinks::before, .VPNavBarSocialLinks .divider,
    .VPNavBar .divider { display: none !important; }

    /* ============================================================
       9) ФУТЕР — синяя гамма
       ============================================================ */
    .VPFooter { background: transparent !important; }
    .custom-footer-links { display: flex; flex-direction: column; gap: 3px; align-items: center; }
    .footer-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
    .footer-row a { color: rgba(74, 90, 173, 0.5); text-decoration: none; transition: color 0.3s ease; }
    .footer-row a:hover { color: var(--bb-lime); }
    .dot-separator { color: rgba(74, 90, 173, 0.25); font-weight: bold; }

    /* VPNavBarExtra */
    .VPNavBarExtra .VPFlyout .VPMenu {
      background: rgba(28, 26, 62, 0.92) !important;
      backdrop-filter: blur(20px) !important; border: none !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.35) !important;
    }

    /* ТАБЛИЦЫ */
    .vp-doc table { border-color: rgba(74, 90, 173, 0.15) !important; }
    .vp-doc tr { border-color: rgba(74, 90, 173, 0.1) !important; }
    .vp-doc th { background: rgba(74, 90, 173, 0.08) !important; color: white !important; }
    .vp-doc td { border-color: rgba(74, 90, 173, 0.1) !important; }

    /* ============================================================
       6) 404 СТРАНИЦА — стиль
       ============================================================ */
    .NotFound {
      background: var(--bb-bg) !important;
    }
    .NotFound .code { color: var(--bb-lime) !important; }
    .NotFound .title { color: white !important; }
    .NotFound .quote { color: rgba(255,255,255,0.5) !important; }
    .NotFound .action .link {
      color: #1a1840 !important;
      background: var(--bb-lime) !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 8px 24px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
    }
    .NotFound .action .link:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(197, 249, 70, 0.25) !important;
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

    // 6) 404 на русском
    notFound: {
      title: 'Страница не найдена',
      quote: 'Похоже, вы зашли не туда. Но не переживайте — даже лучшие навигаторы иногда теряются.',
      linkLabel: 'Вернуться на главную',
      linkText: 'На главную',
      code: '404'
    },

    // 10) Sidebar для раздела «О парках»
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
