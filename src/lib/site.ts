import { getCollection } from 'astro:content';
import ues from '../data/ue.json';
import organes from '../data/organes.json';

export { ues, organes };

/** Construit un lien interne en tenant compte du sous-dossier GitHub Pages. */
export function lien(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${chemin.replace(/^\//, '')}`;
}

/** Toutes les fiches publiées (hors brouillons), triées par titre. */
export async function fichesPubliees() {
  const toutes = await getCollection('fiches', ({ data }) => !data.brouillon);
  return toutes.sort((a, b) => a.data.titre.localeCompare(b.data.titre, 'fr'));
}

export const libellesType: Record<string, string> = {
  anatomie: 'Anatomie',
  physiologie: 'Physiologie',
  pathologie: 'Pathologie',
  medicament: 'Médicament',
  soin: 'Soin',
  autre: 'Autre',
};
