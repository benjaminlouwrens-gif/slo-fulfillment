# Surf footage

- Creator: Lazaros Thodis.
- Source: https://www.pexels.com/video/an-aerial-view-of-the-ocean-with-waves-17086197/
- Download: https://videos.pexels.com/video-files/17086197/17086197-uhd_2160_3840_60fps.mp4
- License: https://www.pexels.com/license/ (checked September 21, 2026). Free website/commercial use and modification allowed; attribution optional. No endorsement implied.
- Treatment: first four seconds, rotated counterclockwise so the water advances upward, sampled at 24 fps. Desktop 1280x720 WebP; mobile 768x432 WebP. Actual filmed foam contours are recorded in manifest.json.
- No generated water, simulated ocean, or stock-footage redistribution service. These frames are an integrated website transition.

Rebuild from the downloaded source with FFmpeg, then run scripts/prepare-surf.cjs with Sharp available:

```sh
mkdir -p .cache/surf public/assets/surf/desktop public/assets/surf/mobile
ffmpeg -i /path/to/17086197.mp4 -t 4 -vf 'transpose=2,fps=24,scale=1280:720' -start_number 0 .cache/surf/frame-%03d.png
node scripts/prepare-surf.cjs
```
