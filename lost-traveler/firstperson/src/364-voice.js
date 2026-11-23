// ---------------------------------------------------------------- voice: characters speak their Japanese lines (same system as prototype/)
// Inworld TTS when a key is available, otherwise the computer's built-in Japanese voice.
// The key is never in this repo: it comes from prototype/key.js (private, in .gitignore; copy key.example.js),
// or from opening the game once with ?inworld=YOUR_KEY, which saves it in this browser (shared with the prototype).
const VOICES = { tanaka: 'Haruto', barista: 'Asuka', narr: 'Jason' };   // Inworld voice IDs per speaker
const VOICE_RATE = { narr: .8 };   // speaking speed per speaker (1 = normal): the narrator reads slowly
const INWORLD_MODEL = 'inworld-tts-2';
let voiceKey = '', voiceOn = true, jaVoice = null, voiceAudio = null, voiceReq = 0;
const voiceCache = new Map();   // voice + text -> audio URL, so each line is only paid for once
try {
  const qs = new URLSearchParams(location.search);
  if (qs.has('inworld')) {
    localStorage.setItem('inworldKey', qs.get('inworld'));
    qs.delete('inworld');
    history.replaceState(null, '', location.pathname + (qs.toString() ? '?' + qs : '') + location.hash);
  }
  voiceKey = localStorage.getItem('inworldKey') || '';
} catch (e) {}
{ // key.js wins, so editing it takes effect on reload
  const s = document.createElement('script');
  s.src = '../prototype/key.js';
  s.onload = () => { if (window.INWORLD_KEY) voiceKey = window.INWORLD_KEY; };
  s.onerror = () => {};
  document.head.appendChild(s);
}
// without an Inworld key: the computer's Japanese voices, a man's for Tanaka and a woman's for the barista when there's one
const BUILTIN_VOICE = { tanaka: { like: /otoya|hattori|ichiro|keita|male/i, pitch: .9 }, barista: { like: /kyoko|o-ren|nanami|ayumi|haruka|female/i, pitch: 1.15 } };
let jaVoices = [];
function pickJaVoice() { jaVoices = speechSynthesis.getVoices().filter(v => /^ja/i.test(v.lang)); jaVoice = jaVoices[0] || null; }
if ('speechSynthesis' in window) { pickJaVoice(); speechSynthesis.onvoiceschanged = pickJaVoice; }

// Safari only lets audio play after a network wait if that same <audio> element was started inside a click/key press,
// so one element is unlocked on the first gesture and reused for every line (built-in speech gets the same unlock)
const voiceEl = new Audio();
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
function unlockVoice() {
  removeEventListener('pointerdown', unlockVoice, true); removeEventListener('keydown', unlockVoice, true);
  voiceEl.src = SILENT_WAV; voiceEl.play().catch(() => {});
  if ('speechSynthesis' in window) try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
}
addEventListener('pointerdown', unlockVoice, true); addEventListener('keydown', unlockVoice, true);

function stopVoice() {
  voiceReq++;
  if (voiceAudio) { voiceAudio.pause(); voiceAudio = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
function sayBuiltIn(text, rate = 1, who, onStart) {
  if (!('speechSynthesis' in window)) return onStart && onStart(null);
  try {
    const u = new SpeechSynthesisUtterance(text);
    const B = BUILTIN_VOICE[who];
    u.lang = 'ja-JP'; u.voice = (B && jaVoices.find(v => B.like.test(v.name))) || jaVoice; u.rate = 0.9 * rate; if (B) u.pitch = B.pitch;
    // the built-in voice doesn't say how long it will take: about 8 kana a second at normal speed
    if (onStart) u.onstart = () => onStart(text.length * 125 / u.rate);
    speechSynthesis.speak(u);
  } catch (e) { onStart && onStart(null); }
}
async function sayInworld(text, voiceId, req, rate, onStart) {
  const key = voiceId + '|' + rate + '|' + text;
  let url = voiceCache.get(key);
  if (!url) {
    const r = await fetch('https://api.inworld.ai/tts/v1/voice', {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + voiceKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId, modelId: INWORLD_MODEL, audioConfig: { audioEncoding: 'MP3', speakingRate: rate } }),
    });
    if (!r.ok) throw new Error('Inworld ' + r.status);
    url = 'data:audio/mpeg;base64,' + (await r.json()).audioContent;
    voiceCache.set(key, url);
  }
  if (req !== voiceReq) return;   // something else started or stopped speech meanwhile
  voiceAudio = voiceEl; voiceEl.src = url;
  await voiceEl.play();
  if (onStart && req === voiceReq) onStart(isFinite(voiceEl.duration) ? voiceEl.duration * 1000 : null);
}
// text may contain {漢字|かんじ} ruby; who is a VOICES key (unknown → built-in voice)
// onStart(ms) is called once, when the voice actually starts (ms = how long it lasts, or null if unknown / no voice),
// so text on screen can be revealed in step with it
function speak(text, who, rate = VOICE_RATE[who] || 1, onStart) {
  if (!voiceOn) return onStart && onStart(null);
  stopVoice();
  const clean = String(text).replace(/\{([^|}]+)\|[^}]+\}/g, '$1').replace(/[〜~♪]/g, '');
  if (!clean.trim()) return onStart && onStart(null);
  const voiceId = VOICES[who];
  if (!voiceKey || !voiceId) return sayBuiltIn(clean, rate, who, onStart);
  const req = voiceReq;
  sayInworld(clean, voiceId, req, rate, onStart).catch(e => { console.warn(e); if (req === voiceReq) sayBuiltIn(clean, rate, who, onStart); });
}
