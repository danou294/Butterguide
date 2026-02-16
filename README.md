# Butter - Guide de Restaurants de Paris

Site web pour [Butter](https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938), une application mobile qui permet de decouvrir les meilleurs restaurants de Paris.

## Technologies

- **React 18** + **TypeScript** + **Vite**
- **React Router** - Routing SPA
- **Tailwind CSS** + **shadcn/ui** - UI
- **Supabase** - Base de donnees, Auth, Storage
- **Firebase Storage** - Images restaurants (URLs generees par tags)
- **React Query** - Cache & fetching
- **xlsx** - Import/Export Excel
- **qrcode.react** - QR code App Store

## Installation

```bash
# Copier et remplir les variables d'environnement
cp .env.example .env

# Installer les dependances
npm install

# Lancer en dev
npm run dev

# Build production
npm run build
```

Dev server sur `http://localhost:8080`

## Structure du projet

```
src/
  components/
    ui/                     # shadcn/ui (42 composants)
    Navigation.tsx          # Barre de navigation
    Hero.tsx                # Hero page d'accueil
    Footer.tsx              # Footer avec QR code, reseaux sociaux
    ErrorBoundary.tsx       # Error boundary React
    ProtectedRoute.tsx      # Garde de route (auth requise)
    DynamicGuidePage.tsx    # Page guide dynamique (depuis Supabase)
    GuidesCategories.tsx    # Grille des guides publies
    GuidesHero.tsx          # Hero page guides
    OtherGuides.tsx         # Section "Autres guides"
    FileUpload.tsx          # Upload de fichiers
    PhotoLibrary.tsx        # Bibliotheque de photos
  pages/
    Index.tsx               # Accueil
    App.tsx                 # Presentation de l'app mobile
    Contact.tsx             # Formulaire de contact
    Guides.tsx              # Liste des guides (masquee pour l'instant)
    MangerAuComptoir.tsx    # Guide statique (legacy)
    Admin.tsx               # Back-office complet
    Login.tsx               # Connexion admin
    MentionsLegales.tsx     # Mentions legales
    PolitiqueConfidentialite.tsx  # Politique RGPD
    NotFound.tsx            # 404
  hooks/
    useAuth.tsx             # Contexte auth Supabase
    use-toast.ts            # Notifications toast
    use-mobile.tsx          # Detection mobile
  lib/
    dataManager.ts          # CRUD Supabase (restaurants, guides)
    firebase.ts             # Config Firebase Storage
    utils.ts                # Utilitaires
  integrations/
    supabase/
      client.ts             # Client Supabase (env vars)
      types.ts              # Types generes
  types/
    admin.ts                # Types Restaurant, Guide
supabase/
  migrations/
    20260216_add_rls_policies.sql  # RLS (a executer manuellement)
  functions/
    import-image/           # Edge Function import image URL
    upload-photo/           # Edge Function upload photo
public/
  robots.txt
  sitemap.xml
```

## Routes

| Route | Page | Statut |
|-------|------|--------|
| `/` | Accueil | Active |
| `/app` | Presentation app mobile | Active |
| `/contact` | Formulaire de contact | Active |
| `/login` | Connexion admin | Active |
| `/admin` | Back-office (protege) | Active |
| `/mentions-legales` | Mentions legales | Active |
| `/politique-de-confidentialite` | Politique de confidentialite | Active |
| `/guides` | Liste des guides | Masquee |
| `/guides/:slug` | Guide dynamique | Masquee |

## Variables d'environnement

Voir `.env.example` pour la liste complete :

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Securite

- **Auth** : Supabase Auth (email/password) pour `/admin`
- **RLS** : Row Level Security sur les tables `restaurants` et `guides`
- **Env vars** : Cles API dans `.env`, jamais commitees

## Deploiement

Heberge sur **Vercel** avec `vercel.json` pour le routing SPA.

## Liens

- [App Store](https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938)
- [Instagram](https://instagram.com/butterguide)
- [TikTok](https://tiktok.com/@butterguide)
- [LinkedIn](https://www.linkedin.com/company/butterappli)
- Contact : contact@butterguide.com

Copyright 2025 T'as envie de quoi, SAS
