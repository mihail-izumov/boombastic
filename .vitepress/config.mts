import { defineConfig, DefaultTheme } from 'vitepress'

export default defineConfig({
  appearance: {
    initialValue: 'dark' as any
  },
  title: 'БумБастик',
  locales: {
    '/': {
      lang: 'ru-RU',
      title: 'БумБастик',
      description: 'Игровые парки для детей и их родителей',
    },
  },

  transformPageData(pageData) {
    return pageData
  },

  buildEnd(siteConfig) {
    // Этот хук выполняется после сборки
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'public/prkx-icon.png' }],
    ['link', { rel: 'shortcut icon', href: '/prkx-icon.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['script', {}, `
    (function() {
      function createFooterContent() {
        var links = [
          { text: '↗ Контакт', href: '/contact-us' },
          { text: 'Телеграм-канал', href: 'https://t.me/runPrkx', target: '_blank' }
        ];

        var html = '<hr style="border: 0; border-top: 1px solid var(--vp-c-divider); margin: 24px 0;">';
        html += '<div class="custom-footer-links"><div class="footer-row">';
        links.slice(0, 3).forEach(function(link, i) {
          if (i > 0) html += '<span class="dot-separator">•</span>';
          html += '<a href="' + link.href + '"' + (link.target ? ' target="' + link.target + '" rel="noopener noreferrer"' : '') + '>' + link.text + '</a>';
        });
        html += '</div><div class="footer-row">';
        links.slice(3).forEach(function(link, i) {
          if (i > 0) html += '<span class="dot-separator">•</span>';
          html += '<a href="' + link.href + '">' + link.text + '</a>';
        });
        html += '</div></div>';
        html += '<div style="margin-top: 24px; text-align: center;">';
        html += '<div style="color: var(--vp-c-text-2); font-size: 14px;">Игровые парки для детей и их родителей</div>';
        html += '<div style="color: var(--vp-c-text-2); margin-top: 4px; font-size: 14px; text-align: center;">© БумБастик 2025</div>';
        return html;
      }

      function replaceFooter() {
        var footer = document.querySelector('.VPFooter');
        if (!footer) {
          footer = document.createElement('footer');
          footer.className = 'VPFooter';
          document.body.appendChild(footer);
        }
        footer.innerHTML = createFooterContent();
        if (window.location.pathname !== '/') {
          footer.style.position = 'relative';
          footer.style.bottom = '70px';
          footer.style.zIndex = '10';
          footer.style.marginBottom = '-70px';
        } else {
          footer.style.position = '';
          footer.style.bottom = '';
          footer.style.zIndex = '';
          footer.style.paddingBottom = '30px';
        }
      }

      function updateApplyLinkTarget() {
        var applyLinks = document.querySelectorAll('.VPSocialLink[aria-label="apply-link"]');
        applyLinks.forEach(function(applyLink) {
          applyLink.href = '/run-prkx';
          applyLink.setAttribute('target', '_self');
          applyLink.removeAttribute('rel');

          var newLink = document.createElement('a');
          newLink.href = '/run-prkx';
          newLink.className = applyLink.className;
          newLink.setAttribute('aria-label', 'apply-link');
          newLink.setAttribute('target', '_self');

          Array.from(applyLink.attributes).forEach(function(attr) {
            if (attr.name !== 'href' && attr.name !== 'target' && attr.name !== 'rel') {
              newLink.setAttribute(attr.name, attr.value);
            }
          });

          applyLink.parentNode.replaceChild(newLink, applyLink);
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          replaceFooter();
          updateApplyLinkTarget();
        });
      } else {
        replaceFooter();
        updateApplyLinkTarget();
      }

      window.addEventListener('load', function() {
        replaceFooter();
        updateApplyLinkTarget();
      });
      setTimeout(function() {
        replaceFooter();
        updateApplyLinkTarget();
      }, 1000);
      setTimeout(function() {
        replaceFooter();
        updateApplyLinkTarget();
      }, 2000);

      var lastUrl = location.href;
      new MutationObserver(function() {
        var url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(function() {
            replaceFooter();
            updateApplyLinkTarget();
          }, 100);
        }
      }).observe(document, { subtree: true, childList: true });
    })();
    `],
    ['style', {}, `
    .VPSwitchAppearance{display:none!important}
    .VPSocialLink[aria-label="login-link"]::after{font-weight:600!important}
    .VPHero .name,.VPHero .text,.VPHero .tagline{color:white!important}
    .VPHero .tagline a{color:var(--vp-c-brand-2)!important;text-decoration:none;transition:all .3s ease}
    .VPHero .tagline a:hover{color:var(--vp-c-brand-1)!important;text-decoration:underline}
    .VPHero .VPButton{background-color:var(--vp-c-brand-1)!important;border-color:var(--vp-c-brand-1)!important;color:white!important;transition:all .3s ease;text-decoration:none!important}
    .VPHero .VPButton:hover{background-color:var(--vp-c-brand-2)!important;border-color:var(--vp-c-brand-2)!important;color:#000!important;transform:translateY(-2px);text-decoration:none!important}
    .VPContent a{color:var(--vp-c-brand-2);text-decoration:none;border-bottom:1px solid transparent;transition:all .3s ease}
    .VPContent a:hover{color:var(--vp-c-brand-1);border-bottom-color:var(--vp-c-brand-1)}
    .VPFeature .title,.VPFeature .link-text{transition:color .25s ease-in-out}
    .VPFeature .link-text{color:var(--vp-c-brand-1)}
    a.VPFeature.link:hover .title,a.VPFeature.link:hover .link-text{color:var(--vp-c-brand-2)}
    .dark .VPFeature{background-color:#202124!important;border-color:#3c3c3c!important}
    .dark .VPFeature .title{color:#C5F946!important}
    .dark .VPFeature .details{color:rgba(235,235,245,.6)!important}
    .dark .VPFeature .link-text{color:#347b6c!important}
    .dark .VPFeature .link-text .icon{fill:#347b6c!important}
    .dark a.VPFeature.link:hover{background-color:#2f2f2f!important;border-color:#555!important}
    
    :root{
      --vp-c-brand-1:#347b6c;
      --vp-c-brand-2:#C5F946;
      --vp-c-brand-3:#347b6c;
      --vp-c-brand-soft:rgba(52,123,108,.14);
      --vp-c-bg-mute:rgba(52,123,108,.1);
      --vp-c-bg-soft:rgba(52,123,108,.1);
      --vp-c-divider:rgba(52,123,108,.2);
      --vp-c-gutter:rgba(52,123,108,.1);
      --vp-c-text-2:#b3b3b3;
    }
    
    .VPNavBarTitle .logo{height:32px!important;width:auto!important}
    
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink{color:white!important}
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink:hover{color:var(--vp-c-brand-2)!important}
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.active{color:var(--vp-c-brand-2)!important}
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.has-dropdown{color:white!important}
    .VPNavBar .VPNavBarMenu .VPNavBarMenuLink.has-dropdown:hover{color:var(--vp-c-brand-2)!important}
    
    .VPMenuGroup .title{color:var(--vp-c-brand-2)!important}
    .VPMenuItem .text{color:white!important}
    .VPMenuItem:hover .text{color:var(--vp-c-brand-2)!important}
    .VPMenuItem:hover{background-color:rgba(197,249,70,.1)!important}
    
    .VPSocialLinks .VPSocialLink svg{fill:white!important}
    .VPSocialLinks .VPSocialLink:hover svg{fill:var(--vp-c-brand-2)!important}
    .VPSocialLinks .VPSocialLink:first-child svg{fill:white!important}
    .VPSocialLinks .VPSocialLink:first-child:hover svg{fill:var(--vp-c-brand-2)!important}
    
    @media (min-width:961px){
      .VPNavBar .content{gap:0!important}
      .VPNavBarMenu{margin-right:0!important}
      .VPNavBarSocialLinks{min-width:auto!important;justify-content:flex-end!important;gap:16px!important;margin-left:0!important;flex-shrink:0!important}
      .VPSocialLink:not(:last-child){margin-right:4px!important}
    }
    @media (max-width:960px) and (min-width:769px){
      .VPNavBar .content{gap:0!important}
      .VPNavBarMenu{margin-right:0!important}
      .VPNavBarSocialLinks{margin-left:4px!important;gap:12px!important;flex-shrink:0!important}
      .VPSocialLink:not(:last-child){margin-right:2px!important}
    }
    @media (max-width:768px){
      .VPNavBar .VPNavBarSocialLinks{display:none!important}
      .VPNavScreen{overflow-y:auto!important}
      .VPNavScreen .VPNavScreenMenu{padding-bottom:16px!important}
      .VPNavScreen .VPNavScreenSocialLinks,.VPNavScreen .VPNavScreenAppearance{margin:16px!important;padding:16px!important;border:1px solid var(--vp-c-divider)!important;border-radius:8px!important;background:var(--vp-c-bg-soft)!important}
      .VPNavScreen .VPNavScreenAppearance{display:none!important}
      .VPNavScreen .VPNavScreenSocialLinks{display:flex!important;flex-direction:column!important;gap:12px!important}
      .VPNavScreen .VPSocialLink{display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;background:transparent!important;border-radius:0!important;border:none!important;transition:all .3s ease!important;text-decoration:none!important}
      .VPNavScreen .VPSocialLink:hover{background:transparent!important;border-color:transparent!important}
      
      .VPNavScreen .VPSocialLink[aria-label="login-link"]::after,
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]::after {
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        width:100%!important;
        min-width:0!important;
        box-sizing:border-box!important;
        font-size:18px!important;
        font-weight:600!important;
        border-radius:12px!important;
        padding:18px!important;
        margin:0!important;
        height:52px!important;
        min-height:52px!important;
      }
      
      .VPNavScreen .VPSocialLink[aria-label="login-link"]::after{
        content:"Сообщество"!important;
        background:#3b3b3d!important;
        color:#f0f0f0!important;
        border:none!important;
        transition:background 0.2s, color 0.2s!important;
      }
      
      .VPNavScreen .VPSocialLink[aria-label="login-link"]:hover::after{
        background:#454546!important;
        color:#c5f946!important;
      }
      
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]::after{
        content:"Поддержать"!important;
        background-image:linear-gradient(-45deg, #c5f946, #85a931, #c5f946, #85a931);
        background-size:400% 400%;
        animation:liquid-fluid 6s ease infinite;
        color:#000!important;
        border:none!important;
        transition:all 0.2s!important;
      }
      
      .VPNavScreen .VPSocialLink[aria-label="apply-link"]:hover::after{
        background-image:linear-gradient(-45deg, #85a931, #c5f946, #85a931, #c5f946);
        color:#000!important;
        font-weight:700!important;
      }
      
      .footer-row{flex-direction:column!important;gap:8px!important}
      .dot-separator{display:none!important}
    }
    
    @keyframes liquid-fluid {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .VPSocialLink .vpi-social-github{display:none!important}
    .VPSocialLink{width:auto!important;height:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important}
    
    .VPSocialLink[aria-label="login-link"]::after{
      content:"Сообщество";
      font-size:14px;
      color:#f0f0f0!important;
      padding:8px 16px;
      border:none!important;
      border-radius:12px;
      background:#3b3b3d!important;
      transition:all 0.3s ease;
      white-space:nowrap;
      margin:0;
      flex-shrink:0;
      font-weight:600;
    }
    .VPSocialLink[aria-label="login-link"]:hover::after{
      background:#454546!important;
      color:#c5f946!important;
    }
    
    .VPSocialLink[aria-label="apply-link"]::after{
      content:"Поддержать";
      font-size:14px;
      color:#000;
      padding:8px 16px;
      border-radius:12px;
      background-image:linear-gradient(-45deg, #c5f946, #85a931, #c5f946, #85a931);
      background-size:400% 400%;
      animation:liquid-fluid 6s ease infinite;
      transition:all 0.3s ease;
      white-space:nowrap;
      margin:0;
      flex-shrink:0;
      font-weight:600;
      border:none;
    }
    .VPSocialLink[aria-label="apply-link"]:hover::after{
      background-image:linear-gradient(-45deg, #85a931, #c5f946, #85a931, #c5f946);
      color:#000;
      transform:translateY(-2px);
    }
    
    .custom-footer-links{display:flex;flex-direction:column;gap:3px;align-items:center}
    .footer-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center}
    .footer-row a{color:var(--vp-c-text-2);text-decoration:none;transition:color .3s ease}
    .footer-row a:hover{color:var(--vp-c-brand)}
    .dot-separator{color:var(--vp-c-text-3);font-weight:bold}
    .VPFooter .copyright{margin-top:2px!important}
    `]
  ],
  base: '/boombastic/',
  cleanUrls: true,
  appearance: 'dark',
  outDir: '.vitepress/dist',
  description: 'Игровые парки для детей и их родителей.',
  themeConfig: {
    logo: '/prkx-favicon.png',
    siteTitle: 'БумБастик',

    // TODO: добавить sidebar для разделов БумБастик
    sidebar: {},

    search: {
      provider: 'local',
      options: {
        placeholder: 'Поиск…',
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск'
          },
          modal: {
            displayDetails: 'Показать подробные результаты',
            resetButtonTitle: 'Сбросить поиск',
            backButtonTitle: 'Закрыть поиск',
            noResultsText: 'Результаты не найдены для',
            footer: {
              selectText: 'выбрать',
              navigateText: 'навигация',
              closeText: 'закрыть'
            }
          }
        }
      }
    },

    // TODO: добавить навигацию БумБастик
    nav: [],

    socialLinks: [
      { icon: 'github', link: '/community', ariaLabel: 'login-link', target: '_self' },
      { icon: 'github', link: '/run-prkx', ariaLabel: 'apply-link', target: '_self' }
    ],
  }
})
