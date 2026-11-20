# Prototype Architecture

The Day 1 prototype is a single file, `prototype/index.html`: HTML, CSS, and one JavaScript block. It uses three.js r128 (loaded from cdnjs) for 3D, the Web Speech API for speaking, and Inworld text-to-speech for character voices (with the browser's speech synthesis as a fallback). `prototype/key.js` (private, not in git) holds the Inworld API key.

## Code map

The script is split into labeled sections (search for `/* ---------- `):

| Section | What it does |
| --- | --- |
| Text | `I18N`: every interface string in English (`en`) and Chinese (`zh`). `t(key)` returns the current language. |
| `WORDS` | Vocabulary: Japanese, romaji, English and Chinese meaning, and the place it is learned. |
| Game state | `G`: name, yen, earned yen, confidence, spoken answers, learned words, current phase, drink, voice setting. |
| UI helpers | Toasts, yen, confidence bar, notebook. |
| Voice out | `say(text, force, who, rate)`: speaks a line with the voice set for `who` in `SPEAKERS`, or the narrator (`NARRATOR_VOICE`) when `who` is empty. `LESSON_RATE` (0.8) slows the lesson's Listen buttons. Falls back to the system's Japanese voice. |
| Voice in | `bindMic`, `micBegin`, `micEnd`, `matchOption`: push-to-talk recognition and meaning-based matching. |
| Dialogue scripts | `TANAKA` and `CAFE`: the conversations, as data. |
| Dialogue engine | `openDialog`, `showNode`, `renderNode`, `choose`, `endDialog`. |
| Lesson | `LESSON`: the four blackboard cards, including the speaking practice. |
| Reward | The end-of-day stamp and stats. |
| 3D world | `buildWorld`, `building`: street, buildings, signs, bench, vending machine, cherry tree, poles. |
| Characters | `character`, `nameTag`, `animateWalk`: low-poly people built from boxes and spheres. |
| Interaction | `candidates()`: what the player can interact with in the current phase. |
| Input, physics, loop | Keyboard and click-to-move, simple collision, camera follow, the render loop. |

## Game flow

The game is a small state machine stored in `G.phase`:

```
intro → findTanaka → goSchool → goCafe → done
         (dialogue)   (lesson)   (dialogue)  (reward)
```

`setPhase(p)` updates the objective text. `candidates()` returns the interactions available in each phase, and the yellow marker points at the current target.

## Dialogue format

Each conversation is an object of nodes. A node is one line from a character:

| Field | Meaning |
| --- | --- |
| `who` | Speaker key in `SPEAKERS` (`tanaka`, `barista`) |
| `jp`, `r`, `en`, `zh` | Japanese line, romaji, English and Chinese translation. Can be functions for dynamic text such as the player's name. |
| `words` | Word ids added to the notebook when the line appears |
| `faded` | Translation is blurred until the player taps "Show hint" |
| `hideAll` | Romaji is blurred too (used for the listening test) |
| `pay` | Options render as coin buttons; microphone hidden |
| `falseFriend` | Shows the false-friend alert on the Chinese track |
| `action` | Function run once when the line first appears |
| `options` | Player answers (see below). Without options, a Next button shows. |
| `next` / `end` | Next node id, or an end key passed to the callback |

Each option:

| Field | Meaning |
| --- | --- |
| `jp`, `r`, `en`, `zh` | The answer text (or `label` for coin buttons) |
| `keys` | Words that count as this answer when spoken. Katakana and hiragana are treated the same. |
| `pri` | Matching priority. Higher is checked first; use `0` for weak words like はい that appear inside other answers. |
| `ok` | `true` to accept, `false` for a soft mistake |
| `wrong` | For mistakes: the NPC's funny reply (`jp`, `r`) and a tip (`note.en`, `note.zh`) |
| `set` | Function run when chosen (for example, remember the drink) |
| `next` / `end` | Where the conversation goes next |

## How to add a district

Using the konbini as the example (`content/konbini.md` has the content ready):

1. **Words:** add the new vocabulary to `WORDS`, with `place:'konbini'` and a `place_konbini` label in both languages in `I18N`.
2. **Dialogue:** add a `KONBINI` script object in the same format as `CAFE`.
3. **Lesson:** turn `LESSON` into one lesson per district (for example `LESSONS.cafe`, `LESSONS.konbini`) and open the right one from the school.
4. **Phases:** add `goKonbiniLesson` and `goKonbini` between `goCafe`/`done`, with objective strings `obj_goKonbiniLesson` and `obj_goKonbini` in both languages.
5. **World:** the konbini building already exists on the south side of the street (`konbini:true` in `building`). Add a clerk with `character(...)`, a name tag, and a counter, like the café.
6. **Interaction:** add the clerk to `candidates()` for the new phase, and to the click targets in the pointer handler.
7. **Reward:** give the konbini its own stamp in the reward screen.

## Known limitations

- **One file:** fine for a slice, but split it into modules before adding more than two districts.
- **No saving:** a reload restarts Day 1.
- **Speech recognition** only works in Chrome and Edge, needs `https` or `localhost`, and sends audio to the browser vendor's speech service. Matching is keyword-based, so very creative answers may not match.
- **Character voices** need an Inworld key in `key.js` and an internet connection. The published GitHub Pages version has no key, so it uses the built-in voice, which depends on a Japanese voice being installed on the computer.
- **Chinese track** is Simplified only. The reading-layer system (romaji to hiragana to kanji) isn't built yet; Day 1 always shows romaji except at the till.
- **3D** is hand-built three.js. For the full game, an engine such as Godot or Unity would make animation and level design much easier.
