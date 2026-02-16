import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section 
      className="flex items-center justify-center text-white px-4 relative"
      style={{ 
        paddingTop: '80px',
        minHeight: '100vh',
        backgroundImage: 'url(/lovable-uploads/a0b020b3-aa18-4169-9d7d-e0561cadd00f.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-black bg-opacity-15"></div>
      
      <div className="text-center space-y-12 max-w-4xl relative z-10">
        {/* Logo et titre principal */}
        <div className="space-y-6">
          <div className="flex justify-center -mt-[150px]">
            <img 
              src="/lovable-uploads/69bf86cc-e01e-44df-80db-83a6e45f244f.png" 
              alt="Butter Logo" 
              className="max-w-[290px] w-full h-auto"
            />
          </div>
          
          <p className="text-xl text-white max-w-3xl mx-auto">
            La liste des 754 meilleurs restaurants de Paris,<br />
            sur une appli.
          </p>
        </div>
        {/* Deux boutons côte à côte avec plus d'espace */}
        <div className="flex justify-center" style={{ marginTop: '62px' }}>
          <button
            onClick={() => navigate('/app')}
            className="bg-[#f1f0ea] bg-opacity-90 text-black px-6 py-3 rounded-xl text-base font-medium hover:bg-gray-200 hover:bg-opacity-80 transition-colors min-w-[140px]"
          >
            Découvre l'app
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

