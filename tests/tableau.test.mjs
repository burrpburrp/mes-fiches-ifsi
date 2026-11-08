import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ticketsLies, colonneVisee, trouverOption } from '../scripts/tableau.mjs';

test('trouve les tickets cités « Lié à #N » dans une PR', () => {
  assert.deepEqual(ticketsLies('Lié à #25.\n\n**Avant :** …'), [25]);
  assert.deepEqual(ticketsLies('Lié à #19 et lié à #20'), [19, 20]);
  assert.deepEqual(ticketsLies('Lie a #7'), [7]);
  assert.deepEqual(ticketsLies('Voir #12 pour le contexte'), []);
  assert.deepEqual(ticketsLies(null), []);
});

test('PR ouverte → En cours ; PR fusionnée → À valider ; PR fermée sans fusion → rien', () => {
  assert.equal(colonneVisee({ action: 'opened', merged: false }), 'En cours');
  assert.equal(colonneVisee({ action: 'reopened', merged: false }), 'En cours');
  assert.equal(colonneVisee({ action: 'closed', merged: true }), 'À valider par Oksana');
  assert.equal(colonneVisee({ action: 'closed', merged: false }), null);
  assert.equal(colonneVisee({ action: 'edited', merged: false }), null);
});

// Le nom de colonne du tableau peut différer d'une majuscule ou d'un accent.
test('retrouve une colonne du tableau sans tenir compte des accents ni des majuscules', () => {
  const options = [{ id: 'a', name: 'Idée' }, { id: 'b', name: 'En cours' }, { id: 'c', name: 'A valider par Oksana' }];
  assert.equal(trouverOption(options, 'À valider par Oksana').id, 'c');
  assert.equal(trouverOption(options, 'en cours').id, 'b');
  assert.equal(trouverOption(options, 'Terminé'), undefined);
});
