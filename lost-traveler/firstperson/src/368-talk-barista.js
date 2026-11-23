// ---------------------------------------------------------------- talk: the barista at カフェ みなと's register
// Order a coffee: hot or iced, for here or to go, 300円. She hands it to you at the end (369-barista-3d.js), and E drinks it.
// face: 'smile' | 'surprised'; act: 'bow' | 'nod' | 'point' | 'offer'; order: 'hot' | 'ice'; give: true hands over the cup;
// brew: true (on a narrator line) sends her to the espresso machine; wait: true holds the line until she is back.
VERBS.chumon = { r: [['注文', 'ちゅうもん'], ['する', '']], ro: 'chūmon suru', en: 'Order', zh: '点单' };
const BARISTA_DAY1 = {
  who: 'barista', name: '店員さん', again: 'again',
  lines: [
    { jp: 'いらっしゃいませ！', ro: 'Irasshaimase!', en: 'Welcome!', zh: '欢迎光临！', face: 'smile', act: 'bow', introduce: true },
    { id: 'order', jp: 'ご{注文|ちゅうもん}は？', ro: 'Go-chūmon wa?', en: 'What would you like?', zh: '您要点什么？',
      choices: [
        { jp: 'コーヒーを ください。', ro: 'Kōhī o kudasai.', en: 'A coffee, please.', zh: '请给我一杯咖啡。', next: 'coffee' },
        { jp: 'お{水|みず}を ください。', ro: 'O-mizu o kudasai.', en: 'Some water, please.', zh: '请给我一杯水。', next: 'water' },
        { jp: 'すみません、わかりません。', ro: 'Sumimasen, wakarimasen.', en: "Sorry, I don't understand.", zh: '对不起，我听不懂。', next: 'help' },
      ] },
    { id: 'water', jp: 'お{水|みず}は あちらです。セルフサービスです。', ro: 'O-mizu wa achira desu. Serufu sābisu desu.', en: "The water is over there. It's self-service.", zh: '水在那边，是自助的。', act: 'point', next: 'order' },
    { id: 'help', jp: 'だいじょうぶですよ。コーヒーは いかがですか？', ro: 'Daijōbu desu yo. Kōhī wa ikaga desu ka?', en: "That's okay! How about a coffee?", zh: '没关系哦。来杯咖啡怎么样？', face: 'smile', next: 'order' },
    { id: 'coffee', jp: 'コーヒーですね。ホットと アイス、どちらに しますか？', ro: 'Kōhī desu ne. Hotto to aisu, dochira ni shimasu ka?', en: 'A coffee. Hot or iced?', zh: '咖啡是吧。要热的还是冰的？',
      choices: [
        { jp: 'ホットで おねがいします。', ro: 'Hotto de onegaishimasu.', en: 'Hot, please.', zh: '请给我热的。', next: 'hot' },
        { jp: 'アイスで おねがいします。', ro: 'Aisu de onegaishimasu.', en: 'Iced, please.', zh: '请给我冰的。', next: 'ice' },
      ] },
    { id: 'hot', jp: 'ホットですね。', ro: 'Hotto desu ne.', en: 'Hot, then.', zh: '热的是吧。', order: 'hot', act: 'nod', next: 'here' },
    { id: 'ice', jp: 'アイスですね。', ro: 'Aisu desu ne.', en: 'Iced, then.', zh: '冰的是吧。', order: 'ice', act: 'nod', next: 'here' },
    { id: 'here', jp: '{店内|てんない}で お{召|め}し{上|あ}がりですか？ お{持|も}ち{帰|かえ}りですか？', ro: 'Tennai de omeshiagari desu ka? Omochikaeri desu ka?', en: 'For here, or to go?', zh: '在店里用，还是带走？',
      choices: [
        { jp: '{店内|てんない}で おねがいします。', ro: 'Tennai de onegaishimasu.', en: 'For here, please.', zh: '在店里用。', next: 'in' },
        { jp: '{持|も}ち{帰|かえ}りで おねがいします。', ro: 'Mochikaeri de onegaishimasu.', en: 'To go, please.', zh: '带走。', next: 'out' },
      ] },
    { id: 'in', jp: '{店内|てんない}ですね。{300|さんびゃく}{円|えん}です。', ro: 'Tennai desu ne. Sanbyaku en desu.', en: "For here. That's 300 yen.", zh: '店内用餐。300日元。', next: 'pay' },
    { id: 'out', jp: 'お{持|も}ち{帰|かえ}りですね。{300|さんびゃく}{円|えん}です。', ro: 'Omochikaeri desu ne. Sanbyaku en desu.', en: "To go. That's 300 yen.", zh: '带走是吧。300日元。', next: 'pay' },
    { id: 'pay', by: 'narr', jp: '（{300|さんびゃく}{円|えん}を はらう）', ro: '(sanbyaku en o harau)', en: '(You pay 300 yen.)', zh: '（你付了300日元。）' },
    { jp: 'ちょうど いただきます。{少々|しょうしょう} お{待|ま}ちください。', ro: 'Chōdo itadakimasu. Shōshō omachi kudasai.', en: 'Exact change, thank you. One moment, please.', zh: '正好，收您钱了。请稍等。', act: 'nod' },
    { by: 'narr', jp: '……', ro: '', en: '(She makes your coffee.)', zh: '（她在给你做咖啡。）', brew: true, wait: true },
    { jp: 'お{待|ま}たせしました。どうぞ！', ro: 'Omatase shimashita. Dōzo!', en: 'Sorry to keep you waiting. Here you go!', zh: '让您久等了。请慢用！', face: 'smile', act: 'offer', give: true },
    { jp: 'ありがとうございました！', ro: 'Arigatō gozaimashita!', en: 'Thank you very much!', zh: '谢谢光临！', face: 'smile', act: 'bow', end: true },
    { id: 'again', jp: 'あ、いらっしゃいませ！ また {来|き}て くれましたね。', ro: 'A, irasshaimase! Mata kite kuremashita ne.', en: 'Oh, welcome! You came back.', zh: '啊，欢迎光临！你又来了呢。', face: 'smile', act: 'nod', next: 'order' },
  ],
};
