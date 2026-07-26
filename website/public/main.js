/**
 * FitForge AI website frontend.
 *
 * - Lenis smooth scrolling driven by GSAP's ticker
 * - GSAP ScrollTrigger for reveals, pinned horizontal scroll, scrubbed effects
 * - Three separate Three.js scenes: hero orb, features torus knot, CTA wave
 * - Live data from the Express backend (/api/stats, /api/newsletter)
 */
import * as THREE from 'three';

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PALETTE = {
  void: 0x0a0a0f,
  iris: 0x6d5df6,
  irisDeep: 0x4c3fd8,
  aqua: 0x22d3ee,
  magenta: 0xe879f9,
};

/* ---------------------------------------------------------------- *
 * Smooth scrolling
 * ---------------------------------------------------------------- */
const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('[data-scroll-to]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -60, duration: 1.4 });
  });
});

const nav = document.getElementById('nav');
lenis.on('scroll', ({ scroll }) => nav.classList.toggle('scrolled', scroll > 40));

/* ---------------------------------------------------------------- *
 * Three.js scene manager — one renderer per canvas, paused offscreen
 * ---------------------------------------------------------------- */
const scenes = [];
const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
});

function createScene(canvasId, { fov = 50, z = 6 } = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.z = z;

  const entry = { canvas, renderer, scene, camera, active: true, update: null };
  const fit = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  fit();
  window.addEventListener('resize', fit);

  new IntersectionObserver(
    ([e]) => { entry.active = e.isIntersecting; },
    { rootMargin: '100px' }
  ).observe(canvas);

  scenes.push(entry);
  return entry;
}

gsap.ticker.add((time, deltaMS) => {
  const dt = Math.min(deltaMS / 1000, 0.05);
  for (const s of scenes) {
    if (!s.active) continue;
    s.update?.(time, dt);
    s.renderer.render(s.scene, s.camera);
  }
});

/* ------------------------ Scene 1: hero orb ------------------------ */
function initHeroScene() {
  const s = createScene('hero-canvas', { fov: 55, z: 6.5 });
  if (!s) return;

  const group = new THREE.Group();
  s.scene.add(group);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.15, 1),
    new THREE.MeshBasicMaterial({ color: PALETTE.iris, wireframe: true, transparent: true, opacity: 0.32 })
  );
  const inner = new THREE.Points(
    new THREE.IcosahedronGeometry(1.4, 4),
    new THREE.PointsMaterial({ color: PALETTE.aqua, size: 0.035, transparent: true, opacity: 0.85 })
  );
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 32, 32),
    new THREE.MeshBasicMaterial({ color: PALETTE.irisDeep, transparent: true, opacity: 0.4 })
  );
  group.add(shell, inner, core);

  const starCount = 900;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 4.5 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi) - 3;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.45 })
  );
  s.scene.add(stars);

  // Scroll parallax: the orb drifts up and shrinks as the hero scrolls away.
  const scroll = { y: 0, scale: 1 };
  gsap.to(scroll, {
    y: 2.4,
    scale: 0.72,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  s.update = (t, dt) => {
    group.rotation.y += dt * 0.18;
    group.rotation.x = Math.sin(t * 0.25) * 0.12;
    inner.rotation.y -= dt * 0.3;
    stars.rotation.y += dt * 0.012;
    core.scale.setScalar(1 + Math.sin(t * 2.1) * 0.09);
    group.position.y = scroll.y;
    group.scale.setScalar(scroll.scale);
    s.camera.position.x += (pointer.x * 0.7 - s.camera.position.x) * 0.04;
    s.camera.position.y += (-pointer.y * 0.45 - s.camera.position.y) * 0.04;
    s.camera.lookAt(0, scroll.y * 0.4, 0);
  };

  if (reducedMotion) {
    const frozen = s.update;
    frozen(0, 0);
    s.update = null;
  }
}

/* ------------------- Scene 2: features torus knot ------------------- */
const featuresProgress = { value: 0 };

function initFeaturesScene() {
  const s = createScene('features-canvas', { fov: 45, z: 7 });
  if (!s) return;

  s.scene.fog = new THREE.Fog(PALETTE.void, 6, 13);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.5, 0.42, 220, 36),
    new THREE.MeshStandardMaterial({
      color: 0x16161f,
      metalness: 0.9,
      roughness: 0.22,
      emissive: PALETTE.irisDeep,
      emissiveIntensity: 0.22,
    })
  );
  knot.position.set(2.4, 0.4, -1.5);
  s.scene.add(knot);

  const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.5, 0.55, 110, 18),
    new THREE.MeshBasicMaterial({ color: PALETTE.iris, wireframe: true, transparent: true, opacity: 0.1 })
  );
  wire.position.copy(knot.position);
  s.scene.add(wire);

  s.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const irisLight = new THREE.PointLight(PALETTE.iris, 140, 30);
  irisLight.position.set(-4, 3, 4);
  const aquaLight = new THREE.PointLight(PALETTE.aqua, 110, 30);
  aquaLight.position.set(5, -3, 3);
  s.scene.add(irisLight, aquaLight);

  s.update = (t, dt) => {
    // Base idle spin plus rotation scrubbed by the horizontal card scroll.
    const target = featuresProgress.value * Math.PI * 2;
    knot.rotation.y += (target + t * 0.06 - knot.rotation.y) * 0.06;
    knot.rotation.x = Math.sin(t * 0.2) * 0.25 + featuresProgress.value * 0.8;
    wire.rotation.copy(knot.rotation);
    wire.rotation.y -= 0.3;
    knot.position.x = 2.4 - featuresProgress.value * 4.2;
    wire.position.x = knot.position.x;
  };

  if (reducedMotion) {
    s.update(0, 0);
    s.update = null;
  }
}

/* --------------------- Scene 3: CTA particle wave --------------------- */
function initCtaScene() {
  const s = createScene('cta-canvas', { fov: 55, z: 7 });
  if (!s) return;
  s.camera.position.set(0, 2.6, 7);
  s.camera.lookAt(0, -0.5, 0);

  const cols = 90;
  const rows = 55;
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cIris = new THREE.Color(PALETTE.iris);
  const cAqua = new THREE.Color(PALETTE.aqua);
  const tmp = new THREE.Color();

  let i = 0;
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < rows; z++) {
      positions[i * 3] = (x / (cols - 1) - 0.5) * 20;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (z / (rows - 1) - 0.5) * 12;
      tmp.copy(cIris).lerp(cAqua, x / (cols - 1));
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
      i++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const wave = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.8 })
  );
  wave.position.y = -1.4;
  s.scene.add(wave);

  const pos = geo.attributes.position;
  s.update = (t) => {
    for (let j = 0; j < count; j++) {
      const x = pos.getX(j);
      const z = pos.getZ(j);
      pos.setY(j, Math.sin(x * 0.55 + t * 1.1) * 0.4 + Math.cos(z * 0.7 + t * 0.7) * 0.3);
    }
    pos.needsUpdate = true;
    s.camera.position.x = Math.sin(t * 0.1) * 0.8;
    s.camera.lookAt(0, -0.5, 0);
  };

  if (reducedMotion) {
    s.update(0);
    s.update = null;
  }
}

try {
  initHeroScene();
  initFeaturesScene();
  initCtaScene();
} catch (err) {
  // No WebGL — the CSS glows carry the design; everything else still works.
  console.warn('3D scenes disabled:', err);
}

/* ---------------------------------------------------------------- *
 * Scroll-driven animations
 * ---------------------------------------------------------------- */

// Top progress bar
gsap.to('#scroll-progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
});

// Generic reveals
gsap.utils.toArray('[data-reveal]').forEach((el) => {
  gsap.from(el, {
    y: 36,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 86%' },
  });
});

// Hero scroll hint fades as you leave the top
gsap.to('.hero-scroll-hint', {
  opacity: 0,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: '20% top', scrub: true },
});

// Marquee
if (!reducedMotion) {
  gsap.to('#marquee-track', { xPercent: -50, ease: 'none', duration: 24, repeat: -1 });
}

// Pinned horizontal features scroll, feeding the torus-knot scrub
const track = document.getElementById('features-track');
const trackDistance = () => Math.max(track.scrollWidth - window.innerWidth + 80, 0);
gsap.to(track, {
  x: () => -trackDistance(),
  ease: 'none',
  scrollTrigger: {
    trigger: '#features',
    start: 'top top',
    end: () => `+=${trackDistance()}`,
    scrub: 1,
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => { featuresProgress.value = self.progress; },
  },
});

// Feature cards tilt in as the track slides
gsap.utils.toArray('.feature-card').forEach((card, idx) => {
  gsap.from(card, {
    y: 60,
    opacity: 0,
    rotate: 2,
    duration: 0.9,
    delay: idx * 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#features', start: 'top 60%' },
  });
});

// Chat messages pop in one by one
gsap.from('[data-chat]', {
  opacity: 0,
  y: 26,
  scale: 0.95,
  stagger: 0.3,
  duration: 0.7,
  ease: 'back.out(1.6)',
  scrollTrigger: { trigger: '.chat-mock', start: 'top 72%' },
});

/* ---------------------------------------------------------------- *
 * Hero intro + preloader
 * ---------------------------------------------------------------- */
function splitChars(root) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const ch of child.textContent) {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch === ' ' ? ' ' : ch;
          frag.appendChild(span);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(root);
  return root.querySelectorAll('.char');
}

const heroChars = splitChars(document.getElementById('hero-title'));

const intro = gsap.timeline({ paused: true });
intro
  .to('#preloader', { opacity: 0, duration: 0.5, ease: 'power2.out' })
  .set('#preloader', { display: 'none' })
  .from(heroChars, {
    yPercent: 115,
    opacity: 0,
    rotate: 6,
    stagger: 0.028,
    duration: 0.9,
    ease: 'power4.out',
  }, '-=0.1');

if (reducedMotion) {
  gsap.set('#preloader', { display: 'none' });
} else {
  window.addEventListener('load', () => intro.play());
  // Safety: never trap the user behind the preloader.
  setTimeout(() => intro.play(), 2500);
}

/* ---------------------------------------------------------------- *
 * Backend wiring
 * ---------------------------------------------------------------- */
function formatStat(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${Math.round(value / 1000)}K`;
  return Math.round(value).toLocaleString('en-US');
}

async function initStats() {
  let stats = null;
  try {
    const res = await fetch('/api/stats');
    if (res.ok) stats = await res.json();
  } catch { /* offline — counters stay at 0 */ }

  ScrollTrigger.create({
    trigger: '#stats',
    start: 'top 72%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('[data-stat]').forEach((el, idx) => {
        const target = stats?.[el.dataset.stat] ?? 0;
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 2.2,
          delay: idx * 0.12,
          ease: 'power3.out',
          onUpdate: () => { el.textContent = formatStat(proxy.v); },
        });
      });
    },
  });
}
initStats();

const form = document.getElementById('newsletter-form');
const statusEl = document.getElementById('newsletter-status');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  const button = form.querySelector('button');
  button.disabled = true;
  statusEl.className = 'newsletter-status';
  statusEl.textContent = '…';

  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      statusEl.classList.add('ok');
      statusEl.textContent = `You're in — waitlist member #${data.subscribers}. ⚡`;
      form.reset();
      gsap.fromTo(button, { scale: 1 }, { scale: 1.06, yoyo: true, repeat: 1, duration: 0.15 });
    } else {
      statusEl.classList.add('err');
      statusEl.textContent = data.error ?? 'Something went wrong.';
      gsap.fromTo(form, { x: 0 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, clearProps: 'x' });
    }
  } catch {
    statusEl.classList.add('err');
    statusEl.textContent = 'Could not reach the server — is the backend running?';
  } finally {
    button.disabled = false;
  }
});
