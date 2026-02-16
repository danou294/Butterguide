import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const InstagramIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3373 1.3803-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6151 19.0872.3192 18.2143.1186 16.9366.0652 15.6588.0115 15.2482-.001 11.9999-.001c-3.2483 0-3.6583.0126-4.9301.0653zM7.114 21.8313c-1.1745-.0544-1.8129-.2514-2.2381-.4178-.5625-.2187-.9644-.4803-1.3867-.9034-.4217-.4238-.6826-.8268-.9022-1.3906-.165-.4264-.3613-1.0654-.4132-2.2414-.056-1.2742-.0677-1.6565-.0677-4.8823 0-3.2258.0125-3.6066.0677-4.8814.0519-1.1752.2514-1.8126.4132-2.2386.2196-.5638.4805-.9645.9022-1.3872.4238-.4217.8268-.6826 1.3867-.9017.426-.165 1.0636-.3625 2.2381-.4138 1.2744-.0564 1.6558-.0689 4.8801-.0689 3.2243 0 3.6062.013 4.8823.0689 1.1746.0513 1.8121.2514 2.2387.4138.5625.2191.9637.48 1.3867.9017.4233.4227.6842.8234.9017 1.3872.1651.426.3625 1.0634.4138 2.2386.0564 1.2748.0689 1.6556.0689 4.8814 0 3.2258-.0125 3.6081-.0689 4.8823-.0513 1.176-.2487 1.815-.4138 2.2414-.2175.5638-.4784.9668-.9017 1.3906-.423.4231-.8242.6847-1.3867.9034-.4258.1664-1.0641.3634-2.2387.4178-1.2748.0564-1.6564.0689-4.8823.0689-3.226 0-3.6064-.0125-4.8801-.0689zm9.8424-16.6015a1.44 1.44 0 1 0 2.8801.001 1.44 1.44 0 0 0-2.8801-.001zM5.8838 12.0001a6.117 6.117 0 1 0 12.234.0002 6.117 6.117 0 0 0-12.234-.0002zm2.1504 0a3.967 3.967 0 1 1 7.934.0002 3.967 3.967 0 0 1-7.934-.0002z" />
  </svg>
);

const TikTokIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const LinkedInIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const APP_STORE_URL = "https://apps.apple.com/fr/app/butter-guide-de-restaurants/id6749227938";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">C'est plus sympa sur l'application</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-3 flex items-center space-x-3 transition-colors cursor-pointer bg-[#f1f0ea] hover:bg-[#e8e7e0]"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center p-1">
                <QRCodeSVG
                  value={APP_STORE_URL}
                  size={36}
                  bgColor="transparent"
                  fgColor="#1f2937"
                  level="L"
                />
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
          <div className="rounded-lg p-3 bg-[#f1f0ea]">
            <h3 className="text-sm font-semibold text-black mb-2">
              Suis nos aventures
            </h3>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <a href="https://instagram.com/butterguide" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center text-white" aria-label="Instagram">
                  <InstagramIcon size={14} />
                </a>
                <a href="https://tiktok.com/@butterguide" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-black border border-gray-400 rounded-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center text-white" aria-label="TikTok">
                  <TikTokIcon size={14} />
                </a>
                <a href="https://www.linkedin.com/company/butterappli" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-[#0A66C2] rounded-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center text-white" aria-label="LinkedIn">
                  <LinkedInIcon size={14} />
                </a>
              </div>

              <p className="text-gray-600 text-xs">
                Contact : <a href="mailto:contact@butterguide.com" className="underline hover:text-gray-800 transition-colors">contact@butterguide.com</a>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-xs">
              Copyright &copy; 2025 butterguide.com | Powered by butterguide.com
            </p>
            <div className="flex space-x-4 text-xs">
              <Link to="/mentions-legales" className="text-gray-400 hover:text-white underline transition-colors">Mentions légales</Link>
              <Link to="/politique-de-confidentialite" className="text-gray-400 hover:text-white underline transition-colors">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
