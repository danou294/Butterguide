-- =============================================
-- Row Level Security (RLS) pour Butter
-- À exécuter dans le SQL Editor de Supabase
-- =============================================

-- Activer RLS sur les tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Policies pour la table "restaurants"
-- =============================================

-- Lecture publique : tout le monde peut voir les restaurants
CREATE POLICY "Public read access for restaurants"
  ON public.restaurants
  FOR SELECT
  USING (true);

-- Insertion : uniquement les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert restaurants"
  ON public.restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Modification : uniquement les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update restaurants"
  ON public.restaurants
  FOR UPDATE
  TO authenticated
  USING (true);

-- Suppression : uniquement les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete restaurants"
  ON public.restaurants
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- Policies pour la table "guides"
-- =============================================

-- Lecture publique : uniquement les guides publiés
CREATE POLICY "Public read access for published guides"
  ON public.guides
  FOR SELECT
  USING (is_published = true);

-- Lecture complète pour les utilisateurs authentifiés (admin)
CREATE POLICY "Authenticated users can read all guides"
  ON public.guides
  FOR SELECT
  TO authenticated
  USING (true);

-- Insertion : uniquement les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert guides"
  ON public.guides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Modification : uniquement les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update guides"
  ON public.guides
  FOR UPDATE
  TO authenticated
  USING (true);

-- Suppression : uniquement les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete guides"
  ON public.guides
  FOR DELETE
  TO authenticated
  USING (true);
