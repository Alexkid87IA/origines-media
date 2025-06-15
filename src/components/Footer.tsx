import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulation d'envoi (remplacer par votre logique d'API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Composant pour l'icône Snapchat
  const SnapchatIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
    </svg>
  );

  // Composant pour l'icône WhatsApp
  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
    </svg>
  );

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 md:ml-[280px]">
      {/* Main Footer Content */}
      <div className="px-8 lg:px-16 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Left Column (40%) - Navigation & Resources */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Logo */}
              <div className="mb-12">
                <a href="/" className="block group">
                  <img
                    src="https://26.staticbtf.eno.do/v1/12-default/6b72d83f2de3f869e8fae974e755f62d/media.jpg"
                    alt="Origines Media"
                    className="h-12 w-auto transition-all duration-500 group-hover:scale-105"
                    style={{
                      filter: 'brightness(1.1) contrast(1.05)'
                    }}
                  />
                </a>
              </div>

              {/* Navigation Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-12">
                
                {/* EXPLORER Section */}
                <div>
                  <h3 className="font-montserrat font-bold text-white text-sm tracking-[0.2em] uppercase mb-6 border-b border-white/10 pb-3">
                    Explorer
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="/essentiels"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Les Essentiels
                      </a>
                    </li>
                    <li>
                      <a
                        href="/fragments"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Fragments
                      </a>
                    </li>
                    <li>
                      <a
                        href="/univers"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Nos 10 Univers
                      </a>
                    </li>
                    {/* ✨ NOUVEAU : Nos Séries */}
                    <li>
                      <a
                        href="/series"
                        className="group font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform flex items-center gap-2"
                      >
                        <span>Nos Séries</span>
                        <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-400/30 rounded-full text-xs font-bold tracking-wider uppercase text-violet-300 group-hover:text-violet-200 transition-colors duration-300">
                          Exclusif
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* RESSOURCES Section */}
                <div>
                  <h3 className="font-montserrat font-bold text-white text-sm tracking-[0.2em] uppercase mb-6 border-b border-white/10 pb-3">
                    Ressources
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="/proposer-histoire"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Proposer mon histoire
                      </a>
                    </li>
                    <li>
                      <a
                        href="/media-kit"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Télécharger notre Média Kit
                      </a>
                    </li>
                    <li>
                      <a
                        href="/formats-concepts"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Nos Formats & Concepts
                      </a>
                    </li>
                  </ul>
                </div>

                {/* À PROPOS Section - ✅ CORRIGÉ */}
                <div>
                  <h3 className="font-montserrat font-bold text-white text-sm tracking-[0.2em] uppercase mb-6 border-b border-white/10 pb-3">
                    À Propos
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="/a-propos"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Notre histoire
                      </a>
                    </li>
                    <li>
                      <a
                        href="/equipe"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        L'équipe
                      </a>
                    </li>
                    <li>
                      <a
                        href="/partenariats"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Partenariats (Annonceurs)
                      </a>
                    </li>
                    <li>
                      <a
                        href="/contact"
                        className="font-inter text-white/70 hover:text-white transition-colors duration-300 text-sm leading-relaxed hover:translate-x-1 transform transition-transform"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ✨ NOUVEAU : Section Réseaux Sociaux */}
              <div className="pt-8 border-t border-white/10">
                <h3 className="font-montserrat font-bold text-white text-sm tracking-[0.2em] uppercase mb-6">
                  Suivez-nous
                </h3>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://instagram.com/originesmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-gradient-to-br hover:from-pink-500/20 hover:to-purple-500/20 hover:border-pink-400/30 hover:scale-110 transition-all duration-300"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  
                  <a
                    href="https://twitter.com/originesmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-cyan-500/20 hover:border-blue-400/30 hover:scale-110 transition-all duration-300"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  
                  <a
                    href="https://youtube.com/originesmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-600/20 hover:border-red-400/30 hover:scale-110 transition-all duration-300"
                    title="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  
                  <a
                    href="https://snapchat.com/add/originesmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-gradient-to-br hover:from-yellow-400/20 hover:to-yellow-500/20 hover:border-yellow-400/30 hover:scale-110 transition-all duration-300"
                    title="Snapchat"
                  >
                    <SnapchatIcon />
                  </a>
                  
                  <a
                    href="https://facebook.com/originesmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-800/20 hover:border-blue-600/30 hover:scale-110 transition-all duration-300"
                    title="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  
                  <a
                    href="https://wa.me/33123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-gradient-to-br hover:from-green-500/20 hover:to-green-600/20 hover:border-green-400/30 hover:scale-110 transition-all duration-300"
                    title="WhatsApp"
                  >
                    <WhatsAppIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column (60%) - Newsletter Box */}
            <div className="lg:col-span-3">
              <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 lg:p-12 h-full flex flex-col justify-center">
                
                {!isSubmitted ? (
                  <>
                    {/* Newsletter Header */}
                    <div className="mb-8">
                      <h3 className="font-montserrat font-bold text-3xl lg:text-4xl xl:text-5xl text-white mb-6 tracking-wider uppercase leading-tight">
                        Devenir
                        <br />
                        <span className="gradient-text-animated">Initié</span>
                      </h3>
                      
                      <p className="font-inter text-white/80 text-lg lg:text-xl leading-relaxed max-w-2xl">
                        Rejoignez le cercle privé d'Origines. Recevez chaque semaine une analyse exclusive, 
                        les coulisses de nos productions et nos meilleures lectures.
                      </p>
                    </div>

                    {/* Newsletter Form */}
                    <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Votre adresse email"
                          required
                          className="flex-1 px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 font-inter focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                        />
                        
                        <button
                          type="submit"
                          disabled={isSubmitting || !email.trim()}
                          className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-inter font-bold tracking-widest uppercase text-sm rounded-xl transition-all duration-500 hover:from-violet-500 hover:to-fuchsia-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden whitespace-nowrap"
                        >
                          {/* Background Animation */}
                          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                          
                          {/* Content */}
                          <div className="relative z-10 flex items-center gap-3">
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Envoi...</span>
                              </>
                            ) : (
                              <>
                                <span>Je Rejoins</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </>
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Privacy Notice */}
                      <p className="text-white/50 text-xs leading-relaxed">
                        En vous inscrivant, vous acceptez de recevoir nos emails. Désabonnement possible à tout moment. 
                        Vos données sont protégées et ne seront jamais partagées.
                      </p>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    
                    <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-4">
                      Bienvenue dans le cercle !
                    </h3>
                    
                    <p className="font-inter text-white/80 text-lg leading-relaxed">
                      Votre première analyse exclusive vous attend dans votre boîte mail. 
                      Vérifiez également vos spams si vous ne la voyez pas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer - Legal Line */}
      <div className="border-t border-white/10 py-6 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="font-inter text-white/50 text-xs text-center leading-relaxed">
            © 2025 Origines Media 
            <span className="mx-2">|</span>
            <a href="/mentions-legales" className="hover:text-white/70 transition-colors duration-300">
              Mentions Légales
            </a>
            <span className="mx-2">|</span>
            <a href="/cgu" className="hover:text-white/70 transition-colors duration-300">
              CGU
            </a>
            <span className="mx-2">|</span>
            <a href="/politique-confidentialite" className="hover:text-white/70 transition-colors duration-300">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;