// Lit la section « ## QCM » d'une fiche, écrite simplement dans Obsidian :
//
//   ## QCM
//   ### L'asthme est avant tout une maladie…
//   - [ ] infectieuse
//   - [x] inflammatoire chronique des bronches
//   Explication : texte facultatif affiché après correction.
//
// La section est retirée du texte de la fiche et transmise au composant QCM
// (via remarkPluginFrontmatter.qcm).
import path from 'node:path';
import { toString } from 'mdast-util-to-string';

const TITRE_QCM = /^(qcm|teste-toi)$/i;

export default function remarkQcm() {
  return (arbre, fichier) => {
    const enfants = arbre.children;
    const debut = enfants.findIndex((n) => n.type === 'heading' && n.depth === 2 && TITRE_QCM.test(toString(n).trim()));
    const frontmatter = (fichier.data.astro ??= {}).frontmatter ??= {};
    frontmatter.qcm = [];
    if (debut === -1) return;

    let fin = enfants.findIndex((n, i) => i > debut && n.type === 'heading' && n.depth <= 2);
    if (fin === -1) fin = enfants.length;
    const section = enfants.splice(debut, fin - debut).slice(1);

    let question = null;
    for (const noeud of section) {
      if (noeud.type === 'heading') {
        question = { question: toString(noeud).trim(), choix: [], reponses: [], explication: '' };
        frontmatter.qcm.push(question);
      } else if (question && noeud.type === 'list') {
        for (const item of noeud.children) {
          if (item.checked) question.reponses.push(question.choix.length);
          question.choix.push(toString(item).trim());
        }
      } else if (question && noeud.type === 'paragraph') {
        question.explication = [question.explication, toString(noeud).trim().replace(/^explication\s*:\s*/i, '')].filter(Boolean).join(' ');
      }
    }

    const nom = path.basename(fichier.path ?? '');
    for (const q of frontmatter.qcm) {
      if (q.reponses.length === 0) console.warn(`[qcm] ${nom} : aucune bonne réponse cochée pour « ${q.question} »`);
    }
  };
}
