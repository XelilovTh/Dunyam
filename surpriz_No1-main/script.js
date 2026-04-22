"use strict";

// ===========================
// KONFİQURASİYA
// ===========================
const GITHUB_CONFIG = {
  owner: "XelilovTh",
  repo: "Dunyam",
  folder: "wishes"
};

// ===========================
// MƏKTUB TYPİNG
// ===========================
const letterText = `Sevgilim

Sən istəməsən də, mənim istəkli yarımsan,
Mən bəxti qara, sən qaragözlü niganımsan.
Quranda bütə səcdə, sitayiş haram işdi,
Yoxsa deyəcəkdim, pəri, pərvərgarımsan.
Allah adama şah damarından da yaxındı,
Sən də manim Allaha yaxın şah damarımsan.
Keçmişdə bu badbəxti seven bəxtəvərimsən,
Hazırdasa ondan qırılan bəxtiyarımsan.
Öldür mani qelbinde ve bir küncüne dəfn et,
Bir parça bilim orda yerim var, məzarımsan.`;


let letterStarted = false;

function startLetterTyping() {
  const body = document.getElementById("letterBodySurprise");
  if (!body || letterStarted) return;
  letterStarted = true;
  typeWriter(body, letterText, 0);
}

function typeWriter(el, text, i) {
  if (i === 0) el.innerHTML = "";
  if (i < text.length) {
    const ch = text[i];
    const cur = el.querySelector(".cursor-blink");
    if (cur) cur.remove();
    el.innerHTML += ch === "\n" ? "<br>" : ch;
    const cb = document.createElement("span");
    cb.className = "cursor-blink";
    el.appendChild(cb);
    const delay =
      ch === "." || ch === ","
        ? 190
        : ch === "\n"
          ? 260
          : Math.random() * 30 + 22;
    setTimeout(() => typeWriter(el, text, i + 1), delay);
  } else {
    const cur = el.querySelector(".cursor-blink");
    if (cur) setTimeout(() => cur.remove(), 2200);
  }
}

// ===========================
// SÜRPRİZ DÜYMƏSİ
// ===========================
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseMsg = document.getElementById("surpriseMsg");
let surpriseDone = false;

if (surpriseBtn) {
  surpriseBtn.addEventListener("click", () => {
    if (surpriseDone) return;
    surpriseDone = true;
    surpriseMsg.classList.remove("hidden");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        surpriseMsg.classList.add("show");
      });
    });
    launchConfetti();
    for (let i = 0; i < 45; i++) setTimeout(rainHeart, i * 75);
    surpriseBtn.disabled = true;
    surpriseBtn.style.opacity = "0.5";
    surpriseBtn.style.cursor = "default";
  });
}

function rainHeart() {
  const el = document.createElement("div");
  el.textContent = ["❤️", "💕", "💗", "💓", "💖", "🌹"][
    Math.floor(Math.random() * 6)
  ];
  Object.assign(el.style, {
    position: "fixed",
    left: Math.random() * window.innerWidth + "px",
    top: "-40px",
    fontSize: Math.random() * 22 + 14 + "px",
    pointerEvents: "none",
    zIndex: 4000,
    animation: `rainFall ${Math.random() * 2 + 2}s linear forwards`,
    "--twist": (Math.random() - 0.5) * 360 + "deg",
  });
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

const style = document.createElement("style");
style.textContent = `
@keyframes rainFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(var(--twist)); opacity: 0.3; }
}
`;
document.head.appendChild(style);

// ===========================
// CONFETTİ
// ===========================
const confettiCanvas = document.getElementById("confettiCanvas");
const cCtx = confettiCanvas.getContext("2d");
let cPieces = [],
  cActive = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeConfetti);
resizeConfetti();

class Confetti {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = -20;
    this.w = Math.random() * 13 + 5;
    this.h = Math.random() * 7 + 3;
    this.color = [
      "#e91e63",
      "#ff6b9d",
      "#ffd700",
      "#ff8fb1",
      "#fff",
      "#ff1744",
      "#f48fb1",
    ][Math.floor(Math.random() * 7)];
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = Math.random() * 4 + 2;
    this.rot = Math.random() * Math.PI * 2;
    this.rotS = (Math.random() - 0.5) * 0.2;
    this.opacity = 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotS;
    this.vy += 0.07;
    if (this.y > confettiCanvas.height) this.opacity = 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }
}

function launchConfetti() {
  cActive = true;
  for (let i = 0; i < 200; i++) {
    setTimeout(() => cPieces.push(new Confetti()), i * 14);
  }
  confLoop();
  setTimeout(() => {
    cActive = false;
    cPieces = [];
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 7000);
}

function confLoop() {
  if (!cActive) return;
  cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  cPieces = cPieces.filter((p) => p.opacity > 0);
  cPieces.forEach((p) => {
    p.update();
    p.draw(cCtx);
  });
  requestAnimationFrame(confLoop);
}

function launchMiniConfetti() {
  const pieces = Array.from({ length: 60 }, () => new Confetti());
  let frame = 0;
  function miniLoop() {
    if (frame++ > 120) {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      return;
    }
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach((p) => {
      p.update();
      p.draw(cCtx);
    });
    requestAnimationFrame(miniLoop);
  }
  miniLoop();
}

// ===========================
// DİLƏK GÖNDƏRMƏ (GitHub API)
// ===========================
const wishText = document.getElementById("wishText");
const sendBtn = document.getElementById("sendWishBtn");
const wishStatus = document.getElementById("wishStatus");
const charCount = document.getElementById("charCount");

if (wishText) {
  wishText.addEventListener("input", () => {
    charCount.textContent = wishText.value.length;
  });
}

function showStatus(msg, type) {
  wishStatus.textContent = msg;
  wishStatus.className = `wish-status ${type}`;
  wishStatus.classList.remove("hidden");
  if (type === "success") {
    setTimeout(() => {
      wishStatus.classList.add("hidden");
      if (sendBtn) sendBtn.disabled = false;
    }, 6000);
  }
}

if (sendBtn) {
  sendBtn.addEventListener("click", async () => {
    const wish = wishText.value.trim();

    if (!wish) {
      showStatus("⚠️ Ay qız diləyini yaz", "error");
      wishText.focus();
      return;
    }

    if (GITHUB_CONFIG.token === "YOUR_GITHUB_TOKEN_HERE") {
      showStatus("⚠️ GitHub token hələ əlavə edilməyib.", "error");
      return;
    }

    sendBtn.disabled = true;
    showStatus("✨ Gözlə görək", "loading");

    const wishData = {
      id: Date.now(),
      name: "Anonim",
      wish: wish,
      date: new Date().toLocaleString("az-AZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date().toISOString(),
    };

    const fileName = `wish_${Date.now()}.json`;
    const filePath = `${GITHUB_CONFIG.folder}/${fileName}`;
    const content = btoa(
      unescape(encodeURIComponent(JSON.stringify(wishData, null, 2))),
    );

    try {
      const res = await fetch('../api/proxy', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: 'github_upload',
          path: filePath,
          message: `💫 Anonim dilək — ${wishData.date}`,
          content: content
        }),
      });

      if (res.ok) {
        showStatus(
          "Arzun gerçəkləşəcək, Fidanım 💫",
          "success",
        );
        wishText.value = "";
        charCount.textContent = "0";
        launchMiniConfetti();
      } else {
        if (res.status === 401) {
          showStatus("❌ Token yanlışdır.", "error");
        } else if (res.status === 404) {
          showStatus("❌ Repo tapılmadı.", "error");
        } else {
          showStatus(`❌ Göndərilmədi (${res.status}).`, "error");
        }
        sendBtn.disabled = false;
      }
    } catch (err) {
      console.error("Network error:", err);
      showStatus("❌ Şəbəkə xətası.", "error");
      sendBtn.disabled = false;
    }
  });
}

// ===========================
// MOUSE PARALLAX
// ===========================
document.addEventListener("mousemove", (e) => {
  const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

  document.querySelectorAll(".pupil").forEach((p) => {
    p.style.transform = `translate(${dx * 4}px, ${dy * 4}px)`;
  });

  const heroContent = document.querySelector(".hero-content-surprise");
  if (heroContent) {
    heroContent.style.transform = `translate(${dx * 8}px, ${dy * 5}px)`;
  }
});

// ===========================
// BAŞLAT
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const letterSection = document.querySelector(".letter-section-surprise");
  if (letterSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startLetterTyping();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(letterSection);
  }
});

console.log(
  `
%c💕 Sürpriz #1 • Fidan & Təhmaz 💕
%c"Ad günün mübarək, Fidanım!"
`,
  'font-size: 18px; color: #e91e63; font-family: "Dancing Script", cursive;',
  'font-size: 14px; color: #ff80ab; font-style: italic;',
);


// ===========================
// VİDEO BÖLMƏSİ
// ===========================
const video = document.getElementById("surpriseVideo");
const videoPlayBtn = document.getElementById("videoPlayBtn");
const videoCloseBtn = document.getElementById("videoCloseBtn");
let videoPlayed = false;

function startVideoMode() {
  document.body.classList.add("video-mode");
  video.play().catch(err => {
    console.error("Video oynatma xətası:", err);
    endVideoMode();
  });
}

function endVideoMode() {
  document.body.classList.remove("video-mode");
  video.pause();
  video.currentTime = 0;
  videoPlayed = false;
  
  if (videoPlayBtn) {
    videoPlayBtn.style.display = "flex";
  }
}

if (videoPlayBtn && video) {
  videoPlayBtn.addEventListener("click", () => {
    if (videoPlayed) return;
    videoPlayed = true;
    videoPlayBtn.style.display = "none";
    startVideoMode();
  });
  
  video.addEventListener("ended", () => {
    endVideoMode();
  });
  
  video.addEventListener("error", () => {
    console.error("Video yüklənmədi");
    endVideoMode();
    if (videoPlayBtn) videoPlayBtn.style.display = "flex";
  });
}

if (videoCloseBtn) {
  videoCloseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.body.classList.contains("video-mode")) {
      endVideoMode();
    }
  });
}
