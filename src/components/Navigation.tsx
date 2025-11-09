import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePage = (path: string) => {
    const currentPath = location.pathname;
    console.log('Current path:', currentPath, 'Checking against:', path);
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <nav className="bg-[#F1F0EB]/90 text-black fixed w-full top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Navigation Links - left aligned */}
          <div className="flex items-center space-x-10">
            {/* Logo - updated with new logo */}
            <div className="flex-shrink-0">
              <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
                <img 
                  src="/lovable-uploads/c72920ac-062d-43f2-aa5e-3ff9313d8285.png" 
                  alt="Butter Logo" 
                  className="h-6"
                />
              </button>
            </div>
            {/* Desktop Navigation - moved next to logo */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-10">
                <a 
                  href="/guides" 
                  className={`hover:text-gray-600 transition-colors text-lg font-medium ${
                    isActivePage('/guides') ? 'font-bold' : ''
                  }`}
                >
                  Guides
                </a>
                <a 
                  href="/app" 
                  className={`hover:text-gray-600 transition-colors text-lg font-medium ${
                    isActivePage('/app') ? 'font-bold' : ''
                  }`}
                >
                  App
                </a>
                <a 
                  href="/contact" 
                  className={`hover:text-gray-600 transition-colors text-lg font-medium ${
                    isActivePage('/contact') ? 'font-bold' : ''
                  }`}
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          {/* App Store Button - Desktop */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938" 
              target="_blank" 
              rel="noopener noreferrer"
              className="overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/79e379cf-fca0-4743-8530-d3a155b3fc21.png" 
                alt="Télécharger dans l'App Store" 
                className="h-10"
              />
            </a>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-gray-600 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-[#f1f0ea]">
            <div className="px-2 pt-2 pb-6 space-y-3 sm:px-3">
              <a 
                href="/guides" 
                className={`block px-3 py-3 hover:text-gray-600 text-lg font-medium transition-colors rounded-lg ${
                  isActivePage('/guides') 
                    ? 'font-bold text-black bg-white/50 shadow-sm' 
                    : 'hover:bg-white/30'
                }`}
              >
                Guides
              </a>
              <a 
                href="/app" 
                className={`block px-3 py-3 hover:text-gray-600 text-lg font-medium transition-colors rounded-lg ${
                  isActivePage('/app') 
                    ? 'font-bold text-black bg-white/50 shadow-sm' 
                    : 'hover:bg-white/30'
                }`}
              >
                App
              </a>
              <a 
                href="/contact" 
                className={`block px-3 py-3 hover:text-gray-600 text-lg font-medium transition-colors rounded-lg ${
                  isActivePage('/contact') 
                    ? 'font-bold text-black bg-white/50 shadow-sm' 
                    : 'hover:bg-white/30'
                }`}
              >
                Contact
              </a>
              <a 
                href="https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold mt-4 w-full text-center hover:bg-gray-800 transition-colors"
              >
                Télécharger l'application
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

