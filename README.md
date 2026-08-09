# AEEMCI — Sous-Comité de Koumassi

Site officiel de l'Association des Élèves et Étudiants Musulmans de Côte d'Ivoire (AEEMCI), Sous-Comité de la commune de Koumassi, Abidjan.

## Structure du projet

```
AEEMCI/
├── index.html          → Page d'accueil
├── activites.html      → Activités
├── actualites.html     → Actualités
├── galerie.html        → Galerie photo/vidéo
├── contact.html        → Contact & adhésion
├── css/
│   └── style.css       → Feuille de style principale
├── images/             → Toutes les images et vidéos
└── README.md
```

## Pile technique

- **HTML5** + **CSS3** (site 100 % statique)
- Aucune base de données, aucun backend
- Les chemins sont **relatifs** (`images/logo.png`, `css/style.css`)

## Hébergement

Ce site étant statique, il peut être déployé gratuitement sur :

- **GitHub Pages** : `https://<votre-utilisateur>.github.io/<nom-du-depot>/`
- **Netlify** : glisser le dossier dans le navigateur
- **Vercel** : import du dépôt

## Déploiement sur GitHub Pages

1. Créer un dépôt GitHub (via `gh repo create` ou l'interface web).
2. Pousser le contenu du dossier sur la branche `main`.
3. Activer **Settings → Pages → Build and deployment** :
   - Source : `Deploy from a branch`
   - Branche : `main`, dossier `/ (root)`
4. Le site est publié sur `https://<utilisateur>.github.io/<nom-du-depot>/`

## Auteur

Bureau du Sous-Comité AEEMCI de Koumassi — Mandat 2026

Foi — Travail — Succès
