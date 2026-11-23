// ---------------------------------------------------------------- build the school
function buildSchool() {
  const T = schoolTex();
  const { z0, z1, fx, part, back, FL, H } = SCH;
  const G = new THREE.Group(); scene.add(G);
  const rep = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.repeat.set(rx, ry); return c; };
  const M = (m, w, h) => typeof m === 'function' ? m(w, h) : m;
  // a floor (or ceiling) plane over x from xa to xb and z from za to zb, the texture repeating every `tile` meters
  const floor = (tex, xa, xb, za, zb, y, tile, extra = {}, down = false) => {
    const m = mesh(new THREE.PlaneGeometry(xb - xa, zb - za), std('#ffffff', { map: rep(tex, (xb - xa) / tile, (zb - za) / tile), ...extra }), (xa + xb) / 2, y, (za + zb) / 2, G, false);
    m.rotation.x = down ? Math.PI / 2 : -Math.PI / 2; m.userData.noCollide = true; return m;
  };
  // walls with holes for doors and windows. holes: [from, to, bottom, top]. mPos/mNeg: the faces toward +x/-x (or +z/-z)
  const wallZ = (x, za, zb, holes, mPos, mNeg, t = .2, y0 = 0, y1 = H) => {
    const pc = (a, b, ya, yb) => { if (b - a < .01 || yb - ya < .01) return; const side = M(mNeg, b - a, yb - ya); box(t, yb - ya, b - a, [M(mPos, b - a, yb - ya), side, side, side, side, side], x, (ya + yb) / 2, (a + b) / 2, G); };
    let a = za;
    for (const [ha, hb, hy0, hy1] of holes.slice().sort((p, q) => p[0] - q[0])) { pc(a, ha, y0, y1); pc(ha, hb, y0, hy0); pc(ha, hb, hy1, y1); a = hb; }
    pc(a, zb, y0, y1);
  };
  const wallX = (z, xa, xb, holes, mPos, mNeg, t = .2, y0 = 0, y1 = H) => {
    const pc = (a, b, ya, yb) => { if (b - a < .01 || yb - ya < .01) return; const side = M(mNeg, b - a, yb - ya); box(b - a, yb - ya, t, [side, side, side, side, M(mPos, b - a, yb - ya), side], (a + b) / 2, (ya + yb) / 2, z, G); };
    let a = xa;
    for (const [ha, hb, hy0, hy1] of holes.slice().sort((p, q) => p[0] - q[0])) { pc(a, ha, y0, y1); pc(ha, hb, y0, hy0); pc(ha, hb, hy1, y1); a = hb; }
    pc(a, xb, y0, y1);
  };
  const outside = (w, h) => wallMat('tile', '#F1ECE3', w, h);
  const plaster = std('#EFE9DC', { roughness: .92 }), plasterLow = std('#E4DCCB', { roughness: .9 });
  const wood = std('#B07A4A', { roughness: .6 }), darkWood = std('#7A4E2E', { roughness: .6 });
  const alu = std('#B8BDC3', { roughness: .4, metalness: .5 });
  const glassM = new THREE.MeshStandardMaterial({ color: '#DDEBF2', transparent: true, opacity: .14, roughness: .05, depthWrite: false });
  const steel = std('#8E959C', { roughness: .45, metalness: .5 });

  // an aluminum sliding window filling a hole in a wall that runs along z
  const windowZ = (x, za, zb, ya, yb, panes = 2) => {
    const w = zb - za;
    for (const zz of [za + .03, zb - .03]) box(.12, yb - ya, .06, alu, x, (ya + yb) / 2, zz, G, false);
    for (const yy of [ya + .03, yb - .03]) box(.12, .06, w, alu, x, yy, (za + zb) / 2, G, false);
    for (let i = 0; i < panes; i++) {
      const a = za + w * i / panes, b = za + w * (i + 1) / panes, off = i % 2 ? .025 : -.025;
      box(.02, yb - ya - .08, b - a + .02, glassM, x + off, (ya + yb) / 2, (a + b) / 2, G, false);
      for (const zz of [a + .025, b - .025]) box(.04, yb - ya - .06, .04, alu, x + off, (ya + yb) / 2, zz, G, false);
      for (const yy of [ya + .06, yb - .06]) box(.04, .04, b - a, alu, x + off, yy, (a + b) / 2, G, false);
    }
    box(.3, .035, w + .06, alu, x, ya - .005, (za + zb) / 2, G, false);
  };
  // a ceiling light: a white box with a glowing diffuser
  const fluo = glowMat(null, null, 1.1, 1.7, { color: '#F6F9FF', emissive: 0xf2f6ff });
  const lamp = (x, z, alongX) => {
    box(alongX ? 1.3 : .24, .05, alongX ? .24 : 1.3, std('#E9E9E6'), x, H - .03, z, G, false);
    box(alongX ? 1.2 : .14, .03, alongX ? .14 : 1.2, fluo, x, H - .065, z, G, false);
  };
  const light = (x, z, i = 1) => { const l = new THREE.PointLight(0xf4f6ff, 3.5 * i, 11, 1.3); l.position.set(x, H - .45, z); scene.add(l); schoolLights.push(l); l.userData.k = i; };
  // a classroom sliding door. The panel runs on the hallway side of the wall and slides along z toward `dir`.
  const doorFace = std('#ffffff', { map: T.door, roughness: .6 }), doorEdge = std('#7A4E2E');
  const slidingDoor = (za, zb, dir, open, interactive = true) => {
    const x = part, w = zb - za, h = 2.2, zc = (za + zb) / 2;
    // casing around the opening
    // the casing overlaps the opening's edges a little, so no face shares a plane with the wall (that flickers dark)
    box(.26, .08, w + .1, darkWood, x, FL + h - .03, zc, G);
    for (const zz of [za + .025, zb - .025]) box(.26, h, .07, darkWood, x, FL + h / 2, zz, G);
    box(.2, .012, w, metal('#9AA0A8'), x - .1, FL + .006, zc, G, false).userData.noCollide = true;   // the floor track: you walk over it
    const p = group(x - .19, FL, zc);
    box(.045, h - .02, w + .04, [doorFace, doorFace, doorEdge, doorEdge, doorEdge, doorEdge], 0, h / 2, 0, p);
    if (!interactive) return;
    p.traverse(o => { if (o.isMesh) o.userData.noCollide = true; }); dynAll(p);
    const d = { g: p, x, z0: za, z1: zb, home: zc, dir, slide: w - .02, open, target: open };
    slideDoors.push(d);
    addAction(x, zc, 1.7, () => d.target ? 'shimeru' : 'akeru', () => { d.target = 1 - d.target; });
  };
  const plate = (text, z, info) => {      // classroom name plate sticking out over the hallway, readable from both ways
    box(.56, .04, .04, metal('#9AA0A8'), part - .35, FL + 2.66, z, G, false);
    sign({ lines: [{ t: text, size: .5, color: '#1D2B4A' }], w: .9, h: .24, bg: '#FFFFFF', fg: '#1D2B4A', stripe: '#7DB83A', double: true, frameColor: '#C9CDD2' }, part - .55, FL + 2.5, z, 0, info, G);
  };

  // ================= the street wall: brick with stone coping, gate posts with lamps, the gate rolled open
  const wx = -6.15;
  const brick = (w, h) => wallMat('brick', '#A65A40', w, h), cap = std('#D9D2C4', { roughness: .7 });
  for (const [a, b] of [[4.05, 12.5], [17.5, 25.95]]) { box(.3, 1.25, b - a, brick(b - a, 1.25), wx, .15 + .625, (a + b) / 2, G); box(.38, .08, b - a, cap, wx, 1.44, (a + b) / 2, G); }
  const iron = metal('#2E3036');
  for (const pz of [12.85, 17.15]) {
    box(.7, 2.1, .7, brick(.7, 2.1), wx, .15 + 1.05, pz, G);
    box(.84, .12, .84, cap, wx, 2.31, pz, G); box(.7, .08, .7, cap, wx, 2.41, pz, G);
    box(.08, .12, .08, iron, wx, 2.5, pz, G, false);
    box(.3, .34, .3, glowMat(null, null, .35, 2.4, { color: '#FFF6E2', emissive: 0xffe2b0 }), wx, 2.73, pz, G, false);
    for (const [dx, dz] of [[-.16, -.16], [.16, -.16], [-.16, .16], [.16, .16]]) box(.03, .38, .03, iron, wx + dx, 2.73, pz + dz, G, false);
    const roof = mesh(new THREE.ConeGeometry(.3, .2, 4), iron, wx, 3.0, pz, G, false); roof.rotation.y = Math.PI / 4;
    lampPositions.push(new THREE.Vector3(wx + .5, 2.7, pz));
  }
  sign({ text: 'みなと日本語学校', vertical: true, w: .3, h: 1.4, bg: '#3A3833', fg: '#E8D9A8', frameColor: '#8A7A55', font: '"Klee One"' }, wx + .37, 1.2, 17.15, Math.PI / 2, hint.school, G);
  sign({ lines: [{ t: '生徒', size: .3, color: '#1D2B4A' }, { t: '募集中', size: .3, color: '#D8433F' }], w: .8, h: .95, bg: '#FFF8EC', fg: '#1D2B4A', stripe: '#F4A9BE', frameColor: '#FFFFFF' }, wx + .17, .82, 21.2, Math.PI / 2, hint.boshu, G);
  box(.06, .02, 3.6, metal('#7E858E'), wx, .155, 15, G, false);                                  // the gate's rail across the opening
  { const gx = -6.62, ga = 17.6, gb = 21.3, gm = metal('#5E3B3F');                                // the sliding iron gate, pushed open
    for (const y of [.32, 1.42]) box(.06, .07, gb - ga, gm, gx, y, (ga + gb) / 2, G);
    for (let z = ga + .06; z < gb; z += .13) box(.035, 1.1, .035, gm, gx, .87, z, G, false);
    for (const z of [ga + .25, gb - .25]) mesh(new THREE.TorusGeometry(.09, .03, 6, 14), std('#2B2B33'), gx, .24, z, G, false).rotation.y = Math.PI / 2;
  }

  // ================= the front yard: pavers, two lawns with sakura, low hedges, benches, a notice board
  floor(T.paving, -15, -6.0, 4.05, 25.95, .153, 2);
  const lawn = (xa, xb, za, zb) => {
    floor(T.lawn, xa, xb, za, zb, .168, 2, { roughness: 1 });
    const curb = std('#CFC8BA', { roughness: .8 });
    for (const zz of [za - .06, zb + .06]) box(xb - xa + .24, .12, .12, curb, (xa + xb) / 2, .21, zz, G, false);
    for (const xx of [xa - .06, xb + .06]) box(.12, .12, zb - za, curb, xx, .21, (za + zb) / 2, G, false);
  };
  lawn(-13.8, -7.2, 4.6, 11.3); lawn(-13.8, -7.2, 18.7, 25.4);
  const lowHedge = (xa, xb, z) => {
    box(xb - xa, .48, .4, std('#2E5A2C'), (xa + xb) / 2, .4, z, G);
    for (let x = xa + .22; x < xb - .1; x += .42) foliage(G, x, .64 + range(-.03, .03), z + range(-.04, .04), .3, .22, .28, pick(['green', 'dark']), 12, .26);
  };
  lowHedge(-13.6, -7.5, 10.95); lowHedge(-13.6, -7.5, 19.05);
  streetTree(-10.4, 7.4, 'sakura', 1.25);
  streetTree(-10.6, 22.5, 'sakura', 1.15);
  for (let i = 0; i < 90; i++) { const p = mesh(new THREE.CircleGeometry(.05, 5), std('#F9C2D1'), range(-14.5, -6.5), .175, range(4.5, 25.5), G, false); p.rotation.x = -Math.PI / 2; }
  // benches: wooden slats on black iron frames, facing the path
  const bench = (x, z, ry) => {
    const g = group(x, .153, z, ry), slat = std('#A0714A', { roughness: .6 });
    for (let i = 0; i < 4; i++) box(1.5, .035, .09, slat, 0, .44, -.15 + i * .1, g);
    for (let i = 0; i < 3; i++) box(1.5, .09, .03, slat, 0, .6 + i * .12, -.25 - i * .02, g).rotation.x = -.16;
    for (const sx of [-.66, .66]) { box(.05, .44, .05, iron, sx, .22, .17, g); box(.05, .86, .05, iron, sx, .43, -.24, g); box(.05, .05, .46, iron, sx, .41, -.03, g); box(.05, .04, .4, iron, sx, .66, .0, g); }
    addSeat(x, z, ry, 1.15);
  };
  bench(-8.5, 11.75, 0); bench(-11.0, 11.75, 0); bench(-8.6, 18.25, Math.PI); bench(-11.1, 18.25, Math.PI);
  // notice board on two posts, under a little roof, by the lawn
  { const nx = -13.0, nz = 11.62;
    for (const dx of [-.78, .78]) box(.07, 1.9, .07, metal('#4A5058'), nx + dx, .153 + .95, nz, G);
    box(1.7, 1.05, .1, metal('#4A5058'), nx, 1.4, nz, G);
    sign({ tex: T.felt(1.5, .9, ['お知らせ', '図書室', '遠足']), w: 1.5, h: .9, frame: false, day: .15, night: .3 }, nx, 1.4, nz + .055, 0, hint.oshirase, G);
    box(1.52, .92, .01, glassM, nx, 1.4, nz + .075, G, false);
    box(1.85, .05, .3, metal('#3A3F47'), nx, 2.0, nz + .02, G).rotation.x = -.12;
    sign({ lines: [{ t: 'お知らせ', size: .6, color: '#FFFFFF' }], w: .7, h: .2, bg: '#1D2B4A', fg: '#FFF', frame: false }, nx, 1.84, nz + .06, 0, hint.oshirase, G);
  }
  // flower planters under the ground-floor windows
  const planter = (za, zb) => {
    box(.55, .42, zb - za, brick(zb - za, .42), -14.62, .153 + .21, (za + zb) / 2, G);
    box(.45, .02, zb - za - .1, std('#4A3A2E'), -14.62, .58, (za + zb) / 2, G, false);
    for (let z = za + .3; z < zb - .2; z += .5) foliage(G, -14.62, .72, z, .24, .16, .26, 'dark', 9, .22);
  };
  planter(17.9, 25.6); planter(8.0, 12.3);
  // umbrella stand under the canopy
  { const ux = -14.55, uz = 13.25;
    box(.36, .05, .5, steel, ux, .55, uz, G); box(.36, .05, .5, steel, ux, .2, uz, G);
    for (const [dx, dz] of [[-.16, -.23], [.16, -.23], [-.16, .23], [.16, .23]]) box(.03, .6, .03, steel, ux + dx, .45, uz + dz, G, false);
    for (const [dz, c] of [[-.12, '#2F6FB8'], [.02, '#3A3A40'], [.15, '#F4A9BE']]) { cyl(.012, .012, .8, metal('#7E858E'), ux, .58, uz + dz, 5, G, false); cyl(.035, .06, .55, std(c), ux, .62, uz + dz, 8, G, false); }
    sign({ lines: [{ t: '傘立て', size: .55, color: '#1D2B4A' }], w: .34, h: .12, bg: '#FFFFFF', fg: '#1D2B4A', frame: false }, ux + .19, .5, uz, Math.PI / 2, hint.kasa, G);
  }

  // ================= the building: upper floors from the street builder, the ground floor built by hand
  const B = building(-1, 26, 4, { h: 11.2, wall: '#F1ECE3', style: 'tile', floors: 2, cols: 6, ac: 0, lit: .7, ground: 'entrance', groundH: H, setback: 9, depth: 13, roof: true, interior: true, posters: false });
  // front wall (x = -15): stair window, teachers' room windows (blinds down), the entrance, three classroom windows
  const winLo = FL + .85, winHi = 2.95;
  const classWins = [[17.85, 20.35], [20.55, 23.05], [23.25, 25.55]];
  wallZ(fx - .1, z0 - .2, z1 + .2, [[4.6, 7.2, 2.25, 3.12], [8.0, 12.2, winLo, winHi], [13.4, 16.6, 0, 2.9], ...classWins.map(([a, b]) => [a, b, winLo, winHi])], outside, plaster);
  box(.06, .34, z1 - z0 + .4, std('#A39E95'), fx + .03, .17, 15, G, false);                       // dark plinth along the bottom
  windowZ(fx - .1, 4.6, 7.2, 2.25, 3.12); windowZ(fx - .1, 8.0, 12.2, winLo, winHi, 3);
  for (const [a, b] of classWins) windowZ(fx - .1, a, b, winLo, winHi);
  { const bl = mesh(new THREE.PlaneGeometry(4.15, winHi - winLo - .1), std('#ffffff', { map: rep(T.blinds, 1, (winHi - winLo) / .4), side: THREE.DoubleSide }), fx - .3, (winLo + winHi) / 2, 10.1, G, false); bl.rotation.y = Math.PI / 2; }
  // the entrance: fixed glass on both sides, the two doors slid open behind them, a transom above
  for (const [a, b] of [[13.4, 14.2], [15.8, 16.6]]) {
    for (const off of [0, -.07]) { box(.025, 2.5, b - a - .06, glassM, fx - .07 + off, .16 + 1.25, (a + b) / 2, G, false); for (const zz of [a + .03, b - .03]) box(.05, 2.55, .05, alu, fx - .07 + off, .16 + 1.27, zz, G, false); for (const yy of [.2, 2.66]) box(.05, .07, b - a, alu, fx - .07 + off, yy, (a + b) / 2, G, false); }
  }
  box(.1, .08, 3.2, alu, fx - .1, 2.72, 15, G, false); box(.02, .16, 3.1, glassM, fx - .1, 2.82, 15, G, false);
  { const mat = mesh(new THREE.PlaneGeometry(1.4, 1.6), std('#4A4E56', { roughness: 1 }), fx - .95, .165, 15, G, false); mat.rotation.x = -Math.PI / 2; }
  // canopy over the entrance with the school's name, and the school clock above it
  box(2.0, .4, 4.2, std('#F4F2EC'), fx + 1.0, 3.1, 15, G);
  box(1.9, .02, 4.1, std('#DCD8CF'), fx + 1.0, 2.89, 15, G, false);
  for (const dz of [-1.95, 1.95]) cyl(.07, .07, 2.75, metal('#B5B9C0'), fx + 1.85, .153 + 1.375, 15 + dz, 10, G);
  sign({ lines: [{ t: 'みなと日本語学校', size: .62 }], w: 3.6, h: .34, bg: '#1D2B4A', fg: '#FFFFFF', frame: false }, fx + 2.01, 3.1, 15, Math.PI / 2, hint.school, G);
  { const ck = mesh(new THREE.CircleGeometry(.48, 40), std('#ffffff', { map: T.clock }), fx + .09, 4.75, 15, G, false); ck.rotation.y = Math.PI / 2;
    ck.userData.info = hint.tokei; tappables.push(ck); dynamic.add(ck);
    const rim = cyl(.53, .53, .08, metal('#C9CDD2'), fx + .04, 4.75, 15, 32, G, false); rim.rotation.z = Math.PI / 2; }
  // side walls of the ground floor, and the back wall with the hallway windows
  wallX(z0 - .1, back - .25, fx, [], plaster, outside); wallX(z1 + .1, back - .25, fx, [], outside, plaster);
  const hallWins = [[4.9, 7.7], [8.1, 10.9], [11.3, 14.1], [14.5, 17.3], [17.7, 20.5], [20.9, 23.7]];
  wallZ(back - .125, z0, z1, hallWins.map(([a, b]) => [a, b, FL + .9, 2.8]), plaster, outside, .25);
  for (const [a, b] of hallWins) windowZ(back - .125, a, b, FL + .9, 2.8);
  // inside walls: the hallway wall (x = -24.5) with the doors, and the walls between the rooms
  const dB = [18.1, 19.4], dF = [24.0, 25.3], dT = [10.65, 11.95];        // back and front classroom doors, teachers' room door
  wallZ(part, 7.6, 12.5, [[dT[0], dT[1], 0, FL + 2.2]], plaster, plaster, .14);
  wallZ(part, 17.5, z1, [[dB[0], dB[1], 0, FL + 2.2], [dF[0], dF[1], 0, FL + 2.2]], plaster, plaster, .14);
  wallX(17.5, part + .07, fx - .2, [], plaster, plaster, .14);
  wallX(12.5, part + .07, fx - .2, [[-21.85, -20.15, 1.0, 2.1]], plaster, plaster, .14);
  wallX(7.6, part + .07, fx - .2, [], plaster, plaster, .14);
  // floors and one ceiling over the whole ground floor
  floor(T.terrazzo, SCH.step, fx - .2, 12.57, 17.43, .16, 1.2, { roughness: .35 });
  floor(T.lino, back, part - .07, z0, z1, FL, 2, { roughness: .34, metalness: .04 });
  floor(T.lino, part - .07, SCH.step, 12.57, 17.43, FL, 2, { roughness: .34, metalness: .04 });
  floor(T.lino, part + .07, fx - .2, z0, 7.53, FL, 2, { roughness: .34, metalness: .04 });
  floor(T.parquet, part + .07, fx - .2, 17.57, z1, FL, 1.2, { roughness: .4 });
  floor(T.ceiling, back, fx - .2, z0, z1, H - .005, 1.2, {}, true);
  // hallway trim: baseboards and a wooden rail at hand height
  for (const [x, a, b] of [[back + .015, z0, z1], [part - .085, 7.6, dT[0]], [part - .085, dT[1], 12.5], [part - .085, 17.5, dB[0]], [part - .085, dB[1], dF[0]]]) {
    box(.03, .1, b - a, std('#5E6B66'), x, FL + .05, (a + b) / 2, G, false);
    box(.04, .06, b - a, wood, x + (x < -26 ? .01 : -.01), FL + .88, (a + b) / 2, G, false);
  }

  // ================= 昇降口: the entrance. Step out of your shoes here, then up onto the hallway floor.
  // the step up (上がり框) with a wooden edge, and a slatted duckboard (すのこ) in front of it
  { const s = box(.08, FL - .16, 4.86, wood, SCH.step + .02, (FL + .16) / 2, 15, G, false); s.userData.noCollide = true;
    const e = box(.12, .04, 4.86, darkWood, SCH.step - .02, FL - .015, 15, G, false); e.userData.noCollide = true;
    for (let i = 0; i < 6; i++) { const sl = box(.1, .03, 3.4, std('#C9A57A', { roughness: .7 }), SCH.step + .25 + i * .15, .2, 15, G, false); sl.userData.noCollide = true; }
    for (const z of [13.5, 16.5]) { const r = box(.95, .03, .06, std('#8A6A45'), SCH.step + .62, .175, z, G, false); r.userData.noCollide = true; } }
  // shoe lockers along both walls and a double-sided island in the middle
  const getabako = (xa, xb, z, faces) => {   // faces: 1 = front toward +z, -1 = toward -z, 0 = both (island)
    const len = xb - xa, d = faces ? .38 : .76, h = 1.85, zc = z + faces * d / 2;
    const front = std('#ffffff', { map: rep(T.getabako, len, 1), roughness: .7 }), side = std('#B9874F', { roughness: .6 });
    const b = box(len, h, d, [side, side, side, side, faces >= 0 ? front : side, faces <= 0 ? front : side], (xa + xb) / 2, .16 + h / 2, zc, G);
    b.userData.info = hint.getabako; tappables.push(b); dynamic.add(b);
    box(len + .04, .03, d + .04, std('#9A6A3E'), (xa + xb) / 2, .16 + h + .015, zc, G, false);
  };
  getabako(-19.9, -15.6, 12.57, 1); getabako(-21.7, -15.6, 17.43, -1); getabako(-20.4, -17.3, 15, 0);
  sign({ lines: [{ t: '上履きに', size: .3, color: '#1D2B4A' }, { t: 'はきかえてください', size: .2, color: '#C0392B' }], top: .44, gap: .36, w: .7, h: .5, bg: '#FFFFFF', fg: '#1D2B4A', stripe: '#7DB83A', frameColor: '#C9CDD2' }, -17.25, 1.45, 15, Math.PI / 2, hint.uwabaki, G);
  sign({ lines: [{ t: '土足禁止', size: .55, color: '#FFFFFF' }], w: .8, h: .26, bg: '#D8433F', fg: '#FFF', frame: false }, -23.2, FL + 1.55, 17.42, Math.PI, hint.dosoku, G);
  // the reception window into the teachers' room: frosted sliding glass, a ledge with a bell and a visitor book
  { const rz = 12.5, frost = std('#E3ECEF', { transparent: true, opacity: .82, roughness: .3 });
    for (const [a, b] of [[-21.85, -21.0], [-21.05, -20.15]]) { const p = box(b - a, 1.02, .02, frost, (a + b) / 2, 1.55, rz + (a < -21.5 ? .01 : -.01), G, false); if (a > -21.5) { SCH.pane = p; dynamic.add(p); p.userData.noCollide = true; } }   // the right pane slides open (367-tanaka-3d.js)
    for (const x of [-21.85, -21.0, -20.15]) box(.04, 1.1, .08, alu, x, 1.55, rz, G, false);
    box(1.76, .04, .4, wood, -21.0, 1.0, rz + .2, G);
    box(.22, .03, .3, std('#2E3550'), -21.4, 1.035, rz + .22, G, false);
    mesh(new THREE.SphereGeometry(.05, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), metal('#C9A45A'), -20.6, 1.02, rz + .22, G, false);
    sign({ lines: [{ t: '受付', size: .6, color: '#FFFFFF' }], w: .6, h: .25, bg: '#1D2B4A', fg: '#FFF', frame: false }, -21.0, 2.35, rz + .08, 0, hint.uketsuke, G);
  }
  // a welcome banner hanging over the step
  sign({ lines: [{ t: 'ようこそ', size: .6, color: '#FFFFFF' }], w: 1.6, h: .38, bg: '#F08FAA', fg: '#FFF', frameColor: '#FFFFFF' }, SCH.step + .3, 2.75, 15, Math.PI / 2, hint.yokoso, G);
  for (const dz of [-.7, .7]) cyl(.004, .004, .35, metal('#777'), SCH.step + .3, 3.1, 15 + dz, 4, G, false);
  lamp(-17.4, 15, false); lamp(-20.6, 15, false);
  light(-18.8, 15, .8);

  // ================= 職員室: the teachers' room (closed for now)
  slidingDoor(dT[0], dT[1], -1, 0, false);
  plate('職員室', 11.3, hint.shokuin);

  // ================= the stairs to the second floor (roped off): two flights around a landing
  { const tread = std('#ffffff', { map: rep(T.lino, .5, .5), roughness: .3 }), riser = std('#E9E4D6'), nose = std('#5E6B66');
    const R = .17, D = .28, xA = -21.0, yL = FL + R * 10;
    for (let i = 0; i < 10; i++) {                                     // flight A: up toward the front wall
      const x = xA + i * D + D / 2, top = FL + R * (i + 1);
      box(D, top - FL, 1.55, [riser, riser, tread, riser, riser, riser], x, (FL + top) / 2, 5.02, G);
      box(.03, .025, 1.55, nose, x - D / 2 + .015, top - .012, 5.02, G, false);
    }
    box(-15.2 - (xA + 10 * D), yL - FL, 3.3, [riser, riser, tread, riser, riser, riser], (xA + 10 * D - 15.2) / 2, (FL + yL) / 2, 5.88, G);   // landing
    for (let i = 0; i < 7; i++) {                                      // flight B: back toward the hallway, up through the ceiling
      const x = xA + 10 * D - i * D - D / 2, top = yL + R * (i + 1);
      box(D, R, 1.5, [riser, riser, tread, riser, riser, riser], x, top - R / 2, 6.75, G);
      box(.03, .025, 1.5, nose, x + D / 2 - .015, top - .012, 6.75, G, false);
    }
    { const run = 7 * D, rise = 7 * R, L = Math.hypot(run, rise), ang = Math.atan2(rise, run);
      const sl = box(L, .14, 1.5, riser, xA + 10 * D - run / 2, yL + rise / 2 - .2, 6.75, G); sl.rotation.z = -ang; }
    // a low wall between the flights with a wooden rail, and rails on the walls
    for (let i = 0; i < 10; i++) { const x = xA + i * D + D / 2, top = FL + R * (i + 1); box(D, .9, .1, plaster, x, top + .45, 5.86, G); }
    const railA = Math.hypot(10 * D, 10 * R), angA = Math.atan2(10 * R, 10 * D);
    for (const z of [5.86, z0 + .06]) { const r = box(railA, .05, z === 5.86 ? .14 : .06, wood, xA + 5 * D, FL + 5 * R + .9, z, G, false); r.rotation.z = angA; }
    // a rope across the bottom of the stairs: 立入禁止 (no entry)
    for (const z of [4.45, 5.65]) { cyl(.025, .025, .9, metal('#C9A45A'), xA - .35, FL + .45, z, 8, G); cyl(.12, .14, .04, metal('#C9A45A'), xA - .35, FL + .02, z, 12, G); }
    { const rope = cyl(.015, .015, 1.2, std('#C0392B'), xA - .35, FL + .82, 5.05, 6, G, false); rope.rotation.x = Math.PI / 2; }
    sign({ lines: [{ t: '立入禁止', size: .55, color: '#FFFFFF' }], w: .62, h: .22, bg: '#D8433F', fg: '#FFF', frame: false, double: true }, xA - .36, FL + .65, 5.05, -Math.PI / 2, hint.tachiiri, G);
    lamp(-19.5, 5.9, true);
  }

  // ================= 廊下: the hallway along the back
  for (let z = 6; z < 25; z += 3.2) lamp(-26.15, z, false);
  light(-25.4, 7.2); light(-26.15, 20);
  // notice board between the classroom doors (clear of where the open doors slide), with two posters you can read
  { const bz = 21.7, bx = part - .085;
    sign({ tex: T.felt(1.9, 1.1, ['図書室'], .4), w: 1.9, h: 1.1, frameColor: '#8A5A36', day: .12, night: .25 }, bx - .02, FL + 1.55, bz, -Math.PI / 2, hint.oshirase, G);
    sign({ tex: T.rouka, w: .46, h: .62, frame: false, day: .15, night: .3 }, bx - .07, FL + 1.55, 21.78, -Math.PI / 2 + .02, hint.rouka, G);
    sign({ tex: T.speech, w: .46, h: .62, frame: false, day: .15, night: .3 }, bx - .07, FL + 1.55, 22.3, -Math.PI / 2 - .02, hint.speech, G);
  }
  // fire extinguisher and the emergency exit sign at the end of the hallway
  { const ex = back + .25, ez = 24.3, red = std('#D8433F', { roughness: .35 });
    cyl(.09, .09, .5, red, ex, FL + .3, ez, 14, G); cyl(.03, .03, .08, metal('#2B2B33'), ex, FL + .59, ez, 8, G, false);
    box(.1, .03, .05, metal('#2B2B33'), ex + .05, FL + .64, ez, G, false); cyl(.012, .012, .3, std('#2B2B33'), ex + .1, FL + .45, ez + .05, 5, G, false);
    sign({ lines: [{ t: '消火器', size: .55, color: '#FFFFFF' }], w: .5, h: .2, bg: '#D8433F', fg: '#FFF', frame: false }, back + .02, FL + 1.05, ez, Math.PI / 2, hint.shokaki, G);
    sign({ tex: T.hijo, w: .9, h: .32, frameColor: '#E9E9E6', day: .8, night: 1.6 }, -26.15, FL + 2.45, z1 - .03, Math.PI, hint.hijo, G);
  }

  // ================= 初級クラス: the classroom
  slidingDoor(dB[0], dB[1], 1, 1); slidingDoor(dF[0], dF[1], -1, 0);
  plate('初級クラス', 18.75, hint.shokyu); plate('初級クラス', 24.65, hint.shokyu);
  const BZ = z1;                                                         // the board wall
  // windows: curtains tied back at every frame, a rail along the top
  { const cm = std('#ffffff', { map: T.curtain, roughness: .95 });
    const rail = cyl(.015, .015, z1 - 17.6, metal('#C9CDD2'), fx - .32, winHi + .12, (17.6 + z1) / 2, 6, G, false); rail.rotation.x = Math.PI / 2;
    for (const z of [17.95, 20.45, 22.95, 25.45]) {
      const c = box(.1, winHi + .1 - (FL + .5), .34, cm, fx - .3, (winHi + .1 + FL + .5) / 2, z, G); c.userData.noCollide = true;
      box(.12, .04, .38, std('#C9B48A'), fx - .3, FL + 1.25, z, G, false);
    }
  }
  // the blackboard: three panels, a chalk tray with chalk and an eraser
  [[T.boardL, hint.kudasai], [T.boardC, hint.hotice], [T.boardR, hint.sakura]].forEach(([tex, info], i) =>
    sign({ tex, w: 2.1, h: 1.2, frameColor: '#A9ADB2', day: .1, night: .18 }, -17.65 - i * 2.1, FL + 1.62, BZ - .04, Math.PI, info, G));
  box(6.4, .04, .1, alu, -19.75, FL + 1.0, BZ - .1, G, false);
  for (const [dx, c] of [[-1.2, '#FFFFFF'], [-1.1, '#F6E27A'], [-.95, '#F7B3C6'], [.6, '#FFFFFF']]) { const ch = cyl(.007, .007, .08, std(c), -19.75 + dx, FL + 1.03, BZ - .1, 6, G, false); ch.rotation.z = Math.PI / 2; }
  box(.14, .05, .06, std('#3A4A6A'), -19.75 + 1.4, FL + 1.045, BZ - .1, G, false);
  // clock above the board, a speaker, a TV in the window corner
  { const ck = mesh(new THREE.CircleGeometry(.2, 32), std('#ffffff', { map: T.clock }), -19.75, FL + 2.58, BZ - .045, G, false); ck.rotation.y = Math.PI;
    ck.userData.info = hint.tokei; tappables.push(ck); dynamic.add(ck);
    const rim = cyl(.22, .22, .04, metal('#C9CDD2'), -19.75, FL + 2.58, BZ - .02, 24, G, false); rim.rotation.x = Math.PI / 2; }
  box(.34, .24, .1, std('#EDEAE3'), -23.6, FL + 2.6, BZ - .06, G, false);
  { const tv = group(-15.85, FL + 2.35, 25.15, -2.35);
    box(1.0, .6, .06, std('#1E2026', { roughness: .3 }), 0, 0, 0, tv); box(.92, .52, .01, std('#2A303A', { roughness: .1, metalness: .3 }), 0, 0, .035, tv, false);
    box(.06, .06, .3, metal('#7E858E'), 0, .1, -.18, tv, false); }
  // the teacher's platform (教壇) and desk (教卓) with a register, a chalk box and flowers
  { const pl = box(6.9, .2, 1.3, std('#8A5A36', { roughness: .5 }), -19.75, FL + .1, BZ - .65, G); pl.userData.noCollide = true;
    const tz = BZ - .95, ty = FL + .2;
    box(.95, .9, .55, std('#B08A5E', { roughness: .5 }), -19.75, ty + .45, tz, G);
    box(1.0, .04, .6, std('#D9C3A0', { roughness: .45 }), -19.75, ty + .92, tz, G, false);
    box(.24, .03, .32, std('#1E2A44'), -19.95, ty + .955, tz, G, false);
    box(.12, .06, .08, std('#F4F2EC'), -19.55, ty + .97, tz - .1, G, false);
    cyl(.05, .04, .16, std('#9FC3D9', { roughness: .1, transparent: true, opacity: .6 }), -19.35, ty + 1.02, tz + .1, 10, G, false);
    foliage(G, -19.35, ty + 1.18, tz + .1, .1, .1, .1, 'sakura', 10, .12);
  }
  // 12 desks in three rows facing the board, with wide aisles to walk around; every chair can be sat on
  const deskTop = std('#DCC7A4', { roughness: .5 }), seatWood = std('#C9A57A', { roughness: .55 });
  const desk = (x, z) => {
    box(.64, .03, .46, deskTop, x, FL + .71, z, G);
    box(.58, .1, .4, steel, x, FL + .64, z + .01, G);
    for (const sx of [-.28, .28]) for (const sz of [-.19, .19]) box(.025, .62, .025, steel, x + sx, FL + .31, z + sz, G);
    for (const sx of [-.28, .28]) box(.02, .02, .38, steel, x + sx, FL + .12, z, G, false);
    const t = rand();
    if (t < .45) box(.21, .015, .28, std(pick(['#D8433F', '#2F6FB8', '#3C9D5D', '#F2C230', '#F4F2EC'])), x + range(-.12, .12), FL + .733, z + range(-.06, .04), G, false);
    else if (t < .65) { box(.36, .01, .26, std('#F7F5EE'), x - .08, FL + .73, z - .04, G, false); const pc = cyl(.008, .008, .16, std('#F2C230'), x + .14, FL + .735, z - .02, 6, G, false); pc.rotation.z = Math.PI / 2; }
    if (rand() < .35) box(.08, .3, .32, std(pick(['#2E3550', '#3A3A40', '#6B4A32', '#C0392B'])), x + (rand() < .5 ? -.35 : .35), FL + .48, z, G, false);   // a bag on the desk's hook
  };
  const chair = (x, z) => {                                              // faces +z, toward the board
    const c = group(x, FL, z);
    box(.4, .025, .38, seatWood, 0, .42, 0, c);
    box(.38, .2, .02, seatWood, 0, .72, -.2, c);
    for (const sx of [-.18, .18]) { box(.022, .42, .022, steel, sx, .21, .17, c); box(.022, .82, .022, steel, sx, .41, -.18, c); }
    box(.38, .02, .02, steel, 0, .6, -.19, c, false);
    addSeat(x, z, 0, 1.12);
  };
  for (const z of [19.75, 21.35, 22.95]) for (const x of [-16.8, -18.75, -20.7, -22.65]) { desk(x, z); chair(x + range(-.03, .03), z - .5 + range(-.04, .03)); }
  // cubbies along the back wall, a notice board with the timetable, and the class motto
  { const len = 6.6, xc = -19.0, zc = 17.57 + .2;
    const front = std('#ffffff', { map: rep(T.cubby, len, 1), roughness: .7 }), side = std('#EDEAE3', { roughness: .6 });
    box(len, 1.0, .4, [side, side, std('#D9C3A0'), side, front, side], xc, FL + .5, zc, G);
    plantPot(xc - 2.8, FL + 1.0, zc, .55); plantPot(xc + 2.9, FL + 1.0, zc, .5);
    box(.3, .06, .22, std('#F4F2EC'), xc - 1.2, FL + 1.03, zc, G, false); box(.28, .04, .2, std('#E3F0FB'), xc - 1.18, FL + 1.08, zc, G, false);
    sign({ tex: T.felt(5.2, 1.0, ['お知らせ', '図書室', '保健', '遠足', '漢字テスト'], .62), w: 5.2, h: 1.0, frameColor: '#8A5A36', day: .12, night: .25 }, -19.2, FL + 1.85, 17.6, 0, hint.oshirase, G);
    sign({ tex: T.jikanwari, w: .9, h: .72, frame: false, day: .15, night: .3 }, -17.3, FL + 1.85, 17.63, 0, hint.jikanwari, G);
    sign({ lines: [{ t: '毎日すこしずつ', size: .62, color: '#C0466A' }], w: 2.2, h: .32, bg: '#FFF8EC', fg: '#C0466A', frameColor: '#F4A9BE' }, -19.75, FL + 2.68, 17.6, 0, hint.mokuhyo, G);
  }
  // the hiragana chart on the wall between the two doors
  sign({ tex: T.kana, w: 1.6, h: 1.05, frameColor: '#FFFFFF', day: .15, night: .3 }, part + .1, FL + 1.65, 21.75, Math.PI / 2, hint.hiragana, G);
  for (const x of [-17.0, -19.75, -22.5]) for (const z of [19.8, 22.9]) lamp(x, z, true);
  light(-17.8, 21.5); light(-21.8, 21.5);

  // ================= behind the school: a strip of grass, trees and a fence, so the hallway windows look out on green
  floor(T.lawn, -42, back - .25, -2, 32, .02, 2, { roughness: 1 });
  for (const [z, s] of [[6.5, 1.1], [13.5, 1.25], [20.5, 1.05], [27, 1.15]]) streetTree(-32.2, z, 'green', s);
  { const ft = canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(120,128,138,1)'; g.lineWidth = 2; for (let i = -h; i < w; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); } }, [18, 1]);
    const f = mesh(new THREE.PlaneGeometry(34, 1.8), std('#fff', { map: ft, transparent: true, alphaTest: .4, side: THREE.DoubleSide }), -35, .92, 15, G, false); f.rotation.y = Math.PI / 2;
    for (let z = -2; z <= 32; z += 2.5) box(.06, 1.85, .06, metal('#7E858E'), -35, .93, z, G, false); }

  claim(-1, 'wall', 4, 26);                     // nothing piles in front of the school wall
}

