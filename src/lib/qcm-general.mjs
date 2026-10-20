// QCM général d'une UE pour un semestre : toutes les questions des fiches
// publiées de cette UE et de ce semestre, chacune avec un lien vers sa fiche.
// Rien à écrire en plus pour Oksana : tout vient des sections « ## QCM ».

/**
 * @param {{ id: string, titre: string, ue: string[], semestres: number[], qcm?: object[] }[]} fiches
 * @param {string} ue
 * @param {number} semestre
 */
export function qcmGeneral(fiches, ue, semestre) {
  return fiches
    .filter((f) => f.ue.includes(ue) && f.semestres.includes(semestre))
    .flatMap((f) => (f.qcm ?? []).map((question) => ({ ...question, fiche: { id: f.id, titre: f.titre } })));
}

/** Tous les QCM généraux qui ont au moins une question, UE par UE puis semestre par semestre. */
export function qcmGeneraux(fiches, ues) {
  return ues.flatMap((u) =>
    u.semestres
      .map((semestre) => ({ ue: u.id, semestre, questions: qcmGeneral(fiches, u.id, semestre) }))
      .filter((g) => g.questions.length > 0),
  );
}
