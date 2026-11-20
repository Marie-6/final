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

Spoken lines use Inworld text-to-speech (model `inworld-tts-2`). Each speaker keeps one voice for the whole game, so players can tell who is talking by sound alone.

| Speaker | Inworld voice | Why this voice | Speed |
| --- | --- | --- | --- |
| 田中先生 (Tanaka-sensei) | Haruto | Slow, deep, older man: fits a patient teacher | Normal |
| 店員さん (café staff) | Asuka | Friendly, energetic young woman: fits いらっしゃいませ, and sounds clearly different from Tanaka | Normal |
| Narrator: signs, objects such as the vending machine, and the class lesson's 🔊 Listen buttons | Jason | Clear, multilingual voice that reads like a guide, not a character | Normal; 0.8x in the class lesson so learners can follow |
| 佐藤さん (Satō-san), the cat | Not chosen yet | | |

**Voice rules:**

1. **Characters speak in their own voice.** A new character gets its own voice before it gets lines.
2. **Teaching is slower.** Anything said to teach a phrase (the lesson's 🔊 buttons) plays at 0.8x. Conversations play at normal speed, like real life.
3. **There is always a voice.** If a speaker has no voice set, the API key is missing, or a request fails, the computer's built-in Japanese voice reads the line instead.
4. **The API key stays private.** It lives in `prototype/key.js` on the developer's computer, which is never uploaded to GitHub.

## Look and mood by time of day

The city should feel alive without being a full open world. Lighting and street life change with each part of the day.

| Time | Lighting | Street life | Sound |
| --- | --- | --- | --- |
| 朝 Morning | Soft, pale blue light, long shadows | Commuters walking to the station, a shopkeeper sweeping | Birds, station announcements |
| 昼 Afternoon | Bright, warm sun | Shoppers, a kid on a bike, the café busy | Street chatter, a train passing overhead |
| 夜 Evening | Orange sunset turning to blue night; signs, lanterns and vending machines glow | Fewer people | Quiet, distant train, the vending machine hum |

Visual upgrades, in order of impact: time-of-day lighting, glowing signs at night, people and bicycles moving on the street, and a train crossing an elevated track.

## Game-wide decisions

1. **Why is the player in Tokyo?**
   - **Decided:** a new student at the language school who lost their bag on the way. This ties together the school, the guesthouse, and the airport ending (flying home after the course).
2. **Does the guesthouse cost money?**
   - **Decided:** free in exchange for small chores from Satō-san, which become daily tasks.
3. **Is Tanaka-sensei a man or a woman?**
   - **Decided (Nov 20):** a man. His voice is Haruto, a slow, deep, older man's voice, which suits a patient teacher. The earlier drafts called Tanaka "she"; they now say "he."
4. **How should the player character look?** Options: fixed character, or simple customization.
   - My pick: simple customization (name plus 3 or 4 looks), so every learner can see themselves. Still open.
