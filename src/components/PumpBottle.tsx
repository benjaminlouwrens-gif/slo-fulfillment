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

      const to = target.getBoundingClientRect();
      let from = nozzle.current.getBoundingClientRect();
      const targetX = to.left + to.width / 2;
      const correction = targetX - (from.left + from.width / 2);
      if (Math.abs(correction) > .5) {
        const alignedX = Number(bottle.current.dataset.alignX || 0) + correction;
        bottle.current.dataset.alignX = String(alignedX);
        bottle.current.style.setProperty('--pump-align-x', `${alignedX}px`);
        from = nozzle.current.getBoundingClientRect();
      }
      const falling = clamp((progress - .18) / .54);
      const dropWidth = drop.current.offsetWidth;
      const impactScale = Math.min(.3, to.width * .88 / dropWidth);
      const forming = clamp(progress / .18);
      const scale = progress < .18
        ? .35 + forming * .65
        : 1 - (1 - impactScale) * clamp((falling - .84) / .16);
      const x = from.left + from.width / 2 - dropWidth / 2;
      const landingY = to.top - to.height * .24;
      const y = from.bottom + (landingY - from.bottom) * falling;
      const visible = !reduced.matches && progress > .015 && progress < .78;
      drop.current.style.opacity = visible ? '1' : '0';
      drop.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      drop.current.dataset.phase = progress < .015 ? 'idle' : progress < .18 ? 'forming' : progress < .72 ? 'falling' : progress < .78 ? 'impact' : 'gone';

      const pop = clamp((progress - .78) / .12);
      splash.current.style.opacity = !reduced.matches && progress >= .78 && progress < .9 ? String(1 - pop) : '0';
      const splashScale = 1;
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
      <div ref={drop} className="sl-lotion-drop"><svg viewBox="0 0 190 290">
        <path className="sl-drop-falling" d="M113 10C78 38 44 77 35 127C29 158 45 190 43 218C41 257 61 279 96 278C135 276 154 256 153 216C152 177 141 107 117 70C103 48 101 29 113 10Z" />
        <path className="sl-drop-impact" d="M37 86C39 64 52 62 64 67C75 47 91 47 106 62C118 52 137 60 143 72C160 73 166 85 156 97C146 111 127 103 114 110C97 120 84 105 67 110C45 115 29 101 37 86Z" />
      </svg></div>
      <div ref={splash} className="sl-lotion-splash"><svg viewBox="0 0 220 160"><path className="lotion-pop-line" d="M30 72L7 55M42 113L21 137M83 126L75 154M139 125L148 153M179 105L210 121M181 69L213 56" /></svg></div>
    </div>, document.body)}
  </>;
}
