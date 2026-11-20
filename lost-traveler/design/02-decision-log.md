# Decision Log

How the project got from "I'm out of ideas" to a playable prototype. Each entry records what was decided, what else was on the table, and why. Use this to explain your design process.

## 1. Find the problem through a hobby

- **Decided:** start from personal interests and look for a frustration inside them.
- **Considered:** gaming, music, cooking, fitness, reading, pets.
- **Why:** a frustration you know personally becomes a real problem worth solving, and your hobby makes you the expert.

## 2. Language learning over dance

- **Explored:** a lyrics-based language coach, a mirror-mode dance trainer, and a "learn words through movement" mix of both.
- **Research finding:** AI conversation tutors and camera-based dance scoring are both crowded markets with big companies in them.
- **Decided:** language learning, built as a game.
- **Why:** the strongest projects either serve an ignored group, combine two worlds in a surprising way, or teach the culture and not just the skill. A story game can do all three.

## 3. A real game, not an app

- **Explored:** a translation party game, a body-controlled rhythm runner, an AR word hunt, then 2D/3D concepts (Echo Tongue, Groove Grove, Shadow Steps).
- **Decided:** an interactive 2D or 3D game.
- **Why:** you wanted something to *play*, not a utility.

## 4. Built for beginners

- **Explored:** Little Shop (life sim), Word Garden (spaced-repetition garden), Lost Traveler (3D adventure).
- **Decided:** Lost Traveler.
- **Why:** real situations build real confidence, and the "lost in a city" story gives every word a reason to be learned.

## 5. Everyday situations as districts

- **Decided:** each district is one daily situation: ordering a drink, buying things, ordering a meal, reading subway directions, small talk.
- **Why:** these are the exact moments where beginners freeze in real life.

## 6. A classroom, but not as a gate

- **Your idea:** a classroom for grammar and vocabulary.
- **Pushback:** making it the mandatory first step turns the game into school, and players quit before the fun part.
- **Decided:** the school is a district inside the city. Short, skippable prep lessons before a quest, and review lessons after it that use the player's real mistakes.
- **Why:** learn, use, review is how good language teaching works.

## 7. Japanese only, with English or Chinese help

- **Explored:** an English city and a Japanese city.
- **Decided:** one Tokyo-style city, with English or Chinese as the help language.
- **Why:** two full cities is too much scope. Splitting by help language is also a sharper idea: Chinese speakers already read kanji meanings but trip on readings, grammar and false friends, while English speakers struggle with reading first. Few apps teach these groups differently.

## 8. The map is the curriculum

- **Decided:** seven districts on one subway line, unlocked in learning order: school, café, konbini, ramen shop, subway hub, park, airport.
- **Why:** players can see their progress as a route across the city.

## 9. Gacha with earned yen only

- **Your idea:** gacha machines for special items.
- **Pushback:** paid gacha is gambling, and random prizes can pull players away from learning.
- **Decided:** gachapon paid only with yen earned by learning, and every capsule carries a phrase, culture card, or fun item.
- **Why:** it is authentic to Japan and turns motivation into practice.

## 10. Walk first, fast travel later

- **Decided:** players walk between districts until they pass the subway quest, which unlocks fast travel.
- **Why:** learning directions is rewarded with something actually useful.

## 11. Vending machines as boosts, not gates

- **Your idea:** drink machines for energy.
- **Pushback:** an energy limit that stops play is a mobile-game trick, and it stops learners from practicing.
- **Decided:** drinks give short boosts; running low only slows walking. Reading the hot (red) and cold (blue) labels is the lesson.

## 12. Rewards pull, consequences teach

- **Decided:** no lives, no game over, no timers, nothing taken away. Mistakes cost a little time and always teach something (funny wrong orders, NPCs repeating slowly, wrong-train detours, extra hints after two failures).
- **Why:** fear of losing things stops beginners from speaking.

## 13. Speaking is the main input

- **Your idea:** use the computer microphone, because speaking is harder than reading and listening.
- **Decided:** push-to-talk answers are the default, tapping is the backup. Answers are checked for meaning, not exact wording, with unlimited retries.
- **Why:** speech recognition sometimes mishears beginners, so players should never be punished for the software's mistakes.

## 14. Build one slice first, in simple 3D

- **Decided:** a playable Day 1 slice (bench, Tanaka-sensei, lesson, café) before building more.
- **Considered:** 2D (faster, recommended) vs simple 3D (closer to the vision).
- **Your choice:** simple 3D.
- **Why a slice:** test the core loop (learn, use, get rewarded) before investing in six more districts.

## 15. A voice for every character

- **First try:** ElevenLabs, with the British "Daniel" voice for Tanaka-sensei.
- **Decided:** Inworld text-to-speech (`inworld-tts-2`), which has native Japanese voices: Haruto for Tanaka-sensei, Asuka for the café staff, and Jason as the narrator for signs, objects and the class lesson.
- **Why:** a native Japanese voice teaches better pronunciation than an English voice reading Japanese, and giving each speaker a different voice (old man, young woman, narrator) lets players tell them apart by sound.
- **Also decided:** Tanaka-sensei is now a man, to match his voice. Lesson phrases play at 0.8x so learners can follow; conversations stay at normal speed.
- **Safety:** the API key lives in a private `key.js` that never goes to GitHub, and the built-in voice takes over if anything fails.
