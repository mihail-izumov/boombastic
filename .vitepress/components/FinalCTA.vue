<script setup>
import { useReveal } from '../composables/useReveal'

const { elRef, visible } = useReveal()

const communities = [
  {
    city: 'САНКТ-ПЕТЕРБУРГ',
    name: 'БумБастик',
    handle: '@bumbastik_spb',
    url: 'https://vk.com/bumbastik_spb',
  },
  {
    city: 'МОСКВА',
    name: 'БумБастик',
    handle: '@bumbastik_msc',
    url: 'https://vk.com/bumbastik_msc',
  },
]
</script>

<template>
  <section ref="elRef" class="final-cta">
    <div
      class="final-cta__inner"
      :style="{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1)',
      }"
    >
      <!-- Tagline -->
      <div class="final-cta__tag">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        <span>КТО ЗДЕСЬ</span>
      </div>

      <div class="final-cta__title">Заходи в сообщество</div>
      <p class="final-cta__sub">
        Там всё движение — новости, призы и&nbsp;обновления
      </p>

      <!-- VK Cards -->
      <div class="vk-cards">
        <a
          v-for="(c, i) in communities"
          :key="c.handle"
          :href="c.url"
          target="_blank"
          rel="noopener noreferrer"
          class="vk-card"
        >
          <div class="vk-card__city">{{ c.city }}</div>

          <div class="vk-card__body">
            <!-- VK Icon — b00m.fun style -->
            <div class="vk-card__icon">
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#0D1421"/>
                <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" :stroke="`url(#vk-border-${i})`" stroke-opacity="0.4"/>
                <path d="M25.54 33c-8.94 0-14.04-6.12-14.28-16.32h4.5c.16 7.56 3.48 10.76 6.12 11.42V16.68h4.24v6.52c2.6-.28 5.34-3.26 6.26-6.52h4.24c-.7 4.02-3.64 7-5.72 8.22 2.08 1 5.42 3.58 6.7 8.1h-4.68c-1-3.12-3.5-5.54-6.8-5.88V33h-.58Z" fill="#C5F946"/>
                <defs>
                  <linearGradient :id="`vk-border-${i}`" x1="0" y1="0" x2="48" y2="48">
                    <stop stop-color="#C5F946"/>
                    <stop offset="0.5" stop-color="#00D4FF"/>
                    <stop offset="1" stop-color="#C5F946"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div class="vk-card__text">
              <div class="vk-card__name">{{ c.name }}</div>
              <div class="vk-card__handle">{{ c.handle }}</div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final-cta {
  padding: 60px 0 100px;
  text-align: center;
}

.final-cta__inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Tag */
.final-cta__tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 4px;
  background: rgba(197, 249, 70, 0.08);
  border: 1px solid rgba(197, 249, 70, 0.2);
  margin-bottom: 14px;
  color: var(--lime, #C5F946);
}

.final-cta__tag span {
  font-family: var(--font-mono, 'Space Mono', monospace);
  font-size: 11px;
  font-weight: 700;
  color: var(--lime, #C5F946);
  letter-spacing: 0.12em;
}

/* Title */
.final-cta__title {
  font-family: var(--font-head, 'Montserrat', sans-serif);
  font-size: 28px;
  font-weight: 800;
  color: var(--text-pri, #F0F4FF);
  margin-bottom: 8px;
}

.final-cta__sub {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 15px;
  color: var(--text-sec, #7A8BA8);
  max-width: 360px;
  margin: 0 auto 36px;
}

/* Cards grid */
.vk-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Single card */
.vk-card,
.vk-card:hover,
.vk-card:focus,
.vk-card:active {
  text-decoration: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
}

.vk-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  flex: 1 1 280px;
  max-width: 340px;
  transition: transform 0.3s ease;
}

.vk-card:hover {
  transform: translateY(-3px);
}

/* City label */
.vk-card__city {
  font-family: var(--font-mono, 'Space Mono', monospace);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: var(--text-sec, #7A8BA8);
  text-transform: uppercase;
}

/* Card body */
.vk-card__body {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px 22px;
  border-radius: 16px;
  border: 1px solid transparent;

  background-image:
    linear-gradient(145deg, rgba(28, 26, 62, 0.95), rgba(34, 32, 80, 0.9)),
    linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(74, 90, 173, 0.18), rgba(255, 255, 255, 0.04));
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;

  transition: all 0.3s ease;
}

.vk-card:hover .vk-card__body {
  background-image:
    linear-gradient(145deg, rgba(28, 26, 62, 0.9), rgba(40, 38, 90, 0.85)),
    linear-gradient(145deg, rgba(197, 249, 70, 0.3), rgba(74, 90, 173, 0.22), rgba(197, 249, 70, 0.12));
  box-shadow: 0 4px 24px rgba(197, 249, 70, 0.08);
}

/* Icon */
.vk-card__icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 6px rgba(197, 249, 70, 0.3));
  transition: filter 0.3s ease;
}

.vk-card:hover .vk-card__icon {
  filter: drop-shadow(0 0 10px rgba(197, 249, 70, 0.5));
}

.vk-card__icon svg {
  width: 56px;
  height: 56px;
  border-radius: 14px;
}

/* Text */
.vk-card__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.vk-card__name {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-pri, #F0F4FF);
}

.vk-card__handle {
  font-family: var(--font-mono, 'Space Mono', monospace);
  font-size: 14px;
  font-weight: 400;
  color: var(--lime, #C5F946);
}

/* Mobile */
@media (max-width: 600px) {
  .vk-cards {
    flex-direction: column;
    align-items: center;
  }

  .vk-card {
    max-width: 100%;
    width: 100%;
  }

  .final-cta__title {
    font-size: 24px;
  }
}
</style>
