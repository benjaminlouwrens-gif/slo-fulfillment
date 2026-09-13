'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Warehouse,
  PackageCheck,
  BarChart3,
  Truck,
  Layers,
  ShieldCheck,
} from 'lucide-react';

const FEATURES: { icon: React.ReactNode; title: string; body: string }[] = [
  {
    icon: <Warehouse size={28} />,
    title: 'Warehousing & Storage',
    body:
      'Your inventory lives in a secure, professionally managed Southern California warehouse — not your garage, spare room, or a self-storage unit.',
  },
  {
    icon: <PackageCheck size={28} />,
    title: 'Pick & Pack',
    body:
      'Every order is picked, packed, and prepared for shipment with accuracy rates above 99.5%.',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Inventory Management',
    body:
      'Real-time inventory visibility through integrated dashboards. Know exactly what you have and where.',
  },
  {
    icon: <Truck size={28} />,
    title: 'Shipping & Carrier Access',
    body:
      'Tap into negotiated carrier rates from USPS, UPS, FedEx, and regional carriers your customers’ orders arrive on, without the volume it usually takes to earn them.',
  },
  {
    icon: <Layers size={28} />,
    title: 'Scalable Operations',
    body:
      'Handle 100 orders per month or 100,000. Your fulfillment partner scales with your brand — no renegotiating, no re-platforming.',
  },
  {
    icon: <ShieldCheck size={28} />,
    title: 'Compliance & Specialty Handling',
    body:
      'GMP-compliant supplement handling, temperature-controlled storage, apparel kitting, subscription box assembly, and other specialty requirements — matched to a partner who already does it.',
  },
];

const STATS: { value: string; label: string }[] = [
  { value: '50+', label: 'Fulfillment Partners' },
  { value: '2–5 Days', label: 'to Match' },
  { value: '99.5%', label: 'Order Accuracy' },
  { value: 'Free', label: 'Cost to Brands' },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 px-6 bg-secondary-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            What You Get
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Full-Service Fulfillment, <span className="text-accent-orange">Zero Overhead</span>
          </h2>
          <p className="text-lg text-accent-slate">
            When you&rsquo;re matched with a SoCal fulfillment partner, you unlock
            enterprise-grade logistics capabilities without hiring staff, signing a lease,
            or buying equipment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-xl bg-white border border-secondary-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <div className="text-primary-500 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">{feature.title}</h3>
              <p className="text-accent-slate text-sm leading-relaxed">{feature.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-bold text-accent-orange mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-accent-slate">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
