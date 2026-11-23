// ---------------------------------------------------------------- vending machine drinks (original designs)
const DRINKS = {
  ryokucha: { r: [['緑茶', 'りょくちゃ']], ro: 'ryokucha', en: 'Green tea', zh: '绿茶', price: 150, shape: 'pet', liquid: '#B5C25A', cap: '#2E7D46', label: '#F6F3E2', ink: '#2E6B3A', motif: 'leaf', short: '緑茶' },
  mugicha: { r: [['麦茶', 'むぎちゃ']], ro: 'mugicha', en: 'Barley tea', zh: '麦茶', price: 130, shape: 'pet', liquid: '#A8662A', cap: '#C8862E', label: '#FFF4D6', ink: '#8A4A1A', motif: 'grain', short: '麦茶' },
  mizu: { r: [['天然水', 'てんねんすい']], ro: 'tennensui', en: 'Mineral water', zh: '矿泉水', price: 110, shape: 'pet', liquid: '#D6ECF7', clear: true, cap: '#2F6FB8', label: '#E6F3FB', ink: '#2F6FB8', motif: 'mountain', short: '天然水' },
  supootsu: { r: [['スポーツドリンク', '']], ro: 'supōtsu dorinku', en: 'Sports drink', zh: '运动饮料', price: 150, shape: 'pet', liquid: '#E2EEF8', clear: true, cap: '#1F5FB0', label: '#2F6FB8', ink: '#FFFFFF', motif: 'wave', short: 'ION' },
  orenji: { r: [['オレンジ', '']], ro: 'orenji', en: 'Orange juice', zh: '橙汁', price: 150, shape: 'pet', liquid: '#F5A020', cap: '#F07C14', label: '#FFE7A0', ink: '#D2601A', motif: 'orange', face: true, short: 'オレンジ' },
  yuzu: { r: [['ゆずソーダ', '']], ro: 'yuzu sōda', en: 'Yuzu soda', zh: '柚子汽水', price: 150, shape: 'pet', liquid: '#F2E07A', cap: '#E2B41C', label: '#FFFFFF', ink: '#3C8F4A', motif: 'citrus', face: true, short: 'ゆず' },
  ramune: { r: [['ラムネ', '']], ro: 'ramune', en: 'Ramune soda', zh: '波子汽水', price: 160, shape: 'glass', liquid: '#8CD6E8', cap: '#E8527A', label: '#FFFFFF', ink: '#2F6FB8', motif: 'bubbles', short: 'ラムネ' },
  koohii: { r: [['コーヒー', '']], ro: 'kōhī', en: 'Canned coffee', zh: '罐装咖啡', price: 130, shape: 'can', body: '#1D2B5A', ink: '#E2C08A', motif: 'bean', short: 'COFFEE' },
  kafeore: { r: [['カフェオレ', '']], ro: 'kafeore', en: 'Café au lait', zh: '咖啡欧蕾', price: 130, shape: 'can', body: '#E9D3B0', ink: '#6A4028', motif: 'cup', short: 'カフェオレ' },
  miruku: { r: [['ミルクティー', '']], ro: 'miruku tī', en: 'Milk tea', zh: '奶茶', price: 150, shape: 'tall', body: '#F3ECDC', ink: '#8A2A3A', motif: 'teapot', short: 'TEA' },
  ringo: { r: [['りんご', '']], ro: 'ringo', en: 'Apple juice', zh: '苹果汁', price: 150, shape: 'can', body: '#D9443F', ink: '#FFFFFF', motif: 'apple', face: true, short: 'りんご' },
  meron: { r: [['メロンソーダ', '']], ro: 'meron sōda', en: 'Melon soda', zh: '蜜瓜汽水', price: 130, shape: 'can', body: '#4FB060', ink: '#FFFFFF', motif: 'melon', face: true, short: 'メロン' },
  kokoa: { r: [['ココア', '']], ro: 'kokoa', en: 'Hot cocoa', zh: '热可可', price: 130, shape: 'can', body: '#6A3A28', ink: '#FFD9B0', motif: 'heart', short: 'ココア' },
  koon: { r: [['コーンスープ', '']], ro: 'kōn sūpu', en: 'Corn soup', zh: '玉米浓汤', price: 130, shape: 'can', body: '#F2C230', ink: '#7A4A10', motif: 'corn', short: 'コーン' },
  gyuunyuu: { r: [['牛乳', 'ぎゅうにゅう']], ro: 'gyūnyū', en: 'Milk', zh: '牛奶', price: 120, shape: 'carton', body: '#FFFFFF', band: '#3E8EDB', ink: '#2F6FB8', motif: 'cow', face: true, short: '牛乳' },
  ichigo: { r: [['いちご', ''], ['牛乳', 'ぎゅうにゅう']], ro: 'ichigo gyūnyū', en: 'Strawberry milk', zh: '草莓牛奶', price: 120, shape: 'carton', body: '#FBE0E8', band: '#E8527A', ink: '#C8325A', motif: 'strawberry', face: true, short: 'いちご' },
  nyuusan: { r: [['乳酸菌', 'にゅうさんきん']], ro: 'nyūsankin', en: 'Yogurt drink', zh: '乳酸菌饮料', price: 100, shape: 'small', body: '#FCE7C4', cap: '#E8524A', ink: '#E8524A', motif: 'heart', short: '乳酸菌' },
};
const DRINK_SHAPES = { pet: { w: .36, h: 1 }, glass: { w: .32, h: .95 }, can: { w: .34, h: .6 }, tall: { w: .32, h: .74 }, carton: { w: .38, h: .7 }, small: { w: .26, h: .5 } };
// what each kind of machine stocks, row by row (the bottom row is hot)
const VEND_ROWS = {
  drinks: [['koohii', 'kafeore', 'meron', 'ringo', 'miruku', 'ringo'], ['ryokucha', 'mugicha', 'mizu', 'supootsu', 'orenji', 'yuzu'], ['ramune', 'mizu', 'ryokucha', 'nyuusan', 'orenji', 'supootsu'], ['koohii', 'kokoa', 'koon', 'miruku', 'kafeore']],
  milk: [['gyuunyuu', 'ichigo', 'gyuunyuu', 'kafeore'], ['nyuusan', 'ichigo', 'gyuunyuu', 'miruku'], ['ryokucha', 'mizu', 'orenji', 'yuzu'], ['kokoa', 'miruku', 'koon', 'kafeore']],
  coffee: [['koohii', 'kafeore', 'koohii', 'miruku'], ['ryokucha', 'mugicha', 'mizu', 'koohii'], ['kafeore', 'supootsu', 'ramune', 'ringo'], ['koohii', 'kafeore', 'kokoa', 'koon']],
};
// little original label pictures; some get a cute face
function drinkMotif(g, kind, x, y, r, face) {
  const C = (c, cx, cy, rr) => { g.fillStyle = c; g.beginPath(); g.arc(cx, cy, rr, 0, 7); g.fill(); };
  const E = (c, cx, cy, rx, ry, rot = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(cx, cy, rx, ry, rot, 0, 7); g.fill(); };
  g.save(); g.lineCap = 'round';
  if (kind === 'leaf') { E('#4E9F45', x - r * .25, y, r * .5, r * .9, -.5); E('#7CC35A', x + r * .3, y + r * .1, r * .45, r * .8, .5); }
  else if (kind === 'grain') { for (let i = 0; i < 3; i++) E('#D8A048', x + (i - 1) * r * .5, y + Math.abs(i - 1) * r * .2, r * .25, r * .55, (i - 1) * .4); }
  else if (kind === 'mountain') { g.fillStyle = '#5B9BD5'; g.beginPath(); g.moveTo(x - r, y + r * .6); g.lineTo(x - r * .2, y - r * .7); g.lineTo(x + r * .3, y); g.lineTo(x + r * .55, y - r * .35); g.lineTo(x + r, y + r * .6); g.fill(); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x - r * .45, y - r * .35); g.lineTo(x - r * .2, y - r * .7); g.lineTo(x + .05 * r, y - r * .35); g.fill(); }
  else if (kind === 'wave') { g.strokeStyle = '#FFFFFF'; g.lineWidth = r * .22; g.beginPath(); for (let i = 0; i <= 12; i++) { const xx = x - r + i * r / 6; g[i ? 'lineTo' : 'moveTo'](xx, y + Math.sin(i * .9) * r * .3); } g.stroke(); C('#9FD3F4', x, y - r * .55, r * .22); }
  else if (kind === 'orange') { C('#F28C1A', x, y, r); C('#F7B04A', x - r * .3, y - r * .3, r * .3); E('#3C9D5D', x + r * .3, y - r * .95, r * .35, r * .18, -.4); }
  else if (kind === 'citrus') { C('#F2D232', x, y, r); C('#FFF2A0', x, y, r * .78); g.strokeStyle = '#F2D232'; g.lineWidth = r * .1; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(i * 1.047) * r * .78, y + Math.sin(i * 1.047) * r * .78); g.stroke(); } }
  else if (kind === 'apple') { C('#E8433A', x - r * .35, y, r * .7); C('#E8433A', x + r * .35, y, r * .7); C('#E8433A', x, y + r * .25, r * .75); g.strokeStyle = '#6A4028'; g.lineWidth = r * .12; g.beginPath(); g.moveTo(x, y - r * .5); g.lineTo(x + r * .1, y - r * .95); g.stroke(); E('#4E9F45', x + r * .4, y - r * .8, r * .3, r * .14, -.4); }
  else if (kind === 'melon') { C('#8FCF6A', x, y, r); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = r * .08; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(x + i * r * .5 - r * .4, y - r * .8); g.lineTo(x + i * r * .5 + r * .4, y + r * .8); g.stroke(); g.beginPath(); g.moveTo(x + i * r * .5 + r * .4, y - r * .8); g.lineTo(x + i * r * .5 - r * .4, y + r * .8); g.stroke(); } }
  else if (kind === 'bubbles') { for (const [a, b, c] of [[-.4, .3, .35], [.35, -.1, .28], [-.1, -.5, .2], [.45, .55, .18], [-.55, -.35, .14]]) { g.strokeStyle = '#5BB8D8'; g.lineWidth = r * .1; g.beginPath(); g.arc(x + a * r, y + b * r, c * r, 0, 7); g.stroke(); } }
  else if (kind === 'bean') { E('#8A5A3A', x - r * .35, y, r * .45, r * .65, .4); E('#A8784A', x + r * .4, y + r * .1, r * .45, r * .65, -.3); g.strokeStyle = '#3A2418'; g.lineWidth = r * .08; g.beginPath(); g.moveTo(x - r * .5, y - r * .45); g.quadraticCurveTo(x - r * .2, y, x - r * .45, y + r * .5); g.stroke(); }
  else if (kind === 'cup') { g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x - r * .7, y - r * .3); g.lineTo(x + r * .5, y - r * .3); g.lineTo(x + r * .35, y + r * .6); g.lineTo(x - r * .55, y + r * .6); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * .14; g.beginPath(); g.arc(x + r * .6, y, r * .25, -1.5, 1.5); g.stroke(); E('#8A5A3A', x - r * .1, y - r * .3, r * .58, r * .12); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = r * .08; for (const dx of [-.3, .1]) { g.beginPath(); g.moveTo(x + dx * r, y - r * .5); g.quadraticCurveTo(x + (dx + .15) * r, y - r * .75, x + dx * r, y - r); g.stroke(); } }
  else if (kind === 'teapot') { C('#C8505A', x, y + r * .15, r * .6); E('#C8505A', x, y - r * .45, r * .3, r * .1); C('#C8505A', x, y - r * .6, r * .1); g.strokeStyle = '#C8505A'; g.lineWidth = r * .16; g.beginPath(); g.moveTo(x + r * .5, y + r * .1); g.lineTo(x + r * .95, y - r * .3); g.stroke(); g.beginPath(); g.arc(x - r * .65, y + r * .15, r * .28, 1.6, 4.7); g.stroke(); }
  else if (kind === 'heart') { g.fillStyle = '#F06A8A'; g.beginPath(); g.moveTo(x, y + r * .8); g.bezierCurveTo(x - r * 1.2, y - r * .1, x - r * .5, y - r * .9, x, y - r * .35); g.bezierCurveTo(x + r * .5, y - r * .9, x + r * 1.2, y - r * .1, x, y + r * .8); g.fill(); }
  else if (kind === 'corn') { E('#F7D54A', x, y, r * .45, r * .9); g.fillStyle = '#E8B820'; for (let i = -3; i <= 3; i++) for (const dx of [-.15, .15]) C('#E8B820', x + dx * r, y + i * r * .22, r * .07); E('#5CA84A', x - r * .35, y + r * .3, r * .2, r * .6, .4); E('#5CA84A', x + r * .35, y + r * .3, r * .2, r * .6, -.4); }
  else if (kind === 'cow') { C('#FFFFFF', x, y, r); C('#2B2D33', x - r * .45, y - r * .3, r * .3); C('#2B2D33', x + r * .5, y + r * .35, r * .22); E('#F4B8C0', x, y + r * .45, r * .45, r * .28); }
  else if (kind === 'strawberry') { g.fillStyle = '#E8433A'; g.beginPath(); g.moveTo(x - r * .8, y - r * .4); g.quadraticCurveTo(x, y - r * .8, x + r * .8, y - r * .4); g.quadraticCurveTo(x + r * .6, y + r * .5, x, y + r); g.quadraticCurveTo(x - r * .6, y + r * .5, x - r * .8, y - r * .4); g.fill(); E('#4E9F45', x, y - r * .6, r * .5, r * .16); for (const [a, b] of [[-.4, -.1], [.4, -.1], [0, .1], [-.2, .45], [.2, .45]]) E('#FFE08A', x + a * r, y + b * r, r * .05, r * .08); }
  if (face) {                                                    // a little face
    C('#2B2D33', x - r * .3, y + r * .05, r * .09); C('#2B2D33', x + r * .3, y + r * .05, r * .09);
    g.strokeStyle = '#2B2D33'; g.lineWidth = r * .08; g.beginPath(); g.arc(x, y + r * .15, r * .18, .3, Math.PI - .3); g.stroke();
    C('rgba(255,120,140,.55)', x - r * .55, y + r * .3, r * .12); C('rgba(255,120,140,.55)', x + r * .55, y + r * .3, r * .12);
  }
  g.restore();
}
// draw a drink standing at (cx, by), s pixels tall for a 1-unit (bottle-height) drink
function drawDrink(g, d, cx, by, s) {
  const S = DRINK_SHAPES[d.shape], w = S.w, h = S.h;
  g.save(); g.translate(cx, by); g.scale(s, s);
  const txt = (t, x, y, size, color, weight = 900) => {
    g.save(); g.scale(1 / s, 1 / s); g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `${weight} ${size * s}px "Zen Maru Gothic"`; const tw = g.measureText(t).width; if (tw > w * .9 * s) g.font = `${weight} ${size * s * w * .9 * s / tw}px "Zen Maru Gothic"`;
    g.fillText(t, x * s, y * s); g.restore();
  };
  const hGrad = (c, x0, x1, a = .7, b = 1.12) => { const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, shade(c, a)); gr.addColorStop(.28, shade(c, b)); gr.addColorStop(.6, c); gr.addColorStop(1, shade(c, a * .85)); return gr; };
  const silver = (x, y, ww, hh) => { g.fillStyle = hGrad('#C9CDD3', x, x + ww, .65, 1.2); g.fillRect(x, y, ww, hh); };
  const shine = (x, y, hh) => { g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(x, y, w * .07, hh); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(x + w * .1, y, w * .03, hh); };
  if (d.shape === 'can' || d.shape === 'tall') {
    g.fillStyle = hGrad(d.body, -w / 2, w / 2); g.beginPath(); g.roundRect(-w / 2, -h + .03, w, h - .05, .02); g.fill();
    silver(-w / 2 + .015, -h, w - .03, .045); silver(-w / 2 + .02, -.035, w - .04, .035);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-w / 2 + .03, -h + .045, w - .06, .01);
    g.fillStyle = shade(d.body, .8); g.fillRect(-w / 2, -h * .2, w, h * .06);
    drinkMotif(g, d.motif, 0, -h * .5, w * .3, d.face);
    txt(d.short, 0, -h * .82, .075, d.ink); txt('¥' + d.price, 0, -h * .12, .05, d.ink, 700);
    shine(-w / 2 + .05, -h + .06, h - .12);
  } else if (d.shape === 'pet' || d.shape === 'glass') {
    const glass = d.shape === 'glass', nw = glass ? .08 : .065, sh = glass ? -.6 : -.7;
    const body = () => { g.beginPath(); g.moveTo(-nw, -h + .1); g.lineTo(-nw, -h + .16);
      if (glass) { g.quadraticCurveTo(-nw - .07, -h + .25, -nw + .01, -h + .33); g.quadraticCurveTo(-w / 2, sh + .05, -w / 2, sh + .2); }
      else g.quadraticCurveTo(-w / 2, -h + .2, -w / 2, sh);
      g.lineTo(-w / 2, -.04); g.quadraticCurveTo(-w / 2, 0, -w / 2 + .04, 0); g.lineTo(w / 2 - .04, 0); g.quadraticCurveTo(w / 2, 0, w / 2, -.04);
      if (glass) { g.lineTo(w / 2, sh + .2); g.quadraticCurveTo(w / 2, sh + .05, nw - .01, -h + .33); g.quadraticCurveTo(nw + .07, -h + .25, nw, -h + .16); }
      else { g.lineTo(w / 2, sh); g.quadraticCurveTo(w / 2, -h + .2, nw, -h + .16); }
      g.lineTo(nw, -h + .1); g.closePath(); };
    body(); g.fillStyle = glass ? 'rgba(200,236,246,.85)' : 'rgba(236,244,248,.9)'; g.fill();
    g.save(); body(); g.clip();
    g.fillStyle = hGrad(d.liquid, -w / 2, w / 2, d.clear ? .92 : .75, d.clear ? 1.05 : 1.15); g.globalAlpha = d.clear ? .7 : .95; g.fillRect(-w / 2, glass ? -h + .3 : -h + .22, w, h); g.globalAlpha = 1;
    if (!glass) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = .008; for (const yy of [-.08, -.14, -.2]) { g.beginPath(); g.moveTo(-w / 2, yy); g.lineTo(w / 2, yy); g.stroke(); } }
    g.restore();
    body(); g.strokeStyle = 'rgba(80,100,120,.35)'; g.lineWidth = .01; g.stroke();
    g.fillStyle = hGrad(d.cap, -nw - .01, nw + .01); g.beginPath(); g.roundRect(-nw - .012, -h, 2 * nw + .024, .1, .015); g.fill();
    g.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 4; i++) g.fillRect(-nw + i * nw * .5, -h + .015, .006, .07);
    if (glass) { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(0, -h + .26, .055, 0, 7); g.fill(); g.fillStyle = 'rgba(120,200,230,.6)'; g.beginPath(); g.arc(.015, -h + .27, .035, 0, 7); g.fill(); }
    const ly = glass ? -h * .48 : -h * .56, lh = glass ? .26 : .32;
    g.fillStyle = hGrad(d.label, -w / 2, w / 2, .8, 1.05); g.fillRect(-w / 2, ly, w, lh);
    g.fillStyle = d.ink; g.fillRect(-w / 2, ly, w, .025); g.fillRect(-w / 2, ly + lh - .025, w, .025);
    drinkMotif(g, d.motif, 0, ly + lh * .4, w * .2, d.face);
    txt(d.short, 0, ly + lh * .8, .06, d.ink);
    shine(-w / 2 + .04, -h + .3, h - .36);
  } else if (d.shape === 'carton') {
    const fh = .56;
    g.fillStyle = hGrad(d.body, -w / 2, w / 2, .82, 1.04); g.fillRect(-w / 2, -fh, w, fh);
    g.fillStyle = shade(d.body, .86); g.beginPath(); g.moveTo(-w / 2, -fh); g.lineTo(-w / 2 + .03, -h + .03); g.lineTo(w / 2 - .03, -h + .03); g.lineTo(w / 2, -fh); g.fill();
    g.fillStyle = shade(d.body, .95); g.fillRect(-w / 2 + .02, -h, w - .04, .035);
    g.fillStyle = d.band; g.fillRect(-w / 2, -fh * .32, w, fh * .32); g.fillRect(-w / 2, -fh, w, .035);
    drinkMotif(g, d.motif, 0, -fh * .62, w * .27, d.face);
    txt(d.short, 0, -fh * .16, .075, '#FFFFFF');
    shine(-w / 2 + .03, -fh + .02, fh - .04);
  } else {                                                      // small yogurt-drink bottle with a waist
    const pth = () => { g.beginPath(); g.moveTo(-w * .32, -h + .04); g.quadraticCurveTo(-w / 2, -h * .75, -w * .36, -h * .55); g.quadraticCurveTo(-w * .5, -h * .3, -w / 2, -.03); g.lineTo(w / 2, -.03); g.quadraticCurveTo(w * .5, -h * .3, w * .36, -h * .55); g.quadraticCurveTo(w / 2, -h * .75, w * .32, -h + .04); g.closePath(); };
    pth(); g.fillStyle = hGrad(d.body, -w / 2, w / 2, .8, 1.06); g.fill();
    g.fillStyle = hGrad(d.cap, -w * .34, w * .34); g.beginPath(); g.ellipse(0, -h + .04, w * .34, .03, 0, 0, 7); g.fill();
    drinkMotif(g, d.motif, 0, -h * .38, w * .22, false);
    txt(d.short, 0, -h * .7, .05, d.ink);
    g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(-w / 2 + .02, -.04, w - .04, .02);
    shine(-w / 2 + .05, -h + .1, h - .18);
  }
  g.restore();
}
const drinkThumbs = {};
const drinkThumb = id => drinkThumbs[id] ||= (() => { const c = document.createElement('canvas'); c.width = 120; c.height = 180; drawDrink(c.getContext('2d'), DRINKS[id], 60, 172, 160); return c.toDataURL(); })();
// a drink as a small 3D object (origin at its base), for the slot and your hand
function drinkModel(d) {
  const G = new THREE.Group(), S = DRINK_SHAPES[d.shape];
  const lbl = canvasTex(256, 128, (g, W, H) => {
    const bg = d.shape === 'pet' || d.shape === 'glass' ? d.label : d.body;
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (d.band) { g.fillStyle = d.band; g.fillRect(0, H * .7, W, H * .3); }
    for (const x of [48, 176]) drinkMotif(g, d.motif, x, H * .42, 30, d.face);
    g.fillStyle = d.band ? '#FFFFFF' : d.ink; g.font = '900 26px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.save(); g.translate(112, H * .5); g.rotate(-Math.PI / 2); g.fillText(d.short, 0, 0); g.restore();
    if (d.shape === 'pet' || d.shape === 'glass') { g.fillStyle = d.ink; g.fillRect(0, 0, W, 8); g.fillRect(0, H - 8, W, 8); }
  });
  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .4, ...o });
  const lblM = M('#ffffff', { map: lbl }), silver = M('#D9DDE2', { metalness: .8, roughness: .25 });
  const add = (geo, m, y) => { const o = new THREE.Mesh(geo, m); o.position.y = y; G.add(o); return o; };
  if (d.shape === 'can' || d.shape === 'tall') {
    const h = d.shape === 'tall' ? .13 : .11, r = d.shape === 'tall' ? .029 : .033;
    add(new THREE.CylinderGeometry(r, r, h - .012, 20), [lblM, silver, silver], h / 2);
    add(new THREE.CylinderGeometry(r * .9, r, .008, 20), silver, h - .004); add(new THREE.CylinderGeometry(r, r * .88, .006, 20), silver, .003);
    const tab = add(new THREE.BoxGeometry(.012, .002, .02), silver, h + .001); tab.position.z = .008;
  } else if (d.shape === 'pet' || d.shape === 'glass') {
    const glass = d.shape === 'glass', r = glass ? .03 : .034, bh = glass ? .11 : .14;
    const shell = M(glass ? '#BFE6F2' : '#EEF5F8', { transparent: true, opacity: glass ? .5 : .35, roughness: .05, depthWrite: false });
    add(new THREE.CylinderGeometry(r - .003, r - .003, bh - .01, 18), M(d.liquid, { transparent: !!d.clear, opacity: d.clear ? .55 : 1, roughness: .1 }), bh / 2);
    add(new THREE.CylinderGeometry(r, r, bh, 18, 1, true), shell, bh / 2);
    add(new THREE.CylinderGeometry(.016, r, .045, 18), d.clear || glass ? shell : M(d.liquid, { roughness: .15 }), bh + .022);
    add(new THREE.CylinderGeometry(r + .0008, r + .0008, glass ? .045 : .06, 18, 1, true), lblM, bh * .5);
    add(new THREE.CylinderGeometry(.015, .015, .025, 12), shell, bh + .055);
    if (glass) add(new THREE.SphereGeometry(.012, 12, 8), M('#E4F4FA', { roughness: .05 }), bh + .05);
    add(new THREE.CylinderGeometry(.0155, .0155, .018, 14), M(d.cap), bh + .074);
  } else if (d.shape === 'carton') {
    const mats = [lblM, lblM, M(d.body), M(d.body), lblM, lblM];
    add(new THREE.BoxGeometry(.06, .09, .06), mats, .045);
    const roof = add(new THREE.ConeGeometry(.043, .025, 4), M(shade(d.body, .92)), .1); roof.rotation.y = Math.PI / 4;
    add(new THREE.BoxGeometry(.06, .012, .008), M(shade(d.body, .92)), .115);
    const st = add(new THREE.CylinderGeometry(.002, .002, .05, 6), M(d.band), .12); st.position.x = .015;
  } else {
    add(new THREE.CylinderGeometry(.018, .021, .07, 16), M(d.body), .035);
    add(new THREE.CylinderGeometry(.017, .017, .004, 16), M(d.cap, { metalness: .6 }), .072);
  }
  G.userData.h = d.shape === 'pet' ? .23 : d.shape === 'glass' ? .19 : d.shape === 'carton' ? .13 : d.shape === 'small' ? .075 : .12;
  return G;
}
const VEND_THEMES = [
  { brand: 'ASAHO', side: 'SOFT DRINKS', body: '#1F3F8F', front: '#1F3F8F', accent: '#E8524A', ad: 'WONDO' },
  { brand: 'KIRRI', side: 'KIRRI', body: '#F2F2EE', front: '#F2F2EE', accent: '#D8433F', ad: '今だけ GET!' },
  { brand: 'いちご', side: 'PREMIUM MILK', body: '#F7B8C8', front: '#FBE3EA', accent: '#E8527A', ad: 'いちご牛乳', top: 'carton', carton: true },
  { brand: '牛乳', side: '牛乳', body: '#3E8EDB', front: '#EEF6FF', accent: '#2F6FB8', ad: 'PREMIUM', top: 'carton', carton: true },
  { brand: 'レモン', side: 'LEMON', body: '#2E8C5A', front: '#FFF4B8', accent: '#E8B820', ad: 'レモン', top: 'carton', carton: true },
  { brand: 'MOONTORY', side: 'YUZU', body: '#F2B233', front: '#FFE9A8', accent: '#E07B28', ad: 'ゆず', top: 'orange' },
  { brand: 'PURE', side: 'ION ENERGY', body: '#F4F6F8', front: '#F4F6F8', accent: '#2F6FB8', ad: 'ION' },
  { brand: 'BOSSA', stock: 'coffee', side: 'COFFEE', body: '#1D2B5A', front: '#1D2B5A', accent: '#C9A06A', ad: 'COFFEE', top: 'plant' },
  { brand: 'ラーメン', side: 'HOT MEAL', body: '#FAF6EE', front: '#FAF6EE', accent: '#E8642A', ad: 'ラーメン' },
  { brand: 'MUSCAT', side: 'SHINE', body: '#B9E08A', front: '#F4F9EA', accent: '#5C9E2E', ad: 'MUSCAT', top: 'plant' },
  { brand: 'みなと', side: 'DRINK', body: '#D9443F', front: '#D9443F', accent: '#FFFFFF', ad: 'つめた〜い' },
];
const vendCache = {};
function vendLineup(th) {                         // 4 rows x 7 slots, the same for every machine of this theme
  if (th.lineup) return th.lineup;
  const rows = VEND_ROWS[th.stock || (th.carton ? 'milk' : 'drinks')];
  th.lineup = rows.map((pool, r) => { const o = Math.floor(rand() * pool.length); return Array.from({ length: 7 }, (_, i) => ({ id: pool[(o + i) % pool.length], hot: r === 3 })); });
  return th.lineup;
}
function vendFront(th) {
  if (vendCache[th.brand]) return vendCache[th.brand];
  const W = 220, H = 400, dark = new THREE.Color(th.front).getHSL({}).l < .45;
  const ink = dark ? '#FFFFFF' : '#2B2D33';
  const lineup = vendLineup(th);
  const drawDisplay = (g) => {
    const bgd = g.createLinearGradient(0, 46, 0, 258); bgd.addColorStop(0, '#FFFFFF'); bgd.addColorStop(1, '#E3ECF4');
    g.fillStyle = bgd; g.fillRect(12, 46, W - 24, 212);
    for (let r = 0; r < 4; r++) {
      const y = 50 + r * 52;
      g.fillStyle = 'rgba(40,60,90,.08)'; g.fillRect(12, y + 26, W - 24, 10);              // soft shadow at the back of the shelf
      lineup[r].forEach((it, i) => drawDrink(g, DRINKS[it.id], 26 + i * 28, y + 36, 33));
      g.fillStyle = '#B9C0C8'; g.fillRect(12, y + 36, W - 24, 2.5); g.fillStyle = '#EEF1F4'; g.fillRect(12, y + 36, W - 24, .8);
      g.textAlign = 'center'; g.textBaseline = 'middle';
      lineup[r].forEach((it, i) => {                                                         // price tag, then the button
        const x = 14 + i * 28, hot = it.hot;
        g.fillStyle = hot ? '#D8433F' : '#2F6FB8'; g.fillRect(x, y + 39, 24, 4.5);
        g.fillStyle = '#FFFFFF'; g.font = '700 3.3px "Zen Maru Gothic"'; g.fillText(hot ? 'あたたか〜い' : 'つめた〜い', x + 12, y + 41.3);
        g.fillStyle = '#FFFFFF'; g.fillRect(x, y + 43.5, 24, 4.5); g.fillStyle = '#1E1F25'; g.font = '900 4px sans-serif'; g.fillText('¥' + DRINKS[it.id].price, x + 12, y + 45.9);
        g.fillStyle = hot ? '#FF8A7A' : '#7FE08F'; g.beginPath(); g.roundRect(x + 7, y + 48.6, 10, 2.4, 1.2); g.fill();
      });
    }
  };
  const map = canvasTex(W * 2, H * 2, (g) => {
    g.scale(2, 2);
    const bg = g.createLinearGradient(0, 0, W, 0); bg.addColorStop(0, shade(th.front, .93)); bg.addColorStop(.5, shade(th.front, 1.03)); bg.addColorStop(1, shade(th.front, .9));
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = th.accent === '#FFFFFF' ? shade(th.body, .75) : th.accent; g.fillRect(0, 0, W, 40);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '900 22px "Zen Maru Gothic"'; let tw = g.measureText(th.brand).width; if (tw > W * .8) g.font = `900 ${22 * W * .8 / tw}px "Zen Maru Gothic"`; g.fillText(th.brand, W / 2, 21);
    g.fillStyle = '#2B2D33'; g.fillRect(8, 42, W - 16, 220);
    drawDisplay(g);
    g.fillStyle = 'rgba(255,255,255,.14)'; g.beginPath(); g.moveTo(20, 258); g.lineTo(80, 46); g.lineTo(104, 46); g.lineTo(44, 258); g.fill();
    // ad panel
    g.fillStyle = shade(th.front, .85); g.fillRect(10, 270, 118, 56);
    const ad = g.createLinearGradient(12, 272, 126, 324); ad.addColorStop(0, shade(th.accent === '#FFFFFF' ? '#9FD3F4' : th.accent, 1.25)); ad.addColorStop(1, th.accent === '#FFFFFF' ? '#2F6FB8' : th.accent);
    g.fillStyle = ad; g.fillRect(12, 272, 114, 52);
    g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(34, 298, 14, 0, 7); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = '900 15px "Zen Maru Gothic"'; tw = g.measureText(th.ad).width; if (tw > 70) g.font = `900 ${15 * 70 / tw}px "Zen Maru Gothic"`; g.fillText(th.ad, 88, 298);
    // controls
    g.fillStyle = '#1E1F25'; g.fillRect(138, 272, 70, 20); g.fillStyle = '#5BE36B'; g.font = '700 11px monospace'; g.fillText(pick(['MON 18°C', 'TUE 21°C', 'FRI 16°C']), 173, 282);
    g.fillStyle = '#C9CDD3'; g.fillRect(140, 298, 22, 26); g.fillStyle = '#1E1F25'; g.fillRect(149, 302, 4, 16);
    g.fillStyle = '#C9CDD3'; g.fillRect(168, 298, 38, 26); g.fillStyle = '#1E1F25'; g.fillRect(172, 309, 30, 3);
    g.fillStyle = '#F2C230'; g.beginPath(); g.arc(196, 335, 7, 0, 7); g.fill();
    // pickup slot
    g.fillStyle = '#1E1F25'; g.fillRect(24, 340, 150, 36); const fl = g.createLinearGradient(0, 340, 0, 376); fl.addColorStop(0, '#4A4D55'); fl.addColorStop(1, '#23252B'); g.fillStyle = fl; g.fillRect(28, 343, 142, 30);
    g.fillStyle = '#C9CDD3'; g.font = '700 9px "Zen Maru Gothic"'; g.fillText('∨ 取出口 ∨', 99, 358);
    g.fillStyle = ink; g.globalAlpha = .6; g.font = '700 8px sans-serif'; g.fillText('つめた〜い・あたたか〜い', W / 2, 390); g.globalAlpha = 1;
  });
  const emi = canvasTex(W * 2, H * 2, (g) => { g.fillStyle = '#000'; g.fillRect(0, 0, W * 2, H * 2); g.drawImage(map.image, 24, 92, (W - 24) * 2, 424, 24, 92, (W - 24) * 2, 424); g.globalAlpha = .5; g.drawImage(map.image, 24, 544, 392, 104, 24, 544, 392, 104); });
  return vendCache[th.brand] = glowMat(map, emi, .15, .5, { roughness: .45 });
}
const vendSideCache = {};
function vendSide(th) {
  if (vendSideCache[th.brand]) return vendSideCache[th.brand];
  const t = canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = th.body; g.fillRect(0, 0, w, h);
    g.fillStyle = th.accent === '#FFFFFF' ? shade(th.body, .75) : th.accent; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 10, w, 10);
    g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI / 2);
    g.fillStyle = th.accent === th.body ? '#FFFFFF' : (th.accent === '#FFFFFF' ? '#FFFFFF' : th.accent); g.font = '900 40px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const tw = g.measureText(th.side).width; if (tw > h * .85) g.font = `900 ${40 * h * .85 / tw}px "Zen Maru Gothic"`; g.fillText(th.side, 0, 0);
    g.restore();
  });
  return vendSideCache[th.brand] = std('#ffffff', { map: t, roughness: .5 });
}
function vending(side, z) {
  if (!claim(side, 'wall', z - .6, z + .6)) return;
  const th = pick(VEND_THEMES);
  const g = group(side * 5.45, .15, z, side < 0 ? Math.PI / 2 : -Math.PI / 2);
  const bodyM = std(th.body, { roughness: .5 }), sideM = vendSide(th);
  box(1.0, 1.85, .8, [sideM, sideM, bodyM, bodyM, bodyM, bodyM], 0, .93, 0, g);
  box(1.04, .08, .84, std(shade(th.body, .8)), 0, 1.89, 0, g);
  if (th.top === 'carton') {                     // milk-carton roof
    const r = .6, roofM = std(th.body, { roughness: .5 });
    const c = mesh(new THREE.CylinderGeometry(r, r, .84, 3), roofM, 0, 1.93 + r * .25, 0, g); c.rotation.x = -Math.PI / 2; c.scale.z = .5;
    box(.2, .14, .1, std('#FFFFFF'), 0, 2.32, .2, g);
  } else if (th.top === 'orange') {
    mesh(new THREE.SphereGeometry(.28, 16, 12), std('#F29A2A', { roughness: .6 }), 0, 2.15, 0, g).scale.y = .85;
    box(.14, .03, .08, std('#4E8F49'), .05, 2.42, 0, g, false);
  } else if (th.top === 'plant') { const pp = plantPot(0, 0, 0, .7); pp.position.set(.2, 1.93, 0); g.add(pp); }
  const fr = vendFront(th);
  mesh(cardGeo, fr, 0, .93, .405, g, false).scale.set(.98, 1.83, 1);
  box(.6, .12, .04, std('#2A2C33', { roughness: .3, metalness: .4 }), 0, .21, .415, g, false);   // pickup flap over the slot
  box(1.02, .05, .82, std(shade(th.body, .7)), 0, .02, 0, g, false);
  const machine = { g, th };
  addAction(side * 4.85, z, 1.5, () => 'kau', () => openVend(machine), () => !holding);
  // recycling bin next to it
  const bz = z + (side < 0 ? 1 : -1) * .85;
  if (claim(side, 'wall', bz - .3, bz + .3)) { const bg = group(side * 5.6, .15, bz); cyl(.24, .22, .75, std('#3E7CD6'), 0, .375, 0, 12, bg); cyl(.25, .25, .06, std('#E8E8E8'), 0, .77, 0, 12, bg); }
}

function bike(side, z, color) {
  if (!claim(side, 'wall', z - .35, z + .35)) return;
  bikeAt(side * 5.3, z, Math.PI / 2 + range(-.12, .12), color);
}

function scooter(side, z, color) {
  if (!claim(side, 'wall', z - .5, z + .5)) return;
  const g = group(side * 5.25, .15, z, Math.PI / 2 + range(-.1, .1));
  const c = std(color), dark = std('#2B2B33');
  for (const s of [-.55, .55]) { const w = cyl(.22, .22, .12, dark, s, .22, 0, 14, g); w.rotation.x = Math.PI / 2; }
  box(.9, .16, .3, dark, 0, .38, 0, g);
  box(.55, .4, .36, c, -.3, .6, 0, g);
  box(.5, .1, .32, std('#3A3A40'), -.3, .85, 0, g);
  const fork = cyl(.04, .04, .8, metal('#9BA0A8'), .5, .62, 0, 6, g); fork.rotation.z = -.3;
  box(.25, .5, .38, c, .48, .6, 0, g);
  box(.06, .06, .6, metal('#9BA0A8'), .58, 1.02, 0, g);
  box(.3, .25, .34, metal('#A9AEB6'), -.65, .9, 0, g);
}

function cone(side, z) {
  const x = side * range(4.85, 5.05);
  if (!claim(side, 'wall', z - .3, z + .3)) return;
  const g = group(x, .15, z);
  mesh(new THREE.ConeGeometry(.19, .68, 14), std('#F26B3A'), 0, .4, 0, g);
  cyl(.11, .14, .14, std('#FFFFFF'), 0, .45, 0, 14, g, false);
  box(.42, .06, .42, std('#F26B3A'), 0, .03, 0, g);
}

function crates(side, z) {
  if (!claim(side, 'wall', z - .5, z + .5)) return;
  const col = pick(['#2F6FB8', '#D8433F', '#F2C14E', '#3C9D5D']);
  for (let i = 0; i < 3; i++) box(.48, .3, .36, crateMat(col), side * 5.55, .3 + i * .31, z + (i === 2 ? .1 : 0) + range(-.03, .03));
  box(.48, .3, .36, crateMat(col), side * 5.55, .3, z + .4);
}

function postbox(side, z) {
  if (!claim(side, 'wall', z - .35, z + .35)) return;
  const g = group(side * 5.4, .15, z);
  const red = std('#D8352E', { roughness: .5 });
  cyl(.28, .28, 1.0, red, 0, .7, 0, 16, g);
  mesh(new THREE.SphereGeometry(.28, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), red, 0, 1.2, 0, g);
  box(.1, .2, .3, std('#2A2630'), -side * .25, .9, 0, g, false);
  box(.12, .2, .12, std('#555'), 0, .1, 0, g);
}

function doorClutter(side, z) {
  if (!claim(side, 'wall', z - .55, z + .55)) return;
  const x = side * 5.6, items = ['bucket', 'broom', 'umbrella', 'bin', 'stool'].sort(() => rand() - .5).slice(0, 2 + Math.floor(rand() * 2));
  items.forEach((it, i) => {
    const zz = z - .35 + i * .35;
    if (it === 'bucket') { cyl(.15, .12, .28, std(pick(['#3E7CD6', '#D8433F', '#9AA0A8'])), x, .29, zz, 12); }
    if (it === 'broom') { const st2 = cyl(.015, .015, 1.25, std('#C9A06A'), x + side * .05, .78, zz, 6); st2.rotation.z = side * .15; const hd = box(.06, .22, .28, std('#B48A4A'), x - side * .03, .26, zz); hd.rotation.z = side * .15; }
    if (it === 'umbrella') { cyl(.13, .13, .45, metal('#A9AEB6'), x, .38, zz, 10); for (let k = 0; k < 3; k++) { const u = cyl(.035, .01, .8, std(pick(['#2F6FB8', '#E86F8A', '#3A3A40', '#F2C14E', '#FFFFFF'])), x + range(-.06, .06), .62, zz + range(-.06, .06), 6); u.rotation.set(range(-.15, .15), 0, range(-.15, .15)); } }
    if (it === 'bin') { cyl(.2, .18, .6, std(pick(['#7FA36A', '#5F7D9C', '#B9BDC3'])), x, .45, zz, 12); cyl(.21, .21, .05, std('#3E3E44'), x, .77, zz, 12, scene, false); }
    if (it === 'stool') { box(.32, .04, .32, std('#C0392B'), x, .6, zz); for (const [a, b] of [[-.13, -.13], [.13, -.13], [-.13, .13], [.13, .13]]) box(.03, .45, .03, metal('#9AA0A8'), x + a, .38, zz + b, scene, false); }
  });
}
function gachapon(side, z, count = 4) {          // capsule-toy machines
  if (!claim(side, 'wall', z - count * .26, z + count * .26)) return;
  const clear = std('#E8F2F8', { transparent: true, opacity: .35, roughness: .1 });
  for (let i = 0; i < count; i++) {
    const zz = z - (count - 1) * .26 + i * .52, col = pick(['#D8433F', '#2F6FB8', '#F2C14E', '#3C9D5D', '#E86F8A']);
    const g = group(side * 5.6, .15, zz);
    box(.46, .55, .46, std(col), 0, .28, 0, g);
    box(.46, .12, .46, std('#F4F4F2'), 0, .61, 0, g);
    for (let k = 0; k < 9; k++) mesh(new THREE.SphereGeometry(.055, 10, 8), std(pick(['#F4A9BE', '#FFE08A', '#9FD3F4', '#B9E3A0', '#FFFFFF', '#F7A35C'])), range(-.15, .15), range(.72, .95), range(-.15, .15), g, false);
    box(.44, .42, .44, clear, 0, .88, 0, g, false);
    box(.46, .06, .46, std(col), 0, 1.12, 0, g);
    cyl(.06, .06, .04, metal('#C9CDD3'), -side * .24, .4, 0, 12, g, false).rotation.z = Math.PI / 2;
  }
}
function cafeTables(side, z) {
  if (!claim(side, 'wall', z - 1.0, z + 1.0)) return;
  const x = side * 5.3, T = cafeTex();
  const slatM = std('#ffffff', { map: T.grainMid, roughness: .5 }), slatBent = std('#ffffff', { map: T.grainMid, roughness: .5, side: THREE.DoubleSide });
  const topM = std('#ffffff', { map: T.grainTop, roughness: .35 }), edgeM = std('#5A3A26', { roughness: .45 });
  const iron = std('#26272B', { roughness: .45, metalness: .6 }), brass = std('#C9A45A', { roughness: .35, metalness: .7 });
  // round wooden top with a darker edge band, on a cast-iron pedestal with a four-foot base
  const t = group(x, .16, z); scene.add(t);
  cyl(.4, .4, .035, topM, 0, .74, 0, 32, t); cyl(.405, .405, .02, edgeM, 0, .715, 0, 32, t, false);
  cyl(.1, .1, .02, iron, 0, .695, 0, 16, t, false);
  cyl(.028, .032, .62, iron, 0, .38, 0, 12, t);
  for (const y of [.62, .14]) cyl(.05, .05, .04, iron, 0, y, 0, 12, t, false);
  for (let k = 0; k < 4; k++) {
    const f = group(0, 0, 0, k * Math.PI / 2 + Math.PI / 4); t.add(f);
    const ft = box(.34, .03, .05, iron, .17, .05, 0, f, false); ft.rotation.z = -.12;
    cyl(.03, .03, .015, iron, .33, .008, 0, 10, f, false);
  }
  // a little brass table-number stand
  cyl(.02, .025, .01, brass, -.15, .763, -.08, 10, t, false); box(.06, .08, .005, brass, -.15, .808, -.08, t, false);
  // two bistro chairs facing the table: black iron frame, wood-slat seat, curved slatted back
  for (const dz of [-.7, .7]) {
    const ry = dz < 0 ? 0 : Math.PI, c = group(x, .16, z + dz, ry); scene.add(c); addSeat(x, z + dz, ry, 1.12);
    // legs, slightly splayed, with foot caps
    for (const [a, b] of [[-.18, .17], [.18, .17]]) { const l = cyl(.012, .016, .45, iron, a, .225, b, 8, c); l.rotation.set(-.05, 0, a > 0 ? -.04 : .04); cyl(.018, .018, .012, iron, a * 1.05, .006, b * 1.05, 8, c, false); }
    // back legs run up into the backrest, leaning back a little
    for (const a of [-.18, .18]) {
      const l = cyl(.013, .016, .46, iron, a * 1.03, .225, -.2, 8, c); l.rotation.set(.06, 0, a > 0 ? -.04 : .04);
      cyl(.018, .018, .012, iron, a * 1.06, .006, -.21, 8, c, false);
      const u = cyl(.012, .013, .5, iron, a, .7, -.215, 8, c); u.rotation.x = -.12;
    }
    // seat frame, cross stretchers and a ring under the seat
    box(.4, .025, .025, iron, 0, .43, .17, c, false); box(.4, .025, .025, iron, 0, .43, -.19, c, false);
    for (const a of [-.19, .19]) box(.025, .025, .37, iron, a, .43, -.01, c, false);
    const ring = mesh(new THREE.TorusGeometry(.17, .008, 6, 24), iron, 0, .17, -.01, c, false); ring.rotation.x = Math.PI / 2;
    // seat: five wooden slats with small gaps and a rounded front edge
    for (let i = 0; i < 5; i++) box(.42, .022, .066, slatM, 0, .455, .16 - i * .08, c);
    const nose = cyl(.013, .013, .42, slatM, 0, .455, .195, 8, c, false); nose.rotation.z = Math.PI / 2;
    // backrest: three curved slats wrapped around the sitter, under a curved iron top rail
    for (let i = 0; i < 3; i++) {
      const y = .66 + i * .1, zz = -.235 - i * .012;
      const sl = mesh(new THREE.CylinderGeometry(.5, .5, .06, 18, 1, true, Math.PI - .42, .84), slatBent, 0, y, zz + .5, c, false);
      sl.rotation.x = -.12;
    }
    const rail = mesh(new THREE.TorusGeometry(.5, .012, 6, 20, .84), iron, 0, .95, -.27 + .5, c, false);
    rail.rotation.set(Math.PI / 2 - .12, 0, -Math.PI / 2 - .42);
  }
}
function recycling(side, z) {
  if (!claim(side, 'wall', z - .8, z + .8)) return;
  const labels = [['燃える\nゴミ', '#D8433F'], ['カン\nビン', '#2F6FB8'], ['ペット\nボトル', '#3C9D5D']];
  labels.forEach(([t, c], i) => {
    const zz = z - .5 + i * .5, g = group(side * 5.55, .15, zz, side < 0 ? Math.PI / 2 : -Math.PI / 2);
    box(.44, .7, .5, std(c), 0, .35, 0, g); box(.46, .06, .52, std(shade(c, .8)), 0, .72, 0, g);
    const tex = canvasTex(64, 64, (g2, w, h) => { g2.fillStyle = '#fff'; g2.fillRect(0, 0, w, h); g2.fillStyle = c; g2.font = '900 15px "Zen Maru Gothic"'; g2.textAlign = 'center'; g2.textBaseline = 'middle'; t.split('\n').forEach((l, k) => g2.fillText(l, w / 2, 20 + k * 22)); });
    mesh(cardGeo, std('#fff', { map: tex }), 0, .42, .26, g, false).scale.set(.3, .3, 1);
  });
  // a green net over a pile of bags
  for (let i = 0; i < 4; i++) mesh(new THREE.SphereGeometry(.2, 10, 8), std('#EDEFE8', { roughness: .4 }), side * 5.05, .3, z + range(-.6, .6), scene, false);
}

function guardrail(side, z0, z1, color) {
  let a = Math.min(z0, z1), b = Math.max(z0, z1);
  // leave a gap in front of every entrance: split the run around doorways (pieces only shrink, so this ends)
  for (const [sd, p, q] of doorways) {
    if (sd !== side || q + .8 <= a || p - .8 >= b) continue;
    if (p - .8 > a) guardrail(side, a, p - .8, color);
    if (q + .8 < b) guardrail(side, q + .8, b, color);
    return;
  }
  if (b - a < 2.5 || !claim(side, 'curb', a, b)) return;
  const x = side * 3.92, m = metal(color), n = Math.ceil((b - a) / 2);
  for (let i = 0; i <= n; i++) cyl(.035, .035, .85, m, x, .58, a + i * (b - a) / n, 8);
  for (const y of [.62, .95]) { const r = cyl(.03, .03, b - a, m, x, y, (a + b) / 2, 8); r.rotation.x = Math.PI / 2; }
}
function hydrant(side, z) {
  if (!claim(side, 'curb', z - .25, z + .25)) return;
  const g = group(side * 4.0, .15, z), red = std('#D8352E', { roughness: .45 });
  cyl(.13, .15, .55, red, 0, .3, 0, 14, g); mesh(new THREE.SphereGeometry(.14, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), red, 0, .57, 0, g);
  for (const s2 of [-1, 1]) { const nz = cyl(.05, .05, .12, red, s2 * .17, .38, 0, 10, g); nz.rotation.z = Math.PI / 2; }
  cyl(.03, .03, .06, std('#C9A030'), 0, .72, 0, 8, g);
}
const lightOn = c => glowMat(null, null, 1.6, 2.6, { color: c, emissive: new THREE.Color(c) });
function trafficLight(side, z, face) {               // face: +1 = the lights face +z
  for (const dz of [0, 1.2, -1.2, 2.2]) if (claim(side, 'curb', z + dz - .35, z + dz + .35)) { z += dz; break; } else if (dz === 2.2) return;
  const x = side * 4.0, steel = metal('#8C9096');
  cyl(.09, .11, 5.6, steel, x, 2.8, z, 10);
  const armLen = 2.9; const arm = cyl(.06, .06, armLen, steel, x - side * armLen / 2, 5.35, z, 8); arm.rotation.z = Math.PI / 2;
  const hx = x - side * (armLen - .35);
  box(1.15, .4, .24, std('#3A3D44'), hx, 5.1, z);
  box(1.3, .55, .03, std('#2B2D33'), hx, 5.1, z - face * .13);
  [[-.36, '#3FE07A', true], [0, '#F2C230', false], [.36, '#E8402F', false]].forEach(([dx, c, on]) => {
    const l = mesh(new THREE.CircleGeometry(.13, 18), on ? lightOn(c) : std(shade(c, .35)), hx + dx * side * -1, 5.1, z + face * .125, scene, false); l.rotation.y = face > 0 ? 0 : Math.PI;
    const visor = box(.3, .04, .16, std('#3A3D44'), hx + dx * side * -1, 5.26, z + face * .2, scene, false);
  });
  // pedestrian signal
  box(.34, .62, .22, std('#3A3D44'), x - side * .28, 2.75, z);
  const red = mesh(new THREE.CircleGeometry(.11, 16), lightOn('#E8402F'), x - side * .28, 2.92, z + face * .115, scene, false); red.rotation.y = face > 0 ? 0 : Math.PI;
  const grn = mesh(new THREE.CircleGeometry(.11, 16), std('#1E4A30'), x - side * .28, 2.6, z + face * .115, scene, false); grn.rotation.y = face > 0 ? 0 : Math.PI;
  box(.28, .1, .14, std('#F2C230'), x - side * .25, 1.15, z);           // push button box
}
// a tall sign tower listing the businesses on each floor
const TENANTS = ['英会話', '整骨院', '学習塾', '歯科', 'カラオケ', 'ネイル', '不動産', 'ヨガ', '美容室', '税理士', '鍼灸院', 'ピアノ'];
function tenantTower(B, h) {
  const n = Math.max(2, Math.floor((h - B.base - .6) / .8)), w = .78, th = n * .8;
  const tex = canvasTex(128, n * 104, (g, W, Hh) => {
    for (let i = 0; i < n; i++) {
      const y = i * 104, col = pick(['#FFFFFF', '#2F6FB8', '#D8433F', '#1D2B4A', '#F2C230', '#3C9D5D', '#E86F8A']);
      g.fillStyle = col; g.fillRect(2, y + 3, W - 4, 98);
      const ink = col === '#FFFFFF' || col === '#F2C230' ? '#1D2B4A' : '#FFFFFF';
      g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '700 20px "Zen Maru Gothic"'; g.fillText(`${n + 1 - i}F`, W / 2, y + 24);
      const t = pick(TENANTS); g.font = '900 30px "Zen Maru Gothic"'; const tw = g.measureText(t).width; if (tw > W * .9) g.font = `900 ${30 * W * .9 / tw}px "Zen Maru Gothic"`; g.fillText(t, W / 2, y + 66);
    }
  });
  const y = B.base + .4 + th / 2, z = B.uToZ(B.len - .45);
  for (const dy of [th / 2 - .2, -th / 2 + .2]) box(.62, .07, .07, metal('#6A6E78'), B.out(.31), y + dy, z, scene, false);
  sign({ tex, w, h: th, double: true, frameColor: '#D9DCE0', day: .2, night: .7 }, B.out(.62 + w / 2), y, z, 0);
}
const letterMats = {};
function windowLetters(text, color) {
  const k = text + color;
  if (!letterMats[k]) letterMats[k] = std('#ffffff', { map: canvasTex(256, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 80px "Zen Maru Gothic"'; const tw = g.measureText(text).width; if (tw > w * .9) g.font = `900 ${80 * w * .9 / tw}px "Zen Maru Gothic"`; g.fillText(text, w / 2, h / 2); }), transparent: true, alphaTest: .4 });
  return letterMats[k];
}
const adMats = [];
function adMat() {
  if (adMats.length < 5) {
    const i = adMats.length;
    const t = canvasTex(256, 160, (g, w, h) => {
      const bgc = ['#E8624A', '#FFFFFF', '#2F6FB8', '#F2C230', '#1D2B4A'][i]; g.fillStyle = bgc; g.fillRect(0, 0, w, h);
      g.textAlign = 'center'; g.textBaseline = 'middle';
      if (i === 0) { g.fillStyle = '#FFF4E0'; g.beginPath(); g.arc(80, 88, 44, 0, 7); g.fill(); g.beginPath(); g.moveTo(44, 64); g.lineTo(52, 30); g.lineTo(70, 50); g.moveTo(116, 64); g.lineTo(108, 30); g.lineTo(90, 50); g.fill(); g.fillStyle = '#2B2D33'; g.beginPath(); g.arc(66, 84, 5, 0, 7); g.arc(94, 84, 5, 0, 7); g.fill(); g.fillStyle = '#FFFFFF'; g.fillRect(150, 70, 50, 56); g.font = '900 30px "Zen Maru Gothic"'; g.fillText('ねこ珈琲', 190, 36); }
      else if (i === 1) { g.fillStyle = '#D8433F'; g.fillRect(16, 16, w - 32, h - 60); g.fillStyle = '#FFFFFF'; g.font = '900 40px "Zen Maru Gothic"'; g.fillText('カメラのミナト', w / 2, 60); g.fillStyle = '#D8433F'; g.font = '900 22px "Zen Maru Gothic"'; g.fillText('買取 ・ 免税 TAX FREE', w / 2, 132); }
      else if (i === 2) { g.fillStyle = '#FFFFFF'; g.font = '900 44px "Zen Maru Gothic"'; g.fillText('みなと電器', w / 2, 62); g.font = '700 22px "Zen Maru Gothic"'; g.fillText('大売り出し 本日まで', w / 2, 118); }
      else if (i === 3) { g.fillStyle = '#1D2B4A'; g.beginPath(); g.ellipse(90, 80, 70, 46, 0, 0, 7); g.fill(); g.fillStyle = '#F2C230'; g.font = '900 34px "Zen Maru Gothic"'; g.fillText('英会話', 90, 80); g.fillStyle = '#1D2B4A'; g.font = '900 40px sans-serif'; g.fillText('GO!', 200, 80); }
      else { g.fillStyle = '#9FD3F4'; g.beginPath(); g.roundRect(40, 24, 50, 116, 14); g.fill(); g.fillStyle = '#FFFFFF'; g.font = '900 40px "Zen Maru Gothic"'; g.fillText('ソーダ', 170, 70); g.font = '700 18px "Zen Maru Gothic"'; g.fillText('しゅわっと夏', 170, 116); }
    });
    adMats.push(glowMat(t, t, .1, .55, { roughness: .7 }));
  }
  return pick(adMats);
}
const chainTex = canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#5E9E5A'; g.lineWidth = 3; for (let i = -h; i < w; i += 14) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); } });
chainTex.wrapS = chainTex.wrapT = THREE.RepeatWrapping;
// detached house: pitched roof, a garden behind a low block wall with a green chain-link fence
function house(side, z0, z1) {
  const B = building(side, z0, z1, { h: 6.2, wall: pick(['#E8D9B8', '#F2EAD8', '#D9C9B0', '#EDE4D6', '#E2D3C6']), style: pick(['plaster', 'siding']), floors: 2, cols: 2, ground: 'house', setback: 2.4, depth: 9, roof: false, posters: false, ac: .4 });
  const len = z0 - z1, wdt = 9 + 1.4, r = wdt / Math.sqrt(3), sc = 2.1 / (1.5 * r);
  const rm = mesh(new THREE.CylinderGeometry(r, r, len + .9, 3), std(pick(['#5A5F6B', '#8A4A3A', '#4E6A86', '#6B5A48']), { roughness: .6 }), B.b.position.x, 6.2 + r * sc * .5, B.zc);
  rm.rotation.x = -Math.PI / 2; rm.scale.z = sc;
  const yard = mesh(new THREE.PlaneGeometry(2.4, len), std('#8FA56E'), side * 7.2, .03, B.zc, scene, false); yard.rotation.x = -Math.PI / 2;
  const du = len * .3, gate0 = B.uToZ(du - .3), gate1 = B.uToZ(du + 1.9);
  const segs = [[z0, side < 0 ? gate0 : gate1], [side < 0 ? gate1 : gate0, z1]];
  for (const [a, b] of segs) {
    const L = Math.abs(a - b); if (L < .5) continue;
    const zc = (a + b) / 2;
    stone(.25, .7, L, side * 6.0, .5, zc);
    const f = mesh(cardGeo, std('#ffffff', { map: (() => { const t = chainTex.clone(); t.needsUpdate = true; t.repeat.set(L / 1, 1); return t; })(), transparent: true, alphaTest: .4, side: THREE.DoubleSide }), side * 6.0, 1.35, zc, scene, false);
    f.rotation.y = Math.PI / 2; f.scale.set(L, 1.0, 1);
    for (let z = Math.min(a, b); z <= Math.max(a, b) + .01; z += L / Math.max(1, Math.round(L / 2))) cyl(.025, .025, 1.05, std('#5E9E5A'), side * 6.0, 1.35, z, 6);
    for (let i = 0; i < L * 1.5; i++) { const sh = group(side * range(6.4, 8.0), .03, zc + range(-L / 2, L / 2)); foliage(sh, 0, .45, 0, .45, .4, .45, pick(['green', 'dark', 'flower']), 12, .4); }
  }
  if (rand() < .5) streetTree(side * 7.6, B.uToZ(len * .8), pick(['maple', 'green']), .75);
  return B;
}

// convenience store: glowing stripe band with logo, pole sign, ATM stickers, bins
const STORE_BRANDS = [{ name: 'みなとマート', stripes: ['#F29A2A', '#1F8F5A', '#E8524A'], logo: 'M' }, { name: 'ハッピー12', stripes: ['#F2C230', '#3E9C8C', '#E86F8A'], logo: '12' }];
function konbiniFront(B, brand) {
  const len = B.len, ry = B.n > 0 ? Math.PI / 2 : -Math.PI / 2;
  const band = canvasTex(1024, 128, (g, w, h) => {
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
    brand.stripes.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, 26 + i * 26, w, 18); });
    g.fillStyle = '#FFFFFF'; g.fillRect(w / 2 - 170, 0, 340, h);
    g.fillStyle = brand.stripes[2]; g.beginPath(); g.arc(w / 2 - 110, h / 2, 40, 0, 7); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = '900 44px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(brand.logo, w / 2 - 110, h / 2 + 2);
    g.fillStyle = brand.stripes[1]; g.font = '900 46px "Zen Maru Gothic"'; g.fillText(brand.name, w / 2 + 50, h / 2 + 2);
  });
  const bm = glowMat(band, band, .3, .62, { roughness: .4 });
  box(.5, 1.0, len - .2, [bm, bm, std('#F4F4F2'), std('#E2E2E0'), bm, bm], B.out(.25), B.groundH + .55, B.zc);
  const lip = mesh(cardGeo, bm, B.out(.505), B.groundH + .55, B.zc, scene, false); lip.rotation.y = ry; lip.scale.set(len - .2, 1.0, 1);
  // stickers on the glass
  const stick = (t, bg, fg, u, y, w2, h2) => { const m = std('#fff', { map: canvasTex(128, 64, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = '900 26px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; const tw = g.measureText(t).width; if (tw > w * .9) g.font = `900 ${26 * w * .9 / tw}px "Zen Maru Gothic"`; g.fillText(t, w / 2, h / 2); }) }); const p = mesh(cardGeo, m, B.out(.02), y, B.uToZ(u), scene, false); p.rotation.y = ry; p.scale.set(w2, h2, 1); };
  stick('ATM', '#2F6FB8', '#FFFFFF', len * .3, 2.4, .6, .3); stick('酒・たばこ', '#E8524A', '#FFFFFF', len * .7, 2.4, .9, .3); stick('いらっしゃいませ', '#FFFFFF', brand.stripes[1], len * .5, 2.75, 1.3, .22);
  // tall lit pole sign at the corner
  const pz = B.uToZ(len - .6), px = B.out(1.6);
  box(.18, 3.2, .18, std('#BFC3C9'), px, 1.75, pz);
  const pole = canvasTex(128, 256, (g, w, h) => { g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h); brand.stripes.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, 160 + i * 18, w, 12); }); g.fillStyle = brand.stripes[2]; g.beginPath(); g.arc(w / 2, 70, 46, 0, 7); g.fill(); g.fillStyle = '#FFFFFF'; g.font = '900 48px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(brand.logo, w / 2, 72); g.fillStyle = '#C0392B'; g.fillRect(0, 222, w, 34); g.fillStyle = '#FFF'; g.font = '900 22px "Zen Maru Gothic"'; g.fillText('24時間', w / 2, 240); });
  sign({ tex: pole, w: .9, h: 1.8, double: true, frameColor: '#D9DCE0', day: .4, night: 1.2 }, px, 4.2, pz, ry + Math.PI / 2, hint.konbini);
  claim(B.n > 0 ? -1 : 1, 'wall', pz - .4, pz + .4);
  // bins by the door
  const s0 = B.n > 0 ? -1 : 1;
  const bz = B.uToZ(len * .5 + 1.4);
  if (claim(s0, 'wall', bz - .2, bz + 1.3)) ['燃える', 'カン', 'ペット'].forEach((t, i) => { const bg = group(B.out(.35), .15, bz + i * .55 * (B.uToZ(1) - B.uToZ(0)), ry); box(.5, .9, .45, std('#7FAF7A', { roughness: .5 }), 0, .45, 0, bg); box(.52, .06, .47, std('#5E8E5A'), 0, .93, 0, bg); box(.2, .1, .02, std('#222'), 0, .75, .23, bg, false); });
}
// traditional front for an izakaya or ramen shop: tiled roof, lattice, noren, lanterns, menu board, crates
const roofTileTex = canvasTex(128, 128, (g, w, h) => { for (let y = 0; y < h; y += 16) { g.fillStyle = y % 32 ? '#4E5260' : '#5C6070'; g.fillRect(0, y, w, 16); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, y + 13, w, 3); for (let x = (y % 32) / 2; x < w; x += 16) g.fillRect(x, y, 2, 13); } });
roofTileTex.wrapS = roofTileTex.wrapT = THREE.RepeatWrapping;
const latticeTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#F3E6C8'; g.fillRect(0, 0, w, h); g.fillStyle = '#5A3E2B'; for (let x = 0; x < w; x += 21) g.fillRect(x, 0, 9, h); g.fillRect(0, 0, w, 12); g.fillRect(0, h - 12, w, 12); g.fillRect(0, h * .55, w, 8); });
latticeTex.wrapS = latticeTex.wrapT = THREE.RepeatWrapping;
function wafuFront(B, norenText, info) {
  const len = B.len, ry = B.n > 0 ? Math.PI / 2 : -Math.PI / 2, s0 = B.n > 0 ? -1 : 1, gh = B.groundH;
  // wooden lattice over the shop glass, leaving the door
  for (const [u0, u1] of [[.3, len / 2 - 1.05], [len / 2 + 1.05, len - .3]]) {
    const lt = latticeTex.clone(); lt.needsUpdate = true; lt.repeat.set((u1 - u0) / 1.6, 1);
    const p = mesh(cardGeo, glowMat(lt, lt, 0, .55, { roughness: .8 }), B.out(.03), 1.45, B.uToZ((u0 + u1) / 2), scene, false); p.rotation.y = ry; p.scale.set(u1 - u0, 2.5, 1);
  }
  for (const u of [.25, len / 2 - 1.05, len / 2 + 1.05, len - .25]) box(.14, gh, .14, std('#5A3E2B'), B.out(.07), gh / 2, B.uToZ(u));
  // small tiled roof
  const rt = roofTileTex.clone(); rt.needsUpdate = true; rt.repeat.set(len / 1.2, 1);
  const roof = box(1.4, .1, len + .3, [std('#4E5260'), std('#4E5260'), std('#fff', { map: rt, roughness: .6 }), std('#3A3D44'), std('#4E5260'), std('#4E5260')], B.out(.7), gh + .05, B.zc);
  roof.rotation.z = B.n > 0 ? -.35 : .35;
  box(.12, .12, len + .3, std('#5A3E2B'), B.out(1.35), gh - .2, B.zc);
  // white noren over the door
  const nt = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#F4F1EA'; g.fillRect(0, 0, w, h); g.fillStyle = '#2B2D33'; g.font = '900 64px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(norenText, w / 2, h / 2); g.fillStyle = '#C9C3B5'; for (let i = 1; i < 3; i++) g.fillRect(i * w / 3 - 2, 18, 4, h); });
  const nm = std('#fff', { map: nt, side: THREE.DoubleSide });
  for (let i = 0; i < 3; i++) { const q = mesh(new THREE.PlaneGeometry(.66, 1.0), nm, B.out(.18), gh - .7, B.uToZ(len / 2 - .68 + i * .68), scene, false); q.rotation.y = ry; q.geometry = q.geometry.clone(); const uv = q.geometry.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, (uv.getX(k) + i) / 3); }
  box(.04, .04, 2.2, std('#5A3E2B'), B.out(.18), gh - .18, B.zc);
  // red lanterns both sides of the door
  for (const du of [-1.35, 1.35]) { const l = mesh(new THREE.SphereGeometry(.26, 14, 10), glowMat(null, null, .25, 2.4, { color: '#D8402F', emissive: 0xff5a2a }), B.out(.45), gh - .55, B.uToZ(len / 2 + du)); l.scale.y = 1.3; cyl(.12, .12, .06, std('#2A2630'), B.out(.45), gh - .2, B.uToZ(len / 2 + du), 10, scene, false); lampPositions.push(new THREE.Vector3(B.out(.8), gh - .6, B.uToZ(len / 2 + du))); }
  // standing menu board, beer crates, an outdoor AC unit, a potted plant
  const mz = B.uToZ(len / 2 + 1.75);
  if (claim(s0, 'wall', mz - .35, mz + .35)) { const mb = sign({ lines: [{ t: 'おしながき', size: .12, color: '#3A2A22' }, { t: 'ラーメン ¥780', size: .1, color: '#C0392B' }, { t: '餃子 ¥380', size: .1, color: '#3A2A22' }, { t: '生ビール ¥500', size: .1, color: '#3A2A22' }], top: .5, gap: .2, w: .6, h: 1.0, bg: '#FFF8EC', fg: '#3A2A22', frameColor: '#6E4F3E' }, B.out(.9), .78, mz, ry - .3 * -s0, info); mb.rotation.z = .07 * s0; }
  const cz = B.uToZ(len / 2 - 1.8);
  if (claim(s0, 'wall', cz - .45, cz + .45)) { for (let i = 0; i < 3; i++) { const c = group(B.out(.35), .15 + (i === 2 ? .31 : 0), cz + (i === 1 ? .48 : 0) * (B.uToZ(1) - B.uToZ(0)), ry); box(.46, .3, .34, std(pick(['#F4F4F2', '#E8C540', '#3E6FA8'])), 0, .15, 0, c); for (let k = 0; k < 6; k++) cyl(.04, .04, .26, std('#4E3A20'), -.15 + (k % 3) * .15, .3, -.08 + Math.floor(k / 3) * .16, 6, c, false); } }
  const az = B.uToZ(.8);
  if (claim(s0, 'wall', az - .45, az + .45)) { const ac = group(B.out(.3), .15, az, ry); box(.8, .6, .3, std('#EEEDE8'), 0, .3, 0, ac); const fan = cyl(.22, .22, .02, std('#3A3D44'), -.12, .3, .16, 18, ac, false); fan.rotation.x = Math.PI / 2; plantPot(0, 0, 0, .8).position.set(B.out(.3), .75, az); }
}

