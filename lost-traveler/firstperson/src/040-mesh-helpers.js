// ---------------------------------------------------------------- mesh helpers
const dynamic = new Set();      // meshes that must not be merged (moving / tappable)
function mesh(geo, mat, x, y, z, parent = scene, cast = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = cast; m.receiveShadow = true;
  parent.add(m);
  return m;
}
const box = (w, h, d, mat, x, y, z, parent, cast) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent, cast);
const cyl = (rt, rb, h, mat, x, y, z, seg = 12, parent, cast) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z, parent, cast);
const group = (x, y, z, ry = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; scene.add(g); return g; };

