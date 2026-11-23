// ================================================================ the road
function ground() {
  const len = Z_NEAR - Z_FAR, zc = (Z_NEAR + Z_FAR) / 2;
  const asphalt = canvasTex(512, 1024, (g, w, h) => {
    g.fillStyle = '#6A6E7C'; g.fillRect(0, 0, w, h); speckle(g, w, h, .07, 16000);
    // tire wear and patches
    for (const tx of [.27, .73]) { const gr = g.createLinearGradient(w * (tx - .08), 0, w * (tx + .08), 0); gr.addColorStop(0, 'rgba(30,30,40,0)'); gr.addColorStop(.5, 'rgba(30,30,40,.12)'); gr.addColorStop(1, 'rgba(30,30,40,0)'); g.fillStyle = gr; g.fillRect(w * (tx - .08), 0, w * .16, h); }
    for (let i = 0; i < 9; i++) { g.strokeStyle = 'rgba(35,35,45,.3)'; g.lineWidth = 1.5; g.beginPath(); let x = rand() * w, y = rand() * h; g.moveTo(x, y); for (let k = 0; k < 7; k++) { x += (rand() - .5) * 50; y += rand() * 40; g.lineTo(x, y); } g.stroke(); }
  }, [1, len / 14]);
  const road = mesh(new THREE.PlaneGeometry(ROAD * 2, len), std('#ffffff', { map: asphalt, roughness: .95 }), 0, 0, zc, scene, false);
  road.rotation.x = -Math.PI / 2;

  const paint = std('#F2F0E8', { roughness: .7 });
  const flat = (w, d, x, z, y = .012) => { const m = mesh(new THREE.PlaneGeometry(w, d), paint, x, y, z, scene, false); m.rotation.x = -Math.PI / 2; return m; };
  flat(.13, len, -ROAD + .45, zc); flat(.13, len, ROAD - .45, zc);
  for (let z = Z_NEAR; z > Z_FAR; z -= 6) if (Math.abs(z - 2.5) > 3 && Math.abs(z + 132) > 6) flat(.13, 3, 0, z);
  for (const cz of [2.5, -60, -170]) for (let i = 0; i < 7; i++) flat(.5, 3.4, -2.7 + i * .9, cz);
  // ◇ crosswalk-ahead diamonds
  for (const [dx, dz] of [[-1.6, 12], [1.6, 16], [-1.6, -50], [1.6, -45]]) {
    const d = new THREE.Shape(); d.moveTo(0, 1.6); d.lineTo(.7, 0); d.lineTo(0, -1.6); d.lineTo(-.7, 0); d.lineTo(0, 1.6);
    const hole = new THREE.Path(); hole.moveTo(0, 1.25); hole.lineTo(.5, 0); hole.lineTo(0, -1.25); hole.lineTo(-.5, 0); hole.lineTo(0, 1.25); d.holes.push(hole);
    const m = mesh(new THREE.ShapeGeometry(d), paint, dx, .013, dz, scene, false); m.rotation.x = -Math.PI / 2;
  }
  // 止まれ painted on the road before the railroad crossing
  const tomareTex = canvasTex(256, 512, (g, w, h) => { g.fillStyle = '#F2F0E8'; g.font = '900 220px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('止', w / 2, h * .24); g.fillText('まれ', w / 2, h * .7); });
  const tm = mesh(new THREE.PlaneGeometry(1.4, 2.8), std('#fff', { map: tomareTex, transparent: true, alphaTest: .3 }), 1.6, .014, -124, scene, false); tm.rotation.set(-Math.PI / 2, 0, Math.PI);
  flat(3.2, .4, 1.6, -126.3);
  // manholes
  const mh = canvasTex(128, 128, (g, w) => { g.fillStyle = '#4A4C55'; g.beginPath(); g.arc(64, 64, 63, 0, 7); g.fill(); g.strokeStyle = '#6B6E78'; g.lineWidth = 4; for (let r = 14; r < 60; r += 12) { g.beginPath(); g.arc(64, 64, r, 0, 7); g.stroke(); } for (let a = 0; a < 8; a++) { g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.cos(a * .785) * 60, 64 + Math.sin(a * .785) * 60); g.stroke(); } });
  for (let z = 40; z > -230; z -= 23) { const m = mesh(new THREE.CircleGeometry(.4, 24), std('#fff', { map: mh, roughness: .6, metalness: .3 }), range(-1.5, 1.5), .014, z, scene, false); m.rotation.x = -Math.PI / 2; }

  const tiles = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#C3BAAC'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = shade('#D6CEC1', .9 + rand() * .14); g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); }
    speckle(g, w, h, .06, 2000);
  }, [3, len / 2.4]);
  const gutter = canvasTex(64, 256, (g, w, h) => { g.fillStyle = '#A9A49A'; g.fillRect(0, 0, w, h); g.fillStyle = '#5E5C57'; for (let y = 10; y < h; y += 64) for (let i = 0; i < 6; i++) g.fillRect(8, y + i * 7, w - 16, 3); speckle(g, w, h, .08, 300); }, [1, len / 2]);
  for (const s of [-1, 1]) {
    mesh(new THREE.BoxGeometry(WALK - ROAD, .15, len), std('#ffffff', { map: tiles }), s * (ROAD + WALK) / 2, .075, zc, scene, false);
    box(.2, .18, len, std('#B6B0A4'), s * (ROAD + .1), .09, zc, scene, false);
    const gm = mesh(new THREE.PlaneGeometry(.45, len), std('#ffffff', { map: gutter }), s * (ROAD - .22), .006, zc, scene, false); gm.rotation.x = -Math.PI / 2;
    const guide = mesh(new THREE.PlaneGeometry(.3, len), std('#E9BE2E'), s * 4.55, .153, zc, scene, false); guide.rotation.x = -Math.PI / 2;
  }
  const base = mesh(new THREE.PlaneGeometry(1200, 1200), std('#8E918C'), 0, -.03, -100, scene, false); base.rotation.x = -Math.PI / 2;
}

