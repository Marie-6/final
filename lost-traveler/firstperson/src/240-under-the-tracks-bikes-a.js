// ---------------------------------------------------------------- under the tracks (高架下): bikes, a yakitori bar, a laundromat, storage
let _laneTex, _crateTex = {};
function laneMat(len) {
  _laneTex ??= canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#6F727C'; g.fillRect(0, 0, w, h); speckle(g, w, h, .08, 5000); for (let i = 0; i < 5; i++) { g.strokeStyle = 'rgba(30,30,40,.25)'; g.lineWidth = 1.5; g.beginPath(); let x = rand() * w, y = rand() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rand() - .5) * 40; y += rand() * 30; g.lineTo(x, y); } g.stroke(); } });
  const t = _laneTex.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(len / 6, 2);
  return std('#ffffff', { map: t, roughness: .95 });
}
// plastic beer crates: ribs, a hand hole and bottle caps showing on top
function crateMat(color) {
  return _crateTex[color] ??= std('#ffffff', { roughness: .55, map: canvasTex(128, 96, (g, w, h) => {
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    g.fillStyle = shade(color, .72); for (let x = 6; x < w; x += 20) g.fillRect(x, 10, 5, h - 16);
    g.fillRect(0, h - 8, w, 8); g.fillRect(0, 0, w, 6);
    g.fillStyle = shade(color, 1.15); g.fillRect(0, 6, w, 4);
    g.fillStyle = '#1E1E24'; g.beginPath(); g.roundRect(w * .32, 13, w * .36, 14, 7); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = '900 15px "Zen Maru Gothic"'; g.textAlign = 'center'; g.fillText('みなとビール', w / 2, h * .66);
  }) });
}
function bikeAt(x, z, ry, color) {
  const g = group(x, .15, z, ry);
  const tire = std('#2B2B33'), frame = metal(color), m = metal('#C3C7CE');
  for (const s of [-.52, .52]) {
    mesh(new THREE.TorusGeometry(.32, .035, 6, 22), tire, s, .34, 0, g);
    for (let i = 0; i < 6; i++) { const sp = cyl(.006, .006, .62, m, s, .34, 0, 3, g, false); sp.rotation.z = i * Math.PI / 6; }
  }
  const tube = (l, x, y, r) => { const t = cyl(.025, .025, l, frame, x, y, 0, 6, g); t.rotation.z = r; };
  tube(.85, .05, .55, 1.05); tube(.6, -.25, .62, .25); tube(.7, .45, .66, -.3); tube(.5, -.36, .36, 1.2);
  box(.26, .06, .12, tire, -.32, .97, 0, g);
  box(.06, .06, .52, m, .38, 1.02, 0, g);
  box(.34, .26, .36, metal('#A9AEB6'), .66, .9, 0, g);
  box(.5, .04, .2, frame, -.55, .7, 0, g, false);
  return g;
}
// the front of a shop built under the tracks, facing the street: a board on top, the inside lit at night
function guardFront(kind) {
  const W = 512, H = 448, draw = night => (g, w, h) => {
    g.fillStyle = night ? '#000' : '#3A2C26'; g.fillRect(0, 0, w, h);
    if (kind === 'yakitori') {
      g.fillStyle = night ? '#000' : '#2A1F1A'; g.fillRect(0, 0, w, 96);
      g.fillStyle = night ? '#FFE9C0' : '#F6EBD8'; g.font = '900 64px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('やきとり 鳥まる', w / 2, 52);
      // the open front: a warm room, a counter and stools, red noren on top
      g.fillStyle = night ? '#C8823A' : '#8C5A30'; g.fillRect(30, 120, w - 60, h - 140);
      g.fillStyle = night ? '#FFD08A' : '#C9935A'; g.fillRect(40, 150, w - 80, 120);
      g.fillStyle = night ? '#3A1E10' : '#4A2E1E'; g.fillRect(30, 300, w - 60, 26);
      g.fillStyle = night ? '#1A0E08' : '#5E3A26'; g.fillRect(30, 326, w - 60, h - 346);
      for (let x = 70; x < w - 40; x += 74) { g.fillStyle = night ? '#100804' : '#2A1A12'; g.fillRect(x, 360, 34, 10); g.fillRect(x + 14, 370, 6, h - 390); }
      for (let i = 0; i < 6; i++) { g.fillStyle = night ? '#902018' : '#B8322B'; g.fillRect(40 + i * ((w - 80) / 6), 120, (w - 80) / 6 - 6, 96); }
      g.fillStyle = night ? '#FFE0D0' : '#FFFFFF'; g.font = '900 48px "Zen Maru Gothic"'; ['焼', '鳥', '・', '酒', '処', '・'].forEach((t, i) => g.fillText(t, 40 + (i + .5) * ((w - 80) / 6), 172));
    } else {
      g.fillStyle = night ? '#000' : '#2F6FB8'; g.fillRect(0, 0, w, 96);
      g.fillStyle = night ? '#E8F4FF' : '#FFFFFF'; g.font = '900 50px "Zen Maru Gothic"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('コインランドリー', w / 2, 42);
      g.font = '700 22px "Zen Maru Gothic"'; g.fillText('COIN LAUNDRY  24H', w / 2, 80);
      // a glass front with rows of round washer doors inside
      g.fillStyle = night ? '#E8F0F4' : '#9DB3C2'; g.fillRect(24, 112, w - 48, h - 124);
      for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
        const x = 70 + c * 93, y = 190 + r * 120;
        g.fillStyle = night ? '#FFFFFF' : '#ECEFF2'; g.fillRect(x - 40, y - 52, 80, 104);
        g.fillStyle = night ? '#9FB4C8' : '#5E7387'; g.beginPath(); g.arc(x, y + 6, 28, 0, 7); g.fill();
        g.fillStyle = night ? '#C9DAE8' : '#8FA6BA'; g.beginPath(); g.arc(x - 8, y - 2, 10, 0, 7); g.fill();
      }
      g.fillStyle = night ? '#000' : '#5A6470'; for (let x = 24; x < w; x += (w - 48) / 4) g.fillRect(x, 112, 6, h - 124);
    }
  };
  return glowMat(canvasTex(W, H, draw(false)), canvasTex(W, H, draw(true)), 0, 1.1);
}

function underTracks() {
  const z = VIA.z, steel = metal('#7E858E');
  const chain = canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(128,134,142,1)'; g.lineWidth = 2; for (let i = -h; i < w; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); g.beginPath(); g.moveTo(i + h, 0); g.lineTo(i, h); g.stroke(); } });
  const fenceMat = len => { const t = chain.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(len / 1.2, 1.5); return std('#ffffff', { map: t, transparent: true, alphaTest: .4, side: THREE.DoubleSide }); };
  const fence = (x0, x1, fz, hgt = 1.8) => {
    const len = Math.abs(x1 - x0), f = mesh(new THREE.PlaneGeometry(len, hgt), fenceMat(len), (x0 + x1) / 2, hgt / 2 + .02, fz, scene, false);
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1) + .01; x += len / Math.max(1, Math.round(len / 2.5))) box(.06, hgt + .05, .06, steel, x, hgt / 2, fz, scene, false);
    box(len, .05, .05, steel, (x0 + x1) / 2, hgt, fz, scene, false);
    return f;
  };
  const wallC = std('#D9D2C4'), shutter = std('#ffffff', { map: (() => { const t = shutterTex.clone(); t.needsUpdate = true; t.repeat.set(2, 1.5); return t; })(), roughness: .5, metalness: .3 });
  const lantern = glowMat(null, null, .25, 2.6, { color: '#D8402F', emissive: 0xff5a2a });
  for (const s of [-1, 1]) {
    // the lane under the tracks and its white edge lines
    const lane = mesh(new THREE.PlaneGeometry(300, 12), laneMat(300), s * 156, .012, z, scene, false); lane.rotation.x = -Math.PI / 2;
    for (const dz of [-5.4, 5.4]) { const l = mesh(new THREE.PlaneGeometry(300, .12), std('#E8E6DE'), s * 156, .016, z + dz, scene, false); l.rotation.x = -Math.PI / 2; }
    for (let k = 0; k < 19; k++) {
      const a = 7.2 + k * 15, b = a + 15, x0 = s * (a + .9), x1 = s * (b - .9), xm = s * (a + 7.5);
      if (k === 0) {
        // 駐輪場: two rows of bikes in racks, a sign on the pier facing the street
        for (const dz of [-1.5, 1.5]) {
          box(12.6, .06, .06, steel, xm, .5, z + dz * .55, scene, false);
          for (let x = a + 1.4; x < b - 1.2; x += .78) if (rand() < .75) bikeAt(s * x, z + dz, Math.PI / 2 + (dz < 0 ? Math.PI : 0) + range(-.08, .08), pick(['#7FC6B5', '#E28FA8', '#E9C46A', '#9BB3D6', '#D94F4F', '#B8B8B8', '#3A3A40', '#F2F2EE']));
        }
        const strip = mesh(new THREE.PlaneGeometry(13, 5.6), std('#7FA08A', { roughness: .9 }), xm, .014, z, scene, false); strip.rotation.x = -Math.PI / 2;
        sign({ lines: [{ t: '駐輪場', size: .42 }, { t: 'BICYCLE PARKING', size: .14, weight: 700 }], top: .4, w: 1.9, h: .95, bg: '#2F6FB8', fg: '#FFFFFF', frameColor: '#E8E8E8' }, s * 6.4, 3.1, z, -s * Math.PI / 2, hint.churin);
        fence(x0, x1, z - 2.9, 1.2); fence(x0, x1, z + 2.9, 1.2);
      } else if (k === 1) {
        // a shop built in under the tracks; its front looks back toward the street
        const kind = s < 0 ? 'yakitori' : 'laundry';
        box(13.2, 5.0, 5.4, wallC, xm, 2.5, z, scene);
        const front = mesh(cardGeo, guardFront(kind), s * (a + .88), 2.4, z, scene, false); front.rotation.y = -s * Math.PI / 2; front.scale.set(5.2, 4.55, 1);
        for (const dz of [-1, 1]) { const sh = mesh(cardGeo, shutter, xm + s * 2 * dz, 1.4, z + dz * 2.71, scene, false); sh.rotation.y = dz > 0 ? 0 : Math.PI; sh.scale.set(4.2, 2.6, 1); box(.6, .5, .3, std('#E8E8E4'), xm - s * 3.5, 3.2, z + dz * 2.86, scene, false); }
        if (kind === 'yakitori') {
          for (const dz of [-2.3, 2.3]) { const l = mesh(new THREE.SphereGeometry(.28, 14, 10), lantern, s * (a + .55), 2.75, z + dz); l.scale.y = 1.35; lampPositions.push(new THREE.Vector3(s * (a + .1), 2.6, z + dz)); }
          for (const [dz, n] of [[-2.15, 3], [-2.55, 2]]) for (let i = 0; i < n; i++) box(.48, .3, .36, crateMat('#D8433F'), s * (a + .45), .17 + i * .31, z + dz, scene);
          sign({ text: 'やきとり', vertical: true, w: .42, h: 1.5, bg: '#FFF4E0', fg: '#B8322B', frameColor: '#4A3426' }, s * (a + .35), 1.1, z + 1.9, -s * Math.PI / 2, hint.yakitori);
        } else {
          sign({ lines: [{ t: 'コインランドリー', size: .2 }, { t: '24時間', size: .16 }], w: 1.5, h: .6, bg: '#FFFFFF', fg: '#2F6FB8', stripe: '#2F6FB8', frameColor: '#9AA2AA' }, s * (a + .5), 1.2, z - 1.9, -s * Math.PI / 2, hint.laundry);
          lampPositions.push(new THREE.Vector3(s * (a + .2), 2.5, z));
        }
      } else if ((k + (s > 0 ? 1 : 0)) % 3 === 0) {
        // a fenced yard: pallets, drums, a covered stack
        fence(x0, x1, z - 2.9); fence(x0, x1, z + 2.9);
        if (k < 7) {
          for (let i = 0; i < 3; i++) box(1.1, .14, 1.1, std('#B08A5A'), xm + s * (i * 1.3 - 2), .07 + (i === 1 ? .15 : 0), z + 1.2, scene, false);
          for (let i = 0; i < 3; i++) cyl(.3, .3, .9, std(pick(['#3E6FA8', '#C9493B', '#4E7F4E'])), xm + s * (2.6 + i * .66), .45, z - 1.4, 12);
          const tarp = box(3, 1.2, 2, std('#3A6EA5', { roughness: .7 }), xm - s * 3.5, .6, z - 1.0); tarp.rotation.y = .05;
        }
      } else {
        // a closed-up workshop or storeroom
        box(13.2, 4.8, 5.4, std(pick(['#D9D2C4', '#CFC8BC', '#C9CDD2'])), xm, 2.4, z, scene, k < 6);
        if (k < 7) for (const dz of [-1, 1]) { const sh = mesh(cardGeo, shutter, xm, 1.4, z + dz * 2.71, scene, false); sh.rotation.y = dz > 0 ? 0 : Math.PI; sh.scale.set(4.2, 2.6, 1); }
      }
    }
  }
}

