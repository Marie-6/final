// ================================================================ wall, window and door textures
// Walls: a sharp tileable texture (512 px = 2 m) per style and color, repeated over the facade
const wallBase = new Map();
function wallTex(style, color) {
  const key = style + color;
  if (wallBase.has(key)) return wallBase.get(key);
  const S = 512, v = f => shade(color, f);
  const t = canvasTex(S, S, (g) => {
    g.fillStyle = color; g.fillRect(0, 0, S, S);
    if (style === 'mosaic') {                       // 5 cm square tiles
      g.fillStyle = v(.82); g.fillRect(0, 0, S, S);
      const ts = 12.8; for (let y = 0; y < S; y += ts) for (let x = 0; x < S; x += ts) { g.fillStyle = v(.92 + rand() * .14); g.fillRect(x + 1, y + 1, ts - 2, ts - 2); }
    } else if (style === 'tile') {                  // 20 x 10 cm tiles, staggered
      g.fillStyle = v(.84); g.fillRect(0, 0, S, S);
      const tw = 51.2, th = 25.6; for (let r = 0, y = 0; y < S; y += th, r++) for (let x = (r % 2) * tw / 2 - tw; x < S; x += tw) { g.fillStyle = v(.93 + rand() * .1); g.fillRect(x + 1.5, y + 1.5, tw - 3, th - 3); }
    } else if (style === 'brick') {
      g.fillStyle = shade('#C9C1B4', 1); g.fillRect(0, 0, S, S);
      const bw = 53.8, bh = 16.8; for (let r = 0, y = 0; y < S; y += bh, r++) for (let x = (r % 2) * bw / 2 - bw; x < S; x += bw) { g.fillStyle = v(.8 + rand() * .32); g.fillRect(x + 2, y + 2, bw - 4, bh - 4); }
      speckle(g, S, S, .06, 5000);
    } else if (style === 'cladding') {             // big stone-like panels
      g.fillStyle = v(.8); g.fillRect(0, 0, S, S);
      const pw = 153.6, ph = 76.8; for (let r = 0, y = 0; y < S; y += ph, r++) for (let x = (r % 2) * pw / 2 - pw; x < S; x += pw) { g.fillStyle = v(.95 + rand() * .07); g.fillRect(x + 2, y + 2, pw - 4, ph - 4); }
      speckle(g, S, S, .035, 6000);
    } else if (style === 'siding') {
      for (let y = 0; y < S; y += 38.4) { const gr = g.createLinearGradient(0, y, 0, y + 38.4); gr.addColorStop(0, v(1.05)); gr.addColorStop(1, v(.9)); g.fillStyle = gr; g.fillRect(0, y, S, 38.4); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, y + 36, S, 2.4); }
    } else if (style === 'wood') {
      for (let x = 0; x < S; x += 43.5) { g.fillStyle = v(.84 + rand() * .2); g.fillRect(x, 0, 41, S); g.fillStyle = 'rgba(0,0,0,.08)'; for (let k = 0; k < 6; k++) g.fillRect(x + rand() * 40, 0, 1, S); }
    } else if (style === 'panel') {
      speckle(g, S, S, .035, 5000); g.fillStyle = v(.84); for (let x = 0; x < S; x += 153.6) g.fillRect(x, 0, 2.5, S); g.fillRect(0, 0, S, 2.5);
    } else {
      speckle(g, S, S, .05, 7000);
      for (let i = 0; i < 24; i++) { g.fillStyle = `rgba(0,0,0,${.015 + rand() * .03})`; g.beginPath(); g.arc(rand() * S, rand() * S, 20 + rand() * 60, 0, 7); g.fill(); }
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  wallBase.set(key, t);
  return t;
}
function wallMat(style, color, w, h) {
  const t = wallTex(style, color).clone(); t.needsUpdate = true; t.repeat.set(w / 2, h / 2);
  return new THREE.MeshStandardMaterial({ map: t, roughness: .85 });
}

// rain stains and dirt over a whole facade (transparent)
const grimeMats = [];
function grimeMat() {
  if (grimeMats.length < 5) {
    const t = canvasTex(256, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      for (let i = 0; i < 26; i++) { const x = rand() * w, y0 = rand() * h * .7, gr = g.createLinearGradient(0, y0, 0, y0 + h * range(.15, .4)); gr.addColorStop(0, 'rgba(50,40,35,.22)'); gr.addColorStop(1, 'rgba(50,40,35,0)'); g.fillStyle = gr; g.fillRect(x, y0, 1.5 + rand() * 5, h * .4); }
      const gb = g.createLinearGradient(0, h * .85, 0, h); gb.addColorStop(0, 'rgba(40,32,28,0)'); gb.addColorStop(1, 'rgba(40,32,28,.3)'); g.fillStyle = gb; g.fillRect(0, h * .85, w, h * .15);
      const gt = g.createLinearGradient(0, 0, 0, h * .06); gt.addColorStop(0, 'rgba(40,32,28,.25)'); gt.addColorStop(1, 'rgba(40,32,28,0)'); g.fillStyle = gt; g.fillRect(0, 0, w, h * .06);
    });
    grimeMats.push(new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, roughness: 1 }));
  }
  return pick(grimeMats);
}

// A window: dark aluminum frame, sky and clouds reflected, the street reflected low, curtains or blinds inside
function drawWindow2(g, W, H, win) {
  const gl = g.createLinearGradient(0, 0, 0, H);
  gl.addColorStop(0, '#CFE3F3'); gl.addColorStop(.4, '#86AFD6'); gl.addColorStop(1, '#3F5876');
  g.fillStyle = gl; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(rand() * W, rand() * H * .4, 20 + rand() * 40, 8 + rand() * 12, 0, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(40,48,64,.55)';                      // buildings across the street, reflected
  let x = 0; while (x < W) { const bw = 20 + rand() * 50, bh = H * (.15 + rand() * .3); g.fillRect(x, H - bh, bw, bh); g.fillStyle = 'rgba(255,240,210,.25)'; for (let k = 0; k < 3; k++) g.fillRect(x + 4 + rand() * (bw - 10), H - bh + 6 + rand() * (bh - 12), 5, 4); g.fillStyle = 'rgba(40,48,64,.55)'; x += bw + 2; }
  const r = rand();
  if (r < .45) { g.globalAlpha = .6; g.fillStyle = win.curtain; const cx = rand() < .5 ? 0 : .45; g.fillRect(W * cx, 0, W * .55, H); g.globalAlpha = .14; g.fillStyle = '#000'; for (let k = 0; k < 7; k++) g.fillRect(W * cx + k * W * .08, 0, 2, H); g.globalAlpha = 1; }
  else if (r < .7) { g.globalAlpha = .6; g.fillStyle = '#EEEAE0'; const bh = H * range(.3, .9); g.fillRect(0, 0, W, bh); g.fillStyle = 'rgba(0,0,0,.25)'; for (let k = 0; k < bh; k += 6) g.fillRect(0, k, W, 1.5); g.globalAlpha = 1; }
  g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.moveTo(W * .08, H); g.lineTo(W * .3, 0); g.lineTo(W * .42, 0); g.lineTo(W * .2, H); g.fill();
  g.fillStyle = 'rgba(255,255,255,.15)'; g.beginPath(); g.moveTo(W * .55, H); g.lineTo(W * .7, 0); g.lineTo(W * .74, 0); g.lineTo(W * .59, H); g.fill();
  const t = 10, fc = '#5E636B';
  if (rand() < .6) { const sxp = rand() < .5 ? t : W / 2 + 4; g.fillStyle = 'rgba(60,62,68,.25)'; g.fillRect(sxp, t, W / 2 - t - 4, H - 2 * t); }
  if (win.frost) { g.fillStyle = 'rgba(232,236,240,.92)'; g.fillRect(0, 0, W, H); for (let k = 0; k < 80; k++) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(rand() * W, rand() * H, 2, 2); } }
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(t, t, W - 2 * t, 6);
  g.fillStyle = fc; g.fillRect(0, 0, W, t); g.fillRect(0, H - t, W, t); g.fillRect(0, 0, t, H); g.fillRect(W - t, 0, t, H);
  g.fillRect(W / 2 - 7, 0, 7, H); g.fillStyle = '#80868F'; g.fillRect(W / 2, 0, 5, H);
  if (win.transom) { g.fillStyle = fc; g.fillRect(0, H * .3, W, 6); }
  g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, 0, W, 2); g.fillRect(0, 0, 2, H);
  if (win.frost) { g.fillStyle = 'rgba(165,168,174,1)'; for (let k = 1; k < 9; k++) g.fillRect(W * k / 9 - 2, 0, 4, H); g.fillRect(0, H * .5, W, 4); }
}
const winCache = {};
function winMat(kind, lit) {
  const key = kind + lit, arr = winCache[key] || (winCache[key] = []);
  if (arr.length < 7) {
    const win = { curtain: pick(['#F7E7C6', '#E7EEF6', '#F4C9C9', '#D8E6CF', '#FFFFFF', '#E9D8F0']), frost: kind === 'frost', transom: rand() < .35 };
    const map = canvasTex(256, 200, (g, w, h) => drawWindow2(g, w, h, win));
    let m;
    if (lit) {
      const c = pick(['#FFC27A', '#FFD49A', '#FFE6C0', '#C8E3FF']);
      const emi = canvasTex(64, 50, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, c); gr.addColorStop(1, shade(c, .55)); g.fillStyle = gr; g.fillRect(3, 3, w - 6, h - 6); g.fillStyle = '#000'; g.fillRect(w / 2 - 1, 0, 2, h); });
      m = glowMat(map, emi, 0, .85, { roughness: .2, metalness: .1 });
    } else m = std('#ffffff', { map, roughness: .2, metalness: .1 });
    arr.push(m);
  }
  return pick(arr);
}
const doorCache = {};
function doorMat(floor) {
  const arr = doorCache[floor] || (doorCache[floor] = []);
  if (arr.length < 6) arr.push(std('#ffffff', { map: canvasTex(128, 256, (g, w, h) => drawSteelDoor(g, 6, 6, w - 12, h - 6, floor)), roughness: .5, metalness: .2 }));
  return pick(arr);
}
// ground floor: shop window, entrance, house door or parking, on a transparent plane
function groundFront(len, o) {
  const px = 64, w = Math.min(2048, len * px), H = o.groundH * px, sx = w / len, sy = H / o.groundH, groundH = o.groundH;
  const map = canvasTex(w, H, (g) => {
    g.clearRect(0, 0, w, H);
    const k = groundH;
    if (o.ground === 'shop' || o.ground === 'konbini') {
      const y = H - 2.9 * sy, wh = 2.6 * sy, door = 1.4 * sx;
      g.fillStyle = '#4F545E'; g.fillRect(len * .04 * sx, y - 8, len * .92 * sx, wh + 8);
      const parts = [[len * .05 * sx, len * .5 * sx - door / 2 - len * .05 * sx], [len * .5 * sx + door / 2, len * .45 * sx - door / 2]];
      for (const [x, ww] of parts) {
        // looking into the shop: a dim room, a lit ceiling, shelves and a counter
        const kb = o.ground === 'konbini';
        const gl = g.createLinearGradient(0, y, 0, y + wh);
        gl.addColorStop(0, kb ? '#EEF3F7' : '#D9CDB8'); gl.addColorStop(.35, kb ? '#B9C6D1' : '#8E8170'); gl.addColorStop(1, kb ? '#8C99A5' : '#4E4A48');
        g.fillStyle = gl; g.fillRect(x, y, ww, wh);
        g.fillStyle = kb ? 'rgba(255,255,255,.9)' : 'rgba(255,236,200,.8)'; for (let i = 0; i < ww / 60; i++) g.fillRect(x + 20 + i * 60, y + wh * .06, 34, 4);
        for (let s = 0; s < 2; s++) {
          const sy0 = y + wh * (.45 + s * .22);
          g.fillStyle = 'rgba(40,35,35,.45)'; g.fillRect(x, sy0, ww, 3);
          for (let i = 0; i < ww / 7; i++) if (rand() < .6) { g.globalAlpha = .45; g.fillStyle = pick(['#C9675A', '#D9B65C', '#6C9BC7', '#86AE7C', '#EDE6D8']); const ih = 6 + rand() * 7; g.fillRect(x + i * 7 + 1, sy0 - ih, 5, ih); g.globalAlpha = 1; }
        }
        g.fillStyle = 'rgba(30,28,30,.35)'; g.fillRect(x, y + wh * .82, ww, wh * .18);
        // posters stuck on the glass
        for (let p = 0; p < 2; p++) if (rand() < .8) {
          const pw = ww * range(.1, .16), ph = wh * range(.22, .32), pxx = x + ww * range(.05, .8);
          g.fillStyle = pick(['#FFF4D6', '#FCE1E8', '#E3F1FF', '#FFE08A']); g.fillRect(pxx, y + wh * .08, pw, ph);
          g.fillStyle = pick(['#D8433F', '#2F6FB8', '#2E6B53', '#E07B28']); g.fillRect(pxx + pw * .1, y + wh * .1, pw * .8, ph * .25);
          g.fillStyle = 'rgba(0,0,0,.35)'; for (let l = 0; l < 3; l++) g.fillRect(pxx + pw * .15, y + wh * .08 + ph * (.5 + l * .15), pw * .7, 2);
        }
        g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(x + ww * .1, y + wh); g.lineTo(x + ww * .3, y); g.lineTo(x + ww * .38, y); g.lineTo(x + ww * .18, y + wh); g.fill();
        g.fillStyle = '#4F545E'; g.fillRect(x + ww / 2 - 3, y, 6, wh);
      }
      const dx = len * .5 * sx - door / 2;
      g.fillStyle = '#5E646E'; g.fillRect(dx, y, door, wh);
      for (let i = 0; i < 2; i++) {
        const px0 = dx + 6 + i * door / 2, pw = door / 2 - 9;
        const gg = g.createLinearGradient(0, y, 0, y + wh); gg.addColorStop(0, '#DCE6EC'); gg.addColorStop(.6, '#9AA8B3'); gg.addColorStop(1, '#6F7B86');
        g.fillStyle = gg; g.fillRect(px0, y + 6, pw, wh - 6);
        g.fillStyle = '#D0D5DA'; g.fillRect(px0 + (i ? 5 : pw - 9), y + wh * .42, 4, wh * .2);
      }
      g.fillStyle = '#D8433F'; g.fillRect(dx + door * .28, y + wh * .3, door * .44, wh * .075);
      g.fillStyle = '#fff'; g.font = `900 ${wh * .05}px "Zen Maru Gothic"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('営業中', dx + door / 2, y + wh * .338);
    } else if (o.ground === 'entrance') {
      const y = H - 2.5 * sy, ew = 2.2 * sx, ex = len * .5 * sx - ew / 2, eh = 2.5 * sy;
      g.fillStyle = 'rgba(30,25,30,.4)'; g.fillRect(ex - 14, y - 14, ew + 28, eh + 14);
      g.fillStyle = shade(o.wall, .7); g.fillRect(ex - 10, y - 10, ew + 20, eh + 10);
      for (let i = 0; i < 2; i++) {
        const px0 = ex + 5 + i * ew / 2, pw = ew / 2 - 10;
        const gg = g.createLinearGradient(0, y, 0, y + eh); gg.addColorStop(0, '#D8E4EC'); gg.addColorStop(.55, '#8FA4B4'); gg.addColorStop(1, '#5D6B78');
        g.fillStyle = '#9EA3AA'; g.fillRect(px0 - 5, y, pw + 10, eh);
        g.fillStyle = gg; g.fillRect(px0, y + 6, pw, eh - 12);
        g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(px0 + pw * .2, y + 6, pw * .12, eh - 12);
        g.fillStyle = '#D0D4D9'; g.fillRect(px0 + (i ? 6 : pw - 10), y + eh * .4, 4, eh * .25);
      }
      g.fillStyle = '#F4F1EA'; g.fillRect(ex + ew * .12, y - .45 * sy, ew * .76, .32 * sy);
      g.fillStyle = '#3A3A40'; g.font = `700 ${.21 * sy}px "Zen Maru Gothic"`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(o.name || pick(['メゾン みなと', 'コーポ さくら', 'ハイツ 青葉', 'みなと荘', 'グリーンハイツ', 'ドミール港']), ex + ew / 2, y - .29 * sy);
      // mailboxes
      g.fillStyle = '#B5B8BE'; g.fillRect(ex + ew + 20, y + .8 * sy, .9 * sx, .7 * sy);
      g.fillStyle = 'rgba(0,0,0,.25)'; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) g.fillRect(ex + ew + 24 + c * .21 * sx, y + .85 * sy + r * .22 * sy, .17 * sx, 3);
      // ground floor windows with bars
      for (const fx of [.15, .82]) { const x = len * fx * sx - .7 * sx; g.fillStyle = '#A3A6AD'; g.fillRect(x - 4, H - 2.3 * sy, 1.4 * sx + 8, 1.1 * sy + 8); g.fillStyle = '#7F9FB9'; g.fillRect(x, H - 2.3 * sy + 4, 1.4 * sx, 1.1 * sy); g.fillStyle = 'rgba(70,70,75,.85)'; for (let b = 1; b < 8; b++) g.fillRect(x + b * 1.4 * sx / 8, H - 2.3 * sy + 4, 2, 1.1 * sy); }
    } else if (o.ground === 'house') {
      const y = H - 2.2 * sy, dw = 1.6 * sx, dx = len * .3 * sx;
      g.fillStyle = '#7B6A58'; g.fillRect(dx - 6, y - 6, dw + 12, 2.2 * sy + 6);
      for (let i = 0; i < 2; i++) { g.fillStyle = '#C9D6DD'; g.fillRect(dx + i * dw / 2 + 4, y + 4, dw / 2 - 8, 2.2 * sy - 8); g.fillStyle = 'rgba(80,70,60,.6)'; for (let r = 1; r < 6; r++) g.fillRect(dx + i * dw / 2 + 4, y + r * 2.2 * sy / 6, dw / 2 - 8, 2); }
      const wx = len * .65 * sx; g.fillStyle = '#A3A6AD'; g.fillRect(wx - 4, H - 2.0 * sy, 1.6 * sx + 8, 1.0 * sy + 8); g.fillStyle = '#86ABC8'; g.fillRect(wx, H - 2.0 * sy + 4, 1.6 * sx, 1.0 * sy); g.fillStyle = '#F4E8D0'; g.fillRect(wx, H - 2.0 * sy + 4, .8 * sx, 1.0 * sy);
    } else if (o.ground === 'parking') {
      const y = H - 2.6 * sy; g.fillStyle = '#3B3E46'; g.fillRect(len * .1 * sx, y, len * .8 * sx, 2.6 * sy);
      g.fillStyle = '#5A5E68'; for (let i = 0; i < 12; i++) g.fillRect(len * .1 * sx, y + i * 2.6 * sy / 12, len * .8 * sx, 2);
    }
  });
  const night = canvasTex(w / 4, H / 4, (g, cw, ch) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, cw, ch);
    const k = .25;
    if (o.ground === 'shop' || o.ground === 'konbini') {
      // lit shop interior: brighter near the ceiling, frames and the door stay dark
      const top = ch - 2.9 * sy * k, hh = 2.6 * sy * k, x0 = len * .05 * sx * k, wd = len * .9 * sx * k;
      const gr = g.createLinearGradient(0, top, 0, top + hh);
      if (o.ground === 'konbini') { gr.addColorStop(0, '#C8D4E6'); gr.addColorStop(1, '#5E6674'); } else { gr.addColorStop(0, '#9C7650'); gr.addColorStop(1, '#3E2E22'); }
      g.fillStyle = gr; g.fillRect(x0, top, wd, hh);
      g.fillStyle = '#000';
      const dw = 1.4 * sx * k, dx = len * .5 * sx * k - dw / 2;
      g.fillRect(dx - 2, top, 4, hh); g.fillRect(dx + dw - 2, top, 4, hh); g.fillRect(dx + dw / 2 - 1, top, 2, hh);
      g.fillRect((x0 + dx) / 2 - 1, top, 3, hh); g.fillRect((dx + dw + x0 + wd) / 2 - 1, top, 3, hh);
      g.fillRect(x0, top + hh * .82, wd, hh * .18);
    }
    if (o.ground === 'entrance') { g.fillStyle = '#FFE2B0'; g.fillRect((len * .5 - 1.1) * sx * k, ch - 2.5 * sy * k, 2.2 * sx * k, 2.5 * sy * k); }
  });
  return glowMat(map, night, 0, .42, { transparent: true, alphaTest: .5, roughness: .4 });
}
const shutterTex = canvasTex(256, 256, (g, w, h) => {
  for (let y = 0; y < h; y += 16) { const gr = g.createLinearGradient(0, y, 0, y + 16); gr.addColorStop(0, '#C9CDD3'); gr.addColorStop(.5, '#A9AEB6'); gr.addColorStop(1, '#868B93'); g.fillStyle = gr; g.fillRect(0, y, w, 16); }
  speckle(g, w, h, .06, 900);
  for (let i = 0; i < 6; i++) { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(70,60,50,0)'); gr.addColorStop(1, 'rgba(70,60,50,.18)'); g.fillStyle = gr; g.fillRect(rand() * w, 0, 3 + rand() * 10, h); }
});
shutterTex.wrapS = shutterTex.wrapT = THREE.RepeatWrapping;
const barTex = canvasTex(256, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#fff'; for (let x = 4; x < w; x += 25.6) g.fillRect(x, 0, 5, h); g.fillRect(0, 0, w, 10); g.fillRect(0, h - 8, w, 8); });
barTex.wrapS = THREE.RepeatWrapping;

// old two-story apartment (アパート) with an outside staircase and corridor, like the reference
function apato(side, z0, z1, o) {
  const B = building(side, z0, z1, { ...o, floors: 2, doors: true, ground: 'none', groundH: 0, ac: 0, roof: false, cols: Math.max(4, Math.round((z0 - z1) / 1.6) & ~1) });
  const { out, uToZ, len } = B;
  const steel = metal(o.steel || '#6F7A86');
  const floorY = B.f.floorH;
  // corridor along the second floor; the stairs stand past its end, open to the sky
  const runLen = 3.4, corLen = len - runLen - .7;
  const czc = (uToZ(0) + uToZ(corLen)) / 2;
  box(1.3, .16, corLen, std('#CFCBC2'), out(.65), floorY, czc);
  box(.06, 1.0, corLen, std(o.rail || '#D9D2C2'), out(1.28), floorY + .55, czc);
  for (let u = .4; u < corLen; u += 2.5) box(.1, floorY, .1, steel, out(1.25), floorY / 2, uToZ(u));
  box(.1, floorY, .1, steel, out(1.25), floorY / 2, uToZ(corLen - .05));
  box(1.3, .14, .8, std('#CFCBC2'), out(.65), floorY, uToZ(corLen + .4));            // landing
  claim(side, 'wall', z1, z0);
  const st = group(out(.65), 0, uToZ(len - .25));
  const d = -side;                                   // toward the corridor
  for (let i = 0; i < 12; i++) box(.95, .05, .27, steel, 0, floorY * (i + .5) / 12, d * i * runLen / 12, st);
  const len2 = Math.hypot(runLen, floorY), ang = Math.atan2(floorY, runLen) * side;
  for (const dx of [-.48, .48]) { const sgr = box(.05, .2, len2, steel, dx, floorY / 2, d * runLen / 2, st); sgr.rotation.x = ang; }
  const rail = box(.04, .04, len2, steel, .5, floorY / 2 + .9, d * runLen / 2, st, false); rail.rotation.x = ang;
  for (let i = 0; i < 4; i++) box(.03, .9, .03, steel, .5, floorY * (i * 3 + 1) / 12 + .45, d * (i * 3 + 1) * runLen / 12, st, false);
  // roof with corrugated metal
  const corr = canvasTex(64, 256, (g, w, h) => { for (let x = 0; x < w; x += 8) { g.fillStyle = x % 16 ? '#8D949C' : '#A9B0B8'; g.fillRect(x, 0, 8, h); } speckle(g, w, h, .08, 300); }, [len / 1.2, 1]);
  const roof = box(B.b.geometry.parameters.width + 1.4, .12, len + .8, std('#ffffff', { map: corr, roughness: .5, metalness: .3 }), B.b.position.x + side * 0, o.h + .3, B.zc);
  roof.rotation.z = side * .12;
  // mailboxes and bikes below
  return B;
}

