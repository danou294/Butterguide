# Butter - Guide de Restaurants de Paris

Site web pour [Butter](https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938), une application mobile qui permet de découvrir les meilleurs restaurants de Paris.

## 📱 À propos

Butter est un guide curaté des meilleurs restaurants de Paris. Ce site web présente l'application et permet de découvrir les guides de restaurants organisés par thèmes (Manger au comptoir, Italiens niche, Fast & Healthy, etc.).

## 🚀 Technologies utilisées

- **React 18** avec **TypeScript**
- **Vite** - Build tool et dev server
- **React Router** - Routing côté client
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI basés sur Radix UI
- **Supabase** - Backend (base de données et storage)
- **Firebase Storage** - Stockage d'images
- **React Query** - Gestion des données
- **xlsx** - Import/Export Excel

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Preview du build
npm run preview
```

Le serveur de développement sera accessible sur `http://localhost:8080`

## 🏗️ Structure du projet

```
lovable-import/
├── src/
│   ├── components/        # Composants React réutilisables
│   │   ├── ui/            # Composants shadcn/ui
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/             # Pages de l'application
│   │   ├── Index.tsx       # Page d'accueil
│   │   ├── Guides.tsx      # Liste des guides
│   │   ├── Admin.tsx       # Back-office
│   │   └── ...
│   ├── lib/                # Utilitaires et gestion de données
│   │   ├── dataManager.ts  # Gestion Supabase/localStorage
│   │   ├── firebase.ts     # Configuration Firebase
│   │   └── utils.ts        # Fonctions utilitaires
│   ├── hooks/              # React hooks personnalisés
│   ├── integrations/       # Intégrations externes
│   │   └── supabase/       # Client Supabase
│   └── types/              # Types TypeScript
├── supabase/
│   ├── functions/          # Supabase Edge Functions
│   │   ├── import-image/   # Import d'images depuis URL
│   │   └── upload-photo/    # Upload de photos
│   └── config.toml         # Configuration Supabase
└── public/                 # Assets statiques
```

## 🎯 Fonctionnalités

### Pages publiques

- **Page d'accueil** (`/`) - Présentation de l'application
- **Guides** (`/guides`) - Liste des guides de restaurants
- **Guide dynamique** (`/guides/:guideSlug`) - Détails d'un guide
- **App** (`/app`) - Présentation de l'application mobile
- **Contact** (`/contact`) - Formulaire de contact

### Back-office (`/admin`)

- **Gestion des restaurants**
  - Import depuis Excel
  - Ajout/Modification/Suppression
  - Gestion des photos (5 images par restaurant)
  - Génération automatique d'URLs Firebase basées sur les tags
  - Import de photos en lot

- **Gestion des guides**
  - Création/Modification/Suppression
  - Publication/Dépublication
  - Association de restaurants
  - Photo de couverture

- **Bibliothèque de photos**
  - Upload vers Supabase Storage
  - Import depuis URL
  - Export vers Excel

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```env
# Supabase
VITE_SUPABASE_URL=https://qrgwozkpsukggbbhfajc.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_publique

# Firebase (optionnel, pour génération d'URLs)
VITE_FIREBASE_API_KEY=votre_cle_api
```

### Supabase

Le projet utilise Supabase pour :
- Stockage des restaurants et guides
- Supabase Storage pour les photos
- Edge Functions pour l'upload et l'import d'images

Les fonctions Edge sont dans `supabase/functions/` et peuvent être déployées avec :

```bash
supabase functions deploy import-image
supabase functions deploy upload-photo
```

## 📝 Gestion des données

### Restaurants

Les restaurants sont stockés dans Supabase avec :
- Informations de base (nom, adresse, description, etc.)
- Tags pour la génération automatique d'URLs d'images
- 5 images générées automatiquement depuis Firebase Storage (TAG2.png à TAG6.png)
- Logo généré automatiquement (TAG1.png)

### Guides

Les guides contiennent :
- Titre et description
- Liste de restaurants associés
- Photo de couverture
- Statut de publication

### Génération d'URLs d'images

Le système génère automatiquement les URLs Firebase Storage basées sur les tags des restaurants :
- Logo : `Logos/TAG1.png`
- Photos : `Photos restaurants/TAG2.png` à `TAG6.png`
- Couverture de guide : `Photos restaurants/filename.webp`

## 🎨 Design System

Le projet utilise Tailwind CSS avec un design system personnalisé défini dans `src/index.css` :
- Variables CSS pour les couleurs (light/dark mode)
- Composants shadcn/ui pour l'UI
- Animations personnalisées

## 📱 Lien App Store

Tous les boutons de téléchargement pointent vers :
https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938

## 🛠️ Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour la production
- `npm run build:dev` - Build en mode développement
- `npm run lint` - Vérifie le code avec ESLint
- `npm run preview` - Preview du build de production

## 📄 Licence

Copyright © 2025 T'as envie de quoi, SAS

## 🔗 Liens

- [App Store](https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938)
- Instagram: [@butterguide](https://instagram.com/butterguide)
- TikTok: [@butterguide](https://tiktok.com/@butterguide)
- Contact: contact@butterguide.com

