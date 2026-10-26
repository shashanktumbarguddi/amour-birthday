/* =========================================================
   Likitha's birthday surprise
   ---------------------------------------------------------
   ✏️  EASY CUSTOMISATION — edit the CONFIG block below.
   Everything else can stay as it is.
   ========================================================= */

const CONFIG = {
  // Photos: 10 files in assets/photos/, named photo-01.jpg … photo-10.jpg.
  // To add more later, add another line here. A listed file that doesn't
  // exist is skipped automatically. Captions are optional — use "" for none.
  photos: [
    { src: "assets/photos/photo-01.jpg", caption: "that smile ♡" },
    { src: "assets/photos/photo-02.jpg", caption: "a little sunshine ✨" },
    { src: "assets/photos/photo-03.png", caption: "so pretty ♡" },
    { src: "assets/photos/photo-04.png", caption: "pure sparkle ✨" },
    { src: "assets/photos/photo-05.jpg", caption: "that glow ♡" },
    { src: "assets/photos/photo-06.jpg", caption: "main character ✨" },
    { src: "assets/photos/photo-07.jpg", caption: "lovely ♡" },
    { src: "assets/photos/photo-08.png", caption: "always shining ✨" },
    { src: "assets/photos/photo-09.jpg", caption: "simply you ♡" },
    { src: "assets/photos/photo-10.jpg", caption: "pure joy ✨" },
  ],

  // Optional pencil-sketch portrait, shown with the birthday greeting.
  portrait: "assets/photos/portrait-sketch.jpg",

  // Sounds. Each one is optional: a missing file is simply skipped.
  // Background music starts with her first tap ("Open your surprise ✨"),
  // because browsers don't allow sound before the visitor touches the page.
  sounds: {
    background: "assets/music/background.mp3",     // loops through the whole visit
    candleBurning: "assets/sounds/candle-burning.mp3.mpeg", // loops while the candles are lit
    candleBlow: "assets/sounds/candle-blow.mp3.mpeg",    // plays once when she blows them out
    birthday: "assets/sounds/birthday.mp3.mpeg",       // plays on the final page
    clap: "assets/sounds/clap.mp3.mpeg",           // plays with the birthday song
  },
  // Loudness of each sound, 0 (silent) to 1 (full).
  // Note: iPhones ignore these, so also make sure the files themselves are balanced.
  volume: {
    background: 0.4,
    backgroundDuringCandles: 0.15,
    candleBurning: 0.6,
    candleBlow: 0.8,
    birthday: 0.9,
    clap: 0.7,
  },

  // Mini-game
  game: {
    targetScore: 10,
    durationSeconds: 15,
  },
};

/* ========================================================= */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = motionQuery.matches;
  motionQuery.addEventListener?.("change", (e) => { reduceMotion = e.matches; });

  const PASTELS = ["#F4CFD2", "#E8A9B4", "#F6DDB8", "#CFE0D2", "#D9CFEA", "#F9E6A7"];
  const fx = $("#fx");

  /* -------------------------------------------------------
     Scene manager
     ------------------------------------------------------- */
  const hooks = { enter: {}, leave: {} };
  let currentScene = "intro";
  let navigating = false;

  function showScene(name) {
    if (navigating || name === currentScene) return;
    navigating = true;

    const from = $(`#scene-${currentScene}`);
    const to = $(`#scene-${name}`);
    hooks.leave[currentScene]?.();
    from.classList.add("is-leaving");

    setTimeout(() => {
      from.hidden = true;
      from.classList.remove("is-leaving", "is-active");
      to.hidden = false;
      window.scrollTo(0, 0);
      void to.offsetWidth; // let the browser register the start state
      to.classList.add("is-active");
      currentScene = name;
      navigating = false;
      $("[data-focus]", to)?.focus({ preventScroll: true });
      hooks.enter[name]?.();
    }, reduceMotion ? 0 : 360);
  }

  /* -------------------------------------------------------
     Small FX helpers: balloons + floating hearts
     ------------------------------------------------------- */
  function releaseBalloons(count, { maxDelay = 0.8, minDur = 5, maxDur = 7.5 } = {}) {
    if (reduceMotion) return;
    const small = window.innerWidth < 600;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "balloon";
      const size = small ? rand(44, 62) : rand(56, 84);
      // spread evenly across the width, with a little randomness
      const x = ((i + 0.5) / count) * 100 + rand(-6, 6);
      b.style.setProperty("--x", `calc(${clamp(x, 2, 92)}% - ${size / 2}px)`);
      b.style.setProperty("--size", `${size}px`);
      b.style.setProperty("--dur", `${rand(minDur, maxDur).toFixed(2)}s`);
      b.style.setProperty("--delay", `${rand(0, maxDelay).toFixed(2)}s`);
      b.style.setProperty("--c", PASTELS[i % PASTELS.length]);
      b.innerHTML = '<div class="balloon-body"></div>';
      b.addEventListener("animationend", (e) => { if (e.target === b) b.remove(); });
      fx.appendChild(b);
    }
  }

  function floatHearts(originEl, count = 8) {
    if (reduceMotion) return;
    const r = originEl.getBoundingClientRect();
    const glyphs = ["♥", "♡", "✦", "✧"];
    const colors = ["#C77D8B", "#E8A9B4", "#E3B04B", "#9A4456"];
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = "float-heart";
      h.textContent = glyphs[i % glyphs.length];
      h.style.setProperty("--x", `${r.left + rand(0.15, 0.85) * r.width}px`);
      h.style.setProperty("--y", `${r.top + rand(0.1, 0.5) * r.height}px`);
      h.style.setProperty("--s", `${rand(14, 26)}px`);
      h.style.setProperty("--c", colors[i % colors.length]);
      h.style.setProperty("--dx", `${rand(-50, 50)}px`);
      h.style.setProperty("--dur", `${rand(1.6, 2.4)}s`);
      h.style.setProperty("--delay", `${rand(0, 0.6)}s`);
      h.addEventListener("animationend", () => h.remove());
      fx.appendChild(h);
    }
  }

  function clearFx() {
    fx.replaceChildren();
  }

  /* -------------------------------------------------------
     Sound — background music, candle sounds, birthday song + claps.
     Everything starts from her first tap; missing files are skipped.
     ------------------------------------------------------- */
  const sound = (() => {
    const make = (src, loop = false) => {
      if (!src) return null;
      const a = new Audio();
      a.preload = "none";
      a.loop = loop;
      a.src = src;
      a.addEventListener("error", () => { a.dataset.missing = "1"; a.pause(); });
      return a;
    };
    const S = CONFIG.sounds;
    const V = CONFIG.volume;
    const bg = make(S.background, true);
    const burning = make(S.candleBurning, true);
    const blow = make(S.candleBlow);
    const bday = make(S.birthday);
    const clap = make(S.clap);
    const all = [bg, burning, blow, bday, clap].filter(Boolean);

    let started = false;
    let bgTarget = V.background;   // volume the background should sit at
    let bgHeld = false;            // paused for the birthday song
    const fades = new Map();

    const usable = (a) => a && a.dataset.missing !== "1";

    function fade(a, to, ms, done) {
      if (!a) return;
      clearInterval(fades.get(a));
      const from = a.volume;
      const steps = Math.max(1, Math.round(ms / 30));
      let i = 0;
      fades.set(a, setInterval(() => {
        i++;
        a.volume = clamp(from + (to - from) * (i / steps), 0, 1);
        if (i >= steps) { clearInterval(fades.get(a)); fades.delete(a); done?.(); }
      }, 30));
    }

    function play(a, vol, { fromStart = false, fadeMs = 0 } = {}) {
      if (!usable(a)) return Promise.resolve(false);
      clearInterval(fades.get(a));
      if (fromStart) { try { a.currentTime = 0; } catch (_) { } }
      a.volume = fadeMs ? 0 : vol;
      return a.play().then(() => {
        if (fadeMs) fade(a, vol, fadeMs);
        return true;
      }).catch(() => { a.pause(); return false; });
    }

    function stop(a, fadeMs = 0) {
      if (!a) return;
      if (!fadeMs || a.paused) { clearInterval(fades.get(a)); a.pause(); return; }
      fade(a, 0, fadeMs, () => a.pause());
    }

    // Called on her first tap. Phones only allow sound that starts from a tap,
    // so every sound is quietly "unlocked" now and can play later on its own.
    function start() {
      if (started) return;
      started = true;
      all.forEach((a) => {
        if (a === bg) return;
        a.preload = "auto";
        a.muted = true;
        a.play().then(() => {
          a.pause();
          try { a.currentTime = 0; } catch (_) { }
          a.muted = false;
        }).catch(() => { a.pause(); a.muted = false; });
      });
      if (bg) { bg.preload = "auto"; play(bg, bgTarget, { fadeMs: 1200 }); }
    }

    function setBackground(vol, ms = 600) {
      bgTarget = vol;
      if (!started || !usable(bg) || bgHeld) return;
      if (bg.paused) play(bg, vol, { fadeMs: ms });
      else fade(bg, vol, ms);
    }

    // Candles
    function candlesLit() {
      if (!started) return;
      setBackground(V.backgroundDuringCandles);
      play(burning, V.candleBurning, { fadeMs: 500 });
    }
    function candlesOut() {
      stop(burning, 250);
      play(blow, V.candleBlow, { fromStart: true });
    }
    function leaveCandles() {
      stop(burning, 200);
    }

    // Finale: birthday song + claps; background steps aside, then returns
    function celebrate() {
      if (!started) return;
      play(clap, V.clap, { fromStart: true });
      play(bday, V.birthday, { fromStart: true }).then((ok) => {
        if (!ok) { setBackground(V.background); return; }
        bgHeld = true;
        stop(bg, 500);
      });
    }
    if (bday) bday.addEventListener("ended", () => {
      bgHeld = false;
      setBackground(V.background, 1500);
    });
    function leaveFinale() {
      stop(bday, 300);
      stop(clap, 300);
      bgHeld = false;
      setBackground(V.background);
    }

    // Pause everything when she switches apps/tabs; resume what was playing
    let resumeList = [];
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        resumeList = all.filter((a) => !a.paused);
        resumeList.forEach((a) => a.pause());
      } else {
        resumeList.forEach((a) => a.play().catch(() => { }));
        resumeList = [];
      }
    });

    // Start on her first real tap / click / key press anywhere.
    // (pointerdown is deliberately not used: phones don't count it as a tap,
    // so the browser would block the music.) If the music is still not playing
    // on a later tap, try again.
    const gestures = ["pointerup", "touchend", "click", "keydown"];
    const onGesture = () => {
      start();
      if (bg && usable(bg) && bg.paused && !bgHeld && !document.hidden) {
        play(bg, bgTarget, { fadeMs: 800 });
      }
    };
    gestures.forEach((ev) => window.addEventListener(ev, onGesture, true));

    return {
      start, candlesLit, candlesOut, leaveCandles, celebrate, leaveFinale,
      // read-only peek used by the automated test (index.html?test)
      _state: () => Object.fromEntries(
        [["bg", bg], ["burning", burning], ["blow", blow], ["bday", bday], ["clap", clap]]
          .map(([k, a]) => [k, a ? { playing: !a.paused, vol: +a.volume.toFixed(2), missing: !usable(a) } : null])),
    };
  })();

  /* -------------------------------------------------------
     Scene 1 — opening envelope
     ------------------------------------------------------- */
  const openBtn = $("#openBtn");
  const envelope = $("#envelope");

  openBtn.addEventListener("click", async () => {
    if (openBtn.disabled) return;
    openBtn.disabled = true;
    sound.start();
    envelope.classList.add("is-open");
    await wait(reduceMotion ? 150 : 650);
    floatHearts(envelope, 10);
    releaseBalloons(window.innerWidth < 600 ? 5 : 7, { maxDelay: 0.5, minDur: 4.5, maxDur: 6 });
    await wait(reduceMotion ? 300 : 1700);
    showScene("gallery");
  });

  /* -------------------------------------------------------
     Scene 2 — gallery + lightbox
     ------------------------------------------------------- */
  const gallery = $("#gallery");
  const galleryEmpty = $("#galleryEmpty");
  let galleryBuilt = false;
  let hasRealPhoto = false;
  let revealObserver = null;

  const TILTS = [-3, 2.4, -1.6, 3.2, -2.6, 1.4, -3.4, 2, -1.2, 2.8];

  // Name/extension variations to try for each listed photo, so
  // photo-04.jpeg, photo-04.PNG or photo-4.jpg are all found automatically.
  const EXTS = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];
  function candidatesFor(src) {
    const m = src.match(/^(.*\/)?([^/]+?)(?:\.([a-z0-9]+))?$/i);
    const dir = m[1] || "";
    const base = m[2];
    const ext = m[3];
    const bases = [base];
    const unpadded = base.replace(/-0+(\d)/, "-$1");
    if (unpadded !== base) bases.push(unpadded);
    const exts = ext ? [ext, ...EXTS.filter((e) => e !== ext)] : EXTS;
    const out = [];
    bases.forEach((b) => exts.forEach((e) => out.push(`${dir}${b}.${e}`)));
    return [...new Set(out)];
  }

  async function headOk(url) {
    const r = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (r.ok) return true;
    if (r.status === 404) return false;
    throw new Error("HEAD unsupported");
  }

  // On a web server: find the real file for each photo without downloading it.
  // Returns null when that isn't possible (e.g. opened by double-clicking).
  async function resolvePhotos() {
    if (!location.protocol.startsWith("http")) return null;
    try {
      return await Promise.all(CONFIG.photos.map(async (p) => {
        for (const url of candidatesFor(p.src)) {
          if (await headOk(url)) return { ...p, src: url, found: true };
        }
        // iPhone HEIC photos exist but most browsers can't display them
        const heicBase = p.src.replace(/\.[a-z0-9]+$/i, "");
        for (const url of [`${heicBase}.heic`, `${heicBase}.HEIC`]) {
          if (await headOk(url)) return { ...p, found: false, heic: url };
        }
        return { ...p, found: false };
      }));
    } catch (_) {
      return null;
    }
  }

  // Lay photos out in even rows: pick the most photos per row (up to what
  // the screen allows) that leaves no gaps, or as few as possible.
  function layoutGallery() {
    const n = $$(".polaroid", gallery).length;
    if (!n) return;
    const w = window.innerWidth;
    const max = w < 600 ? 2 : w < 900 ? 3 : 5;
    let best = Math.min(max, n);
    let bestGaps = Infinity;
    for (let c = Math.min(max, n); c >= 2; c--) {
      const gaps = (c - (n % c)) % c;
      if (gaps < bestGaps) { best = c; bestGaps = gaps; }
    }
    gallery.style.setProperty("--cols", n === 1 ? 1 : best);
  }
  let layoutTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(layoutGallery, 120);
  });

  async function buildGallery() {
    if (galleryBuilt) return;
    galleryBuilt = true;
    const resolved = await resolvePhotos();
    const anyFound = resolved && resolved.some((p) => p.found);
    const photos = resolved
      ? (anyFound ? resolved.filter((p) => p.found) : resolved)
      : CONFIG.photos;

    revealObserver = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealObserver.unobserve(e.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 })
      : null;

    photos.forEach((photo, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.style.setProperty("--r", `${TILTS[i % TILTS.length]}deg`);
      fig.dataset.caption = photo.caption || "";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "polaroid-btn";
      btn.setAttribute("aria-label", `Open photo${photo.caption ? ": " + photo.caption : ""}`);
      btn.addEventListener("click", () => {
        if (fig.classList.contains("placeholder")) return;
        openLightbox(fig);
      });
      fig.appendChild(btn);

      if (photo.caption) {
        const cap = document.createElement("figcaption");
        cap.className = "hand";
        cap.textContent = photo.caption;
        fig.appendChild(cap);
      }
      gallery.appendChild(fig);

      if (resolved && !photo.found) {
        showPlaceholder(fig, btn, photo.src, photo.heic);
      } else {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = `Likitha${photo.caption ? " — " + photo.caption : ""}`;
        // already resolved on a server; otherwise try each variation in turn
        const tries = resolved ? [photo.src] : candidatesFor(photo.src);
        let t = 0;
        img.addEventListener("load", () => {
          fig.dataset.src = img.currentSrc || img.src;
          onPhotoLoad(img);
        }, { once: true });
        img.addEventListener("error", function next() {
          t++;
          if (t < tries.length) { img.src = tries[t]; return; }
          img.removeEventListener("error", next);
          onPhotoError(fig, btn, photo.src);
        });
        img.src = tries[0];
        btn.appendChild(img);
      }

      if (revealObserver && !reduceMotion) {
        fig.style.transitionDelay = `${(i % 5) * 80}ms`;
        revealObserver.observe(fig);
      } else {
        fig.classList.add("in");
      }
    });
    layoutGallery();
  }

  function onPhotoLoad(img) {
    img.classList.add("loaded");
    if (!hasRealPhoto) {
      hasRealPhoto = true;
      galleryEmpty.hidden = true;
      // a real photo exists, so remove any setup placeholders
      $$(".polaroid.placeholder", gallery).forEach((p) => p.remove());
      layoutGallery();
    }
  }

  function onPhotoError(fig, btn, src) {
    if (hasRealPhoto) {
      fig.remove(); // quietly skip missing files once real photos exist
      layoutGallery();
      return;
    }
    showPlaceholder(fig, btn, src);
  }

  // Setup aid, shown only while no photo at all can be found
  function showPlaceholder(fig, btn, src, heic) {
    const name = src.split("/").pop();
    fig.classList.add("placeholder");
    btn.replaceChildren(document.createTextNode(
      heic ? `${heic.split("/").pop()} found — please convert it to JPG` : name
    ));
    btn.setAttribute("aria-label", `Missing photo ${name}`);
    btn.tabIndex = -1;
    galleryEmpty.hidden = false;
  }

  // ---- Lightbox ----
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCaption = $("#lbCaption");
  const lbCount = $("#lbCount");
  const lbStage = $("#lbStage");
  let lbList = [];
  let lbIndex = 0;
  let lbOpener = null;

  function loadedFigures() {
    return $$(".polaroid", gallery).filter((f) => $("img.loaded", f));
  }

  function openLightbox(fig) {
    lbList = loadedFigures();
    lbIndex = Math.max(0, lbList.indexOf(fig));
    if (!lbList.length) return;
    lbOpener = $(".polaroid-btn", fig);
    renderLightbox(false);
    document.documentElement.classList.add("no-scroll");
    if (typeof lb.showModal === "function") lb.showModal();
    else lb.setAttribute("open", "");
    $("#lbClose").focus();
  }

  function renderLightbox(animate = true) {
    const fig = lbList[lbIndex];
    if (!fig) return;
    const apply = () => {
      lbImg.src = fig.dataset.src;
      lbImg.alt = $("img", fig).alt;
      lbCaption.textContent = fig.dataset.caption;
      lbCount.textContent = `${lbIndex + 1} / ${lbList.length}`;
      lbImg.classList.remove("swapping");
    };
    const single = lbList.length < 2;
    $("#lbPrev").hidden = single;
    $("#lbNext").hidden = single;
    if (animate && !reduceMotion) {
      lbImg.classList.add("swapping");
      setTimeout(apply, 180);
    } else {
      apply();
    }
  }

  function stepLightbox(dir) {
    if (lbList.length < 2) return;
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    renderLightbox(true);
  }

  function closeLightbox() {
    if (lb.open) {
      if (typeof lb.close === "function") lb.close();
      else lb.removeAttribute("open");
    }
  }

  lb.addEventListener("close", () => {
    document.documentElement.classList.remove("no-scroll");
    lbOpener?.focus({ preventScroll: true });
  });
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => stepLightbox(-1));
  $("#lbNext").addEventListener("click", () => stepLightbox(1));
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); stepLightbox(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); stepLightbox(1); }
  });
  // tap on the dark area (not the photo or buttons) closes
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target === lbStage) closeLightbox();
  });

  // swipe left / right
  let swipeStart = null;
  lbStage.addEventListener("pointerdown", (e) => {
    swipeStart = { x: e.clientX, y: e.clientY, t: performance.now() };
  });
  lbStage.addEventListener("pointerup", (e) => {
    if (!swipeStart) return;
    const dx = e.clientX - swipeStart.x;
    const dy = e.clientY - swipeStart.y;
    const fast = performance.now() - swipeStart.t < 600;
    swipeStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3 && fast) {
      stepLightbox(dx < 0 ? 1 : -1);
    }
  });
  lbStage.addEventListener("pointercancel", () => { swipeStart = null; });

  hooks.enter.gallery = buildGallery;
  hooks.leave.gallery = closeLightbox;
  $("#toGameBtn").addEventListener("click", () => showScene("game"));

  /* -------------------------------------------------------
     Scene 3 — Catch the Falling Stars
     ------------------------------------------------------- */
  const Game = (() => {
    const TARGET = CONFIG.game.targetScore;
    const DURATION = CONFIG.game.durationSeconds;

    const canvas = $("#gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreOut = $("#scoreOut");
    const timeOut = $("#timeOut");
    const startOv = $("#gameStart");
    const winOv = $("#gameWin");
    const loseOv = $("#gameLose");

    let W = 0, H = 0, dpr = 1;
    let raf = 0;
    let running = false;
    let lastT = 0;
    let spawnTimer = 0;
    let elapsed = 0;
    let score = 0;
    let shownSeconds = DURATION;
    let objects = [];
    let popups = [];
    const basket = { x: 0, y: 0, w: 90, h: 50, targetX: 0, bounce: 0 };
    const keys = { left: false, right: false };
    let dragging = false;
    let resizeObs = null;

    $$("[data-target]").forEach((el) => { el.textContent = TARGET; });

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const oldW = W;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      basket.w = clamp(W * 0.22, 66, 104);
      basket.h = basket.w * 0.55;
      basket.y = H - basket.h - 14;
      if (!oldW) {
        basket.x = basket.targetX = (W - basket.w) / 2;
      } else {
        // keep relative position after rotate/resize
        const ratio = W / oldW;
        basket.x = clamp(basket.x * ratio, 0, W - basket.w);
        basket.targetX = clamp(basket.targetX * ratio, 0, W - basket.w);
      }
      if (!running) draw();
    }

    function setScore(v) {
      score = v;
      scoreOut.textContent = score;
      const pill = scoreOut.parentElement;
      pill.classList.remove("pop");
      void pill.offsetWidth;
      pill.classList.add("pop");
    }

    function setTime(seconds) {
      if (seconds === shownSeconds) return;
      shownSeconds = seconds;
      timeOut.textContent = seconds;
      timeOut.parentElement.classList.toggle("low", seconds <= 5);
    }

    function resetState() {
      objects = [];
      popups = [];
      elapsed = 0;
      spawnTimer = 0.3;
      score = 0;
      scoreOut.textContent = "0";
      shownSeconds = -1;
      setTime(DURATION);
      basket.x = basket.targetX = (W - basket.w) / 2;
      basket.bounce = 0;
    }

    function spawn() {
      if (objects.length >= 10) return;
      const isHeart = Math.random() < 0.15;
      const r = clamp(W * 0.045, 13, 19) * (isHeart ? 1.05 : 1);
      const progress = elapsed / DURATION;
      const base = H * (0.42 + progress * 0.22);   // gets a little quicker
      objects.push({
        type: isHeart ? "heart" : "star",
        x: rand(r + 4, W - r - 4),
        y: -r,
        r,
        vy: base * rand(0.85, 1.2),
        rot: rand(0, Math.PI * 2),
        vr: rand(-2, 2),
        sway: rand(0, Math.PI * 2),
      });
    }

    // An object is caught when it touches the basket's opening (top part)
    // and its centre is over the basket, so edge grazes don't count.
    function caught(o) {
      const zx = basket.x + basket.w * 0.06;
      const zw = basket.w * 0.88;
      if (o.x < zx || o.x > zx + zw) return false;
      const zy = basket.y;
      const zh = basket.h * 0.5;
      const cx = clamp(o.x, zx, zx + zw);
      const cy = clamp(o.y, zy, zy + zh);
      const dx = o.x - cx;
      const dy = o.y - cy;
      return dx * dx + dy * dy <= o.r * o.r;
    }

    function update(dt) {
      elapsed += dt;
      const remaining = Math.max(0, DURATION - elapsed);
      setTime(Math.ceil(remaining));

      // movement
      const kSpeed = W * 1.15;
      if (keys.left) basket.targetX -= kSpeed * dt;
      if (keys.right) basket.targetX += kSpeed * dt;
      basket.targetX = clamp(basket.targetX, 0, W - basket.w);
      basket.x += (basket.targetX - basket.x) * Math.min(1, dt * 20);
      basket.bounce = Math.max(0, basket.bounce - dt * 4);

      // spawning
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawn();
        spawnTimer = rand(0.5, 0.72);
      }

      // objects
      for (let i = objects.length - 1; i >= 0; i--) {
        const o = objects[i];
        o.y += o.vy * dt;
        o.sway += dt * 2.2;
        o.x = clamp(o.x + Math.sin(o.sway) * 14 * dt, o.r + 2, W - o.r - 2);
        o.rot += o.vr * dt;

        if (caught(o)) {
          const pts = o.type === "heart" ? 2 : 1;
          setScore(score + pts);
          popups.push({ x: o.x, y: basket.y - 6, life: 0.7, text: `+${pts}`, heart: pts === 2 });
          basket.bounce = 1;
          objects.splice(i, 1);
          continue;
        }
        if (o.y - o.r > H) objects.splice(i, 1);
      }

      for (let i = popups.length - 1; i >= 0; i--) {
        popups[i].life -= dt;
        popups[i].y -= 40 * dt;
        if (popups[i].life <= 0) popups.splice(i, 1);
      }

      if (score >= TARGET) return end(true);
      if (remaining <= 0) return end(false);
    }

    /* ---- drawing ---- */
    function drawStar(x, y, r, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 === 0 ? r : r * 0.48;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fillStyle = "#EDBE55";
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#B98A2C";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-r * 0.18, -r * 0.2, r * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.75)";
      ctx.fill();
      ctx.restore();
    }

    function drawHeart(x, y, r, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(rot) * 0.25);
      const s = r / 16;
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.bezierCurveTo(-20, 0, -16, -16, -6, -15);
      ctx.bezierCurveTo(-2, -15, 0, -12, 0, -9);
      ctx.bezierCurveTo(0, -12, 2, -15, 6, -15);
      ctx.bezierCurveTo(16, -16, 20, 0, 0, 14);
      ctx.closePath();
      ctx.fillStyle = "#E48D9E";
      ctx.fill();
      ctx.lineWidth = 1.6 / s;
      ctx.strokeStyle = "#9A4456";
      ctx.stroke();
      ctx.restore();
    }

    function roundRectPath(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawBasket() {
      const { w, h } = basket;
      const x = basket.x;
      const y = basket.y + Math.sin(basket.bounce * Math.PI) * 4;

      // handle
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + 4, w * 0.36, h * 0.62, 0, Math.PI, 0);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#B98F63";
      ctx.stroke();

      // body (slightly tapered)
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.18);
      ctx.lineTo(x + w, y + h * 0.18);
      ctx.lineTo(x + w * 0.88, y + h);
      ctx.lineTo(x + w * 0.12, y + h);
      ctx.closePath();
      ctx.fillStyle = "#E2C399";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#8C6A45";
      ctx.stroke();

      // weave
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = "rgba(140,106,69,.45)";
      ctx.lineWidth = 1.2;
      for (let i = 1; i < 4; i++) {
        const yy = y + h * 0.18 + (h * 0.82 * i) / 4;
        ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
      }
      for (let i = 1; i < 7; i++) {
        const xx = x + (w * i) / 7;
        ctx.beginPath(); ctx.moveTo(xx, y + h * 0.18); ctx.lineTo(x + w / 2 + (xx - x - w / 2) * 0.76, y + h); ctx.stroke();
      }
      ctx.restore();

      // rim
      roundRectPath(x - 3, y + h * 0.1, w + 6, h * 0.18, 5);
      ctx.fillStyle = "#C9A06E";
      ctx.fill();
      ctx.strokeStyle = "#8C6A45";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // little bow
      const bx = x + w * 0.5, by = y + h * 0.19;
      ctx.fillStyle = "#E48D9E";
      ctx.strokeStyle = "#9A4456";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(bx - 8, by, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(bx + 8, by, 8, 5, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx, by, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const o of objects) {
        if (o.type === "heart") drawHeart(o.x, o.y, o.r, o.rot);
        else drawStar(o.x, o.y, o.r, o.rot);
      }
      drawBasket();
      ctx.textAlign = "center";
      ctx.font = "600 18px Lora, Georgia, serif";
      for (const p of popups) {
        ctx.globalAlpha = Math.max(0, p.life / 0.7);
        ctx.fillStyle = p.heart ? "#9A4456" : "#8C6A1E";
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      if (!running) return;
      // clamp dt so a background tab or hiccup never skips the timer
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      update(dt);
      if (running) {
        draw();
        raf = requestAnimationFrame(loop);
      }
    }

    /* ---- input ---- */
    function pointerToTarget(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      basket.targetX = clamp(x - basket.w / 2, 0, W - basket.w);
    }
    function onPointerDown(e) {
      if (!running) return;
      dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
      pointerToTarget(e);
      e.preventDefault();
    }
    function onPointerMove(e) {
      if (!running || !dragging) return;
      pointerToTarget(e);
      e.preventDefault();
    }
    function onPointerUp(e) {
      dragging = false;
      canvas.releasePointerCapture?.(e.pointerId);
    }
    function onKeyDown(e) {
      if (!running) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { keys.left = true; e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { keys.right = true; e.preventDefault(); }
    }
    function onKeyUp(e) {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    // iOS Safari: stop the page from scrolling while a finger is on the game
    canvas.addEventListener("touchmove", (e) => { if (running) e.preventDefault(); }, { passive: false });

    /* ---- lifecycle ---- */
    function showOverlay(which) {
      [startOv, winOv, loseOv].forEach((o) => { o.hidden = o !== which; });
    }

    function init() {
      if (!resizeObs && "ResizeObserver" in window) {
        resizeObs = new ResizeObserver(() => resize());
        resizeObs.observe(canvas);
      }
      resize();
      resetState();
      showOverlay(startOv);
      draw();
    }

    function start() {
      stop();
      resize();
      resetState();
      showOverlay(null);
      keys.left = keys.right = false;
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      running = true;
      canvas.focus({ preventScroll: true });
      lastT = performance.now();
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      dragging = false;
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      keys.left = keys.right = false;
    }

    function end(won) {
      stop();
      objects = [];
      popups = [];
      draw();
      if (won) {
        showOverlay(winOv);
        $("#revealBtn").focus({ preventScroll: true });
        floatHearts(canvas, 8);
      } else {
        showOverlay(loseOv);
        $("#retryBtn").focus({ preventScroll: true });
      }
    }

    function leave() {
      stop();
      objects = [];
      popups = [];
    }

    return {
      init, start, leave,
      // read-only peek used by the automated test (index.html?test)
      _state: () => ({ running, score, elapsed, W, basket: { ...basket }, objects: objects.map((o) => ({ ...o })) }),
    };
  })();

  hooks.enter.game = Game.init;
  hooks.leave.game = Game.leave;
  $("#playBtn").addEventListener("click", Game.start);
  $("#retryBtn").addEventListener("click", Game.start);
  $("#revealBtn").addEventListener("click", () => showScene("cake"));
  $("#skipBtn").addEventListener("click", () => showScene("cake"));

  if (/[?&]test\b/.test(location.search)) { window.__birthdayGame = Game; window.__birthdaySound = sound; }

  /* -------------------------------------------------------
     Scene 4 — candles
     ------------------------------------------------------- */
  const blowBtn = $("#blowBtn");
  const cakeStage = $("#cakeStage");
  const dim = $("#dim");
  let blowTimers = [];

  function resetCake() {
    blowTimers.forEach(clearTimeout);
    blowTimers = [];
    cakeStage.classList.remove("is-out");
    dim.classList.remove("on");
    blowBtn.disabled = false;
    $("#wishStatus").textContent = "";
  }

  blowBtn.addEventListener("click", () => {
    if (blowBtn.disabled) return;
    blowBtn.disabled = true;
    cakeStage.classList.add("is-out");
    $("#wishStatus").textContent = "The candles are out. Your wish is on its way ♡";
    sound.candlesOut();
    if (!reduceMotion) {
      dim.classList.add("on");
      blowTimers.push(setTimeout(() => dim.classList.remove("on"), 900));
    }
    blowTimers.push(setTimeout(() => showScene("finale"), reduceMotion ? 700 : 1700));
  });

  hooks.enter.cake = () => { resetCake(); sound.candlesLit(); };
  hooks.leave.cake = () => {
    blowTimers.forEach(clearTimeout);
    blowTimers = [];
    dim.classList.remove("on");
    sound.leaveCandles();
  };

  /* -------------------------------------------------------
     Scene 5 — celebration
     ------------------------------------------------------- */
  const finale = $(".finale");
  const replayBtn = $("#replayBtn");
  const confettiCanvas = $("#confetti");
  const cctx = confettiCanvas.getContext("2d");
  let confettiRaf = 0;
  let celebrating = false;
  let celebrateTimer = 0;
  let portraitTried = false;

  function loadPortrait() {
    if (portraitTried || !CONFIG.portrait) return;
    portraitTried = true;
    const img = $("#portraitImg");
    img.addEventListener("load", () => { $("#portrait").hidden = false; }, { once: true });
    img.src = CONFIG.portrait; // if missing, the frame simply stays hidden
  }

  function startConfetti() {
    stopConfetti();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    confettiCanvas.width = Math.round(W * dpr);
    confettiCanvas.height = Math.round(H * dpr);
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#F4CFD2", "#E48D9E", "#C77D8B", "#EDBE55", "#F6DDB8", "#CFE0D2", "#D9CFEA", "#FFFDF8"];
    const n = W < 600 ? 90 : 140;
    const parts = [];
    for (let i = 0; i < n; i++) {
      const fromLeft = i % 2 === 0;
      const burst = i < n * 0.7;
      const angle = burst
        ? (fromLeft ? rand(-1.35, -0.75) : rand(-2.4, -1.8))
        : rand(0, Math.PI);
      const speed = burst ? rand(H * 0.9, H * 1.5) : rand(40, 120);
      parts.push({
        x: burst ? (fromLeft ? -10 : W + 10) : rand(0, W),
        y: burst ? H * rand(0.6, 0.85) : rand(-H * 0.3, -10),
        vx: Math.cos(angle) * speed * (burst ? 0.55 : 0.3),
        vy: Math.sin(angle) * speed * (burst ? 1 : -1),
        w: rand(6, 11),
        h: rand(3, 6),
        rot: rand(0, Math.PI * 2),
        vr: rand(-6, 6),
        wob: rand(0, Math.PI * 2),
        color: colors[i % colors.length],
        round: Math.random() < 0.25,
        delay: burst ? rand(0, 0.25) : rand(0, 1.2),
      });
    }

    let last = performance.now();
    const t0 = last;
    const frame = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const age = (t - t0) / 1000;
      cctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of parts) {
        if (age < p.delay) { alive++; continue; }
        p.vy += 520 * dt;              // gravity
        p.vx *= 1 - 1.6 * dt;          // air drag
        p.vy = Math.min(p.vy, 170);    // flutter, not plummet
        p.wob += dt * 6;
        p.x += (p.vx + Math.sin(p.wob) * 30) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 20) continue;
        alive++;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.scale(1, Math.cos(p.wob));   // paper "flip"
        cctx.fillStyle = p.color;
        if (p.round) {
          cctx.beginPath();
          cctx.arc(0, 0, p.h, 0, Math.PI * 2);
          cctx.fill();
        } else {
          cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        cctx.restore();
      }
      if (alive && age < 9) confettiRaf = requestAnimationFrame(frame);
      else stopConfetti();
    };
    confettiRaf = requestAnimationFrame(frame);
  }

  function stopConfetti() {
    cancelAnimationFrame(confettiRaf);
    confettiRaf = 0;
    cctx.setTransform(1, 0, 0, 1, 0, 0);
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }

  function celebrate() {
    if (celebrating) return; // no stacking celebrations
    celebrating = true;
    replayBtn.disabled = true;

    finale.classList.remove("celebrate");
    void finale.offsetWidth; // restart the CSS entrance
    finale.classList.add("celebrate");

    if (!reduceMotion) {
      releaseBalloons(window.innerWidth < 600 ? 7 : 10, { maxDelay: 1.2, minDur: 5.5, maxDur: 8 });
      startConfetti();
      floatHearts($("#finale-title"), 10);
    }

    celebrateTimer = setTimeout(() => {
      celebrating = false;
      replayBtn.disabled = false;
    }, reduceMotion ? 800 : 4200);
  }

  function leaveFinale() {
    clearTimeout(celebrateTimer);
    celebrating = false;
    replayBtn.disabled = false;
    stopConfetti();
    clearFx();
  }

  hooks.enter.finale = () => { loadPortrait(); celebrate(); sound.celebrate(); };
  hooks.leave.finale = () => { leaveFinale(); sound.leaveFinale(); };
  replayBtn.addEventListener("click", () => {
    if (celebrating) return;
    clearFx();
    celebrate();
    sound.celebrate();
  });
  $("#wishAgainBtn").addEventListener("click", () => showScene("cake"));

})();
