// ---------------------------------------------------------------- people in 3D: soft, storybook-style characters
// Rounded matte shapes with a painterly grain, big heads (about 5½ heads tall), dot eyes, blush and simple features,
// like a picture-book illustration. Each person blinks, breathes, turns their head toward you, moves their mouth while
// they talk, changes face (smile ^‿^, surprised), and can walk, bow, wave and point.
//
// makePerson3d({ skin, hair, shirt, vest, tie, pants, shoes, glasses, lanyard }) → person
//   person.root            the group to place in the world (faces +z)
//   person.face = 'smile' | 'surprised' | ''     person.speaking = true/false
//   person.act('bow' | 'wave' | 'point' | 'nod')  person.goTo(x, z, faceAngle)   person.update(dt, lookAt?)
// people3d[who] = person   → the talk system (365) shows them in the world instead of a 2D portrait.
const people3d = {};
const P3_GRAIN = (() => {          // a soft mottled grain so the colours look painted, not plastic
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 256);
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 900; i++) {
    const r = 4 + rnd() * 22, x = rnd() * 256, y = rnd() * 256, v = 200 + rnd() * 55 | 0;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${v},${v},${v},.22)`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
})();
function p3mat(color, extra) {
  return new THREE.MeshStandardMaterial({ color, map: P3_GRAIN, roughness: .95, metalness: 0, emissive: color, emissiveIntensity: .1, ...extra });
}
const P3_SPHERE = new THREE.SphereGeometry(1, 28, 20);
const p3ease = k => k * k * (3 - 2 * k);

function makePerson3d(o) {
  const M = {
    skin: p3mat(o.skin || '#F3CBA8'), hair: p3mat(o.hair || '#2E2622', { roughness: .8 }),
    shirt: p3mat(o.shirt || '#EEF0EE'), vest: p3mat(o.vest || o.shirt || '#5C6F8E'), tie: p3mat(o.tie || '#B5524A'),
    pants: p3mat(o.pants || '#3A3F4E'), shoes: p3mat(o.shoes || '#6B4A32', { roughness: .6 }),
    ink: new THREE.MeshStandardMaterial({ color: '#2A211C', roughness: .5 }),
    shine: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    mouth: new THREE.MeshStandardMaterial({ color: '#7A3634', roughness: .7 }),
    blush: new THREE.MeshBasicMaterial({ color: '#F2958A', transparent: true, opacity: .42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }),
    frame: new THREE.MeshStandardMaterial({ color: o.glassesColor || '#3B2A22', roughness: .45, metalness: .2 }),
    lens: new THREE.MeshStandardMaterial({ color: '#DDEBF2', transparent: true, opacity: .14, roughness: .05, depthWrite: false }),
  };
  const add = (geo, mat, parent, x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz);
    m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  };
  const grp = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
  const capsule = (r, len, mat, parent, y) => add(new THREE.CapsuleGeometry(r, len, 6, 16), mat, parent, 0, y);

  const root = new THREE.Group();
  // ---- legs (hip pivots) and shoes
  const legs = [-1, 1].map(s => {
    const hip = grp(root, s * .085, .82, 0);
    capsule(.072, .26, M.pants, hip, -.19);
    const knee = grp(hip, 0, -.4, 0);
    capsule(.063, .28, M.pants, knee, -.19);
    add(P3_SPHERE, M.shoes, knee, 0, -.38, .035, .062, .045, .105);
    return { hip, knee };
  });
  // ---- the upper body bends at the hips (for bowing)
  const upper = grp(root, 0, .82, 0);
  add(P3_SPHERE, M.pants, upper, 0, .02, 0, .175, .09, .125);                     // hips
  const torsoProfile = [[0, -.04], [.165, -.03], [.17, .04], [.172, .16], [.188, .32], [.186, .42], [.155, .49], [.07, .525], [0, .53]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const torso = add(new THREE.LatheGeometry(torsoProfile, 36), M.vest, upper, 0, 0, 0, 1, 1, .7);
  add(new THREE.TorusGeometry(.168, .014, 8, 36), M.vest, upper, 0, .0, 0, 1, 1, .7).rotation.x = Math.PI / 2;   // ribbed hem
  // shirt V-neck, collar and tie on the chest
  const chestZ = .186 * .7;
  if (o.vest) {
    const v = new THREE.Shape(); v.moveTo(-.048, 0); v.lineTo(.048, 0); v.lineTo(0, -.13); v.closePath();
    const vm = add(new THREE.ShapeGeometry(v), M.shirt, upper, 0, .5, chestZ - .005); vm.rotation.x = -.42;
    const t = new THREE.Shape(); t.moveTo(-.013, 0); t.lineTo(.013, 0); t.lineTo(.02, -.085); t.lineTo(0, -.105); t.lineTo(-.02, -.085); t.closePath();
    const tm = add(new THREE.ExtrudeGeometry(t, { depth: .006, bevelEnabled: false }), M.tie, upper, 0, .485, chestZ - .002); tm.rotation.x = -.4;
    add(P3_SPHERE, M.tie, upper, 0, .49, chestZ - .02, .02, .016, .014);         // the knot
    for (const s of [-1, 1]) {                                                    // collar points
      const c = new THREE.Shape(); c.moveTo(0, 0); c.lineTo(s * .06, .01); c.lineTo(s * .025, -.05); c.closePath();
      const cm = add(new THREE.ExtrudeGeometry(c, { depth: .005, bevelEnabled: false }), M.shirt, upper, s * .012, .52, chestZ - .035);
      cm.rotation.x = -.5; cm.rotation.y = s * .25;
    }
  }
  add(new THREE.CylinderGeometry(.06, .07, .05, 20), M.shirt, upper, 0, .525, 0, 1, 1, .9);   // shirt collar band
  // lanyard and ID card
  if (o.lanyard) {
    const strap = p3mat(o.lanyard);
    for (const s of [-1, 1]) { const b = add(new THREE.CylinderGeometry(.006, .006, .3, 6), strap, upper, s * .055, .39, chestZ + .012); b.rotation.z = s * .28; b.rotation.x = -.38; }
    const card = add(new THREE.BoxGeometry(.075, .1, .006), p3mat('#F7F5EE'), upper, 0, .23, chestZ + .03); card.rotation.x = -.12;
    add(new THREE.BoxGeometry(.03, .036, .002), p3mat('#9FB4C9'), card, -.014, .015, .004);
    add(new THREE.BoxGeometry(.075, .016, .002), strap, card, 0, -.038, .004);
  }
  // ---- arms (shoulder and elbow pivots), shirt sleeves, cuffs and soft mitten hands
  const arms = [-1, 1].map(s => {
    const sh = grp(upper, s * .19, .43, 0);
    add(P3_SPHERE, M.shirt, sh, 0, 0, 0, .052);
    capsule(.047, .17, M.shirt, sh, -.12);
    const el = grp(sh, 0, -.25, 0);
    capsule(.044, .15, M.shirt, el, -.1);
    add(new THREE.CylinderGeometry(.047, .047, .03, 16), M.shirt, el, 0, -.19, 0);
    const hand = grp(el, 0, -.24, 0);
    add(P3_SPHERE, M.skin, hand, 0, 0, 0, .042, .052, .034);
    add(P3_SPHERE, M.skin, hand, s * -.032, .012, .012, .016, .026, .015).rotation.z = s * .5;   // thumb
    return { sh, el, hand, s };
  });
  // ---- neck and head (the head turns at the neck)
  add(new THREE.CylinderGeometry(.042, .046, .1, 16), M.skin, upper, 0, .56, 0);
  const neck = grp(upper, 0, .58, 0);
  const H = grp(neck, 0, .1, .005);                                 // head centre
  const R = [.15, .153, .144];
  add(P3_SPHERE, M.skin, H, 0, 0, 0, ...R);
  for (const s of [-1, 1]) add(P3_SPHERE, M.skin, H, s * .146, -.005, -.005, .018, .032, .026);   // ears
  const _n = new THREE.Vector3(), _z = new THREE.Vector3(0, 0, 1);
  // a point on the face: a = left/right angle, b = up/down angle, out = how far in front of the skin
  function onFace(m, a, b, out = .002) {
    const p = new THREE.Vector3(R[0] * Math.sin(a) * Math.cos(b), R[1] * Math.sin(b), R[2] * Math.cos(a) * Math.cos(b));
    _n.set(p.x / R[0] ** 2, p.y / R[1] ** 2, p.z / R[2] ** 2).normalize();
    m.position.copy(p).addScaledVector(_n, out);
    m.quaternion.setFromUnitVectors(_z, _n);
    H.add(m); return m;
  }
  const F = {};
  const EYE_A = .3, EYE_B = -.02;
  F.eyes = [-1, 1].map(s => {
    const e = onFace(new THREE.Group(), s * EYE_A, EYE_B, 0);
    add(P3_SPHERE, M.ink, e, 0, 0, 0, .016, .023, .008);
    add(P3_SPHERE, M.shine, e, s * -.004 + .005, .008, .007, .0045);
    return e;
  });
  F.smiles = [-1, 1].map(s => {                                     // ^ ^ happy closed eyes
    const m = onFace(new THREE.Mesh(new THREE.TorusGeometry(.016, .0042, 6, 18, Math.PI), M.ink), s * EYE_A, EYE_B - .01, .001);
    m.visible = false; return m;
  });
  F.brows = [-1, 1].map(s => {
    const g = onFace(new THREE.Group(), s * .3, .21, .001);
    const b = add(new THREE.CapsuleGeometry(.0055, .028, 4, 8), M.hair, g); b.rotation.z = Math.PI / 2 + s * .12;
    return g;
  });
  F.brows.forEach(b => (b.userData.y = b.position.y));
  for (const s of [-1, 1]) onFace(new THREE.Mesh(new THREE.CircleGeometry(.026, 24), M.blush), s * .55, -.24, .001);
  onFace(new THREE.Mesh(P3_SPHERE, M.skin), 0, -.17, -.004).scale.set(.014, .012, .012);          // little nose
  F.closed = onFace(new THREE.Mesh(new THREE.TorusGeometry(.02, .0042, 6, 18, Math.PI), M.ink), 0, -.37, .001);
  F.closed.rotateZ(Math.PI);                                         // ‿ a gentle smile
  F.open = onFace(new THREE.Group(), 0, -.39, -.002);
  add(P3_SPHERE, M.mouth, F.open, 0, 0, 0, .022, .018, .008);
  add(P3_SPHERE, p3mat('#D9746E'), F.open, 0, -.009, .004, .012, .006, .004);                  // tongue
  F.open.scale.y = .01; F.open.visible = false;
  // ---- glasses
  if (o.glasses) {
    const gl = grp(H, 0, -.002, 0);
    for (const s of [-1, 1]) {
      const c = new THREE.Vector3(R[0] * Math.sin(s * EYE_A), R[1] * Math.sin(EYE_B), R[2] * Math.cos(EYE_A) + .026);
      const ring = add(new THREE.TorusGeometry(.036, .0042, 8, 32), M.frame, gl, c.x, c.y, c.z); ring.rotation.y = s * .16;
      const lens = add(new THREE.CircleGeometry(.035, 28), M.lens, gl, c.x, c.y, c.z - .001); lens.rotation.y = s * .16; lens.castShadow = false;
      const arm = add(new THREE.BoxGeometry(.004, .005, .16), M.frame, gl, s * .148, c.y + .01, c.z - .085); arm.rotation.y = s * -.08;
      const hinge = add(new THREE.BoxGeometry(.03, .006, .006), M.frame, gl, c.x + s * .045, c.y + .01, c.z - .006); hinge.rotation.y = s * -.4;
    }
    const br = add(new THREE.TorusGeometry(.014, .003, 6, 12, Math.PI), M.frame, gl, 0, .006, R[2] * Math.cos(EYE_A) + .03);
    br.rotation.z = 0;
  }
  // ---- hair: a cap tilted back (forehead shows, nape covered), a side-swept fringe, a little volume on top
  const cap = add(new THREE.SphereGeometry(.159, 36, 24, 0, Math.PI * 2, 0, 1.78), M.hair, H, 0, .006, -.006, 1.03, 1.03, 1.03);
  cap.rotation.x = -.6;
  const fringe = add(P3_SPHERE, M.hair, H, .025, .098, .075, .125, .05, .07); fringe.rotation.set(-.55, 0, -.22);
  const fringe2 = add(P3_SPHERE, M.hair, H, -.08, .085, .06, .07, .045, .06); fringe2.rotation.set(-.4, .3, .35);
  add(P3_SPHERE, M.hair, H, 0, .02, -.06, .158, .14, .12);          // back and nape
  add(P3_SPHERE, M.hair, H, -.03, .13, -.01, .12, .05, .12).rotation.z = .12;   // volume on top
  for (const s of [-1, 1]) add(P3_SPHERE, M.hair, H, s * .14, .03, -.01, .03, .07, .06);   // sideburns over the ears' tops

  root.traverse(m => { if (m.isMesh) { m.userData.noCollide = true; dynamic.add(m); } });

  // ---------------- animation
  const P = {
    root, face: '', speaking: false, mouth: 0,
    blinkIn: 2, blink: 0, t: Math.random() * 10, walk: 0, walkPhase: 0,
    target: null, faceAngle: null, gesture: null, look: new THREE.Vector3(), lookW: 0, headYaw: 0, headPitch: 0,
  };
  P.goTo = (x, z, faceAngle) => { P.target = new THREE.Vector2(x, z); P.faceAngle = faceAngle; };
  P.act = name => { P.gesture = { name, t: 0, dur: { bow: 1.6, wave: 1.8, point: 1.8, nod: .7 }[name] || 1 }; };
  const _v = new THREE.Vector3(), _q = new THREE.Quaternion();
  const turnTo = (cur, want, k) => cur + Math.atan2(Math.sin(want - cur), Math.cos(want - cur)) * k;
  P.update = (dt, lookAt) => {
    P.t += dt;
    // walking toward a target
    let moving = 0;
    if (P.target) {
      const dx = P.target.x - root.position.x, dz = P.target.y - root.position.z, d = Math.hypot(dx, dz);
      if (d > .02) {
        const step = Math.min(d, .95 * dt);
        root.position.x += dx / d * step; root.position.z += dz / d * step;
        root.rotation.y = turnTo(root.rotation.y, Math.atan2(dx, dz), Math.min(1, dt * 8));
        moving = 1;
      } else if (P.faceAngle != null) root.rotation.y = turnTo(root.rotation.y, P.faceAngle, Math.min(1, dt * 6));
    }
    P.walk += (moving - P.walk) * Math.min(1, dt * 8);
    P.walkPhase += dt * 7.5 * P.walk;
    const sw = Math.sin(P.walkPhase) * P.walk;
    legs.forEach((L, i) => {
      const ph = i ? sw : -sw;
      L.hip.rotation.x = ph * .42;
      L.knee.rotation.x = Math.max(0, -Math.cos(P.walkPhase + i * Math.PI)) * .55 * P.walk;
    });
    upper.position.y = .82 + Math.abs(Math.cos(P.walkPhase)) * .018 * P.walk;
    // breathing and a slow idle sway
    const br = Math.sin(P.t * 1.6);
    torso.scale.set(1 + br * .008, 1 + br * .006, .7 * (1 + br * .012));
    upper.rotation.z = Math.sin(P.t * .55) * .012 * (1 - P.walk);
    // arms: relaxed, swinging while walking, or a gesture
    arms.forEach(A => {
      A.sh.rotation.set(-sw * A.s * .35, 0, A.s * .09);
      A.el.rotation.set(-.18 - P.walk * .12, 0, 0);
      A.hand.rotation.set(0, 0, 0);
    });
    let bow = 0, headNod = 0;
    const G = P.gesture;
    if (G) {
      G.t += dt; const k = G.t / G.dur;
      const env = p3ease(Math.min(1, Math.min(k, 1 - k) * 4));   // ease in, hold, ease out
      const right = arms[0];                                     // his right hand is on the -x side
      if (G.name === 'bow') {
        bow = env * .48;
        arms.forEach(A => { A.sh.rotation.x = -env * .12; A.sh.rotation.z = A.s * (.09 - env * .07); });
      } else if (G.name === 'wave') {
        right.sh.rotation.z = -.09 - env * 2.55; right.sh.rotation.x = -env * .25;
        right.el.rotation.set(-env * .2, 0, -env * (.35 + Math.sin(G.t * 11) * .3));
        headNod = env * .06;
      } else if (G.name === 'point') {               // an open palm toward "over there" (あちら)
        right.sh.rotation.x = -env * 1.15; right.sh.rotation.z = -.09 - env * .22;
        right.el.rotation.x = -env * .35; right.hand.rotation.y = -env * 1.2;
      } else if (G.name === 'nod') headNod = Math.sin(k * Math.PI) * .22;
      if (k >= 1) P.gesture = null;
    }
    upper.rotation.x = bow;
    // head: turn toward what we look at (the player), within a comfortable range
    let yaw = 0, pitch = 0;
    if (lookAt && !moving) {
      root.updateMatrixWorld(true);
      _v.copy(lookAt); neck.worldToLocal(_v);
      yaw = THREE.MathUtils.clamp(Math.atan2(_v.x, _v.z), -.7, .7);
      pitch = THREE.MathUtils.clamp(-Math.atan2(_v.y - H.position.y, Math.hypot(_v.x, _v.z)), -.35, .35);
    }
    const kk = Math.min(1, dt * 5);
    P.headYaw += (yaw - P.headYaw) * kk; P.headPitch += (pitch - P.headPitch) * kk;
    const tilt = P.face === 'smile' ? .1 : 0;
    neck.rotation.set(P.headPitch + headNod - bow * .3, P.headYaw, tilt * (1 + Math.sin(P.t * .9) * .2));
    // face: blink, smile, surprise
    if ((P.blinkIn -= dt) <= 0) { P.blink = .14; P.blinkIn = 2 + Math.random() * 3.5; }
    P.blink = Math.max(0, P.blink - dt);
    const happy = P.face === 'smile', wow = P.face === 'surprised';
    const lid = P.blink > 0 ? .12 : 1, big = wow ? 1.3 : 1;
    F.eyes.forEach(e => { e.visible = !happy; e.scale.set(big, big * lid, 1); });
    F.smiles.forEach(e => (e.visible = happy));
    F.brows.forEach(b => (b.position.y += ((b.userData.y + (wow ? .018 : happy ? .006 : 0)) - b.position.y) * kk));
    // mouth: chatters while speaking; a small "o" when surprised; otherwise a gentle smile
    const chatter = P.speaking ? .25 + .75 * Math.abs(Math.sin(P.t * 17) * Math.sin(P.t * 6.1 + 1.3)) : 0;
    const want = Math.max(chatter, wow ? .55 : 0);
    P.mouth += (want - P.mouth) * Math.min(1, dt * 22);
    F.open.visible = P.mouth > .08; F.closed.visible = !F.open.visible;
    F.open.scale.set(wow && !P.speaking ? .7 : 1, Math.max(.05, P.mouth), 1);
  };
  return P;
}
// per-frame staging (who walks where and when), one function per character; the main loop calls updatePeople3d
const people3dStage = [];
function updatePeople3d(dt) { for (const f of people3dStage) f(dt); }
