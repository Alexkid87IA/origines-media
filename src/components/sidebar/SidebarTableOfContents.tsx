// src/components/sidebar/SidebarTableOfContents.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown } from 'lucide-react';
import { Heading } from '../article/types';

interface Props {
  headings: Heading[];
  activeHeading: string;
  onScrollToSection: (id: string) => void;
}

export default function SidebarTableOfContents({ headings, activeHeading, onScrollToSection }: Props) {
  const [tocExpanded, setTocExpanded] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setTocExpanded(!tocExpanded)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <span className="text-gray-900 font-bold flex items-center gap-2 text-sm">
          <List className="w-4 h-4 text-violet-500" />
          Sommaire
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${tocExpanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {tocExpanded && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 overflow-hidden"
          >
            {(() => {
              let h2Index = 0;
              return headings.map((heading) => {
                const isH2 = heading.level === 2;
                const isActive = activeHeading === heading.id;
                if (isH2) h2Index++;

                return (
                  <button
                    key={heading.id}
                    onClick={() => onScrollToSection(heading.id)}
                    className={`group flex items-start gap-2.5 w-full text-left transition-all duration-300 ${
                      isH2 ? 'py-2.5' : 'py-1.5 ml-7'
                    }`}
                  >
                    {isH2 ? (
                      <>
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                              isActive
                                ? 'bg-violet-500 text-white'
                                : 'bg-violet-100 text-violet-600 group-hover:bg-violet-200'
                          }`}
                        >
                          {h2Index}
                        </span>
                        <span
                          className={`text-xs leading-tight transition-colors ${
                            isActive
                              ? 'text-violet-600 font-semibold'
                              : 'text-gray-700 group-hover:text-gray-900 font-medium'
                          }`}
                        >
                          {heading.text}
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 transition-all ${
                            isActive
                              ? 'bg-violet-500'
                              : 'bg-gray-300 group-hover:bg-gray-400'
                          }`}
                        />
                        <span
                          className={`text-[11px] leading-tight transition-colors ${
                            isActive
                              ? 'text-violet-600 font-medium'
                              : 'text-gray-500 group-hover:text-gray-700'
                          }`}
                        >
                          {heading.text}
                        </span>
                      </>
                    )}
                  </button>
                );
              });
            })()}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
