// src/components/article/Accordion.tsx
// Composants d'accordéon pour les articles

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import { PortableText } from '@portabletext/react';

// Helper to extract text from Sanity block or return string
export const extractText = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.text && typeof value.text === 'string') {
    return value.text;
  }
  if (value?.children && Array.isArray(value.children)) {
    return value.children.map((child: any) => child.text || '').join('');
  }
  if (Array.isArray(value)) {
    return value.map((block: any) => {
      if (typeof block === 'string') return block;
      if (block?.text) return block.text;
      if (block?.children && Array.isArray(block.children)) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    }).join(' ');
  }
  return '';
};

// Single Accordion Item Component
interface AccordionItemProps {
  question: string;
  answer: any;
  defaultOpen?: boolean;
  index?: number;
  style?: string;
  isLast?: boolean;
  themeColor?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  defaultOpen = false,
  index,
  style = 'simple',
  isLast = false,
  themeColor = '#8B5CF6'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const renderAnswer = () => {
    if (!answer) return null;
    if (typeof answer === 'string') {
      return <p className="text-gray-600 leading-relaxed text-[15px]">{answer}</p>;
    }
    if (Array.isArray(answer)) {
      const hasPortableText = answer.some((item: any) => item?._type);
      if (hasPortableText) {
        return (
          <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
            <PortableText value={answer} />
          </div>
        );
      }
    }
    if (answer?._type === 'block') {
      return (
        <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
          <PortableText value={[answer]} />
        </div>
      );
    }
    const text = extractText(answer);
    return text ? <p className="text-gray-600 leading-relaxed text-[15px]">{text}</p> : null;
  };

  return (
    <motion.div
      className={`relative ${!isLast ? 'border-b border-gray-100' : ''}`}
      initial={false}
    >
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
        style={{ backgroundColor: themeColor }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          scaleY: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-5 px-6 text-left gap-4 transition-all duration-200 ${
          isOpen ? 'bg-gradient-to-r from-gray-50/80 to-transparent' : 'hover:bg-gray-50/50'
        }`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {style === 'numbered' && index !== undefined && (
            <motion.span
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
              style={{
                backgroundColor: isOpen ? themeColor : '#F3F4F6',
                color: isOpen ? 'white' : '#6B7280'
              }}
              animate={{
                scale: isOpen ? 1.05 : 1,
                backgroundColor: isOpen ? themeColor : '#F3F4F6'
              }}
              transition={{ duration: 0.2 }}
            >
              {index + 1}
            </motion.span>
          )}
          <span className={`font-semibold text-[17px] transition-colors duration-200 ${
            isOpen ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {question}
          </span>
        </div>

        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isOpen ? 'bg-gray-900' : 'bg-gray-100'
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${
            isOpen ? 'text-white' : 'text-gray-500'
          }`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 ${style === 'numbered' ? 'pl-[72px]' : 'pl-6'}`}>
              <div className="pt-1">
                {renderAnswer()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Single Accordion Fallback Component
interface SingleAccordionProps {
  value: any;
  themeColor?: string;
}

export const SingleAccordion: React.FC<SingleAccordionProps> = ({ value, themeColor = '#8B5CF6' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const rawTitle = value.title || value.heading || value.question || value.label || 'Voir plus';
  const rawContent = value.content || value.body || value.answer || value.text || value.description;
  const title = typeof rawTitle === 'string' ? rawTitle : extractText(rawTitle);

  const renderContent = () => {
    if (!rawContent) return <p className="text-gray-400 italic">Contenu non disponible</p>;
    if (typeof rawContent === 'string') return <p className="text-gray-600 leading-relaxed text-[15px]">{rawContent}</p>;
    if (Array.isArray(rawContent)) {
      const hasPortableText = rawContent.some((item: any) => item?._type);
      if (hasPortableText) {
        return (
          <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
            <PortableText value={rawContent} />
          </div>
        );
      }
    }
    const text = extractText(rawContent);
    return text ? <p className="text-gray-600 leading-relaxed text-[15px]">{text}</p> : null;
  };

  return (
    <motion.div
      className="my-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100"
      initial={false}
      animate={{
        boxShadow: isOpen
          ? '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 text-left gap-4 transition-all duration-200 ${
          isOpen ? 'bg-gradient-to-r from-gray-50 to-white' : 'hover:bg-gray-50/50'
        }`}
      >
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${themeColor}15` }}
            animate={{ scale: isOpen ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-5 h-5" style={{ color: themeColor }} />
            </motion.div>
          </motion.div>
          <span className={`font-semibold text-lg transition-colors duration-200 ${
            isOpen ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {title}
          </span>
        </div>

        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isOpen ? 'bg-gray-900' : 'bg-gray-100'
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${
            isOpen ? 'text-white' : 'text-gray-500'
          }`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[72px]">
              <div className="pt-2 border-t border-gray-100">
                <div className="pt-4">
                  {renderContent()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Accordion Group Component
interface AccordionBlockProps {
  value: any;
  themeColor?: string;
}

export const AccordionBlock: React.FC<AccordionBlockProps> = ({ value, themeColor = '#8B5CF6' }) => {
  const items = value.items || value.accordions || value.sections || [];
  const groupTitle = value.title || value.heading;
  const style = value.style || 'simple';

  if (Array.isArray(items) && items.length > 0) {
    return (
      <div className="my-10">
        {groupTitle && (
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: themeColor }}
            />
            <h4 className="text-xl font-bold text-gray-900">{groupTitle}</h4>
          </div>
        )}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
          {items.map((item: any, index: number) => (
            <AccordionItem
              key={item._key || index}
              question={item.question || item.title || item.heading || `Question ${index + 1}`}
              answer={item.answer || item.content || item.body || item.text}
              defaultOpen={item.defaultOpen || false}
              index={index}
              style={style}
              isLast={index === items.length - 1}
              themeColor={themeColor}
            />
          ))}
        </div>
      </div>
    );
  }

  return <SingleAccordion value={value} themeColor={themeColor} />;
};

export default AccordionBlock;
