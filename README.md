# Joy's Island

A birthday treasure hunt for Joy's 33rd. She enters with a passphrase, then walks a winding road around an island hidden under clouds. There are 33 treasures: 32 chests along the road and Heart Castle at its centre. Every chest is locked by a puzzle whose clue came from the previous treasure. Opening it reveals a memory and clears the clouds over the next stretch of road. Runes from some chests open the castle gate, where your letter is waiting.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (also reachable from your phone on the same Wi-Fi)
npm run build      # production build in dist/
```

## Controls

- **Phone:** drag anywhere on the left half of the screen to walk (a floating thumbstick, PUBG style). Tap the gold button on the right to open a chest when she's next to it.
- **Keyboard:** arrow keys or W A S D to walk, Space or Enter to open, M for the island map.

## Make it personal

Everything personal lives in **`src/config.js`**: the passphrase, names, the welcome note, all 32 chests (name, landmark, puzzle, treasure, rune, next clue), the castle word and the final letter.

- **Passphrase:** `passphrase: 'HBDJoy'` (case and spaces don't matter). Once entered, the phone remembers it.
- **Photos:** put them in `public/images/` and use `image: 'images/beach.jpg'`. Anything left as `null` shows a placeholder picture.
- **Clue pictures:** every `clue` can have an `image` too, for clues that are photos.
- **Landmarks:** each chest has a drawing next to it: `palms`, `windmill`, `lighthouse`, `lake`, `falls`, `cottage`, `balloon`, `bench` or `cake`.
- **Runes:** set `rune: 'A'` on any chests you like (or `null`). The castle answer must use exactly those letters.
- The placeholder clues say "(While testing: …)" so you can play through. Replace them all before the day.

### Puzzle types

| type       | what she does                                  | fields                       |
| ---------- | ---------------------------------------------- | ---------------------------- |
| `text`     | types an answer                                | `answers: ['beach', ...]`    |
| `code`     | turns number dials on a lock                   | `answer: '1402'`             |
| `choice`   | picks one option (optionally with pictures)    | `options`, `answer` (index)  |
| `swap`     | swaps tiles to rebuild a photo                 | `image`, `grid` (3 = 3×3)    |
| `scramble` | unscrambles letters into a word                | `answer: 'PANCAKES'`         |
| `runes`    | (castle) orders the runes she collected        | `answer: 'ALWAYS'`           |

Every puzzle takes `hints: [...]`, which the wizard reveals one at a time for gems. She earns gems from every chest.

## Testing shortcuts

- `?reset` starts over from the passphrase screen.
- `?skip=12` jumps ahead as if the first 12 chests were opened (`?skip=32` puts her at the castle).

Progress is saved in the browser, so she can close the tab and continue later.

## On her phone

Open the link on her phone and use **Share → Add to Home Screen** (iPhone) or **⋮ → Add to Home screen** (Android). It then opens full screen from its own island icon, like an app. Progress is saved per browser, so set it up in the browser she'll actually play in.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages at `https://tanmoy-git.github.io/bobia/`.

One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Answers and the passphrase live in `src/config.js`, so anyone who reads the repo can see them. Make the repo private before the big day if that matters (Pages from a private repo needs a paid GitHub plan).
