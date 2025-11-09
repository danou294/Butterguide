import { Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">C'est plus sympa sur l'application</h2>
        </div>
        {/* Two Cards - reduced size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {/* Left Card - Download App */}
          <a 
            href="https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-lg p-3 flex items-center space-x-3 transition-colors cursor-pointer bg-[#f1f0ea] hover:bg-[#e8e7e0]"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                {/* Placeholder for QR code - will be replaced later */}
                <div className="w-9 h-9 bg-gray-800 rounded grid grid-cols-6 gap-[1px] p-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-800'} rounded-[0.5px]`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-black mb-1">
                Télécharge l'application Butter
              </h3>
              <p className="text-gray-600 text-xs">
                Scanne pour télécharger
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-4 h-4 text-gray-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 16.5L13 12l-4.5-4.5L10 6l6 6-6 6-1.5-1.5z" />
                </svg>
              </div>
            </div>
          </a>
          {/* Right Card - Social Media */}
          <div className="rounded-lg p-3 bg-[#f1f0ea]">
            <h3 className="text-sm font-semibold text-black mb-2">
              Suis nos aventures
            </h3>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <a href="https://instagram.com/butterguide" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                  <Instagram size={12} className="text-white" />
                </a>
                <a href="https://tiktok.com/@butterguide" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-black border border-gray-400 rounded-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </a>
                <a href="https://www.linkedin.com/company/butterappli" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-blue-600 rounded-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                  <Linkedin size={12} className="text-white" />
                </a>
              </div>
              
              <p className="text-gray-600 text-xs">
                Contact : <a href="mailto:contact@butterguide.com" className="underline hover:text-gray-800 transition-colors">contact@butterguide.com</a>
              </p>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-6 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-xs">
              Copyright © 2025 butterguide.com | Powered by butterguide.com
            </p>
            <div className="flex space-x-4 text-xs">
              <a href="#" className="text-gray-400 hover:text-white underline transition-colors">Mentions légales</a>
              <a href="#" className="text-gray-400 hover:text-white underline transition-colors">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

