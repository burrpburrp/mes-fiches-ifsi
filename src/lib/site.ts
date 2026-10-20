import { getCollection, render } from 'astro:content';
import { qcmGeneraux } from './qcm-general.mjs';
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
  pharmacologie: 'Pharmacologie',
  soin: 'Soin',
  autre: 'Autre',
};

type Fiche = Awaited<ReturnType<typeof fichesPubliees>>[number];

/** Les fiches qui contiennent un lien [[...]] vers la fiche donnée (« rétroliens »). */
export function retroliens(fiche: Fiche, toutes: Fiche[]): Fiche[] {
  const nomFichier = fiche.filePath?.split('/').pop()?.replace(/\.md$/, '') ?? '';
  const noms = new Set([fiche.id, fiche.data.titre, nomFichier].map((n) => n.toLowerCase()));
  return toutes.filter((autre) => {
    if (autre.id === fiche.id) return false;
    for (const m of (autre.body ?? '').matchAll(/\[\[([^\]|#]+)/g)) {
      if (noms.has(m[1].trim().toLowerCase())) return true;
    }
    return false;
  });
}

/** Les QCM généraux (UE × semestre) calculés à partir des QCM des fiches publiées. */
export async function qcmGenerauxDuSite() {
  const fiches = await Promise.all(
    (await fichesPubliees()).map(async (f) => {
      const { remarkPluginFrontmatter } = await render(f);
      return { id: f.id, titre: f.data.titre, ue: f.data.ue, semestres: f.data.semestres, qcm: remarkPluginFrontmatter.qcm };
    }),
  );
  return qcmGeneraux(fiches, ues);
}

/** Lien vers le QCM général d'une UE pour un semestre. */
export const lienQcm = (ue: string, semestre: number) => lien(`ue/${ue}/qcm-semestre-${semestre}/`);
