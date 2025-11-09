const otherCategories = [
  "MANGER AU COMPTOIR",
  "ITALIENS NICHE", 
  "FESTIF PAS EXCESSIF",
  "FAST & HEALTHY",
  "FAST & HEALTHY"
];

const OtherGuides = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-black mb-12">Découvre nos autres guides :</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {otherCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-bold text-black">{category}</h3>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img 
                  src="/placeholder.svg" 
                  alt={category}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherGuides;

