import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">Mentions légales</h1>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg font-semibold text-black">1. Éditeur du site</h2>
              <p>
                Le site butterguide.com est édité par la société Butter, société par actions simplifiée
                au capital variable, dont le siège social est situé à Paris, France.
              </p>
              <p>
                Email : <a href="mailto:contact@butterguide.com" className="text-black underline">contact@butterguide.com</a>
              </p>
              <p>Directeur de la publication : l'équipe Butter.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">2. Hébergement</h2>
              <p>
                Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus présents sur le site butterguide.com (textes, images, logos,
                photographies, vidéos, graphismes, icônes) est protégé par les lois relatives à la
                propriété intellectuelle et est la propriété exclusive de Butter, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou
                partie des éléments du site est interdite sans l'autorisation écrite préalable de Butter.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">4. Limitation de responsabilité</h2>
              <p>
                Butter s'efforce de fournir des informations aussi précises que possible sur le site.
                Toutefois, Butter ne pourra être tenue responsable des omissions, inexactitudes ou
                carences dans la mise à jour des informations, qu'elles soient de son fait ou du fait
                des tiers partenaires qui lui fournissent ces informations.
              </p>
              <p>
                Les informations sur les restaurants (horaires, menus, prix, disponibilité) sont
                fournies à titre indicatif et peuvent être modifiées à tout moment par les
                établissements concernés.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">5. Liens hypertextes</h2>
              <p>
                Le site peut contenir des liens hypertextes vers d'autres sites. Butter n'exerce
                aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">6. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige,
                les tribunaux français seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MentionsLegales;
