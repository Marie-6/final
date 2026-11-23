// ================================================================ street life
const walkers = [], movers = [];
const LIFE_MIN = -124, LIFE_MAX = 108;
function walker(side, z, dir) {
  const g = new THREE.Group(); scene.add(g);
  g.position.set(side * range(4.42, 4.52), .15, z); g.rotation.y = dir > 0 ? 0 : Math.PI;
  const skin = std(pick(['#F3D3BC', '#E8C1A0', '#D9A982', '#F6DCCB'])), shirt = std(pick(['#F4F4F2', '#2F6FB8', '#D8433F', '#7FA36A', '#E9C46A', '#3A3A40', '#C9A0E8', '#F4A9BE', '#5F7D9C']));
  const pants = std(pick(['#2E3550', '#4A4A52', '#6B5A48', '#2B2B30', '#7C8A9E', '#C9B79C'])), hair = std(pick(['#1E1A18', '#3A2A20', '#5A4030', '#2A2A2E', '#8A6A4A', '#B9B6B0']));
  g.scale.setScalar(range(.9, 1.05));
  const legs = [], arms = [];
  for (const s2 of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(s2 * .1, .86, 0); g.add(hip); legs.push(hip);
    mesh(new THREE.CylinderGeometry(.075, .06, .86, 8), pants, 0, -.43, 0, hip);
    box(.11, .07, .24, std('#2B2B30'), 0, -.86, .05, hip);
    const sh = new THREE.Group(); sh.position.set(s2 * .25, 1.42, 0); g.add(sh); arms.push(sh);
    mesh(new THREE.CylinderGeometry(.055, .045, .56, 8), shirt, 0, -.28, 0, sh);
    mesh(new THREE.SphereGeometry(.05, 8, 6), skin, 0, -.58, 0, sh);
  }
  mesh(new THREE.CylinderGeometry(.19, .16, .62, 12), shirt, 0, 1.17, 0, g);
  mesh(new THREE.CylinderGeometry(.055, .055, .1, 8), skin, 0, 1.52, 0, g);
  mesh(new THREE.SphereGeometry(.135, 16, 12), skin, 0, 1.66, 0, g);
  const hc = mesh(new THREE.SphereGeometry(.148, 16, 10, 0, Math.PI * 2, 0, Math.PI * .58), hair, 0, 1.67, -.015, g); hc.rotation.x = -.25;
  if (rand() < .4) box(.06, .3, .26, std(pick(['#6B4A32', '#2B2B30', '#C0392B'])), (rand() < .5 ? -1 : 1) * .25, 1.0, 0, g);
  if (rand() < .2) { cyl(.012, .012, .8, metal('#7A7A80'), .3, 1.1, .1, 6, g, false); }
  walkers.push({ g, legs, arms, dir, speed: range(1.0, 1.5), phase: rand() * 6 });
}
function buildLife() {
  for (let i = 0; i < 18; i++) walker(rand() < .5 ? -1 : 1, range(LIFE_MIN, LIFE_MAX), rand() < .5 ? -1 : 1);
  const drive = (lane, z, color) => { const c = car(lane * 1.4, z, color, lane > 0 ? -Math.PI / 2 : Math.PI / 2); movers.push({ g: c, dir: lane > 0 ? 1 : -1, speed: range(6, 8), v: 6 }); };
  drive(1, 20, '#F2F2EE'); drive(-1, -40, '#3A6EA5'); drive(1, -150, '#E9C46A');
}
function updateLife(dt) {
  for (const w of walkers) {
    w.g.position.z += w.dir * w.speed * dt; w.phase += dt * w.speed * 3.4;
    if (w.g.position.z < LIFE_MIN) w.g.position.z = LIFE_MAX; else if (w.g.position.z > LIFE_MAX) w.g.position.z = LIFE_MIN;
    const sw = Math.sin(w.phase);
    w.legs[0].rotation.x = sw * .45; w.legs[1].rotation.x = -sw * .45;
    w.arms[0].rotation.x = -sw * .35; w.arms[1].rotation.x = sw * .35;
    w.g.position.y = .15 + Math.abs(Math.cos(w.phase)) * .025;
  }
  for (const m of movers) {
    const ahead = (player.pos.z - m.g.position.z) * m.dir;
    const target = (Math.abs(player.pos.x - m.g.position.x) < 1.6 && ahead > 0 && ahead < 8) ? 0 : m.speed;
    m.v += (target - m.v) * Math.min(1, dt * 2.5);
    m.g.position.z += m.dir * m.v * dt;
    if (m.g.position.z < WALK_MIN) m.g.position.z = WALK_MAX + 40; else if (m.g.position.z > WALK_MAX + 40) m.g.position.z = WALK_MIN;
  }
}

