# Bobia

A birthday treasure hunt: an island hidden under clouds. Every chest she opens holds a memory, a rune and the clue to the next puzzle, and clears the clouds over the next part of the map. The runes open the castle at the end, where a letter is waiting.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (also reachable from your phone on the same Wi-Fi)
npm run build      # production build in dist/
```

## Make it personal

Everything personal lives in **`src/config.js`**: names, the welcome note, each zone's puzzle, treasure, rune and next clue, the castle word and the final letter.

- **Photos:** put them in `public/images/` and use `image: 'images/beach.jpg'`. Anything left as `null` shows a placeholder picture.
- **Clue pictures:** every `clue` can have an `image` too, for clues that are photos ("look where this was taken").
- **Real-world hunt:** a clue can send her somewhere in the house; the next puzzle can ask for a code or word she finds there.
- **Runes:** each treasure gives one letter. The castle answer must use exactly those letters.

### Puzzle types

| type       | what she does                                  | fields                       |
| ---------- | ---------------------------------------------- | ---------------------------- |
| `text`     | types an answer                                | `answers: ['beach', ...]`    |
| `code`     | turns number dials on a lock                   | `answer: '1402'`             |
| `choice`   | picks one option (optionally with pictures)    | `options`, `answer` (index)  |
| `swap`     | swaps tiles to rebuild a photo                 | `image`, `grid` (3 = 3×3)    |
| `scramble` | unscrambles letters into a word                | `answer: 'PANCAKES'`         |
| `runes`    | (castle) orders the runes she collected        | `answer: 'SMILE'`            |

Every puzzle takes `hints: [...]`, which the wizard reveals one at a time for gems.

## Testing shortcuts

- `?reset` starts over from the title screen.
- `?skip=3` jumps ahead as if the first 3 chests were opened.

Progress is saved in the browser, so she can close the tab and continue later.

## On her phone

The game is built phone-first (tested on small, standard and large phones, upright and sideways). For the best experience, open the link on her phone and use **Share → Add to Home Screen** (iPhone) or **⋮ → Add to Home screen** (Android). It then opens full screen from its own island icon, like an app. Progress is saved per browser, so set it up in the browser she'll actually play in.

Edit the home-screen name in `public/manifest.webmanifest` and `apple-mobile-web-app-title` in `index.html`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages at `https://tanmoy-git.github.io/bobia/`.

One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Note: answers live in `src/config.js`, so anyone who reads the repo can see them. Make the repo private before the big day if that matters (Pages from a private repo needs a paid GitHub plan).
