# SloCal Interaction Skill Audit

## Scope and status

| Item | Status | Evidence |
| --- | --- | --- |
| Asset-collage editing workflow | captured | Existing local `collage-asset-editing` skill and `Hero.tsx` use desktop/mobile sources and contour cutouts. |
| Scroll-driven bottle choreography | captured, needs repair later | `PumpBottle.tsx` measures a nozzle and target but current visual implementation does not yet satisfy the approved four-state design. |
| Real-footage surf canvas | captured | `SurfTransition.tsx`, `public/assets/surf/manifest.json`, and surf preparation/verification scripts. |
| Surf scroll-state bug investigation | documented, no code change | `SurfTransition.tsx` has overlapping scroll geometry and input ownership. |
| Handmade motion and hover shake | captured | `FulfillmentStory.tsx` intersection observer and product animation rules in `globals.css`. |
| Interaction verification | captured | `scripts/verify-surf.cjs` and `scripts/verify-interactions.cjs`. |

## Local reusable skills

| Skill | Purpose |
| --- | --- |
| `collage-asset-editing` | Pixel edits, contour cutouts, independent responsive art, moved layers, handmade motion. |
| `collage-web-production` | Source manifests, production integration, isolated color treatment, and responsive asset roles. |
| `footage-scroll-canvas` | Real footage extraction, contour-masked responsive canvas rendering, bounded frame cache, and media fallbacks. |
| `scroll-scene-state-machine` | One owner for document scroll, pinned scene input, resize, anchors, completion, and reverse travel. |
| `scroll-driven-object-choreography` | Measured source-to-target movement and named visual states for pumps, drops, and impacts. |
| `interaction-visual-verification` | Viewport screenshots plus behavioral checks for animations and failure paths. |

## What the current implementation teaches

### Collage assets

The hero separates source-pixel edits from CSS positioning. `Hero.tsx` selects a desktop warehouse without text at `min-width: 641px` while preserving the original mobile warehouse source. The road sign is removed on desktop but retained in the downstream local section. The surf canvas is separate from the collage layers and must stay outside hero filters.

### Surf transition

The reusable technique is a real-footage canvas driven by manifest frames and source-derived contour data. It uses desktop/mobile variants, bounded `ImageBitmap` caching, preloads frames near the current target, and uses a clipped leading edge rather than a rectangular video reveal. It deliberately keeps scale constant so the wave advances without zooming.

### Bottle/drop choreography

The current implementation has the right primitive measurements but not the approved result. It measures `sl-pump-nozzle` and `lotion-target` in viewport space, then portals the drop overlay to `document.body`. The later repair must preserve this measurement strategy while using the approved state contract:

1. Curved mint-blue foam attached to the actual dispenser nozzle.
2. Large simple mint-blue foam shape traveling down to the exact `A` in `A little hello.`
3. Smaller compact foam shape centered over that `A`.
4. Only several simple lines radiating from the A, then disappearing.

The pump head must begin pressing at the approved later scroll interval, and its body must clip the head movement. No realistic liquid treatment, particles, or expanding blob should be introduced.

### Handmade motion

The current product movement already has separate durations and delays, an IntersectionObserver pause mechanism, a reduced-motion fallback, and a short hover shake. The reusable lesson is to confine motion to selected cutouts while leaving text and controls stationary.

## Pink-section scroll bug: current evidence

No repair was made in this audit.

The likely conflict is inside `SurfTransition.tsx`:

- The active wrapper reserves `300svh` while its stage is sticky at `100svh`.
- The following story section is pulled upward by `margin-top: -100svh`.
- Every draw imperatively changes that story section's `transform` based on live root geometry.
- A capture-phase global wheel handler and global touch handler decide whether to prevent input and launch a programmatic scroll animation.
- Completion is represented both by `transitionStarted` and a `data-transition` attribute, while later scroll geometry can independently re-qualify input around the transition boundary.

That combination can make the pink area feel resistant after the wave: normal document layout, imperative story transform, sticky scene position, and captured input can disagree about whether the viewport is still inside the scene.

## Later repair plan

1. Add temporary state and geometry logging without changing behavior. Record state, `scrollY`, bounds, prevented events, sticky rect, and story transform for downward completion, reverse entry, rapid input, resize, and direct anchors.
2. Replace ad hoc flags with an explicit state machine: `beforeWave`, `snapEnteringWave`, `waveComplete`, `reverseWave`, and `failedOrReduced`.
3. Give each state one scroll owner. Global input interception may exist only during `snapEnteringWave` and `reverseWave`; it must be fully released in `waveComplete`.
4. Derive the next section's position from the same scene progress used for the sticky range, or remove the per-frame transform/negative-margin combination. Do not leave two independent layout systems in control.
5. Re-run surf and interaction verification plus manual screenshots at wide desktop, short laptop, and mobile. Add regression checks for the pink section's first several scrolls after wave completion.

## Do not touch during diagnosis

- Surf frame extraction, contour data, frame cache limits, wave orientation, or constant-scale rendering.
- Hero art source files, desktop/mobile source selection, and isolated hero color filters.
- The form backend or deployment configuration.
- The approved visual contract for the bottle/drop sequence, except in its dedicated repair after the surf state machine is stable.
