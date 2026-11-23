// ================================================================ merge static meshes (fewer draw calls)
function mergeStatic() {
  scene.updateMatrixWorld(true);
  const buckets = new Map();
  const remove = [];
  scene.traverse(o => {
    if (!o.isMesh || dynamic.has(o) || Array.isArray(o.material) || o.parent === train) return;
    let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    g.morphAttributes = {};
    const chunk = Math.floor(new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).z / 40);
    const key = o.material.uuid + '|' + chunk + '|' + o.castShadow + '|' + o.receiveShadow;
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, cast: o.castShadow, rec: o.receiveShadow, geos: [] });
    buckets.get(key).geos.push(g);
    remove.push(o);
  });
  for (const o of remove) o.parent.remove(o);
  for (const { mat, cast, rec, geos } of buckets.values()) {
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    const m = new THREE.Mesh(merged, mat);
    m.castShadow = cast; m.receiveShadow = rec;
    m.userData.noAO = !!mat.userData.foliage;
    scene.add(m);
  }
}

