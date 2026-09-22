import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const documentTop = (element: HTMLElement) => {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
};

export function PumpBottle() {
  const bottle = useRef<HTMLSpanElement>(null);
  const nozzle = useRef<HTMLSpanElement>(null);
  const drop = useRef<HTMLDivElement>(null);
  const splash = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    const draw = () => {
      raf = 0;
      const target = document.getElementById('lotion-target');
      const section = document.getElementById('services');
      if (!bottle.current || !target || !section) return;
      const start = documentTop(section);
      const end = documentTop(target) - innerHeight * .54;
      const progress = clamp((scrollY - start) / Math.max(360, end - start));
      const press = clamp((progress - .02) / .12) * (1 - clamp((progress - .72) / .18));
      bottle.current.style.setProperty('--pump-press', reduced.matches ? '0px' : `${press * 24}px`);
      bottle.current.dataset.progress = progress.toFixed(3);
      bottle.current.dataset.pumpPhase = press > .02 ? 'pressing' : 'resting';

      if (!nozzle.current || !drop.current || !splash.current) return;

      const from = nozzle.current.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const falling = clamp((progress - .18) / .54);
      const x = from.left + (to.left + to.width / 2 - from.left) * falling;
      const landingY = to.top - drop.current.offsetHeight + 5;
      const y = from.top + (landingY - from.top) * falling;
      const forming = clamp(progress / .18);
      const visible = !reduced.matches && progress > .015 && progress < .72;
      drop.current.style.opacity = visible ? '1' : '0';
      drop.current.style.transform = `translate(${x}px, ${y}px) scale(${progress < .18 ? .35 + forming * .65 : 1})`;
      drop.current.dataset.phase = progress < .015 ? 'idle' : progress < .18 ? 'forming' : progress < .72 ? 'falling' : progress < .9 ? 'impact' : 'gone';

      const pop = clamp((progress - .72) / .18);
      splash.current.style.opacity = !reduced.matches && progress >= .72 && progress < .9 ? String(1 - pop * .85) : '0';
      const splashScale = 1.1 - pop * .55;
      const splashX = to.left + to.width / 2 - (splash.current.offsetWidth * splashScale) / 2;
      const splashY = to.top + to.height * .52 - (splash.current.offsetHeight * splashScale) / 2;
      splash.current.style.transform = `translate(${splashX}px, ${splashY}px) scale(${splashScale})`;
      target.style.transform = '';
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      document.getElementById('lotion-target')?.style.removeProperty('transform');
    };
  }, [mounted]);

  return <>
    <span ref={bottle} className="sl-product sl-product-skincare sl-pump-bottle" role="img" aria-label="Skincare pump bottle">
      <span className="sl-pump-window"><span className="sl-pump-head"><span ref={nozzle} className="sl-pump-nozzle" /></span></span>
      <span className="sl-pump-body" />
    </span>
    {mounted && createPortal(<div className="sl-lotion-overlay" aria-hidden="true">
      <div ref={drop} className="sl-lotion-drop"><svg viewBox="0 0 190 290"><path d="M96 10C68 28 43 52 34 81C25 110 35 136 61 144C87 152 115 137 121 108C126 83 108 66 88 53C72 42 74 25 96 10Z" /></svg></div>
      <div ref={splash} className="sl-lotion-splash"><svg viewBox="0 0 220 160"><path className="lotion-pop-line" d="M30 72L7 55M42 113L21 137M83 126L75 154M139 125L148 153M179 105L210 121M181 69L213 56" /></svg></div>
    </div>, document.body)}
  </>;
}
