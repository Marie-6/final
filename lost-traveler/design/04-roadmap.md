# Roadmap

Ordered by priority. Each task has a "done when" check so you know when to move on. Phases 0 and 1 are what your assignment needs; everything after is how the full game gets built.

## Phase 0: Assignment deliverables

| Task | Done when |
| --- | --- |
| Draw sketch 1: city map | All seven districts on the subway line, each with a landmark and a gacha icon |
| Draw sketch 2: konbini quest scene | Shows the 温めますか question, three answers, a blurred hint, the confidence meter, a gachapon |
| Draw sketch 3: subway hub scene | Shows ticket gates, a colored line map, an 出口 sign, an announcement bubble |
| Write the project summary | Uses `01-project-notes.md` (concept, learners, map, systems) and `02-decision-log.md` (process) |
| Record a 1-minute demo of the prototype | Shows meeting Tanaka, one spoken answer, one soft mistake, and the café stamp |

## Phase 1: Playtest Day 1 and fix

Run the prototype with 3 to 5 people (ideally one English speaker and one Chinese speaker who are both new to Japanese). Watch without helping, then ask:

1. Where did you get stuck or confused?
2. Did speaking feel scary, fun, or broken?
3. Could you hear the price at the till? Did you guess or listen?
4. What do you remember now? (Test 3 words from the notebook.)

| Task | Done when |
| --- | --- |
| Fix the top 3 confusing moments | Two new testers get through Day 1 without asking for help |
| Tune speech matching | Every phrase in Day 1 is accepted when said naturally by 3 different voices |
| Add a "Can you repeat that?" button (もう一度お願いします) | The NPC repeats the line more slowly when pressed or when the phrase is spoken |
| Add saving | Closing and reopening the page keeps yen, words, and progress |

## Phase 2: The konbini district

| Task | Done when |
| --- | --- |
| Build the konbini building and clerk | Player can walk in and talk to the clerk |
| Prep lesson at the school | Teaches numbers to 1,000, お弁当, 袋, 温めます, はい/いいえ answers |
| Konbini dialogue | Uses `content/konbini.md`; all choices, soft mistakes and the price listening step work |
| Unlock flow | Café done unlocks the konbini lesson; konbini done gives its station stamp |

## Phase 3: Core learning systems

| Task | Done when |
| --- | --- |
| Review lesson | After a quest, Tanaka shows each mistake the player made and explains it |
| Spaced repetition in the notebook | Words not used for a while fade; reviewing them restores color and pays yen |
| Reading layers | Romaji fades to hiragana, then kanji with furigana, based on progress |
| Traditional Chinese option | Help text switches between Simplified and Traditional |

## Phase 4: The rest of the city

| Task | Done when |
| --- | --- |
| Ramen shop with ticket machine | Player reads the machine, buys a ticket, orders, asks for the bill |
| Subway hub and fast travel | Player navigates by signs and announcements; passing unlocks train travel; wrong trains are safe detours |
| Park small talk | Free-answer conversation (speaking level 4) and friendship points |
| Airport final exam | Combines buying, directions, and small talk |

## Phase 5: Motivation systems

| Task | Done when |
| --- | --- |
| Gachapon | Earned yen buys capsules; reading the machine's instructions is required; capsule album fills by district |
| Vending machines | Hot and cold labels, five drinks with boosts, a seasonal drink |
| Stamp book | One station stamp per district, viewable from the HUD |
| Daily Life Mode | After the story, one random everyday situation per day |

## Technical upgrades (when the project grows)

| Task | Why |
| --- | --- |
| Move content (dialogue, words, lessons) into JSON files | Writers can add districts without touching game code |
| Split the code into modules with a build tool such as Vite | One file stops being manageable after two or three districts |
| Consider Godot or Unity for the full game | Better 3D tools, animation, and performance than hand-built three.js |
| Evaluate Whisper for speech recognition | Works in all browsers and offline, at the cost of a larger download |
