// Transforme les liens au format Obsidian en vrais liens du site :
//   [[Asthme]]                        → lien vers la fiche
//   [[Asthme|la fiche asthme]]        → idem, avec un autre texte
//   [[Asthme#Signes d'une crise]]     → lien vers une section de la fiche
//   [[Asthme#^def]]                   → lien vers un paragraphe marqué « ^def »
// Un lien vers une fiche introuvable ou encore en brouillon reste en texte
// barré et est signalé dans le journal de construction.
import fs from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';
import { identifiant } from './identifiant.mjs';
import { visit, SKIP } from 'unist-util-visit';

const LIEN = /(!?)\[\[([^\]|#]*)(?:#([^\]|]*))?(?:\|([^\]]*))?\]\]/g;
const BLOC = /\s\^([A-Za-z0-9-]+)\s*$/;

const slug = (texte) => new GithubSlugger().slug(texte);

/**
 * Associe chaque nom possible d'une fiche (nom de fichier, titre) à son
 * identifiant, en notant si elle est encore en brouillon.
 * Deux fichiers qui donneraient la même adresse arrêtent la construction :
 * sinon l'un des deux disparaîtrait du site sans prévenir.
 */
function indexDesFiches(dossierFiches) {
  const index = new Map();
  const fichiersParId = new Map();
  const parcourir = (dossier) => {
    for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
      const chemin = path.join(dossier, entree.name);
      if (entree.isDirectory()) parcourir(chemin);
      else if (entree.name.endsWith('.md')) {
        const relatif = path.relative(dossierFiches, chemin).replace(/\.md$/, '');
        const id = identifiant(relatif.split(path.sep).join('/'));
        if (fichiersParId.has(id)) {
          throw new Error(
            `Les fiches « ${fichiersParId.get(id)} » et « ${relatif} » auraient la même adresse (/fiches/${id}/). Renomme l'une des deux.`,
          );
        }
        fichiersParId.set(id, relatif);
        const nom = path.basename(relatif);
        const contenu = fs.readFileSync(chemin, 'utf8');
        const titre = contenu.match(/^titre:\s*["']?(.+?)["']?\s*$/m)?.[1];
        const brouillon = /^brouillon:\s*true\s*$/m.test(contenu);
        for (const cle of [nom, titre, id]) if (cle) index.set(cle.toLowerCase(), { id, brouillon });
      }
    }
  };
  if (fs.existsSync(dossierFiches)) parcourir(dossierFiches);
  return index;
}

export default function remarkLiens({ base = '/', dossier = 'fiches' } = {}) {
  const prefixe = base.replace(/\/$/, '');
  return (arbre, fichier) => {
    const index = indexDesFiches(dossier);

    // 1. Les paragraphes terminés par « ^identifiant » deviennent des cibles de lien.
    visit(arbre, 'paragraph', (noeud) => {
      const dernier = noeud.children.at(-1);
      const trouve = dernier?.type === 'text' && dernier.value.match(BLOC);
      if (!trouve) return;
      dernier.value = dernier.value.replace(BLOC, '');
      noeud.data = { ...noeud.data, hProperties: { ...(noeud.data?.hProperties ?? {}), id: `bloc-${trouve[1]}` } };
    });

    // 2. Les [[liens]] deviennent des liens HTML.
    visit(arbre, 'text', (noeud, position, parent) => {
      if (!parent || position === undefined || !noeud.value.includes('[[')) return;
      const morceaux = [];
      let curseur = 0;
      for (const m of noeud.value.matchAll(LIEN)) {
        const [brut, , cible, ancre, alias] = m;
        if (m.index > curseur) morceaux.push({ type: 'text', value: noeud.value.slice(curseur, m.index) });
        curseur = m.index + brut.length;

        const nomCible = cible.trim();
        const trouvee = nomCible ? index.get(nomCible.toLowerCase()) : null;
        const id = trouvee && !trouvee.brouillon ? trouvee.id : null;
        const texte = alias?.trim() || [nomCible, ancre?.replace(/^\^/, '')].filter(Boolean).join(' › ');
        const fragment = ancre ? (ancre.startsWith('^') ? `#bloc-${ancre.slice(1)}` : `#${slug(ancre)}`) : '';

        if (nomCible && !id) {
          const raison = trouvee ? 'encore en brouillon' : 'introuvable';
          console.warn(`[liens] ${path.basename(fichier.path ?? '')} : fiche « ${nomCible} » ${raison}`);
          morceaux.push({ type: 'delete', children: [{ type: 'text', value: texte }] });
          continue;
        }
        const url = id ? `${prefixe}/fiches/${id}/${fragment}` : fragment; // [[#Section]] = même fiche
        morceaux.push({ type: 'link', url, children: [{ type: 'text', value: texte }], data: { hProperties: { className: ['lien-fiche'] } } });
      }
      if (morceaux.length === 0) return;
      if (curseur < noeud.value.length) morceaux.push({ type: 'text', value: noeud.value.slice(curseur) });
      parent.children.splice(position, 1, ...morceaux);
      return [SKIP, position + morceaux.length];
    });
  };
}
