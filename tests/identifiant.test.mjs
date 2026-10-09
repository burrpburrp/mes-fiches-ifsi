import { test } from 'node:test';
import assert from 'node:assert/strict';
import { identifiant } from '../src/lib/identifiant.mjs';

test('enlève les accents, les majuscules et les espaces', () => {
  assert.equal(identifiant('Bêta-2 mimétiques.md'), 'beta-2-mimetiques');
});

test("supprime les apostrophes sans laisser de tiret", () => {
  assert.equal(identifiant("Signes d'une crise"), 'signes-dune-crise');
});

test('garde les sous-dossiers', () => {
  assert.equal(identifiant('Cardio/Insuffisance cardiaque.md'), 'cardio/insuffisance-cardiaque');
});
