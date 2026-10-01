(() => {
  "use strict";

  /* =====================================================================
     Grundlagen
     ===================================================================== */
  const CFG = Object.assign({
    hochschule: "Hochschule Kaiserslautern",
    hochschuleZusatz: "University of Applied Sciences",
    modul: "Strategisches Marketing",
    lehrende: "",
    semester: "",
    logo: [],
    standardGruppen: 5,
    maxGruppen: 10,
    pitchMinuten: 3
  }, window.RR_CONFIG || {});
  const DATA = window.RR_DATA || { brands: "", targets: "", avoid: {} };
  const AVOID = DATA.avoid || {};
  const PREFIX = "rebranding-roulette:";
  const SWATCH_HEX = ["#FF7A59", "#FFC53D", "#34C6B8", "#B794FF", "#92D650", "#FF92C8", "#5BB8FF", "#F4A261", "#D4DE5A", "#A3ADFF"];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const filled = (v) => Array.isArray(v)
    ? v.some((x) => String(x == null ? "" : x).trim() !== "")
    : v !== null && v !== undefined && String(v).trim() !== "";
  const swVar = (n) => `var(--sw${((n - 1) % 10) + 1})`;
  const swHex = (n) => SWATCH_HEX[(n - 1) % 10];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const app = $("#app");

  const svgIcon = (paths, solid = false) =>
    `<svg viewBox="0 0 24 24" fill="${solid ? "currentColor" : "none"}" stroke="${solid ? "none" : "currentColor"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const ICON = {
    arrow: svgIcon('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    arrowDown: svgIcon('<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'),
    back: svgIcon('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
    shuffle: svgIcon('<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>'),
    reroll: svgIcon('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>'),
    copy: svgIcon('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),
    expand: svgIcon('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>'),
    play: svgIcon('<path d="M7 4.5v15l12.5-7.5z"/>', true),
    pause: svgIcon('<rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/>', true),
    reset: svgIcon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'),
    qr: svgIcon('<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>'),
    download: svgIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'),
    print: svgIcon('<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>'),
    bulb: svgIcon('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>')
  };

  /* =====================================================================
     Speicher: localStorage mit Rückfall auf den Arbeitsspeicher
     ===================================================================== */
  const mem = new Map();
  const store = {
    get(key) {
      if (mem.has(key)) return JSON.parse(mem.get(key));
      try {
        const raw = localStorage.getItem(PREFIX + key);
        if (raw !== null) return JSON.parse(raw);
      } catch (e) { /* nicht verfügbar */ }
      return null;
    },
    set(key, value) {
      const raw = JSON.stringify(value);
      mem.set(key, raw);
      try { localStorage.setItem(PREFIX + key, raw); } catch (e) { /* nicht verfügbar */ }
    },
    remove(key) {
      mem.delete(key);
      try { localStorage.removeItem(PREFIX + key); } catch (e) { /* nicht verfügbar */ }
    },
    keys(prefix) {
      const out = new Set();
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(PREFIX + prefix)) out.add(k.slice(PREFIX.length));
        }
      } catch (e) { /* nicht verfügbar */ }
      for (const k of mem.keys()) if (k.startsWith(prefix)) out.add(k);
      return Array.from(out);
    }
  };

  /* =====================================================================
     Branding
     ===================================================================== */
  function applyBranding() {
    $("#wm-name").textContent = CFG.hochschule;
    $("#wm-sub").textContent = CFG.hochschuleZusatz;
    $("#course-title").textContent = CFG.modul;
    $("#course-meta").textContent = [CFG.lehrende, CFG.semester].filter(Boolean).join(" · ");
    const logo = $("#logo");
    const sources = (CFG.logo || []).slice();
    const tryNext = () => {
      const src = sources.shift();
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        logo.src = src;
        logo.alt = CFG.hochschule;
        logo.hidden = false;
        $("#wordmark").classList.add("sr-only");
      };
      img.onerror = tryNext;
      img.src = src;
    };
    tryNext();
  }

  /* =====================================================================
     Listen (Marken und Zielgruppen)
     ===================================================================== */
  function parseLines(text) {
    const seen = new Set();
    const rows = [];
    for (const raw of String(text || "").split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const parts = line.split("|").map((p) => p.trim());
      const key = parts[0].toLowerCase();
      if (!parts[0] || seen.has(key)) continue;
      seen.add(key);
      rows.push(parts);
    }
    return rows;
  }
  const parseBrands = (text) => parseLines(text).map(([name, heute = "", branche = ""]) => ({ name, heute, branche }));
  const parseTargets = (text) => parseLines(text).map(([name, info = ""]) => ({ name, info }));

  const DEFAULT_BRANDS = parseBrands(DATA.brands);
  const DEFAULT_TARGETS = parseTargets(DATA.targets);
  const DEFAULT_BRAND_NAMES = new Set(DEFAULT_BRANDS.map((b) => b.name));
  const DEFAULT_TARGET_NAMES = new Set(DEFAULT_TARGETS.map((t) => t.name));

  const pool = { brandText: "", targetText: "", brands: [], targets: [], brandMap: new Map(), targetMap: new Map() };
  function setPools(bText, tText) {
    pool.brandText = bText;
    pool.targetText = tText;
    pool.brands = parseBrands(bText);
    pool.targets = parseTargets(tText);
    pool.brandMap = new Map(pool.brands.map((b) => [b.name, b]));
    pool.targetMap = new Map(pool.targets.map((t) => [t.name, t]));
  }
  const brandInfo = (name) => pool.brandMap.get(name) || DEFAULT_BRANDS.find((b) => b.name === name) || null;
  const targetInfo = (name) => pool.targetMap.get(name) || DEFAULT_TARGETS.find((t) => t.name === name) || null;
  const maxGroups = () => Math.max(1, Math.min(CFG.maxGruppen, pool.brands.length, pool.targets.length));
  const avoided = (brand, target) => (AVOID[brand] || []).includes(target);

  /* =====================================================================
     Auslosung
     ===================================================================== */
  let groups = [];
  let busy = false;

  function pickTarget(brand, used) {
    const free = pool.targets.map((t) => t.name).filter((n) => !used.has(n));
    const fitting = free.filter((n) => !avoided(brand, n));
    return pick(fitting.length ? fitting : free);
  }
  function pickBrand(target, used) {
    const free = pool.brands.map((b) => b.name).filter((n) => !used.has(n));
    const fitting = target ? free.filter((n) => !avoided(n, target)) : free;
    return pick(fitting.length ? fitting : free);
  }
  function drawAll(count) {
    const chosen = shuffle(pool.brands).slice(0, count).map((b) => b.name);
    const usedTargets = new Set();
    return chosen.map((brand, i) => {
      const target = pickTarget(brand, usedTargets);
      usedTargets.add(target);
      return { brand, target, team: (groups[i] && groups[i].team) || "" };
    });
  }
  // Ersetzt Einträge, die nicht mehr in den Listen stehen oder doppelt vergeben sind.
  function repair() {
    const usedB = new Set();
    const usedT = new Set();
    groups.forEach((g) => {
      if (!pool.brandMap.has(g.brand) || usedB.has(g.brand)) g.brand = pickBrand(null, usedB);
      usedB.add(g.brand);
    });
    groups.forEach((g) => {
      if (!pool.targetMap.has(g.target) || usedT.has(g.target)) g.target = pickTarget(g.brand, usedT);
      usedT.add(g.target);
    });
  }
  const saveGroups = () => store.set("state", { groups });

  /* =====================================================================
     Timer, Ton, Bildschirm wach halten
     ===================================================================== */
  let audioCtx = null;
  let wakeLock = null;
  const countdowns = [];
  const fmt = (ms) => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };
  function unlockAudio() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx && Ctx) audioCtx = new Ctx();
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    } catch (e) { audioCtx = null; }
  }
  function chime() {
    if (!audioCtx) return;
    try {
      [[0, 784], [0.35, 784], [0.7, 1046.5]].forEach(([d, f]) => {
        const t0 = audioCtx.currentTime + d;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.34);
      });
    } catch (e) { /* kein Ton möglich */ }
  }
  async function updateWake() {
    const running = countdowns.some((c) => c.state === "running");
    try {
      if (running && !wakeLock && navigator.wakeLock && document.visibilityState === "visible") {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", () => { wakeLock = null; });
      } else if (!running && wakeLock) {
        await wakeLock.release();
        wakeLock = null;
      }
    } catch (e) { wakeLock = null; }
  }

  class Countdown {
    constructor(id, minutes, doneMsg) {
      this.id = id;
      this.total = minutes * 60000;
      this.remaining = this.total;
      this.state = "idle";
      this.end = 0;
      this.iv = null;
      this.doneMsg = doneMsg;
      countdowns.push(this);
    }
    setMinutes(m) { this.total = m * 60000; this.reset(); }
    start() {
      unlockAudio();
      if (this.state === "done") this.remaining = this.total;
      this.end = Date.now() + this.remaining;
      this.state = "running";
      clearInterval(this.iv);
      this.iv = setInterval(() => this.tick(), 250);
      updateWake();
      this.sync();
    }
    tick() {
      this.remaining = this.end - Date.now();
      if (this.remaining <= 0) {
        this.remaining = 0;
        clearInterval(this.iv);
        this.state = "done";
        updateWake();
        chime();
        toast(this.doneMsg);
      }
      this.sync();
    }
    pause() {
      if (this.state !== "running") return;
      clearInterval(this.iv);
      this.remaining = Math.max(0, this.end - Date.now());
      this.state = "paused";
      updateWake();
      this.sync();
    }
    reset() {
      clearInterval(this.iv);
      this.state = "idle";
      this.remaining = this.total;
      updateWake();
      this.sync();
    }
    toggle() { if (this.state === "running") this.pause(); else this.start(); }
    sync() {
      const el = document.getElementById(this.id);
      if (!el) return;
      el.dataset.state = this.state;
      const display = document.getElementById(this.id + "-display");
      if (display) display.textContent = fmt(this.remaining);
      const toggle = document.getElementById(this.id + "-toggle");
      if (toggle) {
        const running = this.state === "running";
        toggle.innerHTML = running ? ICON.pause : ICON.play;
        toggle.setAttribute("aria-label", running ? "Timer pausieren" : "Timer starten");
      }
      const sel = document.getElementById(this.id + "-min");
      if (sel) {
        sel.disabled = this.state === "running" || this.state === "paused";
        sel.value = String(Math.round(this.total / 60000));
      }
    }
  }
  const drawTimer = new Countdown("draw-timer", 30, "Die Arbeitsphase ist vorbei.");
  const pitchTimer = new Countdown("pitch-timer", CFG.pitchMinuten, "Die Pitch-Zeit ist um.");
  const TIMERS = { "draw-timer": drawTimer, "pitch-timer": pitchTimer };

  function timerHtml(cd, label, options) {
    const minutes = Math.round(cd.total / 60000);
    return `<div class="timer" id="${cd.id}" data-state="${cd.state}">
      ${options
        ? `<label class="label" for="${cd.id}-min">${esc(label)}</label>
           <select class="select" id="${cd.id}-min">${options.map((m) => `<option value="${m}"${m === minutes ? " selected" : ""}>${m} min</option>`).join("")}</select>`
        : `<span class="label">${esc(label)}</span>`}
      <span class="timer-display" id="${cd.id}-display" role="timer">${fmt(cd.remaining)}</span>
      <button type="button" class="icon-btn primary" id="${cd.id}-toggle" data-timer="${cd.id}" data-timer-action="toggle" aria-label="Timer starten">${ICON.play}</button>
      <button type="button" class="icon-btn" data-timer="${cd.id}" data-timer-action="reset" aria-label="Timer zurücksetzen">${ICON.reset}</button>
    </div>`;
  }

  /* =====================================================================
     Toast, Dialog, Kopieren, Vollbild
     ===================================================================== */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3400);
  }

  const modal = $("#modal");
  function openModal(title, html) {
    $("#modal-title").textContent = title;
    $("#modal-body").innerHTML = html;
    if (!modal.open) {
      try { modal.showModal(); } catch (e) { modal.setAttribute("open", ""); }
    }
  }
  function closeModal() {
    if (!modal.open) return;
    try { modal.close(); } catch (e) { modal.removeAttribute("open"); }
  }
  $("#modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  function copyText(text, okMsg) {
    const fallback = () => {
      openModal("Text kopieren", `<p>Das automatische Kopieren wurde blockiert. Der Text ist markiert, kopiert ihn mit Strg+C bzw. ⌘C.</p>
        <textarea class="input mono-area" id="copy-area" readonly aria-label="Text zum Kopieren">${esc(text)}</textarea>`);
      const ta = $("#copy-area");
      ta.focus();
      ta.select();
    };
    try {
      navigator.clipboard.writeText(text).then(() => toast(okMsg), fallback);
    } catch (e) {
      fallback();
    }
  }

  function toggleFullscreen(el) {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (!document.fullscreenEnabled) {
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      toast("Vollbild ist in diesem Browser nicht verfügbar.");
      return;
    }
    (el || document.documentElement).requestFullscreen().catch(() => toast("Vollbild ist hier nicht verfügbar."));
  }
  function updateFsLabels() {
    const on = !!document.fullscreenElement;
    $$("[data-action='fullscreen'] span").forEach((s) => { s.textContent = on ? "Vollbild beenden" : "Vollbild"; });
    $$("[data-action='present'] span").forEach((s) => { s.textContent = on ? "Präsentation beenden" : "Präsentieren"; });
  }
  document.addEventListener("fullscreenchange", updateFsLabels);

  /* =====================================================================
     Links und QR-Codes
     ===================================================================== */
  const baseUrl = () => location.href.split("#")[0];
  function wsHash(n, g, step = "analyse") {
    const q = new URLSearchParams();
    q.set("m", g.brand);
    q.set("z", g.target);
    if (g.team) q.set("t", g.team);
    if (!DEFAULT_BRAND_NAMES.has(g.brand)) {
      const b = brandInfo(g.brand);
      if (b && b.heute) q.set("h", b.heute);
      if (b && b.branche) q.set("b", b.branche);
    }
    if (!DEFAULT_TARGET_NAMES.has(g.target)) {
      const t = targetInfo(g.target);
      if (t && t.info) q.set("i", t.info);
    }
    return `#g/${n}/${step}?${q.toString()}`;
  }
  function qrSvg(text) {
    if (typeof window.qrcode !== "function") return "";
    try {
      const qr = window.qrcode(0, "M");
      qr.addData(text);
      qr.make();
      return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: "QR-Code zum Arbeitsbereich" });
    } catch (e) {
      return "";
    }
  }
  function localNote() {
    if (location.protocol !== "file:") return "";
    return `<p class="warn-note"><b>Hinweis:</b> Die Seite ist gerade als lokale Datei geöffnet. QR-Codes funktionieren erst, wenn die Seite online erreichbar ist, zum Beispiel über GitHub Pages. Bis dahin öffnen Gruppen ihren Arbeitsbereich auf der Startseite unter „Arbeitsbereich öffnen“.</p>`;
  }
  function showQr(i) {
    const g = groups[i];
    const n = i + 1;
    const url = baseUrl() + wsHash(n, g);
    openModal(`QR-Code für Gruppe ${n}`, `
      <div class="qr-single" style="--sw:${swVar(n)}">
        <div class="qr-box">${qrSvg(url) || "<p>QR-Code konnte nicht erzeugt werden.</p>"}</div>
        <div class="field">
          <p class="eyebrow">Mission für Gruppe ${n}</p>
          <p class="mission">${esc(g.brand)} ${ICON.arrow} <span class="to">${esc(g.target)}</span></p>
          ${g.team ? `<p class="muted">${esc(g.team)}</p>` : ""}
          <p>Scannt den Code mit der Handykamera. Ihr landet direkt in eurem Arbeitsbereich.</p>
          <div class="link-field">
            <input class="input" id="qr-link" readonly value="${esc(url)}" aria-label="Link zum Arbeitsbereich">
            <button class="btn" type="button" data-action="copy-link">${ICON.copy} Link kopieren</button>
          </div>
          ${localNote()}
        </div>
      </div>`);
  }
  function showAllQr() {
    openModal("QR-Codes aller Gruppen", `
      ${localNote()}
      <div class="qr-grid">
        ${groups.map((g, i) => {
          const n = i + 1;
          const url = baseUrl() + wsHash(n, g);
          return `<div class="qr-item" style="--sw:${swVar(n)}">
            <p class="eyebrow">Gruppe ${n}${g.team ? " · " + esc(g.team) : ""}</p>
            <div class="qr-box">${qrSvg(url)}</div>
            <p><b>${esc(g.brand)}</b> → ${esc(g.target)}</p>
          </div>`;
        }).join("")}
      </div>`);
  }

  /* =====================================================================
     Router
     ===================================================================== */
  let currentView = "";
  let viewCleanup = [];
  let firstRoute = true;

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const qi = raw.indexOf("?");
    const path = qi >= 0 ? raw.slice(0, qi) : raw;
    const query = qi >= 0 ? raw.slice(qi + 1) : "";
    const parts = path.split("/").filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch (e) { return p; } });
    return { parts, params: new URLSearchParams(query) };
  }

  function route() {
    flushSave();
    viewCleanup.forEach((fn) => { try { fn(); } catch (e) { /* ignorieren */ } });
    viewCleanup = [];
    closeModal();
    const { parts, params } = parseHash();
    if (parts[0] === "auslosung") renderDraw();
    else if (parts[0] === "g" && /^\d+$/.test(parts[1] || "")) openWorkspace(Number(parts[1]), parts[2], params);
    else renderStart();
    updateNav();
    updateFsLabels();
    window.scrollTo(0, 0);
    if (!firstRoute) app.focus({ preventScroll: true });
    firstRoute = false;
  }

  function updateNav() {
    $$(".site-nav a[data-nav]").forEach((a) => {
      const on = (a.dataset.nav === "start" && currentView === "start")
        || (a.dataset.nav === "auslosung" && currentView === "draw")
        || (a.dataset.nav === "gruppe" && currentView === "ws");
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const last = store.get("last");
    const link = $("#nav-group");
    if (last && last.n) {
      link.hidden = false;
      link.href = `#g/${last.n}/${last.step || "analyse"}`;
      link.textContent = `Gruppe ${last.n}`;
    } else {
      link.hidden = true;
    }
  }

  /* =====================================================================
     Slot-Animation
     ===================================================================== */
  function spin(nameEl, hostEl, names, duration) {
    const finalName = nameEl.textContent;
    if (reduceMotion.matches || names.length < 2) return Promise.resolve();
    hostEl.classList.remove("landed");
    hostEl.classList.add("spinning");
    return new Promise((resolve) => {
      const start = performance.now();
      let last = -Infinity;
      let prev = finalName;
      const tick = (now) => {
        const p = (now - start) / duration;
        if (p >= 1) {
          nameEl.textContent = finalName;
          hostEl.classList.remove("spinning");
          void hostEl.offsetWidth;
          hostEl.classList.add("landed");
          setTimeout(() => hostEl.classList.remove("landed"), 750);
          resolve();
          return;
        }
        if (now - last >= 45 + 230 * p * p) {
          last = now;
          let next;
          do { next = pick(names); } while (next === prev);
          prev = next;
          nameEl.textContent = next;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* =====================================================================
     Ansicht: Start
     ===================================================================== */
  function joinFormHtml(preN, heading) {
    const n = preN || 1;
    const g = groups[n - 1];
    const brandOpts = pool.brands.map((b) => `<option value="${esc(b.name)}"${g && g.brand === b.name ? " selected" : ""}>${esc(b.name)}</option>`).join("");
    const targetOpts = pool.targets.map((t) => `<option value="${esc(t.name)}"${g && g.target === t.name ? " selected" : ""}>${esc(t.name)}</option>`).join("");
    const groupOpts = Array.from({ length: CFG.maxGruppen }, (_, i) => `<option value="${i + 1}"${i + 1 === n ? " selected" : ""}>${i + 1}</option>`).join("");
    return `<form class="panel" id="join-form">
      <div class="field">
        <p class="eyebrow">Für Gruppen</p>
        <h2>${heading || "Arbeitsbereich öffnen"}</h2>
        <p class="muted">Am einfachsten scannt ihr den QR-Code eurer Gruppe. Ohne QR-Code wählt ihr eure Kombination hier aus.</p>
      </div>
      <div class="join-grid">
        <label class="field"><span class="field-label">Gruppe</span><select class="input" id="join-group">${groupOpts}</select></label>
        <label class="field"><span class="field-label">Marke</span><select class="input" id="join-brand">${brandOpts}</select></label>
        <label class="field"><span class="field-label">Neue Zielgruppe</span><select class="input" id="join-target">${targetOpts}</select></label>
      </div>
      <div class="row"><button class="btn primary" type="submit">Zum Arbeitsbereich ${ICON.arrow}</button></div>
    </form>`;
  }

  function listWorkspaces() {
    return store.keys("ws:")
      .map((key) => ({ key, ws: store.get(key) }))
      .filter((x) => x.ws && x.ws.brand && x.ws.target)
      .map((x) => ({ key: x.key, ws: mergeDefaults(newWs(x.ws.group || 1, x.ws), x.ws) }))
      .sort((a, b) => (b.ws.updated || 0) - (a.ws.updated || 0));
  }
  function timeLabel(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    const today = new Date();
    const time = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    return d.toDateString() === today.toDateString() ? `heute, ${time}` : `${d.toLocaleDateString("de-DE")}, ${time}`;
  }
  function wsCardHtml({ key, ws }) {
    const p = overallProgress(ws);
    return `<article class="ws-card" style="--sw:${swVar(ws.group)}">
      <div class="ws-card-body">
        <p class="eyebrow">Gruppe ${ws.group}${ws.team ? " · " + esc(ws.team) : ""}</p>
        <p class="ws-card-title">${esc(ws.brand)} → ${esc(ws.target)}</p>
        <div class="progress" role="progressbar" aria-label="Fortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"><span style="width:${p}%"></span></div>
        <div class="row">
          <span class="muted">${p} % bearbeitet · ${esc(timeLabel(ws.updated))}</span>
          <span class="row">
            <button type="button" class="btn sm" data-action="ws-delete" data-key="${esc(key)}">Löschen</button>
            <a class="btn sm primary" href="${esc(wsHash(ws.group, ws, ws.lastStep || "analyse"))}">Weiterarbeiten</a>
          </span>
        </div>
      </div>
    </article>`;
  }

  function renderStart() {
    currentView = "start";
    const list = listWorkspaces();
    app.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <p class="eyebrow">${esc(CFG.modul)}${CFG.lehrende ? " · " + esc(CFG.lehrende) : ""}</p>
          <h1 class="display">Rebranding-<wbr>Roulette</h1>
          <p class="lead">Jede Gruppe zieht eine bekannte Marke und eine neue Zielgruppe, die bisher nicht zur Marke gehört. In sieben Feldern entwickelt ihr zu zweit das Rebranding und stellt es am Ende als Pitch vor.</p>
          <div class="hero-actions">
            <a class="btn primary lg" href="#auslosung">${ICON.shuffle} Zur Auslosung</a>
            <button type="button" class="btn lg" data-action="scroll-join">Arbeitsbereich öffnen</button>
          </div>
        </div>
        <div class="demo" aria-hidden="true">
          <div class="demo-strip">${[1, 2, 3, 4, 5].map((n) => `<span style="background:${swVar(n)}"></span>`).join("")}</div>
          <div class="demo-body">
            <div class="demo-slot"><span class="label">Marke</span><span class="demo-name" id="demo-brand">Haribo</span></div>
            <span class="demo-arrow">${ICON.arrowDown}</span>
            <div class="demo-slot demo-target"><span class="label">Neue Zielgruppe</span><span class="demo-name" id="demo-target">Fitness-Bubble</span></div>
          </div>
          <div class="demo-foot">Zum Beispiel Süßigkeiten für die Fitness-Bubble</div>
        </div>
      </section>

      <section class="flow" aria-labelledby="flow-h">
        <h2 id="flow-h">So läuft die Stunde ab</h2>
        <ol class="flow-steps">
          <li><h3>Auslosen</h3><p>Am Beamer bekommt jede Gruppe zufällig eine Marke und eine neue Zielgruppe.</p></li>
          <li><h3>Arbeitsbereich öffnen</h3><p>Per QR-Code oder Klick landet jede Gruppe in ihrem eigenen Arbeitsbereich.</p></li>
          <li><h3>Felder bearbeiten</h3><p>Vom Markensteuerrad über Persona und Positionierung bis zum Marketing-Mix. Alles speichert automatisch.</p></li>
          <li><h3>Pitchen</h3><p>Das Pitch-Board fasst eure Ergebnisse auf einer Seite zusammen, bereit für ${CFG.pitchMinuten} Minuten Präsentation.</p></li>
        </ol>
      </section>

      <section class="entry" id="oeffnen">
        <div class="panel">
          <div class="field">
            <p class="eyebrow">Für die Stundenleitung</p>
            <h2>Auslosung am Beamer</h2>
            <p class="muted">Gruppen anlegen, Marken und Zielgruppen auslosen, QR-Codes zeigen und die Arbeitsphase mit dem Timer begleiten.</p>
          </div>
          <div class="row"><a class="btn primary" href="#auslosung">${ICON.shuffle} Auslosung starten</a></div>
        </div>
        ${joinFormHtml(1)}
      </section>

      ${list.length ? `<section class="flow" aria-labelledby="saved-h">
        <h2 id="saved-h">Auf diesem Gerät gespeichert</h2>
        <div class="ws-list">${list.map(wsCardHtml).join("")}</div>
      </section>` : ""}`;
    startDemo();
  }

  function startDemo() {
    const b = $("#demo-brand");
    const t = $("#demo-target");
    if (!b || !t) return;
    const bNames = DEFAULT_BRANDS.map((x) => x.name);
    const tNames = DEFAULT_TARGETS.map((x) => x.name);
    if (!bNames.length || !tNames.length) return;
    let alive = true;
    let timer = null;
    const step = async () => {
      if (!alive) return;
      if (document.visibilityState === "visible") {
        let brand;
        let target;
        do { brand = pick(bNames); target = pick(tNames); } while (avoided(brand, target));
        b.textContent = brand;
        t.textContent = target;
        await Promise.all([spin(b, b.parentElement, bNames, 900), spin(t, t.parentElement, tNames, 1300)]);
      }
      if (alive) timer = setTimeout(step, reduceMotion.matches ? 4000 : 2600);
    };
    timer = setTimeout(step, 2200);
    viewCleanup.push(() => { alive = false; clearTimeout(timer); });
  }

  /* =====================================================================
     Ansicht: Auslosung
     ===================================================================== */
  function renderDraw() {
    currentView = "draw";
    app.innerHTML = `
      <section class="view-head">
        <p class="eyebrow">${esc(CFG.modul)} · Auslosung</p>
        <h1 class="h-view">Wer bekommt welche Marke?</h1>
        <p class="lead">Lost für jede Gruppe eine Marke und eine neue Zielgruppe aus. Tragt danach die Namen ein und zeigt die QR-Codes. So landet jede Gruppe direkt in ihrem Arbeitsbereich.</p>
      </section>

      <div class="toolbar">
        <div class="tool-group">
          <div class="stepper">
            <span class="label" id="lbl-groups">Gruppen</span>
            <button type="button" data-action="grp-minus" id="grp-minus" aria-label="Eine Gruppe weniger">−</button>
            <output id="grp-count" aria-labelledby="lbl-groups">${groups.length}</output>
            <button type="button" data-action="grp-plus" id="grp-plus" aria-label="Eine Gruppe mehr">+</button>
          </div>
          <button type="button" class="btn primary" data-action="draw-all" id="draw-all">${ICON.shuffle} Alle auslosen</button>
          <button type="button" class="btn" data-action="qr-all">${ICON.qr} QR-Codes zeigen</button>
          <button type="button" class="btn" data-action="copy-result">${ICON.copy} Ergebnis kopieren</button>
          <button type="button" class="btn" data-action="fullscreen"${document.fullscreenEnabled ? "" : " hidden"}>${ICON.expand} <span>Vollbild</span></button>
        </div>
        ${timerHtml(drawTimer, "Arbeitsphase", [10, 15, 20, 30, 45, 60, 90])}
      </div>

      <ol class="groups" id="groups" aria-label="Auslosung der Gruppen"></ol>

      <details class="pools" id="pools">
        <summary>Listen bearbeiten <span class="muted" id="pool-sizes"></span></summary>
        <div class="pool-body">
          <div class="grid-2">
            <div class="field">
              <label class="field-label" for="pool-brands">Marken</label>
              <span class="field-hint">Eine pro Zeile: Name | heutige Zielgruppe | Branche</span>
              <textarea class="input mono-area" id="pool-brands" spellcheck="false"></textarea>
            </div>
            <div class="field">
              <label class="field-label" for="pool-targets">Neue Zielgruppen</label>
              <span class="field-hint">Eine pro Zeile: Name | Stichworte</span>
              <textarea class="input mono-area" id="pool-targets" spellcheck="false"></textarea>
            </div>
          </div>
          <div class="row">
            <button type="button" class="btn primary" data-action="pool-apply" id="pool-apply">Listen übernehmen</button>
            <button type="button" class="btn" data-action="pool-reset" id="pool-reset">Standardlisten wiederherstellen</button>
            <span class="pool-msg" id="pool-msg" role="status"></span>
          </div>
        </div>
      </details>`;
    $("#pool-brands").value = pool.brandText;
    $("#pool-targets").value = pool.targetText;
    renderGroups();
    drawTimer.sync();
  }

  function groupRowHtml(g, i) {
    const n = i + 1;
    const b = brandInfo(g.brand) || { name: g.brand, heute: "", branche: "" };
    const t = targetInfo(g.target) || { name: g.target, info: "" };
    return `
      <div class="tag"><span class="label">Gruppe</span><span class="tag-num">${n}</span></div>
      <div class="slot slot-brand">
        <span class="label">Marke</span>
        <span class="slot-name">${esc(g.brand)}</span>
        <span class="slot-meta">${b.branche ? `<span class="chip">${esc(b.branche)}</span>` : ""}${b.heute ? `<span>Heute: ${esc(b.heute)}</span>` : ""}</span>
      </div>
      <div class="arrow">${ICON.arrow}</div>
      <div class="slot slot-target">
        <span class="label">Neue Zielgruppe</span>
        <span class="slot-name">${esc(g.target)}</span>
        <span class="slot-meta">${t.info ? `<span>${esc(t.info)}</span>` : ""}</span>
      </div>
      <div class="actions">
        <button type="button" class="mini" data-reroll="brand" data-i="${i}" aria-label="Marke für Gruppe ${n} neu ziehen">${ICON.reroll}Marke</button>
        <button type="button" class="mini" data-reroll="target" data-i="${i}" aria-label="Zielgruppe für Gruppe ${n} neu ziehen">${ICON.reroll}Zielgruppe</button>
      </div>
      <div class="group-foot">
        <input class="team-input" id="team-${n}" data-team="${i}" value="${esc(g.team || "")}" placeholder="Namen eintragen, z. B. Lea & Tim" aria-label="Namen der Gruppe ${n}">
        <button type="button" class="btn sm" data-action="qr" data-i="${i}">${ICON.qr} QR-Code</button>
        <a class="btn sm primary" data-open="${i}" href="${esc(wsHash(n, g))}">Arbeitsbereich öffnen ${ICON.arrow}</a>
      </div>`;
  }
  function groupRowEl(g, i) {
    const li = document.createElement("li");
    li.className = "group";
    li.style.setProperty("--sw", swVar(i + 1));
    li.innerHTML = groupRowHtml(g, i);
    return li;
  }
  function renderGroups() {
    const list = $("#groups");
    if (!list) return;
    list.replaceChildren(...groups.map(groupRowEl));
    const sizes = $("#pool-sizes");
    if (sizes) sizes.textContent = `${pool.brands.length} Marken · ${pool.targets.length} Zielgruppen`;
    updateDrawControls();
  }
  function replaceGroupRow(i) {
    const list = $("#groups");
    if (!list) return;
    const fresh = groupRowEl(groups[i], i);
    const old = list.children[i];
    if (old) old.replaceWith(fresh); else list.appendChild(fresh);
    updateDrawControls();
  }
  function updateDrawControls() {
    const count = $("#grp-count");
    if (!count) return;
    count.textContent = groups.length;
    $("#grp-minus").disabled = busy || groups.length <= 1;
    $("#grp-plus").disabled = busy || groups.length >= maxGroups();
    $("#draw-all").disabled = busy;
    $("#pool-apply").disabled = busy;
    $$("#groups .mini").forEach((b) => { b.disabled = busy; });
  }
  function setBusy(v) { busy = v; updateDrawControls(); }

  async function animateSlots(jobs) {
    setBusy(true);
    const brandNames = pool.brands.map((b) => b.name);
    const targetNames = pool.targets.map((t) => t.name);
    const list = $("#groups");
    await Promise.all(jobs.map(({ i, kind, ms }) => {
      const row = list && list.children[i];
      if (!row) return null;
      const slot = row.querySelector(kind === "brand" ? ".slot-brand" : ".slot-target");
      return spin(slot.querySelector(".slot-name"), slot, kind === "brand" ? brandNames : targetNames, ms);
    }));
    setBusy(false);
  }

  function drawAllAnimated() {
    if (busy) return;
    groups = drawAll(groups.length);
    saveGroups();
    renderGroups();
    const jobs = [];
    groups.forEach((_, i) => {
      jobs.push({ i, kind: "brand", ms: 750 + i * 260 });
      jobs.push({ i, kind: "target", ms: 1250 + i * 260 });
    });
    animateSlots(jobs);
  }
  function reroll(i, kind) {
    if (busy || !groups[i]) return;
    const g = groups[i];
    if (kind === "brand") {
      const used = new Set(groups.map((x) => x.brand));
      if (used.size >= pool.brands.length) { toast("Alle Marken der Liste sind schon vergeben."); return; }
      g.brand = pickBrand(g.target, used);
    } else {
      const used = new Set(groups.map((x) => x.target));
      if (used.size >= pool.targets.length) { toast("Alle Zielgruppen der Liste sind schon vergeben."); return; }
      g.target = pickTarget(g.brand, used);
    }
    saveGroups();
    replaceGroupRow(i);
    animateSlots([{ i, kind, ms: 900 }]);
  }
  function addGroup() {
    if (busy || groups.length >= maxGroups()) return;
    const brand = pickBrand(null, new Set(groups.map((g) => g.brand)));
    const target = pickTarget(brand, new Set(groups.map((g) => g.target)));
    groups.push({ brand, target, team: "" });
    saveGroups();
    const i = groups.length - 1;
    replaceGroupRow(i);
    animateSlots([{ i, kind: "brand", ms: 750 }, { i, kind: "target", ms: 1250 }]);
  }
  function removeGroup() {
    if (busy || groups.length <= 1) return;
    groups.pop();
    saveGroups();
    const list = $("#groups");
    if (list && list.lastElementChild) list.lastElementChild.remove();
    updateDrawControls();
  }
  function resultText() {
    const date = new Date().toLocaleDateString("de-DE");
    const lines = groups.map((g, i) => `Gruppe ${i + 1}${g.team ? ` (${g.team})` : ""}: ${g.brand} → ${g.target}`);
    return `Rebranding-Roulette · ${CFG.modul} · Auslosung vom ${date}\n\n${lines.join("\n")}`;
  }

  function poolMsg(msg, isError = false) {
    const el = $("#pool-msg");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("error", isError);
  }
  function applyPools(bText, tText) {
    const b = parseBrands(bText);
    const t = parseTargets(tText);
    if (b.length < 2 || t.length < 2) {
      poolMsg("Jede Liste braucht mindestens zwei Einträge.", true);
      return false;
    }
    const before = groups.length;
    setPools(bText, tText);
    if (groups.length > maxGroups()) groups = groups.slice(0, maxGroups());
    repair();
    saveGroups();
    renderGroups();
    let msg = `Übernommen: ${pool.brands.length} Marken, ${pool.targets.length} Zielgruppen.`;
    if (groups.length < before) msg += ` Nur noch ${groups.length} Gruppen möglich, weil eine Liste kürzer ist.`;
    poolMsg(msg);
    return true;
  }
  let resetArmed = null;
  function disarmReset() {
    clearTimeout(resetArmed);
    resetArmed = null;
    const btn = $("#pool-reset");
    if (btn) { btn.textContent = "Standardlisten wiederherstellen"; btn.classList.remove("danger"); }
  }

  /* =====================================================================
     Arbeitsbereich: Datenmodell
     ===================================================================== */
  const STEPS = [
    { id: "analyse", short: "Analyse" },
    { id: "persona", short: "Persona" },
    { id: "strategie", short: "Strategie" },
    { id: "markenkern", short: "Markenkern" },
    { id: "positionierung", short: "Positionierung" },
    { id: "mix", short: "Marketing-Mix" },
    { id: "pitch", short: "Pitch" },
    { id: "board", short: "Pitch-Board" }
  ];
  const STEP_IDS = STEPS.map((s) => s.id);
  const FIELD_COUNT = STEPS.length - 1;

  const WHEEL = [
    { key: "kompetenz", title: "Markenkompetenz", q: "Wer bin ich?", hint: "z. B. Herkunft, Tradition, Rolle im Markt", side: "core" },
    { key: "attribute", title: "Markenattribute", q: "Über welche Eigenschaften verfüge ich?", hint: "z. B. Produkt, Inhaltsstoffe, Qualität, Preisniveau", side: "hard" },
    { key: "nutzen", title: "Markennutzen", q: "Was biete ich an?", hint: "z. B. funktionaler und emotionaler Nutzen", side: "hard" },
    { key: "tonalitaet", title: "Markentonalität", q: "Wie bin ich?", hint: "z. B. Persönlichkeit, Gefühle, Erlebnisse", side: "soft" },
    { key: "bild", title: "Markenbild", q: "Wie trete ich auf?", hint: "z. B. Logo, Farben, Verpackung, Werbung", side: "soft" }
  ];

  const STRATEGIES = [
    { id: "repositionierung", title: "Repositionierung", desc: "Die ganze Marke richtet sich neu aus.", pro: "Volle Markenstärke für die neue Zielgruppe", contra: "Die heutige Kundschaft kann sich abwenden", example: "Old Spice wurde von der Opa-Marke zur Kultmarke für junge Männer." },
    { id: "extension", title: "Markendehnung", desc: "Neue Produktlinie unter dem bekannten Markennamen.", pro: "Bekanntheit und Vertrauen werden übertragen", contra: "Das Markenbild kann verwässern", example: "Mars gibt es auch als Eisriegel." },
    { id: "submarke", title: "Submarke", desc: "Eigener Name und Auftritt, die Stammmarke bleibt als Absender sichtbar.", pro: "Abstand zur Stammmarke mit Vertrauensbonus", contra: "Mehr Budget für Aufbau und Pflege", example: "Ristorante von Dr. Oetker." },
    { id: "neumarke", title: "Neue Marke", desc: "Eigenständige Marke ohne sichtbare Verbindung zur Stammmarke.", pro: "Kein Risiko für die Stammmarke", contra: "Kein Imagetransfer, hohe Aufbaukosten", example: "Toyota gründete Lexus für das Luxussegment." }
  ];
  const STRAT_BY_ID = Object.fromEntries(STRATEGIES.map((s) => [s.id, s]));

  const MOTIVE = ["Preis", "Qualität", "Gesundheit", "Genuss", "Status", "Nachhaltigkeit", "Bequemlichkeit", "Zugehörigkeit", "Sicherheit", "Neugier", "Leistung"];
  const MEDIEN = ["Instagram", "TikTok", "YouTube", "Twitch", "LinkedIn", "Pinterest", "Reddit", "Discord", "WhatsApp", "Podcasts", "Streaming", "TV", "Radio", "Print", "Newsletter"];
  const PRICES = ["Premium", "Mittelfeld", "Preiswert", "Penetration", "Skimming"];
  const PLACES = ["Supermarkt", "Discounter", "Drogerie", "Online-Shop", "Amazon", "Eigene App", "Fachhandel", "Tankstelle", "Fitnessstudio", "Automaten", "Pop-up-Store", "Events & Festivals", "Apotheke", "Großhandel (B2B)"];
  const PROMOS = ["Influencer", "TikTok", "Instagram", "YouTube", "Twitch", "LinkedIn", "Podcast", "Plakat & Out-of-Home", "TV", "Radio", "Sponsoring", "Events", "Sampling", "Kooperationen", "Guerilla", "Print"];

  function newWs(n, a) {
    const wheel = () => Object.fromEntries(WHEEL.map((w) => [w.key, ""]));
    return {
      v: 1,
      group: n,
      brand: a.brand,
      target: a.target,
      team: a.team || "",
      heute: a.heute || "",
      branche: a.branche || "",
      info: a.info || "",
      created: Date.now(),
      updated: Date.now(),
      lastStep: "analyse",
      analyse: { zielgruppeHeute: "", wettbewerber: [], heute: wheel() },
      persona: { name: "", alter: 30, alltag: "", beduerfnisse: "", painpoints: "", motive: [], medien: [], zitat: "" },
      strategie: { fit: null, risiko: null, wahl: "", begruendung: "" },
      markenkern: Object.assign(wheel(), { worte: ["", "", ""] }),
      positionierung: {
        achsen: { links: "preiswert", rechts: "premium", unten: "funktional", oben: "emotional" },
        punkte: {},
        bewegt: false,
        satz: { zielgruppe: a.target, beduerfnis: "", marke: a.brand, kategorie: "", nutzen: "", wettbewerber: "", rtb: "" }
      },
      mix: { produkt: "", verpackung: "", preisStrategie: "", preis: "", place: [], placeText: "", promotion: [], botschaft: "" },
      pitch: { name: "", claim: "", motiv: "", gruende: ["", "", ""], farbe: swHex(n) }
    };
  }
  const isPlain = (o) => o && typeof o === "object" && !Array.isArray(o);
  function mergeDefaults(base, saved) {
    if (!isPlain(saved)) return base;
    for (const k of Object.keys(saved)) {
      if (isPlain(base[k]) && isPlain(saved[k])) mergeDefaults(base[k], saved[k]);
      else if (saved[k] !== undefined) base[k] = saved[k];
    }
    return base;
  }
  const getPath = (o, path) => path.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), o);
  function setPath(o, path, v) {
    const ks = path.split(".");
    let cur = o;
    ks.slice(0, -1).forEach((k) => {
      if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
      cur = cur[k];
    });
    cur[ks[ks.length - 1]] = v;
  }

  const CHECKS = {
    analyse: (ws) => [ws.analyse.zielgruppeHeute, ws.analyse.wettbewerber, ...WHEEL.map((w) => ws.analyse.heute[w.key])],
    persona: (ws) => { const p = ws.persona; return [p.name, p.alltag, p.beduerfnisse, p.painpoints, p.motive, p.medien, p.zitat]; },
    strategie: (ws) => { const s = ws.strategie; return [s.fit, s.risiko, s.wahl, s.begruendung]; },
    markenkern: (ws) => [...WHEEL.map((w) => ws.markenkern[w.key]), ws.markenkern.worte],
    positionierung: (ws) => { const p = ws.positionierung; return [p.bewegt ? "ja" : "", ...Object.values(p.satz)]; },
    mix: (ws) => { const m = ws.mix; return [m.produkt, m.preisStrategie, m.preis, [...m.place, m.placeText], m.promotion, m.botschaft]; },
    pitch: (ws) => { const p = ws.pitch; return [p.name, p.claim, p.motiv, p.gruende]; }
  };
  function stepProgress(ws, id) {
    const list = CHECKS[id] ? CHECKS[id](ws) : [];
    return list.length ? Math.round((100 * list.filter(filled).length) / list.length) : 0;
  }
  function overallProgress(ws) {
    let total = 0;
    let done = 0;
    Object.keys(CHECKS).forEach((id) => {
      const list = CHECKS[id](ws);
      total += list.length;
      done += list.filter(filled).length;
    });
    return total ? Math.round((100 * done) / total) : 0;
  }

  /* =====================================================================
     Arbeitsbereich: Öffnen, Speichern
     ===================================================================== */
  let cur = null;
  let saveTimer = null;

  function wsKey(n, brand, target) { return `ws:${n}:${brand}|${target}`; }

  function openWorkspace(n, stepId, params) {
    let linkTeam = "";
    if (params.get("m") && params.get("z")) {
      const a = {
        brand: params.get("m"),
        target: params.get("z"),
        team: params.get("t") || "",
        heute: params.get("h") || "",
        branche: params.get("b") || "",
        info: params.get("i") || ""
      };
      linkTeam = a.team;
      store.set("assign:" + n, a);
      stepId = STEP_IDS.includes(stepId) ? stepId : "analyse";
      history.replaceState(null, "", `#g/${n}/${stepId}`);
    }
    const a = store.get("assign:" + n);
    if (!a || !a.brand || !a.target) { renderNoAssignment(n); return; }
    const key = wsKey(n, a.brand, a.target);
    if (!cur || cur.key !== key) {
      cur = { n, key, ws: mergeDefaults(newWs(n, a), store.get(key) || {}) };
    }
    if (linkTeam && !cur.ws.team) cur.ws.team = linkTeam;
    if (a.heute && !cur.ws.heute) cur.ws.heute = a.heute;
    if (a.branche && !cur.ws.branche) cur.ws.branche = a.branche;
    if (a.info && !cur.ws.info) cur.ws.info = a.info;
    const step = STEP_IDS.includes(stepId) ? stepId : (cur.ws.lastStep || "analyse");
    cur.step = step;
    cur.ws.lastStep = step;
    if (!cur.ws.analyse.zielgruppeHeute) {
      const b = brandInfo(cur.ws.brand);
      cur.ws.analyse.zielgruppeHeute = (b && b.heute) || cur.ws.heute || "";
    }
    store.set("last", { n, step });
    saveNow();
    renderWorkspace();
  }

  function renderNoAssignment(n) {
    currentView = "ws";
    cur = null;
    app.innerHTML = `
      <section class="view-head">
        <p class="eyebrow">Gruppe ${n}</p>
        <h1 class="h-view">Hier fehlt noch eure Auslosung</h1>
        <p class="lead">Auf diesem Gerät ist für Gruppe ${n} noch keine Marke hinterlegt. Scannt den QR-Code eurer Gruppe oder wählt eure Kombination aus.</p>
      </section>
      ${joinFormHtml(n, "Kombination auswählen")}`;
  }

  function saveNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (!cur) return;
    store.set(cur.key, cur.ws);
    const el = $("#ws-saved");
    if (el) el.textContent = `Gespeichert ${new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
  }
  function flushSave() { if (saveTimer) saveNow(); }
  function touch() {
    if (!cur) return;
    cur.ws.updated = Date.now();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 350);
    const el = $("#ws-saved");
    if (el) el.textContent = "Speichert …";
    refreshLive();
  }

  /* =====================================================================
     Arbeitsbereich: Bausteine
     ===================================================================== */
  const fid = (path) => "f-" + path.replace(/[^a-z0-9]+/gi, "-");
  const vPath = (path) => { const v = getPath(cur.ws, path); return v == null ? "" : v; };

  function textField(path, label, opts = {}) {
    const { hint = "", placeholder = "", area = false, rows = 3 } = opts;
    const id = fid(path);
    const control = area
      ? `<textarea class="input" id="${id}" data-field="${path}" rows="${rows}" placeholder="${esc(placeholder)}">${esc(vPath(path))}</textarea>`
      : `<input class="input" id="${id}" data-field="${path}" type="text" value="${esc(vPath(path))}" placeholder="${esc(placeholder)}">`;
    return `<div class="field">
      <label class="field-label" for="${id}">${esc(label)}</label>
      ${hint ? `<span class="field-hint">${esc(hint)}</span>` : ""}
      ${control}
    </div>`;
  }
  function chipsField(path, label, options, hint = "") {
    const arr = vPath(path) || [];
    const id = fid(path);
    return `<div class="field">
      <span class="field-label" id="${id}-label">${esc(label)}</span>
      ${hint ? `<span class="field-hint">${esc(hint)}</span>` : ""}
      <div class="chips" role="group" aria-labelledby="${id}-label">
        ${options.map((o) => `<button type="button" class="chip-btn" data-toggle="${path}" data-value="${esc(o)}" aria-pressed="${arr.includes(o)}">${esc(o)}</button>`).join("")}
      </div>
    </div>`;
  }
  function choiceChipsField(path, label, options, hint = "") {
    const v = vPath(path);
    const id = fid(path);
    return `<div class="field">
      <span class="field-label" id="${id}-label">${esc(label)}</span>
      ${hint ? `<span class="field-hint">${esc(hint)}</span>` : ""}
      <div class="chips" role="group" aria-labelledby="${id}-label">
        ${options.map((o) => `<button type="button" class="chip-btn" data-set="${path}" data-value="${esc(o)}" aria-pressed="${v === o}">${esc(o)}</button>`).join("")}
      </div>
    </div>`;
  }
  function tagListHtml(path) {
    return (vPath(path) || []).map((v) => `<span class="tag-chip">${esc(v)}<button type="button" data-remove-tag="${path}" data-value="${esc(v)}" aria-label="${esc(v)} entfernen">×</button></span>`).join("");
  }
  function tagField(path, label, placeholder, hint = "") {
    const id = fid(path);
    return `<div class="field">
      <label class="field-label" for="${id}">${esc(label)}</label>
      ${hint ? `<span class="field-hint">${esc(hint)}</span>` : ""}
      <div class="tagbox">
        <span class="tag-list" data-tag-list="${path}">${tagListHtml(path)}</span>
        <input id="${id}" data-tag-input="${path}" placeholder="${esc(placeholder)}" autocomplete="off">
        <button type="button" class="btn sm" data-add-tag="${path}">Hinzufügen</button>
      </div>
    </div>`;
  }
  function rangeField(path, label, hint, left, right) {
    const v = vPath(path);
    const id = fid(path);
    return `<div class="field">
      <label class="field-label" for="${id}">${esc(label)}</label>
      <span class="field-hint">${esc(hint)}</span>
      <div class="range-row">
        <input type="range" id="${id}" min="0" max="100" step="5" data-field="${path}" value="${v === "" ? 50 : v}">
        <output id="out-${id}" for="${id}">${v === "" ? "–" : v}</output>
      </div>
      <div class="range-ends"><span>${esc(left)}</span><span>${esc(right)}</span></div>
    </div>`;
  }
  function tip(html) { return `<div class="tip">${ICON.bulb}<div>${html}</div></div>`; }
  function intro(nr, title, lead) {
    return `<div class="step-intro">
      <p class="eyebrow">${nr ? `Feld ${nr} von ${FIELD_COUNT}` : "Ergebnis"}</p>
      <h2>${title}</h2>
      <p class="lead">${lead}</p>
    </div>`;
  }

  function wheelHtml(base, refBase) {
    const fieldFor = (w) => {
      const path = `${base}.${w.key}`;
      const id = fid(path);
      const ref = refBase ? getPath(cur.ws, `${refBase}.${w.key}`) : "";
      return `<div class="field">
        <label class="field-label" for="${id}">${w.title}</label>
        <span class="field-hint">${w.q}</span>
        <textarea class="input" id="${id}" data-field="${path}" rows="3" placeholder="${esc(w.hint)}">${esc(vPath(path))}</textarea>
        ${refBase ? `<span class="ref">Heute: ${ref ? `<b>${esc(ref)}</b>` : "noch leer"}</span>` : ""}
      </div>`;
    };
    const core = WHEEL.find((w) => w.side === "core");
    const corePath = `${base}.${core.key}`;
    const coreRef = refBase ? getPath(cur.ws, `${refBase}.${core.key}`) : "";
    return `<div class="wheel" role="group" aria-label="Markensteuerrad nach Esch">
      <div class="wheel-side wheel-left">
        <span class="label">Hard Facts · rational</span>
        ${WHEEL.filter((w) => w.side === "hard").map(fieldFor).join("")}
      </div>
      <div class="wheel-core field">
        <div class="wheel-circle">
          <label class="field-label" for="${fid(corePath)}">${core.title}</label>
          <span class="field-hint">${core.q}</span>
          <textarea class="input" id="${fid(corePath)}" data-field="${corePath}" rows="3" placeholder="${esc(core.hint)}">${esc(vPath(corePath))}</textarea>
        </div>
        ${refBase ? `<span class="ref">Heute: ${coreRef ? `<b>${esc(coreRef)}</b>` : "noch leer"}</span>` : ""}
      </div>
      <div class="wheel-side wheel-right">
        <span class="label">Soft Facts · emotional</span>
        ${WHEEL.filter((w) => w.side === "soft").map(fieldFor).join("")}
      </div>
    </div>`;
  }

  function linesOf(s) { return String(s || "").split("\n").map((x) => x.trim()).filter(Boolean); }
  function listOrEmpty(items) { return items.length ? `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="empty-note">noch offen</p>`; }
  function miniChips(items) { return items && items.length ? `<div class="mini-chips">${items.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : `<p class="empty-note">noch offen</p>`; }

  function personaCardHtml(ws) {
    const p = ws.persona;
    const initials = String(p.name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join("") || "?";
    return `<div class="persona-top">
        <span class="avatar">${esc(initials)}</span>
        <div><p class="persona-name">${esc(p.name || "Name der Persona")}</p><p class="muted">${esc(p.alter)} Jahre${p.alltag ? " · " + esc(p.alltag) : ""}</p></div>
      </div>
      ${p.zitat ? `<div class="persona-sec"><p class="quote">${esc(p.zitat)}</p></div>` : ""}
      <div class="persona-sec"><span class="label">Bedürfnisse und Ziele</span>${listOrEmpty(linesOf(p.beduerfnisse))}</div>
      <div class="persona-sec"><span class="label">Pain Points</span>${listOrEmpty(linesOf(p.painpoints))}</div>
      <div class="persona-sec"><span class="label">Kaufmotive</span>${miniChips(p.motive)}</div>
      <div class="persona-sec"><span class="label">Mediennutzung</span>${miniChips(p.medien)}</div>`;
  }

  function recommend(s) {
    if (s.fit == null || s.risiko == null) return null;
    const hiFit = s.fit >= 50;
    const hiRisk = s.risiko >= 50;
    if (hiFit) return hiRisk ? "submarke" : "extension";
    return hiRisk ? "neumarke" : "repositionierung";
  }

  function statementParts(ws) {
    const s = ws.positionierung.satz;
    return [
      ["Für ", s.zielgruppe, "Zielgruppe"], [", die ", s.beduerfnis, "Bedürfnis"], [", ist ", s.marke, "Marke"],
      [" die ", s.kategorie, "Kategorie"], [", die ", s.nutzen, "Nutzenversprechen"], [". Anders als ", s.wettbewerber, "Wettbewerber"],
      [" überzeugt sie durch ", s.rtb, "Reason to Believe"]
    ];
  }
  function statementHtml(ws) {
    return statementParts(ws).map(([pre, v, ph]) => `${pre}${v && String(v).trim() ? `<mark>${esc(String(v).trim())}</mark>` : `<mark class="empty">${ph}</mark>`}`).join("") + ".";
  }
  function statementText(ws) {
    return statementParts(ws).map(([pre, v, ph]) => `${pre}${v && String(v).trim() ? String(v).trim() : `[${ph}]`}`).join("") + ".";
  }

  /* Positionierungskreuz */
  const MAP = { size: 400, pad: 26 };
  const COMP_DEFAULTS = [{ x: 0.2, y: 0.78 }, { x: 0.82, y: 0.25 }, { x: 0.5, y: 0.12 }, { x: 0.14, y: 0.24 }];
  const toPx = (x) => MAP.pad + x * (MAP.size - 2 * MAP.pad);
  const toPy = (y) => MAP.pad + (1 - y) * (MAP.size - 2 * MAP.pad);
  function mapPoints(ws) {
    const P = ws.positionierung.punkte || {};
    const comps = (ws.analyse.wettbewerber || []).slice(0, 4);
    return [
      ...comps.map((c, i) => Object.assign({ id: "w:" + c, kind: "comp", label: c }, COMP_DEFAULTS[i], P["w:" + c])),
      Object.assign({ id: "heute", kind: "heute", label: `${ws.brand} heute` }, { x: 0.35, y: 0.38 }, P.heute),
      Object.assign({ id: "neu", kind: "neu", label: ws.pitch.name || `${ws.brand} neu` }, { x: 0.66, y: 0.72 }, P.neu)
    ];
  }
  function ptInner(pt) {
    const right = pt.x > 0.5;
    return `<circle class="pt-hit" r="22"></circle>
      <circle class="pt-dot" r="${pt.kind === "comp" ? 9 : 12}"></circle>
      <text class="pt-label" x="${right ? -18 : 18}" y="5" text-anchor="${right ? "end" : "start"}">${esc(pt.label)}</text>`;
  }
  function mapSvg(ws, interactive) {
    const S = MAP.size;
    const p = MAP.pad;
    const mid = S / 2;
    let grid = "";
    for (let i = 1; i < 8; i++) {
      const v = (p + (i * (S - 2 * p)) / 8).toFixed(1);
      grid += `<line class="map-grid" x1="${v}" y1="${p}" x2="${v}" y2="${S - p}"/><line class="map-grid" x1="${p}" y1="${v}" x2="${S - p}" y2="${v}"/>`;
    }
    const ax = ws.positionierung.achsen;
    const labels = interactive ? "" : `
      <text class="map-axis-label" x="${p + 2}" y="${mid - 8}">${esc(ax.links)}</text>
      <text class="map-axis-label" x="${S - p - 2}" y="${mid - 8}" text-anchor="end">${esc(ax.rechts)}</text>
      <text class="map-axis-label" x="${mid + 8}" y="${p + 10}">${esc(ax.oben)}</text>
      <text class="map-axis-label" x="${mid + 8}" y="${S - p - 4}">${esc(ax.unten)}</text>`;
    const kindLabel = { comp: "Wettbewerber", heute: "Heute", neu: "Nach dem Rebranding" };
    const pts = mapPoints(ws).map((pt) => `<g class="pt pt-${pt.kind}" data-pt="${esc(pt.id)}" transform="translate(${toPx(pt.x).toFixed(1)} ${toPy(pt.y).toFixed(1)})"${interactive ? ` tabindex="0" role="button" aria-describedby="map-help" aria-label="${esc(kindLabel[pt.kind] + ": " + pt.label)}"` : ""}>${ptInner(pt)}</g>`).join("");
    return `<svg class="map-svg"${interactive ? ' id="posmap"' : ""} viewBox="0 0 ${S} ${S}" role="${interactive ? "group" : "img"}" aria-label="Positionierungskreuz">
      ${grid}
      <line class="map-axis" x1="${p}" y1="${mid}" x2="${S - p}" y2="${mid}"/>
      <line class="map-axis" x1="${mid}" y1="${S - p}" x2="${mid}" y2="${p}"/>
      <path class="map-arrow" d="M${S - p + 6} ${mid} l-11 -6 v12z"/>
      <path class="map-arrow" d="M${p - 6} ${mid} l11 -6 v12z"/>
      <path class="map-arrow" d="M${mid} ${p - 6} l-6 11 h12z"/>
      <path class="map-arrow" d="M${mid} ${S - p + 6} l-6 -11 h12z"/>
      ${labels}
      ${pts}
    </svg>`;
  }
  function bindMap() {
    const svg = $("#posmap");
    if (!svg) return;
    let drag = null;
    const toNorm = (e) => {
      const r = svg.getBoundingClientRect();
      const sx = ((e.clientX - r.left) * MAP.size) / r.width;
      const sy = ((e.clientY - r.top) * MAP.size) / r.height;
      return {
        x: clamp((sx - MAP.pad) / (MAP.size - 2 * MAP.pad)),
        y: clamp(1 - (sy - MAP.pad) / (MAP.size - 2 * MAP.pad))
      };
    };
    const movePoint = (g, x, y) => {
      const id = g.dataset.pt;
      const pos = { x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 };
      cur.ws.positionierung.punkte[id] = pos;
      cur.ws.positionierung.bewegt = true;
      const pt = mapPoints(cur.ws).find((q) => q.id === id);
      g.setAttribute("transform", `translate(${toPx(pos.x).toFixed(1)} ${toPy(pos.y).toFixed(1)})`);
      if (pt) g.innerHTML = ptInner(pt);
      touch();
    };
    svg.addEventListener("pointerdown", (e) => {
      const g = e.target.closest(".pt");
      if (!g) return;
      e.preventDefault();
      drag = g;
      g.classList.add("dragging");
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* ignorieren */ }
      g.focus({ preventScroll: true });
    });
    svg.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const { x, y } = toNorm(e);
      movePoint(drag, x, y);
    });
    const end = () => { if (drag) drag.classList.remove("dragging"); drag = null; };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
    svg.addEventListener("keydown", (e) => {
      const g = e.target.closest(".pt");
      if (!g) return;
      const pt = mapPoints(cur.ws).find((q) => q.id === g.dataset.pt);
      if (!pt) return;
      const d = e.shiftKey ? 0.1 : 0.025;
      let { x, y } = pt;
      if (e.key === "ArrowLeft") x -= d;
      else if (e.key === "ArrowRight") x += d;
      else if (e.key === "ArrowUp") y += d;
      else if (e.key === "ArrowDown") y -= d;
      else return;
      e.preventDefault();
      movePoint(g, clamp(x), clamp(y));
    });
  }

  function contrastInk(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return "#FFFFFF";
    const n = parseInt(m[1], 16);
    const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
    const dark = 0.0142;
    return (L + 0.05) / (dark + 0.05) > 1.05 / (L + 0.05) ? "#142030" : "#FFFFFF";
  }
  function posterVars(ws) {
    const bg = /^#[0-9a-f]{6}$/i.test(ws.pitch.farbe || "") ? ws.pitch.farbe : swHex(ws.group);
    return `--poster-bg:${bg};--poster-fg:${contrastInk(bg)}`;
  }
  function posterHtml(ws) {
    const p = ws.pitch;
    return `<p class="poster-kicker">${esc(ws.brand)} für ${esc(ws.target)}</p>
      <p class="poster-claim">${esc(p.claim || "Euer Claim")}</p>
      <div class="field">
        <p class="poster-name">${esc(p.name || ws.brand)}</p>
        <div class="poster-foot"><span>Gruppe ${ws.group}</span><span>${esc(ws.team)}</span></div>
      </div>`;
  }

  /* =====================================================================
     Arbeitsbereich: Felder
     ===================================================================== */
  const STEP_RENDER = {
    analyse() {
      const ws = cur.ws;
      return `${intro(1, `Ist-Analyse: Wofür steht ${esc(ws.brand)} heute?`, "Bevor ihr die Marke verändert, haltet fest, was sie heute ausmacht. Nutzt dafür das Markensteuerrad nach Esch.")}
        ${tip(`<b>Leitfragen</b><ul><li>Was verbinden Kundinnen und Kunden spontan mit der Marke?</li><li>Was davon ist rational (Hard Facts), was emotional (Soft Facts)?</li><li>Wer sind die wichtigsten Wettbewerber im heutigen Markt?</li></ul>`)}
        <div class="grid-2">
          ${textField("analyse.zielgruppeHeute", "Heutige Zielgruppe", { placeholder: "Wer kauft die Marke heute?" })}
          ${tagField("analyse.wettbewerber", "Wichtigste Wettbewerber", "Name eingeben, Enter drücken", "Sie erscheinen später im Positionierungskreuz.")}
        </div>
        ${wheelHtml("analyse.heute", null)}`;
    },

    persona() {
      const ws = cur.ws;
      const t = targetInfo(ws.target);
      const info = (t && t.info) || ws.info;
      return `${intro(2, `Neue Zielgruppe: Wer genau ist „${esc(ws.target)}“?`, "Erstellt eine Persona, also eine typische Person aus der neuen Zielgruppe. Je konkreter sie ist, desto leichter lassen sich Produkt und Kommunikation ableiten.")}
        ${info ? tip(`<b>Stichworte aus der Auslosung:</b> ${esc(info)}`) : ""}
        <div class="persona-layout">
          <div class="panel">
            <div class="grid-2">
              ${textField("persona.name", "Name", { placeholder: "z. B. Jana Berger" })}
              <div class="field">
                <label class="field-label" for="f-persona-alter">Alter</label>
                <div class="range-row">
                  <input type="range" id="f-persona-alter" min="14" max="90" data-field="persona.alter" value="${esc(ws.persona.alter)}">
                  <output id="out-alter" for="f-persona-alter">${esc(ws.persona.alter)}</output>
                </div>
              </div>
            </div>
            ${textField("persona.alltag", "Beruf und Alltag", { placeholder: "z. B. Physiotherapeutin, trainiert fünfmal pro Woche" })}
            <div class="grid-2">
              ${textField("persona.beduerfnisse", "Bedürfnisse und Ziele", { area: true, hint: "Eine Angabe pro Zeile", placeholder: "z. B. Muskelaufbau ohne Verzicht" })}
              ${textField("persona.painpoints", "Pain Points", { area: true, hint: "Eine Angabe pro Zeile", placeholder: "z. B. Proteinriegel schmecken nach Pappe" })}
            </div>
            ${chipsField("persona.motive", "Kaufmotive", MOTIVE, "Mehrfachauswahl möglich")}
            ${chipsField("persona.medien", "Mediennutzung", MEDIEN, "Wo erreicht ihr die Persona?")}
            ${textField("persona.zitat", "Typisches Zitat", { placeholder: "Was würde die Person sagen?" })}
          </div>
          <aside class="panel persona-card" id="persona-card" aria-label="Vorschau der Persona"></aside>
        </div>`;
    },

    strategie() {
      const ws = cur.ws;
      return `${intro(3, `Markenstrategie: Wie weit darf sich ${esc(ws.brand)} bewegen?`, "Schätzt ein, wie gut die neue Zielgruppe zum heutigen Markenkern passt und wie stark die heutige Kundschaft irritiert werden könnte. Daraus ergibt sich eine erste Richtung.")}
        <div class="strat-layout">
          <div class="panel">
            ${rangeField("strategie.fit", "Markenfit", "Wie gut passt die neue Zielgruppe zum heutigen Markenkern?", "passt kaum", "passt sehr gut")}
            ${rangeField("strategie.risiko", "Risiko für die Bestandskundschaft", "Wie stark könnte die heutige Kundschaft irritiert werden?", "gering", "hoch")}
            <p class="recommend" id="recommend" aria-live="polite"></p>
            <p class="field-hint">Die Matrix ist eine Orientierung, keine feste Regel. Ihr dürft begründet abweichen.</p>
          </div>
          <div class="matrix-wrap">
            <span class="matrix-y">Risiko für Bestandskundschaft →</span>
            <div class="matrix" id="matrix" aria-hidden="true">
              <div class="quad" data-q="neumarke">Neue Marke</div>
              <div class="quad" data-q="submarke">Submarke</div>
              <div class="quad" data-q="repositionierung">Repositionierung</div>
              <div class="quad" data-q="extension">Markendehnung</div>
              <span class="matrix-dot" id="matrix-dot"></span>
            </div>
            <span class="matrix-x">Markenfit →</span>
          </div>
        </div>
        <div class="field">
          <span class="field-label" id="wahl-label">Eure Entscheidung</span>
          <div class="choice-grid" role="group" aria-labelledby="wahl-label">
            ${STRATEGIES.map((st) => `<button type="button" class="choice" data-set="strategie.wahl" data-value="${st.id}" aria-pressed="${ws.strategie.wahl === st.id}">
              <span class="badge" hidden>Passt zur Einschätzung</span>
              <span class="choice-title">${st.title}</span>
              <small>${st.desc}</small>
              <span class="pro">${st.pro}</span>
              <span class="contra">${st.contra}</span>
              <small>Beispiel: ${st.example}</small>
            </button>`).join("")}
          </div>
        </div>
        ${textField("strategie.begruendung", "Begründung", { area: true, rows: 4, placeholder: "Warum passt diese Strategie? Was bedeutet sie für die heutige Kundschaft?" })}`;
    },

    markenkern() {
      const ws = cur.ws;
      const ph = ["z. B. energiegeladen", "z. B. ehrlich", "z. B. gemeinsam"];
      return `${intro(4, `Markenkern neu: Wie soll ${esc(ws.brand)} künftig wirken?`, `Füllt das Markensteuerrad für die Marke nach dem Rebranding aus, passend für „${esc(ws.target)}“. Unter jedem Feld seht ihr zum Vergleich eure Ist-Analyse.`)}
        ${wheelHtml("markenkern", "analyse.heute")}
        <div class="panel">
          <div class="field">
            <span class="field-label">Markenkern in drei Worten</span>
            <span class="field-hint">Drei Begriffe, die das neue Markenversprechen tragen</span>
          </div>
          <div class="grid-3">
            ${[0, 1, 2].map((i) => `<input class="input" id="f-worte-${i}" data-field="markenkern.worte.${i}" value="${esc(ws.markenkern.worte[i] || "")}" placeholder="${ph[i]}" aria-label="Wort ${i + 1}">`).join("")}
          </div>
          <div class="words" id="words-preview"></div>
        </div>`;
    },

    positionierung() {
      const ws = cur.ws;
      const ax = ws.positionierung.achsen;
      const axInput = (k, cls, label) => `<input class="ax-input ${cls}" id="ax-${k}" data-field="positionierung.achsen.${k}" value="${esc(ax[k])}" aria-label="${label}">`;
      return `${intro(5, "Positionierung: Wo steht ihr im Markt?", "Zieht die Punkte im Positionierungskreuz an die passende Stelle und formuliert danach euer Positionierungsstatement.")}
        <div class="pos-layout">
          <div class="panel">
            <h3>Positionierungskreuz</h3>
            <div class="posmap">
              ${axInput("oben", "ax-top", "Beschriftung oben")}
              ${axInput("links", "ax-left", "Beschriftung links")}
              <div class="map-holder">${mapSvg(ws, true)}</div>
              ${axInput("rechts", "ax-right", "Beschriftung rechts")}
              ${axInput("unten", "ax-bottom", "Beschriftung unten")}
            </div>
            <div class="legend"><span><i class="l-heute"></i>Heute</span><span><i class="l-neu"></i>Nach dem Rebranding</span><span><i class="l-comp"></i>Wettbewerber</span></div>
            <p class="field-hint" id="map-help">Punkte mit Maus oder Finger ziehen. Mit der Tastatur einen Punkt anwählen und mit den Pfeiltasten bewegen. Die Achsen könnt ihr umbenennen.</p>
            ${(ws.analyse.wettbewerber || []).length ? "" : `<p class="field-hint">Tragt in der Ist-Analyse Wettbewerber ein, dann erscheinen sie hier.</p>`}
          </div>
          <div class="panel">
            <h3>Positionierungsstatement</h3>
            <p class="statement" id="statement"></p>
            <div class="grid-2">
              ${textField("positionierung.satz.zielgruppe", "Für … (Zielgruppe)")}
              ${textField("positionierung.satz.beduerfnis", "die … (Bedürfnis)", { placeholder: "z. B. beim Naschen ihre Makros im Blick behalten" })}
              ${textField("positionierung.satz.marke", "ist … (Marke oder Produkt)")}
              ${textField("positionierung.satz.kategorie", "die … (Kategorie)", { placeholder: "z. B. Fruchtgummi-Marke" })}
              ${textField("positionierung.satz.nutzen", "die … (Nutzenversprechen)", { placeholder: "z. B. 20 g Eiweiß pro Tüte liefert" })}
              ${textField("positionierung.satz.wettbewerber", "Anders als … (Wettbewerber)", { placeholder: "z. B. Proteinriegel" })}
            </div>
            ${textField("positionierung.satz.rtb", "überzeugt sie durch … (Reason to Believe)", { placeholder: "z. B. den Geschmack von Kindheit" })}
          </div>
        </div>`;
    },

    mix() {
      const head = (letter, title, sub) => `<div class="p-head"><span class="p-letter">${letter}</span><div><h3>${title}</h3><p class="field-hint">${sub}</p></div></div>`;
      return `${intro(6, "Marketing-Mix: Was ändert sich konkret?", "Übersetzt die neue Positionierung in die 4P. Jede Entscheidung sollte zur Persona passen.")}
        <div class="mix-grid">
          <section class="panel">
            ${head("P", "Product", "Leistung und Produktgestaltung")}
            ${textField("mix.produkt", "Produktidee", { area: true, placeholder: "Was genau bietet ihr der neuen Zielgruppe an?" })}
            ${textField("mix.verpackung", "Verpackung, Größe, Design", { area: true, rows: 2, placeholder: "z. B. wiederverschließbarer Beutel für die Sporttasche" })}
          </section>
          <section class="panel">
            ${head("P", "Price", "Preisstrategie und Preispunkt")}
            ${choiceChipsField("mix.preisStrategie", "Preisstrategie", PRICES, "Penetration: niedriger Einstiegspreis für schnelle Verbreitung. Skimming: hoher Einstiegspreis, der später sinkt.")}
            ${textField("mix.preis", "Preis", { placeholder: "z. B. 2,49 € pro 150-g-Beutel" })}
          </section>
          <section class="panel">
            ${head("P", "Place", "Vertrieb und Verfügbarkeit")}
            ${chipsField("mix.place", "Vertriebskanäle", PLACES)}
            ${textField("mix.placeText", "Weitere Kanäle oder Details", { placeholder: "z. B. Kooperation mit einer Fitnessstudio-Kette" })}
          </section>
          <section class="panel">
            ${head("P", "Promotion", "Kommunikation")}
            ${chipsField("mix.promotion", "Kommunikationskanäle", PROMOS)}
            ${textField("mix.botschaft", "Kernbotschaft", { placeholder: "Was soll hängen bleiben?" })}
          </section>
        </div>`;
    },

    pitch() {
      const ws = cur.ws;
      const p = ws.pitch;
      return `${intro(7, "Pitch vorbereiten", "Gebt dem Rebranding einen Namen, einen Claim und ein Kampagnenmotiv. Rechts entsteht live euer Plakat.")}
        <div class="pitch-layout">
          <div class="panel">
            ${textField("pitch.name", "Produkt- oder Markenname", { placeholder: `z. B. ${ws.brand} Protein` })}
            ${textField("pitch.claim", "Claim", { placeholder: "z. B. Naschen mit Plan." })}
            ${textField("pitch.motiv", "Kampagnenmotiv", { area: true, placeholder: "Was sieht man auf dem Motiv, und wo läuft es?" })}
            <div class="field">
              <span class="field-label">Drei Gründe, warum das funktioniert</span>
              ${[0, 1, 2].map((i) => `<input class="input" id="f-grund-${i}" data-field="pitch.gruende.${i}" value="${esc(p.gruende[i] || "")}" placeholder="Grund ${i + 1}" aria-label="Grund ${i + 1}">`).join("")}
            </div>
            <div class="field">
              <span class="field-label" id="farbe-label">Kampagnenfarbe</span>
              <div class="color-row">
                <input type="color" id="f-pitch-farbe" data-field="pitch.farbe" value="${esc(p.farbe)}" aria-labelledby="farbe-label">
                ${SWATCH_HEX.slice(0, 8).map((h) => `<button type="button" class="swatch-btn" style="background:${h}" data-color="${h}" aria-label="Farbe ${h} wählen"></button>`).join("")}
              </div>
            </div>
            <div class="row"><a class="btn primary" href="#g/${ws.group}/board">Zum Pitch-Board ${ICON.arrow}</a></div>
          </div>
          <div class="poster" id="poster" aria-label="Plakatvorschau"></div>
        </div>`;
    },

    board() {
      const ws = cur.ws;
      return `${intro(0, "Pitch-Board", `Alle Felder auf einer Seite. Präsentiert direkt von hier, der Timer steht auf ${CFG.pitchMinuten} Minuten.`)}
        <div class="board-stage" id="board-stage">
          <div class="board-actions">
            <button type="button" class="btn primary" data-action="present">${ICON.expand} <span>Präsentieren</span></button>
            <button type="button" class="btn" data-action="copy-board">${ICON.copy} Als Text kopieren</button>
            <button type="button" class="btn" data-action="download-board">${ICON.download} Als Datei speichern</button>
            <button type="button" class="btn" data-action="print">${ICON.print} Drucken / PDF</button>
            ${timerHtml(pitchTimer, "Pitch")}
          </div>
          <div class="board" id="board" style="--sw:${swVar(ws.group)};${posterVars(ws)}">${boardHtml(ws)}</div>
        </div>`;
    }
  };

  function boardHtml(ws) {
    const s = ws.strategie;
    const st = STRAT_BY_ID[s.wahl];
    const m = ws.mix;
    const p = ws.pitch;
    const open = `<span class="empty-note">noch offen</span>`;
    const v = (x) => (x && String(x).trim() ? esc(String(x).trim()) : open);
    const list = (arr) => (arr && arr.filter(Boolean).length ? esc(arr.filter(Boolean).join(", ")) : open);
    const worte = (ws.markenkern.worte || []).filter((w) => String(w || "").trim());
    const gruende = (p.gruende || []).filter((g) => String(g || "").trim());
    return `
      <section class="board-hero">
        <div class="field">
          <p class="poster-kicker">Gruppe ${ws.group}${ws.team ? " · " + esc(ws.team) : ""}</p>
          <p class="poster-claim">${esc(p.claim || "Der Claim fehlt noch")}</p>
          <p class="poster-name">${esc(p.name || ws.brand)}</p>
        </div>
        <div class="board-hero-side">
          <p class="poster-kicker">Mission</p>
          <p><b>${esc(ws.brand)}</b> → <b>${esc(ws.target)}</b></p>
          ${st ? `<p>Strategie: ${esc(st.title)}</p>` : ""}
          ${worte.length ? `<p>${worte.map(esc).join(" · ")}</p>` : ""}
        </div>
      </section>
      <div class="board-grid">
        <section class="panel persona-card board-persona">${personaCardHtml(ws)}</section>
        <section class="panel"><h3>Positionierungskreuz</h3>${mapSvg(ws, false)}</section>
        <section class="panel">
          <h3>Markenstrategie</h3>
          ${st ? `<p class="choice-title">${esc(st.title)}</p><p class="muted">${esc(st.desc)}</p>` : `<p class="empty-note">noch nicht gewählt</p>`}
          ${s.begruendung ? `<p style="white-space:pre-line">${esc(s.begruendung)}</p>` : ""}
        </section>
        <section class="panel span-2"><h3>Positionierungsstatement</h3><p class="statement">${statementHtml(ws)}</p></section>
        <section class="panel">
          <h3>Kampagne</h3>
          <dl class="kv">
            <dt>Motiv</dt><dd>${v(p.motiv)}</dd>
            <dt>Gründe</dt><dd>${gruende.length ? gruende.map(esc).join("\n") : open}</dd>
          </dl>
        </section>
        <section class="panel span-3">
          <h3>Marketing-Mix</h3>
          <dl class="kv">
            <dt>Product</dt><dd>${v(m.produkt)}${m.verpackung ? "\n" + esc(m.verpackung) : ""}</dd>
            <dt>Price</dt><dd>${[m.preisStrategie, m.preis].filter((x) => String(x || "").trim()).map(esc).join(" · ") || open}</dd>
            <dt>Place</dt><dd>${list([...m.place, m.placeText])}</dd>
            <dt>Promotion</dt><dd>${list(m.promotion)}${m.botschaft ? "\nKernbotschaft: " + esc(m.botschaft) : ""}</dd>
          </dl>
        </section>
        <section class="panel span-3">
          <h3>Markensteuerrad <span class="label">vorher und nachher</span></h3>
          <div class="compare-wrap">
            <table class="compare">
              <thead><tr><th scope="col">Dimension</th><th scope="col">Heute</th><th scope="col">Nach dem Rebranding</th></tr></thead>
              <tbody>${WHEEL.map((w) => `<tr><th scope="row">${w.title}</th><td>${v(ws.analyse.heute[w.key])}</td><td>${v(ws.markenkern[w.key])}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        </section>
      </div>`;
  }

  function posText(pt, ax) {
    return `${pt.x >= 0.5 ? ax.rechts : ax.links} (${Math.round(pt.x * 100)} %), ${pt.y >= 0.5 ? ax.oben : ax.unten} (${Math.round(pt.y * 100)} %)`;
  }
  function boardMarkdown(ws) {
    const t = (x) => (x && String(x).trim()) || "–";
    const st = STRAT_BY_ID[ws.strategie.wahl];
    const p = ws.persona;
    const m = ws.mix;
    const ax = ws.positionierung.achsen;
    const L = [];
    L.push(`# ${ws.pitch.name || ws.brand}: Rebranding für ${ws.target}`);
    L.push("");
    L.push(`${CFG.hochschule} · ${CFG.modul}${CFG.lehrende ? " · " + CFG.lehrende : ""}`);
    L.push(`Gruppe ${ws.group}${ws.team ? " · " + ws.team : ""}`);
    L.push("");
    L.push(`**Mission:** ${ws.brand} → ${ws.target}`);
    L.push(`**Claim:** ${t(ws.pitch.claim)}`);
    L.push("", "## 1 Ist-Analyse");
    L.push(`- Heutige Zielgruppe: ${t(ws.analyse.zielgruppeHeute)}`);
    L.push(`- Wettbewerber: ${t((ws.analyse.wettbewerber || []).join(", "))}`);
    WHEEL.forEach((w) => L.push(`- ${w.title}: ${t(ws.analyse.heute[w.key])}`));
    L.push("", "## 2 Persona");
    L.push(`- ${t(p.name)}, ${p.alter} Jahre, ${t(p.alltag)}`);
    L.push(`- Bedürfnisse: ${t(linesOf(p.beduerfnisse).join("; "))}`);
    L.push(`- Pain Points: ${t(linesOf(p.painpoints).join("; "))}`);
    L.push(`- Kaufmotive: ${t(p.motive.join(", "))}`);
    L.push(`- Mediennutzung: ${t(p.medien.join(", "))}`);
    L.push(`- Zitat: ${t(p.zitat)}`);
    L.push("", "## 3 Markenstrategie");
    L.push(`- Markenfit: ${ws.strategie.fit == null ? "–" : ws.strategie.fit + " / 100"}, Risiko: ${ws.strategie.risiko == null ? "–" : ws.strategie.risiko + " / 100"}`);
    L.push(`- Entscheidung: ${st ? st.title : "–"}`);
    L.push(`- Begründung: ${t(ws.strategie.begruendung)}`);
    L.push("", "## 4 Markenkern neu");
    WHEEL.forEach((w) => L.push(`- ${w.title}: ${t(ws.markenkern[w.key])}`));
    L.push(`- In drei Worten: ${t((ws.markenkern.worte || []).filter(Boolean).join(", "))}`);
    L.push("", "## 5 Positionierung");
    L.push(statementText(ws));
    L.push("");
    L.push(`Achsen: ${ax.links} ↔ ${ax.rechts}, ${ax.unten} ↔ ${ax.oben}`);
    mapPoints(ws).forEach((pt) => L.push(`- ${pt.label}: ${posText(pt, ax)}`));
    L.push("", "## 6 Marketing-Mix");
    L.push(`- Product: ${t(m.produkt)}${m.verpackung ? " (" + m.verpackung + ")" : ""}`);
    L.push(`- Price: ${t([m.preisStrategie, m.preis].filter(Boolean).join(", "))}`);
    L.push(`- Place: ${t([...m.place, m.placeText].filter(Boolean).join(", "))}`);
    L.push(`- Promotion: ${t(m.promotion.join(", "))}${m.botschaft ? ". Kernbotschaft: " + m.botschaft : ""}`);
    L.push("", "## 7 Pitch");
    L.push(`- Name: ${t(ws.pitch.name)}`);
    L.push(`- Claim: ${t(ws.pitch.claim)}`);
    L.push(`- Kampagnenmotiv: ${t(ws.pitch.motiv)}`);
    (ws.pitch.gruende || []).filter(Boolean).forEach((g, i) => L.push(`- Grund ${i + 1}: ${g}`));
    return L.join("\n");
  }
  function downloadText(filename, text) {
    try {
      const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast("Die Datei wird gespeichert.");
    } catch (e) {
      copyText(text, "Speichern ist hier nicht möglich. Der Text wurde kopiert.");
    }
  }
  const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* =====================================================================
     Arbeitsbereich: Darstellung und Live-Aktualisierung
     ===================================================================== */
  function renderWorkspace() {
    currentView = "ws";
    const { ws, n, step } = cur;
    const idx = STEP_IDS.indexOf(step);
    const prev = STEPS[idx - 1];
    const next = STEPS[idx + 1];
    const b = brandInfo(ws.brand);
    const t = targetInfo(ws.target);
    const heute = (b && b.heute) || ws.heute;
    const info = (t && t.info) || ws.info;
    const meta = [heute ? `Heute: ${esc(heute)}` : "", info ? `Neu: ${esc(info)}` : ""].filter(Boolean).join(" · ");
    app.innerHTML = `
      <section class="ws" style="--sw:${swVar(n)}">
        <header class="ws-head">
          <div class="ws-tag"><span class="label">Gruppe</span><span class="tag-num">${n}</span></div>
          <div class="ws-mission">
            <p class="eyebrow">Eure Mission</p>
            <h1 class="mission"><span>${esc(ws.brand)}</span>${ICON.arrow}<span class="to">${esc(ws.target)}</span></h1>
            ${meta ? `<p class="mission-meta">${meta}</p>` : ""}
          </div>
          <div class="ws-side">
            <label class="field"><span class="label">Team</span><input class="input" id="ws-team" data-field="team" value="${esc(ws.team)}" placeholder="Eure Namen"></label>
            <div class="progress" id="ws-progress" role="progressbar" aria-label="Fortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
            <div class="progress-label"><span><b id="ws-progress-num">0 %</b> bearbeitet</span><span class="saved" id="ws-saved">Speichert automatisch</span></div>
          </div>
        </header>
        <nav class="steps-nav" aria-label="Arbeitsfelder">
          ${STEPS.map((s, i) => `<a class="step-tab" href="#g/${n}/${s.id}" data-step="${s.id}"${s.id === step ? ' aria-current="step"' : ""}>
            <span class="step-ring"><span>${s.id === "board" ? "★" : i + 1}</span></span>${esc(s.short)}</a>`).join("")}
        </nav>
        <div class="step-body" id="step-body">${STEP_RENDER[step]()}</div>
        <footer class="step-foot">
          ${prev ? `<a class="btn" href="#g/${n}/${prev.id}">${ICON.back} ${esc(prev.short)}</a>` : `<a class="btn" href="#start">${ICON.back} Startseite</a>`}
          ${next ? `<a class="btn primary" href="#g/${n}/${next.id}">Weiter: ${esc(next.short)} ${ICON.arrow}</a>` : `<span></span>`}
        </footer>
      </section>`;
    if (step === "positionierung") bindMap();
    if (step === "board") pitchTimer.sync();
    refreshLive();
    const active = $(".step-tab[aria-current='step']");
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function updateProgress() {
    const ws = cur.ws;
    const total = overallProgress(ws);
    const bar = $("#ws-progress");
    if (bar) {
      bar.setAttribute("aria-valuenow", String(total));
      bar.firstElementChild.style.width = total + "%";
    }
    const num = $("#ws-progress-num");
    if (num) num.textContent = total + " %";
    $$(".step-tab").forEach((tab) => {
      const id = tab.dataset.step;
      const pct = id === "board" ? total : stepProgress(ws, id);
      const ring = tab.querySelector(".step-ring");
      ring.style.setProperty("--p", pct);
      tab.classList.toggle("done", pct >= 100);
      tab.setAttribute("aria-label", `${tab.textContent.trim().replace(/^\S+\s*/, "")}, ${pct} % bearbeitet`);
    });
  }

  const LIVE = {
    persona() {
      const card = $("#persona-card");
      if (card) card.innerHTML = personaCardHtml(cur.ws);
      const out = $("#out-alter");
      if (out) out.textContent = cur.ws.persona.alter;
    },
    strategie() {
      const s = cur.ws.strategie;
      const fitOut = $("#out-" + fid("strategie.fit"));
      const riskOut = $("#out-" + fid("strategie.risiko"));
      if (fitOut) fitOut.textContent = s.fit == null ? "–" : s.fit;
      if (riskOut) riskOut.textContent = s.risiko == null ? "–" : s.risiko;
      const dot = $("#matrix-dot");
      if (dot) {
        dot.style.setProperty("--x", s.fit == null ? 50 : s.fit);
        dot.style.setProperty("--y", s.risiko == null ? 50 : s.risiko);
        dot.style.opacity = s.fit == null && s.risiko == null ? ".35" : "1";
      }
      const rec = recommend(s);
      $$(".quad").forEach((q) => q.classList.toggle("active", q.dataset.q === rec));
      const recEl = $("#recommend");
      if (recEl) recEl.textContent = rec ? `Empfehlung laut Matrix: ${STRAT_BY_ID[rec].title}` : "Bewegt beide Regler, dann erscheint eine Empfehlung.";
      $$(".choice").forEach((c) => { const badge = c.querySelector(".badge"); if (badge) badge.hidden = c.dataset.value !== rec; });
    },
    markenkern() {
      const el = $("#words-preview");
      if (!el) return;
      const worte = (cur.ws.markenkern.worte || []).filter((w) => String(w || "").trim());
      el.innerHTML = worte.map((w) => `<span>${esc(w)}</span>`).join("");
    },
    positionierung() {
      const el = $("#statement");
      if (el) el.innerHTML = statementHtml(cur.ws);
    },
    pitch() {
      const poster = $("#poster");
      if (poster) {
        poster.setAttribute("style", posterVars(cur.ws));
        poster.innerHTML = posterHtml(cur.ws);
      }
    }
  };
  function refreshLive() {
    if (!cur || currentView !== "ws") return;
    updateProgress();
    const fn = LIVE[cur.step];
    if (fn) fn();
  }

  function addTag(path, input) {
    const vals = input.value.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    if (!vals.length) return;
    const arr = (getPath(cur.ws, path) || []).slice();
    vals.forEach((v) => { if (!arr.some((x) => x.toLowerCase() === v.toLowerCase())) arr.push(v); });
    setPath(cur.ws, path, arr);
    input.value = "";
    renderTagList(path);
    touch();
  }
  function removeTag(path, value) {
    const arr = (getPath(cur.ws, path) || []).filter((x) => x !== value);
    setPath(cur.ws, path, arr);
    renderTagList(path);
    touch();
  }
  function renderTagList(path) {
    const el = $(`[data-tag-list="${path}"]`);
    if (el) el.innerHTML = tagListHtml(path);
  }

  /* =====================================================================
     Ereignisse
     ===================================================================== */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-action],[data-toggle],[data-set],[data-reroll],[data-timer-action],[data-remove-tag],[data-add-tag],[data-color]");
    if (!t) return;

    if (t.dataset.timerAction) {
      const cd = TIMERS[t.dataset.timer];
      if (cd) { if (t.dataset.timerAction === "toggle") cd.toggle(); else cd.reset(); }
      return;
    }
    if (t.dataset.reroll) { reroll(Number(t.dataset.i), t.dataset.reroll); return; }

    if (cur && currentView === "ws") {
      if (t.dataset.toggle) {
        const path = t.dataset.toggle;
        const val = t.dataset.value;
        const arr = (getPath(cur.ws, path) || []).slice();
        const i = arr.indexOf(val);
        if (i >= 0) arr.splice(i, 1); else arr.push(val);
        setPath(cur.ws, path, arr);
        t.setAttribute("aria-pressed", String(i < 0));
        touch();
        return;
      }
      if (t.dataset.set) {
        const path = t.dataset.set;
        const val = t.dataset.value;
        const nv = getPath(cur.ws, path) === val ? "" : val;
        setPath(cur.ws, path, nv);
        $$(`[data-set="${path}"]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === nv)));
        touch();
        return;
      }
      if (t.dataset.addTag) {
        const input = $(`[data-tag-input="${t.dataset.addTag}"]`);
        if (input) { addTag(t.dataset.addTag, input); input.focus(); }
        return;
      }
      if (t.dataset.removeTag) { removeTag(t.dataset.removeTag, t.dataset.value); return; }
      if (t.dataset.color) {
        cur.ws.pitch.farbe = t.dataset.color;
        const input = $("#f-pitch-farbe");
        if (input) input.value = t.dataset.color;
        touch();
        return;
      }
    }

    switch (t.dataset.action) {
      case "draw-all": drawAllAnimated(); break;
      case "grp-plus": addGroup(); break;
      case "grp-minus": removeGroup(); break;
      case "qr": showQr(Number(t.dataset.i)); break;
      case "qr-all": showAllQr(); break;
      case "copy-result": copyText(resultText(), "Ergebnis in die Zwischenablage kopiert."); break;
      case "copy-link": { const inp = $("#qr-link"); if (inp) copyText(inp.value, "Link kopiert."); break; }
      case "fullscreen": toggleFullscreen(document.documentElement); break;
      case "scroll-join": { const el = $("#oeffnen"); if (el) el.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" }); break; }
      case "pool-apply": {
        const bText = $("#pool-brands").value;
        const tText = $("#pool-targets").value;
        if (applyPools(bText, tText)) store.set("pools", { brands: bText, targets: tText });
        break;
      }
      case "pool-reset": {
        if (!resetArmed) {
          t.textContent = "Eigene Listen wirklich ersetzen?";
          t.classList.add("danger");
          resetArmed = setTimeout(disarmReset, 4000);
          break;
        }
        disarmReset();
        $("#pool-brands").value = DATA.brands;
        $("#pool-targets").value = DATA.targets;
        store.remove("pools");
        applyPools(DATA.brands, DATA.targets);
        break;
      }
      case "ws-delete": {
        if (t.dataset.armed !== "1") {
          t.dataset.armed = "1";
          t.textContent = "Wirklich löschen?";
          t.classList.add("danger");
          setTimeout(() => { if (t.isConnected) { t.dataset.armed = ""; t.textContent = "Löschen"; t.classList.remove("danger"); } }, 4000);
          break;
        }
        store.remove(t.dataset.key);
        if (cur && cur.key === t.dataset.key) cur = null;
        toast("Arbeitsbereich gelöscht.");
        renderStart();
        break;
      }
      case "present": toggleFullscreen($("#board-stage")); break;
      case "copy-board": if (cur) copyText(boardMarkdown(cur.ws), "Pitch-Board als Text kopiert."); break;
      case "download-board": if (cur) downloadText(`gruppe-${cur.ws.group}-${slug(cur.ws.brand)}-rebranding.md`, boardMarkdown(cur.ws)); break;
      case "print": window.print(); break;
      default: break;
    }
  });

  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.matches("[data-team]")) {
      const i = Number(el.dataset.team);
      if (!groups[i]) return;
      groups[i].team = el.value;
      saveGroups();
      const link = $(`[data-open="${i}"]`);
      if (link) link.setAttribute("href", wsHash(i + 1, groups[i]));
      return;
    }
    if (cur && currentView === "ws" && el.dataset.field) {
      const v = el.type === "range" ? Number(el.value) : el.value;
      setPath(cur.ws, el.dataset.field, v);
      touch();
    }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.id === "draw-timer-min") { drawTimer.setMinutes(Number(el.value)); return; }
    if (el.id === "join-group") {
      const g = groups[Number(el.value) - 1];
      if (g) {
        const bs = $("#join-brand");
        const ts = $("#join-target");
        if (bs && pool.brandMap.has(g.brand)) bs.value = g.brand;
        if (ts && pool.targetMap.has(g.target)) ts.value = g.target;
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    const el = e.target;
    if (!(el instanceof Element) || !el.matches("[data-tag-input]") || !cur) return;
    const path = el.dataset.tagInput;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(path, el);
    } else if (e.key === "Backspace" && el.value === "") {
      const arr = getPath(cur.ws, path) || [];
      if (arr.length) removeTag(path, arr[arr.length - 1]);
    }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.id !== "join-form") return;
    e.preventDefault();
    const n = Number($("#join-group").value);
    const brand = $("#join-brand").value;
    const target = $("#join-target").value;
    if (!brand || !target) return;
    const g = groups[n - 1];
    const team = g && g.brand === brand && g.target === target ? g.team : "";
    location.hash = wsHash(n, { brand, target, team });
  });

  window.addEventListener("hashchange", route);
  window.addEventListener("pagehide", flushSave);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSave();
    else updateWake();
  });

  /* =====================================================================
     Start
     ===================================================================== */
  applyBranding();
  const savedPools = store.get("pools");
  setPools(
    savedPools && typeof savedPools.brands === "string" ? savedPools.brands : DATA.brands,
    savedPools && typeof savedPools.targets === "string" ? savedPools.targets : DATA.targets
  );
  if (pool.brands.length < 2 || pool.targets.length < 2) setPools(DATA.brands, DATA.targets);

  const savedState = store.get("state");
  if (savedState && Array.isArray(savedState.groups) && savedState.groups.length) {
    groups = savedState.groups.slice(0, maxGroups()).map((g) => ({
      brand: String((g && g.brand) || ""),
      target: String((g && g.target) || ""),
      team: String((g && g.team) || "")
    }));
    repair();
  } else {
    groups = drawAll(Math.min(CFG.standardGruppen, maxGroups()));
  }
  saveGroups();
  route();
})();
