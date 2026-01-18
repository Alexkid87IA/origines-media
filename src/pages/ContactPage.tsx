// src/pages/ContactPage.tsx
// Design épuré - Style minimaliste blanc

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Send, MessageSquare, User, AtSign,
  CheckCircle, Instagram, Youtube, Twitter, MapPin, Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const subjects = [
    "Question générale",
    "Proposer mon histoire",
    "Partenariat / Collaboration",
    "Problème technique",
    "Suggestion",
    "Autre"
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/originesmedia', color: '#E1306C' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/originesmedia', color: '#FF0000' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/originesmedia', color: '#1DA1F2' },
  ];

  const TikTokIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Contact"
        description="Contactez l'équipe Origines Media. Une question, une suggestion ou envie de partager votre histoire ? Nous sommes là pour vous écouter."
        url="/contact"
      />
      <Navbar />

      <main>
        {/* Hero Section - Compact */}
        <section className="py-4 lg:py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
                  Contact
                </h1>
                <p className="text-gray-500 text-xs">
                  Une question ? Nous sommes là pour vous
                </p>
              </div>

              {/* Quick info inline */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                  <Clock className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="text-[9px] font-semibold text-emerald-700">Réponse sous 48h</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section - Compact */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

              {/* Form Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3"
              >
                {!isSubmitted ? (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">Envoyez-nous un message</h2>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Name Field */}
                        <div>
                          <label htmlFor="name" className="block text-[10px] font-medium text-gray-700 mb-1">
                            Votre nom *
                          </label>
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-gray-300">
                            <User className="ml-2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="flex-1 px-2 py-2 bg-transparent text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none"
                              placeholder="Jean Dupont"
                            />
                          </div>
                        </div>

                        {/* Email Field */}
                        <div>
                          <label htmlFor="email" className="block text-[10px] font-medium text-gray-700 mb-1">
                            Votre email *
                          </label>
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-gray-300">
                            <AtSign className="ml-2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="flex-1 px-2 py-2 bg-transparent text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none"
                              placeholder="votre@email.com"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subject Field */}
                      <div>
                        <label htmlFor="subject" className="block text-[10px] font-medium text-gray-700 mb-1">
                          Sujet
                        </label>
                        <div className="relative">
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none cursor-pointer"
                          >
                            <option value="">Sélectionnez un sujet</option>
                            {subjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="block text-[10px] font-medium text-gray-700 mb-1">
                          Votre message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          required
                          rows={4}
                          className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
                          placeholder="Décrivez votre demande..."
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                        className="w-full py-2 px-4 bg-gray-900 text-white text-[11px] font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Envoi...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span>Envoyer</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Success State - Compact */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl p-6 text-center border border-emerald-100"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      Message envoyé !
                    </h3>

                    <p className="text-gray-500 text-xs mb-4">
                      Merci ! Nous vous répondrons sous 48h.
                    </p>

                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-medium rounded-lg hover:bg-gray-200 transition-all"
                    >
                      <span>Nouveau message</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>

              {/* Info Column - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 space-y-2"
              >
                {/* Email Direct Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[11px] text-gray-900">Email direct</h3>
                      <a
                        href="mailto:contact@originesmedia.com"
                        className="text-[10px] text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        contact@originesmedia.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-fuchsia-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[11px] text-gray-900">Basés en France</h3>
                      <p className="text-[10px] text-gray-500">Paris, France</p>
                    </div>
                  </div>
                </div>

                {/* Social Links Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <h3 className="font-semibold text-[11px] text-gray-900 mb-2">Suivez-nous</h3>
                  <div className="flex gap-1.5">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white transition-all hover:scale-105"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = social.color;
                            e.currentTarget.style.borderColor = social.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                            e.currentTarget.style.borderColor = '';
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </a>
                      );
                    })}
                    <a
                      href="https://tiktok.com/@originesmedia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-black transition-all hover:scale-105"
                    >
                      <TikTokIcon />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
