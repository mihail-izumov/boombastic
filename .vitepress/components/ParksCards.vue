<script setup>
import SectionHeader from './SectionHeader.vue'
import ParkCard from './ParkCard.vue'

const cards = [
  { id: 1, title: 'Парки рядом', desc: '3 локации в Самаре с атмосферой нео-аркады', link: 'НАЙТИ ПАРК', color: '#00D4FF', badge: '3 ПАРКА', icon: 'atom' },
  { id: 2, title: 'Автоматы и игры', desc: 'Аэрохоккей, гонки, баскетбол и кран-машины', link: 'ВСЕ АВТОМАТЫ', color: '#FF0080', badge: '400+АРКАД', icon: 'joystick' },
  { id: 3, title: 'Призы на выбор', desc: 'От брелоков до Razer — заработай своё', link: 'КАТАЛОГ ПРИЗОВ', color: '#FFD60A', badge: '800+ПРИЗОВ', icon: 'gem' },
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
      <div class="boom-slider" style="display: flex; flex-direction: row; flex-wrap: nowrap; gap: 20px; overflow-x: auto; padding: 8px 0 16px">
        <ParkCard v-for="card in cards" :key="card.id" :card="card" :index="card.id - 1" />
      </div>
      <div class="swipe-hint"><span class="swipe-hint-hand">👆</span> листай</div>
    </div>
  </section>
</template>
