// src/components/portrait/PortraitSidebar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, List, ChevronDown, ChevronUp,
  Quote, PenLine, ArrowRight
} from 'lucide-react';
import { typo } from '../../lib/typography';
import { getTagCategory, getCategoryColors } from '../../lib/tagCategories';
import type { HistoireNav, SimilarHistoire, Heading, CategoryColors } from './types';

interface Props {
  currentIndex: number;
  totalHistoires: number;
  prevHistoire: HistoireNav | null;
  nextHistoire: HistoireNav | null;
  headings: Heading[];
  activeHeading: string;
  onScrollToSection: (id: string) => void;
  similarHistoires: SimilarHistoire[];
  colors: CategoryColors;
}

export default function PortraitSidebar({
  currentIndex, totalHistoires, prevHistoire, nextHistoire,
  headings, activeHeading, onScrollToSection,
  similarHistoires, colors
}: Props) {
  const [tocExpanded, setTocExpanded] = useState(false);

  return (
    <div className="sticky top-24 space-y-4">
      {/* Navigation rapide */}
      {currentIndex >= 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 p-4" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>Histoire {currentIndex + 1} / {totalHistoires}</span>
          </div>
          <div className="flex gap-2">
            {prevHistoire ? (
              <Link
                to={`/histoire/${prevHistoire.slug}`}
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="truncate">Précédente</span>
              </Link>
            ) : (
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-300 text-sm cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                <span>Précédente</span>
              </div>
            )}
            {nextHistoire ? (
              <Link
                to={`/histoire/${nextHistoire.slug}`}
                className="flex-1 flex items-center justify-end gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <span className="truncate">Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex-1 flex items-center justify-end gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-300 text-sm cursor-not-allowed">
                <span>Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table des matières */}
      {headings.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 overflow-hidden" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setTocExpanded(!tocExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sommaire</span>
            </div>
            {tocExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {tocExpanded && (
            <nav className="p-3 max-h-64 overflow-y-auto">
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => onScrollToSection(heading.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeHeading === heading.id
                          ? 'font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        paddingLeft: `${12 + (heading.level - 1) * 12}px`,
                        color: activeHeading === heading.id ? colors.bg : undefined,
                        backgroundColor: activeHeading === heading.id ? `${colors.bg}10` : undefined
                      }}
                    >
                      <span className="line-clamp-2">{heading.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* Histoires similaires */}
      {similarHistoires.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 overflow-hidden" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Histoires similaires
            </h3>
          </div>
          <div className="p-3 space-y-2">
            {similarHistoires.slice(0, 4).map((histoire) => {
              const histoireCategory = histoire.tags?.[0] ? getTagCategory(histoire.tags[0].slug) : null;
              const histoireColors = histoireCategory ? getCategoryColors(histoireCategory.id) : colors;
              const histoireSlug = typeof histoire.slug === 'string' ? histoire.slug : histoire.slug?.current;

              if (!histoireSlug) return null;

              return (
                <Link
                  key={histoire._id}
                  to={`/histoire/${histoireSlug}`}
                  className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${histoireColors.bg}15` }}
                    >
                      <Quote className="w-4 h-4" style={{ color: histoireColors.bg }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {typo(histoire.titre)}
                      </h4>
                      {histoire.citation && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
                          &ldquo;{histoire.citation}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            to="/histoires"
            className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 text-sm font-medium hover:bg-gray-50 transition-colors"
            style={{ color: colors.bg }}
          >
            Voir toutes les histoires
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* CTA Raconter */}
      <div
        className="p-4 rounded-2xl ring-1 ring-gray-200/50"
        style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <PenLine className="w-4 h-4" style={{ color: colors.bg }} />
          <h4 className="font-semibold text-gray-900 text-sm">
            Vous avez une histoire ?
          </h4>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {typo("Partagez votre parcours et inspirez des milliers de lecteurs.")}
        </p>
        <Link
          to="/racontez-votre-histoire"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-full transition-all hover:opacity-90"
          style={{ backgroundColor: colors.bg }}
        >
          Racontez la vôtre
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
