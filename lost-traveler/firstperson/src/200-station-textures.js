// ---------------------------------------------------------------- station textures
let _staTex;
function staTex() {
  if (_staTex) return _staTex;
  const T = {}, tx = canvasText;
  const tiles = (bg, line, n, vary) => canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = `rgba(${rand() < .5 ? '0,0,0' : '255,255,255'},${rand() * vary})`; g.fillRect(i * w / n, j * h / n, w / n, h / n); }
    speckle(g, w, h, .025, 900);
    g.fillStyle = line; for (let i = 0; i <= n; i++) { g.fillRect(i * w / n - 1, 0, 2, h); g.fillRect(0, i * h / n - 1, w, 2); }
  }, [1, 1]);
  T.floor = tiles('#E6E4DE', 'rgba(140,140,135,.5)', 4, .05);      // 30 cm tiles
  T.pf = tiles('#A4A6A8', 'rgba(80,80,84,.4)', 2, .06);              // platform: 60 cm concrete slabs
  T.ceil = canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#F2F2EF'; g.fillRect(0, 0, w, h); speckle(g, w, h, .04, 300); g.fillStyle = 'rgba(120,120,120,.35)'; g.fillRect(0, 0, w, 2); g.fillRect(0, 0, 2, h); }, [1, 1]);
  // 点字ブロック: yellow tactile paving. Dots warn (stop here), bars guide (walk this way)
  const tactile = (bars, vert) => canvasTex(64, 64, (g, w) => {
    g.fillStyle = '#E9B91E'; g.fillRect(0, 0, w, w); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, w, 1.5); g.fillRect(0, 0, 1.5, w);
    if (bars) for (let i = 0; i < 4; i++) { const p = 8 + i * 16; g.fillStyle = '#C9980C'; vert ? g.fillRect(p - 3, 5, 8, w - 10) : g.fillRect(5, p - 3, w - 10, 8); g.fillStyle = '#F8D24C'; vert ? g.fillRect(p - 4, 4, 6, w - 10) : g.fillRect(4, p - 4, w - 10, 6); }
    else for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const x = 7 + i * 12.5, y = 7 + j * 12.5; g.fillStyle = '#C9980C'; g.beginPath(); g.arc(x + 1, y + 1, 4, 0, 7); g.fill(); g.fillStyle = '#F8D24C'; g.beginPath(); g.arc(x, y, 3.6, 0, 7); g.fill(); }
  }, [1, 1]);
  T.dots = tactile(false); T.barsX = tactile(true, false); T.barsZ = tactile(true, true);
  // escalator steps: grooved treads with a yellow edge
  T.esc = canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#3C3F45'; g.fillRect(0, 0, w, h); for (let x = 2; x < w; x += 4) { g.fillStyle = '#5A5E66'; g.fillRect(x, 0, 2, h); } g.fillStyle = '#E8B820'; g.fillRect(0, 0, 3, h); g.fillRect(w - 3, 0, 3, h); g.fillRect(0, 0, w, 4); }, [1, 1]);
  // ticket machine front
  T.kenbaiki = canvasTex(180, 350, (g, w, h) => {
    g.fillStyle = '#E2E5EA'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2F6FB8'; g.fillRect(0, 0, w, 40); tx(g, 'きっぷ・IC', w / 2, 21, 22, '#FFFFFF');
    g.fillStyle = '#2B3442'; g.fillRect(12, 54, w - 24, 144); g.fillStyle = '#EAF3FC'; g.fillRect(16, 58, w - 32, 136);
    tx(g, 'ねだんをえらんでください', w / 2, 72, 12, '#1D2B4A', 700, 'center', w - 40);
    [['150', '#7DB83A'], ['190', '#7DB83A'], ['220', '#7DB83A'], ['250', '#7DB83A'], ['400', '#2F6FB8'], ['チャージ', '#E8A33A']].forEach(([t, c], i) => {
      const x = 22 + (i % 2) * 70, y = 86 + Math.floor(i / 2) * 34; g.fillStyle = c; g.fillRect(x, y, 64, 28); tx(g, t, x + 32, y + 15, 17, '#FFFFFF', 900, 'center', 58);
    });
    g.fillStyle = '#2F6FB8'; g.fillRect(18, 214, 58, 36); tx(g, 'IC', 47, 232, 18, '#FFFFFF');
    g.fillStyle = '#2B2D33'; g.fillRect(98, 216, 54, 8); tx(g, 'こうか', 125, 236, 12, '#1D2B4A', 700);
    g.fillStyle = '#2B2D33'; g.fillRect(94, 252, 62, 7); tx(g, 'おさつ', 125, 270, 12, '#1D2B4A', 700);
    g.fillStyle = '#5A5E66'; g.fillRect(18, 290, w - 36, 36); g.fillStyle = '#1E2024'; g.fillRect(24, 300, w - 48, 18);
    tx(g, 'きっぷ・おつり', w / 2, 338, 12, '#1D2B4A', 700);
  });
  // 運賃表: the fare chart over the ticket machines
  T.unchin = canvasTex(640, 260, (g, w, h) => {
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1D2B4A'; g.fillRect(0, 0, w, 46); tx(g, '運賃表', 80, 24, 28, '#FFFFFF'); tx(g, 'きっぷのねだん (円) · Fares (yen)', 390, 24, 19, '#C5D0E6', 700);
    const st = [['うみべ', 150], ['みなと', 0], ['さくらまち', 150], ['ちゅうおう', 190], ['こうえん', 220], ['くうこう', 400]];
    const y = 150, x0 = 64, dx = (w - 128) / (st.length - 1);
    g.fillStyle = '#7DB83A'; g.fillRect(x0, y - 7, w - 128, 14);
    st.forEach(([n, f], i) => {
      const x = x0 + i * dx, here = !f;
      g.fillStyle = '#FFFFFF'; g.strokeStyle = here ? '#D8433F' : '#4E8F2A'; g.lineWidth = 5; g.beginPath(); g.arc(x, y, here ? 16 : 12, 0, 7); g.fill(); g.stroke();
      tx(g, n, x, y + 42, 20, '#1D2B4A', 900, 'center', dx - 8);
      if (here) { g.fillStyle = '#D8433F'; g.fillRect(x - 44, y - 66, 88, 32); tx(g, '現在地', x, y - 50, 18, '#FFFFFF'); }
      else tx(g, String(f), x, y - 46, 34, '#1D2B4A');
    });
    tx(g, 'こどもは はんがく  ·  Children pay half', w / 2, h - 20, 15, '#5A6782', 700);
  });
  // 発車標: departure boards (amber and green LEDs)
  T.board = canvasTex(640, 168, (g, w, h) => {
    g.fillStyle = '#0C0D10'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#20242C'; g.fillRect(0, 0, w, 40); tx(g, '次の電車', 70, 21, 22, '#FFFFFF'); tx(g, 'Next train', 190, 21, 16, '#AEB6C4', 700); tx(g, '1番線', w - 60, 21, 20, '#FFFFFF');
    [['普通', 'さくらまち', '10:24', '5両'], ['普通', 'さくらまち', '10:36', '5両']].forEach(([k, d, t, n], i) => { const y = 72 + i * 56; tx(g, k, 60, y, 30, '#4FD86A'); tx(g, d, 250, y, 34, '#FFB238'); tx(g, t, 440, y, 34, '#FFB238'); tx(g, n, 570, y, 24, '#FFFFFF', 700); });
    g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 40; y < h; y += 4) g.fillRect(0, y, w, 1); for (let x = 0; x < w; x += 4) g.fillRect(x, 40, 1, h - 40);
  });
  // 駅名標: the station name board, with the stations on either side
  T.ekimei = canvasTex(520, 200, (g, w, h) => {
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
    tx(g, 'みなと', w / 2, 60, 70, '#1D2B4A'); tx(g, 'Minato', w / 2, 112, 24, '#1D2B4A', 700);
    g.fillStyle = '#7DB83A'; g.beginPath(); g.arc(64, 64, 32, 0, 7); g.fill(); tx(g, 'M', 64, 54, 24, '#FFF'); tx(g, '05', 64, 80, 17, '#FFF');
    g.fillStyle = '#7DB83A'; g.fillRect(0, 134, w, 24);
    tx(g, 'Umibe', 70, 146, 14, '#FFFFFF', 700); tx(g, 'Sakuramachi', w - 90, 146, 14, '#FFFFFF', 700);
    tx(g, '← うみべ', 80, 180, 24, '#1D2B4A'); tx(g, 'さくらまち →', w - 100, 180, 24, '#1D2B4A');
  });
  T.locker = canvasTex(240, 360, (g, w, h) => {
    g.fillStyle = '#8FA9C2'; g.fillRect(0, 0, w, h);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const x = c * 80, y = r * 90; g.fillStyle = r === 3 ? '#9EB6CC' : '#BCCFE1'; g.fillRect(x + 3, y + 3, 74, 84); g.fillStyle = '#E8EEF4'; g.fillRect(x + 52, y + 34, 18, 24); g.fillStyle = '#2B2D33'; g.fillRect(x + 58, y + 40, 6, 12); tx(g, String(r * 3 + c + 1), x + 16, y + 16, 14, '#1D2B4A', 700); }
  }, [1, 1]);
  // the office window: the counter, two monitors and the station attendant behind the glass
  T.office = canvasTex(320, 150, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#DCE6EE'); gr.addColorStop(1, '#B9C6D2'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#C9D2DC'; for (let x = 10; x < w; x += 40) g.fillRect(x, 8, 30, 40);
    g.fillStyle = '#1D2B4A'; g.fillRect(140, 74, 50, 40); g.fillStyle = '#F0CDB0'; g.beginPath(); g.arc(165, 58, 15, 0, 7); g.fill();
    g.fillStyle = '#1D2B4A'; g.fillRect(148, 40, 34, 10); g.fillRect(144, 48, 42, 4); g.fillStyle = '#E8B820'; g.fillRect(160, 42, 10, 6);
    g.fillStyle = '#8A97A6'; g.fillRect(0, 100, w, 50);
    g.fillStyle = '#2B3442'; g.fillRect(40, 66, 56, 36); g.fillRect(226, 64, 60, 38); g.fillStyle = '#5E86B8'; g.fillRect(44, 70, 48, 26); g.fillRect(230, 68, 52, 28);
    g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.moveTo(20, 0); g.lineTo(80, 0); g.lineTo(30, h); g.lineTo(-30, h); g.fill();
    g.strokeStyle = '#6E7480'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = '#6E7480'; g.fillRect(w / 2 - 2, 0, 4, h);
  });
  T.jikoku = canvasTex(180, 260, (g, w, h) => {
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1D2B4A'; g.fillRect(0, 0, w, 30); tx(g, '時刻表  さくらまち方面', w / 2, 16, 15, '#FFF', 900, 'center', w - 10);
    for (let i = 0; i < 19; i++) { const y = 36 + i * 11.8; g.fillStyle = i % 2 ? '#EEF2F7' : '#FFFFFF'; g.fillRect(0, y, w, 11.8); tx(g, String(5 + i), 14, y + 6, 9, '#1D2B4A'); g.fillStyle = '#C9CDD2'; g.fillRect(27, y, 1, 11.8); tx(g, i % 2 ? '06  18  30  42  54' : '00  12  24  36  48', 104, y + 6, 9, '#2F3B52', 700); }
  });
  T.clock = canvasTex(128, 128, (g) => {
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = '#2B2D33'; g.lineWidth = 7; g.stroke();
    g.fillStyle = '#2B2D33'; for (let i = 0; i < 12; i++) { g.save(); g.translate(64, 64); g.rotate(i * Math.PI / 6); g.fillRect(-2, -52, 4, i % 3 ? 7 : 12); g.restore(); }
    const hand = (a, len, wd) => { g.save(); g.translate(64, 64); g.rotate(a); g.fillRect(-wd / 2, -len, wd, len + 8); g.restore(); };
    hand((10 + 20 / 60) / 12 * Math.PI * 2, 30, 6); hand(20 / 60 * Math.PI * 2, 46, 4);
  });
  return (_staTex = T);
}

