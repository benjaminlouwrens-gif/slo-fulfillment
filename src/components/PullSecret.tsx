import React, { useEffect, useRef, useState } from 'react';

type PullSecretProps = { onReset: () => void };

export function PullSecret({ onReset }: PullSecretProps) {
  const [countdown, setCountdown] = useState(5);
  const [phase, setPhase] = useState<'countdown' | 'approach' | 'black'>('countdown');
  const constructionAudio = useRef<HTMLAudioElement>(null);
  const eerieAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const sound = constructionAudio.current;
    void sound?.play().catch(() => undefined);
    let remaining = 5;
    const timer = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
        setPhase('approach');
      }
    }, 1000);
    return () => {
      window.clearInterval(timer);
      sound?.pause();
    };
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
    const sound = eerieAudio.current;
    void sound?.play().catch(() => undefined);
    const timer = window.setTimeout(() => setPhase('black'), 4150);
    return () => {
      window.clearTimeout(timer);
      sound?.pause();
      if (sound) sound.currentTime = 0;
    };
  }, [phase]);

  return <div className={`pull-secret pull-secret--${phase}`} role="dialog" aria-modal="true" aria-label="Your product is waiting to get pulled">
    <audio ref={constructionAudio} src="/assets/easter-egg/construction-site-sounds.mp3" preload="auto" />
    <audio ref={eerieAudio} src="/assets/easter-egg/eerie-warehouse-drone.mp3" preload="auto" loop />
    {phase === 'countdown' && <div className="pull-secret-countdown-scene">
      <img className="pull-secret-loader-image" src="/assets/easter-egg/sorry-bro-loader.png" alt="Sorry bro, your meme is still under construction" />
      <div className="pull-secret-countdown" aria-live="polite"><p>Current wait time</p><strong>00:0{countdown}</strong></div>
    </div>}
    {phase === 'approach' && <div className="pull-secret-warehouse-scene">
      <div className="pull-secret-warehouse-copy">Your product is waiting to get pulled.</div>
      <img className="pull-secret-obunga" src="/assets/easter-egg/obunga-transparent.png" alt="" />
    </div>}
  </div>;
}
