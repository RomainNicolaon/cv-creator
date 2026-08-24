import { computed } from 'vue'
import type { CvSettings, SectionId } from '~/types/cv'
import {
  DENSITY_SCALE,
  FONT_STACKS,
  MODERN_SIDEBAR_SECTIONS,
  SECTION_IDS,
  defaultSettings,
} from '~/constants/sections'

/** Merge partial/legacy settings with the defaults so themes never crash. */
export function withSettingsDefaults(
  s: Partial<CvSettings> | undefined,
): CvSettings {
  const d = defaultSettings()
  if (!s) return d
  const order = Array.isArray(s.sectionOrder)
    ? s.sectionOrder.filter((id): id is SectionId => SECTION_IDS.includes(id))
    : []
  // Append any sections missing from a persisted/imported order.
  for (const id of SECTION_IDS) if (!order.includes(id)) order.push(id)
  return {
    sectionOrder: order,
    hidden: Array.isArray(s.hidden)
      ? s.hidden.filter((id): id is SectionId => SECTION_IDS.includes(id))
      : [],
    accentColor: typeof s.accentColor === 'string' ? s.accentColor : '',
    fontFamily:
      s.fontFamily === 'sans' ||
      s.fontFamily === 'serif' ||
      s.fontFamily === 'mono'
        ? s.fontFamily
        : '',
    density:
      s.density === 'compact' || s.density === 'comfortable'
        ? s.density
        : 'normal',
    photoZoom: clampNumber(s.photoZoom, 1, 3, 1),
    photoOffsetX: clampNumber(s.photoOffsetX, 0, 100, 50),
    photoOffsetY: clampNumber(s.photoOffsetY, 0, 100, 50),
  }
}

function clampNumber(
  v: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : fallback
  return Math.min(max, Math.max(min, n))
}

/** Visible sections in the configured order (optionally limited to a subset). */
export function orderedVisibleSections(
  settings: CvSettings,
  restrictTo?: SectionId[],
): SectionId[] {
  return settings.sectionOrder.filter(
    (id) =>
      !settings.hidden.includes(id) &&
      (!restrictTo || restrictTo.includes(id)),
  )
}

interface ThemeStyleOptions {
  /** The theme's natural base font size, in points. */
  baseFontPt: number
  /** The theme's natural accent color (used when no custom accent is set). */
  defaultAccent: string
}

/**
 * Computes the root inline style + ordered section lists for a theme, applying
 * the user's accent, font, and density customizations.
 */
export function useThemeStyle(
  getSettings: () => CvSettings,
  opts: ThemeStyleOptions,
) {
  const settings = computed(() => getSettings())

  const accent = computed(
    () => settings.value.accentColor || opts.defaultAccent,
  )

  const rootStyle = computed<Record<string, string>>(() => {
    const s = settings.value
    const scale = DENSITY_SCALE[s.density] ?? DENSITY_SCALE.normal
    const style: Record<string, string> = {
      '--accent': accent.value,
      '--cv-sp': String(scale.sp),
      fontSize: `${(opts.baseFontPt * scale.fs).toFixed(2)}pt`,
    }
    if (s.fontFamily) style.fontFamily = FONT_STACKS[s.fontFamily]
    return style
  })

  const mainSections = computed(() =>
    orderedVisibleSections(
      settings.value,
      SECTION_IDS.filter((id) => !MODERN_SIDEBAR_SECTIONS.includes(id)),
    ),
  )

  const sidebarSections = computed(() =>
    orderedVisibleSections(settings.value, MODERN_SIDEBAR_SECTIONS),
  )

  const allSections = computed(() => orderedVisibleSections(settings.value))

  return { accent, rootStyle, allSections, mainSections, sidebarSections }
}
