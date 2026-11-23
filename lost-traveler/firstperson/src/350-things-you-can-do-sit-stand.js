// ---------------------------------------------------------------- things you can do: sit, stand, pour, drink, open, flush, wash
// each verb is shown with its reading, so the prompt itself teaches the word
const VERBS = {
  suwaru: { r: [['座', 'すわ'], ['る', '']], ro: 'suwaru', en: 'Sit down', zh: '坐下' },
  tatsu: { r: [['立', 'た'], ['つ', '']], ro: 'tatsu', en: 'Stand up', zh: '站起来' },
  sosogu: { r: [['水', 'みず'], ['を', ''], ['注', 'そそ'], ['ぐ', '']], ro: 'mizu o sosogu', en: 'Pour some water', zh: '倒水' },
  nomu: { r: [['飲', 'の'], ['む', '']], ro: 'nomu', en: 'Drink', zh: '喝' },
  kau: { r: [['飲', 'の'], ['み', ''], ['物', 'もの'], ['を', ''], ['買', 'か'], ['う', '']], ro: 'nomimono o kau', en: 'Buy a drink', zh: '买饮料' },
  akeru: { r: [['開', 'あ'], ['ける', '']], ro: 'akeru', en: 'Open the door', zh: '开门' },
  shimeru: { r: [['閉', 'し'], ['める', '']], ro: 'shimeru', en: 'Close the door', zh: '关门' },
  nagasu: { r: [['流', 'なが'], ['す', '']], ro: 'nagasu', en: 'Flush', zh: '冲水' },
  arau: { r: [['手', 'て'], ['を', ''], ['洗', 'あら'], ['う', '']], ro: 'te o arau', en: 'Wash your hands', zh: '洗手' },
};
let seated = null, seatTarget = null, seatAnim = null, actAnim = null, holding = null, eyeY = 1.62, seatLabel = '';
const seatBtn = document.getElementById('seat');
const angleTo = (a, b) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a));      // b, unwrapped to be near a
function sitDown(s) {
  seated = { seat: s, from: player.pos.clone() };
  seatAnim = { t: 0, a: player.pos.clone(), b: new THREE.Vector3(s.x, 0, s.z), ya: eyeY, yb: s.eye, yawA: player.yaw, yawB: angleTo(player.yaw, s.yaw), pA: player.pitch, pB: -.08 };
}
function standUp() {
  seatAnim = { t: 0, a: player.pos.clone(), b: seated.from.clone(), ya: eyeY, yb: 1.62, yawA: player.yaw, yawB: player.yaw, pA: player.pitch, pB: player.pitch };
  seated = null;
}
// a short scripted moment (pouring, flushing...): you stay put while it plays
function playAnim(dur, step, end) { actAnim = { t: 0, dur, step, end }; }
function pourWater() {
  const W = water, g = W.glass, p = W.pitcher, spot = W.spot, home = W.home, gh = W.glassHome;
  const pourAt = new THREE.Vector3(spot.x, spot.y + .165, spot.z - .3);
  const lerp = (a, b, k) => a + (b - a) * k, ss = k => k * k * (3 - 2 * k), seg = (k, a, b) => Math.min(1, Math.max(0, (k - a) / (b - a)));
  playAnim(3.0, k => {
    const g1 = ss(seg(k, 0, .12));                                          // take a glass from the tray
    g.position.set(lerp(gh.x, spot.x, g1), gh.y + Math.sin(g1 * Math.PI) * .08, lerp(gh.z, spot.z, g1));
    const p1 = ss(seg(k, .12, .3)) - ss(seg(k, .72, .88));                   // pitcher over the glass, tilt, back
    p.position.set(lerp(home.x, pourAt.x, p1), lerp(home.y, pourAt.y, p1), lerp(home.z, pourAt.z, p1)); p.rotation.x = p1 * 1.0;
    const f = seg(k, .32, .7);                                              // the water runs and the glass fills
    W.stream.visible = f > 0 && f < 1;
    if (W.stream.visible) { W.stream.position.set(spot.x, spot.y + .205, spot.z); W.stream.scale.y = .17; }
    W.glassWater.scale.y = Math.max(.001, f); W.pitcherWater.scale.y = 1 - f * .25;
    const h = ss(seg(k, .88, 1));                                           // pick it up
    g.position.y = spot.y + h * .3; g.visible = h < .95;
  }, () => {
    W.glass.position.copy(gh); W.glass.visible = true; W.glassWater.scale.y = .001; W.pitcherWater.scale.y = 1;   // a fresh glass on the tray
    holdGlass();
  });
}
function holdGlass() {
  if (!camera.parent) scene.add(camera);
  const hg = new THREE.Group(); hg.position.set(.2, -.2, -.45); camera.add(hg);
  mesh(new THREE.CylinderGeometry(.035, .03, .1, 12), new THREE.MeshStandardMaterial({ color: '#E4F2F8', transparent: true, opacity: .3, roughness: .05, depthWrite: false }), 0, 0, 0, hg, false);
  const w = mesh(new THREE.CylinderGeometry(.03, .026, .08, 12), new THREE.MeshStandardMaterial({ color: '#BFE2F2', transparent: true, opacity: .65, roughness: .05 }), 0, -.045, 0, hg, false); w.geometry.translate(0, .04, 0);
  holding = { g: hg, w };
}
function drink() {
  const H = holding; if (!H) return;
  playAnim(1.6, k => {
    const up = Math.min(1, k / .3), down = Math.max(0, (k - .8) / .2);
    H.g.position.set(.2 - up * .2, -.2 + up * .12 - down * .3, -.45 + up * .18);
    H.g.rotation.x = up * .9 * (1 - down);
    if (H.w) H.w.scale.y = Math.max(.001, 1 - Math.max(0, (k - .25) / .5));
  }, () => { camera.remove(H.g); holding = null; if (H.drink) toast(lang === 'en' ? 'ごちそうさま！ · gochisōsama · That hit the spot!' : 'ごちそうさま！ · 我喝完了，谢谢款待', 2000); });
}
