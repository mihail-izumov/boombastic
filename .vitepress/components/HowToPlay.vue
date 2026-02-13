<script setup>
import { useReveal } from '../composables/useReveal'
import CutBtn from './CutBtn.vue'
import SectionHeader from './SectionHeader.vue'

const { elRef, visible } = useReveal()

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

      <div class="boom-content-narrow">
        <!-- Steps -->
        <div
          v-for="(s, i) in steps"
          :key="i"
          :style="{
            display: 'flex', gap: '18px', alignItems: 'flex-start',
            marginBottom: i < 2 ? '8px' : '0',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateX(-16px)',
            transition: `all 0.5s cubic-bezier(0.23,1,0.32,1) ${0.1 + i * 0.1}s`,
          }"
        >
          <div style="flex-shrink: 0; display: flex; flex-direction: column; align-items: center">
            <div :style="{
              width: '52px', height: '52px', borderRadius: '50%',
              background: `linear-gradient(165deg, color-mix(in srgb, ${s.color} 20%, transparent), var(--bg-deep))`,
              border: `2px solid ${s.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }">
              <svg v-if="i === 0" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: s.color }"><path d="M13.5 8h-3"/><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"/><path d="M16.899 22A5 5 0 0 0 7.1 22"/><path d="m9 2 3 6"/><circle cx="12" cy="15" r="3"/></svg>
              <svg v-if="i === 1" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: s.color }"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
              <svg v-if="i === 2" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: s.color }"><path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z"/><path d="M6 15v-2"/><path d="M12 15V9"/><circle cx="12" cy="6" r="3"/></svg>
            </div>
            <div v-if="i < 2" :style="{ width: '3px', height: '28px', borderRadius: '2px', background: `linear-gradient(180deg, ${s.color}, ${steps[i+1].color})`, opacity: 0.4 }" />
          </div>
          <div style="padding-top: 6px">
            <div style="display: flex; align-items: center; gap: 7px; margin-bottom: 3px">
              <span :style="{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: s.color, fontWeight: 700, opacity: 0.6 }">{{ s.num }}</span>
              <span style="font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text-pri)">{{ s.title }}</span>
            </div>
            <p style="font-family: var(--font-body); font-size: 13px; color: var(--text-sec); line-height: 1.5; margin: 0">{{ s.desc }}</p>
          </div>
        </div>

        <!-- Result block -->
        <div :style="{
          marginTop: '20px', padding: '14px 18px', borderRadius: '10px',
          background: 'rgba(197,249,70,0.06)', border: '1px solid rgba(197,249,70,0.15)',
          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
          opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.5s',
        }">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--lime)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0"><path d="M10 14.66v1.63a2 2 0 0 1-.98 1.7A5 5 0 0 0 7 21.98"/><path d="M14 14.66v1.63a2 2 0 0 0 .98 1.7A5 5 0 0 1 17 21.98"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/></svg>
          <div style="flex: 1; min-width: 160px">
            <div style="font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--lime)">Результат: 800+ призов на выбор</div>
            <div style="font-family: var(--font-body); font-size: 12px; color: var(--text-sec); margin-top: 2px">От брелоков до колонок и мышек Razer</div>
          </div>
          <CutBtn label="К призам →" lime compact rounded />
        </div>
      </div>
    </div>
  </section>
</template>
