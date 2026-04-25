const cards = document.querySelectorAll('.card');
const videos = document.querySelectorAll('video');
const preloader = document.getElementById('preloader');
const loaderBar = document.getElementById('loader-bar');
const loadedCountEl = document.getElementById('loaded-count');

let loadedVideos = 0;
const totalVideos = videos.length;

function updateLoader() {
    loadedVideos++;
    const progress = (loadedVideos / totalVideos) * 100;
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loadedCountEl) loadedCountEl.textContent = loadedVideos;

    if (loadedVideos >= totalVideos) {
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
        }, 500);
    }
}

// Hər video üçün yüklənməni izləyirik
videos.forEach(video => {
    // Əgər artıq yüklənibsə (cache-dən gələ bilər)
    if (video.readyState >= 4) {
        updateLoader();
    } else {
        video.addEventListener('canplaythrough', updateLoader, { once: true });
        // Xəta olarsa da davam edirik ki, sayt ilişib qalmasın
        video.addEventListener('error', updateLoader, { once: true });
    }
});

// Təhlükəsizlik üçün: Əgər 10 saniyə keçərsə və hələ də yüklənməyibsə, loader-i bağla
setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
    }
}, 15000);

// Mobil cihazlarda səs blokunu qaldırmaq üçün istifadəçi toxunuşu
window.addEventListener('touchstart', () => {
    videos.forEach(v => {
        v.muted = false;
        if (v.classList.contains('focused') && v.paused) {
            v.play().catch(() => {});
        }
    });
}, { once: true });
window.addEventListener('click', () => {
    videos.forEach(v => {
        v.muted = false;
    });
}, { once: true });

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const shardSystem = document.querySelector('.shard-system');
const shards = document.querySelectorAll('.shard');
const pillarGlow = document.querySelector('.pillar-glow');
const lightBeam = document.querySelector('.light-beam');

let targetScroll = 0;
let currentScroll = 0;
let lastScroll = 0;
let scrollVelocity = 0;

// Particle System
let particles = [];
const colors = ['#e91e63', '#ff6b9d', '#ff80ab', '#ffffff'];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const particleCount = window.innerWidth < 768 ? 80 : 150;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            opacity: Math.random(),
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scroll sürətinə görə hissəciklərin reaksiyası
    const velocityFactor = 1 + scrollVelocity * 0.05;
    
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        // 3D boşluq illüziyası üçün ölçü dinamik dəyişir
        const dynamicSize = p.size * velocityFactor;
        ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Sürətli scroll zamanı hissəciklər kənara doğru qaçır
        if (scrollVelocity > 2) {
            p.y += (p.y - canvas.height/2) * 0.01 * scrollVelocity;
        }

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
drawParticles();

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
});

function animate() {
    // Sürət və hamarlıq hesablama
    const prevScroll = currentScroll;
    currentScroll += (targetScroll - currentScroll) * 0.08;
    scrollVelocity = Math.abs(currentScroll - prevScroll);

    const time = Date.now() * 0.001;

    // Prismatic Shard Core Animation
    if (shardSystem) {
        shardSystem.style.transform = `rotateY(${currentScroll * 0.05}deg)`;
    }
    
    shards.forEach((shard, i) => {
        const offset = Math.sin(time + i) * 20;
        const individualRot = currentScroll * (0.02 + i * 0.01);
        shard.style.transform = `rotateY(${i * 72 + individualRot}deg) translateZ(${60 + i * 10}px) translateY(${offset}px)`;
    });

    if (pillarGlow && lightBeam) {
        const intensity = 0.3 + (scrollVelocity * 0.03);
        pillarGlow.style.opacity = Math.min(0.8, intensity);
        lightBeam.style.opacity = Math.min(0.6, intensity);
        lightBeam.style.width = `${10 + scrollVelocity * 2}px`;
    }

    cards.forEach((card, index) => {
        const isMobile = window.innerWidth < 768;
        const scrollStep = isMobile ? 180 : 250; 
        const rawRelScroll = currentScroll - (index * scrollStep); 
        const video = card.querySelector('video');
        
        // "Ortada qalma" (Magnetic Snap) effekti
        const snapRange = 150;
        let relScroll = rawRelScroll;
        if (Math.abs(rawRelScroll) < snapRange) {
            relScroll = rawRelScroll * Math.pow(Math.abs(rawRelScroll / snapRange), 0.5);
        }

        // Mərkəzə yaxınlıq (Video idarəsi üçün)
        const proximity = 1 - Math.min(1, Math.abs(rawRelScroll) / 400);
        
        // Mərkəzə ən yaxın olan kartı tapmaq və video idarəsi
        const isClosest = Math.abs(rawRelScroll) < 150; // Mərkəzə yaxınlıq həddi
        
        if (video) {
            if (isClosest) {
                // Əgər mərkəzə yaxındırsa, videonu başlat və səsi yavaşca artır
                if (video.paused) {
                    video.play().catch(() => {
                        // Səs bloklanıbsa muted davam etsin
                    });
                }
                
                // Səsi aktiv et
                video.muted = false;
                
                const targetVolume = 1.0;
                if (video.volume < 0.95) {
                    video.volume += (targetVolume - video.volume) * 0.1;
                } else {
                    video.volume = 1.0;
                }
                card.classList.add('focused');
            } else {
                // Mərkəzdən uzaqlaşdıqda səsi yavaşca azalt və sonra dayandır
                if (video.volume > 0.05) {
                    video.volume += (0 - video.volume) * 0.1;
                } else {
                    video.volume = 0;
                    video.muted = true;
                    if (!video.paused) video.pause();
                }
                card.classList.remove('focused');
            }
        }

        // Canlı 'Floating' Yellənmə Animasiyası
        const floatY = Math.sin(time + index * 0.8) * 15;
        const floatX = Math.cos(time + index * 0.8) * 10;
        const floatRot = Math.sin(time * 0.5 + index) * 2;
        
        // Dinamik Spiral və Nəfəs Alma Effekti
        const yPos = (-relScroll * 0.45) + floatY;
        const angle = (relScroll * 0.14) + (floatX * 0.1); 
        
        // Dinamik Radius (Responsive)
        const baseRadius = window.innerWidth < 480 ? 250 : (window.innerWidth < 768 ? 400 : 600);
        const breathing = Math.sin(time * 0.8 + index) * 15;
        const speedExpand = scrollVelocity * 0.5;
        const radius = baseRadius + breathing + speedExpand;
        
        // 3D Transform
        const scale = isClosest ? 1.05 : 1.0;
        const transform = `
            rotateY(${angle}deg) 
            translateY(${yPos}px) 
            translateZ(${radius}px)
            rotateX(${-yPos * 0.01 + floatRot}deg)
            scale(${scale})
        `;
        
        card.style.transform = transform;
        
        // Dərinlik və Fokus (DOF)
        const angleRad = (angle % 360) * Math.PI / 180;
        const zDepth = Math.cos(angleRad); // 1 = qabaq, -1 = arxa
        
        // Arxa tərəfdə kəskin blur, mərkəzdə tam itilik
        const blurAmount = Math.max(0, (1 - zDepth) * 10);
        card.style.filter = `blur(${blurAmount}px)`;
        
        // Opacity dəyərini zDepth ilə kəskin əlaqələndirmə
        const fadeRange = 1500;
        const opacityY = 1 - Math.abs(yPos / fadeRange);
        const opacityZ = Math.pow((zDepth + 1) / 2, 2) * 0.8 + 0.2; 
        
        const finalOpacity = Math.max(0, opacityY * opacityZ);
        card.style.opacity = finalOpacity;
        
        // Shine effekti
        const shineX = (angle % 360) / 2;
        card.style.setProperty('--shine-x', `${shineX}%`);
        
        // Z-Index simulyasiyası
        card.style.zIndex = Math.round((zDepth + 1) * 100);
    });

    requestAnimationFrame(animate);
}

animate();