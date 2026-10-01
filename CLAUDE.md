# Mes fiches IFSI : consignes pour Claude

- Langue : tout en **français** (code commenté en français, issues, PR, docs). Les noms de variables peuvent rester en anglais.
- Acteurs : Oksana (`@Ici-Oksana`) = product owner non technicienne, publie ses fiches elle-même ; Manuel (`@burrpburrp`) = chef de projet, relit le JS et le Python. Expliquer les outils et choix techniques à Manuel en termes simples.
- Dépôt **public** : rien de confidentiel dans le code, les issues ou les PR.
- Stack : site statique **Astro**, hébergement **GitHub Pages** via GitHub Actions. Pas de comptes utilisateurs ; QCM côté navigateur.
- Oksana rédige dans **Obsidian** (le dépôt est son coffre, config dans `.obsidian/`) et publie avec GitHub Desktop. Fiches dans `fiches/` (nom de fichier = titre), modèle dans `modèles/Fiche.md`. Liens Obsidian `[[...]]` (fiche, `#section`, `#^bloc`) convertis par `src/lib/remark-liens.mjs` ; QCM écrit dans la section `## QCM` en cases à cocher, lu par `src/lib/remark-qcm.mjs`. Ne jamais imposer à Oksana une syntaxe qu'Obsidian n'affiche pas naturellement.
- Modèle de contenu : chaque fiche porte des propriétés (`titre`, `ue`, `semestres`, `organes`, `type`, `tags`, `brouillon`). La navigation est **générée** à partir de ces métadonnées pour pouvoir passer d'une organisation par UE/semestre à une organisation par organe (réforme) sans modifier les fiches.
- Validation par Oksana : déplacer la carte dans « À valider par Oksana » et la mentionner dans un commentaire avec un lien ou une capture.
