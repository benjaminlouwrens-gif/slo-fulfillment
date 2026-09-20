'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      'Southern LoCal Fulfillment found us a partner that understood supplement compliance requirements. We went from constant packaging errors to a partner who gets it right every time.',
    name: 'Marcus T.',
    role: 'Founder, Elevation Nutrition',
  },
  {
    quote:
      'I reached out on a Friday. By Monday I had three fulfillment partner options in the Inland Empire with pricing and capabilities laid out clearly. We signed within two weeks.',
    name: 'Priya S.',
    role: 'Head of Operations, Lumi & Co.',
  },
  {
    quote:
      'We’d tried two other matchmakers before. Nobody understood the SoCal market the way these guys do — the partner they found us has been a genuine growth partner, not just a warehouse.',
    name: 'Jake R.',
    role: 'eCommerce Director, Tide & Trail Co.',
  },
  {
    quote:
      'Our subscription box required custom inserts, specific tissue folding, and branded packaging. Most 3PLs said no. Southern LoCal matched us with the one that said yes and delivered.',
    name: 'Alyssa M.',
    role: 'CEO, The Glow Box',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="editorial-section section-testimonials py-20 px-6 bg-secondary-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Brands That <span className="text-accent-orange">Trust Our Network</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              className="p-6 rounded-xl bg-white border border-secondary-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <Quote size={24} className="text-accent-orange mb-3" />
              <p className="text-accent-slate text-sm leading-relaxed mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="font-semibold text-primary-700 text-sm">{testimonial.name}</p>
              <p className="text-xs text-accent-slate">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
