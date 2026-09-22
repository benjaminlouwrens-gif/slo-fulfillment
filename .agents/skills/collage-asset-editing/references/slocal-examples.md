# SloCal examples

Project: `/Users/benyaminlouwrens/untitled folder/slo-fulfillment`.

## Text cleanup

Under `public/assets/collage/approved-cutouts/`:

- `warehouse-building-reference.png` -> `warehouse-no-text-desktop.png`: truck slogan, warehouse branding, dock numbers, and background lettering removed. Preserve the source alpha silhouette. An initial export lost alpha and exposed a black area; checking `hasAlpha` and comparing source/output alpha bytes caught it. In Sharp, finish the RGB resize/removal pipeline into a buffer before starting a new pipeline to join the source alpha. Do not assume chained removeAlpha/joinChannel calls execute in the written order.
- `reference-left-note.png` -> `note-no-text-desktop.png`: preserve pink paper and surrounding collage scraps; remove the handwritten words. Mobile keeps the original image.
- Use `<picture><source media="(min-width: 641px)" .../><img .../></picture>` so desktop changes do not overwrite mobile sources.

## Sign extraction

`road-sign-cutout.png` -> `road-sign-transparent.png`: retain original green sign pixels and white destination lettering, crop its surrounding photo to transparent alpha. The sign moves out of the desktop hero into the local destinations section. It is decorative, has no handler, and uses pointer-events:none.

The original is 330x220. Its contour follows a tilted rounded quadrilateral from roughly (51,26) to (301,84), (296,193), and (22,155). Trace and inspect the actual border, including curved corners; do not use these example coordinates for a different image. A generated extraction changed the sign texture and was discarded.

## Placement and motion

Move `.collage-palm-cutout--right` down opposite `.collage-tape`. Mirror and move `.collage-palm-additional` itself, keeping exactly one existing leafy branch. Mobile overrides must preserve their original positions.

Below-hero `.sl-product` elements retain their original CSS transform while separate translate/rotate animation adds irregular nudges. The hero is excluded. IntersectionObserver controls animation-play-state.

## Verification

`scripts/verify-surf.cjs` exercises viewport variants, image selection, layer counts, frame scrubbing, canvas pixels, reverse and stopped scroll, cache limits, anchor offsets, reduced motion, and failed media. It writes screenshots and a JSON report to `/tmp/slocal-*` for inspection. Run it with Playwright available and PREVIEW_URL pointing to the local server.

The Pexels source and frame preparation commands are recorded in `public/assets/surf/SOURCES.md`. The frame-preparation script uses Sharp; set NODE_PATH to an installed Sharp runtime when it is not installed in the project.
