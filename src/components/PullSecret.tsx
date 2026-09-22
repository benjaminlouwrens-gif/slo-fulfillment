import React, { useEffect, useRef, useState } from 'react';

type PullSecretProps = { onReset: () => void };

export function PullSecret({ onReset }: PullSecretProps) {
  const [countdown, setCountdown] = useState(5);
  const [phase, setPhase] = useState<'countdown' | 'approach' | 'black'>('countdown');
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const sound = audio.current;
    void sound?.play().catch(() => undefined);
    let remaining = 5;
    const timer = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
        setPhase('approach');
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'black') return;
    const timer = window.setTimeout(() => {
      onReset();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 850);
    return () => window.clearTimeout(timer);
  }, [onReset, phase]);

  useEffect(() => {
    if (phase !== 'approach') return;
    const timer = window.setTimeout(() => setPhase('black'), 4150);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return <div className={`pull-secret pull-secret--${phase}`} role="dialog" aria-modal="true" aria-label="Your product is waiting to get pulled">
    <audio ref={audio} src="/assets/easter-egg/construction-site-sounds.mp3" preload="auto" />
    {phase === 'countdown' && <div className="pull-secret-countdown"><p>Your product is waiting to get pulled.</p><strong>{countdown}</strong><span>stand by</span></div>}
    {phase === 'approach' && <img className="pull-secret-obunga" src="/assets/easter-egg/obunga-transparent.png" alt="" />}
  </div>;
}
