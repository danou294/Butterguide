import Navigation from "@/components/Navigation";

import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const App = () => {
  const images = ["/lovable-uploads/43ed0f90-b15e-4a4f-b642-b58f75101400.png", "/lovable-uploads/5c2ff2b6-a166-47bf-9a89-78d2395018a9.png", "/lovable-uploads/6160cce8-f1ea-46a7-bed2-3c1128a72943.png"];

  return <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-left mb-8 md:mb-16 py-[32px]">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-center">Un an à dénicher les meilleurs restaurants de Paris</h1>
            <p className="text-gray-600 max-w-3xl mb-6 md:mb-8 text-sm md:text-base text-center mx-auto">Tout est là, et c'est gratuit.</p>
            <ul className="max-w-2xl mx-auto mb-6 md:mb-8 text-left px-[50px] list-disc list-inside space-y-2">
              <li className="text-black text-xs md:text-sm"><strong>Découvre</strong> les meilleurs restos</li>
              <li className="text-black text-xs md:text-sm"><strong>Réserve</strong> en 2 clics</li>
              <li className="text-black text-xs md:text-sm">Check le <strong>menu</strong> et la <strong>vibe</strong> avant d&apos;y aller</li>
            </ul>
            <div className="flex justify-center mt-4">
              <a 
                href="https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="font-semibold transition-all duration-300 transform hover:scale-105 rounded-xl text-sm md:text-base px-[18px] md:px-[22px] py-[18px] md:py-[22px] bg-zinc-950 hover:bg-zinc-800 text-slate-50">
                  Télécharger l'application
                </Button>
              </a>
            </div>
          </div>
          {/* Images - responsive layout */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-12 md:mb-20">
            {images.map((image, index) => <div key={index} className="flex justify-center">
                <div className="w-[240px] md:w-[280px] h-[400px] md:h-[500px]">
                  <img src={image} alt={`Feature ${index + 1}`} className="w-full h-full object-cover rounded-2xl shadow-lg" />
                </div>
              </div>)}
          </div>
          {/* Bottom CTA Section */}
          <div className="text-center mt-12 md:mt-20 text-white p-4 md:p-6 bg-[#f1f0ea] rounded-2xl px-[10px]">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-black">
              Prêt(e) à choisir un resto rapidement ?
            </h2>
            <p className="mb-3 md:mb-4 text-black text-xs md:text-sm">
              Rejoins notre communauté de +10 000 utilisateurs
            </p>
            <a 
              href="https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 px-[16px] md:px-[18px] py-[16px] md:py-[18px] text-xs md:text-sm my-[10px] text-white bg-black">
                Télécharger maintenant
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>;
};

export default App;

