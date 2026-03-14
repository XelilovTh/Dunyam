// ══════════════════════════════════════════════════
//  BIZIM DUNYAMIZ — app.js v3.0
//  Firebase Realtime Database (Modular SDK v9)
//  UI: Cinematic Dark Romance
// ══════════════════════════════════════════════════

import { initializeApp }                    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, push, remove }
                                             from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ── Firebase Config ──────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyBQI38u4i4s0EB9h8NfEcdHj7J7l79m3M4",
  authDomain:        "bizim-dunyamiz-f4021.firebaseapp.com",
  databaseURL:       "https://bizim-dunyamiz-f4021-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId:         "bizim-dunyamiz-f4021",
  storageBucket:     "bizim-dunyamiz-f4021.appspot.com",
  messagingSenderId: "502219744541",
  appId:             "1:502219744541:web:7aec0494f04c53f2c42df4",
  measurementId:     "G-24KFBMQ09M"
};

const SECRET_PASSWORD = '2023';
const START_DATE       = new Date('February 1, 2023 00:00:00');

// ── Quotes ──────────────────────────────────────
const QUOTES = [
  "Sevgi sözdə yox, hərəkətdə yaşayır.",
  "Sənin yanında hər gün xüsulidir.",
  "İki nəfər, bir dünya.",
  "Ən gözəl hekayəmiz hələ yazılmaqdadır.",
  "Hər sabah sənin üçün yeni bir şans deməkdir.",
  "Sevgi — ən yaxşı macəradır.",
  "Sənin gülüşün mənim ən sevimli mahnımdır.",
  "Birlikdə hər şey daha mənalıdır.",
  "Keçmişimiz zəngindir, gələcəyimiz aydındır.",
  "Sən mənim ən böyük şükranlığımsan.",
];

// ── Firebase Init ────────────────────────────────
const fbApp = initializeApp(firebaseConfig);
const db     = getDatabase(fbApp);

// ── State ────────────────────────────────────────
let songs       = [];
let currentSong = -1;
let isPlaying   = false;

const audio = document.getElementById('audioEl');

// ══════════════════════════════════════════════════
//  BOKEH CANVAS — atmospheric background particles
// ══════════════════════════════════════════════════
(function initBokeh () {
  const canvas = document.getElementById('bokehCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const circles = [];

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Warm gold / deep crimson palette for bokeh
  const COLORS = [
    'rgba(201,157,120,',  // gold
    'rgba(180,80,100,',   // rose
    'rgba(139,38,53,',    // crimson
    'rgba(232,201,165,',  // pale gold
  ];

  for (let i = 0; i < 55; i++) {
    circles.push({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      r:   Math.random() * 90 + 20,
      dx:  (Math.random() - .5) * .22,
      dy:  (Math.random() - .5) * .15,
      a:   Math.random() * .12 + .02,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  function draw () {
    ctx.clearRect(0, 0, W, H);
    circles.forEach(c => {
      const grd = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      grd.addColorStop(0,   c.color + c.a + ')');
      grd.addColorStop(0.5, c.color + (c.a * .5) + ')');
      grd.addColorStop(1,   c.color + '0)');
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      c.x += c.dx;
      c.y += c.dy;
      if (c.x < -c.r)  c.x = W + c.r;
      if (c.x > W + c.r) c.x = -c.r;
      if (c.y < -c.r)  c.y = H + c.r;
      if (c.y > H + c.r) c.y = -c.r;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ══════════════════════════════════════════════════
//  PASSWORD
// ══════════════════════════════════════════════════
window.checkPassword = function () {
  const val = document.getElementById('pwInput').value.trim();
  if (val === SECRET_PASSWORD) {
    const lock = document.getElementById('lockScreen');
    lock.style.transition = 'opacity .6s ease, transform .6s ease';
    lock.style.opacity    = '0';
    lock.style.transform  = 'scale(1.03)';
    setTimeout(() => {
      lock.style.display = 'none';
      document.getElementById('app').style.display = 'block';
      initApp();
    }, 620);
  } else {
    const err = document.getElementById('pwError');
    err.textContent = 'Şifrə yanlışdır. Yenidən cəhd et.';
    const input = document.getElementById('pwInput');
    input.value = '';
    // shake animation
    input.style.transition = 'transform .08s';
    let shakes = 0;
    const shake = setInterval(() => {
      input.style.transform = shakes % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)';
      shakes++;
      if (shakes > 5) { clearInterval(shake); input.style.transform = ''; }
    }, 80);
    setTimeout(() => { err.textContent = ''; }, 3000);
  }
};

document.getElementById('pwInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') window.checkPassword();
});

// ══════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════
window.showSection = function (name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
  document.getElementById('sec-' + name).classList.add('active-section');
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleMenu = function () {
  document.getElementById('navLinks').classList.toggle('open');
};

// ══════════════════════════════════════════════════
//  ADMIN TABS
// ══════════════════════════════════════════════════
window.openAdminTab = function (id, el) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active-panel'));
  document.getElementById('tab-' + id).classList.add('active-panel');
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
};

// ══════════════════════════════════════════════════
//  INIT — runs once after login
// ══════════════════════════════════════════════════
function initApp () {
  setDayCounter();
  setRandomQuote();
  listenMemories();
  listenLetters();
  listenWishes();
  listenSongs();
}

// ── Day counter ──────────────────────────────────
function setDayCounter () {
  const now  = new Date();
  const diff = Math.floor((now - START_DATE) / 86400000);
  // Animate number count-up
  animateCounter('dayCounter', diff, ' gün');
  document.getElementById('startDateLabel').textContent = '1 Fevral 2023-dən bu yana';
}

function animateCounter (id, target, suffix) {
  const el = document.getElementById(id);
  const duration = 1600;
  const start = performance.now();
  function step (now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Random quote ─────────────────────────────────
function setRandomQuote () {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const el = document.getElementById('quoteText');
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = q;
    el.style.transition = 'opacity .8s ease';
    el.style.opacity = '1';
  }, 200);
}

// ══════════════════════════════════════════════════
//  FIREBASE LISTENERS
// ══════════════════════════════════════════════════

// ── Memories ────────────────────────────────────
function listenMemories () {
  onValue(ref(db, 'memories'), snap => {
    const list = snap.val();
    const container = document.getElementById('memoriesList');
    const empty     = document.getElementById('memoriesEmpty');
    container.innerHTML = '';

    const items = list ? Object.entries(list).reverse() : [];
    animateStat('statMemories', items.length);

    if (!items.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    items.forEach(([id, m]) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-meta">${m.date || ''}</div>
        <div class="card-title">${escHtml(m.title || 'Xatirə')}</div>
        <div class="card-body">${escHtml(m.content || '')}</div>`;
      container.appendChild(card);
    });
  });
}

// ── Letters ──────────────────────────────────────
function listenLetters () {
  onValue(ref(db, 'letters'), snap => {
    const list = snap.val();
    const container = document.getElementById('lettersList');
    const empty     = document.getElementById('lettersEmpty');
    container.innerHTML = '';

    const items = list ? Object.entries(list).reverse() : [];
    animateStat('statLetters', items.length);

    if (!items.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    items.forEach(([id, l]) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        ${l.to ? `<div class="card-meta">Kimə: ${escHtml(l.to)}</div>` : ''}
        <div class="card-title">${escHtml(l.title || 'Məktub')}</div>
        <div class="card-body">${escHtml(l.content || '')}</div>`;
      container.appendChild(card);
    });
  });
}

// ── Wishes ───────────────────────────────────────
function listenWishes () {
  onValue(ref(db, 'wishes'), snap => {
    const list = snap.val();
    const container = document.getElementById('wishesList');
    const empty     = document.getElementById('wishesEmpty');
    container.innerHTML = '';

    const items = list ? Object.entries(list).reverse() : [];
    animateStat('statWishes', items.length);

    if (!items.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    items.forEach(([id, w]) => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-title">${escHtml(w.title || 'Arzu')}</div>
        ${w.desc ? `<div class="wish-desc">${escHtml(w.desc)}</div>` : ''}`;
      container.appendChild(card);
    });
  });
}

// ── Songs ────────────────────────────────────────
function listenSongs () {
  onValue(ref(db, 'songs'), snap => {
    const data = snap.val();
    songs = [];

    if (data) {
      if (Array.isArray(data)) {
        data.forEach((s, i) => { if (s) songs.push({ id: i, ...s }); });
      } else {
        Object.entries(data).forEach(([k, s]) => songs.push({ id: k, ...s }));
      }
    }

    animateStat('statSongs', songs.length);
    renderSongList();
    renderAdminSongList();

    if (currentSong === -1 && songs.length) {
      loadSong(0, false);
    }
  });
}

// ── Stat animation helper ────────────────────────
function animateStat (id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const current = parseInt(el.textContent) || 0;
  if (current === target) { el.textContent = target; return; }
  const duration = 800;
  const start = performance.now();
  function step (now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(current + eased * (target - current));
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ══════════════════════════════════════════════════
//  PLAYER
// ══════════════════════════════════════════════════
function renderSongList () {
  const container = document.getElementById('songList');
  const empty     = document.getElementById('songsEmpty');
  container.innerHTML = '';

  if (!songs.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  songs.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'song-item' + (i === currentSong ? ' playing' : '');
    item.id = 'song-row-' + i;
    item.onclick = () => loadSong(i, true);
    item.innerHTML = `
      <span class="song-num">${i === currentSong ? '▶' : i + 1}</span>
      <div class="song-info">
        <div class="song-name">${escHtml(s.title || 'Mahnı')}</div>
        <div class="song-art">${escHtml(s.artist || '')}</div>
      </div>`;
    container.appendChild(item);
  });
}

function renderAdminSongList () {
  const container = document.getElementById('adminSongList');
  container.innerHTML = '';

  if (!songs.length) {
    container.innerHTML = '<p class="empty-note">Hələ mahnı yoxdur.</p>';
    return;
  }

  songs.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'admin-song-row';
    row.innerHTML = `
      <div class="admin-song-info">
        ${escHtml(s.title || 'Mahnı')} <span>${escHtml(s.artist || '')}</span>
      </div>
      <button class="del-btn" data-id="${s.id}">Sil</button>`;
    row.querySelector('.del-btn').onclick = () => deleteSong(s.id);
    container.appendChild(row);
  });
}

function loadSong (index, play) {
  if (index < 0 || index >= songs.length) return;
  currentSong = index;
  const s = songs[index];

  document.getElementById('npTitle').textContent  = s.title  || 'Mahnı';
  document.getElementById('npArtist').textContent = s.artist || '';
  audio.src = s.url || '';
  audio.load();

  if (play) {
    audio.play()
      .then(() => { isPlaying = true; updatePlayBtn(); updateVinyl(); })
      .catch(() => {});
  } else {
    isPlaying = false;
    updatePlayBtn();
    updateVinyl();
  }

  renderSongList();
  document.getElementById('progressBar').value = 0;
  document.getElementById('curTime').textContent = '0:00';
  document.getElementById('durTime').textContent = '0:00';
}

window.togglePlay = function () {
  if (!songs.length) return;
  if (currentSong === -1) { loadSong(0, true); return; }
  if (isPlaying) {
    audio.pause(); isPlaying = false;
  } else {
    audio.play().then(() => { isPlaying = true; }).catch(() => {});
  }
  updatePlayBtn();
  updateVinyl();
};

window.nextSong = function () {
  if (!songs.length) return;
  loadSong((currentSong + 1) % songs.length, isPlaying);
};

window.prevSong = function () {
  if (!songs.length) return;
  loadSong((currentSong - 1 + songs.length) % songs.length, isPlaying);
};

window.seekTo = function (val) {
  if (audio.duration) audio.currentTime = (val / 100) * audio.duration;
};

window.setVol = function (val) {
  audio.volume = val / 100;
};

// Play/Pause icon swap + vinyl spin
function updatePlayBtn () {
  const playIcon  = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  if (isPlaying) {
    playIcon.style.display  = 'none';
    pauseIcon.style.display = '';
  } else {
    playIcon.style.display  = '';
    pauseIcon.style.display = 'none';
  }
}

function updateVinyl () {
  const vinyl = document.getElementById('vinylDisc');
  if (!vinyl) return;
  if (isPlaying) vinyl.classList.add('spinning');
  else           vinyl.classList.remove('spinning');
}

audio.addEventListener('ended', () => window.nextSong());

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressBar').value = pct;
  document.getElementById('curTime').textContent = fmtTime(audio.currentTime);
  document.getElementById('durTime').textContent = fmtTime(audio.duration);
});

audio.addEventListener('play',  () => { isPlaying = true;  updatePlayBtn(); updateVinyl(); });
audio.addEventListener('pause', () => { isPlaying = false; updatePlayBtn(); updateVinyl(); });

function fmtTime (s) {
  if (!isFinite(s)) return '0:00';
  const m   = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return m + ':' + sec;
}

// ══════════════════════════════════════════════════
//  ADMIN WRITE
// ══════════════════════════════════════════════════

window.addSong = async function () {
  const title  = document.getElementById('songTitle').value.trim();
  const artist = document.getElementById('songArtist').value.trim();
  const url    = document.getElementById('songUrl').value.trim();
  const msg    = document.getElementById('songMsg');

  if (!title || !url) {
    showMsg(msg, 'Adı və URL-i doldurun.', 'error'); return;
  }
  try {
    await push(ref(db, 'songs'), { title, artist, url });
    document.getElementById('songTitle').value  = '';
    document.getElementById('songArtist').value = '';
    document.getElementById('songUrl').value    = '';
    showMsg(msg, 'Mahnı əlavə edildi! ✦', 'success');
  } catch (e) {
    showMsg(msg, 'Xəta: ' + e.message, 'error');
  }
};

window.addMemory = async function () {
  const title   = document.getElementById('memTitle').value.trim();
  const content = document.getElementById('memContent').value.trim();
  const date    = document.getElementById('memDate').value;
  const msg     = document.getElementById('memMsg');

  if (!title) { showMsg(msg, 'Başlığı doldurun.', 'error'); return; }
  try {
    await push(ref(db, 'memories'), { title, content, date });
    document.getElementById('memTitle').value   = '';
    document.getElementById('memContent').value = '';
    document.getElementById('memDate').value    = '';
    showMsg(msg, 'Xatirə əlavə edildi! ✦', 'success');
  } catch (e) {
    showMsg(msg, 'Xəta: ' + e.message, 'error');
  }
};

window.addLetter = async function () {
  const title   = document.getElementById('letTitle').value.trim();
  const content = document.getElementById('letContent').value.trim();
  const to      = document.getElementById('letTo').value.trim();
  const msg     = document.getElementById('letMsg');

  if (!title) { showMsg(msg, 'Başlığı doldurun.', 'error'); return; }
  try {
    await push(ref(db, 'letters'), { title, content, to, date: new Date().toLocaleDateString('az-AZ') });
    document.getElementById('letTitle').value   = '';
    document.getElementById('letContent').value = '';
    document.getElementById('letTo').value      = '';
    showMsg(msg, 'Məktub əlavə edildi! ✦', 'success');
  } catch (e) {
    showMsg(msg, 'Xəta: ' + e.message, 'error');
  }
};

window.addWish = async function () {
  const title = document.getElementById('wishTitle').value.trim();
  const desc  = document.getElementById('wishDesc').value.trim();
  const msg   = document.getElementById('wishMsg');

  if (!title) { showMsg(msg, 'Arzu adını doldurun.', 'error'); return; }
  try {
    await push(ref(db, 'wishes'), { title, desc });
    document.getElementById('wishTitle').value = '';
    document.getElementById('wishDesc').value  = '';
    showMsg(msg, 'Arzu əlavə edildi! ✦', 'success');
  } catch (e) {
    showMsg(msg, 'Xəta: ' + e.message, 'error');
  }
};

async function deleteSong (id) {
  if (!confirm('Bu mahnını silmək istədiyinizə əminsiniz?')) return;
  try {
    await remove(ref(db, 'songs/' + id));
  } catch (e) {
    alert('Xəta: ' + e.message);
  }
}

// ── Helpers ──────────────────────────────────────
function showMsg (el, text, type) {
  el.textContent  = text;
  el.style.color  = type === 'error' ? '#e07070' : 'var(--gold)';
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.transition = 'opacity .5s';
    el.style.opacity    = '0';
    setTimeout(() => { el.textContent = ''; el.style.opacity = '1'; }, 500);
  }, 3000);
}

function escHtml (str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
