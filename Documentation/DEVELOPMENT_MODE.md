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

- le sélecteur de vitesse permet toujours 1×, 2×, 5×, 10×, 50×, 100×, 500× et 1000× ;
- le bouton gris Bird permet toujours de forcer l'événement ;
- le bouton de forçage disparaît pendant qu'un événement Bird est déjà disponible, puis revient après sa résolution.
- l'onglet principal `Camp` donne accès au prototype 20 × 30. La vue normale réserve les clics aux futures interactions avec les éléments ; le bouton `Edit camp` ouvre l'éditeur en plein écran, avec les menus ronds `Buildings`, `Decorations` et `Paths` en bas. Seul ce mode permet d'ajouter, déplacer ou retirer des éléments. La disposition est enregistrée dans un stockage local séparé et ne fait pas partie de la sauvegarde du jeu.

Le mode n'est jamais stocké dans la sauvegarde. Revenir à l'adresse sans `?debug=1` suffit pour retrouver l'interface normale et une vitesse de 1×.

Pour faciliter les tests, il est possible de créer deux favoris distincts, « Cat Inc » et « Cat Inc DEV ».
