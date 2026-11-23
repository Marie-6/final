// ---------------------------------------------------------------- vending machine: choose, ガコン, pick it up, drink
const vendEl = document.getElementById('vend'), toastEl = document.getElementById('toast');
let vendOpen = null, toastTimer = 0;
const rubyHTML = r => r.map(([k, rt]) => rt ? `<ruby>${k}<rt>${rt}</rt></ruby>` : k).join('');
function toast(html, ms = 1800) { toastEl.innerHTML = html; toastEl.style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.style.display = 'none', ms); }
function openVend(m) {
  vendOpen = m; if (locked()) document.exitPointerLock();
  const en = lang === 'en', seen = new Set(), items = [];
  for (const row of m.th.lineup) for (const it of row) { const k = it.id + it.hot; if (!seen.has(k)) { seen.add(k); items.push(it); } }
  m.items = items.slice(0, 9 * 2);
  document.getElementById('vendJp').innerHTML = rubyHTML([['どれにする', ''], ['？', '']]);
  document.getElementById('vendSub').textContent = en ? 'dore ni suru? · Which one? (click one, or press its number)' : '要哪一个？（点一下，或按数字键）';
  document.getElementById('vendGrid').innerHTML = m.items.map((it, i) => { const d = DRINKS[it.id]; return `<button class="it" data-i="${i}">${i < 9 ? `<span class="num">${i + 1}</span>` : ''}<img src="${drinkThumb(it.id)}" alt=""><span>${rubyHTML(d.r)}</span><span class="en">${en ? d.en : d.zh}</span><span class="pr"><span class="tag ${it.hot ? 'hot' : 'cold'}">${it.hot ? 'あたたか〜い' : 'つめた〜い'}</span>¥${d.price}</span></button>`; }).join('');
  vendEl.style.display = 'block';
}
function closeVend() { vendOpen = null; vendEl.style.display = 'none'; }
document.getElementById('vendClose').onclick = closeVend;
document.getElementById('vendGrid').addEventListener('click', e => { const b = e.target.closest('.it'); if (b && vendOpen) buyDrink(vendOpen, vendOpen.items[+b.dataset.i]); });
addEventListener('keydown', e => {
  if (!vendOpen) return;
  if (e.key === 'Escape') closeVend();
  const n = +e.key; if (n >= 1 && n <= 9 && vendOpen.items[n - 1]) buyDrink(vendOpen, vendOpen.items[n - 1]);
});
function buyDrink(m, it) {
  closeVend();
  const d = DRINKS[it.id], dm = drinkModel(d); scene.add(dm);
  m.g.updateMatrixWorld();
  const out = m.g.localToWorld(new THREE.Vector3(0, .2, .48)), top = m.g.localToWorld(new THREE.Vector3(0, .75, .48));
  const ss = k => k * k * (3 - 2 * k), seg = (k, a, b) => Math.min(1, Math.max(0, (k - a) / (b - a)));
  const yaw = m.g.rotation.y; dm.rotation.set(Math.PI / 2, 0, 0); dm.rotation.order = 'YXZ'; dm.rotation.y = yaw + Math.PI / 2;
  toast(`¥${d.price} … <b>ガコン！</b>`, 1400);
  playAnim(2.0, k => {
    const f = seg(k, .15, .4);                                          // it drops into the tray and settles
    dm.visible = k > .15;
    dm.position.lerpVectors(top, out, f * f); dm.position.y += f >= 1 ? Math.abs(Math.sin(seg(k, .4, .5) * Math.PI)) * .03 : 0;
    const p = ss(seg(k, .6, 1));                                        // you reach down and pick it up
    if (p > 0) {
      camera.updateMatrixWorld();
      const hand = camera.localToWorld(new THREE.Vector3(.17, -.15 - dm.userData.h * .35, -.45));
      dm.scale.setScalar(1 - .3 * p);
      dm.position.lerpVectors(out, hand, p); dm.rotation.x = Math.PI / 2 * (1 - p); dm.rotation.y = (yaw + Math.PI / 2) * (1 - p) + player.yaw * p;
    }
  }, () => { scene.remove(dm); holdDrink(d, it.hot); toast(`${rubyHTML(d.r)} ${it.hot ? '(あたたか〜い)' : '(つめた〜い)'}`, 2200); });
}
function holdDrink(d, hot) {
  if (!camera.parent) scene.add(camera);
  const hg = new THREE.Group(); hg.position.set(.2, -.2, -.45); camera.add(hg);
  const dm = drinkModel(d); dm.scale.setScalar(.7); dm.position.y = -dm.userData.h * .35; hg.add(dm); hg.position.set(.17, -.15, -.45);
  holding = { g: hg, drink: d, hot };
}

function toggleSeat() {
  if (vendOpen) return;
  if (seatAnim || actAnim) return;
  if (seated) standUp();
  else if (seatTarget) seatTarget.seat ? sitDown(seatTarget.seat) : seatTarget.act();
  else if (holding) drink();
}
addEventListener('keydown', e => { if (e.key.toLowerCase() === 'e' && !e.repeat) toggleSeat(); });
seatBtn.addEventListener('click', toggleSeat);
function findTarget() {
  const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw);
  let best = null, bd = 99;
  const consider = (x, z, reach, t) => {
    if (Math.abs(((t.seat || t).y || 0) - player.fy) > 1.5) return;          // on another floor (the platform, the street)
    const dx = x - player.pos.x, dz = z - player.pos.z, d = Math.hypot(dx, dz);
    if (d > reach) return;
    const dot = d > .01 ? (dx * fx + dz * fz) / d : 1;
    if (d > .35 && dot < .55) return;                                          // it has to be roughly in front of you
    const score = d * (1.6 - dot);                                             // closer and more straight ahead wins
    if (score < bd) { best = t; bd = score; }
  };
  for (const s of seats) if (!s.when || s.when()) consider(s.x, s.z, 1.5, { seat: s });
  for (const a of actions) if (!a.when || a.when()) consider(a.x, a.z, a.reach, a);
  return best;
}
function updateSeatPrompt() {
  seatTarget = seated || seatAnim || actAnim ? null : findTarget();
  const key = seated ? 'tatsu' : seatTarget ? (seatTarget.seat ? 'suwaru' : seatTarget.word()) : holding && !actAnim ? 'nomu' : '';
  const v = VERBS[key], en = lang === 'en';
  const label = v ? `<kbd>E</kbd>${v.r.map(([k, r]) => r ? `<ruby>${k}<rt>${r}</rt></ruby>` : k).join('')} ${en ? `${v.ro} · ${v.en}` : `· ${v.zh}`}` : '';
  if (label !== seatLabel) { seatLabel = label; seatBtn.innerHTML = label; }
  seatBtn.style.display = label && !seatAnim && !actAnim ? 'block' : 'none';
}

