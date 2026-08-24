<script setup lang="ts">
import type { CvData, ModernVariant } from '~/types/cv'
import CvPhoto from '~/components/CvPhoto.vue'
import { modernVariants } from '~/constants/modernVariants'
import { SECTION_LABELS } from '~/constants/sections'
import { useThemeStyle, withSettingsDefaults } from '~/composables/useThemeStyle'

const props = withDefaults(
  defineProps<{ cv: CvData; variant?: ModernVariant }>(),
  { variant: () => modernVariants.modern },
)

const v = computed(() => props.variant)
const settings = computed(() => withSettingsDefaults(props.cv.settings))

const { rootStyle, mainSections, sidebarSections } = useThemeStyle(
  () => settings.value,
  { baseFontPt: 9.5, defaultAccent: v.value.headingColor },
)

// A custom accent overrides the variant's heading / bar / avatar colors.
const vars = computed(() => {
  const accent = settings.value.accentColor
  return {
    '--m-sidebar-bg': v.value.sidebarBg,
    '--m-sidebar-accent': accent || v.value.sidebarAccent,
    '--m-sidebar-text': v.value.sidebarText,
    '--m-sidebar-muted': v.value.sidebarMuted,
    '--m-sidebar-border': v.value.sidebarBorder,
    '--m-sidebar-heading': v.value.sidebarHeading,
    '--m-label': v.value.labelColor,
    '--m-heading': accent || v.value.headingColor,
    '--m-bar': accent || v.value.barColor,
  }
})
</script>

<template>
  <div
    class="cv-page theme-modern"
    :class="{ 'sidebar-right': v.side === 'right' }"
    :style="[rootStyle, vars]"
  >
    <aside class="sidebar">
      <div v-if="cv.photo" class="avatar avatar-photo">
        <CvPhoto
          :photo="cv.photo"
          :zoom="settings.photoZoom"
          :offset-x="settings.photoOffsetX"
          :offset-y="settings.photoOffsetY"
        />
      </div>
      <div v-else class="avatar">{{ (cv.fullName || '?').charAt(0) }}</div>
      <h1>{{ cv.fullName }}</h1>
      <p v-if="cv.title" class="title">{{ cv.title }}</p>

      <div class="side-block">
        <h3>Contact</h3>
        <p v-if="cv.email">{{ cv.email }}</p>
        <p v-if="cv.phone">{{ cv.phone }}</p>
        <p v-if="cv.location">{{ cv.location }}</p>
        <p v-if="cv.website">{{ cv.website }}</p>
      </div>

      <div v-if="cv.links.length" class="side-block">
        <h3>Liens</h3>
        <p v-for="(l, i) in cv.links" :key="i">
          <span class="l-label">{{ l.label }}</span><br />{{ l.url }}
        </p>
      </div>

      <template v-for="sec in sidebarSections" :key="sec">
        <div v-if="sec === 'skills' && cv.skills.length" class="side-block">
          <h3>{{ SECTION_LABELS.skills }}</h3>
          <div v-for="(g, i) in cv.skills" :key="i" class="side-skill">
            <p class="l-label">{{ g.category }}</p>
            <p>{{ g.items.join(', ') }}</p>
          </div>
        </div>

        <div v-else-if="sec === 'languages' && cv.languages.length" class="side-block">
          <h3>{{ SECTION_LABELS.languages }}</h3>
          <p v-for="(lang, i) in cv.languages" :key="i">
            <span class="l-label">{{ lang.name }}</span>
            <template v-if="lang.level"> — {{ lang.level }}</template>
          </p>
        </div>
      </template>
    </aside>

    <main class="main">
      <template v-for="sec in mainSections" :key="sec">
        <section v-if="sec === 'summary' && cv.summary" class="block">
          <h2>{{ SECTION_LABELS.summary }}</h2>
          <p class="summary">{{ cv.summary }}</p>
        </section>

        <section v-else-if="sec === 'experiences' && cv.experiences.length" class="block">
          <h2>{{ SECTION_LABELS.experiences }}</h2>
          <article v-for="(x, i) in cv.experiences" :key="i" class="entry">
            <div class="entry-head">
              <span class="role">{{ x.role }}</span>
              <span class="period">{{ x.period }}</span>
            </div>
            <p class="sub">
              <template v-if="x.company">{{ x.company }}</template>
              <template v-if="x.company && x.location"> · </template>
              <template v-if="x.location">{{ x.location }}</template>
            </p>
            <p v-if="x.description" class="desc">{{ x.description }}</p>
            <ul v-if="x.highlights.length">
              <li v-for="(h, hi) in x.highlights" :key="hi">{{ h }}</li>
            </ul>
          </article>
        </section>

        <section v-else-if="sec === 'projects' && cv.projects.length" class="block">
          <h2>{{ SECTION_LABELS.projects }}</h2>
          <article v-for="(p, i) in cv.projects" :key="i" class="entry">
            <div class="entry-head">
              <span class="role">{{ p.name }}</span>
              <span class="period">{{ p.year }}</span>
            </div>
            <p v-if="p.description" class="desc">{{ p.description }}</p>
            <p v-if="p.tags.length" class="sub">{{ p.tags.join(' · ') }}</p>
            <p v-if="p.url" class="sub">{{ p.url }}</p>
          </article>
        </section>

        <section v-else-if="sec === 'education' && cv.education.length" class="block">
          <h2>{{ SECTION_LABELS.education }}</h2>
          <article v-for="(e, i) in cv.education" :key="i" class="entry">
            <div class="entry-head">
              <span class="role">{{ e.degree }}</span>
              <span class="period">{{ e.period }}</span>
            </div>
            <p v-if="e.school" class="sub">{{ e.school }}</p>
            <p v-if="e.description" class="desc">{{ e.description }}</p>
          </article>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.theme-modern {
  display: grid;
  grid-template-columns: 62mm 1fr;
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.45;
  color: #1f2937;
}

.theme-modern.sidebar-right {
  grid-template-columns: 1fr 62mm;
}

.theme-modern.sidebar-right .sidebar {
  order: 2;
}

.sidebar {
  background: var(--m-sidebar-bg);
  color: var(--m-sidebar-text);
  padding: calc(var(--cv-sp, 1) * 14mm) 9mm;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.avatar {
  width: 26mm;
  height: 26mm;
  border-radius: 50%;
  background: var(--m-sidebar-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5em;
  font-weight: 700;
  margin: 0 auto 8pt;
  overflow: hidden;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.avatar-photo {
  background: #fff;
}

.sidebar h1 {
  font-size: 1.58em;
  font-weight: 700;
  text-align: center;
  margin: 0;
  color: #fff;
}

.title {
  text-align: center;
  font-size: 1em;
  color: var(--m-sidebar-muted);
  margin: 2pt 0 10pt;
}

.side-block {
  margin-bottom: calc(var(--cv-sp, 1) * 10pt);
}

.side-block h3 {
  font-size: 0.89em;
  text-transform: uppercase;
  letter-spacing: 1.5pt;
  color: var(--m-sidebar-heading);
  border-bottom: 1px solid var(--m-sidebar-border);
  padding-bottom: 2pt;
  margin: 0 0 4pt;
}

.side-block p {
  margin: 0 0 3pt;
  font-size: 0.89em;
  word-break: break-word;
}

.side-skill {
  margin-bottom: 4pt;
}

.l-label {
  font-weight: 600;
  color: var(--m-label);
}

.main {
  padding: calc(var(--cv-sp, 1) * 14mm) 12mm;
}

.block {
  margin-bottom: calc(var(--cv-sp, 1) * 11pt);
}

h2 {
  font-size: 1.26em;
  font-weight: 700;
  color: var(--m-heading);
  text-transform: uppercase;
  letter-spacing: 0.5pt;
  margin: 0 0 6pt;
  position: relative;
  padding-left: 8pt;
}

h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 1pt;
  bottom: 1pt;
  width: 3pt;
  background: var(--m-bar);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.summary {
  margin: 0;
  text-align: justify;
}

.entry {
  margin-bottom: calc(var(--cv-sp, 1) * 8pt);
}

.entry-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10pt;
}

.role {
  font-weight: 700;
  font-size: 1.1em;
}

.period {
  font-size: 0.89em;
  color: #6b7280;
  white-space: nowrap;
}

.sub {
  font-size: 0.89em;
  color: #6b7280;
  margin: 0;
}

.desc {
  margin: 2pt 0 0;
}

ul {
  margin: 3pt 0 0;
  padding-left: 14pt;
}

li {
  margin-bottom: 1pt;
}
</style>
