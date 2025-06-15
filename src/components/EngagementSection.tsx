import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Download, Shield, CheckCircle } from 'lucide-react';

interface EngagementSectionProps {
  // Pas besoin de quotes pour le lead magnet
}

const EngagementSection: React.FC<EngagementSectionProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulation d'envoi (remplacer par votre logique d'API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 relative overflow-hidden flex items-center justify-center"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 50L25 25v50l25-25zm0 0l25 25V25L50 50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Container - PARFAITEMENT CENTRÉ */}
      <div className="w-full max-w-7xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
          
          {/* Left Column - Vitrine du Kit */}
          <div className={`flex flex-col justify-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            
            {/* Main Title - SANS "Acte 4" */}
            <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-white mb-8 leading-[0.9]">
              Passez de l'Inspiration
              <br />
              <span className="gradient-text-animated">à l'Action</span>
            </h2>

            {/* Description */}
            <p className="font-inter text-lg lg:text-xl text-white/80 leading-relaxed mb-12 max-w-lg">
              Nous avons compilé les outils et les questions les plus puissantes de nos intervenants dans un guide pratique et exclusif. 
              <span className="text-white font-medium"> Votre premier pas pour clarifier votre chemin.</span>
            </p>

            {/* Mockup du Kit - Image Premium avec la vraie image */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-8 border border-white/10 backdrop-blur-sm">
                {/* Vraie Image du Kit d'Introspection */}
                <div 
                  className="w-full h-80 bg-cover bg-center rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://26.staticbtf.eno.do/v1/38-default/03e68aefa4f3d4edc2d7277c7069fcec/media.jpg")`,
                    filter: 'brightness(0.95) contrast(1.05)'
                  }}
                />
                
                {/* Overlay avec titre du kit - Plus subtil pour laisser voir l'image */}
                <div className="absolute inset-8 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="font-montserrat font-bold text-2xl text-white mb-2">
                      Le Kit d'Introspection
                    </h3>
                    <p className="font-inter text-white/90 text-sm">
                      Guide PDF • 24 pages • Outils pratiques
                    </p>
                  </div>
                </div>

                {/* Badge "Gratuit" */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full font-inter font-bold text-sm shadow-lg">
                  GRATUIT
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
          </div>

          {/* Right Column - Formulaire de Capture - PARFAITEMENT CENTRÉ */}
          <div className={`flex items-center justify-center transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            
            {!isSubmitted ? (
              <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h3 className="font-montserrat font-bold text-3xl lg:text-4xl text-white mb-4 tracking-wider">
                    Recevez votre Kit
                    <br />
                    <span className="gradient-text-animated">gratuitement</span>
                  </h3>
                  <p className="font-inter text-white/70 text-lg leading-relaxed">
                    Accédez instantanément à nos outils d'introspection les plus puissants
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block font-inter font-medium text-white/90 text-sm mb-3 tracking-wide">
                      Votre adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 font-inter focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                      placeholder="votre@email.com"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block font-inter font-medium text-white/90 text-sm mb-3 tracking-wide">
                      Votre numéro de téléphone <span className="text-white/50">(optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 font-inter focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className={`
                      group relative w-full py-5 px-8 
                      bg-gradient-to-r from-violet-600 to-fuchsia-600 
                      text-white font-inter font-bold tracking-widest uppercase text-sm
                      rounded-xl transition-all duration-500 shadow-2xl
                      disabled:opacity-50 disabled:cursor-not-allowed
                      enabled:hover:from-violet-500 enabled:hover:to-fuchsia-500 
                      enabled:hover:scale-105 enabled:hover:shadow-violet-500/25
                      flex items-center justify-center gap-3
                      overflow-hidden
                    `}
                  >
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>Télécharger mon Kit</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Reassurance Text */}
                  <div className="text-center pt-4">
                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm font-inter mb-2">
                      <Shield className="w-4 h-4" />
                      <span>Vos données sont protégées et ne seront jamais partagées</span>
                    </div>
                    <p className="text-white/50 text-xs">
                      En téléchargeant ce guide, vous acceptez de recevoir nos emails. Désabonnement possible à tout moment.
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Success State - CENTRÉ */
              <div className="w-full max-w-lg bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 lg:p-12 shadow-2xl text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                
                <h3 className="font-montserrat font-bold text-3xl text-white mb-4">
                  Merci !
                </h3>
                
                <p className="font-inter text-white/80 text-lg leading-relaxed mb-6">
                  Votre Kit d'Introspection vous attend dans votre boîte mail. 
                  Vérifiez également vos spams si vous ne le voyez pas.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/bibliotheque"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-inter font-medium rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    <span>Explorer nos récits</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementSection;