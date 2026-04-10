// src/components/portrait/PortraitNavigationFooter.tsx
import { Link } from 'react-router-dom';
import { Quote, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { typo } from '../../lib/typography';
import type { HistoireNav, CategoryColors } from './types';

interface Props {
  prevHistoire: HistoireNav | null;
  nextHistoire: HistoireNav | null;
  colors: CategoryColors;
}

export default function PortraitNavigationFooter({ prevHistoire, nextHistoire, colors }: Props) {
  if (!prevHistoire && !nextHistoire) return null;

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Continuer la lecture</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Précédent */}
        {prevHistoire ? (
          <Link
            to={`/histoire/${prevHistoire.slug}`}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: colors.bg,
              boxShadow: `0 4px 20px -4px ${colors.bg}50`
            }}
          >
            <div className="absolute top-0 right-0 opacity-10">
              <Quote className="w-24 h-24 text-white -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/60 mb-3">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Histoire précédente</span>
              </div>
              <h4 className="font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
                {typo(prevHistoire.titre)}
              </h4>
              {prevHistoire.categorie && (
                <span className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/20 text-white/80">
                  {prevHistoire.categorie}
                </span>
              )}
            </div>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, transparent 0%, ${colors.bg}30 100%)` }}
            />
          </Link>
        ) : (
          <div className="rounded-2xl p-6 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-400">Vous êtes au début</span>
          </div>
        )}

        {/* Suivant */}
        {nextHistoire ? (
          <Link
            to={`/histoire/${nextHistoire.slug}`}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: colors.bg,
              boxShadow: `0 4px 20px -4px ${colors.bg}50`
            }}
          >
            <div className="absolute top-0 left-0 opacity-10">
              <Quote className="w-24 h-24 text-white -mt-6 -ml-6 transform scale-x-[-1]" />
            </div>
            <div className="relative z-10 text-right">
              <div className="flex items-center justify-end gap-2 text-white/60 mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Histoire suivante</span>
                <ChevronRight className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
                {typo(nextHistoire.titre)}
              </h4>
              {nextHistoire.categorie && (
                <span className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/20 text-white/80">
                  {nextHistoire.categorie}
                </span>
              )}
            </div>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(225deg, transparent 0%, ${colors.bg}30 100%)` }}
            />
          </Link>
        ) : (
          <div className="rounded-2xl p-6 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-400">Vous êtes à la fin</span>
          </div>
        )}
      </div>

      {/* Retour à la liste */}
      <div className="flex justify-center mt-6">
        <Link
          to="/histoires"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Voir toutes les histoires
        </Link>
      </div>
    </div>
  );
}
