// ================================================================ collisions
const colliders = [], RADIUS = .32;
function buildColliders() {
  scene.updateMatrixWorld(true);
  const bb = new THREE.Box3();
  scene.traverse(o => {
    if (!o.isMesh || o === sky || o.parent === train || o.userData.noCollide) return;
    bb.setFromObject(o);
    const upstairs = bb.max.x > 5.8 && bb.min.x < 115 && bb.max.z > -96.5 && bb.min.z < -70 && bb.min.y < STA.PL + 1.7;
    if (bb.max.y < .35 || (bb.min.y > 1.7 && !upstairs)) return;
    if (bb.max.x - bb.min.x > 40 && bb.max.z - bb.min.z > 40) return;
    colliders.push(bb.clone());
  });
}
// is something in the way at (x, z) for someone standing on a floor at height fy? (only what is at your own height)
function blocked(x, z, fy = player.fy) {
  const base = fy < 1 ? 0 : fy;
  if (fy > 5 && trainBlocked(x, z)) return true;
  const D = restroom;
  if (D.door) {
    if (D.open < .7 && x > D.x - .1 - RADIUS && x < D.x + .2 + RADIUS && z > D.z0 - RADIUS && z < D.z1 + RADIUS) return true;
    if (D.open > .3 && x > D.x && x < D.x + .9 + RADIUS && z > D.z0 - .06 - RADIUS && z < D.z0 + .06 + RADIUS) return true;
  }
  for (const d of slideDoors) if (d.open < .75 && Math.abs(x - d.x) < .12 + RADIUS && z > d.z0 - .05 && z < d.z1 + .05) return true;
  if (fy < 1) for (const m of movers) if (Math.abs(x - m.g.position.x) < 1.15 && Math.abs(z - m.g.position.z) < 2.2) return true;
  for (const b of colliders)
    if (b.max.y > base + .35 && b.min.y < base + 1.7 && x > b.min.x - RADIUS && x < b.max.x + RADIUS && z > b.min.z - RADIUS && z < b.max.z + RADIUS) return true;
  return false;
}
// step to (x, z) if there is a floor there within a step of your feet and nothing in the way
function moveTo(x, z) {
  const f = floorAt(x, z, player.fy);
  if (f === null || blocked(x, z, f)) return false;
  player.pos.x = x; player.pos.z = z; player.fy = f;
  return true;
}

