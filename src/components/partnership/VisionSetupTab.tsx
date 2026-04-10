import React from 'react';

interface VisionSetupTabProps {
  isVisible: boolean;
}

const setupPhases = [
  {
    period: 'Jour 1-2',
    title: 'Brain-Juice',
    tasks: [
      'Atelier 48h équipes',
      'Carte des besoins',
      'Choix 12 verticales'
    ],
    color: '#8B5CF6'
  },
  {
    period: 'Mois 1',
    title: 'Poser Rails',
    tasks: [
      'Audit technique',
      'Synchronisation',
      'IA Valuator beta'
    ],
    color: '#EC4899'
  },
  {
    period: 'Mois 2-3',
    title: 'Relier Mondes',
    tasks: [
      'Tests 2 verticales',
      'Live streaming',
      'API compteur'
    ],
    color: '#F97316'
  },
  {
    period: 'Mois 4-6',
    title: 'Échelle',
    tasks: [
      '12 verticales actives',
      'Micro-reporters',
      '3 hubs ouverts'
    ],
    color: '#10B981'
  },
  {
    period: 'An 1',
    title: 'Autonome',
    tasks: [
      '7 cafés + bus',
      '2400 contenus/an',
      'Break-even atteint'
    ],
    color: '#3B82F6'
  }
];

const VisionSetupTab: React.FC<VisionSetupTabProps> = ({ isVisible }) => {
  return (
    <div className={`transform transition-all duration-3000 delay-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
          Setup Opérationnel
        </h3>
        <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base">
          Du Brain-Juice au Netflix
        </p>
      </div>

      {/* Timeline de setup */}
      <div className="space-y-4 sm:space-y-6">
        {setupPhases.map((phase, idx) => (
          <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className="w-1.5 sm:w-2 h-full rounded-full flex-shrink-0"
                style={{ backgroundColor: phase.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                  <span
                    className="font-montserrat font-black text-sm sm:text-base lg:text-lg"
                    style={{ color: phase.color }}
                  >
                    {phase.period}
                  </span>
                  <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900">
                    {phase.title}
                  </h4>
                </div>
                <ul className="space-y-1.5 sm:space-y-2">
                  {phase.tasks.map((task, taskIdx) => (
                    <li key={taskIdx} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5 text-xs">•</span>
                      <span className="font-inter text-gray-600 text-xs sm:text-sm">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisionSetupTab;
