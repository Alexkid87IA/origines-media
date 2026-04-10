import React from 'react';
import { verticales } from './visionData';

interface VisionVerticalesTabProps {
  isVisible: boolean;
  selectedVerticale: number | null;
  onVerticaleSelect: (id: number) => void;
}

const VisionVerticalesTab: React.FC<VisionVerticalesTabProps> = ({
  isVisible,
  selectedVerticale,
  onVerticaleSelect
}) => {
  return (
    <div className={`transform transition-all duration-3000 delay-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
          12 Verticales = 12 Médias
        </h3>
        <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base">
          12 langages, 12 publics, 12 business
        </p>
      </div>

      {/* Grid des verticales - 3 colonnes sur mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:gap-4 mb-6 sm:mb-8">
        {verticales.map((verticale) => (
          <button
            key={verticale.id}
            onClick={() => onVerticaleSelect(verticale.id)}
            className={`group relative bg-gray-50 shadow-sm border rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300 ${
              selectedVerticale === verticale.id ? 'scale-105' : ''
            }`}
            style={{
              borderColor: selectedVerticale === verticale.id ? verticale.color : 'rgba(255,255,255,0.1)',
              boxShadow: selectedVerticale === verticale.id ? `0 10px 20px ${verticale.color}30` : 'none'
            }}
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 mx-auto"
              style={{ backgroundColor: verticale.color + '20' }}
            >
              <verticale.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: verticale.color }} />
            </div>
            <h4 className="font-montserrat font-bold text-gray-900 text-[10px] sm:text-xs lg:text-sm mb-0.5 sm:mb-1">
              {verticale.name}
            </h4>
            <p className="font-inter text-gray-500 text-[8px] sm:text-[10px] lg:text-xs hidden sm:block">
              {verticale.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Détail de la verticale sélectionnée */}
      {selectedVerticale && (() => {
        const v = verticales.find(v => v.id === selectedVerticale);
        if (!v) return null;
        return (
          <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-300">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: v.color + '20' }}
              >
                <v.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" style={{ color: v.color }} />
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">
                  Wanted{v.name}
                </h3>
                <p className="font-inter text-gray-500 text-xs sm:text-sm">{v.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Ligne éditoriale</h4>
                <p className="font-playfair italic text-sm sm:text-base lg:text-lg text-gray-600">{v.edito}</p>
              </div>

              <div>
                <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Production</h4>
                <ul className="space-y-1 sm:space-y-2">
                  <li className="font-inter text-gray-600 text-xs sm:text-sm">• 2 lives/mois</li>
                  <li className="font-inter text-gray-600 text-xs sm:text-sm">• 15 shorts</li>
                  <li className="font-inter text-gray-600 text-xs sm:text-sm">• 3 carrousels</li>
                  <li className="font-inter text-gray-600 text-xs sm:text-sm">• 1 newsletter</li>
                </ul>
              </div>

              <div>
                <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Sponsors</h4>
                <p className="font-inter text-gray-500 text-xs sm:text-sm">
                  {v.name === 'Animaux' && 'Purina, Royal Canin'}
                  {v.name === 'Business' && 'LinkedIn, Indeed'}
                  {v.name === 'Logement' && 'Nexity, Action Log.'}
                  {v.name === 'Mode' && 'Vinted, H&M'}
                  {v.name === 'Alimentation' && 'Too Good To Go'}
                  {v.name === 'Formation' && 'OpenClassrooms'}
                  {v.name === 'Santé' && 'Mutuelle, ARS'}
                  {v.name === 'Culture' && 'Ministère Culture'}
                  {v.name === 'Environnement' && 'Ademe, Veolia'}
                  {v.name === 'Famille' && 'CAF, Fondations'}
                  {v.name === 'Seniors' && 'AG2R, Malakoff'}
                  {v.name === 'Mobilité' && 'SNCF, Blablacar'}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default VisionVerticalesTab;
