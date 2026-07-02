/**
 * Procedural textures for the world — every color originates from the Design
 * Tokens (Part IV, Art. 1.3: tokens govern 2D and 3D as one system).
 * The Wordmark texture makes "Plerona" the literal light source of the Beam
 * (Part II, Art. 3.2). The founder portrait is a placeholder composition until
 * final artwork is supplied (noted in deliverables).
 */
import * as THREE from 'three';

const TOKENS = {
  beam: '#E8C670',
  spaceDeep: '#0B0F1A',
  panel: '#1A1F2E',
  textPrimary: '#F5F7FA',
  textSecondary: '#A8B0C0',
};

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

/** Glowing PLERONA lettering — the Wordmark IS the light (Part II, Art. 3). */
export function createWordmarkTexture(): THREE.CanvasTexture {
  const canvas = makeCanvas(2048, 320);
  const ctx = canvas.getContext('2d')!;

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 190px Inter, system-ui, sans-serif`;
    // Layered glow: wide soft halo → tight halo → hot core lettering.
    ctx.shadowColor = TOKENS.beam;
    ctx.shadowBlur = 90;
    ctx.fillStyle = TOKENS.beam;
    ctx.fillText('PLERONA', canvas.width / 2, canvas.height / 2 + 8);
    ctx.shadowBlur = 34;
    ctx.fillText('PLERONA', canvas.width / 2, canvas.height / 2 + 8);
    ctx.shadowBlur = 0;
    ctx.fillStyle = TOKENS.textPrimary;
    ctx.fillText('PLERONA', canvas.width / 2, canvas.height / 2 + 8);
  };

  draw();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  // Redraw once the real Inter face is available.
  if (typeof document !== 'undefined' && 'fonts' in document) {
    (document as Document & { fonts: FontFaceSet }).fonts.ready.then(() => {
      draw();
      texture.needsUpdate = true;
    });
  }
  return texture;
}

/** Soft radial glow sprite (Beam halo, engine glow, distant worlds). */
export function createGlowTexture(color: string = TOKENS.beam): THREE.CanvasTexture {
  const canvas = makeCanvas(256, 256);
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  const c = new THREE.Color(color);
  const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
  g.addColorStop(0, `rgba(${rgb},0.85)`);
  g.addColorStop(0.35, `rgba(${rgb},0.32)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Founder portrait — "galactic warrior" placeholder painting (Part II,
 * Art. 8.2): star field, nebula wash, armored silhouette, beam-gold visor.
 * Final commissioned artwork replaces this texture without structural change.
 */
export function createFounderPortraitTexture(): THREE.CanvasTexture {
  const canvas = makeCanvas(512, 680);
  const ctx = canvas.getContext('2d')!;

  // Background: deep space with a warm nebula rising behind the figure.
  ctx.fillStyle = TOKENS.spaceDeep;
  ctx.fillRect(0, 0, 512, 680);
  const nebula = ctx.createRadialGradient(256, 430, 40, 256, 430, 340);
  nebula.addColorStop(0, 'rgba(232,198,112,0.34)');
  nebula.addColorStop(0.55, 'rgba(232,198,112,0.10)');
  nebula.addColorStop(1, 'rgba(232,198,112,0)');
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, 512, 680);

  // Stars (static).
  ctx.fillStyle = TOKENS.textPrimary;
  for (let i = 0; i < 120; i += 1) {
    const x = (i * 137.5) % 512;
    const y = (i * 89.7) % 680;
    const r = i % 9 === 0 ? 1.6 : 0.8;
    ctx.globalAlpha = 0.35 + ((i * 31) % 60) / 100;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Armored figure silhouette.
  ctx.fillStyle = TOKENS.panel;
  ctx.strokeStyle = 'rgba(232,198,112,0.55)';
  ctx.lineWidth = 3;
  // Shoulders + torso
  ctx.beginPath();
  ctx.moveTo(120, 680);
  ctx.lineTo(128, 470);
  ctx.quadraticCurveTo(140, 380, 200, 356);
  ctx.lineTo(312, 356);
  ctx.quadraticCurveTo(372, 380, 384, 470);
  ctx.lineTo(392, 680);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Pauldrons
  ctx.beginPath();
  ctx.ellipse(160, 392, 52, 34, -0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(352, 392, 52, 34, 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Helmet
  ctx.beginPath();
  ctx.ellipse(256, 268, 74, 88, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Beam-gold visor — the warrior carries the light.
  ctx.fillStyle = TOKENS.beam;
  ctx.shadowColor = TOKENS.beam;
  ctx.shadowBlur = 26;
  ctx.beginPath();
  ctx.roundRect(196, 252, 120, 26, 13);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Chest emblem: the O-shaped Ship.
  ctx.strokeStyle = TOKENS.beam;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 470, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(214, 470);
  ctx.lineTo(298, 470);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
