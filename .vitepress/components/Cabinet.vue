<script setup>
import { useReveal } from '../composables/useReveal'
import CutBtn from './CutBtn.vue'
import SectionHeader from './SectionHeader.vue'

const { elRef, visible } = useReveal()

const feats = [
  { title: 'Баланс в кармане', sub: 'Заряды, бонусы и рубли всегда видны' },
  { title: 'Прогресс до приза', sub: 'Мотивация на виду каждый день' },
  { title: 'Статус растёт', sub: 'Больше играешь — больше привилегий' },
]
</script>

<template>
  <section ref="elRef" class="boom-section">
    <div class="boom-wrap">
      <SectionHeader tag="ЛИЧНЫЙ КАБИНЕТ" title="Всё под контролем" subtitle="Баланс, тикеты, статус — в телефоне">
        <template #icon>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
        </template>
      </SectionHeader>
    </div>
    <div class="boom-wrap" :style="{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1) 0.1s' }">
      <div style="display: flex; gap: 44px; align-items: center; flex-wrap: wrap">
        <!-- Phone -->
        <div class="phone-mockup">
          <div style="height: 12px" />
          <!-- Header -->
          <div style="padding: 6px 16px; display: flex; align-items: center; gap: 8px; position: relative; z-index: 1">
            <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--lime); letter-spacing: 0.05em">👀 B00M.FUN</span>
          </div>
          <!-- Profile card -->
          <div class="phone-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--blue-2), var(--blue-1)); display: flex; align-items: center; justify-content: center; font-size: 14px">👤</div>
              <div>
                <div style="font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text-pri)">Артём К.</div>
                <div style="display: flex; align-items: center; gap: 4px; margin-top: 1px">
                  <div class="status-dot" />
                  <span class="status-text">ЗОЛОТОЙ</span>
                </div>
              </div>
            </div>
            <!-- Balance -->
            <div style="font-family: var(--font-body); font-size: 10px; color: #fff; margin-bottom: 6px; font-weight: 600">
              Баланс: <span style="font-family: var(--font-mono); font-weight: 700">1 200 ₽</span>
            </div>
            <!-- Tickets & Bonuses -->
            <div style="display: flex; gap: 8px; margin-bottom: 10px">
              <div class="stat-ticket">
                <div class="stat-label">Тикеты</div>
                <div class="stat-value" style="color: var(--magenta)">5,020</div>
              </div>
              <div class="stat-bonus">
                <div class="stat-label">Бонусы</div>
                <div class="stat-value" style="color: var(--cyan)">300</div>
              </div>
            </div>
            <div class="phone-btn">Пополнить заряды</div>
          </div>
          <!-- Progress -->
          <div class="phone-progress">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
              <span style="font-family: var(--font-body); font-size: 9px; color: var(--text-pri); font-weight: 600">Razer Cobra Minecraft</span>
              <span style="font-family: var(--font-mono); font-size: 9px; color: var(--magenta); font-weight: 700">5020/7500</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill">
                <div class="progress-stripes" />
              </div>
            </div>
          </div>
          <!-- Nav buttons -->
          <div style="display: flex; gap: 6px; margin: 8px 12px 0; position: relative; z-index: 1">
            <div v-for="(tab, i) in [{label:'Призы',c:'var(--yellow)'},{label:'История',c:'var(--cyan)'},{label:'Профиль',c:'var(--green)'}]" :key="i" class="phone-tab" :style="{ color: tab.c }">
              <span style="font-size: 14px">{{ ['🏆','⏱','👤'][i] }}</span>
              <span class="phone-tab-label">{{ tab.label }}</span>
            </div>
          </div>
          <!-- Spacer + watermark -->
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; opacity: 0.15; font-size: 40px">👀</div>
          <!-- Home indicator -->
          <div style="padding: 8px 0; display: flex; justify-content: center; border-top: 1px solid rgba(255,0,128,0.1)">
            <div style="width: 90px; height: 3px; border-radius: 2px; background: rgba(255,0,128,0.25)" />
          </div>
        </div>

        <!-- Text beside phone -->
        <div style="flex: 1; min-width: 240px">
          <div style="margin-bottom: 24px">
            <div v-for="(f, i) in feats" :key="i" style="display: flex; gap: 12px; margin-bottom: 18px; align-items: flex-start">
              <span style="flex-shrink: 0; margin-top: 4px; color: var(--lime); font-size: 20px">◇</span>
              <div>
                <div style="font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text-pri); margin-bottom: 3px">{{ f.title }}</div>
                <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-sec); line-height: 1.4">{{ f.sub }}</div>
              </div>
            </div>
          </div>
          <CutBtn label="Войти в кабинет" lime compact />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.phone-mockup {
  width: 256px; height: 500px; border-radius: 20px;
  background: linear-gradient(165deg, #1a1840, var(--bg-night));
  border: 2px solid rgba(255,0,128,0.2);
  animation: phoneBreathe 2.5s ease-in-out infinite;
  position: relative; overflow: hidden; flex-shrink: 0;
  display: flex; flex-direction: column;
}
.phone-card {
  margin: 6px 12px; padding: 12px; border-radius: 10px;
  background: linear-gradient(135deg, rgba(34,32,80,0.8), rgba(28,26,62,0.85));
  border: 1px solid rgba(255,0,128,0.1); position: relative; z-index: 1;
}
.status-dot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--green);
  animation: dotPulse 1.5s ease-in-out infinite;
}
.status-text {
  font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  color: var(--yellow); letter-spacing: 0.06em;
  animation: statusShine 2s ease-in-out infinite;
}
.stat-ticket {
  flex: 1; padding: 7px 8px; border-radius: 7px;
  background: rgba(255,0,128,0.08); border: 1px solid rgba(255,0,128,0.12);
  animation: ticketGlow 2.5s ease-in-out infinite;
}
.stat-bonus {
  flex: 1; padding: 7px 8px; border-radius: 7px;
  background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.12);
  animation: bonusGlow 2.5s ease-in-out infinite 1.25s;
}
.stat-label {
  font-family: var(--font-body); font-size: 8px; color: var(--text-sec);
  margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.06em;
}
.stat-value {
  font-family: var(--font-mono); font-size: 18px; font-weight: 700;
}
.phone-btn {
  padding: 9px; border-radius: 7px; text-align: center;
  background: rgba(74,90,173,0.25); border: 1px solid rgba(74,90,173,0.35);
  font-family: var(--font-body); font-size: 11px; font-weight: 700;
  color: rgba(240,244,255,0.7);
}
.phone-progress {
  margin: 6px 12px 0; padding: 9px 10px; border-radius: 8px;
  background: rgba(255,0,128,0.05); border: 1px solid rgba(255,0,128,0.1);
  position: relative; z-index: 1;
}
.progress-track {
  height: 5px; border-radius: 3px; background: rgba(255,0,128,0.15); overflow: hidden;
}
.progress-fill {
  width: 67%; height: 100%; border-radius: 3px;
  background: linear-gradient(90deg, var(--magenta), #FF5CAA);
  animation: progressPulse 1.8s ease-in-out infinite;
  position: relative; overflow: hidden;
}
.progress-stripes {
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(110deg,
    rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 4px,
    transparent 4px, transparent 10px);
  background-size: 20px 100%;
  animation: progressStripes 0.8s linear infinite;
}
.phone-tab {
  flex: 1; padding: 8px 0; border-radius: 6px; text-align: center;
  background: rgba(74,90,173,0.08); border: 1px solid rgba(74,90,173,0.1);
  display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.phone-tab-label {
  font-family: var(--font-body); font-size: 8px; color: var(--text-sec); font-weight: 600;
}
</style>
