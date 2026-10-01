# Mes fiches IFSI : consignes pour Claude

- Langue : tout en **français** (code commenté en français, issues, PR, docs). Les noms de variables peuvent rester en anglais.
- Acteurs : Oksana (`@Ici-Oksana`) = product owner non technicienne, publie ses fiches elle-même ; Manuel (`@burrpburrp`) = chef de projet, relit le JS et le Python. Expliquer les outils et choix techniques à Manuel en termes simples.
- Dépôt **public** : rien de confidentiel dans le code, les issues ou les PR.
- Stack prévue : site statique **Astro**, contenus en Markdown, hébergement **GitHub Pages** via GitHub Actions, CMS web pour Oksana. Pas de comptes utilisateurs ; QCM côté navigateur.
- Modèle de contenu : chaque fiche porte des métadonnées (`ue`, `semestres`, `organes`, `type`, `tags`, `qcm`). La navigation est **générée** à partir de ces métadonnées pour pouvoir passer d'une organisation par UE/semestre à une organisation par organe (réforme) sans modifier les fiches.
- Validation par Oksana : déplacer la carte dans « À valider par Oksana » et la mentionner dans un commentaire avec un lien ou une capture.
