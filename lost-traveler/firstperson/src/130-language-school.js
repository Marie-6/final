// ================================================================ the language school (walk-in)
// みなと日本語学校. From the street: a brick wall with gate posts and lamps, a paved front yard with two
// lawns, sakura trees and benches, then a three-story building. The ground floor is walk-in:
//   昇降口 (the entrance, where you change shoes) in the middle, the 初級クラス classroom to its right,
//   職員室 (teachers' room, closed for now) and the stairs to its left, and the 廊下 (hallway) along the back.
// x runs from the street wall (-6) to the back wall (-28); z from 4 to 26, between くらや and the bookshop.
const SCH = { z0: 4.2, z1: 25.8, fx: -15, part: -24.5, back: -27.75, FL: .36, H: 3.3, step: -22 };
const slideDoors = [];      // classroom doors you can open and close: panel group, track x, doorway z range
const schoolLights = [];
// inside the building the floor is one step up (FL), except the low part of the entrance where you take your shoes off
function schoolFloor(x, z) {
  return x < SCH.fx - .1 && z > SCH.z0 && z < SCH.z1 && !(x > SCH.step && z > 12.5 && z < 17.5);
}
// where you are, for the badge in the corner
function areaAt(x, z) {
  if (player.fy > 5) return z > STA.edge ? 'densha' : 'home';
  if (player.fy > 1) return 'kaidan';
  if (x > STA.x0 && z < STA.zN && z > STA.zS) return x > STA.gx ? 'nai' : 'eki';
  if (cafeDoor.z && x > cafeDoor.x + .2) return restroom.door && x > restroom.x + .1 ? 'wc' : 'cafe';
  if (z > 4 && z < 26 && x < -6.3) {
    if (x > SCH.fx) return 'yard';
    if (x > SCH.part && z > 17.5) return 'classroom';
    if (x > SCH.part && z > 12.5 && z < 17.5) return 'genkan';
    return 'rouka';
  }
  return '';
}
const AREA_BADGE = {
  '': '日本語学校の通り<small>First-person street test</small>',
  wc: 'お手洗い<small>Restroom · おてあらい</small>',
  cafe: 'カフェ<small>Café · tap the menus to read them</small>',
  yard: 'みなと日本語学校<small>School front yard · tap the signs</small>',
  genkan: '昇降口<small>Entrance · shōkōguchi · change into indoor shoes</small>',
  rouka: '廊下<small>Hallway · rōka</small>',
  classroom: '教室<small>Classroom · kyōshitsu · sit at a desk</small>',
  eki: 'みなと駅 東口<small>Minato Station · east exit · tap the signs</small>',
  nai: '改札内<small>Inside the gates · kaisatsu-nai · stairs to platform 1</small>',
  kaidan: '階段<small>Stairs · kaidan · up to platform 1</small>',
  home: '1番線ホーム<small>Platform 1 · hōmu · wait behind the yellow line</small>',
  densha: '電車の中<small>On the train · densha no naka · sit down</small>',
};
// every glyph the school draws on canvas, so the web fonts are loaded before the textures are painted
const SCHOOL_GLYPHS = 'みなと日本語学校受付上履きにはきかえてください土足禁止下駄箱ようこそ初級クラス職員室非常口消火器立入禁止廊下は走らないスピーチ大会お知らせ〜をコーヒー水ホットでアイス店内持ち帰りさんびゃく円ですら日直リン月火水木金時間割毎すこしずつ０１２３４５６７８９ひがなあいうえおかけしせそたちつてとぬねのふへほまみむめもやゆよりるれろわん図書室遠足保健漢字テスト生徒募集中？！：／（）、。・';
// and every glyph the station and the train draw
const STATION_GLYPHS = '東口駅きっぷうりば運賃表改札窓口時刻表方面コインロッカー番線のりば出口次電車普通さくらまち両黄色い線の内側でお待ちください優先席つぎはうみべちゅうおうこうえんくうこう現在地ねだんをえらんでチャージこうかおさつきっぷ・おつりどもはがく水族館イルカショー毎日祭り月新発売ビール生徒募集中定期券号車行ご案内図自動ドアEASTEXITMINATOSTONextrainSakumchUbPlfFsCdIN';

