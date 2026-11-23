// ================================================================ textures
const PX = 40;
// Where the windows and doors go on a building front
function layout(len, h, o) {
  const groundH = o.groundH, band = (o.ground === 'shop' || o.ground === 'konbini') ? 1.1 : 0, base = groundH + band;
  const floors = o.floors, floorH = (h - base - .9) / floors, wins = [];
  for (let f = 0; f < floors; f++) for (let c = 0; c < o.cols; c++) {
    const cw = len / o.cols, door = o.doors && c % 2 === 0;
    const ww = door ? .95 : Math.min(cw * (o.balcony ? .7 : .55), 3.2), wh = door ? floorH * .72 : floorH * (o.balcony ? .66 : .5);
    wins.push({ u: (c + .5) * cw, y: base + f * floorH + (door ? .05 : floorH * .3), w: ww, h: wh, f, c, door, lit: rand() < (o.lit ?? .5), frost: !door && !o.balcony && rand() < .12 });
  }
  return { wins, floorH, base };
}

// Far buildings: one painted texture with windows. Returns color map, night map and the window list.
function facade(len, h, o) {
  const px = o.px || PX;
  const w = Math.min(2048, len * px), H = Math.min(2048, h * px);
  const sx = w / len, sy = H / h;
  const groundH = o.groundH;
  const band = (o.ground === 'shop' || o.ground === 'konbini') ? 1.1 : 0;   // fascia for the shop sign
  const base = groundH + band;
  const floors = o.floors, floorH = (h - base - .9) / floors;
  const wins = [];
  for (let f = 0; f < floors; f++) for (let c = 0; c < o.cols; c++) {
    const cw = len / o.cols;
    const door = o.doors && c % 2 === 0;
    const ww = door ? .95 : Math.min(cw * (o.balcony ? .7 : .55), 3.2);
    const wh = door ? floorH * .72 : floorH * (o.balcony ? .66 : .5);
    wins.push({ u: (c + .5) * cw, y: base + f * floorH + (door ? .05 : floorH * .3), w: ww, h: wh, f, c, door, lit: rand() < (o.lit ?? .5), frost: !door && !o.balcony && rand() < .12,
      curtain: pick(['#F7E7C6', '#E7EEF6', '#F4C9C9', '#D8E6CF', '#FFFFFF', '#E9D8F0']) });
  }
  const map = canvasTex(w, H, (g) => {
    g.fillStyle = o.wall; g.fillRect(0, 0, w, H);
    if (o.style === 'tile') {
      const ts = .2 * sx;
      for (let y = 0; y < H; y += ts * .5) for (let x = (y / ts) % 2 ? ts / 2 : 0; x < w; x += ts) { g.fillStyle = shade(o.wall, .92 + rand() * .13); g.fillRect(x + 1, y + 1, ts - 2, ts * .5 - 2); }
    } else if (o.style === 'siding') {
      for (let y = 0; y < H; y += .16 * sy) { g.fillStyle = shade(o.wall, .9 + rand() * .1); g.fillRect(0, y, w, .16 * sy - 2); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, y + .16 * sy - 2, w, 2); }
    } else if (o.style === 'wood') {
      for (let x = 0; x < w; x += .17 * sx) { g.fillStyle = shade(o.wall, .88 + rand() * .16); g.fillRect(x, 0, .17 * sx - 2, H); }
    } else if (o.style === 'panel') {
      speckle(g, w, H, .04, w * H / 500);
      g.strokeStyle = shade(o.wall, .86); g.lineWidth = 2;
      for (let x = 0; x < w; x += 1.6 * sx) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = 0; y < H; y += .8 * sy) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    } else speckle(g, w, H, .05, w * H / 300);
    // rain streaks and grime
    for (let i = 0; i < len * 2; i++) {
      const x = rand() * w, y0 = rand() * H * .5;
      const gr = g.createLinearGradient(0, y0, 0, y0 + H * .5);
      gr.addColorStop(0, 'rgba(60,50,60,.13)'); gr.addColorStop(1, 'rgba(60,50,60,0)');
      g.fillStyle = gr; g.fillRect(x, y0, 2 + rand() * 9, H * .5);
    }
    const gb = g.createLinearGradient(0, H * .8, 0, H); gb.addColorStop(0, 'rgba(50,40,40,0)'); gb.addColorStop(1, 'rgba(50,40,40,.22)');
    g.fillStyle = gb; g.fillRect(0, H * .8, w, H * .2);
    if (band) { g.fillStyle = shade(o.wall, .82); g.fillRect(0, H - base * sy, w, band * sy); }
    for (const win of wins) {
      const x = (win.u - win.w / 2) * sx, y = H - (win.y + win.h) * sy, ww = win.w * sx, wh = win.h * sy;
      if (win.door) { drawSteelDoor(g, x, y, ww, wh, win.f); continue; }
      drawWindow(g, x, y, ww, wh, win, o);
    }
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
      g.fillStyle = '#F4F1EA'; g.fillRect(ex + ew * .12, y - .6 * sy, ew * .76, .34 * sy);
      g.fillStyle = '#3A3A40'; g.font = `700 ${.21 * sy}px "Zen Maru Gothic"`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(o.name || pick(['メゾン みなと', 'コーポ さくら', 'ハイツ 青葉', 'みなと荘', 'グリーンハイツ', 'ドミール港']), ex + ew / 2, y - .42 * sy);
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
    if (o.groundBand) { g.fillStyle = o.groundBand; g.fillRect(0, H - (groundH) * sy - .2 * sy, w, .25 * sy); }
  }, null);
  const night = canvasTex(w / 4, H / 4, (g, cw, ch) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, cw, ch);
    const k = .25;
    for (const win of wins) if (win.lit && !win.door) { g.fillStyle = pick(['#FFC27A', '#FFD49A', '#FFE6C0', '#C8E3FF']); g.fillRect((win.u - win.w / 2) * sx * k, ch - (win.y + win.h) * sy * k, win.w * sx * k, win.h * sy * k); }
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
  return { map, night, wins, floorH, base };
}

// A real-looking aluminum sliding window: recess shadow, sky reflection, curtains, two panes, screen
function drawWindow(g, x, y, ww, wh, win, o) {
  g.fillStyle = 'rgba(30,25,30,.35)'; g.fillRect(x - 4, y - 4, ww + 8, wh + 8);
  const gl = g.createLinearGradient(0, y, 0, y + wh);
  gl.addColorStop(0, '#E4EEF6'); gl.addColorStop(.35, '#9DBBD3'); gl.addColorStop(.62, '#6A88A3'); gl.addColorStop(1, '#4F5A66');
  g.fillStyle = gl; g.fillRect(x, y, ww, wh);
  const r = rand();
  if (r < .55) { g.globalAlpha = .72; g.fillStyle = win.curtain; const cx = rand() < .5 ? 0 : .45; g.fillRect(x + ww * cx, y, ww * .55, wh); g.globalAlpha = .12; g.fillStyle = '#000'; for (let k = 0; k < 6; k++) g.fillRect(x + ww * cx + k * ww * .09, y, 2, wh); g.globalAlpha = 1; }
  else if (r < .75) { g.globalAlpha = .65; g.fillStyle = '#EDEAE2'; const bh = wh * range(.3, .85); g.fillRect(x, y, ww, bh); g.fillStyle = 'rgba(0,0,0,.25)'; for (let k = 0; k < bh; k += 5) g.fillRect(x, y + k, ww, 1); g.globalAlpha = 1; }
  g.fillStyle = 'rgba(255,255,255,.26)'; g.beginPath(); g.moveTo(x + ww * .06, y + wh); g.lineTo(x + ww * .26, y); g.lineTo(x + ww * .38, y); g.lineTo(x + ww * .18, y + wh); g.fill();
  const t = Math.max(3, ww * .035);
  g.fillStyle = '#BFC3C9'; g.fillRect(x, y, ww, t); g.fillRect(x, y + wh - t, ww, t); g.fillRect(x, y, t, wh); g.fillRect(x + ww - t, y, t, wh);
  g.fillRect(x + ww / 2 - t, y, t, wh); g.fillStyle = '#7E838B'; g.fillRect(x + ww / 2, y, t * .8, wh);
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x + t, y + t, ww - 2 * t, 3);
  if (rand() < .6) { const sxp = rand() < .5 ? x + t : x + ww / 2 + t * .8; g.fillStyle = 'rgba(70,72,78,.24)'; g.fillRect(sxp, y + t, ww / 2 - t * 1.8, wh - 2 * t); }
  if (win.frost) { g.fillStyle = 'rgba(232,236,240,.9)'; g.fillRect(x + t, y + t, ww - 2 * t, wh - 2 * t); g.fillStyle = '#BFC3C9'; g.fillRect(x + ww / 2 - t, y, t, wh); }
  if ((o.bars && win.f === 0) || win.frost) { g.fillStyle = 'rgba(160,163,168,.95)'; for (let k = 1; k < 9; k++) g.fillRect(x + ww * k / 9 - 1.5, y - 3, 3, wh + 6); g.fillRect(x - 4, y + wh * .5, ww + 8, 3); }
}
// Steel apartment door with frame, lever, peephole, number plate and mail slot
function drawSteelDoor(g, x, y, ww, wh, floor = 0) {
  g.fillStyle = 'rgba(30,25,30,.4)'; g.fillRect(x - 5, y - 5, ww + 10, wh + 5);
  g.fillStyle = '#8D9199'; g.fillRect(x - 3, y - 3, ww + 6, wh + 3);
  const col = pick(['#B9AE9A', '#9DA8B5', '#A88E7A', '#CFC8B8', '#7E8C78']);
  const gr = g.createLinearGradient(x, 0, x + ww, 0); gr.addColorStop(0, shade(col, 1.06)); gr.addColorStop(1, shade(col, .88));
  g.fillStyle = gr; g.fillRect(x, y, ww, wh);
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; g.strokeRect(x + ww * .12, y + wh * .08, ww * .76, wh * .38); g.strokeRect(x + ww * .12, y + wh * .52, ww * .76, wh * .4);
  g.fillStyle = '#DADDE1'; g.fillRect(x + ww * .7, y + wh * .52, ww * .2, wh * .028);
  g.fillStyle = '#4A4A50'; g.fillRect(x + ww * .82, y + wh * .47, ww * .05, wh * .04);
  g.fillStyle = '#222'; g.beginPath(); g.arc(x + ww * .5, y + wh * .3, Math.max(1.5, ww * .025), 0, 7); g.fill();
  g.fillStyle = '#F2EEE6'; g.fillRect(x + ww * .3, y + wh * .12, ww * .4, wh * .07);
  g.fillStyle = '#333'; g.font = `700 ${Math.max(6, wh * .05)}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(String((floor + 1) * 100 + 1 + Math.floor(rand() * 6)), x + ww * .5, y + wh * .157);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x + ww * .3, y + wh * .62, ww * .4, wh * .025);
}

// Sign texture
function signTex(o) {
  const w = o.w * 128, h = o.h * 128;
  return canvasTex(w, h, (g, W, Hh) => {
    g.fillStyle = o.bg; g.fillRect(0, 0, W, Hh);
    if (o.grad) { const gr = g.createLinearGradient(0, 0, 0, Hh); gr.addColorStop(0, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(0,0,0,.1)'); g.fillStyle = gr; g.fillRect(0, 0, W, Hh); }
    if (o.border) { g.strokeStyle = o.border; g.lineWidth = Math.min(W, Hh) * .06; g.strokeRect(g.lineWidth / 2, g.lineWidth / 2, W - g.lineWidth, Hh - g.lineWidth); }
    if (o.stripe) { g.fillStyle = o.stripe; o.vertical ? g.fillRect(0, Hh * .92, W, Hh * .08) : g.fillRect(0, Hh * .84, W, Hh * .16); }
    if (o.sub && !o.vertical) { g.fillStyle = o.fg; g.globalAlpha = .75; g.font = `700 ${Hh * .11}px "Zen Maru Gothic"`; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(o.sub, W * .97, Hh * .9); g.globalAlpha = 1; }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const font = o.font || '"Zen Maru Gothic"';
    if (o.vertical) {
      const chars = [...o.text], n = chars.length, step = Hh * .86 / n, size = Math.min(W * .74, step * .92);
      g.font = `900 ${size}px ${font}`; g.fillStyle = o.fg;
      chars.forEach((ch, i) => g.fillText(ch, W / 2, Hh * .06 + step * (i + .5)));
    } else {
      const lines = o.lines || [{ t: o.text, size: .6 }];
      const gap = o.gap ?? .4;
      let tx = W / 2, maxW = W * .9;
      if (o.logo) {
        const r = Hh * .34, cx = Hh * .55;
        g.fillStyle = o.logo.bg; g.beginPath(); g.arc(cx, Hh * .44, r, 0, 7); g.fill();
        g.fillStyle = o.logo.fg; g.font = `900 ${r * 1.3}px "Zen Maru Gothic"`; g.fillText(o.logo.t, cx, Hh * .46);
        tx = (W + Hh * 1.05) / 2; maxW = W - Hh * 1.3;
      }
      let y = Hh * (o.top ?? .5) - (lines.length - 1) * Hh * gap / 2;
      for (const L of lines) {
        let size = Hh * L.size;
        const f = () => `${L.weight || 900} ${size}px ${L.font || font}`;
        g.font = f();
        const tw = g.measureText(L.t).width;
        if (tw > maxW) { size *= maxW / tw; g.font = f(); }
        g.fillStyle = L.color || o.fg; g.fillText(L.t, tx, y);
        y += Hh * gap;
      }
    }
    // a little weathering: darker edges, dust and rain marks, so signs belong to the street
    const ev = g.createRadialGradient(W / 2, Hh / 2, Math.min(W, Hh) * .3, W / 2, Hh / 2, Math.max(W, Hh) * .75);
    ev.addColorStop(0, 'rgba(0,0,0,0)'); ev.addColorStop(1, 'rgba(40,30,30,.22)'); g.fillStyle = ev; g.fillRect(0, 0, W, Hh);
    for (let i = 0; i < W * Hh / 900; i++) { g.fillStyle = `rgba(60,50,40,${.04 + rand() * .06})`; g.fillRect(rand() * W, rand() * Hh, 1 + rand() * 3, 1 + rand() * 3); }
    for (let i = 0; i < 4; i++) { const sx2 = rand() * W, gr2 = g.createLinearGradient(0, 0, 0, Hh); gr2.addColorStop(0, 'rgba(60,50,40,.12)'); gr2.addColorStop(1, 'rgba(60,50,40,0)'); g.fillStyle = gr2; g.fillRect(sx2, 0, 2 + rand() * 4, Hh); }
  });
}

