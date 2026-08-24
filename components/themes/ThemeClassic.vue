<script setup lang="ts">
import type { CvData } from '~/types/cv'

defineProps<{ cv: CvData }>()
</script>

<template>
  <div class="cv-page theme-classic">
    <header class="head">
      <img v-if="cv.photo" class="photo" :src="cv.photo" alt="Photo de profil" />
      <h1>{{ cv.fullName }}</h1>
      <p v-if="cv.title" class="title">{{ cv.title }}</p>
      <p class="contact">
        <span v-if="cv.email">{{ cv.email }}</span>
        <span v-if="cv.phone">{{ cv.phone }}</span>
        <span v-if="cv.location">{{ cv.location }}</span>
        <span v-if="cv.website">{{ cv.website }}</span>
      </p>
      <p v-if="cv.links.length" class="links">
        <span v-for="l in cv.links" :key="l.label + l.url">{{ l.label }} — {{ l.url }}</span>
      </p>
    </header>

    <section v-if="cv.summary" class="block">
      <h2>Profil</h2>
      <p class="summary">{{ cv.summary }}</p>
    </section>

    <section v-if="cv.experiences.length" class="block">
      <h2>Expériences</h2>
      <article v-for="(x, i) in cv.experiences" :key="i" class="entry">
        <div class="entry-head">
          <span class="strong">{{ x.role }}<template v-if="x.company"> — {{ x.company }}</template></span>
          <span class="period">{{ x.period }}</span>
        </div>
        <p v-if="x.location" class="muted">{{ x.location }}</p>
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
          <span class="strong">{{ p.name }}</span>
          <span class="period">{{ p.year }}</span>
        </div>
        <p v-if="p.description" class="desc">{{ p.description }}</p>
        <p v-if="p.tags.length" class="muted">{{ p.tags.join(' · ') }}</p>
        <p v-if="p.url" class="muted">{{ p.url }}</p>
      </article>
    </section>

    <section v-if="cv.education.length" class="block">
      <h2>Formation</h2>
      <article v-for="(e, i) in cv.education" :key="i" class="entry">
        <div class="entry-head">
          <span class="strong">{{ e.degree }}<template v-if="e.school"> — {{ e.school }}</template></span>
          <span class="period">{{ e.period }}</span>
        </div>
        <p v-if="e.description" class="desc">{{ e.description }}</p>
      </article>
    </section>

    <section v-if="cv.skills.length" class="block">
      <h2>Compétences</h2>
      <div v-for="(g, i) in cv.skills" :key="i" class="skill-row">
        <span class="strong">{{ g.category }} :</span>
        <span>{{ g.items.join(', ') }}</span>
      </div>
    </section>

    <section v-if="cv.languages.length" class="block">
      <h2>Langues</h2>
      <div class="skill-row">
        <span>
          <template v-for="(lang, i) in cv.languages" :key="i">{{ lang.name }}<template v-if="lang.level"> ({{ lang.level }})</template><template v-if="i < cv.languages.length - 1"> · </template></template>
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.theme-classic {
  padding: 16mm 18mm;
  font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  font-size: 10.5pt;
  line-height: 1.45;
  color: #1f2937;
}

.head {
  text-align: center;
  border-bottom: 2px solid #1f2937;
  padding-bottom: 8pt;
  margin-bottom: 12pt;
}

.head h1 {
  font-size: 24pt;
  font-weight: 700;
  letter-spacing: 0.5pt;
  margin: 0;
}

.photo {
  width: 28mm;
  height: 28mm;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 6pt;
  display: block;
  border: 1px solid #d1d5db;
}

.title {
  font-size: 12pt;
  font-style: italic;
  margin: 2pt 0 6pt;
  color: #374151;
}

.contact,
.links {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  color: #4b5563;
  margin: 2pt 0 0;
}

.contact span,
.links span {
  margin: 0 5pt;
}

.block {
  margin-bottom: 11pt;
}

h2 {
  font-size: 12pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1pt;
  border-bottom: 1px solid #9ca3af;
  padding-bottom: 2pt;
  margin: 0 0 6pt;
}

.summary {
  margin: 0;
  text-align: justify;
}

.entry {
  margin-bottom: 7pt;
}

.entry-head {
  display: flex;
  justify-content: space-between;
  gap: 10pt;
}

.strong {
  font-weight: 700;
}

.period {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  color: #4b5563;
  white-space: nowrap;
}

.muted {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  color: #6b7280;
  margin: 1pt 0;
}

.desc {
  margin: 2pt 0;
}

ul {
  margin: 3pt 0 0;
  padding-left: 16pt;
}

li {
  margin-bottom: 1pt;
}

.skill-row {
  margin-bottom: 3pt;
}
</style>
