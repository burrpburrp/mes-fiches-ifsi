import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import ues from './data/ue.json';
import organes from './data/organes.json';

const idsUe = ues.map((u) => u.id);
const idsOrganes = organes.map((o) => o.id);

// Chaque fiche porte ses métadonnées : c'est ce qui permet de la ranger
// par UE/semestre aujourd'hui, et par organe après la réforme,
// sans jamais déplacer le fichier.
const fiches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fiches' }),
  schema: z.object({
    titre: z.string(),
    resume: z.string().optional(),
    ue: z.array(z.string().refine((id) => idsUe.includes(id), { message: 'UE inconnue (voir src/data/ue.json)' })).min(1),
    semestres: z.array(z.number().int().min(1).max(6)).min(1),
    organes: z.array(z.string().refine((id) => idsOrganes.includes(id), { message: 'Organe inconnu (voir src/data/organes.json)' })).default([]),
    type: z.enum(['anatomie', 'physiologie', 'pathologie', 'medicament', 'soin', 'autre']),
    tags: z.array(z.string()).default([]),
    qcm: z
      .array(
        z.object({
          question: z.string(),
          choix: z.array(z.string()).min(2),
          reponse: z.number().int().min(0), // position de la bonne réponse, en partant de 0
          explication: z.string().optional(),
        }),
      )
      .max(5)
      .default([]),
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { fiches };
