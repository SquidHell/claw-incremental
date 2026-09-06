# CLAW-O-RAMA

Prototype jouable d'une **machine a pince de fete foraine** en pixel art, pense
mobile d'abord : trois boutons tactiles (gauche, droite, descendre) et beaucoup
de feedback.

- Rendu 100 % Canvas 2D a resolution virtuelle fixe (**180 x 320**), mis a
  l'echelle par un facteur **entier** — du pixel art net partout.
- **Zero dependance runtime.** Le bundle fait ~43 ko (~16 ko gzip).
- Pas un seul fichier d'asset : les sprites sont des pixel-maps en TypeScript,
  la police est une bitmap 5x7 maison, les sons sont generes en WebAudio.

## Demarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

| Commande             | Effet                                             |
| -------------------- | ------------------------------------------------- |
| `npm run dev`        | serveur de developpement                          |
| `npm run build`      | typecheck + build statique dans `dist/`           |
| `npm run typecheck`  | TypeScript seul                                   |
| `npm run check:art`  | valide les grilles de pixel art et les palettes   |
| `npm run test`       | test de fumee Playwright sur Chromium mobile      |
| `npm run check`      | les trois ci-dessus                               |
| `npm run build:playtest` | assemble la page de playtest et le jeu seul  |
| `npm run build:atelier`  | assemble l'atelier du casting (voir plus bas) |

## Jouer

| Action      | Tactile              | Clavier              |
| ----------- | -------------------- | -------------------- |
| Deplacer    | boutons gauche/droite| `<-` / `->`, A / D   |
| Descendre   | bouton rouge         | `Espace`, `Bas`, `S` |
| Continuer   | tap hors bouton      | `Entree`             |
| Debug       | triple tap sur l'enseigne | `F3` ou `~`     |

L'overlay de debug affiche les FPS, l'etat de la machine, les boites de
collision, la zone de prise, la force de prise et le glissement en cours.

## Ce qui fait la sensation de jeu

**La prise n'est pas un jet de des.** A la fermeture, on calcule une force de
prise a partir du decentrage :

```
offset = |centre peluche - centre pince| / (largeur / 2)
grip   = puissance * accroche * (1 - 0.7 * offset)
```

Puis, pendant la remontee et le retour, un **glissement continu** s'accumule
tant que `grip < masse`. La peluche tombe quand il atteint 1.

C'est un choix de lisibilite : le joueur voit la jauge se vider, la pince
trembler, le `!` apparaitre — donc il comprend qu'il s'est mal place, au lieu
de subir un tirage invisible. Une prise parfaitement centree reste gagnante
pour **toutes** les peluches ; c'est le decentrage qui fait perdre.

Autres details qui comptent :

- appui traite au `pointerdown`, jamais au `pointerup` ;
- multi-pointeurs : tenir *gauche* et appuyer sur *descendre* fonctionne ;
- glisser hors d'un bouton le relache, revenir dessus le re-enfonce ;
- le bouton *descendre* est grise avec une LED ambre hors de la phase `READY` :
  l'entree est bloquee **et** le joueur voit pourquoi ;
- vibration, ronflement moteur, secousse d'ecran, particules et confettis
  branches sur les evenements de jeu ;
- `touch-action: none` + `overscroll-behavior: none` : ni scroll, ni
  pull-to-refresh, ni zoom double-tap pendant la partie.

## Page de playtest

`npm run build:playtest` compile le jeu avec `VITE_PLAYTEST=1` (ce qui expose
`window.__claw`, la poignee de telemetrie) puis injecte le bundle dans deux
templates :

- `artifact/template.html` -> `dist-artifact/playtest.html` : le jeu avec une
  fiche de releve a cote ;
- `artifact/jeu.html` -> `dist-artifact/jeu.html` : **le jeu seul**, sans
  questionnaire ni habillage, qui occupe l'ecran. Le facteur du jeu reste
  entier ; la page termine avec une mise a l'echelle CSS uniforme quand il
  reste une marge notable, pour remplir la largeur d'un telephone.

Le template est la source versionnee ; le fichier assemble ne l'est pas. La page
joint automatiquement les compteurs de la session (parties, gains, pieces,
collection, graine) au releve, pour qu'un bug rapporte soit rejouable a
l'identique.

La commande utilise la syntaxe POSIX pour la variable d'environnement ; sous
Windows, lancer les deux etapes separement.

## Ton art a toi

Deux chemins, selon que tu veuilles toucher au code ou pas.

**PNG deposes.** Mets un `vroomz.png` de 20x20 dans `src/render/art/custom/` et il
remplace la pixel-map de Vroomz au demarrage. Aucun code a modifier. Le dossier est
vide dans le depot, et le chargement est non bloquant : un fichier corrompu ne
peut pas empecher le jeu de se lancer, il apparait comme un avertissement dans
la console.

**Le contenu de ce dossier est ignore par git** : ce que tu y deposes reste sur
ta machine. Il sert a essayer des sprites avant de trancher — maquettes,
references, art achete dont la licence n'autorise pas la redistribution — et
rien de tout ca ne doit partir dans un depot public par accident. Pour
versionner un fichier precis : `git add -f <chemin>`. Details dans
`src/render/art/custom/README.md`.

**Pixel-maps.** Colle un bloc `PixelArt` dans `src/render/art/plushies.ts`, puis
`npm run check:art` verifie que la grille est rectangulaire et que chaque
caractere existe dans la palette.

`npm run build:atelier` assemble l'**atelier du casting** : une page qui edite
les huit peluches existantes — le dessin (crayon, gomme, pot, pipette,
annulation, import d'image) mais aussi le **nom** et la **description**. Elle
signale d'un coup d'oeil ce qui s'ecarte du depot, et produit un patch pret a
coller : le bloc `PixelArt` pour `plushies.ts`, et les lignes `name` / `blurb` /
`sprite` pour `prizes.ts` quand l'identite a change. Une peluche peut aussi
etre enregistree pour l'equipe, ou ramenee a son etat d'origine.

La rarete, la valeur et les caracteristiques physiques restent hors de
l'atelier : les toucher demanderait de reequilibrer le jeu, ce qui n'est pas un
geste d'editeur graphique.

Le script injecte `PLUSH_ART` et le catalogue dans le template, donc l'atelier
ne derive jamais du code reel.

## Les peluches

Huit mascottes : Plombax, Vroomz, Kartono, Voltik, Rozalind, Kapsul,
Dragonz et Minipince.

**Ce sont des creations originales.** Elles evoquent des *archetypes* du genre
(le plombier moustachu, la creature rapide, la princesse, le fantome, le
chevalier, le blob, le dragonnet, la relique doree) sans reproduire aucun
personnage sous licence : pas de logo, pas de marque, pas de combinaison
forme/couleur distinctive d'une oeuvre existante, et des noms inventes.

Le parti pris graphique est la **gueule** plutot que la ressemblance : yeux
desassortis, pupilles qui partent chacune de leur cote, dents du bonheur,
langues qui pendent. En 20x20 une peluche doit se lire et faire rire, pas etre
jolie.

Pour mettre ton propre art : remplace la pixel-map dans
`src/render/art/plushies.ts`, ou passe par `loadSheet()` de
`src/render/sprites.ts` et pointe `PrizeDef.sprite` vers ta frame. Aucun code de
rendu n'a besoin de changer.

Ajouter une peluche = une entree dans `src/game/prizes.ts` + une pixel-map. Rien
d'autre.

## Architecture

```
src/
  core/     boucle a pas fixe, entrees, bus d'evenements, RNG seede, haptique
  game/     geometrie, reglages, etat, physique, modele de prise, machine a etats
  render/   scaler, palette, baker de sprites, police, scene, UI, effets
  audio/    sons generes en WebAudio
```

Regles de lecture :

- **`src/game/tuning.ts`** contient tout l'equilibrage. Un seul fichier a ouvrir
  pour changer la sensation de jeu.
- **`src/game/cabinet.ts`** contient toute la geometrie. Deplacer un mur ne
  casse jamais la collision.
- La physique tourne a **pas de temps fixe** (1/60 s) : deterministe a 60, 90 ou
  120 Hz. Le rendu interpole avec un `alpha`.
- Les peluches endormies (*sleeping*) sortent de la simulation. Sans ca la pile
  vibre en permanence.

## Crochets pour la couche incrementale

Le proto ne contient **aucune** mecanique d'idle, mais la structure l'attend :

- `GameState` (`src/game/state.ts`) est un objet plat serialisable, sauvegarde
  en `localStorage`. Ajouter `upgrades`, `prestige` ou `quests` suffit — la
  persistance et la migration suivent toutes seules.
- Le bus type (`src/core/events.ts`) emet deja `prize:won`, `run:start`,
  `grab:missed`, `grab:lost`, `coins:changed`, `pile:refilled`.
- `claw.power` est lu **depuis l'etat**, jamais comme constante : une upgrade de
  force de prise se branche sans toucher a `grab.ts`.

## Tests

`tests/smoke.spec.ts` pilote la vraie page avec de vrais evenements pointer, sur
un viewport telephone en portrait. Il verifie la mise a l'echelle entiere,
l'absence de defilement, le maintien et le relachement des boutons, le
glissement hors bouton, le cycle complet de la pince, le blocage des entrees
hors phase `READY`, qu'un champ de saisie voisin garde ses touches, et un gain
reel jusqu'a la carte de recompense.

`tests/artifact.spec.ts` couvre les deux pages publiees. Il les **assemble**
avant de les charger, pour tester ce qui partirait vraiment en ligne, et les
enveloppe comme le fait la visionneuse d'artefacts (sans `box-sizing` global,
ce qui a deja casse une mise en page). Il verifie que la borne du banc d'essai
tient entiere dans le premier ecran d'un telephone — panneau de commande
compris, sans quoi le testeur atterrit sur des boutons invisibles qu'il ne peut
pas atteindre au pouce — et que l'atelier produit bien un patch pour les deux
fichiers quand on renomme une peluche.

Son test le plus important verifie que **le hit-test suit la mise a l'echelle**.
Le jeu se met a l'echelle par un facteur entier et les pages hotes finissent la
mise en page par un `transform: scale()`. Si la conversion ecran -> virtuel
ignore cette transformation, toutes les touches se decalent, d'autant plus qu'on
s'eloigne du coin haut-gauche : les boutons deviennent injouables sur telephone
alors que tout va bien sur un grand ecran. C'est arrive une fois. Depuis,
`Screen.toVirtual` deduit son facteur du rectangle **reellement rendu**, jamais
de `this.scale`, et trois tailles de telephone le verrouillent.

Si l'environnement fournit deja un Chromium via `PLAYWRIGHT_BROWSERS_PATH`, la
config l'utilise tel quel plutot que d'en telecharger un.
