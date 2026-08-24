<script setup lang="ts">
import { useCv } from '~/composables/useCv'
import {
  DENSITY_CHOICES,
  FONT_CHOICES,
  SECTION_LABELS,
} from '~/constants/sections'
import type { SectionId } from '~/types/cv'

const { cv } = useCv()

const open = reactive<Record<string, boolean>>({
  sections: true,
  accent: false,
  typography: false,
})

const ACCENT_PRESETS = [
  '#2563eb',
  '#059669',
  '#0f766e',
  '#9333ea',
  '#e11d48',
  '#f59e0b',
  '#0ea5e9',
  '#1f2937',
]

const dragIndex = ref<number | null>(null)

function move(from: number, to: number) {
  const order = cv.value.settings.sectionOrder
  if (to < 0 || to >= order.length) return
  const [item] = order.splice(from, 1)
  order.splice(to, 0, item)
}

function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) {
    dragIndex.value = null
    return
  }
  move(dragIndex.value, index)
  dragIndex.value = null
}

function isHidden(id: SectionId) {
  return cv.value.settings.hidden.includes(id)
}

function toggleHidden(id: SectionId) {
  const hidden = cv.value.settings.hidden
  const i = hidden.indexOf(id)
  if (i === -1) hidden.push(id)
  else hidden.splice(i, 1)
}

const hasCustomAccent = computed(() => cv.value.settings.accentColor !== '')

function setAccent(color: string) {
  cv.value.settings.accentColor = color
}

function useThemeAccent() {
  cv.value.settings.accentColor = ''
}
</script>

<template>
  <div class="space-y-3">
    <!-- Sections: reorder + show/hide -->
    <section class="panel">
      <button class="panel-head" @click="open.sections = !open.sections">
        <span>Sections (ordre &amp; visibilité)</span>
        <span>{{ open.sections ? '−' : '+' }}</span>
      </button>
      <div v-show="open.sections" class="panel-body">
        <p class="hint">Glissez pour réordonner, ou utilisez les flèches. Cliquez sur l’œil pour masquer.</p>
        <ul class="sec-list">
          <li
            v-for="(id, index) in cv.settings.sectionOrder"
            :key="id"
            class="sec-row"
            :class="{ dragging: dragIndex === index, hidden: isHidden(id) }"
            draggable="true"
            @dragstart="dragIndex = index"
            @dragover.prevent
            @drop="onDrop(index)"
            @dragend="dragIndex = null"
          >
            <span class="handle" aria-hidden="true">⠿</span>
            <span class="sec-name">{{ SECTION_LABELS[id] }}</span>
            <span class="sec-actions">
              <button
                class="icon-btn"
                title="Monter"
                :disabled="index === 0"
                @click="move(index, index - 1)"
              >▲</button>
              <button
                class="icon-btn"
                title="Descendre"
                :disabled="index === cv.settings.sectionOrder.length - 1"
                @click="move(index, index + 1)"
              >▼</button>
              <button
                class="icon-btn eye"
                :title="isHidden(id) ? 'Afficher' : 'Masquer'"
                @click="toggleHidden(id)"
              >{{ isHidden(id) ? '🚫' : '👁' }}</button>
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Accent color -->
    <section class="panel">
      <button class="panel-head" @click="open.accent = !open.accent">
        <span>Couleur d’accent</span>
        <span>{{ open.accent ? '−' : '+' }}</span>
      </button>
      <div v-show="open.accent" class="panel-body space-y-3">
        <div class="swatches">
          <button
            v-for="c in ACCENT_PRESETS"
            :key="c"
            class="swatch"
            :class="{ active: cv.settings.accentColor === c }"
            :style="{ background: c }"
            :title="c"
            @click="setAccent(c)"
          />
        </div>
        <div class="accent-row">
          <label class="accent-custom">
            <input
              type="color"
              :value="cv.settings.accentColor || '#2563eb'"
              @input="setAccent(($event.target as HTMLInputElement).value)"
            />
            <span>Personnalisée</span>
          </label>
          <button
            class="reset-btn"
            :class="{ active: !hasCustomAccent }"
            @click="useThemeAccent"
          >
            Couleur du thème
          </button>
        </div>
      </div>
    </section>

    <!-- Typography: font + density -->
    <section class="panel">
      <button class="panel-head" @click="open.typography = !open.typography">
        <span>Police &amp; densité</span>
        <span>{{ open.typography ? '−' : '+' }}</span>
      </button>
      <div v-show="open.typography" class="panel-body space-y-3">
        <div class="field">
          <span class="field-label">Police</span>
          <div class="segmented">
            <button
              v-for="f in FONT_CHOICES"
              :key="f.id || 'default'"
              class="seg"
              :class="{ active: cv.settings.fontFamily === f.id }"
              @click="cv.settings.fontFamily = f.id"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
        <div class="field">
          <span class="field-label">Densité</span>
          <div class="segmented">
            <button
              v-for="d in DENSITY_CHOICES"
              :key="d.id"
              class="seg"
              :class="{ active: cv.settings.density === d.id }"
              @click="cv.settings.density = d.id"
            >
              {{ d.label }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.panel {
  @apply rounded-lg border border-gray-700 bg-gray-800/60 overflow-hidden;
}

.panel-head {
  @apply w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-100 hover:bg-gray-700/50 transition-colors;
}

.panel-body {
  @apply px-4 pb-4 pt-1;
}

.hint {
  @apply mb-2 text-[11px] text-gray-500;
}

.sec-list {
  @apply space-y-1.5;
}

.sec-row {
  @apply flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/60 px-2.5 py-2 text-sm text-gray-200;
  cursor: grab;
}

.sec-row.dragging {
  @apply border-blue-500 opacity-60;
}

.sec-row.hidden {
  @apply opacity-50;
}

.sec-row.hidden .sec-name {
  @apply line-through;
}

.handle {
  @apply cursor-grab text-gray-500 select-none;
}

.sec-name {
  @apply flex-1;
}

.sec-actions {
  @apply flex items-center gap-1;
}

.icon-btn {
  @apply rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-700 hover:text-gray-100 disabled:opacity-30 disabled:hover:bg-transparent;
}

.swatches {
  @apply flex flex-wrap gap-2;
}

.swatch {
  @apply h-7 w-7 rounded-full border-2 border-transparent;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.swatch.active {
  @apply border-white ring-2 ring-blue-400;
}

.accent-row {
  @apply flex items-center justify-between gap-3;
}

.accent-custom {
  @apply flex items-center gap-2 text-sm text-gray-300;
}

.accent-custom input[type='color'] {
  @apply h-8 w-10 cursor-pointer rounded border border-gray-600 bg-transparent p-0;
}

.reset-btn {
  @apply rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700;
}

.reset-btn.active {
  @apply border-blue-500 bg-blue-500/10 text-white;
}

.field-label {
  @apply mb-1 block text-xs font-medium text-gray-400;
}

.segmented {
  @apply inline-flex overflow-hidden rounded-md border border-gray-600;
}

.seg {
  @apply px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 border-r border-gray-600;
}

.seg:last-child {
  @apply border-r-0;
}

.seg.active {
  @apply bg-blue-600 text-white;
}
</style>
