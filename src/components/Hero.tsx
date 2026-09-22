'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Heart } from 'lucide-react';
import { SurfTransition } from './SurfTransition';

const cutoutPath = '/assets/collage/approved-cutouts';

export const Hero: React.FC = () => {
  return (
    <SurfTransition><section
      className="collage-hero"
      aria-label="Southern LoCal Fulfillment introduction"
    >
      <div className="collage-paper-field" aria-hidden="true" />
      <div className="collage-pastel-sun" aria-hidden="true" />
      <img className="collage-beach-horizon" src={`${cutoutPath}/beach-horizon-cutout.png`} alt="" aria-hidden="true" />
      <img className="collage-mountain-cutout collage-scene-piece" src="/assets/collage/cutouts/mountain-cutout.png" alt="" />
      <picture><source media="(min-width: 641px)" srcSet={`${cutoutPath}/warehouse-no-text-desktop.png`} /><img className="collage-warehouse-cutout collage-scene-piece" src={`${cutoutPath}/warehouse-building-reference.png`} alt="" /></picture>

      <img className="collage-palm-cutout collage-palm-cutout--left collage-persistent-left" src={`${cutoutPath}/reference-palms-left.png`} alt="" />
      <img className="collage-palm-cutout collage-palm-cutout--right collage-persistent-right" src={`${cutoutPath}/reference-palms-left.png`} alt="" />
      <img className="collage-palm-additional" src={`${cutoutPath}/palm-additional-cutout.png`} alt="" aria-hidden="true" />
      <img className="collage-sun-paper-cutout" src={`${cutoutPath}/sun-paper-cutout.png`} alt="" aria-hidden="true" />

      <motion.div
        className="collage-copy"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <p className="collage-kicker">Southern California brands belong here</p>
        <h1><span>SloCal</span><strong>Fulfillment</strong></h1>
        <button type="button" className="collage-road-cta" onClick={() => window.dispatchEvent(new Event('slocal:start-surf'))}>
          <span>SWIPE UP TO SEE IF WE CAN</span>
          <strong>WAREHOUSE, PACK &amp; SHIP</strong>
          <span>YOUR PRODUCTS <ArrowDown size={16} /></span>
        </button>
      </motion.div>

      <img className="collage-box-cutout collage-box-cutout--one" src={`${cutoutPath}/boxes-cutout.png`} alt="" aria-hidden="true" />
      <img className="collage-box-cutout collage-box-cutout--two" src={`${cutoutPath}/forklift-cutout.png`} alt="" aria-hidden="true" />
      <img className="collage-sign-cutout" src={`${cutoutPath}/road-sign-cutout.png`} alt="" aria-hidden="true" />
      <img className="collage-torn-cream" src={`${cutoutPath}/torn-paper-01.png`} alt="" aria-hidden="true" />
      <img className="collage-torn-foreground" src={`${cutoutPath}/torn-paper-foreground.png`} alt="" aria-hidden="true" />
      <img className="collage-tape" src={`${cutoutPath}/reference-tape.png`} alt="" aria-hidden="true" />
      <picture><source media="(min-width: 641px)" srcSet={`${cutoutPath}/note-no-text-desktop.png`} /><img className="collage-reference-note" src={`${cutoutPath}/reference-left-note.png`} alt="" aria-hidden="true" /></picture>
      <div className="collage-paper-note collage-paper-note--left" aria-hidden="true">GOOD<br />BRANDS<br />GO FAR <Heart size={14} fill="currentColor" /></div>
      <div className="collage-paper-note collage-paper-note--right" aria-hidden="true">FROM<br />SOCAL<br />TO<br />EVERYWHERE</div>

    </section></SurfTransition>
  );
};
