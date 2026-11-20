# Lost Traveler: Voices

Nov 20, 2026 · @Marie

Who speaks with which voice, and the rules for spoken lines. Characters are described in [Game Rules](05-game-rules.md).

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
