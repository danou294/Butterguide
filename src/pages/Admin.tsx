import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit, Download, Upload, Image, Globe, EyeOff, LogOut } from "lucide-react";
import PhotoLibrary from "@/components/PhotoLibrary";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { DataManager } from "@/lib/dataManager";
import { Restaurant, Guide } from "@/types/admin";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [publishedGuides, setPublishedGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const isInitialLoad = useRef(true);
  const [newRestaurant, setNewRestaurant] = useState<Restaurant>({
    id: '',
    name: '',
    address: '',
    description: '',
    phone: '',
    menuLink: '',
    reservationLink: '',
    websiteLink: '',
    instagramHandle: '',
    images: ['', '', '', '', ''],
    tags: []
  });
  const [newGuide, setNewGuide] = useState<Guide>({
    id: '',
    title: '',
    description: '',
    restaurants: [],
    coverImage: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const loadedRestaurants = await DataManager.getRestaurants();
        setRestaurants(loadedRestaurants);
        const loadedGuides = await DataManager.getGuides();
        setGuides(loadedGuides);
        const loadedPublishedGuides = await DataManager.getPublishedGuides();
        setPublishedGuides(loadedPublishedGuides);
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
        // Mark initial load as done after a tick so the auto-save effects skip
        setTimeout(() => { isInitialLoad.current = false; }, 100);
      }
    };
    loadData();
  }, []);

  // Auto-save restaurants (skip initial load)
  useEffect(() => {
    if (isInitialLoad.current || restaurants.length === 0) return;
    DataManager.saveRestaurants(restaurants).catch(() => {
      toast({ title: "Erreur de sauvegarde", description: "Impossible de sauvegarder les restaurants", variant: "destructive" });
    });
  }, [restaurants]);

  // Auto-save guides (skip initial load)
  useEffect(() => {
    if (isInitialLoad.current || guides.length === 0) return;
    DataManager.saveGuides(guides).catch(() => {
      toast({ title: "Erreur de sauvegarde", description: "Impossible de sauvegarder les guides", variant: "destructive" });
    });
  }, [guides]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      toast({ title: "Erreur", description: "Impossible de se déconnecter", variant: "destructive" });
    }
  };

  const publishGuide = async (guideId: string) => {
    try {
      const guide = guides.find(g => g.id === guideId);
      if (!guide) {
        toast({ title: "Erreur", description: "Guide non trouvé", variant: "destructive" });
        return;
      }

      await DataManager.publishGuide(guideId);
      const updatedPublishedGuides = await DataManager.getPublishedGuides();
      setPublishedGuides(updatedPublishedGuides);

      toast({ title: "Guide publié", description: `"${guide.title}" est maintenant visible sur le site` });
    } catch (error) {
      toast({
        title: "Erreur de publication",
        description: `Impossible de publier le guide: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    }
  };

  const unpublishGuide = async (guideId: string) => {
    try {
      const guide = guides.find(g => g.id === guideId);
      if (!guide) {
        toast({ title: "Erreur", description: "Guide non trouvé", variant: "destructive" });
        return;
      }

      await DataManager.unpublishGuide(guideId);
      const updatedPublishedGuides = await DataManager.getPublishedGuides();
      setPublishedGuides(updatedPublishedGuides);

      toast({ title: "Guide dépublié", description: `"${guide.title}" n'est plus visible sur le site` });
    } catch (error) {
      toast({
        title: "Erreur de dépublication",
        description: `Impossible de dépublier le guide: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    }
  };

  const isGuidePublished = (guideId: string) => {
    return publishedGuides.some(pg => pg.id === guideId);
  };

  const generateExcelTemplate = () => {
    const template = [
      {
        name: 'DAME',
        address: '38 rue Condorcet, 75009',
        description: 'Restaurant moderne avec une cuisine créative...',
        phone: '01 56 46 73 88',
        menuLink: 'https://exemple.com/menu',
        reservationLink: 'https://exemple.com/reservation',
        websiteLink: 'https://exemple.com',
        instagramHandle: 'dame_restaurant',
        tag: 'DAM'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Restaurants');
    XLSX.writeFile(wb, 'template_restaurants.xlsx');
  };

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedRestaurants = jsonData.map((row: any) => ({
          id: crypto.randomUUID(),
          name: row.name || '',
          address: row.address || '',
          description: row.description || '',
          phone: row.phone || '',
          menuLink: row.menuLink || '',
          reservationLink: row.reservationLink || '',
          websiteLink: row.websiteLink || '',
          instagramHandle: row.instagramHandle || '',
          images: ['', '', '', '', ''],
          tags: row.tag ? [row.tag] : []
        }));

        setRestaurants(prev => [...prev, ...importedRestaurants]);

        toast({
          title: "Import réussi",
          description: `${importedRestaurants.length} restaurants importés`
        });
      } catch {
        toast({
          title: "Erreur d'import",
          description: "Impossible d'importer le fichier Excel",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleRegenerateImages = async () => {
    try {
      toast({ title: "Régénération en cours...", description: "Génération des URLs d'images basées sur les tags Firebase" });
      await DataManager.regenerateAllImages();
      const updatedRestaurants = await DataManager.getRestaurants();
      isInitialLoad.current = true;
      setRestaurants(updatedRestaurants);
      setTimeout(() => { isInitialLoad.current = false; }, 100);
      toast({ title: "Images régénérées", description: "Toutes les images ont été générées automatiquement basées sur les tags" });
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de régénérer les images" });
    }
  };

  const handleBulkPhotoImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let successCount = 0;
    let totalFiles = 0;

    toast({ title: "Upload en cours...", description: "Importation des photos vers Supabase Storage" });

    for (const file of Array.from(files)) {
      const baseName = file.name.split('.')[0];
      const match = baseName.match(/^([A-Z]+)(\d+)$/);
      if (!match) continue;

      const [, tag, numberStr] = match;
      const number = parseInt(numberStr, 10);

      const restaurant = restaurants.find(r =>
        r.tags.some(restaurantTag => restaurantTag.toUpperCase() === tag.toUpperCase())
      );
      if (!restaurant) continue;
      if (number < 2 || number > 6) continue;

      totalFiles++;

      try {
        const fileExt = file.name.split('.').pop();
        const uploadName = `${restaurant.id}_${number}.${fileExt}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', uploadName);
        formData.append('bucket', 'restaurant-photos');

        const response = await fetch('/functions/v1/upload-photo', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { publicUrl } = await response.json();
          const photoIndex = number - 2;

          setRestaurants(prev => prev.map(r => {
            if (r.id === restaurant.id) {
              const newImages = [...r.images];
              newImages[photoIndex] = publicUrl;
              return { ...r, images: newImages };
            }
            return r;
          }));
          successCount++;
        }
      } catch {
        // Skip failed uploads
      }
    }

    if (successCount > 0) {
      toast({ title: "Import des photos réussi", description: `${successCount}/${totalFiles} photos importées` });
    } else {
      toast({ title: "Erreur d'import", description: "Aucune photo n'a pu être assignée.", variant: "destructive" });
    }
  };

  const handleSaveRestaurant = () => {
    if (selectedRestaurant) {
      setRestaurants(restaurants.map(r => r.id === selectedRestaurant.id ? newRestaurant : r));
    } else {
      const id = crypto.randomUUID();
      setRestaurants([...restaurants, { ...newRestaurant, id }]);
    }
    resetRestaurantForm();
  };

  const handleSaveGuide = () => {
    if (selectedGuide) {
      setGuides(guides.map(g => g.id === selectedGuide.id ? newGuide : g));
    } else {
      const id = crypto.randomUUID();
      setGuides([...guides, { ...newGuide, id }]);
    }
    resetGuideForm();
  };

  const resetRestaurantForm = () => {
    setNewRestaurant({
      id: '', name: '', address: '', description: '', phone: '',
      menuLink: '', reservationLink: '', websiteLink: '', instagramHandle: '',
      images: ['', '', '', '', ''], tags: []
    });
    setSelectedRestaurant(null);
  };

  const resetGuideForm = () => {
    setNewGuide({ id: '', title: '', description: '', restaurants: [], coverImage: '' });
    setSelectedGuide(null);
  };

  const editRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setNewRestaurant(restaurant);
  };

  const editGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setNewGuide(guide);
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  const deleteGuide = (id: string) => {
    setGuides(guides.filter(g => g.id !== id));
  };

  const updateRestaurantImage = (index: number, url: string) => {
    const newImages = [...newRestaurant.images];
    newImages[index] = url;
    setNewRestaurant({...newRestaurant, images: newImages});
  };

  const addTag = () => {
    const tagInput = document.getElementById('new-tag') as HTMLInputElement;
    const newTag = tagInput.value.trim().toUpperCase();
    if (newTag && !newRestaurant.tags.includes(newTag)) {
      setNewRestaurant({ ...newRestaurant, tags: [...newRestaurant.tags, newTag] });
      tagInput.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewRestaurant({ ...newRestaurant, tags: newRestaurant.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-black">Back-Office - Gestion des Guides</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Déconnexion
            </Button>
          </div>

          <Tabs defaultValue="restaurants" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="photos">Bibliothèque Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="restaurants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Import Excel & Photos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Import de restaurants</h3>
                      <div className="flex flex-col gap-4">
                        <Button onClick={generateExcelTemplate} variant="outline">
                          <Download size={16} className="mr-2" />
                          Télécharger le template Excel
                        </Button>
                        <div className="flex items-center gap-2">
                          <Input type="file" accept=".xlsx,.xls" onChange={handleExcelImport} className="hidden" id="excel-import" />
                          <Button asChild variant="default">
                            <label htmlFor="excel-import" className="cursor-pointer flex items-center">
                              <Upload size={16} className="mr-2" />
                              Importer depuis Excel
                            </label>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Téléchargez le template, remplissez-le avec vos données (y compris le tag), puis importez-le.</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Import de photos en lot</h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <Input type="file" accept="image/*" multiple onChange={handleBulkPhotoImport} className="hidden" id="bulk-photo-import" />
                          <Button asChild variant="default">
                            <label htmlFor="bulk-photo-import" className="cursor-pointer flex items-center">
                              <Image size={16} className="mr-2" />
                              Importer des photos
                            </label>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Nommez vos photos : TAG2 pour la 1ère photo, TAG3 pour la 2ème, etc.
                        (ex: "DAM2.webp", "DAM3.webp", "DAM4.webp", "DAM5.webp", "DAM6.webp")
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Génération automatique</h3>
                      <div className="flex flex-col gap-4">
                        <Button onClick={handleRegenerateImages} variant="secondary">
                          <Image size={16} className="mr-2" />
                          Régénérer les images
                        </Button>
                        <Button onClick={async () => {
                          try {
                            await DataManager.harmonizeRestaurantsFormat();
                            const updatedRestaurants = await DataManager.getRestaurants();
                            isInitialLoad.current = true;
                            setRestaurants(updatedRestaurants);
                            setTimeout(() => { isInitialLoad.current = false; }, 100);
                            toast({ title: "Format harmonisé", description: "Tous les restaurants ont été harmonisés" });
                          } catch {
                            toast({ variant: "destructive", title: "Erreur", description: "Impossible d'harmoniser le format" });
                          }
                        }} variant="outline">
                          <Globe size={16} className="mr-2" />
                          Harmoniser le format
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Génère automatiquement les URLs des images Firebase basées sur les tags des restaurants.
                        <br />Format: TAG1.png (logo), TAG2-6.png (photos)
                        <br /><strong>Harmoniser:</strong> Uniforme les liens Instagram, sites web et numéros de téléphone.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{selectedRestaurant ? 'Modifier' : 'Ajouter'} un restaurant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom du restaurant</Label>
                      <Input id="name" value={newRestaurant.name} onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})} placeholder="Ex: DAME" />
                    </div>
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" value={newRestaurant.address} onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})} placeholder="Ex: 38 rue Condorcet, 75009" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Biographie</Label>
                    <Textarea id="description" value={newRestaurant.description} onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})} placeholder="Description du restaurant..." rows={3} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" value={newRestaurant.phone} onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})} placeholder="01 56 46 73 88" />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram (pseudo)</Label>
                      <Input id="instagram" value={newRestaurant.instagramHandle} onChange={(e) => setNewRestaurant({...newRestaurant, instagramHandle: e.target.value})} placeholder="dame_restaurant" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="menu">Lien Menu</Label>
                      <Input id="menu" value={newRestaurant.menuLink} onChange={(e) => setNewRestaurant({...newRestaurant, menuLink: e.target.value})} placeholder="https://..." />
                    </div>
                    <div>
                      <Label htmlFor="reservation">Lien Réservation</Label>
                      <Input id="reservation" value={newRestaurant.reservationLink} onChange={(e) => setNewRestaurant({...newRestaurant, reservationLink: e.target.value})} placeholder="https://..." />
                    </div>
                    <div>
                      <Label htmlFor="website">Site Web</Label>
                      <Input id="website" value={newRestaurant.websiteLink} onChange={(e) => setNewRestaurant({...newRestaurant, websiteLink: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>

                  <div>
                    <Label>Tags du restaurant</Label>
                    <div className="flex gap-2 mb-2">
                      <Input id="new-tag" placeholder="Ajouter un tag (ex: DAM)" onKeyPress={(e) => e.key === 'Enter' && addTag()} />
                      <Button type="button" onClick={addTag} size="sm"><Plus size={16} /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newRestaurant.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="text-blue-600 hover:text-blue-800">&times;</button>
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Les tags permettent l'attribution automatique des photos. Ex: pour le tag "DAM", nommez vos photos DAM2, DAM3, DAM4, etc.</p>
                  </div>

                  <div>
                    <Label>Photos (5 images)</Label>
                    <div className="grid grid-cols-5 gap-4">
                      {newRestaurant.images.map((image, index) => (
                        <div key={index}>
                          <Label className="text-xs mb-2 block">Photo {index + 1}</Label>
                          <FileUpload currentUrl={image} onUpload={(url) => updateRestaurantImage(index, url)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveRestaurant}>{selectedRestaurant ? 'Modifier' : 'Ajouter'} le restaurant</Button>
                    {selectedRestaurant && <Button variant="outline" onClick={resetRestaurantForm}>Annuler</Button>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des restaurants ({restaurants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {restaurants.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Aucun restaurant trouvé. Importez d'abord un fichier Excel ou ajoutez des restaurants manuellement.</p>
                  ) : (
                    <div className="space-y-2">
                      {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{restaurant.name}</h4>
                            <p className="text-sm text-gray-600">{restaurant.address}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {restaurant.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {restaurant.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{tag}</span>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Image size={14} className="text-gray-500" />
                                <span className={`text-xs px-2 py-1 rounded ${restaurant.images.filter(img => img !== '').length > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {restaurant.images.filter(img => img !== '').length}/5 photos
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editRestaurant(restaurant)}><Edit size={16} /></Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteRestaurant(restaurant.id)}><Trash2 size={16} /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedGuide ? 'Modifier' : 'Créer'} un guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="guide-title">Titre du guide</Label>
                    <Input id="guide-title" value={newGuide.title} onChange={(e) => setNewGuide({...newGuide, title: e.target.value})} placeholder="Ex: MANGER AU COMPTOIR" />
                  </div>

                  <div>
                    <Label htmlFor="guide-description">Description du guide</Label>
                    <Textarea id="guide-description" value={newGuide.description} onChange={(e) => setNewGuide({...newGuide, description: e.target.value})} placeholder="Description du guide..." rows={3} />
                  </div>

                  <div>
                    <Label htmlFor="guide-cover-image">Photo de couverture</Label>
                    <Input id="guide-cover-image" value={newGuide.coverImage || ''} onChange={(e) => setNewGuide({...newGuide, coverImage: e.target.value})} placeholder="Ex: comptoir.webp" />
                    <p className="text-xs text-gray-500 mt-1">Nom de la photo présente dans la base de données</p>
                  </div>

                  <div>
                    <Label>Sélectionner les restaurants</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                      {loading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          <span className="ml-2 text-sm text-gray-600">Chargement des restaurants...</span>
                        </div>
                      ) : restaurants.length === 0 ? (
                        <div className="text-center py-4 text-sm text-gray-500">Aucun restaurant disponible</div>
                      ) : (
                        restaurants.sort((a, b) => a.name.localeCompare(b.name)).map((restaurant) => (
                          <label key={restaurant.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newGuide.restaurants.includes(restaurant.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGuide({ ...newGuide, restaurants: [...newGuide.restaurants, restaurant.id] });
                                } else {
                                  setNewGuide({ ...newGuide, restaurants: newGuide.restaurants.filter(id => id !== restaurant.id) });
                                }
                              }}
                            />
                            <span className="text-sm">{restaurant.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveGuide}>{selectedGuide ? 'Modifier' : 'Créer'} le guide</Button>
                    {selectedGuide && <Button variant="outline" onClick={resetGuideForm}>Annuler</Button>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guides.map((guide) => (
                      <div key={guide.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{guide.title}</h4>
                          <p className="text-sm text-gray-600">{guide.restaurants.length} restaurants</p>
                          {isGuidePublished(guide.id) && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Publié</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {isGuidePublished(guide.id) ? (
                            <Button size="sm" variant="outline" onClick={() => unpublishGuide(guide.id)}>
                              <EyeOff size={16} className="mr-1" />Dépublier
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => publishGuide(guide.id)}>
                              <Globe size={16} className="mr-1" />Publier
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => editGuide(guide)}>
                            <Edit size={16} className="mr-1" />Modifier
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteGuide(guide.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <PhotoLibrary />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
