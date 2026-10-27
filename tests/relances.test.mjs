import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aRelancer, MARQUEUR } from '../scripts/relances.mjs';

const jour = 24 * 3600 * 1000;
const maintenant = new Date('2026-10-30T08:00:00Z');
const il_y_a = (jours) => new Date(maintenant - jours * jour).toISOString();
const commentaire = (auteur, jours, corps = 'Réponse.') => ({ auteur, date: il_y_a(jours), corps });

test('relance un ticket qui attend Oksana depuis 7 jours', () => {
  assert.equal(aRelancer([commentaire('burrpburrp', 7)], maintenant), true);
  assert.equal(aRelancer([commentaire('burrpburrp', 6)], maintenant), false);
});

// Ticket encore dans « Idées » : personne ne lui a répondu, c'est à nous d'agir.
test('ne relance pas un ticket sans commentaire', () => {
  assert.equal(aRelancer([], maintenant), false);
});

test('ne relance pas quand Oksana a écrit en dernier', () => {
  assert.equal(aRelancer([commentaire('burrpburrp', 30), commentaire('Ici-Oksana', 20)], maintenant), false);
});

test('après une première relance, attend 14 jours avant la suivante', () => {
  const relance = commentaire('github-actions[bot]', 13, `Petite relance ${MARQUEUR}`);
  assert.equal(aRelancer([commentaire('burrpburrp', 20), relance], maintenant), false);
  relance.date = il_y_a(14);
  assert.equal(aRelancer([commentaire('burrpburrp', 21), relance], maintenant), true);
});
