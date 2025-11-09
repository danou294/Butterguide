import Navigation from "@/components/Navigation";

import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const restaurants = [
  {
    id: "dame",
    name: "DAME",
    address: "38 rue Condorcet, 75009",
    description: "Cuisine de saison à partager qui du Chef Matthew Caminoro, précédemment en flaveurs et à la tête de Bonhomme. Décor rétro des années 70, veggies, grande sélection de vins. Combo parfait pour une atmosphère conviviale et intimiste à la fois.",
    phone: "01 56 46 73 88",
    menu: "https://example.com/menu-dame",
    reservation: "https://example.com/reservation-dame",
    website: "https://example.com/dame",
    instagram: "dame_restaurant",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    id: "bistrot-paul-bert",
    name: "BISTROT PAUL BERT",
    address: "18 rue Paul Bert, 75011", 
    description: "Bistrot parisien authentique avec une cuisine traditionnelle française. Ambiance vintage et chaleureuse, parfait pour une soirée au comptoir.",
    phone: "01 43 72 24 01",
    menu: "https://example.com/menu-paul-bert",
    reservation: "https://example.com/reservation-paul-bert",
    website: "https://example.com/paul-bert",
    instagram: "bistrotpaulbert",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    id: "frenchie-bar",
    name: "FRENCHIE BAR À VINS",
    address: "6 rue du Nil, 75002",
    description: "Bar à vins moderne du chef Gregory Marchand. Petites assiettes créatives et sélection de vins naturels dans une ambiance décontractée.",
    phone: "01 40 39 96 19",
    menu: "https://example.com/menu-frenchie",
    reservation: "https://example.com/reservation-frenchie",
    website: "https://example.com/frenchie",
    instagram: "frenchie_paris", 
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    id: "le-comptoir",
    name: "LE COMPTOIR",
    address: "9 carrefour de l'Odéon, 75006",
    description: "Restaurant emblématique avec une cuisine française raffinée. Ambiance bistrot chic et service impeccable au comptoir.",
    phone: "01 44 27 07 97",
    menu: "https://example.com/menu-comptoir",
    reservation: "https://example.com/reservation-comptoir",
    website: "https://example.com/comptoir",
    instagram: "lecomptoir_paris",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    id: "le-verre-vole",
    name: "LE VERRE VOLÉ",
    address: "67 rue de Lancry, 75010",
    description: "Cave à manger conviviale avec une excellente sélection de vins et des plats simples mais savoureux. Parfait pour un moment au comptoir.",
    phone: "01 48 03 17 34",
    menu: "https://example.com/menu-verre-vole",
    reservation: "https://example.com/reservation-verre-vole",
    website: "https://example.com/verre-vole",
    instagram: "leverrevole",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  }
];

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

const otherGuides = [
  { title: "ITALIENS NICHE", image: "/placeholder.svg", link: "#" },
  { title: "FESTIF PAS EXCESSIF", image: "/placeholder.svg", link: "#" },
  { title: "FAST & HEALTHY", image: "/placeholder.svg", link: "#" },
  { title: "BRUNCHS GOURMANDS", image: "/placeholder.svg", link: "#" },
];

const MangerAuComptoir = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">MANGER AU COMPTOIR</h1>
            <p className="text-gray-600 max-w-4xl text-lg">
              Si t'adores voir les chef(fe)s dans les yeux lorsqu'ils/elles te concoctent ton plat, 
              ou que t'aimes juste être assis(e) sur une chaise haute (ça par contre je comprends pas), 
              on te propose nos meilleurs endroits pour manger au comptoir.
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
                    <img 
                      src={restaurant.images[0]} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 h-32 flex flex-col">
                    <h3 className="font-bold text-black mb-1 text-sm">{restaurant.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{restaurant.address}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                      {restaurant.description.substring(0, 60)}...
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
                  
                  {/* Photos layout: 1 main + 4 small in a 2x2 grid - doubled size */}
                  <div className="flex gap-2">
                    {/* Main photo - doubled size */}
                    <div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={restaurant.images[0]} 
                        alt={`${restaurant.name} main`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 4 small photos in 2x2 grid - doubled size */}
                    <div className="grid grid-cols-2 gap-1 w-64 h-64">
                      {restaurant.images.slice(1, 5).map((image, imgIndex) => (
                        <div key={imgIndex} className="bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${restaurant.name} ${imgIndex + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Menu: </span>
                      <a 
                        href={restaurant.menu} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Voir le menu
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Réservation: </span>
                      <a 
                        href={restaurant.reservation} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Réserver une table
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Site internet: </span>
                      <a 
                        href={restaurant.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visiter le site
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Instagram: </span>
                      <a 
                        href={`https://instagram.com/${restaurant.instagram}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        @{restaurant.instagram}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Téléphone: </span>
                      <a 
                        href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                        className="text-blue-600 hover:underline"
                      >
                        {restaurant.phone}
                      </a>
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {restaurant.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Other guides section with horizontal scroll */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-black mb-8">Découvre nos autres guides :</h2>
            
            <div className="flex overflow-x-auto gap-6 pb-4">
              {otherGuides.map((guide, index) => (
                <Link key={index} to={guide.link} className="flex-shrink-0 group">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors">{guide.title}</h3>
                    <div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <img 
                        src={guide.image} 
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MangerAuComptoir;

