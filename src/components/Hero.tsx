'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const STATS: string[] = [
  '100% Free to Brands',
  'SoCal Network',
  'Matched in Days',
  'No Contracts Required',
];

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-36 pb-20 px-6 bg-secondary-100">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Southern California&rsquo;s Fulfillment Matchmakers
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-primary-700 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
        >
          Scale Your Brand <span className="text-accent-orange">Without Leasing</span> a Warehouse
        </motion.h1>

        <motion.p
          className="text-xl text-accent-slate mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          We connect growing ecommerce brands with vetted fulfillment partners across Los
          Angeles, Orange County, San Diego, the Inland Empire, Riverside, and Ontario &mdash;
          so you can stop packing boxes and start scaling your business.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <button
            onClick={() => scrollToSection('contact')}
            className="btn btn-primary px-8 py-3 text-lg flex items-center justify-center gap-2"
          >
            Get Free Fulfillment Consultation
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="btn btn-secondary px-8 py-3 text-lg"
          >
            See How It Works
          </button>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {STATS.map((stat) => (
            <div key={stat} className="flex items-center gap-2 text-sm text-primary-700 font-medium">
              <CheckCircle2 size={18} className="text-accent-orange" />
              {stat}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
