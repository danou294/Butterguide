import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit, Download, Upload, Image, Globe, EyeOff } from "lucide-react";
import PhotoLibrary from "@/components/PhotoLibrary";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { DataManager } from "@/lib/dataManager";
import { Restaurant, Guide } from "@/types/admin";

const Admin = () => {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [publishedGuides, setPublishedGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
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

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 [LOAD DEBUG] Chargement des données depuis Supabase...');
        
        const loadedRestaurants = await DataManager.getRestaurants();
        console.log('✅ [LOAD SUCCESS] Restaurants chargés:', loadedRestaurants.length, loadedRestaurants);
        setRestaurants(loadedRestaurants);
        
        const loadedGuides = await DataManager.getGuides();
        console.log('✅ [LOAD SUCCESS] Guides chargés:', loadedGuides.length);
        setGuides(loadedGuides);
        
        const loadedPublishedGuides = await DataManager.getPublishedGuides();
        console.log('✅ [LOAD SUCCESS] Guides publiés chargés:', loadedPublishedGuides.length);
        setPublishedGuides(loadedPublishedGuides);
        
      } catch (error) {
        console.error('❌ [LOAD ERROR] Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data whenever state changes
  useEffect(() => {
    if (restaurants.length > 0) {
      console.log('🔄 [SAVE DEBUG] Sauvegarde de', restaurants.length, 'restaurants dans Supabase...');
      DataManager.saveRestaurants(restaurants).then(() => {
        console.log('✅ [SAVE SUCCESS] Restaurants sauvegardés avec succès');
      }).catch((error) => {
        console.error('❌ [SAVE ERROR] Erreur lors de la sauvegarde des restaurants:', error);
      });
    }
  }, [restaurants]);

  useEffect(() => {
    if (guides.length > 0) {
      console.log('🔄 [SAVE DEBUG] Sauvegarde de', guides.length, 'guides dans Supabase...');
      DataManager.saveGuides(guides).then(() => {
        console.log('✅ [SAVE SUCCESS] Guides sauvegardés avec succès');
      }).catch((error) => {
        console.error('❌ [SAVE ERROR] Erreur lors de la sauvegarde des guides:', error);
      });
    }
  }, [guides]);

  const publishGuide = async (guideId: string) => {
    try {
      console.log('🔴 [PUBLISH DEBUG] Début publication du guide:', guideId);
      
      // Vérifier que le guide existe
      const guide = guides.find(g => g.id === guideId);
      if (!guide) {
        console.error('🔴 [PUBLISH ERROR] Guide non trouvé:', guideId);
        toast({
          title: "Erreur",
          description: "Guide non trouvé",
          variant: "destructive"
        });
        return;
      }
      
      console.log('🔴 [PUBLISH DEBUG] Guide trouvé:', guide.title);
      console.log('🔴 [PUBLISH DEBUG] Appel DataManager.publishGuide...');
      
      await DataManager.publishGuide(guideId);
      
      console.log('🔴 [PUBLISH DEBUG] Publication réussie, récupération des guides publiés...');
      const updatedPublishedGuides = await DataManager.getPublishedGuides();
      console.log('🔴 [PUBLISH DEBUG] Guides publiés récupérés:', updatedPublishedGuides.length);
      
      setPublishedGuides(updatedPublishedGuides);
      
      console.log('🔴 [PUBLISH SUCCESS] Guide publié avec succès!');
      toast({
        title: "Guide publié",
        description: `"${guide.title}" est maintenant visible sur le site`
      });
      
    } catch (error) {
      console.error('🔴 [PUBLISH ERROR] Erreur lors de la publication:', error);
      toast({
        title: "Erreur de publication",
        description: `Impossible de publier le guide: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    }
  };

  const unpublishGuide = async (guideId: string) => {
    try {
      console.log('🟠 [UNPUBLISH DEBUG] Début dépublication du guide:', guideId);
      
      const guide = guides.find(g => g.id === guideId);
      if (!guide) {
        console.error('🟠 [UNPUBLISH ERROR] Guide non trouvé:', guideId);
        toast({
          title: "Erreur",
          description: "Guide non trouvé",
          variant: "destructive"
        });
        return;
      }
      
      console.log('🟠 [UNPUBLISH DEBUG] Guide trouvé:', guide.title);
      console.log('🟠 [UNPUBLISH DEBUG] Appel DataManager.unpublishGuide...');
      
      await DataManager.unpublishGuide(guideId);
      
      console.log('🟠 [UNPUBLISH DEBUG] Dépublication réussie, récupération des guides publiés...');
      const updatedPublishedGuides = await DataManager.getPublishedGuides();
      console.log('🟠 [UNPUBLISH DEBUG] Guides publiés récupérés:', updatedPublishedGuides.length);
      
      setPublishedGuides(updatedPublishedGuides);
      
      console.log('🟠 [UNPUBLISH SUCCESS] Guide dépublié avec succès!');
      toast({
        title: "Guide dépublié",
        description: `"${guide.title}" n'est plus visible sur le site`
      });
      
    } catch (error) {
      console.error('🟠 [UNPUBLISH ERROR] Erreur lors de la dépublication:', error);
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

  // Template Excel generation
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

  // Import Excel functionality
  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📄 [EXCEL IMPORT] Début import du fichier:', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log('📄 [EXCEL IMPORT] Lecture du fichier...');
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('📄 [EXCEL IMPORT] Données Excel lues:', jsonData.length, 'lignes');
        console.log('📄 [EXCEL IMPORT] Exemple de données:', jsonData[0]);

        const importedRestaurants = jsonData.map((row: any) => ({
          id: crypto.randomUUID(), // UUID valide au lieu du nom transformé
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

        console.log('📄 [EXCEL IMPORT] Restaurants préparés:', importedRestaurants.length);
        
        const updatedRestaurants = [...restaurants, ...importedRestaurants];
        setRestaurants(updatedRestaurants);
        
        // Sauvegarder automatiquement après l'import
        console.log('💾 [AUTO SAVE] Sauvegarde automatique après import...');
        DataManager.saveRestaurants(updatedRestaurants)
          .then(() => {
            console.log('💾 [AUTO SAVE] Sauvegarde réussie');
          })
          .catch((saveError) => {
            console.error('🔴 [AUTO SAVE ERROR]', saveError);
          });
        
        toast({
          title: "Import réussi",
          description: `${importedRestaurants.length} restaurants importés et sauvegardés`
        });
      } catch (error) {
        console.error('📄 [EXCEL IMPORT ERROR] Erreur lors de l\'import:', error);
        toast({
          title: "Erreur d'import",
          description: "Impossible d'importer le fichier Excel",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Régénération automatique des images basées sur les tags
  const handleRegenerateImages = async () => {
    try {
      toast({
        title: "Régénération en cours...",
        description: "Génération des URLs d'images basées sur les tags Firebase"
      });
      
      await DataManager.regenerateAllImages();
      
      // Recharger les restaurants pour voir les nouvelles images
      const updatedRestaurants = await DataManager.getRestaurants();
      setRestaurants(updatedRestaurants);
      
      toast({
        title: "Images régénérées",
        description: "Toutes les images ont été générées automatiquement basées sur les tags"
      });
    } catch (error) {
      console.error('Erreur lors de la régénération des images:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de régénérer les images"
      });
    }
  };
  const handleBulkPhotoImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let successCount = 0;
    let totalFiles = 0;

    toast({
      title: "Upload en cours...",
      description: "Importation des photos vers Supabase Storage"
    });

    for (const file of Array.from(files)) {
      const fileName = file.name.split('.')[0];
      
      const match = fileName.match(/^([A-Z]+)(\d+)$/);
      if (!match) {
        console.warn(`Format de nom de fichier invalide: ${file.name}. Format attendu: TAG2, TAG3, etc.`);
        continue;
      }
      
      const [, tag, numberStr] = match;
      const number = parseInt(numberStr, 10);
      
      const restaurant = restaurants.find(r => 
        r.tags.some(restaurantTag => restaurantTag.toUpperCase() === tag.toUpperCase())
      );
      
      if (!restaurant) {
        console.warn(`Aucun restaurant trouvé avec le tag: ${tag}`);
        continue;
      }

      if (number < 2 || number > 6) {
        console.warn(`Numéro de photo invalide: ${number}. Utilisez 2, 3, 4, 5 ou 6`);
        continue;
      }

      totalFiles++;

      try {
        // Upload vers Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${restaurant.id}_${number}.${fileExt}`;
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('bucket', 'restaurant-photos');
        
        const response = await fetch('/functions/v1/upload-photo', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { publicUrl } = await response.json();
          const photoIndex = number - 2;
          
          const updatedRestaurants = restaurants.map(r => {
            if (r.id === restaurant.id) {
              const newImages = [...r.images];
              newImages[photoIndex] = publicUrl;
              return { ...r, images: newImages };
            }
            return r;
          });
          
          setRestaurants(updatedRestaurants);
          successCount++;
        } else {
          console.error(`Erreur upload: ${file.name}`);
        }
      } catch (error) {
        console.error(`Erreur upload ${file.name}:`, error);
      }
    }

    if (successCount > 0) {
      toast({
        title: "Import des photos réussi",
        description: `${successCount}/${totalFiles} photos importées et assignées automatiquement`
      });
    } else {
      toast({
        title: "Erreur d'import",
        description: "Aucune photo n'a pu être assignée. Vérifiez les noms de fichiers et les tags des restaurants.",
        variant: "destructive"
      });
    }
  };

  const handleSaveRestaurant = () => {
    if (selectedRestaurant) {
      setRestaurants(restaurants.map(r => r.id === selectedRestaurant.id ? newRestaurant : r));
    } else {
      const id = crypto.randomUUID(); // Génère un UUID valide au lieu d'utiliser le nom
      setRestaurants([...restaurants, { ...newRestaurant, id }]);
    }
    resetRestaurantForm();
  };

  const handleSaveGuide = () => {
    if (selectedGuide) {
      setGuides(guides.map(g => g.id === selectedGuide.id ? newGuide : g));
    } else {
      const id = crypto.randomUUID(); // Génère un UUID valide au lieu d'utiliser le titre
      setGuides([...guides, { ...newGuide, id }]);
    }
    resetGuideForm();
  };

  const resetRestaurantForm = () => {
    setNewRestaurant({
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
    setSelectedRestaurant(null);
  };

  const resetGuideForm = () => {
    setNewGuide({
      id: '',
      title: '',
      description: '',
      restaurants: [],
      coverImage: ''
    });
    setSelectedGuide(null);
  };

  const editRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setNewRestaurant(restaurant);
  };

  const editGuide = (guide: Guide) => {
    console.log('🔧 [EDIT GUIDE] Début édition du guide:', guide.title, guide);
    setSelectedGuide(guide);
    setNewGuide(guide);
    console.log('🔧 [EDIT GUIDE] Guide sélectionné et formulaire rempli');
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
      setNewRestaurant({
        ...newRestaurant,
        tags: [...newRestaurant.tags, newTag]
      });
      tagInput.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewRestaurant({
      ...newRestaurant,
      tags: newRestaurant.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black mb-8">Back-Office - Gestion des Guides</h1>
          
          <Tabs defaultValue="restaurants" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="photos">Bibliothèque Photos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="restaurants" className="space-y-6">
              {/* Import Excel Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Excel & Photos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Excel Import */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Import de restaurants</h3>
                      <div className="flex flex-col gap-4">
                        <Button onClick={generateExcelTemplate} variant="outline">
                          <Download size={16} className="mr-2" />
                          Télécharger le template Excel
                        </Button>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleExcelImport}
                            className="hidden"
                            id="excel-import"
                          />
                          <Button asChild variant="default">
                            <label htmlFor="excel-import" className="cursor-pointer flex items-center">
                              <Upload size={16} className="mr-2" />
                              Importer depuis Excel
                            </label>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Téléchargez le template, remplissez-le avec vos données (y compris le tag), puis importez-le.
                      </p>
                    </div>

                    {/* Bulk Photo Import */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Import de photos en lot</h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleBulkPhotoImport}
                            className="hidden"
                            id="bulk-photo-import"
                          />
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

                    {/* Auto-generate Images */}
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
                            setRestaurants(updatedRestaurants);
                            toast({
                              title: "Format harmonisé",
                              description: "Tous les restaurants ont été harmonisés selon le format d'Aujourd'hui Demain"
                            });
                          } catch (error) {
                            toast({
                              variant: "destructive",
                              title: "Erreur",
                              description: "Impossible d'harmoniser le format des restaurants"
                            });
                          }
                        }} variant="outline">
                          <Globe size={16} className="mr-2" />
                          Harmoniser le format
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Génère automatiquement les URLs des images Firebase basées sur les tags des restaurants.
                        <br />
                        Format: TAG1.png (logo), TAG2-6.png (photos)
                        <br />
                        <strong>Harmoniser:</strong> Uniforme les liens Instagram, sites web et numéros de téléphone selon le format d'Aujourd'hui Demain.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Restaurant Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedRestaurant ? 'Modifier' : 'Ajouter'} un restaurant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom du restaurant</Label>
                      <Input
                        id="name"
                        value={newRestaurant.name}
                        onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                        placeholder="Ex: DAME"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={newRestaurant.address}
                        onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                        placeholder="Ex: 38 rue Condorcet, 75009"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Biographie</Label>
                    <Textarea
                      id="description"
                      value={newRestaurant.description}
                      onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})}
                      placeholder="Description du restaurant..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={newRestaurant.phone}
                        onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
                        placeholder="01 56 46 73 88"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram (pseudo)</Label>
                      <Input
                        id="instagram"
                        value={newRestaurant.instagramHandle}
                        onChange={(e) => setNewRestaurant({...newRestaurant, instagramHandle: e.target.value})}
                        placeholder="dame_restaurant"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="menu">Lien Menu</Label>
                      <Input
                        id="menu"
                        value={newRestaurant.menuLink}
                        onChange={(e) => setNewRestaurant({...newRestaurant, menuLink: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="reservation">Lien Réservation</Label>
                      <Input
                        id="reservation"
                        value={newRestaurant.reservationLink}
                        onChange={(e) => setNewRestaurant({...newRestaurant, reservationLink: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Site Web</Label>
                      <Input
                        id="website"
                        value={newRestaurant.websiteLink}
                        onChange={(e) => setNewRestaurant({...newRestaurant, websiteLink: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div>
                    <Label>Tags du restaurant</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="new-tag"
                        placeholder="Ajouter un tag (ex: DAM)"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newRestaurant.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Les tags permettent l'attribution automatique des photos.
                      Ex: pour le tag "DAM", nommez vos photos DAM2, DAM3, DAM4, etc.
                    </p>
                  </div>
                  
                  <div>
                    <Label>Photos (5 images)</Label>
                    <div className="grid grid-cols-5 gap-4">
                      {newRestaurant.images.map((image, index) => (
                        <div key={index}>
                          <Label className="text-xs mb-2 block">
                            Photo {index + 1}
                          </Label>
                          <FileUpload
                            currentUrl={image}
                            onUpload={(url) => updateRestaurantImage(index, url)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveRestaurant}>
                      {selectedRestaurant ? 'Modifier' : 'Ajouter'} le restaurant
                    </Button>
                    {selectedRestaurant && (
                      <Button variant="outline" onClick={resetRestaurantForm}>
                        Annuler
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Restaurant List */}
              <Card>
                <CardHeader>
                  <CardTitle>Liste des restaurants ({restaurants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {restaurants.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Aucun restaurant trouvé. Importez d'abord un fichier Excel ou ajoutez des restaurants manuellement.
                    </p>
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
                                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Image size={14} className="text-gray-500" />
                              <span className={`text-xs px-2 py-1 rounded ${
                                restaurant.images.filter(img => img !== '').length > 0 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {restaurant.images.filter(img => img !== '').length}/5 photos
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editRestaurant(restaurant)}>
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteRestaurant(restaurant.id)}>
                            <Trash2 size={16} />
                          </Button>
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
                    <Input
                      id="guide-title"
                      value={newGuide.title}
                      onChange={(e) => setNewGuide({...newGuide, title: e.target.value})}
                      placeholder="Ex: MANGER AU COMPTOIR"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guide-description">Description du guide</Label>
                    <Textarea
                      id="guide-description"
                      value={newGuide.description}
                      onChange={(e) => setNewGuide({...newGuide, description: e.target.value})}
                      placeholder="Description du guide..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guide-cover-image">Photo de couverture</Label>
                    <Input
                      id="guide-cover-image"
                      value={newGuide.coverImage || ''}
                      onChange={(e) => setNewGuide({...newGuide, coverImage: e.target.value})}
                      placeholder="Ex: comptoir.webp"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nom de la photo présente dans la base de données
                    </p>
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
                        <div className="text-center py-4 text-sm text-gray-500">
                          Aucun restaurant disponible
                        </div>
                      ) : (
                        restaurants
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((restaurant) => (
                          <label key={restaurant.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newGuide.restaurants.includes(restaurant.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGuide({
                                    ...newGuide,
                                    restaurants: [...newGuide.restaurants, restaurant.id]
                                  });
                                } else {
                                  setNewGuide({
                                    ...newGuide,
                                    restaurants: newGuide.restaurants.filter(id => id !== restaurant.id)
                                  });
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
                    <Button onClick={handleSaveGuide}>
                      {selectedGuide ? 'Modifier' : 'Créer'} le guide
                    </Button>
                    {selectedGuide && (
                      <Button variant="outline" onClick={resetGuideForm}>
                        Annuler
                      </Button>
                    )}
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
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Publié
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {isGuidePublished(guide.id) ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                console.log('🔘 [BUTTON CLICK] Bouton Dépublier cliqué pour le guide:', guide.id, guide.title);
                                unpublishGuide(guide.id);
                              }}
                            >
                              <EyeOff size={16} className="mr-1" />
                              Dépublier
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                console.log('🔘 [BUTTON CLICK] Bouton Publier cliqué pour le guide:', guide.id, guide.title);
                                publishGuide(guide.id);
                              }}
                            >
                              <Globe size={16} className="mr-1" />
                              Publier
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => {
                            console.log('🔘 [BUTTON CLICK] Bouton Modifier cliqué pour le guide:', guide.id, guide.title);
                            editGuide(guide);
                          }}>
                            <Edit size={16} className="mr-1" />
                            Modifier
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

