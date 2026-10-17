import { z } from 'astro/zod';

// Types de fiche, dans l'ordre d'affichage d'une page organe
// (ordre prévu par la réforme : anatomie → pathologies → médicaments).
export const TYPES = ['anatomie', 'physiologie', 'pathologie', 'medicament', 'pharmacologie', 'soin', 'autre'];

// Dans Obsidian, une propriété peut être une liste (`semestres:\n  - 3`),
// une valeur seule (`semestres: 3`, type « Nombre ») ou rester vide (`null`).
// On accepte les trois et on range toujours le résultat dans une liste.
const enListe = (valeur) => (valeur === null || valeur === undefined ? [] : Array.isArray(valeur) ? valeur : [valeur]);
const liste = (element, minimum = 0) => z.preprocess(enListe, z.array(element).min(minimum));

// Un fichier de « fiches » sans aucune propriété est une note personnelle
// d'Oksana, pas une fiche : on ne la publie pas, mais elle ne doit pas
// empêcher la publication des autres fiches.
const sansProprietes = (valeur) => valeur === null || valeur === undefined || Object.keys(valeur).length === 0;

/** Schéma des propriétés d'une fiche, validé à chaque publication. */
export function schemaFiche({ idsUe, idsOrganes }) {
  // Valeurs de remplacement d'une note personnelle : valides, et en brouillon.
  const notePersonnelle = { titre: '', ue: [idsUe[0]], semestres: [1], type: 'autre', brouillon: true };
  const fiche = z.object({
    titre: z.string(),
    resume: z.string().nullish().transform((v) => v ?? undefined),
    ue: liste(z.coerce.string().refine((id) => idsUe.includes(id), { message: 'UE inconnue (voir src/data/ue.json)' }), 1),
    semestres: liste(z.coerce.number().int().min(1).max(6), 1),
    organes: liste(z.string().refine((id) => idsOrganes.includes(id), { message: 'Organe inconnu (voir src/data/organes.json)' })),
    type: z.enum(TYPES),
    tags: liste(z.string()),
    brouillon: z.boolean().nullish().transform((v) => v ?? false),
  });
  return z.preprocess((valeur) => (sansProprietes(valeur) ? notePersonnelle : valeur), fiche);
}
