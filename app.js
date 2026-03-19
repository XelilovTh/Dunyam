/* ═══════════════════════════════════════════════════
   Bizim Dünyamız — app.js
   Bütün funksionallıq: GitHub API, Admin Panel,
   Musiqi Pleyeri, Şəkil Sıxlaşdırma, SPA
═══════════════════════════════════════════════════ */

const SECRET_CODE   = '';          // boş = istənilən şifrə ilə giriş
const ADMIN_CODE    = '2023';      // gizli admin şifrəsi
const START_DATE    = new Date('2023-02-01');
const MAIN_PAGE_URL = 'main.html';

// GitHub konfiqurasiyası
const GITHUB_TOKEN = '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';
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

/* ─── DATE DISPLAY ─────────────────────────────────── */
function setDateDisplay(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const d = new Date();
  el.textContent = `${d.getDate()} ${MONTH_AZ[d.getMonth()]} ${d.getFullYear()}`;
}

/* ─── LOGIN ────────────────────────────────────────── */
function handleLogin() {
  const input = document.getElementById('code-input').value;
  // Sənin mövcud şifrə yoxlama məntiqin
  if (input === SECRET_CODE || SECRET_CODE === '') {
    // BU SƏTRİ ƏLAVƏ ET:
    sessionStorage.setItem('isLoggedIn', 'true'); 
    
    window.location.href = MAIN_PAGE_URL;
  } else {
    document.getElementById('error-msg').style.display = 'block';
  }
}


/* ─── DAYS COUNTER ─────────────────────────────────── */
function initDaysCounter() {
  const el = document.getElementById('days-count');
  if (!el) return;
  const now    = new Date();
  const days   = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
  let current  = 0;
  const step   = Math.ceil(days / 80);
  const timer  = setInterval(() => {
    current += step;
    if (current >= days) { current = days; clearInterval(timer); }
    el.textContent = current.toLocaleString();
  }, 18);
}

/* ─── DAILY QUOTE ──────────────────────────────────── */
function initDailyQuote() {
  const el = document.getElementById('daily-quote');
  if (!el) return;
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  el.textContent = `"${QUOTES[dayOfYear % QUOTES.length]}"`;
}

/* ─── SPA NAVIGATION ───────────────────────────────── */
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

/* ─── GITHUB API ───────────────────────────────────── */
async function githubUpload(path, base64Content, message) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  let sha;

  try {
    const check = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (check.ok) {
      const existing = await check.json();
      sha = existing.sha;
    }
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
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!res.ok) return [];
    const files = await res.json();
    if (!Array.isArray(files)) return [];
    return files.filter(f => f.type === 'file').map(f => ({ name: f.name, download_url: f.download_url }));
  } catch (_) {
    return [];
  }
}

/* ─── ŞƏKIL SIXLAŞDIRMA (Canvas API) ──────────────── */
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
      canvas.width = w;
      canvas.height = h;
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
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─── LIGHTBOX ─────────────────────────────────────── */
function openLightbox(content, type) {
  const overlay = document.getElementById('lightbox-overlay');
  const container = document.getElementById('lightbox-content');

  container.innerHTML = '';

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = content;
    img.alt = '';
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
  const overlay = document.getElementById('lightbox-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxOverlayClick(e) {
  if (e.target === document.getElementById('lightbox-overlay')) {
    closeLightbox();
  }
}

/* ─── MƏKTUB FAYL ADINI PARSE ET ───────────────────── */
function parseLetterFilename(name) {
  const base = name.replace(/\.txt$/i, '');
  const dateMatch = base.match(/^(.+)_(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    const title = dateMatch[1].replace(/_/g, ' ');
    const dateStr = new Date(dateMatch[2]).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' });
    return { title, dateStr };
  }
  const ts = parseInt(base.split('_')[0]);
  const dateStr = new Date(isNaN(ts) ? Date.now() : ts).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' });
  return { title: null, dateStr };
}

/* ─── GITHUB KONTENTİ YÜKLƏYİCİ ───────────────────── */
async function loadGitHubContent() {
    const folders = ['images', 'music', 'letters'];
    
    for (const folder of folders) {
        const container = document.getElementById(`${folder}-container`);
        if (!container) continue;

        try {
            // ARTIQ GITHUB-A DEYİL, ÖZ VERCEL APİ-MİZƏ SORĞU GÖNDƏRİRİK
            const response = await fetch(/api/github?folder=${folder});

            if (!response.ok) throw new Error("API xətası");

            const files = await response.json();
            container.innerHTML = ''; 

            for (const file of files) {
                // Köhnə render məntiqləri eynilə qalır...
                if (folder === 'letters') {
                    const contentRes = await fetch(file.download_url);
                    const content = await contentRes.text();
                    renderLetter(file.name, content);
                } else if (folder === 'images') {
                    renderImage(file.download_url);
                } else if (folder === 'music') {
                    renderMusic(file.name, file.download_url);
                }
            }
        } catch (error) {
            console.error(error);
            container.innerHTML = `<p style="color:red;">Yükləmə alınmadı.</p>`;
        }
    }
}


function renderMusicList() {
  const el = document.getElementById('music-list-content');
  if (!el) return;

  if (songs.length === 0) {
    el.innerHTML = `<div class="empty-section"><div class="empty-icon">🎵</div><h2>Musiqilər</h2><p>Hələlik musiqi yüklənməyib. Admin panel ilə əlavə et.</p></div>`;
    return;
  }

  el.innerHTML = `<div class="music-list">
    <div class="music-list-header">
      <span class="music-list-title">🎶 Pleylist</span>
      <span class="music-list-count">${songs.length} mahnı</span>
    </div>
    ${songs.map((s, i) => `
      <div class="music-track${i === currentSongIndex ? ' active' : ''}" onclick="selectSong(${i})">
        <div class="music-track-icon">
          ${i === currentSongIndex && isPlaying
            ? '<span class="music-wave"><span></span><span></span><span></span></span>'
            : `<span class="music-track-num">${i + 1}</span>`
          }
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

/* ─── MUSİQİ PLEYERİ ───────────────────────────────── */
let songs           = [];
let currentSongIndex = 0;
let isPlaying        = false;
let progressTimer    = null;
const audio          = new Audio();

audio.addEventListener('ended', () => {
  nextSong();
});

function initPlayer() {
  updatePlayBtn();
  document.getElementById('progress-bar-fill').style.width = '0%';
  initPlayerSwipe();
}

function initPlayerSwipe() {
  const playerRow = document.getElementById('player-row');
  if (!playerRow) return;

  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging  = false;

  playerRow.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = true;
    playerRow.style.transition = 'none';
  }, { passive: true });

  playerRow.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) < Math.abs(dy)) return;
    playerRow.style.transform = `translateX(${dx}px)`;
  }, { passive: true });

  playerRow.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const SWIPE_THRESHOLD = 120;

    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      const dir = dx > 0 ? '110%' : '-110%';
      playerRow.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      playerRow.style.transform  = `translateX(${dir})`;
      playerRow.style.opacity    = '0';
      setTimeout(() => {
        audio.pause();
        stopProgressTimer();
        isPlaying = false;
        updatePlayBtn();
        updatePlayerInfo();
        renderMusicList();
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
  const song = songs[currentSongIndex];
  const titleEl  = document.getElementById('song-title');
  const thumbEl  = document.getElementById('player-thumb');
  if (titleEl) titleEl.textContent = song ? formatSongName(song.name) : 'Bizim Mahnımız';
  if (thumbEl) {
    thumbEl.classList.toggle('playing', isPlaying);
  }
}

function startProgressTimer() {
  stopProgressTimer();
  progressTimer = setInterval(() => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      document.getElementById('progress-bar-fill').style.width = pct + '%';
    }
  }, 500);
}

function stopProgressTimer() {
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
}

function showPlayer() {
  const playerRow = document.getElementById('player-row');
  if (!playerRow) return;
  if (!playerRow.classList.contains('active')) {
    playerRow.style.display = 'flex';
    setTimeout(() => playerRow.classList.add('active'), 20);
  }
}

function hidePlayer() {
  const playerRow = document.getElementById('player-row');
  if (!playerRow) return;
  playerRow.classList.remove('active');
  setTimeout(() => { playerRow.style.display = 'none'; }, 420);
}

function playSongAt(index) {
  if (songs.length === 0) return;
  const song = songs[index];
  if (!song) return;
  audio.src = song.url;
  audio.currentTime = 0;
  document.getElementById('progress-bar-fill').style.width = '0%';
  showPlayer();
  audio.play().then(() => {
    isPlaying = true;
    updatePlayBtn();
    updatePlayerInfo();
    startProgressTimer();
    renderMusicList();
  }).catch(() => { isPlaying = false; updatePlayBtn(); });
}

function togglePlay() {
  if (songs.length === 0) return;
  if (isPlaying) {
    audio.pause();
    stopProgressTimer();
    isPlaying = false;
    updatePlayBtn();
    updatePlayerInfo();
    renderMusicList();
  } else {
    if (!audio.src) {
      playSongAt(currentSongIndex);
    } else {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayBtn();
        updatePlayerInfo();
        startProgressTimer();
        renderMusicList();
      });
    }
  }
}

function prevSong() {
  audio.pause();
  stopProgressTimer();
  isPlaying = false;
  document.getElementById('progress-bar-fill').style.width = '0%';
  if (songs.length > 0) {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setTimeout(() => playSongAt(currentSongIndex), 50);
  }
}

function nextSong() {
  audio.pause();
  stopProgressTimer();
  isPlaying = false;
  document.getElementById('progress-bar-fill').style.width = '0%';
  if (songs.length > 0) {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    setTimeout(() => playSongAt(currentSongIndex), 50);
  }
}

function selectSong(index) {
  audio.pause();
  stopProgressTimer();
  isPlaying = false;
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

/* ─── ADMIN PANEL ──────────────────────────────────── */
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
  const folder     = document.getElementById('admin-folder').value;
  const fileLabel  = document.getElementById('admin-file-label');
  const fileInput  = document.getElementById('admin-file-input');
  const fileSec    = document.getElementById('admin-file-section');
  const letterSec  = document.getElementById('admin-letter-section');

  if (folder === 'letters') {
    fileSec.style.display = 'none';
    letterSec.style.display = 'block';
  } else {
    fileSec.style.display = 'block';
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
  fileInput.value = '';
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
  info.textContent = `${(file.size / 1024).toFixed(1)} KB`;
  info.style.display = 'block';
}

function showAdminStatus(type, msg) {
  const el = document.getElementById('admin-status');
  el.className = `upload-status ${type}`;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideAdminStatus() {
  document.getElementById('admin-status').style.display = 'none';
}

async function adminUpload() {
  const folder      = document.getElementById('admin-folder').value;
  const letter      = document.getElementById('admin-letter').value.trim();
  const submitBtn   = document.getElementById('admin-submit-btn');
  const isLetters   = folder === 'letters';
  const isImages    = folder === 'images';

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

      if (isImages && ['jpg','jpeg','png','webp','gif'].includes(ext)) {
        base64 = await compressImage(adminSelectedFile);
      } else {
        base64 = await fileToBase64(adminSelectedFile);
      }

      const path   = `${folder}/${Date.now()}_${adminSelectedFile.name}`;
      const result = await githubUpload(path, base64, `Upload ${adminSelectedFile.name}`);
      if (!result.success) {
        showAdminStatus('error', result.message);
        submitBtn.disabled = false;
        return;
      }
      showAdminStatus('success', 'Fayl uğurla yükləndi! ✓');
      adminSelectedFile = null;
      document.getElementById('admin-file-input').value = '';
      document.getElementById('admin-file-btn').textContent = '+ Fayl seç';
      document.getElementById('admin-file-info').style.display = 'none';
    }

    if (isLetters && letter) {
      const titleInput = document.getElementById('admin-letter-title');
      const rawTitle = titleInput ? titleInput.value.trim() : '';
      const safeTitle = rawTitle.replace(/[\/\\:*?"<>|]/g, '').trim().replace(/\s+/g, '_') || 'Məktub';
      const displayTitle = rawTitle || 'Məktub';
      const today = new Date().toISOString().slice(0, 10);
      const fileContent = `${displayTitle}\n---\n${letter}`;
      const base64   = btoa(unescape(encodeURIComponent(fileContent)));
      const filename = `letters/${safeTitle}_${today}.txt`;
      const result   = await githubUpload(filename, base64, `Add letter: ${safeTitle}`);
      if (!result.success) {
        showAdminStatus('error', result.message);
        submitBtn.disabled = false;
        return;
      }
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

/* ─── STARFIELD CANVAS ─────────────────────────────── */
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
      if (s.opacity > 1) s.opacity = 1;
      if (s.opacity < 0.1) s.opacity = 0.2;
      if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
    });
    requestAnimationFrame(render);
  })();
}

/* ─── FLOATING HEARTS ──────────────────────────────── */
function initFloatingHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  setInterval(() => {
    if (Math.random() > 0.55) spawnHeart(container);
  }, 1600);
}

function spawnHeart(container) {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > 0.5 ? '❤️' : '🩷';
  const x   = Math.random() * 88 + 4;
  const size = Math.random() * 14 + 14;
  const dur  = Math.random() * 2 + 5;
  heart.style.left = x + 'vw';
  heart.style.fontSize = size + 'px';
  heart.style.animationDuration = dur + 's';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), dur * 1000 + 200);
}
