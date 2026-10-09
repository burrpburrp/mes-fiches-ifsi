import { test } from 'node:test';
import assert from 'node:assert/strict';
import remarkLiens from '../src/lib/remark-liens.mjs';
import { transformer, dossierDeFiches, liensEtBarres } from './outils.mjs';

const entete = (titre, brouillon = false) => `---\ntitre: ${titre}\nbrouillon: ${brouillon}\n---\n`;

const dossier = dossierDeFiches({
  'Asthme.md': entete('Asthme'),
  'Bêta-2 mimétiques.md': entete('Bêta-2 mimétiques'),
});
const options = { base: '/site', dossier };

test('un lien vers une fiche mène à sa page', async () => {
  const { arbre } = await transformer('Voir [[Asthme]].', remarkLiens, options);
  assert.deepEqual(liensEtBarres(arbre).liens, [{ url: '/site/fiches/asthme/', texte: 'Asthme' }]);
});

test('un lien vers une section ou un paragraphe ajoute la bonne ancre', async () => {
  const { arbre } = await transformer("[[Asthme#Rôle infirmier]] et [[Asthme#^def]]", remarkLiens, options);
  assert.deepEqual(liensEtBarres(arbre).liens.map((l) => l.url), [
    '/site/fiches/asthme/#rôle-infirmier',
    '/site/fiches/asthme/#bloc-def',
  ]);
});

test('le texte après | remplace le nom de la fiche', async () => {
  const { arbre } = await transformer('[[Bêta-2 mimétiques|les bêta-2]]', remarkLiens, options);
  assert.deepEqual(liensEtBarres(arbre).liens, [{ url: '/site/fiches/beta-2-mimetiques/', texte: 'les bêta-2' }]);
});

test('un lien vers une fiche inexistante est barré', async () => {
  const { arbre } = await transformer('[[Fiche absente]]', remarkLiens, options);
  assert.deepEqual(liensEtBarres(arbre), { liens: [], barres: ['Fiche absente'] });
});

test('les fiches sont cherchées dans le dossier indiqué', async () => {
  const autre = dossierDeFiches({ 'Pneumonie.md': entete('Pneumonie') });
  const { arbre } = await transformer('[[Pneumonie]]', remarkLiens, { base: '/site', dossier: autre });
  assert.deepEqual(liensEtBarres(arbre).liens, [{ url: '/site/fiches/pneumonie/', texte: 'Pneumonie' }]);
});

test('un lien vers une fiche encore en brouillon est barré, car sa page n\'existe pas', async () => {
  const avecBrouillon = dossierDeFiches({
    'Asthme.md': entete('Asthme'),
    'Pneumonie.md': entete('Pneumonie', true),
  });
  const { arbre } = await transformer('Voir [[Pneumonie]].', remarkLiens, { base: '/site', dossier: avecBrouillon });
  assert.deepEqual(liensEtBarres(arbre), { liens: [], barres: ['Pneumonie'] });
});

test('deux fiches qui auraient la même adresse arrêtent la construction avec un message clair', async () => {
  const doublons = dossierDeFiches({
    'Bêta-2 mimétiques.md': entete('Bêta-2 mimétiques'),
    'Beta-2 mimetiques.md': entete('Beta-2 mimetiques'),
  });
  await assert.rejects(
    transformer('Texte.', remarkLiens, { base: '/site', dossier: doublons }),
    /Bêta-2 mimétiques.*Beta-2 mimetiques|Beta-2 mimetiques.*Bêta-2 mimétiques/,
  );
});
