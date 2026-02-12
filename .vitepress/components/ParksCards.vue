<script setup>
import { ref, computed } from 'vue'
import { useReveal } from '../composables/useReveal'
import SectionHeader from './SectionHeader.vue'

const cards = [
  { id: 1, title: 'Парки рядом', desc: '3 локации в Самаре с атмосферой нео-аркады', link: 'НАЙТИ ПАРК', color: '#00D4FF', badge: '3 ПАРКА', icon: 'atom' },
  { id: 2, title: 'Автоматы и игры', desc: 'Аэрохоккей, гонки, баскетбол и кран-машины', link: 'ВСЕ АВТОМАТЫ', color: '#FF0080', badge: '400+ АРКАД', icon: 'joystick' },
  { id: 3, title: 'Призы на выбор', desc: 'От брелоков до Razer — заработай своё', link: 'КАТАЛОГ ПРИЗОВ', color: '#FFD60A', badge: '800+ ПРИЗОВ', icon: 'gem' },
]
</script>

<template>
  <section id="parks" class="boom-section">
    <div class="boom-wrap">
      <SectionHeader tag="ПАРКИ" title="В каждом парке">
        <template #icon>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--lime)"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>
        </template>
      </SectionHeader>
    </div>
    <div class="boom-wrap">
      <div class="hide-scroll" style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 12px">
        <ParkCard v-for="(card, i) in cards" :key="card.id" :card="card" :index="i" />
      </div>
    </div>
  </section>
</template>

<!-- ParkCard sub-component -->
<script>
import { defineComponent, ref } from 'vue'
import { useReveal } from '../composables/useReveal'

const ParkCard = defineComponent({
  name: 'ParkCard',
  props: { card: Object, index: Number },
  setup(props) {
    const hovered = ref(false)
    const { elRef, visible } = useReveal(props.index * 100)
    return { hovered, elRef, visible }
  },
  computed: {
    c() { return this.card.color },
    rgba() {
      return (hex, a) => {
        const r = parseInt(hex.slice(1,3),16)
        const g = parseInt(hex.slice(3,5),16)
        const b = parseInt(hex.slice(5,7),16)
        return `rgba(${r},${g},${b},${a})`
      }
    }
  },
  template: `
    <div
      ref="elRef"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      :style="{
        flex: '0 0 320px', minWidth: '280px', position: 'relative', borderRadius: '12px', cursor: 'pointer',
        transform: visible ? (hovered ? 'translateY(-6px)' : 'none') : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s ease, opacity 0.5s ease',
        display: 'flex', flexDirection: 'column',
      }"
    >
      <!-- Gradient border -->
      <div :style="{
        position: 'absolute', inset: '-1px', borderRadius: '13px',
        background: 'linear-gradient(135deg, ' + rgba(c, hovered ? 0.45 : 0.15) + ', transparent 50%, ' + rgba(c, hovered ? 0.2 : 0.08) + ')',
        transition: 'background 0.4s',
      }" />
      <!-- Card body -->
      <div :style="{
        position: 'relative', margin: '1px', borderRadius: '11px', overflow: 'hidden',
        background: 'linear-gradient(165deg, rgba(34,32,80,0.95), rgba(28,26,62,0.98))',
        display: 'flex', flexDirection: 'column', flex: 1,
      }">
        <!-- Icon area -->
        <div :style="{
          position: 'relative', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderBottom: '1px solid ' + rgba(c, 0.12),
        }">
          <!-- Grid pattern -->
          <svg width="100%" height="100%" :style="{ position: 'absolute', inset: 0, opacity: hovered ? 0.25 : 0.12, transition: 'opacity 0.4s' }">
            <defs><pattern :id="'cg' + card.id" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" :stroke="c" stroke-width="0.6" /></pattern></defs>
            <rect width="100%" height="100%" :fill="'url(#cg' + card.id + ')'" />
          </svg>
          <!-- Glow -->
          <div :style="{
            position: 'absolute', width: '180px', height: '180px', borderRadius: '50%',
            background: 'radial-gradient(circle, ' + rgba(c, hovered ? 0.16 : 0.06) + ' 0%, transparent 70%)',
            transition: 'all 0.5s', transform: hovered ? 'scale(1.3)' : 'none',
          }" />
          <!-- Badge -->
          <div :style="{
            position: 'absolute', top: '10px', right: '10px',
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 14px', borderRadius: '5px',
            background: rgba(c, 0.12), border: '1px solid ' + rgba(c, 0.3),
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', color: c,
          }">
            {{ card.badge }}
          </div>
          <!-- Corner marks -->
          <div :style="{ position: 'absolute', top: '10px', left: '10px', width: '14px', height: '14px', borderLeft: '2px solid ' + c, borderTop: '2px solid ' + c, opacity: hovered ? 0.7 : 0.2, transition: 'opacity 0.3s' }" />
          <div :style="{ position: 'absolute', bottom: '10px', right: '10px', width: '14px', height: '14px', borderRight: '2px solid ' + c, borderBottom: '2px solid ' + c, opacity: hovered ? 0.7 : 0.2, transition: 'opacity 0.3s' }" />
          <!-- Icon (100x100) -->
          <div :style="{ position: 'relative', zIndex: 2, color: c, transform: hovered ? 'scale(1.08)' : 'none', transition: 'transform 0.4s', opacity: hovered ? 1 : 0.7 }">
            <svg v-if="card.icon === 'atom'" viewBox="0 0 24 24" width="100" height="100" fill="none" :stroke="c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>
            <svg v-if="card.icon === 'joystick'" viewBox="0 0 24 24" width="100" height="100" fill="none" :stroke="c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z"/><path d="M6 15v-2"/><path d="M12 15V9"/><circle cx="12" cy="6" r="3"/></svg>
            <svg v-if="card.icon === 'gem'" viewBox="0 0 24 24" width="100" height="100" fill="none" :stroke="c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/></svg>
          </div>
        </div>
        <!-- Text content -->
        <div style="padding: 14px 18px 18px; flex: 1; display: flex; flex-direction: column">
          <div :style="{ fontFamily: 'var(--font-head)', fontSize: '17px', fontWeight: 700, color: c, marginBottom: '4px' }">{{ card.title }}</div>
          <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-sec); margin-bottom: 14px; line-height: 1.5; flex: 1">{{ card.desc }}</div>
          <div :style="{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: hovered ? c : 'var(--text-pri)', letterSpacing: '0.04em', transition: 'color 0.3s' }">{{ card.link }} →</div>
        </div>
      </div>
    </div>
  `,
})

export default { components: { ParkCard } }
</script>
