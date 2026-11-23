// ================================================================ loop
const clock = new THREE.Clock();
let lightTimer = 0;
const _sunRot = new THREE.Matrix4(), _sunInv = new THREE.Matrix4(), _sunP = new THREE.Vector3(), _origin = new THREE.Vector3();
function placeSun(cz) {
  const dir = sky.material.uniforms.sunDir.value, cam = sun.shadow.camera;
  const texel = (cam.right - cam.left) / sun.shadow.mapSize.x;
  _sunRot.lookAt(dir, _origin, cam.up);          // same orientation the shadow camera will use
  _sunInv.copy(_sunRot).transpose();             // pure rotation: inverse = transpose
  _sunP.set(0, 0, cz).applyMatrix4(_sunInv);     // into light space
  _sunP.x = Math.round(_sunP.x / texel) * texel;
  _sunP.y = Math.round(_sunP.y / texel) * texel;
  _sunP.applyMatrix4(_sunRot);                   // back to world space
  sun.target.position.copy(_sunP);
  sun.position.copy(_sunP).addScaledVector(dir, 120);
}
function frame() {
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  const fwd = (keys.has('w') || keys.has('arrowup') || hold.fwd) - (keys.has('s') || keys.has('arrowdown') || hold.back);
  const side = (keys.has('d') || keys.has('arrowright')) - (keys.has('a') || keys.has('arrowleft'));
  const speed = keys.has('shift') ? 7 : 3.4;
  if (actAnim) {
    const A = actAnim; A.t = Math.min(1, A.t + dt / A.dur); A.step(A.t);
    if (A.t >= 1) { actAnim = null; A.end && A.end(); }
  } else if (seatAnim) {
    const A = seatAnim; A.t = Math.min(1, A.t + dt / .45); const k = A.t * A.t * (3 - 2 * A.t);
    player.pos.lerpVectors(A.a, A.b, k); eyeY = A.ya + (A.yb - A.ya) * k;
    player.yaw = A.yawA + (A.yawB - A.yawA) * k; player.pitch = A.pA + (A.pB - A.pA) * k;
    if (A.t >= 1) { seatAnim = null; seatLabel = '#'; }
  } else if (seated) {
    if (fwd || side) standUp();
  } else if (fwd || side) {
    const dir = new THREE.Vector3(side, 0, -fwd).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), player.yaw);
    const inCafeZ = cafeDoor.z && player.pos.z > cafeDoor.za && player.pos.z < cafeDoor.zb;
    const inRestZ = restroom.rz0 && player.pos.z > restroom.rz0 && player.pos.z < restroom.rz1;
    const inSchoolZ = player.pos.z > 4.1 && player.pos.z < 25.9;      // walls and the gate do the rest
    const inStation = player.fy > 1 || (player.pos.z > STA.zS + .2 && player.pos.z < STA.zN - .2);
    const nx = THREE.MathUtils.clamp(player.pos.x + dir.x * speed * dt, inSchoolZ ? -27.6 : -5.6, inCafeZ ? (inRestZ ? restroom.x1 - .3 : 13.8) : inStation ? 115 : 5.6);
    const nz = THREE.MathUtils.clamp(player.pos.z + dir.z * speed * dt, WALK_MIN, WALK_MAX);
    moveTo(nx, player.pos.z);
    moveTo(player.pos.x, nz);
    player.bob += dt * speed * 2.2;
  }
  // the escalator carries you up while you stand on it
  if (!seated && !seatAnim && !actAnim && player.fy > .1 && player.pos.x > STA.mid && player.pos.x < STA.x1 && player.pos.z > STA.zBot - .3 && player.pos.z < STA.zTop) moveTo(player.pos.x, player.pos.z + .55 * dt);
  if (escalatorTex) escalatorTex.offset.y = (escalatorTex.offset.y - dt * .55 / .4) % 1;
  // the station's automatic doors
  if (staDoor.panels.length) {
    const near = player.fy < 1 && Math.abs(player.pos.x - 6.1) < 2.2 && Math.abs(player.pos.z - staDoor.z) < 2.0;
    staDoor.open += ((near ? 1 : 0) - staDoor.open) * Math.min(1, dt * 5);
    for (const p of staDoor.panels) p.g.position.z = p.home + p.dir * staDoor.open * p.slide;
  }
  // restroom door swings open into the restroom
  if (restroom.door) { restroom.open += (restroom.target - restroom.open) * Math.min(1, dt * 4); restroom.door.rotation.y = restroom.open * 1.5; }
  // automatic sliding door
  if (cafeDoor.panels.length) {
    const near = Math.abs(player.pos.x - cafeDoor.x) < 2.2 && Math.abs(player.pos.z - cafeDoor.z) < 2.0;
    cafeDoor.open += ((near ? 1 : 0) - cafeDoor.open) * Math.min(1, dt * 5);
    for (const p of cafeDoor.panels) p.g.position.z = p.home + p.dir * cafeDoor.open * p.slide;
  }
  // classroom sliding doors
  for (const d of slideDoors) { d.open += (d.target - d.open) * Math.min(1, dt * 5); d.g.position.z = d.home + d.dir * d.open * d.slide; }
  const area = areaAt(player.pos.x, player.pos.z);
  if (area !== frame.inside) { frame.inside = area; document.querySelector('.badge').innerHTML = AREA_BADGE[area]; }
  // floor height under you: road, sidewalk, or the school's raised floor (eased, so the step up is smooth)
  const floorY = player.fy;
  frame.fy = frame.fy === undefined ? floorY : frame.fy + (floorY - frame.fy) * Math.min(1, dt * 12);
  const onWalk = frame.fy;
  updateSeatPrompt();
  camera.position.set(player.pos.x, eyeY + onWalk + (seated || seatAnim ? 0 : Math.sin(player.bob) * .03), player.pos.z);
  camera.rotation.set(player.pitch, player.yaw, 0);
  sky.position.copy(camera.position);
  // keep the sun's shadow box around you, moving it in whole shadow-map texels
  // (any other step shifts the texel grid and makes small shadows shimmer as you walk)
  placeSun(player.pos.z - 15);
  sky.material.uniforms.time.value = t;
  updateLife(dt);
  updatePeople3d(dt);
  if (train) updateTrain(dt);
  const on = Math.sin(t * 6) > 0;
  for (const m of blinkers) m.emissiveIntensity = (on ? 1 : .15) * (TIMES[current].night ? 2.2 : 1.2);
  if ((lightTimer -= dt) <= 0) {                // move the night lights to the nearest lamps
    lightTimer = .4;
    const near = lampPositions.slice().sort((a, b) => a.distanceToSquared(camera.position) - b.distanceToSquared(camera.position));
    nightLights.forEach((l, i) => { if (near[i]) l.position.copy(near[i]); l.intensity = TIMES[current].night * 10; });
  }
  composer.render();
  requestAnimationFrame(frame);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
});

Promise.race([
  Promise.all([document.fonts.load('900 64px "Zen Maru Gothic"', '日本語学校さくら書店カフェ止まれ' + SCHOOL_GLYPHS + STATION_GLYPHS), document.fonts.load('700 64px "Zen Maru Gothic"', 'COFFEE' + SCHOOL_GLYPHS + STATION_GLYPHS), document.fonts.load('600 64px "Klee One"', '日本語学校本日' + SCHOOL_GLYPHS)]),
  new Promise(r => setTimeout(r, 4000))
]).then(() => {
  buildStreet();
  buildColliders();
  mergeStatic();
  setTime(params.get('t') && TIMES[params.get('t')] ? params.get('t') : 'hiru');
  const c = params.get('cam');
  if (c) { const [x, z, yaw, pitch, y = 0] = c.split(',').map(Number); player.pos.set(x, 0, z); player.yaw = yaw; player.pitch = pitch; player.fy = floorAt(x, z, y) ?? groundY(x, z); }
  else if (!params.has('bench')) player.pos.set(0, 0, 27), player.yaw = 0, player.pitch = .05, player.fy = floorAt(player.pos.x, player.pos.z, 0) ?? groundY(player.pos.x, player.pos.z);   // you start in the street, school on the left, café on the right
  else if (START.seat) {
    // Day 1 opens with you waking up on the bench outside みなと駅, looking up toward the station sign
    const s = START.seat;
    seated = { seat: s, from: START.from.clone() };
    player.pos.set(s.x, 0, s.z); eyeY = s.eye; player.yaw = 2.7; player.pitch = .12;
  }
  document.getElementById('loading').remove();
  if (params.has('debug')) Object.assign(window, { player, TRAIN, STA, floorAt, blocked, people3d, cafeDoor });
  frame();
});
