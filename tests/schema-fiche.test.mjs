import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schemaFiche } from '../src/lib/schema-fiche.mjs';

const schema = schemaFiche({ idsUe: ['2.8', '2.11'], idsOrganes: ['respiratoire', 'cardio'] });

const base = { titre: 'Asthme', ue: ['2.8'], semestres: [1], organes: ['respiratoire'], type: 'pathologie' };

test('accepte une fiche complète écrite en listes', () => {
  const r = schema.parse(base);
  assert.deepEqual(r.semestres, [1]);
  assert.deepEqual(r.organes, ['respiratoire']);
});

// Obsidian enregistre une propriété de type « Nombre » sous la forme `semestres: 3`.
test('accepte un semestre écrit comme un simple nombre', () => {
  assert.deepEqual(schema.parse({ ...base, semestres: 3 }).semestres, [3]);
});

test('accepte une UE ou un organe écrits comme un simple texte', () => {
  const r = schema.parse({ ...base, ue: '2.11', organes: 'cardio' });
  assert.deepEqual(r.ue, ['2.11']);
  assert.deepEqual(r.organes, ['cardio']);
});

// Une propriété laissée vide dans Obsidian arrive comme `null`.
test('accepte un résumé et des organes laissés vides', () => {
  const r = schema.parse({ ...base, resume: null, organes: null });
  assert.equal(r.resume, undefined);
  assert.deepEqual(r.organes, []);
});

test('accepte le type pharmacologie', () => {
  assert.equal(schema.parse({ ...base, type: 'pharmacologie' }).type, 'pharmacologie');
});

test('refuse toujours une UE inconnue ou un semestre hors 1 à 6', () => {
  assert.throws(() => schema.parse({ ...base, ue: '9.9' }));
  assert.throws(() => schema.parse({ ...base, semestres: 7 }));
  assert.throws(() => schema.parse({ ...base, semestres: null }));
});

// Une note personnelle rangée dans « fiches » sans aucune propriété
// ne doit pas bloquer la publication des autres fiches : elle reste non publiée.
test('une note sans aucune propriété est acceptée comme brouillon', () => {
  assert.equal(schema.parse({}).brouillon, true);
  assert.equal(schema.parse(undefined).brouillon, true);
});

test('une fiche avec des propriétés incomplètes reste refusée', () => {
  assert.throws(() => schema.parse({ titre: 'Asthme' }));
});
