// src/components/EngagementSection.tsx
// Section Académie - Cartes Premium avec images

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Check } from 'lucide-react';
import { typo } from '../lib/typography';

// Produits de l'Académie
const academyProducts = [
  {
    id: 'kit-introspection',
    title: "Kit d'Introspection",
    subtitle: 'Votre voyage intérieur commence ici',
    description: '24 pages d\'exercices pour mieux vous connaître.',
    image: '/kit-introspection.jpg',
    price: 'Gratuit',
    originalPrice: null,
    color: '#06B6D4', // Cyan
    href: '/academie/kit-introspection',
    tag: 'Gratuit',
    tagColor: '#10B981',
    benefits: ['24 pages de contenu', 'Exercices pratiques', 'Téléchargement immédiat'],
  },
  {
    id: 'masterclass-storytelling',
    title: 'Masterclass Storytelling',
    subtitle: "L'art de raconter votre histoire",
    description: 'Apprenez à captiver et structurer vos récits.',
    image: '/academy/masterclass-storytelling.jpg',
    price: '29€',
    originalPrice: '49€',
    color: '#F59E0B', // Amber
    href: '/academie/masterclass-storytelling',
    tag: '-40%',
    tagColor: '#EF4444',
    benefits: ['3h de vidéo HD', 'Workbook inclus', 'Accès à vie'],
  },
  {
    id: 'guide-mindset',
    title: 'Guide Mindset',
    subtitle: 'Transformez votre mental',
    description: 'Développez un état d\'esprit de croissance.',
    image: '/academy/guide-mindset.jpg',
    price: '19€',
    originalPrice: null,
    color: '#8B5CF6', // Violet
    href: '/academie/guide-mindset',
    tag: 'Nouveau',
    tagColor: '#8B5CF6',
    benefits: ['Guide PDF complet', '12 exercices', 'Audio méditations'],
  },
  {
    id: 'programme-complet',
    title: 'Programme Complet',
    subtitle: 'Accès illimité à vie',
    description: 'Toutes nos formations en un seul pass.',
    image: '/academy/programme-complet.jpg',
    price: '79€',
    originalPrice: '147€',
    color: '#EC4899', // Pink
    href: '/academie/programme-complet',
    tag: 'Best-seller',
    tagColor: '#EC4899',
    benefits: ['Tout le catalogue', 'Mises à jour gratuites', 'Communauté privée'],
  },
];

// Composant carte produit Premium
interface ProductCardProps {
  product: typeof academyProducts[0];
  index: number;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={product.href}
        className="group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
        style={{
          backgroundColor: 'white',
          boxShadow: isHovered
            ? `0 25px 50px -12px ${product.color}40, 0 0 0 2px ${product.color}`
            : '0 4px 20px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image du produit */}
        <div
          className="relative aspect-[4/3] overflow-hidden flex-shrink-0"
          style={{ backgroundColor: `${product.color}15` }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Tag promo */}
          {product.tag && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
              <span
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-lg"
                style={{ backgroundColor: product.tagColor }}
              >
                {product.tag}
              </span>
            </div>
          )}

        </div>

        {/* Contenu */}
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          {/* Titre + Sous-titre - Hauteur fixe pour harmoniser */}
          <div className="min-h-[52px] sm:min-h-[60px] mb-2 sm:mb-3">
            <h3
              className="text-sm sm:text-base font-bold mb-0.5 sm:mb-1 transition-colors duration-300"
              style={{ color: isHovered ? product.color : '#111827' }}
            >
              {product.title}
            </h3>
            <p className="text-gray-500 text-[10px] sm:text-xs">
              {product.subtitle}
            </p>
          </div>

          {/* Bénéfices */}
          <div className="space-y-1 sm:space-y-1.5 flex-1">
            {product.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                <Check className="w-3 h-3 flex-shrink-0" style={{ color: product.color }} />
                <span className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-1">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Prix et CTA */}
          <div
            className="flex items-center justify-between pt-3 mt-3 border-t"
            style={{ borderColor: `${product.color}15` }}
          >
            <div className="flex items-baseline gap-1">
              <span
                className="text-lg sm:text-xl font-bold"
                style={{ color: product.color }}
              >
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <span
              className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold transition-all duration-300"
              style={{
                backgroundColor: isHovered ? product.color : `${product.color}15`,
                color: isHovered ? 'white' : product.color
              }}
            >
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const EngagementSection: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 bg-amber-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Apprendre</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Notre Académie
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {typo("Des ressources premium pour votre développement personnel. Guides, masterclasses et programmes complets créés par des experts.")}
            </p>
          </div>

          <Link
            to="/academie"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
          >
            <span>Voir l'Académie</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grille de produits - 2 sur mobile, 4 sur desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {academyProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Footer stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              2,500+ apprenants
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              4.9/5 de satisfaction
            </span>
            <span className="hidden sm:flex text-[10px] sm:text-xs text-gray-400 items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-violet-500" />
              Garantie satisfait ou remboursé
            </span>
          </div>

          <Link
            to="/academie"
            className="text-xs font-semibold text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            Tout découvrir
            <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EngagementSection;
