import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import ues from './data/ue.json';
import organes from './data/organes.json';
import { identifiant } from './lib/identifiant.mjs';
import { schemaFiche } from './lib/schema-fiche.mjs';

const idsUe = ues.map((u) => u.id);
const idsOrganes = organes.map((o) => o.id);

// Chaque fiche porte ses métadonnées : c'est ce qui permet de la ranger
// par UE/semestre aujourd'hui, et par organe après la réforme,
// sans jamais déplacer le fichier.
const fiches = defineCollection({
  // Les fiches sont dans le dossier « fiches », ouvert par Oksana dans Obsidian.
  loader: glob({ pattern: '**/*.md', base: './fiches', generateId: ({ entry }) => identifiant(entry) }),
  schema: schemaFiche({ idsUe, idsOrganes }),
});

export const collections = { fiches };
