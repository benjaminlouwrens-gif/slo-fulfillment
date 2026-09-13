'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CASE_STUDIES: {
  company: string;
  category: string;
  stat: string;
  statLabel: string;
  challenge: string;
  result: string;
}[] = [
  {
    company: 'Sunrise Wellness Co.',
    category: 'Supplements',
    stat: '340%',
    statLabel: 'Order Volume Growth',
    challenge:
      'Packing 800+ supplement orders per day from a cramped garage was causing fulfillment errors and delays that put their retail relationships at risk.',
    result:
      'Matched with a GMP-compliant fulfillment partner in Ontario, CA — reduced error rate to 0.2% and cut average ship time from 3 days to next-day.',
  },
  {
    company: 'ThreadCraft Apparel',
    category: 'Apparel',
    stat: '58%',
    statLabel: 'Cost Per Shipment Reduction',
    challenge:
      'A Shopify apparel brand outgrew their 3PL and needed SoCal-based storage with kitting support for subscription bundles and seasonal drops.',
    result:
      'Found a Los Angeles fulfillment partner with garment hanging, poly-bagging, and next-day cutoffs. Shipping costs per order dropped by more than half.',
  },
  {
    company: 'Nova Beauty Supply',
    category: 'Consumer Products',
    stat: '4.8★',
    statLabel: 'Customer Rating After Switch',
    challenge:
      'TikTok Shop virality caused a 10× order spike overnight. Their current 3PL was overwhelmed and backlogged for over a week.',
    result:
      'Emergency match with a San Diego fulfillment center — onboarded in 72 hours, cleared the backlog in under a week, and kept ratings intact through peak demand.',
  },
];

export const CaseStudies: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="case-studies" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            Case Studies
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Real Results for <span className="text-accent-orange">Real Brands</span>
          </h2>
          <p className="text-lg text-accent-slate">
            See how SoCal ecommerce brands have transformed their operations by outsourcing
            fulfillment through our network.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {CASE_STUDIES.map((study, i) => (
            <motion.div
              key={study.company}
              className="p-6 rounded-xl border border-secondary-200 bg-secondary-50 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary-700">{study.company}</h3>
                <span className="text-xs font-medium text-accent-orange bg-accent-orange/10 px-2 py-1 rounded-full">
                  {study.category}
                </span>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary-500">{study.stat}</div>
                <div className="text-xs text-accent-slate">{study.statLabel}</div>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-slate mb-1">
                  Challenge
                </p>
                <p className="text-sm text-accent-slate leading-relaxed">{study.challenge}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-slate mb-1">
                  Result
                </p>
                <p className="text-sm text-accent-slate leading-relaxed">{study.result}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <button
            onClick={() => scrollToSection('contact')}
            className="btn btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
          >
            Get Your Success Story Started
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
