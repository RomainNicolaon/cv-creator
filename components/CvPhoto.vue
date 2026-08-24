<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    photo: string
    zoom?: number
    offsetX?: number
    offsetY?: number
    alt?: string
  }>(),
  { zoom: 1, offsetX: 50, offsetY: 50, alt: 'Photo de profil' },
)

const style = computed(() => ({
  backgroundImage: `url("${props.photo}")`,
  backgroundSize: `${Math.max(1, props.zoom) * 100}%`,
  backgroundPosition: `${props.offsetX}% ${props.offsetY}%`,
  backgroundRepeat: 'no-repeat',
}))
</script>

<template>
  <div
    class="cv-photo"
    role="img"
    :aria-label="alt"
    :style="style"
  />
</template>

<style scoped>
.cv-photo {
  width: 100%;
  height: 100%;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>
