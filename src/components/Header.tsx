'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS: [string, string][] = [
  ['How It Works', '#how-it-works'],
  ['Industries', '#industries'],
  ['Examples', '#case-studies'],
  ['FAQ', '#faq'],
];

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id.replace('#', ''));
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-secondary-100/95 backdrop-blur-md border-b border-secondary-200">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div
          className="logo text-2xl leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          SloCal <span> Fulfillment</span>
        </motion.div>

        <div className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map(([label, href]) => (
            <button
              key={href}
              onClick={() => scrollToSection(href)}
              className="text-sm font-medium text-primary-700 hover:text-accent-orange transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn btn-primary text-sm"
          >
            Get Free Consultation
          </button>
        </div>

        <button
          className="md:hidden text-primary-700"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {menuOpen && (
        <motion.div
          className="md:hidden bg-secondary-100 border-t border-secondary-200 px-6 py-4 flex flex-col gap-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {NAV_LINKS.map(([label, href]) => (
            <button
              key={href}
              onClick={() => scrollToSection(href)}
              className="text-left text-sm font-medium text-primary-700"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn btn-primary text-sm w-full"
          >
            Get Free Consultation
          </button>
        </motion.div>
      )}
    </header>
  );
};
