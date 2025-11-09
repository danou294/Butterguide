const SearchSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-black leading-[1.1] mb-8">
                Trouve le restaurant qui remplit{' '}
                <span className="text-gray-600">tous tes critères</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                Pas de compromis : filtre ta recherche par lieu, spécialité culinaire, ambiance, prix...
              </p>
            </div>
          </div>
          {/* Right Content - Filter Interface */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/a3d99de4-66eb-42e4-9f51-ce58f8ad738c.png" 
                  alt="Filter interface with location, cuisine and restrictions"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;

