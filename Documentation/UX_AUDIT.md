# Audit UX — lot 6A

Audit réalisé le 13 juillet 2026, sans modification du HTML, du CSS ou du JavaScript du jeu.

Le parcours a été contrôlé sur une partie vierge, après les trois premiers chats, puis dans un état avancé donnant accès à tous les onglets actuels. Les captures ont été réalisées en 1440 × 1000, 390 × 844, 390 × 667 et en orientation paysage.

## Verdict

Cat Inc possède déjà une identité visuelle attachante, un principe de déblocage progressif solide et une interface de production qui exprime bien la relation ressource brute → ressource transformée. Le jeu n'a pas besoin d'une refonte totale.

Les priorités sont plutôt :

1. retirer les éléments de développement visibles et protéger le rythme du jeu ;
2. rendre les écrans narratifs utilisables sur toutes les hauteurs ;
3. rendre la navigation et les ressources compréhensibles sans connaître les icônes ;
4. transformer le tutoriel en véritable guide contextuel ;
5. ajouter les fondations d'accessibilité clavier, tactile et visuelle.

## Suivi après le lot 6B

Les trois problèmes critiques suivants ont été traités après cet audit :

- les outils d'accélération et de forçage de l'oiseau sont maintenant réservés à l'URL `?debug=1` ;
- les scènes narratives sont défilables et adaptées aux écrans courts et au paysage ;
- les notifications restantes sont affichées en file d'attente, tandis que les résultats automatiques des scoutings restent uniquement dans Logs.

Les constats des lots 6C à 6E restent à traiter.

## Ce qui fonctionne déjà bien

- L'identité graphique est chaleureuse et cohérente. Les chats, bâtiments, ressources et scènes racontent le même univers.
- L'introduction présente immédiatement le ton narratif et donne une action principale claire.
- Les fonctions apparaissent progressivement, ce qui évite de montrer toute la complexité dès la première minute.
- Le bouton de recrutement et le temps du prochain chat restent visibles.
- L'écran Work représente efficacement le flux brut → transformé, le coût ×10, les emplacements et la progression.
- La version portrait à 390 px ne produit aucun débordement horizontal.
- La navigation liste → fiche d'un chat est adaptée au mobile et fournit un bouton Back clair.
- La barre d'onglets reste accessible en bas de l'écran mobile.
- Les sauvegardes, l'import, l'export et la remise à zéro sont regroupés proprement dans Settings.
- Logs et Stories fournissent un historique et permettent de revoir les scènes.
- Les fonctionnalités se dégradent proprement lorsque les sections sont encore verrouillées.

## P0 — Défauts critiques avant publication

### 1. Contrôles de développement exposés

Le bouton gris représentant un oiseau est visible dès la première seconde. Son attribut `title` indique explicitement `[DEV] Force bird spawn` et il permet de déclencher l'événement sans attendre.

Le bouton `1×` donne également accès à 2×, 5×, 10×, 50×, 100×, 500× et 1000×. Aucun coût, déblocage ou contexte de gameplay ne lui est associé. Il accélère recrutement, production, exploration, étude et formation, et permet donc de contourner tout le rythme incrémental.

Recommandation : conserver ces deux outils dans un mode de développement explicite, mais les masquer dans une partie normale. Si l'accélération est volontairement destinée aux joueurs, elle doit devenir une mécanique conçue, expliquée, équilibrée et sauvegardée.

### 2. Introduction bloquante sur écran court ou paysage

Les modales narratives sont centrées verticalement, sans hauteur maximale et sans défilement interne.

- À 390 × 667, la carte dépasse déjà légèrement en haut et en bas.
- En paysage, la mise en page bascule en mode desktop parce que la largeur dépasse 768 px. Le `min-width: 900px` du body agrandit alors le viewport de mise en page à 900 px.
- Sur le test paysage, la carte allait de `-191 px` à `608 px` pour une hauteur disponible d'environ 416 px. Le bouton d'action était hors écran et inaccessible.

Comme l'introduction n'a pas de bouton de fermeture alternatif, un joueur peut rester bloqué avant même de commencer.

Recommandation : rendre l'overlay scrollable, limiter la hauteur de la carte, réduire l'image sur les écrans courts et traiter le paysage selon la hauteur ou le type de pointeur, pas seulement selon une largeur de 768 px.

## P1 — Problèmes importants de compréhension et d'usage

### 3. Navigation uniquement par icônes

Les libellés des sept onglets sont présents dans le HTML mais masqués sur desktop comme sur mobile. Plusieurs icônes sont proches visuellement : Houses et Facilities représentent des bâtiments, tandis que l'icône de Logs affiche seulement « Miaou ».

Un nouveau joueur doit mémoriser les symboles ou les essayer un par un. Un nouvel onglet débloqué ne reçoit pas non plus d'indicateur persistant.

Recommandation : afficher les libellés sur desktop et employer au minimum un libellé court, une infobulle tactile ou un état « nouveau » sur mobile.

### 4. Ressources compréhensibles seulement au survol

La barre supérieure affiche des images et des nombres, sans noms visibles. Le nom est fourni par une infobulle `:hover`, indisponible sur écran tactile. La barre devient horizontalement défilable sur mobile sans signaler que d'autres ressources se trouvent hors écran.

Recommandation : fournir un popover au toucher/clic, un nom accessible, et un indice visuel lorsqu'une partie de la barre est hors champ.

### 5. Tutoriel trop passif et envahissant

Le tutoriel liste les objectifs, mais :

- il ne montre pas la progression numérique, par exemple 4/10 ;
- il ne permet pas d'aller directement vers l'écran concerné ;
- plusieurs branches apparaissent simultanément, jusqu'à six dans l'état testé ;
- les objectifs terminés restent dans le même panneau ;
- sur desktop, le panneau de 280 × 360 px recouvre durablement le contenu en bas à gauche ;
- sur mobile, il est réduit par défaut et ne montre donc pas la prochaine action sans un toucher supplémentaire.

Recommandation : mettre en avant une prochaine action principale, afficher la progression, rendre les objectifs navigables et déplacer l'historique terminé dans Logs.

### 6. Notifications superposées

Chaque notification est créée au même emplacement pendant trois secondes. Lorsque la capture d'un chat déclenche aussi un déblocage, les messages se superposent exactement et deviennent illisibles. Le troisième chat déclenche naturellement « joined the gang » et « Cathering unlocked » à la suite.

Recommandation : utiliser une file d'attente ou une pile verticale limitée, et regrouper les messages liés à une même action.

### 7. Accessibilité insuffisante

Mesures effectuées dans un état avancé :

- aucune règle visuelle `:focus` ou `:focus-visible` ;
- jusqu'à 30 `div` cliquables sans rôle ni accès clavier ;
- 10 images créées dynamiquement sans texte alternatif dans le DOM ;
- 10 boutons visibles sur 17 avaient au moins une dimension inférieure à 44 px dans l'écran mesuré ;
- plusieurs contrastes sont sous 4,5:1 : orange sur blanc 2,97:1, blanc sur orange 2,97:1, gris `#bbb` sur blanc 1,92:1.

Les modales n'ont pas de rôle `dialog`, ne piègent pas le focus et ne rendent pas le focus au contrôle d'origine.

Recommandation : employer de vrais boutons pour toutes les cartes interactives, ajouter les états de focus, les attributs de dialogue, les noms accessibles, des cibles tactiles suffisantes et une palette de texte conforme.

## P2 — Améliorations de confort

### 8. États vides très espacés

Au début, la fiche de chat vide occupe une grande carte blanche et la majorité de l'écran ne contient rien. Après le premier recrutement, la fiche reste vide jusqu'à ce que le joueur comprenne qu'il doit sélectionner Bernardo.

Recommandation : sélectionner automatiquement le premier chat ou transformer l'état vide en invitation explicite et cliquable.

### 9. Informations Work difficiles à découvrir

Les détails de production apparaissent au survol de l'icône ou après un toucher, sans indice explicite. La partie transformée verrouillée est non interactive et n'explique pas directement sa condition de déblocage.

Recommandation : ajouter un indice discret « Tap for details » lors de la première visite et afficher la condition du verrou dans son infobulle.

### 10. Densité des éléments fixes sur mobile

Dans Work, le top bar, le tutoriel réduit, les filtres et les onglets réservent ensemble environ 269 px verticaux. Cela reste utilisable à 844 px de haut, mais réduit fortement l'espace de jeu sur un appareil court. Le dernier filtre est partiellement hors champ et la possibilité de faire défiler la barre n'est pas évidente.

Recommandation : réduire dynamiquement le header après défilement et rationaliser les deux barres fixes inférieures.

### 11. Cohérence des textes

Quelques formulations donnent une impression de prototype :

- `Unaffect all workers` devrait être `Unassign all workers` ;
- certaines ponctuations anglaises ont une espace avant `!` ;
- `Cléopatra` est le seul nom explicitement français ;
- plusieurs termes inventés — Cathering, Grasscatting, Catchen, Pawsonry — sont amusants, mais gagneraient à être introduits une première fois avec leur fonction.

### 12. Logs très dominés par le tutoriel

Chaque objectif terminé crée une entrée de déblocage. Lors d'une progression rapide ou d'un retour de sauvegarde, le journal est rempli de messages « Objective complete », ce qui masque les événements narratifs et les changements importants.

Recommandation : regrouper les objectifs, les placer dans un filtre dédié ou ne journaliser que les déblocages réels.

## Ordre d'implémentation recommandé

### Lot 6B — Correctifs critiques et mode développement

1. masquer les contrôles Bird debug et accélération hors d'un mode debug explicite ;
2. rendre toutes les modales narratives scrollables et utilisables en portrait court et paysage ;
3. ajouter une file d'attente pour les notifications ;
4. ajouter des tests de non-régression en 390 × 667 et paysage ;
5. ne modifier ni l'équilibrage, ni le contenu, ni l'esthétique générale.

### Lot 6C — Navigation et tutoriel

1. rendre les onglets identifiables ;
2. signaler les nouveaux déblocages ;
3. rendre les ressources nommables au toucher ;
4. transformer les objectifs en guide contextuel avec progression et raccourcis ;
5. alléger le panneau et séparer l'historique terminé.

### Lot 6D — Accessibilité

1. remplacer les `div` interactifs par des boutons ou ajouter une sémantique équivalente ;
2. ajouter focus clavier, navigation et gestion des modales ;
3. corriger contrastes et tailles tactiles ;
4. compléter les textes alternatifs ;
5. tester clavier seul et lecteur d'écran au niveau structurel.

### Lot 6E — Polissage des écrans

1. améliorer les états vides et la sélection initiale ;
2. clarifier Work et les conditions de verrouillage ;
3. réduire la densité fixe sur mobile ;
4. harmoniser les textes anglais ;
5. nettoyer la hiérarchie de Logs, Inventory, Facilities et Explorations.

## Suivi — Lot 6C1 réalisé

Le premier sous-lot de navigation a été implémenté sans modifier le tutoriel ni le gameplay :

- noms complets des sept onglets affichés sur desktop ;
- icône et libellé court affichés sur mobile ;
- pastille persistante sur chaque onglet nouvellement débloqué jusqu'à sa première visite ;
- migration des anciennes sauvegardes sans faux indicateurs « nouveau » ;
- noms des ressources accessibles au toucher, à la souris et au clavier dans une infobulle non coupée par la barre défilante.

Validation : 43 tests automatisés réussis, aucune erreur JavaScript ou ressource manquante dans Chrome, largeur du document stable à 390 px et infobulle tactile entièrement visible. Les captures de contrôle desktop/mobile sont dans le dossier `ux-captures` de l'audit.

Le guide contextuel, la progression des objectifs et les raccourcis ont ensuite été traités dans le lot 6C2 ci-dessous.

## Suivi — Lot 6C2 réalisé

Le tutoriel passif a été remplacé par un guide contextuel :

- une seule prochaine action est mise en avant selon un ordre pédagogique distinct des règles de déblocage ;
- une barre et une valeur de progression sont affichées pour chaque étape mesurable ;
- le bouton principal ouvre le bon onglet, active le filtre Work utile, fait défiler jusqu'à la zone concernée et la surligne brièvement ;
- les autres branches restent comptabilisées sans recréer une longue liste ;
- sur mobile, le guide réduit affiche directement le nom de la prochaine action ;
- les objectifs terminés ont quitté le panneau flottant et sont accessibles dans Logs avec le filtre `Guide`, désactivé par défaut ;
- les anciens logs `Objective complete:` sont reconnus automatiquement comme historique Guide.

Validation : 45 tests automatisés réussis, raccourci du troisième chat vérifié jusqu'à Work/Wood, panneau ouvert entièrement visible en 390 × 844, historique Guide masqué puis affiché à la demande, et aucune erreur JavaScript ou ressource manquante dans Chrome.

## Suivi — Lot 6D1 réalisé

Les interactions non modales principales sont maintenant utilisables sans souris :

- les cartes de chats dans Gang, les icônes de détail dans Work, les objets et ressources d'Inventory, les zones de la carte et les emplacements d'Explorations sont atteignables avec `Tab` ;
- `Entrée` et `Espace` déclenchent leur action existante avec une mécanique commune, sans double activation des boutons natifs imbriqués ;
- un focus visible cohérent est affiché et restauré après les rerendus de Gang, Inventory et de la carte ;
- les états sélectionné/ouvert sont exposés avec `aria-pressed` ou `aria-expanded` ;
- dans Explorations, « changer le chat » et « retirer le chat » sont deux commandes sémantiquement séparées et nommées.

Les modales et leurs sélecteurs internes restent volontairement hors de ce sous-lot ; leur gestion du focus est réservée au lot 6D2.

Validation : 47 tests automatisés réussis. Les parcours réels `Tab`/`Entrée`/`Espace` ont été vérifiés dans Chrome sur les quatre écrans, y compris la conservation du focus et la séparation des commandes d'Explorations. Chrome ne remonte aucune erreur JavaScript ni ressource manquante.

## Suivi — Lot 6D2 réalisé

Les modales disposent maintenant d'un cycle d'accessibilité commun :

- les 18 écrans concernés exposent `role="dialog"`, `aria-modal="true"`, un nom accessible et un état `aria-hidden` synchronisé avec leur affichage ;
- le focus est placé sur l'action principale ou la première carte sélectionnable à l'ouverture ;
- `Tab` et `Maj+Tab` restent contenus dans la modale, puis le focus revient au contrôle d'origine à la fermeture, y compris après un rerendu ;
- `Échap` ferme Settings et les sélecteurs de Work, Job Center et Explorations ;
- les récits, Bird et son message de réussite exigent toujours leur action explicite et ne sont pas fermés par `Échap` ;
- les cartes internes des sélecteurs répondent à `Entrée` et `Espace`, tandis que les chats indisponibles sont annoncés avec `aria-disabled` et exclus de la tabulation ;
- les actions « sélectionner », « forcer » et « retirer » restent des commandes distinctes dans l'arbre d'accessibilité.

Validation : 50 tests automatisés réussis. Chrome confirme le focus initial, les boucles `Tab`/`Maj+Tab`, les deux politiques d'`Échap`, le retour du focus et une affectation Work complète au clavier. La modale Settings est entièrement visible en 390 × 844. Aucune erreur JavaScript ni ressource manquante n'est détectée.

## Suivi — Lot 6D3 réalisé

Les contrastes et les zones tactiles ont été renforcés sans modifier le gameplay ni dédensifier artificiellement Work :

- l'orange d'action, le vert d'état et les gris informatifs respectent désormais un contraste d'au moins 4,5:1 sur les panneaux clairs principaux ;
- le violet d'Explorations, l'ambre des formations et l'en-tête du guide ont été assombris pour conserver du texte blanc ou coloré lisible ;
- le guide contextuel, les filtres inactifs, les catégories d'Inventory et les libellés secondaires n'utilisent plus les anciens gris trop pâles ;
- les deux moitiés claires et boisées de Work disposent de couleurs adaptées à leur fond, avec une meilleure lisibilité des managers, noms et temps superposés aux icônes ;
- les actions principales atteignent 44 px de hauteur ; les contrôles denses de Work restent compacts mais ne descendent plus sous 28 px ;
- le header mobile, les ressources, filtres, sous-onglets, emplacements et boutons de retrait ont été agrandis de façon ciblée.

Validation : 52 tests automatisés réussis. Les mesures Chrome couvrent les sept onglets en bureau et en mobile ; aucune cible visible ne descend sous 28 px, les actions principales mesurent 44 px, le document reste strictement contenu dans les 390 px du viewport et les vues portrait court/paysage restent utilisables. Les captures actualisées sont dans `ux-captures`.

## Suivi — Lot 6D4 réalisé

Les images et les contrôles iconiques disposent désormais d'une politique de nommage explicite :

- chacune des 11 images de récit injectées dynamiquement reçoit une description propre à la scène ou au personnage représenté ;
- les miniatures de la galerie Stories utilisent `alt=""`, car leur bouton est déjà nommé par le titre du récit et une seconde description rendrait son nom inutilement verbeux ;
- les icônes d'onglets, de fermeture, de recettes et de bâtiments accompagnées d'un texte identique restent décoratives ;
- les contrôles Settings, Bird et Bird debug possèdent un nom d'action explicite indépendant de leur image ;
- les boutons d'affectation et de retrait de Work annoncent maintenant le chat et la production concernés au lieu d'un simple « + » ou « × » ;
- l'état négatif d'une zone d'exploration est annoncé comme `not explored`.

Validation : 54 tests automatisés réussis. Chrome a contrôlé 124 images présentes dans l'état de test sans trouver un seul attribut `alt` manquant, puis a ouvert les 11 récits et vérifié leurs 11 descriptions. Les parcours des modales, les sept onglets, le viewport mobile de 390 px et le paysage court restent valides. Aucune erreur JavaScript ni ressource manquante n'est détectée.

## Correctif mobile — carte d'Explorations

La formule mobile de `--map-cell` réservait 10 px de moins que l'espace réellement occupé par le padding, les bordures et la colonne des coordonnées. La grille mesurait donc 366 px dans un conteneur de 356 px à 390 px de viewport, ce qui faisait apparaître une barre de défilement horizontale.

Le calcul retire maintenant 52 px avant de répartir la largeur entre les sept colonnes. Chrome confirme des largeurs identiques entre la grille, ses coordonnées et son conteneur : 326 px à 360 px de viewport, 356 px à 390 px et 396 px à 430 px. Le document reste également limité à la largeur exacte du viewport.

Validation : 55 tests automatisés réussis, aucune erreur JavaScript ou ressource manquante, et affichage bureau inchangé.

## Suivi — Lot 6D5 réalisé

La validation finale de la structure accessible relie maintenant la sémantique aux comportements réels de l'interface :

- la barre principale expose un groupe de sept onglets, chacun relié à son panneau dans le repère `main` ;
- un seul onglet et un seul panneau sont actifs à la fois, avec `aria-selected`, `aria-hidden` et un ordre de tabulation synchronisés à chaque changement ;
- `Flèche gauche`, `Flèche droite`, `Home` et `End` déplacent le focus et activent les onglets visibles, sans inclure les sections encore verrouillées ;
- Log et Stories utilisent le même modèle de sous-onglets et la même navigation clavier ;
- les ressources et le guide sont exposés comme régions nommées ;
- la fenêtre de statistiques annonce son état ouvert, se ferme avec `Échap` et rend le focus à son bouton ;
- les filtres Work, Logs et Inventory annoncent leur état actif avec `aria-pressed`.

Validation : 58 tests automatisés réussis. Dans Chrome, l'arbre d'accessibilité expose le repère principal, les deux groupes d'onglets, les régions Resources et Guide, les panneaux actifs et leurs noms. Les parcours clavier confirment un seul point de tabulation et un seul panneau visible dans chaque groupe, sans contrôle interactif non nommé.

## Suivi — Lot 6E réalisé

Le polissage des écrans a été traité dans son ensemble sans modifier l'équilibrage ni la progression :

- Gang sélectionne automatiquement le premier profil valide sur ordinateur, tout en conservant la liste comme vue initiale sur mobile ; le bouton Back revient à la carte sélectionnée et les véritables absences de contenu utilisent désormais un état vide compact et explicatif ;
- Work explique l'affectation et l'ouverture des détails lors de la première visite, puis affiche directement la condition et la progression des premiers ateliers verrouillés ;
- sur mobile, les filtres Work sont revenus dans le flux de la page au lieu d'occuper une barre fixe permanente ; après 32 px de défilement, le bandeau supérieur retire seulement le logo et la ligne de temps secondaire, ce qui rend 37 px de hauteur au jeu sans masquer les commandes ;
- les formulations les plus visibles ont été harmonisées : ponctuation anglaise, `Unassign`, terminologie `kitty`, introduction fonctionnelle de Cathering et Grasscatting, et noms futurs `Cleopatra`/`Napoleon` ;
- Facilities, Inventory, Explorations et Logs disposent de titres, descriptions et regroupements plus lisibles ; Inventory affiche directement le nom de chaque ressource ;
- Logs, Stories, Inventory et Gang ne laissent plus de grands espaces ambigus lorsque leur contenu est vide ou filtré.

Validation : 63 tests automatisés réussis. Chrome confirme la sélection unique de Bernardo et sa fiche au premier recrutement, la conservation de la liste mobile, la condition `Gather 10 Cardboard Pieces (0/10)`, les filtres Work en position statique, le compactage du bandeau de 148,6 à 111,6 px, une largeur de document limitée à 390 px et l'absence de contrôle interactif non nommé. Le contrôle final ne remonte aucune erreur JavaScript ni ressource manquante.
