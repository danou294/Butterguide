const Features = () => {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Rejoins notre communauté de{' '}
            <span className="text-gray-300">+10 000</span>{' '}
            adeptes de bonnes adresses.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Feature 1 */}
          <div className="text-center space-y-8 group">
            <div className="bg-gray-200 rounded-[2.5rem] p-6 mx-auto w-72 h-96 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="bg-black rounded-[2rem] w-56 h-80 p-2">
                <div className="bg-white rounded-[1.5rem] h-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/8ffaafa1-526b-4de9-b028-f9ffff744701.png" 
                    alt="Restaurant list interface"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="max-w-sm mx-auto">
              <h3 className="text-2xl font-semibold mb-4 leading-tight">
                <span className="font-bold text-white">Découvre</span>{' '}
                <span className="text-gray-300">gratuitement les meilleurs restaurants de Paris.</span>
              </h3>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="text-center space-y-8 group">
            <div className="bg-gray-200 rounded-[2.5rem] p-6 mx-auto w-72 h-96 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="bg-black rounded-[2rem] w-56 h-80 p-2">
                <div className="bg-white rounded-[1.5rem] h-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/633d23a0-f157-4e9d-84e8-755f8bf379e5.png" 
                    alt="DAME restaurant details"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="max-w-sm mx-auto">
              <p className="text-2xl font-semibold leading-tight">
                <span className="font-bold text-white">Accède</span>{' '}
                <span className="text-gray-300">directement aux photos, menus et à la réservation.</span>
              </p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="text-center space-y-8 group">
            <div className="bg-gray-200 rounded-[2.5rem] p-6 mx-auto w-72 h-96 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="bg-black rounded-[2rem] w-56 h-80 p-2">
                <div className="bg-white rounded-[1.5rem] h-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/0051ba6b-7bce-4420-9584-953dd47225a8.png" 
                    alt="Favorites screen"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="max-w-sm mx-auto">
              <h3 className="text-2xl font-semibold leading-tight">
                <span className="font-bold text-white">Sauvegarde</span>{' '}
                <span className="text-gray-300">tes adresses préférées et partage-les avec tes amis.</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="text-center mt-20">
          <a 
            href="https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-white text-black px-10 py-5 rounded-xl text-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Télécharger l'application
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;

