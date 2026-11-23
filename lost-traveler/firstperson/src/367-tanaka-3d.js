// ---------------------------------------------------------------- 田中先生 in 3D, at the school's 受付 window
// He works at a desk in the teachers' room (a shape behind the frosted glass). Ring the bell (366) and he walks to the
// window, the glass slides open and he talks with you: he looks at you, blinks, moves his mouth with his voice,
// smiles, bows at はじめまして, points to the class and waves goodbye. When the talk ends the glass closes and he goes back.
const TANAKA3D = makePerson3d({
  skin: '#F9DEC8', hair: '#3A2D27', shirt: '#EEF1F3', vest: '#5D6F8F', tie: '#B8544B',
  pants: '#3B3F4C', shoes: '#6E4B33', glasses: true, lanyard: '#3F7F67',
});
people3d.tanaka = TANAKA3D;
scene.add(TANAKA3D.root);
{
  const P = TANAKA3D, AWAY = [-21.35, 10.75, Math.PI * .85], WIN = [-20.6, 12.14, 0];
  P.root.position.set(AWAY[0], SCH.FL, AWAY[1]); P.root.rotation.y = AWAY[2];
  const S = { here: false, leaveIn: 0, open: 0, line: null };
  people3dStage.push(dt => {
    const T = talking && talking.script.who === 'tanaka' ? talking : null;
    if (T && !S.here) { S.here = true; S.leaveIn = 0; P.goTo(WIN[0], WIN[1], WIN[2]); }
    if (!T && S.here) { S.here = false; S.leaveIn = .7; S.line = null; P.face = ''; P.act('nod'); }
    if (S.leaveIn > 0 && (S.leaveIn -= dt) <= 0) P.goTo(AWAY[0], AWAY[1], AWAY[2]);
    // the frosted pane slides open once he's at the window
    const atWin = S.here && Math.hypot(P.root.position.x - WIN[0], P.root.position.z - WIN[1]) < .08;
    S.open += ((atWin ? 1 : 0) - S.open) * Math.min(1, dt * 4);
    if (SCH.pane) SCH.pane.position.x = -20.6 - S.open * .82;
    // each new line: his face and gesture
    if (T && T.line !== S.line) {
      S.line = T.line;
      const by = T.line.by || 'npc';
      if (by === 'npc') { P.face = T.line.face || ''; if (T.line.act) P.act(T.line.act); }
      else if (by === 'me') P.face = '';
    }
    P.speaking = !!(T && T.line && (T.line.by || 'npc') === 'npc' &&
      (!T.done || (voiceAudio && !voiceAudio.paused) || ('speechSynthesis' in window && speechSynthesis.speaking)));
    P.update(dt, camera.position);
    if (T) people3dFrame(P, SCH.FL + 1.84, -20.75, 13.9, dt);   // your view turns to him; a polite step back
  });
}
