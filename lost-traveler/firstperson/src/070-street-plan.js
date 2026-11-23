// ================================================================ street plan
// Street along Z. Left facades at x=-6 face +X, right facades at x=+6 face -X.
const ROAD = 3.6, WALK = 6, Z_NEAR = 112, Z_FAR = -330;
const WALK_MIN = -232, WALK_MAX = 64;

// sidewalk lanes so props never pile up: wall lane (next to buildings) and curb lane (poles, signs)
const lanes = { '-1wall': [], '1wall': [], '-1curb': [], '1curb': [] };
function claim(side, lane, z0, z1) {
  const L = lanes[side + lane], a = Math.min(z0, z1), b = Math.max(z0, z1);
  for (const [p, q] of L) if (a < q && b > p) return false;
  L.push([a, b]); return true;
}

const hint = {
  school: { ruby: [['日本語', 'にほんご'], ['学校', 'がっこう']], ro: 'nihongo gakkō', en: 'Japanese language school', zh: '日语学校' },
  boshu: { ruby: [['生徒', 'せいと'], ['募集中', 'ぼしゅうちゅう']], ro: 'seito boshū-chū', en: 'Now accepting students', zh: '正在招生' },
  shoten: { ruby: [['さくら', ''], ['書店', 'しょてん']], ro: 'sakura shoten', en: 'Sakura Bookshop', zh: '樱花书店' },
  cafe: { ruby: [['カフェ', '']], ro: 'kafe', en: 'Café', zh: '咖啡店' },
  kuraya: { ruby: [['くらや', '']], ro: 'kuraya', en: 'Kuraya (a shop name)', zh: 'Kuraya（店名）' },
  shika: { ruby: [['さくま', ''], ['歯科', 'しか']], ro: 'sakuma shika', en: 'Sakuma Dental Clinic', zh: '佐久间牙科' },
  eki: { ruby: [['みなと', ''], ['駅', 'えき']], ro: 'minato eki', en: 'Minato Station', zh: '港站（みなと站）' },
  sakurasou: { ruby: [['さくら', ''], ['荘', 'そう']], ro: 'sakura-sō', en: 'Sakura-sō (the guesthouse)', zh: '樱花庄（民宿）' },
  tomare: { ruby: [['止', 'と'], ['まれ', '']], ro: 'tomare', en: 'Stop', zh: '停' },
  osusume: { ruby: [['本日', 'ほんじつ'], ['の', ''], ['おすすめ', '']], ro: 'honjitsu no osusume', en: "Today's recommendation", zh: '今日推荐' },
  churin: { ruby: [['駐輪場', 'ちゅうりんじょう']], ro: 'chūrinjō', en: 'Bicycle parking', zh: '自行车停车场' },
  yakitori: { ruby: [['やきとり', '']], ro: 'yakitori', en: 'Yakitori (grilled chicken on skewers)', zh: '烤鸡肉串' },
  laundry: { ruby: [['コインランドリー', ''], ['24', ''], ['時間', 'じかん']], ro: 'koin randorī nijūyo-jikan', en: 'Coin laundry, open 24 hours', zh: '24小时自助洗衣店' },
  konbini: { ruby: [['コンビニ', ''], ['24', ''], ['時間', 'じかん']], ro: 'konbini nijūyo-jikan', en: 'Convenience store, open 24 hours', zh: '24小时便利店' },
  ramen: { ruby: [['ラーメン', '']], ro: 'rāmen', en: 'Ramen', zh: '拉面' },
  fumikiri: { ruby: [['踏切', 'ふみきり']], ro: 'fumikiri', en: 'Railroad crossing', zh: '铁路道口' },
  chui: { ruby: [['踏切', 'ふみきり'], ['注意', 'ちゅうい']], ro: 'fumikiri chūi', en: 'Caution: railroad crossing', zh: '注意道口' },
  kusuri: { ruby: [['薬', 'くすり']], ro: 'kusuri', en: 'Medicine (pharmacy)', zh: '药（药店）' },
  yu: { ruby: [['ゆ', '']], ro: 'yu', en: 'Hot water (a public bath)', zh: '热水（澡堂）' },
  chusha: { ruby: [['駐車場', 'ちゅうしゃじょう']], ro: 'chūshajō', en: 'Parking lot', zh: '停车场' },
  izakaya: { ruby: [['居酒屋', 'いざかや']], ro: 'izakaya', en: 'Japanese pub', zh: '居酒屋' },
  menu: { ruby: [['メニュー', '']], ro: 'menyū', en: 'Menu: coffee ¥300, café latte ¥380, tea ¥300, juice ¥250', zh: '菜单：咖啡300日元、拿铁380日元、红茶300日元、果汁250日元' },
  hotice: { ruby: [['ホット', ''], ['・', ''], ['アイス', '']], ro: 'hotto / aisu', en: 'Hot / Iced', zh: '热的／冰的' },
  tennai: { ruby: [['店内', 'てんない'], ['・', ''], ['お持', 'おも'], ['ち', ''], ['帰', 'かえ'], ['り', '']], ro: 'tennai / omochikaeri', en: 'For here / To go', zh: '堂食／外带' },
  cake: { ruby: [['ケーキ', '']], ro: 'kēki', en: 'Cake', zh: '蛋糕' },
  reji: { ruby: [['レジ', '']], ro: 'reji', en: 'Cash register (pay here)', zh: '收银台（在这里付款）' },
  otearai: { ruby: [['お', ''], ['手洗', 'てあら'], ['い', '']], ro: 'otearai', en: 'Restroom', zh: '洗手间' },
  irasshai: { ruby: [['いらっしゃいませ', '']], ro: 'irasshaimase', en: 'Welcome! (what shop staff say)', zh: '欢迎光临' },
  omizu: { ruby: [['お', ''], ['水', 'みず'], ['は', ''], ['セルフサービス', '']], ro: 'omizu wa serufu sābisu', en: 'Water is self-service', zh: '饮用水请自助' },
  nagasu: { ruby: [['流', 'なが'], ['す', '']], ro: 'nagasu', en: 'Flush (the toilet)', zh: '冲水' },
  kirei: { ruby: [['いつもきれいにご', ''], ['利用', 'りよう'], ['ありがとうございます', '']], ro: 'itsumo kirei ni go-riyō arigatō gozaimasu', en: 'Thank you for always keeping it clean', zh: '感谢您一直保持清洁' },
  kohi: { ruby: [['コーヒー', '']], ro: 'kōhī', en: 'Coffee', zh: '咖啡' },
  // the school
  tokei: { ruby: [['時計', 'とけい']], ro: 'tokei', en: 'Clock', zh: '钟' },
  kasa: { ruby: [['傘立', 'かさた'], ['て', '']], ro: 'kasatate', en: 'Umbrella stand', zh: '伞架' },
  oshirase: { ruby: [['お', ''], ['知', 'し'], ['らせ', '']], ro: 'oshirase', en: 'Notices', zh: '通知' },
  uwabaki: { ruby: [['上履', 'うわば'], ['きにはきかえてください', '']], ro: 'uwabaki ni hakikaete kudasai', en: 'Please change into indoor shoes', zh: '请换上室内鞋' },
  getabako: { ruby: [['下駄箱', 'げたばこ']], ro: 'getabako', en: 'Shoe lockers', zh: '鞋柜' },
  dosoku: { ruby: [['土足禁止', 'どそくきんし']], ro: 'dosoku kinshi', en: 'No outdoor shoes past this point', zh: '禁止穿鞋入内' },
  uketsuke: { ruby: [['受付', 'うけつけ']], ro: 'uketsuke', en: 'Reception', zh: '接待处' },
  yokoso: { ruby: [['ようこそ', '']], ro: 'yōkoso', en: 'Welcome', zh: '欢迎' },
  shokuin: { ruby: [['職員室', 'しょくいんしつ']], ro: 'shokuin-shitsu', en: "Teachers' room", zh: '教师办公室' },
  tachiiri: { ruby: [['立入禁止', 'たちいりきんし']], ro: 'tachiiri kinshi', en: 'No entry', zh: '禁止入内' },
  rouka: { ruby: [['廊下', 'ろうか'], ['は', ''], ['走', 'はし'], ['らない', '']], ro: 'rōka wa hashiranai', en: 'No running in the hallway', zh: '走廊里不要奔跑' },
  speech: { ruby: [['スピーチ', ''], ['大会', 'たいかい']], ro: 'supīchi taikai', en: 'Speech contest', zh: '演讲比赛' },
  shokaki: { ruby: [['消火器', 'しょうかき']], ro: 'shōkaki', en: 'Fire extinguisher', zh: '灭火器' },
  hijo: { ruby: [['非常口', 'ひじょうぐち']], ro: 'hijōguchi', en: 'Emergency exit', zh: '紧急出口' },
  shokyu: { ruby: [['初級', 'しょきゅう'], ['クラス', '']], ro: 'shokyū kurasu', en: 'Beginner class', zh: '初级班' },
  kudasai: { ruby: [['〜を', ''], ['ください', '']], ro: '~ o kudasai', en: '~, please (when asking for something)', zh: '请给我～' },
  sakura: { ruby: [['さくら', '']], ro: 'sakura', en: "Cherry blossom: today's three letters, さ・く・ら", zh: '樱花：今天学的三个字 さ・く・ら' },
  hiragana: { ruby: [['ひらがな', '']], ro: 'hiragana', en: 'The hiragana chart', zh: '平假名表' },
  jikanwari: { ruby: [['時間割', 'じかんわり']], ro: 'jikanwari', en: 'Class timetable', zh: '课程表' },
  mokuhyo: { ruby: [['毎日', 'まいにち'], ['すこしずつ', '']], ro: 'mainichi sukoshi zutsu', en: 'A little every day (the class motto)', zh: '每天一点点（班级口号）' },
  // the station
  higashi: { ruby: [['東口', 'ひがしぐち']], ro: 'higashi-guchi', en: 'East exit', zh: '东口' },
  kippu: { ruby: [['きっぷうりば', '']], ro: 'kippu uriba', en: 'Ticket machines (buy tickets here)', zh: '售票处' },
  unchin: { ruby: [['運賃表', 'うんちんひょう']], ro: 'unchin-hyō', en: 'Fare chart: what a ticket to each station costs', zh: '票价表' },
  kaisatsu: { ruby: [['改札', 'かいさつ']], ro: 'kaisatsu', en: 'Ticket gates', zh: '检票口' },
  madoguchi: { ruby: [['窓口', 'まどぐち']], ro: 'madoguchi', en: 'Ticket office window (ask the staff here)', zh: '人工窗口（可以问工作人员）' },
  jikoku: { ruby: [['時刻表', 'じこくひょう']], ro: 'jikokuhyō', en: 'Timetable', zh: '时刻表' },
  locker: { ruby: [['コインロッカー', '']], ro: 'koin rokkā', en: 'Coin lockers', zh: '投币储物柜' },
  noriba: { ruby: [['1', ''], ['番線', 'ばんせん'], ['のりば', '']], ro: 'ichi-ban-sen noriba', en: 'Platform 1: get on the train here', zh: '1号站台 乘车处' },
  bansen: { ruby: [['1', ''], ['番線', 'ばんせん']], ro: 'ichi-ban-sen', en: 'Track 1', zh: '1号线（站台）' },
  deguchi: { ruby: [['出口', 'でぐち']], ro: 'deguchi', en: 'Exit', zh: '出口' },
  hassha: { ruby: [['次', 'つぎ'], ['の', ''], ['電車', 'でんしゃ']], ro: 'tsugi no densha', en: 'Next train: local, bound for Sakuramachi', zh: '下一班车：开往樱町的普通车' },
  ekimei: { ruby: [['みなと', '']], ro: 'minato', en: 'Station name board: Minato. Next stations: Umibe (←) and Sakuramachi (→)', zh: '站名牌：みなと。相邻的站：うみべ（←）和さくらまち（→）' },
  kiiro: { ruby: [['黄色', 'きいろ'], ['い', ''], ['線', 'せん'], ['の', ''], ['内側', 'うちがわ'], ['でお', ''], ['待', 'ま'], ['ちください', '']], ro: 'kiiroi sen no uchigawa de omachi kudasai', en: 'Please wait behind the yellow line', zh: '请在黄线内侧等候' },
  densha: { ruby: [['普通', 'ふつう'], ['　さくらまち', ''], ['行', 'ゆ'], ['き', '']], ro: 'futsū sakuramachi-yuki', en: 'Local train bound for Sakuramachi', zh: '开往樱町的普通列车' },
  tsugi: { ruby: [['つぎは', ''], ['　さくらまち', '']], ro: 'tsugi wa sakuramachi', en: 'Next stop: Sakuramachi', zh: '下一站：樱町' },
  yusen: { ruby: [['優先席', 'ゆうせんせき']], ro: 'yūsen-seki', en: 'Priority seats (give them to older, pregnant or injured people)', zh: '优先座位（请让给老人、孕妇和伤病者）' },
};

