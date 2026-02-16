import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataManager } from "@/lib/dataManager";
import { Guide } from "@/types/admin";

interface OtherGuidesProps {
  currentGuideId?: string;
}

const OtherGuides = ({ currentGuideId }: OtherGuidesProps) => {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const publishedGuides = await DataManager.getPublishedGuides();
        setGuides(publishedGuides.filter(g => g.id !== currentGuideId));
      } catch {
        // Silently fail
      }
    };
    loadGuides();
  }, [currentGuideId]);

  if (guides.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-black mb-12">Découvre nos autres guides :</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {guides.map((guide) => (
            <Link key={guide.id} to={`/guides/${guide.id}`} className="space-y-3 group">
              <h3 className="text-sm font-bold text-black group-hover:text-gray-700 transition-colors">
                {guide.title}
              </h3>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  src={guide.coverImage || "/placeholder.svg"}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherGuides;
