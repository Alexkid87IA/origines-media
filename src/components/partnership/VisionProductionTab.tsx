import React from 'react';
import { productionData } from './visionData';

interface VisionProductionTabProps {
  isVisible: boolean;
}

const VisionProductionTab: React.FC<VisionProductionTabProps> = ({ isVisible }) => {
  return (
    <div className={`transform transition-all duration-3000 delay-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
          200 contenus/mois
        </h3>
        <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base mb-6 sm:mb-8">
          La Machine de Production
        </p>

        {/* Production breakdown - Grid 2x2 sur mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 mb-6 sm:mb-8">
          {productionData.breakdown.map((item, idx) => (
            <div key={idx} className="relative group">
              <div
                className="bg-white shadow-sm border rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300"
                style={{ borderColor: item.color + '40' }}
              >
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 mx-auto"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: item.color }} />
                </div>
                <h4 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm lg:text-base mb-1">{item.type}</h4>
                <p className="font-montserrat font-black text-lg sm:text-2xl lg:text-3xl mb-1 sm:mb-2" style={{ color: item.color }}>
                  {item.count}
                </p>
                <p className="font-inter text-gray-500 text-[10px] sm:text-xs lg:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ligne éditoriale */}
        <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-300">
          <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6 text-center">
            Formule Éditoriale
          </h4>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              { pilier: 'Urgence', desc: 'MAINTENANT', percentage: '20%', color: '#EF4444' },
              { pilier: 'Émotion', desc: 'Bouleverser', percentage: '30%', color: '#EC4899' },
              { pilier: 'Solution', desc: 'Comment faire', percentage: '30%', color: '#10B981' },
              { pilier: 'Célébration', desc: 'Accomplir', percentage: '20%', color: '#F59E0B' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2"
                  style={{ color: item.color }}
                >
                  {item.percentage}
                </div>
                <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1">{item.pilier}</h5>
                <p className="font-inter text-gray-500 text-[10px] sm:text-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="font-inter text-gray-600 text-center text-xs sm:text-sm">
              <strong>Règles d'or :</strong> Action possible • Max 3 messages • Impact visible
            </p>
          </div>
        </div>
      </div>

      {/* Production team - Stack sur mobile */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">Équipe Production</h4>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-sm">Créateurs Origines</span>
              <span className="font-montserrat font-bold text-violet-400 text-lg sm:text-xl">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-sm">Micro-reporters</span>
              <span className="font-montserrat font-bold text-orange-400 text-lg sm:text-xl">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-sm">Showrunner</span>
              <span className="font-montserrat font-bold text-green-400 text-lg sm:text-xl">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-gray-600 text-sm">IA 24/7</span>
              <span className="font-montserrat font-bold text-blue-400 text-lg sm:text-xl">&infin;</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">Formats Signature</h4>
          <div className="space-y-2 sm:space-y-3">
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
              <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">Wanted Daily</h5>
              <p className="font-inter text-gray-500 text-[10px] sm:text-xs">JT de l'entraide 5min</p>
            </div>
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
              <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">7 jours pour s'en sortir</h5>
              <p className="font-inter text-gray-500 text-[10px] sm:text-xs">Série immersive</p>
            </div>
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
              <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">Du déchet au trésor</h5>
              <p className="font-inter text-gray-500 text-[10px] sm:text-xs">Transformation hebdo</p>
            </div>
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
              <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">Mentor surprise</h5>
              <p className="font-inter text-gray-500 text-[10px] sm:text-xs">Coaching bimensuel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionProductionTab;
