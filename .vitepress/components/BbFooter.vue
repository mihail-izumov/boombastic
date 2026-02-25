<template>
  <footer class="bb-footer">
    <hr class="bb-footer-divider" />
    <div class="bb-footer-links">
      <div class="footer-row">
        <a href="/boombastic/contact-us" data-neon="cyan">Контакт</a>
        <a href="https://vk.com/bumbastik_spb" target="_blank" rel="noopener noreferrer" data-neon="magenta">ВКонтакте</a>
        <a href="/terms" data-neon="green">Условия использования</a>
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

/* Неоновый градиент-разделитель */
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
  font-family: 'Montserrat', 'Inter', sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 20px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* ── Покой: приглушённый неон ── */

/* Cyan — покой */
.footer-row a[data-neon="cyan"] {
  color: rgba(0, 212, 255, 0.6);
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.85), rgba(34,32,80,0.8)),
    linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
}

/* Cyan — hover: загорается */
.footer-row a[data-neon="cyan"]:hover {
  color: #00D4FF;
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(0,212,255,0.35), rgba(0,212,255,0.15));
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
  transform: translateY(-1px);
}

/* Magenta — покой */
.footer-row a[data-neon="magenta"] {
  color: rgba(255, 0, 128, 0.6);
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.85), rgba(34,32,80,0.8)),
    linear-gradient(135deg, rgba(255,0,128,0.12), rgba(255,0,128,0.06));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
}

/* Magenta — hover */
.footer-row a[data-neon="magenta"]:hover {
  color: #FF0080;
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(255,0,128,0.35), rgba(255,0,128,0.15));
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.15);
  transform: translateY(-1px);
}

/* Yellow — покой */
.footer-row a[data-neon="yellow"] {
  color: rgba(255, 214, 10, 0.6);
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.85), rgba(34,32,80,0.8)),
    linear-gradient(135deg, rgba(255,214,10,0.12), rgba(255,214,10,0.06));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
}

/* Yellow — hover */
.footer-row a[data-neon="yellow"]:hover {
  color: #FFD60A;
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(255,214,10,0.35), rgba(255,214,10,0.15));
  box-shadow: 0 0 15px rgba(255, 214, 10, 0.15);
  transform: translateY(-1px);
}

/* Green — покой */
.footer-row a[data-neon="green"] {
  color: rgba(0, 255, 136, 0.6);
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.85), rgba(34,32,80,0.8)),
    linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,255,136,0.06));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
}

/* Green — hover */
.footer-row a[data-neon="green"]:hover {
  color: #00FF88;
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(0,255,136,0.35), rgba(0,255,136,0.15));
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.15);
  transform: translateY(-1px);
}

/* Lime — покой */
.footer-row a[data-neon="lime"] {
  color: rgba(197, 249, 70, 0.6);
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.85), rgba(34,32,80,0.8)),
    linear-gradient(135deg, rgba(197,249,70,0.12), rgba(197,249,70,0.06));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
}

/* Lime — hover */
.footer-row a[data-neon="lime"]:hover {
  color: #C5F946;
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(34,32,80,0.75)),
    linear-gradient(135deg, rgba(197,249,70,0.35), rgba(197,249,70,0.15));
  box-shadow: 0 0 15px rgba(197, 249, 70, 0.15);
  transform: translateY(-1px);
}

/* Fallback */
.footer-row a:not([data-neon]) {
  color: rgba(240, 244, 255, 0.6);
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.85), rgba(34,32,80,0.8)),
    linear-gradient(135deg, rgba(255,255,255,0.1), rgba(74,90,173,0.15), rgba(255,255,255,0.05));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
}
.footer-row a:not([data-neon]):hover {
  color: #C5F946;
  background-image:
    linear-gradient(135deg, rgba(28,26,62,0.8), rgba(40,38,90,0.75)),
    linear-gradient(135deg, rgba(197,249,70,0.3), rgba(74,90,173,0.2), rgba(197,249,70,0.15));
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
