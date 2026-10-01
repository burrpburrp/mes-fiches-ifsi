// Transforme un nom de fichier Obsidian (« Bêta-2 mimétiques.md ») en
// identifiant d'adresse web (« beta-2-mimetiques »).
// Utilisé à la fois pour les pages et pour résoudre les liens [[...]].
export function identifiant(chemin) {
  return chemin
    .replace(/\.md$/i, '')
    .split('/')
    .map((morceau) =>
      morceau
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    )
    .join('/');
}
