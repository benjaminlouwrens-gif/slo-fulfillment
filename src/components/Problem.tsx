'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Boxes, Clock, AlertTriangle, TrendingUp, PackageX, ArrowRight } from 'lucide-react';

const PROBLEMS: { icon: React.ReactNode; title: string; body: string }[] = [
  {
    icon: <Boxes size={28} />,
    title: 'Inventory Taking Over Your Space',
    body:
      'Your garage, spare bedroom, or rented storage unit is bursting. Every square foot is occupied by boxes, and there’s nowhere left to grow.',
  },
  {
    icon: <Clock size={28} />,
    title: 'Packing Orders Is Your Full-Time Job',
    body:
      'You’re spending 4–6 hours a day on fulfillment when you should be focused on marketing, product, and growing your customer base.',
  },
  {
    icon: <AlertTriangle size={28} />,
    title: 'Shipping Mistakes Are Hurting Reviews',
    body:
      'Wrong items, damaged packages, and late deliveries are costing you 1-star reviews and repeat customers you worked hard to earn.',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'You Can’t Scale Without Infrastructure',
    body:
      'Your Shopify ads are working, but you physically can’t handle 5× the order volume. Growth is bottlenecked by your own four walls.',
  },
  {
    icon: <PackageX size={28} />,
    title: 'No Room for More SKUs',
    body:
      'You’re holding back new product launches because you have nowhere to store them. Expansion is impossible without more space.',
  },
];

export const Problem: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            The Problem
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Fulfillment Is Holding You Back
          </h2>
          <p className="text-lg text-accent-slate">
            Most growing ecommerce brands hit a wall. Not a marketing wall or a product wall
            &mdash; a fulfillment wall.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {PROBLEMS.map((problem, i) => (
            <motion.div
              key={problem.title}
              className="p-6 rounded-xl border border-secondary-200 bg-secondary-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <div className="text-accent-orange mb-4">{problem.icon}</div>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">{problem.title}</h3>
              <p className="text-accent-slate text-sm leading-relaxed">{problem.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="rounded-2xl bg-primary-700 text-white px-8 py-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            There&rsquo;s a Better Way
          </p>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Let Us Find Your Fulfillment Partner
          </h3>
          <p className="text-secondary-200 max-w-xl mx-auto mb-8">
            Stop managing boxes and start managing growth. Our vetted SoCal fulfillment
            network is ready to hand off your inventory, packing, and shipping so you can
            focus on the business.
          </p>
          <button
            onClick={() => scrollToSection('contact')}
            className="btn btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
          >
            Get Matched for Free
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
