import React from 'react';
import { ChevronRight } from 'lucide-react';
import type {
  Slide,
  CoverSlide,
  ProblemSlide,
  SolutionSlide,
  VerticalesSlide,
  TrocSlide,
  OrchestrationSlide,
  ProductionSlide,
  TechSlide,
  BusinessSlide,
  TractionSlide,
  RoadmapSlide,
  TeamSlide,
  ImpactSlide,
  CtaSlide,
} from './carouselTypes';

// ============ COVER ============
const CoverContent: React.FC<{ slide: CoverSlide }> = ({ slide }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-12">
    <slide.icon className="w-12 h-12 md:w-20 md:h-20 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-4 md:mb-8" />
    <div className="flex items-center justify-center gap-2 md:gap-6 mb-4 md:mb-8">
      {/* Logo Wanted */}
      <img
        src="https://wanted.community/wp-content/uploads/2019/12/logo-wanted-community-.png"
        alt="Wanted Community"
        className="h-10 md:h-16 lg:h-20 object-contain"
      />

      {/* Symbole × */}
      <span className="font-bold text-2xl md:text-4xl lg:text-5xl text-gray-600">×</span>

      {/* Logo Origines */}
      <img
        src="https://res.cloudinary.com/diqco2njt/image/upload/v1751568726/LOGO_ORIGINES_WHITE_pzbo2m.png"
        alt="Origines Media"
        className="h-10 md:h-16 lg:h-20 object-contain"
      />
    </div>

    <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-8">{slide.subtitle}</p>
    <p className="text-sm md:text-lg text-gray-500 max-w-3xl italic px-4">{slide.punchline}</p>
  </div>
);

// ============ PROBLEM ============
const ProblemContent: React.FC<{ slide: ProblemSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-red-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-red-300 mb-4 md:mb-8">{slide.subtitle}</p>
    <div className="space-y-2 md:space-y-4 mb-4 md:mb-8">
      {slide.points.map((point: string, idx: number) => (
        <div key={idx} className="flex items-start gap-2 md:gap-3">
          <span className="text-red-400 mt-0.5 md:mt-1">•</span>
          <p className="text-sm md:text-base text-gray-600">{point}</p>
        </div>
      ))}
    </div>
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-red-200 font-semibold">{slide.conclusion}</p>
    </div>
  </div>
);

// ============ SOLUTION ============
const SolutionContent: React.FC<{ slide: SolutionSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-violet-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-violet-300 mb-4 md:mb-8">{slide.subtitle}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-8">
      {slide.components.map((comp, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-violet-500/30 transition-all">
          <comp.icon className="w-6 h-6 md:w-8 md:h-8 text-violet-400 mb-1 md:mb-2" />
          <h4 className="font-bold text-gray-900 text-xs md:text-sm mb-0.5 md:mb-1">{comp.label}</h4>
          <p className="text-xs text-gray-500">{comp.desc}</p>
        </div>
      ))}
    </div>
    <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-violet-200">{slide.flow}</p>
    </div>
  </div>
);

// ============ VERTICALES ============
const VerticalesContent: React.FC<{ slide: VerticalesSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-blue-300 mb-4 md:mb-8">{slide.subtitle}</p>
    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
      {slide.verticales.map((vert, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <h4 className="font-bold text-sm md:text-base text-gray-900" style={{ color: vert.color }}>
                {vert.name}
              </h4>
              <p className="text-xs md:text-sm text-gray-500">{vert.metric}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-gray-400">Sponsor type</p>
              <p className="text-xs md:text-sm font-semibold text-gray-600">{vert.sponsor}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-blue-200 font-semibold">{slide.total}</p>
    </div>
  </div>
);

// ============ TROC ============
const TrocContent: React.FC<{ slide: TrocSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-green-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-green-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
      {slide.ecosystem.map((step, idx) => (
        <div key={idx} className="flex items-center gap-2 md:gap-4 bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3">
          <step.icon className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-xs md:text-sm truncate">{step.step}</h4>
            <p className="text-xs text-gray-500 truncate">{step.desc}</p>
          </div>
          {idx < slide.ecosystem.length - 1 && (
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-green-400/50 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
      <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
        <div>
          <p className="font-bold text-xs md:text-base text-green-400">{slide.stats.monthly}</p>
          <p className="text-xs text-gray-500">Volume</p>
        </div>
        <div>
          <p className="font-bold text-xs md:text-base text-emerald-400">{slide.stats.value}</p>
          <p className="text-xs text-gray-500">Valeur</p>
        </div>
        <div>
          <p className="font-bold text-xs md:text-base text-cyan-400">{slide.stats.impact}</p>
          <p className="text-xs text-gray-500">Impact</p>
        </div>
      </div>
    </div>
  </div>
);

// ============ ORCHESTRATION ============
const OrchestrationContent: React.FC<{ slide: OrchestrationSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-orange-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-orange-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
      {slide.flow.map((step, idx) => (
        <div key={idx} className="relative">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
              <step.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            <div className="flex-1 bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs md:text-sm">{step.source}</h4>
                  <p className="text-xs text-gray-500">{step.action}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold text-xs md:text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                    {step.result}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {idx < slide.flow.length - 1 && (
            <div className="ml-5 md:ml-6 h-3 md:h-4 w-px bg-gradient-to-b from-white/20 to-transparent" />
          )}
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-gray-900 font-semibold">{slide.magic}</p>
    </div>
  </div>
);

// ============ PRODUCTION ============
const ProductionContent: React.FC<{ slide: ProductionSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-pink-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-pink-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6">
      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 text-center">{slide.formula.input}</p>
      <div className="flex justify-center mb-3 md:mb-4">
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-pink-400 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        {slide.formula.outputs.map((output, idx) => (
          <div key={idx} className="bg-pink-500/10 rounded-lg p-2 md:p-3">
            <p className="font-bold text-xs md:text-sm text-pink-400">{output.format}</p>
            <p className="text-xs text-gray-500">{output.detail}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-pink-200 font-semibold">{slide.stats}</p>
    </div>
  </div>
);

// ============ TECH ============
const TechContent: React.FC<{ slide: TechSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-cyan-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-cyan-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
      {slide.features.map((feature, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4">
          <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 mb-1 md:mb-2" />
          <h4 className="font-bold text-gray-900 text-xs md:text-sm mb-0.5 md:mb-1">{feature.name}</h4>
          <p className="text-xs text-gray-500">{feature.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-cyan-200 font-semibold">{slide.result}</p>
    </div>
  </div>
);

// ============ BUSINESS ============
const BusinessContent: React.FC<{ slide: BusinessSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-emerald-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-emerald-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
      {slide.revenues.map((revenue, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm md:text-base font-semibold text-gray-900">{revenue.name}</h4>
            <span className="font-bold text-sm md:text-lg" style={{ color: revenue.color }}>
              {revenue.amount}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-emerald-200 font-semibold">{slide.distribution}</p>
    </div>
  </div>
);

// ============ TRACTION ============
const TractionContent: React.FC<{ slide: TractionSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-orange-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-orange-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
      {slide.metrics.map((metric, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
          <p className="text-xs md:text-sm text-gray-500 mb-0.5 md:mb-1">{metric.label}</p>
          <p className="font-black text-lg md:text-2xl text-orange-400">{metric.value}</p>
          <p className="text-xs text-green-400">{metric.growth}</p>
        </div>
      ))}
    </div>

    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-orange-200 font-semibold">{slide.highlight}</p>
    </div>
  </div>
);

// ============ ROADMAP ============
const RoadmapContent: React.FC<{ slide: RoadmapSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-violet-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-violet-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="space-y-3 md:space-y-4">
      {slide.phases.map((phase, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex items-center gap-3 md:gap-4">
            <phase.icon className="w-8 h-8 md:w-10 md:h-10 text-violet-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 md:gap-2">
                <h4 className="font-bold text-gray-900 text-sm md:text-base">{phase.name}</h4>
                <span className="text-xs md:text-sm text-violet-400">{phase.goal}</span>
              </div>
              <p className="text-xs text-gray-500">{phase.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============ TEAM ============
const TeamContent: React.FC<{ slide: TeamSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-indigo-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-indigo-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
      {slide.stats.map((stat, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4">
          <h4 className="font-bold text-gray-900 text-sm md:text-base mb-0.5 md:mb-1">{stat.role}</h4>
          <p className="text-xs md:text-sm text-indigo-300">{stat.detail}</p>
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
      <p className="text-sm md:text-base text-center text-indigo-200 font-semibold">{slide.culture}</p>
    </div>
  </div>
);

// ============ IMPACT ============
const ImpactContent: React.FC<{ slide: ImpactSlide }> = ({ slide }) => (
  <div className="flex flex-col justify-center h-full p-6 md:p-12">
    <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-green-400 mb-4 md:mb-6" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-1 md:mb-2">{slide.title}</h2>
    <p className="text-sm md:text-lg text-green-300 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="space-y-3 md:space-y-4">
      {slide.projections.map((proj, idx) => (
        <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-0.5 md:mb-1">
            <span className="font-bold text-green-400 text-sm md:text-base">{proj.timeline}</span>
            <span className="font-bold text-base md:text-xl text-gray-900">{proj.metric}</span>
          </div>
          <p className="text-xs md:text-sm text-green-300">{proj.equivalent}</p>
        </div>
      ))}
    </div>
  </div>
);

// ============ CTA ============
const CtaContent: React.FC<{ slide: CtaSlide }> = ({ slide }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-12">
    <slide.icon className="w-12 h-12 md:w-16 md:h-16 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-4 md:mb-8" />
    <h2 className="font-bold text-xl md:text-3xl text-gray-900 mb-2 md:mb-4">{slide.title}</h2>
    <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-8">{slide.subtitle}</p>

    <div className="space-y-2 md:space-y-3 mb-4 md:mb-8 text-left w-full max-w-md">
      {slide.actions.map((action, idx) => (
        <div key={idx} className="flex items-center gap-2 md:gap-3">
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 flex-shrink-0" />
          <p className="text-sm md:text-base text-gray-600">{action.text}</p>
        </div>
      ))}
    </div>

    <div className="bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-300">
      <p className="text-base md:text-xl text-gray-900 font-semibold">{slide.punchline}</p>
    </div>
  </div>
);

// ============ MAIN DISPATCHER ============
interface CarouselSlideContentProps {
  slide: Slide;
}

const CarouselSlideContent: React.FC<CarouselSlideContentProps> = ({ slide }) => {
  switch (slide.type) {
    case 'cover':
      return <CoverContent slide={slide} />;
    case 'problem':
      return <ProblemContent slide={slide} />;
    case 'solution':
      return <SolutionContent slide={slide} />;
    case 'verticales':
      return <VerticalesContent slide={slide} />;
    case 'troc':
      return <TrocContent slide={slide} />;
    case 'orchestration':
      return <OrchestrationContent slide={slide} />;
    case 'production':
      return <ProductionContent slide={slide} />;
    case 'tech':
      return <TechContent slide={slide} />;
    case 'business':
      return <BusinessContent slide={slide} />;
    case 'traction':
      return <TractionContent slide={slide} />;
    case 'roadmap':
      return <RoadmapContent slide={slide} />;
    case 'team':
      return <TeamContent slide={slide} />;
    case 'impact':
      return <ImpactContent slide={slide} />;
    case 'cta':
      return <CtaContent slide={slide} />;
    default:
      return null;
  }
};

export default CarouselSlideContent;
