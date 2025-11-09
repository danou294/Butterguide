import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GuidesHero from "@/components/GuidesHero";
import GuidesCategories from "@/components/GuidesCategories";

const Guides = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <GuidesHero />
      <GuidesCategories />
      <Footer />
    </div>
  );
};

export default Guides;

