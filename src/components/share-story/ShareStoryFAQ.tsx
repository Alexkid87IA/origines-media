// src/components/share-story/ShareStoryFAQ.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Mon histoire est-elle assez intéressante ?",
    answer: "Absolument. Il n'existe pas d'histoire \"pas assez intéressante\". Ce qui compte, c'est l'authenticité et la sincérité de votre récit. L'important n'est pas d'avoir vécu quelque chose d'extraordinaire, mais de le raconter avec vérité."
  },
  {
    question: "Comment se passe le processus concrètement ?",
    answer: "Tout commence par un échange informel où vous nous parlez de votre histoire. Ensuite, nous choisissons ensemble le format le plus adapté. Notre équipe vous accompagne à chaque étape : préparation, création et relecture."
  },
  {
    question: "Puis-je rester anonyme ou modifier certains détails ?",
    answer: "Oui, bien sûr. Vous pouvez publier sous pseudonyme, flouter votre visage dans les vidéos, ou modifier certains détails si nécessaire. Nous en discutons ensemble pour trouver le bon équilibre entre authenticité et protection de votre vie privée."
  },
  {
    question: "Combien de temps cela prend-il ?",
    answer: "Comptez en moyenne 2 à 4 semaines entre le premier contact et la publication. Ce délai varie selon le format choisi et votre disponibilité. Nous nous adaptons à votre rythme – il n'y a pas de pression."
  },
  {
    question: "Est-ce que ça coûte quelque chose ?",
    answer: "Non, c'est entièrement gratuit. Notre mission est de donner une voix à ceux qui ont quelque chose à partager. Nous nous occupons de tout : accompagnement éditorial, production, publication et diffusion."
  },
  {
    question: "Que se passe-t-il après la publication ?",
    answer: "Votre récit est publié sur notre plateforme et partagé sur nos réseaux sociaux. Vous recevez un lien permanent que vous pouvez partager avec vos proches et accès aux retours des lecteurs."
  }
];

const ShareStoryFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="h-1.5 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6 mx-auto" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-500">
            Tout ce que vous devez savoir avant de vous lancer
          </p>
        </motion.div>

        {/* FAQ items - Glass Cards */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                {/* Floating shadow when open */}
                {isOpen && (
                  <div
                    className="absolute inset-0 rounded-2xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))',
                      transform: 'translateY(8px) scale(0.98)',
                      filter: 'blur(12px)',
                      opacity: 0.8,
                    }}
                  />
                )}

                {/* Glass Card */}
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300
                    ${isOpen
                      ? 'bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] ring-1 ring-violet-200'
                      : 'bg-white/50 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-1 ring-white/60 hover:bg-white/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 flex items-start gap-4 text-left"
                  >
                    {/* Toggle icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                        ${isOpen
                          ? 'bg-violet-600 shadow-lg'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}
                    >
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-white" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg transition-colors ${
                        isOpen ? 'text-violet-600' : 'text-gray-900'
                      }`}>
                        {faq.question}
                      </h3>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-gray-500 mt-4 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-white/80">
            <span className="text-gray-500">Vous avez d'autres questions ?</span>
            <a
              href="mailto:contact@originesmedia.com"
              className="text-violet-600 font-semibold hover:text-violet-700 underline underline-offset-4"
            >
              Contactez-nous
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShareStoryFAQ;
