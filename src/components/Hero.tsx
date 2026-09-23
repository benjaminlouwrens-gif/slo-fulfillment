'use client';

import { SurfTransition } from './SurfTransition';

const CUTOUTS = '/assets/collage/approved-cutouts';

export function Hero() {
  return (
    <SurfTransition>
      <section className="collage-hero" aria-label="Southern LoCal Fulfillment introduction">
        <div className="collage-paper-field" aria-hidden="true"></div>
        <div className="collage-pastel-sun" aria-hidden="true"></div>
        <img className="collage-beach-horizon" src={`${CUTOUTS}/beach-horizon-cutout.png`} alt="" aria-hidden="true" />
        <img className="collage-mountain-cutout collage-scene-piece" src="/assets/collage/cutouts/mountain-cutout.png" alt="" />
        <picture>
          <source media="(min-width: 641px)" srcSet={`${CUTOUTS}/warehouse-no-text-desktop.png`} />
          <img className="collage-warehouse-cutout collage-scene-piece" src={`${CUTOUTS}/warehouse-building-reference.png`} alt="" />
        </picture>
        <img className="collage-palm-cutout collage-palm-cutout--left collage-persistent-left" src={`${CUTOUTS}/reference-palms-left.png`} alt="" />
        <img className="collage-palm-cutout collage-palm-cutout--right collage-persistent-right" src={`${CUTOUTS}/reference-palms-left.png`} alt="" />
        <img className="collage-palm-additional" src={`${CUTOUTS}/palm-additional-cutout.png`} alt="" aria-hidden="true" />
        <img className="collage-sun-paper-cutout" src={`${CUTOUTS}/sun-paper-cutout.png`} alt="" aria-hidden="true" />
        <div className="collage-copy">
          <p className="collage-kicker">Southern California brands belong here</p>
          <h1><span>SloCal</span><strong>Fulfillment</strong></h1>
          <button type="button" className="collage-road-cta" onClick={() => window.dispatchEvent(new Event('slocal:start-surf'))}>
            <span className="collage-road-cta__eyebrow">SWIPE UP TO SEE IF WE CAN</span>
            <strong>WAREHOUSE, PACK &amp; SHIP</strong>
            <span className="collage-road-cta__footer">YOUR PRODUCTS
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down" aria-hidden="true">
                <path d="M12 5v14"></path>
                <path d="m19 12-7 7-7-7"></path>
              </svg>
            </span>
          </button>
        </div>
        <img className="collage-box-cutout collage-box-cutout--one" src={`${CUTOUTS}/boxes-cutout.png`} alt="" aria-hidden="true" />
        <img className="collage-box-cutout collage-box-cutout--two" src={`${CUTOUTS}/forklift-cutout.png`} alt="" aria-hidden="true" />
        <img className="collage-sign-cutout" src={`${CUTOUTS}/road-sign-cutout.png`} alt="" aria-hidden="true" />
        <img className="collage-torn-cream" src={`${CUTOUTS}/torn-paper-01.png`} alt="" aria-hidden="true" />
        <img className="collage-torn-foreground" src={`${CUTOUTS}/torn-paper-foreground.png`} alt="" aria-hidden="true" />
        <img className="collage-tape" src={`${CUTOUTS}/reference-tape.png`} alt="" aria-hidden="true" />
        <picture>
          <source media="(min-width: 641px)" srcSet={`${CUTOUTS}/note-no-text-desktop.png`} />
          <img className="collage-reference-note" src={`${CUTOUTS}/reference-left-note.png`} alt="" aria-hidden="true" />
        </picture>
        <div className="collage-paper-note collage-paper-note--left" aria-hidden="true">
          GOOD<br />BRANDS<br />GO FAR
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </div>
        <div className="collage-paper-note collage-paper-note--right" aria-hidden="true">
          FROM<br />SOCAL<br />TO<br />EVERYWHERE
        </div>
      </section>
    </SurfTransition>
  );
}
