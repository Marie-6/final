// ================================================================ controls
const player = { pos: new THREE.Vector3(0, 0, 40), yaw: 0, pitch: .05, bob: 0, fy: .15 };   // fy: the floor under your feet
const START = { seat: null, from: null };   // the station bench, filled in by buildStreet()
const keys = new Set();
addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());
let drag = null, moved = 0;
const cv = renderer.domElement;
const locked = () => document.pointerLockElement === cv;
const look = (dx, dy, k) => { player.yaw -= dx * k; player.pitch = THREE.MathUtils.clamp(player.pitch - dy * k, -1.2, 1.2); };
cv.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') {
    if (locked()) tapAt(0, 0);
    else { card.style.display = 'none'; closeVend(); cv.requestPointerLock(); }
    return;
  }
  drag = { x: e.clientX, y: e.clientY }; moved = 0; cv.setPointerCapture(e.pointerId);
});
cv.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse') { if (locked()) look(e.movementX, e.movementY, .0022); return; }
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy);
  look(dx, dy, .004);
  drag = { x: e.clientX, y: e.clientY };
});
cv.addEventListener('pointerup', e => {
  if (e.pointerType !== 'mouse' && drag && moved < 6) tapAt(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  drag = null;
});
document.addEventListener('pointerlockchange', () => document.body.classList.toggle('locked', locked()));
const hold = { fwd: 0, back: 0 };
for (const id of ['fwd', 'back']) {
  const b = document.getElementById(id);
  b.addEventListener('pointerdown', () => hold[id] = 1); for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => hold[id] = 0);
}

