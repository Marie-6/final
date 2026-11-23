// ================================================================ tappable signs
const tappables = [];
function sign(o, x, y, z, rotY, info, parent = scene) {
  const tex = o.tex || signTex(o);
  const mat = glowMat(tex, tex, o.day ?? .25, o.night ?? .6, o.cutout ? { alphaTest: .5 } : {});
  const g = new THREE.Group();
  const front = new THREE.Mesh(new THREE.PlaneGeometry(o.w, o.h), mat);
  g.add(front);
  if (o.double) { const back = new THREE.Mesh(front.geometry, mat); back.rotation.y = Math.PI; back.position.z = -0.05; g.add(back); }
  if (o.frame !== false) {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(o.w + .08, o.h + .08, o.double ? .04 : .07), std(o.frameColor || '#5B5F6B'));
    fr.position.z = o.double ? -.025 : -.04; fr.castShadow = true; g.add(fr);
  }
  g.position.set(x, y, z); g.rotation.y = rotY;
  parent.add(g);
  if (info) g.children.forEach(c => { c.userData.info = info; tappables.push(c); dynamic.add(c); });
  return g;
}

