# Guide d'Oksana

Bienvenue ! Ce guide t'explique les trois choses que tu feras sur GitHub. Tu n'as jamais besoin de toucher au code.

> ⚠️ Ce dépôt est **public** : tout ce que tu écris dans les demandes et les commentaires est visible par tout le monde. N'y mets rien de personnel ou de confidentiel.

## 1. Exprimer un besoin ou signaler un problème

1. Va sur la page du projet : <https://github.com/burrpburrp/mes-fiches-ifsi>
2. Clique sur l'onglet **Issues**, puis sur le bouton vert **New issue**.
3. Choisis :
   - **💡 Nouveau besoin** pour une idée ou une envie ;
   - **🐞 Signaler un problème** si quelque chose ne marche pas sur le site.
4. Remplis le formulaire comme tu le dirais à l'oral, puis clique sur **Create**.

Une demande = un sujet. Si tu as trois idées, fais trois demandes : c'est plus facile à suivre.

## 2. Suivre l'avancement

Chaque demande devient une carte sur le **tableau de suivi** (onglet **Projects** du dépôt). Elle avance de colonne en colonne :

| Colonne | Ce que ça veut dire |
|---|---|
| Idée | Ta demande est reçue. |
| À préciser | On a une question pour toi avant de commencer. |
| Prêt | C'est clair, ça sera fait bientôt. |
| En cours | On travaille dessus. |
| **À valider par Oksana** | **C'est à toi : on attend ton avis.** |
| Terminé | C'est en ligne. |

## 3. Valider ou donner ton avis

Quand on a besoin de toi, on te mentionne (**@Ici-Oksana**) dans un commentaire. Tu reçois alors un e-mail de GitHub.

1. Clique sur le lien de l'e-mail : tu arrives sur la demande.
2. Lis le dernier commentaire (souvent avec une capture ou un lien vers la page à regarder).
3. Réponds tout en bas, dans la zone **Add a comment**, puis clique sur **Comment**.

Une réponse simple suffit : « OK pour moi », ou « Je préférerais que… ».

## 4. Écrire et publier tes fiches avec Obsidian

Tes fiches sont de simples fichiers dans le dossier `fiches` du projet. Tu les écris dans **Obsidian**, et tu les publies depuis Obsidian, avec l'extension **Git**.

### Installation sous Linux (une seule fois, à faire avec Manuel)

Cette partie se fait dans un terminal. Manuel peut s'en charger ; ensuite tu n'en auras plus besoin. Les commandes sont pour Ubuntu, Linux Mint ou Debian.

1. Installe Git et l'outil GitHub :
   ```
   sudo apt install git gh
   ```
2. Connecte-toi à GitHub (une page s'ouvre dans le navigateur, valide avec ton compte `Ici-Oksana`) :
   ```
   gh auth login --web --git-protocol https
   gh auth setup-git
   ```
3. Indique ton nom pour signer tes publications :
   ```
   git config --global user.name "Oksana"
   git config --global user.email "ADRESSE-EMAIL-DE-TON-COMPTE-GITHUB"
   ```
4. Récupère le projet dans ton dossier personnel :
   ```
   gh repo clone burrpburrp/mes-fiches-ifsi ~/mes-fiches-ifsi
   ```
5. Installe [Obsidian](https://obsidian.md/download) en prenant le paquet **.deb** ou l'**AppImage**. Évite la version Flatpak, qui ne voit pas Git.
6. Ouvre Obsidian, choisis **Ouvrir un dossier comme coffre** (« Open folder as vault »), puis le dossier `mes-fiches-ifsi`.
7. Installe l'extension Git : **Paramètres → Extensions de la communauté → Activer**, puis **Parcourir**. Cherche « **Git** » (auteur : Vinzent), clique sur **Installer**, puis sur **Activer**.
8. Dans les réglages de l'extension Git, active **Pull on startup** : Obsidian récupérera les dernières modifications à chaque ouverture.

Tu verras d'autres dossiers (le code du site) : ignore-les, tout se passe dans `fiches`.

### Écrire une fiche

1. Crée une nouvelle note (**Ctrl+N**). Elle se range toute seule dans `fiches`. Le nom de la note est le titre de la fiche.
2. Insère le modèle : **Ctrl+P**, tape « modèle », choisis **Insérer un modèle**, puis **Fiche**.
3. Remplis les **propriétés** en haut :
   - `ue` : le ou les numéros d'UE, par exemple `2.8` ;
   - `semestres` : 1 à 6 ;
   - `organes` : `cardiovasculaire`, `respiratoire`, `neurologique`, `digestif`, `urinaire`, `endocrinien`, `locomoteur`, `cutane` ou `hematologique` ;
   - `type` : `anatomie`, `physiologie`, `pathologie`, `medicament`, `soin` ou `autre` ;
   - `brouillon` : laisse `true` tant que la fiche n'est pas prête. Elle n'apparaîtra pas sur le site.
4. Écris ta fiche en dessous, comme d'habitude. Tu peux coller depuis Google Docs.

### Faire des liens

| Tu écris | Ça crée un lien vers… |
|---|---|
| `[[Asthme]]` | la fiche Asthme |
| `[[Asthme#Signes d'une crise]]` | la partie « Signes d'une crise » de la fiche |
| `[[Asthme#^def]]` | un paragraphe précis (Obsidian te propose la liste quand tu tapes `^`) |
| `[[Asthme\|la fiche sur l'asthme]]` | la fiche, avec le texte de ton choix |

Un lien vers une fiche encore en brouillon s'affiche barré sur le site ; il devient cliquable dès que tu publies cette fiche.

Tape simplement `[[` : Obsidian te propose les fiches existantes. La **vue graphique** (icône en forme de réseau à gauche) te montre toutes les fiches et leurs liens.

### Écrire le QCM

Tout en bas de la fiche, sous un titre `## QCM` : une question par sous-titre `###`, puis les réponses en cases à cocher. Coche les bonnes réponses avec un `x`.

```
## QCM

### Quel bruit est typique d'une crise d'asthme ?
- [x] Des sibilants
- [ ] Un souffle tubaire
- [ ] Des crépitants

Explication : les sibilants traduisent le rétrécissement des bronches.
```

S'il y a plusieurs bonnes réponses, coche-les toutes : le site s'adapte.

### Publier

1. Passe `brouillon` à `false` dans les propriétés de la fiche.
2. **Ctrl+P**, tape « commit », puis choisis **Git: Commit-and-sync**. Tu peux aussi utiliser l'icône Git dans la barre de gauche.

C'est tout : la fiche part sur GitHub et le site se met à jour tout seul en 2 à 3 minutes. S'il y a une erreur (une UE mal écrite, par exemple), le site garde sa version précédente : préviens Manuel.

## Une question ?

Crée une demande **💡 Nouveau besoin** en commençant le titre par « Question : », ou écris directement à Manuel.
