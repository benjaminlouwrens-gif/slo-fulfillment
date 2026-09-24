'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Send } from 'lucide-react';

function Product({ name, className = '' }: { name: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => element.classList.toggle('sl-product--visible', entry.isIntersecting), { threshold: .15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className={`sl-product sl-product-${name} ${className}`} role="img" aria-label={name} />;
}

const SUGGESTED: { q: string; a: string }[] = [
  {
    q: 'What is 3PL?',
    a: '3PL stands for third-party logistics. It\u2019s a company that stores your products, packs your orders, and ships them to your customers.',
  },
  {
    q: 'Can you do custom packaging?',
    a: 'Some 3PLs offer custom packaging, kitting, and branded inserts. Tell us what you need in the consultation form so we can look for a suitable partner.',
  },
  {
    q: 'Can you include a handwritten note?',
    a: 'Some 3PLs can include handwritten notes or custom inserts. Mention this in the consultation form so we can check partner capabilities.',
  },
  {
    q: 'Do you work with food products?',
    a: 'Tell us what you sell, its shelf life, packaging, and storage temperature. Food, supplements, and other sensitive products need a partner with the right handling capabilities. We check those requirements as part of the match.',
  },
  {
    q: 'What if I have a unique request?',
    a: 'Describe unusual dimensions, temperature control, or high-touch kitting in the consultation form. We can look for a partner equipped for those requirements.',
  },
  {
    q: 'Can you ship from Los Angeles?',
    a: 'Los Angeles may be an option, depending on your products and available partners. Share your location needs in the consultation form so we can check fit.',
  },
];

export function FaqChat() {
  const [input, setInput] = useState('');
  const [asked, setAsked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [referred, setReferred] = useState(false);
  const pending = useRef<AbortController | null>(null);

  useEffect(() => () => pending.current?.abort(), []);

  const ask = (q: string, a: string) => {
    pending.current?.abort();
    pending.current = null;
    setInput(q);
    setAsked(q);
    setAnswer(a);
    setReferred(false);
    setLoading(false);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const preset = SUGGESTED.find(({ q }) => q.toLowerCase().replace(/\s+/g, ' ') === text.toLowerCase().replace(/\s+/g, ' '));
    if (preset) {
      ask(preset.q, preset.a);
      return;
    }
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setAsked(text);
    setAnswer(null);
    setReferred(false);
    setLoading(true);
    try {
      const response = await fetch('/api/faq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('FAQ unavailable');
      const result = await response.json() as { answer?: string; referred?: boolean };
      if (typeof result.answer !== 'string' || !result.answer) throw new Error('FAQ answer missing');
      setAnswer(result.answer);
      setReferred(Boolean(result.referred));
    } catch {
      if (!controller.signal.aborted) {
        setAnswer('The answer tool is unavailable right now. Please use the free consultation form.');
        setReferred(true);
      }
    } finally {
      if (pending.current === controller) {
        pending.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <div className="sl-faq-chat" id="faq">
      <div className="sl-faq-chat-left">
        <h2>Have a question?</h2>
        <p className="sl-faq-chat-sub">Ask anything about fulfillment, packaging, shipping, or special requests. Get a real answer, fast.</p>
        <form className="sl-faq-box" onSubmit={send}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            aria-label="Type your question here"
            maxLength={500}
          />
          <button type="submit" aria-label="Send question" disabled={loading}>
            <Send size={18} />
          </button>
        </form>
        {asked && (answer || loading) && (
          <div className="sl-faq-answer" aria-live="polite">
            <p className="sl-faq-asked">{asked}</p>
            <p>{loading ? 'Finding an answer...' : answer}</p>
            {referred && !loading && <a className="sl-faq-form-link" href="#contact">Go to the consultation form <ArrowUpRight size={16} /></a>}
          </div>
        )}
        <p className="sl-faq-disclaimer">Please do not include personal information in your question.</p>
        {!asked && (
          <div className="sl-faq-product" aria-hidden="true">
            <Product name="headphones" />
          </div>
        )}
      </div>
      <div className="sl-faq-chat-right">
        {asked && (
          <div className="sl-faq-product sl-faq-product--top" aria-hidden="true">
            <Product name="headphones" />
          </div>
        )}
        <p className="sl-faq-try">Try asking...</p>
        {SUGGESTED.map((s) => (
          <button key={s.q} type="button" className="sl-faq-pill" onClick={() => ask(s.q, s.a)}>
            {s.q}
          </button>
        ))}
        <a className="sl-link" href="#contact">Ask about your fit <ArrowUpRight /></a>
      </div>
    </div>
  );
}
