/* Fidanın Ad Günü Səhifəsi - JavaScript */

// ========== AÇILIŞ ==========
function enterBirthdayPage() {
  var overlay = document.getElementById('birthday-overlay');
  var mainPage = document.getElementById('memory-page');

  if (overlay) overlay.style.display = 'none';
  if (mainPage) mainPage.style.display = 'flex';

  for (var i = 0; i < 3; i++) {
    setTimeout(function() {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#E8345A', '#FF6B9D', '#FFB6C1', '#FF69B4', '#FF1493', '#FFC0CB']
      });
    }, i * 200);
  }

  initSurpriseBoxes();
  initGallery();
}

function goBack() {
  window.location.href = 'main.html';
}

// ========== SEVGİ MƏKTUBU ==========
function openLoveLetter() {
  document.getElementById('letter-modal').style.display = 'flex';
}

function closeLetterModal(event) {
  var modal = document.getElementById('letter-modal');
  if (event && event.target !== modal) return;
  modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  var letterCard = document.getElementById('loveLetterCard');
  if (letterCard) letterCard.addEventListener('click', openLoveLetter);

  var letterModal = document.getElementById('letter-modal');
  if (letterModal) {
    letterModal.addEventListener('click', function(e) {
      if (e.target === letterModal) closeLetterModal();
    });
  }
});

// ========== 17 SÜRPRİZ QUTUSU ==========
var surpriseMessages = [
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
  var container = document.getElementById('surprise-boxes');
  if (!container) return;
  var html = '';
  for (var i = 1; i <= 17; i++) {
    html += '<div class="surprise-box" data-index="' + (i - 1) + '">' +
              '<div class="box-front">🎁</div>' +
              '<div class="box-number">' + i + '</div>' +
            '</div>';
  }
  container.innerHTML = html;

  var boxes = document.querySelectorAll('.surprise-box');
  for (var j = 0; j < boxes.length; j++) {
    boxes[j].addEventListener('click', function() {
      openSurprise(parseInt(this.getAttribute('data-index')));
    });
  }
}

function openSurprise(index) {
  var modal = document.getElementById('surprise-modal');
  var icons = ['🎁', '💝', '💌', '🌟', '✨', '❤️', '🌸', '🌺', '💎', '🎀'];
  document.getElementById('surprise-icon').textContent = icons[index % icons.length];
  document.getElementById('surprise-title').textContent = 'Sürpriz #' + (index + 1);
  document.getElementById('surprise-message').textContent = surpriseMessages[index % surpriseMessages.length];
  modal.style.display = 'flex';

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#E8345A', '#FF6B9D', '#FFB6C1']
  });
}

function closeSurpriseModal() {
  document.getElementById('surprise-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  var surpriseModal = document.getElementById('surprise-modal');
  if (surpriseModal) {
    surpriseModal.addEventListener('click', function(e) {
      if (e.target === surpriseModal) closeSurpriseModal();
    });
  }
});

// ========== XATİRƏ ŞƏKİLLƏRİ QALEREYASI ==========
var currentGalleryIndex = 0;
var galleryImages = [];

// memory.js faylında initGallery funksiyasını YENİLƏ

async function initGallery() {
  const container = document.getElementById('gallery-container');
  const dotsContainer = document.getElementById('gallery-dots');
  
  if (!container) return;
  
  // Yükləmə zamanı loader
  container.innerHTML = '<div class="empty-gallery">⟳ Şəkillər ardıcıl yüklənir...</div>';
  
  try {
    if (typeof githubFetchFilesSequential === 'function') {
      // Sequential yükləmə
      const images = await githubFetchFilesSequential('special_images', (img, index, total) => {
        // Hər şəkil yükləndikcə galleryImages array-ına əlavə et
        if (!galleryImages.some(i => i.name === img.name)) {
          galleryImages.push({ name: img.name, download_url: img.download_url });
        }
        
        // Qalereyanı yenidən render et
        renderGallery();
      });
      
      // Əgər heç şəkil yoxdursa
      if (galleryImages.length === 0) {
        container.innerHTML = '<div class="empty-gallery">📸 Hələ şəkil yüklənməyib</div>';
        if (dotsContainer) dotsContainer.innerHTML = '';
      }
      
    } else if (typeof githubFetchFiles === 'function') {
      // Fallback - köhnə üsul
      const images = await githubFetchFiles('special_images');
      galleryImages = images.filter(function(f) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name);
      });
      renderGallery();
    }
    
  } catch(e) {
    console.log('Şəkillər yüklənə bilmədi', e);
    container.innerHTML = '<div class="empty-gallery">📸 Şəkillər yüklənərkən xəta</div>';
  }
}

function renderGallery() {
  var container = document.getElementById('gallery-container');
  var dotsContainer = document.getElementById('gallery-dots');
  if (!container) return;

  if (!galleryImages || galleryImages.length === 0) {
    container.innerHTML = '<div class="empty-gallery">📸 Hələ şəkil yüklənməyib</div>';
    if (dotsContainer) dotsContainer.innerHTML = '';
    return;
  }

  var imagesHtml = '';
  for (var i = 0; i < galleryImages.length; i++) {
    imagesHtml += '<div class="gallery-item"><img src="' + galleryImages[i].download_url + '" alt="Xatirə" onclick="openGalleryImage(' + i + ')"></div>';
  }
  container.innerHTML = imagesHtml;

  var dotsHtml = '';
  for (var j = 0; j < galleryImages.length; j++) {
    dotsHtml += '<span class="gallery-dot ' + (j === currentGalleryIndex ? 'active' : '') + '" onclick="goToGallery(' + j + ')"></span>';
  }
  if (dotsContainer) dotsContainer.innerHTML = dotsHtml;

  updateGalleryPosition();
}

function renderGalleryEmpty() {
  var container = document.getElementById('gallery-container');
  if (container) container.innerHTML = '<div class="empty-gallery">📸 Hələ şəkil yüklənməyib</div>';
}

function updateGalleryPosition() {
  var container = document.getElementById('gallery-container');
  if (container && galleryImages.length > 0) {
    container.style.transform = 'translateX(-' + (currentGalleryIndex * 100) + '%)';
  }
  var dots = document.querySelectorAll('.gallery-dot');
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.toggle('active', i === currentGalleryIndex);
  }
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
  var img = galleryImages[index];
  if (img) {
    var modal = document.getElementById('surprise-modal');
    document.getElementById('surprise-icon').textContent = '📸';
    document.getElementById('surprise-title').textContent = 'Xatirə Şəkli';
    document.getElementById('surprise-message').innerHTML = '<img src="' + img.download_url + '" style="max-width:100%; border-radius:12px;">';
    modal.style.display = 'flex';
  }
}

// ========== DİLƏK TUTMA ==========
function makeWish() {
  var star = document.querySelector('.wish-star');
  if (star) {
    star.style.animation = 'starShine 0.5s ease';
    setTimeout(function() { star.style.animation = ''; }, 500);
  }
}

async function sendWish() {
  var input = document.getElementById('wish-input');
  var wish = input.value.trim();

  if (!wish) {
    alert('Zəhmət olmasa diləyini yaz! 🌟');
    return;
  }

  var messageDiv = document.getElementById('wish-message');
  messageDiv.innerHTML = '✨ Diləyin göyə uçur... ✨';
  messageDiv.style.display = 'block';

  try {
    var wishData = { wish: wish, date: new Date().toISOString(), name: 'Fidan' };
    var base64Content = btoa(unescape(encodeURIComponent(JSON.stringify(wishData, null, 2))));
    var fileName = 'wishes/wish_' + Date.now() + '.json';

    if (typeof githubUpload === 'function') {
      var result = await githubUpload(fileName, base64Content, 'Yeni dilək: ' + wish.substring(0, 30));
      if (result.success) {
        messageDiv.innerHTML = '✨ Diləyin göyə uçdu! ✨<br>"' + wish + '"<br><span style="font-size:0.8rem;">💾 Diləyin GitHub-da saxlanıldı</span>';
        input.value = '';
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#E8345A', '#FF6B9D', '#FFB6C1', '#FF69B4', '#FFC0CB'] });
        setTimeout(function() { messageDiv.style.display = 'none'; }, 5000);
      } else {
        messageDiv.innerHTML = '✨ Diləyin göyə uçdu! ✨<br>"' + wish + '"<br><span style="font-size:0.8rem;">⚠️ Yadda saxlanılmadı, amma diləyin qəbul olundu!</span>';
        input.value = '';
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#E8345A', '#FF6B9D'] });
        setTimeout(function() { messageDiv.style.display = 'none'; }, 4000);
      }
    } else {
      messageDiv.innerHTML = '✨ Diləyin göyə uçdu! ✨<br>"' + wish + '"';
      input.value = '';
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#E8345A', '#FF6B9D'] });
      setTimeout(function() { messageDiv.style.display = 'none'; }, 4000);
    }
  } catch(e) {
    console.error('Dilək saxlanarkən xəta:', e);
    messageDiv.innerHTML = '✨ Diləyin göyə uçdu! ✨<br>"' + wish + '"<br><span style="font-size:0.8rem;">💫 Diləyin qəbul olundu!</span>';
    input.value = '';
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#E8345A', '#FF6B9D'] });
    setTimeout(function() { messageDiv.style.display = 'none'; }, 4000);
  }
}

// ========== DİNAMİK ARXA PLAN (Optimallaşdırılmış) ==========
class DynamicBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.particles = [];
    this.stars = [];
    this.mouseX = null;
    this.mouseY = null;
    this.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    this.lastFrameTime = 0;
    this.targetFPS = this.isMobile ? 30 : 60;
    this.frameInterval = 1000 / this.targetFPS;
    this.frameCount = 0;
    this.now = 0;
    this.init();
  }

  init() {
    this.canvas = document.getElementById('dynamic-bg');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'dynamic-bg';
      document.body.insertBefore(this.canvas, document.body.firstChild);
    }
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '0';
    this.canvas.style.pointerEvents = 'none';

    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.resize();
    this.createStars();
    this.createParticles();
    this.addGlowDots();
    this.addClouds();
    this.addTwinklingStars();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 200);
    });

    if (!this.isMobile) {
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.createStars();
  }

  createStars() {
    this.stars = [];
    const maxStars = this.isMobile ? 80 : 150;
    const starCount = Math.min(maxStars, Math.floor(this.width * this.height / 8000));

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createParticles() {
    this.particles = [];
    const particleCount = this.isMobile ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.3,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.3
      });
    }
  }

  addGlowDots() {
    const dotCount = this.isMobile ? 15 : 30;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'glow-dot';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.animationDelay = Math.random() * 5 + 's';
      dot.style.animationDuration = Math.random() * 3 + 2 + 's';
      document.body.appendChild(dot);
    }
  }

  addClouds() {
    const cloudContainer = document.createElement('div');
    cloudContainer.className = 'cloud-container';
    Object.assign(cloudContainer.style, {
      position: 'fixed', top: '0', left: '0',
      width: '100%', height: '100%',
      zIndex: '1', pointerEvents: 'none', overflow: 'hidden'
    });
    for (let i = 1; i <= 4; i++) {
      const cloud = document.createElement('div');
      cloud.className = `cloud-effect cloud-${i}`;
      cloudContainer.appendChild(cloud);
    }
    document.body.appendChild(cloudContainer);
  }

  addTwinklingStars() {
    const starCount = this.isMobile ? 30 : 60;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star-twinkle';
      star.innerHTML = Math.random() > 0.7 ? '⭐' : '✨';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.fontSize = Math.random() * 12 + 6 + 'px';
      star.style.animationDelay = Math.random() * 5 + 's';
      star.style.animationDuration = Math.random() * 3 + 2 + 's';
      document.body.appendChild(star);
    }
  }

  drawStars() {
    const t = this.now;
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      const alpha = star.alpha + Math.sin(t * star.twinkleSpeed + star.phase) * 0.2;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255,255,255,${Math.max(0.1, Math.min(0.8, alpha))})`;
      this.ctx.fill();

      if (!this.isMobile && star.radius > 1.2 && Math.random() > 0.99) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(232,52,90,0.1)';
        this.ctx.fill();
      }
    }
  }

  drawParticles() {
    const alphaChange = Math.sin(this.now * 0.002) * 0.05;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(232,52,90,${Math.max(0.05, Math.min(0.35, p.alpha))})`;
      this.ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      p.alpha = Math.max(0.05, Math.min(0.35, p.alpha + alphaChange));
    }
  }

  drawNebula() {
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, 'rgba(232,52,90,0.03)');
    gradient.addColorStop(0.5, 'rgba(255,182,193,0.02)');
    gradient.addColorStop(1, 'rgba(138,43,226,0.03)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (!this.isMobile) {
      const glowCount = 3;
      for (let i = 0; i < glowCount; i++) {
        const x = Math.sin(this.now * 0.0003 + i * 2) * this.width * 0.3 + this.width * 0.5;
        const y = Math.cos(this.now * 0.0002 + i * 2) * this.height * 0.3 + this.height * 0.5;
        const radGrad = this.ctx.createRadialGradient(x, y, 0, x, y, 200);
        radGrad.addColorStop(0, 'rgba(232,52,90,0.05)');
        radGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = radGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
    }
  }

  drawMouseEffect() {
    if (!this.isMobile && this.mouseX && this.mouseY) {
      const gradient = this.ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, 100
      );
      gradient.addColorStop(0, 'rgba(232,52,90,0.15)');
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  drawFloatingHearts() {
    const threshold = this.isMobile ? 0.995 : 0.98;
    if (Math.random() > threshold) {
      const heart = document.createElement('div');
      heart.innerHTML = ['❤️', '💖', '💗', '💓', '💕'][Math.floor(Math.random() * 5)];
      heart.style.cssText = `position:fixed;left:${Math.random() * 100}%;bottom:-20px;font-size:${Math.random() * 20 + 12}px;opacity:${Math.random() * 0.5 + 0.3};z-index:2;pointer-events:none;animation:floatHeart ${Math.random() * 4 + 4}s ease-in forwards;`;
      document.getElementById('hearts-container').appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }
  }

  animate(timestamp) {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp || performance.now();
    const elapsed = (timestamp || performance.now()) - this.lastFrameTime;

    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = (timestamp || performance.now()) - (elapsed % this.frameInterval);
      this.now = performance.now();
      this.frameCount++;

      this.ctx.fillStyle = 'rgb(10,0,21)';
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.drawNebula();
      this.drawStars();
      this.drawParticles();
      this.drawMouseEffect();
      this.drawFloatingHearts();
    }

    requestAnimationFrame((ts) => this.animate(ts));
  }
}

// Ürək animasiyası CSS
const heartStyle = document.createElement('style');
heartStyle.textContent = `
  @keyframes floatHeart {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(heartStyle);

const gradientDiv = document.createElement('div');
gradientDiv.className = 'gradient-moving';
document.body.insertBefore(gradientDiv, document.body.firstChild);

const lightSweep = document.createElement('div');
lightSweep.className = 'light-sweep';
document.body.appendChild(lightSweep);

const bgOverlay = document.createElement('div');
bgOverlay.className = 'bg-gradient-overlay';
document.body.appendChild(bgOverlay);

document.addEventListener('DOMContentLoaded', () => {
  new DynamicBackground();
});

// ========== UÇAN ULDUZLAR (Optimallaşdırılmış) ==========
class ShootingStars {
  constructor() {
    this.canvas = document.getElementById('starfield');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.shootingStars = [];
    this.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    this.lastFrameTime = 0;
    this.frameInterval = this.isMobile ? 1000 / 30 : 1000 / 60;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    setInterval(() => this.addShootingStar(), 8000);
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addShootingStar() {
    if (Math.random() > 0.3) return;
    this.shootingStars.push({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height * 0.3,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 5,
      angle: Math.random() * Math.PI / 3 + Math.PI / 6,
      alpha: 1,
      color: `hsl(${Math.random() * 30 + 340},100%,70%)`
    });
  }

  drawShootingStars() {
    this.ctx.shadowBlur = 10;
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      const endX = star.x + Math.cos(star.angle) * star.length;
      const endY = star.y + Math.sin(star.angle) * star.length;

      const gradient = this.ctx.createLinearGradient(star.x, star.y, endX, endY);
      gradient.addColorStop(0, star.color);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = gradient;
      this.ctx.shadowColor = star.color;
      this.ctx.lineWidth = 3;
      this.ctx.globalAlpha = star.alpha;
      this.ctx.stroke();

      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.alpha -= 0.02;

      if (star.x > this.canvas.width || star.y > this.canvas.height || star.alpha <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }
    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
  }

  animate(timestamp) {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp || performance.now();
    const elapsed = (timestamp || performance.now()) - this.lastFrameTime;

    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = (timestamp || performance.now()) - (elapsed % this.frameInterval);
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawShootingStars();
    }

    requestAnimationFrame((ts) => this.animate(ts));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ShootingStars();
});

// ========== TYPEWRITER EFFEKTİ ==========
function startTypewriter(elementId, text, speed) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';
  var i = 0;
  var cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      var code = text.codePointAt(i);
      var char = String.fromCodePoint(code);
      var charSpan = document.createElement('span');
      charSpan.style.cssText = 'display:inline;background:linear-gradient(135deg,#fff,#E8345A,#FFB6C1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;';
      charSpan.textContent = char;
      el.insertBefore(charSpan, cursor);
      i += char.length > 1 ? 2 : 1;
      setTimeout(type, speed || 80);
    } else {
      setTimeout(function() { cursor.style.display = 'none'; }, 2000);
    }
  }
  type();
}

// ========== ARXA PLAN ULDUZ VƏ ÜRƏKLƏRİ ==========
function initBgStarsAndHearts() {
  var layer = document.getElementById('bg-stars-layer');
  if (!layer) return;

  var isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  var starEmojis = ['⭐', '✨', '💫', '🌟', '⚡'];
  var heartEmojis = ['❤️', '💖', '💗', '💓', '💕', '🩷'];
  var totalItems = isMobile ? 16 : 30;

  for (var i = 0; i < totalItems; i++) {
    var el = document.createElement('div');
    var isHeart = Math.random() > 0.5;
    el.className = isHeart ? 'bg-heart' : 'bg-star';
    el.innerHTML = isHeart
      ? heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
      : starEmojis[Math.floor(Math.random() * starEmojis.length)];

    var size = Math.random() * 16 + 10;
    el.style.fontSize = size + 'px';
    el.style.left = Math.random() * 100 + '%';
    el.style.bottom = '0';
    el.style.animationDuration = (Math.random() * 12 + 8) + 's';
    el.style.animationDelay = (Math.random() * 15) + 's';
    el.style.opacity = '0';
    el.style.filter = 'drop-shadow(0 0 4px rgba(232,52,90,0.5))';

    layer.appendChild(el);
  }
}

// Memory page açılanda başlat
var _origEnterBirthdayPage = enterBirthdayPage;
enterBirthdayPage = function() {
  _origEnterBirthdayPage();
  initBgStarsAndHearts();
  startTypewriter('memory-title-typewriter', '🎂 Fidanın 17 Yaşı 🎂', 75);
};
