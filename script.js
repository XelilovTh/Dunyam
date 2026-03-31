/* ═══════════════════════════════════════════════════
   Bizim Dünyamız — script.js (player inteqrasiya edildi)
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
    if (inp.value === "2023") {
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
const GH_TOKEN  = process.env.MY_TOKEN;
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


/* ─── State ─── */
let songs        = [];
let currentIdx   = -1;
let isPlaying    = false;
let lbPhotos     = [];
let lbIdx        = 0;
let lbZoom       = 1;
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
  initHeartAdmin();
  initMusicPlayer();
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

  let tx = 0, ty = 0;
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
    // Son yüklənəndən ilkə doğru sırala (timestamp-ə görə)
    .sort((a, b) => {
      // Fayl adının sonundaki rəqəmləri (timestamp) çıxar
      const aTimestamp = extractTimestamp(a.name);
      const bTimestamp = extractTimestamp(b.name);
      return bTimestamp - aTimestamp; // böyük olan əvvəldə (ən son yüklənən)
    });

  if (!files.length) {
    list.innerHTML = emptyState("જ⁀➴", "Hələ məktub yoxdur...");
    return;
  }

  list.innerHTML = "";
  files.forEach(f => {
    const rawTitle = f.name.replace(/\.(txt|md)$/i,"").replace(/_/g," ");
    const title = rawTitle.replace(/\s*\d{10,}$/, "").trim() || rawTitle;
    const card  = document.createElement("div");
    card.className = "letter-card";
    card.innerHTML = `
      <div class="letter-icon">
        <svg viewBox="0 0 24 24" fill="#e91e63" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>
      <div style="flex:1;overflow:hidden">
        <div class="letter-title">${escapeHtml(title)}</div>
        <div class="letter-preview" id="lpreview-${f.name}">જ⁀➴ Yüklənir...</div>
      </div>`;
    card.addEventListener("click", () => openLetter(f, title));
    list.appendChild(card);
    ghText(f.path).then(txt => {
      const el = document.getElementById(`lpreview-${f.name}`);
      if (el) el.textContent = txt ? txt.slice(0, 60).replace(/\n/g," ") + (txt.length > 60 ? "…" : "") : "જ⁀➴";
    });
  });
}

// Timestamp çıxarmaq üçün köməkçi funksiya
function extractTimestamp(filename) {
  // _ ilə ayrılmış hissələri al
  const parts = filename.replace(/\.(txt|md)$/i, "").split("_");
  // Son hissə timestamp ola bilər (rəqəmlər)
  const lastPart = parts[parts.length - 1];
  // Əgər son hissə rəqəmlərdən ibarətdirsə (timestamp)
  if (/^\d+$/.test(lastPart)) {
    return parseInt(lastPart, 10);
  }
  // Əgər timestamp yoxdursa, adın özünə görə sıralama üçün 0 qaytar
  return 0;
}

// XSS qorunması üçün escape funksiyası
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
   MUSIC — siyahı
   ═══════════════════════════════════════════════════ */
let musicLoaded = false;

async function loadMusic() {
  if (musicLoaded) return;
  musicLoaded = true;

  const list = document.getElementById("music-list");
  list.innerHTML = skeletons(4, "music-sk");

  const files = (await ghList("music"))
    .filter(f => /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(f.name))
    .sort((a,b) => b.name.localeCompare(a.name));

  songs = files;

  if (!files.length) {
    list.innerHTML = emptyState("🎵", "Hələ musiqi yoxdur...");
    return;
  }

  list.innerHTML = "";
  files.forEach((f, i) => {
    const name = f.name
      .replace(/^\d+\s*/, "")
      .replace(/\.(mp3|wav|ogg|aac|flac|m4a)$/i, "")
      .replace(/_/g, " ");
    
    const card = document.createElement("div");
    card.className = "song-card";
    card.id = `song-${i}`;
    card.innerHTML = `
      <div class="song-num" id="song-num-${i}">${i+1}</div>
      <span class="song-name">${name}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="#e91e63" stroke-width="2" width="16" height="16" style="opacity:.3;flex-shrink:0"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    
    card.addEventListener("click", () => {
      if (currentIdx === i) {
        togglePlay();
      } else {
        playSong(i);
      }
    });
    
    list.appendChild(card);
  });
}

/* ─── playSong: həm siyahını, həm playeri yeniləyir ─── */
function playSong(idx) {
  if (currentIdx !== -1) {
    const prevCard = document.getElementById(`song-${currentIdx}`);
    if (prevCard) prevCard.classList.remove("playing");
    const prevNum = document.getElementById(`song-num-${currentIdx}`);
    if (prevNum) prevNum.textContent = currentIdx + 1;
  }
  
  currentIdx = idx;
  audio.src = songs[idx].download_url;
  audio.load();
  audio.play().catch(() => {});
  isPlaying = true;
  
  const activeCard = document.getElementById(`song-${currentIdx}`);
  if (activeCard) activeCard.classList.add("playing");
  const activeNum = document.getElementById(`song-num-${currentIdx}`);
  if (activeNum) activeNum.innerHTML = svgPlay(16);

  /* Player UI-sini yenilə */
  const songName = songs[idx].name
    .replace(/^\d+\s*/, "")
    .replace(/\.(mp3|wav|ogg|aac|flac|m4a)$/i, "")
    .replace(/_/g, " ");
  playerShow(songName);
  playerSetPlayIcon(true);
}

/* ─── togglePlay ─── */
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    const activeNum = document.getElementById(`song-num-${currentIdx}`);
    if (activeNum) activeNum.textContent = currentIdx + 1;
    playerSetPlayIcon(false);
  } else {
    audio.play().catch(() => {});
    isPlaying = true;
    const activeNum = document.getElementById(`song-num-${currentIdx}`);
    if (activeNum) activeNum.innerHTML = svgPlay(16);
    playerSetPlayIcon(true);
  }
}

/* Mahnı bitəndə növbəti */
audio.addEventListener("ended", () => {
  if (songs.length && currentIdx !== -1) {
    const nextIdx = (currentIdx + 1) % songs.length;
    playSong(nextIdx);
  }
});

/* ═══════════════════════════════════════════════════
   MUSIC PLAYER (bottom bar)
   ═══════════════════════════════════════════════════ */
let playerVisible = false;
let seekDragging  = false;
let seekRaf       = null;

function initMusicPlayer() {
  const player   = document.getElementById("music-player");
  const playBtn  = document.getElementById("player-play-btn");
  const prevBtn  = document.getElementById("player-prev-btn");
  const nextBtn  = document.getElementById("player-next-btn");
  const seekbar  = document.getElementById("player-seekbar");
  const timeEl   = document.getElementById("player-time");
  const durEl    = document.getElementById("player-duration");
  const nav      = document.getElementById("bottom-nav");

  /* Navigasiya yüksəkliyinə görə player mövqeyini hesabla */
  function positionPlayer() {
    const navH = nav.getBoundingClientRect().height;
    player.style.bottom = (navH + 6) + "px";
  }
  positionPlayer();
  window.addEventListener("resize", positionPlayer);

  /* Play/Pause düyməsi */
  playBtn.addEventListener("click", () => {
    if (currentIdx === -1) return;
    togglePlay();
  });

  /* Əvvəlki mahnı */
  prevBtn.addEventListener("click", () => {
    if (!songs.length) return;
    const idx = currentIdx <= 0 ? songs.length - 1 : currentIdx - 1;
    playSong(idx);
  });

  /* Növbəti mahnı */
  nextBtn.addEventListener("click", () => {
    if (!songs.length) return;
    const idx = (currentIdx + 1) % songs.length;
    playSong(idx);
  });

  /* Seekbar — sürüşdürərkən */
  seekbar.addEventListener("mousedown",  () => seekDragging = true);
  seekbar.addEventListener("touchstart", () => seekDragging = true, { passive: true });
  seekbar.addEventListener("mouseup",  () => { seekDragging = false; if (audio.duration) audio.currentTime = (seekbar.value / 100) * audio.duration; });
  seekbar.addEventListener("touchend", () => { seekDragging = false; if (audio.duration) audio.currentTime = (seekbar.value / 100) * audio.duration; });
  seekbar.addEventListener("input", () => {
    if (audio.duration) {
      const t = (seekbar.value / 100) * audio.duration;
      timeEl.textContent = fmtTime(t);
    }
  });

  /* Seekbar'ı hər saniyə yenilə */
  function tickSeek() {
    if (!seekDragging && audio.duration) {
      seekbar.value = (audio.currentTime / audio.duration) * 100;
      /* progress rəngi */
      seekbar.style.background = `linear-gradient(to right, #e91e63 ${seekbar.value}%, rgba(233,30,99,.25) ${seekbar.value}%)`;
      timeEl.textContent = fmtTime(audio.currentTime);
      durEl.textContent  = fmtTime(audio.duration);
    }
    seekRaf = requestAnimationFrame(tickSeek);
  }
  seekRaf = requestAnimationFrame(tickSeek);

  /* Swipe to dismiss */
  let swipeStartX = 0;
  let swipeStartY = 0;
  let isSwiping   = false;

  const inner = document.getElementById("player-inner");

  inner.addEventListener("touchstart", e => {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
    isSwiping   = false;
    inner.style.transition = "none";
  }, { passive: true });

  inner.addEventListener("touchmove", e => {
    const dx = e.touches[0].clientX - swipeStartX;
    const dy = e.touches[0].clientY - swipeStartY;
    if (!isSwiping && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping = true;
    }
    if (isSwiping) {
      inner.style.transform = `translateX(${dx}px)`;
      inner.style.opacity   = String(Math.max(0, 1 - Math.abs(dx) / 200));
    }
  }, { passive: true });

  inner.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - swipeStartX;
    inner.style.transition = "";
    inner.style.transform  = "";
    inner.style.opacity    = "";
    if (isSwiping && Math.abs(dx) > 80) {
      playerDismiss();
    }
    isSwiping = false;
  });
}

function playerShow(songName) {
  const player = document.getElementById("music-player");
  document.getElementById("player-song-name").textContent = songName;

  if (!playerVisible) {
    player.classList.remove("hiding");
    player.classList.add("visible");
    playerVisible = true;
  } else {
    document.getElementById("player-song-name").textContent = songName;
  }
}

function playerDismiss() {
  const player = document.getElementById("music-player");
  player.classList.remove("visible");
  player.classList.add("hiding");
  player.addEventListener("animationend", () => {
    player.classList.remove("hiding");
    playerVisible = false;
  }, { once: true });
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
  if (currentIdx !== -1) {
    const prevCard = document.getElementById(`song-${currentIdx}`);
    if (prevCard) prevCard.classList.remove("playing");
    const prevNum = document.getElementById(`song-num-${currentIdx}`);
    if (prevNum) prevNum.textContent = currentIdx + 1;
  }
  currentIdx = -1;
}

function playerSetPlayIcon(playing) {
  const btn = document.getElementById("player-play-btn");
  if (!btn) return;
  if (playing) {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="white" width="20" height="20">
      <rect x="6" y="4" width="4" height="16" rx="1"/>
      <rect x="14" y="4" width="4" height="16" rx="1"/>
    </svg>`;
  } else {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="white" width="20" height="20">
      <polygon points="5,3 19,12 5,21"/>
    </svg>`;
  }
}

function fmtTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2,"0")}`;
}

/* ═══════════════════════════════════════════════════
   SVG HELPERS
   ═══════════════════════════════════════════════════ */
function svgPlay(s=16) {
  return `<svg viewBox="0 0 24 24" fill="white" width="${s}" height="${s}"><polygon points="5,3 19,12 5,21"/></svg>`;
}


/* ═══════════════════════════════════════════════════
   ADMIN
   ═══════════════════════════════════════════════════ */
function initHeartAdmin() {
  const openAdmin = () => document.getElementById("admin-panel").classList.add("open");
  const headerHeart = document.getElementById("header-heart");
  if (headerHeart) headerHeart.addEventListener("dblclick", openAdmin);
  const heroHeart = document.getElementById("home-hero-heart");
  if (heroHeart) heroHeart.addEventListener("dblclick", openAdmin);

  document.getElementById("admin-close").addEventListener("click", () => {
    document.getElementById("admin-panel").classList.remove("open");
  });

  document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".admin-content-panel").forEach(p => p.style.display = "none");
      tab.classList.add("active");
      document.getElementById("admin-" + tab.dataset.tab).style.display = "block";
    });
  });

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

  document.getElementById("letter-upload-btn").addEventListener("click", async () => {
    const title = document.getElementById("al-title").value.trim();
    const body  = document.getElementById("al-body").value.trim();
    if (!title || !body) return;
    setAdminStatus("letter","Göndərilir...", "");
    const ok = await ghPut(`letters/${title.replace(/\s+/g,"_")}_${Date.now()}.txt`, body, "Add letter જ⁀➴");
    setAdminStatus("letter", ok ? "✅ Məktub əlavə edildi!" : "❌ Xəta baş verdi", ok ? "ok" : "err");
    if (ok) { lettersLoaded=false; document.getElementById("al-title").value=""; document.getElementById("al-body").value=""; }
  });

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
});
