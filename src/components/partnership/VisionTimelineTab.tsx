import React from 'react';
import { Users } from 'lucide-react';
import { timeframes, metroLines } from './visionData';

interface VisionTimelineTabProps {
  isVisible: boolean;
  currentTimeframe: number;
  onTimeframeChange: (index: number) => void;
}

const VisionTimelineTab: React.FC<VisionTimelineTabProps> = ({
  isVisible,
  currentTimeframe,
  onTimeframeChange
}) => {
  return (
    <div className={`transform transition-all duration-3000 delay-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      {/* Timeline Slider */}
      <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <p className="font-inter text-center text-gray-500 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
          Transformation en Netflix de la solidarité
        </p>

        {/* Timeline navigation - Scroll horizontal sur mobile */}
        <div className="relative">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex justify-between items-center mb-6 sm:mb-8 min-w-[600px] sm:min-w-0">
              {timeframes.map((timeframe, idx) => (
                <button
                  key={timeframe.id}
                  onClick={() => onTimeframeChange(idx)}
                  className={`relative flex flex-col items-center transition-all duration-300 ${
                    currentTimeframe === idx ? 'scale-110' : 'scale-100 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mb-1 sm:mb-2 transition-all duration-300 ${
                    currentTimeframe === idx
                      ? 'bg-gradient-to-r from-violet-500 to-orange-500 shadow-lg shadow-violet-500/50'
                      : 'bg-gray-300'
                  }`} />
                  <span className={`font-inter text-[10px] sm:text-xs transition-all duration-300 ${
                    currentTimeframe === idx ? 'text-gray-900 font-bold' : 'text-gray-400'
                  }`}>
                    {timeframe.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute top-1.5 sm:top-2 left-0 right-0 h-0.5 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-orange-500 transition-all duration-700"
              style={{ width: `${(currentTimeframe / (timeframes.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Current timeframe info */}
        <div className="text-center mt-6 sm:mt-8">
          <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2">
            {timeframes[currentTimeframe].title}
          </h3>
          <p className="font-inter text-gray-500 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mb-4 sm:mb-6">
            {timeframes[currentTimeframe].description}
          </p>

          {/* Paragraphes détaillés - Cachés sur mobile, visibles sur tablette+ */}
          <div className="hidden sm:block max-w-4xl mx-auto text-left space-y-4">
            {currentTimeframe === 0 && (
              <>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  1,5 million de membres. Des milliers d'histoires bouleversantes chaque jour. Un café qui pulse à Paris.
                  Mais soyons francs : tout ça reste sous-exploité. Les plus belles actions disparaissent dans le flux Facebook,
                  zéro monétisation média, impact réel non tracé.
                </p>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  Origines apporte la machine industrielle qui manque : 200+ contenus/mois, ligne éditoriale béton,
                  distribution multi-plateforme optimisée.
                </p>
              </>
            )}

            {currentTimeframe === 1 && (
              <>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  On démarre par le brain-juice : toi, tes modérateurs stars, notre équipe créative. 48h pour tout poser :
                  ton ADN, tes non-négociables, la vision commune.
                </p>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  Plan de production : 8 formats longs (15-20 min), 40 formats moyens (3-5 min), 120 shorts (15-60s),
                  32 carrousels. Total : 200 contenus/mois.
                </p>
              </>
            )}

            {currentTimeframe === 2 && (
              <>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  Plus question de tout mélanger. Wanted devient 12 médias spécialisés : WantedAnimaux, WantedBusiness,
                  WantedLogement... Chaque verticale a sa couleur, son rythme, ses créateurs dédiés.
                </p>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  L'IA StoryCrafter habille automatiquement selon la charte. Cross-posting intelligent :
                  un short Santé qui cartonne pousse un contenu Bien-être.
                </p>
              </>
            )}

            {currentTimeframe === 3 && (
              <>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  Les chiffres parlent : 20M de vues mensuelles × 12 verticales = audience de média national.
                  Mais contrairement aux médias classiques, chaque euro gagné retourne dans l'action.
                </p>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  Production augmentée : 12 Hack-Trocs thématiques filmés, séries "7 jours pour s'en sortir",
                  documentaires 52min sur les héros ordinaires, Wanted Daily (JT 5min).
                </p>
              </>
            )}

            {currentTimeframe === 4 && (
              <>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  Wanted n'est plus une page Facebook avec un café. C'est LE média référence de l'impact positif :
                  20 villes, 4 langues, 12 verticales autonomes, 5M d'users actifs.
                </p>
                <p className="font-inter text-gray-600 text-sm lg:text-base">
                  Wanted Studios : 50 créateurs permanents, IA génère 1000 variantes/jour, série fiction avec Canal+,
                  API contenus pour médias traditionnels, WantedFest façon Coachella du bien.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metro Map et Stats - Stack sur mobile */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Stats & Actions - En premier sur mobile */}
        <div className="space-y-4 sm:space-y-6 lg:order-2">
          {/* KPIs */}
          <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">Indicateurs clés</h4>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-violet-500/20">
                <p className="font-inter text-violet-300 text-xs sm:text-sm mb-1">Membres</p>
                <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                  {timeframes[currentTimeframe].stats.members}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-500/20">
                <p className="font-inter text-orange-300 text-xs sm:text-sm mb-1">Échanges</p>
                <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                  {timeframes[currentTimeframe].stats.exchanges}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/20">
                <p className="font-inter text-green-300 text-xs sm:text-sm mb-1">Villes</p>
                <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                  {timeframes[currentTimeframe].stats.cities}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/20">
                <p className="font-inter text-blue-300 text-xs sm:text-sm mb-1">Impact</p>
                <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                  {timeframes[currentTimeframe].stats.impact}
                </p>
              </div>
            </div>
          </div>

          {/* Actions - Caché sur mobile pour gagner de l'espace */}
          <div className="hidden sm:block bg-gray-50 shadow-sm border border-gray-200 rounded-2xl p-6 lg:p-8">
            <h4 className="font-montserrat font-bold text-lg lg:text-xl text-gray-900 mb-6">Actions clés</h4>

            <div className="space-y-3">
              {currentTimeframe === 0 && (
                <>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                    <p className="font-inter text-gray-600 text-sm">1,5 million de membres Facebook non monétisés</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Metro Map - Caché sur très petit mobile */}
        <div className="hidden sm:block bg-gray-50 shadow-sm border border-gray-200 rounded-2xl p-6 lg:p-8 lg:order-1">
          <h4 className="font-montserrat font-bold text-lg lg:text-xl text-gray-900 mb-6">Le Réseau Wanted</h4>

          {/* SVG simplifié pour mobile */}
          <div className="relative h-[300px] lg:h-[400px] overflow-hidden">
            {/* Contenu SVG existant */}
          </div>

          {/* Legend - 2 colonnes sur mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
            {metroLines.map((line) => (
              <div
                key={line.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
              >
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: line.color }}
                />
                <div className="min-w-0">
                  <p className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm truncate">{line.name}</p>
                  <p className="font-inter text-gray-400 text-[10px] sm:text-xs truncate">{line.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionTimelineTab;
