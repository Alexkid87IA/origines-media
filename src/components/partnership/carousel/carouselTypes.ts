import type { LucideIcon } from 'lucide-react';

// ============ SLIDE TYPES ============

export interface SlideBase {
  id: number;
  title: string;
  subtitle: string;
  bgGradient: string;
  icon: LucideIcon;
}

export interface SlideComponent {
  icon: LucideIcon;
  label: string;
  desc: string;
}

export interface SlideVerticale {
  name: string;
  metric: string;
  sponsor: string;
  color: string;
}

export interface SlideEcosystemStep {
  step: string;
  desc: string;
  icon: LucideIcon;
}

export interface SlideFlowStep {
  source: string;
  action: string;
  result: string;
  icon: LucideIcon;
}

export interface SlideOutput {
  format: string;
  detail: string;
}

export interface SlideFeature {
  name: string;
  desc: string;
  icon: LucideIcon;
}

export interface SlideRevenue {
  name: string;
  amount: string;
  color: string;
}

export interface SlideMetric {
  label: string;
  value: string;
  growth: string;
}

export interface SlidePhase {
  name: string;
  goal: string;
  desc: string;
  icon: LucideIcon;
}

export interface SlideStat {
  role: string;
  detail: string;
}

export interface SlideProjection {
  timeline: string;
  metric: string;
  equivalent: string;
}

export interface SlideAction {
  text: string;
}

export interface CoverSlide extends SlideBase {
  type: 'cover';
  punchline: string;
}

export interface ProblemSlide extends SlideBase {
  type: 'problem';
  points: string[];
  conclusion: string;
}

export interface SolutionSlide extends SlideBase {
  type: 'solution';
  components: SlideComponent[];
  flow: string;
}

export interface VerticalesSlide extends SlideBase {
  type: 'verticales';
  verticales: SlideVerticale[];
  total: string;
}

export interface TrocSlide extends SlideBase {
  type: 'troc';
  ecosystem: SlideEcosystemStep[];
  stats: {
    monthly: string;
    value: string;
    impact: string;
  };
}

export interface OrchestrationSlide extends SlideBase {
  type: 'orchestration';
  flow: SlideFlowStep[];
  magic: string;
}

export interface ProductionSlide extends SlideBase {
  type: 'production';
  formula: {
    input: string;
    outputs: SlideOutput[];
  };
  stats: string;
}

export interface TechSlide extends SlideBase {
  type: 'tech';
  features: SlideFeature[];
  result: string;
}

export interface BusinessSlide extends SlideBase {
  type: 'business';
  revenues: SlideRevenue[];
  distribution: string;
}

export interface TractionSlide extends SlideBase {
  type: 'traction';
  metrics: SlideMetric[];
  highlight: string;
}

export interface RoadmapSlide extends SlideBase {
  type: 'roadmap';
  phases: SlidePhase[];
}

export interface TeamSlide extends SlideBase {
  type: 'team';
  stats: SlideStat[];
  culture: string;
}

export interface ImpactSlide extends SlideBase {
  type: 'impact';
  projections: SlideProjection[];
}

export interface CtaSlide extends SlideBase {
  type: 'cta';
  actions: SlideAction[];
  punchline: string;
}

export type Slide = CoverSlide | ProblemSlide | SolutionSlide | VerticalesSlide | TrocSlide | OrchestrationSlide | ProductionSlide | TechSlide | BusinessSlide | TractionSlide | RoadmapSlide | TeamSlide | ImpactSlide | CtaSlide;
