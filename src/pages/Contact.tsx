import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Champs requis",
        description: "Merci de remplir ton nom, email et message.",
        variant: "destructive"
      });
      return;
    }

    const subject = encodeURIComponent(formData.subject || 'Contact depuis butterguide.com');
    const body = encodeURIComponent(
      `De : ${formData.name} (${formData.email})\n\n${formData.message}`
    );
    window.location.href = `mailto:contact@butterguide.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    toast({
      title: "Message préparé",
      description: "Ton client mail va s'ouvrir avec le message pré-rempli."
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-bold mb-3 text-xl my-[32px]">Contact</h1>
            <p className="text-gray-600 text-base">Une question ? Une suggestion ? Contacte l'équipe Butter</p>
          </div>
          <div className="max-w-xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Envoie-nous un message</h2>

              {submitted ? (
                <div className="text-center py-8">
                  <p className="text-gray-700 font-medium mb-2">Merci pour ton message !</p>
                  <p className="text-gray-500 text-sm mb-4">
                    Si ton client mail ne s'est pas ouvert, envoie-nous un email directement.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="text-black font-medium underline text-sm"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      placeholder="Ton nom"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      placeholder="ton@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      placeholder="Sujet de ton message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none text-sm"
                      placeholder="Ton message..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                  >
                    Envoyer le message
                  </button>
                </form>
              )}

              <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-xs mb-1">Ou contacte-nous directement :</p>
                <a href="mailto:contact@butterguide.com" className="text-black font-medium hover:underline text-xs">
                  contact@butterguide.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
