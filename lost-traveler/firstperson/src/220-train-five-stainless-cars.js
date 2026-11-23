// ---------------------------------------------------------------- the train: five stainless cars with a green line
// It runs along the viaduct toward +x, stops at 1番線 with its doors open, and waits while you're on board.
const TRAIN = { x: -140, v: 18, state: 'arrive', t: 0, doors: 0, stop: 102, leaves: [], doorX: [-7.2, -2.4, 2.4, 7.2], said: '' };
const TRAIN_SEGS = [[-9.62, -7.85], [-6.55, -3.05], [-1.75, 1.75], [3.05, 6.55], [7.85, 9.62]];      // the long seats
const TRAIN_WINS = [[-9.35, -8.05], [-6.35, -3.25], [-1.55, 1.55], [3.25, 6.35], [8.05, 9.35]];
function carAt(x) { for (let i = 0; i < 5; i++) { const c = TRAIN.x - i * 20; if (Math.abs(x - c) < 9.7) return c; } return null; }
function inTrain(x, z) { return TRAIN.state === 'dwell' && z > STA.edge - .01 && z < -70.6 && carAt(x) !== null; }
function onBoard() { return player.fy > 5 && player.pos.z > STA.edge + .05; }
// where you can stand in a car: in through an open door, then the aisle and the door bays, not on the seats
function trainBlocked(x, z) {
  if (z <= STA.edge) return false;
  const c = carAt(x); if (c === null || TRAIN.state !== 'dwell') return true;
  const lx = x - c, near = r => TRAIN.doorX.some(d => Math.abs(lx - d) < r);
  if (z < -73.05) return !(TRAIN.doors > .8 && near(.33));
  if (z > -70.95 || Math.abs(lx) > 9.35) return true;
  return (z < -72.55 || z > -71.45) && !near(.43);
}
function updateTrain(dt) {
  const T = TRAIN, en = lang === 'en';
  const say = (k, jp, ro, tr, zh) => { if (T.said === k) return; T.said = k; if (player.fy > 3) toast(`${jp} · ${en ? `${ro} · ${tr}` : zh}`, 2800); };
  if (T.state === 'arrive') {
    const left = T.stop - T.x;
    if (left < 170) say('soon', 'まもなく電車がまいります', 'mamonaku densha ga mairimasu', 'A train is arriving soon', '列车即将进站');
    T.v = Math.min(18, Math.sqrt(2 * 1.1 * Math.max(left, 0)) + .25);
    T.x = Math.min(T.stop, T.x + T.v * dt);
    if (T.x >= T.stop) { T.state = 'dwell'; T.t = 0; T.v = 0; }
  } else if (T.state === 'dwell') {
    T.t += dt;
    if (onBoard() && T.t > 18) T.t = 18;                     // it waits while you're on board
    if (T.t > 1 && T.t < 22) say('open', 'みなと、みなとです', 'minato, minato desu', 'This is Minato', '这里是みなと站');
    if (T.t >= 22) say('close', 'ドアが閉まります', 'doa ga shimarimasu', 'The doors are closing', '车门即将关闭');
    const want = T.t > 1.2 && T.t < 22 ? 1 : 0;
    T.doors += THREE.MathUtils.clamp(want - T.doors, -dt / 1.4, dt / 1.4);
    if (T.t > 25) T.state = 'leave';
  } else {
    T.v = Math.min(18, T.v + dt); T.x += T.v * dt;
    if (T.x > 330) { T.x = -250; T.v = 18; T.state = 'arrive'; }
  }
  train.position.x = T.x;
  for (const l of T.leaves) l.g.position.x = l.home + l.dir * T.doors * .62;
}

let _trainTex;
function trainTex() {
  if (_trainTex) return _trainTex;
  const T = {}, tx = canvasText, Y1 = 11.8, px = x => (x + 9.75) * 100, py = y => (Y1 - y) * 100;
  // the side walls: window and door holes (transparent), frames around them
  const holes = (g, pad, col) => {
    g.fillStyle = col;
    for (const [a, b] of TRAIN_WINS) g.fillRect(px(a) - pad, py(11.1) - pad, px(b) - px(a) + 2 * pad, py(10.15) - py(11.1) + 2 * pad);
    for (const d of TRAIN.doorX) g.fillRect(px(d - .65) - pad, py(11.2) - pad, 130 + 2 * pad, py(9.3) - py(11.2) + pad);
    for (const [a, b] of TRAIN_WINS) g.clearRect(px(a), py(11.1), px(b) - px(a), py(10.15) - py(11.1));
    for (const d of TRAIN.doorX) g.clearRect(px(d - .65), py(11.2), 130, py(9.3) - py(11.2) + 1);
  };
  const steelLines = (g, w, h) => { for (let x = 0; x < w; x += 8) { g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x, 0, 3, h); g.fillStyle = 'rgba(60,66,74,.08)'; g.fillRect(x + 4, 0, 2, h); } };
  const stainless = { roughness: .42, metalness: .2 };
  T.outer = std('#ffffff', { map: canvasTex(1950, 280, (g, w, h) => {
    g.fillStyle = '#C6CBD1'; g.fillRect(0, 0, w, h); steelLines(g, w, h);
    g.fillStyle = '#7DB83A'; g.fillRect(0, py(10.06), w, 13); g.fillStyle = '#3E7A2A'; g.fillRect(0, py(10.06) + 13, w, 4);
    g.fillStyle = '#7DB83A'; g.fillRect(0, py(11.58), w, 7);
    holes(g, 5, '#3A3E46');
  }), alphaTest: .5, ...stainless });
  T.inner = std('#ffffff', { map: canvasTex(1950, 280, (g, w, h) => {
    g.fillStyle = '#ECE8DE'; g.fillRect(0, 0, w, h); g.fillStyle = '#DCD6C8'; g.fillRect(0, py(10.15), w, h - py(10.15));
    holes(g, 6, '#C3C8CE');
  }), alphaTest: .5, roughness: .7 });
  T.leaf = std('#ffffff', { map: canvasTex(68, 195, (g, w, h) => {
    g.fillStyle = '#C6CBD1'; g.fillRect(0, 0, w, h); steelLines(g, w, h);
    g.fillStyle = '#7DB83A'; g.fillRect(0, 119, w, 13);
    g.fillStyle = '#3A3E46'; g.fillRect(6, 20, w - 12, 92); g.clearRect(10, 24, w - 20, 84);
    g.fillStyle = '#2B2D33'; g.fillRect(0, h - 4, w, 4);
  }), alphaTest: .5, ...stainless });
  T.floor = std('#ffffff', { map: canvasTex(32, 128, (g, w, h) => { g.fillStyle = '#6E8E7A'; g.fillRect(0, 0, w, h); g.fillStyle = '#D9CCAA'; g.fillRect(0, h * .36, w, h * .28); speckle(g, w, h, .05, 120); g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(0, 0, 1, h); }, [19, 1]), roughness: .6 });
  const moquette = c => std('#ffffff', { map: canvasTex(64, 32, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(255,255,255,${rand() * .09})`; g.fillRect(rand() * w, rand() * h, 1.5, 1.5); } g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, 0, 2, h); }, [8, 1]), roughness: .95 });
  T.seatRed = moquette('#B3303A'); T.seatBlue = moquette('#4F6FA0');
  const adTex = ([t1, t2, bg, fg]) => canvasTex(170, 64, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); tx(g, t1, w / 2, 24, 26, fg, 900, 'center', w - 12); tx(g, t2, w / 2, 50, 15, fg, 700, 'center', w - 12); });
  const ads = [['みなと水族館', 'イルカショー 毎日', '#2F6FB8', '#FFFFFF'], ['日本語学校', '生徒募集中！', '#EAF4FF', '#1D2B4A'], ['さくら祭り', '4月1日〜7日', '#F9C2D1', '#8A2D4A'], ['新発売', 'みなとビール', '#F2C230', '#1E1E22']].map(adTex);
  T.ads = ads.map(map => std('#ffffff', { map, roughness: .7 }));
  T.adsD = ads.map(map => std('#ffffff', { map, roughness: .7, side: THREE.DoubleSide }));
  const lcd = canvasTex(200, 64, (g, w, h) => { g.fillStyle = '#0C0D10'; g.fillRect(0, 0, w, h); tx(g, 'つぎは', 40, 26, 16, '#FFFFFF'); tx(g, 'さくらまち', 128, 26, 28, '#FFB238', 900, 'center', 120); tx(g, 'Next  Sakuramachi', w / 2, 54, 12, '#AEB6C4', 700); });
  T.lcd = glowMat(lcd, lcd, .9, 1.3);
  const dest = canvasTex(180, 44, (g, w, h) => { g.fillStyle = '#0C0D10'; g.fillRect(0, 0, w, h); tx(g, '普通', 32, 23, 22, '#4FD86A'); tx(g, 'さくらまち', 118, 23, 22, '#FFB238', 900, 'center', 110); });
  T.dest = glowMat(dest, dest, .9, 1.4);
  T.yusen = std('#ffffff', { map: canvasTex(126, 42, (g, w, h) => { g.fillStyle = '#F08C2E'; g.fillRect(0, 0, w, h); tx(g, '優先席', w / 2, h / 2 + 1, 26, '#FFFFFF'); }) });
  // the driver's cab: windshield, destination board, headlights (they glow), the green line
  const cabDraw = glow => (g, w, h) => {
    g.fillStyle = glow ? '#000' : '#C6CBD1'; g.fillRect(0, 0, w, h);
    if (!glow) { steelLines(g, w, h); g.fillStyle = '#1C2026'; g.beginPath(); g.roundRect(16, 40, w - 32, 100, 10); g.fill(); g.fillStyle = 'rgba(160,190,210,.25)'; g.beginPath(); g.moveTo(40, 40); g.lineTo(110, 40); g.lineTo(70, 140); g.lineTo(16, 140); g.fill(); g.fillStyle = '#7DB83A'; g.fillRect(0, 174, w, 13); g.fillStyle = '#3A3E46'; g.fillRect(w / 2 - 36, 150, 72, 110); g.fillStyle = '#2B2D33'; g.fillRect(0, h - 10, w, 10); }
    g.fillStyle = '#0C0D10'; g.fillRect(w / 2 - 62, 8, 124, 28); tx(g, '普通 さくらまち', w / 2, 23, 16, '#FFB238', 900, 'center', 114);
    for (const x of [40, w - 40]) { g.fillStyle = glow ? '#FFF6E0' : '#F4F1E8'; g.beginPath(); g.arc(x, 214, 15, 0, 7); g.fill(); g.fillStyle = glow ? '#701010' : '#C0392B'; g.fillRect(x - 12, 236, 24, 8); }
  };
  T.cab = glowMat(canvasTex(290, 280, cabDraw(false)), canvasTex(290, 280, cabDraw(true)), .5, 1.3, stainless);
  T.handleGeo = new THREE.TorusGeometry(.065, .011, 4, 3); T.handleGeo.rotateZ(Math.PI / 2); T.handleGeo.rotateY(Math.PI / 2);
  return (_trainTex = T);
}

// one car, built around its own center: x along the car, z across it, y as in the world
function trainCar(T) {
  const c = new THREE.Group(), seatsAt = [];
  const L = 19.5, hw = 1.45, F = STA.PL, Y0 = 9.0, Y1 = 11.8;
  const add = (w, h, d, mat, x, y, z, p = c) => box(w, h, d, mat, x, y, z, p, false);
  const stain = std('#C3C8CE', { roughness: .42, metalness: .2 }), darkM = std('#2E3036', { roughness: .6 }), under = std('#3F4248', { roughness: .7 });
  const cream = std('#EAE6DC', { roughness: .8 }), chrome = std('#D9DDE2', { roughness: .25, metalness: .8 });
  const glass = new THREE.MeshStandardMaterial({ color: '#CFE3EC', transparent: true, opacity: .2, roughness: .05, depthWrite: false });
  // floor, under-floor equipment, two bogies on the rails
  add(L, .3, 2 * hw, under, 0, F - .15, 0);
  const fl = mesh(new THREE.PlaneGeometry(L - .2, 2 * hw - .12), T.floor, 0, F + .003, 0, c, false); fl.rotation.x = -Math.PI / 2;
  add(9, .32, 2.3, under, 0, 8.84, 0);
  for (const bx of [-6.9, 6.9]) {
    add(2.6, .32, 2.1, darkM, bx, 8.95, 0);
    for (const dx of [-1, 1]) for (const z of [-.535, .535]) cyl(.43, .43, .1, darkM, bx + dx, 8.965, z, 16, c, false).rotation.x = Math.PI / 2;
  }
  // roof, air conditioner, ceiling with two light strips
  add(L, .15, 2 * hw, stain, 0, Y1 + .075, 0);
  add(4.2, .32, 1.9, std('#B9BEC4', { roughness: .5, metalness: .3 }), 0, Y1 + .3, 0);
  const ce = mesh(new THREE.PlaneGeometry(L - .2, 2 * hw - .1), cream, 0, 11.66, 0, c, false); ce.rotation.x = Math.PI / 2;
  const tube = glowMat(null, null, .7, 1.8, { color: '#F6F9FF', emissive: 0xf2f6ff });
  for (const z of [-.5, .5]) add(L - 1.2, .03, .14, tube, 0, 11.64, z);
  add(L - 1, .06, .5, cream, 0, 11.62, 0);
  // ends: stainless outside, cream inside, a gangway door with a window
  for (const e of [-1, 1]) {
    add(.08, Y1 - Y0, 2 * hw, [e > 0 ? stain : cream, e > 0 ? cream : stain, stain, stain, stain, stain], e * 9.71, (Y0 + Y1) / 2, 0);
    add(.02, 1.9, .8, std('#A9B0B8'), e * 9.66, F + .95, 0);
    add(.025, .7, .5, std('#2A3038', { roughness: .1 }), e * 9.655, F + 1.4, 0);
  }
  for (const s of [-1, 1]) {
    const zw = s * (hw - .03);
    // the side wall (holes for windows and doors), glass in the windows, the destination board outside
    add(L, Y1 - Y0, .06, s < 0 ? [stain, stain, stain, stain, T.inner, T.outer] : [stain, stain, stain, stain, T.outer, T.inner], 0, (Y0 + Y1) / 2, zw);
    for (const [a, b] of TRAIN_WINS) add(b - a, .95, .01, glass, (a + b) / 2, 10.625, zw);
    const ds = mesh(new THREE.PlaneGeometry(.9, .22), T.dest, 0, 11.4, s * (hw + .003), c, false); ds.rotation.y = s < 0 ? Math.PI : 0;
    if (s < 0) ds.userData.info = hint.densha;
    // doors: two leaves each; only the platform side opens
    for (const d of TRAIN.doorX) {
      for (const k of [-1, 1]) { const g = new THREE.Group(); g.position.set(d + k * .33, 0, s * (hw - .085)); c.add(g); add(.68, 1.95, .03, T.leaf, 0, F + .975, 0, g); if (s < 0) g.userData.leaf = k; }
      add(.56, .22, .04, darkM, d, 11.42, s * (hw - .055));
      const lcd = mesh(new THREE.PlaneGeometry(.5, .16), T.lcd, d, 11.42, s * (hw - .078), c, false); lcd.rotation.y = s < 0 ? 0 : Math.PI;
      if (s < 0) lcd.userData.info = hint.tsugi;
    }
    // long seats, with partitions and grab poles at the door ends; priority seats (blue) at the car ends
    TRAIN_SEGS.forEach(([a, b], i) => {
      const len = b - a, x = (a + b) / 2, pri = i === 0 || i === 4, m = pri ? T.seatBlue : T.seatRed;
      add(len, .12, .5, m, x, F + .39, s * (hw - .33));
      add(len, .46, .09, m, x, F + .74, s * (hw - .1)).rotation.x = s * .12;
      add(len, .33, .03, stain, x, F + .165, s * (hw - .57));
      for (const e of [a, b]) if (Math.abs(e) < 9) {
        const ex = e + (e === a ? -.03 : .03);
        add(.04, .9, .55, stain, ex, F + .62, s * (hw - .33));
        cyl(.018, .018, 2.35, chrome, ex + (e === a ? -.03 : .03), F + 1.175, s * (hw - .62), 8, c, false);
      }
      const n = Math.max(1, Math.round(len / .9));
      for (let k = 0; k < n; k++) seatsAt.push({ x: a + len * (k + .5) / n, z: s * (hw - .45), ry: s < 0 ? 0 : Math.PI });
      add(len - .2, .03, .3, std('#AEB4BB', { roughness: .4, metalness: .5 }), x, 11.12, s * (hw - .2));   // luggage rack
      if (pri) { const st = mesh(new THREE.PlaneGeometry(.42, .14), T.yusen, x, 11.3, s * (hw - .066), c, false); st.rotation.y = s < 0 ? 0 : Math.PI; st.userData.info = hint.yusen; }
      else for (let k = 0; k < Math.floor(len / 1.1); k++) { const ad = mesh(new THREE.PlaneGeometry(.85, .32), pick(T.ads), a + .6 + k * 1.1, 11.3, s * (hw - .066), c, false); ad.rotation.y = s < 0 ? 0 : Math.PI; }
    });
    // a rail with hanging straps over each row of seats
    add(L - .5, .03, .03, chrome, 0, 11.42, s * .95);
    const strapM = std('#F2F2EE', { roughness: .6 });
    for (let x = -9.2; x <= 9.21; x += .32) { add(.024, .24, .012, strapM, x, 11.29, s * .95); mesh(T.handleGeo, strapM, x, 11.1, s * .95, c, false); }
  }
  // ads hanging down the middle (中吊り)
  for (const x of [-4.8, 0, 4.8, -8.7, 8.7]) { const ad = mesh(new THREE.PlaneGeometry(.75, .44), pick(T.adsD), x, 11.3, 0, c, false); ad.rotation.y = Math.PI / 2; add(.02, .1, .3, chrome, x, 11.57, 0); }
  return { c, seatsAt };
}

// merge a group's static meshes by material (it is cloned five times, so it should be light)
function mergeInto(root) {
  root.updateMatrixWorld(true);
  const inv = root.matrixWorld.clone().invert(), buckets = new Map(), remove = [];
  root.traverse(o => {
    if (!o.isMesh || Array.isArray(o.material) || o.userData.info) return;
    for (let p = o.parent; p && p !== root; p = p.parent) if (p.userData.leaf) return;
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!buckets.has(o.material)) buckets.set(o.material, []);
    buckets.get(o.material).push(g); remove.push(o);
  });
  for (const o of remove) o.parent.remove(o);
  for (const [mat, geos] of buckets) { const m = new THREE.Mesh(mergeGeometries(geos, false), mat); m.receiveShadow = true; root.add(m); }
}

function buildTrain() {
  const T = trainTex(), { c: tpl, seatsAt } = trainCar(T);
  mergeInto(tpl);
  const g = group(TRAIN.x, 0, VIA.z);
  for (let i = 0; i < 5; i++) {
    const car = tpl.clone(); car.position.x = -i * 20; g.add(car);
    car.traverse(o => { if (o.userData.leaf) TRAIN.leaves.push({ g: o, home: o.position.x, dir: o.userData.leaf }); if (o.isMesh && o.userData.info) tappables.push(o); });
    // the seats, where they are when the train waits at the platform
    for (const s of seatsAt) seats.push({ x: TRAIN.stop - i * 20 + s.x, z: VIA.z + s.z, ry: s.ry, yaw: s.ry + Math.PI, eye: 1.12, y: STA.PL, when: () => TRAIN.state === 'dwell' });
    if (i < 4) box(.5, 2.3, 1.5, std('#2B2D33'), -10, 10.35, 0, car, false);              // the gangway bellows to the next car
  }
  // a driver's cab on each end, and a pantograph up to the wire
  for (const [car, e] of [[g.children[0], 1], [g.children[4], -1]]) { const f = mesh(new THREE.PlaneGeometry(2.9, 2.8), T.cab, e * 9.76, 10.4, 0, car, false); f.rotation.y = e * Math.PI / 2; }
  { const pg = g.children[1], pm = metal('#5A5E66');
    box(1.4, .1, 1.2, pm, 5, 12.03, 0, pg, false);
    for (const k of [-1, 1]) box(.05, .75, .05, pm, 5 + k * .25, 12.33, 0, pg, false).rotation.z = k * .7;
    box(.12, .05, 1.5, pm, 5, 12.62, 0, pg, false); }
  g.traverse(o => { if (o.isMesh) { dynamic.add(o); o.userData.noCollide = true; } });
  return g;
}

