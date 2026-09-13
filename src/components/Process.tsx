'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STEPS: { number: string; title: string; body: string }[] = [
  {
    number: '01',
    title: 'Tell Us About Your Business',
    body:
      'Fill out our short intake form. Share your product type, monthly order volume, current challenges, and what you need in a fulfillment partner.',
  },
  {
    number: '02',
    title: 'We Review Your Requirements',
    body:
      'Our team analyzes your needs and searches our vetted SoCal network for fulfillment partners that match your product, volume, and budget.',
  },
  {
    number: '03',
    title: 'Get Matched With a Solution',
    body:
      'We introduce you to 1–3 pre-qualified fulfillment partners. You review options, ask questions, and choose the best fit for your brand.',
  },
  {
    number: '04',
    title: 'Start Scaling',
    body:
      'Onboard with your new fulfillment partner and shift your focus from packing boxes to growing your brand.',
  },
];

export const Process: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            The Process
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            From Inquiry to <span className="text-accent-orange">Shipping in Days</span>
          </h2>
          <p className="text-lg text-accent-slate">
            Four straightforward steps from first contact to having a professional
            fulfillment partner running your day-to-day logistics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative p-6 rounded-xl border border-secondary-200 bg-secondary-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className="text-4xl font-bold text-secondary-300 mb-3">{step.number}</div>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">{step.title}</h3>
              <p className="text-accent-slate text-sm leading-relaxed">{step.body}</p>
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
            className="btn btn-primary px-8 py-3 text-lg inline-flex items-center gap-2 mb-3"
          >
            Start the Process — It&rsquo;s Free
            <ArrowRight size={20} />
          </button>
          <p className="text-sm text-accent-slate">No commitment. No contracts. Just a conversation.</p>
        </motion.div>
      </div>
    </section>
  );
};
