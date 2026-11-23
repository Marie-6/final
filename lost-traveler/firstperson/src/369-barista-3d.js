// ---------------------------------------------------------------- the barista in 3D, behind カフェ みなと's register
// She stands behind the レジ and looks up at you when you come near. Press E there to order (368-talk-barista.js):
// she bows, turns to the machine to make your coffee, and hands you a hot paper cup or an iced coffee to drink (E).
const BARISTA3D = makePerson3d({
  skin: '#F8DCC6', hair: '#4A3128', hairStyle: 'bob', bun: true, lashes: true, lips: '#A85A55',
  shirt: '#F4F1EA', apron: '#4E3B31', pants: '#33363F', shoes: '#2E2A28', scale: .95,
});
people3d.barista = BARISTA3D;
scene.add(BARISTA3D.root);
BARISTA3D.root.visible = false;   // until the café is built

// a coffee in your hand: a hot paper cup with a sleeve and lid, or an iced coffee with a straw
function holdCoffee(kind) {
  if (holding) camera.remove(holding.g);
  if (!camera.parent) scene.add(camera);
  const g = new THREE.Group(); g.position.set(.2, -.2, -.45); camera.add(g);
  let w;
  if (kind === 'ice') {
    mesh(new THREE.CylinderGeometry(.04, .032, .12, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#EAF4F8', transparent: true, opacity: .16, roughness: .05, depthWrite: false, side: THREE.DoubleSide }), 0, 0, 0, g, false);
    w = mesh(new THREE.CylinderGeometry(.037, .031, .1, 16), std('#3A2116', { roughness: .2 }), 0, -.055, 0, g, false); w.geometry.translate(0, .05, 0);
    for (let i = 0; i < 4; i++) mesh(new THREE.BoxGeometry(.018, .018, .018), new THREE.MeshStandardMaterial({ color: '#F2FAFF', transparent: true, opacity: .6, roughness: .05 }), (i % 2 - .5) * .025, .03 - (i > 1) * .02, (i > 1 ? .5 : -.5) * .015, g, false).rotation.set(i, i * 2, 0);
    const straw = mesh(new THREE.CylinderGeometry(.004, .004, .17, 6), std('#3F8A5A'), .012, .07, 0, g, false); straw.rotation.z = -.15;
  } else {
    mesh(new THREE.CylinderGeometry(.04, .031, .115, 16), std('#F7F3EC', { roughness: .8 }), 0, 0, 0, g, false);
    mesh(new THREE.CylinderGeometry(.0385, .034, .045, 16), std('#9A6B45', { roughness: .9 }), 0, -.008, 0, g, false);   // sleeve
    mesh(new THREE.CylinderGeometry(.043, .042, .012, 16), std('#3B2A22', { roughness: .5 }), 0, .062, 0, g, false);     // lid
    w = new THREE.Object3D(); g.add(w);
  }
  holding = { g, w, drink: true };
}

function placeBarista() {
  const R = cafeDoor.reg; if (!R) return;
  // she walks in the aisle behind the counter: down the register leg (x = aisleX), round the corner,
  // then along the back bar (z = aisleZ) to the espresso machine; her spots leave room to bow without leaning into the counter
  const P = BARISTA3D, home = [R.aisleX, R.z + .45, -Math.PI / 2], machine = [R.machineX, R.aisleZ, Math.PI];
  const corner = [R.aisleX, R.aisleZ];
  const pickup = [R.machineX, R.aisleZ, 0];   // turned around at the machine, facing you across the long counter
  const inBackAisle = () => P.root.position.z < R.aisleZ + .45;
  const walk = to => P.goTo(...to, inBackAisle() === (to === machine) ? [] : [corner]);
  P.root.position.set(home[0], R.floor, home[1]); P.root.rotation.y = home[2]; P.root.visible = true;
  addTalkSpot(R.x - .9, R.z + .3, 1.5, 'chumon', BARISTA_DAY1);
  P.speed = 1.3;
  const S = { line: null, order: 'hot', near: false, act: null, give: false, brew: 0, served: false };
  const arrived = () => !P.path.length && Math.hypot(P.target.x - P.root.position.x, P.target.y - P.root.position.z) < .03;
  people3dStage.push(dt => {
    const T = talking && talking.script.who === 'barista' ? talking : null;
    if (T && T.line !== S.line) {
      S.line = T.line;
      const L = T.line, by = L.by || 'npc';
      if (L.order) S.order = L.order;
      if (L.brew) { walk(machine); S.brew = 1; } else if (by === 'npc' && !S.served) walk(home);
      if (by === 'npc') { P.face = L.face || ''; S.act = L.act || null; S.give = !!L.give; }
      else if (by === 'me') P.face = '';
    }
    // gestures wait until she is back at the register, so she never bows or reaches out mid-walk
    if (S.act && arrived()) {
      P.act(S.act); S.act = null;
      if (S.give) { S.give = false; setTimeout(() => holdCoffee(S.order), 900); }   // as her hands come forward
    }
    // making the coffee: walk to the machine, work at it for a moment, then turn around and serve you right there
    if (S.brew === 1 && arrived()) { S.brew = 2; S.t = 0; P.act('offer'); }
    else if (S.brew === 2 && (S.t += dt) > 2.6) { S.brew = 0; S.served = true; P.goTo(...pickup); talkRelease(); }
    if (!T && S.line) { S.line = null; P.face = ''; S.act = null; S.brew = 0; S.served = false; walk(home); }
    P.speaking = !!(T && T.line && (T.line.by || 'npc') === 'npc' &&
      (!T.done || (voiceAudio && !voiceAudio.paused) || ('speechSynthesis' in window && speechSynthesis.speaking)));
    // she looks up at you when you're in the café near the counter
    const d = Math.hypot(player.pos.x - home[0], player.pos.z - home[1]);
    P.update(dt, T || d < 5 ? camera.position : null);
    // you stand at the register, and move round to the long counter while she makes your coffee
    if (T) people3dFrame(P, R.floor + 1.58, ...(S.brew || S.served ? [R.machineX, R.aisleZ + 1.85] : [R.x - 1.3, R.z + .45]), dt);
  });
}
