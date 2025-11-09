import { Restaurant, Guide } from '../types/admin';
import { supabase } from '@/integrations/supabase/client';

// Configuration Firebase Storage pour génération d'URLs d'images

const BUCKET_NAME = 'butter-vdef.firebasestorage.app';

const LOGOS_PATH = 'Logos';

const PHOTOS_PATH = 'Photos restaurants';

// Génère l'URL d'un média depuis Firebase Storage

const generateMediaUrl = (folder: string, filename: string): string => {
  const path = encodeURIComponent(`${folder}/${filename}`);
  const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${path}?alt=media`;
  console.log('🔗 [URL GENERATED]', url);
  return url;
};

// Génère l'URL du logo (TAG1.png)

const generateLogoUrl = (tag: string): string | null => {
  if (!tag || tag.trim() === '') return null;
  const url = generateMediaUrl(LOGOS_PATH, `${tag.toUpperCase()}1.png`);
  console.log('🖼️ [LOGO URL] Tag:', tag, '→ URL:', url);
  return url;
};

// Génère les URLs des photos (TAG2.png à TAG6.png)

const generateImageUrls = (tag: string, min = 2, max = 6): string[] => {
  if (!tag || tag.trim() === '') return ['', '', '', '', ''];
  const urls = [];
  console.log('📸 [GENERATING IMAGES] Tag:', tag, `(${min}-${max})`);
  for (let i = min; i <= max; i++) {
    const url = generateMediaUrl(PHOTOS_PATH, `${tag.toUpperCase()}${i}.png`);
    urls.push(url);
    console.log(`  → Photo ${i}: ${url}`);
  }
  console.log('✅ [IMAGES GENERATED] Total:', urls.length, 'URLs');
  return urls;
};

// Génère l'URL d'une photo de couverture

const generateCoverImageUrl = (filename: string): string => {
  if (!filename || filename.trim() === '') return '';
  const url = generateMediaUrl(PHOTOS_PATH, filename);
  console.log('📷 [COVER IMAGE URL] Filename:', filename, '→ URL:', url);
  return url;
};

// Applique les URLs générées à un restaurant basé sur ses tags

const applyGeneratedImages = (restaurant: any): Restaurant => {
  const tag = restaurant.tags && restaurant.tags.length > 0 ? restaurant.tags[0] : '';
  console.log('🏷️ [APPLYING IMAGES] Restaurant:', restaurant.name, 'Tag:', tag);
  const generatedImages = generateImageUrls(tag);
  const logoUrl = generateLogoUrl(tag);
  
  console.log('✅ [RESTAURANT IMAGES APPLIED]', {
    restaurant: restaurant.name,
    tag,
    imagesCount: generatedImages.length,
    logoUrl: logoUrl || 'none',
    images: generatedImages
  });
  
  return {
    id: restaurant.id,
    name: restaurant.name || '',
    address: restaurant.address || '',
    description: restaurant.description || '',
    phone: restaurant.phone || '',
    menuLink: restaurant.menu_link || '',
    reservationLink: restaurant.reservation_link || '',
    websiteLink: restaurant.website_link || '',
    instagramHandle: restaurant.instagram_handle || '',
    images: generatedImages,
    tags: restaurant.tags || [],
    logo: logoUrl || undefined
  };
};

// Data manager that uses Supabase for persistence with localStorage fallback

export class DataManager {
  private static RESTAURANTS_KEY = 'butter-restaurants';
  private static GUIDES_KEY = 'butter-guides';
  private static PUBLISHED_GUIDES_KEY = 'butter-published-guides';

  static async getRestaurants(): Promise<Restaurant[]> {
    try {
      console.log('🔄 [LOAD DEBUG] Chargement des données depuis Supabase...');
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('🔴 [LOAD ERROR] Erreur Supabase:', error);
        throw error;
      }
      
      console.log('🔍 [LOAD DEBUG] Données brutes Supabase:', restaurants?.length, restaurants?.slice(0, 2));
      
      const mappedRestaurants = restaurants?.map(r => applyGeneratedImages(r)) || [];
      
      console.log('✅ [LOAD SUCCESS] Restaurants chargés:', mappedRestaurants.length, mappedRestaurants.slice(0, 2));
      return mappedRestaurants;
    } catch (error) {
      console.error('🔴 [LOAD ERROR] Erreur lors du chargement des restaurants:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(this.RESTAURANTS_KEY);
      const fallbackData = localData ? JSON.parse(localData) : [];
      console.log('📦 [FALLBACK] Utilisation localStorage:', fallbackData.length, 'restaurants');
      return fallbackData;
    }
  }

  static async saveRestaurants(restaurants: Restaurant[]): Promise<void> {
    try {
      console.log('🔄 [SAVE DEBUG] Sauvegarde de', restaurants.length, 'restaurants dans Supabase...');
      console.log('🔍 [SAVE DEBUG] Exemples de restaurants:', restaurants.slice(0, 2));
      
      // Clear existing data and insert new data
      const { error: deleteError } = await supabase
        .from('restaurants')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) {
        console.warn('⚠️ [SAVE WARNING] Erreur lors de la suppression:', deleteError);
      } else {
        console.log('🗑️ [SAVE DEBUG] Données existantes supprimées');
      }
      
      // Insert new restaurants
      const restaurantsData = restaurants.map(restaurant => ({
        id: restaurant.id || undefined,
        name: restaurant.name,
        address: restaurant.address,
        description: restaurant.description,
        phone: restaurant.phone,
        menu_link: restaurant.menuLink,
        reservation_link: restaurant.reservationLink,
        website_link: restaurant.websiteLink,
        instagram_handle: restaurant.instagramHandle,
        images: restaurant.images,
        tags: restaurant.tags
      }));
      
      console.log('💾 [SAVE DEBUG] Données préparées pour insertion:', restaurantsData.slice(0, 2));
      
      const { error: insertError } = await supabase
        .from('restaurants')
        .insert(restaurantsData);
      
      if (insertError) {
        console.error('🔴 [SAVE ERROR] Erreur d\'insertion:', insertError);
        throw insertError;
      }
      
      // Mettre à jour les images dans Supabase avec les URLs générées
      console.log('🖼️ [UPDATE] Mise à jour des images générées dans la base...');
      
      const updatePromises = restaurants.map(restaurant => {
        const tag = restaurant.tags && restaurant.tags.length > 0 ? restaurant.tags[0] : '';
        const generatedImages = generateImageUrls(tag);
        
        return supabase
          .from('restaurants')
          .update({ images: generatedImages })
          .eq('id', restaurant.id);
      });
      
      const updateResults = await Promise.allSettled(updatePromises);
      const successCount = updateResults.filter(result => result.status === 'fulfilled').length;
      const errorCount = updateResults.filter(result => result.status === 'rejected').length;
      
      console.log(`✅ [UPDATE SUCCESS] ${successCount} restaurants mis à jour, ${errorCount} erreurs`);
      
      console.log('✅ [SAVE SUCCESS] Restaurants sauvegardés avec succès');
      
      // Also save to localStorage as backup
      localStorage.setItem(this.RESTAURANTS_KEY, JSON.stringify(restaurants));
    } catch (error) {
      console.error('🔴 [SAVE ERROR] Erreur lors de la sauvegarde des restaurants:', error);
      // Fallback to localStorage only
      localStorage.setItem(this.RESTAURANTS_KEY, JSON.stringify(restaurants));
      throw error;
    }
  }

  static async getGuides(): Promise<Guide[]> {
    try {
      console.log('🔄 [LOAD DEBUG] Chargement des guides depuis Supabase...');
      const { data: guides, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('🔴 [LOAD ERROR] Erreur Supabase:', error);
        throw error;
      }
      
      const mappedGuides = guides?.map(g => {
        let coverImageUrl = (g as any).cover_image || '';
        if (coverImageUrl && !coverImageUrl.startsWith('http') && !coverImageUrl.includes('firebasestorage')) {
          coverImageUrl = generateCoverImageUrl(coverImageUrl);
          console.log('🖼️ [COVER IMAGE] URL générée pour', (g as any).cover_image, '->', coverImageUrl);
        }
        return {
          id: g.id,
          title: g.title || '',
          description: g.description || '',
          restaurants: g.restaurant_ids || [],
          isPublished: g.is_published || false,
          coverImage: coverImageUrl
        };
      }) || [];
      
      console.log('✅ [LOAD SUCCESS] Guides chargés:', mappedGuides.length);
      return mappedGuides;
    } catch (error) {
      console.error('Erreur lors du chargement des guides:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(this.GUIDES_KEY);
      return localData ? JSON.parse(localData) : [];
    }
  }

  static async saveGuides(guides: Guide[]): Promise<void> {
    try {
      console.log('🔄 [GUIDES SAVE] Début sauvegarde de', guides.length, 'guides');
      console.log('🔄 [GUIDES SAVE] Données guides:', guides);
      
      // Clear existing data and insert new data
      const { error: deleteError } = await supabase
        .from('guides')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) {
        console.warn('⚠️ [GUIDES SAVE] Erreur lors de la suppression:', deleteError);
      } else {
        console.log('🗑️ [GUIDES SAVE] Guides existants supprimés');
      }
      
      if (guides.length === 0) {
        console.log('📝 [GUIDES SAVE] Aucun guide à sauvegarder');
        return;
      }
      
      // Insert new guides with generated cover image URLs
      const guidesData = guides.map(guide => {
        // Si coverImage est juste un nom de fichier, générer l'URL complète
        let coverImageUrl = guide.coverImage || '';
        if (coverImageUrl && !coverImageUrl.startsWith('http') && !coverImageUrl.includes('firebasestorage')) {
          coverImageUrl = generateCoverImageUrl(coverImageUrl);
          console.log('🖼️ [COVER IMAGE] URL générée pour', guide.coverImage, '->', coverImageUrl);
        }
        
        return {
          id: guide.id || undefined,
          title: guide.title,
          description: guide.description,
          restaurant_ids: guide.restaurants,
          is_published: guide.isPublished || false,
          cover_image: coverImageUrl
        };
      });
      
      console.log('💾 [GUIDES SAVE] Données préparées pour insertion:', guidesData);
      
      const { error: insertError } = await supabase
        .from('guides')
        .insert(guidesData);
      
      if (insertError) {
        console.error('🔴 [GUIDES SAVE] Erreur d\'insertion:', insertError);
        throw insertError;
      }
      
      console.log('✅ [GUIDES SAVE] Guides sauvegardés avec succès');
      
      // Also save to localStorage as backup
      localStorage.setItem(this.GUIDES_KEY, JSON.stringify(guides));
    } catch (error) {
      console.error('🔴 [GUIDES SAVE] Erreur lors de la sauvegarde des guides:', error);
      // Fallback to localStorage only
      localStorage.setItem(this.GUIDES_KEY, JSON.stringify(guides));
      throw error;
    }
  }

  static async getPublishedGuides(): Promise<Guide[]> {
    try {
      console.log('🔄 [LOAD DEBUG] Chargement des guides publiés depuis Supabase...');
      const { data: guides, error } = await supabase
        .from('guides')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('🔴 [LOAD ERROR] Erreur Supabase:', error);
        throw error;
      }
      
      const mappedGuides = guides?.map(g => {
        let coverImageUrl = (g as any).cover_image || '';
        if (coverImageUrl && !coverImageUrl.startsWith('http') && !coverImageUrl.includes('firebasestorage')) {
          coverImageUrl = generateCoverImageUrl(coverImageUrl);
        }
        return {
          id: g.id,
          title: g.title || '',
          description: g.description || '',
          restaurants: g.restaurant_ids || [],
          isPublished: g.is_published || false,
          coverImage: coverImageUrl
        };
      }) || [];
      
      console.log('✅ [LOAD SUCCESS] Guides publiés chargés:', mappedGuides.length);
      return mappedGuides;
    } catch (error) {
      console.error('Erreur lors du chargement des guides publiés:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(this.PUBLISHED_GUIDES_KEY);
      const allGuides = localData ? JSON.parse(localData) : [];
      const publishedGuides = allGuides.filter((g: Guide) => g.isPublished === true);
      console.log('📦 [FALLBACK] Utilisation localStorage:', publishedGuides.length, 'guides publiés');
      return publishedGuides;
    }
  }

  static async savePublishedGuides(guides: Guide[]): Promise<void> {
    // This method is deprecated - publishing status is now handled within saveGuides
    console.warn('savePublishedGuides is deprecated, use saveGuides instead');
  }

  static async publishGuide(guideId: string): Promise<void> {
    try {
      console.log('🔴 [SUPABASE PUBLISH] Tentative de publication:', guideId);
      const { error } = await supabase
        .from('guides')
        .update({ is_published: true })
        .eq('id', guideId);
      
      if (error) throw error;
      console.log('🔴 [SUPABASE PUBLISH] Publication réussie');
    } catch (error: any) {
      console.error('🔴 [SUPABASE PUBLISH ERROR]', error);
      const errorMessage = error?.message || error?.details || 'Erreur inconnue';
      console.error('🔴 [SUPABASE ERROR DETAILS]', { 
        code: error?.code, 
        message: error?.message, 
        details: error?.details, 
        hint: error?.hint 
      });
      throw new Error(`Erreur Supabase: ${errorMessage}`);
    }
  }

  static async unpublishGuide(guideId: string): Promise<void> {
    try {
      console.log('🟠 [SUPABASE UNPUBLISH] Tentative de dépublication:', guideId);
      const { error } = await supabase
        .from('guides')
        .update({ is_published: false })
        .eq('id', guideId);
      
      if (error) throw error;
      console.log('🟠 [SUPABASE UNPUBLISH] Dépublication réussie');
    } catch (error) {
      console.error('Erreur lors de la dépublication du guide:', error);
      throw error;
    }
  }

  // Nouvelle méthode pour régénérer toutes les images basées sur les tags
  static async regenerateAllImages(): Promise<void> {
    try {
      console.log('🖼️ [REGENERATE] Début de la régénération des images...');
      
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('id, tags');
      
      if (error) throw error;
      
      const updatePromises = restaurants?.map(restaurant => {
        const tag = restaurant.tags && restaurant.tags.length > 0 ? restaurant.tags[0] : '';
        const generatedImages = generateImageUrls(tag);
        
        return supabase
          .from('restaurants')
          .update({ images: generatedImages })
          .eq('id', restaurant.id);
      }) || [];
      
      const results = await Promise.allSettled(updatePromises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const errorCount = results.filter(r => r.status === 'rejected').length;
      
      console.log(`✅ [REGENERATE SUCCESS] ${successCount}/${restaurants?.length} images régénérées, ${errorCount} erreurs`);
    } catch (error) {
      console.error('🔴 [REGENERATE ERROR] Erreur lors de la régénération:', error);
      throw error;
    }
  }

  // Harmonise le format de tous les restaurants selon le modèle "Aujourd'hui Demain"
  static async harmonizeRestaurantsFormat(): Promise<void> {
    try {
      console.log('🔧 [HARMONIZE] Début de l\'harmonisation des restaurants...');
      
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('*');
      
      if (error) throw error;
      
      const updatePromises = restaurants?.map(restaurant => {
        let harmonized = { ...restaurant };
        
        // Harmoniser le handle Instagram
        if (harmonized.instagram_handle && harmonized.instagram_handle.trim() !== '') {
          if (!harmonized.instagram_handle.startsWith('https://')) {
            if (harmonized.instagram_handle.startsWith('@')) {
              harmonized.instagram_handle = `https://www.instagram.com/${harmonized.instagram_handle.substring(1)}/`;
            } else if (harmonized.instagram_handle.includes('instagram.com/')) {
              if (!harmonized.instagram_handle.startsWith('https://')) {
                harmonized.instagram_handle = `https://${harmonized.instagram_handle}`;
              }
              if (!harmonized.instagram_handle.endsWith('/')) {
                harmonized.instagram_handle += '/';
              }
            } else {
              harmonized.instagram_handle = `https://www.instagram.com/${harmonized.instagram_handle}/`;
            }
          }
        }
        
        // Harmoniser le site web
        if (harmonized.website_link && harmonized.website_link.trim() !== '' && !harmonized.website_link.startsWith('http')) {
          harmonized.website_link = `https://${harmonized.website_link}`;
        }
        
        // Harmoniser le format du téléphone
        if (harmonized.phone && harmonized.phone.trim() !== '') {
          const phoneNumbers = harmonized.phone.replace(/\s/g, '');
          if (phoneNumbers.length === 10) {
            harmonized.phone = phoneNumbers.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
          }
        }
        
        return supabase
          .from('restaurants')
          .update({
            instagram_handle: harmonized.instagram_handle,
            website_link: harmonized.website_link,
            phone: harmonized.phone
          })
          .eq('id', restaurant.id);
      }) || [];
      
      const results = await Promise.allSettled(updatePromises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const errorCount = results.filter(r => r.status === 'rejected').length;
      
      console.log(`✅ [HARMONIZE SUCCESS] ${successCount}/${restaurants?.length} restaurants harmonisés, ${errorCount} erreurs`);
    } catch (error) {
      console.error('🔴 [HARMONIZE ERROR] Erreur lors de l\'harmonisation:', error);
      throw error;
    }
  }
}
