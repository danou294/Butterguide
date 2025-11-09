const restaurants = [
  {
    name: "DAME",
    address: "38 rue Condorcet, 75009",
    description: "Cuisine de saison à partager qui du Chef Matthew Caminoro, précédemment en flaveurs et à la tête de Bonhomme. Décor rétro des années 70, veggies, grande sélection de vins. Combo parfait pour une atmosphère conviviale et intimiste à la fois.",
    phone: "01 56 46 73 88",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    name: "DAME",
    address: "38 rue Condorcet, 75009", 
    description: "Cuisine de saison à partager qui du Chef Matthew Caminoro, précédemment en flaveurs et à la tête de Bonhomme. Décor rétro des années 70, veggies, grande sélection de vins. Combo parfait pour une atmosphère conviviale et intimiste à la fois.",
    phone: "01 56 46 73 88",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    name: "DAME",
    address: "38 rue Condorcet, 75009",
    description: "Cuisine de saison à partager qui du Chef Matthew Caminoro, précédemment en flaveurs et à la tête de Bonhomme. Décor rétro des années 70, veggies, grande sélection de vins. Combo parfait pour une atmosphère conviviale et intimiste à la fois.",
    phone: "01 56 46 73 88", 
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    name: "DAME",
    address: "38 rue Condorcet, 75009",
    description: "Cuisine de saison à partager qui du Chef Matthew Caminoro, précédemment en flaveurs et à la tête de Bonhomme. Décor rétro des années 70, veggies, grande sélection de vins. Combo parfait pour une atmosphère conviviale et intimiste à la fois.",
    phone: "01 56 46 73 88",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    name: "DAME", 
    address: "38 rue Condorcet, 75009",
    description: "Cuisine de saison à partager qui du Chef Matthew Caminoro, précédemment en flaveurs et à la tête de Bonhomme. Décor rétro des années 70, veggies, grande sélection de vins. Combo parfait pour une atmosphère conviviale et intimiste à la fois.",
    phone: "01 56 46 73 88",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  }
];

const GuidesDetails = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category title */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">MANGER AU COMPTOIR</h2>
          <p className="text-gray-600 max-w-4xl">
            Si t'adores voir les chef(fe)s dans les yeux lorsqu'ils/elles te concocte ton plat dans les yeux toute 
            la soirée, ou que t'aimes juste être assis(e) sur une chaise haute (ça par contre je comprends pas), 
            on te propose 5 endroits parfaits pour manger au comptoir.
          </p>
        </div>
        {/* Restaurant cards in horizontal scroll */}
        <div className="flex overflow-x-auto gap-6 pb-4 mb-16">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square bg-gray-200">
                  <img 
                    src={restaurant.images[0]} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-black mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
                  <p className="text-xs text-gray-500">Ambiance cosy avec spécialité de saison à partager, offerts...</p>
                  <button className="text-xs text-blue-600 mt-2">voir plus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Detailed sections */}
        <div className="space-y-16">
          <h3 className="text-xl font-bold text-black">DÉTAILS :</h3>
          
          {restaurants.slice(0, 3).map((restaurant, index) => (
            <div key={`detail-${index}`} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-black">{restaurant.name}</h4>
                <p className="text-sm text-gray-600 underline">{restaurant.address}</p>
                
                <div className="grid grid-cols-3 gap-2">
                  {restaurant.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${restaurant.name} ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Menu:</span></p>
                  <p><span className="font-semibold">Réservation:</span></p>
                  <p><span className="font-semibold">Site internet:</span></p>
                  <p><span className="font-semibold">Instagram:</span></p>
                  <p><span className="font-semibold">Téléphone:</span> {restaurant.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-black">{restaurant.name}</h4>
                <p className="text-sm text-gray-600 underline">{restaurant.address}</p>
                
                <div className="grid grid-cols-3 gap-2">
                  {restaurant.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${restaurant.name} ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Menu:</span></p>
                  <p><span className="font-semibold">Réservation:</span></p>
                  <p><span className="font-semibold">Site internet:</span></p>
                  <p><span className="font-semibold">Instagram:</span></p>
                  <p><span className="font-semibold">Téléphone:</span> {restaurant.phone}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Single restaurant at the end */}
          <div className="max-w-lg">
            <h4 className="text-lg font-bold text-black mb-2">DAME</h4>
            <p className="text-sm text-gray-600 underline mb-4">38 rue Condorcet, 75009</p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {restaurants[0].images.map((image, imgIndex) => (
                <div key={imgIndex} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`DAME ${imgIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Menu:</span></p>
              <p><span className="font-semibold">Réservation:</span></p>
              <p><span className="font-semibold">Site internet:</span></p>
              <p><span className="font-semibold">Instagram:</span></p>
              <p><span className="font-semibold">Téléphone:</span> 01 56 46 73 88</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Cuisine de saison à partager qui du Chef Matthew Caminoro, 
              précédemment en flaveurs et à la tête de Bonhomme. Décor rétro des 
              années 70, veggies, grande sélection de vins. Combo parfait pour une 
              atmosphère conviviale et intimiste à la fois.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidesDetails;

