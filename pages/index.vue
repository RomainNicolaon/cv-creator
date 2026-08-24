<script setup lang="ts">
import { themes } from '~/constants/themes'
import { useCv } from '~/composables/useCv'
import { useCvIo } from '~/composables/useCvIo'

const { cv, theme, load, reset, clear } = useCv()
const { exportJson, importJson } = useCvIo()

const jsonInput = ref<HTMLInputElement | null>(null)
const toast = ref('')
const editorTab = ref<'content' | 'style'>('content')
// Mobile-only pane toggle (editor vs. preview); ignored on lg+ where both show.
const mobileView = ref<'editor' | 'preview'>('editor')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string) {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 3000)
}

function triggerImport() {
  jsonInput.value?.click()
}

function onJsonFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const result = importJson(String(reader.result))
    showToast(result.ok ? 'CV importé ✓' : (result.error ?? 'Import échoué'))
  }
  reader.onerror = () => showToast("Impossible de lire le fichier")
  reader.readAsText(file)
  // Reset so importing the same file again re-triggers change.
  input.value = ''
}

// Group themes by their `group` label for the picker, preserving order.
const themeGroups = computed(() => {
  const groups: { name: string; items: typeof themes }[] = []
  for (const t of themes) {
    const name = t.group ?? 'Autres'
    let group = groups.find((g) => g.name === name)
    if (!group) {
      group = { name, items: [] }
      groups.push(group)
    }
    group.items.push(t)
  }
  return groups
})

const previewWrap = ref<HTMLElement | null>(null)
const scale = ref(1)
const A4_WIDTH_PX = 794 // 210mm @ 96dpi

let observer: ResizeObserver | null = null

function updateScale() {
  const el = previewWrap.value
  if (!el) return
  const available = el.clientWidth - 48 // padding allowance
  scale.value = Math.min(1, Math.max(0.3, available / A4_WIDTH_PX))
}

function downloadPdf() {
  const previousTitle = document.title
  const safeName = (cv.value.fullName || 'CV').replace(/\s+/g, '-')
  document.title = `CV-${safeName}`
  window.print()
  // Restore after the print dialog is dismissed.
  window.setTimeout(() => {
    document.title = previousTitle
  }, 500)
}

function confirmReset() {
  if (confirm('Réinitialiser avec les données du portfolio ?')) reset()
}

function confirmClear() {
  if (confirm('Vider tous les champs ?')) clear()
}

// When switching to the preview on mobile, its container becomes visible again
// so its width changes: recompute the fit-to-width scale.
watch(mobileView, () => {
  nextTick(updateScale)
})

onMounted(() => {
  load()
  updateScale()
  observer = new ResizeObserver(updateScale)
  if (previewWrap.value) observer.observe(previewWrap.value)
  window.addEventListener('resize', updateScale)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateScale)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <div class="flex h-screen flex-col bg-slate-950 text-gray-100">
    <!-- Top bar -->
    <header
      class="no-print flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 bg-slate-900 px-3 py-2 sm:gap-3 sm:px-5 sm:py-3"
    >
      <div class="min-w-0">
        <h1 class="text-base font-bold sm:text-lg">
          CV Creator
          <span class="text-blue-400">PDF</span>
        </h1>
        <p class="hidden text-xs text-gray-400 sm:block">
          Choisissez un thème, éditez vos informations, exportez en PDF.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <input
          ref="jsonInput"
          type="file"
          accept="application/json,.json"
          class="hidden"
          @change="onJsonFile"
        />
        <button
          class="rounded-md border border-gray-700 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800 sm:px-3 sm:py-2 sm:text-sm"
          @click="confirmClear"
        >
          Vider
        </button>
        <button
          class="rounded-md border border-gray-700 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800 sm:px-3 sm:py-2 sm:text-sm"
          @click="confirmReset"
        >
          Réinitialiser
        </button>
        <span class="mx-1 hidden h-5 w-px bg-gray-700 sm:block" />
        <button
          class="rounded-md border border-gray-700 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800 sm:px-3 sm:py-2 sm:text-sm"
          title="Importer un CV depuis un fichier JSON"
          @click="triggerImport"
        >
          ⬆<span class="hidden sm:inline"> Importer</span> JSON
        </button>
        <button
          class="rounded-md border border-gray-700 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800 sm:px-3 sm:py-2 sm:text-sm"
          title="Exporter le CV (avec photo) au format JSON"
          @click="exportJson"
        >
          ⬇<span class="hidden sm:inline"> Exporter</span> JSON
        </button>
        <span class="mx-1 hidden h-5 w-px bg-gray-700 sm:block" />
        <button
          class="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 sm:px-4 sm:py-2 sm:text-sm"
          @click="downloadPdf"
        >
          ⬇<span class="hidden sm:inline"> Télécharger le</span> PDF
        </button>
      </div>
    </header>

    <!-- Theme picker -->
    <div
      class="no-print flex items-center gap-3 overflow-x-auto border-b border-gray-800 bg-slate-900/70 px-3 py-2 sm:gap-4 sm:px-5"
    >
      <span class="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">Thème</span>
      <div v-for="group in themeGroups" :key="group.name" class="flex shrink-0 items-center gap-2">
        <span class="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
          {{ group.name }}
        </span>
        <button
          v-for="t in group.items"
          :key="t.id"
          class="flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
          :class="
            theme === t.id
              ? 'border-blue-500 bg-blue-500/10 text-white'
              : 'border-gray-700 text-gray-300 hover:border-gray-500'
          "
          :title="t.description"
          @click="theme = t.id"
        >
          <span class="h-3 w-3 rounded-full" :style="{ background: t.accent }" />
          {{ t.name }}
        </button>
      </div>
    </div>

    <!-- Main -->
    <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
      <!-- Mobile pane toggle (Éditeur / Aperçu) -->
      <div class="no-print flex shrink-0 border-b border-gray-800 bg-slate-900 lg:hidden">
        <button
          class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
          :class="mobileView === 'editor'
            ? 'border-b-2 border-blue-500 text-white'
            : 'text-gray-400 hover:text-gray-200'"
          @click="mobileView = 'editor'"
        >
          Éditeur
        </button>
        <button
          class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
          :class="mobileView === 'preview'
            ? 'border-b-2 border-blue-500 text-white'
            : 'text-gray-400 hover:text-gray-200'"
          @click="mobileView = 'preview'"
        >
          Aperçu
        </button>
      </div>

      <!-- Editor -->
      <aside
        class="no-print min-h-0 w-full flex-1 flex-col overflow-hidden border-gray-800 bg-slate-900 lg:flex lg:max-w-md lg:flex-none lg:border-r"
        :class="mobileView === 'editor' ? 'flex' : 'hidden'"
      >
        <div class="flex shrink-0 border-b border-gray-800">
          <button
            class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors"
            :class="editorTab === 'content'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-gray-400 hover:text-gray-200'"
            @click="editorTab = 'content'"
          >
            Contenu
          </button>
          <button
            class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors"
            :class="editorTab === 'style'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-gray-400 hover:text-gray-200'"
            @click="editorTab = 'style'"
          >
            Style
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <EditorPanel v-show="editorTab === 'content'" />
          <CustomizePanel v-show="editorTab === 'style'" />
        </div>
      </aside>

      <!-- Preview -->
      <main
        ref="previewWrap"
        class="preview-pane min-h-0 flex-1 overflow-auto bg-slate-800 p-3 sm:p-6 lg:block"
        :class="mobileView === 'preview' ? 'block' : 'hidden'"
      >
        <ClientOnly>
          <CvPreview :cv="cv" :theme="theme" :scale="scale" />
        </ClientOnly>
      </main>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast"
        class="no-print pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-slate-800 px-4 py-2 text-sm text-white shadow-lg ring-1 ring-white/10"
      >
        {{ toast }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.preview-pane {
  background-image: radial-gradient(circle, #334155 1px, transparent 1px);
  background-size: 22px 22px;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

@media print {
  .no-print {
    display: none !important;
  }

  .preview-pane {
    overflow: visible;
    background: #fff;
    padding: 0;
  }
}
</style>
