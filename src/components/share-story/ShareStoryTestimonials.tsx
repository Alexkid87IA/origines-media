// src/components/share-story/ShareStoryTestimonials.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  univers: string;
  universColor: string;
  slug: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marie Dufour',
    role: 'Ancienne cadre devenue artisane',
    quote: 'Raconter mon histoire m\'a permis de tourner une page et d\'en inspirer d\'autres.',
    image: '/placeholder.svg',
    univers: 'Carrière',
    universColor: '#06B6D4',
    slug: 'marie-reconversion-ceramiste'
  },
  {
    id: '2',
    name: 'Thomas Leroux',
    role: 'Voyageur et écrivain',
    quote: 'Mon voyage de 2 ans à vélo a transformé ma vision du monde à jamais.',
    image: '/placeholder.svg',
    univers: 'Voyage',
    universColor: '#10B981',
    slug: 'thomas-voyage-asie-velo'
  },
  {
    id: '3',
    name: 'Sophie Martin',
    role: 'Psychologue et autrice',
    quote: 'Partager mon burnout a aidé des centaines de personnes à se reconnaître.',
    image: '/placeholder.svg',
    univers: 'Psychologie',
    universColor: '#4F46E5',
    slug: 'sophie-burnout-renaissance'
  },
  {
    id: '4',
    name: 'Karim Benali',
    role: 'Entrepreneur social',
    quote: 'Mon échec entrepreneurial est devenu ma plus grande leçon de vie.',
    image: '/placeholder.svg',
    univers: 'Société',
    universColor: '#F59E0B',
    slug: 'karim-echec-succes-entrepreneur'
  }
];

const ShareStoryTestimonials: React.FC = () => {
  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <section id="temoignages" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="h-1.5 w-16 bg-gradient-to-r from-violet-500 to-rose-500 rounded-full mb-6 mx-auto" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Des récits qui{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-500">
              inspirent
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Découvrez les parcours de ceux qui ont osé partager leur histoire
          </p>
        </motion.div>

        {/* Featured testimonial - Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8, transition: { duration: 0.25 } }}
          className="mb-8 relative group"
        >
          {/* Floating shadow */}
          <div
            className="absolute inset-0 rounded-[32px] transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${featured.universColor}20, ${featured.universColor}05)`,
              transform: 'translateY(16px) scale(0.96)',
              filter: 'blur(24px)',
              opacity: 0.8,
            }}
          />

          {/* Glass Card */}
          <div className="relative rounded-[32px] overflow-hidden
            bg-white/70 backdrop-blur-xl
            shadow-[0_8px_40px_rgba(0,0,0,0.1)]
            ring-1 ring-white/80
            transition-all duration-300
            group-hover:shadow-[0_24px_80px_rgba(0,0,0,0.15)]
            group-hover:ring-white
          ">
            <div className="grid lg:grid-cols-2">
              {/* Image side */}
              <div className="relative h-64 lg:h-auto lg:min-h-[400px] m-2 rounded-[24px] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badge */}
                <div
                  className="absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md"
                  style={{ backgroundColor: `${featured.universColor}e6` }}
                >
                  {featured.univers}
                </div>

                {/* Name overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-bold text-xl text-white">{featured.name}</div>
                  <div className="text-white/70 text-sm">{featured.role}</div>
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Quote className="w-12 h-12 text-violet-300 mb-6" />

                <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed mb-8">
                  "{featured.quote}"
                </blockquote>

                <Link
                  to={`/histoire/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold w-fit
                    shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                    hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
                    hover:-translate-y-0.5
                    transition-all duration-300"
                >
                  Lire son histoire
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other testimonials - Symmetric Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {others.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="relative group"
            >
              {/* Floating shadow */}
              <div
                className="absolute inset-0 rounded-3xl transition-all duration-300 group-hover:opacity-80"
                style={{
                  background: `linear-gradient(135deg, ${testimonial.universColor}25, ${testimonial.universColor}08)`,
                  transform: 'translateY(12px) scale(0.94)',
                  filter: 'blur(16px)',
                  opacity: 0.6,
                }}
              />

              <Link to={`/histoire/${testimonial.slug}`} className="block h-full">
                {/* Glass Card */}
                <div className="relative h-full rounded-3xl overflow-hidden
                  bg-white/70 backdrop-blur-xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                  ring-1 ring-white/80
                  transition-all duration-300
                  group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                  group-hover:ring-white
                  group-hover:bg-white/80
                ">
                  {/* Image */}
                  <div className="relative h-48 m-2 rounded-2xl overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Badge */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md"
                      style={{ backgroundColor: `${testimonial.universColor}e6` }}
                    >
                      {testimonial.univers}
                    </div>

                    {/* Name overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-white/70 text-sm">{testimonial.role}</div>
                    </div>
                  </div>

                  {/* Content - Fixed height */}
                  <div className="p-5 pt-3">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[60px]">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center text-sm font-semibold text-violet-600 group-hover:text-violet-700">
                      Découvrir son histoire
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-6">
            Vous aussi, vous avez une histoire à raconter ?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full
              bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold
              shadow-[0_8px_32px_rgba(124,58,237,0.35)]
              hover:shadow-[0_12px_40px_rgba(124,58,237,0.45)]
              hover:-translate-y-0.5
              transition-all duration-300"
          >
            Proposer mon histoire
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ShareStoryTestimonials;
