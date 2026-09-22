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
      const y = from.top + (to.top + 5 - from.top) * falling;
      const forming = clamp(progress / .18);
      const visible = !reduced.matches && progress > .015 && progress < .72;
      drop.current.style.opacity = visible ? '1' : '0';
      drop.current.style.transform = `translate(${x}px, ${y}px) scale(${progress < .18 ? .35 + forming * .65 : 1})`;
      drop.current.dataset.phase = progress < .015 ? 'idle' : progress < .18 ? 'forming' : progress < .72 ? 'falling' : progress < .9 ? 'impact' : 'gone';

      const pop = clamp((progress - .72) / .18);
      splash.current.style.opacity = !reduced.matches && progress >= .72 && progress < .9 ? String(1 - pop * .85) : '0';
      splash.current.style.transform = `translate(${to.left + to.width / 2}px, ${to.top + 5}px) scale(${1.1 - pop * .55})`;
      target.style.transform = reduced.matches || progress < .72 || progress >= .9 ? '' : `scale(${1 + Math.sin(pop * Math.PI) * .06}, ${1 - Math.sin(pop * Math.PI) * .08})`;
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
      <div ref={drop} className="sl-lotion-drop"><svg viewBox="0 0 190 290"><path d="M95 8C48 66 25 119 25 177C25 239 55 278 95 278C135 278 165 239 165 177C165 119 142 66 95 8Z" /></svg></div>
      <div ref={splash} className="sl-lotion-splash"><svg viewBox="0 0 220 160"><path d="M31 77C37 50 55 44 73 53C88 61 94 41 110 43C126 45 130 62 146 57C164 51 184 66 187 84C190 103 174 119 153 113C133 107 123 127 104 120C87 114 75 130 57 119C39 109 25 97 31 77Z"/><path className="lotion-pop-line" d="M30 72L7 55M42 113L21 137M83 126L75 154M139 125L148 153M179 105L210 121M181 69L213 56" /></svg></div>
    </div>, document.body)}
  </>;
}
