// ---------------------------------------------------------------- café textures and props
let _cafeTex;
function cafeTex() {
  if (_cafeTex) return _cafeTex;
  const grain = (base, w, h, planks, horiz = true) => canvasTex(w, h, (g, W, Hh) => {
    const n = planks, size = (horiz ? Hh : W) / n;
    for (let i = 0; i < n; i++) {
      g.fillStyle = shade(base, .82 + rand() * .3);
      horiz ? g.fillRect(0, i * size, W, size) : g.fillRect(i * size, 0, size, Hh);
      for (let k = 0; k < 14; k++) {                                     // grain lines
        g.strokeStyle = `rgba(${rand() < .5 ? '0,0,0' : '255,230,200'},${.05 + rand() * .07})`; g.lineWidth = 1 + rand();
        g.beginPath(); const o = i * size + rand() * size;
        if (horiz) { g.moveTo(0, o); for (let x = 0; x <= W; x += 16) g.lineTo(x, o + Math.sin(x * .03 + k) * 2.5); }
        else { g.moveTo(o, 0); for (let y = 0; y <= Hh; y += 16) g.lineTo(o + Math.sin(y * .03 + k) * 2.5, y); }
        g.stroke();
      }
      if (rand() < .3) { g.fillStyle = 'rgba(40,20,10,.25)'; g.beginPath(); horiz ? g.ellipse(rand() * W, i * size + size / 2, 7, 3, 0, 0, 7) : g.ellipse(i * size + size / 2, rand() * Hh, 3, 7, 0, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(20,10,5,.5)'; horiz ? g.fillRect(0, i * size, W, 1.5) : g.fillRect(i * size, 0, 1.5, Hh);
    }
  });
  const T = {};
  T.floor = canvasTex(512, 512, (g, W, Hh) => {                       // staggered planks with grain
    const ph = 42;
    for (let r = 0; r * ph < Hh; r++) for (let x = -(r % 3) * 120; x < W; x += 360) {
      const c = shade('#7A4A2C', .78 + rand() * .32); g.fillStyle = c; g.fillRect(x, r * ph, 358, ph - 2);
      for (let k = 0; k < 7; k++) { g.strokeStyle = `rgba(0,0,0,${.06 + rand() * .06})`; g.lineWidth = 1; g.beginPath(); const o = r * ph + 4 + rand() * (ph - 8); g.moveTo(x, o); for (let xx = x; xx <= x + 358; xx += 20) g.lineTo(xx, o + Math.sin(xx * .04 + k) * 1.8); g.stroke(); }
      g.fillStyle = 'rgba(255,230,200,.06)'; g.fillRect(x, r * ph, 358, 4);
      g.fillStyle = 'rgba(20,10,5,.6)'; g.fillRect(x + 356, r * ph, 2, ph);
    }
  });
  T.floor.wrapS = T.floor.wrapT = THREE.RepeatWrapping;
  T.ceiling = grain('#6A4630', 256, 256, 8); T.ceiling.wrapS = T.ceiling.wrapT = THREE.RepeatWrapping;
  T.grainMid = grain('#8A5A3A', 256, 256, 4); T.grainMid.wrapS = T.grainMid.wrapT = THREE.RepeatWrapping;
  T.grainDark = grain('#4E3424', 256, 256, 4); T.grainDark.wrapS = T.grainDark.wrapT = THREE.RepeatWrapping;
  T.grainTop = grain('#A8784A', 512, 128, 3); T.grainTop.wrapS = T.grainTop.wrapT = THREE.RepeatWrapping;
  const panel = (base) => { const t = canvasTex(256, 320, (g, W, Hh) => {
    g.drawImage(grain(base, 256, 320, 1, false).image, 0, 0);
    const m = 30, x0 = m, y0 = m, x1 = W - m, y1 = Hh - m;
    g.fillStyle = shade(base, 1.08); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.fillStyle = 'rgba(255,240,220,.18)'; g.fillRect(x0, y0, x1 - x0, 6); g.fillRect(x0, y0, 6, y1 - y0);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x0, y1 - 6, x1 - x0, 6); g.fillRect(x1 - 6, y0, 6, y1 - y0);
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; g.strokeRect(x0 + 16, y0 + 16, x1 - x0 - 32, y1 - y0 - 32);
    g.fillStyle = 'rgba(20,10,5,.5)'; g.fillRect(0, 0, 3, Hh);
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  T.panelWood = panel('#5A3A26'); T.panelGreen = panel('#2E4A3E');
  // chalkboards
  const board = (w, h, draw) => canvasTex(w * 256, h * 256, (g, W, Hh) => {
    g.fillStyle = '#25292A'; g.fillRect(0, 0, W, Hh);
    for (let i = 0; i < 14; i++) { const r = g.createRadialGradient(rand() * W, rand() * Hh, 5, rand() * W, rand() * Hh, 120); r.addColorStop(0, 'rgba(255,255,255,.05)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, W, Hh); }
    g.textBaseline = 'middle'; g.strokeStyle = 'rgba(240,240,230,.75)'; g.fillStyle = 'rgba(240,240,230,.92)';
    draw(g, W, Hh);
  });
  const chalk = (g, t, x, y, size, color = 'rgba(240,240,230,.92)', align = 'left', font = '"Klee One"') => { g.font = `600 ${size}px ${font}`; g.textAlign = align; g.fillStyle = color; g.fillText(t, x, y); };
  const cupIcon = (g, x, y, s) => { g.lineWidth = 3; g.beginPath(); g.moveTo(x - s, y - s * .6); g.lineTo(x - s * .8, y + s * .7); g.lineTo(x + s * .8, y + s * .7); g.lineTo(x + s, y - s * .6); g.stroke(); g.beginPath(); g.arc(x + s * 1.15, y, s * .35, -1.4, 1.4); g.stroke(); for (const dx of [-.4, 0, .4]) { g.beginPath(); g.moveTo(x + dx * s, y - s); g.quadraticCurveTo(x + dx * s + 6, y - s * 1.4, x + dx * s, y - s * 1.8); g.stroke(); } };
  const dash = (g, x0, x1, y) => { g.setLineDash([6, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); g.setLineDash([]); };
  T.boardMenu = board(1.6, 1, (g, W, Hh) => {
    chalk(g, 'メニュー', W / 2, 34, 36, '#FFE08A', 'center'); dash(g, 40, W - 40, 62);
    [['コーヒー', '300円'], ['カフェラテ', '380円'], ['カプチーノ', '380円'], ['紅茶', '300円'], ['ジュース', '250円']].forEach(([a, b], i) => { const y = 92 + i * 33; chalk(g, a, 40, y, 25); chalk(g, b, W - 40, y, 25, '#F4A9BE', 'right'); g.setLineDash([2, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(40 + a.length * 26, y + 4); g.lineTo(W - 110, y + 4); g.stroke(); g.setLineDash([]); });
    cupIcon(g, W - 70, 34, 16);
  });
  T.boardHotIce = board(1, 1, (g, W, Hh) => {
    chalk(g, 'ホット', W / 2, 60, 42, '#F4A9BE', 'center'); cupIcon(g, W / 2, 128, 20);
    dash(g, 30, W - 30, 160); chalk(g, 'アイス', W / 2, 200, 42, '#9FD3F4', 'center');
    g.lineWidth = 3; g.strokeRect(W / 2 - 14, 225, 28, 22); for (let i = 0; i < 3; i++) g.strokeRect(W / 2 - 10 + i * 7, 230, 5, 5);
  });
  T.boardTennai = board(1, 1, (g, W, Hh) => {
    chalk(g, '店内', W / 2, 60, 46, 'rgba(240,240,230,.95)', 'center'); chalk(g, 'eat in', W / 2, 100, 22, '#FFE08A', 'center', 'serif');
    dash(g, 30, W - 30, 130); chalk(g, 'お持ち帰り', W / 2, 172, 36, 'rgba(240,240,230,.95)', 'center'); chalk(g, 'to go', W / 2, 210, 22, '#FFE08A', 'center', 'serif');
  });
  T.boardLatte = board(1.3, 1, (g, W, Hh) => {
    chalk(g, 'Caffe Latte', W / 2, 46, 40, '#FFE08A', 'center', 'italic serif'); cupIcon(g, W / 2, 130, 34);
    chalk(g, 'カフェラテ', W / 2, 200, 30, 'rgba(240,240,230,.95)', 'center'); chalk(g, '〜 ハートのラテアート 〜', W / 2, 236, 18, '#F4A9BE', 'center');
    g.lineWidth = 2; g.beginPath(); for (let a = 0; a < 7; a += .1) g.lineTo(26 + a * 3, 220 + Math.sin(a * 2) * 8); g.stroke();
  });
  T.roundSign = canvasTex(256, 256, (g, W, Hh) => { g.clearRect(0, 0, W, Hh); g.fillStyle = '#3A2A22'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#C9A45A'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.stroke(); g.fillStyle = '#F4E2C4'; g.font = '700 40px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('COFFEE', 128, 80); g.strokeStyle = '#F4E2C4'; cupIcon(g, 128, 150, 30); g.font = '700 18px serif'; g.fillText('since 1987', 128, 210); });
  T.clock = canvasTex(128, 128, (g, W) => { g.fillStyle = '#F4EEDF'; g.beginPath(); g.arc(64, 64, 64, 0, 7); g.fill(); g.fillStyle = '#2B2D33'; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.fillRect(64 + Math.cos(a) * 52 - 2, 64 + Math.sin(a) * 52 - 2, 4, 4); } g.lineWidth = 4; g.strokeStyle = '#2B2D33'; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 28); g.moveTo(64, 64); g.lineTo(92, 74); g.stroke(); });
  T.bags = ['#C9A06A', '#8A5A3A', '#E8D5B5'].map((c, i) => canvasTex(64, 96, (g, W, Hh) => { g.fillStyle = c; g.fillRect(0, 0, W, Hh); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, 0, W, 12); g.fillStyle = '#FFFFFF'; g.fillRect(10, 36, 44, 34); g.fillStyle = '#3A2A22'; g.font = '700 10px serif'; g.textAlign = 'center'; g.fillText(['BLEND', 'BRAZIL', 'KENYA'][i], 32, 50); g.fillText('COFFEE', 32, 62); }));
  T.beans = canvasTex(64, 64, (g, W, Hh) => { g.fillStyle = '#3A2214'; g.fillRect(0, 0, W, Hh); for (let i = 0; i < 60; i++) { g.fillStyle = pick(['#5A3420', '#4A2A18', '#6A4028']); g.beginPath(); g.ellipse(rand() * W, rand() * Hh, 5, 3.5, rand() * 3, 0, 7); g.fill(); } });
  T.wicker = canvasTex(64, 64, (g, W, Hh) => { g.fillStyle = '#A8784A'; g.fillRect(0, 0, W, Hh); for (let y = 0; y < Hh; y += 8) for (let x = (y / 8 % 2) * 8; x < W; x += 16) { g.fillStyle = '#C9955A'; g.fillRect(x, y, 10, 6); } });
  T.pictures = [['#9FC4D8', '#F4E2C4'], ['#E8B8A0', '#5A7A5A'], ['#F4E2C4', '#8A5A3A']].map(([a, b]) => canvasTex(128, 128, (g, W, Hh) => { const gr = g.createLinearGradient(0, 0, 0, Hh); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, Hh); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.arc(90, 40, 16, 0, 7); g.fill(); g.fillStyle = 'rgba(60,50,40,.4)'; g.beginPath(); g.moveTo(0, 100); g.lineTo(40, 70); g.lineTo(80, 95); g.lineTo(128, 60); g.lineTo(128, 128); g.lineTo(0, 128); g.fill(); }));
  const rugTex = (c1, c2, c3) => canvasTex(256, 384, (g, W, Hh) => { g.fillStyle = c1; g.fillRect(0, 0, W, Hh); g.strokeStyle = c2; g.lineWidth = 10; g.strokeRect(14, 14, W - 28, Hh - 28); g.lineWidth = 3; g.strokeRect(30, 30, W - 60, Hh - 60); g.fillStyle = c3; for (let y = 60; y < Hh - 50; y += 46) for (let x = 60; x < W - 50; x += 46) { g.beginPath(); g.moveTo(x, y - 14); g.lineTo(x + 14, y); g.lineTo(x, y + 14); g.lineTo(x - 14, y); g.fill(); } for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * .06})`; g.fillRect(Math.random() * W, Math.random() * Hh, 2, 2); } g.fillStyle = '#E8D9BC'; for (let x = 0; x < W; x += 6) { g.fillRect(x, 0, 2, 8); g.fillRect(x, Hh - 8, 2, 8); } });
  T.rugRed = rugTex('#7A2E2A', '#D9B070', '#A84A3A');
  T.rugRound = canvasTex(256, 256, (g, W) => { for (let r = 128; r > 0; r -= 14) { g.fillStyle = (r / 14) % 2 ? '#3E5A4A' : '#C9B080'; g.beginPath(); g.arc(128, 128, r, 0, 7); g.fill(); } for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * .07})`; g.fillRect(Math.random() * W, Math.random() * W, 2, 2); } });
  return _cafeTex = T;
}
// the café's brand: カフェ みなと, MINATO COFFEE, since 1987
function cupIconBrand(g, x, y, s, col) {
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = s * .12; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x - s * .55, y - s * .2); g.lineTo(x - s * .45, y + s * .45); g.quadraticCurveTo(x, y + s * .62, x + s * .45, y + s * .45); g.lineTo(x + s * .55, y - s * .2); g.closePath(); g.fill();
  g.beginPath(); g.arc(x + s * .62, y + s * .08, s * .2, -1.3, 1.3); g.stroke();
  g.beginPath(); g.ellipse(x, y + s * .68, s * .8, s * .1, 0, 0, 7); g.fill();
  for (const dx of [-.22, 0, .22]) { g.beginPath(); g.moveTo(x + s * dx, y - s * .35); g.bezierCurveTo(x + s * (dx + .15), y - s * .55, x + s * (dx - .15), y - s * .7, x + s * dx, y - s * .95); g.stroke(); }
}
function brandEmblem(g, cx, cy, r, ink, paper, gold) {
  g.fillStyle = gold; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
  g.fillStyle = paper; g.beginPath(); g.arc(cx, cy, r * .93, 0, 7); g.fill();
  g.strokeStyle = ink; g.lineWidth = r * .03; g.beginPath(); g.arc(cx, cy, r * .62, 0, 7); g.stroke();
  cupIconBrand(g, cx, cy + r * .05, r * .42, ink);
  g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `700 ${r * .17}px Georgia, serif`;
  const ring = (txt, a0, a1, rad, flip) => { const n = txt.length; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + .5) / n; g.save(); g.translate(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); g.rotate(a + (flip ? -Math.PI / 2 : Math.PI / 2)); g.fillText(txt[i], 0, 0); g.restore(); } };
  ring('MINATO COFFEE', -Math.PI * .9, -Math.PI * .1, r * .78, false);
  ring('SINCE 1987', Math.PI * .78, Math.PI * .22, r * .78, true);
  for (const a of [Math.PI, 0]) { g.beginPath(); g.arc(cx + Math.cos(a) * r * .78, cy + Math.sin(a) * r * .78, r * .045, 0, 7); g.fill(); }
}
let _logoTex, _autoTex;
function cafeLogoTex() { return _logoTex ??= canvasTex(256, 256, (g, W) => { g.clearRect(0, 0, W, W); brandEmblem(g, 128, 128, 124, '#3E2820', 'rgba(255,248,236,.92)', '#C9A45A'); }); }
function autoDoorTex() { return _autoTex ??= canvasTex(256, 60, (g, W, H) => { g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H); g.fillStyle = '#2F6FB8'; g.fillRect(0, 0, W, 8); g.fillRect(0, H - 8, W, 8); g.font = '900 30px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('自動ドア', W / 2, H / 2 + 1); }); }
function cafeFrontSign(B, z) {
  const w = 5.2, h = 1.05, y = B.groundH + .6, ry = B.n > 0 ? Math.PI / 2 : -Math.PI / 2;
  const tex = canvasTex(w * 220, h * 220, (g, W, H) => {
    // walnut board with grain
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#4A3024'); bg.addColorStop(.5, '#3B2519'); bg.addColorStop(1, '#2C1B12'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) { const yy = rand() * H; g.strokeStyle = `rgba(${rand() < .5 ? '0,0,0' : '120,80,50'},${.06 + rand() * .08})`; g.lineWidth = 1 + rand() * 2; g.beginPath(); g.moveTo(0, yy); for (let x = 0; x <= W; x += 60) g.lineTo(x, yy + Math.sin(x * .004 + i) * 6); g.stroke(); }
    // gold double border with corner flourishes
    const gold = '#D4B26A';
    g.strokeStyle = gold; g.lineWidth = 6; g.strokeRect(16, 16, W - 32, H - 32); g.lineWidth = 2; g.strokeRect(28, 28, W - 56, H - 56);
    for (const [cx, cy, sx, sy] of [[28, 28, 1, 1], [W - 28, 28, -1, 1], [28, H - 28, 1, -1], [W - 28, H - 28, -1, -1]]) { g.lineWidth = 3; g.beginPath(); g.arc(cx + sx * 22, cy + sy * 22, 14, 0, 7); g.stroke(); g.beginPath(); g.arc(cx + sx * 22, cy + sy * 22, 4, 0, 7); g.fillStyle = gold; g.fill(); }
    // left emblem
    brandEmblem(g, H * .62, H / 2, H * .38, '#3E2820', '#F4E2C4', gold);
    // name: カフェ big, みなと beside it, English and tagline below
    const tx = (H * 1.05 + W - H * 1.3) / 2, avail = W - H * 2.4;   // centred between emblem and plate
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    let k = 1; g.font = `900 ${H * .4}px "Zen Maru Gothic"`; let w1 = g.measureText('カフェ').width; g.font = `700 ${H * .26}px "Zen Maru Gothic"`; let w2 = g.measureText('みなと').width;
    if (w1 + w2 + H * .12 > avail) k = avail / (w1 + w2 + H * .12); w1 *= k; w2 *= k;
    const left = tx - (w1 + w2 + H * .12 * k) / 2, base = H * .56;
    g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowOffsetY = 4; g.shadowBlur = 6;
    g.textAlign = 'left'; g.fillStyle = '#FFF1D6'; g.font = `900 ${H * .4 * k}px "Zen Maru Gothic"`; g.fillText('カフェ', left, base);
    g.fillStyle = gold; g.font = `700 ${H * .26 * k}px "Zen Maru Gothic"`; g.fillText('みなと', left + w1 + H * .12 * k, base);
    g.shadowColor = 'transparent';
    // rule with coffee beans
    g.strokeStyle = gold; g.lineWidth = 2; const ry2 = H * .65;
    g.beginPath(); g.moveTo(tx - avail * .42, ry2); g.lineTo(tx - 30, ry2); g.moveTo(tx + 30, ry2); g.lineTo(tx + avail * .42, ry2); g.stroke();
    for (const dx of [-14, 14]) { g.save(); g.translate(tx + dx, ry2); g.rotate(dx > 0 ? .5 : -.5); g.fillStyle = gold; g.beginPath(); g.ellipse(0, 0, 9, 13, 0, 0, 7); g.fill(); g.strokeStyle = '#3B2519'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -11); g.quadraticCurveTo(4, 0, 0, 11); g.stroke(); g.restore(); }
    g.textAlign = 'center'; g.fillStyle = '#F4E2C4'; g.font = `700 ${H * .11}px Georgia, serif`;
    if (g.letterSpacing !== undefined) g.letterSpacing = `${H * .03}px`;
    g.fillText('MINATO  COFFEE  &  TEA', tx, H * .8, avail * .92);
    if (g.letterSpacing !== undefined) g.letterSpacing = '0px';
    // right plate: house roast + hours
    const px = W - H * .78, pw = H * .95, ph = H * .62;
    g.fillStyle = 'rgba(244,226,196,.1)'; g.strokeStyle = gold; g.lineWidth = 2; g.beginPath(); g.roundRect(px - pw / 2, H / 2 - ph / 2, pw, ph, 12); g.fill(); g.stroke();
    g.fillStyle = gold; g.font = `900 ${H * .13}px "Zen Maru Gothic"`; g.fillText('自家焙煎', px, H * .44);
    g.fillStyle = '#F4E2C4'; g.font = `700 ${H * .075}px "Zen Maru Gothic"`; g.fillText('OPEN 8:00〜19:00', px, H * .6);
    // weathering
    const ev = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .6); ev.addColorStop(0, 'rgba(0,0,0,0)'); ev.addColorStop(1, 'rgba(0,0,0,.25)'); g.fillStyle = ev; g.fillRect(0, 0, W, H);
  });
  const g = sign({ tex, w, h, frameColor: '#2A1C16', day: .22, night: .55 }, B.out(.16), y, z, ry, hint.cafe);
  const brass = std('#C9A45A', { roughness: .35, metalness: .7 });
  // three gooseneck lamps washing the sign with warm light
  const bulb = glowMat(null, null, 1.2, 3, { color: '#FFE2B0', emissive: 0xffc070 });
  for (const dz2 of [-w / 3, 0, w / 3]) {
    const zz = z + dz2;
    box(.04, .1, .1, brass, B.out(.02), y + h / 2 + .12, zz, scene, false);
    const arm = cyl(.02, .02, .62, brass, B.out(.3), y + h / 2 + .2, zz, 6, scene, false); arm.rotation.z = B.n * 1.35;
    const sh = mesh(new THREE.ConeGeometry(.17, .2, 16, 1, true), std('#2E3A33', { side: THREE.DoubleSide, roughness: .4, metalness: .5 }), B.out(.62), y + h / 2 + .22, zz, scene, false);
    sh.rotation.z = B.n * -.7;
    mesh(new THREE.SphereGeometry(.055, 10, 8), bulb, B.out(.6), y + h / 2 + .15, zz, scene, false);
  }
  return g;
}
function cafeCup(parent, x, y, z, m, stacked) {
  if (!stacked) cyl(.07, .07, .01, m, x, y + .005, z, 14, parent, false);
  cyl(.045, .035, .075, m, x, y + .045, z, 12, parent, false);
  if (!stacked) { cyl(.041, .041, .004, std('#4A2A18'), x, y + .088, z, 12, parent, false); mesh(new THREE.TorusGeometry(.018, .006, 5, 8), m, x + .05, y + .045, z, parent, false); }
}
function teapot(parent, x, y, z, m) {
  const b = mesh(new THREE.SphereGeometry(.08, 14, 10), m, x, y + .07, z, parent, false); b.scale.y = .8;
  const sp = cyl(.012, .02, .09, m, x + .09, y + .09, z, 6, parent, false); sp.rotation.z = -.8;
  mesh(new THREE.TorusGeometry(.04, .01, 6, 10), m, x - .08, y + .08, z, parent, false);
  mesh(new THREE.SphereGeometry(.02, 8, 6), m, x, y + .14, z, parent, false);
}
function pitcher(parent, x, y, z, m) { cyl(.035, .045, .1, m, x, y + .05, z, 12, parent, false); }
function jarOfBeans(parent, x, y, z, glass, T) { cyl(.06, .06, .18, std('#ffffff', { map: T.beans }), x, y + .08, z, 12, parent, false); cyl(.065, .065, .2, glass, x, y + .1, z, 12, parent, false); cyl(.067, .067, .03, std('#5A3E2B'), x, y + .215, z, 12, parent, false); }
function grinder(parent, x, y, z, m, glass) { const g = group(x, y, z); parent.add(g); box(.18, .22, .2, m, 0, .11, 0, g); cyl(.05, .07, .12, m, 0, .28, 0, 12, g); mesh(new THREE.ConeGeometry(.1, .2, 14, 1, true), glass, 0, .43, 0, g, false).rotation.x = Math.PI; cyl(.07, .07, .1, std('#3A2214'), 0, .4, 0, 10, g, false); }
function espressoMachine(parent, x, y, z, chrome, black, white) {
  const g = group(x, y, z); parent.add(g);
  const panel = canvasTex(256, 128, (c, W, Hh) => { const gr = c.createLinearGradient(0, 0, 0, Hh); gr.addColorStop(0, '#E9ECEF'); gr.addColorStop(1, '#A9AEB6'); c.fillStyle = gr; c.fillRect(0, 0, W, Hh); c.fillStyle = '#7A1E1E'; c.fillRect(70, 14, 116, 26); c.fillStyle = '#F4E2C4'; c.font = '700 16px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('MINATO', 128, 27); for (const gx of [40, 216]) { c.fillStyle = '#2B2D33'; c.beginPath(); c.arc(gx, 30, 16, 0, 7); c.fill(); c.fillStyle = '#F4EEDF'; c.beginPath(); c.arc(gx, 30, 13, 0, 7); c.fill(); c.strokeStyle = '#C0392B'; c.lineWidth = 2; c.beginPath(); c.moveTo(gx, 30); c.lineTo(gx + 8, 24); c.stroke(); } for (let i = 0; i < 4; i++) { c.fillStyle = '#2B2D33'; c.beginPath(); c.arc(84 + i * 30, 70, 7, 0, 7); c.fill(); } });
  const fm = std('#ffffff', { map: panel, roughness: .25, metalness: .6 });
  box(.85, .45, .5, [chrome, chrome, chrome, chrome, fm, chrome], 0, .3, 0, g);
  box(.87, .06, .52, black, 0, .55, 0, g);
  box(.85, .08, .3, black, 0, .04, .12, g);                                   // drip tray
  for (const dx of [-.2, .2]) { cyl(.05, .05, .08, chrome, dx, .17, .2, 12, g); const h = box(.04, .04, .22, black, dx, .14, .32, g); cafeCup(g, dx, .08, .2, white, true); }
  const wand = cyl(.01, .01, .3, chrome, .38, .2, .22, 6, g, false); wand.rotation.x = .4;
  for (let i = 0; i < 6; i++) cafeCup(g, -.25 + (i % 3) * .25, .58, -.1 + Math.floor(i / 3) * .15, white, true);
}
function pastryCase(parent, x, z, len, glass, wood, chrome) {
  const g = group(x, .16, z); parent.add(g);
  box(len, .9, .85, wood, 0, .45, 0, g);
  box(len + .04, .04, .89, chrome, 0, .92, 0, g);
  box(len, .62, .8, glass, 0, 1.25, 0, g, false);
  box(len + .04, .03, .84, chrome, 0, 1.57, 0, g, false);
  for (const sx of [-len / 2, len / 2]) box(.03, .62, .82, chrome, sx, 1.25, 0, g, false);
  box(len - .05, .015, .7, std('#F4F1EA'), 0, 1.22, 0, g, false);
  mesh(new THREE.PlaneGeometry(len - .1, .03), glowMat(null, null, .8, 1.4, { color: '#FFF4D8', emissive: 0xfff0d0 }), 0, 1.54, .3, g, false).rotation.x = Math.PI / 2;
  // bottom shelf: bread; top shelf: cakes. Each on a doily plate with a price card.
  const breads = ['croissant', 'roll', 'melon', 'croissant', 'donut', 'roll'];
  const cakes = ['short', 'tart', 'mousse', 'choco', 'rollcake', 'cupcake', 'short', 'mousse'];
  for (const [yy, kinds] of [[.93, breads], [1.235, cakes]]) {
    const n = Math.floor((len - .1) / .3);
    for (let i = 0; i < n; i++) {
      const kind = kinds[i % kinds.length], px = -len / 2 + .2 + i * .3;
      const plate = mesh(new THREE.CylinderGeometry(.12, .1, .012, 20), std('#ffffff', { map: pastryTex().doily }), px, yy + .006, -.12, g, false);
      for (const [dx, dz] of kind === 'croissant' || kind === 'roll' || kind === 'donut' ? [[-.045, -.04], [.045, .04], [-.04, .06]] : [[0, 0]]) {
        const m = new THREE.Group(); m.position.set(px + dx, yy + .012, -.12 + dz); m.rotation.y = range(-.5, .5); g.add(m); pastry(m, kind);
      }
      const tag = mesh(new THREE.PlaneGeometry(.12, .07), std('#ffffff', { map: pastryTex().tags[kind] }), px, yy + .04, .14, g, false); tag.rotation.x = -.5;
      box(.1, .002, .03, std('#C9CDD3'), px, yy + .005, .16, g, false);
    }
  }
  sign({ lines: [{ t: 'ケーキ・パン', size: .5, color: '#5B3A2E' }, { t: '¥200〜', size: .3, color: '#D8433F' }], top: .4, gap: .45, w: .5, h: .22, bg: '#FFF8EC', fg: '#5B3A2E', frameColor: '#C9A45A' }, x - .55, 1.88, z + .25, 0, hint.cake);
}
let _pastryTex;
function pastryTex() {
  if (_pastryTex) return _pastryTex;
  const doily = canvasTex(128, 128, (g, W) => { g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, W); g.strokeStyle = 'rgba(200,190,170,.7)'; g.lineWidth = 1.5; for (let r = 20; r < 64; r += 9) { g.beginPath(); g.arc(64, 64, r, 0, 7); g.stroke(); } for (let a = 0; a < 6.28; a += .2) { g.beginPath(); g.arc(64 + Math.cos(a) * 58, 64 + Math.sin(a) * 58, 4, 0, 7); g.stroke(); } });
  const names = { croissant: ['クロワッサン', '220'], roll: ['ロールパン', '160'], melon: ['メロンパン', '180'], donut: ['ドーナツ', '200'], short: ['ショートケーキ', '450'], tart: ['フルーツタルト', '480'], mousse: ['ムース', '500'], choco: ['チョコケーキ', '460'], rollcake: ['ロールケーキ', '400'], cupcake: ['カップケーキ', '320'] };
  const tags = {};
  for (const [k, [n, pr]] of Object.entries(names)) tags[k] = canvasTex(160, 96, (g, W, Hh) => { g.fillStyle = '#FFFDF6'; g.fillRect(0, 0, W, Hh); g.strokeStyle = '#C9A45A'; g.lineWidth = 4; g.strokeRect(4, 4, W - 8, Hh - 8); g.fillStyle = '#3A2A22'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 24px "Zen Maru Gothic"'; const tw = g.measureText(n).width; if (tw > W - 20) g.font = `700 ${24 * (W - 20) / tw}px "Zen Maru Gothic"`; g.fillText(n, W / 2, 34); g.fillStyle = '#C0392B'; g.font = '900 28px "Zen Maru Gothic"'; g.fillText('¥' + pr, W / 2, 68); });
  const melon = canvasTex(64, 64, (g, W) => { g.fillStyle = '#F0CB7A'; g.fillRect(0, 0, W, W); g.strokeStyle = 'rgba(150,100,40,.55)'; g.lineWidth = 2; for (let i = -64; i < 128; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke(); g.beginPath(); g.moveTo(i + 64, 0); g.lineTo(i, 64); g.stroke(); } for (let i = 0; i < 80; i++) { g.fillStyle = 'rgba(255,250,230,.6)'; g.fillRect(Math.random() * W, Math.random() * W, 1.5, 1.5); } });
  const spiral = canvasTex(64, 64, (g, W) => { g.fillStyle = '#F4DDA8'; g.beginPath(); g.arc(32, 32, 31, 0, 7); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 5; g.beginPath(); for (let a = 0; a < 14; a += .1) g.lineTo(32 + Math.cos(a) * a * 2, 32 + Math.sin(a) * a * 2); g.stroke(); g.strokeStyle = '#C98A4A'; g.lineWidth = 2; g.beginPath(); g.arc(32, 32, 30, 0, 7); g.stroke(); });
  return _pastryTex = { doily, tags, melon, spiral };
}
// one pastry, built from small parts so it reads as the real thing
function pastry(m, kind) {
  const gold = std('#D9963F', { roughness: .45 }), goldDark = std('#B26A26', { roughness: .45 }), cream = std('#FFFDF6', { roughness: .5 });
  const sponge = std('#F4DDA8', { roughness: .8 }), berry = std('#D8303A', { roughness: .3 }), glossy = c => std(c, { roughness: .15, metalness: .05 });
  const sph = (r, mat, x, y, z, sx = 1, sy = 1, sz = 1) => { const q = mesh(new THREE.SphereGeometry(r, 14, 10), mat, x, y, z, m, false); q.scale.set(sx, sy, sz); return q; };
  const wedge = (r, h, mat, y) => mesh(new THREE.CylinderGeometry(r, r, h, 12, 1, false, -Math.PI / 6, Math.PI / 3), mat, 0, y, -.03, m, false);
  if (kind === 'croissant') {
    for (let i = 0; i < 7; i++) { const t = i / 6 - .5, a = t * 2.4, s = .03 * (1 - Math.abs(t) * 1.3) + .012;
      sph(s, i % 2 ? gold : goldDark, Math.sin(a) * .05, s * .75, -Math.cos(a) * .05 + .04, 1, .8, 1.25).rotation.y = a; }
  } else if (kind === 'roll') {
    sph(.038, std('#C9833A', { roughness: .4 }), 0, .022, 0, 1.45, .7, 1);
    for (const dx of [-.025, 0, .025]) { const c = box(.006, .004, .04, std('#F0D090'), dx, .048, 0, m, false); c.rotation.y = .5; }
  } else if (kind === 'melon') {
    mesh(new THREE.SphereGeometry(.05, 16, 10, 0, 7, 0, Math.PI / 2), std('#ffffff', { map: pastryTex().melon, roughness: .7 }), 0, 0, 0, m, false).scale.y = .7;
  } else if (kind === 'donut') {
    const d = mesh(new THREE.TorusGeometry(.03, .016, 10, 18), gold, 0, .016, 0, m, false); d.rotation.x = Math.PI / 2;
    const ic = mesh(new THREE.TorusGeometry(.03, .0165, 10, 18, Math.PI * 2), glossy(pick(['#F4A9BE', '#5A3420', '#FFFDF6'])), 0, .021, 0, m, false); ic.rotation.x = Math.PI / 2; ic.scale.z = .6;
    for (let i = 0; i < 10; i++) { const a = rand() * 6.28; box(.008, .003, .003, std(pick(['#F2C230', '#3E7CD6', '#5CB85C', '#FFFFFF'])), Math.cos(a) * .03, .033, Math.sin(a) * .03, m, false).rotation.y = rand() * 3; }
  } else if (kind === 'short' || kind === 'choco') {
    const c = kind === 'choco', sp = c ? std('#5A3420') : sponge, cr = c ? std('#8A5A3A') : cream;
    let y = .01; for (const [h, mm] of [[.022, sp], [.01, cr], [.022, sp], [.01, cr], [.008, c ? glossy('#3A2214') : cream]]) { wedge(.1, h, mm, y + h / 2); y += h; }
    if (!c) { sph(.016, berry, 0, y + .012, .035, 1, 1.2, 1); sph(.012, cream, .02, y + .006, .05); }
    else box(.03, .004, .02, std('#C9A45A', { metalness: .6, roughness: .3 }), 0, y + .003, .04, m, false);
  } else if (kind === 'tart') {
    const crust = mesh(new THREE.TorusGeometry(.055, .012, 8, 24), std('#D9A050'), 0, .012, 0, m, false); crust.rotation.x = Math.PI / 2;
    cyl(.056, .056, .012, std('#D9A050'), 0, .006, 0, 20, m);
    cyl(.052, .052, .006, glossy('#F2D060'), 0, .019, 0, 20, m);
    for (let i = 0; i < 9; i++) { const a = i * .7, r = i ? .032 : 0; sph(.012, glossy(pick(['#D8303A', '#3A3A8A', '#F29A2A', '#5CB85C'])), Math.cos(a) * r, .028, Math.sin(a) * r); }
  } else if (kind === 'mousse') {
    cyl(.045, .045, .012, std('#8A5A30'), 0, .006, 0, 18, m);
    mesh(new THREE.SphereGeometry(.045, 18, 12, 0, 7, 0, Math.PI / 2), glossy(pick(['#C8283A', '#4A2614', '#F2B8C8'])), 0, .012, 0, m, false);
    sph(.007, std('#E8C060', { metalness: .7, roughness: .2 }), 0, .06, 0);
    sph(.01, berry, .015, .055, .01);
  } else if (kind === 'rollcake') {
    const r = mesh(new THREE.CylinderGeometry(.04, .04, .05, 20), [std('#C98A4A'), std('#ffffff', { map: pastryTex().spiral }), std('#ffffff', { map: pastryTex().spiral })], 0, .04, 0, m, false); r.rotation.x = Math.PI / 2;
    sph(.012, cream, 0, .085, 0); sph(.009, berry, 0, .097, 0);
  } else if (kind === 'cupcake') {
    mesh(new THREE.CylinderGeometry(.035, .027, .04, 14), std(pick(['#F4A9BE', '#9FD3F4', '#F2C230'])), 0, .02, 0, m, false);
    const ic = pick(['#FFFDF6', '#F4A9BE', '#C9A0E8']);
    for (let i = 0; i < 3; i++) mesh(new THREE.TorusGeometry(.026 - i * .008, .012, 8, 16), std(ic, { roughness: .4 }), 0, .045 + i * .014, 0, m, false).rotation.x = Math.PI / 2;
    sph(.008, berry, 0, .09, 0);
  }
}

function breadBasket(parent, x, y, z, T) {
  const b = box(.4, .14, .28, std('#ffffff', { map: T.wicker }), x, y + .07, z, parent, false);
  for (let i = 0; i < 4; i++) { const bg = mesh(new THREE.CapsuleGeometry(.03, .34, 4, 8), std('#D99A4A', { roughness: .6 }), x - .1 + i * .07, y + .2, z, parent, false); bg.rotation.set(.3, 0, Math.PI / 2 - .4 + i * .05); }
}
function vintageRegister(parent, x, y, z, brass, ry = 0) {
  const g = group(x, y, z, ry); parent.add(g);
  box(.4, .14, .32, brass, 0, .07, 0, g); const top = box(.34, .16, .14, brass, 0, .2, -.06, g); top.rotation.x = -.3;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cyl(.015, .015, .02, std('#F4EEDF'), -.12 + c * .08, .15, .02 + r * .05, 8, g, false);
  box(.2, .06, .02, std('#1E1F25'), 0, .3, -.13, g, false);
}
function armchair(parent, x, z, ry) {
  const c = group(x, .16, z, ry); parent.add(c); addSeat(x, z, ry, 1.08);
  const leather = std('#B8604A', { roughness: .4 }), leg = std('#3A2A20');
  cyl(.38, .36, .3, leather, 0, .32, 0, 24, c);
  cyl(.34, .34, .08, std('#C8705A', { roughness: .45 }), 0, .5, .02, 24, c);
  const back = mesh(new THREE.CylinderGeometry(.42, .4, .45, 24, 1, true, Math.PI * .35, Math.PI * 1.3), leather, 0, .68, 0, c, false); back.material = std('#B8604A', { roughness: .4, side: THREE.DoubleSide });
  const rim = mesh(new THREE.TorusGeometry(.41, .05, 8, 24, Math.PI * 1.3), leather, 0, .9, 0, c, false); rim.rotation.set(Math.PI / 2, 0, Math.PI * .35 - Math.PI / 2 + Math.PI);
  for (const [a, b] of [[.25, .25], [-.25, .25], [.25, -.25], [-.25, -.25]]) cyl(.025, .02, .18, leg, a, .09, b, 6, c);
}
function barStool(parent, x, z, black, wood) {
  cyl(.2, .2, .07, std('#7A3A22', { roughness: .45 }), x, .82, z, 16, parent);
  cyl(.03, .03, .64, black, x, .5, z, 8, parent);
  mesh(new THREE.TorusGeometry(.15, .012, 5, 16), black, x, .4, z, parent, false).rotation.x = Math.PI / 2;
  cyl(.2, .22, .03, black, x, .175, z, 14, parent);
}
function woodChair(c, wood) {
  box(.44, .05, .42, wood, 0, .46, 0, c);
  for (const [a, b] of [[-.19, -.18], [.19, -.18], [-.19, .18], [.19, .18]]) box(.035, .46, .035, wood, a, .23, b, c);
  for (const a of [-.19, .19]) box(.035, .55, .035, wood, a, .74, -.18, c);
  box(.42, .07, .03, wood, 0, 1.0, -.18, c); box(.42, .05, .03, wood, 0, .74, -.18, c);
  for (let i = 0; i < 4; i++) box(.02, .24, .02, wood, -.12 + i * .08, .87, -.18, c, false);
}


function aboard(side, z, lines, info) {
  if (!claim(side, 'wall', z - .4, z + .4)) return;
  const x = side * 4.9;
  const s = sign({ lines, top: .5, gap: .21, w: .66, h: 1.0, bg: '#2E3B32', fg: '#FFF', font: '"Klee One"', frameColor: '#8A6A45' }, x, .75, z, side < 0 ? Math.PI / 2 - .3 : -Math.PI / 2 + .3, info);
  s.rotation.z = side * .08;
}

function nobori(side, z, text, bg, fg) {       // tall cloth banner flag
  if (!claim(side, 'wall', z - .3, z + .3)) return;
  const x = side * 4.95;
  cyl(.025, .025, 3.2, metal('#BFC4CA'), x, 1.75, z, 6);
  box(.04, .04, .7, metal('#BFC4CA'), x, 3.3, z + .3);
  const s = sign({ text, vertical: true, w: .6, h: 2.2, bg, fg, double: true, frame: false, day: .3, night: .5 }, x, 2.15, z + .33, Math.PI / 2);
}

function mirror(side, z) {                      // orange traffic mirror
  if (!claim(side, 'curb', z - .3, z + .3)) return;
  const x = side * 4.0;
  cyl(.05, .05, 3.2, std('#F07A2A'), x, 1.6, z, 8);
  const m = cyl(.42, .42, .08, std('#F07A2A'), x - side * .05, 3.3, z, 20); m.rotation.z = Math.PI / 2;
  const glass = mesh(new THREE.CircleGeometry(.36, 20), std('#ffffff', { map: mirrorTex, roughness: .15, metalness: .2 }), x - side * .1, 3.3, z, scene, false); glass.rotation.y = -side * Math.PI / 2;
}

function roundSign(side, z, kind) {             // blue round traffic signs
  if (!claim(side, 'curb', z - .3, z + .3)) return;
  const x = side * 4.0;
  cyl(.04, .04, 2.6, metal('#C4C8CE'), x, 1.45, z, 8);
  const tex = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 63, 0, 7); g.fill();
    if (kind === 'noparking') { g.fillStyle = '#D8433F'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.fillStyle = '#2F6FB8'; g.beginPath(); g.arc(64, 64, 46, 0, 7); g.fill(); g.strokeStyle = '#D8433F'; g.lineWidth = 12; g.beginPath(); g.moveTo(32, 32); g.lineTo(96, 96); g.stroke(); }
    else if (kind === '30') { g.fillStyle = '#D8433F'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 46, 0, 7); g.fill(); g.fillStyle = '#2F6FB8'; g.font = '900 54px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('30', 64, 68); }
    else { g.fillStyle = '#2F6FB8'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 12; g.beginPath(); g.moveTo(64, 100); g.lineTo(64, 40); g.lineTo(44, 60); g.moveTo(64, 40); g.lineTo(84, 60); g.stroke(); }
  });
  const d = mesh(new THREE.CircleGeometry(.32, 24), std('#fff', { map: tex, transparent: true, alphaTest: .5 }), x, 2.75, z + .085, scene, false);
  const b = mesh(new THREE.CircleGeometry(.32, 24), std('#9AA0A8', { side: THREE.DoubleSide }), x, 2.75, z + .06, scene, false); b.rotation.y = Math.PI;
  box(.03, .12, .06, metal('#9AA0A8'), x, 2.75, z + .045, scene, false);
}

function streetTree(x, z, kind, size = 1) {
  const g = group(x, .15, z); g.scale.setScalar(size);
  const bark = std('#5E4636');
  cyl(.11, .2, 2.7, bark, 0, 1.35, 0, 8, g);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.3 + rand(), br = cyl(.035, .08, 1.6, bark, Math.cos(a) * .4, 3.0, Math.sin(a) * .4, 6, g);
    br.rotation.set(Math.sin(a) * .6, 0, -Math.cos(a) * .6);
  }
  const core = std(kind === 'sakura' ? '#B9708A' : kind === 'maple' ? '#8A2E22' : '#2F5F2E', { roughness: 1 });
  const blobs = [[0, 3.75, 0, 1.25], [-.85, 3.35, .3, .9], [.85, 3.45, -.2, .95], [.2, 4.45, .2, .85], [-.35, 3.25, -.75, .8], [.5, 3.2, .75, .8]];
  for (const [bx, by, bz, br] of blobs) {
    foliage(g, bx, by, bz, br, br * .82, br, kind, 70, .62);
  }
  return g;
}

// a sign on its own post; the post stands behind the sign
function postSign(o, x, y, z, rot, info) {
  sign(o, x, y, z, rot, info);
  const h = y + o.h / 2 - .05;
  box(.07, h, .07, metal('#A0A3A8'), x - Math.sin(rot) * .13, h / 2, z - Math.cos(rot) * .13);
}

// Japanese cars: tall kei box car, old sedan, kei truck. Local length runs along x, front at +x.
const CAR_TYPES = {
  kei:   { L: 3.4, W: 1.48, belt: .98, roof: 1.78, front: [1.7, .95], ws: [1.0, 1.0, .62, 1.74], rear: [-1.55, 1.74, -1.68, 1.0], hood: .98 },
  sedan: { L: 4.2, W: 1.6, belt: .86, roof: 1.36, ws: [.85, .86, .2, 1.34], rear: [-.85, 1.34, -1.3, .86], hood: .86 },
  truck: { L: 3.4, W: 1.48, belt: 1.0, roof: 1.82, ws: [1.62, 1.0, 1.35, 1.8], rear: [.45, 1.8, .45, 1.0], hood: 1.0, bed: true },
};
const carPlates = [];
function carPlate() {
  if (carPlates.length < 6) {
    const yellow = rand() < .35;
    const num = `${10 + Math.floor(rand() * 89)}-${10 + Math.floor(rand() * 89)}`, area = pick(['品川', '練馬', '足立', '世田谷']);
    carPlates.push(std('#fff', { roughness: .5, map: canvasTex(128, 64, (g, w, h) => {
      g.fillStyle = yellow ? '#F2CF3A' : '#F7F7F2'; g.fillRect(0, 0, w, h); g.strokeStyle = yellow ? '#222' : '#1E6B3A'; g.lineWidth = 4; g.strokeRect(3, 3, w - 6, h - 6);
      g.fillStyle = yellow ? '#222' : '#1E6B3A'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '700 14px "Zen Maru Gothic"'; g.fillText(`${area} 580`, w / 2, 16); g.font = '900 30px sans-serif'; g.fillText(num, w / 2 + 8, 43); g.font = '700 14px "Zen Maru Gothic"'; g.fillText('あ', 16, 43);
    }) }));
  }
  return pick(carPlates);
}
let _carGlass;
function carGlass() {          // tinted glass that reflects a bit of sky (no metal, so it never turns black)
  if (_carGlass) return _carGlass;
  const t = canvasTex(64, 64, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#9FBCD6'); gr.addColorStop(.45, '#5D7893'); gr.addColorStop(1, '#3B4D62'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(10, h); g.lineTo(30, 0); g.lineTo(38, 0); g.lineTo(18, h); g.fill(); });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(.6, .6);
  return _carGlass = new THREE.MeshStandardMaterial({ map: t, roughness: .35, metalness: 0 });
}
function car(x, z, color, ry = 0, type) {
  type = type || pick(['kei', 'kei', 'sedan', 'truck']);
  const T = CAR_TYPES[type], g = group(x, 0, z, ry), L = T.L, W = T.W, hl = L / 2;
  const paint = std(color, { roughness: .3, metalness: .3 }), dark = std('#23252B', { roughness: .8 }), chrome = metal('#D5D9DE');
  const glass = carGlass(), trim = std('#3A3D44', { roughness: .6 });
  const extrude = (shape, depth, mat, y = 0, bevel = .06) => { const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 8 }); geo.translate(0, y, -depth / 2); return mesh(geo, mat, 0, 0, 0, g); };
  // lower body: a rounded box up to the belt line (shorter for the truck bed)
  const bodyFront = hl, bodyRear = T.bed ? .25 : -hl, r = .16;
  const wx = [hl - .62, -hl + .62];
  // wheel arches are notches in the bottom edge, not holes: a hole whose edge lies on the
  // outline makes zero-area triangles → zero normals → NaN pixels that bloom into a black square
  const sh = new THREE.Shape();
  sh.moveTo(bodyRear + r, .3);
  for (const cx of wx.slice().sort((a, b) => a - b)) {
    if (cx - .38 <= bodyRear + r || cx + .38 >= bodyFront - r) continue;   // arch not under this body (truck bed)
    sh.absarc(cx, .3, .38, Math.PI, 0, true);   // absarc draws its own line in; an extra lineTo duplicates the point
  }
  sh.lineTo(bodyFront - r, .3); sh.quadraticCurveTo(bodyFront, .3, bodyFront, .3 + r); sh.lineTo(bodyFront, T.hood - .12); sh.quadraticCurveTo(bodyFront - .02, T.hood, bodyFront - .25, T.hood);
  sh.lineTo(bodyRear + .12, T.belt); sh.quadraticCurveTo(bodyRear, T.belt, bodyRear, T.belt - .12); sh.lineTo(bodyRear, .3 + r); sh.quadraticCurveTo(bodyRear, .3, bodyRear + r, .3);
  extrude(sh, W - .12, paint);
  // cabin: glass, then roof and pillars in paint
  const [wf0, wf1, wf2, wf3] = T.ws, [rr0, rr1, rr2, rr3] = T.rear;
  const gl = new THREE.Shape(); gl.moveTo(wf0, wf1); gl.lineTo(wf2, wf3); gl.lineTo(rr0, rr1); gl.lineTo(rr2, rr3); gl.lineTo(wf0, wf1);
  extrude(gl, W - .2, glass, 0, .02);
  const roof = new THREE.Shape(); roof.moveTo(wf2 - .02, wf3 - .05); roof.lineTo(rr0 + .02, rr1 - .05); roof.lineTo(rr0 + .02, rr1 + .04); roof.lineTo(wf2 - .02, wf3 + .04);
  extrude(roof, W - .14, paint, 0, .03);
  const pillar = (x0, y0, x1, y1, wdt = .09) => { for (const sz of [-1, 1]) { const len = Math.hypot(x1 - x0, y1 - y0), p = box(wdt, len, .06, paint, (x0 + x1) / 2, (y0 + y1) / 2, sz * (W / 2 - .07), g); p.rotation.z = Math.atan2(x0 - x1, y1 - y0); } };
  pillar(wf0, wf1, wf2, wf3); pillar(rr0, rr1, rr2, rr3);
  const bx = (wf0 + rr2) / 2 + .1; pillar(bx, T.belt, bx, T.roof, .1);
  if (type === 'kei') { const cx = (bx + rr2) / 2; pillar(cx, T.belt, cx, T.roof, .07); }
  // door seams and handles
  for (const sz of [-1, 1]) for (const dx of type === 'truck' ? [.5] : [bx + .02, wf0 - .25]) box(.02, T.belt - .38, .01, trim, dx, (T.belt + .38) / 2, sz * (W / 2 + .005), g, false);
  for (const sz of [-1, 1]) for (const dx of type === 'truck' ? [.9] : [bx - .25, wf0 - .55]) box(.14, .03, .02, chrome, dx, T.belt - .15, sz * (W / 2 + .01), g, false);
  // mirrors
  for (const sz of [-1, 1]) box(.12, .1, .14, paint, wf0 - .15, T.belt + .08, sz * (W / 2 + .08), g);
  // bumpers, grille, lights, plates
  box(.14, .2, W - .02, std('#BFC3C9', { roughness: .4, metalness: .4 }), hl + .02, .38, 0, g);
  box(.04, .2, W * .48, dark, hl + .08, T.hood - .28, 0, g, false);   // narrower than the gap between headlights so they never overlap
  for (const sz of [-1, 1]) {
    box(.05, .14, .3, glowMat(null, null, .15, 2.2, { color: '#F4F1EA', emissive: 0xfff0c8 }), hl + .08, T.hood - .24, sz * (W / 2 - .22), g, false);
    box(.05, .08, .1, std('#F2A33A'), hl + .08, T.hood - .38, sz * (W / 2 - .12), g, false);
  }
  const rearX = T.bed ? -hl : bodyRear;
  box(.14, .2, W - .02, std('#BFC3C9', { roughness: .4, metalness: .4 }), rearX - .02, .38, 0, g);
  for (const sz of [-1, 1]) box(.05, .22, .18, glowMat(null, null, .2, 1.4, { color: '#C7302B', emissive: 0xff2a1a }), rearX - .08, T.bed ? .62 : T.belt - .2, sz * (W / 2 - .14), g, false);
  // front plate sits 2.5cm proud of the grille (was in the same plane → flicker)
  for (const px of [hl + .125, rearX - .1]) { const pl = mesh(cardGeo, carPlate(), px, .52, 0, g, false); pl.rotation.y = px > 0 ? Math.PI / 2 : -Math.PI / 2; pl.scale.set(.33, .165, 1); }
  // kei truck: flat bed with low sides
  if (T.bed) {
    box(hl + .25, .08, W, std('#9AA0A8'), (-hl + .25) / 2, .62, 0, g);
    for (const sz of [-1, 1]) box(hl + .25, .3, .04, paint, (-hl + .25) / 2, .8, sz * (W / 2 - .02), g);
    box(.04, .3, W, paint, -hl + .02, .8, 0, g); box(.06, .55, W, std('#9AA0A8'), .22, 1.08, 0, g);
    box(hl + .25, .3, W - .1, dark, (-hl + .25) / 2, .45, 0, g, false);
  }
  // wheels with silver rims
  const wheelXs = T.bed ? [hl - .62, -hl + .62] : wx;
  for (const cx of wheelXs) for (const sz of [-1, 1]) {
    const t = cyl(.3, .3, .2, std('#1E1F24', { roughness: .9 }), cx, .3, sz * (W / 2 - .12), 18, g); t.rotation.x = Math.PI / 2;
    const rim = cyl(.18, .18, .21, chrome, cx, .3, sz * (W / 2 - .12), 14, g, false); rim.rotation.x = Math.PI / 2;
    const hub = cyl(.06, .06, .22, std('#8A9098'), cx, .3, sz * (W / 2 - .12), 8, g, false); hub.rotation.x = Math.PI / 2;
  }
  box(L - .3, .1, W - .2, dark, (bodyRear + hl) / 2, .26, 0, g, false);                       // underside shadow
  return g;
}

function hedge(x, z, len, along = 'z') {
  // a planter hedge made of rounded leaf clumps
  const n = Math.max(2, Math.round(len / .55));
  const core = box(along === 'z' ? .3 : len - .3, .34, along === 'z' ? len - .3 : .3, std('#2E5A2C'), x, 1.075 + .17, z, scene, false);
  core.receiveShadow = false;
  for (let i = 0; i < n; i++) {
    const t = (i + .5) / n - .5, r = range(.34, .44);
    const px = along === 'z' ? x + range(-.06, .06) : x + t * len, pz = along === 'z' ? z + t * len : z + range(-.06, .06);
    foliage(scene, px, 1.38 + range(-.04, .06), pz, r, r * .8, r, pick(['green', 'dark']), 16, .3);
  }
}

const stoneTex = canvasTex(256, 128, (g, w, h) => {
  g.fillStyle = '#CFC6B6'; g.fillRect(0, 0, w, h);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = shade('#D6CDBE', .9 + rand() * .15); g.fillRect(c * 64 + (r % 2) * 32 + 2, r * 32 + 2, 60, 28); }
  speckle(g, w, h, .07, 1200);
}, [1, 1]);
stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping;
const stone = (w, h, d, x, y, z) => { const t = stoneTex.clone(); t.needsUpdate = true; t.repeat.set(Math.max(w, d) / 1.6, h / .8); return box(w, h, d, std('#ffffff', { map: t }), x, y, z); };

