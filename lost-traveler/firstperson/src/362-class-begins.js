// ---------------------------------------------------------------- class begins: the first lesson at the 初級クラス blackboard
// Sit at any classroom desk: the school chime rings (キーンコーンカーンコーン) and Tanaka-sensei's first lesson opens
// on a blackboard over the game. Same four steps as the voice prototype (prototype/index.html, "Lesson"):
// 〜をください, drinks, hot/iced and here/to go, then say コーヒーをください out loud.
// Keys while it is open: → / Enter / Space / E next, ← back, Esc leave the class.
const LESSON1 = [
  { title: { en: 'Ordering: 〜をください', zh: '点单：〜をください' }, items: [
    { jp: '〜をください', ro: '~ o kudasai', en: "Please give me ~ / I'd like ~", zh: '请给我~', big: true },
    { jp: 'コーヒーをください。', ro: 'Kōhī o kudasai.', en: 'A coffee, please.', zh: '请给我咖啡。' }],
    note: { en: 'Say what you want first, then をください. In Japanese, the action comes at the end of the sentence.', zh: '先说想要的东西，再说 をください。日语的动作放在句子最后。' } },
  { title: { en: 'Drinks', zh: '饮料' }, items: [
    { jp: 'コーヒー', ro: 'kōhī', en: 'coffee', zh: '咖啡' },
    { jp: '{お茶|おちゃ}', ro: 'ocha', en: 'green tea', zh: '绿茶' },
    { jp: 'ジュース', ro: 'jūsu', en: 'juice', zh: '果汁' }],
    note: { en: 'Words borrowed from other languages are written in katakana. コーヒー comes from "coffee".', zh: '外来语用片假名书写。コーヒー 来自英语的 coffee。' } },
  { title: { en: 'Hot or iced? Here or to go?', zh: '热的还是冰的？堂食还是外带？' }, items: [
    { jp: 'ホットで', ro: 'hotto de', en: 'hot, please', zh: '要热的' },
    { jp: 'アイスで', ro: 'aisu de', en: 'iced, please', zh: '要冰的' },
    { jp: '{店内|てんない}で', ro: 'tennai de', en: 'for here', zh: '堂食' },
    { jp: '{持|も}ち{帰|かえ}りで', ro: 'mochikaeri de', en: 'to go', zh: '外带' }],
    note: { en: 'Add で to pick an option: ホットで means "hot, please."', zh: '选择时加上 で：ホットで 就是“要热的”。' },
    zhNote: '店内 的写法和意思都和中文一样，但日语读作 tennai。' },
  { title: { en: 'Your turn', zh: '轮到你了' }, practice: true },
];
const LESSON1_UI = {
  en: { head: "Tanaka-sensei's class", listen: 'Listen', back: 'Back', next: 'Next', finish: 'Go to the café', leave: 'Leave class',
    sayIt: 'Say it out loud:', speak: 'Speak', listening: 'Listening…', heard: 'Heard:', ok: '完璧！ (Kanpeki!) Perfect!',
    tryAgain: 'Close! Try the whole phrase: コーヒーをください', noMic: 'You can say it to yourself, then move on.',
    begins: 'キーンコーンカーンコーン♪ · 授業が始まります · Class begins', after: 'いってらっしゃい！ · Itterasshai! · Have fun at the café!' },
  zh: { head: '田中老师的课', listen: '听', back: '上一步', next: '下一步', finish: '去咖啡店', leave: '下课',
    sayIt: '大声说出来：', speak: '说', listening: '正在听…', heard: '听到：', ok: '完璧！（Kanpeki!）太完美了！',
    tryAgain: '差一点！试着说完整句子：コーヒーをください', noMic: '可以小声对自己说一遍，然后继续。',
    begins: 'キーンコーンカーンコーン♪ · 授業が始まります · 上课了', after: 'いってらっしゃい！ · 路上小心，去咖啡店吧！' },
};
const lessonT = k => (LESSON1_UI[lang] || LESSON1_UI.en)[k];
const lessonTr = o => lang === 'en' ? o.en : (o.zh || o.en);
let lessonStep = -1, lessonRec = null;   // -1: closed

const lessonEl = (() => {
  const st = document.createElement('style');
  st.textContent = `
#lesson1{position:fixed;inset:0;z-index:21;display:none;place-items:center;padding:16px;background:rgba(16,24,42,.55);--board:#24433A;--chalk:#F1F4EC;--wood:#8A6A45;--chalkfont:"Klee One","Zen Maru Gothic","Hiragino Mincho ProN","PingFang SC",serif}
#lesson1.on{display:grid}
#lesson1 .board{width:min(760px,100%);max-height:100%;overflow-y:auto;background:var(--board);color:var(--chalk);border:12px solid var(--wood);border-radius:12px;padding:22px 26px;font-family:var(--chalkfont);box-shadow:0 20px 50px rgba(0,0,0,.4);animation:lessonIn .4s ease-out}
@keyframes lessonIn{from{opacity:0;transform:translateY(18px)}}
#lesson1 .head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;border-bottom:2px dashed rgba(241,244,236,.3);padding-bottom:10px;margin-bottom:14px}
#lesson1 .head b{font-size:clamp(20px,3.6vw,26px);font-weight:600}
#lesson1 .head span{font-family:var(--font);font-size:13px;opacity:.75}
#lesson1 .row{display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(241,244,236,.12)}
#lesson1 .jp{font-size:clamp(22px,4vw,30px);font-weight:600;line-height:1.6}
#lesson1 .jp.big{font-size:clamp(30px,6vw,44px)}
#lesson1 .jp rt{font-size:.42em;font-family:var(--font)}
#lesson1 .ro{font-family:var(--font);font-size:14px;opacity:.8}
#lesson1 .tr{font-family:var(--font);font-size:15px;color:var(--amber);font-weight:700}
#lesson1 .chalk{font-family:var(--font);border:1px solid rgba(241,244,236,.45);border-radius:999px;padding:6px 12px;font-size:13px;font-weight:700;color:var(--chalk);background:none;cursor:pointer}
#lesson1 .chalk:hover{background:rgba(241,244,236,.1)}
#lesson1 .note{font-family:var(--font);margin-top:14px;font-size:15px;line-height:1.55;background:rgba(0,0,0,.18);border-radius:8px;padding:10px 12px}
#lesson1 .note.zh{border-left:4px solid var(--sakura)}
#lesson1 .foot{display:flex;justify-content:space-between;margin-top:18px;gap:10px}
#lesson1 .foot button{font-family:var(--font);font-weight:900;padding:10px 20px;border-radius:999px;cursor:pointer;border:0}
#lesson1 .bk{border:1px solid rgba(241,244,236,.45)!important;color:var(--chalk);background:none}
#lesson1 .nx{background:var(--amber);color:var(--navy)}
#lesson1 .x{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);background:rgba(8,12,24,.55);color:#fff;border-radius:999px;padding:6px 14px;font-weight:700;font-size:13px;border:0;cursor:pointer;font-family:var(--font)}
#lesson1 .practice{text-align:center;padding:10px 0;font-family:var(--font)}
#lesson1 .practice .jp{display:block;margin:8px 0}
#lesson1 .mic{display:inline-flex;align-items:center;gap:8px;margin-top:10px;background:var(--chalk);color:var(--board);font-family:var(--font);font-weight:900;border:0;border-radius:999px;padding:10px 20px;cursor:pointer}
#lesson1 .mic i{width:10px;height:10px;border-radius:50%;background:#D8433F}
#lesson1 .mic.on i{animation:lessonMic .8s ease-in-out infinite}
@keyframes lessonMic{50%{opacity:.25}}
#lesson1 .mst{display:block;margin-top:10px;min-height:1.4em;font-size:15px}`;
  document.head.appendChild(st);
  const el = document.createElement('div'); el.id = 'lesson1'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Lesson');
  el.innerHTML = '<div class="board"><div class="head"><b></b><span></span></div><div class="body"></div><div class="foot"><button type="button" class="bk"></button><button type="button" class="nx"></button></div></div><button type="button" class="x"></button>';
  document.body.appendChild(el);
  return el;
})();
const lessonQ = s => lessonEl.querySelector(s);

// キーンコーンカーンコーン: the Westminster school chime, made with soft bell tones
let chimeCtx = null;
function playSchoolChime() {
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ac = chimeCtx, t0 = ac.currentTime + .05;
    const notes = [659.3, 523.3, 587.3, 392.0, 392.0, 587.3, 659.3, 523.3];   // E C D G · G D E C
    notes.forEach((f, i) => {
      const t = t0 + i * .62 + (i >= 4 ? .3 : 0);
      for (const [mul, vol] of [[1, .22], [2.01, .06], [3.02, .025]]) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = f * mul;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 1.6);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 1.7);
      }
    });
  } catch (e) {}
}

function lessonRuby(s) {
  return String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
    .replace(/\{([^|}]+)\|([^}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>');
}
function lessonStopMic() { if (lessonRec) { try { lessonRec.abort(); } catch (e) {} lessonRec = null; } }

function classBegins() {
  if (lessonStep >= 0 || talking) return;
  if (locked()) document.exitPointerLock();
  keys.clear(); hold.fwd = hold.back = 0;
  playSchoolChime();
  toast(lessonT('begins'), 3200);
  lessonStep = 0;
  setTimeout(() => { if (lessonStep >= 0) { lessonEl.classList.add('on'); lessonRender(); } }, 1400);   // the board appears as the chime plays
}
function lessonClose(done) {
  lessonStopMic(); stopVoice();
  lessonStep = -1; lessonEl.classList.remove('on');
  if (done) toast(lessonT('after'), 3200);
}
function lessonRender() {
  const c = LESSON1[lessonStep];
  lessonStopMic();
  lessonQ('.head b').textContent = lessonTr(c.title);
  lessonQ('.head span').textContent = lessonT('head') + '  ' + (lessonStep + 1) + ' / ' + LESSON1.length;
  const body = lessonQ('.body'); body.textContent = '';
  const listenBtn = jp => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chalk'; b.textContent = '🔊 ' + lessonT('listen');
    b.onclick = () => speak(jp, 'narr');   // the narrator (Jason) reads lesson examples, slowly (364-voice.js)
    return b;
  };
  if (c.items) {
    for (const it of c.items) {
      const row = document.createElement('div'); row.className = 'row';
      const left = document.createElement('div');
      left.innerHTML = `<div class="jp${it.big ? ' big' : ''}" lang="ja">${lessonRuby(it.jp)}</div><div class="ro"></div><div class="tr"></div>`;
      left.querySelector('.ro').textContent = it.ro; left.querySelector('.tr').textContent = lessonTr(it);
      row.append(left, listenBtn(it.jp)); body.appendChild(row);
    }
    const n = document.createElement('div'); n.className = 'note'; n.textContent = lessonTr(c.note); body.appendChild(n);
    if (c.zhNote && lang !== 'en') { const z = document.createElement('div'); z.className = 'note zh'; z.textContent = '⚠ ' + c.zhNote; body.appendChild(z); }
  } else if (c.practice) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const wrap = document.createElement('div'); wrap.className = 'practice';
    wrap.innerHTML = '<div class="say"></div><span class="jp big" lang="ja">コーヒーをください。</span><div class="ro">Kōhī o kudasai.</div>';
    wrap.querySelector('.say').textContent = lessonT('sayIt');
    const lb = listenBtn('コーヒーをください'); lb.style.margin = '10px 6px 0';
    const mic = document.createElement('button'); mic.type = 'button'; mic.className = 'mic'; mic.innerHTML = '<i></i><span></span>';
    mic.querySelector('span').textContent = lessonT('speak');
    const st = document.createElement('span'); st.className = 'mst';
    const tools = document.createElement('div'); tools.append(lb, mic);
    wrap.append(tools, st); body.appendChild(wrap);
    if (!SR) { mic.style.display = 'none'; st.textContent = lessonT('noMic'); }
    else mic.onclick = () => {
      if (lessonRec) return lessonStopMic();
      stopVoice();
      const rec = lessonRec = new SR();
      rec.lang = 'ja-JP'; rec.maxAlternatives = 5; rec.interimResults = false;
      mic.classList.add('on'); st.textContent = lessonT('listening');
      rec.onresult = e => {
        const alts = [...e.results[0]].map(a => a.transcript);
        const ok = alts.some(s => /ください|下さい/.test(s.replace(/\s/g, '')));
        st.textContent = lessonT('heard') + ' 「' + alts[0] + '」 ' + (ok ? lessonT('ok') : lessonT('tryAgain'));
      };
      rec.onerror = e => { st.textContent = e.error === 'no-speech' ? lessonT('tryAgain') : lessonT('noMic'); };
      rec.onend = () => { mic.classList.remove('on'); if (lessonRec === rec) lessonRec = null; if (st.textContent === lessonT('listening')) st.textContent = ''; };
      try { rec.start(); } catch (e) { lessonRec = null; mic.classList.remove('on'); st.textContent = lessonT('noMic'); }
    };
  }
  const bk = lessonQ('.bk');
  bk.textContent = lessonT('back'); bk.style.visibility = lessonStep ? 'visible' : 'hidden';
  lessonQ('.nx').textContent = lessonStep === LESSON1.length - 1 ? lessonT('finish') : lessonT('next');
  lessonQ('.x').textContent = '✕ ' + lessonT('leave');
}
function lessonNext() { if (lessonStep < LESSON1.length - 1) { lessonStep++; lessonRender(); } else lessonClose(true); }
function lessonBack() { if (lessonStep > 0) { lessonStep--; lessonRender(); } }
lessonQ('.nx').onclick = lessonNext;
lessonQ('.bk').onclick = lessonBack;
lessonQ('.x').onclick = () => lessonClose(false);
// while the board is up, the keyboard belongs to the lesson (E doesn't stand you up, WASD doesn't walk)
addEventListener('keydown', e => {
  if (!lessonEl.classList.contains('on')) return;
  e.stopImmediatePropagation(); e.preventDefault();
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (k === 'escape') lessonClose(false);
  else if (k === 'arrowright' || k === 'enter' || k === ' ' || k === 'e') lessonNext();
  else if (k === 'arrowleft') lessonBack();
}, true);

// every chair in the 初級クラス (between the partition and the front wall) starts the class once you have sat down
onSitHooks.push(s => { if (s.x > SCH.part && s.x < SCH.fx && s.z > 17.5 && s.z < SCH.z1) classBegins(); });
