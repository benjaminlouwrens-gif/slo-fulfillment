'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, Mail } from 'lucide-react';

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'What exactly does Southern LoCal Fulfillment do?',
    answer:
      'We’re a matchmaking service, not a warehouse. We learn about your product, volume, and requirements, then connect you with vetted fulfillment partners across Southern California who are the right fit for your brand — free of charge.',
  },
  {
    question: 'How is this different from just finding a 3PL on my own?',
    answer:
      'Researching, vetting, and negotiating with 3PLs on your own can take weeks and it’s easy to end up with a mismatch. We already know our network’s capabilities, pricing, and specialties, so we can point you to the right partner in days instead of months.',
  },
  {
    question: 'Is there a cost to get matched?',
    answer:
      'No. Our matchmaking service is 100% free to ecommerce brands. We’re compensated by our fulfillment partner network, so there’s never a fee or markup passed on to you.',
  },
  {
    question: 'What types of products can be fulfilled?',
    answer:
      'Our network covers supplements, apparel, beauty and cosmetics, consumer electronics, subscription boxes, home and garden, food and beverage, pet products, and more. If it can be picked, packed, and shipped, we likely have a partner for it.',
  },
  {
    question: 'How long does it take to get matched?',
    answer:
      'Most brands are matched with 1–3 pre-qualified fulfillment partners within 2–5 business days of submitting their intake form.',
  },
  {
    question: 'What order volumes do you work with?',
    answer:
      'From brands shipping under 100 orders a month to those shipping 10,000+, our network includes partners sized for early-stage and enterprise-scale operations alike.',
  },
  {
    question: 'Do you only work with companies in Southern California?',
    answer:
      'Our fulfillment partner network is based across SoCal — Los Angeles, Orange County, San Diego, the Inland Empire, Riverside, and Ontario — but we work with ecommerce brands located anywhere who want their inventory stored and shipped from Southern California.',
  },
  {
    question: 'What platforms do your fulfillment partners integrate with?',
    answer:
      'Our partners commonly integrate with Shopify, Amazon (FBM), TikTok Shop, WooCommerce, and most major order management systems, so your existing storefront connects without a rebuild.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Common <span className="text-accent-orange">Questions</span>
          </h2>
          <p className="text-lg text-accent-slate">
            Everything you need to know about our fulfillment matchmaking service.
          </p>
        </motion.div>

        <div className="space-y-3 mb-12">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                className="border border-secondary-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-primary-700">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-accent-orange transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-accent-slate leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-accent-slate mb-3">
            Still have questions? Reach out directly and we&rsquo;ll get back to you within
            one business day.
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium">
            <a href="tel:5302155987" className="flex items-center gap-2 text-primary-700">
              <Phone size={16} />
              (530) 215-5987
            </a>
            <a href="mailto:louwrensventures@gmail.com" className="flex items-center gap-2 text-primary-700">
              <Mail size={16} />
              louwrensventures@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
