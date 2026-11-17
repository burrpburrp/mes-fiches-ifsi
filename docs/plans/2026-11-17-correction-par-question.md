# Correction du QCM après chaque question (ticket #32)

## Besoin (Oksana)
Voir la correction tout de suite après avoir validé une question, au lieu
d'attendre la fin du QCM.

## Choix
- **Un bouton « Valider » sous chaque question** (à la place du bouton unique
  « Vérifier mes réponses » en bas). Il reste grisé tant qu'aucune réponse n'est
  cochée, pour éviter un clic par erreur.
- Au clic : la correction de la question s'affiche (bonne réponse, explication,
  lien vers la fiche dans le QCM général), et les réponses de cette question
  sont **verrouillées** (on ne peut plus changer après avoir vu la correction).
- **Score** affiché en bas une fois toutes les questions validées.
- Valable partout : QCM des fiches et QCM généraux par UE et semestre.
  Rien ne change dans la façon dont Oksana écrit ses QCM dans Obsidian.

## Étapes
1. `src/lib/correction-qcm.mjs` : calcule si une réponse est juste et le texte
   de correction (testé dans `tests/correction-qcm.test.mjs`).
2. `Qcm.astro` : un bouton par question, verrouillage, score final.
3. Vérification dans un vrai navigateur (capture ordinateur et mobile).
