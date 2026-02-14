<script setup>
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import SectionHeader from './SectionHeader.vue'

const { elRef, visible } = useReveal()
const resultHover = ref(false)

const steps = [
  { num: '01', title: 'Получи B00M!-карту', desc: 'На кассе бесплатно или виртуальную в кабинете', color: 'var(--cyan)' },
  { num: '02', title: 'Пополни заряды', desc: 'На кассе или онлайн. 1 заряд = 10₽', color: 'var(--orange)' },
  { num: '03', title: 'Играй и копи тикеты', desc: 'Каждая игра приносит тикеты для призов', color: 'var(--magenta)' },
]
</script>

<template>
  <section ref="elRef" class="boom-section">
    <div class="boom-wrap">
      <SectionHeader tag="КАК ИГРАТЬ" title="3 шага к призу">
        <template #icon>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><path d="M2 21V3"/><path d="M2 5h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2.26"/><path d="M7 17v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3"/><circle cx="16" cy="11" r="2"/><circle cx="8" cy="11" r="2"/></svg>
        </template>
      </SectionHeader>

      <div class="howto-layout">
        <div class="howto-steps">
          <div v-for="(s, i) in steps" :key="i" class="step-row" :style="{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: `all 0.5s cubic-bezier(0.23,1,0.32,1) ${0.1 + i * 0.1}s` }">
            <div class="step-left">
              <div class="step-circle" :style="{ borderColor: s.color }">
                <svg v-if="i === 0" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: s.color }"><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/></svg>
                <svg v-if="i === 1" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: s.color }"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
                <svg v-if="i === 2" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: s.color }"><path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z"/><path d="M6 15v-2"/><path d="M12 15V9"/><circle cx="12" cy="6" r="3"/></svg>
              </div>
              <div v-if="i < 2" class="step-connector" :style="{ background: `linear-gradient(180deg, ${s.color}, ${steps[i+1].color})` }" />
            </div>
            <div class="step-text">
              <div style="display: flex; align-items: center; gap: 7px; margin-bottom: 3px">
                <span :style="{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: s.color, fontWeight: 700, opacity: 0.6 }">{{ s.num }}</span>
                <span style="font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text-pri)">{{ s.title }}</span>
              </div>
              <p style="font-family: var(--font-body); font-size: 13px; color: var(--text-sec); line-height: 1.5; margin: 0">{{ s.desc }}</p>
            </div>
          </div>
        </div>

        <div class="result-card" @mouseenter="resultHover = true" @mouseleave="resultHover = false" :style="{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1) 0.4s' }">
          <div class="result-border" :class="{ hovered: resultHover }">
            <div class="result-inner">
              <svg class="result-grid" width="100%" height="100%">
                <defs><pattern id="resultGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="#C5F946" stroke-width="0.4" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#resultGrid)" />
              </svg>
              <div class="result-content">
                <div class="result-badge">[ РЕЗУЛЬТАТ ]</div>
                <div class="result-count">250+</div>
                <div class="result-label">призов на выбор</div>
                <div class="result-desc">От брелоков до колонок и мышек Razer</div>
                <button class="result-cta" :class="{ hovered: resultHover }">
                  <span>К ПРИЗАМ</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.howto-layout { display: flex; gap: 40px; align-items: center; max-width: 800px; margin: 0 auto; }
.howto-steps { flex: 1; min-width: 280px; }
.step-row { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 4px; }
.step-left { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
.step-circle { width: 44px; height: 44px; border-radius: 50%; border: 2px solid; background: var(--bg-deep); display: flex; align-items: center; justify-content: center; z-index: 2; }
.step-connector { width: 2px; height: 24px; border-radius: 2px; opacity: 0.4; }
.step-text { padding-top: 8px; min-width: 0; }
.result-card { flex: 0 0 260px; }
.result-border {
  position: relative; padding: 1.5px; border-radius: 12px;
  background: linear-gradient(135deg, rgba(197,249,70,0.2), rgba(74,90,173,0.15), rgba(197,249,70,0.08));
  transition: all 0.4s;
}
.result-border.hovered { background: linear-gradient(135deg, rgba(197,249,70,0.45), rgba(74,90,173,0.25), rgba(197,249,70,0.2)); }
.result-inner {
  border-radius: 11px;
  background: linear-gradient(165deg, rgba(34,32,80,0.95), rgba(28,26,62,0.98));
  position: relative; overflow: hidden; padding: 28px 24px 24px;
}
.result-grid { position: absolute; inset: 0; opacity: 0.06; pointer-events: none; }
.result-border.hovered .result-grid { opacity: 0.1; }
.result-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; }
.result-badge { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: var(--lime); opacity: 0.7; margin-bottom: 8px; }
.result-count { font-family: var(--font-mono); font-size: 48px; font-weight: 700; color: var(--lime); line-height: 1; margin-bottom: 4px; }
.result-label { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text-pri); margin-bottom: 8px; }
.result-desc { font-family: var(--font-body); font-size: 12px; color: var(--text-sec); line-height: 1.4; margin-bottom: 20px; }
.result-cta {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 24px; border-radius: 8px;
  background: rgba(197,249,70,0.08);
  border: 1.5px solid rgba(197,249,70,0.3);
  font-family: var(--font-mono); font-size: 12px; font-weight: 700;
  color: var(--lime); letter-spacing: 0.06em; cursor: pointer; transition: all 0.3s;
}
.result-cta.hovered, .result-cta:hover {
  background: var(--lime); color: #1a1840; border-color: var(--lime);
}
@media (max-width: 768px) {
  .howto-layout { flex-direction: column; gap: 28px; align-items: center; }
  .howto-steps { min-width: 0; max-width: 400px; }
  .result-card { flex: none; width: 100%; max-width: 320px; }
}
</style>
