// Renders the 1200×630 Open Graph image (src/app/opengraph-image.png) by
// screenshotting an HTML card in headless Chromium, so the Nastaliq lockup
// gets real HarfBuzz shaping. Fonts are downloaded next to this script as
// nastaliq.ttf / bricolage.ttf before running (see css2 URLs in README).
//
// Run from the repo root:
//   FONT_DIR=<dir with ttfs> node scripts/generate-og.mjs
import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";
import path from "node:path";

const fontDir = process.env.FONT_DIR ?? path.dirname(new URL(import.meta.url).pathname);
const nastaliq = (await readFile(path.join(fontDir, "nastaliq.ttf"))).toString("base64");
const bricolage = (await readFile(path.join(fontDir, "bricolage.ttf"))).toString("base64");

const html = `<!doctype html>
<html>
<head>
<style>
  @font-face {
    font-family: "Noto Nastaliq Urdu";
    src: url(data:font/ttf;base64,${nastaliq}) format("truetype");
  }
  @font-face {
    font-family: "Bricolage Grotesque";
    src: url(data:font/ttf;base64,${bricolage}) format("truetype");
  }
  * { margin: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #171009;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }
  .glow {
    position: absolute;
    left: 50%; top: 40%;
    width: 700px; height: 700px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(210,154,74,0.22), rgba(23,16,9,0) 65%);
  }
  .lockup {
    font-family: "Noto Nastaliq Urdu";
    font-size: 120px;
    line-height: 2;
    color: #F4EADB;
    direction: rtl;
    position: relative;
    margin-top: -70px;
  }
  .strap {
    font-family: "Bricolage Grotesque";
    font-size: 40px;
    color: #D29A4A;
    position: relative;
    margin-top: 4px;
  }
  .sub {
    font-family: "Bricolage Grotesque";
    font-size: 28px;
    color: #9AA3A8;
    position: relative;
    margin-top: 18px;
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="lockup" lang="ur">چائے ۲۵ ہے</div>
  <div class="strap">Chaye 25 Hai</div>
  <div class="sub">Open 24 hours · Federal B Area, Karachi</div>
</body>
</html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "src/app/opengraph-image.png" });
await browser.close();
console.log("wrote src/app/opengraph-image.png");
