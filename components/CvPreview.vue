<script setup lang="ts">
import type { CvData, ThemeId } from '~/types/cv'
import ThemeClassic from '~/components/themes/ThemeClassic.vue'
import ThemeModern from '~/components/themes/ThemeModern.vue'
import ThemeMinimal from '~/components/themes/ThemeMinimal.vue'
import ThemeTerminal from '~/components/themes/ThemeTerminal.vue'
import { isModernVariant, modernVariants } from '~/constants/modernVariants'

const props = withDefaults(
  defineProps<{ cv: CvData; theme: ThemeId; scale?: number }>(),
  { scale: 1 },
)

const isModern = computed(() => isModernVariant(props.theme))

const modernVariant = computed(() =>
  isModern.value
    ? modernVariants[props.theme as keyof typeof modernVariants]
    : undefined,
)

const themeComponent = computed(() => {
  if (isModern.value) return ThemeModern
  switch (props.theme) {
    case 'minimal':
      return ThemeMinimal
    case 'terminal':
      return ThemeTerminal
    case 'classic':
    default:
      return ThemeClassic
  }
})

// The A4 sheet keeps its natural 210mm layout width, so we compensate the
// transform: the outer frame reserves the *scaled* box to avoid overflow and
// keep the sheet centered on any screen size.
const inner = ref<HTMLElement | null>(null)
const innerHeight = ref(0)
let ro: ResizeObserver | null = null

function measure() {
  if (inner.value) innerHeight.value = inner.value.offsetHeight
}

onMounted(() => {
  ro = new ResizeObserver(measure)
  if (inner.value) {
    ro.observe(inner.value)
    measure()
  }
})

onBeforeUnmount(() => ro?.disconnect())

const frameStyle = computed(() => ({
  width: `calc(210mm * ${props.scale})`,
  height: innerHeight.value ? `${innerHeight.value * props.scale}px` : undefined,
}))

const innerStyle = computed(() => ({
  transform: `scale(${props.scale})`,
  transformOrigin: 'top left',
}))
</script>

<template>
  <div class="cv-print-area">
    <div class="cv-frame" :style="frameStyle">
      <div ref="inner" class="cv-scale" :style="innerStyle">
        <component :is="themeComponent" :cv="cv" :variant="modernVariant" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cv-print-area {
  display: flex;
  justify-content: center;
}

.cv-frame {
  position: relative;
}

.cv-scale {
  width: 210mm;
}

@media print {
  .cv-frame {
    width: auto !important;
    height: auto !important;
  }

  .cv-scale {
    width: auto;
    transform: none !important;
  }
}
</style>
