// ---------------------------------------------------------------- reading signs
const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
let lang = 'en';
const card = document.getElementById('card');
const notebook = new Set();
let shown = null;
function tapAt(x, y) {
  mouse.set(x, y);
  ray.setFromCamera(mouse, camera);
  const hit = ray.intersectObjects(tappables, false)[0];
  // a click only reads signs; sitting, standing up and actions are on E or the on-screen button
  if (!hit || hit.distance > 35) { card.style.display = 'none'; return; }
  shown = hit.object.userData.info; showCard();
  speak(shown.ruby.map(([k]) => k).join(''), 'narr');   // 364-voice.js: the narrator reads the sign aloud
  if (locked()) document.exitPointerLock();
}
function showCard() {
  const i = shown;
  document.getElementById('cardJp').innerHTML = i.ruby.map(([k, r]) => `<ruby>${k}<rt>${r || '&nbsp;'}</rt></ruby>`).join('');
  document.getElementById('cardRo').textContent = lang === 'en' ? i.ro : '';      // romaji only on the English track
  document.getElementById('cardTr').textContent = lang === 'en' ? i.en : i.zh;
  document.getElementById('saved').textContent = notebook.has(i.ro) ? (lang === 'en' ? 'In your notebook ✓' : '已在手帐里 ✓') : '';
  card.style.display = 'block';
}
document.getElementById('closeBtn').onclick = () => card.style.display = 'none';
document.getElementById('saveBtn').onclick = () => { notebook.add(shown.ro); showCard(); };
document.querySelectorAll('#lang button').forEach(b => b.onclick = () => {
  lang = b.dataset.l; document.querySelectorAll('#lang button').forEach(x => x.setAttribute('aria-pressed', x === b)); if (card.style.display === 'block') showCard();
});
document.querySelectorAll('#tod button').forEach(b => b.onclick = () => setTime(b.dataset.t));
addEventListener('keydown', e => { if (e.key === 'Escape') card.style.display = 'none'; });

