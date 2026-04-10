import React, { useState, useEffect, useRef } from 'react';
import VisionSectionHeader from './VisionSectionHeader';
import VisionTimelineTab from './VisionTimelineTab';
import VisionProductionTab from './VisionProductionTab';
import VisionVerticalesTab from './VisionVerticalesTab';
import VisionSetupTab from './VisionSetupTab';
import VisionEditorialTab from './VisionEditorialTab';

const PartnershipVisionSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState(0);
  const [activeSection, setActiveSection] = useState('timeline');
  const [selectedVerticale, setSelectedVerticale] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8 xl:px-16 bg-white overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M60 0v120M0 60h120'/%3E%3Ccircle cx='60' cy='60' r='40' stroke-dasharray='2,4'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <VisionSectionHeader
          isVisible={isVisible}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Timeline Section */}
        {activeSection === 'timeline' && (
          <VisionTimelineTab
            isVisible={isVisible}
            currentTimeframe={currentTimeframe}
            onTimeframeChange={setCurrentTimeframe}
          />
        )}

        {/* Production Section */}
        {activeSection === 'production' && (
          <VisionProductionTab isVisible={isVisible} />
        )}

        {/* Verticales Section */}
        {activeSection === 'verticales' && (
          <VisionVerticalesTab
            isVisible={isVisible}
            selectedVerticale={selectedVerticale}
            onVerticaleSelect={setSelectedVerticale}
          />
        )}

        {/* Setup Section */}
        {activeSection === 'setup' && (
          <VisionSetupTab isVisible={isVisible} />
        )}

        {/* Vision Section */}
        {activeSection === 'vision' && (
          <VisionEditorialTab isVisible={isVisible} />
        )}

        {/* Footer CTA - toujours visible */}
        <div className={`text-center mt-8 sm:mt-12 lg:mt-16 transform transition-all duration-3000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <p className="font-playfair italic text-sm sm:text-base lg:text-lg text-gray-500 px-4">
            "Wanted 3.0 × Origines : 1,5M membres → 12 médias qui changent le monde"
          </p>
        </div>
      </div>

      <style>{`
        .gradient-text-animated {
          background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Hide scrollbar on mobile navigation */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default PartnershipVisionSection;
