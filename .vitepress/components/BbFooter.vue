<template>
  <footer class="bb-footer">
    <hr class="bb-footer-divider" />
    <div class="bb-footer-links">
      <div class="footer-row">
        <a href="/boombastic/contact-us" data-neon="cyan">Контакт</a>
        <a href="https://vk.com/boombastic_parks" target="_blank" rel="noopener noreferrer" data-neon="magenta">ВКонтакте</a>
      </div>
    </div>
    <div class="bb-footer-info">
      <div class="bb-footer-tagline">Сделано игроками для игроков</div>
      <div class="bb-footer-copy">© БумБастик 2026</div>
    </div>
  </footer>
</template>

<script setup>
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path === '/boombastic/')
</script>

<style scoped>
.bb-footer {
  padding: 0 24px 30px;
}

/* Неоновый градиент-разделитель вместо обычной линии */
.bb-footer-divider {
  border: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #00D4FF 15%,
    #C5F946 35%,
    #FFD60A 50%,
    #FF0080 65%,
    #00FF88 85%,
    transparent 100%
  );
  opacity: 0.4;
  margin: 24px 0;
}

.bb-footer-links {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
}

.footer-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Glass bubble ссылки — база */
.footer-row a {
  color: white;
  font-family: 'Montserrat', 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 20px;
  border-radius: 12px;
  background-image:
    linear-gradient(135deg, rgba(28, 26, 62, 0.85), rgba(34, 32, 80, 0.8)),
    linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(74, 90, 173, 0.15), rgba(255, 255, 255, 0.05));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* Неоновые hover по data-neon атрибуту */
.footer-row a[data-neon="cyan"]:hover {
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(0,212,255,0.35), rgba(0,212,255,0.15));
  color: #00D4FF;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
  transform: translateY(-1px);
}

.footer-row a[data-neon="magenta"]:hover {
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(255,0,128,0.35), rgba(255,0,128,0.15));
  color: #FF0080;
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.15);
  transform: translateY(-1px);
}

.footer-row a[data-neon="yellow"]:hover {
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(255,214,10,0.35), rgba(255,214,10,0.15));
  color: #FFD60A;
  box-shadow: 0 0 15px rgba(255, 214, 10, 0.15);
  transform: translateY(-1px);
}

.footer-row a[data-neon="green"]:hover {
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(0,255,136,0.35), rgba(0,255,136,0.15));
  color: #00FF88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.15);
  transform: translateY(-1px);
}

/* Fallback если нет data-neon */
.footer-row a:not([data-neon]):hover {
  background-image:
    linear-gradient(135deg, rgba(28, 26, 62, 0.8), rgba(40, 38, 90, 0.75)),
    linear-gradient(135deg, rgba(197, 249, 70, 0.3), rgba(74, 90, 173, 0.2), rgba(197, 249, 70, 0.15));
  color: #C5F946;
  transform: translateY(-1px);
}

.bb-footer-info {
  margin-top: 24px;
  text-align: center;
}

.bb-footer-tagline {
  color: #7A8BA8;
  font-size: 13px;
  font-family: 'Montserrat', 'Inter', sans-serif;
  letter-spacing: 0.03em;
}

.bb-footer-copy {
  color: #4a5aad;
  margin-top: 4px;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
}

@media (max-width: 768px) {
  .footer-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
