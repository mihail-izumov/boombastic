<script setup>
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import SectionHeader from './SectionHeader.vue'

const { elRef, visible } = useReveal()

function rgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}

const levels = [
  { name: 'СТАНДАРТ', color: '#7a7aad', borderC: 'rgba(122,122,173,0.3)', gradient: 'linear-gradient(165deg,#2a2a50,#201e40)', desc: 'Новый гость', perks: ['B00M!-карта бесплатно', 'Базовые призы', 'Копи тикеты'] },
  { name: 'СЕРЕБРО', color: '#00D4FF', borderC: 'rgba(0,212,255,0.3)', gradient: 'linear-gradient(165deg,#1a2a4a,#101e38)', desc: 'Система заметила', perks: ['+10% к тикетам', 'Ранний доступ к призам', 'Бонусные заряды'] },
  { name: 'ЗОЛОТО', color: '#FFD60A', borderC: 'rgba(255,214,10,0.3)', gradient: 'linear-gradient(165deg,#2a2510,#1e1c0a)', desc: 'Оба глаза на тебе', perks: ['+25% к тикетам', 'VIP-доступ', 'Эксклюзивные призы'] },
]

const hoveredCard = ref(-1)
</script>

<template>
  <section ref="elRef" class="boom-section">
    <div class="boom-wrap">
      <SectionHeader
        tag="СТАТУСЫ ИГРОКОВ"
        title="Прокачай уровень"
        subtitle="Чем больше играешь — тем больше получаешь"
        linkText="ПОДРОБНЕЕ О СТАТУСАХ"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
        </template>
      </SectionHeader>
    </div>

    <div class="boom-wrap">
      <div class="hide-scroll" style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 12px">
        <div
          v-for="(lvl, i) in levels"
          :key="i"
          @mouseenter="hoveredCard = i"
          @mouseleave="hoveredCard = -1"
          :style="{
            flex: '0 0 280px', minWidth: '250px', borderRadius: '14px',
            position: 'relative', overflow: 'hidden',
            border: `1.5px solid ${hoveredCard === i ? lvl.color : lvl.borderC}`,
            background: lvl.gradient,
            transform: visible ? (hoveredCard === i ? 'translateY(-4px)' : 'none') : 'translateY(20px)',
            opacity: visible ? 1 : 0,
            boxShadow: hoveredCard === i ? `0 10px 30px ${rgba(lvl.color, 0.12)}` : 'none',
            transition: `transform 0.4s ease ${i * 0.1}s, opacity 0.5s ease ${i * 0.1}s, border-color 0.3s, box-shadow 0.3s`,
          }"
        >
          <!-- Header -->
          <div :style="{
            padding: '24px 22px 16px', textAlign: 'center',
            borderBottom: `1px solid ${rgba(lvl.color, 0.1)}`,
            position: 'relative',
          }">
            <!-- Grid pattern -->
            <svg width="100%" height="100%" :style="{ position: 'absolute', inset: 0, opacity: hoveredCard === i ? 0.07 : 0.03, transition: 'opacity 0.3s' }">
              <defs><pattern :id="'lg' + i" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" :stroke="lvl.color" stroke-width="0.4" /></pattern></defs>
              <rect width="100%" height="100%" :fill="'url(#lg' + i + ')'" />
            </svg>
            <!-- Name badge -->
            <div :style="{
              display: 'inline-block', padding: '6px 24px', borderRadius: '5px',
              background: `linear-gradient(180deg, ${rgba(lvl.color, 0.2)}, ${rgba(lvl.color, 0.05)})`,
              border: `1px solid ${rgba(lvl.color, 0.3)}`,
              position: 'relative',
            }">
              <span :style="{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: lvl.color, letterSpacing: '0.1em' }">{{ lvl.name }}</span>
            </div>
            <div :style="{
              fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: 600,
              color: lvl.name === 'ЗОЛОТО' ? '#FFD60A' : 'var(--text-pri)',
              marginTop: '10px', position: 'relative',
            }">{{ lvl.desc }}</div>
          </div>
          <!-- Perks -->
          <div style="padding: 16px 22px 22px">
            <div v-for="(p, j) in lvl.perks" :key="j" :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: j < lvl.perks.length - 1 ? '10px' : '18px' }">
              <div :style="{ width: '5px', height: '5px', borderRadius: '1px', background: lvl.color, boxShadow: `0 0 6px ${rgba(lvl.color, 0.5)}`, flexShrink: 0 }" />
              <span style="font-family: var(--font-body); font-size: 13px; color: var(--text-pri)">{{ p }}</span>
            </div>
            <!-- CTA -->
            <div :style="{
              padding: '9px 0', borderRadius: '7px', textAlign: 'center',
              border: `1px solid ${rgba(lvl.color, hoveredCard === i ? 0.5 : 0.25)}`,
              background: rgba(lvl.color, hoveredCard === i ? 0.12 : 0.05),
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
              color: lvl.color, letterSpacing: '0.04em',
              transition: 'all 0.3s', cursor: 'pointer',
            }">Получить карту</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
