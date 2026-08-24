import type { CvSettings, Density, FontChoice, SectionId } from '~/types/cv'

/** All content sections in their canonical (default) order. */
export const SECTION_IDS: SectionId[] = [
  'summary',
  'experiences',
  'projects',
  'education',
  'skills',
  'languages',
]

export const SECTION_LABELS: Record<SectionId, string> = {
  summary: 'Profil',
  experiences: 'Expériences',
  projects: 'Projets',
  education: 'Formation',
  skills: 'Compétences',
  languages: 'Langues',
}

/**
 * In the two-column Modern themes these sections live in the sidebar; the rest
 * flow in the main column. Ordering/visibility still apply within each column.
 */
export const MODERN_SIDEBAR_SECTIONS: SectionId[] = ['skills', 'languages']

export const FONT_CHOICES: { id: FontChoice; label: string }[] = [
  { id: '', label: 'Thème' },
  { id: 'sans', label: 'Sans' },
  { id: 'serif', label: 'Serif' },
  { id: 'mono', label: 'Mono' },
]

export const FONT_STACKS: Record<Exclude<FontChoice, ''>, string> = {
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  serif: "'Source Serif 4', Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
}

export const DENSITY_CHOICES: { id: Density; label: string }[] = [
  { id: 'compact', label: 'Compact' },
  { id: 'normal', label: 'Normal' },
  { id: 'comfortable', label: 'Confort' },
]

/** Font-size and spacing multipliers per density preset. */
export const DENSITY_SCALE: Record<Density, { fs: number; sp: number }> = {
  compact: { fs: 0.92, sp: 0.8 },
  normal: { fs: 1, sp: 1 },
  comfortable: { fs: 1.06, sp: 1.22 },
}

export function defaultSettings(): CvSettings {
  return {
    sectionOrder: [...SECTION_IDS],
    hidden: [],
    accentColor: '',
    fontFamily: '',
    density: 'normal',
    photoZoom: 1,
    photoOffsetX: 50,
    photoOffsetY: 50,
  }
}
