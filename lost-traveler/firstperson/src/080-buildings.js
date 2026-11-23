// ================================================================ buildings
function building(side, z0, z1, o) {
  const len = z0 - z1, depth = o.depth || 11, setback = o.setback || 0;
  const fx = side * (WALK + setback), n = -side;          // n points from the wall to the street
  const x = fx + side * depth / 2, zc = (z0 + z1) / 2;
  o.groundH = o.groundH ?? ({ shop: 3.4, konbini: 3.4, entrance: 3.0, house: 2.8, parking: 3.0 }[o.ground] ?? 0);
  const f = layout(len, o.h, o);
  const front = wallMat(o.style, o.wall, len, o.h), plain = wallMat(o.style, shade(o.wall, .95), depth, o.h);
  const roof = std(shade(o.wall, .6));
  const mats = side < 0 ? [front, plain, roof, plain, plain, plain] : [plain, front, roof, plain, plain, plain];
  const b = o.interior ? mesh(new THREE.BoxGeometry(depth, o.h - o.groundH, len), mats, x, (o.h + o.groundH) / 2, zc)
                       : mesh(new THREE.BoxGeometry(depth, o.h, len), mats, x, o.h / 2, zc);
  const uToZ = u => side < 0 ? z0 - u : z1 + u;
  const out = d => fx + n * d;                              // x at distance d in front of the wall
  const ry = side < 0 ? Math.PI / 2 : -Math.PI / 2;
  const onWall = (mat, u, y, w, hh, d) => { const p = mesh(cardGeo, mat, out(d), y, uToZ(u), scene, false); p.rotation.y = ry; p.scale.set(w, hh, 1); return p; };
  // windows and doors
  for (const w of f.wins) onWall(w.door ? doorMat(w.f) : winMat(w.frost ? 'frost' : 'win', w.lit), w.u, w.y + w.h / 2, w.w, w.h, .012);
  // ground floor front, sometimes behind a metal roll shutter
  if (o.ground && o.ground !== 'none' && o.groundH > 0) {
    if (!o.interior) onWall(groundFront(len, o), len / 2, o.groundH / 2, len, o.groundH, .014);
    if ((o.ground === 'shop') && (o.shutter ?? rand() < .3)) {
      const half = rand() < .5, sh = half ? 1.3 : 2.75, st = shutterTex.clone(); st.needsUpdate = true; st.repeat.set(len * .9 / 2, sh / 1.6);
      onWall(std('#ffffff', { map: st, roughness: .5, metalness: .3 }), len / 2, 2.95 - sh / 2, len * .9, sh, .03);
      box(.32, .32, len * .92, std('#B9BDC3', { roughness: .5, metalness: .3 }), out(.16), 3.06, zc);
    }
  }
  if (o.groundBand) box(.05, .24, len, std(o.groundBand), out(.025), o.groundH - .1, zc, scene, false);
  // keep the sidewalk in front of the door clear, and remember where the door is
  const doorU = { shop: [len / 2 - 1.0, len / 2 + 1.0], konbini: [len / 2 - 1.0, len / 2 + 1.0], entrance: [len / 2 - 1.5, len / 2 + 1.5],
                  house: [len * .3 - .3, len * .3 + 1.9], parking: [0, len] }[o.ground];
  if (doorU) { claim(side, 'wall', uToZ(doorU[0]), uToZ(doorU[1])); if (o.ground !== 'parking') doorways.push([side, Math.min(uToZ(doorU[0]), uToZ(doorU[1])), Math.max(uToZ(doorU[0]), uToZ(doorU[1]))]); }
  if (o.ground === 'shop' || o.ground === 'konbini') noPole.push([side, Math.min(z0, z1) + .3, Math.max(z0, z1) - .3]);
  else if (doorU) noPole.push([side, Math.min(uToZ(doorU[0]), uToZ(doorU[1])), Math.max(uToZ(doorU[0]), uToZ(doorU[1]))]);
  const freeU = (a, b) => { for (let k = 0; k < 12; k++) { const u = range(a, b); if (!doorU || u < doorU[0] - .4 || u > doorU[1] + .4) return u; } return null; };
  if (zc < 125 && zc > -245 && !o.interior) onWall(grimeMat(), len / 2, o.h / 2, len, o.h, .006);
  // corner columns
  for (const u of [.16, len - .16]) box(.12, o.h, .32, std(shade(o.wall, o.style === 'brick' ? .8 : .96)), out(.06), o.h / 2, uToZ(u));
  const trim = std(shade(o.wall, 1.12 > 1 ? 1.05 : 1));
  const far = zc > 125 || zc < -245 || o.far;

  // parapet and roof edge
  box(depth + .25, .5, len + .25, std(shade(o.wall, .8)), x + n * .12, o.h + .25, zc);
  // floor ledges give the strong horizontal lines of real buildings
  for (let k = 0; k <= o.floors; k++) {
    const y = f.base + k * f.floorH;
    if (y < .5 || y > o.h - .3) continue;
    box(.22, .16, len, std(shade(o.wall, .88)), out(.11), y, zc, scene, !far);
  }
  if (!far) {
    for (const w of f.wins) {
      const z = uToZ(w.u);
      if (w.door) {
        box(.35, .08, w.w + .3, std('#8C8F96'), out(.17), w.y + w.h + .25, z);
        box(.08, .1, .2, doorLight(), out(.05), w.y + w.h + .12, z + w.w / 2 + .25, scene, false);
        box(.12, .32, .26, std('#B9BDC3'), out(.06), 1.0 + w.y, z - w.w / 2 - .35, scene, false);   // gas meter box
        continue;
      }
      box(.18, .07, w.w + .2, trim, out(.09), w.y - .06, z, scene, false);          // sill
      const fm = std('#A9ADB4', { roughness: .45, metalness: .35 });                 // window frame with depth
      box(.08, .06, w.w + .12, fm, out(.04), w.y + w.h + .03, z, scene, false);
      box(.08, w.h + .1, .06, fm, out(.04), w.y + w.h / 2, z - w.w / 2 - .03, scene, false);
      box(.08, w.h + .1, .06, fm, out(.04), w.y + w.h / 2, z + w.w / 2 + .03, scene, false);
      if (!o.balcony) box(.12, .05, w.w + .2, std('#9EA2A9'), out(.07), w.y + w.h + .1, z, scene, false);
    }
  }
  // balconies with frosted fronts, AC units, laundry and plants (never on the ground floor)
  if (o.balcony && !far && o.floors >= 3) for (const w of f.wins) {
    if (w.y < 2.4) continue;
    const z = uToZ(w.u), bw = Math.min(len / o.cols - .35, 3.8), by = w.y - .12;
    box(1.15, .14, bw, std('#D9D6CF'), out(.58), by, z);
    if (o.bars) { const bt = barTex.clone(); bt.needsUpdate = true; bt.repeat.set(bw, 1); const bp = mesh(cardGeo, std('#6E747C', { map: bt, alphaTest: .5, side: THREE.DoubleSide, roughness: .5, metalness: .4 }), out(1.12), by + .55, z, scene, false); bp.rotation.y = ry; bp.scale.set(bw, 1.0, 1); }
    else box(.07, 1.0, bw, std(o.balcony, { transparent: true, opacity: .92 }), out(1.12), by + .55, z);
    box(.09, .06, bw + .05, metal('#9AA0A8'), out(1.12), by + 1.08, z, scene, false);
    for (const s of [-1, 1]) box(1.1, 1.0, .06, std(shade(o.wall, .9)), out(.58), by + .55, z + s * bw / 2);
    if (rand() < .65) { const ac = box(.48, .55, .78, std('#EEEDE8'), out(.4), by + .35, z + bw * .3); }
    if (rand() < .5) {                                    // laundry pole with clothes
      cyl(.02, .02, bw * .8, metal('#A9AFB8'), out(.75), by + 1.6, z, 6, scene, false).rotation.x = Math.PI / 2;
      for (let i = 0; i < 4; i++) if (rand() < .8) box(.03, range(.35, .7), range(.3, .5), std(pick(['#FFFFFF', '#9DC4E8', '#F4A9BE', '#F2C14E', '#B9D99A', '#606A7A'])), out(.75), by + 1.25, z - bw * .3 + i * bw * .2, scene, false);
    }
    if (rand() < .4) for (let i = 0; i < 2; i++) plantPot(out(.85), by + .07, z - bw * .35 + i * .45, .7);
  }
  // wall AC units with pipes (buildings without balconies)
  const shopFloor = o.ground === 'shop' || o.ground === 'konbini';
  if (o.ac && !far) for (const w of f.wins) if (!w.door && rand() < o.ac && w.y > 1.5 && !(shopFloor && w.f === 0)) {
    const z = uToZ(w.u) + (rand() < .5 ? -1 : 1) * (w.w / 2 + .55);
    const yy = w.y + range(-.1, .4);
    box(.42, .55, .78, std('#ECEBE6'), out(.3), yy, z);
    box(.04, .4, .4, std('#8E9298'), out(.52), yy, z);
    box(.06, .06, .5, metal('#C9CCD1'), out(.05), yy - .2, z + .45, scene, false);
  }
  // drain pipe, meter box
  if (!far) {
    cyl(.06, .06, o.h, metal('#A7AAAF'), out(.1), o.h / 2, uToZ(len - .25), 8);
    if (rand() < .8) { const mz = uToZ(rand() < .5 ? .55 : len - .65); box(.16, .5, .38, std('#C9CBCD'), out(.08), 1.5, mz); box(.17, .18, .2, std('#E9E9E2'), out(.09), 1.55, mz); }
  }
  // rooftop: water tank, railings, antenna, maybe a billboard
  if (o.roof !== false && !far) {
    if (rand() < .6) { const tz = zc + range(-len / 4, len / 4); for (const dx of [-.4, .4]) for (const dz of [-.4, .4]) box(.08, 1, .08, metal('#8A9098'), x + dx + side * 1.5, o.h + .9, tz + dz); box(1.4, 1.2, 1.4, std('#DDE3E8'), x + side * 1.5, o.h + 1.9, tz); }
    if (rand() < .5) { box(.05, 1, len - .4, metal('#9AA0A8'), out(.1) + side * .1, o.h + 1, zc, scene, false); }
    if (rand() < .4) cyl(.03, .03, 2.5, metal('#777'), x, o.h + 1.7, zc + range(-len / 3, len / 3), 5, scene, false);
  }
  if (!far && (o.tower || (o.ground === 'shop' && o.floors >= 3 && rand() < .4))) tenantTower({ base: f.base, len, uToZ, out }, o.h);
  if (!far && o.letters) { const word = pick(TENANTS), col = pick(['#FFFFFF', '#F2C230', '#D8433F']); for (const w of f.wins) if (w.f === 0 && !w.door) { const lp = mesh(cardGeo, windowLetters(word, col), out(.02), w.y + w.h / 2, uToZ(w.u), scene, false); lp.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; lp.scale.set(w.w * .85, w.h * .45, 1); } }
  if (!far && o.h >= 13 && rand() < .55) { const aw = Math.min(depth - 1.5, 7), ad = mesh(cardGeo, adMat(), x, o.h - 2.8, z0 + .03, scene, false); ad.scale.set(aw, aw * .62, 1); }
  if (!far && o.posters !== false) {
    const ry = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    const plate = mesh(cardGeo, plateMat(), out(.03), 2.15, uToZ(.45), scene, false); plate.rotation.y = ry; plate.scale.set(.36, .13, 1);
    const count = o.ground === 'shop' || o.ground === 'konbini' ? 2 + Math.floor(rand() * 3) : Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      const pu = freeU(.6, len - .6); if (pu === null) continue;
      const pm = mesh(cardGeo, posterMat(), out(.025 + i * .002), range(1.15, 1.75), uToZ(pu), scene, false);
      pm.rotation.set(0, ry, range(-.05, .05)); pm.scale.set(.44, .6, 1);
    }
  }
  return { b, uToZ, fx, n, out, f, len, zc, groundH: o.groundH, base: f.base };
}

