import type { ThemeMeta } from '~/types/cv'

export const themes: ThemeMeta[] = [
  {
    id: 'classic',
    name: 'Classique',
    description: 'Une colonne, empattements élégants, style traditionnel.',
    accent: '#1f2937',
  },
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Deux colonnes avec barre latérale colorée.',
    accent: '#2563eb',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sans-serif épuré, beaucoup de blanc.',
    accent: '#0f766e',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Thème sombre monospace, clin d’œil au portfolio.',
    accent: '#22c55e',
  },
]
