import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="min-h-screen flex items-center justify-center">
        <section className="py-20 px-8 lg:px-16 text-center">

          {/* 404 Number */}
          <div className="mb-8">
            <span className="font-playfair text-8xl md:text-9xl lg:text-[12rem] font-bold text-gray-100 select-none">
              404
            </span>
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto">
            <h1 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-gray-900 mb-6 leading-tight">
              Page
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Introuvable</span>
            </h1>

            <p className="font-inter text-lg text-gray-600 leading-relaxed mb-12">
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
                className="group inline-flex items-center gap-3 px-8 py-4 border border-gray-200 text-gray-700 font-inter font-medium tracking-widest uppercase text-sm rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-500"
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
