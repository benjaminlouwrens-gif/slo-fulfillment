'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  Sparkles,
  Shirt,
  Gift,
  Boxes,
  Pill,
  Globe2,
} from 'lucide-react';

const INDUSTRIES: { icon: React.ReactNode; title: string; body: string }[] = [
  { icon: <ShoppingBag size={26} />, title: 'Shopify Brands', body: 'DTC brands ready to outsource fulfillment' },
  { icon: <Package size={26} />, title: 'Amazon Sellers', body: 'FBM and hybrid fulfillment solutions' },
  { icon: <Sparkles size={26} />, title: 'TikTok Shop', body: 'Fast-moving viral product sellers' },
  { icon: <Shirt size={26} />, title: 'Apparel Brands', body: 'Garment handling, kitting & returns' },
  { icon: <Gift size={26} />, title: 'Subscription Boxes', body: 'Custom assembly and branded packaging' },
  { icon: <Boxes size={26} />, title: 'Consumer Products', body: 'CPG brands of all categories' },
  { icon: <Pill size={26} />, title: 'Supplements', body: 'GMP-compliant fulfillment partners' },
  { icon: <Globe2 size={26} />, title: 'Ecommerce Businesses', body: 'All platforms, all product types' },
];

export const Industries: React.FC = () => {
  return (
    <section id="industries" className="py-20 px-6 bg-secondary-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            Industries We Serve
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Built for Modern <span className="text-accent-orange">Ecommerce Brands</span>
          </h2>
          <p className="text-lg text-accent-slate">
            Our fulfillment network covers a wide range of product categories and business
            models &mdash; from startups shipping their first hundred orders to established
            brands scaling nationwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {INDUSTRIES.map((industry, i) => (
            <motion.div
              key={industry.title}
              className="p-6 rounded-xl bg-white border border-secondary-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
            >
              <div className="text-accent-orange mb-3 flex justify-center">{industry.icon}</div>
              <h3 className="font-semibold text-primary-700 mb-1">{industry.title}</h3>
              <p className="text-accent-slate text-xs leading-relaxed">{industry.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
