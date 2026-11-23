// ---------------------------------------------------------------- posters, plates
const posterMats = [];
function posterMat() {
  if (posterMats.length < 10) {
    const kinds = [
      ['夏祭り', '7/27(土) みなと神社', '#1D3A73', '#FFD34E', 'fan'], ['さがしています', 'ねこ・名前ミケ', '#FFFFFF', '#222222', 'cat'],
      ['ゴミの出し方', '燃えるゴミ 月・木', '#E9F3E1', '#2E6B3A', 'list'], ['入居者募集', '1K 家賃5.8万円', '#FFFFFF', '#C0392B', 'house'],
      ['防犯パトロール', 'みなと町内会', '#FFF4D6', '#1D2B4A', 'star'], ['大売り出し', '全品 10%OFF', '#D8433F', '#FFFFFF', 'burst'],
      ['日本語教室', '生徒募集中！', '#EAF4FF', '#1D2B4A', 'speech'], ['花火大会', '8月10日 河川敷', '#24305E', '#FFB3C7', 'fireworks'],
      ['冷たい麦茶', 'あります', '#FFFFFF', '#2F6FB8', 'cup'], ['ラジオ体操', '毎朝6:30 公園', '#FFF8E0', '#E07B28', 'sun']];
    const [t1, t2, bg, fg, icon] = kinds[posterMats.length];
    const tex = canvasTex(128, 176, (g, w, h) => {
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = fg;
      const fitText = (t, size, y, weight) => { g.font = `${weight} ${size}px "Zen Maru Gothic"`; const tw = g.measureText(t).width; if (tw > w * .9) g.font = `${weight} ${size * w * .9 / tw}px "Zen Maru Gothic"`; g.fillText(t, w / 2, y); };
      fitText(t1, 22, 22, 900);
      g.save(); g.translate(w / 2, 86); g.fillStyle = fg; g.strokeStyle = fg; g.lineWidth = 4;
      if (icon === 'cat') { g.beginPath(); g.arc(0, 4, 26, 0, 7); g.fill(); g.beginPath(); g.moveTo(-24, -8); g.lineTo(-18, -32); g.lineTo(-6, -18); g.moveTo(24, -8); g.lineTo(18, -32); g.lineTo(6, -18); g.fill(); g.fillStyle = bg; g.beginPath(); g.arc(-9, 0, 4, 0, 7); g.arc(9, 0, 4, 0, 7); g.fill(); }
      else if (icon === 'house') { g.beginPath(); g.moveTo(-30, 0); g.lineTo(0, -28); g.lineTo(30, 0); g.lineTo(22, 0); g.lineTo(22, 28); g.lineTo(-22, 28); g.lineTo(-22, 0); g.fill(); g.fillStyle = bg; g.fillRect(-6, 10, 12, 18); }
      else if (icon === 'star' || icon === 'burst') { const k = icon === 'star' ? 5 : 12; g.beginPath(); for (let i = 0; i < k * 2; i++) { const r = i % 2 ? 14 : 32, a = i * Math.PI / k - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill(); }
      else if (icon === 'fireworks' || icon === 'sun') { g.beginPath(); g.arc(0, 0, icon === 'sun' ? 16 : 5, 0, 7); g.fill(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.moveTo(Math.cos(a) * 20, Math.sin(a) * 20); g.lineTo(Math.cos(a) * 34, Math.sin(a) * 34); g.stroke(); } }
      else if (icon === 'list') { for (let i = 0; i < 4; i++) { g.strokeRect(-30, -28 + i * 15, 9, 9); g.fillRect(-16, -25 + i * 15, 46, 4); } }
      else if (icon === 'cup') { g.fillRect(-18, -22, 32, 44); g.beginPath(); g.arc(18, 0, 10, -1.4, 1.4); g.stroke(); }
      else if (icon === 'speech') { g.beginPath(); g.ellipse(0, -4, 34, 24, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(-8, 16); g.lineTo(-18, 32); g.lineTo(6, 18); g.fill(); g.fillStyle = bg; g.font = '900 20px "Zen Maru Gothic"'; g.fillText('あ', 0, -3); }
      else { g.beginPath(); g.moveTo(0, 30); g.lineTo(-30, -14); g.arc(0, -14, 30, Math.PI, 0); g.lineTo(0, 30); g.fill(); }
      g.restore();
      fitText(t2, 14, 140, 700);
      g.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 3; i++) g.fillRect(24, 154 + i * 6, 80, 2);
      g.fillStyle = 'rgba(255,250,230,.55)'; g.fillRect(0, 0, 18, 10); g.fillRect(w - 18, 0, 18, 10);
      const age = g.createLinearGradient(0, 0, 0, h); age.addColorStop(0, 'rgba(255,240,200,.08)'); age.addColorStop(1, 'rgba(120,100,60,.18)'); g.fillStyle = age; g.fillRect(0, 0, w, h);
    });
    posterMats.push(std('#ffffff', { map: tex, roughness: .9 }));
  }
  return pick(posterMats);
}
const plateMats = [];
function plateMat() {
  if (plateMats.length < 6) {
    const t = `${pick(['港町', 'みなと', '桜町', '青葉'])} ${1 + Math.floor(rand() * 4)}-${1 + Math.floor(rand() * 30)}`;
    plateMats.push(std('#ffffff', { map: canvasTex(144, 52, (g, w, h) => { g.fillStyle = '#2F5F9E'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(4, 4, w - 8, h - 8); g.fillStyle = '#fff'; g.font = '700 24px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, w / 2, h / 2 + 1); }) }));
  }
  return pick(plateMats);
}

let _doorLight;
function doorLight() { return _doorLight || (_doorLight = glowMat(null, null, .05, 1.6, { color: '#F4F1EA', emissive: 0xffe2b0 })); }


