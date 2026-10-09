import { test } from 'node:test';
import assert from 'node:assert/strict';
import remarkQcm from '../src/lib/remark-qcm.mjs';
import { transformer } from './outils.mjs';

const fiche = `## Définition

Texte.

## QCM

### Question une ?
- [ ] faux
- [x] juste

Explication : parce que.

### Question deux ?
- [x] juste A
- [x] juste B
- [ ] faux
`;

test('lit les questions, les choix et les bonnes réponses cochées', async () => {
  const { data } = await transformer(fiche, remarkQcm);
  assert.deepEqual(data.astro.frontmatter.qcm, [
    { question: 'Question une ?', choix: ['faux', 'juste'], reponses: [1], explication: 'parce que.' },
    { question: 'Question deux ?', choix: ['juste A', 'juste B', 'faux'], reponses: [0, 1], explication: '' },
  ]);
});

test('retire la section QCM du texte de la fiche', async () => {
  const { arbre } = await transformer(fiche, remarkQcm);
  assert.deepEqual(arbre.children.map((n) => n.type), ['heading', 'paragraph']);
});

test('une fiche sans QCM donne une liste vide', async () => {
  const { data } = await transformer('## Définition\n\nTexte.\n', remarkQcm);
  assert.deepEqual(data.astro.frontmatter.qcm, []);
});
