# Lost Traveler: Project Notes

## Concept

Lost Traveler is a 3D exploration game that teaches beginner Japanese through everyday situations in a Tokyo-style city. The player wakes up in Tokyo with no phone and no wallet, and must learn enough Japanese to order food, buy things, ride the subway and make friends, then reach the airport to get home.

**Pitch:** a Japanese learning game that adapts to what you already know. Learners pick English or Chinese as their help language, and the game teaches each group differently.

**Why it is different:** most language apps are drills on a screen. Here, every word is learned for a reason, used in a real situation, and rewarded with something useful in the game world.

## Target learners

The game is for complete beginners in Japanese who speak English or Chinese. At the start, players choose their help language; all hints, lessons and translations then appear in it. Chinese speakers can pick Simplified or Traditional characters.

| Feature | English track | Chinese track |
| --- | --- | --- |
| Main challenge | Reading: kana and kanji look completely new | Kanji readings, particles, verb endings, false friends |
| Reading support | Romaji, then hiragana, then kanji with furigana | Kanji shown early, with furigana for pronunciation |
| Classroom focus | Kana, basic kanji, word order, particles | Japanese readings of kanji, grammar, false friends |
| Pace | Slower start, more reading practice | Faster through reading, more grammar and speaking |

Both groups share one big challenge: Japanese puts the verb at the end of the sentence. The classroom teaches this before the first quest.

**False Friend alerts (Chinese track):** some words look the same in both languages but mean different things. The game flags them with a short, funny scene.

| Word | Japanese meaning | Chinese meaning |
| --- | --- | --- |
| 手紙 | letter | toilet paper (手纸) |
| 勉強 | to study | reluctant (勉强) |
| 汽車 | steam train | car (汽车) |
| 大丈夫 | it's okay | a real man |
| 床 | floor | bed |
| 先生 | teacher | Mr., husband |

## City map

The city has seven districts on one subway line, in learning order. Each station unlocks after its lesson, so the player's route across the map is the curriculum. See `03-city-map.svg`.

1. **日本語学校 (language school): home base.** A small school with a cherry tree and a chalkboard in the window. The player saves and takes lessons here.
   - Phrases: はじめまして (hajimemashite), 〜です (desu)
2. **カフェ (café): ordering a drink.** A narrow corner café with a chalkboard menu. Short, predictable conversation, so it is the tutorial quest.
   - Phrases: 〜をください (o kudasai), 店内で / 持ち帰りで (tennai de / mochikaeri de)
3. **コンビニ (convenience store): buying things.** Bright sign, onigiri and drinks on the shelves, a microwave behind the counter.
   - Phrases: いくらですか (ikura desu ka), 袋いりますか (fukuro irimasu ka), 温めますか (atatamemasu ka)
4. **ラーメン屋 (ramen shop): ordering a meal.** Red lanterns, a noren curtain, and a ticket machine just inside the door.
   - Phrases: 何名様ですか (nanmei-sama desu ka), お会計お願いします (okaikei onegaishimasu)
5. **地下鉄ハブ (subway hub): directions.** Colored line signs, ticket gates, exit numbers and a platform board. The hardest district.
   - Phrases: 〜駅はどこですか (eki wa doko desu ka), 乗り換え (norikae), 出口 (deguchi)
6. **公園 (park): small talk.** Benches, a pond, a vending machine, and locals walking dogs. Friends made here give hints elsewhere.
   - Phrases: いい天気ですね (ii tenki desu ne), どこから来ましたか (doko kara kimashita ka)
7. **空港 (airport): final exam.** The player buys a snack, asks the way to the gate and chats while waiting, using everything learned.

## Classroom loop

The school supports the adventure instead of blocking it: learn in class, use it in the city, review in class. Early in the story, a friendly teacher finds the lost player and offers a free spot in his evening class.

1. **Prep lesson (3 to 5 minutes):** teaches exactly what the next district needs, such as drink words and 〜をください before the café. Confident players can skip it.
2. **Quest:** the player uses the new words in the district.
3. **Review lesson:** the teacher goes over the mistakes the player actually made and explains why.

Grammar is always taught through a situation the player has just lived, such as past tense after the park chat (〜ました).

Inside the classroom:

- **Blackboard:** short visual grammar explanations with examples from the game world.
- **Word wall:** all collected vocabulary, sorted by topic (food, transport, numbers, feelings).
- **Practice desk:** quick mini-games to review words that are fading from memory.
- **Classmates:** NPC students for safe conversation practice before trying it in the city.

## Getting around

Players walk between districts until they pass the subway quest, which unlocks fast travel by train. Learning directions is rewarded with something genuinely useful in the game.

- **Before the subway quest:** all districts are connected by streets in the 3D world. Walking is slow but lets players explore, read street signs and find hidden gacha machines.
- **After the subway quest:** every district has a working station. The player reads the line map, picks a platform and listens for the stop announcement (次は〜です, tsugi wa ... desu).
- **Mistakes are safe:** taking the wrong train is not a failure. It drops the player at another station, where they can try again or explore.
- **The map is the same in both views:** the subway line on the city map matches the real tracks in the 3D world.

## Daily routine

The city works as a hub world with a daily routine, like *Stardew Valley* or *Persona*: it feels open and alive, but each day gives the player a few clear things to do. Only a few tasks are required, so the routine never turns into chores.

1. **Actions move time, not a clock.** Each day has three parts: morning (朝, asa), afternoon (昼, hiru) and evening (夜, yoru). Time moves forward when the player finishes that part's main task, so there are still no timers.
2. **One main task per part of the day.** Main tasks move the story and must be done before the player can sleep.
3. **Daily tasks are optional.** They appear in the notebook as 今日のやること (kyō no yaru koto, today's to-do), refresh every day, and pay yen and confidence. Skipping them costs nothing.
4. **The world opens through the story, visibly.** There are no invisible walls: the konbini has its shutter down, the station gates need a ticket. Players always understand why a place is closed.
5. **The world teaches through time.** Greetings change with the time of day: おはようございます (ohayō gozaimasu) in the morning, こんにちは (konnichiwa) in the afternoon, こんばんは (konbanwa) in the evening. NPCs gently correct the wrong one.
6. **Sleeping ends the day.** It saves the game and opens the diary, a short review of what the player learned that day.
7. **One hidden discovery per day.** Something small to find by exploring, such as a sleeping cat, adds a bonus word to the notebook.

## Day 1: 迷子 (Lost)

Day 1 introduces さくら荘 (Sakura-sō), a small guesthouse run by 佐藤さん (Satō-san), an older woman who is Tanaka-sensei's friend. It becomes the player's home and save point.

| Time | Main task | What the player learns |
| --- | --- | --- |
| 朝 Morning | Wake up on the bench. Meet Tanaka-sensei, introduce yourself, receive ¥500. | 大丈夫ですか, はじめまして, 〜です |
| 昼 Afternoon | Take the first lesson, then order a drink at the café. | 〜をください, drinks, ホット / アイス, prices |
| 夜 Evening | Tanaka gives a card with the guesthouse name in hiragana, さくら. Find the sign on the street, then check in with Satō-san. | Reading hiragana in the real world, reusing はじめまして |
| Bedtime | Say おやすみなさい (oyasuminasai, good night) to Satō-san, write the diary, and sleep. | おやすみなさい |

**The evening task is the first real reading test.** Finding さくら among real-looking signs is the player's first time reading Japanese in the world, not in a lesson. The afternoon lesson teaches the three hiragana さ, く and ら (the kanji 荘 appears with small hiragana above it), so the player is ready.

**Day 1 daily tasks (optional):**

- **Greet 3 neighbors** with the right greeting for the time of day. Saying こんにちは at night gets a friendly correction: もう こんばんは ですよ (It's already evening!).
- **Buy a drink from a vending machine,** reading the red あったか〜い and blue つめた〜い labels.
- **Find the gachapon** near the station and spin once.

**Hidden discovery:** a cat sleeping on a wall behind the café. Tapping it adds ねこ (neko, cat) to the notebook.

**The diary:** at bedtime, the diary shows three sentences about the day with one word missing, and the player picks the right word from the notebook. For example: 今日、カフェで ___ をのみました (Today, I drank ___ at the café). It works as a quick review that feels like a memory, not a test.

**Hook for Day 2:** Satō-san asks the player to buy breakfast at the konbini in the morning, when its shutter goes up. This gives players a reason to start the next day.

## Gacha system

Gachapon machines stand in every district and are paid for only with yen earned by learning, never with real money. This keeps the system a reward for practice, not gambling.

**Earning coins:** finishing quests and lessons, scoring well on the confidence meter, and reviewing fading words in the notebook.

**Using the machine is a mini lesson:** the player reads the instructions on it, such as 100円を入れて、回してください (insert 100 yen and turn).

**What the capsules hold:** each district's machine has prizes themed to that place, such as food charms at the ramen shop and train badges at the subway hub.

- **Outfits and accessories:** a yukata, a station staff cap, a cat-ear hoodie. Pure fun.
- **Phrase cards:** useful polite expressions or slang not in the main lessons, such as すみません to call a waiter.
- **Culture cards:** small customs, such as not eating while walking, or how to bow.
- **Golden capsules (rare):** unlock a secret NPC or a hidden side quest.
- **Capsule album:** prizes are collected by district, so completing a set is a long-term goal.

## Vending machines

自動販売機 (jidō hanbaiki, vending machines) stand on streets and in every district, and their drinks give short boosts paid for with earned yen. Energy is never a hard limit: running low only slows walking, so players can always keep learning.

**Reading the machine is the lesson:** players read drink names on the buttons and the temperature labels, just like in real Japan.

- **あったか〜い (attaka~i), red label:** hot drink
- **つめた〜い (tsumeta~i), blue label:** cold drink

| Drink | Japanese | Boost |
| --- | --- | --- |
| Water | 水 (mizu) | Restores walking stamina |
| Green tea | お茶 (ocha) | Hints stay visible longer in the next quest |
| Canned coffee | コーヒー (kōhī) | Faster walking for a few minutes |
| Sports drink | スポーツドリンク (supōtsu dorinku) | Extra stamina for long walks before the subway unlocks |
| Seasonal special | 期間限定 (kikan gentei, limited time) | Rare boost, such as double gacha coins for one quest |

The seasonal drink changes with the in-game season, which teaches season words and gives players a reason to check machines in new places.

## Rewards and consequences

Rewards pull players forward; consequences cost a little time but never take anything away. Players never lose coins, items or progress, because fear of losing things stops beginners from trying to speak.

**Rewards**

| Player does | Reward |
| --- | --- |
| Finishes a quest | Yen coins, new words in the notebook, next station unlocked |
| Finishes a quest without hints | Bonus yen and a bigger jump on the confidence meter |
| Clears a district | 駅スタンプ (eki stamp) in the stamp book, like real Japanese station stamps |
| Passes the subway quest | Fast travel by train |
| Reviews fading words | Yen coins, words in the notebook turn back to full color |
| Chats with park locals | Friendship points; friends give hints and secret side quests |
| Plays on several days | Gentle streak with free rest days, so missing a day never resets it |

**Consequences (soft, and always teaching)**

| Mistake | What happens | What it teaches |
| --- | --- | --- |
| Wrong answer to a clerk | A funny result, like ten coffees arriving | The difference between similar words |
| Not understanding someone | The NPC repeats more slowly after もう一度お願いします (mō ichido onegaishimasu) | How to ask someone to repeat |
| Wrong train | Dropped at another station to explore or ride back | Reading line maps and announcements |
| Two failures in a row | The quest retries with more hints | Nobody gets stuck |
| Unused words | Words wilt in the notebook | When to review |
| Any mistake | Logged for the teacher's review lesson | Why it was wrong |

The game never uses lives, game over screens or countdown timers for beginners.

## Beginner support systems

Five systems help beginners improve without feeling tested.

- **Fading hints:** key words first show pictures or translations. As the player uses a word, its hint disappears, building real understanding.
- **Reading layers (Japanese text):** romaji first, then hiragana as romaji fades, then kanji with small hiragana above (furigana). Each layer unlocks with progress.
- **Travel notebook:** every new word is saved with the place it was learned. The game brings back words the player has not used in a while (spaced repetition).
- **Soft mistakes:** wrong answers cause funny but harmless results, like ordering ten coffees instead of one. This lowers the fear of embarrassment.
- **Confidence meter:** fills as the player handles situations alone, showing growth instead of a test score.

After the story ends, a Daily Life Mode adds random everyday situations each day to keep players practicing.

## Speaking with the microphone

Speaking is harder than reading or listening, so it is the main way players answer in quests, using the computer's microphone. Tapping answer choices stays available as a backup, for noisy places or players who are not ready yet.

**How it works:** the player holds a push-to-talk key (such as the spacebar) and speaks. Speech recognition turns the voice into text, and the game checks the meaning, not perfect wording. At the café, コーヒーをください, コーヒーください and コーヒーひとつ are all accepted.

| Level | Where | What the player does |
| --- | --- | --- |
| 1. Repeat | Classroom | Listen to the teacher and repeat the phrase (shadowing) |
| 2. Choose and say | Café, konbini | Pick an answer from the options, then say it aloud |
| 3. Answer freely | Ramen shop, subway | Answer questions in their own words, with hints if stuck |
| 4. Free conversation | Park, airport | Hold a short small-talk chat with no options shown |

**Feedback on Japanese trouble spots:**

- **Long vowels:** おばさん (obasan, aunt) vs おばあさん (obāsan, grandmother)
- **Small っ (double consonant):** きて (kite, come) vs きって (kitte, stamp)
- **Particles:** を, に and で in the right places

**Karaoke booth (classroom):** a カラオケ room with original in-game songs, where players sing along to practice rhythm and pronunciation.

**Helping nervous speakers:** NPCs are patient, with no timers. Players can retry as many times as they like, and speaking answers earn more yen and confidence than tapping.

**Character voices:** spoken lines use Inworld text-to-speech, with one voice per character (Tanaka-sensei: Haruto, café staff: Asuka) and a narrator voice (Jason) for signs, objects and lessons. See [voices.md](voices.md).

**Tech note:** speech recognition can use the browser's Web Speech API or an open model such as Whisper, both of which support Japanese. The game asks for microphone permission first and does not save recordings.

## Three sketches to draw

1. **City map:** the seven districts along one subway line, from the school to the airport. Add a small landmark for each district and a gacha icon at each station.
2. **Konbini quest scene:** the clerk asks 温めますか (atatamemasu ka), with three answer choices, a fading hint bubble, the confidence meter and a gacha machine by the door.
3. **Subway hub scene:** the player at the ticket gates, a colored line map, an exit sign (出口), and an announcement bubble saying the next stop.

Optional fourth sketch: the classroom, with the blackboard, word wall and classmates.
