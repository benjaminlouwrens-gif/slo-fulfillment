'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const SERVICE_AREAS = [
  'Los Angeles',
  'Orange County',
  'San Diego',
  'Inland Empire',
  'Riverside',
  'Ontario',
];

const QUICK_LINKS: [string, string][] = [
  ['How It Works', '#how-it-works'],
  ['Industries', '#industries'],
  ['Case Studies', '#case-studies'],
  ['FAQ', '#faq'],
  ['Get Free Consultation', '#contact'],
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="editorial-footer bg-primary-700 text-secondary-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-4 gap-12 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="logo text-2xl mb-1 text-secondary-100 leading-tight">
              Southern LoCal
            </div>
            <div className="logo text-2xl mb-4 text-secondary-100 leading-tight">
              Fulfillment
            </div>
            <p className="text-secondary-200 text-sm leading-relaxed">
              Connecting ecommerce brands with vetted fulfillment partners across Southern
              California. Free matchmaking, no contracts required.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-secondary-50 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-secondary-200 hover:text-secondary-100 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-secondary-50 mb-4">Service Areas</h4>
            <ul className="space-y-2 text-sm">
              {SERVICE_AREAS.map((area) => (
                <li key={area} className="text-secondary-200">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-secondary-50 mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <a
                href="tel:5302155987"
                className="flex items-center gap-2 text-secondary-200 hover:text-secondary-100 transition-colors"
              >
                <Phone size={16} />
                (530) 215-5987
              </a>
              <a
                href="mailto:louwrensventures@gmail.com"
                className="flex items-center gap-2 text-secondary-200 hover:text-secondary-100 transition-colors"
              >
                <Mail size={16} />
                louwrensventures@gmail.com
              </a>
              <div className="flex items-center gap-2 text-secondary-200">
                <MapPin size={16} />
                Serving Southern California
              </div>
            </div>
          </div>
        </motion.div>

        <div className="border-t border-primary-600 my-8" />

        <motion.div
          className="text-center text-sm text-secondary-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p>
            © {currentYear} Southern LoCal Fulfillment. All rights reserved.{' '}
            •{' '}
            {/* Unlisted sub-processors/status page covering this site and its sister sites.
                Not in the nav or the sitemap on purpose. */}
            <a
              href="https://slowebdesign.com/1LhYKNpDUb9vRK95brXe"
              className="text-secondary-300 hover:text-secondary-100 transition-colors"
            >
              Status
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
