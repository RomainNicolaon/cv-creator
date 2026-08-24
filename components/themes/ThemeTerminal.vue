<script setup lang="ts">
import type { CvData, SectionId } from '~/types/cv'
import CvPhoto from '~/components/CvPhoto.vue'
import { useThemeStyle, withSettingsDefaults } from '~/composables/useThemeStyle'

const props = defineProps<{ cv: CvData }>()

const settings = computed(() => withSettingsDefaults(props.cv.settings))
const { rootStyle, allSections } = useThemeStyle(() => settings.value, {
  baseFontPt: 9,
  defaultAccent: '#58a6ff',
})

const headings: Record<SectionId, string> = {
  summary: '~/profil',
  experiences: '~/experiences',
  projects: '~/projets',
  education: '~/formation',
  skills: '~/competences',
  languages: '~/langues',
}
</script>

<template>
  <div class="cv-page theme-terminal" :style="rootStyle">
    <header class="head" :class="{ 'has-photo': cv.photo }">
      <div v-if="cv.photo" class="photo">
        <CvPhoto
          :photo="cv.photo"
          :zoom="settings.photoZoom"
          :offset-x="settings.photoOffsetX"
          :offset-y="settings.photoOffsetY"
        />
      </div>
      <div class="head-text">
        <p class="prompt"><span class="green">romain@cv</span>:<span class="blue">~</span>$ whoami</p>
        <h1>{{ cv.fullName }}</h1>
        <p v-if="cv.title" class="title"># {{ cv.title }}</p>
        <p class="contact">
          <span v-if="cv.email">✉ {{ cv.email }}</span>
          <span v-if="cv.phone">☎ {{ cv.phone }}</span>
          <span v-if="cv.location">⌂ {{ cv.location }}</span>
          <span v-if="cv.website">↗ {{ cv.website }}</span>
        </p>
        <p v-if="cv.links.length" class="contact">
          <span v-for="(l, i) in cv.links" :key="i">{{ l.label }}: {{ l.url }}</span>
        </p>
      </div>
    </header>

    <template v-for="sec in allSections" :key="sec">
      <section v-if="sec === 'summary' && cv.summary" class="block">
        <h2>{{ headings.summary }}</h2>
        <p class="summary">{{ cv.summary }}</p>
      </section>

      <section v-else-if="sec === 'experiences' && cv.experiences.length" class="block">
        <h2>{{ headings.experiences }}</h2>
        <article v-for="(x, i) in cv.experiences" :key="i" class="entry">
          <div class="entry-head">
            <span class="role">{{ x.role }}<template v-if="x.company"> @ {{ x.company }}</template></span>
            <span class="period">{{ x.period }}</span>
          </div>
          <p v-if="x.location" class="sub">{{ x.location }}</p>
          <p v-if="x.description" class="desc">{{ x.description }}</p>
          <ul v-if="x.highlights.length">
            <li v-for="(h, hi) in x.highlights" :key="hi">{{ h }}</li>
          </ul>
        </article>
      </section>

      <section v-else-if="sec === 'projects' && cv.projects.length" class="block">
        <h2>{{ headings.projects }}</h2>
        <article v-for="(p, i) in cv.projects" :key="i" class="entry">
          <div class="entry-head">
            <span class="role">{{ p.name }}</span>
            <span class="period">{{ p.year }}</span>
          </div>
          <p v-if="p.description" class="desc">{{ p.description }}</p>
          <p v-if="p.tags.length" class="sub">[{{ p.tags.join('] [') }}]</p>
          <p v-if="p.url" class="sub">{{ p.url }}</p>
        </article>
      </section>

      <section v-else-if="sec === 'education' && cv.education.length" class="block">
        <h2>{{ headings.education }}</h2>
        <article v-for="(e, i) in cv.education" :key="i" class="entry">
          <div class="entry-head">
            <span class="role">{{ e.degree }}<template v-if="e.school"> @ {{ e.school }}</template></span>
            <span class="period">{{ e.period }}</span>
          </div>
          <p v-if="e.description" class="desc">{{ e.description }}</p>
        </article>
      </section>

      <section v-else-if="sec === 'skills' && cv.skills.length" class="block">
        <h2>{{ headings.skills }}</h2>
        <div v-for="(g, i) in cv.skills" :key="i" class="skill-row">
          <span class="green">{{ g.category }}</span> = [{{ g.items.join(', ') }}]
        </div>
      </section>

      <section v-else-if="sec === 'languages' && cv.languages.length" class="block">
        <h2>{{ headings.languages }}</h2>
        <div class="skill-row">
          <template v-for="(lang, i) in cv.languages" :key="i"><span class="green">{{ lang.name }}</span><template v-if="lang.level">({{ lang.level }})</template><template v-if="i < cv.languages.length - 1"> · </template></template>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.theme-terminal {
  padding: calc(var(--cv-sp, 1) * 14mm) 16mm;
  background: #0d1117;
  color: #c9d1d9;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  line-height: 1.5;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.green {
  color: #3fb950;
}

.blue {
  color: #58a6ff;
}

.head {
  margin-bottom: calc(var(--cv-sp, 1) * 12pt);
}

.head.has-photo {
  display: flex;
  align-items: center;
  gap: 10pt;
}

.head .head-text {
  flex: 1;
}

.head .photo {
  width: 24mm;
  height: 24mm;
  border-radius: 4pt;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #30363d;
}

.prompt {
  font-size: 0.94em;
  color: #8b949e;
  margin: 0 0 4pt;
}

.head h1 {
  font-size: 2.2em;
  font-weight: 700;
  color: #e6edf3;
  margin: 0;
}

.title {
  color: #8b949e;
  margin: 2pt 0 6pt;
}

.contact {
  font-size: 0.89em;
  color: #8b949e;
  margin: 2pt 0 0;
}

.contact span {
  margin-right: 10pt;
}

.block {
  margin-bottom: calc(var(--cv-sp, 1) * 10pt);
}

h2 {
  font-size: 1.16em;
  font-weight: 700;
  color: var(--accent);
  border-bottom: 1px solid #21262d;
  padding-bottom: 2pt;
  margin: 0 0 5pt;
}

.summary {
  margin: 0;
  color: #adbac7;
}

.entry {
  margin-bottom: calc(var(--cv-sp, 1) * 7pt);
}

.entry-head {
  display: flex;
  justify-content: space-between;
  gap: 10pt;
}

.role {
  font-weight: 700;
  color: #e6edf3;
}

.period {
  font-size: 0.89em;
  color: #6e7681;
  white-space: nowrap;
}

.sub {
  font-size: 0.89em;
  color: #6e7681;
  margin: 1pt 0;
}

.desc {
  margin: 2pt 0;
  color: #adbac7;
}

ul {
  margin: 3pt 0 0;
  padding-left: 14pt;
}

li {
  margin-bottom: 1pt;
}

.skill-row {
  margin-bottom: 3pt;
  color: #adbac7;
}
</style>
