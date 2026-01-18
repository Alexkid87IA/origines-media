import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="min-h-screen">
        <section className="min-h-screen bg-gray-50 py-20 px-8 lg:px-16 relative overflow-hidden flex items-center justify-center">

          {/* Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-600 text-sm tracking-[0.2em] uppercase">
                Mentions Légales
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>

            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-gray-900 mb-8 leading-[0.9]">
              Mentions
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Légales</span>
            </h1>

            <p className="font-inter text-xl text-gray-600 leading-relaxed mb-12">
              Informations légales et conditions d'utilisation de notre plateforme.
            </p>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-sm">
              <p className="font-inter text-gray-600 text-lg leading-relaxed">
                <strong className="text-violet-600">Page en construction</strong>
                <br />
                Nos mentions légales complètes seront bientôt disponibles.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
