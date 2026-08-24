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
import { themes } from '~/constants/themes'
import { useCv } from '~/composables/useCv'

const EXPORT_VERSION = 1

interface CvExportFile {
  app: 'cv-creator'
  version: number
  exportedAt: string
  theme: ThemeId
  cv: CvData
}

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : fallback

const strArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((i) => typeof i === 'string') : []

function normalizeLink(v: unknown): CvLink {
  const o = (v ?? {}) as Record<string, unknown>
  return { label: str(o.label), url: str(o.url) }
}

function normalizeExperience(v: unknown): CvExperience {
  const o = (v ?? {}) as Record<string, unknown>
  return {
    role: str(o.role),
    company: str(o.company),
    period: str(o.period),
    location: str(o.location),
    description: str(o.description),
    highlights: strArray(o.highlights),
  }
}

function normalizeEducation(v: unknown): CvEducation {
  const o = (v ?? {}) as Record<string, unknown>
  return {
    degree: str(o.degree),
    school: str(o.school),
    period: str(o.period),
    description: str(o.description),
  }
}

function normalizeSkillGroup(v: unknown): CvSkillGroup {
  const o = (v ?? {}) as Record<string, unknown>
  return { category: str(o.category), items: strArray(o.items) }
}

function normalizeProject(v: unknown): CvProject {
  const o = (v ?? {}) as Record<string, unknown>
  return {
    name: str(o.name),
    description: str(o.description),
    year: str(o.year),
    url: str(o.url),
    tags: strArray(o.tags),
  }
}

function normalizeLanguage(v: unknown): CvLanguage {
  const o = (v ?? {}) as Record<string, unknown>
  return { name: str(o.name), level: str(o.level) }
}

const arr = <T>(v: unknown, map: (item: unknown) => T): T[] =>
  Array.isArray(v) ? v.map(map) : []

/** Coerce arbitrary parsed JSON into a safe, fully-formed CvData. */
export function normalizeCv(input: unknown): CvData {
  const o = (input ?? {}) as Record<string, unknown>
  const photo = str(o.photo)
  return {
    fullName: str(o.fullName),
    title: str(o.title),
    // Only accept image data URLs for the photo, ignore anything else.
    photo: photo.startsWith('data:image/') ? photo : '',
    email: str(o.email),
    phone: str(o.phone),
    location: str(o.location),
    website: str(o.website),
    summary: str(o.summary),
    links: arr(o.links, normalizeLink),
    experiences: arr(o.experiences, normalizeExperience),
    education: arr(o.education, normalizeEducation),
    skills: arr(o.skills, normalizeSkillGroup),
    projects: arr(o.projects, normalizeProject),
    languages: arr(o.languages, normalizeLanguage),
  }
}

const isKnownTheme = (v: unknown): v is ThemeId =>
  typeof v === 'string' && themes.some((t) => t.id === v)

export function useCvIo() {
  const { cv, theme } = useCv()

  function exportJson() {
    const payload: CvExportFile = {
      app: 'cv-creator',
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      theme: theme.value,
      cv: cv.value,
    }
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const safeName = (cv.value.fullName || 'cv').trim().replace(/\s+/g, '-')
    const date = new Date().toISOString().slice(0, 10)
    const a = document.createElement('a')
    a.href = url
    a.download = `cv-${safeName}-${date}.json`.toLowerCase()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Parse and apply a CV export file. Accepts both the wrapped export format
   * ({ app, version, cv, theme }) and a bare CvData object. Returns a result
   * so the caller can surface success / error feedback.
   */
  function importJson(raw: string): { ok: boolean; error?: string } {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return { ok: false, error: 'Fichier JSON invalide.' }
    }

    if (parsed === null || typeof parsed !== 'object') {
      return { ok: false, error: 'Le fichier ne contient pas de CV valide.' }
    }

    const obj = parsed as Record<string, unknown>
    const source = 'cv' in obj ? obj.cv : obj

    if (source === null || typeof source !== 'object') {
      return { ok: false, error: 'Le fichier ne contient pas de CV valide.' }
    }

    cv.value = normalizeCv(source)

    const importedTheme = 'theme' in obj ? obj.theme : undefined
    if (isKnownTheme(importedTheme)) theme.value = importedTheme

    return { ok: true }
  }

  return { exportJson, importJson }
}
