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
</script>

<template>
  <div class="cv-print-area">
    <div class="cv-scale" :style="{ '--cv-scale': scale }">
      <component :is="themeComponent" :cv="cv" :variant="modernVariant" />
    </div>
  </div>
</template>
