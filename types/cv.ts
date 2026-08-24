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

export interface CvData {
  fullName: string
  title: string
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
}

export type ThemeId = 'classic' | 'modern' | 'minimal' | 'terminal'

export interface ThemeMeta {
  id: ThemeId
  name: string
  description: string
  /** Accent color used for the small swatch in the theme picker. */
  accent: string
}
