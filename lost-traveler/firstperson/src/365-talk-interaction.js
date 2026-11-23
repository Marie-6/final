// ---------------------------------------------------------------- talk: visual-novel conversations with 2D portraits
// No people stand in the world. Using a talk spot (E) opens a conversation over the game: the street dims and blurs,
// the speaker's portrait slides in on the right, their name sits bottom left (？？？ until they introduce themselves),
// and each line types out in Japanese with furigana, with romaji · English (or 中文) under it. Some lines offer replies.
//
// A script: { who: 'tanaka', name: '田中先生', start?, again?, lines: [ line, … ] }
// A line:   { id?, by: 'npc' | 'me' | 'narr', jp: 'はじめまして。{田中|たなか}です。', ro, en, zh,
//             face?: 'smile',          → art/portraits/tanaka-smile.png (then tanaka.png, then a placeholder silhouette)
//             introduce?: true,        → after this line the name shows instead of ？？？
//             choices?: [{ jp, ro, en, zh, next }],   next?: 'id',   end?: true }
const talkMet = new Set();
let talking = null;
const talkEl = (() => {
  const st = document.createElement('style');
  st.textContent = `
#talk{position:fixed;inset:0;z-index:20;display:none;color:#fff;font-family:var(--font);user-select:none;-webkit-user-select:none}
#talk.on{display:block}
#talk .bd{position:absolute;inset:0;background:rgba(12,18,34,.32);backdrop-filter:blur(7px) saturate(.75) brightness(.72);-webkit-backdrop-filter:blur(7px) saturate(.75) brightness(.72);opacity:0;transition:opacity .35s}
#talk.show .bd{opacity:1}
#talk.live .bd{backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent}
#talk .pt{position:absolute;right:5vw;bottom:0;height:min(94vh,1150px);max-width:62vw;object-fit:contain;object-position:bottom right;opacity:0;transform:translateX(48px);transition:opacity .45s,transform .45s,filter .3s;pointer-events:none;filter:drop-shadow(0 10px 30px rgba(0,0,0,.35))}
#talk .pt.in{opacity:1;transform:none}
#talk .pt.dim{filter:brightness(.55) drop-shadow(0 10px 30px rgba(0,0,0,.35))}
#talk .band{position:absolute;left:0;right:0;bottom:0;padding:56px 6vw calc(30px + env(safe-area-inset-bottom,0px));background:linear-gradient(to top,rgba(8,12,24,.88),rgba(8,12,24,.6) 55%,transparent);display:grid;grid-template-columns:minmax(96px,15vw) 1fr;gap:3vw;align-items:start}
#talk .nm{font-weight:900;font-size:clamp(18px,2.3vw,30px);letter-spacing:.14em;padding-top:.5em;text-shadow:0 2px 8px rgba(0,0,0,.55);white-space:nowrap}
#talk .jp{font-size:clamp(20px,2.5vw,34px);font-weight:700;line-height:2;min-height:2em;text-shadow:0 2px 8px rgba(0,0,0,.55);max-width:min(900px,60vw)}
#talk .jp rt{font-size:.42em;font-weight:500;letter-spacing:.05em}
#talk .sub{font-size:clamp(13px,1.35vw,17px);color:var(--sign-dim);min-height:1.4em;opacity:0;transition:opacity .25s;max-width:min(900px,60vw)}
#talk .sub.in{opacity:1}
#talk .nx{position:absolute;right:6vw;bottom:calc(20px + env(safe-area-inset-bottom,0px));font-size:14px;opacity:0;animation:talkNx 1s ease-in-out infinite}
#talk .nx.in{opacity:.8}
@keyframes talkNx{50%{transform:translateY(4px)}}
#talk .ch{position:absolute;left:6vw;bottom:calc(210px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:10px;width:min(520px,calc(100% - 32px))}
#talk .ch button{display:flex;gap:12px;align-items:flex-start;text-align:left;background:rgba(243,247,244,.95);color:var(--navy);border-radius:12px;padding:11px 16px;font-weight:700;font-size:clamp(16px,1.6vw,20px);box-shadow:0 8px 24px rgba(0,0,0,.3);transition:transform .15s}
#talk .ch button:hover{transform:translateX(6px)}
#talk .ch button kbd{margin-top:3px;background:var(--navy);color:var(--sign)}
#talk .ch button small{display:block;font-weight:500;color:var(--muted);font-size:13px;margin-top:2px}
#talk .ch rt{font-size:.5em}
#talk .x{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));right:16px;background:rgba(8,12,24,.55);color:#fff;border-radius:999px;padding:6px 14px;font-weight:700;font-size:13px}
@media (max-width:640px){
  #talk .pt{right:-6vw;max-width:96vw;height:78vh}
  #talk .band{grid-template-columns:1fr;gap:2px;padding:40px 16px calc(24px + env(safe-area-inset-bottom,0px))}
  #talk .nm{padding-top:0}
  #talk .jp,#talk .sub{max-width:none}
  #talk .ch{left:16px;bottom:calc(190px + env(safe-area-inset-bottom,0px))}
}`;
  document.head.appendChild(st);
  const el = document.createElement('div'); el.id = 'talk'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Conversation');
  el.innerHTML = '<div class="bd"></div><img class="pt" alt=""><div class="band"><div class="nm"></div><div><div class="jp" aria-live="polite"></div><div class="sub"></div></div></div><div class="ch"></div><div class="nx">▼</div><button class="x" type="button">✕ Esc</button>';
  document.body.appendChild(el);
  return el;
})();
const talkQ = s => talkEl.querySelector(s);
// a soft silhouette, shown until the real portrait art exists
const TALK_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C5D0E6" stop-opacity=".55"/><stop offset="1" stop-color="#C5D0E6" stop-opacity=".15"/></linearGradient></defs><g fill="url(#g)" stroke="#fff" stroke-opacity=".35" stroke-width="3"><path d="M40 1000 C60 760 170 680 300 680 C430 680 540 760 560 1000Z M262 600 h76 v90 h-76z"/><ellipse cx="300" cy="470" rx="140" ry="175"/></g><text x="300" y="500" font-size="120" text-anchor="middle" fill="#fff" fill-opacity=".5" font-family="sans-serif" font-weight="700">?</text></svg>`);
const talkMissing = new Set();
function talkPortrait(who, face) {
  const tries = [face && `art/portraits/${who}-${face}.png`, `art/portraits/${who}.png`].filter(p => p && !talkMissing.has(p));
  const img = talkQ('.pt'), want = tries[0] || TALK_PLACEHOLDER;
  if (img.dataset.src === want) return;
  img.dataset.src = want;
  img.onerror = () => { talkMissing.add(want); img.dataset.src = ''; talkPortrait(who, face); };
  img.src = want;
}
// {漢字|かんじ} → <ruby>; returns tokens so the typewriter can reveal them one character at a time
function talkTokens(s) {
  const out = [];
  s.replace(/\{([^|}]+)\|([^}]+)\}|([^{]+)/g, (m, b, r, plain) => { if (b) out.push({ b, r }); else for (const ch of plain) out.push({ b: ch }); return m; });
  return out;
}
const talkRuby = toks => toks.map(t => t.r ? `<ruby>${t.b}<rt>${t.r}</rt></ruby>` : t.b.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))).join('');
const talkSub = o => lang === 'en' ? [o.ro, o.en].filter(Boolean).join(' · ') : (o.zh || o.en || '');

function startTalk(script) {
  if (talking) return;
  if (locked()) document.exitPointerLock();
  keys.clear(); hold.fwd = hold.back = 0;
  const met = talkMet.has(script.who);
  talking = { script, i: 0, known: met, typing: null };
  talkEl.classList.toggle('live', !!people3d[script.who]);   // 3D people stay sharp in the world (315-people-3d.js)
  talkEl.classList.add('on'); requestAnimationFrame(() => talkEl.classList.add('show'));
  talkGo(met && script.again ? script.again : script.start || 0);
}
function endTalk() {
  if (!talking) return;
  clearInterval(talking.typing); clearTimeout(talking.waitVoice);
  stopVoice(); talkMicStop(); talkMicSay('');   // 3655-talk-mic.js
  talkEl.classList.remove('show'); talkQ('.pt').classList.remove('in');
  talking = null;
  setTimeout(() => { if (!talking) talkEl.classList.remove('on'); }, 350);
}
function talkFind(id) { const L = talking.script.lines; return typeof id === 'number' ? id : L.findIndex(l => l.id === id); }
function talkGo(id) {
  const T = talking, i = talkFind(id);
  if (!T || i < 0 || i >= T.script.lines.length) return endTalk();
  T.i = i; talkShow(T.script.lines[i]);
}
function talkShow(line, after) {
  const T = talking, S = T.script, by = line.by || 'npc';
  talkMicStop();   // 3655-talk-mic.js
  const name = by === 'me' ? (lang === 'en' ? 'あなた' : 'あなた') : by === 'narr' ? '' : T.known ? S.name : '？？？';
  talkQ('.nm').textContent = name;
  const pt = talkQ('.pt');
  if (people3d[S.who] || (by === 'narr' && !T.shown)) pt.classList.remove('in');   // 3D people need no portrait
  else { talkPortrait(S.who, line.face); pt.classList.add('in'); T.shown = true; }
  pt.classList.toggle('dim', by === 'me');
  talkQ('.ch').innerHTML = ''; talkQ('.nx').classList.remove('in');
  const sub = talkQ('.sub'); sub.classList.remove('in'); sub.textContent = talkSub(line);
  const toks = talkTokens(line.jp), jp = talkQ('.jp');
  let n = 0;
  clearInterval(T.typing);
  T.line = line; T.after = after; T.done = false; T.hold = !!line.wait;   // wait: the line stays until talkRelease()
  jp.innerHTML = '';
  T.finish = () => { clearTimeout(T.waitVoice); n = toks.length; jp.innerHTML = talkRuby(toks); };
  // the text types in step with the voice: each token weighs as much as its reading (漢字 → かんじ = 3),
  // and the whole line is spread over the length of the spoken clip
  const w = toks.map(t => /[。、！？!?…]/.test(t.b) ? 3 : (t.r || t.b).length), total = w.reduce((a, b) => a + b, 0) || 1;
  const startTyping = ms => {
    if (talking !== T || T.line !== line || T.done || T.typing) return;
    clearTimeout(T.waitVoice);
    const span = ms ? ms * .92 : total * 38, t0 = performance.now();
    T.typing = setInterval(() => {
      const f = (performance.now() - t0) / span * total;
      let k = 0, acc = 0; while (k < toks.length && acc + w[k] <= f) acc += w[k++];
      if (k !== n) { n = k; jp.innerHTML = talkRuby(toks.slice(0, n)); }
      if (n >= toks.length) talkFinish();
    }, 30);
  };
  T.typing = null;
  if (by === 'npc') {                                       // 364-voice.js (your own replies stay silent)
    T.waitVoice = setTimeout(() => startTyping(null), 4000);  // the voice never came: type anyway
    speak(line.jp, S.who, undefined, startTyping);
  } else startTyping(null);
}
function talkFinish() {
  const T = talking; if (!T || T.done) return;
  clearInterval(T.typing); T.finish(); T.done = true;
  talkQ('.sub').classList.add('in');
  const line = T.line;
  if (line.introduce) T.known = true, talkMet.add(T.script.who);
  if (line.choices && !T.after) {
    talkQ('.ch').innerHTML = line.choices.map((c, k) => `<button type="button" data-k="${k}"><kbd>${k + 1}</kbd><span>${talkRuby(talkTokens(c.jp))}<small>${talkSub(c)}</small></span></button>`).join('');
    talkMicListen();   // say your reply out loud (3655-talk-mic.js)
  } else if (!T.hold) talkQ('.nx').classList.add('in');
}
// a `wait` line (e.g. the barista making your coffee) moves on by itself when the scene is done
function talkRelease() { const T = talking; if (!T || !T.hold) return; T.hold = false; talkFinish(); talkNext(); }
function talkChoose(k) {
  const T = talking, c = T && T.done && T.line.choices && !T.after && T.line.choices[k];
  if (!c) return;
  talkShow({ by: 'me', jp: c.jp, ro: c.ro, en: c.en, zh: c.zh }, c.next);   // you say your reply, then the story goes on
}
function talkNext() {
  const T = talking; if (!T) return;
  if (T.hold) return;                                                       // something is still happening
  if (!T.done) return talkFinish();
  if (T.line.choices && !T.after) return;                                   // waiting for a reply
  if (T.after !== undefined) return talkGo(T.after);
  if (T.line.end) return endTalk();
  talkGo(T.line.next !== undefined ? T.line.next : T.i + 1);
}
talkEl.addEventListener('click', e => {
  if (e.target.closest('.x')) return endTalk();
  const b = e.target.closest('.ch button');
  if (b) return talkChoose(+b.dataset.k);
  talkNext();
});
// while talking, the keyboard belongs to the conversation (no walking, no other E actions)
addEventListener('keydown', e => {
  if (!talking) return;
  e.stopImmediatePropagation(); e.preventDefault();
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (k === 'escape') endTalk();
  else if (k === ' ' || k === 'enter' || k === 'e') talkNext();
  else if (k >= '1' && k <= '9') talkChoose(+k - 1);
  else if (k === 'm') talkMicToggle();   // 3655-talk-mic.js
}, true);
// a place in the world where pressing E starts a conversation
function addTalkSpot(x, z, reach, verb, script, y = 0) {
  addAction(x, z, reach, () => verb, () => startTalk(script), () => !talking, y);
}
