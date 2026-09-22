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
      if (!bottle.current || !nozzle.current || !drop.current || !splash.current || !target || !section) return;
      const start = documentTop(section) + 130;
      const end = documentTop(target) - innerHeight * .54;
      const progress = clamp((scrollY - start) / Math.max(360, end - start));
      const press = clamp(progress / .15) * (1 - clamp((progress - .28) / .16));
      bottle.current.style.setProperty('--pump-press', reduced.matches ? '0px' : `${press * 24}px`);
      bottle.current.dataset.progress = progress.toFixed(3);

      const from = nozzle.current.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const falling = clamp((progress - .25) / .47);
      const x = from.left + (to.left + to.width / 2 - from.left) * falling;
      const y = from.top + (to.top + 5 - from.top) * falling;
      const forming = clamp((progress - .1) / .15);
      const visible = !reduced.matches && progress > .1 && progress < .74;
      drop.current.style.opacity = visible ? '1' : '0';
      drop.current.style.transform = `translate(${x}px, ${y}px) scale(${progress < .25 ? .2 + forming * 1.15 : 1.15})`;
      drop.current.dataset.phase = progress < .1 ? 'idle' : progress < .25 ? 'forming' : progress < .74 ? 'falling' : progress < .88 ? 'impact' : 'gone';

      const pop = clamp((progress - .74) / .14);
      splash.current.style.opacity = !reduced.matches && progress >= .74 && progress < .94 ? String(1 - pop) : '0';
      splash.current.style.transform = `translate(${to.left + to.width / 2}px, ${to.top + 5}px) scale(${.45 + pop * 2.15})`;
      target.style.transform = reduced.matches || progress < .74 || progress >= .94 ? '' : `scale(${1 + Math.sin(pop * Math.PI) * .1}, ${1 - Math.sin(pop * Math.PI) * .16})`;
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
      <div ref={drop} className="sl-lotion-drop"><svg viewBox="0 0 190 290"><path d="M96 5C74 31 57 61 51 101C44 150 48 207 58 242C68 278 112 291 142 270C166 253 175 220 174 166C174 110 165 68 134 35C120 20 107 9 96 5Z" /></svg></div>
      <div ref={splash} className="sl-lotion-splash"><svg viewBox="0 0 190 130"><path d="M85 112C73 105 67 91 71 78C78 58 105 60 111 79C115 93 105 108 85 112Z"/><path d="M32 77L4 65L7 57L40 66Z"/><path d="M147 67L183 48L187 57L153 78Z"/><path d="M91 49L95 8L105 10L103 51Z"/></svg></div>
    </div>, document.body)}
  </>;
}
