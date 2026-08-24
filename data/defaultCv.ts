import type { CvData } from '~/types/cv'

/**
 * Données par défaut du CV, reprises du portfolio de Romain Nicolaon.
 * Entièrement éditables dans l'application (rien n'est figé).
 */
export const defaultCv: CvData = {
  fullName: 'Romain NICOLAON',
  title: 'Développeur Full-Stack',
  email: 'nicolaon.romain@gmail.com',
  phone: '',
  location: 'Bourges, France',
  website: 'https://www.nicolaon.fr',
  summary:
    "Développeur full-stack avec plusieurs années d'expérience dans la conception d'applications web modernes. J'aime transformer des problèmes complexes en solutions simples et élégantes, avec une attention particulière portée à la performance, la maintenabilité et l'expérience utilisateur.",
  links: [
    { label: 'GitHub', url: 'https://github.com/RomainNicolaon' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/romain-nicolaon/' },
    { label: 'Site web', url: 'https://www.nicolaon.fr' },
  ],
  experiences: [
    {
      role: 'Développeur Web Full Stack',
      company: 'Inleed',
      period: "sept. 2024 — aujourd'hui",
      location: 'Bourges, France · Sur site',
      description: "CDI. Développement d'applications web full stack.",
      highlights: [],
    },
    {
      role: 'Développeur Web',
      company: 'Inleed',
      period: 'juin 2023 — oct. 2024',
      location: 'Bourges, France · Sur site',
      description:
        'Contrat en alternance. Développement web front-end et back-end.',
      highlights: [],
    },
    {
      role: 'Emploi temporaire vacance (ETV)',
      company: 'Crédit Agricole Centre Loire',
      period: 'août 2022',
      location: 'Bourges, France',
      description: 'CDD. Support matériel informatique et activités bancaires.',
      highlights: [],
    },
  ],
  education: [
    {
      degree: 'Développeur Web et Web Mobile',
      school: 'CEFIM',
      period: 'avr. 2023 — sept. 2024',
      description:
        'Formation Web et Web Mobile — Réussite. Développement web back-end et front-end.',
    },
    {
      degree: 'Computer Programming / Programmer, General',
      school: 'Algosup',
      period: 'janv. 2021 — oct. 2022',
      description:
        'Reconversion. Développement web back-end, apprentissage automatique.',
    },
    {
      degree: 'Bac STI2D, Informatique',
      school: 'Lycée Pierre Émile Martin',
      period: '2018 — 2020',
      description: 'Diplôme obtenu. Développement front-end, autonomie.',
    },
  ],
  skills: [
    {
      category: 'Langages',
      items: [
        'PHP',
        'JavaScript',
        'TypeScript',
        'SQL',
        'Bash',
        'HTML',
        'CSS',
        'Python',
        'C#',
      ],
    },
    {
      category: 'Frameworks & Librairies',
      items: [
        'Symfony',
        'Laravel',
        'Vue.js',
        'React',
        'Tailwind CSS',
        'Node.js',
      ],
    },
    {
      category: 'Bases de données',
      items: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'],
    },
    {
      category: 'Outils & DevOps',
      items: ['Docker', 'Git', 'GitLab CI', 'Linux', 'Nginx', 'Composer'],
    },
  ],
  projects: [
    {
      name: 'terminal-portfolio',
      description:
        'Portfolio personnel au style terminal, en Nuxt avec données TypeScript et Tailwind CSS.',
      year: '2026',
      url: 'https://github.com/RomainNicolaon/portfolio',
      tags: ['Nuxt', 'Vue', 'Tailwind'],
    },
    {
      name: 'inleed-cms',
      description:
        "CMS interne pour la gestion de contenu des sites web des clients : API Express, tableau de bord et sites clients en React, base MongoDB.",
      year: '2023-2026',
      url: '',
      tags: ['Express', 'React', 'MongoDB'],
    },
    {
      name: 'ca-auto-connect-and-get-operations',
      description:
        'Outil Node.js automatisé qui se connecte à un compte bancaire et télécharge les opérations au format CSV via Puppeteer.',
      year: '2025',
      url: 'https://github.com/RomainNicolaon/ca-auto-connect-and-get-operations',
      tags: ['JavaScript', 'Node.js', 'Puppeteer'],
    },
  ],
  languages: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'Professionnel' },
  ],
}
