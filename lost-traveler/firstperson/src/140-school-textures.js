// ---------------------------------------------------------------- school textures
let _schoolTex;
function schoolTex() {
  if (_schoolTex) return _schoolTex;
  const T = {};
  const rep = t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  // a line of text with furigana over the kanji, like a teacher writes for beginners
  const ruby = (g, segs, x, y, size, color, align = 'left', font = '"Klee One"', weight = 600) => {
    g.font = `${weight} ${size}px ${font}`;
    const ws = segs.map(([t]) => g.measureText(t).width), total = ws.reduce((a, b) => a + b, 0);
    let cx = align === 'center' ? x - total / 2 : x;
    g.textBaseline = 'alphabetic'; g.fillStyle = color;
    segs.forEach(([t, r], i) => {
      g.font = `${weight} ${size}px ${font}`; g.textAlign = 'left'; g.fillText(t, cx, y);
      if (r) { g.font = `${weight} ${size * .36}px ${font}`; g.textAlign = 'center'; g.fillText(r, cx + ws[i] / 2, y - size * .9); }
      cx += ws[i];
    });
  };
  T.ruby = ruby;

  // front yard: small pavers in soft brick colors (one tile = 2 m)
  T.paving = rep(canvasTex(512, 512, (g, W) => {
    g.fillStyle = '#A99A8C'; g.fillRect(0, 0, W, W);
    const cols = ['#D9BBA8', '#E6D3C1', '#CDB3A1', '#DCC8B8', '#C9A08F', '#E8D9CB', '#BFA594'];
    for (let r = 0; r < 16; r++) for (let c = 0; c < 9; c++) { const x = c * 64 - (r % 2) * 32; g.fillStyle = pick(cols); g.fillRect(x + 2, r * 32 + 2, 60, 28); g.fillRect(x + 2 + W, r * 32 + 2, 60, 28); }
    speckle(g, W, W, .05, 3000);
  }));
  T.lawn = rep(canvasTex(256, 256, (g, W) => {
    g.fillStyle = '#6FA04E'; g.fillRect(0, 0, W, W);
    for (let i = 0; i < 2600; i++) { g.strokeStyle = pick(['#5E9142', '#7DB05A', '#8BBE63', '#557F3C', '#A6CF7A']); g.lineWidth = 1.2; const x = rand() * W, y = rand() * W; g.beginPath(); g.moveTo(x, y); g.lineTo(x + range(-2, 2), y - range(3, 7)); g.stroke(); }
  }));
  // entrance floor: grey terrazzo tiles (30 cm)
  T.terrazzo = rep(canvasTex(256, 256, (g, W) => {
    g.fillStyle = '#8F9496'; g.fillRect(0, 0, W, W);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = shade('#C4C7C5', .94 + rand() * .1); g.fillRect(i * 64 + 1.5, j * 64 + 1.5, 61, 61); }
    for (let i = 0; i < 2500; i++) { g.fillStyle = pick(['rgba(70,70,75,.35)', 'rgba(255,255,255,.4)', 'rgba(150,120,100,.3)']); g.fillRect(rand() * W, rand() * W, 1.5, 1.5); }
  }));
  // hallway and stairs: polished teal-green sheet floor, a little mottled, a seam every 2 m
  T.lino = rep(canvasTex(256, 256, (g, W) => {
    g.fillStyle = '#3F9E97'; g.fillRect(0, 0, W, W);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rand() < .5 ? '255,255,255' : '20,60,60'},${.03 + rand() * .05})`; g.beginPath(); g.ellipse(rand() * W, rand() * W, range(2, 8), range(1, 4), rand() * 3, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(20,60,60,.25)'; g.fillRect(0, 0, W, 1.5);
  }));
  // classroom floor: wooden parquet squares, alternating direction (one tile = 1.2 m, 30 cm squares)
  T.parquet = rep(canvasTex(512, 512, (g, W) => {
    const n = 4, s = W / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const horiz = (i + j) % 2 === 0;
      for (let k = 0; k < 4; k++) {
        const a = k * s / 4;
        g.fillStyle = shade(pick(['#8A5434', '#7A4A2E', '#94603C', '#6F4328']), .92 + rand() * .14);
        horiz ? g.fillRect(i * s, j * s + a, s, s / 4) : g.fillRect(i * s + a, j * s, s / 4, s);
        g.strokeStyle = 'rgba(40,20,10,.12)'; g.lineWidth = 1;
        for (let q = 0; q < 4; q++) { const o = range(2, s / 4 - 2); g.beginPath(); if (horiz) { g.moveTo(i * s, j * s + a + o); g.lineTo(i * s + s, j * s + a + o + range(-2, 2)); } else { g.moveTo(i * s + a + o, j * s); g.lineTo(i * s + a + o + range(-2, 2), j * s + s); } g.stroke(); }
        g.fillStyle = 'rgba(0,0,0,.28)'; horiz ? g.fillRect(i * s, j * s + a, s, 1.5) : g.fillRect(i * s + a, j * s, 1.5, s);
      }
    }
  }));
  // ceiling: 60 cm acoustic tiles with little holes (one tile = 1.2 m)
  T.ceiling = rep(canvasTex(256, 256, (g, W) => {
    g.fillStyle = '#C9C4BA'; g.fillRect(0, 0, W, W);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = '#EEEBE3'; g.fillRect(i * 128 + 1.5, j * 128 + 1.5, 125, 125); }
    for (let i = 0; i < 1400; i++) { g.fillStyle = 'rgba(120,110,100,.35)'; g.fillRect(rand() * W, rand() * W, 1.2, 1.2); }
  }));
  // classroom sliding door: wood, a patterned frosted window, a louvered vent at the bottom, a finger pull
  T.door = canvasTex(200, 420, (g, W, H) => {
    g.fillStyle = '#A86F42'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(70,40,20,${.06 + rand() * .08})`; g.lineWidth = 1 + rand() * 2; const x = rand() * W; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + range(-6, 6), H / 3, x + range(-6, 6), H * 2 / 3, x + range(-4, 4), H); g.stroke(); }
    g.strokeStyle = 'rgba(60,35,20,.5)'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6);
    g.fillStyle = '#E8E2D6'; g.fillRect(28, 30, W - 56, 150);
    const gl = g.createLinearGradient(0, 36, 0, 174); gl.addColorStop(0, '#C9DCE4'); gl.addColorStop(1, '#9FB8C4'); g.fillStyle = gl; g.fillRect(36, 38, W - 72, 134);
    g.save(); g.beginPath(); g.rect(36, 38, W - 72, 134); g.clip();
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1;
    for (let i = -140; i < 160; i += 7) { g.beginPath(); g.moveTo(36 + i, 38); g.lineTo(36 + i + 134, 172); g.stroke(); g.beginPath(); g.moveTo(W - 36 - i, 38); g.lineTo(W - 36 - i - 134, 172); g.stroke(); }
    g.restore();
    g.fillStyle = '#C9C6BE'; g.fillRect(30, H - 92, W - 60, 56); g.fillStyle = '#8E8A82'; for (let y = H - 88; y < H - 40; y += 7) g.fillRect(34, y, W - 68, 3);
    g.fillStyle = '#5A3A22'; g.fillRect(W - 28, 200, 12, 54); g.fillStyle = '#C9CDD2'; g.fillRect(W - 26, 202, 8, 50);
  });
  // shoe lockers (下駄箱): one tile = 1 m wide, 3 cubbies across, 6 high, white indoor shoes or street shoes, name labels
  T.getabako = rep(canvasTex(256, 474, (g, W, H) => {
    g.fillStyle = '#B9874F'; g.fillRect(0, 0, W, H);
    const cw = W / 3, rh = H / 6;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) {
      const x = c * cw + 5, y = r * rh + 5, w = cw - 10, h = rh - 18;
      g.fillStyle = '#3A2A1E'; g.fillRect(x, y, w, h);
      const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(255,255,255,.06)'); g.fillStyle = gr; g.fillRect(x, y, w, h);
      if (rand() < .78) {
        const indoor = rand() < .6, col = indoor ? '#F4F2EC' : pick(['#2E3550', '#D8433F', '#F4F2EC', '#5F7D9C', '#3A3A40', '#E9C46A']);
        for (const sx of [.3, .7]) {
          const cx = x + w * sx, by = y + h - 3, sw = w * .17;
          g.fillStyle = col; g.beginPath(); g.ellipse(cx, by - 9, sw, 13, 0, Math.PI, 0); g.fill(); g.fillRect(cx - sw, by - 9, sw * 2, 8);
          g.fillStyle = indoor ? pick(['#2F6FB8', '#D8433F', '#3C9D5D']) : '#EDEBE6'; g.fillRect(cx - sw, by - 4, sw * 2, 4);
        }
      }
      g.fillStyle = '#F4EFE2'; g.fillRect(x + w * .22, y + h + 4, w * .56, 9);
      g.fillStyle = 'rgba(40,40,60,.6)'; g.fillRect(x + w * .28, y + h + 7, w * .44 * (.4 + rand() * .6), 3);
    }
  }));
  // classroom cubbies at the back: one tile = 1 m, 4 across, 3 high, bags and books
  T.cubby = rep(canvasTex(256, 256, (g, W, H) => {
    g.fillStyle = '#EDEAE3'; g.fillRect(0, 0, W, H);
    const cw = W / 4, rh = H / 3;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const x = c * cw + 4, y = r * rh + 4, w = cw - 8, h = rh - 8;
      g.fillStyle = '#8F8B84'; g.fillRect(x, y, w, h);
      const t = rand();
      if (t < .4) { g.fillStyle = pick(['#2E3550', '#3A3A40', '#6B4A32', '#C0392B', '#5F7D9C']); g.beginPath(); g.roundRect(x + 4, y + h * .25, w - 8, h * .75, 6); g.fill(); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(x + 8, y + h * .45, w - 16, 3); }
      else if (t < .8) { let bx = x + 3; while (bx < x + w - 8) { const bw = range(5, 10), top = h * range(.15, .4); g.fillStyle = pick(['#D8433F', '#2F6FB8', '#F2C230', '#3C9D5D', '#F4F2EC', '#E28FA8', '#7A5A3A']); g.fillRect(bx, y + top, bw, h - top); bx += bw + 1; } }
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, y, w, 5);
    }
  }));
  T.curtain = canvasTex(128, 256, (g, W, H) => { for (let x = 0; x < W; x++) { const v = .8 + .2 * Math.sin(x / W * Math.PI * 6) ** 2; g.fillStyle = shade('#EADFC6', v); g.fillRect(x, 0, 1, H); } g.fillStyle = 'rgba(120,100,70,.15)'; g.fillRect(0, H - 8, W, 8); });
  T.blinds = rep(canvasTex(64, 64, (g, W, H) => { for (let y = 0; y < H; y += 8) { g.fillStyle = '#E6E4DE'; g.fillRect(0, y, W, 6); g.fillStyle = '#B9B6AE'; g.fillRect(0, y + 6, W, 2); } }));
  // a green felt notice board with a few papers pinned on its left part
  T.felt = (w, h, titles, upTo = 1) => canvasTex(w * 160, h * 160, (g, W, H) => {
    g.fillStyle = '#3E7A57'; g.fillRect(0, 0, W, H); speckle(g, W, H, .05, W * H / 60);
    let x = 14;
    for (const t of titles) {
      const pw = range(80, 110), ph = Math.min(pw * 1.35, H - 20), y = range(8, Math.max(10, H - ph - 8));
      if (x + pw > W * upTo - 8) break;
      g.save(); g.translate(x + pw / 2, y + ph / 2); g.rotate(range(-.03, .03));
      g.fillStyle = pick(['#FFFFFF', '#FFF6E0', '#FCE4EC', '#E3F0FB', '#FFF9C4']); g.fillRect(-pw / 2, -ph / 2, pw, ph);
      g.fillStyle = pick(['#D8433F', '#2F6FB8', '#3C9D5D', '#E8A33A', '#8E5BB5']); g.fillRect(-pw / 2, -ph / 2, pw, ph * .2);
      g.fillStyle = '#FFFFFF'; g.font = `900 ${pw * .16}px "Zen Maru Gothic"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, -ph / 2 + ph * .1, pw * .9);
      g.fillStyle = 'rgba(40,40,60,.35)'; for (let k = 0; k < 6; k++) g.fillRect(-pw * .38, -ph * .2 + k * ph * .1, pw * range(.5, .76), 3);
      g.fillStyle = '#D8433F'; g.beginPath(); g.arc(0, -ph / 2 + 5, 4, 0, 7); g.fill();
      g.restore();
      x += pw + range(14, 26);
    }
  });
  // the blackboard: three panels of today's lesson (Day 1), written in chalk with furigana
  const chalk = draw => canvasTex(525, 300, (g, W, H) => {
    g.fillStyle = '#2E5A46'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(255,255,255,${.015 + rand() * .03})`; g.beginPath(); g.ellipse(rand() * W, rand() * H, range(30, 110), range(10, 30), range(-.3, .3), 0, 7); g.fill(); }
    speckle(g, W, H, .04, 1500);
    g.shadowColor = 'rgba(255,255,255,.35)'; g.shadowBlur = 2;
    draw(g, W, H);
    g.shadowBlur = 0;
    for (let i = 0; i < 2500; i++) { g.fillStyle = 'rgba(46,90,70,.35)'; g.fillRect(rand() * W, rand() * H, 1.5, 1.5); }
  });
  const CW = '#F4F1E8', CY = '#F6E27A', CP = '#F7B3C6', CB = '#A9D4F2';
  T.boardL = chalk((g, W) => {
    ruby(g, [['11', ''], ['月', 'がつ'], ['20日', 'はつか'], ['（', ''], ['金', 'きん'], ['）', '']], 24, 48, 26, CW);
    ruby(g, [['〜を ください', '']], W / 2, 142, 58, CY, 'center');
    g.strokeStyle = CY; g.lineWidth = 3; g.beginPath(); g.moveTo(92, 158); g.lineTo(W - 92, 154); g.stroke();
    ruby(g, [['コーヒーを ください。', '']], 44, 216, 32, CW);
    ruby(g, [['お', ''], ['水', 'みず'], ['を ください。', '']], 44, 272, 32, CW);
  });
  T.boardC = chalk((g, W) => {
    ruby(g, [['ホットで？', '']], 46, 74, 40, CP);
    ruby(g, [['アイスで？', '']], 286, 74, 40, CB);
    ruby(g, [['店内', 'てんない'], ['で ／ ', ''], ['持', 'も'], ['ち', ''], ['帰', 'かえ'], ['りで', '']], W / 2, 150, 38, CW, 'center');
    ruby(g, [['さんびゃく', ''], ['円', 'えん'], ['です。', '']], W / 2, 222, 38, CY, 'center');
  });
  T.boardR = chalk((g, W) => {
    ruby(g, [['日直', 'にっちょく'], ['：リン', '']], W - 178, 48, 24, CW);
    ruby(g, [['さ　く　ら', '']], 28, 178, 80, CP);
    g.strokeStyle = CP; g.lineWidth = 3;
    const px = 470, py = 150;
    for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5 - Math.PI / 2; g.beginPath(); g.ellipse(px + Math.cos(a) * 22, py + Math.sin(a) * 22, 12, 19, a + Math.PI / 2, 0, 7); g.stroke(); }
    g.beginPath(); g.arc(px, py, 5, 0, 7); g.stroke();
    ruby(g, [['３つの ひらがな', '']], 32, 262, 28, CW);
  });
  // あいうえお chart, read right to left in columns; today's さ・く・ら are pink
  const KANA = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'や　ゆ　よ', 'らりるれろ', 'わ　　　を', 'ん　　　　'];
  T.kana = canvasTex(640, 420, (g, W, H) => {
    g.fillStyle = '#FFFDF6'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#F4A9BE'; g.fillRect(0, 0, W, 56);
    g.fillStyle = '#FFFFFF'; g.font = '900 40px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ひらがな', W / 2, 30);
    const cw = (W - 20) / 11, rh = (H - 76) / 5;
    KANA.forEach((col, c) => [...col].forEach((ch, r) => {
      if (ch === '　') return;
      const x = W - 10 - (c + 1) * cw, y = 66 + r * rh, hl = 'さくら'.includes(ch);
      g.fillStyle = hl ? '#FDE3EA' : (c + r) % 2 ? '#F6F1E4' : '#FFFFFF'; g.fillRect(x + 2, y + 2, cw - 4, rh - 4);
      g.fillStyle = hl ? '#C0466A' : '#2A2230'; g.font = `700 ${rh * .62}px "Zen Maru Gothic"`; g.fillText(ch, x + cw / 2, y + rh / 2 + 2);
    }));
  });
  // class timetable: subjects in hiragana, days with their readings
  T.jikanwari = canvasTex(360, 290, (g, W, H) => {
    g.fillStyle = '#FFFDF6'; g.fillRect(0, 0, W, H);
    ruby(g, [['時間割', 'じかんわり']], W / 2, 50, 30, '#1D2B4A', 'center', '"Zen Maru Gothic"', 900);
    const days = [['月', 'げつ'], ['火', 'か'], ['水', 'すい'], ['木', 'もく'], ['金', 'きん']], subj = ['かいわ', 'もじ', 'ぶんぽう', 'きく', 'よむ'];
    const x0 = 40, cw = (W - 50) / 5, y0 = 70, rh = 48;
    g.strokeStyle = '#B9B3A5'; g.lineWidth = 2;
    for (let i = 0; i <= 5; i++) { g.beginPath(); g.moveTo(x0 + i * cw, y0); g.lineTo(x0 + i * cw, y0 + rh * 4.5); g.stroke(); }
    for (let r = 0; r <= 4; r++) { g.beginPath(); g.moveTo(10, y0 + rh * .5 + r * rh); g.lineTo(W - 10, y0 + rh * .5 + r * rh); g.stroke(); }
    days.forEach((d, i) => ruby(g, [d], x0 + cw * (i + .5), y0 + 20, 20, '#1D2B4A', 'center', '"Zen Maru Gothic"', 900));
    for (let r = 0; r < 4; r++) {
      g.fillStyle = '#8A8478'; g.font = '700 18px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(r + 1), 25, y0 + rh * (r + 1));
      for (let c = 0; c < 5; c++) { g.fillStyle = ['#2F6FB8', '#C0466A', '#3C9D5D', '#E8A33A', '#8E5BB5'][(r + c * 2) % 5]; g.font = '700 17px "Zen Maru Gothic"'; g.fillText(subj[(r + c * 2) % 5], x0 + cw * (c + .5), y0 + rh * (r + 1)); }
    }
  });
  // posters for the hallway board
  T.rouka = canvasTex(300, 400, (g, W, H) => {
    g.fillStyle = '#FFF4B8'; g.fillRect(0, 0, W, H); g.strokeStyle = '#E8A33A'; g.lineWidth = 10; g.strokeRect(5, 5, W - 10, H - 10);
    ruby(g, [['廊下', 'ろうか'], ['は', '']], W / 2, 92, 54, '#C0392B', 'center', '"Zen Maru Gothic"', 900);
    ruby(g, [['走', 'はし'], ['らない', '']], W / 2, 178, 54, '#C0392B', 'center', '"Zen Maru Gothic"', 900);
    // a running figure in a red "no" circle
    const cx = W / 2, cy = 290;
    g.strokeStyle = '#1D2B4A'; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath(); g.arc(cx + 6, cy - 52, 13, 0, 7); g.fillStyle = '#1D2B4A'; g.fill();
    g.beginPath(); g.moveTo(cx, cy - 36); g.lineTo(cx - 8, cy + 10); g.moveTo(cx - 8, cy + 10); g.lineTo(cx + 18, cy + 34); g.moveTo(cx - 8, cy + 10); g.lineTo(cx - 30, cy + 40); g.moveTo(cx - 2, cy - 26); g.lineTo(cx + 26, cy - 8); g.moveTo(cx - 2, cy - 26); g.lineTo(cx - 28, cy - 14); g.stroke();
    g.strokeStyle = '#D8433F'; g.lineWidth = 10; g.beginPath(); g.arc(cx, cy, 68, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx - 48, cy - 48); g.lineTo(cx + 48, cy + 48); g.stroke();
  });
  T.speech = canvasTex(300, 400, (g, W, H) => {
    g.fillStyle = '#F3F8FD'; g.fillRect(0, 0, W, H); g.fillStyle = '#2F6FB8'; g.fillRect(0, 0, W, 130);
    ruby(g, [['スピーチ', '']], W / 2, 64, 44, '#FFFFFF', 'center', '"Zen Maru Gothic"', 900);
    ruby(g, [['大会', 'たいかい']], W / 2, 118, 40, '#FFE08A', 'center', '"Zen Maru Gothic"', 900);
    ruby(g, [['12', ''], ['月', 'がつ'], ['10日', 'とおか'], ['（', ''], ['水', 'すい'], ['）', '']], W / 2, 196, 28, '#1D2B4A', 'center', '"Zen Maru Gothic"', 700);
    // microphone
    const cx = W / 2, cy = 290;
    g.fillStyle = '#5A6070'; g.beginPath(); g.roundRect(cx - 22, cy - 60, 44, 74, 22); g.fill();
    g.strokeStyle = '#5A6070'; g.lineWidth = 7; g.beginPath(); g.arc(cx, cy - 4, 36, 0, Math.PI); g.stroke(); g.beginPath(); g.moveTo(cx, cy + 32); g.lineTo(cx, cy + 62); g.moveTo(cx - 26, cy + 64); g.lineTo(cx + 26, cy + 64); g.stroke();
    g.fillStyle = '#F4A9BE'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(40 + i * 44, H - 22, 6, 0, 7); g.fill(); }
  });
  // emergency exit: a running figure toward a door, white on green
  T.hijo = canvasTex(360, 128, (g, W, H) => {
    g.fillStyle = '#17985A'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#FFFFFF'; g.fillRect(14, 14, 74, 100); g.fillStyle = '#17985A'; g.fillRect(24, 22, 54, 92);
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(122, 32, 11, 0, 7); g.fill();
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.lineCap = 'round';
    g.beginPath(); g.moveTo(116, 48); g.lineTo(106, 82); g.lineTo(126, 110); g.moveTo(106, 82); g.lineTo(86, 104); g.moveTo(114, 56); g.lineTo(136, 72); g.moveTo(114, 56); g.lineTo(94, 64); g.stroke();
    g.font = '900 58px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('非常口', 258, 68);
  });
  // a plain school clock at half past one
  T.clock = canvasTex(256, 256, (g, W) => {
    g.clearRect(0, 0, W, W); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill();
    g.strokeStyle = '#2A2E36'; g.lineWidth = 10; g.stroke(); g.fillStyle = '#2A2E36';
    for (let i = 0; i < 60; i++) { const big = i % 5 === 0; g.save(); g.translate(128, 128); g.rotate(i * Math.PI / 30); g.fillRect(big ? -4 : -1.5, -116, big ? 8 : 3, big ? 20 : 8); g.restore(); }
    g.font = '700 30px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let h = 1; h <= 12; h++) { const a = h * Math.PI / 6; g.fillText(String(h), 128 + Math.sin(a) * 78, 130 - Math.cos(a) * 78); }
    const hand = (a, len, w, c) => { g.save(); g.translate(128, 128); g.rotate(a); g.fillStyle = c; g.fillRect(-w / 2, -len, w, len + 14); g.restore(); };
    hand(1.5 * Math.PI / 6, 58, 9, '#2A2E36'); hand(Math.PI, 92, 6, '#2A2E36'); hand(Math.PI * .7, 100, 2, '#D8433F');
    g.beginPath(); g.arc(128, 128, 7, 0, 7); g.fill();
  });
  return _schoolTex = T;
}

// build something and throw it away again, keeping only its effect on the random numbers and texture caches
function ghostBuild(fn) {
  const n = scene.children.length, t = tappables.length, d = doorways.length, p = noPole.length;
  const L = Object.fromEntries(Object.entries(lanes).map(([k, v]) => [k, v.length]));
  fn();
  for (const o of scene.children.slice(n)) scene.remove(o);
  tappables.length = t; doorways.length = d; noPole.length = p; for (const k in L) lanes[k].length = L[k];
}
// build without changing the street's random numbers or the shared window and door textures
function isolated(fn) {
  const s = seed, copy = c => Object.fromEntries(Object.entries(c).map(([k, a]) => [k, a.slice()]));
  const w = copy(winCache), dc = copy(doorCache);
  fn();
  seed = s;
  for (const [c, saved] of [[winCache, w], [doorCache, dc]]) for (const k of Object.keys(c)) if (saved[k]) c[k] = saved[k]; else delete c[k];
}

