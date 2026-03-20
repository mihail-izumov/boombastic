<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const emit = defineEmits(['done'])
let timer = null
const phase = ref(0)
onMounted(() => {
  requestAnimationFrame(() => { phase.value = 1 })
  setTimeout(() => { phase.value = 2 }, 300)
  setTimeout(() => { phase.value = 3 }, 2200)
  timer = setTimeout(() => emit('done'), 3200)
})
onUnmounted(() => { if (timer) clearTimeout(timer) })
const bits = Array.from({ length: 28 }, (_, i) => ({
  left: `${2 + Math.random() * 96}%`,
  delay: Math.random() * 0.8,
  dur: 1.5 + Math.random() * 1.2,
  char: ['🎟️', '✨', '⚡', '🎯', '🏆', '🎁', '🎮'][i % 7],
  size: 32 + Math.floor(Math.random() * 22),
}))
</script>
<template>
  <Teleport to="body">
    <div style="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:none;">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.85);" />
      <span v-for="(b, i) in bits" :key="i" :style="{position:'absolute',top:'-8%',left:b.left,fontSize:b.size+'px',animation:`boom-fall ${b.dur}s ${b.delay}s ease-in forwards`}">{{ b.char }}</span>
      <div :style="{position:'relative',zIndex:1,textAlign:'center',width:'100%',padding:'0 12px',opacity:phase>=1?1:0,transform:phase>=1?'scale(1) translateY(0)':'scale(0.5) translateY(30px)',transition:'all 0.8s cubic-bezier(0.22,1,0.36,1)'}">
        <!-- Ambient glow behind text -->
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);width:90%;height:140px;background:radial-gradient(ellipse,rgba(255,214,10,0.45) 0%,rgba(255,214,10,0.12) 35%,transparent 65%);pointer-events:none;filter:blur(24px);" />
        <div style="position:relative;font-size:clamp(30px,7vw,72px);color:#FFD60A;letter-spacing:-1px;font-family:'Space Mono',monospace;font-weight:700;white-space:nowrap;display:inline-flex;align-items:baseline;line-height:1.5;padding:8px 0;">
          <span>Б</span>
          <span>00</span>
          <span :style="{display:'inline-block',overflow:'hidden',verticalAlign:'baseline',lineHeight:'inherit',maxWidth:phase>=2&&phase<3?'5em':'0',transition:phase>=2?'max-width 0.8s ease-in-out':'max-width 0.6s ease-in-out'}">0000000</span>
          <span>М!</span>
        </div>
        <div style="font-size:18px;color:#FFD60A;margin-top:8px;font-family:'Inter',sans-serif;font-weight:700;text-shadow:0 0 20px rgba(255,214,10,0.6),0 0 40px rgba(255,214,10,0.3);letter-spacing:0.05em;">Лови приз!</div>
      </div>
    </div>
  </Teleport>
</template>
<style>
@keyframes boom-fall {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  50%  { opacity: 0.9; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}
</style>
