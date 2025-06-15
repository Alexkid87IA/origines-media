import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px] flex items-center justify-center">
        <section className="py-20 px-8 lg:px-16 text-center">
          
          {/* 404 Number */}
          <div className="mb-8">
            <span className="font-playfair text-8xl md:text-9xl lg:text-[12rem] font-bold text-white/10 select-none">
              404
            </span>
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto">
            <h1 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-white mb-6 leading-tight">
              Page
              <br />
              <span className="gradient-text-animated">Introuvable</span>
            </h1>
            
            <p className="font-inter text-lg text-white/70 leading-relaxed mb-12">
              La page que vous recherchez semble avoir disparu dans les méandres du web. 
              Peut-être s'est-elle transformée en récit inspirant ?
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-inter font-bold tracking-widest uppercase text-sm rounded-xl transition-all duration-500 hover:from-violet-500 hover:to-fuchsia-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Retour à l'accueil</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-inter font-medium tracking-widest uppercase text-sm rounded-xl hover:border-white/40 hover:bg-white/5 transition-all duration-500 backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Page précédente</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFoundPage;