// ================================================================ the café (walk-in)
const cafeDoor = { panels: [], open: 0, z: 0, x: 0 };
function cafeInterior(B) {
  const fx = B.fx, z0 = B.uToZ(0), z1 = B.uToZ(B.len), za = Math.min(z0, z1) + .2, zb = Math.max(z0, z1) - .2;
  const xb = fx + 8.2, H = B.groundH, zc = (za + zb) / 2, dz = zc;
  const G = new THREE.Group(); scene.add(G);
  const T = cafeTex();
  const wood = std('#ffffff', { map: T.grainMid, roughness: .55 }), darkWood = std('#ffffff', { map: T.grainDark, roughness: .6 });
  const blackM = metal('#2B2D33'), brass = std('#C9A45A', { roughness: .35, metalness: .7 }), chrome = std('#D9DDE2', { roughness: .2, metalness: .85 });
  const glassM = new THREE.MeshStandardMaterial({ color: '#E4F2F8', transparent: true, opacity: .2, roughness: .05, depthWrite: false });
  const white = std('#F7F4EE', { roughness: .4 });
  const tex = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.repeat.set(rx, ry); return c; };

  // ---------- room: plank floor, beamed ceiling, brick wall behind the counter, panelled walls
  const fl = mesh(new THREE.PlaneGeometry(xb + .1 - fx, zb + .1 - za), std('#ffffff', { map: tex(T.floor, (xb + .1 - fx) / 2, (zb + .1 - za) / 2), roughness: .45 }), (fx + xb + .1) / 2, .16, zc + .05, G, false); fl.rotation.x = -Math.PI / 2;
  const ce = mesh(new THREE.PlaneGeometry(xb + .1 - fx, zb + .1 - za), std('#ffffff', { map: tex(T.ceiling, (xb + .1 - fx) / 2, (zb + .1 - za) / 2) }), (fx + xb + .1) / 2, H - .02, zc + .05, G, false); ce.rotation.x = Math.PI / 2;
  box(xb - fx, .1, zb - za, std('#2A1E18'), (fx + xb) / 2, H + .04, zc, G);
  for (let x = fx + 1.2; x < xb; x += 1.8) box(.22, .26, zb - za, darkWood, x, H - .14, zc, G, false);
  // side wall behind the counter: brick
  box(xb + .3 - fx, H, .2, wallMat('brick', '#B0603F', xb + .3 - fx, H), (fx + xb + .3) / 2, H / 2, za - .1, G);
  // other walls: dark green wood panels below, warm plaster above
  const wallSet = (len, cx, cz, rot) => {
    const w = new THREE.Group(); w.position.set(cx, 0, cz); w.rotation.y = rot; G.add(w);
    box(len, H, .2, std('#E9D9BC', { roughness: .9 }), 0, H / 2, -.1, w);
    box(len, 1.15, .05, std('#ffffff', { map: tex(T.panelGreen, Math.max(1, Math.round(len / .9)), 1) }), 0, .16 + .575, .02, w);
    box(len, .07, .09, darkWood, 0, 1.33, .04, w); box(len, .14, .06, darkWood, 0, .23, .03, w);
    box(len, .12, .08, darkWood, 0, H - .12, .03, w);
  };
  wallSet(xb + .1 - fx, (fx + xb + .1) / 2, zb + .1, Math.PI);
  const rdz = za + 6.3, rdw = .45;                                   // restroom doorway on the side wall
  wallSet(rdz - rdw - za, xb + .1, (za + rdz - rdw) / 2, -Math.PI / 2);
  wallSet(zb + .1 - rdz - rdw, xb + .1, (rdz + rdw + zb + .1) / 2, -Math.PI / 2);
  box(.2, H - 2.27, 2 * rdw, std('#E9D9BC', { roughness: .9 }), xb + .2, (2.27 + H) / 2, rdz, G);

  // shop front: glass with frames, an automatic sliding door in the middle
  const glass = new THREE.MeshStandardMaterial({ color: '#D6E8F2', transparent: true, opacity: .16, roughness: .05, depthWrite: false });
  const frameM = metal('#3A3D44');
  const DW = 1.2, d0 = dz - DW, d1 = dz + DW;                          // door opening is 2.4 m wide
  for (const [a, b] of [[za, d0], [d1, zb]]) {
    const n = Math.max(1, Math.round((b - a) / 2.2));
    for (let i = 0; i < n; i++) { const pa = a + (b - a) * i / n, pb = a + (b - a) * (i + 1) / n; box(.04, 2.45, pb - pa - .06, glass, fx + .02, .55 + 1.225, (pa + pb) / 2, G, false); }
    for (let i = 0; i <= n; i++) box(.1, 2.6, .08, frameM, fx + .02, .2 + 1.3, a + (b - a) * i / n, G);
    box(.14, .4, b - a, darkWood, fx + .05, .35, (a + b) / 2, G);                    // low wooden base
    box(.12, .08, b - a, frameM, fx + .02, 2.82, (a + b) / 2, G, false);
    // window ledge inside with stools, cups and plants
    box(.45, .05, b - a - .3, wood, fx + .35, 1.05, (a + b) / 2, G);
    for (let z = a + .7; z < b - .5; z += 1.1) { addSeat(fx + .85, z, -Math.PI / 2, 1.35); cyl(.17, .17, .05, darkWood, fx + .85, .78, z, 14, G); cyl(.025, .025, .62, blackM, fx + .85, .46, z, 6, G); cyl(.16, .16, .02, blackM, fx + .85, .17, z, 12, G); }
  }
  box(.12, .55, zb - za, std('#3A2A20'), fx + .02, H - .28, zc, G);                    // header above the glass
  for (const z of [d0, d1]) box(.12, 2.75, .1, frameM, fx + .02, 1.5, z, G);
  box(.12, .1, 2 * DW + .1, frameM, fx + .02, 2.85, dz, G);
  const doorGlass = new THREE.MeshStandardMaterial({ color: '#D6E8F2', transparent: true, opacity: .2, roughness: .05, depthWrite: false });
  const logoDecal = cafeLogoTex();
  for (const s2 of [-1, 1]) {
    const PW = DW - .02, p = new THREE.Group(); p.position.set(fx + .08, 0, dz + s2 * DW / 2); scene.add(p);
    mesh(new THREE.BoxGeometry(.03, 2.55, PW - .08), doorGlass, 0, 1.5, 0, p, false);
    for (const y of [.2, 2.78]) mesh(new THREE.BoxGeometry(.07, .1, PW), darkWood, 0, y, 0, p, false);
    for (const zz of [-PW / 2 + .03, PW / 2 - .03]) mesh(new THREE.BoxGeometry(.07, 2.68, .06), darkWood, 0, 1.49, zz, p, false);
    // long brass pull bar on the meeting edge
    mesh(new THREE.BoxGeometry(.03, .9, .03), brass, -.07, 1.1, -s2 * (PW / 2 - .14), p, false);
    for (const y of [.7, 1.5]) mesh(new THREE.BoxGeometry(.06, .03, .03), brass, -.05, y, -s2 * (PW / 2 - .14), p, false);
    // round shop logo on each pane, readable from the street, and the automatic-door sticker
    const lg = mesh(new THREE.PlaneGeometry(.5, .5), new THREE.MeshBasicMaterial({ map: logoDecal, transparent: true, depthWrite: false }), -.025, 1.55, 0, p, false); lg.rotation.y = -Math.PI / 2;
    const ad = mesh(new THREE.PlaneGeometry(.42, .1), std('#ffffff', { map: autoDoorTex() }), -.025, 1.05, 0, p, false); ad.rotation.y = -Math.PI / 2;
    p.traverse(o => { if (o.isMesh) { dynamic.add(o); o.userData.noCollide = true; } });
    cafeDoor.panels.push({ g: p, home: dz + s2 * DW / 2, dir: s2, slide: PW - .06 });
  }
  cafeDoor.z = dz; cafeDoor.x = fx; cafeDoor.za = za; cafeDoor.zb = zb;
  doorways.push([1, dz - DW, dz + DW]);
  sign({ lines: [{ t: '営業中', size: .5, color: '#FFFFFF' }], w: .5, h: .2, bg: '#D8433F', fg: '#FFF', frame: false }, fx + .12, 1.75, dz - DW - .55, -Math.PI / 2, hint.cafe).traverse(o => o.userData.noCollide = true);
  sign({ lines: [{ t: 'いらっしゃいませ', size: .55, color: '#5B3A2E' }], w: 1.2, h: .22, bg: '#FFF8EC', fg: '#5B3A2E', frame: false }, fx + .14, 2.55, dz, -Math.PI / 2, hint.irasshai);
  const mat = mesh(new THREE.PlaneGeometry(1.0, 2.0), std('#5B3A2E'), fx + .9, .165, dz, G, false); mat.rotation.x = -Math.PI / 2;
  // things on the window ledge
  for (const [z, t] of [[za + .9, 'plant'], [za + 2.2, 'cup'], [zb - .9, 'plant'], [zb - 2.0, 'cup'], [zb - 2.9, 'book']]) {
    if (t === 'plant') { const pp = plantPot(0, 0, 0, .55); pp.position.set(fx + .35, 1.08, z); G.add(pp); }
    else if (t === 'cup') cafeCup(G, fx + .35, 1.08, z, white);
    else { box(.22, .03, .3, std('#F4EEDF'), fx + .35, 1.09, z, G, false); box(.005, .035, .3, std('#7A5A3A'), fx + .35, 1.09, z, G, false); }
  }
  // hanging plants in the windows
  for (const z of [za + 2.3, zb - 2.3]) { cyl(.004, .004, .7, blackM, fx + .45, H - .35, z, 4, G, false); const hp = group(fx + .45, H - 1.0, z); G.add(hp); cyl(.15, .11, .18, std('#E5DCCB'), 0, 0, 0, 12, hp); foliage(hp, 0, -.15, 0, .28, .35, .28, 'green', 26, .2); }

  // ---------- L-shaped counter: a long run along the brick wall, then a return leg into the room with the register
  const cxa = fx + 3.0, cxe = xb - .8, czc = za + 2.0;                // main run along x, outer corner at cxe
  const caseLen = 1.9, runA = cxa + caseLen;
  const rx = cxe - .4, rz0 = czc + .4, rz1 = za + 4.9;                // return leg along z (customer side faces -x)
  const topM = std('#ffffff', { map: tex(T.grainTop, 3, 1), roughness: .35 });
  const front2 = std('#ffffff', { map: tex(T.panelWood, Math.max(1, Math.round((cxe - runA) / .9)), 1) });
  const front3 = std('#ffffff', { map: tex(T.panelWood, Math.max(1, Math.round((rz1 - rz0) / .9)), 1) }), endCap = std('#ffffff', { map: tex(T.panelWood, 1, 1) });
  box(cxe - runA, 1.0, .8, [darkWood, darkWood, darkWood, darkWood, front2, darkWood], (runA + cxe) / 2, .66, czc, G);
  box(cxe - runA + .1, .07, .95, topM, (runA + cxe) / 2 + .05, 1.195, czc + .05, G);
  box(.8, 1.0, rz1 - rz0, [darkWood, front3, darkWood, darkWood, endCap, darkWood], rx, .66, (rz0 + rz1) / 2, G);
  box(.95, .07, rz1 - rz0 + .05, std('#ffffff', { map: tex(T.grainTop, 1, 3), roughness: .35 }), rx - .05, 1.195, (rz0 + rz1) / 2 + .02, G);
  // brass foot rails on both legs, with posts
  box(cxe - .8 - runA, .08, .06, brass, (runA + cxe - .8) / 2, .3, czc + .43, G, false);
  for (let x = runA + .5; x < cxe - .8; x += 1.2) box(.04, .14, .04, brass, x, .24, czc + .43, G, false);
  box(.06, .08, rz1 - rz0, brass, rx - .43, .3, (rz0 + rz1) / 2, G, false);
  for (let z = rz0 + .3; z < rz1; z += 1.1) box(.04, .14, .04, brass, rx - .43, .24, z, G, false);
  // pastry case at the front end of the counter, near the window
  pastryCase(G, cxa + caseLen / 2, czc, caseLen, glassM, darkWood, chrome);
  // the register sits on the return leg, so customers queue in the open floor in front of it
  const regZ = za + 3.9;
  cafeDoor.reg = { x: rx, z: regZ, floor: .15, aisleX: cxe + .4, aisleZ: za + 1.12, machineX: fx + 6.0 };   // the barista's spots behind the counter (369-barista-3d.js)
  vintageRegister(G, rx - .05, 1.23, regZ, brass, -Math.PI / 2);
  sign({ lines: [{ t: 'レジ', size: .6, color: '#FFFFFF' }], w: .42, h: .18, bg: '#5B3A2E', fg: '#FFF', frame: false }, rx, 1.95, regZ, -Math.PI / 2, hint.reji);
  cyl(.004, .004, .5, blackM, rx, 2.3, regZ, 4, G, false);
  // on the counter: bread basket, tip jar, napkins, a price card
  breadBasket(G, runA + 2.0, 1.23, czc, T);
  cyl(.07, .07, .16, glassM, rx - .2, 1.31, regZ + .6, 12, G, false); for (let i = 0; i < 4; i++) cyl(.03, .03, .004, brass, rx - .2 + range(-.03, .03), 1.24 + i * .012, regZ + .6, 8, G, false);
  box(.07, .1, .14, metal('#9AA0A8'), rx - .25, 1.28, regZ - .55, G, false);
  sign({ lines: [{ t: 'コーヒー', size: .2, color: '#3A2A22' }, { t: '300円', size: .2, color: '#C0392B' }], top: .5, gap: .4, w: .22, h: .3, bg: '#FFF8EC', fg: '#3A2A22', frameColor: '#6E4F3E' }, rx - .3, 1.39, regZ + .95, -Math.PI / 2, hint.kohi);

  // ---------- back bar against the brick wall: espresso machine, grinders, cups, jars
  const bzc = za + .38;
  const bbEnd = xb + .05, bbFront = std('#ffffff', { map: tex(T.panelWood, Math.max(1, Math.round((bbEnd - cxa) / .9)), 1) });
  box(bbEnd - cxa, .92, .62, [darkWood, darkWood, darkWood, darkWood, bbFront, darkWood], (cxa + bbEnd) / 2, .62, bzc, G);
  box(bbEnd - cxa, .05, .68, std('#ffffff', { map: tex(T.grainTop, 3, 1), roughness: .35 }), (cxa + bbEnd) / 2, 1.105, bzc + .02, G);
  espressoMachine(G, fx + 6.0, 1.13, bzc, chrome, blackM, white);
  grinder(G, fx + 5.15, 1.13, bzc, blackM, glassM); grinder(G, fx + 6.85, 1.13, bzc, chrome, glassM);
  for (let i = 0; i < 3; i++) cafeCup(G, fx + 4.2 + i * .16, 1.13, bzc + .15, white);
  pitcher(G, fx + 7.2, 1.13, bzc + .1, chrome); pitcher(G, fx + 7.35, 1.13, bzc + .15, chrome);
  teapot(G, fx + 7.65, 1.13, bzc, std('#3E6A5A', { roughness: .3 }));
  for (let i = 0; i < 4; i++) cyl(.035, .035, .26, std(pick(['#7A3A1E', '#C9853A', '#E8C060', '#5A2E2A'])), fx + 4.65 + i * .09, 1.26, bzc - .05, 10, G, false);
  // open shelves on the brick wall with stacked cups, teapots, jars of beans, coffee bags, plants
  for (const y of [1.62, 2.05]) {
    box(xb - .5 - (fx + 3.9), .04, .26, wood, (fx + 3.9 + xb - .5) / 2, y, za + .13, G);
    for (const x of [fx + 4.0, xb - .6]) { const br = box(.03, .14, .2, blackM, x, y - .08, za + .1, G, false); }
    for (let x = fx + 4.1; x < xb - .7; x += range(.22, .34)) {
      const t = rand();
      if (t < .25) jarOfBeans(G, x, y + .02, za + .13, glassM, T);
      else if (t < .45) { for (let k = 0; k < 3; k++) cafeCup(G, x, y + .02 + k * .07, za + .13, white, true); }
      else if (t < .6) box(.12, .22, .09, std('#ffffff', { map: pick(T.bags) }), x, y + .13, za + .13, G, false);
      else if (t < .72) teapot(G, x, y + .02, za + .13, std(pick(['#F7F4EE', '#E8C0A0', '#9FB8C8']), { roughness: .3 }));
      else if (t < .82) { const pp = plantPot(0, 0, 0, .4); pp.position.set(x, y + .02, za + .13); G.add(pp); }
      else for (let k = 0; k < 2; k++) cyl(.03, .03, .2, std(pick(['#7A3A1E', '#C9853A', '#E8C060', '#3A5A2A'])), x + k * .08, y + .12, za + .13, 10, G, false);
    }
  }
  // trailing plant at the end of the shelf
  { const tp = group(xb - .6, 2.1, za + .15); G.add(tp); cyl(.1, .08, .13, std('#C9744F'), 0, .06, 0, 10, tp); foliage(tp, 0, -.15, .05, .2, .35, .15, 'green', 22, .18); }
  // chalkboard menus above the shelves (tappable)
  sign({ tex: T.boardMenu, w: 1.5, h: .85, frameColor: '#5A3E2B', day: .3, night: .45 }, fx + 4.75, 2.7, za + .04, 0, hint.menu);
  sign({ tex: T.boardHotIce, w: .9, h: .85, frameColor: '#5A3E2B', day: .3, night: .45 }, fx + 6.1, 2.7, za + .04, 0, hint.hotice);
  sign({ tex: T.boardTennai, w: .9, h: .85, frameColor: '#5A3E2B', day: .3, night: .45 }, fx + 7.2, 2.7, za + .04, 0, hint.tennai);
  sign({ tex: T.boardLatte, w: 1.3, h: 1.0, frameColor: '#5A3E2B', day: .3, night: .45 }, xb - .04, 2.4, za + 1.5, -Math.PI / 2, hint.kohi);
  sign({ tex: T.roundSign, w: .62, h: .62, frame: false, cutout: true, day: .3, night: .5 }, fx + 2.9, 2.2, za + .03, 0, hint.kohi);
  // a clock on the brick wall
  const clk = mesh(new THREE.CircleGeometry(.21, 32), std('#ffffff', { map: T.clock }), fx + 1.6, 2.55, za + .045, G, false);
  cyl(.24, .24, .04, darkWood, fx + 1.6, 2.55, za + .0, 24, G, false).rotation.x = Math.PI / 2;

  // ---------- tables: round wooden tables, a banquette along the far wall
  const candleM = glowMat(null, null, .8, 1.8, { color: '#FFC070', emissive: 0xffa040 });
  const table = (x, z, square) => {
    if (square) box(.75, .05, .75, wood, x, .92, z, G); else cyl(.45, .45, .05, wood, x, .92, z, 22, G);
    cyl(.05, .07, .72, darkWood, x, .54, z, 10, G); cyl(.25, .28, .05, darkWood, x, .19, z, 14, G);
    cafeCup(G, x + .15, .945, z + .08, white);
    if (rand() < .7) { cyl(.04, .04, .07, glassM, x - .1, .98, z - .1, 10, G, false); cyl(.015, .015, .04, candleM, x - .1, 1.0, z - .1, 6, G, false); }
    if (rand() < .5) { box(.2, .02, .28, std('#F4EEDF'), x - .12, .955, z + .12, G, false); }
    else { cyl(.1, .1, .01, white, x - .1, .95, z + .12, 14, G, false); mesh(new THREE.TorusGeometry(.04, .02, 6, 10, Math.PI), std('#D99A4A'), x - .1, .97, z + .12, G, false).rotation.x = -Math.PI / 2; }
  };
  const chair = (x, z, tx, tz) => { const ry = Math.atan2(tx - x, tz - z), c = group(x, .16, z, ry); G.add(c); woodChair(c, darkWood); addSeat(x, z, ry, 1.15); };
  // banquette (bench seat) along the far wall with two small square tables
  const bench = std('#6A2E2A', { roughness: .45 }), bx = fx + 5.2, bl = 3.0;
  box(bl, .45, .55, darkWood, bx, .38, zb - .3, G);
  box(bl, .12, .55, bench, bx, .66, zb - .3, G);
  box(bl, .5, .12, bench, bx, 1.0, zb - .06, G);
  const sqT = [fx + 4.4, fx + 6.0];
  for (const x of sqT) { table(x, zb - 1.15, true); chair(x, zb - 1.85, x, zb - 1.15); addSeat(x, zb - .4, Math.PI, 1.15); }   // a place on the banquette at each table
  // a table for two in the middle, behind the register queue
  const t2x = fx + 4.0, t2z = za + 5.2;
  table(t2x, t2z); chair(t2x - .7, t2z, t2x, t2z); chair(t2x + .7, t2z, t2x, t2z);
  // pendant lights: metal shades over the counter, Edison bulbs over the tables
  const bulb = glowMat(null, null, 1.4, 2.4, { color: '#FFE2B0', emissive: 0xffc070 });
  const shadeM = new THREE.MeshStandardMaterial({ color: '#2E4A3E', side: THREE.DoubleSide, roughness: .35, metalness: .6 });
  const pendant = (x, z, kind, len = .9) => {
    cyl(.006, .006, len, blackM, x, H - len / 2, z, 4, G, false);
    if (kind === 'shade') { mesh(new THREE.SphereGeometry(.24, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2.4), shadeM, x, H - len - .02, z, G, false); mesh(new THREE.SphereGeometry(.06, 10, 8), bulb, x, H - len - .08, z, G, false); }
    else { cyl(.02, .02, .05, brass, x, H - len, z, 8, G, false); const bb = mesh(new THREE.SphereGeometry(.065, 12, 8), bulb, x, H - len - .08, z, G, false); bb.scale.y = 1.3; }
  };
  for (let x = runA + .3; x < cxe; x += 1.3) pendant(x, czc, 'shade', .85);
  for (const z of [regZ - .6, regZ + .6]) pendant(rx, z, 'shade', .85);
  for (const [x, z] of [[t2x, t2z], [sqT[0], zb - 1.15], [sqT[1], zb - 1.15]]) pendant(x, z, 'bulb', range(.8, 1.15));
  for (const z of [za + 1.4, zb - 1.2]) pendant(fx + .8, z, 'bulb', range(.6, .9));

  // ---------- decor on the plaster walls
  for (const [x, w, h] of [[sqT[0], .55, .7], [sqT[1], .9, .6]]) { box(w + .08, h + .08, .04, darkWood, x, 2.3, zb - .02, G, false); mesh(new THREE.PlaneGeometry(w, h), std('#ffffff', { map: pick(T.pictures) }), x, 2.3, zb - .045, G, false).rotation.y = Math.PI; }
  box(1.6, .04, .22, wood, fx + 2.5, 2.05, zb - .12, G);
  { const pp = plantPot(0, 0, 0, .5); pp.position.set(fx + 2.1, 2.07, zb - .12); G.add(pp); teapot(G, fx + 2.6, 2.07, zb - .12, std('#E8C0A0', { roughness: .3 })); for (let k = 0; k < 3; k++) box(.05, .22, .15, std(pick(['#C0392B', '#2F6FB8', '#3C9D5D'])), fx + 3.0 + k * .06, 2.18, zb - .12, G, false); }
  // restroom door on the side wall, past the end of the counter
  // door casing, and a real hinged door you can open (it swings into the restroom)
  for (const zz of [rdz - rdw - .04, rdz + rdw + .04]) box(.08, 2.15, .08, darkWood, xb + .06, .16 + 1.075, zz, G);
  box(.08, .09, 2 * rdw + .16, darkWood, xb + .06, 2.3, rdz, G);
  box(.24, .012, 2 * rdw, darkWood, xb + .2, .166, rdz, G, false);
  const jambM = std('#4A2C1E', { roughness: .7 });
  for (const zz of [rdz - rdw + .012, rdz + rdw - .012]) box(.32, 2.14, .024, jambM, xb + .16, .16 + 1.07, zz, G);
  box(.32, .05, 2 * rdw, jambM, xb + .16, 2.27, rdz, G);
  sign({ lines: [{ t: 'お手洗い', size: .5, color: '#FFFFFF' }], w: .6, h: .2, bg: '#5B3A2E', fg: '#FFF', frame: false }, xb + .01, 2.52, rdz, -Math.PI / 2, hint.otearai);
  { const dg = group(xb + .14, .16, rdz - rdw + .02); G.add(dg);
    box(.04, 2.08, 2 * rdw - .04, std('#ffffff', { map: T.panelGreen }), 0, 1.04, rdw - .02, dg);
    box(.045, 2.08, .04, darkWood, 0, 1.04, .02, dg); box(.045, 2.08, .04, darkWood, 0, 1.04, 2 * rdw - .06, dg);
    for (const sx of [-1, 1]) mesh(new THREE.SphereGeometry(.035, 8, 6), brass, sx * .05, .98, 2 * rdw - .12, dg, false);
    // little occupied/vacant window by the handle
    box(.05, .05, .1, std('#3C9D5D', { emissive: 0x3C9D5D, emissiveIntensity: .4 }), -.01, 1.12, 2 * rdw - .12, dg, false);
    dg.traverse(o => { if (o.isMesh) o.userData.noCollide = true; }); dynAll(dg);
    restroom.door = dg; restroom.x = xb + .14; restroom.z0 = rdz - rdw; restroom.z1 = rdz + rdw;
  }
  addAction(xb, rdz, 1.6, () => restroom.target ? 'shimeru' : 'akeru', () => { restroom.target = 1 - restroom.target; });

  // ---------- the restroom: small tiled room behind the door with a washlet toilet and a sink
  { const x0 = xb + .3, x1 = xb + 2.3, z0 = rdz - 1.0, z1 = rdz + 1.35, CH = 2.6, mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
    const tileT = canvasTex(256, 256, (g, W) => { g.fillStyle = '#B9C2C0'; g.fillRect(0, 0, W, W); g.fillStyle = '#F4F5F1'; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) g.fillRect(i * 32 + 1.5, j * 32 + 1.5, 29, 29); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * .03})`; g.fillRect(Math.random() * W, Math.random() * W, 3, 3); } });
    const floorT = canvasTex(256, 256, (g, W) => { g.fillStyle = '#5E6266'; g.fillRect(0, 0, W, W); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#8C9296' : '#7E8488'; g.fillRect(i * 64 + 2, j * 64 + 2, 60, 60); } });
    const tiles = (w, h) => std('#ffffff', { map: tex(tileT, w / .5, h / .5), roughness: .25 });
    const plaster = std('#F1ECE0', { roughness: .9 }), white = std('#FBFBF8', { roughness: .15 }), cream = std('#EFE9DC', { roughness: .3 });
    const fl3 = mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), std('#ffffff', { map: tex(floorT, 2, 2), roughness: .4 }), mx, .162, mz, G, false); fl3.rotation.x = -Math.PI / 2;
    box(x1 - x0 + .2, .06, z1 - z0 + .2, plaster, mx, CH, mz, G, false);
    // walls: tiles to 1.3 m, plaster above
    box(.1, 1.14, z1 - z0, tiles(z1 - z0, 1.14), x1 + .05, .16 + .57, mz, G); box(.1, CH - 1.3, z1 - z0, plaster, x1 + .05, (1.3 + CH) / 2, mz, G);
    for (const zz of [z0 - .05, z1 + .05]) { box(x1 - x0, 1.14, .1, tiles(x1 - x0, 1.14), mx, .16 + .57, zz, G); box(x1 - x0, CH - 1.3, .1, plaster, mx, (1.3 + CH) / 2, zz, G); }
    // ceiling light
    mesh(new THREE.BoxGeometry(.5, .03, .5), glowMat(null, null, 1.5, 2.5, { color: '#FFFDF4', emissive: 0xfff6e0 }), mx, CH - .04, mz, G, false);
    const rl = new THREE.PointLight(0xfff4e0, 4, 5, 1.4); rl.position.set(mx, CH - .3, mz); scene.add(rl); cafeLights.push(rl);

    // washlet toilet against the back wall, facing the door
    const tz = rdz + .6, tg = group(x1 - .02, .16, tz, -Math.PI / 2); G.add(tg);
    const s3 = (m, sx, sz) => { m.scale.set(sx, 1, sz); return m; };
    s3(cyl(.16, .2, .38, white, 0, .19, .38, 20, tg), 1, 1.25);                               // pedestal
    s3(cyl(.21, .17, .1, white, 0, .43, .42, 22, tg), 1, 1.3);                                // bowl rim
    const bowlWater = s3(cyl(.15, .15, .01, std('#BFE3F0', { roughness: .05, metalness: .1 }), 0, .475, .43, 20, tg, false), 1, 1.25);
    const seatR = mesh(new THREE.TorusGeometry(.17, .028, 8, 24), cream, 0, .495, .43, tg, false); seatR.rotation.x = Math.PI / 2; seatR.scale.set(1, 1.3, 1);
    const lid = box(.38, .5, .03, cream, 0, .76, .15, tg); lid.rotation.x = -.15;
    box(.44, .1, .22, cream, 0, .5, .14, tg);                                                    // washlet unit
    box(.44, .46, .2, white, 0, .78, .08, tg); box(.46, .04, .22, white, 0, 1.03, .08, tg);       // tank and lid
    // the little hand-wash spout on top of the tank (very Japanese)
    s3(cyl(.12, .09, .04, white, 0, 1.06, .08, 16, tg, false), 1, .8); const sp = cyl(.012, .012, .14, std('#D9DDE2', { metalness: .85, roughness: .2 }), 0, 1.13, -.0, 8, tg, false); sp.rotation.x = .6;
    const lever = box(.1, .025, .025, std('#D9DDE2', { metalness: .85, roughness: .2 }), -.24, .92, .14, tg, false);
    dynAll(bowlWater); dynAll(lever);
    // control panel on the side wall: 止 / おしり / ビデ / 流す (tap it to learn 流す)
    const panelT = canvasTex(160, 220, (g, W, Hh) => {
      g.fillStyle = '#F3F1EA'; g.fillRect(0, 0, W, Hh); g.strokeStyle = '#C9C5B9'; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, Hh - 4);
      const btn = (x, y, r, c, t, tc = '#fff', fs = 22) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = tc; g.font = `900 ${fs}px "Zen Maru Gothic"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x, y + 1); };
      btn(W / 2, 38, 26, '#E8632B', '止', '#fff', 26);
      btn(48, 100, 24, '#3F7FC0', 'おしり', '#fff', 13); btn(W - 48, 100, 24, '#D9679A', 'ビデ', '#fff', 15);
      g.fillStyle = '#2E5E8C'; g.beginPath(); g.roundRect(22, 146, W - 44, 56, 12); g.fill(); g.fillStyle = '#fff'; g.font = '900 26px "Zen Maru Gothic"'; g.textAlign = 'center'; g.fillText('流す', W / 2, 176);
    });
    sign({ tex: panelT, w: .16, h: .22, frameColor: '#D9D6CF', day: .35, night: .5 }, x1 - .4, .95, z1 - .02, Math.PI, hint.nagasu);
    // toilet paper holder
    box(.16, .03, .12, std('#D9DDE2', { metalness: .85, roughness: .2 }), x1 - .75, .8, z1 - .06, G, false);
    { const r = cyl(.06, .06, .11, white, x1 - .75, .73, z1 - .08, 14, G, false); r.rotation.z = Math.PI / 2; }
    // sink on the other wall, mirror, soap, towel
    // sink on the wall to your right as you walk in (the door swings open to the left)
    const sx2 = x0 + .75, sz2 = z1 - .22;
    s3(cyl(.24, .14, .14, white, sx2, .86, sz2 - .02, 22, G), 1, .8);
    const faucet = std('#D9DDE2', { metalness: .4, roughness: .25 });
    cyl(.02, .025, .16, faucet, sx2, 1.0, sz2 + .12, 10, G, false); box(.03, .03, .12, faucet, sx2, 1.08, sz2 + .07, G, false);
    const stream = cyl(.008, .008, .16, new THREE.MeshStandardMaterial({ color: '#CFEAF5', transparent: true, opacity: .7, roughness: .05 }), sx2, .99, sz2 + .02, 8, G, false);
    stream.visible = false; dynAll(stream);
    { const mt = canvasTex(128, 160, (g, W, Hh) => { const gr = g.createLinearGradient(0, 0, W, Hh); gr.addColorStop(0, '#E9F1F4'); gr.addColorStop(.5, '#C9D7DE'); gr.addColorStop(1, '#AFC0C8'); g.fillStyle = gr; g.fillRect(0, 0, W, Hh); g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.moveTo(20, 0); g.lineTo(50, 0); g.lineTo(10, 70); g.lineTo(0, 70); g.fill(); g.beginPath(); g.moveTo(70, 0); g.lineTo(82, 0); g.lineTo(30, 100); g.lineTo(22, 100); g.fill(); });
      const mr = mesh(new THREE.PlaneGeometry(.6, .7), std('#ffffff', { map: mt, roughness: .1, metalness: .1 }), sx2, 1.55, z1 - .025, G, false); mr.rotation.y = Math.PI; }
    box(.66, .76, .015, std('#BFC5C9', { metalness: .6, roughness: .3 }), sx2, 1.55, z1 - .005, G, false);
    cyl(.03, .035, .14, std('#F0C4D0', { roughness: .3 }), sx2 - .3, .99, sz2 + .1, 10, G, false);
    cyl(.012, .012, .3, faucet, x0 + .2, 1.25, z1 - .07, 8, G, false).rotation.z = Math.PI / 2;
    box(.24, .4, .03, std('#E6EEF2', { roughness: .9 }), x0 + .2, 1.05, z1 - .09, G, false);
    // spare paper rolls on a little shelf on the other wall
    box(.5, .03, .18, std('#ffffff', { map: tex(T.grainTop, 1, 1) }), x1 - .55, 1.55, z0 + .1, G, false);
    for (let k = 0; k < 3; k++) { const r = cyl(.055, .055, .1, white, x1 - .72 + k * .14, 1.62, z0 + .1, 14, G, false); }
    // the classic sign
    sign({ lines: [{ t: 'いつもきれいにご利用', size: .2, color: '#3A5A7A' }, { t: 'ありがとうございます', size: .2, color: '#3A5A7A' }], gap: .32, w: .5, h: .3, bg: '#FFFFFF', fg: '#3A5A7A', frameColor: '#C9C5B9' }, x1 - .01, 1.75, tz, -Math.PI / 2, hint.kirei);
    // a small plant and a sanitary bin
    { const pp = plantPot(0, 0, 0, .5); pp.position.set(x1 - .12, 1.22, tz + .16); G.add(pp); }
    cyl(.09, .08, .28, std('#E8E4DC', { roughness: .4 }), x1 - .2, .3, tz + .45, 14, G);

    // flush: the lever dips and the bowl water swirls down and refills
    addAction(x1 - .55, tz, 1.6, () => 'nagasu', () => playAnim(2.2, k => {
      lever.rotation.z = k < .15 ? -k / .15 * .5 : k < .3 ? -.5 * (1 - (k - .15) / .15) : 0;
      bowlWater.rotation.y += .4; const d = k < .5 ? k / .5 : 1 - (k - .5) / .5; bowlWater.scale.set(1 - d * .6, 1, 1.25 * (1 - d * .6)); bowlWater.position.y = .475 - d * .04;
    }));
    // wash your hands: the tap runs for a moment
    addAction(sx2, sz2 - .05, 1.2, () => 'arau', () => playAnim(2.4, k => { stream.visible = k > .05 && k < .9; stream.scale.y = .9 + Math.sin(k * 60) * .1; }));
    restroom.x1 = x1; restroom.rz0 = z0; restroom.rz1 = z1;
  }
  // self-service water station in the far corner, a picture above it, wall lamps
  const wz = zb - .75;
  box(.5, .85, 1.0, darkWood, xb - .27, .58, wz, G);
  box(.55, .04, 1.05, std('#ffffff', { map: tex(T.grainTop, 1, 1) }), xb - .27, 1.02, wz, G);
  // the pitcher and one glass are their own objects so they can move when you pour
  const waterM = new THREE.MeshStandardMaterial({ color: '#BFE2F2', transparent: true, opacity: .6, roughness: .05 });
  { const pg = group(xb - .3, 1.04, wz - .3); G.add(pg);
    cyl(.09, .08, .3, glassM, 0, .15, 0, 14, pg, false);
    const pw = cyl(.08, .07, .2, waterM, 0, 0, 0, 14, pg, false); pw.geometry.translate(0, .1, 0); pw.position.y = .005;
    const lip = box(.05, .02, .06, glassM, 0, .29, .1, pg, false);
    dynAll(pg); water.pitcher = pg; water.pitcherWater = pw; water.home = pg.position.clone(); }
  for (let i = 1; i < 6; i++) cyl(.035, .03, .1, glassM, xb - .35 + (i % 2) * .1, 1.09, wz - .05 + Math.floor(i / 2) * .12, 10, G, false);
  { const gg = group(xb - .35, 1.04, wz - .05); G.add(gg);
    cyl(.035, .03, .1, glassM, 0, .05, 0, 10, gg, false);
    const gw = cyl(.03, .026, .08, waterM, 0, .005, 0, 10, gg, false); gw.geometry.translate(0, .04, 0); gw.scale.y = .001;
    const st = cyl(.007, .007, 1, waterM, 0, 0, 0, 8, G, false); st.visible = false; st.userData.noCollide = true;   // hidden at the origin (middle of the road) until you pour
    dynAll(gg); dynAll(st); water.glass = gg; water.glassWater = gw; water.stream = st; water.glassHome = gg.position.clone(); water.spot = new THREE.Vector3(xb - .32, 1.04, wz + .12); }
  addAction(xb - .3, wz, 1.5, () => 'sosogu', pourWater, () => !holding);
  box(.2, .06, .2, std('#F7F4EE'), xb - .3, 1.07, wz + .38, G, false);
  sign({ lines: [{ t: 'お水は', size: .3, color: '#3A2A22' }, { t: 'セルフサービス', size: .22, color: '#2F6FB8' }], top: .5, gap: .42, w: .55, h: .4, bg: '#FFF8EC', fg: '#3A2A22', frameColor: '#6E4F3E' }, xb - .06, 1.5, wz, -Math.PI / 2, hint.omizu);
  { const w = .6, h = .55, y = 2.35; box(.04, h + .08, w + .08, darkWood, xb - .02, y, wz, G, false); const pic = mesh(new THREE.PlaneGeometry(w, h), std('#ffffff', { map: pick(T.pictures) }), xb - .045, y, wz, G, false); pic.rotation.y = -Math.PI / 2; }
  const sconce = glowMat(null, null, 1.2, 2.2, { color: '#FFE2B0', emissive: 0xffc070 });
  for (const z of [za + 5.2, za + 7.05]) { box(.12, .2, .1, brass, xb - .06, 2.0, z, G, false); mesh(new THREE.SphereGeometry(.07, 10, 8), sconce, xb - .16, 2.1, z, G, false); }
  // armchair nook in the window corner: two armchairs, a low table, a floor lamp, on a round rug
  { const lx = fx + 2.5, lz = zb - 1.5;
    const rr = mesh(new THREE.CircleGeometry(1.3, 32), std('#ffffff', { map: T.rugRound, roughness: 1 }), lx, .165, lz, G, false); rr.rotation.x = -Math.PI / 2; rr.userData.noCollide = true;
    for (const sx of [-1, 1]) { const ax = lx + sx * .7, az = lz + .25; armchair(G, ax, az, Math.atan2(lx - ax, lz - .25 - az)); }   // both face the low table
    cyl(.35, .35, .04, wood, lx, .58, lz - .25, 20, G); cyl(.04, .04, .4, darkWood, lx, .38, lz - .25, 8, G); cyl(.2, .2, .03, darkWood, lx, .18, lz - .25, 14, G);
    cafeCup(G, lx - .1, .6, lz - .2, white); teapot(G, lx + .12, .6, lz - .3, std('#E8C0A0', { roughness: .3 }));
    box(.18, .04, .26, std('#3A5A7A'), lx, .62, lz - .05, G, false);
    const fl2 = group(lx, .16, lz + .85); G.add(fl2);                 // lamp tucked between the armchairs
    cyl(.15, .17, .03, brass, 0, .015, 0, 14, fl2); cyl(.015, .015, 1.5, brass, 0, .76, 0, 6, fl2, false);
    mesh(new THREE.CylinderGeometry(.13, .2, .26, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#F4E2C4', side: THREE.DoubleSide, emissive: 0xffc070, emissiveIntensity: .3 }), 0, 1.55, 0, fl2, false);
  }

  // ---------- warm light inside
  for (const [x, z] of [[5.0, za + 2.5], [2.5, zb - 2.3], [5.2, zb - 2.3], [4.0, za + 5.2]]) { const l = new THREE.PointLight(0xffc890, 4, 10, 1.3); l.position.set(fx + x, H - .5, z); scene.add(l); cafeLights.push(l); }
  claim(1, 'wall', dz - DW - .4, dz + DW + .4);

}
const cafeLights = [];

