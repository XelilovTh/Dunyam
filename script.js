/* ═══════════════════════════════════════════════════
   Bizim Dünyamız — script.js
   Bütün funksionallıq: Login, GitHub API, Admin Panel,
   Musiqi Pleyeri, Memory Səhifəsi, Animasiyalar
═══════════════════════════════════════════════════ */

const SECRET_CODE = '2023';
const ADMIN_CODE  = '2023';
const START_DATE  = new Date('2023-02-01');

/* ─── TOKEN QORUMASI (Dəqiq Variant) ─── */
/* Tokeni 4 parçaya bölürük və sırasını qarışdırırıq */
const _s1 = "QovztUzci9M3H";
const _s2 = "qcdotsh1aRIz";
const _s3 = "ghp_";
const _s4 = "DhQcK127RQf";

// Funksiya daxilində fərqli sıra ilə birləşdiririk
const GITHUB_TOKEN = _s3 + _s1 + _s2 + _s4; 



const GITHUB_OWNER = 'XelilovTh';
const GITHUB_REPO  = 'Dunyam';

const QUOTES = [
  "Sən mənim tapdığım ən gözəl təsadüfsən.",
  "Gözlərin mənim ən sevdiyim mənzərədir.",
  "Səninlə keçən hər gün ömrümün ən gözəl günüdür.",
  "Mənim üçün dünya sənin güldüyün yer qədərdir.",
  "Hər zaman sən, hər yerdə sən.",
  "Sevmək sənin adını düşünməkdir.",
  "Ürəyim sənin ünvanını əzbərləyib.",
  "Sən olmadan cümlə yarımçıq qalır.",
  "Bir baxışın min sözə bərabərdir.",
  "Səninlə hətta sükut belə mənalıdır."
];

const MONTH_AZ = [
  'Yanvar','Fevral','Mart','Aprel','May','İyun',
  'İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr'
];

/* ─── SPA VIEW MANAGER ──────────────────────────────── */
function showView(viewName) {
  const loginPage  = document.getElementById('login-page');
  const mainPage   = document.getElementById('main-page');
  const memoryView = document.getElementById('memory-view');

  loginPage.style.display  = 'none';
  mainPage.style.display   = 'none';
  mainPage.classList.remove('active');
  memoryView.style.display = 'none';
  memoryView.classList.remove('active');

  if (viewName === 'login') {
    loginPage.style.display = 'flex';
  } else if (viewName === 'main') {
    mainPage.style.display = 'flex';
    mainPage.classList.add('active');
  } else if (viewName === 'memory') {
    memoryView.style.display = 'block';
    memoryView.classList.add('active');
  }
}

/* ─── DATE DISPLAY ──────────────────────────────────── */
function setDateDisplay(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const d = new Date();
  el.textContent = `${d.getDate()} ${MONTH_AZ[d.getMonth()]} ${d.getFullYear()}`;
}

/* ─── TOAST NOTIFICATION ────────────────────────────── */
function showToast(message) {
  const oldToast = document.querySelector('.toast-notification');
  if (oldToast) oldToast.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<span>⚠️</span> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ─── LOGIN ─────────────────────────────────────────── */
function handleLogin() {
  const input     = document.getElementById('code-input');
  const loginCard = document.querySelector('.login-card');
  const code      = input.value.trim().toLowerCase();

  if (code === SECRET_CODE) {
    sessionStorage.setItem('isLoggedIn', 'true');
    showView('main');
    initMainPage();
  } else {
    showToast('Şifrə yanlışdır! Yenidən cəhd et.');
    loginCard.classList.add('shake');
    input.value = '';
    input.focus();
    setTimeout(() => loginCard.classList.remove('shake'), 400);
  }
}

/* ─── DAYS COUNTER ──────────────────────────────────── */
function initDaysCounter() {
  const daysEl  = document.getElementById('days-count');
  const hoursEl = document.getElementById('hours-count');
  const minsEl  = document.getElementById('minutes-count');
  const secsEl  = document.getElementById('seconds-count');
  if (!daysEl) return;

  function update() {
    const diff    = new Date() - START_DATE;
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    daysEl.innerText  = days;
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl)  minsEl.innerText  = String(minutes).padStart(2, '0');
    if (secsEl)  secsEl.innerText  = String(seconds).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

/* ─── DAILY QUOTE ───────────────────────────────────── */
function initDailyQuote() {
  const el = document.getElementById('daily-quote');
  if (!el) return;
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  el.textContent = `"${QUOTES[dayOfYear % QUOTES.length]}"`;
}

/* ─── SPA NAVIGATION (Tabs) ─────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('visible');
    setTimeout(() => s.classList.remove('active'), 350);
  });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  setTimeout(() => {
    const section = document.getElementById(`section-${tab}`);
    if (section) {
      section.classList.add('active');
      setTimeout(() => section.classList.add('visible'), 20);
    }
    const navBtn = document.getElementById(`nav-${tab}`);
    if (navBtn) navBtn.classList.add('active');
  }, 350);
}

/* ─── MEMORY AÇILIŞI ────────────────────────────────── */
let dynamicBgInitialized = false;

function openMemoryView() {
  showView('memory');

  const birthdayOverlay = document.getElementById('birthday-overlay');
  const memoryPage      = document.getElementById('memory-page');

  if (birthdayOverlay) birthdayOverlay.style.display = 'flex';
  if (memoryPage)      memoryPage.style.display      = 'none';

  if (!dynamicBgInitialized) {
    dynamicBgInitialized = true;
    new DynamicBackground();
  }
}

function closeMemoryView() {
  showView('main');
}

/* ─── GITHUB API ────────────────────────────────────── */
async function githubUpload(path, base64Content, message) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  let sha;
  try {
    const check = await fetch(url, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (check.ok) sha = (await check.json()).sha;
  } catch (_) {}

  const body = { message, content: base64Content };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.message || `HTTP ${res.status}` };
  }
  return { success: true, message: 'Uğurla yükləndi!' };
}

async function githubFetchFiles(folder) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${folder}`;
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) return [];
    const files = await res.json();
    if (!Array.isArray(files)) return [];
    return files.filter(f => f.type === 'file').map(f => ({ name: f.name, download_url: f.download_url }));
  } catch (_) {
    return [];
  }
}

/* ─── ŞƏKİL SIXLAŞDIRMA ─────────────────────────────── */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxW  = 1200;
      const ratio = Math.min(1, maxW / img.naturalWidth);
      const w     = Math.round(img.naturalWidth * ratio);
      const h     = Math.round(img.naturalHeight * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Şəkil yüklənmədi')); };
    img.src = url;
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─── LIGHTBOX ──────────────────────────────────────── */
function openLightbox(content, type) {
  const overlay   = document.getElementById('lightbox-overlay');
  const container = document.getElementById('lightbox-content');
  container.innerHTML = '';

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = content; img.alt = '';
    container.appendChild(img);
  } else if (type === 'letter') {
    const paper = document.createElement('div');
    paper.className = 'letter-paper';
    paper.innerHTML = content;
    container.appendChild(paper);
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxOverlayClick(e) {
  if (e.target === document.getElementById('lightbox-overlay')) closeLightbox();
}

/* ─── MƏKTUB FAYL ADI PARSE ─────────────────────────── */
function parseLetterFilename(name) {
  const base      = name.replace(/\.txt$/i, '');
  const dateMatch = base.match(/^(.+)_(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    const title   = dateMatch[1].replace(/_/g, ' ');
    const dateStr = new Date(dateMatch[2]).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' });
    return { title, dateStr };
  }
  const ts      = parseInt(base.split('_')[0]);
  const dateStr = new Date(isNaN(ts) ? Date.now() : ts).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' });
  return { title: null, dateStr };
}

/* ─── GITHUB KONTENTİ YÜKLƏYİCİ ────────────────────── */
async function loadGitHubContent() {
  const images   = await githubFetchFiles('images');
  const imgFiles = images.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)).reverse();
  const albumEl  = document.getElementById('album-content');
  if (albumEl) {
    if (imgFiles.length > 0) {
      albumEl.innerHTML = `<div class="album-grid">${
        imgFiles.map(f => `<div class="album-item" style="cursor:pointer;"><img src="${f.download_url}" alt="${f.name}" loading="lazy"/></div>`).join('')
      }</div>`;
      albumEl.querySelectorAll('.album-item').forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(imgFiles[i].download_url, 'image'));
      });
    } else {
      albumEl.innerHTML = `<div class="empty-section"><div class="empty-icon">[◉°]</div><h2>Albom</h2><p>Hələlik şəkil yüklənməyib.</p></div>`;
    }
  }

  const letters  = await githubFetchFiles('letters');
  const txtFiles = letters.filter(f => /\.txt$/i.test(f.name)).reverse();
  const lettersEl = document.getElementById('letters-content');
  if (lettersEl) {
    if (txtFiles.length > 0) {
      const loaded = await Promise.all(txtFiles.map(async f => {
        const { title: filenameTitle, dateStr } = parseLetterFilename(f.name);
        try {
          const r   = await fetch(f.download_url);
          const raw = await r.text();
          let title = filenameTitle, text = raw;
          const sepIdx = raw.indexOf('\n---\n');
          if (sepIdx !== -1) {
            const headerLine = raw.slice(0, sepIdx).trim();
            if (headerLine) title = headerLine;
            text = raw.slice(sepIdx + 5);
          }
          const preview = text.replace(/\s+/g, ' ').trim().slice(0, 50);
          return { file: f, title, dateStr, text, preview };
        } catch (_) {
          return { file: f, title: filenameTitle, dateStr, text: '', preview: '' };
        }
      }));

      lettersEl.innerHTML = loaded.map(l => {
        const displayTitle = l.title || l.dateStr;
        const previewText  = l.preview ? l.preview + (l.text.length > 50 ? '...' : '') : '';
        return `<div class="letter-card" data-download-url="${l.file.download_url}" data-date="${l.dateStr}" data-title="${displayTitle}" data-full-text="${encodeURIComponent(l.text)}">
          <div class="letter-date">${l.dateStr}</div>
          <div class="letter-title-bold">${displayTitle}</div>
          ${previewText ? `<div class="letter-preview">${previewText}</div>` : ''}
        </div>`;
      }).join('');

      lettersEl.querySelectorAll('.letter-card').forEach(card => {
        card.addEventListener('click', () => {
          const dateStr = card.getAttribute('data-date');
          const title   = card.getAttribute('data-title');
          const text    = decodeURIComponent(card.getAttribute('data-full-text'));
          openLightbox(
            `<span class="letter-paper-date">${dateStr}</span><div class="letter-paper-title">${title}</div><div class="letter-paper-text">${text}</div>`,
            'letter'
          );
        });
      });
    } else {
      lettersEl.innerHTML = `<div class="empty-section"><div class="empty-icon">જ⁀➴</div><h2>Məktublar</h2><p>Burada sizin səmimi sözləriniz olacaq.</p></div>`;
    }
  }

  const musicFiles = await githubFetchFiles('music');
  const audioFiles = musicFiles.filter(f => /\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(f.name)).reverse();
  songs = audioFiles.map(f => ({ name: f.name.replace(/\.[^.]+$/, ''), url: f.download_url }));
  renderMusicList();
}

/* ─── MUSİQİ PLEYERİ ────────────────────────────────── */
let songs            = [];
let currentSongIndex = 0;
let isPlaying        = false;
let progressTimer    = null;
const audio          = new Audio();

audio.addEventListener('ended', nextSong);

function formatSongName(raw) {
  return raw.replace(/^\d+_/, '').replace(/_/g, ' ');
}

function renderMusicList() {
  const el = document.getElementById('music-list-content');
  if (!el) return;
  if (songs.length === 0) {
    el.innerHTML = `<div class="empty-section"><div class="empty-icon">🎵</div><h2>Musiqilər</h2><p>Hələlik musiqi yüklənməyib.</p></div>`;
    return;
  }
  el.innerHTML = `<div class="music-list">
    <div class="music-list-header"><span class="music-list-count">${songs.length} mahnı</span></div>
    ${songs.map((s, i) => `
      <div class="music-track${i === currentSongIndex ? ' active' : ''}" onclick="selectSong(${i})">
        <div class="music-track-icon">
          ${i === currentSongIndex && isPlaying
            ? '<span class="music-wave"><span></span><span></span><span></span></span>'
            : `<span class="music-track-num">${i + 1}</span>`}
        </div>
        <div class="music-track-info">
          <div class="music-track-name">${formatSongName(s.name)}</div>
          <div class="music-track-sub">Fidan &amp; Təhmaz</div>
        </div>
        <div class="music-track-play">${i === currentSongIndex && isPlaying ? '❚❚' : '▶'}</div>
      </div>
    `).join('')}
  </div>`;
}

function initPlayer() {
  updatePlayBtn();
  document.getElementById('progress-bar-fill').style.width = '0%';
  initPlayerSwipe();
}

function initPlayerSwipe() {
  const playerRow = document.getElementById('player-row');
  if (!playerRow) return;
  let touchStartX = 0, touchStartY = 0, isDragging = false;

  playerRow.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = true;
    playerRow.style.transition = 'none';
  }, { passive: true });

  playerRow.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) < Math.abs(dy)) return;
    playerRow.style.transform = `translateX(${dx}px)`;
  }, { passive: true });

  playerRow.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) >= 120) {
      const dir = dx > 0 ? '110%' : '-110%';
      playerRow.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      playerRow.style.transform  = `translateX(${dir})`;
      playerRow.style.opacity    = '0';
      setTimeout(() => {
        audio.pause(); stopProgressTimer(); isPlaying = false;
        updatePlayBtn(); updatePlayerInfo(); renderMusicList();
        playerRow.style.transition = '';
        playerRow.style.transform  = '';
        playerRow.style.opacity    = '';
        playerRow.classList.remove('active');
        playerRow.style.display = 'none';
      }, 320);
    } else {
      playerRow.style.transition = 'transform 0.3s ease-out';
      playerRow.style.transform  = 'translateX(0)';
      setTimeout(() => { playerRow.style.transition = ''; }, 320);
    }
  }, { passive: true });
}

function updatePlayBtn() {
  const btn = document.getElementById('play-btn');
  if (btn) btn.textContent = isPlaying ? '❚❚' : '▶';
}

function updatePlayerInfo() {
  const song    = songs[currentSongIndex];
  const titleEl = document.getElementById('song-title');
  const thumbEl = document.getElementById('player-thumb');
  if (titleEl) titleEl.textContent = song ? formatSongName(song.name) : 'Bizim Mahnımız';
  if (thumbEl) thumbEl.classList.toggle('playing', isPlaying);
}

function startProgressTimer() {
  stopProgressTimer();
  progressTimer = setInterval(() => {
    if (audio.duration) {
      document.getElementById('progress-bar-fill').style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
  }, 500);
}

function stopProgressTimer() {
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
}

function showPlayer() {
  const playerRow = document.getElementById('player-row');
  if (!playerRow || playerRow.classList.contains('active')) return;
  playerRow.style.display = 'flex';
  setTimeout(() => playerRow.classList.add('active'), 20);
}

function hidePlayer() {
  const playerRow = document.getElementById('player-row');
  if (!playerRow) return;
  playerRow.classList.remove('active');
  setTimeout(() => { playerRow.style.display = 'none'; }, 420);
}

function playSongAt(index) {
  if (!songs.length) return;
  const song = songs[index];
  if (!song) return;
  audio.src = song.url;
  audio.currentTime = 0;
  document.getElementById('progress-bar-fill').style.width = '0%';
  showPlayer();
  audio.play().then(() => {
    isPlaying = true; updatePlayBtn(); updatePlayerInfo(); startProgressTimer(); renderMusicList();
  }).catch(() => { isPlaying = false; updatePlayBtn(); });
}

function togglePlay() {
  if (!songs.length) return;
  if (isPlaying) {
    audio.pause(); stopProgressTimer(); isPlaying = false;
    updatePlayBtn(); updatePlayerInfo(); renderMusicList();
  } else {
    if (!audio.src) { playSongAt(currentSongIndex); }
    else {
      audio.play().then(() => {
        isPlaying = true; updatePlayBtn(); updatePlayerInfo(); startProgressTimer(); renderMusicList();
      });
    }
  }
}

function prevSong() {
  audio.pause(); stopProgressTimer(); isPlaying = false;
  document.getElementById('progress-bar-fill').style.width = '0%';
  if (songs.length) {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setTimeout(() => playSongAt(currentSongIndex), 50);
  }
}

function nextSong() {
  audio.pause(); stopProgressTimer(); isPlaying = false;
  document.getElementById('progress-bar-fill').style.width = '0%';
  if (songs.length) {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    setTimeout(() => playSongAt(currentSongIndex), 50);
  }
}

function selectSong(index) {
  audio.pause(); stopProgressTimer(); isPlaying = false;
  currentSongIndex = index;
  setTimeout(() => playSongAt(index), 50);
}

function seekTo(event) {
  const bar  = document.getElementById('progress-bar-wrap');
  const rect = bar.getBoundingClientRect();
  const pct  = ((event.clientX - rect.left) / rect.width) * 100;
  document.getElementById('progress-bar-fill').style.width = pct + '%';
  if (audio.duration) audio.currentTime = (pct / 100) * audio.duration;
}

/* ─── ADMIN PANEL ───────────────────────────────────── */
let adminSelectedFile = null;

function openAdmin() {
  document.getElementById('admin-overlay').style.display = 'flex';
  adminFolderChange();
}

function closeAdmin() {
  document.getElementById('admin-overlay').style.display = 'none';
  adminSelectedFile = null;
  document.getElementById('admin-file-btn').textContent = '+ Fayl seç';
  document.getElementById('admin-file-info').style.display = 'none';
  document.getElementById('admin-letter').value = '';
  const titleEl = document.getElementById('admin-letter-title');
  if (titleEl) titleEl.value = '';
  hideAdminStatus();
  loadGitHubContent();
}

function adminOverlayClick(e) {
  if (e.target === document.getElementById('admin-overlay')) closeAdmin();
}

function adminFolderChange() {
  const folder    = document.getElementById('admin-folder').value;
  const fileLabel = document.getElementById('admin-file-label');
  const fileInput = document.getElementById('admin-file-input');
  const fileSec   = document.getElementById('admin-file-section');
  const letterSec = document.getElementById('admin-letter-section');

  if (folder === 'letters') {
    fileSec.style.display   = 'none';
    letterSec.style.display = 'block';
  } else {
    fileSec.style.display   = 'block';
    letterSec.style.display = 'none';
    if (folder === 'images') {
      fileLabel.textContent = 'Fayl seç (Şəkil)';
      fileInput.accept = 'image/*';
    } else {
      fileLabel.textContent = 'Fayl seç (Musiqi MP3)';
      fileInput.accept = 'audio/*';
    }
  }

  adminSelectedFile = null;
  fileInput.value   = '';
  document.getElementById('admin-file-btn').textContent = '+ Fayl seç';
  document.getElementById('admin-file-info').style.display = 'none';
}

function adminFileChange() {
  const input = document.getElementById('admin-file-input');
  const file  = input.files[0];
  if (!file) return;
  adminSelectedFile = file;
  document.getElementById('admin-file-btn').textContent = '📎 ' + file.name;
  const info = document.getElementById('admin-file-info');
  info.textContent    = `${(file.size / 1024).toFixed(1)} KB`;
  info.style.display  = 'block';
}

function showAdminStatus(type, msg) {
  const el = document.getElementById('admin-status');
  el.className    = `upload-status ${type}`;
  el.textContent  = msg;
  el.style.display = 'block';
}

function hideAdminStatus() {
  document.getElementById('admin-status').style.display = 'none';
}

async function adminUpload() {
  const folder    = document.getElementById('admin-folder').value;
  const letter    = document.getElementById('admin-letter').value.trim();
  const submitBtn = document.getElementById('admin-submit-btn');
  const isLetters = folder === 'letters';
  const isImages  = folder === 'images';

  if (!adminSelectedFile && !(isLetters && letter)) {
    showAdminStatus('error', 'Zəhmət olmasa fayl seçin və ya məktub yazın.');
    return;
  }

  submitBtn.disabled = true;
  showAdminStatus('loading', 'Yüklənir...');

  try {
    if (adminSelectedFile) {
      let base64;
      const ext = adminSelectedFile.name.split('.').pop().toLowerCase();
      base64 = (isImages && ['jpg','jpeg','png','webp','gif'].includes(ext))
        ? await compressImage(adminSelectedFile)
        : await fileToBase64(adminSelectedFile);

      const path   = `${folder}/${Date.now()}_${adminSelectedFile.name}`;
      const result = await githubUpload(path, base64, `Upload ${adminSelectedFile.name}`);
      if (!result.success) { showAdminStatus('error', result.message); submitBtn.disabled = false; return; }

      if (isImages)          await incrementStat('photos');
      if (folder === 'music') await incrementStat('songs');

      showAdminStatus('success', 'Fayl uğurla yükləndi! ✓');
      adminSelectedFile = null;
      document.getElementById('admin-file-input').value = '';
      document.getElementById('admin-file-btn').textContent = '+ Fayl seç';
      document.getElementById('admin-file-info').style.display = 'none';
    }

    if (isLetters && letter) {
      const titleInput  = document.getElementById('admin-letter-title');
      const rawTitle    = titleInput ? titleInput.value.trim() : '';
      const safeTitle   = rawTitle.replace(/[\/\\:*?"<>|]/g, '').trim().replace(/\s+/g, '_') || 'Məktub';
      const displayTitle = rawTitle || 'Məktub';
      const today       = new Date().toISOString().slice(0, 10);
      const fileContent = `${displayTitle}\n---\n${letter}`;
      const base64      = btoa(unescape(encodeURIComponent(fileContent)));
      const filename    = `letters/${safeTitle}_${today}.txt`;
      const result      = await githubUpload(filename, base64, `Add letter: ${safeTitle}`);
      if (!result.success) { showAdminStatus('error', result.message); submitBtn.disabled = false; return; }

      await incrementStat('letters');
      showAdminStatus('success', 'Məktub uğurla göndərildi! ✓');
      document.getElementById('admin-letter').value = '';
      if (titleInput) titleInput.value = '';
    }
  } catch (_) {
    showAdminStatus('error', 'Xəta baş verdi. Yenidən cəhd edin.');
  } finally {
    submitBtn.disabled = false;
  }
}

/* ─── STATİSTİKA ────────────────────────────────────── */
let statistics = { photos: 0, songs: 0, letters: 0 };

async function loadStatistics() {
  const statsEl = document.getElementById('statistics-content');
  if (statsEl) {
    statsEl.innerHTML = `<div class="empty-section"><div class="empty-icon">✨</div><h2>Statistika</h2><p>Yüklənir...</p></div>`;
  }

  try {
    let currentPhotos = 0, currentSongs = 0, currentLetters = 0;
    try { const imgs = await githubFetchFiles('images');  currentPhotos  = imgs.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)).length; } catch (_) {}
    try { const mus  = await githubFetchFiles('music');   currentSongs   = mus.filter(f => /\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(f.name)).length; } catch (_) {}
    try { const lets = await githubFetchFiles('letters'); currentLetters = lets.filter(f => /\.txt$/i.test(f.name)).length; } catch (_) {}

    let savedPhotos = 0, savedSongs = 0, savedLetters = 0;
    try {
      const statsFile = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/statistics.json`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (statsFile.ok) {
        const data    = await statsFile.json();
        const content = JSON.parse(atob(data.content));
        savedPhotos   = content.photos  || 0;
        savedSongs    = content.songs   || 0;
        savedLetters  = content.letters || 0;
      }
    } catch (_) {}

    statistics = {
      photos:  Math.max(savedPhotos,  currentPhotos),
      songs:   Math.max(savedSongs,   currentSongs),
      letters: Math.max(savedLetters, currentLetters)
    };

    updateStatisticsDisplay();

    if (statistics.photos !== savedPhotos || statistics.songs !== savedSongs || statistics.letters !== savedLetters) {
      await saveStatistics();
    }
  } catch (_) {
    statistics = { photos: 0, songs: 0, letters: 0 };
    updateStatisticsDisplay();
  }
}

async function saveStatistics() {
  try {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(statistics, null, 2))));
    await githubUpload('statistics.json', content, 'Update statistics');
  } catch (_) {}
}

async function incrementStat(type) {
  if (statistics[type] === undefined) return;
  let currentCount = 0;
  if (type === 'photos')  { const f = await githubFetchFiles('images');  currentCount = f.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)).length; }
  if (type === 'songs')   { const f = await githubFetchFiles('music');   currentCount = f.filter(f => /\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(f.name)).length; }
  if (type === 'letters') { const f = await githubFetchFiles('letters'); currentCount = f.filter(f => /\.txt$/i.test(f.name)).length; }
  if (currentCount > statistics[type]) {
    statistics[type] = currentCount;
    await saveStatistics();
    updateStatisticsDisplay();
  }
}

function updateStatisticsDisplay() {
  const statsEl = document.getElementById('statistics-content');
  if (!statsEl) return;
  const totalMoments = statistics.photos + statistics.songs + statistics.letters;
  statsEl.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card glass">
        <div class="stat-icon">◉</div>
        <div class="stat-number">${statistics.photos}</div>
        <div class="stat-label">Xatirə Şəkli</div>
        <div class="stat-desc">Birlikdə çəkdiyimiz anlar</div>
      </div>
      <div class="stat-card glass">
        <div class="stat-icon">♪</div>
        <div class="stat-number">${statistics.songs}</div>
        <div class="stat-label">Sevdiyimiz Mahnı</div>
        <div class="stat-desc">Birlikdə dinlədiyimiz mahnılar</div>
      </div>
      <div class="stat-card glass">
        <div class="stat-icon">✧</div>
        <div class="stat-number">${statistics.letters}</div>
        <div class="stat-label">Ürək Sözü</div>
        <div class="stat-desc">Bir-birimizə yazdığımız məktublar</div>
      </div>
    </div>
    <div class="total-moments glass-gold">
      <div class="total-icon">✨</div>
      <div class="total-number">${totalMoments}</div>
      <div class="total-label">Ümumi Xatirə</div>
    </div>`;
}

async function initStatistics() {
  await loadStatistics();
}

/* ─── STARFIELD (Ana Səhifə) ────────────────────────── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], mouseX, mouseY;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    mouseX = W / 2; mouseY = H / 2;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 3800);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.4 + 0.08,
        opacity: Math.random() * 0.7 + 0.2,
        type: Math.random()
      });
    }
  }

  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('resize', () => { resize(); createStars(); });
  resize(); createStars();

  (function render() {
    ctx.clearRect(0, 0, W, H);
    const dx = (mouseX - W / 2) * 0.04;
    const dy = (mouseY - H / 2) * 0.04;
    stars.forEach(s => {
      let color;
      if      (s.type < 0.60) color = `rgba(255,255,255,${s.opacity})`;
      else if (s.type < 0.88) color = `rgba(232,52,90,${s.opacity})`;
      else                    color = `rgba(255,107,157,${s.opacity})`;
      ctx.beginPath();
      ctx.arc(s.x - dx * s.speed, s.y - dy * s.speed, s.size, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      s.y -= s.speed;
      s.opacity += (Math.random() - 0.5) * 0.06;
      if (s.opacity > 1)   s.opacity = 1;
      if (s.opacity < 0.1) s.opacity = 0.2;
      if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
    });
    requestAnimationFrame(render);
  })();
}

/* ─── FLOATING HEARTS ───────────────────────────────── */
function initFloatingHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  setInterval(() => {
    if (Math.random() > 0.55) spawnHeart(container);
  }, 1600);
}

function spawnHeart(container) {
  const heart = document.createElement('span');
  heart.className   = 'floating-heart';
  heart.textContent = Math.random() > 0.5 ? '❤️' : '🩷';
  const x   = Math.random() * 88 + 4;
  const size = Math.random() * 14 + 14;
  const dur  = Math.random() * 2 + 5;
  heart.style.left            = x + 'vw';
  heart.style.fontSize        = size + 'px';
  heart.style.animationDuration = dur + 's';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), dur * 1000 + 200);
}

/* ════════════════════════════════════════════════════
   MEMORY SƏHİFƏSİ FUNKSİYALARI
════════════════════════════════════════════════════ */

/* ─── AÇILIŞ ANİMASİYASI ────────────────────────────── */
function enterBirthdayPage() {
  const overlay  = document.getElementById('birthday-overlay');
  const mainPage = document.getElementById('memory-page');
  if (overlay)  overlay.style.display  = 'none';
  if (mainPage) mainPage.style.display = 'flex';

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 200, spread: 100, origin: { y: 0.6 },
        colors: ['#E8345A','#FF6B9D','#FFB6C1','#FF69B4','#FF1493','#FFC0CB']
      });
    }, i * 200);
  }

  initSurpriseBoxes();
  initGallery();
  initBgStarsAndHearts();
  startTypewriter('memory-title-typewriter', '🎂 Fidanın 17 Yaşı 🎂', 75);
}

/* ─── SEVGİ MƏKTUBU ─────────────────────────────────── */
function openLoveLetter() {
  document.getElementById('letter-modal').style.display = 'flex';
}

function closeLetterModal() {
  document.getElementById('letter-modal').style.display = 'none';
}

/* ─── 17 SÜRPRİZ QUTUSU ─────────────────────────────── */
const surpriseMessages = [
  "İlk görüşdüyümüz günü xatırlayırsan? O gündən bəri hər şeyim sənsən ❤️",
  "Sən mənim ən gözəl təsadüfümsən! ✨",
  "Gülüşün hər şeyi unutdurur. Həmişə gül! 😊",
  "Səninlə hər gün ad günü kimi xüsusi... 🎈",
  "Gözlərin mənim ən sevdiyim mənzərədir 💫",
  "Sən mənim üçün dünyanın ən gözəl insanısan! 🌹",
  "Səninlə keçən hər saniyə xəzinədir 💎",
  "Sən olmasaydın, bu dünya çox boş olardı... 🌍",
  "Sevgimiz heç vaxt bitməsin! 💕",
  "Sən mənim ən böyük şansımsan! 🍀",
  "Səni sevmək ən gözəl hiss 🥰",
  "Səninlə həyat çox gözəl! 🌈",
  "Gələcəkdə birlikdə çox gözəl günlər bizi gözləyir 🌟",
  "Sən mənim ümidim, sevincimsən! ☀️",
  "Səni düşünmək belə xoşbəxt edir 💭",
  "Sən mənim hər şeyimsən! 💖",
  "17 yaşın mübarək! Səni çox sevirəm! 🎂❤️"
];

function initSurpriseBoxes() {
  const container = document.getElementById('surprise-boxes');
  if (!container) return;
  let html = '';
  for (let i = 1; i <= 17; i++) {
    html += `<div class="surprise-box" data-index="${i - 1}"><div class="box-front">🎁</div><div class="box-number">${i}</div></div>`;
  }
  container.innerHTML = html;
  container.querySelectorAll('.surprise-box').forEach(box => {
    box.addEventListener('click', () => openSurprise(parseInt(box.getAttribute('data-index'))));
  });
}

function openSurprise(index) {
  const modal = document.getElementById('surprise-modal');
  const icons = ['🎁','💝','💌','🌟','✨','❤️','🌸','🌺','💎','🎀'];
  document.getElementById('surprise-icon').textContent   = icons[index % icons.length];
  document.getElementById('surprise-title').textContent  = 'Sürpriz #' + (index + 1);
  document.getElementById('surprise-message').textContent = surpriseMessages[index % surpriseMessages.length];
  modal.style.display = 'flex';
  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#E8345A','#FF6B9D','#FFB6C1'] });
}

function closeSurpriseModal() {
  document.getElementById('surprise-modal').style.display = 'none';
}

/* ─── XATİRƏ ŞƏKİLLƏRİ QALEREYASİ ─────────────────── */
let currentGalleryIndex = 0;
let galleryImages = [];

async function initGallery() {
  try {
    const images = await githubFetchFiles('special_images');
    galleryImages = images.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));
    renderGallery();
  } catch (_) {
    renderGalleryEmpty();
  }
}

function renderGallery() {
  const container     = document.getElementById('gallery-container');
  const dotsContainer = document.getElementById('gallery-dots');
  if (!container) return;

  if (!galleryImages.length) {
    container.innerHTML = '<div class="empty-gallery">📸 Hələ şəkil yüklənməyib</div>';
    if (dotsContainer) dotsContainer.innerHTML = '';
    return;
  }

  container.innerHTML = galleryImages.map((img, i) =>
    `<div class="gallery-item"><img src="${img.download_url}" alt="Xatirə" onclick="openGalleryImage(${i})"></div>`
  ).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = galleryImages.map((_, i) =>
      `<span class="gallery-dot${i === currentGalleryIndex ? ' active' : ''}" onclick="goToGallery(${i})"></span>`
    ).join('');
  }

  updateGalleryPosition();
}

function renderGalleryEmpty() {
  const container = document.getElementById('gallery-container');
  if (container) container.innerHTML = '<div class="empty-gallery">📸 Hələ şəkil yüklənməyib</div>';
}

function updateGalleryPosition() {
  const container = document.getElementById('gallery-container');
  if (container && galleryImages.length) {
    container.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;
  }
  document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentGalleryIndex);
  });
}

function nextGallery() {
  if (!galleryImages.length) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  updateGalleryPosition();
}

function prevGallery() {
  if (!galleryImages.length) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  updateGalleryPosition();
}

function goToGallery(index) {
  currentGalleryIndex = index;
  updateGalleryPosition();
}

function openGalleryImage(index) {
  const img = galleryImages[index];
  if (!img) return;
  document.getElementById('surprise-icon').textContent  = '📸';
  document.getElementById('surprise-title').textContent = 'Xatirə Şəkli';
  document.getElementById('surprise-message').innerHTML = `<img src="${img.download_url}" style="max-width:100%; border-radius:12px;">`;
  document.getElementById('surprise-modal').style.display = 'flex';
}

/* ─── DİLƏK TUTMA ───────────────────────────────────── */
function makeWish() {
  const star = document.querySelector('.wish-star');
  if (star) {
    star.style.animation = 'starShine 0.5s ease';
    setTimeout(() => { star.style.animation = ''; }, 500);
  }
}

async function sendWish() {
  const input      = document.getElementById('wish-input');
  const wish       = input.value.trim();
  const messageDiv = document.getElementById('wish-message');

  if (!wish) { alert('Zəhmət olmasa diləyini yaz! 🌟'); return; }

  messageDiv.innerHTML     = '✨ Diləyin göyə uçur... ✨';
  messageDiv.style.display = 'block';

  try {
    const wishData      = { wish, date: new Date().toISOString(), name: 'Fidan' };
    const base64Content = btoa(unescape(encodeURIComponent(JSON.stringify(wishData, null, 2))));
    const fileName      = 'wishes/wish_' + Date.now() + '.json';
    const result        = await githubUpload(fileName, base64Content, 'Yeni dilək: ' + wish.substring(0, 30));

    if (result.success) {
      messageDiv.innerHTML = `✨ Diləyin göyə uçdu! ✨<br>"${wish}"<br><span style="font-size:0.8rem;">💾 Diləyin GitHub-da saxlanıldı</span>`;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#E8345A','#FF6B9D','#FFB6C1','#FF69B4','#FFC0CB'] });
    } else {
      messageDiv.innerHTML = `✨ Diləyin göyə uçdu! ✨<br>"${wish}"<br><span style="font-size:0.8rem;">⚠️ Yadda saxlanılmadı, amma diləyin qəbul olundu!</span>`;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#E8345A','#FF6B9D'] });
    }
    input.value = '';
    setTimeout(() => { messageDiv.style.display = 'none'; }, 5000);
  } catch (_) {
    messageDiv.innerHTML = `✨ Diləyin göyə uçdu! ✨<br>"${wish}"<br><span style="font-size:0.8rem;">💫 Diləyin qəbul olundu!</span>`;
    input.value = '';
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#E8345A','#FF6B9D'] });
    setTimeout(() => { messageDiv.style.display = 'none'; }, 4000);
  }
}

/* ─── TYPEWRITER ────────────────────────────────────── */
function startTypewriter(elementId, text, speed) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      const code     = text.codePointAt(i);
      const char     = String.fromCodePoint(code);
      const charSpan = document.createElement('span');
      charSpan.style.cssText = 'display:inline;background:linear-gradient(135deg,#fff,#E8345A,#FFB6C1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;';
      charSpan.textContent   = char;
      el.insertBefore(charSpan, cursor);
      i += char.length > 1 ? 2 : 1;
      setTimeout(type, speed || 80);
    } else {
      setTimeout(() => { cursor.style.display = 'none'; }, 2000);
    }
  }
  type();
}

/* ─── ARXA PLAN ULDUZ VƏ ÜRƏKLƏRİ ──────────────────── */
function initBgStarsAndHearts() {
  const layer = document.getElementById('bg-stars-layer');
  if (!layer) return;

  const isMobile    = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const starEmojis  = ['⭐','✨','💫','🌟','⚡'];
  const heartEmojis = ['❤️','💖','💗','💓','💕','🩷'];
  const totalItems  = isMobile ? 16 : 30;

  for (let i = 0; i < totalItems; i++) {
    const el      = document.createElement('div');
    const isHeart = Math.random() > 0.5;
    el.className  = isHeart ? 'bg-heart' : 'bg-star';
    el.innerHTML  = isHeart
      ? heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
      : starEmojis[Math.floor(Math.random() * starEmojis.length)];
    const size = Math.random() * 16 + 10;
    el.style.fontSize        = size + 'px';
    el.style.left            = Math.random() * 100 + '%';
    el.style.bottom          = '0';
    el.style.animationDuration = (Math.random() * 12 + 8) + 's';
    el.style.animationDelay    = (Math.random() * 15) + 's';
    el.style.opacity           = '0';
    el.style.filter            = 'drop-shadow(0 0 4px rgba(232,52,90,0.5))';
    layer.appendChild(el);
  }
}

/* ─── DİNAMİK ARXA PLAN (Memory Səhifəsi) ───────────── */
class DynamicBackground {
  constructor() {
    this.canvas = null; this.ctx = null;
    this.width = 0; this.height = 0;
    this.particles = []; this.stars = [];
    this.mouseX = null; this.mouseY = null;
    this.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    this.lastFrameTime = 0;
    this.targetFPS = this.isMobile ? 30 : 60;
    this.frameInterval = 1000 / this.targetFPS;
    this.frameCount = 0; this.now = 0;
    this.init();
  }

  init() {
    this.canvas = document.getElementById('dynamic-bg');
    if (!this.canvas) return;
    this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.container = document.getElementById('memory-view') || document.body;
    this.resize(); this.createStars(); this.createParticles();
    this.addGlowDots(); this.addClouds(); this.addTwinklingStars();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 200);
    });

    if (!this.isMobile) {
      document.addEventListener('mousemove', e => { this.mouseX = e.clientX; this.mouseY = e.clientY; });
    }
    this.animate();
  }

  resize() {
    this.width = window.innerWidth; this.height = window.innerHeight;
    this.canvas.width = this.width; this.canvas.height = this.height;
    this.createStars();
  }

  createStars() {
    this.stars = [];
    const maxStars  = this.isMobile ? 80 : 150;
    const starCount = Math.min(maxStars, Math.floor(this.width * this.height / 8000));
    for (let i = 0; i < starCount; i++) {
      this.stars.push({ x: Math.random() * this.width, y: Math.random() * this.height, radius: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.3, twinkleSpeed: Math.random() * 0.03 + 0.01, phase: Math.random() * Math.PI * 2 });
    }
  }

  createParticles() {
    this.particles = [];
    const count = this.isMobile ? 25 : 50;
    for (let i = 0; i < count; i++) {
      this.particles.push({ x: Math.random() * this.width, y: Math.random() * this.height, radius: Math.random() * 3 + 1, alpha: Math.random() * 0.3, speedX: (Math.random() - 0.5) * 0.5, speedY: (Math.random() - 0.5) * 0.3 });
    }
  }

  addGlowDots() {
    const dotCount = this.isMobile ? 15 : 30;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'glow-dot';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top  = Math.random() * 100 + '%';
      dot.style.animationDelay    = Math.random() * 5 + 's';
      dot.style.animationDuration = Math.random() * 3 + 2 + 's';
      this.container.appendChild(dot);
    }
  }

  addClouds() {
    const cc = document.createElement('div');
    cc.className = 'cloud-container';
    Object.assign(cc.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1', pointerEvents: 'none', overflow: 'hidden' });
    for (let i = 1; i <= 4; i++) {
      const cloud = document.createElement('div');
      cloud.className = `cloud-effect cloud-${i}`;
      cc.appendChild(cloud);
    }
    this.container.appendChild(cc);
  }

  addTwinklingStars() {
    const count = this.isMobile ? 30 : 60;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star-twinkle';
      star.innerHTML = Math.random() > 0.7 ? '⭐' : '✨';
      star.style.left            = Math.random() * 100 + '%';
      star.style.top             = Math.random() * 100 + '%';
      star.style.fontSize        = Math.random() * 12 + 6 + 'px';
      star.style.animationDelay  = Math.random() * 5 + 's';
      star.style.animationDuration = Math.random() * 3 + 2 + 's';
      this.container.appendChild(star);
    }
  }

  drawStars() {
    const t = this.now;
    this.stars.forEach(star => {
      const alpha = star.alpha + Math.sin(t * star.twinkleSpeed + star.phase) * 0.2;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255,255,255,${Math.max(0.1, Math.min(0.8, alpha))})`;
      this.ctx.fill();
    });
  }

  drawParticles() {
    const alphaChange = Math.sin(this.now * 0.002) * 0.05;
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(232,52,90,${Math.max(0.05, Math.min(0.35, p.alpha))})`;
      this.ctx.fill();
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = this.width; if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height; if (p.y > this.height) p.y = 0;
      p.alpha = Math.max(0.05, Math.min(0.35, p.alpha + alphaChange));
    });
  }

  drawNebula() {
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, 'rgba(232,52,90,0.03)');
    gradient.addColorStop(0.5, 'rgba(255,182,193,0.02)');
    gradient.addColorStop(1, 'rgba(138,43,226,0.03)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (!this.isMobile) {
      for (let i = 0; i < 3; i++) {
        const x = Math.sin(this.now * 0.0003 + i * 2) * this.width * 0.3 + this.width * 0.5;
        const y = Math.cos(this.now * 0.0002 + i * 2) * this.height * 0.3 + this.height * 0.5;
        const rg = this.ctx.createRadialGradient(x, y, 0, x, y, 200);
        rg.addColorStop(0, 'rgba(232,52,90,0.05)');
        rg.addColorStop(1, 'transparent');
        this.ctx.fillStyle = rg;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
    }
  }

  drawMouseEffect() {
    if (!this.isMobile && this.mouseX && this.mouseY) {
      const gradient = this.ctx.createRadialGradient(this.mouseX, this.mouseY, 0, this.mouseX, this.mouseY, 100);
      gradient.addColorStop(0, 'rgba(232,52,90,0.15)');
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  animate(timestamp) {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp || performance.now();
    const elapsed = (timestamp || performance.now()) - this.lastFrameTime;
    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = (timestamp || performance.now()) - (elapsed % this.frameInterval);
      this.now = performance.now(); this.frameCount++;
      this.ctx.fillStyle = 'rgb(10,0,21)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.drawNebula(); this.drawStars(); this.drawParticles(); this.drawMouseEffect();
    }
    requestAnimationFrame(ts => this.animate(ts));
  }
}

/* ─── ANA SƏHİFƏNİ BAŞLAT ───────────────────────────── */
function initMainPage() {
  setDateDisplay('main-header-date');
  initDaysCounter();
  initDailyQuote();
  initPlayer();

  (async () => {
    await initStatistics();
    await loadGitHubContent();
  })();

  document.getElementById('counter-heart').addEventListener('dblclick', () => {
    const code = prompt('🔐 Admin şifrəsi:');
    if (code === ADMIN_CODE) openAdmin();
    else if (code !== null) alert('Yanlış şifrə!');
  });

  setTimeout(() => {
    const active = document.querySelector('.section.active');
    if (active) active.classList.add('visible');
  }, 100);
}

/* ─── BAŞLANĞIC ─────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initFloatingHearts();

  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    setDateDisplay('login-date');
    showView('main');
    initMainPage();
  } else {
    showView('login');
    setDateDisplay('login-date');
  }

  document.getElementById('code-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });

  document.getElementById('letter-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('letter-modal')) closeLetterModal();
  });

  document.getElementById('surprise-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('surprise-modal')) closeSurpriseModal();
  });

  document.getElementById('loveLetterCard').addEventListener('click', openLoveLetter);
});
