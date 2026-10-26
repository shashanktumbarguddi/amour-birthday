# Likitha's Birthday Surprise ♡

A small, five-scene birthday website: an envelope that opens, a Polaroid photo gallery, a "Catch the Falling Stars" mini-game, a cake with candles to blow out, and a confetti-and-balloons finale.

It's plain HTML, CSS and JavaScript. No build step, no backend, no libraries, no internet needed (fonts are bundled).

```
likitha-birthday/
├── index.html          ← all the words you see on screen
├── style.css           ← colours, fonts, layout, animations
├── script.js           ← behaviour; settings are in the CONFIG block at the top
├── README.md
└── assets/
    ├── photos/         ← photo-01.jpg … photo-10.jpg, portrait-sketch.jpg
    ├── music/          ← background.mp3 (optional)
    ├── sounds/         ← candle-burning.mp3, candle-blow.mp3, birthday.mp3, clap.mp3 (all optional)
    └── fonts/          ← bundled fonts (no need to touch)
```

---

## 1. Add Likitha's photos

1. Copy her photos into `assets/photos/`.
2. Rename all 10 in order: `photo-01.jpg`, `photo-02.jpg`, … up to `photo-10.jpg`.
   The site is set up for exactly these 10. If one is missing, it's skipped automatically.
   To add an 11th later, name it `photo-11.jpg` and add a matching line to the `photos` list in `script.js`.
3. Open the site and check the gallery.

The site also finds common variations on its own: `.jpeg`, `.png`, `.webp`, upper-case extensions like `.JPG`, and unpadded names like `photo-4.jpg`.

**iPhone HEIC photos won't display** in most browsers. Convert them to JPG first (on a Mac: open in Preview → *File → Export* → JPEG; on Windows the Photos app can *Save as* JPG). If the site spots a `.heic` file, its placeholder frame says so.

**If you see dashed frames and a "No photos found yet" note,** the site couldn't find any of the files. Check that the photos are directly inside `assets/photos/` (not in a subfolder) and that the names match. A quick test: with the local server from section 7 running, open `http://localhost:8000/assets/photos/photo-01.jpg`. If that doesn't show the photo, the name or location is off. The note and frames disappear as soon as photos are found, so Likitha never sees them.

The gallery arranges photos in even rows (2 per row on phones, 5 per row on wide screens for 10 photos), in order from `photo-01` to `photo-10`.

**Make them load fast on phones.** Phone cameras produce 3–8 MB photos, which will feel slow. Resize each one to about **1600 px on the longest side** and save as JPEG at around **80% quality** (roughly 200–400 KB each). The free site [squoosh.app](https://squoosh.app) does this in the browser: drop a photo in, choose *Resize → 1600*, *MozJPEG, quality 80*, and download.

**Different names or formats (.png, .jpeg, .webp)?** Open `script.js` and edit the `photos` list at the very top:

```js
photos: [
  { src: "assets/photos/beach-day.png", caption: "a little sunshine ✨" },
  { src: "assets/photos/photo-02.jpg",  caption: "" },        // no caption
],
```

Filenames are case-sensitive once online: `Photo-01.JPG` is not the same as `photo-01.jpg`.

**Captions** are the short handwritten lines under each photo ("that smile ♡", "a little sunshine ✨" and so on). Change them in the same list, or set `caption: ""` to leave one blank.

Photos keep their original shape: portrait, landscape and square all display without stretching or cropping.

## 2. Add the pencil-sketch portrait (optional)

Save it as `assets/photos/portrait-sketch.jpg`. It appears in a tilted frame above the "Happiest Birthday" greeting. If the file isn't there, that frame simply doesn't show.

To use a different filename, change `portrait:` in the CONFIG block in `script.js`.

## 3. Add music and sounds (all optional)

| File | When it plays |
|---|---|
| `assets/music/background.mp3` | Starts with her first tap ("Open your surprise ✨") and loops quietly through the whole visit |
| `assets/sounds/candle-burning.mp3` | Loops softly while the candles are lit; the background music dips so the crackle can be heard |
| `assets/sounds/candle-blow.mp3` | Once, when she taps "Blow out the candles 🕯️" (the burning sound stops at the same moment) |
| `assets/sounds/birthday.mp3` | On the final page. The background music fades out while it plays and fades back in when it ends |
| `assets/sounds/clap.mp3` | On the final page, together with the birthday song |

"Replay the celebration 🎉" plays the birthday song and claps again from the start. "Make a wish again 🕯️" stops them and brings back the candle crackle.

Any file you don't add is simply skipped. For example, with no `birthday.mp3` the background music just keeps playing on the final page.

**Why the music starts on her first tap, not the instant the page opens:** every phone and desktop browser blocks sound until the visitor has touched the page. The first tap is "Open your surprise ✨", so in practice the music starts right as the surprise begins. Every other sound is prepared during that same tap, which is what lets the candle, birthday and clap sounds play later on iPhones too.

There's no on-screen music button. Sound follows the phone's own volume and silent switch, and everything pauses if she switches apps and resumes when she comes back.

**Volumes** are in the `volume` block of CONFIG in `script.js` (0 = silent, 1 = full). **iPhones ignore these numbers** and play every file at its own recorded loudness, so make the files themselves balanced. In Audacity (free): *Effect → Volume and Compression → Normalize* or *Amplify*, aiming for the crackle and background to be noticeably quieter than the birthday song.

Tips: keep each file under about 3 MB; trim long silences at the start and end so loops and cues feel instant; use tracks whose licence allows this (Pixabay Music and Pixabay Sound Effects work well — search "candle", "applause", "music box", "happy birthday instrumental").

## 4. Change the words

All on-screen text is in `index.html`. Search for the line you want, edit it, save. For example:

- `Oyee, Likitha… ♡` and `I made a little something for you.` are in Scene 1.
- `Happiest Birthday, Likitha! 🎂` is in Scene 5.

The multilingual wishes (Kannada, Hindi, Telugu, Tamil, Malayalam, Spanish, French, Japanese) are the `<li>` lines in the `wishes` list near the end.

## 5. Game settings

In `script.js`, inside CONFIG:

```js
game: {
  targetScore: 10,      // points needed to win
  durationSeconds: 15,  // length of a round
},
```

The "Catch 10 stars…" text updates itself to match `targetScore`.

How it plays: drag anywhere inside the play area (finger or mouse) and the basket follows, or use the ← → arrow keys (A / D also work). Golden stars are worth 1 point, pink hearts 2. A star counts only when it actually lands in the basket's opening. If time runs out, she gets "Try again" or "Skip to my surprise", so nobody can get stuck.

## 6. Colours and fonts

Colours are listed at the top of `style.css` under `:root` (cream paper, blush, muted rose, warm beige, graphite, gold). Change a hex value there and it updates everywhere.

Fonts: **Homemade Apple** (handwritten headings, Apache License 2.0) and **Lora** (body text, SIL Open Font License 1.1), both from Google Fonts and bundled in `assets/fonts/`, so the site doesn't need to fetch anything. The non-Latin greetings use each phone's own built-in fonts.

## 7. Run it on your computer

**Quickest:** double-click `index.html`. Everything works this way.

**Recommended while setting up:** run a tiny local server from inside the project folder, then open the address it prints. This matches how it'll behave online (for example, missing photos are skipped before the gallery appears rather than as it loads).

```bash
# Python 3 (macOS / Linux / Windows)
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with Node.js: `npx serve .`

To try it on your phone before publishing, connect the phone to the same Wi-Fi and open `http://<your-computer's-IP>:8000`.

## 8. Publish it free on Netlify

**Option A: drag and drop (no account setup beyond sign-in)**

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and sign in (free).
2. Drag the whole project folder (the one containing `index.html`) onto the page.
3. In a few seconds you get a link like `https://random-name-123.netlify.app`.
4. Optional: in the site's settings, use **Change site name** to pick something like `likitha-birthday`.

To update it later (new photos, new music), open the site in Netlify, go to *Deploys*, and drag the folder in again.

**Option B: from GitHub** — push the folder to a repository, then in Netlify choose *Add new site → Import an existing project*, pick the repo, leave the build command empty and the publish directory as `/`.

Anyone with the link can open the site, so share it just with Likitha (and whoever you'd like).

## 9. Final check before sending

Open the published link on a phone and run through:

1. **Opening** — tap "Open your surprise ✨": the seal fades, the flap opens, the letter rises, balloons and hearts float up, then the gallery appears.
2. **Gallery** — all her photos show, none stretched. Tap one: the viewer opens. Try ‹ ›, swipe left/right, ✕, and tapping the dark area.
3. **Game** — "Let's play!", drag the basket, watch the score and timer. Let the timer run out once to see "Try again" and "Skip to my surprise", then win to see "Reveal my surprise".
4. **Candles** — tap "Blow out the candles 🕯️": flames go out, smoke curls up, the light dims briefly, then the celebration starts.
5. **Celebration** — balloons, confetti and the greeting. "Replay the celebration 🎉" and "Make a wish again 🕯️" both work.
6. **Sound** — music starts on the first tap; the candle crackle plays on the cake page and stops when blown out; the birthday song and claps play on the last page, then the music returns. Check with the phone's silent switch off.
7. **Reduced motion** — on iPhone (*Settings → Accessibility → Motion → Reduce Motion*) or Android (*Remove animations*), the journey still works with calm transitions and no confetti or balloons.

## Accessibility notes

- Every control is a real button, reachable by keyboard, with a visible focus ring and touch targets of at least 48 px.
- Text colours meet WCAG AA contrast on the cream background.
- The game area only blocks page scrolling while a finger is on it; the rest of the page scrolls normally.
- `prefers-reduced-motion` is respected: balloons, confetti and floating hearts are skipped and transitions become instant.
- Animations and timers are cancelled whenever a scene changes or the game ends, and repeated taps can't stack celebrations.
