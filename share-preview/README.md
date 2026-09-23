# SloCal Fulfillment: Page Consolidation Plan

This is an implementation plan, not an already-applied redesign. The diagram supplied by the site owner decides the desktop order. Mobile uses the same content in a shorter, quieter layout.

## New page order

1. **Hero and surf:** Keep the current desktop and mobile hero compositions, sign action, wave footage, snap behavior, and reduced-motion fallback.
2. **Expanded pink story:** Keep the opening "A world of products. A place for yours." Then merge the complete six-category Industries content and the two "Sound familiar?" examples into this same pink band. Use spacing and fine rules to distinguish the three parts, rather than separate full-height pages or more cards.
3. **Blue services and bottle:** Keep "A little of this. A lot of possibility.", all three service descriptions, the food-handling note, the croissant, and the scroll-driven pump/drop interaction. This still follows the pink story immediately.
4. **Compact cream process:** Keep "A little hello. A big handoff." and its `#lotion-target` A in place after the blue section. Present the existing three steps as one horizontal numbered strip on wide screens. Put all six existing FAQ questions and answers in a compact accordion area below the strip, inside the same cream band.
5. **Consultation form:** Keep the existing form, fields, validation, submit states, and backend behavior. Keep the three benefits (free for brands, personal introductions, and choosing a partner) alongside it on desktop.
6. **Final yellow local page and footer:** Keep "SoCal is our home turf", destinations, road sign secret action, and footer after the form, as they are now.

## Desktop composition

- Let the pink band grow from its actual content rather than leaving a large empty minimum-height panel. Preserve enough pink coverage for the wave to finish without exposing blue underneath.
- In the pink band, lead with the current product imagery and headline. Follow with "Made to eat. Made to keep. Made by you." and all six linked industries in a three-column, two-row type grid; retain the Shopify/Amazon/TikTok Shop integration note.
- End the pink band with two editorial example rows side by side: "The boxes have taken over" and "Your brand grew. Your 3PL didn't." Keep each scenario's challenge, needed capabilities, and contact link. Retain the visible disclaimer that these are example scenarios, not customer case studies. Remove the separate dark-green Industries band and separate white/pastel example cards after their content has moved.
- Keep the blue section's bottle/croissant and three service rows at their current visual scale. Keep the process heading and animated A at the blue-to-cream handoff; make only the three steps compact. Place the FAQ immediately below them with thin dividers, so it no longer reads as another large page.
- Keep the form's two-column desktop composition and the final yellow page's current two-column composition.

## Mobile composition (650px and below)

- Keep the initial hero and surf experience unchanged. After the wave, use one continuous pink band, with natural height and tighter vertical spacing than the current oversized intro.
- Keep fruit and headphones as small edge accents around the opening. Use the sneakers once near the process steps instead of repeating product cutouts across multiple mobile sections. Keep all meaningful copy and links.
- Show all six industries as a compact two-column text-link grid with comfortable tap targets. Keep the platform note as one short line beneath it. Do not make six tall stacked panels.
- Show the two example scenarios as short, full-width rows separated by rules, each with its existing link. No large colored cards or duplicate section heading.
- In the blue area, keep the bottle size, nozzle position, scroll phase, drop path, and A target behavior. Reduce only surrounding whitespace and repeated decoration; retain the croissant, three service descriptions, and handling note.
- Stack the process steps as three slim numbered rows. Hide only duplicate decorative product cutouts; keep all step text. Follow with six collapsed FAQ disclosures in the same cream band.
- Place the three form benefits in a concise line/list above the form. Omit the extra mobile "Let's make some room" headline and duplicate croissant/skincare decoration; keep the form title, every field, and every submission state. Leave the final yellow page and footer intact.

## Content and link preservation

| Current content | New home |
| --- | --- |
| Pink opening, headline, product imagery, CTA | Start of expanded pink band |
| Six industries, introduction, platform note | Middle of expanded pink band |
| Two "Sound familiar?" scenarios, disclaimer, CTAs | End of expanded pink band |
| Three services, bottle animation, handling note | Blue band, same order |
| Three process steps and animated A | Start of cream band |
| Six FAQ answers and phone link | End of cream band |
| Three consultation benefits and form | Form area |
| Local destinations, secret road sign, footer | Final yellow page and footer |

Keep `#possibilities`, `#industries`, `#case-studies`, `#services`, `#how-it-works`, `#faq`, and `#contact` working after sections move. Put the moved IDs on their new subsections and apply fixed-header scroll offsets. Rename the header/footer "Case Studies" link to "Examples" because the page explicitly says the scenarios are not customer case studies; retain `#case-studies` as a legacy deep link. Direct hashes must land on visible content without restarting the surf transition.

## Implementation and acceptance

- Restructure `src/components/FulfillmentStory.tsx` and its responsive rules in `src/styles/globals.css`. Update matching header and footer navigation labels. Reuse the current copy, links, accessible FAQ disclosures, and existing product assets. Do not duplicate the moved sections in the DOM.
- Keep `src/components/SurfTransition.tsx`, the pump/drop behavior, `src/components/ContactForm.tsx`, and the inquiry API functionally unchanged. Adjust layout around them only where needed; recalculate the drop's geometry after layout changes rather than using fixed coordinates.
- At wide desktop, short laptop, and narrow phone widths, verify the page order, content inventory above, no text or artwork overlap, readable links, and a pink wave landing without a blue flash.
- Test forward and reverse surf scrolling, stopped-scroll frames, the hero sign action, the bottle pressing and drop striking the A, direct links to every retained hash, mobile navigation, FAQ disclosure, form validation and error/success states, and reduced motion. Run type checking and the production build. Compare before/after full-page screenshots on desktop and mobile before shipping.

## Share-preview notes

This folder includes the current site preview, bundled JavaScript/CSS, and local artwork. The consolidation described above has **not** been applied to that preview. To view it locally, run `python3 -m http.server 8000` from this folder and open `http://127.0.0.1:8000/`. The consultation form backend is not included in this static preview.
