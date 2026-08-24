<script setup lang="ts">
import type { CvData, ModernVariant } from '~/types/cv'
import { modernVariants } from '~/constants/modernVariants'

const props = withDefaults(
  defineProps<{ cv: CvData; variant?: ModernVariant }>(),
  { variant: () => modernVariants.modern },
)

const v = computed(() => props.variant)

const vars = computed(() => ({
  '--m-sidebar-bg': v.value.sidebarBg,
  '--m-sidebar-accent': v.value.sidebarAccent,
  '--m-sidebar-text': v.value.sidebarText,
  '--m-sidebar-muted': v.value.sidebarMuted,
  '--m-sidebar-border': v.value.sidebarBorder,
  '--m-sidebar-heading': v.value.sidebarHeading,
  '--m-label': v.value.labelColor,
  '--m-heading': v.value.headingColor,
  '--m-bar': v.value.barColor,
}))
</script>

<template>
  <div
    class="cv-page theme-modern"
    :class="{ 'sidebar-right': v.side === 'right' }"
    :style="vars"
  >
    <aside class="sidebar">
      <div v-if="cv.photo" class="avatar avatar-photo">
        <img :src="cv.photo" alt="Photo de profil" />
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

      <div v-if="cv.skills.length" class="side-block">
        <h3>Compétences</h3>
        <div v-for="(g, i) in cv.skills" :key="i" class="side-skill">
          <p class="l-label">{{ g.category }}</p>
          <p>{{ g.items.join(', ') }}</p>
        </div>
      </div>

      <div v-if="cv.languages.length" class="side-block">
        <h3>Langues</h3>
        <p v-for="(lang, i) in cv.languages" :key="i">
          <span class="l-label">{{ lang.name }}</span>
          <template v-if="lang.level"> — {{ lang.level }}</template>
        </p>
      </div>
    </aside>

    <main class="main">
      <section v-if="cv.summary" class="block">
        <h2>Profil</h2>
        <p class="summary">{{ cv.summary }}</p>
      </section>

      <section v-if="cv.experiences.length" class="block">
        <h2>Expériences</h2>
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

      <section v-if="cv.projects.length" class="block">
        <h2>Projets</h2>
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

      <section v-if="cv.education.length" class="block">
        <h2>Formation</h2>
        <article v-for="(e, i) in cv.education" :key="i" class="entry">
          <div class="entry-head">
            <span class="role">{{ e.degree }}</span>
            <span class="period">{{ e.period }}</span>
          </div>
          <p v-if="e.school" class="sub">{{ e.school }}</p>
          <p v-if="e.description" class="desc">{{ e.description }}</p>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.theme-modern {
  display: grid;
  grid-template-columns: 62mm 1fr;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 9.5pt;
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
  padding: 14mm 9mm;
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
  font-size: 24pt;
  font-weight: 700;
  margin: 0 auto 8pt;
  overflow: hidden;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.avatar-photo {
  background: #fff;
}

.avatar-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar h1 {
  font-size: 15pt;
  font-weight: 700;
  text-align: center;
  margin: 0;
  color: #fff;
}

.title {
  text-align: center;
  font-size: 9.5pt;
  color: var(--m-sidebar-muted);
  margin: 2pt 0 10pt;
}

.side-block {
  margin-bottom: 10pt;
}

.side-block h3 {
  font-size: 8.5pt;
  text-transform: uppercase;
  letter-spacing: 1.5pt;
  color: var(--m-sidebar-heading);
  border-bottom: 1px solid var(--m-sidebar-border);
  padding-bottom: 2pt;
  margin: 0 0 4pt;
}

.side-block p {
  margin: 0 0 3pt;
  font-size: 8.5pt;
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
  padding: 14mm 12mm;
}

.block {
  margin-bottom: 11pt;
}

h2 {
  font-size: 12pt;
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
  margin-bottom: 8pt;
}

.entry-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10pt;
}

.role {
  font-weight: 700;
  font-size: 10.5pt;
}

.period {
  font-size: 8.5pt;
  color: #6b7280;
  white-space: nowrap;
}

.sub {
  font-size: 8.5pt;
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
