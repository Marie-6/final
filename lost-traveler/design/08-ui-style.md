# Lost Traveler: UI Style Rules

These rules keep every screen in the game looking like one set. When a new screen or element is designed, check it against this page.

## 1. The core idea: travel paper

The player is a traveler who lost their bag, so the interface is made of things a traveler carries: train tickets, luggage tags, a notebook, postcards and station stamps. Everyday UI is calm paper. Only rewards are loud.

| Moment | Style | Feel |
| --- | --- | --- |
| Everyday UI (buttons, prompts, dialogue, choices) | Calm travel paper | Quiet, readable, never fights the 3D scene |
| Rewards (new phrase, saved word, day complete) | Bold stamp and washi tape | Loud for a moment, then gone |

## 2. Materials

Every element is made of one of three materials. Do not mix materials inside one element.

| Material | Look | Used for |
| --- | --- | --- |
| **Paper** | Cream paper, thin dark outline, soft shadow, slight tilt allowed | Buttons, tickets, tags, cards, dialogue, notebook |
| **Chalk** | Thin handwritten strokes on the blackboard | Lesson notes, doodles, underlines |
| **Ink stamp** | Bold red ink, rough circular edge | Station stamps and reward moments only |

**Rule: paper can be clicked, chalk is only content.** Anything interactive is paper, even when it sits on the blackboard. Chalk is never a button.

## 3. Lines, shadows and shapes

- **Outlines:** thin and dark on all paper elements. No thick black outlines on everyday UI.
- **Shadows:** soft and short. No hard offset shadows on everyday UI.
- **Shapes:** flat paper pieces. Tickets have notches; tags have a punched hole and a string. No slanted cuts or ribbons on everyday UI.
- **Large world objects** that appear as UI (such as the blackboard frame) may use a heavier outline, because they are part of the scene, not floating panels.

## 4. Color roles

Colors carry meaning, so each one is used for one job only.

| Color | Meaning | Examples |
| --- | --- | --- |
| Cream paper | Base surface | Tickets, cards, dialogue |
| Navy ink | Main text and outlines | Japanese text, borders |
| Sun yellow | Primary action, current item | つぎへ button, current lesson page |
| Matcha green | Heard / correct | 聞こえた！ state, a correct ticket |
| Soft pink | Gentle miss, try again | もう一回 state, a missed ticket |
| Sky blue | Hints only | Hint bubble |
| Teal | Translation text | The help-language line under Japanese |
| Tomato red | Furigana and stamps | Furigana, station stamps |

**Never use green, pink or blue for decoration**, because players read them as correct, miss and hint. Numbers on choice tickets use one neutral color.

## 5. Typography

| Text | Style |
| --- | --- |
| Japanese, main line | Large, bold, rounded |
| Furigana | Small, tomato red, above the kanji |
| Romaji (English track only) | Small, muted, under the Japanese |
| Translation | Medium, teal, under the romaji |
| Chalk text | Thin handwritten font, blackboard only |

- The Japanese is always the largest text in its element. The eye should land on it first.
- Fonts must display long vowels correctly (ā ī ū ē ō). Test with "Kōhī o kudasai."
- The Chinese track needs its own Chinese font (Simplified and Traditional) matched in weight to the Japanese font. Japanese fonts often cannot show Simplified characters such as 热.

## 6. Japanese text display

- **Every kanji has furigana,** on both tracks. This includes UI labels the player reads, such as 教室を出る.
- **Katakana and hiragana never get furigana.** Write カフェ, not カフェ with かふぇ above it.
- **Romaji appears only on the English track.** The Chinese track never shows romaji.
- **Translations follow the hint rules.** For content not yet taught, translations show. For content already taught in a lesson, translations are hidden until the player asks with ヒント.
- **Long vowels in romaji use macrons:** Kōhī, Satō, Tōkyō.

## 7. Components

### Buttons

| Type | Look | Example |
| --- | --- | --- |
| Primary | Sun-yellow ticket with notches and a key hint | つぎへ → [Space] |
| Primary (buy / confirm) | Sun-yellow ticket | 手帳にはる [E] |
| Secondary | Plain paper pill with outline | ← もどる |
| Icon | Small white paper circle with outline | ♪, ▶, ✕ |
| Key hint | Small, light, quiet keycap | E, Space, Tab, M, 1–3 |

A button looks the same everywhere, including on the blackboard.

### Action prompt: luggage tag (荷札)

A small paper tag hangs under the reticle on a string. It shows the verb in Japanese with furigana, the meaning below, and the key.

| State | Look |
| --- | --- |
| Default | Plain paper tag |
| Hold | The tag fills with sun yellow from left to right |
| Not yet | Faded tag with the reason, such as "after class" |

Verbs match the player's level. Day 1 uses simple verbs such as 入る and 話す.

### Microphone: soft pill

A small paper label above the choice tickets.

| State | Look |
| --- | --- |
| Listening | Red dot and moving sound bars: 話してください |
| Heard | Matcha green: 聞こえた！ |
| Try again | Soft pink: もう一回 |
| Mic off | Plain: マイク オフ, pick with 1–3 |

### Dialogue: ticket (切符)

The dialogue is a long ticket. The stub on the left holds the speaker's portrait, name and role, separated by a dashed perforation. The line sits on the right, with the ♪ replay button and つぎへ.

### Choices: tickets

Up to three tickets, numbered 1–3 in one neutral color. The selected ticket turns green (heard or correct) or pink (gentle miss), and the NPC reacts above their head.

### Goal tracker: station sign (駅名標)

The day is shown as a train line: previous stop, current stop, next stop, and a station number.

- Made of the same paper as the tickets: thin outline, soft shadow, medium-weight station name.
- The green band along the bottom stays, like the line color on a real station sign.
- The label 今日の目標 sits on a small paper tab, not a slanted ribbon.
- **Hidden during conversations,** so the screen stays focused on the dialogue.

### Hints: sky-blue bubble

Hints are the only thing that uses sky blue. NPC lines never appear in hint bubbles.

### Diary and letters: postcard (絵はがき)

The bedtime diary and letters from characters use the postcard style, with the speaker as the postage stamp. Postcards mean "written down," so they are not used for live conversation.

### Rewards

| Moment | Style |
| --- | --- |
| New phrase | A 駅スタンプ slams onto the screen with +1 |
| Word saved | A note sticks into the notebook with washi tape |
| Day complete | クリア stamp on the station sign |

Rewards are the only place where bold outlines and stamps appear.

### Reactions

NPCs show small icons above their heads: ? when confused, 💧 after a funny mistake, ✨ for a right answer, ♪ when happy.

## 8. Motion and feedback

- Every reaction is **fast and skippable.** Nothing makes the player wait.
- Stamps land with a short "pon" sound. Coins fly to the counter. New words float into the notebook.
- In conversations, the camera eases in to frame the player and the NPC, and the background dims slightly.

## 9. Checklist for a new screen

- [ ] Only paper, chalk or stamp, and never mixed in one element
- [ ] Everything clickable is paper; nothing clickable is chalk
- [ ] Thin outlines and soft shadows (bold only for rewards)
- [ ] Green, pink and blue only used for their meanings
- [ ] Every kanji has furigana; no furigana on kana
- [ ] No romaji on the Chinese track
- [ ] Long vowels display correctly
- [ ] Buttons match the standard button set
- [ ] Goal tracker hidden if a conversation is open
- [ ] Readable on a real in-game screenshot, by day and by night
