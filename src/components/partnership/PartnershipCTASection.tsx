import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, MessageSquare, Download, ArrowRight, Clock, 
  CheckCircle, Sparkles, Rocket, Phone, Mail, ChevronRight,
  FileText, Users, Target, Zap
} from 'lucide-react';

const PartnershipCTASection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  const urgencyPoints = [
    { icon: Clock, text: "Dans 48h, on se voit pour tout poser" },
    { icon: Rocket, text: "Dans 30 jours, 200 premiers contenus en ligne" },
    { icon: Target, text: "Dans 6 mois, 20M de vues/mois" },
    { icon: Sparkles, text: "Dans 3 ans, Netflix de la solidarité créé" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gray-50 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header avec urgence */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30">
            <Clock className="w-5 h-5 text-orange-400 animate-pulse" />
            <span className="text-orange-300 font-semibold">Maintenant ou jamais</span>
          </div>
          
          <h2 className="font-montserrat font-black text-4xl lg:text-6xl text-gray-900 mb-6">
            Le futur commence
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400">
              dans 48 heures
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-900/80 max-w-3xl mx-auto">
            Tes 1.5 million de membres méritent mieux qu'un groupe Facebook.
            <br />
            <span className="font-semibold">Construisons ensemble l'empire média de l'entraide.</span>
          </p>
        </div>

        {/* Timeline d'urgence */}
        <div className={`grid lg:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {urgencyPoints.map((point, index) => (
            <div key={index} className={`relative transition-all duration-500 delay-${index * 100}`}>
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all h-full">
                <point.icon className={`w-10 h-10 mb-4 ${
                  index === 0 ? 'text-orange-400' : 
                  index === 1 ? 'text-purple-400' : 
                  index === 2 ? 'text-pink-400' : 
                  'text-green-400'
                }`} />
                <p className="text-gray-900/90 font-medium">{point.text}</p>
              </div>
              {index < urgencyPoints.length - 1 && (
                <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-900/20" />
              )}
            </div>
          ))}
        </div>

        {/* Main CTA Grid */}
        <div className={`grid lg:grid-cols-2 gap-12 items-start transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          
          {/* Left: Actions rapides */}
          <div className="space-y-8">
            <div>
              <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-400" />
                3 façons de commencer
              </h3>
              
              {/* Action 1: Workshop */}
              <div className="mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 shadow-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/30 transition-all">
                <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-orange-400" />
                  Workshop Stratégique (2 jours)
                </h4>
                <p className="text-gray-900/70 mb-4">
                  On pose tout : ton ADN, tes non-négociables, notre vision commune. 
                  On ressort avec LA stratégie et le planning des 30 premiers jours.
                </p>
                <a 
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-gray-900 font-semibold hover:scale-105 transition-transform"
                >
                  Réserver le workshop
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Action 2: Call découverte */}
              <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 shadow-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
                <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-purple-400" />
                  Call Découverte (30 min)
                </h4>
                <p className="text-gray-900/70 mb-4">
                  Un appel direct pour valider le fit, répondre à tes questions et 
                  définir les prochaines étapes concrètes.
                </p>
                <a 
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 font-semibold hover:scale-105 transition-transform"
                >
                  Prendre RDV maintenant
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Action 3: One-pager */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 shadow-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/30 transition-all">
                <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  One-Pager Exécutif
                </h4>
                <p className="text-gray-900/70 mb-4">
                  Le pitch complet en 2 pages : chiffres clés, roadmap, projections. 
                  Parfait pour partager en interne.
                </p>
                <a 
                  href="https://drive.google.com/file/d/1CBuF9T7KOXfF47T3Tw34B1xrzTZ2tuhZ/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-gray-900 font-semibold hover:scale-105 transition-transform"
                >
                  Télécharger le PDF
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Garanties */}
            <div className="bg-gray-50 shadow-sm rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Ce qu'on te garantit :</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900/80 text-sm">Réponse sous 24h maximum</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900/80 text-sm">Accès direct aux fondateurs</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900/80 text-sm">Proposition sur-mesure en 48h</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900/80 text-sm">Aucun engagement avant validation mutuelle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Formulaire de contact */}
          <div>
            <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 shadow-sm rounded-3xl p-8 border border-gray-300">
              <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-violet-400" />
                Parlons de ton empire
              </h3>

              {showSuccess && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Message envoyé ! On revient vers toi sous 24h.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900/60 text-sm mb-2">Prénom & Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:outline-none transition-colors"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-900/60 text-sm mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:outline-none transition-colors"
                      placeholder="jean@wanted.com"
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900/60 text-sm mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:outline-none transition-colors"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-900/60 text-sm mb-2">Organisation</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:outline-none transition-colors"
                      placeholder="Wanted Community"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900/60 text-sm mb-2">Ton message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:outline-none transition-colors resize-none"
                    placeholder="Dis-nous en quoi ce projet résonne avec ta vision..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                    isSubmitting 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:scale-105'
                  } text-gray-900`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-900/40 text-sm mt-4">
                Ou contacte-nous directement : 
                <a href="mailto:hello@origines.media" className="text-violet-400 hover:text-violet-300 ml-1">
                  hello@origines.media
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Message final puissant */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 via-pink-600/20 to-purple-600/20 blur-3xl" />
            <div className="relative bg-white shadow-sm rounded-3xl p-10 lg:p-16 border border-gray-300">
              <p className="text-2xl lg:text-3xl text-gray-900/90 leading-relaxed font-light">
                Chaque jour qui passe, <span className="font-bold text-orange-400">des milliers d'histoires</span> meurent dans l'oubli.
                <br />
                Chaque jour, <span className="font-bold text-purple-400">ton impact réel</span> reste invisible.
                <br />
                Chaque jour, <span className="font-bold text-pink-400">des sponsors</span> passent à côté de la plus belle audience de France.
              </p>
              
              <p className="text-3xl lg:text-4xl font-montserrat font-black text-gray-900 mt-8 mb-8">
                C'est fini.
              </p>
              
              <p className="text-xl text-gray-900/80">
                Le changement commence <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">maintenant</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Logos partenaires */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-8">
            <img 
              src="https://wanted.community/wp-content/uploads/2019/12/logo-wanted-community-.png" 
              alt="Wanted Community" 
              className="h-12 lg:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
            <span className="text-3xl text-gray-900/20">×</span>
            <img 
              src="https://res.cloudinary.com/diqco2njt/image/upload/v1751568726/LOGO_ORIGINES_WHITE_pzbo2m.png" 
              alt="Origines Media" 
              className="h-12 lg:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-gray-900/40 text-sm mt-4">
            L'empire média de l'entraide commence ici.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnershipCTASection;