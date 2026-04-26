let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

function updateScrollHeight() {
    const scrollStep = isMobile ? 220 : 250;
    const totalScroll = (cards.length - 1) * scrollStep;
    const scrollSpace = document.querySelector('.scroll-space');
    if (scrollSpace) {
        scrollSpace.style.height = `${totalScroll + window.innerHeight}px`;
    }
}

if (isMobile) {
    document.body.classList.add('is-mobile');
}

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

videos.forEach(video => {
    if (video.readyState >= 4) {
        updateLoader();
    } else {
        video.addEventListener('canplaythrough', updateLoader, { once: true });
        video.addEventListener('error', updateLoader, { once: true });
    }
});

// Initialize scroll height
updateScrollHeight();

window.addEventListener('resize', () => {
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) document.body.classList.add('is-mobile');
    else document.body.classList.remove('is-mobile');
    updateScrollHeight();
});

setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
    }
}, 15000);

// Input Handling
const handleInteraction = () => {
    videos.forEach(v => {
        v.muted = false;
    });
};
window.addEventListener('touchstart', handleInteraction, { once: true });
window.addEventListener('click', handleInteraction, { once: true });

const canvas = document.getElementById('particles');
const ctx = canvas ? canvas.getContext('2d') : null;
const shardSystem = document.querySelector('.shard-system');
const shards = document.querySelectorAll('.shard');
const pillarGlow = document.querySelector('.pillar-glow');
const lightBeam = document.querySelector('.light-beam');

let targetScroll = 0;
let currentScroll = 0;
let lastScroll = 0;
let scrollVelocity = 0;

// Particle System - Disabled on Mobile
let particles = [];
const colors = ['#e91e63', '#ff6b9d', '#ff80ab', '#ffffff'];

function initParticles() {
    if (!canvas || isMobile) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const particleCount = 150;
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
    if (!canvas || isMobile) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const velocityFactor = 1 + scrollVelocity * 0.05;
    
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        const dynamicSize = p.size * velocityFactor;
        ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
}

if (!isMobile) {
    window.addEventListener('resize', initParticles);
    initParticles();
    drawParticles();
}

// Custom Cursor Logic - Disabled on Mobile
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (!isMobile && cursorDot && cursorOutline) {
    let cursorX = 0, cursorY = 0, outlineX = 0, outlineY = 0;
    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
        const target = e.target.closest('.card');
        if (target) cursorOutline.classList.add('hover');
        else cursorOutline.classList.remove('hover');
    });

    function animateCursor() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// Scroll Indicator Logic
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    if (scrollIndicator) {
        scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '0.7';
    }
}, { passive: true });

function animate() {
    const prevScroll = currentScroll;
    const lerpFactor = isMobile ? 0.12 : 0.08; // Faster response on mobile touch
    currentScroll += (targetScroll - currentScroll) * lerpFactor;
    scrollVelocity = Math.abs(currentScroll - prevScroll);

    const time = Date.now() * 0.001;

    // Prismatic Shard Core Animation
    if (shardSystem) {
        shardSystem.style.transform = `rotateY(${currentScroll * 0.05}deg)`;
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
    }

    cards.forEach((card, index) => {
        const scrollStep = isMobile ? 220 : 250; 
        const rawRelScroll = currentScroll - (index * scrollStep); 
        const video = card.querySelector('video');
        
        // Center Focus Check
        const isClosest = Math.abs(rawRelScroll) < 120;
        
        if (video) {
            if (isClosest) {
                if (video.paused) video.play().catch(() => {});
                video.muted = false;
                const targetVolume = 1.0;
                if (video.volume < 0.9) video.volume += (targetVolume - video.volume) * 0.1;
                else video.volume = 1.0;
                card.classList.add('focused');
            } else {
                // Strictly stop videos that are not in focus to save CPU/Memory on mobile
                if (video.volume > 0.1) video.volume -= 0.1;
                else {
                    video.volume = 0;
                    video.muted = true;
                    if (!video.paused) video.pause();
                }
                card.classList.remove('focused');
            }
        }

        // Float Animation - Simplified on Mobile
        const floatY = isMobile ? 0 : Math.sin(time + index * 0.8) * 15;
        const floatRot = isMobile ? 0 : Math.sin(time * 0.5 + index) * 2;
        
        const yPos = (-rawRelScroll * 0.45) + floatY;
        const angle = (rawRelScroll * (isMobile ? 0.3 : 0.2)); 
        
        // Adaptive Radius
        const baseRadius = isMobile ? 250 : 600;
        const breathing = isMobile ? 0 : Math.sin(time * 0.8 + index) * 15;
        const radius = baseRadius + breathing;
        
        // 3D Transform
        const scale = isClosest ? (isMobile ? 1.1 : 1.05) : 1.0;
        const transform = `
            rotateY(${angle}deg) 
            translateY(${yPos}px) 
            translateZ(${radius}px)
            ${!isMobile ? `rotateX(${-yPos * 0.01 + floatRot}deg)` : ''}
            scale(${scale})
        `;
        
        card.style.transform = transform;
        
        // Depth and Focus (DOF) - Only for Desktop
        if (!isMobile) {
            const angleRad = (angle % 360) * Math.PI / 180;
            const zDepth = Math.cos(angleRad);
            const blurAmount = Math.max(0, (1 - zDepth) * 10);
            card.style.filter = `blur(${blurAmount}px)`;
            card.style.zIndex = Math.round((zDepth + 1) * 100);
            
            // Opacity based on depth
            const opacityY = 1 - Math.abs(yPos / 1500);
            const opacityZ = Math.pow((zDepth + 1) / 2, 2) * 0.8 + 0.2; 
            card.style.opacity = Math.max(0, opacityY * opacityZ);
        } else {
            // Simplified visibility for Mobile
            const opacity = 1 - Math.abs(yPos / 800);
            card.style.opacity = Math.max(0, opacity);
            card.style.filter = 'none';
            card.style.zIndex = isClosest ? 100 : 1;
        }
        
        // Shine effect - Only for Desktop
        if (!isMobile) {
            const shineX = (angle % 360) / 2;
            card.style.setProperty('--shine-x', `${shineX}%`);
        }
    });

    requestAnimationFrame(animate);
}

animate();