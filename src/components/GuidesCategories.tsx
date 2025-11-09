import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataManager } from "@/lib/dataManager";
import { Guide } from "@/types/admin";

const staticCategories = [{
  title: "MANGER AU COMPTOIR",
  image: "/placeholder.svg",
  link: "/guides/manger-au-comptoir"
}, {
  title: "ITALIENS NICHE",
  image: "/placeholder.svg",
  link: "#"
}, {
  title: "FESTIF PAS EXCESSIF",
  image: "/placeholder.svg",
  link: "#"
}, {
  title: "FAST & HEALTHY",
  image: "/placeholder.svg",
  link: "#"
}, {
  title: "BRUNCHS GOURMANDS",
  image: "/placeholder.svg",
  link: "#"
}, {
  title: "TERRASSES CACHÉES",
  image: "/placeholder.svg",
  link: "#"
}, {
  title: "CUISINE DU MONDE",
  image: "/placeholder.svg",
  link: "#"
}, {
  title: "BARS À COCKTAILS",
  image: "/placeholder.svg",
  link: "#"
}];

const GuidesCategories = () => {
  const [publishedGuides, setPublishedGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const guides = await DataManager.getPublishedGuides();
        setPublishedGuides(guides);
      } catch (error) {
        console.error('Erreur lors du chargement des guides:', error);
      }
    };
    
    loadGuides();
  }, []);

  // Combine static categories with published guides, avoiding duplicates
  const allCategories = [
    ...staticCategories,
    ...publishedGuides
      .filter(guide => !staticCategories.some(cat => 
        cat.title.toLowerCase() === guide.title.toLowerCase()
      ))
      .map(guide => ({
        title: guide.title,
        image: guide.coverImage || "/placeholder.svg",
        link: `/guides/${guide.id}`
      }))
  ];

  return (
    <section className="bg-white py-[40px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
          {allCategories.map((category, index) => (
            <Link key={index} to={category.link} className="space-y-2 md:space-y-3 group">
              <h3 className="text-xs md:text-sm font-bold text-black mb-2 md:mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                {category.title}
              </h3>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidesCategories;

