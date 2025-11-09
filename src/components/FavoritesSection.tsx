const FavoritesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Phone Mockup */}
          <div className="flex justify-center lg:justify-start">
            <div className="bg-gray-100 rounded-[2.5rem] p-6 w-80 h-[30rem] shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-[2rem] h-full overflow-hidden">
                <img 
                  src="/lovable-uploads/0051ba6b-7bce-4420-9584-953dd47225a8.png" 
                  alt="Mes favoris - 8 adresses enregistrées"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          {/* Right Content */}
          <div className="space-y-10">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-black leading-[1.1] mb-8">
                Sauvegarde tes{' '}
                <span className="text-gray-600">adresses favorites</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                Pour éviter les "c'était quoi déjà le resto dans le 8e qui fait des sushis au comptoir ?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoritesSection;

