import React from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px]">
        <section className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-8 lg:px-16 relative overflow-hidden flex items-center justify-center">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">
                Mentions Légales
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>
            
            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-8 leading-[0.9]">
              Mentions
              <br />
              <span className="gradient-text-animated">Légales</span>
            </h1>
            
            <p className="font-inter text-xl text-white/80 leading-relaxed mb-12">
              Informations légales et conditions d'utilisation de notre plateforme.
            </p>

            <div className="bg-black/40 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 lg:p-12">
              <p className="font-inter text-white/80 text-lg leading-relaxed">
                <strong className="text-violet-400">Page en construction</strong>
                <br />
                Nos mentions légales complètes seront bientôt disponibles.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LegalPage;