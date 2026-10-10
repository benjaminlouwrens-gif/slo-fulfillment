import React, { useEffect, useRef, useState } from 'react';

type Manifest = { count: number; width: number; height: number; contours: number[][] };
type SceneState = 'beforeWave' | 'snapEnteringWave' | 'waveComplete' | 'reverseWave';
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function SurfTransition({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const pinkUnderlay = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [variant, setVariant] = useState<'mobile' | 'desktop' | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const update = () => setVariant(query.matches ? 'mobile' : 'desktop');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!variant) return;
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
    let sceneState: SceneState = 'beforeWave';
    let lockScroll = false;
    let animationRaf = 0;
    let preparedFrames: number[] = [];
    let viewportWidth = window.innerWidth;
    let touchGestureUsed = false;
    const limit = variant === 'mobile' ? 25 : 24;

    const measureHeight = () => {
      root.current?.style.removeProperty('--surf-height');
      root.current?.parentElement?.style.removeProperty('--surf-height');
      const height = scene.current?.offsetHeight;
      if (height) {
        root.current?.style.setProperty('--surf-height', `${height}px`);
        root.current?.parentElement?.style.setProperty('--surf-height', `${height}px`);
      }
    };

    const disable = () => {
      enabled = false;
      lockScroll = false;
      sceneState = 'beforeWave';
      cancelAnimationFrame(animationRaf);
      setActive(false);
      root.current?.setAttribute('data-transition', 'disabled');
      root.current?.style.removeProperty('--surf-height');
      root.current?.parentElement?.style.removeProperty('--surf-height');
      scene.current?.style.removeProperty('opacity');
      scene.current?.style.removeProperty('pointer-events');
      scene.current?.style.removeProperty('clip-path');
      pinkUnderlay.current?.style.setProperty('opacity', '0');
      (root.current?.nextElementSibling as HTMLElement | null)?.style.removeProperty('transform');
      if (canvas.current) canvas.current.style.opacity = '0';
    };
    const releaseToStory = () => {
      if (!root.current || !scene.current || !canvas.current) return;
      scene.current.style.opacity = '0';
      scene.current.style.pointerEvents = 'none';
      scene.current.style.clipPath = 'inset(100% 0 0 0)';
      canvas.current.style.opacity = '0';
      pinkUnderlay.current?.style.setProperty('opacity', '0');
      (root.current.nextElementSibling as HTMLElement | null)?.style.removeProperty('transform');
    };
    const reclaimScene = () => {
      scene.current?.style.setProperty('opacity', '1');
      scene.current?.style.setProperty('pointer-events', 'auto');
      scene.current?.style.setProperty('clip-path', 'inset(0 0 0 0)');
    };
    const requestFrame = async (index: number) => {
      if (stopped || failed || pending.size >= 5 || index < 0 || index >= manifest.count || cache.has(index) || pending.has(index)) return;
      pending.add(index);
      try {
        const response = await fetch(`/assets/surf/${variant}/frame-${String(index).padStart(3, '0')}.webp`, { signal: controller.signal });
        if (!response.ok) throw new Error('Surf frame unavailable');
        const bitmap = await createImageBitmap(await response.blob());
        if (stopped || failed) { bitmap.close(); return; }
        cache.set(index, bitmap);
        while (cache.size > limit) {
          const farthest = [...cache.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0];
          cache.get(farthest)?.close();
          cache.delete(farthest);
        }
        if (variant === 'desktop' && !enabled && index === 0) enable();
        if (index === target) schedule();
      } catch (error) {
        if (!stopped && (++failures >= 3 || index === 0)) { failed = true; disable(); }
      } finally {
        pending.delete(index);
        if (enabled && !failed && !cache.has(target)) schedule();
      }
    };
    const enable = () => {
      if (stopped || failed || reduced.matches || !root.current) return;
      // Never expand the runway under someone already browsing the page.
      const directSection = location.hash && location.hash !== '#top';
      if (window.scrollY > 14 || directSection) { disable(); return; }
      measureHeight();
      enabled = true;
      root.current.dataset.transition = 'idle';
      root.current.dataset.bufferedFrames = String(cache.size);
      setActive(true);
      requestAnimationFrame(schedule);
    };
    const prepareMobile = async () => {
      // 25 decoded samples cover the whole filmed wave at its playback rate.
      // No network fetch or bitmap decode happens during a mobile transition.
      preparedFrames = [...new Set(Array.from({ length: 25 }, (_, i) => Math.round(i * (manifest.count - 1) / 24)))];
      let next = 0;
      await Promise.all(Array.from({ length: 4 }, async () => {
        while (next < preparedFrames.length && !stopped && !failed) {
          await requestFrame(preparedFrames[next++]);
        }
      }));
      if (preparedFrames.every(index => cache.has(index))) enable();
      else if (!stopped) disable();
    };
    const draw = () => {
      raf = 0;
      if (!enabled || !root.current || !canvas.current || !scene.current) return;
      if (sceneState === 'waveComplete') {
        releaseToStory();
        return;
      }
      const rect = root.current.getBoundingClientRect();
      const w = root.current.clientWidth;
      const h = scene.current.offsetHeight;
      const progress = clamp(-rect.top / Math.max(1, root.current.offsetHeight - h));
      const fade = clamp((progress - .92) / .08);
      const edgeY = h * (1.12 - progress * 1.62);
      const pinkY = edgeY + h * .32;
      const revealY = Math.max(0, pinkY - h * .12);
      scene.current.style.opacity = '1';
      scene.current.style.clipPath = `inset(0 0 ${Math.max(0, h - revealY)}px 0)`;
      scene.current.style.pointerEvents = pinkY <= 0 ? 'none' : 'auto';
      if (pinkUnderlay.current) {
        const story = root.current.nextElementSibling as HTMLElement | null;
        const storyTop = story ? story.getBoundingClientRect().top : h;
        const underlayHeight = Math.max(0, Math.min(h, storyTop));
        pinkUnderlay.current.style.opacity = '1';
        pinkUnderlay.current.style.clipPath = `inset(0 0 ${h - underlayHeight}px 0)`;
      }
      target = Math.round(clamp(progress / .82) * (manifest.count - 1));
      canvas.current.dataset.frame = String(target);
      canvas.current.dataset.progress = progress.toFixed(4);
      canvas.current.style.opacity = progress === 0 ? '0' : String(1 - fade);
      if (rect.bottom <= 0 || rect.top > h) return;
      if (variant === 'desktop') {
        void requestFrame(target);
        for (const offset of [1, -1, 2, -2, 3, -3]) {
          if (pending.size < 5) void requestFrame(target + offset);
        }
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
    const getBounds = () => {
      if (!root.current) return null;
      const rect = root.current.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const destination = Math.max(top, top + root.current.offsetHeight - (scene.current?.offsetHeight || window.innerHeight));
      return { top, destination };
    };
    const beginTransition = (direction: 'forward' | 'backward') => {
      if (!enabled || failed || reduced.matches || lockScroll || !root.current) return false;
      const bounds = getBounds();
      if (!bounds) return false;
      if (direction === 'forward' && sceneState !== 'beforeWave') return false;
      if (direction === 'backward' && sceneState !== 'waveComplete') return false;
      const from = Math.max(bounds.top, Math.min(window.scrollY, bounds.destination));
      const destination = direction === 'forward' ? bounds.destination : bounds.top;
      if (direction === 'forward' ? from >= destination - 1 : from <= destination + 1) return false;
      sceneState = direction === 'forward' ? 'snapEnteringWave' : 'reverseWave';
      reclaimScene();
      lockScroll = true;
      root.current.dataset.transition = 'running';
      const startedAt = performance.now();
      const duration = 1150;
      const advance = (now: number) => {
        if (stopped) return;
        const progress = clamp((now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 2);
        window.scrollTo({ top: from + (destination - from) * eased, behavior: 'auto' });
        schedule();
        if (progress < 1) {
          animationRaf = requestAnimationFrame(advance);
          return;
        }
        window.scrollTo({ top: destination, behavior: 'auto' });
        lockScroll = false;
        sceneState = direction === 'forward' ? 'waveComplete' : 'beforeWave';
        root.current?.setAttribute('data-transition', sceneState === 'waveComplete' ? 'complete' : 'idle');
        if (sceneState === 'waveComplete') releaseToStory();
        schedule();
      };
      animationRaf = requestAnimationFrame(advance);
      return true;
    };
    const requestStart = (direction: 'forward' | 'backward') => {
      if (!enabled || failed || reduced.matches) {
        if (direction === 'forward') root.current?.nextElementSibling?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' });
        return false;
      }
      return beginTransition(direction);
    };
    const snapThroughWave = (event: WheelEvent) => {
      if (reduced.matches || failed || !root.current) return;
      if (lockScroll) {
        event.preventDefault();
        return;
      }
      if (!enabled || event.deltaY === 0) return;
      const bounds = getBounds();
      if (!bounds) return;
      const direction = event.deltaY > 0 ? 'forward' : 'backward';
      if (direction === 'forward' && (sceneState !== 'beforeWave' || window.scrollY < bounds.top - 14 || window.scrollY > bounds.top + 14)) return;
      if (direction === 'backward' && (sceneState !== 'waveComplete' || window.scrollY <= bounds.top + 1 || window.scrollY > bounds.destination + 14)) return;
      if (requestStart(direction)) event.preventDefault();
    };
    const snapTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchGestureUsed = false;
    };
    const snapTouchMove = (event: TouchEvent) => {
      if (reduced.matches || failed || !root.current) return;
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      if (lockScroll || touchGestureUsed) {
        event.preventDefault();
        return;
      }
      if (!enabled || Math.abs(touchStartY - currentY) <= 10) return;
      const bounds = getBounds();
      if (!bounds) return;
      const direction = touchStartY - currentY > 0 ? 'forward' : 'backward';
      if (direction === 'forward' && (sceneState !== 'beforeWave' || window.scrollY < bounds.top - 14 || window.scrollY > bounds.top + 14)) return;
      if (direction === 'backward' && (sceneState !== 'waveComplete' || window.scrollY <= bounds.top + 1 || window.scrollY > bounds.destination + 14)) return;
      if (requestStart(direction)) { touchGestureUsed = true; event.preventDefault(); }
    };
    const snapTouchEnd = () => { touchGestureUsed = false; };
    const onStartRequest = () => requestStart('forward');
    const skipTransition = () => {
      cancelAnimationFrame(animationRaf);
      lockScroll = false;
      if (!enabled) return;
      sceneState = 'waveComplete';
      root.current?.setAttribute('data-transition', 'complete');
      releaseToStory();
    };
    const onScroll = () => {
      const bounds = getBounds();
      if (enabled && !lockScroll && bounds && window.scrollY >= bounds.destination - 1) {
        sceneState = 'waveComplete';
        root.current?.setAttribute('data-transition', 'complete');
        releaseToStory();
      }
      if (!lockScroll && sceneState === 'waveComplete' && bounds && window.scrollY <= bounds.top + 1) {
        sceneState = 'beforeWave';
        root.current?.setAttribute('data-transition', 'idle');
        reclaimScene();
      }
      schedule();
    };
    const resize = () => {
      // Mobile browser chrome changes innerHeight while scrolling. Keep the
      // scene height stable; remeasure only for a real layout-width change.
      if (window.innerWidth !== viewportWidth) {
        viewportWidth = window.innerWidth;
        if (lockScroll) skipTransition();
        measureHeight();
      }
      schedule();
    };
    const preference = () => { if (reduced.matches) disable(); };
    let touchStartY = 0;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', snapThroughWave, { passive: false, capture: true });
    window.addEventListener('touchstart', snapTouchStart, { passive: true });
    window.addEventListener('touchmove', snapTouchMove, { passive: false });
    window.addEventListener('touchend', snapTouchEnd, { passive: true });
    window.addEventListener('touchcancel', snapTouchEnd, { passive: true });
    window.addEventListener('slocal:start-surf', onStartRequest);
    window.addEventListener('slocal:skip-surf', skipTransition);
    window.addEventListener('resize', resize);
    reduced.addEventListener('change', preference);
    if (!reduced.matches) {
      fetch('/assets/surf/manifest.json', { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error('Surf unavailable'); return response.json(); })
        .then((data: Manifest) => {
          manifest = data;
          return variant === 'mobile' ? prepareMobile() : requestFrame(0);
        })
        .catch(() => { if (!stopped) disable(); });
    }
    return () => {
      stopped = true;
      controller.abort();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(animationRaf);
      cache.forEach(bitmap => bitmap.close());
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', snapThroughWave, true);
      window.removeEventListener('touchstart', snapTouchStart);
      window.removeEventListener('touchmove', snapTouchMove);
      window.removeEventListener('touchend', snapTouchEnd);
      window.removeEventListener('touchcancel', snapTouchEnd);
      window.removeEventListener('slocal:start-surf', onStartRequest);
      window.removeEventListener('slocal:skip-surf', skipTransition);
      window.removeEventListener('resize', resize);
      reduced.removeEventListener('change', preference);
      setActive(false);
      root.current?.style.removeProperty('--surf-height');
      root.current?.parentElement?.style.removeProperty('--surf-height');
    };
  }, [variant]);

  return <div ref={root} className={`surf-transition${active ? ' surf-transition--active' : ''}`}>
    <div className="surf-stage">
      <div ref={pinkUnderlay} className="surf-pink-underlay" aria-hidden="true" />
      <div ref={scene} className="surf-scene">{children}</div>
      <canvas ref={canvas} className="surf-canvas" aria-hidden="true" />
    </div>
  </div>;
}
