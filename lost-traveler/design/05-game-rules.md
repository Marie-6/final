# Lost Traveler: Game Rules

Nov 20, 2026 · @Marie

Rules, characters and style for the whole game. Each day has its own doc that says which features are switched on that day.

## Game rules

1. **Actions move time, not a clock.** Each day has three parts: morning (朝, asa), afternoon (昼, hiru) and evening (夜, yoru). Time moves forward when the player finishes that part's main task. Nothing in the game counts down.
2. **One main task per part of the day.** Main tasks move the story and must be done before the player can sleep.
3. **Daily tasks are optional.** They appear in the notebook as 今日のやること (kyō no yaru koto, today's to-do), refresh every day, and pay yen and confidence.
4. **The world opens through the story, visibly.** Closed places look closed: a shutter down, a station gate that needs a ticket.
5. **The world teaches through time.** Greetings change with the time of day, and NPCs gently correct the wrong one.
6. **Sleeping ends the day.** After the evening main task, the player can explore until they choose to sleep. Sleeping saves the game and opens the diary, which only uses words already in the notebook.
7. **Hidden discoveries.** A day can hide something small to find by exploring, which adds a bonus word to the notebook.
8. **Lessons are skippable.** Confident players can skip a prep lesson. A day can make its lesson required.

## Help language: English or Chinese

At the start, the player picks English or Chinese as their help language. The story, places and Japanese lines are the same for everyone. What changes is how the game helps, because the two groups start from different places: English speakers can't read kanji at all, while Chinese speakers already understand most kanji meanings but not their Japanese sounds.

| | English track | Chinese track |
| --- | --- | --- |
| Hints and translations | In English | In Chinese (Simplified or Traditional) |
| Main challenge | Reading: kana and kanji look completely new | Japanese readings of kanji, particles, verb endings |
| Reading support | Romaji first, fading out as hiragana is learned. Kanji always with furigana. | No romaji at all. Kana from the start, kanji always with furigana for the sound. |
| Lesson focus | Kana, basic kanji, word order, particles | Kanji readings, grammar, false friends |
| Pace | Slower start, more reading practice | Faster through reading, more grammar and speaking |
| Extra feature | None | False friend alerts |

**Kanji always comes with its reading.** On both tracks, every kanji on screen has furigana (small hiragana above it). Romaji appears only on the English track, and the Chinese track never shows it.

**Same moment, two tracks.** The konbini clerk asks 温めますか？ (atatamemasu ka?).

- **English hint:** "Would you like it heated up?", with あたた as furigana above 温 and romaji under the line.
- **Chinese hint:** 需要加热吗？, with あたた as furigana above 温 and no romaji. A note explains that 温 means "to warm," as in Chinese, but is read あたた in Japanese.

**Hints on request (both tracks).** A ヒント (hint) button is always available in conversations. Each tap gives a little more help, so players only take what they need:

1. **First tap:** the meaning of what the character just said, in the help language.
2. **Second tap:** the key word explained, with its reading.
3. **Third tap:** the answer pattern, such as ___をください.

Hints are always free. Answering without them earns a small bonus, and any word the player needed a hint for comes back sooner for review in the notebook, so it sticks faster.

**False friend alerts (Chinese track):** some words are written the same but mean different things, and the game flags them when they first appear.

| Word | Japanese meaning | Chinese meaning |
| --- | --- | --- |
| 先生 | teacher | Mr., husband |
| 大丈夫 | it's okay, no thanks | a real man |
| 手紙 | letter | toilet paper (手纸) |
| 勉強 | to study | reluctant (勉强) |
| 汽車 | steam train | car (汽车) |
| 床 | floor | bed |

Both tracks share one big challenge: Japanese puts the verb at the end of the sentence, so both are taught this before the first quest.

## Characters

| Character | Role | Personality | Speaks |
| --- | --- | --- | --- |
| 田中先生 (Tanaka-sensei) | Teacher and guide, an older man | Warm, a little bossy, loves coffee | Slow, polite Japanese with lots of repetition |
| 佐藤さん (Satō-san) | Guesthouse owner, home base | Kind grandmother type, gives small chores that become daily tasks | Friendly, uses ね and よ a lot |
| 店員さん (café staff) | First shop clerk | Cheerful, patient with mistakes | Standard shop Japanese (いらっしゃいませ) |
| ねこ (the cat) | Hidden discovery behind the café | Sleeps on a wall, only appears in the evening | にゃー (nyā) |
| Narrator | Voice for signs, objects and lessons, not a person in the world | Calm and clear | Reads Japanese words and lesson phrases |

**The player** is a new student enrolled at the language school. Their bag, with their phone and the school's address, goes missing on the train, so they can't reach Tanaka-sensei, who was meant to meet them at the station. Any learner can imagine themselves in the role.

## Voices

Voices and the voice rules are in [voices.md](voices.md).

## Look and mood by time of day

The city should feel alive without being a full open world. Lighting and street life change with each part of the day.

| Time | Lighting | Street life | Sound |
| --- | --- | --- | --- |
| 朝 Morning | Soft, pale blue light, long shadows | Commuters walking to the station, a shopkeeper sweeping | Birds, station announcements |
| 昼 Afternoon | Bright, warm sun | Shoppers, a kid on a bike, the café busy | Street chatter, a train passing overhead |
| 夜 Evening | Orange sunset turning to blue night; signs, lanterns and vending machines glow | Fewer people | Quiet, distant train, the vending machine hum |

Visual upgrades, in order of impact: time-of-day lighting, glowing signs at night, people and bicycles moving on the street, and a train crossing an elevated track.

## Art direction: anime cel-shaded

The game uses a bright anime cel-shaded style, in the spirit of *Genshin Impact*, *Persona* and the towns in Studio Ghibli films. It fits a Japan-themed game, and its clean shapes keep signs and text easy to read.

- **Readability first:** Japanese text on signs and menus must always be easy to read, at every time of day.
- **Shading:** toon shading with two or three tone steps and soft outlines, not realistic shading.
- **Colors:** bright and warm, never neon-harsh. Key colors are sky blue, sakura pink, warm wood brown, and the signature colors of shop signs.
- **Characters:** anime proportions (not chibi), with expressive faces. Each NPC has at least four expressions: neutral, happy, confused and surprised, used by the manga reactions.
- **Animation:** natural movement for walking, idling, waving, bowing and talking, plus small idle loops so nobody stands frozen.
- **Environment:** a real Tokyo-style street full of everyday clutter: shop signs, power lines, bicycles, potted plants, noren curtains and vending machines.
- **Polish:** color grading for each time of day, bloom on glowing signs at night, soft depth of field during conversations, and ambient city sound.

**Scope:** build one street at full quality first (the station, the café, the school and さくら荘), playing all of Day 1. This vertical slice shows exactly how the finished game will look.

**Tools:**

| Need | Tool |
| --- | --- |
| Engine and toon shading | Unity (URP) |
| Anime characters, including player customization | VRoid Studio (free) |
| Character animations | Mixamo (free) |
| City buildings and props | A Japanese street asset pack, restyled with the toon shader |

## Interaction design

Every interaction gives clear feedback and helps the player learn. One rule ties them together: **every reaction is fast and skippable,** so nothing makes the player wait, even after their tenth conversation.

1. **Conversation camera.** When a conversation starts, the camera eases in to frame the player and the NPC, and the rest of the screen dims slightly. When it ends, the camera pulls back. This signals focus mode without a menu popping up.
2. **Manga reactions.** NPCs react above their heads: ? when confused, a sweat drop 💧 after a funny mistake, ✨ for a right answer, ♪ when happy. These show how an answer landed without any "wrong" screen.
3. **Live microphone feedback.** While the player holds the speak button, a volume bar moves with their voice. The words the game hears appear as they talk, and words that match the answer turn green. If nothing matches, the closest option glows softly as a hint.
4. **Tappable signs.** Any sign in the world can be tapped to show its furigana, its meaning in the help language, and a button to save it to the notebook. Saved signs count as collectibles, so there is always something to read on a walk.
5. **The notebook (手帳, techō).** The player's phone is lost, so every menu lives in a handwritten notebook: today's to-do, words, the stamp book, saved signs, and a hand-drawn map that fills in as new places are visited.
6. **Satisfying feedback.** Stamps land with a "pon" sound, coins fly to the yen counter, and new words float into the notebook. Small, quick, and never in the way.

## Game-wide decisions

1. **Why is the player in Tokyo?**
   - **Decided:** a new student at the language school who lost their bag on the way. This ties together the school, the guesthouse, and the airport ending (flying home after the course).
2. **Does the guesthouse cost money?**
   - **Decided:** free in exchange for small chores from Satō-san, which become daily tasks.
3. **Is Tanaka-sensei a man or a woman?**
   - **Decided (Nov 20):** a man. His voice is Haruto, a slow, deep, older man's voice, which suits a patient teacher. The earlier drafts called Tanaka "she"; they now say "he."
4. **How should the player character look?** Options: fixed character, or simple customization.
   - My pick: simple customization (name plus 3 or 4 looks), so every learner can see themselves. Still open.
