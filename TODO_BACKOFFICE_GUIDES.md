# TODO : Back-office & Guides - Ce qu'il reste a faire

## 1. Actions manuelles Supabase (avant tout le reste)

### 1.1 Executer la migration RLS
Ouvrir le SQL Editor dans le dashboard Supabase et coller le contenu de :
`supabase/migrations/20260216_add_rls_policies.sql`

Cela active le Row Level Security sur les tables `restaurants` et `guides` :
- Lecture publique pour tous
- Ecriture uniquement pour les utilisateurs authentifies

### 1.2 Creer un compte admin
Dashboard Supabase > Authentication > Users > "Add user"
- Entrer email + mot de passe
- Ce compte sera utilise pour se connecter sur `/login`

### 1.3 Configurer les variables d'environnement sur Vercel
Settings > Environment Variables > Ajouter :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## 2. Ameliorations du Back-office (`/admin`)

### 2.1 Confirmation avant suppression
**Probleme** : Les boutons "Supprimer" sur les restaurants et guides n'ont pas de confirmation.
Un clic accidentel supprime directement.

**Solution** : Ajouter un `confirm()` ou un dialog de confirmation avant `deleteRestaurant()` et `deleteGuide()`.

### 2.2 Recherche et filtrage des restaurants
**Probleme** : Avec 754 restaurants, la liste est un scroll infini sans filtre.

**Solution** : Ajouter une barre de recherche (par nom, adresse, tag) et une pagination.

### 2.3 Validation des formulaires
**Probleme** : On peut sauvegarder un restaurant sans nom ni adresse.

**Solution** : Ajouter une validation minimum (nom obligatoire, adresse obligatoire) avec messages d'erreur.

### 2.4 Drag & drop pour l'ordre des restaurants dans un guide
**Probleme** : L'ordre des restaurants dans un guide depend de l'ordre de selection des checkboxes. Impossible de le modifier apres.

**Solution** : Ajouter un drag & drop (ex: `@hello-pangea/dnd`) pour reorganiser les restaurants dans un guide.

### 2.5 Preview d'un guide avant publication
**Probleme** : Pas moyen de voir a quoi ressemble un guide avant de le publier.

**Solution** : Ajouter un bouton "Preview" qui ouvre la page du guide dans un nouvel onglet (meme si les routes sont masquees, on peut ajouter une route `/admin/preview/:guideId`).

### 2.6 Upload de la cover image du guide
**Probleme** : Le champ "Photo de couverture" est un simple input texte ou on tape un nom de fichier (ex: `comptoir.webp`). Pas d'upload direct.

**Solution** : Remplacer par un `FileUpload` comme pour les photos de restaurants, ou un selecteur depuis la PhotoLibrary.

### 2.7 Indicateur de statut de sauvegarde
**Probleme** : L'auto-save est silencieux. On ne sait pas si les donnees sont sauvegardees.

**Solution** : Ajouter un petit indicateur "Sauvegarde..." / "Sauvegarde" dans le header.

### 2.8 PhotoLibrary : console.logs restants
**Probleme** : `PhotoLibrary.tsx` contient encore des `console.log` et `console.error` qui n'ont pas ete nettoyes.

**Solution** : Supprimer tous les `console.log/error` dans `PhotoLibrary.tsx`.

### 2.9 Export Excel des restaurants
**Probleme** : On peut importer depuis Excel mais pas exporter la liste actuelle des restaurants.

**Solution** : Ajouter un bouton "Exporter en Excel" dans l'onglet Restaurants (comme celui qui existe deja dans PhotoLibrary).

---

## 3. Reactivation des Guides (pages publiques)

### 3.1 Ce qui existe deja et fonctionne
- `/guides` : Page avec hero + grille des guides publies (dynamique depuis Supabase)
- `/guides/:guideSlug` : Page de guide dynamique avec :
  - Carrousel horizontal des restaurants (clickable avec scroll)
  - Fiche detaillee par restaurant (photos, adresse Google Maps, tel, menu, resa, instagram, site web)
  - Dialog lightbox pour agrandir les photos
  - Section "Autres guides" en bas
- Back-office : CRUD complet des guides avec publication/depublication

### 3.2 Pour reactiver les routes
Dans `src/App.tsx`, decommenter les 3 lignes :
```tsx
<Route path="/guides" element={<Guides />} />
<Route path="/guides/manger-au-comptoir" element={<MangerAuComptoir />} />
<Route path="/guides/:guideSlug" element={<DynamicGuidePage />} />
```

Dans `src/components/Navigation.tsx`, remettre le lien "Guides" dans le menu desktop et mobile.

Dans `src/components/Hero.tsx`, remettre le bouton "Explore nos guides".

### 3.3 Ce qu'il faut faire avant de reactiver

#### A. Avoir au moins 1 guide publie avec des restaurants
Sinon la page `/guides` affichera "Les guides arrivent bientot !".

Workflow :
1. Aller sur `/admin`
2. Onglet "Restaurants" > importer ou ajouter des restaurants avec leurs tags
3. Onglet "Guides" > creer un guide, lui associer des restaurants, ajouter une cover image
4. Cliquer "Publier"

#### B. Verifier les photos Firebase
Les photos sont generees automatiquement depuis les tags :
- Logo : `Logos/TAG1.png`
- Photos : `Photos restaurants/TAG2.png` a `TAG6.png`

S'assurer que les fichiers existent bien dans Firebase Storage avec le bon nommage.

#### C. Supprimer la page statique MangerAuComptoir
`src/pages/MangerAuComptoir.tsx` est une page avec des restaurants hardcodes. Elle n'est plus necessaire car les guides sont dynamiques.

Options :
- Supprimer le fichier et la route
- Ou la garder comme redirect vers le guide dynamique correspondant

#### D. Cover images des guides
Les images de couverture utilisent soit :
- Une URL complete (`https://...`)
- Un nom de fichier (`comptoir.webp`) qui sera converti en URL Firebase via `Photos restaurants/comptoir.webp`

S'assurer que les images de couverture sont bien uploadees dans Firebase Storage sous `Photos restaurants/`.

---

## 4. Ameliorations futures des pages Guides

### 4.1 SEO des pages guides
Ajouter des meta tags dynamiques (`<Helmet>` via react-helmet-async) pour chaque guide :
- `<title>` : Nom du guide
- `<meta description>` : Description du guide
- Open Graph tags avec la cover image

### 4.2 Responsive du layout photos
Les photos dans `DynamicGuidePage.tsx` utilisent des tailles fixes (`w-64 h-64`).
Sur mobile, ca deborde. Passer a des tailles relatives.

### 4.3 Lazy loading des images
Les images des restaurants ne sont pas en lazy load (`loading="lazy"` manquant sur les `<img>`).
Ajouter `loading="lazy"` pour ameliorer les performances.

### 4.4 Gestion d'erreur des images
Si une image Firebase n'existe pas (404), elle affiche une icone cassee.
Ajouter un `onError` qui remplace par un placeholder propre.

### 4.5 Partage sur les reseaux sociaux
Ajouter des boutons de partage (copier le lien, partager sur Instagram/WhatsApp) sur chaque page guide.

---

## 5. Resume des priorites

| Priorite | Tache | Effort |
|----------|-------|--------|
| P0 | Executer migration RLS + creer compte admin | 5 min |
| P0 | Configurer env vars sur Vercel | 5 min |
| P1 | Confirmation avant suppression (restaurants + guides) | 15 min |
| P1 | Avoir au moins 1 guide publie avec restaurants | 30 min |
| P1 | Reactiver les routes guides | 5 min |
| P2 | Recherche/filtre restaurants dans le backoffice | 1-2h |
| P2 | Upload cover image (FileUpload au lieu de texte) | 30 min |
| P2 | Validation des formulaires | 30 min |
| P2 | Responsive photos dans DynamicGuidePage | 30 min |
| P3 | Preview guide avant publication | 1h |
| P3 | Drag & drop ordre restaurants dans guide | 1-2h |
| P3 | SEO dynamique par guide (react-helmet) | 1h |
| P3 | Export Excel restaurants | 30 min |
| P3 | Lazy loading + fallback images | 30 min |
