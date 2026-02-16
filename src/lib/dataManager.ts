import { Restaurant, Guide } from '../types/admin';
import { supabase } from '@/integrations/supabase/client';

const BUCKET_NAME = 'butter-vdef.firebasestorage.app';
const LOGOS_PATH = 'Logos';
const PHOTOS_PATH = 'Photos restaurants';

const generateMediaUrl = (folder: string, filename: string): string => {
  const path = encodeURIComponent(`${folder}/${filename}`);
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${path}?alt=media`;
};

const generateLogoUrl = (tag: string): string | null => {
  if (!tag || tag.trim() === '') return null;
  return generateMediaUrl(LOGOS_PATH, `${tag.toUpperCase()}1.png`);
};

const generateImageUrls = (tag: string, min = 2, max = 6): string[] => {
  if (!tag || tag.trim() === '') return ['', '', '', '', ''];
  const urls = [];
  for (let i = min; i <= max; i++) {
    urls.push(generateMediaUrl(PHOTOS_PATH, `${tag.toUpperCase()}${i}.png`));
  }
  return urls;
};

const generateCoverImageUrl = (filename: string): string => {
  if (!filename || filename.trim() === '') return '';
  return generateMediaUrl(PHOTOS_PATH, filename);
};

const applyGeneratedImages = (restaurant: any): Restaurant => {
  const tag = restaurant.tags && restaurant.tags.length > 0 ? restaurant.tags[0] : '';
  const generatedImages = generateImageUrls(tag);
  const logoUrl = generateLogoUrl(tag);

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

export class DataManager {
  private static RESTAURANTS_KEY = 'butter-restaurants';
  private static GUIDES_KEY = 'butter-guides';
  private static PUBLISHED_GUIDES_KEY = 'butter-published-guides';

  static async getRestaurants(): Promise<Restaurant[]> {
    try {
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return restaurants?.map(r => applyGeneratedImages(r)) || [];
    } catch (error) {
      const localData = localStorage.getItem(this.RESTAURANTS_KEY);
      return localData ? JSON.parse(localData) : [];
    }
  }

  static async saveRestaurants(restaurants: Restaurant[]): Promise<void> {
    try {
      const { error: deleteError } = await supabase
        .from('restaurants')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        console.warn('Error deleting restaurants:', deleteError);
      }

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

      const { error: insertError } = await supabase
        .from('restaurants')
        .insert(restaurantsData);

      if (insertError) throw insertError;

      // Update images with generated Firebase URLs
      const updatePromises = restaurants.map(restaurant => {
        const tag = restaurant.tags && restaurant.tags.length > 0 ? restaurant.tags[0] : '';
        const generatedImages = generateImageUrls(tag);

        return supabase
          .from('restaurants')
          .update({ images: generatedImages })
          .eq('id', restaurant.id);
      });

      await Promise.allSettled(updatePromises);

      localStorage.setItem(this.RESTAURANTS_KEY, JSON.stringify(restaurants));
    } catch (error) {
      localStorage.setItem(this.RESTAURANTS_KEY, JSON.stringify(restaurants));
      throw error;
    }
  }

  static async getGuides(): Promise<Guide[]> {
    try {
      const { data: guides, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return guides?.map(g => {
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
    } catch (error) {
      const localData = localStorage.getItem(this.GUIDES_KEY);
      return localData ? JSON.parse(localData) : [];
    }
  }

  static async saveGuides(guides: Guide[]): Promise<void> {
    try {
      const { error: deleteError } = await supabase
        .from('guides')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        console.warn('Error deleting guides:', deleteError);
      }

      if (guides.length === 0) return;

      const guidesData = guides.map(guide => {
        let coverImageUrl = guide.coverImage || '';
        if (coverImageUrl && !coverImageUrl.startsWith('http') && !coverImageUrl.includes('firebasestorage')) {
          coverImageUrl = generateCoverImageUrl(coverImageUrl);
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

      const { error: insertError } = await supabase
        .from('guides')
        .insert(guidesData);

      if (insertError) throw insertError;

      localStorage.setItem(this.GUIDES_KEY, JSON.stringify(guides));
    } catch (error) {
      localStorage.setItem(this.GUIDES_KEY, JSON.stringify(guides));
      throw error;
    }
  }

  static async getPublishedGuides(): Promise<Guide[]> {
    try {
      const { data: guides, error } = await supabase
        .from('guides')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return guides?.map(g => {
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
    } catch (error) {
      const localData = localStorage.getItem(this.PUBLISHED_GUIDES_KEY);
      const allGuides = localData ? JSON.parse(localData) : [];
      return allGuides.filter((g: Guide) => g.isPublished === true);
    }
  }

  static async publishGuide(guideId: string): Promise<void> {
    const { error } = await supabase
      .from('guides')
      .update({ is_published: true })
      .eq('id', guideId);

    if (error) throw new Error(`Erreur Supabase: ${error.message}`);
  }

  static async unpublishGuide(guideId: string): Promise<void> {
    const { error } = await supabase
      .from('guides')
      .update({ is_published: false })
      .eq('id', guideId);

    if (error) throw error;
  }

  static async regenerateAllImages(): Promise<void> {
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

    await Promise.allSettled(updatePromises);
  }

  static async harmonizeRestaurantsFormat(): Promise<void> {
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*');

    if (error) throw error;

    const updatePromises = restaurants?.map(restaurant => {
      let harmonized = { ...restaurant };

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

      if (harmonized.website_link && harmonized.website_link.trim() !== '' && !harmonized.website_link.startsWith('http')) {
        harmonized.website_link = `https://${harmonized.website_link}`;
      }

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

    await Promise.allSettled(updatePromises);
  }
}
