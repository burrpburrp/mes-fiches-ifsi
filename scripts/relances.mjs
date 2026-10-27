// Relances automatiques des tickets qui attendent une réponse d'Oksana.
// Règle : le dernier commentaire d'un ticket ouvert n'est pas d'elle, et il date
// de 7 jours (première relance) ou de 14 jours (relances suivantes).
// Un ticket sans commentaire est encore à traiter de notre côté : pas de relance.

export const OKSANA = 'Ici-Oksana';
// Marqueur invisible qui permet de reconnaître nos relances.
export const MARQUEUR = '<!-- relance-automatique -->';
const JOUR = 24 * 3600 * 1000;

/** @param {{ auteur: string, date: string, corps: string }[]} commentaires du plus ancien au plus récent */
export function aRelancer(commentaires, maintenant = new Date()) {
  const dernier = commentaires.at(-1);
  if (!dernier || dernier.auteur === OKSANA) return false;
  const delai = dernier.corps.includes(MARQUEUR) ? 14 : 7;
  return maintenant - new Date(dernier.date) >= delai * JOUR;
}

export const texteRelance = () =>
  `@${OKSANA}, petite relance : ce ticket attend ta réponse ou ta vérification. ` +
  `Si c'est bon pour toi, tu peux le fermer ; sinon, dis-nous ici ce qui ne va pas.\n\n${MARQUEUR}`;

/** Appelé par la tâche planifiée (.github/workflows/relances.yml) via actions/github-script. */
export async function relancer({ github, context, core }) {
  const { owner, repo } = context.repo;
  const tickets = await github.paginate(github.rest.issues.listForRepo, { owner, repo, state: 'open', per_page: 100 });
  for (const ticket of tickets.filter((t) => !t.pull_request)) {
    const bruts = await github.paginate(github.rest.issues.listComments, { owner, repo, issue_number: ticket.number, per_page: 100 });
    const commentaires = bruts.map((c) => ({ auteur: c.user.login, date: c.created_at, corps: c.body ?? '' }));
    if (!aRelancer(commentaires)) continue;
    await github.rest.issues.createComment({ owner, repo, issue_number: ticket.number, body: texteRelance() });
    core.info(`Relance envoyée sur #${ticket.number}`);
  }
}
