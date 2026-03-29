/* ================================================

================================================ */

// ──────────────────────────────────────────────
// ⚙️  CONFIG — Öz tokeninizi bura yazın
// ──────────────────────────────────────────────
const GITHUB_CONFIG = {
  owner:  'XelilovTh',           // GitHub istifadəçi adı
  repo:   'Dunyam',              // Repo adı
  folder: 'wishes',              // Qovluq adı
  token: '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'
};

// ──────────────────────────────────────────────
// LOADER
// ──────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    startBgAnimation();
    triggerScrollAnimations();
  }, 2200);
});

// ──────────────────────────────────────────────
// CUSTOM CURSOR
// ──────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mx = 0, my = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  setTimeout(() => {
    trail.style.left = mx + 'px';
    trail.style.top  = my + 'px';
  }, 80);
  if (Math.random() < 0.1) spawnMouseHeart(mx, my);
});

document.addEventListener('click', (e) => {
  cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
  setTimeout(() => cursor.style.transform = '', 300);
  for (let i = 0; i < 5; i++) spawnMouseHeart(e.clientX, e.clientY, true);
});

// Inject mouse-heart keyframes
const heartKeyframes = document.createElement('style');
heartKeyframes.textContent = `
@keyframes mouseHeartFly {
  0%   { opacity:1; transform: translate(-50%,-50%) scale(0.4); }
  100% { opacity:0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); }
}
@keyframes rainFall {
  0%   { transform: translateY(0) rotate(0deg); opacity:1; }
  100% { transform: translateY(110vh) rotate(var(--twist)); opacity:0.3; }
}
`;
document.head.appendChild(heartKeyframes);

function spawnMouseHeart(x, y, burst = false) {
  const el = document.createElement('div');
  el.textContent = ['❤️','💕','💗','✦','♥'][Math.floor(Math.random() * 5)];
  const size = burst ? (Math.random() * 18 + 10) : (Math.random() * 10 + 7);
  Object.assign(el.style, {
    position: 'fixed',
    left: x + 'px', top: y + 'px',
    fontSize: size + 'px',
    pointerEvents: 'none',
    zIndex: 9000,
    transform: 'translate(-50%,-50%)',
    animation: 'mouseHeartFly 1.1s ease-out forwards',
    '--dx': (Math.random() * 80 - 40) + 'px',
    '--dy': -(Math.random() * 60 + 30) + 'px',
  });
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// ──────────────────────────────────────────────
// MUSIC (Web Audio API)
// ──────────────────────────────────────────────
const musicBtn  = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const musicWave = document.querySelector('.music-wave');
let musicPlaying = false;
let audioCtx = null, gainNode = null, musicInterval = null;

const melodyNotes = [
  261.63,293.66,329.63,349.23,392.00,440.00,
  493.88,523.25,493.88,440.00,392.00,349.23,
  329.63,293.66,261.63,246.94,261.63,293.66,
  329.63,392.00,349.23,329.63,293.66,261.63
];
const bassNotes = [130.81,164.81,174.61,196.00,130.81,164.81];
let noteIdx = 0, bassIdx = 0;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.18;
  gainNode.connect(audioCtx.destination);
}

function playTone(freq, dur, type = 'sine', vol = 0.14, delay = 0) {
  if (!audioCtx) return;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + delay + 0.05);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + delay + dur - 0.05);
  osc.connect(gain); gain.connect(gainNode);
  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + dur);
}

function playMeasure() {
  for (let i = 0; i < 4; i++) {
    playTone(melodyNotes[noteIdx % melodyNotes.length], 0.38, 'sine', 0.12, i * 0.42);
    noteIdx++;
  }
  for (let i = 0; i < 2; i++) {
    playTone(bassNotes[bassIdx % bassNotes.length], 0.8, 'triangle', 0.06, i * 0.84);
    bassIdx++;
  }
  playTone(melodyNotes[(noteIdx + 4) % melodyNotes.length] * 0.75, 1.6, 'sine', 0.04, 0);
}

function startMusic() {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  playMeasure();
  musicInterval = setInterval(playMeasure, 1680);
  musicPlaying = true;
  musicIcon.textContent = '⏸';
  musicWave.classList.add('active');
}

function stopMusic() {
  clearInterval(musicInterval);
  musicInterval = null;
  musicPlaying = false;
  musicIcon.textContent = '♪';
  musicWave.classList.remove('active');
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) stopMusic(); else startMusic();
});

// Auto-start on first interaction
let autoMusic = false;
['click','touchstart'].forEach(ev => {
  document.addEventListener(ev, () => {
    if (!autoMusic) { autoMusic = true; startMusic(); }
  }, { once: true });
});

// ──────────────────────────────────────────────
// BACKGROUND CANVAS
// ──────────────────────────────────────────────
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx    = bgCanvas.getContext('2d');
let bgParticles = [];

function resizeBg() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBg);
resizeBg();

class BgParticle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = Math.random() * bgCanvas.width;
    this.y = init ? Math.random() * bgCanvas.height : bgCanvas.height + 20;
    this.size    = Math.random() * 20 + 6;
    this.opacity = Math.random() * 0.38 + 0.08;
    this.speed   = Math.random() * 0.65 + 0.2;
    this.drift   = (Math.random() - 0.5) * 0.5;
    this.wobble  = Math.random() * Math.PI * 2;
    this.wobbleS = Math.random() * 0.03 + 0.01;
    this.type    = Math.random() < 0.6 ? 'heart' : 'star';
    this.rot     = Math.random() * Math.PI * 2;
    this.rotS    = (Math.random() - 0.5) * 0.02;
    this.pulse   = Math.random() * Math.PI * 2;
  }
  update() {
    this.y -= this.speed;
    this.wobble += this.wobbleS;
    this.x += Math.sin(this.wobble) * 0.4 + this.drift;
    this.rot += this.rotS;
    this.pulse += 0.04;
    this.opacity = 0.08 + Math.sin(this.pulse) * 0.16;
    if (this.y < -30) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    const col = `rgba(255,107,157,${this.opacity})`;
    ctx.fillStyle = col;
    ctx.shadowBlur = 8;
    ctx.shadowColor = col;
    if (this.type === 'heart') drawHeart(ctx, 0, 0, this.size);
    else drawStar(ctx, 0, 0, this.size * 0.5, this.size, 5);
    ctx.restore();
  }
}

function drawHeart(ctx, x, y, s) {
  const h = s / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.4);
  ctx.bezierCurveTo(x, y - h * 0.2, x - h, y - h * 0.2, x - h, y + h * 0.2);
  ctx.bezierCurveTo(x - h, y + h * 0.7, x, y + h * 1.1, x, y + h * 1.2);
  ctx.bezierCurveTo(x, y + h * 1.1, x + h, y + h * 0.7, x + h, y + h * 0.2);
  ctx.bezierCurveTo(x + h, y - h * 0.2, x, y - h * 0.2, x, y + h * 0.4);
  ctx.fill();
}

function drawStar(ctx, cx, cy, ir, or_, pts) {
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? or_ : ir;
    const a = (Math.PI / pts) * i - Math.PI / 2;
    i === 0
      ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
      : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath(); ctx.fill();
}

function startBgAnimation() {
  bgParticles = Array.from({ length: 60 }, () => new BgParticle());
  bgLoop();
}

function bgLoop() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgParticles.forEach(p => { p.update(); p.draw(bgCtx); });
  requestAnimationFrame(bgLoop);
}

// ──────────────────────────────────────────────
// SCROLL ANIMATIONS
// ──────────────────────────────────────────────
function triggerScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.id === 'letter') startLetterTyping();
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll('.section').forEach(s => obs.observe(s));
}

// Parallax
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const hero = document.getElementById('hero');
  if (hero) hero.style.transform = `translateY(${sy * 0.22}px)`;
});

// ──────────────────────────────────────────────
// LETTER TYPING
// ──────────────────────────────────────────────
const letterText = `Əziz Fidan,

Bu gün sənin üçün xüsusi bir gündür — çünki sən dünyaya gəldin, və dünya daha gözəl bir yer oldu. Hər gün sənin yanında olmaq mənə milyonlarla gülüş, sonsuz bir xoşbəxtlik bəxş edir.

Sənin gözlərinin işığı, gülüşündəki istilik, hər sözündəki mehribanlıq — bunlar mənim həyatımın ən qiymətli xəzinələridir. Sən olmasaydın, bu dünya nə qədər boş olardı.

Ad günündə sənə arzulayıram ki, hər diləyin gerçək olsun, hər gülüşün əbədi qalsın, hər qəlb atışın sevgiylə dolsun. Sən bu dünyanın ən gözəl hissəsisən.

Sən mənim ilk fikrim, son arzumsun. Səni sevmək həyatımın ən böyük bəxtidir.

Əbədi sevinclə,`;

let letterStarted = false;

function startLetterTyping() {
  const body = document.getElementById('letterBody');
  if (!body || letterStarted) return;
  letterStarted = true;
  typeWriter(body, letterText, 0);
}

function typeWriter(el, text, i) {
  if (i === 0) el.innerHTML = '';
  if (i < text.length) {
    const ch = text[i];
    const cur = el.querySelector('.cursor-blink');
    if (cur) cur.remove();
    el.innerHTML += ch === '\n' ? '<br>' : ch;
    const cb = document.createElement('span');
    cb.className = 'cursor-blink';
    el.appendChild(cb);
    const delay = ch === '.' || ch === ',' ? 190
                : ch === '\n' ? 260
                : Math.random() * 30 + 22;
    setTimeout(() => typeWriter(el, text, i + 1), delay);
  } else {
    const cur = el.querySelector('.cursor-blink');
    if (cur) setTimeout(() => cur.remove(), 2200);
  }
}

// ──────────────────────────────────────────────
// SURPRISE BUTTON
// ──────────────────────────────────────────────
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseMsg = document.getElementById('surpriseMsg');
let surpriseDone = false;

surpriseBtn.addEventListener('click', () => {
  if (surpriseDone) return;
  surpriseDone = true;
  surpriseMsg.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => surpriseMsg.classList.add('show')));
  launchConfetti();
  for (let i = 0; i < 45; i++) setTimeout(rainHeart, i * 75);
  surpriseBtn.disabled = true;
  surpriseBtn.style.opacity = '0.5';
  surpriseBtn.style.cursor = 'default';
});

function rainHeart() {
  const el = document.createElement('div');
  el.textContent = ['❤️','💕','💗','💓','💖','🌹'][Math.floor(Math.random() * 6)];
  Object.assign(el.style, {
    position: 'fixed',
    left: Math.random() * window.innerWidth + 'px',
    top: '-40px',
    fontSize: (Math.random() * 22 + 14) + 'px',
    pointerEvents: 'none', zIndex: 4000,
    animation: `rainFall ${Math.random() * 2 + 2}s linear forwards`,
    '--twist': (Math.random() - 0.5) * 360 + 'deg',
  });
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// ──────────────────────────────────────────────
// CONFETTI
// ──────────────────────────────────────────────
const confettiCanvas = document.getElementById('confettiCanvas');
const cCtx = confettiCanvas.getContext('2d');
let cPieces = [], cActive = false;

confettiCanvas.width  = window.innerWidth;
confettiCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

class Confetti {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = -20;
    this.w = Math.random() * 13 + 5;
    this.h = Math.random() * 7 + 3;
    this.color = ['#ff6b9d','#ff4081','#ffd700','#ff8fb1','#fff','#ff1744','#f48fb1'][Math.floor(Math.random()*7)];
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = Math.random() * 4 + 2;
    this.rot = Math.random() * Math.PI * 2;
    this.rotS = (Math.random() - 0.5) * 0.2;
    this.opacity = 1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.rot += this.rotS; this.vy += 0.07;
    if (this.y > confettiCanvas.height) this.opacity = 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
    ctx.restore();
  }
}

function launchConfetti() {
  cActive = true;
  for (let i = 0; i < 200; i++) setTimeout(() => cPieces.push(new Confetti()), i * 14);
  confLoop();
  setTimeout(() => {
    cActive = false; cPieces = [];
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 7000);
}

function confLoop() {
  if (!cActive) return;
  cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  cPieces = cPieces.filter(p => p.opacity > 0);
  cPieces.forEach(p => { p.update(); p.draw(cCtx); });
  requestAnimationFrame(confLoop);
}

// ──────────────────────────────────────────────
// MOUSE PARALLAX
// ──────────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  const dx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
  const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  const hc = document.querySelector('.hero-content');
  if (hc) hc.style.transform = `translate(${dx * 9}px, ${dy * 5}px)`;
  const char = document.getElementById('character');
  if (char) char.style.transform = `translate(${dx * -13}px, ${dy * -9}px)`;
  document.querySelectorAll('.pupil').forEach(p => {
    p.style.transform = `translate(${dx * 3}px, ${dy * 3}px)`;
  });
});

// Touch fallback
document.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  for (let i = 0; i < 3; i++) {
    setTimeout(() => spawnMouseHeart(t.clientX, t.clientY, true), i * 80);
  }
}, { passive: true });

// ──────────────────────────────────────────────
// WISHES — GitHub API
// ──────────────────────────────────────────────
const wishText   = document.getElementById('wishText');
const wishName   = document.getElementById('wishName');
const sendBtn    = document.getElementById('sendWishBtn');
const wishStatus = document.getElementById('wishStatus');
const charCount  = document.getElementById('charCount');

// Character counter
wishText.addEventListener('input', () => {
  charCount.textContent = wishText.value.length;
});

// Send wish
sendBtn.addEventListener('click', sendWish);

async function sendWish() {
  const name = wishName.value.trim();
  const wish = wishText.value.trim();

  if (!wish) {
    showStatus('⚠️ Zəhmət olmasa diləyinizi yazın!', 'error');
    wishText.focus();
    return;
  }

  // Check token
  if (GITHUB_CONFIG.token === 'YOUR_GITHUB_TOKEN_HERE') {
    showStatus('⚠️ GitHub token hələ əlavə edilməyib. script.js faylında GITHUB_CONFIG.token-ı doldurun.', 'error');
    return;
  }

  sendBtn.disabled = true;
  showStatus('✨ Diləyin ulduza göndərilir...', 'loading');

  // Build JSON payload
  const wishData = {
    id:        Date.now(),
    name:      name || 'Anonim',
    wish:      wish,
    date:      new Date().toLocaleString('az-AZ', {
                 year:'numeric', month:'long', day:'numeric',
                 hour:'2-digit', minute:'2-digit'
               }),
    timestamp: new Date().toISOString()
  };

  const fileName = `wish_${Date.now()}.json`;
  const filePath = `${GITHUB_CONFIG.folder}/${fileName}`;
  const content  = btoa(unescape(encodeURIComponent(JSON.stringify(wishData, null, 2))));

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.token}`,
          'Content-Type':  'application/json',
          'Accept':        'application/vnd.github+json'
        },
        body: JSON.stringify({
          message: `💫 Fidan'ın diləyi — ${wishData.date}`,
          content: content
        })
      }
    );

    if (res.ok) {
      showStatus('🌠 Diləyin ulduza çatdı! Arzun gerçəkləşəcək, Fidan! 💫', 'success');
      wishText.value = '';
      charCount.textContent = '0';
      // Mini confetti celebration
      launchMiniConfetti();
    } else {
      const errData = await res.json();
      console.error('GitHub API error:', errData);
      if (res.status === 401) {
        showStatus('❌ Token yanlışdır. Zəhmət olmasa düzgün token daxil edin.', 'error');
      } else if (res.status === 404) {
        showStatus('❌ Repo tapılmadı. Owner/repo adını yoxlayın.', 'error');
      } else {
        showStatus(`❌ Göndərilmədi (${res.status}). Yenidən cəhd edin.`, 'error');
      }
      sendBtn.disabled = false;
    }
  } catch (err) {
    console.error('Network error:', err);
    showStatus('❌ Şəbəkə xətası. İnternet bağlantınızı yoxlayın.', 'error');
    sendBtn.disabled = false;
  }
}

function showStatus(msg, type) {
  wishStatus.textContent = msg;
  wishStatus.className = `wish-status ${type}`;
  wishStatus.classList.remove('hidden');
  if (type === 'success') {
    setTimeout(() => {
      wishStatus.classList.add('hidden');
      sendBtn.disabled = false;
    }, 6000);
  }
}

function launchMiniConfetti() {
  const tmpActive = true;
  const pieces = Array.from({ length: 60 }, () => new Confetti());
  const tmpCtx = cCtx;
  let frame = 0;
  function miniLoop() {
    if (frame++ > 120) { tmpCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); return; }
    tmpCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach(p => { p.update(); p.draw(tmpCtx); });
    requestAnimationFrame(miniLoop);
  }
  miniLoop();
}

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  triggerScrollAnimations();
});
