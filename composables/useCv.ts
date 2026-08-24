import { watch } from 'vue'
import type {
  CvData,
  CvEducation,
  CvExperience,
  CvLanguage,
  CvLink,
  CvProject,
  CvSkillGroup,
  ThemeId,
} from '~/types/cv'
import { defaultCv } from '~/data/defaultCv'

const STORAGE_KEY = 'cv-creator:data'
const THEME_KEY = 'cv-creator:theme'

/** Deep clone helper that works without structuredClone edge cases. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** Factories for new (empty) editable entries. */
export const emptyExperience = (): CvExperience => ({
  role: '',
  company: '',
  period: '',
  location: '',
  description: '',
  highlights: [],
})

export const emptyEducation = (): CvEducation => ({
  degree: '',
  school: '',
  period: '',
  description: '',
})

export const emptySkillGroup = (): CvSkillGroup => ({
  category: '',
  items: [],
})

export const emptyProject = (): CvProject => ({
  name: '',
  description: '',
  year: '',
  url: '',
  tags: [],
})

export const emptyLanguage = (): CvLanguage => ({ name: '', level: '' })

export const emptyLink = (): CvLink => ({ label: '', url: '' })

export function useCv() {
  const cv = useState<CvData>('cv-data', () => clone(defaultCv))
  const theme = useState<ThemeId>('cv-theme', () => 'classic')
  const loaded = useState<boolean>('cv-loaded', () => false)

  function load() {
    if (import.meta.server || loaded.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) cv.value = { ...clone(defaultCv), ...JSON.parse(raw) }
      const savedTheme = localStorage.getItem(THEME_KEY) as ThemeId | null
      if (savedTheme) theme.value = savedTheme
    } catch {
      // Corrupted storage: fall back to defaults silently.
    }
    loaded.value = true

    watch(
      cv,
      (value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      },
      { deep: true },
    )
    watch(theme, (value) => {
      localStorage.setItem(THEME_KEY, value)
    })
  }

  function reset() {
    cv.value = clone(defaultCv)
    theme.value = 'classic'
  }

  function clear() {
    cv.value = {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
      links: [],
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      languages: [],
    }
  }

  return { cv, theme, loaded, load, reset, clear }
}
