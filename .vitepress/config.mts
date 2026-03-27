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
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/shark-eyes-icon-electric.svg' }],
    ['link', { rel: 'shortcut icon', href: '/shark-eyes-icon-electric.svg' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],

    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;900&family=Space+Mono:wght@400;700&display=swap' }],

    /* CSS для страницы 404: средняя жирность + обычное межбуквенное расстояние */
    ['style', {}, `
      .NotFound .title,
      .not-found .title,
      [class*="NotFound"] h1,
      [class*="not-found"] h1 {
        font-weight: 500 !important;
        letter-spacing: normal !important;
      }
    `],

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

      /* === МОДАЛЬНОЕ ОКНО «Игровой режим» === */
      function createGameModeModal() {
        if (document.getElementById('bb-gamemode-modal')) return;
        var overlay = document.createElement('div');
        overlay.id = 'bb-gamemode-modal';
        overlay.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;align-items:center;justify-content:center;';
        var backdrop = document.createElement('div');
        backdrop.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,10,30,0.75);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);cursor:pointer;';
        backdrop.addEventListener('click', function() { closeGameModeModal(); });
        var modal = document.createElement('div');
        modal.style.cssText = 'position:relative;width:90%;max-width:400px;border-radius:16px;overflow:hidden;background:linear-gradient(165deg,#222050,#1c1a3e);border:1.5px solid rgba(0,212,255,0.25);box-shadow:0 25px 60px rgba(0,0,0,0.5),0 0 40px rgba(0,212,255,0.08);padding:36px 28px 32px;';
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '\\u2715';
        closeBtn.style.cssText = 'position:absolute;top:12px;right:12px;z-index:10;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;';
        closeBtn.addEventListener('mouseenter', function() { this.style.background='rgba(255,255,255,0.12)'; this.style.color='#fff'; });
        closeBtn.addEventListener('mouseleave', function() { this.style.background='rgba(255,255,255,0.06)'; this.style.color='rgba(255,255,255,0.5)'; });
        closeBtn.addEventListener('click', function() { closeGameModeModal(); });

        var title = document.createElement('div');
        title.textContent = 'ИГРОВОЙ РЕЖИМ';
        title.style.cssText = "font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:#00D4FF;letter-spacing:0.12em;text-align:center;margin-bottom:8px;";

        var subtitle = document.createElement('div');
        subtitle.textContent = 'Победи сегодня!';
        subtitle.style.cssText = "font-family:'Montserrat',sans-serif;font-size:22px;font-weight:700;color:#F0F4FF;text-align:center;margin-bottom:28px;";

        var btns = document.createElement('div');
        btns.style.cssText = 'display:flex;flex-direction:column;gap:12px;';

        /* Хелпер: кнопка-ссылка с подсказкой */
        function makeLinkBtn(label, hint, color, href) {
          var b = document.createElement('a');
          b.href = href;
          b.style.cssText = "display:block;width:100%;padding:14px 20px;border-radius:10px;border:1.5px solid " + color + "40;background:" + color + "0d;cursor:pointer;transition:all 0.25s;text-align:center;text-decoration:none;box-sizing:border-box;";
          var labelEl = document.createElement('div');
          labelEl.textContent = label;
          labelEl.style.cssText = "font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:" + color + ";line-height:1.4;";
          b.appendChild(labelEl);
          if (hint) {
            var hintEl = document.createElement('div');
            hintEl.textContent = hint;
            hintEl.style.cssText = "font-family:'Inter',sans-serif;font-size:12px;font-weight:400;color:rgba(255,255,255,0.4);margin-top:4px;line-height:1.3;";
            b.appendChild(hintEl);
          }
          b.addEventListener('mouseenter', function() { this.style.background=color+'22'; this.style.borderColor=color+'80'; });
          b.addEventListener('mouseleave', function() { this.style.background=color+'0d'; this.style.borderColor=color+'40'; });
          b.addEventListener('click', function() { closeGameModeModal(); });
          return b;
        }

        btns.appendChild(makeLinkBtn('Зарядить карту', 'Онлайн-оплата с выгодой до 60%', '#C5F946', '/charge'));
        btns.appendChild(makeLinkBtn('Игровой статус', 'Узнать уровень = получить больше игр', '#00D4FF', '/rewards'));

        /* --- Призотека (раскрывающаяся) --- */
        var prizOpen = false;

        var prizWrap = document.createElement('div');
        prizWrap.style.cssText = 'display:flex;flex-direction:column;gap:0;border-radius:10px;border:1.5px solid #FF008040;background:#FF00800d;transition:all 0.25s;overflow:hidden;';

        var prizBtn = document.createElement('button');
        prizBtn.style.cssText = "width:100%;padding:14px 20px;border:none;background:transparent;cursor:pointer;transition:background 0.2s;text-align:center;";
        var prizLabel = document.createElement('div');
        prizLabel.style.cssText = "font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:#FF0080;line-height:1.4;display:inline-flex;align-items:center;gap:8px;justify-content:center;transition:opacity 0.2s ease;pointer-events:none;";
        var prizText = document.createTextNode('Призотека');
        prizLabel.appendChild(prizText);
        var prizArrow = document.createElement('span');
        prizArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF0080" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.25s ease;display:block;"><path d="m6 9 6 6 6-6"/></svg>';
        prizArrow.style.cssText = 'display:inline-flex;align-items:center;opacity:0.7;';
        prizLabel.appendChild(prizArrow);
        prizBtn.appendChild(prizLabel);

        prizBtn.addEventListener('mouseenter', function() {
          if (prizOpen) { prizLabel.style.opacity = '0.8'; }
          else { prizBtn.style.background = 'rgba(255,0,128,0.08)'; }
        });
        prizBtn.addEventListener('mouseleave', function() {
          if (prizOpen) { prizLabel.style.opacity = '0.4'; }
          else { prizBtn.style.background = 'transparent'; }
        });

        var prizSub = document.createElement('div');
        prizSub.style.cssText = 'display:none;flex-direction:row;gap:8px;padding:0 12px 12px 12px;';

        function makePrizSubBtn(label, href) {
          var a = document.createElement('a');
          a.href = href;
          a.textContent = label;
          a.style.cssText = "flex:1;display:flex;align-items:center;justify-content:center;padding:11px 10px;border-radius:8px;border:1px solid rgba(255,0,128,0.2);background:rgba(255,0,128,0.06);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#FF0080;text-decoration:none;transition:all 0.2s;cursor:pointer;";
          a.addEventListener('mouseenter', function() { this.style.background='rgba(255,0,128,0.2)'; this.style.borderColor='rgba(255,0,128,0.5)'; });
          a.addEventListener('mouseleave', function() { this.style.background='rgba(255,0,128,0.06)'; this.style.borderColor='rgba(255,0,128,0.2)'; });
          a.addEventListener('click', function() { closeGameModeModal(); });
          return a;
        }

        prizSub.appendChild(makePrizSubBtn('Питерлэнд', '/prizes/piterland'));
        prizSub.appendChild(makePrizSubBtn('Охта Молл', '/prizes/ohtamall'));

        prizBtn.addEventListener('click', function() {
          prizOpen = !prizOpen;
          prizSub.style.display = prizOpen ? 'flex' : 'none';
          var svg = prizArrow.querySelector('svg');
          if (svg) svg.style.transform = prizOpen ? 'rotate(180deg)' : 'rotate(0deg)';
          if (prizOpen) {
            prizWrap.style.borderColor = '#FF008060';
            prizWrap.style.background = '#FF008015';
            prizLabel.style.opacity = '0.4';
            prizBtn.style.background = 'transparent';
          } else {
            prizWrap.style.borderColor = '#FF008040';
            prizWrap.style.background = '#FF00800d';
            prizLabel.style.opacity = '1';
            prizBtn.style.background = 'transparent';
          }
        });

        prizWrap.appendChild(prizBtn);
        prizWrap.appendChild(prizSub);
        btns.appendChild(prizWrap);

        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(subtitle);
        modal.appendChild(btns);
        overlay.appendChild(backdrop); overlay.appendChild(modal);
        document.body.appendChild(overlay);
      }
      window.openGameModeModal = function() {
        var m = document.getElementById('bb-gamemode-modal');
        if (m) { m.style.display='flex'; document.body.style.overflow='hidden'; }
      };
      function closeGameModeModal() {
        var m = document.getElementById('bb-gamemode-modal');
        if (m) { m.style.display='none'; document.body.style.overflow=''; }
      }

      document.addEventListener('keydown', function(e) {
        if (e.key==='Escape') { closeLoginModal(); closeGameModeModal(); }
      });

      /* === КНОПКИ НАВИГАЦИИ === */
      function setupNavButtons() {
        document.querySelectorAll('.VPSocialLink[aria-label="apply-link"]').forEach(function(btn) {
          if (btn.dataset.loginReady) return;
          btn.dataset.loginReady = 'true';
          btn.removeAttribute('href'); btn.style.cursor = 'pointer';
          btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); window.openLoginModal(); });
        });
        document.querySelectorAll('.VPSocialLink[aria-label="gamemode-link"]').forEach(function(btn) {
          if (btn.dataset.gamemodeReady) return;
          btn.dataset.gamemodeReady = 'true';
          btn.removeAttribute('href'); btn.style.cursor = 'pointer';
          btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); window.openGameModeModal(); });
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
      function init() { createLoginModal(); createGameModeModal(); setupNavButtons(); translateUI(); }
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

  base: '/',
  cleanUrls: true,
  outDir: '.vitepress/dist',
  description: 'Игровые парки для детей и их родителей.',

  themeConfig: {
    logo: '/boombastic-icon-white.svg',
    siteTitle: false,

    notFound: {
      title: 'Страница не найдена',
      quote: 'Похоже, ты зашел не туда. Но не переживай — даже лучшие игроки иногда теряются.',
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

    nav: [
      {
        text: 'Призотека',
        items: [
          { text: 'Старт', link: '/prizes' },
          { text: 'Питерлэнд', link: '/prizes/piterland' },
          { text: 'Охта Молл', link: '/prizes/ohtamall' }
        ]
      },
      { text: 'Парки', link: '/parks' },
      { text: 'Зарядка', link: '/charge' },
      { text: 'Статусы', link: '/rewards' }
    ],

    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.366 1.26 2.18 1.817.616.422 1.084.33 1.084.33l2.178-.03s1.14-.071.599-.972c-.044-.074-.314-.667-1.617-1.886-1.364-1.276-1.181-1.07.462-3.278.999-1.344 1.398-2.164 1.273-2.516-.12-.335-.858-.247-.858-.247l-2.45.015s-.182-.025-.317.056c-.131.079-.216.263-.216.263s-.387 1.03-.903 1.906c-1.089 1.85-1.524 1.948-1.702 1.834-.414-.265-.31-1.066-.31-1.634 0-1.777.27-2.518-.524-2.71-.264-.064-.457-.106-1.13-.113-.864-.009-1.595.003-2.009.205-.276.135-.488.434-.359.451.16.02.52.097.711.358.247.336.238 1.09.238 1.09s.142 2.093-.331 2.352c-.325.178-.77-.185-1.725-1.846-.489-.851-.858-1.792-.858-1.792s-.071-.175-.198-.268c-.154-.113-.369-.149-.369-.149l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.815 4.244 3.87 6.381c1.883 1.96 4.024 1.832 4.024 1.832l.001-.001z"/></svg>'
        },
        link: 'https://vk.com/bumbastik_spb',
        ariaLabel: 'vk-link'
      },
      { icon: 'github', link: '#', ariaLabel: 'gamemode-link' },
      { icon: 'github', link: '#', ariaLabel: 'apply-link' },
    ],
  }
})
