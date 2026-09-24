'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const STEP_LABELS = ['Business Info', 'Fulfillment Needs', 'Final Details'];
const STEP_SUBTITLES = ['Your business basics', 'How you fulfill today', 'The details that matter'];

const inputCls =
  'w-full px-4 py-3 border border-[#e5d5d8] rounded-lg bg-[#f9edd7] text-[#183c36] placeholder-[#647a76] focus:outline-none focus:ring-2 focus:ring-[#183c36]';
const labelCls = 'block text-sm font-medium text-[#183c36] mb-2';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [botField, setBotField] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const category = (e as CustomEvent<string>).detail;
      if (category) {
        setFormData(prev => ({ ...prev, productCategory: category }));
      }
    };
    window.addEventListener('slocal:select-category', handler);
    return () => window.removeEventListener('slocal:select-category', handler);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, 3));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Steps 1-2: validate then advance. Only step 3 submits.
    if (step < 3) {
      goNext();
      return;
    }
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
        setStep(1);
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div id="contact">
      <h2 className="text-4xl font-bold text-[#0f2e2c] mb-3">
        Get Your Free Fulfillment<br />Consultation
      </h2>
      <p className="text-[#183c36] mb-8">
        Tell us about your business. We&rsquo;ll review your requirements
        and follow up with suitable fulfillment partner options.
      </p>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-semibold text-[#0f2e2c]">Step {step} of 3</span>
          <span className="text-[#5a6e6c]">{STEP_SUBTITLES[step - 1]}</span>
        </div>
        <div className="relative flex justify-between items-center mb-2">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/60" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`relative z-10 w-5 h-5 rounded-full border-2 ${
                s <= step ? 'bg-[#0f2e2c] border-[#0f2e2c]' : 'bg-white border-white'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={i + 1 <= step ? 'text-[#0f2e2c] font-medium' : 'text-[#8a9a98]'}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Honeypot */}
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

        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelCls}>Full Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputCls} placeholder="Jane Smith" />
            </div>
            <div>
              <label htmlFor="company" className={labelCls}>Company Name *</label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required className={inputCls} placeholder="Your Brand" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="email" className={labelCls}>Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="jane@yourbrand.com" />
            </div>
            <div>
              <label htmlFor="productCategory" className={labelCls}>Product Category *</label>
              <select id="productCategory" name="productCategory" value={formData.productCategory} onChange={handleChange} required className={inputCls}>
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
              <label htmlFor="monthlyVolume" className={labelCls}>Monthly Order Volume *</label>
              <select id="monthlyVolume" name="monthlyVolume" value={formData.monthlyVolume} onChange={handleChange} required className={inputCls}>
                <option value="" disabled>Select volume...</option>
                <option value="Under 100 orders/month">Under 100 orders/month</option>
                <option value="100 – 500 orders/month">100 – 500 orders/month</option>
                <option value="500 – 2,000 orders/month">500 – 2,000 orders/month</option>
                <option value="2,000 – 10,000 orders/month">2,000 – 10,000 orders/month</option>
                <option value="10,000+ orders/month">10,000+ orders/month</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className={labelCls}>Phone Number *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={inputCls} placeholder="(555) 000-0000" />
            </div>
            <div>
              <label htmlFor="website" className={labelCls}>Website URL</label>
              <input type="text" inputMode="url" id="website" name="website" value={formData.website} onChange={handleChange} className={inputCls} placeholder="yourbrand.com" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="currentMethod" className={labelCls}>Current Fulfillment Method *</label>
              <select id="currentMethod" name="currentMethod" value={formData.currentMethod} onChange={handleChange} required className={inputCls}>
                <option value="" disabled>Select method...</option>
                <option value="Self-fulfilling from home">Self-fulfilling from home</option>
                <option value="Self-fulfilling from rented space">Self-fulfilling from rented space</option>
                <option value="Using a 3PL / fulfillment center">Using a 3PL / fulfillment center</option>
                <option value="Using Amazon FBA">Using Amazon FBA</option>
                <option value="Not yet shipping (pre-launch)">Not yet shipping (pre-launch)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="challenge" className={labelCls}>Biggest Fulfillment Challenge *</label>
              <textarea id="challenge" name="challenge" value={formData.challenge} onChange={handleChange} required rows={4} className={`${inputCls} resize-none`} placeholder="Describe your main fulfillment pain points or goals..." />
            </div>
            <div>
              <label htmlFor="notes" className={labelCls}>Additional Notes</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} placeholder="Anything else we should know about your products, timeline, or requirements..." />
            </div>
          </div>
        )}

        {submitStatus === 'success' && (
          <motion.div className="mt-6 p-4 bg-white/70 border border-[#0f2e2c]/20 rounded-lg text-[#0f2e2c]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Thank you! We&rsquo;ve received your inquiry and will follow up with next steps.
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Something went wrong. Please try again or email us at louwrensventures@gmail.com.
          </motion.div>
        )}

        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-3 rounded-lg border-2 border-[#0f2e2c] text-[#0f2e2c] font-medium hover:bg-[#0f2e2c]/5"
            >
              ← Back
            </button>
          )}
          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            className="flex-1 bg-[#0f2e2c] text-white py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0c2422] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === 'loading' ? 'Sending...' : step < 3 ? <>Continue to next step <span>→</span></> : 'Get Free Fulfillment Consultation'}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-6">
          <p className="m-0 text-left text-[#5a6e6c]">
            We share your inquiry with suitable fulfillment partners to help find a match.
          </p>
          <p className="m-0 text-left text-[#5a6e6c] sm:text-right">
            Free consultation · No commitment required · Takes 2–3 minutes
          </p>
        </div>
      </form>
    </div>
  );
};
