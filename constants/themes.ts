import type { ThemeMeta } from '~/types/cv'

export const themes: ThemeMeta[] = [
  {
    id: 'classic',
    name: 'Classique',
    description: 'Une colonne, empattements élégants, style traditionnel.',
    accent: '#1f2937',
    group: 'Base',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sans-serif épuré, beaucoup de blanc.',
    accent: '#0f766e',
    group: 'Base',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Thème sombre monospace, clin d’œil au portfolio.',
    accent: '#22c55e',
    group: 'Base',
  },
  {
    id: 'modern',
    name: 'Moderne Bleu',
    description: 'Deux colonnes, barre latérale bleue.',
    accent: '#2563eb',
    group: 'Moderne',
  },
  {
    id: 'modern-emerald',
    name: 'Moderne Émeraude',
    description: 'Barre latérale vert émeraude.',
    accent: '#059669',
    group: 'Moderne',
  },
  {
    id: 'modern-slate',
    name: 'Moderne Ardoise',
    description: 'Barre latérale ardoise, accents ambrés.',
    accent: '#f59e0b',
    group: 'Moderne',
  },
  {
    id: 'modern-plum',
    name: 'Moderne Prune',
    description: 'Barre latérale violet prune.',
    accent: '#9333ea',
    group: 'Moderne',
  },
  {
    id: 'modern-right',
    name: 'Moderne Sarcelle',
    description: 'Barre latérale sarcelle placée à droite.',
    accent: '#14b8a6',
    group: 'Moderne',
  },
]

