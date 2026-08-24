<script setup lang="ts">
import type { CvData } from '~/types/cv'

defineProps<{ cv: CvData }>()
</script>

<template>
  <div class="cv-page theme-minimal">
    <header class="head">
      <h1>{{ cv.fullName }}</h1>
      <p v-if="cv.title" class="title">{{ cv.title }}</p>
      <p class="contact">
        <template v-for="(item, i) in [cv.email, cv.phone, cv.location, cv.website].filter(Boolean)" :key="i">
          <span>{{ item }}</span>
          <span v-if="i < [cv.email, cv.phone, cv.location, cv.website].filter(Boolean).length - 1" class="sep">/</span>
        </template>
      </p>
      <p v-if="cv.links.length" class="contact">
        <template v-for="(l, i) in cv.links" :key="i">
          <span>{{ l.url }}</span>
          <span v-if="i < cv.links.length - 1" class="sep">/</span>
        </template>
      </p>
    </header>

    <section v-if="cv.summary" class="block">
      <p class="summary">{{ cv.summary }}</p>
    </section>

    <section v-if="cv.experiences.length" class="block">
      <h2>Expérience</h2>
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

    <div class="two-col">
      <section v-if="cv.skills.length" class="block">
        <h2>Compétences</h2>
        <div v-for="(g, i) in cv.skills" :key="i" class="skill-row">
          <span class="skill-cat">{{ g.category }}</span>
          <span class="skill-items">{{ g.items.join(', ') }}</span>
        </div>
      </section>

      <section v-if="cv.languages.length" class="block">
        <h2>Langues</h2>
        <div v-for="(lang, i) in cv.languages" :key="i" class="skill-row">
          <span class="skill-cat">{{ lang.name }}</span>
          <span class="skill-items">{{ lang.level }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.theme-minimal {
  padding: 18mm 20mm;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10pt;
  line-height: 1.5;
  color: #27272a;
}

.head {
  margin-bottom: 14pt;
}

.head h1 {
  font-size: 26pt;
  font-weight: 600;
  letter-spacing: -0.5pt;
  margin: 0;
}

.title {
  font-size: 11pt;
  color: #0f766e;
  font-weight: 500;
  margin: 1pt 0 6pt;
}

.contact {
  font-size: 8.5pt;
  color: #71717a;
  margin: 2pt 0 0;
}

.contact .sep {
  margin: 0 5pt;
  color: #d4d4d8;
}

.block {
  margin-bottom: 12pt;
}

h2 {
  font-size: 9pt;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2pt;
  color: #0f766e;
  margin: 0 0 6pt;
}

.summary {
  margin: 0;
  color: #3f3f46;
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
  font-weight: 600;
  font-size: 10.5pt;
}

.period {
  font-size: 8.5pt;
  color: #a1a1aa;
  white-space: nowrap;
}

.sub {
  font-size: 9pt;
  color: #71717a;
  margin: 0;
}

.desc {
  margin: 2pt 0 0;
  color: #3f3f46;
}

ul {
  margin: 3pt 0 0;
  padding-left: 14pt;
}

li {
  margin-bottom: 1pt;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 18pt;
}

.skill-row {
  display: flex;
  gap: 6pt;
  margin-bottom: 3pt;
}

.skill-cat {
  font-weight: 600;
  min-width: 34mm;
}

.skill-items {
  color: #52525b;
}
</style>
