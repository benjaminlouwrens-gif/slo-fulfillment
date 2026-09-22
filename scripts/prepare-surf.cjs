const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

// Input frames are a counterclockwise rotation of Pexels 17086197, not synthesized water.
async function main() {
  const root = path.join(__dirname, '..');
  const contours = [];
  for (let frame = 0; frame < 96; frame++) {
    const name = `frame-${String(frame).padStart(3, '0')}`;
    const input = path.join(root, '.cache/surf', `${name}.png`);
    const { data, info } = await sharp(input).resize(320, 180).blur(2).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const edge = [];
    for (let x = 0; x < 320; x += 4) {
      let sand = 65;
      let warmest = -255;
      for (let y = 50; y < 130; y++) {
        const i = (y * info.width + x) * 3;
        const warmth = data[i] - data[i + 2];
        if (warmth > warmest) { sand = y; warmest = warmth; }
      }
      let found = sand;
      for (let y = sand; y < 165; y++) {
        const i = (y * info.width + x) * 3;
        if (data[i + 2] - data[i] > 7 && data[i + 1] - data[i] > 4) { found = y; break; }
      }
      edge.push(found / 180);
    }
    contours.push(edge.map((_, i) => {
      const neighbors = edge.slice(Math.max(0, i - 2), i + 3).sort((a, b) => a - b);
      return neighbors[Math.floor(neighbors.length / 2)];
    }));
    await sharp(input).webp({ quality: 75 }).toFile(path.join(root, 'public/assets/surf/desktop', `${name}.webp`));
    await sharp(input).resize(768, 432).webp({ quality: 70 }).toFile(path.join(root, 'public/assets/surf/mobile', `${name}.webp`));
  }
  await fs.writeFile(path.join(root, 'public/assets/surf/manifest.json'), JSON.stringify({ count: 96, fps: 24, width: 1280, height: 720, contours }));
}
main().catch(error => { console.error(error); process.exit(1); });
