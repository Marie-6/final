// ---------------------------------------------------------------- talk: 田中先生 at the school's 受付 window
// The teachers' room is closed, but there's a bell on the reception ledge. Ring it and Tanaka-sensei comes to the window.
// He appears in 3D at the window (367-tanaka-3d.js). face: 'smile' | 'surprised'; act: 'bow' | 'nod' | 'point' | 'wave'.
VERBS.yobu = { r: [['呼', 'よ'], ['び', ''], ['鈴', 'りん'], ['を', ''], ['鳴', 'な'], ['らす', '']], ro: 'yobirin o narasu', en: 'Ring the bell', zh: '按铃' };
const TANAKA_DAY1 = {
  who: 'tanaka', name: '田中先生', again: 'again',
  lines: [
    { by: 'narr', jp: 'チーン♪', ro: 'chīn', en: '(You ring the bell.)', zh: '（你按了铃。）' },
    { jp: 'はーい！', ro: 'Hāi!', en: 'Coming!', zh: '来了！', face: 'surprised' },
    { jp: 'こんにちは。{日本語|にほんご}{学校|がっこう}へ ようこそ。', ro: 'Konnichiwa. Nihongo gakkō e yōkoso.', en: 'Hello. Welcome to the Japanese school.', zh: '你好。欢迎来到日语学校。', face: 'smile' },
    { jp: 'はじめまして。{田中|たなか}です。', ro: 'Hajimemashite. Tanaka desu.', en: "Nice to meet you. I'm Tanaka.", zh: '初次见面。我是田中。', introduce: true, act: 'bow' },
    { jp: 'この{学校|がっこう}の {先生|せんせい}です。', ro: 'Kono gakkō no sensei desu.', en: "I'm a teacher at this school.", zh: '我是这所学校的老师。' },
    { id: 'ask', jp: 'あなたは？', ro: 'Anata wa?', en: 'And you?', zh: '你呢？',
      choices: [
        { jp: 'はじめまして。よろしく おねがいします。', ro: 'Hajimemashite. Yoroshiku onegaishimasu.', en: 'Nice to meet you. Please treat me well.', zh: '初次见面，请多关照。', next: 'good' },
        { jp: 'さようなら。', ro: 'Sayōnara.', en: 'Goodbye.', zh: '再见。', next: 'bye' },
        { jp: 'ありがとう。', ro: 'Arigatō.', en: 'Thank you.', zh: '谢谢。', next: 'thanks' },
      ] },
    { id: 'bye', jp: 'えっ？ まだ「さようなら」じゃないですよ。', ro: 'E? Mada "sayōnara" ja nai desu yo.', en: 'Huh? It\'s not "goodbye" yet!', zh: '诶？还不是说"再见"的时候哦。', face: 'surprised', next: 'ask' },
    { id: 'thanks', jp: 'ふふ。ここは「はじめまして」ですね。', ro: 'Fufu. Koko wa "hajimemashite" desu ne.', en: 'Heh. Here you\'d say "hajimemashite".', zh: '呵呵。这里应该说"初次见面"哦。', face: 'smile', next: 'ask' },
    { id: 'good', jp: 'はい、よろしく おねがいします！', ro: 'Hai, yoroshiku onegaishimasu!', en: 'Yes, nice to meet you too!', zh: '好的，请多关照！', face: 'smile', act: 'bow' },
    { id: 'class', jp: '{初級|しょきゅう}クラスは あちらです。', ro: 'Shokyū kurasu wa achira desu.', en: 'The beginner class is over there.', zh: '初级班在那边。', act: 'point' },
    { jp: 'がんばってください！', ro: 'Ganbatte kudasai!', en: 'Do your best!', zh: '加油！', face: 'smile', act: 'wave', end: true },
    { id: 'again', by: 'narr', jp: 'チーン♪', ro: 'chīn', en: '(You ring the bell.)', zh: '（你按了铃。）' },
    { jp: 'あ、また {会|あ}いましたね。', ro: 'A, mata aimashita ne.', en: 'Oh, we meet again.', zh: '啊，又见面了。', face: 'smile', act: 'nod', next: 'class' },
  ],
};
addTalkSpot(-20.6, 13.25, 1.4, 'yobu', TANAKA_DAY1, SCH.FL);
