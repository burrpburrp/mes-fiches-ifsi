import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toString } from 'mdast-util-to-string';
import remarkLignes from '../src/lib/remark-lignes.mjs';
import { transformer } from './outils.mjs';

/** Résumé lisible des blocs de premier niveau : type + texte (ou éléments de liste). */
async function blocs(texte) {
  const { arbre } = await transformer(texte, remarkLignes);
  return arbre.children.map((n) =>
    n.type === 'list'
      ? { liste: n.ordered ? 'numérotée' : 'puces', ...(n.ordered ? { debut: n.start } : {}), elements: n.children.map(toString) }
      : { [n.type]: toString(n) },
  );
}

// Oksana écrit une idée par ligne, sans ligne vide entre elles.
test('chaque ligne devient un paragraphe', async () => {
  assert.deepEqual(await blocs('Première idée.\nDeuxième **idée**.'), [
    { paragraph: 'Première idée.' },
    { paragraph: 'Deuxième idée.' },
  ]);
});

// Dans Obsidian, une liste en retrait juste sous une phrase s'affiche comme une liste.
test('des lignes en retrait commençant par un tiret deviennent une liste à puces', async () => {
  assert.deepEqual(await blocs("Des différents types d'usages :\n    - Usage simple.\n    - Usage *à risque*.\nSuite."), [
    { paragraph: "Des différents types d'usages :" },
    { liste: 'puces', elements: ['Usage simple.', 'Usage à risque.'] },
    { paragraph: 'Suite.' },
  ]);
});

test('des lignes numérotées deviennent une liste numérotée qui garde son premier numéro', async () => {
  assert.deepEqual(await blocs('Deux types :\n    1. Substances.\n    2. Comportements.'), [
    { paragraph: 'Deux types :' },
    { liste: 'numérotée', debut: 1, elements: ['Substances.', 'Comportements.'] },
  ]);
});

test('ne touche pas aux vraies listes ni aux paragraphes séparés par une ligne vide', async () => {
  assert.deepEqual(await blocs('Un paragraphe.\n\n- a\n- b'), [
    { paragraph: 'Un paragraphe.' },
    { liste: 'puces', elements: ['a', 'b'] },
  ]);
});

test('un tiret au milieu d\'une ligne ne crée pas de liste', async () => {
  assert.deepEqual(await blocs('Avant - après.\nFin.'), [{ paragraph: 'Avant - après.' }, { paragraph: 'Fin.' }]);
});

// Cas réel : « 1. » interrompt la phrase et ouvre une vraie liste,
// mais les lignes suivantes restent collées dans le premier élément.
test('sépare les lignes collées dans un élément de liste', async () => {
  assert.deepEqual(await blocs('Deux types :\n    1. Substances.\n    2. Comportements.\nSuite.'), [
    { paragraph: 'Deux types :' },
    { liste: 'numérotée', debut: 1, elements: ['Substances.', 'Comportements.'] },
    { paragraph: 'Suite.' },
  ]);
  assert.deepEqual(await blocs('Usages :\n    - Simple.\n    - À risque.\n    - Abus.\nAujourd\'hui, on parle.\nFin.'), [
    { paragraph: 'Usages :' },
    { liste: 'puces', elements: ['Simple.', 'À risque.', 'Abus.'] },
    { paragraph: "Aujourd'hui, on parle." },
    { paragraph: 'Fin.' },
  ]);
});

// Une ligne terminée par deux espaces crée un « saut de ligne forcé » en Markdown.
test('gère les lignes terminées par des espaces', async () => {
  assert.deepEqual(await blocs('Deux types :  \n    1. Substances.   \n    2. Comportements.  \nSuite.'), [
    { paragraph: 'Deux types :' },
    { liste: 'numérotée', debut: 1, elements: ['Substances.', 'Comportements.'] },
    { paragraph: 'Suite.' },
  ]);
});
