<script setup>
/**
 * PrizeIcons — 38 SVG-иконки для Призотеки
 * 
 * Naming: tab_* (вкладки), cat_* (категории), col_* (коллекции), ui_* (UI)
 * Использование: <PrizeIcons name="tab_catalog" :size="32" />
 */
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 14 },
})

// SVG path data indexed by icon name
// All icons use viewBox="0 0 24 24", stroke="currentColor"
const ICONS = {
  // ── TAB ICONS (size 32, with drop-shadow filter) ──────────────
  tab_catalog: {
    size: 32,
    sw: 1.8,
    filter: true,
    filterId: 'd1',
    extra: '<circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none"/>',
    paths: '<path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/>',
  },
  tab_collections: {
    size: 32,
    sw: 1.8,
    filter: true,
    filterId: 'd2',
    paths: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  },
  tab_dream: {
    size: 32,
    sw: 1.8,
    filter: true,
    filterId: 'd3',
    paths: '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>',
  },

  // ── CATEGORY ICONS ────────────────────────────────────────────
  cat_all: {
    paths: '<path d="M15 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 9H3"/><path d="M21 15H3"/>',
  },
  cat_cars: {
    paths: '<path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>',
  },
  cat_constructors: {
    paths: '<rect width="18" height="12" x="3" y="8" rx="1"/><path d="M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3"/><path d="M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3"/>',
  },
  cat_boardgames: {
    paths: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="5"/><path d="M12 12h.01"/>',
  },
  cat_electronics: {
    paths: '<path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z"/><path d="M17 21v-2"/><path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10"/><path d="M21 21v-2"/><path d="M3 5V3"/><path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z"/><path d="M7 5V3"/>',
  },
  cat_figurines: {
    // trophy — фигурки
    paths: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  },
  cat_accessories: {
    // gem — аксессуары
    paths: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
  },
  cat_antistress: {
    // smile — антистресс
    paths: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  },
  cat_stationery: {
    // pencil — канцелярия
    paths: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  },
  cat_sweets: {
    // candy — сладости
    paths: '<path d="m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z"/><path d="M14 6.5v10"/><path d="M10 7.5v10"/><path d="m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3a3 3 0 0 0 .32 1.33L22 7"/><path d="m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17"/>',
  },

  // ── COLLECTION ICONS ──────────────────────────────────────────
  col_harry_potter: {
    paths: '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/>',
  },
  col_stitch: {
    paths: '<path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"/><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/>',
  },
  col_capybara: {
    paths: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
  },
  col_minecraft: {
    paths: '<path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999"/><path d="M15.973 4.027A13 13 0 0 0 5.902 2.373c-1.398.342-1.092 2.158.277 2.601a19.9 19.9 0 0 1 5.822 3.024"/><path d="M16.001 11.999a19.9 19.9 0 0 1 3.024 5.824c.444 1.369 2.26 1.676 2.603.278A13 13 0 0 0 20 8.069"/><path d="M18.352 3.352a1.205 1.205 0 0 0-1.704 0l-5.296 5.296a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l5.296-5.296a1.205 1.205 0 0 0 0-1.704z"/>',
  },
  col_mario: {
    paths: '<path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>',
  },
  col_disney: {
    paths: '<path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M15 2v5h4l1 4H4l1-4h4V2"/><path d="M11 2v5"/><path d="M9 22v-5a3 3 0 0 1 6 0v5"/>',
  },
  col_kitty: {
    paths: '<path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.1 6.87-.25.27.27.47.58.62.92.37.78.53 1.64.53 2.52A10 10 0 0 1 12 21.5 10 10 0 0 1 1.98 8.45c0-.88.16-1.74.53-2.52.15-.34.35-.65.62-.92C5.97 3.16 9.22 3.26 11 5.26c.32-.08.65-.15 1-.2z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>',
  },
  col_kuromi: {
    paths: '<circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"/>',
  },
  col_stranger_things: {
    paths: '<rect width="20" height="16" x="2" y="4" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M8 12h8"/><circle cx="16" cy="10" r="2"/><path d="m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3"/>',
  },
  col_anime: {
    paths: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
  },

  // ── UI ICONS ──────────────────────────────────────────────────
  ui_check: {
    sw: 2.5,
    paths: '<path d="M20 6 9 17l-5-5"/>',
  },
  ui_plus: {
    paths: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  },
  ui_arrow_right: {
    paths: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  },
  ui_ticket: {
    sw: 2.5,
    paths: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
  },
  ui_trophy: {
    sw: 2.5,
    paths: '<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-20 0V5a2 2 0 0 1 2-2z"/><path d="m8 10 4 4 4-4"/>',
  },
  ui_chevron_down: {
    paths: '<path d="m6 9 6 6 6-6"/>',
  },
  ui_chevron_double_down: {
    sw: 2.5,
    paths: '<path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/>',
  },
  ui_x: {
    sw: 2.5,
    paths: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  },
  ui_smile: {
    paths: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  },
  ui_trash: {
    paths: '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  },
  ui_search: {
    paths: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  },
  ui_bell: {
    paths: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  },
  ui_star: {
    paths: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  ui_cart: {
    paths: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  },
}

const iconData = computed(() => ICONS[props.name])

const svgSize = computed(() => {
  if (iconData.value?.size) return iconData.value.size
  return props.size
})

const strokeWidth = computed(() => iconData.value?.sw || 2)
</script>

<template>
  <svg
    v-if="iconData"
    xmlns="http://www.w3.org/2000/svg"
    :width="svgSize"
    :height="svgSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :filter="undefined"
    style="display: inline; vertical-align: middle; flex-shrink: 0;"
  >
    <!-- Drop-shadow filter for tab icons -->
    <defs v-if="iconData.filter">
      <filter :id="iconData.filterId">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="0" dy="2" result="o" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.4" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <!-- Extra elements (e.g. filled circles for eyes) -->
    <g v-if="iconData.extra" v-html="iconData.extra" />
    <!-- Main paths -->
    <g v-html="iconData.paths" />
  </svg>
  <!-- Fallback: question mark -->
  <span v-else style="font-size: 14px; opacity: 0.4;">?</span>
</template>
