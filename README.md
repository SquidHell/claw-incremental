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
| `npm run build:playtest` | assemble la page de playtest (voir plus bas)  |
| `npm run build:atelier`  | assemble l'atelier de sprites (voir plus bas) |

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
`window.__claw`, la poignee de telemetrie) puis injecte le bundle dans
`artifact/template.html`, qui devient `dist-artifact/playtest.html` : une page
autonome ou le jeu tourne pour de vrai, avec une fiche de releve a cote.

Le template est la source versionnee ; le fichier assemble ne l'est pas. La page
joint automatiquement les compteurs de la session (parties, gains, pieces,
collection, graine) au releve, pour qu'un bug rapporte soit rejouable a
l'identique.

La commande utilise la syntaxe POSIX pour la variable d'environnement ; sous
Windows, lancer les deux etapes separement.

## Ton art a toi

Deux chemins, selon que tu veuilles toucher au code ou pas.

**PNG deposes.** Mets un `zeb.png` de 20x20 dans `src/render/art/custom/` et il
remplace la pixel-map de Zeb au demarrage. Aucun code a modifier. Le dossier est
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

`npm run build:atelier` assemble l'**atelier de sprites** : une page ou l'on
dessine une peluche 20x20 (crayon, gomme, pot, pipette, annulation), ou l'on
importe n'importe quelle image comme point de depart, et d'ou l'on repart avec
l'un ou l'autre format — le bloc `PixelArt` a coller, ou le PNG a deposer. Elle
part toujours de l'art reel du depot : le script injecte `PLUSH_ART` dans le
template, donc les peluches proposees ne derivent jamais du code.

## Les peluches

Huit mascottes : Pim, Zeb, Blip, Gloop, Elira, Sir Cube, Draka et Aurex.

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

Le test de fumee Playwright pilote la vraie page avec de vrais evenements
pointer, sur un viewport telephone en portrait. Il verifie la mise a l'echelle
entiere, l'absence de defilement, le maintien et le relachement des boutons, le
glissement hors bouton, le cycle complet de la pince, le blocage des entrees
hors phase `READY`, et un gain reel jusqu'a la carte de recompense.

Si l'environnement fournit deja un Chromium via `PLAYWRIGHT_BROWSERS_PATH`, la
config l'utilise tel quel plutot que d'en telecharger un.
