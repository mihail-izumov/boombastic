<template>
  <footer class="bb-footer">
    <hr class="bb-footer-divider" />
    <div class="bb-footer-links">
      <div class="footer-row">
        <a href="/boombastic/contact-us">Контакт</a>
        <a href="https://vk.com/boombastic_parks" target="_blank" rel="noopener noreferrer">ВКонтакте</a>
      </div>
    </div>
    <div class="bb-footer-info">
      <div class="bb-footer-tagline">Игровые парки для детей и их родителей</div>
      <div class="bb-footer-copy">© БумБастик 2025</div>
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

.bb-footer-divider {
  border: 0;
  border-top: 1px solid rgba(74, 90, 173, 0.12);
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

/* Glass bubble ссылки */
.footer-row a {
  color: white;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 20px;
  background-image:
    linear-gradient(135deg, rgba(28, 26, 62, 0.85), rgba(34, 32, 80, 0.8)),
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(74, 90, 173, 0.2), rgba(255, 255, 255, 0.06));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1px solid transparent;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  font-size: 14px;
}

.footer-row a:hover {
  background-image:
    linear-gradient(135deg, rgba(28, 26, 62, 0.8), rgba(40, 38, 90, 0.75)),
    linear-gradient(135deg, rgba(197, 249, 70, 0.3), rgba(74, 90, 173, 0.2), rgba(197, 249, 70, 0.15));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  color: #C5F946;
  transform: translateY(-1px);
}

.bb-footer-info {
  margin-top: 24px;
  text-align: center;
}

.bb-footer-tagline {
  color: #5a68b8;
  font-size: 14px;
}

.bb-footer-copy {
  color: #4a5aad;
  margin-top: 4px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
