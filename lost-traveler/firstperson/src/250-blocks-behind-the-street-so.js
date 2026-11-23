// ---------------------------------------------------------------- the blocks behind the street, so the city goes on in every gap
function backCity() {
  // a few shared painted facades, picked by height (shared materials merge into few draw calls)
  const pool = [];
  for (const H of [8, 11, 14, 18, 24, 32, 44, 60]) for (const wall of [['#DCD6CC', '#E7E1D6'], ['#CFD6DE', '#D9D3CC'], ['#E6D8C8', '#C9CDD2']][pool.length % 3]) {
    const f = facade(14, H, { wall, style: pick(['panel', 'tile', 'mosaic']), floors: Math.max(2, Math.round((H - 1) / 3.1)), cols: 4, groundH: 0, lit: .35, px: 14, balcony: rand() < .4 ? '#EEF0F2' : undefined });
    pool.push({ H, mat: glowMat(f.map, f.night, 0, .9, { roughness: .9 }) });
  }
  const matFor = h => { const best = pool.filter(p => p.H >= h * .8 && p.H <= h * 1.25); return (best.length ? pick(best) : pool[pool.length - 1]).mat; };
  const roofMat = std('#8F918F'), tank = std('#E3E1DA'), acMat = std('#E8E8E4'), rail = metal('#9AA0A6');
  const gaps = s => [[-79, -65], [-141, -123], ...(s < 0 ? [[-7, 37]] : [])];
  const rows = [{ x: 18.6, d: [9, 12], h: [7, 20], roof: true, cast: true }, { x: 32.5, d: [10, 13], h: [10, 28], roof: true }, { x: 48, d: [12, 16], h: [14, 40] }];
  for (const s of [-1, 1]) rows.forEach((r, ri) => {
    for (let zTop = 150; zTop > -380;) {
      const len = range(9, 17), zBot = zTop - len;
      // keep the lane under the tracks, the railroad crossing and the space behind the school open (the school only for the first two rows)
      const g = gaps(s).find(([lo, hi]) => zBot < hi && zTop > lo && !(lo === -7 && ri === 2));
      if (g) { zTop = g[0] - .2; continue; }
      const d = range(...r.d), h = range(...r.h), x = s * (r.x + d / 2), zc = (zTop + zBot) / 2;
      mesh(new THREE.BoxGeometry(d, h, len), matFor(h), x, h / 2, zc, scene, !!r.cast);
      if (r.roof) {
        box(d + .2, .25, len + .2, roofMat, x, h + .12, zc, scene, false);
        if (rand() < .4) { const tx = x + range(-d / 4, d / 4), tz = zc + range(-len / 4, len / 4); cyl(.9, .9, 1.5, tank, tx, h + 1.4, tz, 14, scene, false); for (const [ox, oz] of [[-.6, -.6], [.6, -.6], [-.6, .6], [.6, .6]]) box(.08, .65, .08, rail, tx + ox, h + .32, tz + oz, scene, false); }
        for (let i = 0, n = Math.floor(rand() * 4); i < n; i++) box(.8, .6, .5, acMat, x + range(-d / 3, d / 3), h + .55, zc + range(-len / 3, len / 3), scene, false);
        if (h > 12 && rand() < .4) box(3, 2.4, 3.2, matFor(8), x + range(-d / 5, d / 5), h + 1.2, zc + range(-len / 5, len / 5), scene, false);
      }
      zTop = zBot - (rand() < .25 ? range(1.6, 3.6) : .25);
    }
  });
  // taller towers further out
  for (let i = 0; i < 150; i++) {
    const s = rand() < .5 ? -1 : 1, x = s * range(70, 175), z = range(-440, 170), h = range(18, 70), w = range(10, 20);
    if (Math.abs(z - VIA.z) < w / 2 + 6 || Math.abs(z + 132) < w / 2 + 6) continue;
    mesh(new THREE.BoxGeometry(w, h, w), matFor(h), x, h / 2, z, scene, false);
  }
}

