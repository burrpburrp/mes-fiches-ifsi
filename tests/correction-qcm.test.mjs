import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corriger, texteScore } from '../src/lib/correction-qcm.mjs';

const libelles = ['infectieuse', 'inflammatoire', 'génétique'];

test('une seule bonne réponse cochée : juste', () => {
  assert.deepEqual(corriger([1], [1], libelles), { juste: true, verdict: '✅ Bonne réponse.' });
});

test('mauvaise réponse : donne la bonne réponse', () => {
  const r = corriger([1], [0], libelles);
  assert.equal(r.juste, false);
  assert.equal(r.verdict, '❌ La bonne réponse était : inflammatoire.');
});

test('plusieurs bonnes réponses, ordre de coche indifférent', () => {
  assert.equal(corriger([0, 2], [2, 0], libelles).juste, true);
});

test('plusieurs bonnes réponses, une seule cochée : faux, au pluriel', () => {
  const r = corriger([0, 2], [0], libelles);
  assert.equal(r.juste, false);
  assert.equal(r.verdict, '❌ Les bonnes réponses étaient : infectieuse ; génétique.');
});

test('les numéros à deux chiffres sont comparés comme des nombres', () => {
  const beaucoup = Array.from({ length: 12 }, (_, i) => `choix ${i}`);
  assert.equal(corriger([2, 10], [10, 2], beaucoup).juste, true);
});

test('question sans bonne réponse cochée par Oksana : jamais juste', () => {
  assert.equal(corriger([], [], libelles).juste, false);
});

test('texte du score', () => {
  assert.equal(texteScore(3, 5), 'Score : 3 / 5');
});
