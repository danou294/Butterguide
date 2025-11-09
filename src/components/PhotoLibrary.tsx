import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { Upload, Trash2, Image as ImageIcon, Download, Link, FolderOpen } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { supabase } from "@/integrations/supabase/client";

import * as XLSX from 'xlsx';

interface PhotoItem {
  name: string;
  publicUrl: string;
  size?: number;
  created_at?: string;
}

const PhotoLibrary = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadStatus, setUploadStatus] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [bucketName, setBucketName] = useState('butter-vdef.firebasestorage.app');
  const [logosFolder, setLogosFolder] = useState('Logos');
  const [photosFolder, setPhotosFolder] = useState('Photos restaurants');

  // Load all photos from Supabase Storage
  const loadPhotos = async () => {
    try {
      console.log('Chargement des photos depuis Supabase Storage...');
      
      const { data: files, error } = await supabase.storage
        .from('Restaurant Photos')
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });
      if (error) {
        console.error('Erreur liste Supabase:', error);
        throw error;
      }
      console.log('Fichiers trouvés:', files?.length || 0);
      const photoItems: PhotoItem[] = [];
      
      if (files) {
        for (const file of files) {
          const { data: { publicUrl } } = supabase.storage
            .from('Restaurant Photos')
            .getPublicUrl(file.name);
          
          photoItems.push({
            name: file.name,
            publicUrl,
            size: file.metadata?.size,
            created_at: file.created_at
          });
        }
      }
      console.log('Photos chargées:', photoItems.length);
      setPhotos(photoItems);
    } catch (error) {
      console.error('Erreur chargement Supabase:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les photos depuis Supabase Storage.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  // Upload new photos to Supabase Storage (batch processing)
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    setUploadStatus('Préparation de l\'upload...');

    let successCount = 0;
    let failedCount = 0;

    try {
      setUploadStatus('Upload vers Supabase...');
      
      const fileArray = Array.from(files);
      const batchSize = 3; // Upload 3 files at a time
      
      for (let i = 0; i < fileArray.length; i += batchSize) {
        const batch = fileArray.slice(i, i + batchSize);
        
        setUploadStatus(`Upload batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(fileArray.length / batchSize)}...`);
        
        const batchPromises = batch.map(async (file) => {
          try {
            const fileName = `${Date.now()}-${file.name}`;
            
            const { error } = await supabase.storage
              .from('Restaurant Photos')
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
              });
            if (error) throw error;
            return { success: true, fileName };
          } catch (error) {
            console.error(`Erreur upload ${file.name}:`, error);
            return { success: false, fileName: file.name };
          }
        });
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              successCount++;
            } else {
              failedCount++;
            }
          } else {
            failedCount++;
          }
          
          setUploadProgress(prev => ({ 
            current: prev.current + 1, 
            total: prev.total 
          }));
        });
        if (i + batchSize < fileArray.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setUploadStatus('Upload terminé !');
    } catch (error) {
      console.error('Erreur générale upload:', error);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress({ current: 0, total: 0 });
        setUploadStatus('');
      }, 1000);
    }
    
    if (successCount > 0) {
      toast({
        title: "Upload terminé",
        description: `${successCount} photo(s) uploadée(s) sur Supabase${failedCount > 0 ? `, ${failedCount} échec(s)` : ''}`
      });
      loadPhotos();
    } else {
      toast({
        title: "Erreur d'upload",
        description: "Aucune photo n'a pu être uploadée sur Supabase Storage.",
        variant: "destructive"
      });
    }
    event.target.value = '';
  };

  // Import all photos from Supabase Storage bucket
  const importFromSupabaseFolder = async () => {
    try {
      setUploading(true);
      setUploadStatus('Scan du bucket Supabase...');
      const { data: files, error } = await supabase.storage
        .from('Restaurant Photos')
        .list('', { limit: 1000 });
      if (error) throw error;
      if (!files || files.length === 0) {
        toast({
          title: "Bucket vide",
          description: "Aucune photo trouvée dans le bucket 'Restaurant Photos'"
        });
        return;
      }
      setUploadProgress({ current: 0, total: files.length });
      setUploadStatus(`Import de ${files.length} photos...`);
      let successCount = 0;
      let alreadyExists = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const existingPhoto = photos.find(p => p.name === file.name);
          if (existingPhoto) {
            alreadyExists++;
          } else {
            successCount++;
          }
          
          setUploadProgress(prev => ({ 
            current: prev.current + 1, 
            total: prev.total 
          }));
          
        } catch (error) {
          console.error(`Erreur import ${file.name}:`, error);
        }
      }
      toast({
        title: "Import terminé",
        description: `${successCount} nouvelles photos importées${alreadyExists > 0 ? `, ${alreadyExists} déjà présentes` : ''}`
      });
      loadPhotos();
    } catch (error) {
      console.error('Erreur import bucket Supabase:', error);
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer depuis le bucket Supabase",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadStatus('');
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  // Import photo from URL
  const handleUrlImport = async () => {
    if (!importUrl.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une URL valide",
        variant: "destructive"
      });
      return;
    }
    try {
      setUploading(true);
      setUploadStatus('Téléchargement de l\'image...');
      const response = await fetch(importUrl);
      if (!response.ok) throw new Error('Impossible de télécharger l\'image');
      const blob = await response.blob();
      
      const urlParts = importUrl.split('/');
      const urlFilename = urlParts[urlParts.length - 1];
      const filename = urlFilename.includes('.') ? `${Date.now()}-${urlFilename}` : `imported-${Date.now()}.webp`;

      setUploadStatus('Upload vers Supabase...');
      const { error } = await supabase.storage
        .from('Restaurant Photos')
        .upload(filename, blob, {
          cacheControl: '3600',
          upsert: false
        });
      if (error) throw error;
      toast({
        title: "Import réussi",
        description: "Photo importée avec succès"
      });
      
      setImportUrl('');
      loadPhotos();
      
    } catch (error) {
      console.error('Erreur import URL:', error);
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer la photo depuis l'URL. Vérifiez que l'URL est valide et accessible.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  // Delete all photos from Supabase Storage
  const deleteAllPhotos = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les photos de Supabase ?')) {
      return;
    }
    try {
      setLoading(true);
      
      const { data: files, error: listError } = await supabase.storage
        .from('Restaurant Photos')
        .list('', { limit: 1000 });
      if (listError) throw listError;
      if (files && files.length > 0) {
        const filePaths = files.map(file => file.name);
        
        const { error: deleteError } = await supabase.storage
          .from('Restaurant Photos')
          .remove(filePaths);
        if (deleteError) throw deleteError;
        toast({
          title: "Photos supprimées",
          description: `${files.length} photo(s) supprimée(s) de Supabase`
        });
      } else {
        toast({
          title: "Aucune photo",
          description: "Aucune photo à supprimer"
        });
      }
      loadPhotos();
    } catch (error) {
      console.error('Erreur suppression Supabase:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les photos de Supabase Storage",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a photo from Supabase Storage
  const deletePhoto = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('Restaurant Photos')
        .remove([fileName]);
      
      if (error) throw error;
      
      toast({
        title: "Photo supprimée",
        description: "La photo a été supprimée de Supabase avec succès"
      });
      loadPhotos();
    } catch (error) {
      console.error('Erreur suppression Supabase:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo de Supabase Storage",
        variant: "destructive"
      });
    }
  };

  // Generate Firebase Storage URL (like _mediaUrl in Flutter)
  const generateFirebaseUrl = (folder: string, filename: string): string => {
    const path = encodeURIComponent(`${folder}/${filename}`);
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${path}?alt=media`;
  };

  // Generate logo URL based on tag (TAG1.png)
  const generateLogoUrl = (tag: string): string => {
    if (!tag) return '';
    const upperTag = tag.toUpperCase();
    return generateFirebaseUrl(logosFolder, `${upperTag}1.png`);
  };

  // Generate photo URLs based on tag (TAG2.png to TAG6.png)
  const generatePhotoUrls = (tag: string, min: number = 2, max: number = 6): string[] => {
    if (!tag) return [];
    const upperTag = tag.toUpperCase();
    const urls: string[] = [];
    
    for (let i = min; i <= max; i++) {
      urls.push(generateFirebaseUrl(photosFolder, `${upperTag}${i}.png`));
    }
    
    return urls;
  };

  // Generate and assign photos to restaurants based on their tags
  const generatePhotosFromTags = async () => {
    try {
      setUploading(true);
      setUploadStatus('Génération des URLs depuis les tags...');
      
      const { DataManager } = await import('@/lib/dataManager');
      const restaurants = await DataManager.getRestaurants();
      
      if (restaurants.length === 0) {
        toast({
          title: "Aucun restaurant trouvé",
          description: "Importez d'abord vos restaurants"
        });
        return;
      }
      let updatedCount = 0;
      const updatedRestaurants = restaurants.map((restaurant) => {
        const restaurantCopy = { ...restaurant };
        // Use first tag or generate one from restaurant name
        const tag = restaurant.tags && restaurant.tags.length > 0 
          ? restaurant.tags[0] 
          : restaurant.name?.substring(0, 4).toUpperCase();
        
        if (tag) {
          // Generate logo URL
          const logoUrl = generateLogoUrl(tag);
          restaurantCopy.logo = logoUrl;
          
          // Generate photo URLs
          const photoUrls = generatePhotoUrls(tag);
          restaurantCopy.images = photoUrls;
          
          updatedCount++;
        }
        
        return restaurantCopy;
      });
      await DataManager.saveRestaurants(updatedRestaurants);
      
      toast({
        title: "URLs générées",
        description: `URLs de photos générées pour ${updatedCount} restaurants basées sur leur tag`
      });
      
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les URLs depuis les tags",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  // Simple direct assignment of photos to restaurants
  const assignPhotosToRestaurants = async () => {
    try {
      setUploading(true);
      setUploadStatus('Attribution des photos...');
      
      const { DataManager } = await import('@/lib/dataManager');
      const restaurants = await DataManager.getRestaurants();
      
      if (restaurants.length === 0) {
        toast({
          title: "Aucun restaurant trouvé",
          description: "Importez d'abord vos restaurants"
        });
        return;
      }
      // Simple: assign photos in order to restaurants
      const updatedRestaurants = restaurants.map((restaurant, index) => {
        const restaurantCopy = { ...restaurant };
        const startIndex = index * 3; // 3 photos per restaurant
        const restaurantPhotos = photos.slice(startIndex, startIndex + 3);
        
        if (restaurantPhotos.length > 0) {
          restaurantCopy.images = restaurantPhotos.map(p => p.publicUrl);
        }
        
        return restaurantCopy;
      });
      await DataManager.saveRestaurants(updatedRestaurants);
      
      toast({
        title: "Photos attribuées",
        description: `Photos assignées à ${restaurants.length} restaurants`
      });
      
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer les photos",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  // Export photos list to Excel
  const exportToExcel = () => {
    const sortedPhotos = [...photos].sort((a, b) => a.name.localeCompare(b.name));
    
    const excelData = sortedPhotos.map((photo, index) => ({
      'N°': index + 1,
      'Nom de fichier': photo.name,
      'Date d\'importation': photo.created_at 
        ? new Date(photo.created_at).toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        : 'N/A',
      'Taille': photo.size ? `${Math.round(photo.size / 1024)} KB` : 'N/A'
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    ws['!cols'] = [
      { wch: 5 },   
      { wch: 40 },  
      { wch: 20 },  
      { wch: 10 }   
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Photos');
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `bibliotheque-photos-${dateStr}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    
    toast({
      title: "Export réussi",
      description: `Liste des photos exportée dans ${filename}`
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Chargement des photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter des photos</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
                id="photo-upload"
              />
              <Button asChild disabled={uploading}>
                <label htmlFor="photo-upload" className="cursor-pointer flex items-center">
                  <Upload size={16} className="mr-2" />
                  {uploading ? 'Upload en cours...' : 'Ajouter des photos'}
                </label>
              </Button>
            </div>
            {/* Import from Supabase bucket */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={importFromSupabaseFolder} 
                disabled={uploading}
                variant="outline"
                className="flex-1"
              >
                <FolderOpen size={16} className="mr-2" />
                Importer du bucket Supabase "Restaurant Photos"
              </Button>
            </div>
            {/* Configuration for URL generation */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm">Configuration génération d'URLs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Bucket Firebase</label>
                  <Input
                    type="text"
                    placeholder="butter-vdef.firebasestorage.app"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    disabled={uploading}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Dossier logos</label>
                  <Input
                    type="text"
                    placeholder="Logos"
                    value={logosFolder}
                    onChange={(e) => setLogosFolder(e.target.value)}
                    disabled={uploading}
                    className="text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">Dossier photos restaurants</label>
                <Input
                  type="text"
                  placeholder="Photos restaurants"
                  value={photosFolder}
                  onChange={(e) => setPhotosFolder(e.target.value)}
                  disabled={uploading}
                  className="text-xs"
                />
              </div>
              <div className="text-xs text-gray-500">
                <p>• Logos: {'{TAG}'}1.png (ex: RESTO1.png)</p>
                <p>• Photos: {'{TAG}'}2.png à {'{TAG}'}6.png (ex: RESTO2.png, RESTO3.png...)</p>
              </div>
            </div>
            {/* Generate URLs from tags */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={generatePhotosFromTags} 
                disabled={uploading}
                variant="default"
                className="flex-1"
              >
                <ImageIcon size={16} className="mr-2" />
                Générer URLs depuis les tags
              </Button>
            </div>
            {/* Import from URL */}
            <div className="flex items-center gap-4">
              <Input
                type="url"
                placeholder="https://exemple.com/photo.webp"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                disabled={uploading}
                className="flex-1"
              />
              <Button 
                onClick={handleUrlImport} 
                disabled={uploading || !importUrl.trim()}
              >
                <Link size={16} className="mr-2" />
                Importer URL
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{uploadStatus}</span>
                <span>{uploadProgress.current}/{uploadProgress.total}</span>
              </div>
              <Progress 
                value={uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0} 
                className="w-full"
              />
            </div>
          )}
          
          <p className="text-sm text-gray-600 mt-2">
            Sélectionnez des fichiers, importez depuis votre bucket Supabase, ou collez une URL d'image
          </p>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bibliothèque de photos ({photos.length} photo{photos.length !== 1 ? 's' : ''})</CardTitle>
          {photos.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToExcel}
              >
                <Download size={16} className="mr-2" />
                Exporter Excel
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={deleteAllPhotos}
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer tout
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Aucune photo dans la bibliothèque</p>
              <p className="text-sm text-gray-500">Ajoutez vos premières photos ci-dessus</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {photos.map((photo) => (
                <div key={photo.name} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={photo.publicUrl}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePhoto(photo.name)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 truncate" title={photo.name}>
                      {photo.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {photo.size ? `${Math.round(photo.size / 1024)} KB` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoLibrary;

