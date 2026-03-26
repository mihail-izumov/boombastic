<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ICONS = {
  ghost: `<circle cx="9" cy="10" r="1.25" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.25" fill="currentColor" stroke="none"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/>`,
  basket: `<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>`,
  ticket: `<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>`,
  star: `<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>`,
  gem: `<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>`,
}

const SLIDES = [
  { icon: 'ghost', btnWord: 'Круто!', title: 'Все 320+ призов парка в телефоне', desc: 'Смотри что есть, выбирай цель, планируй визит — до, во время и после игры.', accent: '#C5F946' },
  { icon: 'basket', btnWord: 'Понятно!', title: 'Добавляй любые призы в корзину', desc: 'Из витрины, коллекций или джекпота — система сама покажет на что хватает сейчас, а на что надо подкопить.', accent: '#00FF88' },
  { icon: 'ticket', btnWord: 'Класс!', title: 'История тикетов', desc: 'Удобно следить за прогрессом во время игры и планировать следующий визит.', accent: '#FFD60A' },
  { icon: 'star', btnWord: 'Хочу!', title: 'Собирай коллекции', desc: 'Капибара, Аниме, Harry Potter, Стич... Собирай полные коллекции и следи за прогрессом.', accent: '#00D4FF' },
  { icon: 'gem', btnWord: 'Го!', title: 'Джекпот', desc: 'Копи тикеты на колонки, часы и большие конструкторы. Не сливай тикеты на ластик — копи на мечту.', accent: '#FF0080' },
]

const PARKS = [
  { id: 'piterland', name: 'Питерлэнд', count: '320+', href: '/prizes/piterland', color: '#00FF88' },
  { id: 'ohta', name: 'Охта Молл', count: '280+', href: '/prizes/ohtamall', color: '#FF0080' },
]

const step = ref(0)
const dir = ref(1)
const animKey = ref(0)
const touchStartX = ref(null)
const touchStartY = ref(null)
const swiping = ref(false)
const totalSteps = SLIDES.length + 1

const isLastSlide = computed(() => step.value === SLIDES.length)
const slide = computed(() => SLIDES[step.value])
const accentColor = computed(() => slide.value ? slide.value.accent : '#C5F946')
const floatClass = computed(() => `ob__float--${step.value}`)

function next() { if (step.value < totalSteps - 1) { dir.value = 1; animKey.value++; step.value++ } }
function goToStart() { dir.value = -1; animKey.value++; step.value = 0 }
function goTo(i) { dir.value = i > step.value ? 1 : -1; animKey.value++; step.value = i }

function onKey(e) {
  if (e.key === 'ArrowRight' || e.key === ' ') next()
  if (e.key === 'ArrowLeft') goToStart()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  swiping.value = false
}
function onTouchMove(e) {
  if (touchStartX.value === null) return
  const dx = Math.abs(e.touches[0].clientX - touchStartX.value)
  const dy = Math.abs(e.touches[0].clientY - touchStartY.value)
  if (dx > dy && dx > 10) { swiping.value = true; e.preventDefault() }
}
function onTouchEnd(e) {
  if (!swiping.value) { touchStartX.value = null; touchStartY.value = null; return }
  const dx = e.changedTouches[0].clientX - touchStartX.value
  if (dx < -50) next()
  if (dx > 50) goToStart()
  touchStartX.value = null; touchStartY.value = null; swiping.value = false
}

function dotColor(i) {
  if (i === SLIDES.length) return '#C5F946'
  if (i === step.value) return SLIDES[i]?.accent || '#C5F946'
  return 'rgba(255,255,255,0.15)'
}
</script>

<template>
  <div class="ob" @touchstart.passive="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div class="ob__glow" :style="{ background: `radial-gradient(circle, ${isLastSlide ? 'rgba(197,249,70,0.06)' : accentColor + '11'} 0%, transparent 70%)` }" />
    <div class="ob__wrap">

      <!-- SLIDE: flex-grow fills space above dots -->
      <div v-if="!isLastSlide" :key="animKey" class="ob__slide" :style="{ '--dir': dir }">
        <div class="ob__icon" :class="floatClass">
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="108" viewBox="0 0 24 24"
            fill="none" :stroke="slide.accent" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            :style="{ color: slide.accent }" v-html="ICONS[slide.icon]" />
        </div>
        <div class="ob__title">{{ slide.title }}</div>
        <p class="ob__desc">{{ slide.desc }}</p>
      </div>

      <div v-else key="parks" class="ob__slide" :style="{ '--dir': dir }">
        <div class="ob__shark">
          <svg width="120" height="76" viewBox="0 0 241 153" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd"><g transform="matrix(1,0,0,1,-4601.23,-4106.91)"><g transform="matrix(8.77664e-18,0.143333,-0.353616,2.16527e-17,4841.38,4106.91)"><rect x="0" y="0" width="1062.99" height="679.134" style="fill:none"/><g><g transform="matrix(2.6863e-16,-1.77824,4.39328,1.0904e-16,-45825.6,8012.07)"><path d="M4368.24,10448.4L4505.63,10440.8C4505.63,10440.8 4501.3,10486.6 4491.87,10531.6C4475.88,10607.8 4458.86,10662.7 4458.86,10662.7L4260.49,10672.8L4350.14,10534.7L4325.11,10534.8L4365.12,10454.6L4365.14,10454.6L4365.8,10453.3L4368.24,10448.4ZM4272.15,10569.3L4296.18,10569.2L4253.91,10655.4L4123.72,10661.7C4123.72,10661.7 4131.45,10597.1 4145.77,10533.5C4160.78,10466.8 4170.9,10440.7 4170.9,10440.7L4363.5,10430.8L4272.15,10569.3ZM4447.79,10507.4C4446.91,10512.2 4445.97,10516.9 4444.97,10521.7C4436.79,10560.7 4428.35,10593.9 4422.2,10616.6L4337.79,10620.9L4381.48,10530.8C4405.55,10526.2 4427.95,10518.2 4447.79,10507.4ZM4204.13,10496.3C4221.83,10508.5 4242.25,10518.2 4264.55,10524.9L4223.35,10608.9L4179.57,10611C4182.92,10590.9 4187.26,10567.4 4192.52,10544C4196.91,10524.5 4200.83,10508.8 4204.13,10496.3Z" style="fill:#C5F946"/></g></g></g></g></svg>
        </div>
        <div class="ob__park-title">
          <span style="color:#F0F4FF">ВЫБЕРИ</span><br/>
          <span style="color:#C5F946;text-shadow:0 0 30px rgba(197,249,70,0.3)">ПРИЗОТЕКУ</span>
        </div>
        <div class="ob__parks">
          <a v-for="(p, i) in PARKS" :key="p.id" :href="p.href" class="ob__park-card"
            :style="{ borderColor: p.color+'55', background: `linear-gradient(135deg,${p.color}0a,${p.color}04)`, animationDelay: (0.1+i*0.15)+'s' }"
            @mouseenter="$event.currentTarget.style.borderColor=p.color+'99';$event.currentTarget.style.boxShadow=`0 0 30px ${p.color}22`;$event.currentTarget.style.transform='translateY(-2px)'"
            @mouseleave="$event.currentTarget.style.borderColor=p.color+'55';$event.currentTarget.style.boxShadow='none';$event.currentTarget.style.transform='none'">
            <div class="ob__park-shimmer" :style="{ background:`linear-gradient(105deg,transparent 40%,${p.color}08 50%,transparent 60%)` }"/>
            <div style="position:relative;z-index:1">
              <div class="ob__park-name" :style="{color:p.color}">{{ p.name }}</div>
              <div class="ob__park-meta">
                <span class="ob__park-badge" :style="{background:p.color,boxShadow:`0 0 12px ${p.color}44`,animationDelay:(0.3+i*0.15)+'s'}">{{ p.count }}</span>
                <span class="ob__park-sub">призов ждут тебя</span>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="p.color" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="position:relative;z-index:1;flex-shrink:0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- FOOTER: dots + buttons — always at bottom on mobile -->
      <div class="ob__footer">
        <div class="ob__dots">
          <button v-for="(_, i) in totalSteps" :key="i" class="ob__dot"
            :style="{width:i===step?'28px':'8px',background:dotColor(i),boxShadow:i===step?`0 0 12px ${dotColor(i)}66`:'none'}"
            @click="goTo(i)"/>
        </div>
        <div class="ob__buttons">
          <button v-if="!isLastSlide" class="ob__btn-main" :style="{background:slide.accent,boxShadow:`0 4px 24px ${slide.accent}44`}" @click="next">
            {{ slide.btnWord }}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1840" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <button v-if="step>0" class="ob__btn-sec" @click="goToStart">В начало</button>
          <button v-if="!isLastSlide&&step===0" class="ob__btn-sec" @click="goTo(SLIDES.length)">Выбрать парк</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes ob-slideIn {
  from { opacity:0; transform:translateX(calc(var(--dir)*60px)) }
  to { opacity:1; transform:translateX(0) }
}
@keyframes ob-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes ob-parkCardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes ob-badgePop { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }

@keyframes ob-float {
  0%,100% { transform:translateY(0) scale(1) }
  50% { transform:translateY(-14px) scale(1.06) }
}

.ob__float--0 { animation:ob-float 3.5s ease-in-out infinite; filter:drop-shadow(0 6px 24px rgba(197,249,70,0.4)) drop-shadow(0 0 48px rgba(197,249,70,0.15)) }
.ob__float--1 { animation:ob-float 3.5s ease-in-out infinite; filter:drop-shadow(0 6px 24px rgba(0,255,136,0.4)) drop-shadow(0 0 48px rgba(0,255,136,0.15)) }
.ob__float--2 { animation:ob-float 3.5s ease-in-out infinite; filter:drop-shadow(0 6px 24px rgba(255,214,10,0.4)) drop-shadow(0 0 48px rgba(255,214,10,0.15)) }
.ob__float--3 { animation:ob-float 3.5s ease-in-out infinite; filter:drop-shadow(0 6px 24px rgba(0,212,255,0.4)) drop-shadow(0 0 48px rgba(0,212,255,0.15)) }
.ob__float--4 { animation:ob-float 3.5s ease-in-out infinite; filter:drop-shadow(0 6px 24px rgba(255,0,128,0.4)) drop-shadow(0 0 48px rgba(255,0,128,0.15)) }

.ob__shark {
  margin-bottom:28px;
  animation:ob-float 3.5s ease-in-out infinite;
  filter:drop-shadow(0 6px 24px rgba(197,249,70,0.4)) drop-shadow(0 0 48px rgba(197,249,70,0.15));
}

/* ── DESKTOP ── */
.ob {
  min-height:calc(100vh - 64px);
  background:transparent;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:24px 20px 32px;
  font-family:'Inter',sans-serif; color:#F0F4FF;
  position:relative; overflow:hidden;
  touch-action:pan-y;
  -webkit-user-select:none; user-select:none;
}
.ob__glow {
  position:absolute; top:20%; left:50%; transform:translate(-50%,-50%);
  width:600px; height:600px; border-radius:50%;
  filter:blur(80px); transition:background 0.6s ease; pointer-events:none;
}
.ob__wrap {
  max-width:420px; width:100%;
  display:flex; flex-direction:column; align-items:center;
  position:relative; z-index:1;
}
.ob__slide {
  animation:ob-slideIn 0.4s cubic-bezier(0.16,1,0.3,1);
  display:flex; flex-direction:column; align-items:center; text-align:center;
  min-height:320px; justify-content:center; width:100%;
}
.ob__icon { margin-bottom:28px }
.ob__title {
  font-family:'Montserrat',sans-serif; font-weight:700;
  font-size:36px; line-height:40px; margin-bottom:20px;
  color:#F0F4FF; max-width:400px;
}
.ob__desc { font-size:15px; line-height:1.6; color:rgba(255,255,255,0.55); max-width:340px; font-weight:400; margin:0 }
.ob__park-title {
  font-family:'Montserrat',sans-serif; font-weight:700;
  font-size:clamp(26px,7vw,36px); line-height:1;
  margin-bottom:32px; text-transform:uppercase; letter-spacing:0.04em;
}
.ob__parks { display:flex; flex-direction:column; gap:12px; width:100% }
.ob__park-card {
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 22px; border-radius:14px; border:2px solid;
  cursor:pointer; transition:all 0.25s ease; text-decoration:none;
  animation:ob-parkCardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  position:relative; overflow:hidden;
}
.ob__park-shimmer {
  position:absolute; inset:0; border-radius:14px;
  background-size:200% 100%; animation:ob-shimmer 4s linear infinite; pointer-events:none;
}
.ob__park-name { font-family:'Montserrat',sans-serif; font-weight:700; font-size:24px; margin-bottom:6px; text-align:left }
.ob__park-meta { display:flex; align-items:center; gap:8px }
.ob__park-badge {
  display:inline-flex; align-items:center; color:#1a1840;
  font-family:'Space Mono',monospace; font-weight:700; font-size:13px;
  padding:3px 10px; border-radius:6px;
  animation:ob-badgePop 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
.ob__park-sub { font-size:12px; color:rgba(255,255,255,0.5); font-family:'Inter',sans-serif; font-weight:500 }

/* Footer (dots + buttons) — desktop: normal flow */
.ob__footer {
  display:flex; flex-direction:column; align-items:center;
}
.ob__dots { display:flex; gap:10px; margin-top:36px; align-items:center }
.ob__dot { height:8px; border-radius:4px; border:none; cursor:pointer; transition:all 0.3s cubic-bezier(0.16,1,0.3,1); padding:0 }
.ob__buttons { display:flex; flex-direction:column; align-items:center; gap:12px; margin-top:24px; width:100%; max-width:340px }
.ob__btn-main {
  width:100%; padding:16px 32px; border-radius:14px; border:none;
  color:#1a1840; font-family:'Inter',sans-serif; font-size:16px; font-weight:700;
  cursor:pointer; transition:all 0.2s;
  display:flex; align-items:center; justify-content:center; gap:8px;
}
.ob__btn-sec {
  padding:10px 24px; min-width:160px; border-radius:10px;
  border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.06);
  color:rgba(255,255,255,0.5); font-size:14px; font-weight:600;
  cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.2s; text-align:center;
}
.ob__btn-sec:hover { color:rgba(255,255,255,0.75); border-color:rgba(255,255,255,0.3); background:rgba(255,255,255,0.1) }

/* ══════════════════════════════════════
   MOBILE: slide grows, content centered,
   footer pinned to bottom
   ══════════════════════════════════════ */
@media (max-width: 768px) {
  .ob {
    padding: 0 16px !important;
    min-height: calc(100vh - 64px) !important;
    justify-content: stretch !important;
  }

  /* Wrap becomes full-height flex column */
  .ob__wrap {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    min-height: calc(100vh - 64px) !important;
  }

  /* Slide grows to fill all space above footer, content centered inside */
  .ob__slide {
    flex: 1 !important;
    min-height: auto !important;
    justify-content: center !important;
  }

  /* Footer sticks to bottom */
  .ob__footer {
    flex-shrink: 0 !important;
    padding-bottom: 24px !important;
    width: 100% !important;
  }

  /* Icons 2x bigger */
  .ob__icon {
    margin-bottom: 20px !important;
  }
  .ob__icon svg {
    width: 140px !important;
    height: 140px !important;
  }

  .ob__shark {
    margin-bottom: 16px !important;
  }
  .ob__shark svg {
    width: 120px !important;
    height: 76px !important;
  }

  .ob__title {
    font-size: 28px !important;
    line-height: 34px !important;
    margin-bottom: 14px !important;
  }
  .ob__desc {
    font-size: 14px !important;
    max-width: 300px !important;
  }
  .ob__park-title {
    margin-bottom: 24px !important;
    font-size: 28px !important;
  }
  .ob__dots {
    margin-top: 0 !important;
    padding-top: 16px !important;
  }
  .ob__buttons {
    margin-top: 16px !important;
    max-width: 100% !important;
  }
}
</style>
