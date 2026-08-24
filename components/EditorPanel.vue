<script setup lang="ts">
import CvPhoto from '~/components/CvPhoto.vue'
import {
  emptyEducation,
  emptyExperience,
  emptyLanguage,
  emptyLink,
  emptyProject,
  emptySkillGroup,
  useCv,
} from '~/composables/useCv'

const { cv } = useCv()

const photoInput = ref<HTMLInputElement | null>(null)
const photoError = ref('')

const MAX_PHOTO_BYTES = 3 * 1024 * 1024 // 3 MB

function resetCrop() {
  cv.value.settings.photoZoom = 1
  cv.value.settings.photoOffsetX = 50
  cv.value.settings.photoOffsetY = 50
}

function onPhotoChange(event: Event) {
  photoError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    photoError.value = 'Veuillez choisir un fichier image.'
    return
  }
  if (file.size > MAX_PHOTO_BYTES) {
    photoError.value = "L'image est trop lourde (max 3 Mo)."
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    cv.value.photo = String(reader.result)
    resetCrop()
  }
  reader.onerror = () => {
    photoError.value = "Impossible de lire l'image."
  }
  reader.readAsDataURL(file)
}

function removePhoto() {
  cv.value.photo = ''
  photoError.value = ''
  resetCrop()
  if (photoInput.value) photoInput.value.value = ''
}

function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

// Which sections are expanded. Basics open by default.
const open = reactive<Record<string, boolean>>({
  basics: true,
  links: false,
  experiences: true,
  projects: false,
  education: false,
  skills: false,
  languages: false,
})
</script>

<template>
  <div class="space-y-3">
    <!-- Basics -->
    <section class="panel">
      <button class="panel-head" @click="open.basics = !open.basics">
        <span>Informations</span>
        <span>{{ open.basics ? '−' : '+' }}</span>
      </button>
      <div v-show="open.basics" class="panel-body grid grid-cols-2 gap-3">
        <label class="field col-span-2">
          <span>Nom complet</span>
          <input v-model="cv.fullName" type="text" />
        </label>
        <label class="field col-span-2">
          <span>Titre / poste</span>
          <input v-model="cv.title" type="text" />
        </label>
        <div class="field col-span-2">
          <span>Photo de profil</span>
          <div class="photo-row">
            <div class="photo-preview">
              <CvPhoto
                v-if="cv.photo"
                :photo="cv.photo"
                :zoom="cv.settings.photoZoom"
                :offset-x="cv.settings.photoOffsetX"
                :offset-y="cv.settings.photoOffsetY"
                alt="Aperçu de la photo"
              />
              <span v-else class="photo-placeholder">Aucune</span>
            </div>
            <div class="photo-actions">
              <input
                ref="photoInput"
                type="file"
                accept="image/*"
                class="photo-file"
                @change="onPhotoChange"
              />
              <button
                v-if="cv.photo"
                type="button"
                class="remove"
                @click="removePhoto"
              >
                Retirer la photo
              </button>
              <p class="photo-hint">
                JPG ou PNG, max 3 Mo. Idéalement carrée.
              </p>
              <p v-if="photoError" class="photo-error">{{ photoError }}</p>
            </div>
          </div>
          <div v-if="cv.photo" class="crop">
            <label class="crop-row">
              <span>Zoom</span>
              <input
                v-model.number="cv.settings.photoZoom"
                type="range"
                min="1"
                max="3"
                step="0.05"
              />
            </label>
            <label class="crop-row">
              <span>Horizontal</span>
              <input
                v-model.number="cv.settings.photoOffsetX"
                type="range"
                min="0"
                max="100"
                step="1"
              />
            </label>
            <label class="crop-row">
              <span>Vertical</span>
              <input
                v-model.number="cv.settings.photoOffsetY"
                type="range"
                min="0"
                max="100"
                step="1"
              />
            </label>
            <button type="button" class="remove" @click="resetCrop">
              Réinitialiser le cadrage
            </button>
          </div>
        </div>
        <label class="field">
          <span>Email</span>
          <input v-model="cv.email" type="email" />
        </label>
        <label class="field">
          <span>Téléphone</span>
          <input v-model="cv.phone" type="text" />
        </label>
        <label class="field">
          <span>Localisation</span>
          <input v-model="cv.location" type="text" />
        </label>
        <label class="field">
          <span>Site web</span>
          <input v-model="cv.website" type="text" />
        </label>
        <label class="field col-span-2">
          <span>Profil / résumé</span>
          <textarea v-model="cv.summary" rows="4" />
        </label>
      </div>
    </section>

    <!-- Links -->
    <section class="panel">
      <button class="panel-head" @click="open.links = !open.links">
        <span>Liens ({{ cv.links.length }})</span>
        <span>{{ open.links ? '−' : '+' }}</span>
      </button>
      <div v-show="open.links" class="panel-body space-y-3">
        <div v-for="(l, i) in cv.links" :key="i" class="item">
          <div class="grid grid-cols-2 gap-2">
            <input v-model="l.label" type="text" placeholder="Libellé (GitHub…)" />
            <input v-model="l.url" type="text" placeholder="https://…" />
          </div>
          <button class="remove" @click="cv.links.splice(i, 1)">Supprimer</button>
        </div>
        <button class="add" @click="cv.links.push(emptyLink())">+ Ajouter un lien</button>
      </div>
    </section>

    <!-- Experiences -->
    <section class="panel">
      <button class="panel-head" @click="open.experiences = !open.experiences">
        <span>Expériences ({{ cv.experiences.length }})</span>
        <span>{{ open.experiences ? '−' : '+' }}</span>
      </button>
      <div v-show="open.experiences" class="panel-body space-y-4">
        <div v-for="(x, i) in cv.experiences" :key="i" class="item">
          <div class="grid grid-cols-2 gap-2">
            <input v-model="x.role" type="text" placeholder="Poste" />
            <input v-model="x.company" type="text" placeholder="Entreprise" />
            <input v-model="x.period" type="text" placeholder="Période" />
            <input v-model="x.location" type="text" placeholder="Lieu" />
          </div>
          <textarea v-model="x.description" rows="2" placeholder="Description" />
          <textarea
            :value="x.highlights.join('\n')"
            rows="2"
            placeholder="Points clés (une ligne par point)"
            @input="x.highlights = splitLines(($event.target as HTMLTextAreaElement).value)"
          />
          <button class="remove" @click="cv.experiences.splice(i, 1)">Supprimer</button>
        </div>
        <button class="add" @click="cv.experiences.push(emptyExperience())">
          + Ajouter une expérience
        </button>
      </div>
    </section>

    <!-- Projects -->
    <section class="panel">
      <button class="panel-head" @click="open.projects = !open.projects">
        <span>Projets ({{ cv.projects.length }})</span>
        <span>{{ open.projects ? '−' : '+' }}</span>
      </button>
      <div v-show="open.projects" class="panel-body space-y-4">
        <div v-for="(p, i) in cv.projects" :key="i" class="item">
          <div class="grid grid-cols-2 gap-2">
            <input v-model="p.name" type="text" placeholder="Nom" />
            <input v-model="p.year" type="text" placeholder="Année" />
          </div>
          <textarea v-model="p.description" rows="2" placeholder="Description" />
          <input v-model="p.url" type="text" placeholder="URL" />
          <input
            :value="p.tags.join(', ')"
            type="text"
            placeholder="Tags (séparés par des virgules)"
            @input="p.tags = splitCsv(($event.target as HTMLInputElement).value)"
          />
          <button class="remove" @click="cv.projects.splice(i, 1)">Supprimer</button>
        </div>
        <button class="add" @click="cv.projects.push(emptyProject())">
          + Ajouter un projet
        </button>
      </div>
    </section>

    <!-- Education -->
    <section class="panel">
      <button class="panel-head" @click="open.education = !open.education">
        <span>Formation ({{ cv.education.length }})</span>
        <span>{{ open.education ? '−' : '+' }}</span>
      </button>
      <div v-show="open.education" class="panel-body space-y-4">
        <div v-for="(e, i) in cv.education" :key="i" class="item">
          <div class="grid grid-cols-2 gap-2">
            <input v-model="e.degree" type="text" placeholder="Diplôme" />
            <input v-model="e.school" type="text" placeholder="École" />
          </div>
          <input v-model="e.period" type="text" placeholder="Période" />
          <textarea v-model="e.description" rows="2" placeholder="Description" />
          <button class="remove" @click="cv.education.splice(i, 1)">Supprimer</button>
        </div>
        <button class="add" @click="cv.education.push(emptyEducation())">
          + Ajouter une formation
        </button>
      </div>
    </section>

    <!-- Skills -->
    <section class="panel">
      <button class="panel-head" @click="open.skills = !open.skills">
        <span>Compétences ({{ cv.skills.length }})</span>
        <span>{{ open.skills ? '−' : '+' }}</span>
      </button>
      <div v-show="open.skills" class="panel-body space-y-4">
        <div v-for="(g, i) in cv.skills" :key="i" class="item">
          <input v-model="g.category" type="text" placeholder="Catégorie" />
          <input
            :value="g.items.join(', ')"
            type="text"
            placeholder="Compétences (séparées par des virgules)"
            @input="g.items = splitCsv(($event.target as HTMLInputElement).value)"
          />
          <button class="remove" @click="cv.skills.splice(i, 1)">Supprimer</button>
        </div>
        <button class="add" @click="cv.skills.push(emptySkillGroup())">
          + Ajouter une catégorie
        </button>
      </div>
    </section>

    <!-- Languages -->
    <section class="panel">
      <button class="panel-head" @click="open.languages = !open.languages">
        <span>Langues ({{ cv.languages.length }})</span>
        <span>{{ open.languages ? '−' : '+' }}</span>
      </button>
      <div v-show="open.languages" class="panel-body space-y-3">
        <div v-for="(lang, i) in cv.languages" :key="i" class="item">
          <div class="grid grid-cols-2 gap-2">
            <input v-model="lang.name" type="text" placeholder="Langue" />
            <input v-model="lang.level" type="text" placeholder="Niveau" />
          </div>
          <button class="remove" @click="cv.languages.splice(i, 1)">Supprimer</button>
        </div>
        <button class="add" @click="cv.languages.push(emptyLanguage())">
          + Ajouter une langue
        </button>
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

.field {
  @apply flex flex-col gap-1;
}

.field > span {
  @apply text-xs font-medium text-gray-400;
}

.item {
  @apply space-y-2 rounded-md border border-gray-700 bg-gray-900/40 p-3;
}

:deep(input),
:deep(textarea) {
  @apply w-full rounded-md border border-gray-600 bg-gray-900 px-2.5 py-1.5 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-blue-500;
}

.add {
  @apply w-full rounded-md border border-dashed border-gray-600 py-2 text-sm text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors;
}

.remove {
  @apply text-xs text-red-400 hover:text-red-300;
}

.photo-row {
  @apply flex items-center gap-3;
}

.photo-preview {
  @apply flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-600 bg-gray-900;
}

.photo-preview img {
  @apply h-full w-full object-cover;
}

.photo-placeholder {
  @apply text-[10px] text-gray-500;
}

.photo-actions {
  @apply flex flex-1 flex-col gap-1;
}

.photo-file {
  @apply w-full text-xs text-gray-400 file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-600 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500;
}

.photo-hint {
  @apply text-[10px] text-gray-500;
}

.photo-error {
  @apply text-[10px] text-red-400;
}

.crop {
  @apply mt-3 space-y-1.5;
}

.crop-row {
  @apply flex items-center gap-2 text-xs text-gray-400;
}

.crop-row > span {
  @apply w-16 shrink-0;
}

.crop-row input[type='range'] {
  @apply h-1.5 flex-1 cursor-pointer accent-blue-500;
}
</style>
