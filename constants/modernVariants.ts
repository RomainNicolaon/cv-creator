import type { ModernVariant, ModernVariantId } from '~/types/cv'

/**
 * Visual presets for the Modern theme family. Each variant reuses the same
 * two-column layout but changes the sidebar palette and/or its side.
 */
export const modernVariants: Record<ModernVariantId, ModernVariant> = {
  modern: {
    sidebarBg: '#1e3a8a',
    sidebarAccent: '#2563eb',
    sidebarText: '#e0e7ff',
    sidebarMuted: '#bfdbfe',
    sidebarBorder: '#3b5bb7',
    sidebarHeading: '#93c5fd',
    labelColor: '#ffffff',
    headingColor: '#1e3a8a',
    barColor: '#2563eb',
    side: 'left',
  },
  'modern-emerald': {
    sidebarBg: '#064e3b',
    sidebarAccent: '#059669',
    sidebarText: '#d1fae5',
    sidebarMuted: '#a7f3d0',
    sidebarBorder: '#1f6f5a',
    sidebarHeading: '#6ee7b7',
    labelColor: '#ffffff',
    headingColor: '#065f46',
    barColor: '#059669',
    side: 'left',
  },
  'modern-slate': {
    sidebarBg: '#1f2937',
    sidebarAccent: '#f59e0b',
    sidebarText: '#e5e7eb',
    sidebarMuted: '#9ca3af',
    sidebarBorder: '#374151',
    sidebarHeading: '#fbbf24',
    labelColor: '#ffffff',
    headingColor: '#111827',
    barColor: '#f59e0b',
    side: 'left',
  },
  'modern-plum': {
    sidebarBg: '#4a1d52',
    sidebarAccent: '#9333ea',
    sidebarText: '#f3e8ff',
    sidebarMuted: '#e9d5ff',
    sidebarBorder: '#6b3673',
    sidebarHeading: '#d8b4fe',
    labelColor: '#ffffff',
    headingColor: '#6b21a8',
    barColor: '#9333ea',
    side: 'left',
  },
  'modern-right': {
    sidebarBg: '#0f766e',
    sidebarAccent: '#14b8a6',
    sidebarText: '#ccfbf1',
    sidebarMuted: '#99f6e4',
    sidebarBorder: '#1d8f86',
    sidebarHeading: '#5eead4',
    labelColor: '#ffffff',
    headingColor: '#0f766e',
    barColor: '#14b8a6',
    side: 'right',
  },
}

export const isModernVariant = (id: string): id is ModernVariantId =>
  id in modernVariants
