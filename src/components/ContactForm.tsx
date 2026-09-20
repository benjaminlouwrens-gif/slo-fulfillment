'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  productCategory: '',
  monthlyVolume: '',
  currentMethod: '',
  challenge: '',
  notes: '',
};

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [botField, setBotField] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, botField }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData(EMPTY_FORM);
        setBotField('');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      // Network error or submission failed
      setSubmitStatus('error');
    }
  };

  return (
    <section id="contact" className="editorial-section section-contact py-20 px-6 bg-primary-700">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-orange mb-3">
            Get Started
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Your Free <span className="text-accent-orange">Fulfillment Consultation</span>
          </h2>
          <p className="text-xl text-secondary-200">
            Tell us about your business. We&rsquo;ll review your requirements and come back
            with tailored fulfillment partner options within days.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 md:p-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Honeypot: visually hidden from sighted users, still present in the DOM
                (not display:none or type="hidden") so unsophisticated bots that fill
                every field still trip it. The label makes intent explicit for anyone
                inspecting the markup, including assistive tech. */}
            <div className="visually-hidden-field">
              <label htmlFor="botField">Don&rsquo;t fill this out:</label>
              <input
                type="text"
                id="botField"
                name="botField"
                tabIndex={-1}
                autoComplete="off"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-primary-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your Brand"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="jane@yourbrand.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="(555) 000-0000"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-primary-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://yourbrand.com"
                />
              </div>

              <div>
                <label htmlFor="productCategory" className="block text-sm font-medium text-primary-700 mb-2">
                  Product Category *
                </label>
                <select
                  id="productCategory"
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" disabled>Select a category...</option>
                  <option value="Supplements / Vitamins">Supplements / Vitamins</option>
                  <option value="Apparel / Clothing">Apparel / Clothing</option>
                  <option value="Beauty / Cosmetics">Beauty / Cosmetics</option>
                  <option value="Consumer Electronics">Consumer Electronics</option>
                  <option value="Subscription Boxes">Subscription Boxes</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Pet Products">Pet Products</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="monthlyVolume" className="block text-sm font-medium text-primary-700 mb-2">
                  Monthly Order Volume *
                </label>
                <select
                  id="monthlyVolume"
                  name="monthlyVolume"
                  value={formData.monthlyVolume}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" disabled>Select volume...</option>
                  <option value="Under 100 orders/month">Under 100 orders/month</option>
                  <option value="100 – 500 orders/month">100 – 500 orders/month</option>
                  <option value="500 – 2,000 orders/month">500 – 2,000 orders/month</option>
                  <option value="2,000 – 10,000 orders/month">2,000 – 10,000 orders/month</option>
                  <option value="10,000+ orders/month">10,000+ orders/month</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="currentMethod" className="block text-sm font-medium text-primary-700 mb-2">
                  Current Fulfillment Method *
                </label>
                <select
                  id="currentMethod"
                  name="currentMethod"
                  value={formData.currentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" disabled>Select method...</option>
                  <option value="Self-fulfilling from home">Self-fulfilling from home</option>
                  <option value="Self-fulfilling from rented space">Self-fulfilling from rented space</option>
                  <option value="Using a 3PL / fulfillment center">Using a 3PL / fulfillment center</option>
                  <option value="Using Amazon FBA">Using Amazon FBA</option>
                  <option value="Not yet shipping — pre-launch">Not yet shipping — pre-launch</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-primary-700 mb-2">
                Biggest Fulfillment Challenge *
              </label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Describe your main fulfillment pain points or goals..."
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-primary-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Anything else we should know about your products, timeline, or requirements..."
              />
            </div>

            {submitStatus === 'success' && (
              <motion.div
                className="p-4 bg-primary-50 border border-primary-200 rounded-lg text-primary-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✓ Thank you! We&rsquo;ve received your inquiry and will respond within 2 business days.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Something went wrong. Please try again or call us at (530) 215-5987.
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="btn btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {submitStatus === 'loading' ? 'Sending...' : 'Get Free Fulfillment Consultation'}
            </button>

            <p className="text-center text-sm text-accent-slate">
              Free consultation &middot; No commitment required &middot; Response within 2 business days
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
