export interface CvLink {
  label: string
  url: string
}

export interface CvExperience {
  role: string
  company: string
  period: string
  location: string
  description: string
  highlights: string[]
}

export interface CvEducation {
  degree: string
  school: string
  period: string
  description: string
}

export interface CvSkillGroup {
  category: string
  items: string[]
}

export interface CvProject {
  name: string
  description: string
  year: string
  url: string
  tags: string[]
}

export interface CvLanguage {
  name: string
  level: string
}

/** Reorderable / hideable content sections. */
export type SectionId =
  | 'summary'
  | 'experiences'
  | 'projects'
  | 'education'
  | 'skills'
  | 'languages'

export type FontChoice = '' | 'sans' | 'serif' | 'mono'
export type Density = 'compact' | 'normal' | 'comfortable'

/** User customization that travels with the CV (exported in the JSON). */
export interface CvSettings {
  /** Order of the content sections. */
  sectionOrder: SectionId[]
  /** Sections the user has hidden. */
  hidden: SectionId[]
  /** Custom accent color (hex). Empty string = use the theme default. */
  accentColor: string
  /** Font family override. Empty string = use the theme default. */
  fontFamily: FontChoice
  /** Vertical rhythm / size preset. */
  density: Density
  /** Profile picture zoom factor (1 = fit). */
  photoZoom: number
  /** Horizontal focus point in percent (0–100, 50 = center). */
  photoOffsetX: number
  /** Vertical focus point in percent (0–100, 50 = center). */
  photoOffsetY: number
}

export interface CvData {
  fullName: string
  title: string
  /** Data URL (base64) of the imported profile picture, or empty string. */
  photo: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  links: CvLink[]
  experiences: CvExperience[]
  education: CvEducation[]
  skills: CvSkillGroup[]
  projects: CvProject[]
  languages: CvLanguage[]
  settings: CvSettings
}

export type ModernVariantId =
  | 'modern'
  | 'modern-emerald'
  | 'modern-slate'
  | 'modern-right'
  | 'modern-plum'

export type ThemeId =
  | 'classic'
  | 'minimal'
  | 'terminal'
  | ModernVariantId

/** Visual configuration for a Modern-family theme variant. */
export interface ModernVariant {
  sidebarBg: string
  sidebarAccent: string
  sidebarText: string
  sidebarMuted: string
  sidebarBorder: string
  sidebarHeading: string
  labelColor: string
  headingColor: string
  barColor: string
  /** Which side the sidebar sits on. */
  side: 'left' | 'right'
}

export interface ThemeMeta {
  id: ThemeId
  name: string
  description: string
  /** Accent color used for the small swatch in the theme picker. */
  accent: string
  /** Grouping label for the picker (e.g. "Moderne"). */
  group?: string
}
