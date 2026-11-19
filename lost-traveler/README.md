# Lost Traveler (迷子の旅人)

A 3D exploration game that teaches beginner Japanese through everyday situations in a Tokyo-style city. Players pick English or Chinese as their help language, and the game teaches each group differently.

This package contains the full design, the decisions behind it, a playable Day 1 prototype, and the next steps to build the rest.

## What's inside

| Path | What it is | Use it for |
| --- | --- | --- |
| `design/01-project-notes.md` | The full game design (concept, learners, map, systems) | Your assignment write-up and the source of truth for the design |
| `design/02-decision-log.md` | Every major decision, the options considered, and why | Explaining your process to your teacher |
| `design/03-city-map.svg` | The city map: seven districts on one subway line | Reference for your city map sketch |
| `design/04-roadmap.md` | Prioritized next steps, each with a "done when" check | Planning what to build next |
| `prototype/index.html` | Playable Day 1 slice: bench, Tanaka-sensei, the lesson, the café | Playtesting and your demo |
| `docs/architecture.md` | How the prototype code works, and how to add a district | Building the next district |
| `content/konbini.md` | Ready-to-use dialogue and vocabulary for the konbini | The next district to build |

## Run the prototype

The game is one HTML file. It loads three.js and fonts from the internet, so you need a connection.

1. Open a terminal in this folder.
2. Run `python3 -m http.server 8000`
3. Open `http://localhost:8000/prototype/` in **Chrome or Edge**.

Serving it on localhost (instead of double-clicking the file) matters: browsers only allow the microphone on `https://` or `localhost` pages. Without the microphone, tapping answers still works.

**Controls:** WASD or arrow keys to walk (or click the ground). E or the yellow button to talk. Hold the pink button or Space to answer out loud.

**Character voices** use your computer's built-in Japanese voice. On Windows, add Japanese in Settings > Time & language > Speech. On macOS, add a Japanese voice in System Settings > Accessibility > Spoken Content.

## Live version

Published prototype: https://claude.ai/artifact/CxmW81QNUEg1uSwYTAgD7r
Editable project notes: https://claude.ai/artifact/FoUsFjnZTJVNF8mo9x24dZ
