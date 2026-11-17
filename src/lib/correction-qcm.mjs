// Correction d'une question de QCM, utilisée dans le navigateur par Qcm.astro.
// attendues : numéros des bonnes réponses (cochées [x] par Oksana)
// cochees   : numéros des cases cochées par l'étudiant
// libelles  : texte de chaque choix, pour afficher la bonne réponse

const trier = (liste) => [...liste].map(Number).sort((a, b) => a - b).join(',');

export function corriger(attendues, cochees, libelles) {
  const juste = attendues.length > 0 && trier(attendues) === trier(cochees);
  if (juste) return { juste, verdict: '✅ Bonne réponse.' };
  const debut = attendues.length > 1 ? 'Les bonnes réponses étaient' : 'La bonne réponse était';
  return { juste, verdict: `❌ ${debut} : ${attendues.map((a) => libelles[a]).join(' ; ')}.` };
}

export function texteScore(bonnes, total) {
  return `Score : ${bonnes} / ${total}`;
}
