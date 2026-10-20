import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qcmGeneral, qcmGeneraux } from '../src/lib/qcm-general.mjs';

const q = (question) => ({ question, choix: ['a', 'b'], reponses: [0], explication: '' });

const fiches = [
  { id: 'addictions', titre: 'Médicaments des addictions', ue: ['2.11'], semestres: [5], qcm: [q('A1'), q('A2')] },
  { id: 'toxidermies', titre: 'Toxidermies', ue: ['2.11'], semestres: [5], qcm: [q('T1')] },
  { id: 'beta2', titre: 'Bêta-2 mimétiques', ue: ['2.11'], semestres: [3], qcm: [q('B1')] },
  { id: 'asthme', titre: 'Asthme', ue: ['2.8'], semestres: [3], qcm: [q('As1')] },
  { id: 'sans-qcm', titre: 'Sans QCM', ue: ['2.11'], semestres: [5] },
];

test('réunit les questions des fiches de la même UE et du même semestre', () => {
  const questions = qcmGeneral(fiches, '2.11', 5);
  assert.deepEqual(questions.map((x) => x.question), ['A1', 'A2', 'T1']);
});

test('chaque question garde un lien vers sa fiche d\'origine', () => {
  const [premiere] = qcmGeneral(fiches, '2.11', 5);
  assert.deepEqual(premiere.fiche, { id: 'addictions', titre: 'Médicaments des addictions' });
  assert.deepEqual(premiere.choix, ['a', 'b']);
});

test('une fiche rattachée à deux UE ou deux semestres compte dans chacun', () => {
  const commune = { id: 'c', titre: 'Commune', ue: ['2.8', '2.11'], semestres: [3, 5], qcm: [q('C1')] };
  assert.ok(qcmGeneral([commune], '2.8', 3).length === 1);
  assert.ok(qcmGeneral([commune], '2.11', 5).length === 1);
});

test('liste les QCM généraux qui ont au moins une question', () => {
  const liste = qcmGeneraux(fiches, [
    { id: '2.8', semestres: [3] },
    { id: '2.11', semestres: [1, 3, 5] },
  ]);
  assert.deepEqual(
    liste.map(({ ue, semestre, questions }) => [ue, semestre, questions.length]),
    [['2.8', 3, 1], ['2.11', 3, 1], ['2.11', 5, 3]],
  );
});
