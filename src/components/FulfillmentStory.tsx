import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowRight, Plus, Check } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { PumpBottle } from './PumpBottle';

function Product({ name, className = '' }: { name: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => element.classList.toggle('sl-product--visible', entry.isIntersecting), { threshold: .15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className={`sl-product sl-product-${name} ${className}`} role="img" aria-label={name === 'fruit' ? 'Colorful cut fruit' : name} />;
}
const services = [
  ['A home for your inventory.', 'Warehousing & storage', 'Space for the products you sell today and the ones you are launching next.'],
  ['Packed like you mean it.', 'Pick, pack & kitting', 'Everyday orders, thoughtful unboxing, subscription kits, and the details that make it yours.'],
  ['Out the door. On its way.', 'Shipping & returns', 'Find a partner for your shipping destinations, sales channels, and returns workflow.'],
];
const industries = [
  'Food, snacks & beverages',
  'Beauty & personal care',
  'Apparel & accessories',
  'Supplements & wellness',
  'Gadgets & everyday goods',
  'Subscription boxes',
];
const examples = [
  {
    kicker: 'The garage graduate',
    title: <>The boxes have<br />taken over.</>,
    copy: 'Your evenings belong to packing orders. You need storage, daily fulfillment, and a clear cost to get started.',
    link: 'Find room to grow',
  },
  {
    kicker: 'The next chapter',
    title: <>Your brand grew.<br />Your 3PL didn&apos;t.</>,
    copy: 'More SKUs, new channels, bigger launches. You need a partner who can keep up with where you are going.',
    link: 'Find a better fit',
  },
];
const steps = [
  ['Tell us your story.', 'What you sell. How much you ship. What is getting in your way. Start with a few details about your brand.'],
  ['Meet your matches.', 'We look at your needs and introduce fulfillment partners with the capabilities that matter to you.'],
  ['Make your next move.', 'Compare quotes, ask questions, and choose your partner. Agree on the details and plan your first shipment together.'],
];
const questions = [
  ['Are you a warehouse?', 'We are a fulfillment matchmaking service. We connect your brand with independent Southern California warehouse partners based on your products, order volume, and requirements.'],
  ['How does free matchmaking work?', 'Brands do not pay us a matchmaking fee. We are compensated by participating fulfillment partners. Storage, fulfillment, and shipping are separate services quoted by the warehouse you choose.'],
  ['Am I big enough for a 3PL?', 'Tell us your current monthly orders and your plans. Partner minimums vary, and we will help you understand whether outsourcing makes sense for your stage.'],
  ['Does my business need to be in California?', 'No. Your brand can be based anywhere. Our focus is finding a Southern California home for your inventory.'],
  ['Can you help with food products?', 'Tell us what you sell, its shelf life, packaging, and storage temperature. Food, supplements, and other sensitive products need a partner with the right handling capabilities. We check those requirements as part of the match.'],
  ['What happens after I submit?', 'We review your requirements and follow up to clarify the details. Then we introduce suitable partners so you can discuss pricing, capabilities, and onboarding directly.'],
];

export function FulfillmentStory() {
  return <div className="sl-story">
    <section className="sl-intro" id="possibilities">
      <div className="sl-intro-opening">
        <Product name="fruit" /><Product name="headphones" /><Product name="sneakers" />
        <div className="sl-intro-copy"><p>For all the little things you make.</p><h2>A world of products.<br />A place for yours.</h2><p>The good-to-eat. The good-to-wear. The why-didn&apos;t-I-think-of-that.<br />Meet a SoCal fulfillment partner who gets what you sell.</p><a className="sl-link" href="#contact">Find my fulfillment partner <ArrowUpRight /></a></div>
        <p className="sl-intro-note">Small products. Big possibilities.</p>
      </div>
      <div className="sl-story-rule" aria-hidden="true" />
      <div className="sl-pink-industries" id="industries">
        <h2>Made to eat.<br />Made to keep.<br />Made by you.</h2>
        <p className="sl-pink-industries-lede">Small batches, repeat favorites, and the next big launch. Tell us what you make. We&apos;ll start there.</p>
        <div className="sl-industry-grid">{industries.map(x => <a href="#contact" key={x}>{x}<ArrowUpRight aria-hidden="true" /></a>)}</div>
        <p className="sl-platform-note">Shopify, Amazon, TikTok Shop, and beyond. Tell us where you sell so we can check the right integrations.</p>
      </div>
      <div className="sl-story-rule" aria-hidden="true" />
      <div className="sl-pink-examples" id="case-studies">
        <div className="sl-pink-examples-head"><h2>Sound familiar?</h2><p>Example scenarios, not customer case studies. Real conversations start with challenges like these.</p></div>
        <div className="sl-example-rows">{examples.map(e => <article key={e.kicker}><span>{e.kicker}</span><h3>{e.title}</h3><p>{e.copy}</p><a href="#contact">{e.link} <ArrowRight size={20} /></a></article>)}</div>
      </div>
    </section>
    <section className="sl-services sl-band" id="services">
      <div className="sl-section-top"><h2>A little of this.<br />A lot of possibility.</h2><p>Snacks next to skincare. Everyday essentials next to your next obsession. Different products, different needs, the right people behind each one.</p></div>
      <div className="sl-service-layout"><div className="sl-product-duet"><PumpBottle /><Product name="croissant" /><p>Good taste.<br />Great care.</p></div><div className="sl-services-list">{services.map(([title, label, copy]) => <article key={title}><p className="sl-label">{label}</p><h3>{title}</h3><p>{copy}</p></article>)}</div></div>
      <p className="sl-handling-note">Food or non-food, the details matter. We match for your packaging, shelf life, storage temperature, and handling needs.</p>
    </section>
    <section className="sl-process sl-band">
      <div className="sl-process-steps" id="how-it-works">
        <div className="sl-section-top"><h2><span id="lotion-target">A</span> little hello.<br />A big handoff.</h2><a className="sl-link" href="#contact">Let&apos;s get acquainted <ArrowUpRight /></a></div>
        <ol>{steps.map(([title, copy], i) => <li key={title}><span className="sl-step">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        <div className="sl-process-products" aria-hidden="true"><Product name="sneakers" /><Product name="fruit" /><Product name="skincare" /></div>
      </div>
      <div className="sl-process-faq" id="faq">
        <div><h2>Good questions.<br />Straight answers.</h2><a className="sl-link" href="tel:5302155987">Or give us a call <ArrowUpRight /></a><div className="sl-faq-product" aria-hidden="true"><Product name="headphones" /></div></div>
        <div>{questions.map(([q,a]) => <details key={q}><summary>{q}<Plus size={20} /></summary><p>{a}</p></details>)}</div>
      </div>
    </section>
    <div className="sl-contact"><div className="sl-contact-aside"><p>Next stop: a better fit.</p><h2>Let&apos;s make<br />some room.</h2><div className="sl-contact-products" aria-hidden="true"><Product name="croissant" /><Product name="skincare" /></div><ul><li><Check size={18}/> Free for brands</li><li><Check size={18}/> Personal introductions</li><li><Check size={18}/> You choose your partner</li></ul></div><ContactForm /></div>
    <section className="sl-local sl-band"><div className="sl-local-copy"><p>Rooted here. Ready to go places.</p><h2>SoCal is<br />our home turf.</h2><p>Find a fulfillment partner close to the ports, your customers, or the next stop in your supply chain.</p><button type="button" className="sl-local-sign-trigger" aria-label="Open the hidden product pull page" onClick={() => window.dispatchEvent(new Event('slocal:open-pull-secret'))}><img className="sl-local-sign" src="/assets/collage/approved-cutouts/road-sign-transparent.png" alt="Los Angeles, Orange County, San Diego, Inland Empire road sign" loading="lazy" /></button></div><div className="sl-destinations"><span>Los Angeles</span><span>Orange County</span><span>Inland Empire</span><span>Ontario & Riverside</span><span>San Diego</span><a href="#contact">Your next stop <ArrowUpRight /></a></div></section>
    <footer className="sl-footer"><a className="sl-footer-name" href="#">SloCal Fulfillment<ArrowUpRight /></a><div><p>Good things ship from here.</p><a href="mailto:louwrensventures@gmail.com">louwrensventures@gmail.com</a><a href="tel:5302155987">(530) 215-5987</a></div><div className="sl-footer-bottom"><span>Southern California. Independent fulfillment matchmaking.</span><span>&copy; {new Date().getFullYear()} Southern LoCal Fulfillment</span></div></footer>
  </div>;
}
