// Déplace les cartes du tableau GitHub Projects quand une PR cite un ticket par « Lié à #N » :
//   - PR ouverte  → la carte du ticket passe dans « En cours » ;
//   - PR fusionnée → la carte passe dans « À valider par Oksana ».
// La fermeture du ticket par Oksana (→ « Terminé ») est déjà gérée par le tableau lui-même.
// Le tableau appartient au compte de Manuel : il faut une clé d'accès (secret TABLEAU_TOKEN).

export const PROPRIETAIRE = 'burrpburrp';
export const NUMERO_TABLEAU = 1;

const sansAccents = (texte) => texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Numéros des tickets cités « Lié à #N » (avec ou sans accents) dans le texte d'une PR. */
export function ticketsLies(texte) {
  return [...sansAccents(texte ?? '').matchAll(/lie a #(\d+)/g)].map((m) => Number(m[1]));
}

/** Colonne où ranger les tickets liés, selon ce qui vient d'arriver à la PR (null : ne rien faire). */
export function colonneVisee({ action, merged }) {
  if (action === 'opened' || action === 'reopened') return 'En cours';
  if (action === 'closed' && merged) return 'À valider par Oksana';
  return null;
}

export function trouverOption(options, nom) {
  return options.find((o) => sansAccents(o.name) === sansAccents(nom));
}

/** Appelé par .github/workflows/tableau.yml via actions/github-script (avec la clé du tableau). */
export async function deplacerCartes({ github, context, core }) {
  const pr = context.payload.pull_request;
  const colonne = colonneVisee({ action: context.payload.action, merged: pr.merged });
  const tickets = ticketsLies(pr.body);
  if (!colonne || tickets.length === 0) return core.info('Rien à déplacer.');

  const { user } = await github.graphql(
    `query($login: String!, $numero: Int!) {
      user(login: $login) { projectV2(number: $numero) { id
        field(name: "Status") { ... on ProjectV2SingleSelectField { id options { id name } } } } }
    }`,
    { login: PROPRIETAIRE, numero: NUMERO_TABLEAU },
  );
  const tableau = user.projectV2;
  const option = trouverOption(tableau.field.options, colonne);
  if (!option) return core.setFailed(`Colonne « ${colonne} » introuvable. Colonnes : ${tableau.field.options.map((o) => o.name).join(', ')}`);

  const { owner, repo } = context.repo;
  for (const numero of tickets) {
    const { repository } = await github.graphql(
      `query($owner: String!, $repo: String!, $numero: Int!) {
        repository(owner: $owner, name: $repo) { issue(number: $numero) { id projectItems(first: 20) { nodes { id project { id } } } } }
      }`,
      { owner, repo, numero },
    );
    const ticket = repository.issue;
    if (!ticket) { core.warning(`#${numero} n'est pas un ticket.`); continue; }
    let carte = ticket.projectItems.nodes.find((n) => n.project.id === tableau.id)?.id;
    if (!carte) {
      const ajout = await github.graphql(
        `mutation($tableau: ID!, $ticket: ID!) { addProjectV2ItemById(input: { projectId: $tableau, contentId: $ticket }) { item { id } } }`,
        { tableau: tableau.id, ticket: ticket.id },
      );
      carte = ajout.addProjectV2ItemById.item.id;
    }
    await github.graphql(
      `mutation($tableau: ID!, $carte: ID!, $champ: ID!, $option: String!) {
        updateProjectV2ItemFieldValue(input: { projectId: $tableau, itemId: $carte, fieldId: $champ, value: { singleSelectOptionId: $option } }) { projectV2Item { id } }
      }`,
      { tableau: tableau.id, carte, champ: tableau.field.id, option: option.id },
    );
    core.info(`#${numero} → ${option.name}`);
  }
}
