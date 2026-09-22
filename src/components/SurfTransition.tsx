import React, { useEffect, useRef, useState } from 'react';

type Manifest = { count: number; width: number; height: number; contours: number[][] };
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function SurfTransition({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const cache = new Map<number, ImageBitmap>();
    const pending = new Set<number>();
    let manifest: Manifest;
    let stopped = false;
    let enabled = false;
    let raf = 0;
    let target = 0;
    let failures = 0;
    let failed = false;
    let snapped = false;
    const variant = window.innerWidth <= 640 ? 'mobile' : 'desktop';
    const limit = variant === 'mobile' ? 14 : 24;

    const disable = () => {
      enabled = false;
      setActive(false);
      scene.current?.style.removeProperty('opacity');
      scene.current?.style.removeProperty('pointer-events');
      scene.current?.style.removeProperty('clip-path');
      root.current?.style.removeProperty('--pink-rise');
      (root.current?.nextElementSibling as HTMLElement | null)?.style.removeProperty('transform');
      if (canvas.current) canvas.current.style.opacity = '0';
    };
    const requestFrame = async (index: number) => {
      if (stopped || failed || pending.size >= 5 || index < 0 || index >= manifest.count || cache.has(index) || pending.has(index)) return;
      pending.add(index);
      try {
        const response = await fetch(`/assets/surf/${variant}/frame-${String(index).padStart(3, '0')}.webp`, { signal: controller.signal });
        if (!response.ok) throw new Error('Surf frame unavailable');
        const bitmap = await createImageBitmap(await response.blob());
        if (stopped) { bitmap.close(); return; }
        cache.set(index, bitmap);
        while (cache.size > limit) {
          const farthest = [...cache.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0];
          cache.get(farthest)?.close();
          cache.delete(farthest);
        }
        if (!enabled && index === 0 && !reduced.matches) {
          enabled = true;
          setActive(true);
          requestAnimationFrame(() => {
            if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
            schedule();
          });
        }
        if (index === target) schedule();
      } catch (error) {
        if (!stopped && (++failures >= 3 || index === 0)) { failed = true; disable(); }
      } finally {
        pending.delete(index);
        if (enabled && !failed && !cache.has(target)) schedule();
      }
    };
    const draw = () => {
      raf = 0;
      if (!enabled || !root.current || !canvas.current || !scene.current) return;
      const rect = root.current.getBoundingClientRect();
      const w = window.innerWidth;
      const h = scene.current.offsetHeight;
      const progress = clamp(-rect.top / Math.max(1, root.current.offsetHeight - h));
      const fade = clamp((progress - .92) / .08);
      const edgeY = h * (1.12 - progress * 1.62);
      const pinkY = edgeY + h * .32;
      const revealY = Math.max(0, pinkY - h * .12);
      root.current.style.setProperty('--pink-rise', `${Math.max(0, pinkY)}px`);
      const story = root.current.nextElementSibling as HTMLElement | null;
      if (story) story.style.transform = `translateY(${revealY - Math.max(0, rect.bottom - h)}px)`;
      scene.current.style.opacity = '1';
      scene.current.style.clipPath = `inset(0 0 ${Math.max(0, h - revealY)}px 0)`;
      scene.current.style.pointerEvents = pinkY <= 0 ? 'none' : 'auto';
      target = Math.round(clamp(progress / .82) * (manifest.count - 1));
      canvas.current.dataset.frame = String(target);
      canvas.current.dataset.progress = progress.toFixed(4);
      canvas.current.style.opacity = progress === 0 ? '0' : String(1 - fade);
      if (rect.bottom <= 0 || rect.top > h) return;
      void requestFrame(target);
      for (const offset of [1, -1, 2, -2, 3, -3]) {
        if (pending.size < 5) void requestFrame(target + offset);
      }
      const available = cache.has(target) ? target : [...cache.keys()].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
      const bitmap = cache.get(available);
      if (!bitmap) return;
      const ctx = canvas.current.getContext('2d');
      if (!ctx) { disable(); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (canvas.current.width !== Math.round(w * dpr) || canvas.current.height !== Math.round(h * dpr)) {
        canvas.current.width = Math.round(w * dpr);
        canvas.current.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const edge = manifest.contours[available];
      const average = edge.reduce((a, b) => a + b, 0) / edge.length;
      // Constant scale: move the filmed crest, never zoom or reveal the sandy full frame.
      const scale = Math.max(w / bitmap.width, h / bitmap.height);
      const dw = bitmap.width * scale;
      const dh = bitmap.height * scale;
      const dx = (w - dw) / 2;
      const dy = edgeY - average * dh;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(dx, h + dh);
      const points = edge.map((y, i) => [dx + i / (edge.length - 1) * dw, dy + y * dh]);
      ctx.lineTo(points[0][0], points[0][1]);
      for (let i = 0; i < points.length - 1; i++) {
        ctx.quadraticCurveTo(points[i][0], points[i][1], (points[i][0] + points[i + 1][0]) / 2, (points[i][1] + points[i + 1][1]) / 2);
      }
      ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1]);
      ctx.lineTo(dx + dw, h + dh);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(bitmap, dx, dy, dw, dh);
      ctx.restore();
      // Reveal the actual pink section immediately behind a narrow band of surf.
      ctx.globalCompositeOperation = 'destination-in';
      const trailing = ctx.createLinearGradient(0, pinkY - h * .12, 0, pinkY);
      trailing.addColorStop(0, 'rgba(0,0,0,1)');
      trailing.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = trailing;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      canvas.current.dataset.scale = scale.toFixed(5);
      canvas.current.dataset.renderedFrame = String(available);
      canvas.current.dataset.cachedFrames = String(cache.size);
    };
    const schedule = () => { if (!raf && !stopped) raf = requestAnimationFrame(draw); };
    const snapThroughWave = (event: WheelEvent) => {
      if (!enabled || failed || reduced.matches || !root.current || event.deltaY <= 8 || snapped) return;
      const rect = root.current.getBoundingClientRect();
      if (Math.abs(rect.top) > 8) return;
      event.preventDefault();
      snapped = true;
      window.scrollTo({ top: root.current.offsetTop + root.current.offsetHeight - window.innerHeight, behavior: 'smooth' });
    };
    const preference = () => { if (reduced.matches) disable(); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('wheel', snapThroughWave, { passive: false });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', preference);
    if (!reduced.matches) {
      fetch('/assets/surf/manifest.json', { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error('Surf unavailable'); return response.json(); })
        .then((data: Manifest) => { manifest = data; return requestFrame(0); })
        .catch(() => { if (!stopped) disable(); });
    }
    return () => {
      stopped = true;
      controller.abort();
      cancelAnimationFrame(raf);
      cache.forEach(bitmap => bitmap.close());
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('wheel', snapThroughWave);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', preference);
    };
  }, []);

  return <div ref={root} className={`surf-transition${active ? ' surf-transition--active' : ''}`}>
    <div className="surf-stage">
      <div ref={scene} className="surf-scene">{children}</div>
      <canvas ref={canvas} className="surf-canvas" aria-hidden="true" />
    </div>
  </div>;
}
