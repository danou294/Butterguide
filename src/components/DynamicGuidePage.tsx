import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OtherGuides from "@/components/OtherGuides";
import { DataManager } from "@/lib/dataManager";
import { Guide, Restaurant } from "@/types/admin";
import { ArrowLeft, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const DynamicGuidePage = () => {
  const { guideSlug } = useParams();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollToRestaurant = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Space for the fixed header plus some margin
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const loadGuideData = async () => {
      try {
        const publishedGuides = await DataManager.getPublishedGuides();
        const allRestaurants = await DataManager.getRestaurants();
        
        const foundGuide = publishedGuides.find(g => g.id === guideSlug);
        
        if (foundGuide) {
          setGuide(foundGuide);
          const guideRestaurants = allRestaurants.filter(r => 
            foundGuide.restaurants.includes(r.id)
          );
          setRestaurants(guideRestaurants);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du guide:', error);
      }
      
      setLoading(false);
    };
    
    loadGuideData();
  }, [guideSlug]);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div>Chargement...</div>
    </div>;
  }

  if (!guide) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div>Guide non trouvé</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link to="/guides" className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Retour aux guides
          </Link>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 uppercase">{guide.title}</h1>
            <p className="text-gray-600 max-w-4xl text-lg">
              {guide.description}
            </p>
          </div>

          {/* Restaurant cards in horizontal scroll - uniform size */}
          <div className="flex overflow-x-auto gap-4 pb-4 mb-12">
            {restaurants.map((restaurant, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-48 cursor-pointer"
                onClick={() => scrollToRestaurant(restaurant.id)}
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 h-80">
                  <div className="aspect-square bg-gray-200">
                    {restaurant.images[0] && restaurant.images[0].trim() !== '' ? (
                      <img 
                        src={restaurant.images[0]} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(restaurant.images[0])}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <div className="text-center">
                          <div className="text-gray-400 mb-2">📷</div>
                          <p className="text-gray-500 text-sm">Photo à venir</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 h-32 flex flex-col">
                    <h3 className="font-bold text-black mb-1 text-sm">{restaurant.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{restaurant.address}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                      {restaurant.description.length > 60 
                        ? `${restaurant.description.substring(0, 60)}...`
                        : restaurant.description
                      }
                    </p>
                    <p className="text-xs text-blue-600 mt-2">Plus d'infos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed sections in 2 columns */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
              {restaurants.map((restaurant, index) => (
                <div key={`detail-${index}`} id={restaurant.id} className="space-y-4">
                  <h3 className="text-xl font-bold text-black">{restaurant.name}</h3>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 underline hover:text-black transition-colors block"
                  >
                    {restaurant.address}
                  </a>
                  
                  {/* Photos layout: 1 main + 4 small in a 2x2 grid */}
                  <div className="flex gap-2">
                    {/* Main photo */}
                    <div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {restaurant.images[0] && restaurant.images[0].trim() !== '' ? (
                        <img 
                          src={restaurant.images[0]} 
                          alt={`${restaurant.name} main`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(restaurant.images[0])}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <div className="text-center">
                            <div className="text-gray-400 mb-2">📷</div>
                            <p className="text-gray-500 text-sm">Photo principale</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 4 small photos in 2x2 grid */}
                    <div className="grid grid-cols-2 gap-1 w-64 h-64">
                      {Array.from({length: 4}).map((_, imgIndex) => {
                        const imageUrl = restaurant.images[imgIndex + 1];
                        return (
                          <div key={imgIndex} className="bg-gray-200 rounded-lg overflow-hidden">
                            {imageUrl && imageUrl.trim() !== '' ? (
                              <img 
                                src={imageUrl} 
                                alt={`${restaurant.name} ${imgIndex + 2}`}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(imageUrl)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                <div className="text-gray-400 text-xs">📷</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    {restaurant.menuLink && (
                      <p>
                        <span className="font-semibold">Menu: </span>
                        <a 
                          href={restaurant.menuLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Voir le menu
                        </a>
                      </p>
                    )}
                    {restaurant.reservationLink && (
                      <p>
                        <span className="font-semibold">Réservation: </span>
                        <a 
                          href={restaurant.reservationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Réserver une table
                        </a>
                      </p>
                    )}
                    {restaurant.websiteLink && (
                      <p>
                        <span className="font-semibold">Site internet: </span>
                        <a 
                          href={restaurant.websiteLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visiter le site
                        </a>
                      </p>
                    )}
                    {restaurant.instagramHandle && (
                      <p>
                        <span className="font-semibold">Instagram: </span>
                        <a 
                          href={restaurant.instagramHandle} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          @{restaurant.instagramHandle.split('.com/')[1]?.replace(/\/$/, '') || restaurant.instagramHandle}
                        </a>
                      </p>
                    )}
                    {restaurant.phone && (
                      <p>
                        <span className="font-semibold">Téléphone: </span>
                        <a 
                          href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                          className="text-blue-600 hover:underline"
                        >
                          {restaurant.phone}
                        </a>
                      </p>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed text-sm">
                    {restaurant.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/90 border-0">
          <div className="relative flex items-center justify-center min-h-[50vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Image agrandie"
                className="max-w-full max-h-full object-contain"
                onClick={() => setSelectedImage(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <OtherGuides />
      <Footer />
    </div>
  );
};

export default DynamicGuidePage;

