# Ton art a toi

Depose ici un PNG par peluche, nomme d'apres sa cle de sprite :

```
custom/pim.png   custom/zeb.png   custom/elira.png   custom/blip.png
custom/sirCube.png   custom/gloop.png   custom/draka.png   custom/aurex.png
```

Au demarrage, chaque PNG trouve **remplace** la pixel-map correspondante de
`../plushies.ts`. Aucun code a modifier, aucun rebuild de la liste des lots :
tu deposes le fichier, tu relances `npm run dev`.

- Taille attendue : **20 x 20 px** (la boite de collision vient de
  `PrizeDef.size` dans `src/game/prizes.ts`, pas de l'image). Une image d'une
  autre taille est acceptee mais depassera de sa boite — la console le signale.
- Fond transparent.
- Le jeu desactive tout lissage : dessine en pixel art, pas en image redimensionnee.

Le dossier est volontairement vide dans le depot. Ce que tu y mets t'appartient
et te regarde ; ce fichier et le `.gitkeep` sont les seuls suivis par git.

Pour fabriquer ces PNG, l'atelier de sprites publie avec le proto exporte soit
un PNG 20x20, soit directement le bloc `PixelArt` a coller dans `plushies.ts`.
