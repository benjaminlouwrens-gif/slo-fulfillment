---
name: collage-asset-editing
description: Edit photographic website collages by preserving objects while removing lettering, extracting contour cutouts, repositioning existing layers, and adding restrained handmade motion. Use for asset-level collage changes with protected responsive layouts.
---

# Collage Asset Editing

## Identify the actual layer

Inspect the rendered page and source assets before editing. A screenshot may contain overlapping images, embedded lettering, HTML text, and CSS masks. Map each requested change to its original asset and DOM selector. Do not crop the whole hero into new decorative assets.

Record the approved desktop and mobile views first. Treat mobile preservation as a separate invariant, not a promise inferred from desktop CSS. Keep original image files and select edited variants with a media-specific picture source.

## Remove lettering without removing objects

Use the image editing tool to inpaint only the lettering and its surface. Name every invariant: building geometry, truck, lighting, paper edges, background, texture, and framing. Explicitly say whether the entire rectangle or an alpha silhouette must survive. Do not replace a surface with a flat CSS rectangle or erase the object carrying the text.

Inspect the result before integration. Reject missing backgrounds, black replacement regions, invented objects, changed silhouettes, and redrawn lettering. Compare the actual alpha channel, not the image viewer's black or checkerboard background. Restore source dimensions and an existing source alpha mask during export when appropriate; do not infer transparency from black pixels.

## Contour cutouts

Use the original photograph as the source. Remove the surrounding background along the object's outline, including holes where needed, while retaining fine edges and any requested text. Prefer a true transparent PNG/WebP over a rectangular photo tile. Keep a small transparent gutter so rotation and shadows do not clip the object.

For precise user-requested cropping, a traced contour mask can preserve original pixels more faithfully than a regenerated object. Inspect the mask against contrasting backgrounds and at final display size. SVG may describe the alpha mask; it must not redraw the photographic object. A CSS clip-path can isolate a sprite cell but is not a substitute for removing its photographic background.

## Move existing assets

Change the existing layer's position and transform. Do not add a second copy when the request is to mirror or move it. Keep rotation, mirroring, and animation transforms independent. Check layer count, transform origin, stacking, overlap, and scroll width at every protected breakpoint.

## Handmade movement

Animate only the approved objects. Use authored short nudges, uneven holds, modest rotation, and different timing for each object. Avoid endless synchronized sine-wave floating. Preserve the layout transform by using individual translate/rotate properties or a dedicated inner layer. Pause offscreen with IntersectionObserver and disable motion for prefers-reduced-motion.

## Real footage and verification

When real footage is requested, source and license real footage. Never substitute generated scenery. Frame-by-frame scroll effects should map scroll position to a frame, reverse on reverse scroll, stop when scrolling stops, bound decoded image memory, and retain ordinary scrolling if media fails.

Verify pixels and behavior together: before/after screenshots, preserved mobile image sources and positions, clean cutout edges, no duplicate assets, no lost surfaces, no rectangular reveal edges, and no blank transition frames. A build passing does not validate artwork.

See [the SloCal examples](references/slocal-examples.md) for concrete source-to-result mappings and verification commands.
