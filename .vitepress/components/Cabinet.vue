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
      <div class="cabinet-row">
        <!-- Phone -->
        <div class="phone-mockup">
          <div style="height: 12px" />
          <div style="padding: 6px 16px; display: flex; align-items: center; gap: 8px; position: relative; z-index: 1">
            <svg viewBox="0 0 241 153" width="18" height="11" style="fill-rule: evenodd"><g transform="matrix(1,0,0,1,-4601.23,-4106.91)"><g transform="matrix(8.77664e-18,0.143333,-0.353616,2.16527e-17,4841.38,4106.91)"><g><g transform="matrix(2.6863e-16,-1.77824,4.39328,1.0904e-16,-45825.6,8012.07)"><path d="M4368.24,10448.4L4505.63,10440.8C4505.63,10440.8 4501.3,10486.6 4491.87,10531.6C4475.88,10607.8 4458.86,10662.7 4458.86,10662.7L4260.49,10672.8L4350.14,10534.7L4325.11,10534.8L4365.12,10454.6L4365.14,10454.6L4365.8,10453.3L4368.24,10448.4ZM4272.15,10569.3L4296.18,10569.2L4253.91,10655.4L4123.72,10661.7C4123.72,10661.7 4131.45,10597.1 4145.77,10533.5C4160.78,10466.8 4170.9,10440.7 4170.9,10440.7L4363.5,10430.8L4272.15,10569.3ZM4447.79,10507.4C4446.91,10512.2 4445.97,10516.9 4444.97,10521.7C4436.79,10560.7 4428.35,10593.9 4422.2,10616.6L4337.79,10620.9L4381.48,10530.8C4405.55,10526.2 4427.95,10518.2 4447.79,10507.4ZM4204.13,10496.3C4221.83,10508.5 4242.25,10518.2 4264.55,10524.9L4223.35,10608.9L4179.57,10611C4182.92,10590.9 4187.26,10567.4 4192.52,10544C4196.91,10524.5 4200.83,10508.8 4204.13,10496.3Z" style="fill: rgb(223,255,0)"/></g></g></g></g></svg>
            <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--lime); letter-spacing: 0.05em">B00M.FUN</span>
          </div>
          <div class="phone-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--blue-2), var(--blue-1)); display: flex; align-items: center; justify-content: center; color: var(--text-pri)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
              </div>
              <div>
                <div style="font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text-pri)">Артём К.</div>
                <div style="display: flex; align-items: center; gap: 4px; margin-top: 1px"><div class="status-dot" /><span class="status-text">ЗОЛОТОЙ</span></div>
              </div>
            </div>
            <div style="font-family: var(--font-body); font-size: 10px; color: #fff; margin-bottom: 6px; font-weight: 600">Баланс: <span style="font-family: var(--font-mono); font-weight: 700">1 200 ₽</span></div>
            <div style="display: flex; gap: 8px; margin-bottom: 10px">
              <div class="stat-ticket"><div class="stat-label">Тикеты</div><div class="stat-value" style="color: var(--magenta)">5,020</div></div>
              <div class="stat-bonus"><div class="stat-label">Бонусы</div><div class="stat-value" style="color: var(--cyan)">300</div></div>
            </div>
            <div class="phone-btn">Пополнить заряды</div>
          </div>
          <div class="phone-progress">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
              <span style="font-family: var(--font-body); font-size: 9px; color: var(--text-pri); font-weight: 600">Razer Cobra Minecraft</span>
              <span style="font-family: var(--font-mono); font-size: 9px; color: var(--magenta); font-weight: 700">5020/7500</span>
            </div>
            <div class="progress-track"><div class="progress-fill"><div class="progress-stripes" /></div></div>
          </div>
          <div style="display: flex; gap: 6px; margin: 8px 12px 0; position: relative; z-index: 1">
            <div class="phone-tab"><span style="color: var(--yellow)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14.66v1.63a2 2 0 0 1-.98 1.7A5 5 0 0 0 7 21.98"/><path d="M14 14.66v1.63a2 2 0 0 0 .98 1.7A5 5 0 0 1 17 21.98"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/></svg></span><span class="phone-tab-label">Призы</span></div>
            <div class="phone-tab"><span style="color: var(--cyan)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg></span><span class="phone-tab-label">История</span></div>
            <div class="phone-tab"><span style="color: var(--green)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg></span><span class="phone-tab-label">Профиль</span></div>
          </div>
          <div style="flex: 1; display: flex; align-items: center; justify-content: center">
            <svg viewBox="0 0 241 153" width="100" height="63" style="fill-rule: evenodd; opacity: 0.15"><g transform="matrix(1,0,0,1,-4601.23,-4106.91)"><g transform="matrix(8.77664e-18,0.143333,-0.353616,2.16527e-17,4841.38,4106.91)"><g><g transform="matrix(2.6863e-16,-1.77824,4.39328,1.0904e-16,-45825.6,8012.07)"><path d="M4368.24,10448.4L4505.63,10440.8C4505.63,10440.8 4501.3,10486.6 4491.87,10531.6C4475.88,10607.8 4458.86,10662.7 4458.86,10662.7L4260.49,10672.8L4350.14,10534.7L4325.11,10534.8L4365.12,10454.6L4365.14,10454.6L4365.8,10453.3L4368.24,10448.4ZM4272.15,10569.3L4296.18,10569.2L4253.91,10655.4L4123.72,10661.7C4123.72,10661.7 4131.45,10597.1 4145.77,10533.5C4160.78,10466.8 4170.9,10440.7 4170.9,10440.7L4363.5,10430.8L4272.15,10569.3ZM4447.79,10507.4C4446.91,10512.2 4445.97,10516.9 4444.97,10521.7C4436.79,10560.7 4428.35,10593.9 4422.2,10616.6L4337.79,10620.9L4381.48,10530.8C4405.55,10526.2 4427.95,10518.2 4447.79,10507.4ZM4204.13,10496.3C4221.83,10508.5 4242.25,10518.2 4264.55,10524.9L4223.35,10608.9L4179.57,10611C4182.92,10590.9 4187.26,10567.4 4192.52,10544C4196.91,10524.5 4200.83,10508.8 4204.13,10496.3Z" style="fill: #3a38a0"/></g></g></g></g></svg>
          </div>
          <div style="padding: 8px 0; display: flex; justify-content: center; border-top: 1px solid rgba(255,0,128,0.1)"><div style="width: 90px; height: 3px; border-radius: 2px; background: rgba(255,0,128,0.25)" /></div>
        </div>

        <!-- Features text -->
        <div class="cabinet-text">
          <div v-for="(f, i) in feats" :key="i" style="display: flex; gap: 12px; margin-bottom: 18px; align-items: flex-start">
            <span style="flex-shrink: 0; margin-top: 4px"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--lime)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg></span>
            <div>
              <div style="font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text-pri); margin-bottom: 3px">{{ f.title }}</div>
              <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-sec); line-height: 1.4">{{ f.sub }}</div>
            </div>
          </div>
          <CutBtn label="Войти в кабинет" lime compact />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cabinet-row {
  display: flex;
  gap: 44px;
  align-items: center;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
}
.cabinet-text { flex: 1; min-width: 220px; }

@media (max-width: 768px) {
  .cabinet-row {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
  .cabinet-text { text-align: left; }
}

.phone-mockup { width: 256px; height: 500px; border-radius: 20px; background: linear-gradient(165deg, #1a1840, var(--bg-night)); border: 2px solid rgba(255,0,128,0.2); animation: phoneBreathe 2.5s ease-in-out infinite; position: relative; overflow: hidden; flex-shrink: 0; display: flex; flex-direction: column; }
.phone-card { margin: 6px 12px; padding: 12px; border-radius: 10px; background: linear-gradient(135deg, rgba(34,32,80,0.8), rgba(28,26,62,0.85)); border: 1px solid rgba(255,0,128,0.1); position: relative; z-index: 1; }
.status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: dotPulse 1.5s ease-in-out infinite; }
.status-text { font-family: var(--font-mono); font-size: 9px; font-weight: 700; color: var(--yellow); letter-spacing: 0.06em; animation: statusShine 2s ease-in-out infinite; }
.stat-ticket { flex: 1; padding: 7px 8px; border-radius: 7px; background: rgba(255,0,128,0.08); border: 1px solid rgba(255,0,128,0.12); animation: ticketGlow 2.5s ease-in-out infinite; }
.stat-bonus { flex: 1; padding: 7px 8px; border-radius: 7px; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.12); animation: bonusGlow 2.5s ease-in-out infinite 1.25s; }
.stat-label { font-family: var(--font-body); font-size: 8px; color: var(--text-sec); margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
.stat-value { font-family: var(--font-mono); font-size: 18px; font-weight: 700; }
.phone-btn { padding: 9px; border-radius: 7px; text-align: center; background: rgba(74,90,173,0.25); border: 1px solid rgba(74,90,173,0.35); font-family: var(--font-body); font-size: 11px; font-weight: 700; color: rgba(240,244,255,0.7); }
.phone-progress { margin: 6px 12px 0; padding: 9px 10px; border-radius: 8px; background: rgba(255,0,128,0.05); border: 1px solid rgba(255,0,128,0.1); position: relative; z-index: 1; }
.progress-track { height: 5px; border-radius: 3px; background: rgba(255,0,128,0.15); overflow: hidden; }
.progress-fill { width: 67%; height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--magenta), #FF5CAA); animation: progressPulse 1.8s ease-in-out infinite; position: relative; overflow: hidden; }
.progress-stripes { position: absolute; inset: 0; background-image: repeating-linear-gradient(110deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 4px, transparent 4px, transparent 10px); background-size: 20px 100%; animation: progressStripes 0.8s linear infinite; }
.phone-tab { flex: 1; padding: 8px 0; border-radius: 6px; text-align: center; background: rgba(74,90,173,0.08); border: 1px solid rgba(74,90,173,0.1); display: flex; flex-direction: column; align-items: center; gap: 3px; }
.phone-tab-label { font-family: var(--font-body); font-size: 8px; color: var(--text-sec); font-weight: 600; }
</style>
