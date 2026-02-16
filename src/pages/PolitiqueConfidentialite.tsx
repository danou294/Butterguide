import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">Politique de confidentialité</h1>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">Dernière mise à jour : février 2026</p>

            <section>
              <h2 className="text-lg font-semibold text-black">1. Introduction</h2>
              <p>
                Butter accorde une grande importance à la protection de vos données personnelles.
                Cette politique de confidentialité décrit les données que nous collectons, comment
                nous les utilisons et les droits dont vous disposez.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">2. Données collectées</h2>
              <p>Nous pouvons collecter les données suivantes :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Données de navigation (pages visitées, durée de visite, appareil utilisé)</li>
                <li>Données communiquées via le formulaire de contact (nom, email, message)</li>
                <li>Données liées à l'utilisation de l'application mobile Butter</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">3. Finalités du traitement</h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fournir et améliorer nos services (guides de restaurants, recommandations)</li>
                <li>Répondre à vos demandes de contact</li>
                <li>Analyser l'utilisation du site pour en améliorer l'expérience</li>
                <li>Vous envoyer des communications si vous y avez consenti</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">4. Base légale</h2>
              <p>
                Le traitement de vos données repose sur votre consentement, l'exécution d'un contrat
                ou notre intérêt légitime à améliorer nos services, conformément au Règlement Général
                sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">5. Durée de conservation</h2>
              <p>
                Vos données personnelles sont conservées pour la durée nécessaire aux finalités pour
                lesquelles elles ont été collectées, et en tout état de cause pour une durée maximale
                de 3 ans à compter de votre dernier contact avec Butter.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">6. Partage des données</h2>
              <p>
                Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées avec nos
                prestataires techniques (hébergement, analytics) dans le strict cadre de la fourniture
                de nos services. Ces prestataires sont soumis à des obligations de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">7. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement à tout moment</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à :{" "}
                <a href="mailto:contact@butterguide.com" className="text-black underline">
                  contact@butterguide.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">8. Cookies</h2>
              <p>
                Le site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie
                publicitaire n'est déposé sans votre consentement préalable. Vous pouvez configurer
                votre navigateur pour refuser les cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-black">9. Contact</h2>
              <p>
                Pour toute question relative à cette politique de confidentialité, vous pouvez nous
                contacter à :{" "}
                <a href="mailto:contact@butterguide.com" className="text-black underline">
                  contact@butterguide.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
