// ---------------------------------------------------------------- talk mic: answer Tanaka-sensei or the barista by speaking
// When a conversation offers replies, the mic listens (after the other person has finished talking) and picks the reply
// that sounds most like what you said: it turns green, and the conversation goes on. The 🎤 pill (top right, or M) turns it on/off; the choice is remembered.
// Uses the browser's speech recognition (Chrome, Edge, Safari). Hooks live in 365-talk-interaction.js.
const TalkSR = window.SpeechRecognition || window.webkitSpeechRecognition;
let talkMicOn = true, talkRec = null, talkMicWait = 0, talkMicRetry = 0;
try { talkMicOn = localStorage.getItem('talkMic') !== '0'; } catch (e) {}
const TALK_MIC_UI = {
  en: { on: 'Mic on', off: 'Mic off', listening: 'Listening… say your reply', heard: 'Heard', again: "Didn't catch that. Say one of the replies.", noMic: 'Microphone not available' },
  zh: { on: '麦克风 开', off: '麦克风 关', listening: '正在听…请说出你的回答', heard: '听到', again: '没听清，请说出其中一个回答。', noMic: '无法使用麦克风' },
};
const talkMicT = k => (TALK_MIC_UI[lang] || TALK_MIC_UI.en)[k];
const talkMicEl = (() => {
  const st = document.createElement('style');
  st.textContent = `
#talk .mk{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));right:110px;display:inline-flex;align-items:center;gap:8px;background:rgba(8,12,24,.55);color:#fff;border-radius:999px;padding:6px 14px;font-weight:700;font-size:13px}
#talk .mk i{width:9px;height:9px;border-radius:50%;background:#8a8f9c}
#talk .mk.on i{background:#D8433F}
#talk .mk.live i{animation:talkMicPulse .8s ease-in-out infinite}
#talk .mk kbd{background:rgba(255,255,255,.18);color:#fff;font-size:11px}
@keyframes talkMicPulse{50%{transform:scale(1.6);opacity:.6}}
#talk .ms{position:absolute;top:calc(52px + env(safe-area-inset-top,0px));right:16px;max-width:min(420px,80vw);text-align:right;font-size:14px;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.6)}
#talk .ch button.heard{transform:translateX(10px);background:#2E9E5B;color:#fff;box-shadow:0 0 0 3px #7FD9A2,0 8px 24px rgba(0,0,0,.3)}
#talk .ch button.heard small{color:#E3F7EA}
#talk .ch button.heard kbd{background:#fff;color:#2E9E5B}`;
  document.head.appendChild(st);
  const b = document.createElement('button'); b.type = 'button'; b.className = 'mk'; b.innerHTML = '<i></i><span></span><kbd>M</kbd>';
  const s = document.createElement('div'); s.className = 'ms'; s.setAttribute('aria-live', 'polite');
  talkEl.append(b, s);
  b.addEventListener('click', e => { e.stopPropagation(); talkMicToggle(); });
  if (!TalkSR) b.style.display = 'none';
  return b;
})();
const talkMicSay = t => { talkQ('.ms').textContent = t || ''; };
function talkMicPaint() {
  talkMicEl.classList.toggle('on', talkMicOn); talkMicEl.classList.toggle('live', !!talkRec);
  talkMicEl.querySelector('span').textContent = talkMicT(talkMicOn ? 'on' : 'off');
}
talkMicPaint();
function talkMicToggle() {
  if (!TalkSR) return;
  talkMicOn = !talkMicOn;
  try { localStorage.setItem('talkMic', talkMicOn ? '1' : '0'); } catch (e) {}
  if (talkMicOn) talkMicListen(); else { talkMicStop(); talkMicSay(''); }
  talkMicPaint();
}
function talkMicStop() {
  clearTimeout(talkMicWait);
  if (talkRec) { const r = talkRec; talkRec = null; r.onend = r.onresult = r.onerror = null; try { r.abort(); } catch (e) {} }
  talkMicPaint();
}
const talkChoicesUp = () => { const T = talking; return !!(T && T.done && T.line.choices && !T.after); };
const talkVoiceBusy = () => (voiceAudio && !voiceAudio.paused) || ('speechSynthesis' in window && speechSynthesis.speaking);
// called when replies appear: wait for the other person's voice to end (so the mic doesn't hear them), then listen
function talkMicListen(retry) {
  talkMicStop();
  if (!TalkSR || !talkMicOn || !talkChoicesUp()) return;
  if (!retry) talkMicRetry = 0;
  if (talkVoiceBusy()) { talkMicWait = setTimeout(() => talkMicListen(true), 150); return; }
  const rec = talkRec = new TalkSR();
  rec.lang = 'ja-JP'; rec.maxAlternatives = 5; rec.interimResults = false;
  talkMicSay(talkMicT('listening'));
  rec.onresult = e => {
    const alts = [...e.results[0]].map(a => a.transcript), k = talkMicMatch(alts, talking.line.choices);
    if (k < 0) return talkMicSay(talkMicT('heard') + ' 「' + alts[0] + '」 ' + talkMicT('again'));
    // you've already said it out loud: the reply turns green and the other person answers (your line isn't typed out again)
    rec.onend = null; talkRec = null; talkMicPaint(); talkMicSay('');
    const btn = talkQ(`.ch button[data-k="${k}"]`); if (btn) btn.classList.add('heard');
    const c = talking.line.choices[k];
    setTimeout(() => { if (talkChoicesUp()) c.next !== undefined ? talkGo(c.next) : talkChoose(k); }, 700);
  };
  rec.onerror = e => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') {
      talkMicOn = false; talkMicSay(talkMicT('noMic')); talkMicPaint();
    }
  };
  // nothing usable heard: listen again while the replies are still waiting (a few tries, then you can press M or click)
  rec.onend = () => {
    if (talkRec !== rec) return;
    talkRec = null; talkMicPaint();
    if (talkMicOn && talkChoicesUp() && ++talkMicRetry < 6) talkMicWait = setTimeout(() => talkMicListen(true), 400);
    else if (talkQ('.ms').textContent === talkMicT('listening')) talkMicSay('');
  };
  try { rec.start(); } catch (e) { talkRec = null; }
  talkMicPaint();
}
// which reply did you say? compare sounds (kana) with each reply, written both with kanji and in its reading
const TALK_MIC_FIX = [[/下さい/g, 'ください'], [/お?願い/g, 'おねがい'], [/宜しく/g, 'よろしく'], [/初めまして/g, 'はじめまして'],
  [/有難う|有り難う/g, 'ありがとう'], [/済みません/g, 'すみません'], [/分かりません|判りません/g, 'わかりません'], [/左様なら/g, 'さようなら'],
  [/珈琲/g, 'コーヒー'], [/お水/g, 'おみず'], [/水/g, 'みず'], [/熱い|暑い/g, 'ホット'], [/テイクアウト|テークアウト/g, 'もちかえり'], [/イートイン/g, 'てんない']];
function talkMicNorm(s) {
  s = String(s).normalize('NFKC');
  for (const [re, to] of TALK_MIC_FIX) s = s.replace(re, to);
  return s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/[\s。、！？!?.,「」…〜~ー・]/g, '').toLowerCase();
}
function talkMicSim(a, b) {   // how alike two strings are (shared pairs of characters), 0…1
  const bi = s => { const m = new Map(); for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) || 0) + 1); return m; };
  if (a.length < 2 || b.length < 2) return a && a === b ? 1 : 0;
  const A = bi(a), B = bi(b); let hit = 0;
  for (const [g, n] of A) hit += Math.min(n, B.get(g) || 0);
  return 2 * hit / (a.length - 1 + b.length - 1);
}
function talkMicMatch(alts, choices) {
  const forms = choices.map(c => [c.jp.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'), c.jp.replace(/\{[^|}]+\|([^}]+)\}/g, '$1')].map(talkMicNorm));
  const score = choices.map((c, k) => Math.max(...alts.map(talkMicNorm).flatMap(h => forms[k].map(f => talkMicSim(h, f)))));
  const order = score.map((s, k) => k).sort((a, b) => score[b] - score[a]);
  const best = score[order[0]], second = order.length > 1 ? score[order[1]] : 0;
  return best >= .3 && best - second >= .08 ? order[0] : -1;
}
