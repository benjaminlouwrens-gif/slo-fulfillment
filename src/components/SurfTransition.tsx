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
    const variant = window.innerWidth <= 640 ? 'mobile' : 'desktop';
    const limit = variant === 'mobile' ? 14 : 24;

    const disable = () => {
      enabled = false;
      setActive(false);
      scene.current?.style.removeProperty('opacity');
      scene.current?.style.removeProperty('pointer-events');
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
      const fade = clamp((progress - .82) / .18);
      scene.current.style.opacity = String(1 - clamp((progress - .52) / .08));
      scene.current.style.pointerEvents = progress >= .6 ? 'none' : 'auto';
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
      const edgeY = h * (1.16 - clamp(progress / .62) * 1.65);
      const scale = Math.max(w / bitmap.width, (h - edgeY + 20) / (bitmap.height * (1 - average)), h / bitmap.height);
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
      // Once the incoming surf covers the scene, settle into the full overhead shot.
      const settle = clamp((progress - .61) / .16);
      if (settle > 0) {
        const cover = Math.max(w / bitmap.width, h / bitmap.height);
        ctx.globalAlpha = settle;
        ctx.drawImage(bitmap, (w - bitmap.width * cover) / 2, (h - bitmap.height * cover) / 2, bitmap.width * cover, bitmap.height * cover);
        ctx.globalAlpha = 1;
      }
      canvas.current.dataset.renderedFrame = String(available);
      canvas.current.dataset.cachedFrames = String(cache.size);
    };
    const schedule = () => { if (!raf && !stopped) raf = requestAnimationFrame(draw); };
    const preference = () => { if (reduced.matches) disable(); };
    window.addEventListener('scroll', schedule, { passive: true });
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
