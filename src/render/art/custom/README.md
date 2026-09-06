# Ton art a toi

Depose ici un PNG par peluche, nomme d'apres sa cle de sprite :

```
custom/plombax.png   custom/vroomz.png   custom/rozalind.png
custom/kartono.png   custom/kapsul.png    custom/voltik.png
custom/dragonz.png   custom/minipince.png
```

Au demarrage, chaque PNG trouve **remplace** la pixel-map correspondante de
`../plushies.ts`. Aucun code a modifier, aucun rebuild de la liste des lots :
tu deposes le fichier, tu relances `npm run dev`.

- Taille attendue : **20 x 20 px** (la boite de collision vient de
  `PrizeDef.size` dans `src/game/prizes.ts`, pas de l'image). Une image d'une
  autre taille est acceptee mais depassera de sa boite — la console le signale.
- Fond transparent.
- Le jeu desactive tout lissage : dessine en pixel art, pas en image redimensionnee.

## Ce dossier est ignore par git

Tout ce que tu deposes ici reste **local a ta machine**. Seuls ce fichier et le
`.gitkeep` sont suivis.

C'est voulu : ce dossier sert a essayer des sprites avant de trancher — des
maquettes, des references, de l'art achete dont la licence n'autorise pas la
redistribution. Rien de tout ca n'a a partir dans un depot public par accident.

Pour versionner un fichier precis, quand tu sais que tu en as le droit :

```
git add -f src/render/art/custom/vroomz.png
```

Pour fabriquer ces PNG, l'atelier de sprites publie avec le proto exporte soit
un PNG 20x20, soit directement le bloc `PixelArt` a coller dans `plushies.ts`.
