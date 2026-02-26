<script setup>
import { ref } from 'vue'
import { useReveal } from '../composables/useReveal'

const { elRef, visible } = useReveal()

const levels = [
  { id: 'standard', name: 'СТАНДАРТ', games: '21', bonus: null, color: '#C8C8D8', hoverColor: '#FFFFFF', icon: 'bow' },
  { id: 'silver', name: 'СЕРЕБРО', games: '25', bonus: '+4', color: '#00D4FF', hoverColor: '#00D4FF', icon: 'swords' },
  { id: 'gold', name: 'ЗОЛОТО', games: '30', bonus: '+9', color: '#FFD60A', hoverColor: '#FFD60A', icon: 'medal' },
  { id: 'platinum', name: 'ПЛАТИНА', games: '42', bonus: '×2', color: '#FF0080', hoverColor: '#FF0080', icon: 'crown' },
]

const hoveredCard = ref(-1)
</script>

<template>
  <section ref="elRef" class="boom-section">
    <div class="boom-wrap">
      <!-- Custom header without SectionHeader component -->
      <div class="lty-header">
        <div class="lty-tag">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lty-tag-icon">
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
            <path d="M5 21h14"/>
          </svg>
          СТАТУСЫ ИГРОКОВ
        </div>
        <h2 class="lty-title">Прокачай уровень</h2>
        <p class="lty-subtitle">
          До <span class="lty-subtitle-accent">×2 больше игр</span> за те же деньги
        </p>
        <div class="lty-link-wrap">
          <a href="/rewards" class="lty-link">
            ПОДРОБНЕЕ О СТАТУСАХ
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="boom-wrap">
      <div class="lty-grid">
        <template v-for="(lvl, i) in levels" :key="lvl.id">
          <!-- Card -->
          <a
            href="/rewards"
            class="lty-card"
            @mouseenter="hoveredCard = i"
            @mouseleave="hoveredCard = -1"
            :style="{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${i * 0.1}s`,
              borderColor: hoveredCard === i ? lvl.hoverColor : `${lvl.color}60`,
              boxShadow: hoveredCard === i ? `0 0 25px ${lvl.hoverColor}25` : 'none',
              background: hoveredCard === i ? `linear-gradient(165deg, ${lvl.hoverColor}12, ${lvl.hoverColor}05)` : '#222050',
            }"
          >
            <!-- Name at top -->
            <div class="lty-name" :style="{ color: hoveredCard === i ? lvl.hoverColor : lvl.color }">
              {{ lvl.name }}
            </div>
            
            <!-- Bonus badge above icon -->
            <div class="lty-bonus-wrap">
              <div 
                v-if="lvl.bonus" 
                class="lty-bonus"
                :style="{ 
                  background: `${hoveredCard === i ? lvl.hoverColor : lvl.color}20`,
                  borderColor: `${hoveredCard === i ? lvl.hoverColor : lvl.color}50`,
                  color: hoveredCard === i ? lvl.hoverColor : lvl.color,
                }"
              >
                {{ lvl.bonus }}
              </div>
              <div v-else class="lty-bonus lty-bonus-base">
                базовый
              </div>
            </div>
            
            <!-- Icon Box -->
            <div 
              class="lty-icon"
              :style="{ 
                borderColor: hoveredCard === i ? lvl.hoverColor : lvl.color,
                background: hoveredCard === i ? lvl.hoverColor : 'rgba(255,255,255,0.05)',
                boxShadow: hoveredCard === i ? `0 0 20px ${lvl.hoverColor}40` : 'none',
              }"
            >
              <!-- Bow -->
              <svg v-if="lvl.icon === 'bow'" width="26" height="26" viewBox="0 0 24 24" fill="none" :stroke="hoveredCard === i ? '#0D1421' : lvl.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/>
              </svg>
              <!-- Swords -->
              <svg v-else-if="lvl.icon === 'swords'" width="26" height="26" viewBox="0 0 24 24" fill="none" :stroke="hoveredCard === i ? '#0D1421' : lvl.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>
              </svg>
              <!-- Medal -->
              <svg v-else-if="lvl.icon === 'medal'" width="26" height="26" viewBox="0 0 24 24" fill="none" :stroke="hoveredCard === i ? '#0D1421' : lvl.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>
              </svg>
              <!-- Crown -->
              <svg v-else-if="lvl.icon === 'crown'" width="26" height="26" viewBox="0 0 24 24" fill="none" :stroke="hoveredCard === i ? '#0D1421' : lvl.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>
              </svg>
            </div>
            
            <!-- Games count -->
            <div 
              class="lty-games"
              :style="{ 
                color: hoveredCard === i ? lvl.hoverColor : lvl.color,
                textShadow: hoveredCard === i ? `0 0 15px ${lvl.hoverColor}60` : 'none',
              }"
            >
              {{ lvl.games }}
            </div>
            
            <!-- "ИГР" label -->
            <div class="lty-games-label" :style="{ color: hoveredCard === i ? lvl.hoverColor : lvl.color }">
              ИГР
            </div>
          </a>

          <!-- Arrow between cards -->
          <div 
            v-if="i < levels.length - 1" 
            class="lty-arrow"
            :style="{ 
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${0.3 + i * 0.1}s`,
            }"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="var(--bg-deep, #1c1a3e)"/>
              <path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </template>
      </div>
      
      <!-- Bottom note -->
      <div class="lty-note">
        * расчёт для 1500₽ при средней цене игры ~70₽
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Header block */
.lty-header {
  text-align: center;
}

.lty-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(197, 249, 70, 0.1);
  border: 1px solid rgba(197, 249, 70, 0.25);
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: var(--lime, #C5F946);
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.lty-tag-icon {
  color: var(--lime, #C5F946);
}

.lty-title {
  font-family: 'Montserrat', sans-serif !important;
  font-size: 32px !important;
  font-weight: 700 !important;
  color: #F0F4FF !important;
  margin: 0 0 6px 0 !important;
  line-height: 1.2 !important;
}

.lty-subtitle {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  line-height: 1.4;
}

.lty-subtitle-accent {
  color: #FF0080;
  font-weight: 700;
}

.lty-link-wrap {
  margin-bottom: 28px;
}

.lty-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  font-weight: 600;
  color: var(--lime, #C5F946);
  text-decoration: none;
  letter-spacing: 0.02em;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.lty-link:hover {
  opacity: 1;
}

/* Grid */
.lty-grid {
  display: flex;
  gap: 0;
  justify-content: center;
  align-items: stretch;
  padding: 8px 0 12px;
}

.lty-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px 20px;
  border-radius: 14px;
  border: 1.5px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.lty-name {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  transition: color 0.3s ease;
}

.lty-bonus-wrap {
  width: 56px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.lty-bonus {
  width: 100%;
  padding: 5px 0;
  border: 1.5px solid;
  border-radius: 12px;
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  transition: all 0.3s ease;
}

.lty-bonus-base {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.25);
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
}

.lty-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  transition: all 0.3s ease;
}

.lty-games {
  font-family: var(--font-mono, monospace);
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.lty-games-label {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  opacity: 0.7;
  transition: color 0.3s ease;
}

.lty-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  flex-shrink: 0;
}

.lty-note {
  text-align: center;
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255,255,255,0.3);
}

/* Mobile */
@media (max-width: 640px) {
  .lty-title {
    font-size: 26px !important;
  }

  .lty-link-wrap {
    margin-bottom: 20px;
  }

  .lty-grid {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .lty-card {
    flex: 0 0 calc(50% - 4px);
    min-width: 0;
  }
  
  .lty-arrow {
    display: none;
  }
  
  .lty-name {
    font-size: 10px;
  }
  
  .lty-bonus-wrap {
    width: 48px;
    height: 22px;
    margin-bottom: 12px;
  }
  
  .lty-bonus {
    font-size: 11px;
    padding: 3px 0;
    border-radius: 10px;
  }
  
  .lty-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
  }
  
  .lty-icon svg {
    width: 22px;
    height: 22px;
  }
  
  .lty-games {
    font-size: 24px;
  }
  
  .lty-games-label {
    font-size: 10px;
  }
}
</style>
