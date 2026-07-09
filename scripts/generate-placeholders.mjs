// Generates 8 warm, abstract "night dhaba" placeholder JPEGs for the gallery.
// Run from the repo root: node scripts/generate-placeholders.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/gallery");
await mkdir(outDir, { recursive: true });

// [filename, glow x%, glow y%, glow color, base color]
const scenes = [
  ["chai-pour.jpg", 50, 35, "#d29a4a", "#231810"],
  ["night-exterior.jpg", 30, 60, "#b97f35", "#171009"],
  ["paratha-tawa.jpg", 60, 55, "#c98f3f", "#241608"],
  ["chai-table.jpg", 45, 45, "#d2a45e", "#1d1409"],
  ["kettle-flame.jpg", 50, 70, "#e0a94f", "#160f08"],
  ["interior-seating.jpg", 35, 40, "#c08a3e", "#20150c"],
  ["kashmiri-chai.jpg", 55, 40, "#d9a0a0", "#221410"],
  ["late-night-crowd.jpg", 65, 50, "#bf8636", "#181008"],
];

for (const [name, cx, cy, glow, base] of scenes) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
    <defs>
      <radialGradient id="g" cx="${cx}%" cy="${cy}%" r="75%">
        <stop offset="0%" stop-color="${glow}" stop-opacity="0.75"/>
        <stop offset="45%" stop-color="${glow}" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="${base}" stop-opacity="0"/>
      </radialGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.09"/></feComponentTransfer>
        <feComposite operator="over" in2="SourceGraphic"/>
      </filter>
    </defs>
    <rect width="1200" height="900" fill="${base}"/>
    <rect width="1200" height="900" fill="url(#g)"/>
    <rect width="1200" height="900" filter="url(#grain)" opacity="0.5"/>
    <rect width="1200" height="900" fill="#171009" opacity="0.15"/>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 68 }).toFile(path.join(outDir, name));
  console.log("wrote", name);
}
