// ══════════════════════════════════════
//  BIZIM DUNYAMIZ — app.js v4.0
//  Firebase Realtime Database (Modular SDK v9)
//  Design: Black & Gold Romance
// ══════════════════════════════════════

import { initializeApp }          from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, push, remove }
                                   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ── Config ──────────────────────────────
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

// ── Quotes ──────────────────────────────
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

// ── Firebase init ───────────────────────
const fbApp = initializeApp(firebaseConfig);
const db     = getDatabase(fbApp);

// ── State ───────────────────────────────
let songs       = [];
let currentSong = -1;
let isPlaying   = false;

const audio = document.getElementById('audioEl');

// Wish check state stored in localStorage (visual only, not in Firebase)
const WISH_CHECKS_KEY = 'bizim_wish_checks';
function loadWishChecks() {
  try { return JSON.parse(localStorage.getItem(WISH_CHECKS_KEY) || '{}'); } catch { return {}; }
}
function saveWishChecks(obj) {
  try { localStorage.setItem(WISH_CHECKS_KEY, JSON.stringify(obj)); } catch {}
}

// ══════════════════════════════════════
//  PARTICLE ANIMATION — Stars & Hearts
// ══════════════════════════════════════
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 70;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 20;
      this.type = Math.random() < 0.72 ? 'star' : 'heart';
      this.size = this.type === 'star'
        ? 1 + Math.random() * 2.5
        : 5 + Math.random() * 7;
      this.speedY = -(0.12 + Math.random() * 0.28);
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.alpha  = 0;
      this.targetAlpha = 0.15 + Math.random() * 0.5;
      this.fadeIn = true;
      this.twinkleSpeed  = 0.003 + Math.random() * 0.008;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed  = (Math.random() - 0.5) * 0.008;
    }

    update(t) {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;
      if (this.fadeIn) {
        this.alpha += 0.005;
        if (this.alpha >= this.targetAlpha) { this.alpha = this.targetAlpha; this.fadeIn = false; }
      }
      const twinkle = Math.sin(t * this.twinkleSpeed + this.twinkleOffset) * 0.15;
      this.drawAlpha = Math.max(0, this.alpha + twinkle);
      if (this.y < 80) this.drawAlpha *= this.y / 80;
      if (this.y < -20) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.drawAlpha;
      if (this.type === 'star') this.drawStar();
      else this.drawHeart();
      ctx.restore();
    }

    drawStar() {
      const s = this.size;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 4);
      grd.addColorStop(0,   'rgba(249,231,159,.55)');
      grd.addColorStop(0.4, 'rgba(212,175,55,.18)');
      grd.addColorStop(1,   'rgba(212,175,55,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0, s * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(249,231,159,${this.drawAlpha > 0 ? 1 : 0})`;
      ctx.beginPath();
      const spikes = 4, r1 = s, r2 = s * 0.4;
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const r = i % 2 === 0 ? r1 : r2;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else         ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
    }

    drawHeart() {
      const s = this.size * 0.06;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(s, s);
      ctx.shadowColor = 'rgba(212,175,55,.7)';
      ctx.shadowBlur  = 18;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(-14, -18, -28,  2, 0, 18);
      ctx.bezierCurveTo( 28,  2,  14, -18, 0, -6);
      ctx.closePath();
      const grd = ctx.createLinearGradient(0, -18, 0, 18);
      grd.addColorStop(0, 'rgba(249,231,159,.85)');
      grd.addColorStop(1, 'rgba(183,149,11,.55)');
      ctx.fillStyle   = grd;
      ctx.strokeStyle = 'rgba(212,175,55,.3)';
      ctx.lineWidth   = 1.5;
      ctx.fill();
      ctx.stroke();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let animTime = 0;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    animTime++;
    particles.forEach(p => { p.update(animTime); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ══════════════════════════════════════
//  MODAL — Card detail viewer
// ══════════════════════════════════════
window.openModal = function (meta, title, body) {
  document.getElementById('modalMeta').textContent  = meta  || '';
  document.getElementById('modalTitle').textContent = title || '';
  document.getElementById('modalBody').textContent  = body  || '';
  document.getElementById('cardModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function (e) {
  if (e.target === document.getElementById('cardModal')) closeModalDirect();
};

window.closeModalDirect = function () {
  document.getElementById('cardModal').classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModalDirect();
});

// ══════════════════════════════════════
//  PASSWORD
// ══════════════════════════════════════
window.checkPassword = function () {
  const val = document.getElementById('pwInput').value.trim();
  if (val === SECRET_PASSWORD) {
    const lock = document.getElementById('lockScreen');
    lock.style.transition = 'opacity .7s ease';
    lock.style.opacity = '0';
    setTimeout(() => {
      lock.style.display = 'none';
      document.getElementById('app').style.display = 'block';
      initApp();
    }, 700);
  } else {
    const err   = document.getElementById('pwError');
    const field = document.querySelector('.lock-field');
    err.textContent = 'Şifrə yanlışdır. Yenidən cəhd et.';
    document.getElementById('pwInput').value = '';
    field.style.transition = 'none';
    field.style.transform  = 'translateX(0)';
    requestAnimationFrame(() => {
      field.style.transition = 'transform .08s ease';
      let shakes = 0;
      const shake = () => {
        if (shakes >= 6) { field.style.transform = 'translateX(0)'; return; }
        field.style.transform = shakes % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)';
        shakes++;
        setTimeout(shake, 80);
      };
      shake();
    });
    setTimeout(() => { err.textContent = ''; }, 3000);
  }
};

document.getElementById('pwInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') window.checkPassword();
});

// ══════════════════════════════════════
//  NAV
// ══════════════════════════════════════
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

// ══════════════════════════════════════
//  ADMIN TABS
// ══════════════════════════════════════
window.openAdminTab = function (id, el) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active-panel'));
  document.getElementById('tab-' + id).classList.add('active-panel');
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
};

// ══════════════════════════════════════
//  INIT — run once after login
// ══════════════════════════════════════
function initApp () {
  animateDayCounter();
  setRandomQuote();
  listenMemories();
  listenLetters();
  listenWishes();
  listenSongs();
}

// ══════════════════════════════════════
//  ANIMATED DAY COUNTER + LIVE CLOCK
// ══════════════════════════════════════

// Calculate total elapsed ms from START_DATE
function getElapsed () {
  return Math.max(0, Date.now() - START_DATE.getTime());
}

function elapsedToParts (ms) {
  const totalSec  = Math.floor(ms / 1000);
  const days    = Math.floor(totalSec / 86400);
  const hours   = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

// Animate a number from 0 → target over `duration` ms
function animateNumber (el, target, duration, formatter) {
  const start = performance.now();
  const fmt   = formatter || (n => String(n));
  function step (now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = fmt(current);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = fmt(target);
  }
  requestAnimationFrame(step);
}

let clockInterval = null;

function animateDayCounter () {
  const elapsed = getElapsed();
  const { days, hours, minutes, seconds } = elapsedToParts(elapsed);

  const dayEl  = document.getElementById('dayCounter');
  const hourEl = document.getElementById('hoursEl');
  const minEl  = document.getElementById('minutesEl');
  const secEl  = document.getElementById('secondsEl');

  if (!dayEl) return;

  // Animate days over 1.8s, hours over 1.4s, minutes over 1.1s
  animateNumber(dayEl,  days,    1800, n => n + ' gün');
  animateNumber(hourEl, hours,   1400, n => String(n));
  animateNumber(minEl,  minutes, 1100, n => String(n).padStart(2, '0'));

  // Seconds count up quickly then hand off to live tick
  animateNumber(secEl, seconds, 800, n => String(n).padStart(2, '0'));

  // Start live real-time tick after intro animation settles (~1.8s)
  setTimeout(() => {
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(() => {
      const { days: d, hours: h, minutes: m, seconds: s } = elapsedToParts(getElapsed());
      if (dayEl)  dayEl.textContent  = d + ' gün';
      if (hourEl) hourEl.textContent = String(h);
      if (minEl)  minEl.textContent  = String(m).padStart(2, '0');
      if (secEl)  secEl.textContent  = String(s).padStart(2, '0');
    }, 1000);
  }, 1900);
}

// ── Random quote ────────────────────────
function setRandomQuote () {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('quoteText').textContent = q;
}

// ══════════════════════════════════════
//  FIREBASE LISTENERS
// ══════════════════════════════════════

// ── Memories ────────────────────────────
function listenMemories () {
  onValue(ref(db, 'memories'), snap => {
    const list = snap.val();
    const container = document.getElementById('memoriesList');
    const empty     = document.getElementById('memoriesEmpty');
    container.innerHTML = '';

    const items = list ? Object.entries(list).reverse() : [];
    document.getElementById('statMemories').textContent = items.length;

    if (!items.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    items.forEach(([id, m]) => {
      const card = document.createElement('div');
      card.className = 'card';
      const preview = (m.content || '').length > 120
        ? (m.content || '').slice(0, 120).trimEnd() + '…'
        : (m.content || '');
      card.innerHTML = `
        <div class="card-meta">${m.date || ''}</div>
        <div class="card-title">${escHtml(m.title || 'Xatirə')}</div>
        <div class="card-body">${escHtml(preview)}</div>`;
      card.addEventListener('click', () =>
        openModal(m.date || '', m.title || 'Xatirə', m.content || '')
      );
      container.appendChild(card);
    });
  });
}

// ── Letters ─────────────────────────────
function listenLetters () {
  onValue(ref(db, 'letters'), snap => {
    const list = snap.val();
    const container = document.getElementById('lettersList');
    const empty     = document.getElementById('lettersEmpty');
    container.innerHTML = '';

    const items = list ? Object.entries(list).reverse() : [];
    document.getElementById('statLetters').textContent = items.length;

    if (!items.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    items.forEach(([id, l]) => {
      const card = document.createElement('div');
      card.className = 'card';
      const meta    = l.to ? 'Kimə: ' + l.to : '';
      const preview = (l.content || '').length > 120
        ? (l.content || '').slice(0, 120).trimEnd() + '…'
        : (l.content || '');
      card.innerHTML = `
        ${l.to ? `<div class="card-meta">Kimə: ${escHtml(l.to)}</div>` : ''}
        <div class="card-title">${escHtml(l.title || 'Məktub')}</div>
        <div class="card-body">${escHtml(preview)}</div>`;
      card.addEventListener('click', () =>
        openModal(meta, l.title || 'Məktub', l.content || '')
      );
      container.appendChild(card);
    });
  });
}

// ── Wishes — Interactive Checklist ──────
function listenWishes () {
  onValue(ref(db, 'wishes'), snap => {
    const list = snap.val();
    const container = document.getElementById('wishesList');
    const empty     = document.getElementById('wishesEmpty');
    container.innerHTML = '';

    const items = list ? Object.entries(list).reverse() : [];
    document.getElementById('statWishes').textContent = items.length;

    if (!items.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    const checks = loadWishChecks();

    items.forEach(([id, w]) => {
      const isChecked = !!checks[id];

      const item = document.createElement('div');
      item.className = 'wish-item' + (isChecked ? ' checked' : '');
      item.innerHTML = `
        <div class="wish-checkbox">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="wish-content">
          <div class="wish-title">${escHtml(w.title || 'Arzu')}</div>
          ${w.desc ? `<div class="wish-desc">${escHtml(w.desc)}</div>` : ''}
        </div>`;

      // Toggle check on click
      item.addEventListener('click', () => {
        const currentChecks = loadWishChecks();
        if (currentChecks[id]) {
          delete currentChecks[id];
          item.classList.remove('checked');
        } else {
          currentChecks[id] = true;
          item.classList.add('checked');
        }
        saveWishChecks(currentChecks);
      });

      container.appendChild(item);
    });
  });
}

// ── Songs ───────────────────────────────
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

    document.getElementById('statSongs').textContent = songs.length;
    renderSongList();
    renderAdminSongList();

    if (currentSong === -1 && songs.length) {
      loadSong(0, false);
    }
  });
}

// ══════════════════════════════════════
//  PLAYER
// ══════════════════════════════════════

// Central function: play a song by index, or toggle play/pause if already current
function playSongAt (index) {
  if (index < 0 || index >= songs.length) return;

  if (currentSong === index) {
    // Toggle play/pause for the current song
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().then(() => { isPlaying = true; updatePlayBtn(); updateVinyl(); renderSongList(); }).catch(() => {});
    }
    updatePlayBtn();
    updateVinyl();
    renderSongList();
  } else {
    // Load and play a new song
    loadSong(index, true);
  }
}

function renderSongList () {
  const container = document.getElementById('songList');
  const empty     = document.getElementById('songsEmpty');
  container.innerHTML = '';

  if (!songs.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  songs.forEach((s, i) => {
    const isCurrent = i === currentSong;
    const isThisPlaying = isCurrent && isPlaying;

    const item = document.createElement('div');
    item.className = 'song-item' + (isCurrent ? ' playing' : '');
    item.id = 'song-row-' + i;

    // Play/pause SVG for the row button
    const playIconSvg  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const pauseIconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    item.innerHTML = `
      <span class="song-num">${isCurrent ? (isThisPlaying ? '❙❙' : '▶') : i + 1}</span>
      <div class="song-info">
        <div class="song-name">${escHtml(s.title || 'Mahnı')}</div>
        <div class="song-art">${escHtml(s.artist || '')}</div>
      </div>
      <button class="song-play-btn" aria-label="${isThisPlaying ? 'Dayan' : 'Çal'}">
        ${isThisPlaying ? pauseIconSvg : playIconSvg}
      </button>`;

    // Both the row click and the button click call the same central function
    item.addEventListener('click', () => playSongAt(i));

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

  songs.forEach((s) => {
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
    updatePlayBtn(); updateVinyl(); renderSongList();
  } else {
    audio.play().then(() => { isPlaying = true; updatePlayBtn(); updateVinyl(); renderSongList(); }).catch(() => {});
  }
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

// Toggle between play / pause SVG icons
function updatePlayBtn () {
  const playIcon  = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  if (!playIcon || !pauseIcon) return;
  if (isPlaying) {
    playIcon.style.display  = 'none';
    pauseIcon.style.display = '';
  } else {
    playIcon.style.display  = '';
    pauseIcon.style.display = 'none';
  }
}

function updateVinyl () {
  const disc = document.getElementById('vinylDisc');
  if (!disc) return;
  if (isPlaying) disc.classList.add('spinning');
  else           disc.classList.remove('spinning');
}

audio.addEventListener('ended',      () => window.nextSong());
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressBar').value = pct;
  document.getElementById('curTime').textContent = fmtTime(audio.currentTime);
  document.getElementById('durTime').textContent = fmtTime(audio.duration);
});

function fmtTime (s) {
  if (!isFinite(s)) return '0:00';
  const m   = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return m + ':' + sec;
}

// ══════════════════════════════════════
//  ADMIN WRITE
// ══════════════════════════════════════

window.addSong = async function () {
  const title  = document.getElementById('songTitle').value.trim();
  const artist = document.getElementById('songArtist').value.trim();
  const url    = document.getElementById('songUrl').value.trim();
  const msg    = document.getElementById('songMsg');

  if (!title || !url) { msg.textContent = 'Adı və URL-i doldurun.'; msg.style.color = '#e07070'; return; }

  try {
    await push(ref(db, 'songs'), { title, artist, url });
    document.getElementById('songTitle').value  = '';
    document.getElementById('songArtist').value = '';
    document.getElementById('songUrl').value    = '';
    msg.textContent = '✦ Mahnı əlavə edildi!';
    msg.style.color = 'var(--gold)';
    setTimeout(() => { msg.textContent = ''; }, 3000);
  } catch (e) {
    msg.textContent = 'Xəta: ' + e.message;
    msg.style.color = '#e07070';
  }
};

window.addMemory = async function () {
  const title   = document.getElementById('memTitle').value.trim();
  const content = document.getElementById('memContent').value.trim();
  const date    = document.getElementById('memDate').value;
  const msg     = document.getElementById('memMsg');

  if (!title) { msg.textContent = 'Başlığı doldurun.'; msg.style.color = '#e07070'; return; }

  try {
    await push(ref(db, 'memories'), { title, content, date });
    document.getElementById('memTitle').value   = '';
    document.getElementById('memContent').value = '';
    document.getElementById('memDate').value    = '';
    msg.textContent = '✦ Xatirə əlavə edildi!';
    msg.style.color = 'var(--gold)';
    setTimeout(() => { msg.textContent = ''; }, 3000);
  } catch (e) {
    msg.textContent = 'Xəta: ' + e.message;
    msg.style.color = '#e07070';
  }
};

window.addLetter = async function () {
  const title   = document.getElementById('letTitle').value.trim();
  const content = document.getElementById('letContent').value.trim();
  const to      = document.getElementById('letTo').value.trim();
  const msg     = document.getElementById('letMsg');

  if (!title) { msg.textContent = 'Başlığı doldurun.'; msg.style.color = '#e07070'; return; }

  try {
    await push(ref(db, 'letters'), { title, content, to, date: new Date().toLocaleDateString('az-AZ') });
    document.getElementById('letTitle').value   = '';
    document.getElementById('letContent').value = '';
    document.getElementById('letTo').value      = '';
    msg.textContent = '✦ Məktub əlavə edildi!';
    msg.style.color = 'var(--gold)';
    setTimeout(() => { msg.textContent = ''; }, 3000);
  } catch (e) {
    msg.textContent = 'Xəta: ' + e.message;
    msg.style.color = '#e07070';
  }
};

window.addWish = async function () {
  const title = document.getElementById('wishTitle').value.trim();
  const desc  = document.getElementById('wishDesc').value.trim();
  const msg   = document.getElementById('wishMsg');

  if (!title) { msg.textContent = 'Arzu adını doldurun.'; msg.style.color = '#e07070'; return; }

  try {
    await push(ref(db, 'wishes'), { title, desc });
    document.getElementById('wishTitle').value = '';
    document.getElementById('wishDesc').value  = '';
    msg.textContent = '✦ Arzu əlavə edildi!';
    msg.style.color = 'var(--gold)';
    setTimeout(() => { msg.textContent = ''; }, 3000);
  } catch (e) {
    msg.textContent = 'Xəta: ' + e.message;
    msg.style.color = '#e07070';
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

// ── Utils ───────────────────────────────
function escHtml (str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
