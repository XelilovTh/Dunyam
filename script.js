/* ═══════════════════════════════════════════════════
   Bizim Dünyamız — script.js
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════════ */
function initLogin() {
  const form  = document.getElementById("login-form");
  const inp   = document.getElementById("login-inp");
  const bar   = document.getElementById("notif-bar");
  const scr   = document.getElementById("login-screen");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inp.value === "elehmed") {
      scr.style.opacity = "0";
      setTimeout(() => {
        scr.style.display = "none";
        document.getElementById("app").style.display = "block";
        onAppReady();
      }, 800);
    } else {
      inp.classList.remove("shake");
      void inp.offsetWidth;
      inp.classList.add("shake");
      bar.style.display = "block";
      setTimeout(() => bar.style.display = "none", 3000);
      inp.value = "";
    }
  });
}


/* ─── GitHub Config ─── */
const GH_OWNER  = "XelilovTh";
const GH_REPO   = "Dunyam";
const GH_TOKEN  = "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";
const GH_BASE   = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}`;
const GH_HDR    = { Authorization: `token ${GH_TOKEN}`, Accept: "application/vnd.github.v3+json" };

/* ─── Günün sözü ─── */
const QUOTES = [
  "Sən mənim ən gözəl xəyalımsan.",
  "Hər nəfəsimdə sənin adın var.",
  "Sevgi — iki ürəyin bir olmasıdır.",
  "Sən olmadan dünyam mənasızdır.",
  "Gözlərindəki işıq mənim günəşimdir.",
  "Sənin gülüşün ən gözəl melodiyadır.",
  "Sən mənim ən qiymətli xəzinəmsən.",
  "Sevgi sözsüz başa düşülür, sən kimi.",
  "Sən olanda hər gün bayramdır.",
  "Ürəyimin ən gizli guşəsindəsən.",
  "Sən mənim yazdığım ən gözəl şeirsən.",
  "Gecənin qaranlığında sən mənim işığımsan.",
  "Sənin sevgin həyatımın mənasıdır.",
  "Hər günəş doğuşu sənə olan sevgimi artırır.",
  "Sən mənim dünyamdaki ən gözəl möcüzəsən.",
  "Uzaqlarda da olsa, ürəyim yanındadır.",
  "Sən olmadan heç nə tamamlanmır.",
  "Sevgin qəlbimi həmişə isidər.",
  "Gözlərindi baxanda zamanın durduğunu hiss edirəm.",
  "Sənin səsin ən gözəl musiqidir.",
  "Yaddaşımın ən şirin hissəsindəsən.",
  "Sevgi sözlərə sığmaz, sən kimi.",
  "Hər ulduz sənin adını pıçıldayır.",
  "Sən mənim əbədi baharımsan.",
  "Ürəyimdəki sevgi sonsuzluqdur.",
  "Sən mənim nəfəs aldığım havasan.",
  "Qəlbim yalnız sənin üçün döyünür.",
  "Sənin gözlərindəki məhəbbət bənzərsizdir.",
  "Sən mənim ən şirin xəyalımsan.",
  "Həyat səninsə məna kəsb edir.",
  "Sən — mənim hər şeyim.",
];

const SURPRISES = [
  "Sən mənim ən gözəl xəyalımsan! 💭",
  "Sənin gülüşün dünyamı işıqlandırır! ☀️",
  "Hər gün seninlə keçirmək istəyirəm! 💑",
  "Sən olmadan hər şey mənasızdır! 🌙",
  "Sənin gözlərindəki sevgi bənzərsizdir! 👁️",
  "Qəlbim yalnız sənin üçün döyünür! 💓",
  "Sən mənim ən böyük sevincimisən! 🌸",
  "Sənin yanında olmaq cənnətdir! 🌺",
  "Hər nəfəsimdə sənin adın var! 🌬️",
  "Sən mənim ən qiymətli hədiyyəmisən! 🎁",
  "Doğum günün mübarək, ən gözəl Fidan! 🎂",
  "17 il əvvəl dünyaya gələn mələk! 👼",
  "Hər yaşın gözəldən gözəl olsun! 🌹",
  "Sən daim mənim ürəyimdəsən! ❤️",
  "Sənə olan sevgim sonsuzluq kimidir! ∞",
  "Ən gözəl günlər qarşında! 🌟",
  "Seni seviyorum, həmişəlik! 💕",
];

/* ─── State ─── */
let songs        = [];
let currentIdx   = -1;
let isPlaying    = false;
let lbPhotos     = [];
let lbIdx        = 0;
let lbZoom       = 1;
let openedBoxes  = new Set();
let stats        = { photos: 0, songs: 0, letters: 0 };
let heartClicks  = 0;
let heartTimer   = null;
const audio      = new Audio();

/* ═══════════════════════════════════════════════════
   STAR CANVAS
   ═══════════════════════════════════════════════════ */
(function initStars() {
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 4200);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.3,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.05 + 0.01,
      ts: Math.random() * 0.02 + 0.005,
      to: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const tw  = Math.sin(t * s.ts + s.to);
      const op  = s.opacity * (0.6 + 0.4 * tw);
      if (s.size > 1.8) {
        ctx.shadowBlur  = 8;
        ctx.shadowColor = "rgba(233,30,99,.6)";
        ctx.fillStyle   = `rgba(255,150,180,${op})`;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle  = `rgba(255,255,255,${op})`;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(draw);
})();

/* ═══════════════════════════════════════════════════
   COUNTER
   ═══════════════════════════════════════════════════ */
const START = new Date("2023-02-01T00:00:00");

function updateCounter() {
  const diff = Date.now() - START.getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById("ctr-d").textContent = String(d).padStart(2,"0");
  document.getElementById("ctr-h").textContent = String(h).padStart(2,"0");
  document.getElementById("ctr-m").textContent = String(m).padStart(2,"0");
  document.getElementById("ctr-s").textContent = String(s).padStart(2,"0");
}

/* ═══════════════════════════════════════════════════
   DAILY QUOTE
   ═══════════════════════════════════════════════════ */
function setDailyQuote() {
  const now = new Date();
  const day = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
  const q   = QUOTES[day % QUOTES.length];
  document.getElementById("quote-text").textContent = `"${q}"`;
  document.getElementById("quote-date").textContent =
    "✦ " + now.toLocaleDateString("az-AZ", { day:"numeric", month:"long", year:"numeric" });
}

/* ═══════════════════════════════════════════════════
   GITHUB HELPERS
   ═══════════════════════════════════════════════════ */
async function ghList(folder) {
  try {
    const r = await fetch(`${GH_BASE}/contents/${folder}`, { headers: GH_HDR, cache: "no-store" });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : [];
  } catch { return []; }
}

async function ghText(path) {
  try {
    const r = await fetch(`${GH_BASE}/contents/${path}`, { headers: GH_HDR, cache: "no-store" });
    if (!r.ok) return "";
    const d = await r.json();
    return d.encoding === "base64" ? decodeURIComponent(escape(atob(d.content.replace(/\n/g,"")))) : (d.content || "");
  } catch { return ""; }
}

async function ghPut(path, content, message, sha) {
  const body = { message, content: btoa(unescape(encodeURIComponent(content))) };
  if (sha) body.sha = sha;
  const r = await fetch(`${GH_BASE}/contents/${path}`, {
    method: "PUT",
    headers: { ...GH_HDR, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.ok;
}

async function ghPutBinary(path, file, message) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = async (e) => {
      const b64 = e.target.result.split(",")[1];
      const r = await fetch(`${GH_BASE}/contents/${path}`, {
        method: "PUT",
        headers: { ...GH_HDR, "Content-Type": "application/json" },
        body: JSON.stringify({ message, content: b64 }),
      });
      resolve(r.ok);
    };
    fr.readAsDataURL(file);
  });
}

async function loadStats() {
  try {
    const txt = await ghText("statistics.json");
    if (txt) stats = JSON.parse(txt);
  } catch {}
  document.getElementById("stat-photos").textContent = stats.photos;
  document.getElementById("stat-songs").textContent  = stats.songs;
  document.getElementById("stat-letters").textContent= stats.letters;
}



/* ═══════════════════════════════════════════════════
   APP INIT
   ═══════════════════════════════════════════════════ */
function onAppReady() {
  updateCounter();
  setInterval(updateCounter, 1000);
  setDailyQuote();
  loadStats();
  initNav();
  initAudio();
  initHeartAdmin();
  navigateTo("home");
}

/* ═══════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════ */
const PAGE_IDS = ["home","gallery","letters","music","birthday"];
let currentPage = null;

function navigateTo(page) {
  if (currentPage === page) return;
  currentPage = page;

  PAGE_IDS.forEach(id => {
    document.getElementById(id + "-page").classList.toggle("active", id === page);
  });
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  if (page === "gallery")  loadGallery();
  if (page === "letters")  loadLetters();
  if (page === "music")    loadMusic();
  if (page === "birthday") initBirthday();
}

function initNav() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.page));
  });
  document.getElementById("surprise-btn").addEventListener("click", () => navigateTo("birthday"));
}

/* ═══════════════════════════════════════════════════
   GALLERY
   ═══════════════════════════════════════════════════ */
let galleryLoaded = false;

async function loadGallery() {
  if (galleryLoaded) return;
  galleryLoaded = true;

  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = skeletons(6, "aspect-square rounded-xl");

  const files = (await ghList("images"))
    .filter(f => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(f.name))
    .sort((a, b) => b.name.localeCompare(a.name));

  lbPhotos = files;

  if (!files.length) {
    grid.innerHTML = emptyState("[◉°]", "Hələ şəkil yoxdur...", "Admin panelidən şəkil əlavə edin");
    return;
  }

  grid.innerHTML = "";
  files.forEach((f, i) => {
    const div = document.createElement("div");
    div.className = "photo-item";
    div.innerHTML = `<img src="${f.download_url}" alt="${f.name}" loading="lazy">`;
    div.addEventListener("click", () => openLightbox(i));
    grid.appendChild(div);
  });
}

/* Lightbox */
function openLightbox(idx) {
  lbIdx  = idx;
  lbZoom = 1;
  applyLightbox();
  document.getElementById("lightbox").classList.add("open");
}

function applyLightbox() {
  const img = document.getElementById("lb-img");
  img.src   = lbPhotos[lbIdx].download_url;
  img.style.transform = `scale(${lbZoom})`;
  document.getElementById("lb-counter").textContent = `${lbIdx + 1} / ${lbPhotos.length}`;
}

function initLightbox() {
  document.getElementById("lb-close").onclick = () => {
    lbZoom = 1;
    document.getElementById("lb-img").style.transform = "scale(1)";
    document.getElementById("lightbox").classList.remove("open");
  };
  document.getElementById("lb-prev").onclick  = () => { lbIdx = (lbIdx - 1 + lbPhotos.length) % lbPhotos.length; lbZoom=1; applyLightbox(); };
  document.getElementById("lb-next").onclick  = () => { lbIdx = (lbIdx + 1) % lbPhotos.length; lbZoom=1; applyLightbox(); };
  document.getElementById("lb-zi").onclick    = () => { lbZoom = Math.min(lbZoom + 0.5, 4); applyLightbox(); };
  document.getElementById("lb-zo").onclick    = () => { lbZoom = Math.max(lbZoom - 0.5, 0.5); applyLightbox(); };

  const lb  = document.getElementById("lightbox");
  const img = document.getElementById("lb-img");

  // ── Horizontal swipe to navigate (when not zoomed) ──
  let tx = 0, ty = 0;

  // ── Pinch-to-zoom ──
  let lastDist = 0, pinching = false, baseZoom = 1;

  lb.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
      pinching  = true;
      baseZoom  = lbZoom;
      lastDist  = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
    } else if (e.touches.length === 1) {
      pinching = false;
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    }
  }, { passive: true });

  lb.addEventListener("touchmove", e => {
    if (e.touches.length === 2 && pinching) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      lbZoom = Math.min(Math.max(baseZoom * (dist / lastDist), 0.5), 5);
      img.style.transform = `scale(${lbZoom})`;
    }
  }, { passive: true });

  lb.addEventListener("touchend", e => {
    if (pinching && e.touches.length < 2) {
      pinching = false;
      lbZoom   = Math.min(Math.max(lbZoom, 0.5), 5);
      img.style.transform = `scale(${lbZoom})`;
      return;
    }
    if (pinching) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    // only navigate if not zoomed in and horizontal swipe
    if (lbZoom <= 1.1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      lbIdx = (lbIdx + (dx < 0 ? 1 : -1) + lbPhotos.length) % lbPhotos.length;
      lbZoom = 1;
      applyLightbox();
    }
  });
}

/* ═══════════════════════════════════════════════════
   LETTERS
   ═══════════════════════════════════════════════════ */
let lettersLoaded = false;

async function loadLetters() {
  if (lettersLoaded) return;
  lettersLoaded = true;

  const list = document.getElementById("letters-list");
  list.innerHTML = skeletons(3, "letter-skeleton");

  const files = (await ghList("letters"))
    .filter(f => /\.(txt|md)$/i.test(f.name))
    .sort((a,b) => b.name.localeCompare(a.name));

  if (!files.length) {
    list.innerHTML = emptyState("જ⁀➴", "Hələ məktub yoxdur...");
    return;
  }

  list.innerHTML = "";
  files.forEach(f => {
    const rawTitle = f.name.replace(/\.(txt|md)$/i,"").replace(/_/g," ");
    // strip leading timestamp if present (e.g. "My Letter 1234567890")
    const title = rawTitle.replace(/\s*\d{10,}$/, "").trim() || rawTitle;
    const card  = document.createElement("div");
    card.className = "letter-card";
    card.innerHTML = `
      <div class="letter-icon">
        <svg viewBox="0 0 24 24" fill="#e91e63" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>
      <div style="flex:1;overflow:hidden">
        <div class="letter-title">${title}</div>
        <div class="letter-preview" id="lpreview-${f.name}">જ⁀➴ Yüklənir...</div>
      </div>`;
    card.addEventListener("click", () => openLetter(f, title));
    list.appendChild(card);
    // load preview async
    ghText(f.path).then(txt => {
      const el = document.getElementById(`lpreview-${f.name}`);
      if (el) el.textContent = txt ? txt.slice(0, 60).replace(/\n/g," ") + (txt.length > 60 ? "…" : "") : "જ⁀➴";
    });
  });
}

async function openLetter(file, title) {
  document.getElementById("letter-modal-title").textContent = `જ⁀➴ ${title}`;
  document.getElementById("letter-body").textContent = "Yüklənir...";
  document.getElementById("letter-modal").classList.add("open");
  const txt = await ghText(file.path);
  document.getElementById("letter-body").textContent = txt || "(Məktub boşdur)";
}

function initLetterModal() {
  document.getElementById("letter-close").onclick = () =>
    document.getElementById("letter-modal").classList.remove("open");
}

/* ═══════════════════════════════════════════════════
   MUSIC
   ═══════════════════════════════════════════════════ */
let musicLoaded = false;

async function loadMusic() {
  if (musicLoaded) return;
  musicLoaded = true;

  const list = document.getElementById("music-list");
  list.innerHTML = skeletons(4, "music-sk");

  const files = (await ghList("music"))
    .filter(f => /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(f.name))
    .sort((a,b) => a.name.localeCompare(b.name));

  songs = files;

  if (!files.length) {
    list.innerHTML = emptyState("🎵", "Hələ musiqi yoxdur...");
    return;
  }

  list.innerHTML = "";
  files.forEach((f, i) => {
    // Timestamp-ları sil (başlanğıcdakı rəqəmlər və boşluq)
    const name = f.name
      .replace(/^\d+\s*/, "")                    // 1773776889306 kimi rəqəmləri sil
      .replace(/\.(mp3|wav|ogg|aac|flac|m4a)$/i, "") // Fayl uzantısını sil
      .replace(/_/g, " ");                       // Alt xətti boşluğa çevir
    
    const card = document.createElement("div");
    card.className = "song-card";
    card.id = `song-${i}`;
    card.innerHTML = `
      <div class="song-num" id="song-num-${i}">${i+1}</div>
      <span class="song-name">${name}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="#e91e63" stroke-width="2" width="16" height="16" style="opacity:.3;flex-shrink:0"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    card.addEventListener("click", () => {
      if (currentIdx === i) togglePlay();
      else playSong(i);
    });
    list.appendChild(card);
  });
}

function playSong(idx) {
  if (currentIdx !== -1) {
    document.getElementById(`song-${currentIdx}`)?.classList.remove("playing");
    renderSongNum(currentIdx, false);
  }
  currentIdx = idx;
  audio.src  = songs[idx].download_url;
  audio.load();
  audio.play().catch(()=>{});
  isPlaying  = true;
  updateMusicUI();
}

function togglePlay() {
  if (isPlaying) { audio.pause(); isPlaying = false; }
  else           { audio.play().catch(()=>{}); isPlaying = true; }
  updateMusicUI();
}

function prevSong() {
  if (!songs.length) return;
  playSong((currentIdx - 1 + songs.length) % songs.length);
}
function nextSong() {
  if (!songs.length) return;
  playSong((currentIdx + 1) % songs.length);
}

function renderSongNum(idx, active) {
  const el = document.getElementById(`song-num-${idx}`);
  if (!el) return;
  if (active && isPlaying) el.innerHTML = svgPause(16);
  else if (active)         el.innerHTML = svgPlay(16);
  else                     el.textContent = idx + 1;
  el.classList.toggle("active-btn", active);
}

function updateMusicUI() {
  if (currentIdx === -1) return;
  // song list highlight
  document.querySelectorAll(".song-card").forEach((c,i) => {
    c.classList.toggle("playing", i === currentIdx);
    renderSongNum(i, i === currentIdx);
  });
  // player bar - timestamp-ları təmizlə
  const name = songs[currentIdx].name
    .replace(/^\d+\s*/, "")                    // Başlanğıcdakı rəqəmləri sil (timestamp)
    .replace(/\.(mp3|wav|ogg|aac|flac|m4a)$/i, "") // Fayl uzantısını sil
    .replace(/_/g, " ");                       // Alt xətti boşluğa çevir
  document.getElementById("mp-song").textContent   = name;
  document.getElementById("mp-play").innerHTML     = isPlaying ? svgPause(22) : svgPlay(22);
  const player = document.getElementById("music-player");
  player.style.display = "block";
  // trigger slide-in animation
  player.classList.remove("visible");
  void player.offsetWidth;
  player.classList.add("visible");
}
function initAudio() {
  const seek = document.getElementById("mp-seek");
  audio.addEventListener("timeupdate", () => {
    seek.max   = audio.duration || 100;
    seek.value = audio.currentTime;
    document.getElementById("mp-cur").textContent = fmtTime(audio.currentTime);
    document.getElementById("mp-dur").textContent = fmtTime(audio.duration);
  });
  seek.addEventListener("input", () => { audio.currentTime = seek.value; });
  audio.addEventListener("ended", () => nextSong());

  document.getElementById("mp-play").addEventListener("click", togglePlay);
  document.getElementById("mp-prev").addEventListener("click", prevSong);
  document.getElementById("mp-next").addEventListener("click", nextSong);

  // ── Swipe-to-dismiss music player ──
  const player = document.getElementById("music-player");
  let mpTouchStartX = 0, mpTouchStartY = 0, mpDragging = false;

  player.addEventListener("touchstart", e => {
    // don't interfere with seek bar
    if (e.target === seek) return;
    mpTouchStartX = e.touches[0].clientX;
    mpTouchStartY = e.touches[0].clientY;
    mpDragging = true;
    player.style.transition = "none";
  }, { passive: true });

  player.addEventListener("touchmove", e => {
    if (!mpDragging || e.target === seek) return;
    const dx = e.touches[0].clientX - mpTouchStartX;
    const dy = e.touches[0].clientY - mpTouchStartY;
    // only track horizontal swipe
    if (Math.abs(dx) > Math.abs(dy)) {
      player.style.transform = `translateX(${dx}px)`;
      player.style.opacity   = String(Math.max(0, 1 - Math.abs(dx) / 200));
    }
  }, { passive: true });

  player.addEventListener("touchend", e => {
    if (!mpDragging) return;
    mpDragging = false;
    const dx = e.changedTouches[0].clientX - mpTouchStartX;
    player.style.transition = "";
    if (Math.abs(dx) > 90) {
      // dismiss: slide out fully then hide
      player.style.transform = `translateX(${dx > 0 ? "120%" : "-120%"})`;
      player.style.opacity   = "0";
      audio.pause();
      isPlaying = false;
      setTimeout(() => {
        player.style.display    = "none";
        player.style.transform  = "";
        player.style.opacity    = "";
        updateMusicUI(); // reset play button icon
        // keep player hidden after dismiss
        player.style.display = "none";
      }, 380);
    } else {
      // snap back
      player.style.transform = "";
      player.style.opacity   = "";
    }
  }, { passive: true });
}

function fmtTime(s) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
}

/* ═══════════════════════════════════════════════════
   BIRTHDAY
   ═══════════════════════════════════════════════════ */
let birthdayInited = false;

function initBirthday() {
  if (birthdayInited) return;
  birthdayInited = true;

  // Balloons
  const emojis = ["🎈","🎀","💗","🎊","🌸","💖","🎉","✨"];
  const bpage  = document.getElementById("birthday-page");
  emojis.forEach((em, i) => {
    const b = document.createElement("div");
    b.className = "balloon";
    b.textContent = em;
    b.style.cssText = `left:${(i*13+5)%95}%;animation-delay:${i*0.8}s;animation-duration:${5+i*0.5}s`;
    bpage.appendChild(b);
  });

  // Gift boxes
  const grid = document.getElementById("gift-grid");
  grid.innerHTML = "";
  SURPRISES.forEach((msg, i) => {
    const box = document.createElement("div");
    box.className = "gift-box";
    box.id = `gift-${i}`;
    box.innerHTML = `<span class="gift-emoji">🎁</span><span class="gift-lbl">${i+1}</span>`;
    box.addEventListener("click", () => openGift(i, msg));
    grid.appendChild(box);
  });

  // Wish
  document.getElementById("wish-btn").addEventListener("click", sendWish);

  // Special images
  loadSpecialPhotos();
}

async function loadSpecialPhotos() {
  const files = (await ghList("special_images"))
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));
  const row = document.getElementById("special-photos");
  if (!files.length) { row.style.display = "none"; return; }
  row.innerHTML = "";

  // Build a local photo array for lightbox
  const specialPhotos = files.map(f => ({ download_url: f.download_url, name: f.name }));

  files.forEach((f, i) => {
    const img = document.createElement("img");
    img.src   = f.download_url;
    img.alt   = "";
    img.style.cssText = "width:120px;height:120px;object-fit:cover;border-radius:12px;border:2px solid rgba(233,30,99,.5);flex-shrink:0;cursor:pointer;transition:transform .3s,box-shadow .3s";
    img.addEventListener("click", () => {
      // swap lbPhotos temporarily for special photos
      const savedPhotos = lbPhotos;
      const savedIdx    = lbIdx;
      lbPhotos = specialPhotos;
      lbIdx    = i;
      lbZoom   = 1;
      applyLightbox();
      document.getElementById("lightbox").classList.add("open");
      // restore original gallery on close
      const closeBtn = document.getElementById("lb-close");
      const origClose = closeBtn.onclick;
      closeBtn.onclick = () => {
        lbPhotos = savedPhotos;
        lbIdx    = savedIdx;
        lbZoom   = 1;
        document.getElementById("lb-img").style.transform = "scale(1)";
        document.getElementById("lightbox").classList.remove("open");
        closeBtn.onclick = origClose;
      };
    });
    row.appendChild(img);
  });
}

function openGift(idx, msg) {
  const box = document.getElementById(`gift-${idx}`);
  if (!openedBoxes.has(idx)) {
    openedBoxes.add(idx);
    box.classList.add("opened");
    box.querySelector(".gift-emoji").textContent = "💝";
    confettiSmall();
  }
  document.getElementById("gift-msg").textContent = msg;
  document.getElementById("gift-modal").classList.add("open");
}

function initGiftModal() {
  document.getElementById("gift-close").onclick = () =>
    document.getElementById("gift-modal").classList.remove("open");
}

async function sendWish() {
  const ta  = document.getElementById("wish-ta");
  const txt = ta.value.trim();
  if (!txt) return;
  const btn = document.getElementById("wish-btn");
  btn.disabled = true;
  btn.textContent = "Göndərilir...";

  const ts  = new Date().toISOString();
  const ok  = await ghPut(`wishes/wish_${Date.now()}.json`, JSON.stringify({ wish: txt, timestamp: ts }, null, 2), "New wish 💫");

  btn.disabled   = false;
  btn.textContent = "Diləyimi Göndər 💫";

  if (ok) {
    confettiBig();
    ta.value = "";
    document.getElementById("wish-form").style.display  = "none";
    document.getElementById("wish-success").style.display = "block";
    setTimeout(() => {
      document.getElementById("wish-success").style.display = "none";
      document.getElementById("wish-form").style.display    = "block";
    }, 5000);
  }
}

/* ═══════════════════════════════════════════════════
   ADMIN
   ═══════════════════════════════════════════════════ */
function initHeartAdmin() {
  // Double-click on white heart (header) OR hero heart opens admin
  const openAdmin = () => document.getElementById("admin-panel").classList.add("open");
  const headerHeart = document.getElementById("header-heart");
  if (headerHeart) headerHeart.addEventListener("dblclick", openAdmin);
  const heroHeart = document.getElementById("home-hero-heart");
  if (heroHeart) heroHeart.addEventListener("dblclick", openAdmin);

  document.getElementById("admin-close").addEventListener("click", () => {
    document.getElementById("admin-panel").classList.remove("open");
  });

  // Tabs
  document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".admin-content-panel").forEach(p => p.style.display = "none");
      tab.classList.add("active");
      document.getElementById("admin-" + tab.dataset.tab).style.display = "block";
    });
  });

  // Photo
  document.getElementById("photo-zone").addEventListener("click", () =>
    document.getElementById("photo-file").click());
  document.getElementById("photo-file").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) document.getElementById("photo-zone-label").textContent = f.name;
  });
  document.getElementById("photo-upload-btn").addEventListener("click", async () => {
    const f = document.getElementById("photo-file").files[0];
    if (!f) return;
    setAdminStatus("photo","Yüklənir...", "");
    const ok = await ghPutBinary(`images/${Date.now()}_${f.name}`, f, "Add photo [◉°]");
    setAdminStatus("photo", ok ? "✅ Şəkil əlavə edildi!" : "❌ Xəta baş verdi", ok ? "ok" : "err");
    if (ok) { galleryLoaded = false; document.getElementById("photo-file").value = ""; document.getElementById("photo-zone-label").textContent = "Şəkil seçin"; }
  });

  // Letter
  document.getElementById("letter-upload-btn").addEventListener("click", async () => {
    const title = document.getElementById("al-title").value.trim();
    const body  = document.getElementById("al-body").value.trim();
    if (!title || !body) return;
    setAdminStatus("letter","Göndərilir...", "");
    const ok = await ghPut(`letters/${title.replace(/\s+/g,"_")}_${Date.now()}.txt`, body, "Add letter જ⁀➴");
    setAdminStatus("letter", ok ? "✅ Məktub əlavə edildi!" : "❌ Xəta baş verdi", ok ? "ok" : "err");
    if (ok) { lettersLoaded=false; document.getElementById("al-title").value=""; document.getElementById("al-body").value=""; }
  });

  // Music
  document.getElementById("music-zone").addEventListener("click", () =>
    document.getElementById("music-file").click());
  document.getElementById("music-file").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) document.getElementById("music-zone-label").textContent = f.name;
  });
  document.getElementById("music-upload-btn").addEventListener("click", async () => {
    const f = document.getElementById("music-file").files[0];
    if (!f) return;
    setAdminStatus("music","Yüklənir...","");
    const ok = await ghPutBinary(`music/${f.name}`, f, "Add music 𝄞𝄢");
    setAdminStatus("music", ok ? "✅ Musiqi əlavə edildi!" : "❌ Xəta baş verdi", ok ? "ok" : "err");
    if (ok) { musicLoaded=false; document.getElementById("music-file").value=""; document.getElementById("music-zone-label").textContent="Musiqi fayli seçin"; }
  });
}

function setAdminStatus(section, msg, type) {
  const el = document.getElementById(`${section}-status`);
  el.textContent  = msg;
  el.className    = "status-msg" + (type === "ok" ? " status-ok" : type === "err" ? " status-err" : "");
  el.style.display = msg ? "block" : "none";
}

/* ═══════════════════════════════════════════════════
   CONFETTI
   ═══════════════════════════════════════════════════ */
function confettiSmall() {
  confetti({ particleCount:80, spread:70, origin:{y:.6}, colors:["#e91e63","#c2185b","#ff80ab","#ffffff","#ffd700"], zIndex: 9999 });
}

function confettiBig() {
  const fire = (ratio, opts) =>
    confetti({ ...opts, particleCount: Math.floor(200*ratio), origin:{y:.7}, zIndex: 9999 });
  fire(.25,{spread:26,startVelocity:55,colors:["#e91e63"]});
  fire(.2, {spread:60,colors:["#ff80ab"]});
  fire(.35,{spread:100,decay:.91,scalar:.8,colors:["#fff"]});
  fire(.1, {spread:120,startVelocity:25,decay:.92,scalar:1.2,colors:["#ffd700"]});
  fire(.1, {spread:120,startVelocity:45,colors:["#c2185b"]});
}

/* ═══════════════════════════════════════════════════
   SVG HELPERS
   ═══════════════════════════════════════════════════ */
function svgPlay(s=24) {
  return `<svg viewBox="0 0 24 24" fill="white" width="${s}" height="${s}"><polygon points="5,3 19,12 5,21"/></svg>`;
}
function svgPause(s=24) {
  return `<svg viewBox="0 0 24 24" fill="white" width="${s}" height="${s}"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
}

/* ═══════════════════════════════════════════════════
   DOM HELPERS
   ═══════════════════════════════════════════════════ */
function skeletons(n, cls) {
  return Array.from({length:n}).map((_,i) => `<div class="skeleton ${cls}" style="height:80px;margin-bottom:10px;animation-delay:${i*.12}s"></div>`).join("");
}

function emptyState(icon, msg, hint="") {
  return `<div class="empty-state"><div style="font-size:48px;margin-bottom:14px;opacity:.35">${icon}</div><p>${msg}</p>${hint ? `<small>${hint}</small>` : ""}</div>`;
}

/* ═══════════════════════════════════════════════════
   BOOTSTRAP
   ═══════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initLightbox();
  initLetterModal();
  initGiftModal();
});
