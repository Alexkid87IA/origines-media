import React from 'react';

interface VisionEditorialTabProps {
  isVisible: boolean;
}

const VisionEditorialTab: React.FC<VisionEditorialTabProps> = ({ isVisible }) => {
  return (
    <div className={`transform transition-all duration-3000 delay-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
          Vision Éditoriale
        </h3>
        <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base">
          Le Netflix de la Solidarité
        </p>
      </div>

      {/* Les 4 piliers - Stack sur mobile */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-violet-500/20">
          <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">
            4 Piliers de Contenu
          </h4>
          <div className="space-y-3 sm:space-y-4">
            {[
              { pilier: 'Urgence', desc: 'Agir MAINTENANT', percentage: '20%' },
              { pilier: 'Émotion', desc: 'Bouleverser', percentage: '30%' },
              { pilier: 'Solution', desc: 'Comment faire', percentage: '30%' },
              { pilier: 'Célébration', desc: 'Accomplir', percentage: '20%' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <h5 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base">{item.pilier}</h5>
                  <p className="font-inter text-gray-500 text-xs sm:text-sm">{item.desc}</p>
                </div>
                <span className="font-montserrat font-black text-xl sm:text-2xl text-violet-400">
                  {item.percentage}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-orange-500/20">
          <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">
            KPIs Clés
          </h4>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-xs sm:text-sm">Vue → action</span>
              <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-xs sm:text-sm">Coût/impact</span>
              <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">&lt;1&euro;</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-xs sm:text-sm">Rétention</span>
              <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-xs sm:text-sm">NPS</span>
              <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">&gt;70</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vision finale */}
      <div className="bg-gradient-to-br from-violet-600/10 to-orange-600/10 shadow-sm border border-gray-300 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 text-center">
        <h3 className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-4 sm:mb-6">
          La Promesse 2030
        </h3>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div>
            <p className="font-montserrat font-black text-2xl sm:text-3xl lg:text-5xl text-violet-400 mb-1 sm:mb-2">0</p>
            <p className="font-inter text-gray-600 text-[10px] sm:text-xs lg:text-base">objet dormant</p>
          </div>
          <div>
            <p className="font-montserrat font-black text-2xl sm:text-3xl lg:text-5xl text-orange-400 mb-1 sm:mb-2">0</p>
            <p className="font-inter text-gray-600 text-[10px] sm:text-xs lg:text-base">talent gâché</p>
          </div>
          <div>
            <p className="font-montserrat font-black text-2xl sm:text-3xl lg:text-5xl text-green-400 mb-1 sm:mb-2">0</p>
            <p className="font-inter text-gray-600 text-[10px] sm:text-xs lg:text-base">excuse</p>
          </div>
        </div>

        <p className="font-playfair italic text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
          "Tes 1,5M de membres méritent mieux. Construisons ensemble la première plateforme où chaque clic finance une action."
        </p>

        <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl sm:rounded-2xl font-inter font-bold text-gray-900 text-sm sm:text-base overflow-hidden transition-all duration-300 hover:scale-105">
          <span className="relative z-10">On commence quand ?</span>
        </button>
      </div>
    </div>
  );
};

export default VisionEditorialTab;
