import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataManager } from "@/lib/dataManager";
import { Guide } from "@/types/admin";

const GuidesCategories = () => {
  const [publishedGuides, setPublishedGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const guides = await DataManager.getPublishedGuides();
        setPublishedGuides(guides);
      } catch {
        // Silently fail - guides will be empty
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const categories = publishedGuides.map(guide => ({
    title: guide.title,
    image: guide.coverImage || "/placeholder.svg",
    link: `/guides/${guide.id}`
  }));

  if (loading) {
    return (
      <section className="bg-white py-[40px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 md:space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="bg-white py-[40px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">Les guides arrivent bientôt !</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-[40px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
          {categories.map((category, index) => (
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
