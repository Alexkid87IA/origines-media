import React, { useState } from 'react';
import { Users, Edit3, ExternalLink, Play, Video } from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onClose }) => {
  const [activeVertical, setActiveVertical] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  // Les 10 verticales avec leurs couleurs
  const verticales = [
    { id: 'psychologie', nom: 'PSYCHOLOGIE', color: '#4299E1' },
    { id: 'societe', nom: 'SOCIÉTÉ', color: '#ED8936' },
    { id: 'carriere', nom: 'CARRIÈRE', color: '#4A5568' },
    { id: 'voyage', nom: 'VOYAGE', color: '#48BB78' },
    { id: 'art-creativite', nom: 'ART & CRÉATIVITÉ', color: '#9F7AEA' },
    { id: 'spiritualite', nom: 'SPIRITUALITÉ', color: '#805AD5' },
    { id: 'sante', nom: 'SANTÉ', color: '#38B2AC' },
    { id: 'technologie', nom: 'TECHNOLOGIE', color: '#3182CE' },
    { id: 'relations', nom: 'RELATIONS', color: '#E53E3E' },
    { id: 'environnement', nom: 'ENVIRONNEMENT', color: '#38A169' }
  ];

  // Formats vidéos exclusifs avec couleurs signature
  const formatsExclusifs = [
    { id: 'la-lettre', nom: 'LA LETTRE', color: '#8B5CF6', description: 'Analyses hebdomadaires' },
    { id: 'secrets-pro', nom: 'SECRETS PRO', color: '#EC4899', description: 'Coulisses métiers' },
    { id: 'il-etait-une-fois', nom: 'IL ÉTAIT UNE FOIS', color: '#F59E0B', description: 'Récits narratifs' },
    { id: 'connexion', nom: 'CONNEXION', color: '#10B981', description: 'Rencontres inspirantes' },
    { id: 'transmission', nom: 'TRANSMISSION', color: '#3B82F6', description: 'Savoirs ancestraux' },
    { id: 'etat-esprit', nom: 'ÉTAT D\'ESPRIT', color: '#EF4444', description: 'Mindset & philosophie' },
    { id: 'apparence', nom: 'APPARENCE', color: '#8B5CF6', description: 'Image & authenticité' },
    { id: 'je-suis', nom: 'JE SUIS', color: '#06B6D4', description: 'Identité & transformation' }
  ];

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside 
      className={`
        ${isMobile 
          ? 'relative w-full h-full' 
          : 'fixed top-0 left-0 h-full w-[280px] hidden md:flex'
        } 
        bg-black/50 backdrop-blur-xl border-r border-white/10 z-40
        flex flex-col
      `}
    >
      {/* Zone Supérieure - Branding CENTRÉE */}
      <div className={`${isMobile ? 'p-6' : 'p-5 lg:p-6'} border-b border-white/10 flex justify-center`}>
        <a 
          href="/" 
          onClick={handleLinkClick}
          className="block group"
        >
          <div className="relative overflow-hidden rounded-xl">
            <img
              src="https://26.staticbtf.eno.do/v1/12-default/6b72d83f2de3f869e8fae974e755f62d/media.jpg"
              alt="Origines Media"
              className={`w-full h-auto transition-all duration-500 group-hover:scale-105 mx-auto ${
                isMobile ? 'max-w-[200px]' : 'max-w-[180px]'
              }`}
              style={{
                filter: 'brightness(1.1) contrast(1.05)'
              }}
            />
            
            {/* Subtle Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          </div>
        </a>
      </div>

      {/* Zone Centrale - Navigation Principale */}
      <div className={`flex-1 ${isMobile ? 'p-6' : 'p-5 lg:p-6'} overflow-y-auto scrollbar-hide`}>
        <nav className="space-y-8">
          
          {/* Section 1: Nos Univers */}
          <div>
            <h3 className={`font-montserrat font-bold text-white/60 tracking-[0.2em] uppercase border-b border-white/10 pb-4 ${
              isMobile ? 'text-sm mb-6' : 'text-xs mb-5'
            }`}>
              Nos Univers
            </h3>
            
            <ul className={`${isMobile ? 'space-y-3' : 'space-y-2'}`}>
              {verticales.map((verticale) => (
                <li key={verticale.id}>
                  <a
                    href={`/univers/${verticale.id}`}
                    onClick={handleLinkClick}
                    onMouseEnter={() => setActiveVertical(verticale.id)}
                    onMouseLeave={() => setActiveVertical(null)}
                    className={`
                      group relative flex items-center gap-4 rounded-xl
                      font-inter font-medium text-white transition-all duration-300
                      hover:bg-white/5 hover:scale-[1.02]
                      ${activeVertical === verticale.id ? 'bg-white/5' : ''}
                      ${isMobile ? 'py-3 px-4' : 'py-2.5 px-3'}
                    `}
                    style={{
                      fontSize: isMobile ? '0.9rem' : '0.8rem'
                    }}
                  >
                    {/* Indicateur de couleur */}
                    <div 
                      className={`
                        rounded-full transition-all duration-300 flex-shrink-0
                        ${activeVertical === verticale.id ? 'scale-125 shadow-lg' : 'scale-100'}
                        ${isMobile ? 'w-3 h-3' : 'w-2 h-2'}
                      `}
                      style={{
                        backgroundColor: verticale.color,
                        boxShadow: activeVertical === verticale.id ? `0 0 12px ${verticale.color}60` : 'none'
                      }}
                    />
                    
                    {/* Nom de la verticale */}
                    <span 
                      className={`
                        transition-all duration-300 tracking-wide flex-1 min-w-0
                        ${activeVertical === verticale.id ? 'text-white' : 'text-white/80 group-hover:text-white'}
                        ${isMobile ? 'font-medium' : ''}
                      `}
                      style={{
                        color: activeVertical === verticale.id ? verticale.color : undefined,
                        lineHeight: '1.3'
                      }}
                    >
                      {verticale.nom}
                    </span>

                    {/* Icône externe au hover */}
                    <ExternalLink 
                      className={`
                        flex-shrink-0 transition-all duration-300
                        ${activeVertical === verticale.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                        ${isMobile ? 'w-4 h-4' : 'w-3 h-3'}
                      `}
                      style={{
                        color: verticale.color
                      }}
                    />

                    {/* Glow effect au hover */}
                    <div 
                      className={`
                        absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
                        ${activeVertical === verticale.id ? 'opacity-100' : 'opacity-0'}
                      `}
                      style={{
                        background: `linear-gradient(90deg, ${verticale.color}10 0%, transparent 100%)`,
                        border: `1px solid ${verticale.color}20`
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Formats Vidéos Exclusifs */}
          <div>
            <h3 className={`font-montserrat font-bold text-white/60 tracking-[0.2em] uppercase border-b border-white/10 pb-4 ${
              isMobile ? 'text-sm mb-6' : 'text-xs mb-5'
            }`}>
              <div className="flex items-center gap-2">
                <Video className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                <span>Formats Exclusifs</span>
              </div>
            </h3>
            
            <ul className={`${isMobile ? 'space-y-3' : 'space-y-2'}`}>
              {formatsExclusifs.map((format) => (
                <li key={format.id}>
                  <a
                    href={`/format/${format.id}`}
                    onClick={handleLinkClick}
                    onMouseEnter={() => setActiveFormat(format.id)}
                    onMouseLeave={() => setActiveFormat(null)}
                    className={`
                      group relative flex items-center gap-3 rounded-xl
                      font-inter font-medium text-white transition-all duration-300
                      hover:bg-white/5 hover:scale-[1.02]
                      ${activeFormat === format.id ? 'bg-white/5' : ''}
                      ${isMobile ? 'py-3 px-4' : 'py-2.5 px-3'}
                    `}
                    style={{
                      fontSize: isMobile ? '0.85rem' : '0.75rem'
                    }}
                  >
                    {/* Icône Play avec couleur dynamique */}
                    <div 
                      className={`
                        rounded-full transition-all duration-300 flex-shrink-0 flex items-center justify-center
                        ${activeFormat === format.id ? 'scale-125 shadow-lg' : 'scale-100'}
                        ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                      `}
                      style={{
                        backgroundColor: activeFormat === format.id ? `${format.color}30` : `${format.color}20`,
                        boxShadow: activeFormat === format.id ? `0 0 12px ${format.color}60` : 'none'
                      }}
                    >
                      <Play 
                        className={`${isMobile ? 'w-2.5 h-2.5' : 'w-2 h-2'} ml-0.5`}
                        style={{ color: format.color }}
                      />
                    </div>
                    
                    {/* Contenu du format */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className={`
                          transition-all duration-300 tracking-wide font-bold
                          ${activeFormat === format.id ? 'text-white' : 'text-white/80 group-hover:text-white'}
                        `}
                        style={{
                          color: activeFormat === format.id ? format.color : undefined,
                          lineHeight: '1.2'
                        }}
                      >
                        {format.nom}
                      </div>
                      {isMobile && (
                        <div className="text-white/50 text-xs mt-1 leading-tight">
                          {format.description}
                        </div>
                      )}
                    </div>

                    {/* Badge "NOUVEAU" pour certains formats */}
                    {['secrets-pro', 'je-suis', 'apparence'].includes(format.id) && (
                      <div className="flex-shrink-0">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                          style={{
                            backgroundColor: `${format.color}20`,
                            color: format.color,
                            fontSize: isMobile ? '0.6rem' : '0.55rem'
                          }}
                        >
                          NEW
                        </span>
                      </div>
                    )}

                    {/* Glow effect au hover */}
                    <div 
                      className={`
                        absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
                        ${activeFormat === format.id ? 'opacity-100' : 'opacity-0'}
                      `}
                      style={{
                        background: `linear-gradient(90deg, ${format.color}10 0%, transparent 100%)`,
                        border: `1px solid ${format.color}20`
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Zone Inférieure - CTAs Seulement */}
      <div className={`${isMobile ? 'p-6 space-y-4' : 'p-5 lg:p-6 space-y-4'} border-t border-white/10`}>
        
        {/* CTA Principal - Pour le public */}
        <a
          href="/rejoindre"
          onClick={handleLinkClick}
          className={`group relative block w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-inter font-bold tracking-widest uppercase text-center rounded-xl transition-all duration-500 hover:from-violet-500 hover:to-fuchsia-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25 overflow-hidden ${
            isMobile ? 'py-4 px-6 text-sm' : 'py-3.5 px-5 text-xs'
          }`}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Users className={`group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            <span>Rejoindre la Communauté</span>
          </div>
        </a>

        {/* CTA Secondaire - Pour les contributeurs */}
        <a
          href="/proposer-histoire"
          onClick={handleLinkClick}
          className={`group relative block w-full bg-transparent border border-fuchsia-500 text-fuchsia-400 font-inter font-medium tracking-widest uppercase text-center rounded-xl transition-all duration-500 hover:bg-fuchsia-500 hover:text-white hover:scale-105 hover:shadow-2xl hover:shadow-fuchsia-500/25 overflow-hidden ${
            isMobile ? 'py-4 px-6 text-sm' : 'py-3.5 px-5 text-xs'
          }`}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 bg-fuchsia-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Edit3 className={`group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            <span>Proposer mon Histoire</span>
          </div>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;