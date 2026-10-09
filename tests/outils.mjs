// Outils communs aux tests : transformer un texte Markdown avec nos extensions,
// et créer un dossier de fiches temporaire.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

/** Applique une extension remark à un texte et renvoie l'arbre et les données du fichier. */
export async function transformer(texte, extension, options) {
  const processeur = unified().use(remarkParse).use(remarkGfm).use(extension, options);
  const fichier = { path: 'fiches/Test.md', value: texte, data: {} };
  const arbre = await processeur.run(processeur.parse(texte), fichier);
  return { arbre, data: fichier.data };
}

/** Crée un dossier temporaire contenant les fiches données ({ "Nom.md": "contenu" }). */
export function dossierDeFiches(fiches) {
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'fiches-'));
  for (const [nom, contenu] of Object.entries(fiches)) {
    fs.mkdirSync(path.dirname(path.join(dossier, nom)), { recursive: true });
    fs.writeFileSync(path.join(dossier, nom), contenu);
  }
  return dossier;
}

/** Liste les liens (url + texte) et les textes barrés d'un arbre. */
export function liensEtBarres(arbre) {
  const liens = [];
  const barres = [];
  const parcourir = (n) => {
    if (n.type === 'link') liens.push({ url: n.url, texte: n.children.map((c) => c.value).join('') });
    if (n.type === 'delete') barres.push(n.children.map((c) => c.value).join(''));
    n.children?.forEach(parcourir);
  };
  parcourir(arbre);
  return { liens, barres };
}
