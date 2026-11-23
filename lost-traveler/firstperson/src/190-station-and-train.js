// ================================================================ みなと駅 (walk-in) and the train
// 東口, the east exit, stands on the right side of the street (x 6..17.2, z -75.2..-96), and 1番線, the platform,
// sits on top of it beside the tracks, running along the viaduct from x 6 to 112.
//   ground floor: automatic doors, three ticket machines under the fare chart, the ticket gates (改札), the station
//   office window (窓口) and coin lockers. Inside the gates a corridor leads to the stairs and an up escalator, which
//   climb north (two flights with a landing, 9 m) and come out on the platform through an opening in its floor.
// Floors: floorAt() picks the floor nearest your feet (street, stairs, platform, train), so the same x, z can be the
// concourse below and the platform above. Collisions only count what is at your own height (blocked()).
const STA = {
  x0: 6, x1: 17, zN: -75.2, zS: -96, CH: 3.8, PL: 9.3,
  gx: 10.3,                    // the ticket gate line
  wall: 13.3,                  // the wall between the paid corridor and the stairwell
  mid: 15.675,                 // between the stairs (west) and the escalator (east)
  zBot: -93.6, zTop: -76.4,    // both climb from zBot (street level) to zTop (platform level)
  edge: -73.55, back: -78.8, px0: 6, px1: 112,   // the platform
};
STA.half = (STA.PL - .15) / 2;   // each flight climbs half way, in 26 steps
const staDoor = { panels: [], open: 0, z: -87 };
let escalatorTex = null;
function stairY(z) {
  const s = z - STA.zBot;
  if (s <= 7.8) return .15 + Math.max(0, s) / 7.8 * STA.half;
  if (s <= 9.4) return .15 + STA.half;
  return Math.min(STA.PL, .15 + STA.half + (s - 9.4) / 7.8 * STA.half);
}
function escY(z) { return .15 + THREE.MathUtils.clamp((z - STA.zBot) / (STA.zTop - STA.zBot), 0, 1) * (STA.PL - .15); }
function groundY(x, z) { return schoolFloor(x, z) ? SCH.FL : Math.abs(x) > ROAD ? .15 : 0; }
function onPlatform(x, z) { return x > STA.px0 && x < STA.px1 && z > STA.back && z <= STA.edge; }
// the floor under (x, z) for feet at height `cur`, or null when there is none within a step (a drop, a wall of air)
function floorAt(x, z, cur) {
  let h;
  if (x > STA.wall && x < STA.x1 && z > STA.zBot && z < STA.zTop) h = x < STA.mid ? stairY(z) : escY(z);
  else {
    h = groundY(x, z);
    if ((onPlatform(x, z) || inTrain(x, z)) && Math.abs(STA.PL - cur) < Math.abs(h - cur)) h = STA.PL;
  }
  return Math.abs(h - cur) < .7 ? h : null;
}

// text on a canvas, shrunk to fit maxW
function canvasText(g, t, x, y, size, color, weight = 900, align = 'center', maxW) {
  g.font = `${weight} ${size}px "Zen Maru Gothic"`;
  if (maxW) { const tw = g.measureText(t).width; if (tw > maxW) g.font = `${weight} ${size * maxW / tw}px "Zen Maru Gothic"`; }
  g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(t, x, y);
}

