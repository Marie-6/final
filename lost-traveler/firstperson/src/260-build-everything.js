// ================================================================ build everything
let train;
const nightLights = [];
function shopSign(B, text, colors, info, y, sub, logo) {
  const w = Math.min(B.len - 1, Math.max(3.5, [...text].length * .9));
  sign({ text, w, h: .9, bg: colors[0], fg: colors[1], stripe: colors[2], grad: true, frameColor: colors[3] || '#59606B',
         logo, sub: sub ?? pick(['TEL 03-3451-2207', '営業時間 10:00〜20:00', '年中無休', 'TEL 03-5812-0436', '定休日 水曜']) }, B.out(.16), y ?? B.groundH + .55, B.zc, B.n > 0 ? Math.PI / 2 : -Math.PI / 2, info);
}
function blade(B, text, colors, info, y, u) {
  const h = Math.max(1.8, [...text].length * .62), w = .72;
  const z = B.uToZ(u ?? .4), yy = y ?? B.groundH + h / 2 + .7;
  for (const dy of [h / 2 - .15, -h / 2 + .15]) box(.62, .06, .06, metal('#6A6E78'), B.out(.31), yy + dy, z, scene, false);
  sign({ text, vertical: true, w, h, bg: colors[0], fg: colors[1], stripe: colors[2], double: true, grad: true, frameColor: colors[3] || '#6A6E78', night: .8 }, B.out(.62 + w / 2), yy, z, 0, info);
}
function awning(B, c1, c2, solid) {
  const tex = canvasTex(512, 64, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = solid ? c1 : (i % 2 ? c2 : c1); c.fillRect(i * w / 16, 0, w / 16, h); } c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, h * .85, w, h * .15); });
  const len = B.len * .9, ry = B.n > 0 ? Math.PI / 2 : -Math.PI / 2;
  const a = mesh(new THREE.PlaneGeometry(len, 1.5), std('#fff', { map: tex, side: THREE.DoubleSide }), B.out(.62), B.groundH - .45, B.zc);
  a.rotation.set(0, ry, 0); a.rotateX(-1.0);
  const v = mesh(new THREE.PlaneGeometry(len, .32), std('#fff', { map: tex, side: THREE.DoubleSide }), B.out(1.25), B.groundH - 1.0, B.zc, scene, false); v.rotation.y = ry;
}

function buildStreet() {
  ground();
  // the railroad crossing stays open: nothing on the sidewalks next to the tracks
  for (const sd of [-1, 1]) { claim(sd, 'wall', -139, -125); claim(sd, 'curb', -139, -125); }

  // ================= LEFT side (x < 0), from behind the start toward the station
  let B;
  building(-1, 112, 98, { h: 14, wall: '#D9D2C6', style: 'panel', floors: 4, cols: 4, balcony: '#EEF0F2', ground: 'entrance' });
  apato(-1, 98, 86, { h: 6.4, wall: '#E5DCCB', style: 'siding' });
  B = building(-1, 86, 76, { h: 9, wall: '#C7D8D0', style: 'tile', floors: 2, cols: 3, ground: 'shop', ac: .6 }); awning(B, '#3C7D9C', '#FFFFFF'); shopSign(B, '八百屋', ['#FFF6E2', '#2E6B53', '#3E8E6E']);
  building(-1, 76, 62, { h: 16, wall: '#A8573F', style: 'brick', bars: true, floors: 5, cols: 4, balcony: '#F6EFE9', ground: 'entrance' });
  apato(-1, 62, 50, { h: 6.4, wall: '#D7CDBB', style: 'siding', steel: '#5B6B7B' });
  B = building(-1, 50, 36, { tower: true, h: 13, wall: '#E9DCC6', style: 'plaster', floors: 3, cols: 3, balcony: '#F1EEE6', ground: 'shop', lit: .6 }); awning(B, '#D9873A', '#D9873A', true); shopSign(B, '薬', ['#FFFFFF', '#D8433F', '#D8433F'], hint.kusuri); blade(B, 'くすり', ['#FFF', '#2F6FB8', '#2F6FB8'], hint.kusuri);
  B = building(-1, 36, 26, { h: 9, wall: '#7FA8D6', style: 'mosaic', floors: 2, cols: 2, ground: 'shop', ac: .6 });
  shopSign(B, 'さくら書店', ['#FFF6E2', '#2E6B53', '#3E8E6E'], hint.shoten); awning(B, '#3E8E6E', '#F4F1E6'); blade(B, '本', ['#2E6B53', '#FFFFFF'], hint.shoten, 5.6);

  // the language school (walk-in), set back behind a brick wall with a gate and a front yard.
  // The old closed facade is still built first and thrown away at once: only so the random numbers and the shared
  // window textures come out exactly as before, which keeps every later building and prop on the street where it was.
  ghostBuild(() => {
    const B = building(-1, 26, 4, { h: 11.5, wall: '#F1ECE3', style: 'tile', floors: 3, cols: 6, ac: .25, lit: .7, ground: 'entrance', setback: 3.2, depth: 14, roof: true, name: '受付  RECEPTION' });
    // entrance canopy; the school's name is on its front edge
    box(1.9, .55, 4.6, std('#F7F5F0'), B.out(.95), 3.2, 15);
    box(1.9, .05, 4.6, std('#D9D4CA'), B.out(.95), 2.92, 15, scene, false);
    sign({ lines: [{ t: 'みなと日本語学校', size: .62 }], w: 4.2, h: .42, bg: '#1D2B4A', fg: '#FFFFFF', frame: false }, B.out(1.91), 3.2, 15, Math.PI / 2, hint.school);
    for (const dz of [-1.9, 1.9]) cyl(.06, .06, 2.9, metal('#B5B9C0'), B.out(1.75), 1.45, 15 + dz, 8);
    const yard = mesh(new THREE.PlaneGeometry(3.2, 22), std('#E2D8C6'), -7.6, .02, 15, scene, false); yard.rotation.x = -Math.PI / 2;
    stone(.35, .9, 8.4, -6.0, .45 + .15, 21.6); stone(.35, .9, 9.6, -6.0, .6, 8.8);
    hedge(-6.05, 21.6, 8.2); hedge(-6.05, 8.8, 9.4);
    stone(.7, 1.6, .7, -6.0, .95, 17.2); stone(.7, 1.6, .7, -6.0, .95, 13.8);
    box(.8, .1, .8, std('#BDB4A5'), -6.0, 1.8, 17.2); box(.8, .1, .8, std('#BDB4A5'), -6.0, 1.8, 13.8);
    sign({ text: '日本語学校', vertical: true, w: .42, h: 1.25, bg: '#E7CFA6', fg: '#2A2230', font: '"Klee One"', frameColor: '#B99A70' }, -5.62, 1.0, 17.2, Math.PI / 2, hint.school);
    sign({ lines: [{ t: '生徒', size: .3, color: '#1D2B4A' }, { t: '募集中', size: .3, color: '#D8433F' }], w: .8, h: 1.1, bg: '#FFF8EC', fg: '#1D2B4A', stripe: '#F4A9BE', frameColor: '#FFFFFF' }, -5.62, 1.0, 13.8, Math.PI / 2, hint.boshu);
    streetTree(-7.8, 21, 'sakura', 1.25);
    streetTree(-7.8, 7.5, 'sakura', 1.1);
    for (let i = 0; i < 60; i++) { const p = mesh(new THREE.CircleGeometry(.05, 5), std('#F9C2D1'), range(-5.8, -3.8), .16, range(4, 26), scene, false); p.rotation.x = -Math.PI / 2; }
  });
  isolated(buildSchool);
  vending(-1, 2.6, '#D9443F');

  B = building(-1, 4, -6, { h: 6.6, wall: '#B07A55', style: 'wood', floors: 1, cols: 2, ground: 'shop' });
  box(1.5, .15, 9.6, std('#4D5468'), B.out(.6), 3.6, B.zc).rotation.z = -.32;
  for (let i = 0; i < 4; i++) { const nr = mesh(new THREE.PlaneGeometry(.62, .9), std('#2C3E73', { side: THREE.DoubleSide }), -5.72, 2.75, -.1 - i * .66); nr.rotation.y = Math.PI / 2; }
  sign({ text: 'くらや', w: 2.4, h: .55, bg: '#2C3E73', fg: '#FFFFFF', frame: false }, -5.68, 2.95, -1.1, Math.PI / 2, hint.kuraya);
  const lan = mesh(new THREE.SphereGeometry(.3, 14, 10), glowMat(null, null, .25, 2.6, { color: '#E04B3A', emissive: 0xff6a3a }), -5.5, 2.6, -3.7); lan.scale.y = 1.35;
  claim(-1, 'wall', -4.2, -3.2);
  lampPositions.push(new THREE.Vector3(-5.1, 2.3, -3.7));

  B = building(-1, -6, -24, { h: 18, wall: '#D9DDE2', style: 'mosaic', bars: true, floors: 5, cols: 5, balcony: '#E8EEF4', lit: .55, ground: 'konbini', groundBand: '#1F8F5A' });
  konbiniFront(B, STORE_BRANDS[0]);
  nobori(-1, -7.5, '新発売', '#E8524A', '#FFFFFF'); nobori(-1, -8.4, 'からあげ', '#F2C230', '#B8322B');
  B = apato(-1, -24, -36, { h: 6.6, wall: '#E2C7B8', style: 'siding', steel: '#7B5E57', rail: '#E7DDCD' });
  // a standing wooden sign for the guesthouse, by the stairs
  cyl(.05, .05, 1.0, std('#6E4F3E'), -5.0, .55, -32.6, 6);
  sign({ text: 'さくら荘', vertical: true, w: .5, h: 1.7, bg: '#FFF7EC', fg: '#C0466A', stripe: '#F4A9BE', frameColor: '#8A6A45', grad: true }, -5.0, 1.65, -32.6, Math.PI / 2, hint.sakurasou);
  B = building(-1, -36, -52, { h: 15, wall: '#D9D4CC', style: 'panel', floors: 4, cols: 4, balcony: '#F4F2EE', ground: 'shop', shutter: false, posters: false }); wafuFront(B, '酒', hint.izakaya); sign({ text: '居酒屋 たぬき', w: 3.2, h: .7, bg: '#6E4F3E', fg: '#FFF1D6', frameColor: '#4A3426', grad: true }, B.out(.16), B.groundH + .75, B.zc, Math.PI / 2, hint.izakaya); blade(B, '居酒屋', ['#C0392B', '#FFFFFF'], hint.izakaya);
  building(-1, -52, -66, { h: 11, wall: '#C9BBA6', style: 'plaster', floors: 3, cols: 3, ground: 'house', ac: .7 });

  // ================= RIGHT side (x > 0)
  building(1, 112, 100, { h: 20, wall: '#D7DCE3', style: 'panel', floors: 6, cols: 4, balcony: '#EEF1F5', ground: 'entrance' });
  B = building(1, 100, 88, { h: 8, wall: '#9CB89A', style: 'plaster', floors: 2, cols: 3, ground: 'shop', ac: .6 }); shopSign(B, 'クリーニング', ['#FFFFFF', '#2F6FB8', '#2F6FB8']);
  apato(1, 88, 74, { h: 6.4, wall: '#E8E0D0', style: 'siding' });
  B = building(1, 74, 60, { h: 14, wall: '#F2E6CF', style: 'mosaic', floors: 4, cols: 4, balcony: '#FFFFFF', ground: 'shop' }); shopSign(B, 'パン屋 こむぎ', ['#FFF4E0', '#8A4B22', '#E8A33A']); awning(B, '#8A4B22', '#F4E2C4');
  building(1, 60, 48, { h: 10, wall: '#CFC3AE', style: 'wood', floors: 2, cols: 3, ground: 'house', ac: .5, bars: true });
  B = building(1, 48, 36, { h: 12, wall: '#F2F0EA', style: 'panel', floors: 3, cols: 4, ground: 'shop', ac: .4, tower: true, letters: true }); blade(B, 'さくま歯科', ['#FFFFFF', '#2F6FB8', '#2F6FB8'], hint.shika, 6.5, 1.0); shopSign(B, 'さくま歯科', ['#FFFFFF', '#2F6FB8', '#2F6FB8'], hint.shika);
  B = building(1, 36, 24, { h: 9, wall: '#D9C7B0', style: 'tile', floors: 2, cols: 3, ground: 'shop', ac: .5 });
  shopSign(B, '銭湯 さくらの湯', ['#2C3E73', '#FFFFFF', '#C0392B'], hint.yu, undefined, '営業 15:00〜24:00');
  blade(B, 'ゆ', ['#C0392B', '#FFFFFF'], hint.yu, 6.2, 1.0);
  // the café across the street from the school
  B = building(1, 24, 15, { h: 10, wall: '#F3D9A5', style: 'tile', floors: 2, cols: 2, ground: 'shop', balcony: '#FFFFFF', lit: .8, interior: true, shutter: false, posters: false });
  cafeInterior(B);
  awning(B, '#D8433F', '#FFFFFF');
  cafeFrontSign(B, B.zc);
  blade(B, 'コーヒー', ['#3E2820', '#F4E2C4', '#C9A45A', '#2A1C16'], hint.kohi, undefined, 1.0);
  aboard(1, 17.4, [{ t: '本日の', size: .14, color: '#FFFFFF' }, { t: 'おすすめ', size: .16, color: '#FFE08A' }, { t: 'コーヒー', size: .14, color: '#FFFFFF' }, { t: '¥300', size: .14, color: '#9FE09A' }], hint.osusume);
  plantCluster(1, 16.0);
  // the other half of the old café lot: a plain small shop next door
  building(1, 15, 6, { h: 12, wall: '#E6DCCB', style: 'plaster', floors: 3, cols: 3, ground: 'shop', ac: .5 });
  plantCluster(1, 8);
  B = building(1, 6, -12, { h: 16, wall: '#E3D3C3', style: 'cladding', floors: 5, cols: 4, balcony: '#F7EDE8', lit: .5, ground: 'entrance' });
  vending(1, 1.4, '#3E7CD6'); vending(1, .2, '#F4F4F2');
  B = building(1, -12, -22, { h: 8, wall: '#EFE6D6', style: 'plaster', floors: 2, cols: 2, ground: 'shop', ac: .7, shutter: false, posters: false });
  wafuFront(B, '麺', hint.ramen);
  sign({ text: 'ラーメン 一番', w: 3.4, h: .7, bg: '#6E4F3E', fg: '#FFF1D6', frameColor: '#4A3426', grad: true }, B.out(.16), B.groundH + .75, B.zc, -Math.PI / 2, hint.ramen); blade(B, 'ラーメン', ['#D8433F', '#FFFFFF', '#F2C230'], hint.ramen);
  nobori(1, -13.2, 'ラーメン', '#D8433F', '#FFFFFF'); nobori(1, -14.1, '餃子', '#F2C230', '#B8322B');
  building(1, -22, -40, { h: 22, wall: '#E8E4DC', style: 'cladding', bars: true, floors: 6, cols: 6, balcony: '#EEF1F5', lit: .45, ground: 'entrance' });
  // a small parking lot: open space, a fence and parked cars
  const lot = mesh(new THREE.PlaneGeometry(12, 13), std('#7D808A'), 12, .02, -46.5, scene, false); lot.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 5; i++) { const l = mesh(new THREE.PlaneGeometry(4.5, .1), std('#EEE'), 10.5, .03, -41 - i * 2.6, scene, false); l.rotation.x = -Math.PI / 2; }
  for (const [cz, col] of [[-42.3, '#F2F2EE'], [-44.9, '#7FA7D0'], [-50.1, '#3A3A40']]) car(10.5, cz, col, rand() < .5 ? 0 : Math.PI);
  postSign({ lines: [{ t: 'P', size: .55, color: '#FFFFFF' }, { t: '駐車場', size: .2, color: '#FFFFFF' }], top: .42, w: .9, h: 1.3, bg: '#2F6FB8', fg: '#FFF' }, 5.95, 2.6, -40.6, -Math.PI / 2, hint.chusha);
  for (let z = -40.4; z > -53; z -= 2.4) box(.06, 1.1, .06, metal('#7E858E'), 6.1, .6, z);
  const fenceTex = canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(120,128,138,1)'; g.lineWidth = 2; for (let i = -h; i < w; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); } }, [6, 1]);
  const fence = mesh(new THREE.PlaneGeometry(12.6, 1.1), std('#fff', { map: fenceTex, transparent: true, alphaTest: .4, side: THREE.DoubleSide }), 6.12, .62, -46.7, scene, false); fence.rotation.y = Math.PI / 2;
  claim(1, 'wall', -53, -40.5);
  building(1, -53, -66, { h: 13, wall: '#E2C7B8', style: 'plaster', floors: 3, cols: 3, ground: 'shop', ac: .6 });

  // ================= the elevated railway with みなと駅 (the street goes on under it)
  const rail = group(0, 0, VIA.z);
  isolated(() => { viaduct(rail); underTracks(); });
  sign({ lines: [{ t: 'みなと駅', size: .48 }, { t: 'MINATO STATION', size: .16, weight: 700 }], top: .42, w: 5.5, h: 1.4, bg: '#FFFFFF', fg: '#1D2B4A', stripe: '#7DB83A', frameColor: '#888', night: .9 }, 0, 7.32, 3.08, 0, hint.eki, rail);
  sign({ lines: [{ t: 'みなと駅', size: .48 }, { t: 'MINATO STATION', size: .16, weight: 700 }], top: .42, w: 5.5, h: 1.4, bg: '#FFFFFF', fg: '#1D2B4A', stripe: '#7DB83A', frameColor: '#888', night: .9 }, 0, 7.32, -3.08, Math.PI, hint.eki, rail);
  // みなと駅 東口 (walk-in) with platform 1 on top. As with the school, the old closed facade is built and thrown away
  // first, only so the street's random numbers stay as they were.
  ghostBuild(() => {
    const B = building(1, -78, -96, { h: 9, wall: '#ECE7DD', style: 'panel', floors: 2, cols: 4, ground: 'shop', roof: false, shutter: false });
    shopSign(B, 'みなと駅 東口', ['#1D2B4A', '#FFFFFF', '#7DB83A'], hint.eki, 3.95);
  });
  isolated(buildStation);
  // the bench outside the station where Day 1 begins (design/06-day-01.md, Scene 1): back to the station, facing the road,
  // between the corner and the door (the door is z -86..-88)
  {
    const x = 5.35, z = -81.2, ry = -Math.PI / 2;
    claim(1, 'wall', z - 1, z + 1); claim(1, 'curb', z - 1, z + 1);
    const g = group(x, .153, z, ry), slat = std('#A0714A', { roughness: .6 }), iron = metal('#2E3036');
    for (let i = 0; i < 4; i++) box(1.5, .035, .09, slat, 0, .44, -.15 + i * .1, g);
    for (let i = 0; i < 3; i++) box(1.5, .09, .03, slat, 0, .6 + i * .12, -.25 - i * .02, g).rotation.x = -.16;
    for (const sx of [-.66, .66]) { box(.05, .44, .05, iron, sx, .22, .17, g); box(.05, .86, .05, iron, sx, .43, -.24, g); box(.05, .05, .46, iron, sx, .41, -.03, g); box(.05, .04, .4, iron, sx, .66, .0, g); }
    addSeat(x, z, ry, 1.15);
    START.seat = seats[seats.length - 1];
    START.from = new THREE.Vector3(x - .85, 0, z);      // where you stand up to
  }
  isolated(() => { train = buildTrain(); });

  // ================= past the station: more street, then a railroad crossing (踏切)
  const fillSide = (side, from, to) => {
    for (let z0 = from; z0 > to + 6;) {
      const len = Math.round(range(8, 16));
      const z1 = Math.max(to, z0 - len);
      const t = rand();
      if (t < .14) house(side, z0, z1);
      else if (t < .26) apato(side, z0, z1, { h: 6.4, wall: pick(['#E5DCCB', '#D7CDBB', '#E8E0D0', '#DCCFC0']), style: 'siding', steel: pick(['#5B6B7B', '#7B5E57', '#6F7A86']) });
      else if (t < .55) {
        const B2 = building(side, z0, z1, { tower: rand() < .45, letters: rand() < .5, h: range(8, 12), wall: pick(['#9CB89A', '#E9DCC6', '#F0D7B0', '#C7D8D0', '#E2C7B8', '#D9D2C6']), style: pick(['tile', 'plaster', 'mosaic', 'brick', 'cladding']), floors: 2 + (rand() < .5 ? 1 : 0), cols: 3, ground: 'shop', ac: .6 });
        if (Math.abs(B2.zc) < 200) { const sh = pick([['喫茶', ['#5B3A2E', '#FFF1D6', '#C99A5B']], ['花屋', ['#FFFFFF', '#3C9D5D', '#F4A9BE']], ['床屋', ['#FFFFFF', '#2F6FB8', '#D8433F']], ['酒', ['#2C3E73', '#FFFFFF', '#C0392B']], ['不動産', ['#FFFFFF', '#1D2B4A', '#F2C230']], ['弁当', ['#FFF4E0', '#C0392B', '#F2C230']]]); shopSign(B2, sh[0], sh[1]); if (rand() < .6) awning(B2, pick(['#D8433F', '#3E8E6E', '#2F6FB8', '#D9873A']), '#FFFFFF', rand() < .4); }
      } else building(side, z0, z1, { h: range(12, 24), wall: pick(['#D7DCE3', '#E3D3C3', '#D9D4CC', '#CDD5C8', '#E6DDD0', '#C9CED6']), style: pick(['tile', 'panel', 'mosaic', 'cladding', 'brick']), bars: rand() < .5, floors: 4 + Math.floor(rand() * 3), cols: 4, balcony: pick(['#EEF1F5', '#F6EFE9', '#FFFFFF']), ground: 'entrance', lit: .5 });
      z0 = z1;
    }
  };
  fillSide(-1, -76, -110);
  B = building(-1, -110, -127, { h: 7, wall: '#E8E4DC', style: 'panel', floors: 1, cols: 3, ground: 'konbini', roof: false }); konbiniFront(B, STORE_BRANDS[1]);
  fillSide(1, -96, -127);
  fillSide(-1, -137, -330); fillSide(1, -137, -330);

  // railroad crossing at z = -132
  const xing = group(0, 0, -132);
  const tieMat = std('#6B5B4E'), railMat = metal('#8E949C');
  for (const tz of [-1.6, 1.6]) {
    for (let x = -300; x < 300; x += .7) box(.25, .12, 2.2, tieMat, x, .02, tz, xing, false);
    for (const rz of [-.72, .72]) box(600, .16, .08, railMat, 0, .1, tz + rz, xing, false);
  }
  const plank = mesh(new THREE.PlaneGeometry(12, 5.4), std('#5A5D66'), 0, .013, 0, xing, false); plank.rotation.x = -Math.PI / 2;
  const gravel = mesh(new THREE.PlaneGeometry(600, 6), std('#9A958C'), 0, -.01, 0, xing, false); gravel.rotation.x = -Math.PI / 2;
  const stripe = canvasTex(256, 32, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#F2C230' : '#1E1E22'; c.beginPath(); c.moveTo(i * 16, 0); c.lineTo(i * 16 + 16, 0); c.lineTo(i * 16 + 4, h); c.lineTo(i * 16 - 12, h); c.fill(); } });
  for (const s of [-1, 1]) {
    const pz = s * 3.6, px = s * 4.6;
    const pg = group(px, 0, pz); xing.add(pg);       // belongs to the crossing, next to the tracks
    cyl(.09, .09, 4.2, std('#fff', { map: stripe }), 0, 2.1, 0, 10, pg);
    // crossbuck
    const cb = canvasTex(256, 64, (c, w, h) => { c.fillStyle = '#F2C230'; c.fillRect(0, 0, w, h); c.fillStyle = '#1E1E22'; for (let i = 0; i < 10; i++) c.fillRect(i * 28, 0, 12, h); });
    for (const r of [.7, -.7]) { const x1 = mesh(new THREE.BoxGeometry(1.5, .22, .04), std('#fff', { map: cb }), 0, 3.85, s * .08, pg); x1.rotation.z = r; }
    const lamp = (dx) => { box(.36, .36, .14, std('#222'), dx, 3.2, s * .1, pg); const l = mesh(new THREE.CircleGeometry(.13, 16), glowMat(null, null, .4, 2.2, { color: '#E0302A', emissive: 0xff2a1a }), dx, 3.2, s * .18, pg, false); if (s < 0) l.rotation.y = Math.PI; blinkers.push(l.material); };
    lamp(-.3); lamp(.3);
    sign({ text: '踏切', w: .9, h: .4, bg: '#FFFFFF', fg: '#1E1E22', frame: false }, 0, 2.65, s * .1, s > 0 ? 0 : Math.PI, hint.fumikiri, pg);
    // barrier arm, raised
    box(.3, .5, .3, std('#E8E8E8'), -s * .3, .9, 0, pg);
    const arm = box(.08, 4.0, .08, std('#fff', { map: stripe }), -s * .3, 3.1, 0, pg); arm.rotation.z = s * .08;
  }
  postSign({ lines: [{ t: '踏切注意', size: .5, color: '#1E1E22' }], w: 1.6, h: .5, bg: '#F2C230', fg: '#1E1E22' }, 4.0, 2.3, -116, .25, hint.chui);
  postSign({ lines: [{ t: '止まれ', size: .5, color: '#FFFFFF' }], w: .9, h: .8, bg: '#D8433F', fg: '#FFF', frameColor: '#999' }, -4.0, 2.4, -122, -.25, hint.tomare);

  // ---------- poles every 11 m, alternating sides, with lamps on some
  const polesL = [], polesR = [];
  for (let z = Z_NEAR - 4, i = 0; z > Z_FAR + 4; z -= 11, i++) {
    if (Math.abs(z + 72) < 7 || Math.abs(z + 132) < 6) continue;   // not under the railway or on the crossing
    const pl = pole(-1, z, i % 2 === 0); if (pl) polesL.push(pl);
    const pr = pole(1, z - 5.5, i % 2 === 1); if (pr) polesR.push(pr);
  }
  const top = (p, dy, dz = 0) => new THREE.Vector3(p.x, 9.8 + dy, p.z + dz);
  for (const ps of [polesL, polesR]) for (let i = 0; i < ps.length - 1; i++) {
    if (Math.abs(ps[i].z - ps[i + 1].z) > 16) continue;
    wire(top(ps[i], .1, .7), top(ps[i + 1], .1, .7), .45);
    wire(top(ps[i], .1, -.7), top(ps[i + 1], .1, -.7), .5);
    wire(top(ps[i], -.8, .5), top(ps[i + 1], -.8, .5), .6, .035);
    wire(top(ps[i], -2.1), top(ps[i + 1], -2.1), .4, .028);
    if (rand() < .5) wire(top(ps[i], -3.3), top(ps[i + 1], -3.3), .3, .022);
  }
  for (let i = 0; i < Math.min(polesL.length, polesR.length); i += 2) if (Math.abs(polesL[i].z - polesR[i].z) < 8) wire(top(polesL[i], -.8), top(polesR[i], -1.3), .9, .022);
  for (const ps of [polesL, polesR]) for (let i = 0; i < ps.length - 1; i++) {
    if (Math.abs(ps[i].z - ps[i + 1].z) > 16) continue;
    for (let k = 0; k < 3; k++) if (rand() < .6) wire(top(ps[i], range(-3.8, -1.0), range(-.6, .6)), top(ps[i + 1], range(-3.8, -1.0), range(-.6, .6)), range(.3, 1.1), range(.012, .03));
  }
  for (const p of [...polesL, ...polesR]) if (rand() < .4) { const c = mesh(new THREE.TorusGeometry(range(.22, .35), .022, 5, 18), wireMat, p.x, range(6.4, 7.6), p.z, scene, false); c.rotation.set(range(-.4, .4), rand() * 3, range(1.2, 1.9)); }
  for (const p of [...polesL, ...polesR]) if (rand() < .7) wire(top(p, -2.1), new THREE.Vector3(Math.sign(p.x) * 6, range(5.5, 8.5), p.z + range(-3, 3)), .3, .014);

  // ================= little things along the sidewalks (each gets its own spot)
  gachapon(-1, -10.6); gachapon(1, -90, 3); gachapon(-1, 64.5, 3);
  cafeTables(1, 22.4);
  recycling(-1, 92); recycling(1, 81.5); recycling(-1, -61); recycling(1, -118);
  vending(-1, 58.2, '#3E7CD6'); vending(1, 66, '#D9443F'); vending(-1, -59, '#F4F4F2'); vending(1, -100, '#3E7CD6'); vending(-1, -150, '#D9443F');
  postbox(-1, -16); postbox(1, 52);
  for (const z of [38, -26, -88, -160]) mirror(-1, z);
  for (const z of [44, -9, -106]) mirror(1, z);
  for (const z of [30, -30, -110, -190]) roundSign(1, z, pick(['noparking', '30', 'oneway']));
  for (const z of [70, 1.2, -46, -140]) roundSign(-1, z, pick(['noparking', '30']));
  const colors = ['#7FC6B5', '#E28FA8', '#E9C46A', '#9BB3D6', '#D94F4F', '#B8B8B8'];
  for (let z = 104; z > -230; z -= range(2.5, 5)) {
    const side = rand() < .5 ? -1 : 1, r = rand();
    if (r < .3) bike(side, z, pick(colors));
    else if (r < .4) scooter(side, z, pick(['#E8E4DA', '#D94F4F', '#9BB3D6', '#3A3A40']));
    else if (r < .55) plantCluster(side, z);
    else if (r < .62) crates(side, z);
    else if (r < .7) cone(side, z);
    else if (r < .85) doorClutter(side, z);
  }
  for (const z of [66.5, -18, -99, -150]) bike(-1, z, pick(colors));
  // traffic lights at the crosswalks, guardrails, hydrants, maples
  trafficLight(-1, 6.2, 1); trafficLight(1, -1.2, -1); trafficLight(-1, -56.4, 1); trafficLight(1, -63.6, -1); trafficLight(-1, -166.4, 1); trafficLight(1, -173.6, -1);
  for (let z = 104; z > -226; z -= 11) for (const side of [-1, 1]) {
    if ([2.5, -60, -170, -132, -72].some(c => Math.abs(z - 5 - c) < 9)) continue;
    if (rand() < .35) { const col = pick(['#F2F2EE', '#F2F2EE', '#7FA36A']); if (!(side === 1 && z - 9.6 < 24 && z - 1.2 > 15)) guardrail(side, z - 1.2, z - 9.6, col); }   // no fence in front of the café
  }
  for (const [sd, z] of [[1, 54], [-1, -38], [1, -104], [-1, -178]]) hydrant(sd, z);
  for (const [x, z] of [[4.0, -112], [-4.0, 28.5], [4.0, -196]]) if (claim(Math.sign(x), 'curb', z - 1, z + 1)) streetTree(x, z, 'maple', .8);

  // cars parked along the road
  car(2.95, 58, '#E36A6A', -Math.PI / 2); car(-2.95, -28, '#F2F2EE', Math.PI / 2); car(2.95, -106, '#3A6EA5', -Math.PI / 2); car(-2.95, -162, '#E9C46A', Math.PI / 2);
  // street trees
  for (const [x, z] of [[4.0, 80], [-4.0, -100], [4.0, -150], [-4.0, -190], [4.0, -210], [-4.0, 47], [4.0, 3]]) if (claim(Math.sign(x), 'curb', z - 1, z + 1)) streetTree(x, z, 'green', .85);

  // ================= far city and hills so the world keeps going
  isolated(backCity);
  for (let i = 0; i < 30; i++) {
    const x = range(-80, 80), z = range(-520, -340), h = range(20, 80), w = range(12, 26);
    const f = facade(w, h, { wall: pick(['#D8DEE8', '#E8E2D8', '#C9D3E2', '#DADCD8']), style: 'panel', floors: Math.round(h / 3.4), cols: Math.round(w / 3), groundH: 0, lit: .4, px: 8 });
    mesh(new THREE.BoxGeometry(w, h, w), glowMat(f.map, f.night, 0, .9), x, h / 2, z, scene, false);
  }
  const hillMat = std('#7D9A86');
  for (let i = 0; i < 6; i++) { const hm = mesh(new THREE.SphereGeometry(range(80, 140), 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), hillMat, range(-250, 250), -20, range(-650, -560), scene, false); hm.scale.y = .35; }

  // ================= night lights (moved to the nearest lamps as you walk)
  for (let i = 0; i < 8; i++) { const l = new THREE.PointLight(0xffc98a, 0, 12, 1.6); scene.add(l); nightLights.push(l); }
}
const blinkers = [];

