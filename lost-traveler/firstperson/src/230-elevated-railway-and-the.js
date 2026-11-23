// ================================================================ the elevated railway (高架橋) and the blocks behind the street
// All of this runs inside isolated(), so it never changes the street's random numbers.
const VIA = { z: -72, x0: -310, x1: 310, piers: [] };
for (const s of [-1, 1]) for (let x = 7.2; x < 300; x += 15) VIA.piers.push(s * x);

// cast concrete: soft blotches, board-form joints, tie holes, rain streaks running down from the top
let _concTex;
function concreteTex() {
  return _concTex ??= canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 30; i++) {
      const x = rand() * w, y = rand() * h, r = 30 + rand() * 100, gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, rand() < .6 ? 'rgba(90,86,80,.08)' : 'rgba(255,255,255,.1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    speckle(g, w, h, .06, 9000);
    g.fillStyle = 'rgba(70,66,60,.16)'; for (let y = 0; y < h; y += 128) g.fillRect(0, y, w, 2);
    g.fillStyle = 'rgba(70,66,60,.1)'; for (let y = 0; y < h; y += 128) for (let x = ((y / 128) % 2) * 128; x < w; x += 256) g.fillRect(x, y, 2, 128);
    g.fillStyle = 'rgba(40,40,40,.3)'; for (let y = 64; y < h; y += 128) for (let x = 64; x < w; x += 128) { g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.fill(); }
    for (let i = 0; i < 50; i++) {
      const x = rand() * w, len = h * (.12 + rand() * .6), gr = g.createLinearGradient(0, 0, 0, len);
      gr.addColorStop(0, 'rgba(55,52,48,.22)'); gr.addColorStop(1, 'rgba(55,52,48,0)');
      g.fillStyle = gr; g.fillRect(x, 0, 1 + rand() * 7, len);
    }
  });
}
const concCache = new Map();
function concMat(color, rx, ry) {
  const k = color + rx.toFixed(2) + ry.toFixed(2);
  if (!concCache.has(k)) {
    const t = concreteTex().clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
    concCache.set(k, new THREE.MeshStandardMaterial({ color, map: t, roughness: .92 }));
  }
  return concCache.get(k);
}
// a box whose bottom face is pulled in: the tapered head on top of a pier
function taperBox(w, h, d, kx, kz) {
  const geo = new THREE.BoxGeometry(w, h, d), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) if (p.getY(i) < 0) { p.setX(i, p.getX(i) * kx); p.setZ(i, p.getZ(i) * kz); }
  geo.computeVertexNormals();
  return geo;
}

function viaduct(rail) {
  const L = VIA.x1 - VIA.x0, C = '#CBCDCC';
  const girder = concMat(C, L / 8, .3), under = concMat('#AEB4BA', L / 8, 1.4), light = concMat(shade(C, 1.06), L / 8, .08);
  const steel = metal('#8C929A'), dark = metal('#4E535B');
  // the main girder (the station signs hang on its faces over the road), the drip edge and the ribs underneath
  box(L, 1.3, 6, [girder, girder, girder, under, girder, girder], 0, 7.4, 0, rail);
  box(L, .25, 6.5, light, 0, 8.17, 0, rail);
  for (const z of [-1.7, 1.7]) box(L, .4, .55, concMat('#B4B9BE', L / 8, .1), 0, 6.55, z, rail, false);
  // parapet walls with a cap, then see-through sound barrier panels on steel posts
  const glass = new THREE.MeshStandardMaterial({ color: '#C9DCE2', transparent: true, opacity: .42, roughness: .12, metalness: .1, depthWrite: false });
  for (const s of [-1, 1]) {
    // on the station side the parapet stops where platform 1 runs along the tracks
    for (const [a, b] of s < 0 ? [[VIA.x0, STA.px0], [STA.px1, VIA.x1]] : [[VIA.x0, VIA.x1]]) {
      const len = b - a, cx = (a + b) / 2;
      box(len, 1.1, .22, concMat(C, len / 8, .28), cx, 8.85, s * 3.1, rail);
      box(len, .1, .38, light, cx, 9.45, s * 3.1, rail, false);
      mesh(new THREE.BoxGeometry(len, 1.1, .03), glass, cx, 10.07, s * 3.1, rail, false);
      for (let x = a + 1; x < b; x += 2.5) box(.1, 1.25, .1, steel, x, 10.12, s * 3.1, rail, false);
      box(len, .09, .14, steel, cx, 10.72, s * 3.1, rail, false);
      box(len, .08, .12, steel, cx, 9.55, s * 3.1, rail, false);
    }
    // a cable trough along the outside of the parapet
    box(L, .22, .22, concMat(shade(C, .8), L / 8, .05), 0, 8.0, s * 3.36, rail, false);
  }
  // the track: a concrete bed, two rails, and sleepers where you can see them from the platform
  box(L, .1, 2.6, concMat('#8E8C86', L / 8, .2), 0, 8.345, 0, rail, false);
  for (const z of [-.535, .535]) box(L, .14, .07, metal('#7E848C'), 0, 8.465, z, rail, false);
  for (let x = -30; x < 150; x += .62) box(.22, .08, 2.1, std('#7A746C'), x, 8.43, 0, rail, false);

  // piers: an octagonal column on a footing, a tapered head, bearing pads, a cross beam, and a drain pipe down the side
  const colGeo = new THREE.CylinderGeometry(1, 1, 5.1, 8); colGeo.rotateY(Math.PI / 8);
  const capGeo = taperBox(2.1, 1.1, 5.7, .78, .45);
  const colMat = concMat(C, 1.2, 1.1), capMat = concMat(shade(C, 1.02), .6, .3), foot = concMat(shade(C, .82), .5, .1);
  const pipe = std('#6E737A', { roughness: .5, metalness: .4 });
  VIA.piers.forEach((x, i) => {
    mesh(colGeo, colMat, x, 2.55, 0, rail).scale.set(.82, 1, 1.22);
    box(2.4, .3, 3.4, foot, x, .15, 0, rail);
    mesh(capGeo, capMat, x, 5.65, 0, rail);
    for (const z of [-1.7, 1.7]) box(.6, .15, .7, dark, x, 6.27, z, rail, false);
    box(.5, .4, 6, concMat(shade(C, .88), .2, .1), x, 6.55, 0, rail, false);
    const pz = (i % 2 ? -1 : 1) * 1.2;
    cyl(.075, .075, 6.1, pipe, x + .32, 3.1, pz, 8, rail, false);
    for (const y of [1.2, 2.8, 4.4]) box(.22, .05, .1, dark, x + .32, y, pz - Math.sign(pz) * .05, rail, false);
    box(.16, .16, .7, pipe, x + .32, 6.15, pz * .8, rail, false);
    box(.6, .15, .3, pipe, x + .32, .07, pz + Math.sign(pz) * .25, rail, false);
  });
  // fluorescent lights under the deck over both sidewalks
  const tube = glowMat(null, null, .4, 2.4, { color: '#F4F6F8', emissive: 0xeef4ff });
  for (const x of [-4.8, 4.8]) for (const z of [-1.7, 0, 1.7]) { box(.2, .08, 1.3, std('#C9CDD2'), x, 6.71, z, rail, false); box(.1, .04, 1.2, tube, x, 6.65, z, rail, false); }
  for (const x of [-4.8, 4.8]) lampPositions.push(new THREE.Vector3(x, 6.3, VIA.z));

  // overhead wires: masts on both edges every 30 m, a cross beam, a messenger wire with droppers holding the contact wire
  // (high enough to clear the train's roof and the platform canopy)
  for (let x = -277.2; x < 300; x += 30) {
    for (const s of [-1, 1]) { box(.26, 6.2, .26, steel, x, 11.4, s * 3.5, rail, false); box(.18, .18, .5, steel, x, 8.7, s * 3.3, rail, false); }
    box(.2, .34, 7.4, steel, x, 14.35, 0, rail, false);
    box(.05, .55, .05, dark, x, 13.9, 0, rail, false);
    cyl(.09, .09, .22, std('#7A4A3A', { roughness: .4 }), x, 13.6, 0, 8, rail, false);
  }
  box(L, .03, .03, wireMat, 0, 13.45, 0, rail, false);
  box(L, .025, .025, wireMat, 0, 12.65, 0, rail, false);
  for (const s of [-1, 1]) box(L, .035, .035, wireMat, 0, 14.5, s * 3.5, rail, false);
  for (let x = VIA.x0 + 2.5; x < VIA.x1; x += 5) box(.015, .8, .015, wireMat, x, 13.05, 0, rail, false);
}

