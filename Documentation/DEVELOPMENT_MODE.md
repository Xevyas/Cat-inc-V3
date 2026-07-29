# Mode développement

Les outils d'accélération et de test du mini-jeu Bird sont volontairement conservés, mais ne sont plus affichés dans une partie normale.

## Ouvrir une partie normale

Ouvrir simplement :

```text
index.html
```

La vitesse reste verrouillée à 1× et le bouton permettant de forcer l'apparition de l'oiseau est masqué. L'événement aléatoire normal de l'oiseau reste actif.

## Ouvrir le mode développement

Ajouter `?debug=1` à l'adresse :

```text
index.html?debug=1
```

En mode développement :

- dans `Camp`, le bouton `?` à côté de `Base Camp` regroupe les explications permanentes. Sur mobile, un pincement à deux doigts règle le zoom autour du centre du geste. Les reconstructions du terrain et des éléments conservent la position horizontale et verticale de la caméra ;
- le sélecteur de vitesse permet toujours 1×, 2×, 5×, 10×, 50×, 100×, 500× et 1000× ;
- le bouton gris Bird permet toujours de forcer l'événement ;
- le bouton de forçage disparaît pendant qu'un événement Bird est déjà disponible, puis revient après sa résolution.
- l'onglet principal `Camp` donne accès au prototype 18 × 12. Les quatre lignes du haut montrent les arrière-façades rouge, bleue et verte dans une bande de décor immuable ; chacune utilise une vue haute dominée par le toit, puis une courte façade et un porche orienté vers son jardin. Les bosquets décoratifs restent en retrait des clôtures. La grille active est composée de trois jardins identiques de 6 × 8, séparés sur toute la carte par des clôtures en bois plantées verticalement. Le joueur démarre dans le jardin bleu : seules ses trois premières lignes, directement sous le porche, sont constructibles ; les cinq lignes suivantes contiennent des obstacles illustrés à retirer. La palette comprend trois buissons 2 × 1 (vert, ronces, fleuri), un tas de cailloux 1 × 1, un tas de blocs de pierre 2 × 2 et de hautes herbes 1 × 1. Un débroussaillage libère toute l'emprise de l'obstacle. `Terrain` permet ensuite de conquérir les jardins adjacents. Dans la vue normale, toucher `Sawmill`, `Catchen` ou `Pawsonry` affiche au-dessus du bâtiment un bouton rond à flèche verte qui ouvre respectivement `Work > Wood`, `Work > Food` ou `Work > Rocks`. Le bouton `Edit camp` ouvre l'éditeur en plein écran, avec les menus ronds `Buildings`, `Decorations`, `Paths` et `Terrain` en bas. Les bâtiments illustrés sont `Cardboard Box` (2 × 1), `Job Center` (3 × 4), `Sawmill` (3 × 2), `Catchen` (3 × 3), `Pawsonry` (3 × 3) et `Training Center` (3 × 4). `Tree` est une décoration illustrée de 2 × 2 et `Basic Trail` un chemin en copeaux de 1 × 1. Leurs sprites optimisés suivent tous la direction aquarelle et crayons de couleur du jeu. Les boutons `−`, pourcentage et `+` règlent la caméra de 75 % à 250 % ; la carte se déplace horizontalement et verticalement quand elle dépasse le viewport. Seul le mode Edit permet d'ajouter, déplacer, faire pivoter ou retirer des éléments, de débroussailler et de conquérir. Un élément existant doit d'abord être sélectionné par un appui prolongé. Le bouton `Rotate 90°` et la touche `R` appliquent une rotation si l'emprise pivotée reste libre et entièrement nettoyée. La disposition, le terrain et le zoom utilisent des stockages locaux séparés et ne font pas partie de la sauvegarde du jeu.

Le mode n'est jamais stocké dans la sauvegarde. Revenir à l'adresse sans `?debug=1` suffit pour retrouver l'interface normale et une vitesse de 1×.

Pour faciliter les tests, il est possible de créer deux favoris distincts, « Cat Inc » et « Cat Inc DEV ».
