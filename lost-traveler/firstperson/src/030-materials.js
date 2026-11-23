// ---------------------------------------------------------------- materials
const matCache = new Map();
function std(color, extra) {
  const simple = !extra || Object.values(extra).every(v => v === null || typeof v !== 'object');
  const key = color + (extra ? JSON.stringify(extra) : '');
  if (simple && matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshStandardMaterial({ color, roughness: .88, metalness: 0, ...extra });
  if (simple) matCache.set(key, m);
  return m;
}
const metal = c => std(c, { roughness: .45, metalness: .35 });
// things that glow more at night
const glows = [];
function glowMat(map, emissiveMap, day, night, extra = {}) {
  const m = new THREE.MeshStandardMaterial({ map, roughness: .8, emissive: 0xffffff, emissiveMap, emissiveIntensity: day, ...extra });
  glows.push({ mat: m, day, night });
  return m;
}

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = Math.max(4, Math.round(w)); c.height = Math.max(4, Math.round(h));
  const g = c.getContext('2d');
  draw(g, c.width, c.height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function speckle(g, w, h, alpha, n) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = rand() < .5 ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
    g.fillRect(rand() * w, rand() * h, 1 + rand() * 3, 1 + rand() * 3);
  }
}
// shared grey grime for side walls (tinted by material color)
const grimeTex = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); speckle(g, w, h, .05, 2500);
  for (let i = 0; i < 18; i++) { const x = rand() * w, gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(70,60,70,.12)'); gr.addColorStop(1, 'rgba(70,60,70,0)'); g.fillStyle = gr; g.fillRect(x, 0, 4 + rand() * 12, h * (.3 + rand() * .7)); }
}, [1, 1]);
grimeTex.wrapS = grimeTex.wrapT = THREE.RepeatWrapping;
const sideMat = c => { const k = 'side' + c; if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color: c, map: grimeTex, roughness: .9 })); return matCache.get(k); };

