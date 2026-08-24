# CV Creator (PDF)

Petit générateur de CV en **PDF** construit avec **Nuxt 3**. Choisissez un thème,
éditez vos informations et exportez le résultat via l'impression du navigateur
(« Enregistrer au format PDF »).

## Fonctionnalités

- ✍️ Édition en direct de toutes les sections (profil, expériences, projets,
  formation, compétences, langues, liens).
- 🖼️ **Import d'une photo de profil** (JPG/PNG, stockée dans le navigateur),
  avec **recadrage** (zoom + position), affichée dans tous les thèmes.
- 🎨 **8 thèmes** répartis en deux familles :
  - **Base** : Classique, Minimal, Terminal.
  - **Moderne** (2 colonnes) : Bleu, Émeraude, Ardoise, Prune, et Sarcelle
    (barre latérale à droite).
- 🧩 **Personnalisation** (onglet _Style_) :
  - **Réorganisation des sections** par glisser-déposer ou flèches, et
    **masquage** de sections au choix.
  - **Couleur d'accent** personnalisée (palette ou sélecteur de couleur).
  - **Police** (thème / sans / serif / mono) et **densité** (compact / normal /
    confort) pour tenir sur une page.
- 👁️ Aperçu au format A4 mis à l'échelle en temps réel.
- 💾 Sauvegarde automatique dans le navigateur (`localStorage`).
- 🔄 **Sauvegarde / restauration JSON** : exportez tout le CV (photo et
  personnalisation comprises) dans un fichier `.json` et réimportez-le plus tard
  ou sur une autre machine.
- 🧾 Pré-rempli avec les données du portfolio (entièrement modifiable).
- ⬇️ Export PDF via l'impression native (haute qualité, texte sélectionnable).

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000.

## Export du CV en PDF

1. Complétez / modifiez vos informations et sélectionnez un thème.
2. Cliquez sur **⬇ Télécharger le PDF**.
3. Dans la boîte de dialogue d'impression, choisissez **« Enregistrer au format PDF »**.
4. Réglez les marges sur **« Aucune »** et activez **« Graphiques d'arrière-plan »**
   pour conserver les couleurs des thèmes Moderne / Terminal.

## Sauvegarde & partage (JSON)

- **⬇ Exporter JSON** télécharge un fichier `cv-<nom>-<date>.json` contenant
  l'intégralité du CV (photo incluse) et le thème sélectionné.
- **⬆ Importer JSON** recharge un fichier exporté (ou un objet CV brut). Les
  données sont validées et normalisées : les champs manquants sont ignorés sans
  planter, et une photo non valide est écartée. Un message confirme le succès
  ou l'erreur.

## Scripts

| Commande            | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Serveur de développement           |
| `npm run build`     | Build de production                |
| `npm run generate`  | Génération statique (SPA)          |
| `npm run preview`   | Prévisualisation du build          |
| `npm run typecheck` | Vérification des types TypeScript  |

## Déploiement (GitHub Actions → O2Switch)

Le déploiement reprend le même schéma que le portfolio, via
`.github/workflows/` :

- **`ci.yml`** — vérifie les types et le build sur chaque `push`/`pull_request`.
- **`build.yml`** — workflow réutilisable : `npm ci`, typecheck, build SSR,
  puis publication de `.output/` en artefact.
- **`deploy.yml`** — sur `push` vers `main` (ou manuellement via
  _workflow_dispatch_) : build, whitelist temporaire de l'IP du runner sur
  cPanel, puis envoi de `.output/` en **rsync/SSH** vers O2Switch.

Secrets à configurer dans le dépôt (Settings → Secrets and variables →
Actions) :

| Secret             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `CPANEL_USERNAME`  | Utilisateur cPanel O2Switch                            |
| `CPANEL_API_TOKEN` | Token API cPanel (cPanel → Gérer les jetons API)       |
| `CPANEL_SERVER`    | Hôte du serveur cPanel (ex : `xxx.o2switch.net`)       |
| `SSH_KEY`          | Clé privée SSH autorisée sur le compte cPanel          |
| `DEPLOY_PATH`      | Chemin de l'app sur le serveur (ex : `nodeapp`)        |
| `SSH_PORT`         | _(optionnel)_ Port SSH, `22` par défaut                |

## Structure

```
components/
  EditorPanel.vue          # Formulaire d'édition (dont photo + recadrage)
  CustomizePanel.vue       # Onglet Style : sections, accent, police, densité
  CvPreview.vue            # Sélection du thème + mise à l'échelle
  CvPhoto.vue              # Rendu de la photo recadrée (zoom/position)
  themes/                  # Un composant par famille de thème
composables/useCv.ts       # État + persistance localStorage
composables/useCvIo.ts     # Import / export JSON (+ normalisation)
composables/useThemeStyle.ts # Accent / police / densité + ordre des sections
constants/themes.ts        # Registre des thèmes (picker)
constants/modernVariants.ts # Palettes des variantes « Moderne »
constants/sections.ts      # Sections, libellés, polices, densités, réglages
data/defaultCv.ts          # Données par défaut (portfolio)
types/cv.ts                # Types du CV
assets/css/main.css        # Styles globaux + règles d'impression
```
