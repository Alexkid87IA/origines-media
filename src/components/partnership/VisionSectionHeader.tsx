import React from 'react';
import { Clock, Tv, Layers, Rocket, Eye } from 'lucide-react';

interface VisionSectionHeaderProps {
  isVisible: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const tabs = [
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'production', label: 'Production', icon: Tv },
  { id: 'verticales', label: 'Verticales', icon: Layers },
  { id: 'setup', label: 'Setup', icon: Rocket },
  { id: 'vision', label: 'Vision', icon: Eye }
];

const VisionSectionHeader: React.FC<VisionSectionHeaderProps> = ({
  isVisible,
  activeSection,
  onSectionChange
}) => {
  return (
    <>
      {/* Header */}
      <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transform transition-all duration-3000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <div className="w-12 sm:w-16 lg:w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <span className="font-inter text-violet-400 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase font-medium">Vision 3.0</span>
          <div className="w-12 sm:w-16 lg:w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        </div>

        <h2 className="font-montserrat font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-tight text-gray-900 mb-2 sm:mb-4">
          Wanted × Origines :
          <br />
          <span className="gradient-text-animated text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">La Machine Média</span>
        </h2>

        <p className="font-inter text-gray-500 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto mb-2 sm:mb-4 px-4">
          Transformer 1,5M de membres en empire média
        </p>

        <p className="font-playfair italic text-base sm:text-lg lg:text-xl text-gray-600 px-4">
          "Chaque histoire vaut de l'or"
        </p>
      </div>

      {/* Navigation tabs - Horizontal scroll sur mobile */}
      <div className={`mb-8 sm:mb-12 transform transition-all duration-3000 delay-200 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-0 sm:flex-wrap sm:justify-center min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSectionChange(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-inter font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-gray-900'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VisionSectionHeader;
