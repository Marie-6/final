// ================================================================ props
const lampPositions = [];
// every chair you can sit on: where it is, which way its front points (ry), and eye height when seated
const seats = [];
// (y: the floor it stands on, for the station platform above the street)
const addSeat = (x, z, ry, eye, y = 0) => seats.push({ x, z, ry, yaw: ry + Math.PI, eye, y });
// other things you can do (pour water, open a door, flush...): position, reach, the verb to show, what happens
const actions = [];
const addAction = (x, z, reach, word, act, when, y = 0) => actions.push({ x, z, reach, word, act, when, y });
const dynAll = o => { o.traverse(m => { if (m.isMesh) dynamic.add(m); }); return o; };   // keep animated meshes out of mergeStatic
const restroom = { door: null, open: 0, target: 0 };
const water = {};
const doorways = [];        // [side, z from, z to]: building entrances, kept open from the road
const noPole = [];          // [side, z from, z to]: shop fronts and doorways, no poles there
const poleTags = [];
function poleTag() {
  if (poleTags.length < 6) {
    const area = pick(['みなと', '港町', 'さくら', '青葉']), num = String(Math.floor(range(10, 99)));
    poleTags.push(canvasTex(48, 192, (g, w, h) => {
      g.fillStyle = '#F2F4F5'; g.fillRect(0, 0, w, h); g.fillStyle = '#2F6FB8'; g.fillRect(0, 0, w, 22);
      g.fillStyle = '#fff'; g.font = '700 14px sans-serif'; g.textAlign = 'center'; g.fillText('東電', w / 2, 16);
      g.fillStyle = '#1E2A44'; g.font = '700 22px "Zen Maru Gothic"';
      [...area].forEach((c, i) => g.fillText(c, w / 2, 50 + i * 26));
      g.font = '700 18px sans-serif'; g.fillText(num, w / 2, h - 14);
    }));
  }
  return pick(poleTags);
}
const mirrorTex = canvasTex(128, 128, (g, w, h) => {
  const gr = g.createRadialGradient(54, 50, 6, 64, 64, 64); gr.addColorStop(0, '#F4F8FB'); gr.addColorStop(.45, '#B9CEDF'); gr.addColorStop(1, '#6E8095');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(90,96,110,.6)'; g.beginPath(); g.moveTo(0, 96); g.quadraticCurveTo(64, 70, 128, 96); g.lineTo(128, 128); g.lineTo(0, 128); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 128); g.quadraticCurveTo(64, 92, 88, 128); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(46, 38, 18, 8, -.6, 0, 7); g.fill();
});
function pole(side, z, lamp) {
  for (let k = 0; k < 3; k++) for (const [sd, a, b] of noPole) if (sd === side && z > a - .4 && z < b + .4) z = (z - a < b - z) ? a - .45 : b + .45;
  for (const [sd, a, b] of noPole) if (sd === side && z > a - .4 && z < b + .4) return null;
  if (Math.abs(z + 132) < 8 || Math.abs(z + 72) < 7) return null;      // not at the railway crossing or under the tracks
  const x = side * 4.05;
  if (!claim(side, 'curb', z - 1.6, z + 1.6)) return null;              // keep other poles and signs at a distance
  const g = group(x, 0, z);
  const concrete = std('#B9B8B2');
  cyl(.13, .18, 10.5, concrete, 0, 5.25, 0, 10, g);
  const guard = canvasTex(64, 128, (c, w, h) => { c.fillStyle = '#F2C230'; c.fillRect(0, 0, w, h); c.fillStyle = '#222'; for (let i = -2; i < 8; i++) { c.beginPath(); c.moveTo(0, i * 24); c.lineTo(w, i * 24 - 30); c.lineTo(w, i * 24 - 18); c.lineTo(0, i * 24 + 12); c.fill(); } });
  mesh(new THREE.CylinderGeometry(.19, .19, 1.8, 10, 1, true), std('#fff', { map: guard }), 0, 1.05, 0, g, false);
  box(.1, .1, 1.7, concrete, 0, 9.8, 0, g); box(.1, .1, 1.3, concrete, 0, 9.0, 0, g);
  for (const dz of [-.7, -.25, .25, .7]) cyl(.04, .04, .14, std('#EEE'), 0, 9.92, dz, 6, g, false);
  if (rand() < .55) { cyl(.32, .32, 1.0, std('#8F9699'), -side * .45, 7.6, 0, 12, g); box(.2, .1, .2, std('#555'), -side * .45, 8.15, 0, g, false); }
  if (rand() < .5) box(.3, .5, .2, std('#9AA1A6'), -side * .2, 5.6, 0, g);
  // number plate
  const tag = mesh(new THREE.PlaneGeometry(.2, .8), std('#fff', { map: poleTag() }), -side * .19, 2.6, 0, g, false); tag.rotation.y = -side * Math.PI / 2;
  if (lamp) {
    const arm = cyl(.035, .035, 1.6, metal('#7B7F88'), -side * .8, 6.4, 0, 6, g, false); arm.rotation.z = Math.PI / 2;
    box(.55, .14, .3, glowMat(null, null, 0, 3, { color: '#F4F1EA', emissive: 0xffdcaa }), -side * 1.6, 6.32, 0, g, false);
    lampPositions.push(new THREE.Vector3(x - side * 1.6, 6.0, z));
  }
  return new THREE.Vector3(x, 0, z);
}

const wireMat = new THREE.MeshBasicMaterial({ color: '#2A2833' });
function wire(a, b, sag = .6, r = .02) {
  const mid = a.clone().lerp(b, .5); mid.y -= sag;
  mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 16, r, 4), wireMat, 0, 0, 0, scene, false);
}

const leafMats = {};
function leafMat(kind) {
  if (leafMats[kind]) return leafMats[kind];
  if (kind.endsWith('+')) {                       // dense clump
    const base = kind.slice(0, -1);
    const back = { green: '#3A6E36', dark: '#2E5A2C', sakura: '#E58FAA', maple: '#A8321F', flower: '#3F7A3C' }[base];
    const t = canvasTex(128, 128, (g) => {
      g.clearRect(0, 0, 128, 128);
      g.fillStyle = back; g.beginPath();
      for (let a = 0; a <= Math.PI * 2 + .01; a += .3) { const r = 40 + rand() * 12; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); }
      g.fill();
      const src = leafMat(base).map.image; g.drawImage(src, 0, 0); g.drawImage(src, 10, -6, 110, 110);
    });
    const m = new THREE.MeshStandardMaterial({ map: t, alphaTest: .5, side: THREE.DoubleSide, roughness: .95 });
    m.userData.foliage = true;
    return leafMats[kind] = m;
  }
  const sets = { green: ['#4E8F49', '#5FA453', '#6FB25A', '#3F7A3C', '#86C06A'], dark: ['#3F7A3C', '#4E8F49', '#356B35', '#5A9A50', '#6FA85E'],
                 sakura: ['#F7B3C6', '#FBD0DC', '#F9C2D1', '#EE93AE', '#FFF2F5'], maple: ['#C8402E', '#E0632A', '#F29A3A', '#B8322B', '#E8B04A'], flower: ['#F4A9BE', '#FFE08A', '#FFFFFF', '#E86F8A', '#C9A0E8'] };
  const petals = kind === 'sakura' || kind === 'flower';
  const t = canvasTex(128, 128, (g) => {
    g.clearRect(0, 0, 128, 128);
    for (let i = 0; i < (petals ? 130 : 170); i++) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 50;
      g.save(); g.translate(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); g.rotate(rand() * Math.PI * 2);
      if (petals && rand() < .82) {
        g.fillStyle = pick(sets[kind]);
        for (let k = 0; k < 5; k++) { g.rotate(Math.PI * 2 / 5); g.beginPath(); g.ellipse(0, -3.6, 2.4, 3.9, 0, 0, 7); g.fill(); }
        g.fillStyle = '#F2D27A'; g.beginPath(); g.arc(0, 0, 1.3, 0, 7); g.fill();
      } else {
        g.fillStyle = petals ? pick(['#6FA060', '#5A8F50', '#8DB26E']) : pick(sets[kind]);
        g.beginPath(); g.ellipse(0, 0, 3.4, 7.6, 0, 0, 7); g.fill();
        g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -6.5); g.lineTo(0, 6.5); g.stroke();
      }
      g.restore();
    }
  });
  const m = new THREE.MeshStandardMaterial({ map: t, alphaTest: .45, side: THREE.DoubleSide, roughness: .95 });
  m.userData.foliage = true;
  return leafMats[kind] = m;
}
const cardGeo = new THREE.PlaneGeometry(1, 1);
// Leaf clump: cards spread over an ellipsoid shell and turned to face outward, so the clump
// shades like one soft ball (bright on top, darker underneath) the way painted anime trees do.
// An inner shell of dense leaf cards keeps it from being see-through.
const _Z = new THREE.Vector3(0, 0, 1), _d = new THREE.Vector3(), _q = new THREE.Quaternion();
function leafShell(parent, cx, cy, cz, rx, ry, rz, mat, n, size, r0, r1) {
  for (let i = 0; i < n; i++) {
    const u = rand() * 2 - 1, a = rand() * Math.PI * 2, s2 = Math.sqrt(1 - u * u), r = range(r0, r1);
    _d.set(Math.cos(a) * s2, u, Math.sin(a) * s2);
    const q = mesh(cardGeo, mat, cx + _d.x * rx * r, cy + _d.y * ry * r, cz + _d.z * rz * r, parent, false);
    _d.set(_d.x / rx, _d.y / ry, _d.z / rz).normalize();                 // outward normal of the ellipsoid
    _d.x += range(-.25, .25); _d.y += range(-.25, .25) + .15; _d.z += range(-.25, .25); _d.normalize();
    q.quaternion.setFromUnitVectors(_Z, _d).multiply(_q.setFromAxisAngle(_Z, rand() * Math.PI * 2));
    q.scale.setScalar(size * range(.8, 1.2));
  }
}
function foliage(parent, cx, cy, cz, rx, ry, rz, kind, n, size) {
  const base = kind.replace('+', '');
  if (!kind.endsWith('+')) leafShell(parent, cx, cy, cz, rx, ry, rz, leafMat(base), n, size, .78, 1.02);
  if (base !== 'flower') leafShell(parent, cx, cy, cz, rx, ry, rz, leafMat(base + '+'), Math.ceil(n * .6), size * .95, .35, .6);
}
function plantPot(x, y, z, s = 1) {
  const g = group(x, y, z); g.scale.setScalar(s);
  plantPot.last = g;
  cyl(.2, .15, .34, std(pick(['#C9744F', '#8B8F96', '#E5DCCB', '#5F7D9C', '#B5583A'])), 0, .17, 0, 12, g);
  cyl(.185, .185, .02, std('#4A3A2E'), 0, .33, 0, 12, g, false);
  const t = rand();
  if (t < .35) { foliage(g, 0, .55, 0, .24, .2, .24, 'green', 26, .26);  }
  else if (t < .6) { foliage(g, 0, .5, 0, .16, .12, .16, 'green+', 10, .26); foliage(g, 0, .56, 0, .22, .16, .22, 'flower', 16, .24); }
  else if (t < .8) {
    for (let i = 0; i < 14; i++) { const hgt = range(.4, .8), b = box(.035, hgt, .006, std(pick(['#5FA453', '#4E8F49', '#7DBB63'])), range(-.08, .08), .34 + hgt / 2, range(-.08, .08), g, false); b.rotation.set(range(-.35, .35), rand() * Math.PI, range(-.35, .35)); }
  } else {
    cyl(.022, .03, .7, std('#6E4F3E'), 0, .68, 0, 6, g);
    foliage(g, 0, 1.1, 0, .3, .28, .3, 'green', 30, .3);
    
  }
  return g;
}
function plantCluster(side, z) {
  if (!claim(side, 'wall', z - .8, z + .8)) return;
  // a neat row: each pot gets room for its leaves (about .3 m per unit of scale), staggered a little front-to-back
  const sizes = []; let total = 0;
  for (let i = 0; i < 4; i++) { const sc = range(.8, 1.15), w = .62 * sc + .06; if (total + w > 1.6) break; sizes.push([sc, w]); total += w; }
  let zz = z - total / 2;
  sizes.forEach(([sc, w], i) => { plantPot(side * (i % 2 ? 5.68 : 5.45), .15, zz + w / 2, sc); zz += w; });
}

