// Oksana écrit une idée par ligne, sans ligne vide entre elles, et ses listes
// sont souvent en retrait juste sous une phrase. En Markdown strict, tout cela
// forme un seul paragraphe (ou reste collé dans un élément de liste) ; Obsidian,
// lui, affiche des lignes et des listes. Cette extension rétablit l'affichage
// d'Obsidian :
//   - chaque ligne devient un paragraphe (l'espacement se règle ensuite en CSS) ;
//   - les lignes qui commencent par « - », « * », « + » ou « 1. » deviennent une liste.

const MARQUEUR = /^\s*(?:([-*+])|(\d+)[.)])\s+/;

/** Coupe des nœuds en ligne aux retours à la ligne (et aux sauts forcés « deux espaces »). */
function enLignes(enfants) {
  const lignes = [[]];
  for (const noeud of enfants) {
    if (noeud.type === 'break') {
      lignes.push([]);
    } else if (noeud.type === 'text') {
      noeud.value.split('\n').forEach((morceau, i) => {
        if (i > 0) lignes.push([]);
        if (morceau) lignes.at(-1).push({ type: 'text', value: morceau });
      });
    } else {
      lignes.at(-1).push(noeud);
    }
  }
  for (const ligne of lignes) {
    if (ligne[0]?.type === 'text') ligne[0].value = ligne[0].value.trimStart();
    if (ligne.at(-1)?.type === 'text') ligne.at(-1).value = ligne.at(-1).value.trimEnd();
  }
  return lignes.filter((ligne) => ligne.some((n) => n.type !== 'text' || n.value));
}

/** Si la ligne commence par un marqueur de liste, l'enlève et renvoie le type de liste. */
function marqueurDeListe(ligne) {
  const premier = ligne[0];
  if (premier.type !== 'text') return null;
  const m = premier.value.match(MARQUEUR);
  if (!m) return null;
  premier.value = premier.value.slice(m[0].length);
  if (!premier.value) ligne.shift();
  return m[2] ? { ordered: true, start: Number(m[2]) } : { ordered: false, start: null };
}

const element = (ligne) => ({ type: 'listItem', spread: false, children: [{ type: 'paragraph', children: ligne }] });

/** Ajoute un élément à la liste en cours si elle est du même type, sinon ouvre une nouvelle liste. */
function ajouterElement(blocs, item, { ordered, start }) {
  const dernier = blocs.at(-1);
  if (dernier?.type === 'list' && dernier.ordered === ordered) dernier.children.push(item);
  else blocs.push({ type: 'list', ordered, start, spread: false, children: [item] });
}

/** Ajoute une ligne : élément de liste si elle commence par un marqueur, paragraphe sinon. */
function ajouterLigne(blocs, ligne) {
  const liste = marqueurDeListe(ligne);
  if (liste) ajouterElement(blocs, element(ligne), liste);
  else blocs.push({ type: 'paragraph', children: ligne });
}

function decouperParagraphe(paragraphe) {
  const blocs = [];
  for (const ligne of enLignes(paragraphe.children)) ajouterLigne(blocs, ligne);
  return blocs;
}

/** Les lignes collées dans un élément de liste en sortent : nouveaux éléments ou paragraphes. */
function decouperListe(liste) {
  const type = { ordered: Boolean(liste.ordered), start: liste.start ?? null };
  const blocs = [];
  for (const item of liste.children) {
    const [paragraphe, ...reste] = item.children;
    if (paragraphe?.type !== 'paragraph') {
      ajouterElement(blocs, item, type);
      continue;
    }
    const [premiere, ...suivantes] = enLignes(paragraphe.children);
    ajouterElement(blocs, { ...item, children: [{ type: 'paragraph', children: premiere ?? [] }, ...reste] }, type);
    for (const ligne of suivantes) ajouterLigne(blocs, ligne);
  }
  return blocs;
}

export default function remarkLignes() {
  return (arbre) => {
    const parcourir = (parent) => {
      parent.children = parent.children.flatMap((noeud) => {
        if (noeud.type === 'paragraph') return decouperParagraphe(noeud);
        if (noeud.type === 'list') return decouperListe(noeud);
        if (noeud.type === 'blockquote') parcourir(noeud);
        return [noeud];
      });
    };
    parcourir(arbre);
  };
}
