// ---------------------------------------------------------------- build the station
function buildStation() {
  const S = STA, { CH, PL } = S, T = staTex(), G = new THREE.Group(); scene.add(G);
  const rep = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.repeat.set(rx, ry); return c; };
  const nc = m => { m.userData.noCollide = true; return m; };
  // a box given by its corners, a flat floor (or ceiling) over a rectangle, a bar sloping from (z0, y0) to (z1, y1)
  const blk = (xa, xb, ya, yb, za, zb, mat, cast = true, parent = G) => box(xb - xa, yb - ya, zb - za, mat, (xa + xb) / 2, (ya + yb) / 2, (za + zb) / 2, parent, cast);
  const flat = (mat, xa, xb, za, zb, y, down) => { const m = mesh(new THREE.PlaneGeometry(xb - xa, zb - za), mat, (xa + xb) / 2, y, (za + zb) / 2, G, false); m.rotation.x = down ? Math.PI / 2 : -Math.PI / 2; return nc(m); };
  const tiled = (tex, xa, xb, za, zb, y, tile, extra = {}) => flat(std('#ffffff', { map: rep(tex, (xb - xa) / tile, (zb - za) / tile), roughness: .5, ...extra }), xa, xb, za, zb, y);
  const strip = (tex, xa, xb, za, zb, y) => flat(std('#ffffff', { map: rep(tex, Math.max(1, Math.round((xb - xa) / .3)), Math.max(1, Math.round((zb - za) / .3))), roughness: .6 }), xa, xb, za, zb, y);
  const slope = (x, w, h, z0, y0, z1, y1, mat) => { const b = box(w, h, Math.hypot(z1 - z0, y1 - y0), mat, x, (y0 + y1) / 2, (z0 + z1) / 2, G, false); b.rotation.x = -Math.atan2(y1 - y0, z1 - z0); return nc(b); };
  // a solid running along z with the profile pts [[z from zBot, y], ...], `depth` thick, its east face at x
  const wedge = (pts, depth, mat, x) => { const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(u, v))), { depth, bevelEnabled: false }); geo.rotateY(-Math.PI / 2); return mesh(geo, mat, x, 0, S.zBot, G, false); };
  const tap = (m, info) => { m.userData.info = info; tappables.push(m); dynamic.add(m); return m; };
  const outerM = (w, h) => wallMat('panel', '#ECE7DD', w, h), innerM = std('#EEEBE4', { roughness: .85 }), band = std('#D9D3C6');
  const steel = metal('#9AA0A8'), frameM = metal('#4A4E56'), rubber = std('#1E2024', { roughness: .5 });
  const glassM = new THREE.MeshStandardMaterial({ color: '#D6E8F2', transparent: true, opacity: .16, roughness: .05, depthWrite: false });
  const conc = concMat('#C4C6C6', 4, 1), concEdge = concMat('#B2B4B4', 30, .3);
  const lightP = glowMat(null, null, 1.1, 1.7, { color: '#F6F9FF', emissive: 0xf2f6ff });

  // ---------- the street: keep the sidewalk in front of the doors clear, like any shop's
  claim(1, 'wall', -88, -86); doorways.push([1, -88, -86]); noPole.push([1, -95.7, -78.3]);

  // ---------- the shell: walls up to the platform; its roof is the platform's floor
  blk(6.0, 6.2, CH, PL, -96, -75.2, [innerM, outerM(20.8, PL - CH), innerM, innerM, innerM, innerM]);
  blk(6.0, 17.2, 0, PL, -75.4, -75.2, [innerM, innerM, innerM, innerM, outerM(11.2, PL), innerM]);
  blk(6.0, 17.2, 0, PL, -96, -95.8, [innerM, innerM, innerM, innerM, innerM, outerM(11.2, PL)]);
  blk(17.0, 17.2, 0, PL, -95.8, -75.4, [outerM(20.4, PL), innerM, innerM, innerM, innerM, innerM]);
  blk(5.86, 6.0, CH - .02, CH + .3, -96, -75.2, band);                                       // ledge over the glass
  blk(5.9, 6.0, PL - .3, PL, -96, -75.2, band);                                             // and the top edge
  // upper floor: frosted office windows
  for (let i = 0; i < 5; i++) {
    const z = -93 + i * 3.9, w = mesh(cardGeo, winMat('frost', true), 5.988, 7.45, z, G, false);
    w.rotation.y = -Math.PI / 2; w.scale.set(2.4, 1.3, 1);
    blk(5.86, 5.99, 6.7, 6.78, z - 1.3, z + 1.3, band, false);
  }
  sign({ lines: [{ t: 'みなと駅', size: .52 }, { t: 'MINATO STATION', size: .17, weight: 700 }], top: .42, w: 6.2, h: 1.5, bg: '#FFFFFF', fg: '#1D2B4A', stripe: '#7DB83A', frameColor: '#9AA0A8', night: .9 }, 5.93, 5.3, -85.6, -Math.PI / 2, hint.eki, G);
  // a canopy over the doors with 東口 on its front
  blk(4.8, 6.0, 3.5, 3.95, -89.6, -84.4, std('#F4F2EC'));
  blk(4.9, 5.9, 3.47, 3.5, -89.2, -84.8, lightP, false);
  sign({ lines: [{ t: '東口  EAST EXIT', size: .62 }], w: 2.4, h: .4, bg: '#1D2B4A', fg: '#FFFFFF', frame: false, night: .9 }, 4.785, 3.72, -87, -Math.PI / 2, hint.higashi, G);

  // ---------- the glass front with automatic doors in the middle (z -85.8..-88.2)
  for (const [a, b] of [[-95.8, -88.2], [-85.8, -75.4]]) {
    const n = Math.max(1, Math.round((b - a) / 2.5));
    for (let i = 0; i < n; i++) { const pa = a + (b - a) * i / n, pb = a + (b - a) * (i + 1) / n; blk(6.06, 6.1, .3, CH - .45, pa + .03, pb - .03, glassM, false); }
    for (let i = 0; i <= n; i++) { const z = a + (b - a) * i / n; blk(6.03, 6.15, .15, CH - .4, z - .04, z + .04, frameM); }
    blk(6.03, 6.15, .15, .3, a, b, frameM);
  }
  blk(6.0, 6.2, CH - .45, CH, -96, -75.2, frameM);
  const DW = 1.2;
  for (const s2 of [-1, 1]) {
    const p = new THREE.Group(); p.position.set(6.1, 0, staDoor.z + s2 * DW / 2); scene.add(p);
    mesh(new THREE.BoxGeometry(.03, CH - .7, DW - .1), glassM, 0, .2 + (CH - .7) / 2, 0, p, false);
    for (const y of [.2, CH - .5]) mesh(new THREE.BoxGeometry(.06, .08, DW - .02), frameM, 0, y, 0, p, false);
    for (const zz of [-DW / 2 + .03, DW / 2 - .03]) mesh(new THREE.BoxGeometry(.06, CH - .7, .05), frameM, 0, .2 + (CH - .7) / 2, zz, p, false);
    const ad = mesh(new THREE.PlaneGeometry(.42, .1), std('#ffffff', { map: autoDoorTex() }), -.035, 1.05, 0, p, false); ad.rotation.y = -Math.PI / 2;
    p.traverse(o => { if (o.isMesh) { dynamic.add(o); o.userData.noCollide = true; } });
    staDoor.panels.push({ g: p, home: staDoor.z + s2 * DW / 2, dir: s2, slide: DW - .08 });
  }
  for (let i = 0; i < 2; i++) { const pm = mesh(cardGeo, posterMat(), 6.11, 1.5, -79 - i * 14.2, G, false); pm.rotation.y = -Math.PI / 2; pm.scale.set(.44, .6, 1); }

  // ---------- floors and ceilings
  tiled(T.floor, 6.2, 13.2, -95.8, -75.4, .158, 1.2, { roughness: .32 });
  tiled(T.floor, 13.4, 17.0, -95.8, -93.6, .158, 1.2, { roughness: .32 });
  flat(std('#4A4E56', { roughness: 1 }), 6.2, 7.6, -88.0, -86.0, .161);                    // door mat
  flat(std('#ffffff', { map: rep(T.ceil, 7 / .6, 20.4 / .6) }), 6.2, 13.2, -95.8, -75.4, CH, true);
  flat(std('#ffffff', { map: rep(T.ceil, 3.6 / .6, 2.2 / .6) }), 13.4, 17.0, -95.8, -93.6, CH, true);
  flat(innerM, 13.4, 17.0, -93.6, -81.3, PL - .36, true);                                   // over the stairwell
  for (const x of [7.4, 9.6, 12.2]) for (let z = -94; z < -76; z += 3) blk(x - .15, x + .15, CH - .05, CH - .01, z - .6, z + .6, lightP, false);
  const light = (x, y, z, k = 1) => { const l = new THREE.PointLight(0xf4f6ff, 3.5 * k, 13, 1.3); l.position.set(x, y, z); scene.add(l); schoolLights.push(l); l.userData.k = k; };
  light(8.2, CH - .5, -80.5); light(9.8, CH - .5, -91.5); light(15.2, 6.4, -86, 1.3);
  // tactile paving: from the doors to the gates, and from the gates to the stairs
  const y0 = .163;
  strip(T.barsX, 6.3, 8.85, -87.15, -86.85, y0); strip(T.dots, 8.85, 9.15, -87.15, -86.85, y0);
  strip(T.barsZ, 8.85, 9.15, -86.85, -82.25, y0); strip(T.dots, 8.85, 9.15, -82.25, -81.95, y0); strip(T.barsX, 9.15, 9.6, -82.25, -81.95, y0);
  strip(T.barsX, 11.0, 12.05, -82.25, -81.95, y0); strip(T.dots, 12.05, 12.35, -82.25, -81.95, y0);
  strip(T.barsZ, 12.05, 12.35, -94.4, -82.25, y0); strip(T.dots, 12.05, 12.35, -94.7, -94.4, y0); strip(T.barsX, 12.35, 14.35, -94.7, -94.4, y0);
  strip(T.dots, 13.4, 15.6, -94.1, -93.8, y0);

  // ---------- ticket machines on the north wall, the fare chart above them
  for (let i = 0; i < 3; i++) {
    const x = 6.75 + i * 1.0, side = std('#D9DDE2', { roughness: .45 });
    tap(blk(x - .45, x + .45, .158, 1.9, -75.95, -75.4, [side, side, side, side, side, std('#ffffff', { map: T.kenbaiki, roughness: .4 })]), hint.kippu);
  }
  sign({ tex: T.unchin, w: 2.9, h: 1.18, frameColor: '#9AA0A8', day: .35, night: .7 }, 7.75, 2.62, -75.39, Math.PI, hint.unchin, G);
  sign({ lines: [{ t: 'きっぷうりば', size: .62 }], w: 2.9, h: .34, bg: '#1D2B4A', fg: '#FFFFFF', stripe: '#7DB83A', frame: false, night: .9 }, 7.75, 3.48, -75.39, Math.PI, hint.kippu, G);

  // ---------- 改札: seven gate cabinets, six lanes; IC readers glow blue at both ends
  const gateBody = std('#E9ECEF', { roughness: .4 }), gateTop = std('#3A3F47', { roughness: .4 });
  const icBlue = glowMat(null, null, .9, 1.6, { color: '#4FA3FF', emissive: 0x2f7fff }), okGreen = glowMat(null, null, .8, 1.5, { color: '#3FD06A', emissive: 0x2fd05a });
  for (let k = 0; k < 7; k++) {
    const z = -78.71 - k * .97, b = blk(9.6, 11.0, .158, 1.12, z - .11, z + .11, gateBody);
    if (k === 3) tap(b, hint.kaisatsu);
    blk(9.59, 11.01, 1.12, 1.16, z - .13, z + .13, gateTop);
    for (const x of [9.78, 10.82]) blk(x - .1, x + .1, 1.16, 1.18, z - .1, z + .1, icBlue, false);
    for (const x of [9.595, 11.005]) blk(x - .005, x + .005, .72, .84, z - .07, z + .07, okGreen, false);
  }
  // overhead: the departure board and 改札口 for people coming in, 出口 for people going out
  for (const z of [-80.6, -82.6]) blk(10.28, 10.32, 3.25, CH, z - .02, z + .02, steel, false);
  blk(9.55, 11.05, 3.22, 3.26, -82.8, -80.4, steel, false);
  sign({ tex: T.board, w: 2.6, h: .68, frameColor: '#2B2D33', day: .9, night: 1.4 }, 9.5, 2.86, -81.6, -Math.PI / 2, hint.hassha, G);
  sign({ lines: [{ t: '改札口  のりば', size: .62 }], w: 2.6, h: .36, bg: '#1D2B4A', fg: '#FFFFFF', stripe: '#7DB83A', frame: false, night: .9 }, 9.5, 3.42, -81.6, -Math.PI / 2, hint.kaisatsu, G);
  sign({ lines: [{ t: '出口  東口', size: .5, color: '#1E1E22' }, { t: 'EXIT  East', size: .26, color: '#1E1E22', weight: 700 }], top: .38, gap: .42, w: 2.4, h: .62, bg: '#F2C230', fg: '#1E1E22', frame: false, night: .9 }, 11.1, 3.1, -81.6, Math.PI / 2, hint.deguchi, G);
  // glass partitions close the gate line on both sides
  for (const [a, b] of [[-78.6, -75.4], [-95.8, -90.4]]) { blk(10.27, 10.33, .158, .4, a, b, steel); blk(10.29, 10.31, .4, 1.1, a, b, glassM, false); blk(10.26, 10.34, 1.1, 1.16, a, b, steel); }

  // ---------- 駅事務室: the station office, with the 窓口 window toward the entrance
  blk(8.6, 11.0, .158, CH, -90.4, -84.8, innerM);
  { const win = mesh(cardGeo, std('#ffffff', { map: T.office, roughness: .3 }), 8.59, 1.55, -87.6, G, false); win.rotation.y = -Math.PI / 2; win.scale.set(2.6, 1.2, 1); }
  blk(8.3, 8.6, .95, 1.0, -88.9, -86.3, std('#B9825A', { roughness: .6 }));
  sign({ lines: [{ t: '窓口', size: .4 }, { t: 'きっぷ・定期券', size: .22 }], top: .45, gap: .4, w: 1.6, h: .56, bg: '#1D2B4A', fg: '#FFFFFF', stripe: '#7DB83A', frame: false, night: .9 }, 8.585, 2.6, -87.6, -Math.PI / 2, hint.madoguchi, G);
  sign({ tex: T.jikoku, w: .6, h: .86, frameColor: '#C9CDD2' }, 8.58, 1.6, -85.4, -Math.PI / 2, hint.jikoku, G);
  { const pm = mesh(cardGeo, posterMat(), 11.01, 1.5, -87.6, G, false); pm.rotation.y = Math.PI / 2; pm.scale.set(.44, .6, 1); }

  // ---------- coin lockers on the south wall
  { const lk = std('#ffffff', { map: rep(T.locker, 3.5 / 1.2, 1), roughness: .5 }), sd = std('#8FA9C2');
    tap(blk(6.4, 9.9, .158, 1.95, -95.8, -95.35, [sd, sd, sd, sd, lk, sd]), hint.locker);
    sign({ lines: [{ t: 'コインロッカー', size: .55 }], w: 1.8, h: .3, bg: '#2F6FB8', fg: '#FFFFFF', frame: false }, 8.15, 2.3, -95.79, 0, hint.locker, G); }

  // ---------- the stairwell: a wall along the paid corridor, the stairs, the escalator and the divider between them
  blk(13.2, 13.4, 0, PL, -93.6, -75.4, innerM);
  blk(13.18, 13.42, .15, 1.2, -93.6, -75.4, band);
  sign({ lines: [{ t: '← 1番線 のりば', size: .46 }, { t: 'Platform 1', size: .24, weight: 700 }], top: .4, gap: .44, w: 2.6, h: .7, bg: '#1D2B4A', fg: '#FFFFFF', stripe: '#7DB83A', frame: false, night: .9 }, 13.19, 2.55, -81.6, -Math.PI / 2, hint.noriba, G);
  const stepM = std('#CFCDC6', { roughness: .7 }), noseM = std('#5A5E66', { roughness: .6 }), rise = S.half / 26;
  const tread = (za, top) => { nc(blk(13.4, 15.6, 0, top, za, za + .3, stepM, false)); nc(blk(13.4, 15.6, top, top + .012, za, za + .05, noseM, false)); };
  for (let i = 0; i < 26; i++) tread(S.zBot + i * .3, .15 + (i + 1) * rise);
  nc(blk(13.4, 15.6, 0, .15 + S.half, S.zBot + 7.8, S.zBot + 9.4, stepM, false));          // the landing
  for (let i = 0; i < 26; i++) tread(S.zBot + 9.4 + i * .3, .15 + S.half + (i + 1) * rise);
  const L = S.zTop - S.zBot, mid = .15 + S.half;
  // handrail along the wall
  slope(13.46, .05, .05, S.zBot, 1.0, S.zBot + 7.8, mid + .85, steel);
  slope(13.46, .05, .05, S.zBot + 7.8, mid + .85, S.zBot + 9.4, mid + .85, steel);
  slope(13.46, .05, .05, S.zBot + 9.4, mid + .85, S.zTop, PL + .85, steel);
  // the divider: solid stainless up to a black handrail (it also keeps you on the stairs or on the escalator)
  wedge([[-.5, 0], [-.5, 1.05], [0, 1.05], [L, PL + .95], [L, 0]], .15, std('#B9BEC4', { roughness: .35, metalness: .5 }), S.mid + .075);
  slope(S.mid, .12, .08, S.zBot - .5, 1.1, S.zTop, PL + 1.0, rubber);
  // the escalator: its body, the moving steps, comb plates at both ends, a handrail on the wall side
  nc(wedge([[-.8, 0], [-.8, .15], [0, .15], [L, PL], [L, 0]], 1.15, std('#4A4E56'), 16.9));
  escalatorTex = rep(T.esc, 1, Math.hypot(L, PL - .15) / .4);
  slope(16.325, 1.0, .03, S.zBot, .17, S.zTop, PL + .02, std('#ffffff', { map: escalatorTex, roughness: .5, metalness: .3 }));
  nc(blk(15.75, 16.9, .15, .175, S.zBot - .8, S.zBot, steel, false)); nc(blk(15.75, 16.9, PL, PL + .012, S.zTop, S.zTop + .8, steel, false));
  wedge([[-.4, 0], [-.4, 1.0], [0, 1.0], [L, PL + .9], [L, 0]], .08, std('#B9BEC4', { roughness: .35, metalness: .5 }), 17.0);
  slope(16.94, .1, .08, S.zBot - .4, 1.05, S.zTop, PL + .95, rubber);
  sign({ lines: [{ t: '1番線 のりば', size: .5 }, { t: 'さくらまち 方面 ↑', size: .3 }], top: .38, gap: .42, w: 3.4, h: .75, bg: '#1D2B4A', fg: '#FFFFFF', stripe: '#7DB83A', frame: false, night: .9 }, 15.15, 3.2, -93.66, Math.PI, hint.noriba, G);
  sign({ lines: [{ t: '1番線 ↑', size: .55 }], w: 1.4, h: .45, bg: '#1D2B4A', fg: '#FFFFFF', stripe: '#7DB83A', frame: false }, 13.41, mid + 1.7, -85, Math.PI / 2, hint.bansen, G);
  for (const [z, y] of [[-90.5, 2.2], [-87.5, 4.0], [-82, 6.1], [-79.5, 7.6]]) { const pm = mesh(cardGeo, posterMat(), 13.405, y, z, G, false); pm.rotation.y = Math.PI / 2; pm.scale.set(.44, .6, 1); }

  // ---------- 1番線: the platform. The front sits on the viaduct's deck, the back on the station's roof and on brackets
  blk(6, 112, 8.3, PL, -75.2, -73.55, [conc, conc, conc, conc, concEdge, conc]);
  blk(6, 13.4, PL - .35, PL, -96, -75.2, conc);
  blk(13.4, 17.2, PL - .35, PL, -96, -81.3, conc);
  blk(16.95, 17.2, PL - .35, PL, -81.3, -75.2, conc);
  blk(17.2, 112, PL - .35, PL, S.back, -75.2, conc);
  blk(17.2, 112, PL - .8, PL + .02, S.back - .1, S.back, std('#DCDDD8'));
  for (const px of VIA.piers) if (px > 18 && px < 112) { blk(px - .15, px + .15, PL - .75, PL - .35, S.back, -74.9, steel); slope(px, .2, .22, -74.95, 6.4, S.back + .3, PL - .7, steel); }
  const pfTop = (xa, xb, za, zb) => tiled(T.pf, xa, xb, za, zb, PL + .004, 1.2, { roughness: .8 });
  pfTop(6, 13.4, S.back, S.edge); pfTop(13.4, 16.95, S.zTop, S.edge); pfTop(16.95, 112, S.back, S.edge);
  strip(T.dots, 6, 112, -74.55, -74.25, PL + .009);                                         // the yellow line
  flat(std('#F2F2EE'), 6, 112, -73.75, -73.6, PL + .008);                                  // white edge line
  strip(T.dots, 13.4, 15.6, -76.3, -76.0, PL + .009); strip(T.barsZ, 14.35, 14.65, -76.0, -74.55, PL + .009);
  // the fence along the back and across both ends
  const frost = std('#E8EEF0', { transparent: true, opacity: .55, roughness: .4 });
  const fence = (xa, xb) => {
    blk(xa, xb, PL, PL + .3, S.back - .12, S.back, conc); blk(xa, xb, PL + .3, PL + 1.25, S.back - .07, S.back - .05, frost, false);
    blk(xa, xb, PL + 1.25, PL + 1.3, S.back - .1, S.back - .02, steel);
    for (let x = xa + .05; x < xb; x += 2) blk(x - .04, x + .04, PL + .3, PL + 1.3, S.back - .1, S.back - .02, steel);
  };
  fence(6, 13.2); fence(17.15, 112);
  for (const x of [6.04, 111.96]) { blk(x - .04, x + .04, PL, PL + 1.2, S.back, S.edge - .05, frost, false); blk(x - .05, x + .05, PL + 1.15, PL + 1.22, S.back, S.edge - .05, steel); for (const z of [S.back + .05, S.edge - .1]) blk(x - .05, x + .05, PL, PL + 1.22, z - .04, z + .04, steel); }
  sign({ lines: [{ t: '立入禁止', size: .55, color: '#FFFFFF' }], w: .8, h: .26, bg: '#D8433F', fg: '#FFF', frame: false }, 111.9, PL + .9, -76.2, -Math.PI / 2, hint.tachiiri, G);
  // the stairs come up through the floor: walls around the opening, 出口・改札 over it
  const encl = std('#F1EFEA', { roughness: .8 });
  // (a solid lower half, frosted glass on steel posts above, posters on the outside)
  for (const [xa, xb] of [[13.2, 13.4], [16.95, 17.15]]) {
    blk(xa, xb, PL, PL + 1.1, -81.4, S.zTop, encl); blk(xa + .08, xb - .08, PL + 1.1, PL + 2.0, -81.4, S.zTop, frost, false);
    for (const z of [-81.3, -79.4, -77.6, S.zTop - .05]) blk(xa + .02, xb - .02, PL + 1.1, PL + 2.0, z - .05, z + .05, steel);
    blk(xa, xb, PL + 1.08, PL + 1.14, -81.4, S.zTop, steel);
    for (const z of [-80.2, -78.3]) { const pm = mesh(cardGeo, posterMat(), xa < 15 ? xa - .005 : xb + .005, PL + .62, z, G, false); pm.rotation.y = xa < 15 ? -Math.PI / 2 : Math.PI / 2; pm.scale.set(.5, .7, 1); }
  }
  blk(13.2, 17.15, PL, PL + 2.5, -81.4, -81.2, encl);
  blk(13.2, 17.15, PL + 2.0, PL + 2.5, S.zTop - .1, S.zTop + .05, encl);
  blk(13.2, 17.15, PL + 2.5, PL + 2.6, -81.4, S.zTop + .05, encl);
  sign({ lines: [{ t: '出口・改札', size: .5, color: '#1E1E22' }, { t: 'Exit ↓', size: .26, color: '#1E1E22', weight: 700 }], top: .38, gap: .44, w: 2.4, h: .44, bg: '#F2C230', fg: '#1E1E22', frame: false, night: .9 }, 15.1, PL + 2.25, S.zTop + .07, 0, hint.deguchi, G);
  slope(13.46, .05, .05, S.zTop - 2, PL + .85 - 2 * rise / .3, S.zTop, PL + .85, steel);
  // the canopy over the middle of the platform: a steel roof on columns, lights underneath
  const rY = PL + 3.3, cx0 = 6, cx1 = 72, colM = metal('#A8B3B0');
  blk(cx0, cx1, rY, rY + .18, -79.0, -73.75, std('#D4D7DA', { roughness: .6 }));
  blk(cx0, cx1, rY - .35, rY + .18, -73.85, -73.75, std('#E9ECEE'));
  for (const z of [-78.3, -75.5]) blk(cx0, cx1, rY - .3, rY, z - .1, z + .1, steel);
  for (let x = cx0 + 1; x < cx1; x += 4) blk(x - .06, x + .06, rY - .25, rY, -79, -73.8, steel, false);
  for (const x of [9.5, 21, 31, 41, 51, 61, 70.5]) blk(x - .13, x + .13, PL, rY - .3, -78.43, -78.17, colM);
  const tube = glowMat(null, null, .5, 2.2, { color: '#F4F6F8', emissive: 0xeef4ff });
  for (let x = 8; x < 71; x += 4) { blk(x - .65, x + .65, rY - .34, rY - .3, -76.2, -75.95, std('#C9CDD2'), false); blk(x - .6, x + .6, rY - .37, rY - .34, -76.15, -76.0, tube, false); }
  for (const x of [10, 26, 42, 58, 70]) lampPositions.push(new THREE.Vector3(x, PL + 2.8, -76));
  // past the canopy: lamp posts
  for (let x = 78; x < 112; x += 11) { blk(x - .06, x + .06, PL, PL + 3.4, -78.6, -78.48, colM); blk(x - .06, x + .06, PL + 3.3, PL + 3.38, -78.6, -76.8, colM); blk(x - .4, x + .4, PL + 3.2, PL + 3.3, -77.2, -76.9, tube, false); lampPositions.push(new THREE.Vector3(x, PL + 2.9, -77)); }
  // benches: orange plastic seats on a steel frame, facing the tracks
  const seatM = std('#E8963A', { roughness: .45 }), benchF = metal('#6E747C');
  for (const bx of [24.5, 36, 46, 56]) {
    const g = group(bx, PL, -77.95);
    box(1.95, .06, .06, benchF, 0, .38, -.05, g); for (const sx of [-.85, .85]) box(.06, .38, .3, benchF, sx, .19, -.05, g);
    for (let i = 0; i < 4; i++) { const sx = -.72 + i * .48; box(.44, .05, .4, seatM, sx, .44, .02, g); box(.44, .38, .04, seatM, sx, .68, -.2, g).rotation.x = -.12; addSeat(bx + sx, -77.9, 0, 1.15, PL); }
  }
  // a vending machine and recycling bins by the back fence
  { const th = pick(VEND_THEMES), g = group(33.6, PL, -78.3), bodyM = std(th.body, { roughness: .5 }), sideM = vendSide(th);
    box(1.0, 1.85, .8, [sideM, sideM, bodyM, bodyM, bodyM, bodyM], 0, .93, 0, g);
    box(1.04, .08, .84, std(shade(th.body, .8)), 0, 1.89, 0, g);
    mesh(cardGeo, vendFront(th), 0, .93, .405, g, false).scale.set(.98, 1.83, 1);
    box(.6, .12, .04, std('#2A2C33', { roughness: .3, metalness: .4 }), 0, .21, .415, g, false);
    const machine = { g, th }; addAction(33.6, -77.4, 1.5, () => 'kau', () => openVend(machine), () => !holding, PL);
    for (const [dx, c] of [[.85, '#3E7CD6'], [1.35, '#3C9D5D']]) { const bg = group(33.6 + dx, PL, -78.45); box(.42, .8, .36, std(c), 0, .4, 0, bg); box(.44, .04, .38, std('#E8E8E8'), 0, .82, 0, bg); } }
  // station name boards (駅名標) on two posts, facing the tracks
  for (const x of [28, 66, 95]) {
    for (const dx of [-1.2, 1.2]) blk(x + dx - .05, x + dx + .05, PL, PL + 2.4, -78.52, -78.42, steel);
    sign({ tex: T.ekimei, w: 2.6, h: 1.0, frameColor: '#B9BEC4', day: .3, night: .8 }, x, PL + 1.85, -78.37, 0, hint.ekimei, G);
  }
  // hanging signs: the departure board in front of the stairs, 1番線, a clock, and the yellow line notice on a column
  for (const dz of [-.3, .3]) blk(15.1 + dz * 3 - .02, 15.1 + dz * 3 + .02, PL + 3.09, rY - .3, -75.22, -75.18, steel, false);
  sign({ tex: T.board, w: 2.6, h: .68, double: true, frameColor: '#2B2D33', day: .9, night: 1.4 }, 15.1, PL + 2.75, -75.2, Math.PI, hint.hassha, G);
  for (const x of [21, 51]) { blk(x - .02, x + .02, PL + 2.85, rY - .3, -76.32, -76.28, steel, false); sign({ lines: [{ t: '1番線', size: .5 }, { t: 'さくらまち方面', size: .26 }], top: .38, gap: .44, w: 1.3, h: .6, bg: '#1D2B4A', fg: '#FFFFFF', stripe: '#7DB83A', double: true, frameColor: '#C9CDD2' }, x, PL + 2.55, -76.3, Math.PI / 2, hint.bansen, G); }
  blk(26 - .02, 26 + .02, PL + 2.9, rY - .3, -76.02, -75.98, steel, false);
  sign({ tex: T.clock, w: .6, h: .6, frame: false, double: true, cutout: true, day: .3, night: .8 }, 26, PL + 2.6, -76.0, Math.PI / 2, hint.tokei, G);
  sign({ lines: [{ t: '黄色い線の', size: .2 }, { t: '内側で', size: .2 }, { t: 'お待ちください', size: .2 }], top: .32, gap: .22, w: .8, h: .62, bg: '#FFFFFF', fg: '#1D2B4A', stripe: '#F2C230', frame: false }, 41, PL + 1.7, -78.16, 0, hint.kiiro, G);
  // air conditioners and a vent on the station's roof, behind the fence
  for (const [x, z] of [[8.4, -83], [10.2, -83], [8.4, -88.5]]) { blk(x - .5, x + .5, PL, PL + .75, z - .4, z + .4, std('#E8E8E4')); blk(x - .3, x + .3, PL + .75, PL + .78, z - .3, z + .3, std('#8E9298'), false); }
  blk(14, 16.4, PL, PL + 1.2, -90, -86, std('#D9D6CF'));
}

