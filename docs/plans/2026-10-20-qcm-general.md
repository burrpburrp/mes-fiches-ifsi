# QCM général par UE et par semestre (ticket #17)

## Besoin (Oksana)
Un grand QCM qui réunit les QCM de toutes les fiches d'une UE pour un semestre
(ex. UE 2.11, semestre 5), intitulé « QCM », placé après les fiches de cette UE,
avec les questions dans un ordre aléatoire. Les QCM des nouvelles fiches s'y
ajoutent tout seuls.

## Choix
- **Rien à faire pour Oksana** : le QCM général est calculé à chaque publication à
  partir des sections `## QCM` des fiches publiées (brouillons exclus).
- **Une page par UE et par semestre** : `/ue/2.11/qcm-semestre-5/`, créée seulement
  s'il y a au moins une question.
- **Lien « QCM »** en dernier dans la liste des fiches de l'UE, sur la page d'accueil
  (sous chaque semestre) et sur la page de l'UE (un lien par semestre).
- **Ordre aléatoire** : les questions sont mélangées dans le navigateur à chaque
  ouverture de la page (un nouvel ordre à chaque fois). Les réponses gardent
  l'ordre écrit par Oksana.
- Sous chaque question, un lien vers la fiche d'origine pour réviser.

## Étapes
1. `src/lib/qcm-general.mjs` : rassemble les questions d'une UE et d'un semestre
   (testé dans `tests/qcm-general.test.mjs`).
2. `Qcm.astro` : titre réglable, option « mélanger », lien vers la fiche.
3. Page `src/pages/ue/[ue]/qcm-semestre-[semestre].astro` et liens « QCM ».
