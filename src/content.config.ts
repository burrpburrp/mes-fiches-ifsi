import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import ues from './data/ue.json';
import organes from './data/organes.json';
import { identifiant } from './lib/identifiant.mjs';

const idsUe = ues.map((u) => u.id);
const idsOrganes = organes.map((o) => o.id);

// Chaque fiche porte ses métadonnées : c'est ce qui permet de la ranger
// par UE/semestre aujourd'hui, et par organe après la réforme,
// sans jamais déplacer le fichier.
const fiches = defineCollection({
  // Les fiches sont dans le dossier « fiches », ouvert par Oksana dans Obsidian.
  loader: glob({ pattern: '**/*.md', base: './fiches', generateId: ({ entry }) => identifiant(entry) }),
  schema: z.object({
    titre: z.string(),
    resume: z.string().optional(),
    ue: z.array(z.string().refine((id) => idsUe.includes(id), { message: 'UE inconnue (voir src/data/ue.json)' })).min(1),
    semestres: z.array(z.number().int().min(1).max(6)).min(1),
    organes: z.array(z.string().refine((id) => idsOrganes.includes(id), { message: 'Organe inconnu (voir src/data/organes.json)' })).default([]),
    type: z.enum(['anatomie', 'physiologie', 'pathologie', 'medicament', 'soin', 'autre']),
    tags: z.array(z.string()).default([]),
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { fiches };
