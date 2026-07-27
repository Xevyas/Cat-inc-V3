# Audit des ressources visuelles — lot 5B

Audit réalisé le 13 juillet 2026 sur les ressources chargées par `index.html`, `style.css`, `jeu.js` et les modules JavaScript du dossier `js/`.

## Résultat principal

- 68 fichiers image, tous au format PNG.
- Poids total : 31 835 322 octets (30,36 Mio).
- 44 images sont référencées par le jeu : 24 007 280 octets (22,90 Mio).
- 24 images ne sont actuellement pas référencées : 7 828 042 octets (7,47 Mio).
- Aucun chemin manquant.
- Aucune différence de casse entre le code et le système de fichiers.
- Aucun fichier image corrompu ou portant une fausse extension détecté.
- Le code d'exécution ne dépend d'aucun dossier de sauvegarde ou de préparation.

Les fichiers non référencés ne sont pas nécessairement inutiles : plusieurs correspondent clairement à du contenu futur. Aucun fichier n'a donc été supprimé ou déplacé.

## Répartition du poids

| Dossier | Images | Poids |
|---|---:|---:|
| `Story scenes` | 5 | 14,89 Mio |
| `Maps` | 3 | 6,81 Mio |
| `Cat Souls` | 4 | 4,52 Mio |
| `Backupo` | 2 | 1,38 Mio |
| `To be converted` | 1 | 1,10 Mio |
| `resources` | 32 | 1,00 Mio |
| `interface` | 11 | 0,34 Mio |
| `Buildings` | 5 | 0,18 Mio |
| `Cat faces` | 5 | 0,13 Mio |

Les scènes et les cartes représentent 22 757 330 octets, soit environ 71,5 % de toutes les images du projet. Ce sont les meilleures candidates pour une future optimisation de poids.

## Images lourdes actuellement utilisées

| Fichier | Dimensions | Poids approximatif |
|---|---:|---:|
| `img/Story scenes/Bernardo caught bird.png` | 1536 × 1024 | 3,19 Mio |
| `img/Story scenes/Story 4.png` | 1536 × 1024 | 3,03 Mio |
| `img/Story scenes/Story 3.png` | 1536 × 1024 | 2,90 Mio |
| `img/Story scenes/Intro.png` | 1536 × 1024 | 2,90 Mio |
| `img/Story scenes/Story 6b.png` | 1536 × 1024 | 2,88 Mio |
| `img/Maps/Starting Neighbourhood.png` | 1484 × 1060 | 2,76 Mio |
| `img/Maps/Fog of War.png` | 1484 × 1060 | 2,22 Mio |
| `img/Maps/Perks fog.png` | 1484 × 1060 | 1,84 Mio |

Ces huit fichiers totalisent environ 21,70 Mio. Une conversion contrôlée vers WebP pourrait réduire fortement le téléchargement initial ou différé, mais elle doit faire l'objet d'un lot séparé avec comparaison visuelle et conservation des PNG originaux.

## Fichiers non référencés par le jeu

### Sauvegarde et préparation

- `img/Backupo/ChatGPT Image 3 juil. 2026, 22_23_57.png`
- `img/Backupo/Gang_Cat_Final.png`
- `img/To be converted/Tourterelle regardant vers la gauche.png`

### Contenu probablement futur

- les 4 images de `img/Cat Souls/` ;
- `img/interface/✅_Final.png` ;
- les ressources Ancient Wood, Copper, Dark Wood, Gold, Holy Wood, Rainbow Wood, Silver et Tin, ainsi que leurs variantes transformées, soit 16 images dans `img/resources/`.

## Doublons binaires

Deux paires sont strictement identiques octet par octet :

- `img/Buildings/Cardboard Box_Final.png` et `img/interface/Building_Tier1_Final.png` ;
- `img/Cat faces/Bernardo.png` et `img/interface/Gang_Final.png`.

Ces noms expriment des usages différents et les quatre fichiers sont légers. Les fusionner créerait un couplage entre des éléments d'interface distincts pour un gain inférieur à 52 Kio ; ils sont donc conservés.

## Contrôles automatisés ajoutés

Le fichier `tests/assets-system.test.js` vérifie désormais :

1. que chaque chemin d'image utilisé à l'exécution existe ;
2. que sa casse correspond exactement au nom présent sur disque, y compris pour un futur hébergement sensible à la casse ;
3. que les signatures binaires correspondent aux extensions annoncées ;
4. que le jeu ne dépend pas des dossiers de sauvegarde ou de préparation.

## Accessibilité des images — lot 6D4

L'audit d'exécution couvre 124 éléments `<img>` dans un état avancé du jeu : aucun ne manque désormais d'attribut `alt`.

- les 11 ressources de `STORY_ASSETS` portent une description contextualisée utilisée dans la modale du récit ;
- les aperçus de la galerie Stories, les icônes de navigation et les images répétant immédiatement un libellé visible utilisent volontairement `alt=""` ;
- les icônes servant seules de contrôle sont placées dans un bouton doté d'un `aria-label` décrivant l'action ;
- les images de ressources intégrées à un prix conservent leur nom, car elles complètent réellement la quantité affichée.

Deux tests structurels empêchent le retour d'une image sans politique alternative et imposent une description non vide pour chaque entrée de `STORY_ASSETS`.

## Recommandation pour la suite

Conserver l'arborescence actuelle pour le moment. Le gain potentiel important se situe dans la compression ou la conversion des cinq scènes et des trois cartes, pas dans la suppression des petits doublons ni dans les icônes de ressources.
