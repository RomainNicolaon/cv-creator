# CV Creator (PDF)

Petit générateur de CV en **PDF** construit avec **Nuxt 3**. Choisissez un thème,
éditez vos informations et exportez le résultat via l'impression du navigateur
(« Enregistrer au format PDF »).

## Fonctionnalités

- ✍️ Édition en direct de toutes les sections (profil, expériences, projets,
  formation, compétences, langues, liens).
- 🖼️ **Import d'une photo de profil** (JPG/PNG, stockée dans le navigateur),
  affichée dans tous les thèmes.
- 🎨 **8 thèmes** répartis en deux familles :
  - **Base** : Classique, Minimal, Terminal.
  - **Moderne** (2 colonnes) : Bleu, Émeraude, Ardoise, Prune, et Sarcelle
    (barre latérale à droite).
- 👁️ Aperçu au format A4 mis à l'échelle en temps réel.
- 💾 Sauvegarde automatique dans le navigateur (`localStorage`).
- 🔄 **Sauvegarde / restauration JSON** : exportez tout le CV (photo comprise)
  dans un fichier `.json` et réimportez-le plus tard ou sur une autre machine.
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

## Structure

```
components/
  EditorPanel.vue          # Formulaire d'édition (dont import photo)
  CvPreview.vue            # Sélection du thème + mise à l'échelle
  themes/                  # Un composant par famille de thème
composables/useCv.ts       # État + persistance localStorage
composables/useCvIo.ts     # Import / export JSON (+ normalisation)
constants/themes.ts        # Registre des thèmes (picker)
constants/modernVariants.ts # Palettes des variantes « Moderne »
data/defaultCv.ts          # Données par défaut (portfolio)
types/cv.ts                # Types du CV
assets/css/main.css        # Styles globaux + règles d'impression
```
