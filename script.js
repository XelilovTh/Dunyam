/* ╔══════════════════════════════════════════════════════════════════╗
   ║                    FİDAN & TƏHMAZ • DÜNYAMIZ                      ║
   ║                  Professional • JavaScript                         ║
   ╚══════════════════════════════════════════════════════════════════╝
*/

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   KONFİQURASİYA VƏ SABİTLƏR
   ═══════════════════════════════════════════════════════════════════ */

const GITHUB_CONFIG = {
    owner: 'XelilovTh',
    repo: 'Dunyam',
    baseUrl: 'https://api.github.com'
};

const APP_CONFIG = {
    startDate: new Date('2023-02-01T00:00:00'),
    version: '2.1.0',
    maxFileSize: {
        image: 10 * 1024 * 1024,
        music: 30 * 1024 * 1024
    }
};

const CLOUDINARY_CONFIG = {
    cloud_name: 'dojz9uzhe',
    upload_preset: 'dunyamiz',
    api_key: '241982348988817'
};

const CLOUDINARY_MUSIC_CONFIG = {
    cloud_name: 'drlzwhblg',
    upload_preset: 'dunyamiz_music',
    api_key: '583362931417988'
};


const DAILY_QUOTES = [
    { text: 'Sən mənim ən gözəl xəyalımsan.', author: 'Təhmaz' },
    { text: 'Hər nəfəsimdə sənin adın var.', author: 'Təhmaz' },
    { text: 'Sevgi — iki ürəyin bir olmasıdır.', author: 'Təhmaz' },
    { text: 'Sən olmadan dünyam mənasızdır.', author: 'Təhmaz' },
    { text: 'Gözlərindəki işıq mənim günəşimdir.', author: 'Təhmaz' },
    { text: 'Sənin gülüşün ən gözəl melodiyadır.', author: 'Təhmaz' },
    { text: 'Sən mənim ən qiymətli xəzinəmsən.', author: 'Təhmaz' },
    { text: 'Sevgi sözsüz başa düşülür, sən kimi.', author: 'Təhmaz' },
    { text: 'Sən olanda hər gün bayramdır.', author: 'Təhmaz' },
    { text: 'Ürəyimin ən gizli guşəsindəsən.', author: 'Təhmaz' },
    { text: 'Sən mənim yazdığım ən gözəl şeirsən.', author: 'Təhmaz' },
    { text: 'Gecənin qaranlığında sən mənim işığımsan.', author: 'Təhmaz' },
    { text: 'Sənin sevgin həyatımın mənasıdır.', author: 'Təhmaz' },
    { text: 'Hər günəş doğuşu sənə olan sevgimi artırır.', author: 'Təhmaz' },
    { text: 'Sən mənim dünyamdakı ən gözəl möcüzəsən.', author: 'Təhmaz' },
    { text: 'Uzaqlarda da olsa, ürəyim yanındadır.', author: 'Təhmaz' },
    { text: 'Sən olmadan heç nə tamamlanmır.', author: 'Təhmaz' },
    { text: 'Sevgin qəlbimi həmişə isidər.', author: 'Təhmaz' },
    { text: 'Gözlərinə baxanda zamanın durduğunu hiss edirəm.', author: 'Təhmaz' },
    { text: 'Sənin səsin ən gözəl musiqidir.', author: 'Təhmaz' },
    { text: 'Yaddaşımın ən şirin hissəsindəsən.', author: 'Təhmaz' },
    { text: 'Sevgi sözlərə sığmaz, sən kimi.', author: 'Təhmaz' },
    { text: 'Hər ulduz sənin adını pıçıldayır.', author: 'Təhmaz' },
    { text: 'Sən mənim əbədi baharımsan.', author: 'Təhmaz' },
    { text: 'Ürəyimdəki sevgi sonsuzluqdur.', author: 'Təhmaz' },
    { text: 'Sən mənim nəfəs aldığım havasan.', author: 'Təhmaz' },
    { text: 'Qəlbim yalnız sənin üçün döyünür.', author: 'Təhmaz' },
    { text: 'Sənin gözlərindəki məhəbbət bənzərsizdir.', author: 'Təhmaz' },
    { text: 'Sən mənim ən şirin xəyalımsan.', author: 'Təhmaz' },
    { text: 'Həyat səninlə məna kəsb edir.', author: 'Təhmaz' },
    { text: 'Sən — mənim hər şeyim.', author: 'Təhmaz' }
];

/* ═══════════════════════════════════════════════════════════════════
   QLOBAL STATE (VƏZİYYƏT İDARƏSİ)
   ═══════════════════════════════════════════════════════════════════ */

const AppState = {
    isLoggedIn: false,
    currentSection: 'home',
    photos: [],
    letters: [],
    songs: [],
    player: {
        currentIndex: -1,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.7,
        isMuted: false,
        isVisible: false,
        shuffle: false,
        repeatMode: 0 // 0=off, 1=all, 2=one
    },
    lightbox: {
        isOpen: false,
        currentIndex: 0,
        photos: []
    },
    admin: {
        isOpen: false,
        currentTab: 'photos'
    },
    isLoading: {
        photos: false,
        letters: false,
        songs: false
    },
    cache: new Map(),
    stats: {
        photos: 0,
        letters: 0,
        songs: 0
    },
    // Status timer-ları
    statusTimers: {
        photo: null,
        letter: null,
        music: null
    }
};

/* ═══════════════════════════════════════════════════════════════════
   DOM ELEMENTLƏRİ (CACHED)
   ═══════════════════════════════════════════════════════════════════ */

const DOM = {
    loginScreen: document.getElementById('loginScreen'),
    loginForm: document.getElementById('loginForm'),
    passwordInput: document.getElementById('passwordInput'),
    appContainer: document.getElementById('appContainer'),
    sections: {
        home: document.getElementById('homeSection'),
        gallery: document.getElementById('gallerySection'),
        letters: document.getElementById('lettersSection'),
        music: document.getElementById('musicSection'),
        surprises: document.getElementById('surprisesSection')
    },
    navItems: document.querySelectorAll('.nav-item'),
    daysCounter: document.getElementById('daysCounter'),
    hoursCounter: document.getElementById('hoursCounter'),
    minutesCounter: document.getElementById('minutesCounter'),
    secondsCounter: document.getElementById('secondsCounter'),
    loveProgressBar: document.getElementById('loveProgressBar'),
    photoCount: document.getElementById('photoCount'),
    letterCount: document.getElementById('letterCount'),
    songCount: document.getElementById('songCount'),
    dailyQuote: document.getElementById('dailyQuote'),
    quoteDate: document.getElementById('quoteDate'),
    galleryGrid: document.getElementById('galleryGrid'),
    lettersList: document.getElementById('lettersList'),
    musicPlaylist: document.getElementById('musicPlaylist'),
    musicPlayer: document.getElementById('musicPlayer'),
    currentSongTitle: document.getElementById('currentSongTitle'),
    currentSongArtist: document.getElementById('currentSongArtist'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    prevSongBtn: document.getElementById('prevSongBtn'),
    nextSongBtn: document.getElementById('nextSongBtn'),
    progressSlider: document.getElementById('progressSlider'),
    progressFill: document.getElementById('progressFill'),
    currentTime: document.getElementById('currentTime'),
    durationTime: document.getElementById('durationTime'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeBtn: document.getElementById('volumeBtn'),
    closePlayerBtn: document.getElementById('closePlayerBtn'),
    lightboxModal: document.getElementById('lightboxModal'),
    lightboxImage: document.getElementById('lightboxImage'),
    lightboxCaption: document.getElementById('lightboxCaption'),
    lightboxCounter: document.getElementById('lightboxCounter'),
    lightboxClose: document.getElementById('lightboxClose'),
    lightboxDelete: document.getElementById('lightboxDelete'),
    lightboxPrev: document.getElementById('lightboxPrev'),
    lightboxNext: document.getElementById('lightboxNext'),
    letterModal: document.getElementById('letterModal'),
    letterModalTitle: document.getElementById('letterModalTitle'),
    letterModalBody: document.getElementById('letterModalBody'),
    letterModalClose: document.getElementById('letterModalClose'),
    adminPanel: document.getElementById('adminPanel'),
    adminClose: document.getElementById('adminClose'),
    adminTabs: document.querySelectorAll('.admin-tab'),
    adminPanes: {
        photos: document.getElementById('adminPhotosPane'),
        letters: document.getElementById('adminLettersPane'),
        music: document.getElementById('adminMusicPane')
    },
    notificationBar: document.getElementById('notificationBar'),
    notificationMessage: document.getElementById('notificationMessage'),
    surpriseButton: document.getElementById('surpriseButton'),
    backFromSurprises: document.getElementById('backFromSurprises'),
    heroHeart: document.getElementById('heroHeart'),

    // Fullscreen Player
    fullscreenPlayer: document.getElementById('fullscreenPlayer'),
    fsCloseBtn: document.getElementById('fsCloseBtn'),
    fsVinylRecord: document.getElementById('fsVinylRecord'),
    fsTitle: document.getElementById('fsTitle'),
    fsArtist: document.getElementById('fsArtist'),
    fsProgressFill: document.getElementById('fsProgressFill'),
    fsProgressSlider: document.getElementById('fsProgressSlider'),
    fsCurrentTime: document.getElementById('fsCurrentTime'),
    fsDurationTime: document.getElementById('fsDurationTime'),
    fsShuffleBtn: document.getElementById('fsShuffleBtn'),
    fsPrevBtn: document.getElementById('fsPrevBtn'),
    fsPlayBtn: document.getElementById('fsPlayBtn'),
    fsNextBtn: document.getElementById('fsNextBtn'),
    fsRepeatBtn: document.getElementById('fsRepeatBtn'),
    fsPlaylistList: document.getElementById('fsPlaylistList'),
    fsPlaylistToggle: document.getElementById('fsPlaylistToggle')
};

const audioPlayer = new Audio();

/* ═══════════════════════════════════════════════════════════════════
   UTILITY FUNKSİYALARI
   ═══════════════════════════════════════════════════════════════════ */

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('az-AZ', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function cleanFileName(filename) {
    return filename
        .replace(/^\d+\s*/, '')
        .replace(/\.(jpg|jpeg|png|gif|webp|avif|mp3|wav|ogg|aac|flac|m4a|txt|md)$/i, '')
        .replace(/[_\-]/g, ' ')
        .trim();
}

function extractTimestamp(filename) {
    const parts = filename.replace(/\.(txt|md)$/i, '').split('_');
    const lastPart = parts[parts.length - 1];
    return /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : 0;
}

/* ═══════════════════════════════════════════════════════════════════
   BİLDİRİŞ SİSTEMİ
   ═══════════════════════════════════════════════════════════════════ */

function showNotification(message, type = 'info', duration = 3000) {
    const bar = DOM.notificationBar;
    const msg = DOM.notificationMessage;

    msg.textContent = message;
    bar.className = 'notification-bar';
    bar.classList.add(type, 'show');

    setTimeout(() => {
        bar.classList.remove('show');
    }, duration);
}

function showError(message, duration = 3000) {
    showNotification(message, 'error', duration);
}

/* ═══════════════════════════════════════════════════════════════════
   STATUS MESAJLARI (Admin Panel üçün)
   ═══════════════════════════════════════════════════════════════════ */

function showStatus(element, message, type, duration = 2000) {
    if (!element) return;

    element.className = `admin-status ${type}`;
    element.textContent = message;
    element.style.display = 'block';

    // Əvvəlki timer-i təmizlə
    const timerKey = element.id;
    if (AppState.statusTimers[timerKey]) {
        clearTimeout(AppState.statusTimers[timerKey]);
    }

    // Yeni timer qur
    AppState.statusTimers[timerKey] = setTimeout(() => {
        element.style.display = 'none';
        element.textContent = '';
    }, duration);
}

function clearStatus(element) {
    if (!element) return;
    element.style.display = 'none';
    element.textContent = '';
}

/* ═══════════════════════════════════════════════════════════════════
   GİRİŞ SİSTEMİ
   ═══════════════════════════════════════════════════════════════════ */

function initLogin() {
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = DOM.passwordInput.value;

        if (!password) return;

        try {
            const loginBtn = DOM.loginForm.querySelector('.login-button');
            const btnText = loginBtn ? loginBtn.querySelector('.button-text') : null;
            const originalText = btnText ? btnText.textContent : '';

            if (btnText) btnText.textContent = 'Yoxlanılır...';
            if (loginBtn) loginBtn.disabled = true;

            const res = await githubRequestProxy('check_password', { password });

            if (res && res.success) {
                performLogin();
            } else {
                DOM.passwordInput.classList.add('shake');
                setTimeout(() => DOM.passwordInput.classList.remove('shake'), 500);
                showError('❌ Şifrə yanlışdır! Yenidən cəhd et.');
                DOM.passwordInput.value = '';
            }

            if (btnText) btnText.textContent = originalText;
            if (loginBtn) loginBtn.disabled = false;
        } catch (err) {
            console.error('Login xətası:', err);
            showError('❌ Bağlantı xətası baş verdi.');
        }
    });

    DOM.passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            DOM.loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

function performLogin() {
    AppState.isLoggedIn = true;
    trackAction("Sistemə daxil oldu", "Uğurlu giriş");

    DOM.loginScreen.style.opacity = '0';
    DOM.loginScreen.style.transition = 'opacity 0.8s ease-out';

    setTimeout(() => {
        DOM.loginScreen.classList.add('hidden');
        DOM.appContainer.classList.add('visible');
        initApp();
    }, 800);
}

/* ═══════════════════════════════════════════════════════════════════
   TƏTBİQ BAŞLATMA
   ═══════════════════════════════════════════════════════════════════ */

function initApp() {
    initCounter();
    setDailyQuote();
    initNavigation();
    initMusicPlayer();
    initLightbox();
    initLetterModal();
    initAdminPanel();
    initSurpriseButtons();
    initStarsCanvas();
    loadInitialData();

    AppState.currentSection = 'home';
    if (DOM.sections.home) {
        DOM.sections.home.classList.add('active');
    }
    DOM.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === 'home');
    });

    initAutoSave();
}

/* ═══════════════════════════════════════════════════════════════════
   VAXT SAYĞACI
   ═══════════════════════════════════════════════════════════════════ */

function initCounter() {
    updateCounter();
    setInterval(updateCounter, 1000);
}

function updateCounter() {
    const now = new Date();
    const start = APP_CONFIG.startDate;
    const diff = now - start;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (DOM.daysCounter) DOM.daysCounter.textContent = String(days).padStart(4, '0');
    if (DOM.hoursCounter) DOM.hoursCounter.textContent = String(hours).padStart(2, '0');
    if (DOM.minutesCounter) DOM.minutesCounter.textContent = String(minutes).padStart(2, '0');
    if (DOM.secondsCounter) DOM.secondsCounter.textContent = String(seconds).padStart(2, '0');

    const progress = ((diff % 60000) / 60000) * 100;

    if (DOM.loveProgressBar) {
        DOM.loveProgressBar.style.setProperty('--progress', progress + '%');
    }
}

/* ═══════════════════════════════════════════════════════════════════
   GÜNLÜK SİTAT
   ═══════════════════════════════════════════════════════════════════ */

function setDailyQuote() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quote = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];

    if (DOM.dailyQuote) DOM.dailyQuote.textContent = `"${quote.text}"`;
    if (DOM.quoteDate) DOM.quoteDate.textContent = formatDate(now);
}

/* ═══════════════════════════════════════════════════════════════════
   NAVİQASİYA
   ═══════════════════════════════════════════════════════════════════ */

function initNavigation() {
    DOM.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            if (section) navigateTo(section);
        });
    });
}

function navigateTo(section) {
    if (AppState.currentSection === section) return;

    trackAction("Bölməyə keçid", section);

    AppState.currentSection = section;

    Object.values(DOM.sections).forEach(el => {
        if (el) el.classList.remove('active');
    });

    if (DOM.sections[section]) {
        DOM.sections[section].classList.add('active');
    }

    DOM.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });

    loadSectionData(section);

    // Yuxarıya sürüşdür
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadSectionData(section) {
    switch (section) {
        case 'gallery':
            if (!AppState.isLoading.photos && AppState.photos.length === 0) {
                loadPhotos();
            }
            break;
        case 'letters':
            if (!AppState.isLoading.letters && AppState.letters.length === 0) {
                loadLetters();
            }
            break;
        case 'music':
            if (!AppState.isLoading.songs && AppState.songs.length === 0) {
                loadSongs();
            }
            break;
    }
}

/* ═══════════════════════════════════════════════════════════════════
   GITHUB API İNTEQRASİYASI
   ═══════════════════════════════════════════════════════════════════ */

async function githubRequestProxy(action, data) {
    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...data })
        });
        if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Request Proxy Error:', error);
        throw error;
    }
}

async function githubRequest(endpoint, options = {}) {
    return await githubRequestProxy('github_get', { path: endpoint });
}

async function githubListFolder(folder) {
    try {
        return await githubRequestProxy('github_list', { path: folder });
    } catch {
        return [];
    }
}

async function githubGetFile(path) {
    try {
        const data = await githubRequestProxy('github_get', { path });
        if (data && data.encoding === 'base64' && data.content) {
            return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
        }
        return (data && data.content) || '';
    } catch {
        return '';
    }
}

async function githubUploadFile(path, content, message) {
    try {
        let sha;
        try {
            const existing = await githubRequestProxy('github_get', { path });
            if (existing && existing.sha) sha = existing.sha;
        } catch { }

        const res = await githubRequestProxy('github_upload', {
            path,
            content: btoa(unescape(encodeURIComponent(content))),
            message,
            sha
        });
        return !!res;
    } catch (error) {
        console.error('Fayl yükləmə xətası:', error);
        return false;
    }
}

async function githubUploadBinary(path, file, message) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result.split(',')[1];

            try {
                const res = await githubRequestProxy('github_upload', {
                    path,
                    content: base64,
                    message
                });
                resolve(!!res);
            } catch {
                resolve(false);
            }
        };
        reader.readAsDataURL(file);
    });
}

async function updateMusicMetadata(newSong) {
    try {
        let songs = [];
        const content = await githubGetFile('music_list.json');
        if (content) {
            try {
                songs = JSON.parse(content);
                if (!Array.isArray(songs)) songs = [];
            } catch (e) {
                songs = [];
            }
        }

        songs.push(newSong);

        const success = await githubUploadFile(
            'music_list.json',
            JSON.stringify(songs, null, 2),
            '🎵 Musiqi siyahısı yeniləndi'
        );
        return success;
    } catch (error) {
        console.error('Metadata yeniləmə xətası:', error);
        return false;
    }
}

async function updatePhotoMetadata(newPhoto) {
    try {
        let photos = [];
        const content = await githubGetFile('photos_list.json');
        if (content) {
            try {
                photos = JSON.parse(content);
                if (!Array.isArray(photos)) photos = [];
            } catch (e) {
                photos = [];
            }
        }

        photos.push(newPhoto);

        const success = await githubUploadFile(
            'photos_list.json',
            JSON.stringify(photos, null, 2),
            '📸 Şəkil siyahısı yeniləndi'
        );
        return success;
    } catch (error) {
        console.error('Foto metadata yeniləmə xətası:', error);
        return false;
    }
}

async function removePhotoFromMetadata(publicId) {
    try {
        const content = await githubGetFile('photos_list.json');
        if (!content) return false;

        let photos = JSON.parse(content);
        if (!Array.isArray(photos)) return false;

        const updatedPhotos = photos.filter(p => p.public_id !== publicId);

        if (photos.length === updatedPhotos.length) return true;

        const success = await githubUploadFile(
            'photos_list.json',
            JSON.stringify(updatedPhotos, null, 2),
            '🗑️ Şəkil siyahıdan silindi'
        );
        return success;
    } catch (error) {
        console.error('Foto metadata silmə xətası:', error);
        return false;
    }
}


async function cloudinaryUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
    formData.append('folder', 'dunyamiz'); // Cloudinary-də yaranacaq qovluğun adı

    // Əgər aşağıdakı Variant 2 (List API) istifadə ediləcəksə, şəkillərə mütləq tag (etiket) vurulmalıdır:
    formData.append('tags', 'dunyamiz_gallery');

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Cloudinary upload xətası');
        const data = await response.json();
        return data; // İçində secure_url və public_id olacaq
    } catch (error) {
        console.error('Cloudinary yükləmə xətası:', error);
        return null;
    }
}

async function cloudinaryUploadAudio(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_MUSIC_CONFIG.upload_preset);
    formData.append('folder', 'dunyamiz_music');
    formData.append('tags', 'dunyamiz_music');

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_MUSIC_CONFIG.cloud_name}/video/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Cloudinary music upload xətası');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Cloudinary musiqi yükləmə xətası:', error);
        return null;
    }
}


/* ═══════════════════════════════════════════════════════════════════
   İLK MƏLUMATLARI YÜKLƏ
   ═══════════════════════════════════════════════════════════════════ */

async function loadInitialData() {
    await loadStats();

    const cachedStats = localStorage.getItem('dunyamiz_stats');
    if (cachedStats) {
        try {
            const stats = JSON.parse(cachedStats);
            updateStatsDisplay(stats);
        } catch { }
    }
}

async function loadStats() {
    try {
        try {
            const content = await githubGetFile('photos_list.json');
            if (content) {
                const photos = JSON.parse(content);
                AppState.stats.photos = Array.isArray(photos) ? photos.length : 0;
            } else {
                AppState.stats.photos = 0;
            }
        } catch {
            AppState.stats.photos = 0;
        }

        const letters = await githubListFolder('letters');
        AppState.stats.letters = Array.isArray(letters) ? letters.filter(f =>
            /\.(txt|md)$/i.test(f.name)
        ).length : 0;

        try {
            const content = await githubGetFile('music_list.json');
            if (content) {
                const songs = JSON.parse(content);
                AppState.stats.songs = Array.isArray(songs) ? songs.length : 0;
            } else {
                AppState.stats.songs = 0;
            }
        } catch {
            AppState.stats.songs = 0;
        }

        updateStatsDisplay(AppState.stats);
        localStorage.setItem('dunyamiz_stats', JSON.stringify(AppState.stats));

    } catch (error) {
        console.error('Statistika yükləmə xətası:', error);
    }
}

function updateStatsDisplay(stats) {
    if (DOM.photoCount) DOM.photoCount.textContent = stats.photos || 0;
    if (DOM.letterCount) DOM.letterCount.textContent = stats.letters || 0;
    if (DOM.songCount) DOM.songCount.textContent = stats.songs || 0;
}

/* ═══════════════════════════════════════════════════════════════════
   ŞƏKİL QALEREYASI
   ═══════════════════════════════════════════════════════════════════ */

async function loadPhotos() {
    if (AppState.isLoading.photos) return;

    AppState.isLoading.photos = true;
    showGalleryLoading();

    try {
        const content = await githubGetFile('photos_list.json');
        if (content) {
            const photos = JSON.parse(content);
            AppState.photos = Array.isArray(photos) ? photos.sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateB - dateA;
            }) : [];
        } else {
            AppState.photos = [];
        }

        renderGallery();
    } catch (error) {
        console.error("Şəkil siyahısı alınmadı:", error);
        showError('Şəkillər yüklənə bilmədi');
        showGalleryEmpty();
    } finally {
        AppState.isLoading.photos = false;
    }
}

function showGalleryLoading() {
    if (DOM.galleryGrid) {
        DOM.galleryGrid.innerHTML = `
            <div class="gallery-loading">
                <div class="loading-spinner"></div>
                <p>Xatirələr yüklənir...</p>
            </div>
        `;
    }
}

function showGalleryEmpty() {
    if (DOM.galleryGrid) {
        DOM.galleryGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-images"></i>
                <h4>Hələ şəkil yoxdur</h4>
                <p>Admin paneldən şəkil əlavə edə bilərsiniz</p>
            </div>
        `;
    }
}

function renderGallery() {
    if (!DOM.galleryGrid) return;

    if (AppState.photos.length === 0) {
        showGalleryEmpty();
        return;
    }

    let html = '';
    AppState.photos.forEach((photo, index) => {
        html += `
            <div class="gallery-item" data-index="${index}">
                <img src="${photo.download_url}" alt="Xatirə" loading="lazy">
                <div class="gallery-item-overlay">
                    <span><i class="fas fa-heart"></i></span>
                </div>
            </div>
        `;
    });

    DOM.galleryGrid.innerHTML = html;

    DOM.galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            openLightbox(index);
        });
    });
}

/* ═══════════════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════════════ */

function initLightbox() {
    if (!DOM.lightboxModal) return;

    DOM.lightboxClose.addEventListener('click', closeLightbox);
    DOM.lightboxModal.addEventListener('click', (e) => {
        if (e.target === DOM.lightboxModal) closeLightbox();
    });

    if (DOM.lightboxPrev) DOM.lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (DOM.lightboxNext) DOM.lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Silmə düyməsi
    if (DOM.lightboxDelete) {
        DOM.lightboxDelete.addEventListener('click', async () => {
            const photo = AppState.lightbox.photos[AppState.lightbox.currentIndex];
            if (!photo) return;

            const confirmed = confirm('Bu şəkili Cloudinary-dən silmək istədiyinizə əminsiniz?');
            if (!confirmed) return;

            DOM.lightboxDelete.disabled = true;
            DOM.lightboxDelete.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            const success = await cloudinaryDelete(photo.name);

            if (success) {
                await removePhotoFromMetadata(photo.public_id || photo.name);
                showNotification('🗑️ Şəkil uğurla silindi!', 'info');
                closeLightbox();
                AppState.photos = [];
                AppState.isLoading.photos = false;
                if (AppState.currentSection === 'gallery') loadPhotos();
                await loadStats();
            } else {
                showNotification('❌ Şəkil silinə bilmədi!', 'error');
            }

            DOM.lightboxDelete.disabled = false;
            DOM.lightboxDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!AppState.lightbox.isOpen) return;
        switch (e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': navigateLightbox(-1); break;
            case 'ArrowRight': navigateLightbox(1); break;
        }
    });

    let touchStartX = 0;
    DOM.lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    DOM.lightboxModal.addEventListener('touchend', (e) => {
        if (!AppState.lightbox.isOpen) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? 1 : -1);
    });
}

function openLightbox(index) {
    AppState.lightbox.isOpen = true;
    AppState.lightbox.currentIndex = index;
    AppState.lightbox.photos = AppState.photos;

    const photo = AppState.lightbox.photos[index];
    if (photo) trackAction("Şəkilə baxır", cleanFileName(photo.name));

    updateLightboxImage();
    DOM.lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    AppState.lightbox.isOpen = false;
    DOM.lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const photos = AppState.lightbox.photos;
    if (photos.length === 0) return;

    AppState.lightbox.currentIndex = (AppState.lightbox.currentIndex + direction + photos.length) % photos.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const photo = AppState.lightbox.photos[AppState.lightbox.currentIndex];
    if (!photo) return;

    if (DOM.lightboxImage) DOM.lightboxImage.src = photo.download_url;
    if (DOM.lightboxCaption) DOM.lightboxCaption.style.display = 'none';
    if (DOM.lightboxCounter) DOM.lightboxCounter.textContent = `${AppState.lightbox.currentIndex + 1} / ${AppState.lightbox.photos.length}`;
}

/* ═══════════════════════════════════════════════════════════════════
   CLOUDINARY SİLMƏ FUNKSİYASI
   ═══════════════════════════════════════════════════════════════════ */

async function cloudinaryDelete(publicId) {
    try {
        const data = await githubRequestProxy('cloudinary_delete', { public_id: publicId });
        return data.result === 'ok';
    } catch (error) {
        console.error('Cloudinary silmə xətası:', error);
        return false;
    }
}

/* ═══════════════════════════════════════════════════════════════════
  MƏKTUBLAR
   ═══════════════════════════════════════════════════════════════════ */

async function loadLetters() {
    if (AppState.isLoading.letters) return;

    AppState.isLoading.letters = true;
    showLettersLoading();

    try {
        const files = await githubListFolder('letters');

        AppState.letters = Array.isArray(files)
            ? files
                .filter(f => /\.(txt|md)$/i.test(f.name))
                .sort((a, b) => {
                    const tsA = extractTimestamp(a.name) || 0;
                    const tsB = extractTimestamp(b.name) || 0;
                    return tsB - tsA;
                })
            : [];

        renderLetters();
    } catch (error) {
        console.error('Məktublar yüklənə bilmədi:', error);
        showError('Məktublar yüklənə bilmədi');
        showLettersEmpty();
    } finally {
        AppState.isLoading.letters = false;
    }
}

function showLettersLoading() {
    if (DOM.lettersList) {
        DOM.lettersList.innerHTML = `
            <div class="letters-loading">
                <div class="loading-spinner"></div>
                <p>Məktublar yüklənir...</p>
            </div>
        `;
    }
}

function showLettersEmpty() {
    if (DOM.lettersList) {
        DOM.lettersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-envelope"></i>
                <h4>Hələ məktub yoxdur</h4>
                <p>Admin paneldən məktub əlavə edə bilərsiniz</p>
            </div>
        `;
    }
}

function renderLetters() {
    if (!DOM.lettersList) return;

    if (AppState.letters.length === 0) {
        showLettersEmpty();
        return;
    }

    let html = '';
    AppState.letters.forEach((letter) => {
        const rawTitle = letter.name.replace(/\.(txt|md)$/i, '').replace(/_/g, ' ');
        const title = rawTitle.replace(/\s*\d{10,}$/, '').trim() || rawTitle;

        let letterDate;
        const timestampMatch = letter.name.match(/_(\d{10,})\./);
        if (timestampMatch) {
            letterDate = new Date(parseInt(timestampMatch[1]));
        } else if (letter.commit_date) {
            letterDate = new Date(letter.commit_date);
        } else {
            letterDate = new Date();
        }

        html += `
            <div class="letter-card-item" data-path="${letter.path}" data-title="${escapeHtml(title)}">
                <div class="letter-card-icon">
                    <i class="fas fa-envelope-open-text"></i>
                </div>
                <div class="letter-card-content">
                    <div class="letter-card-title">
                        ${escapeHtml(title)}
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="letter-card-preview" id="preview-${letter.name}">
                        <i class="fas fa-spinner fa-spin"></i> Yüklənir...
                    </div>
                    <div class="letter-card-date">
                        <i class="far fa-calendar-alt"></i>
                        ${formatDate(letterDate)}
                    </div>
                </div>
            </div>
        `;
    });

    DOM.lettersList.innerHTML = html;

    DOM.lettersList.querySelectorAll('.letter-card-item').forEach(async (item) => {
        const path = item.dataset.path;
        const title = item.dataset.title;
        const name = path.split('/').pop();
        const previewEl = document.getElementById(`preview-${name.replace(/\./g, '\\.')}`) || document.getElementById(`preview-${name}`);

        item.addEventListener('click', () => openLetter(path, title));

        if (previewEl) {
            try {
                const content = await githubGetFile(path);
                const preview = content.slice(0, 100).replace(/\n/g, ' ') + (content.length > 100 ? '...' : '');
                previewEl.textContent = preview || '(Məktub boşdur)';
            } catch {
                previewEl.textContent = 'Məktub yüklənə bilmədi';
            }
        }
    });
}

function initLetterModal() {
    if (!DOM.letterModal) return;

    DOM.letterModalClose.addEventListener('click', closeLetterModal);
    DOM.letterModal.addEventListener('click', (e) => {
        if (e.target === DOM.letterModal) closeLetterModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.letterModal.classList.contains('open')) {
            closeLetterModal();
        }
    });
}

async function openLetter(path, title) {
    trackAction("Məktubu oxuyur", title);
    if (DOM.letterModalTitle) DOM.letterModalTitle.textContent = title;
    if (DOM.letterModalBody) DOM.letterModalBody.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Məktub yüklənir...';
    DOM.letterModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
        const content = await githubGetFile(path);
        if (DOM.letterModalBody) DOM.letterModalBody.textContent = content || '(Məktub boşdur)';
    } catch {
        if (DOM.letterModalBody) DOM.letterModalBody.textContent = 'Məktub yüklənə bilmədi';
    }
}

function closeLetterModal() {
    DOM.letterModal.classList.remove('open');
    document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════════════════
   MUSİQİLƏR VƏ PLEYER
   ═══════════════════════════════════════════════════════════════════ */

async function loadSongs() {
    if (AppState.isLoading.songs) return;

    AppState.isLoading.songs = true;
    showMusicLoading();

    try {
        const content = await githubGetFile('music_list.json');
        if (content) {
            const songs = JSON.parse(content);
            AppState.songs = Array.isArray(songs) ? songs.sort((a, b) => {
                const tsA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const tsB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return tsB - tsA; // Ən yeni birinci
            }) : [];
        } else {
            AppState.songs = [];
        }

        renderMusicPlaylist();
    } catch (error) {
        showError('Musiqilər yüklənə bilmədi');
        showMusicEmpty();
    } finally {
        AppState.isLoading.songs = false;
    }
}

function showMusicLoading() {
    if (DOM.musicPlaylist) {
        DOM.musicPlaylist.innerHTML = `
            <div class="music-loading">
                <div class="loading-spinner"></div>
                <p>Musiqilər yüklənir...</p>
            </div>
        `;
    }
}

function showMusicEmpty() {
    if (DOM.musicPlaylist) {
        DOM.musicPlaylist.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <h4>Hələ musiqi yoxdur</h4>
                <p>Admin paneldən musiqi əlavə edə bilərsiniz</p>
            </div>
        `;
    }
}

function renderMusicPlaylist() {
    if (!DOM.musicPlaylist) return;

    if (AppState.songs.length === 0) {
        showMusicEmpty();
        return;
    }

    let html = '';
    AppState.songs.forEach((song, index) => {
        const name = cleanFileName(song.name);
        html += `
            <div class="music-track-item" data-index="${index}">
                <div class="track-number">${index + 1}</div>
                <div class="track-info">
                    <div class="track-title">${escapeHtml(name)}</div>
                    <div class="track-artist">Dünyamız • Bizim mahnımız</div>
                </div>
                <div class="track-duration">--:--</div>
                <div class="track-play-icon">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        `;
    });

    DOM.musicPlaylist.innerHTML = html;

    DOM.musicPlaylist.querySelectorAll('.music-track-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            playSong(index);
        });
    });
}

function initMusicPlayer() {
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', onSongEnded);
    audioPlayer.addEventListener('play', () => updatePlayButton(true));
    audioPlayer.addEventListener('pause', () => updatePlayButton(false));

    if (DOM.playPauseBtn) DOM.playPauseBtn.addEventListener('click', togglePlay);
    if (DOM.prevSongBtn) DOM.prevSongBtn.addEventListener('click', playPrevious);
    if (DOM.nextSongBtn) DOM.nextSongBtn.addEventListener('click', playNext);
    if (DOM.closePlayerBtn) DOM.closePlayerBtn.addEventListener('click', hidePlayer);

    if (DOM.progressSlider) {
        DOM.progressSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (DOM.progressFill) DOM.progressFill.style.width = value + '%';
        });

        DOM.progressSlider.addEventListener('change', (e) => {
            const value = parseFloat(e.target.value);
            audioPlayer.currentTime = (value / 100) * audioPlayer.duration;
        });
    }

    if (DOM.volumeSlider) {
        DOM.volumeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) / 100;
            setVolume(value);
        });
    }

    if (DOM.volumeBtn) DOM.volumeBtn.addEventListener('click', toggleMute);

    // Fullscreen Player Listeners
    if (DOM.musicPlayer) {
        DOM.musicPlayer.addEventListener('click', (e) => {
            if (!e.target.closest('.player-controls') &&
                !e.target.closest('.player-progress-container') &&
                !e.target.closest('.player-volume') &&
                !e.target.closest('.player-close') &&
                !e.target.closest('.preview-cancel')) {
                openFullscreenPlayer();
            }
        });
    }
    if (DOM.fsCloseBtn) DOM.fsCloseBtn.addEventListener('click', closeFullscreenPlayer);
    if (DOM.fsPlayBtn) DOM.fsPlayBtn.addEventListener('click', togglePlay);
    if (DOM.fsPrevBtn) DOM.fsPrevBtn.addEventListener('click', playPrevious);
    if (DOM.fsNextBtn) DOM.fsNextBtn.addEventListener('click', playNext);
    if (DOM.fsShuffleBtn) DOM.fsShuffleBtn.addEventListener('click', toggleShuffle);
    if (DOM.fsRepeatBtn) DOM.fsRepeatBtn.addEventListener('click', toggleRepeat);
    if (DOM.fsPlaylistToggle) {
        DOM.fsPlaylistToggle.addEventListener('click', () => {
            const isHidden = DOM.fsPlaylistList.style.display === 'none';
            DOM.fsPlaylistList.style.display = isHidden ? 'flex' : 'none';
            DOM.fsPlaylistToggle.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
        });
    }

    if (DOM.fsProgressSlider) {
        DOM.fsProgressSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (DOM.fsProgressFill) DOM.fsProgressFill.style.width = value + '%';
        });
        DOM.fsProgressSlider.addEventListener('change', (e) => {
            const value = parseFloat(e.target.value);
            audioPlayer.currentTime = (value / 100) * audioPlayer.duration;
        });
    }

    setVolume(AppState.player.volume);
}

function getAudioUrl(song) {
    if (song.download_url) return song.download_url;
    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/music/${encodeURIComponent(song.name)}`;
}

function playSong(index) {
    if (index < 0 || index >= AppState.songs.length) return;

    const song = AppState.songs[index];
    trackAction("Musiqi dinləyir", cleanFileName(song.name));

    if (AppState.player.currentIndex !== -1) {
        const prevItem = DOM.musicPlaylist.querySelector(`[data-index="${AppState.player.currentIndex}"]`);
        if (prevItem) prevItem.classList.remove('playing');
    }

    AppState.player.currentIndex = index;

    const audioUrl = getAudioUrl(song);
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = audioUrl;
    audioPlayer.crossOrigin = 'anonymous';
    audioPlayer.load();

    const onCanPlay = () => {
        audioPlayer.play()
            .then(() => { AppState.player.isPlaying = true; })
            .catch(err => {
                console.error('Playback error:', err);
                audioPlayer.crossOrigin = null;
                audioPlayer.src = audioUrl;
                audioPlayer.load();
                audioPlayer.play().catch(e => console.error('Retry failed:', e));
            });
        audioPlayer.removeEventListener('canplay', onCanPlay);
    };
    audioPlayer.addEventListener('canplay', onCanPlay);

    const currentItem = DOM.musicPlaylist.querySelector(`[data-index="${index}"]`);
    if (currentItem) currentItem.classList.add('playing');

    showPlayer(song);
}

function showPlayer(song) {
    const name = cleanFileName(song.name);
    if (DOM.currentSongTitle) DOM.currentSongTitle.textContent = name;
    if (DOM.currentSongArtist) DOM.currentSongArtist.textContent = 'Bizim Dünyamız • Sevgimizin musiqisi';

    if (DOM.fsTitle) DOM.fsTitle.textContent = name;

    if (DOM.musicPlayer) DOM.musicPlayer.classList.add('visible');
    AppState.player.isVisible = true;

    updateFsPlaylist();
}

function hidePlayer() {
    if (DOM.musicPlayer) DOM.musicPlayer.classList.remove('visible');
    AppState.player.isVisible = false;
    audioPlayer.pause();
    AppState.player.isPlaying = false;

    if (AppState.player.currentIndex !== -1) {
        const currentItem = DOM.musicPlaylist.querySelector(`[data-index="${AppState.player.currentIndex}"]`);
        if (currentItem) currentItem.classList.remove('playing');
    }
    AppState.player.currentIndex = -1;
}

function togglePlay() {
    if (AppState.player.currentIndex === -1) {
        if (AppState.songs.length > 0) playSong(0);
        return;
    }

    if (!audioPlayer.paused) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(e => console.error('Playback error:', e));
    }
}

function playPrevious() {
    if (AppState.songs.length === 0) return;
    const newIndex = AppState.player.currentIndex <= 0
        ? AppState.songs.length - 1
        : AppState.player.currentIndex - 1;
    playSong(newIndex);
}

function playNext() {
    if (AppState.songs.length === 0) return;

    let newIndex;
    if (AppState.player.shuffle) {
        newIndex = Math.floor(Math.random() * AppState.songs.length);
    } else {
        newIndex = (AppState.player.currentIndex + 1) % AppState.songs.length;
    }
    playSong(newIndex);
}

function onSongEnded() {
    if (AppState.player.repeatMode === 1) { // repeat one
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else if (AppState.player.repeatMode === 2) { // repeat all
        playNext();
    } else { // no repeat
        if (AppState.player.shuffle) {
            playNext();
        } else if (AppState.player.currentIndex < AppState.songs.length - 1) {
            playNext();
        } else {
            AppState.player.isPlaying = false;
            updatePlayButton(false);
        }
    }
}

function updatePlayButton(isPlaying) {
    AppState.player.isPlaying = isPlaying;
    const icon = DOM.playPauseBtn?.querySelector('i');
    if (icon) icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';

    const fsIcon = DOM.fsPlayBtn?.querySelector('i');
    if (fsIcon) fsIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';

    if (DOM.fsVinylRecord) {
        if (isPlaying) {
            DOM.fsVinylRecord.classList.add('playing');
        } else {
            DOM.fsVinylRecord.classList.remove('playing');
        }
    }
}

function updateDuration() {
    if (DOM.durationTime) DOM.durationTime.textContent = formatTime(audioPlayer.duration);
    if (DOM.progressSlider) DOM.progressSlider.max = 100;

    if (DOM.fsDurationTime) DOM.fsDurationTime.textContent = formatTime(audioPlayer.duration);
    if (DOM.fsProgressSlider) DOM.fsProgressSlider.max = 100;
}

function updateProgress() {
    if (!audioPlayer.duration) return;

    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    if (DOM.progressSlider) DOM.progressSlider.value = percent;
    if (DOM.progressFill) DOM.progressFill.style.width = percent + '%';
    if (DOM.currentTime) DOM.currentTime.textContent = formatTime(audioPlayer.currentTime);

    if (DOM.fsProgressSlider) DOM.fsProgressSlider.value = percent;
    if (DOM.fsProgressFill) DOM.fsProgressFill.style.width = percent + '%';
    if (DOM.fsCurrentTime) DOM.fsCurrentTime.textContent = formatTime(audioPlayer.currentTime);

    const currentItem = DOM.musicPlaylist.querySelector(`[data-index="${AppState.player.currentIndex}"]`);
    if (currentItem) {
        const durationEl = currentItem.querySelector('.track-duration');
        if (durationEl && audioPlayer.duration) {
            durationEl.textContent = formatTime(audioPlayer.duration);
        }
    }
}

function setVolume(value) {
    AppState.player.volume = Math.max(0, Math.min(1, value));
    audioPlayer.volume = AppState.player.isMuted ? 0 : AppState.player.volume;
    if (DOM.volumeSlider) DOM.volumeSlider.value = AppState.player.volume * 100;
    updateVolumeIcon();
}

function toggleMute() {
    AppState.player.isMuted = !AppState.player.isMuted;
    audioPlayer.volume = AppState.player.isMuted ? 0 : AppState.player.volume;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const icon = DOM.volumeBtn?.querySelector('i');
    if (icon) {
        if (AppState.player.isMuted || AppState.player.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (AppState.player.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }
}

/* ═══════════════════════════════════════════════════════════════════
   TAM EKRAN MUSİQİ PLEYERİ FUNKSİYALARI
   ═══════════════════════════════════════════════════════════════════ */

function openFullscreenPlayer() {
    if (!DOM.fullscreenPlayer) return;
    DOM.fullscreenPlayer.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateFsPlaylist();
    trackAction("Tam ekran pleyeri açdı");
}

function closeFullscreenPlayer() {
    if (!DOM.fullscreenPlayer) return;
    DOM.fullscreenPlayer.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleShuffle() {
    AppState.player.shuffle = !AppState.player.shuffle;
    if (DOM.fsShuffleBtn) {
        DOM.fsShuffleBtn.classList.toggle('active', AppState.player.shuffle);
    }
}

function toggleRepeat() {
    // repeatMode: 0 = off, 1 = one, 2 = all
    AppState.player.repeatMode = (AppState.player.repeatMode + 1) % 3;

    if (DOM.fsRepeatBtn) {
        if (AppState.player.repeatMode === 0) {
            DOM.fsRepeatBtn.classList.remove('active');
            DOM.fsRepeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        } else if (AppState.player.repeatMode === 1) { // repeat one
            DOM.fsRepeatBtn.classList.add('active');
            DOM.fsRepeatBtn.innerHTML = '<i class="fas fa-redo" style="position:relative;"><span style="position:absolute; font-size:10px; font-weight:bold; top:50%; left:50%; transform:translate(-50%, -50%); font-family:sans-serif;">1</span></i>';
        } else { // repeat all
            DOM.fsRepeatBtn.classList.add('active');
            DOM.fsRepeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    }
}

function updateFsPlaylist() {
    if (!DOM.fsPlaylistList) return;

    let html = '';
    AppState.songs.forEach((song, index) => {
        const name = cleanFileName(song.name);
        const isActive = index === AppState.player.currentIndex;
        html += `
            <div class="fs-playlist-item ${isActive ? 'active' : ''}" data-index="${index}">
                <div class="fs-playlist-item-icon">
                    <i class="fas ${isActive ? 'fa-volume-up' : 'fa-music'}"></i>
                </div>
                <div class="fs-playlist-item-details">
                    <span class="fs-playlist-item-title">${escapeHtml(name)}</span>
                </div>
            </div>
        `;
    });

    DOM.fsPlaylistList.innerHTML = html;

    DOM.fsPlaylistList.querySelectorAll('.fs-playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            if (index !== AppState.player.currentIndex) {
                playSong(index);
            }
        });
    });
}

/* ═══════════════════════════════════════════════════════════════════
  SÜPRİZ DÜYMƏLƏRİ
   ═══════════════════════════════════════════════════════════════════ */

function initSurpriseButtons() {
    if (DOM.surpriseButton) {
        DOM.surpriseButton.addEventListener('click', () => navigateTo('surprises'));
    }

    if (DOM.backFromSurprises) {
        DOM.backFromSurprises.addEventListener('click', () => navigateTo('home'));
    }

    const surpriseCards = document.querySelectorAll('.surprise-card');
    surpriseCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3')?.textContent || 'Naməlum Sürpriz';
            trackAction("Sürprizə daxil oldu", title);
        });
    });

    const specialSurprise4 = document.getElementById('specialSurprise4');
    if (specialSurprise4) {
        specialSurprise4.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('🎉 Bu sürpriz tezliklə əlavə olunacaq!', 'info');
        });
    }
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN PANEL
   ═══════════════════════════════════════════════════════════════════ */

function initAdminPanel() {
    if (DOM.heroHeart) {
        DOM.heroHeart.addEventListener('dblclick', openAdminPanel);
    }

    if (DOM.adminClose) DOM.adminClose.addEventListener('click', closeAdminPanel);
    if (DOM.adminPanel) {
        DOM.adminPanel.addEventListener('click', (e) => {
            if (e.target === DOM.adminPanel) closeAdminPanel();
        });
    }

    DOM.adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.adminTab;
            switchAdminTab(tabName);
        });
    });

    initPhotoUpload();
    initLetterUpload();
    initMusicUpload();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.admin.isOpen) {
            closeAdminPanel();
        }
    });
}

function openAdminPanel() {
    if (DOM.adminPanel) {
        DOM.adminPanel.classList.add('open');
        AppState.admin.isOpen = true;
        document.body.style.overflow = 'hidden';
    }
}

function closeAdminPanel() {
    if (DOM.adminPanel) {
        DOM.adminPanel.classList.remove('open');
        AppState.admin.isOpen = false;
        document.body.style.overflow = '';
    }
}

function switchAdminTab(tabName) {
    DOM.adminTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.adminTab === tabName);
    });

    Object.entries(DOM.adminPanes).forEach(([name, pane]) => {
        if (pane) pane.classList.toggle('active', name === tabName);
    });

    AppState.admin.currentTab = tabName;
}

/* ═══════════════════════════════════════════════════════════════════
   ŞƏKİL YÜKLƏMƏ (DÜZƏLDİLMİŞ)
   ═══════════════════════════════════════════════════════════════════ */

function initPhotoUpload() {
    const uploadArea = document.getElementById('photoUploadArea');
    const fileInput = document.getElementById('photoFileInput');
    const preview = document.getElementById('photoPreview');
    const previewImage = document.getElementById('photoPreviewImage');
    const fileName = document.getElementById('photoFileName');
    const fileSize = document.getElementById('photoFileSize');
    const uploadBtn = document.getElementById('uploadPhotoBtn');
    const status = document.getElementById('photoUploadStatus');

    let selectedFile = null;
    let isUploading = false;

    if (!uploadArea || !fileInput) return;

    // 🔧 PROBLEM HƏLLİ: fileInput-un öz click hadisəsində bubbling-i dayandır
    fileInput.addEventListener('click', (e) => {
        e.stopPropagation(); // Hadisənin uploadArea-ya qabarcıqlanmasının qarşısını al
    });

    // uploadArea kliklənəndə fileInput-u tətiklə
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Fayl seçildikdə
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                handlePhotoSelect(file);
            } else {
                showStatus(status, '❌ Zəhmət olmasa şəkil faylı seçin!', 'error');
            }
        }
        fileInput.value = ''; // Eyni faylın təkrar seçilməsi üçün
    });

    // Drag & drop (dəyişməyib)
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e91e63';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handlePhotoSelect(file);
        } else {
            showStatus(status, '❌ Zəhmət olmasa şəkil faylı seçin!', 'error');
        }
    });

    function handlePhotoSelect(file) {
        if (file.size > APP_CONFIG.maxFileSize.image) {
            showStatus(status, '❌ Şəkil 10MB-dan böyük ola bilməz!', 'error');
            return;
        }

        selectedFile = file;
        if (preview) preview.style.display = 'flex';
        if (previewImage) previewImage.src = URL.createObjectURL(file);
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
    }

    window.cancelPhotoSelection = function () {
        selectedFile = null;
        if (preview) preview.style.display = 'none';
        if (previewImage) previewImage.src = '';
    };

    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            if (isUploading) return;

            if (!selectedFile) {
                showStatus(status, '⚠️ Zəhmət olmasa şəkil seçin!', 'error');
                return;
            }

            isUploading = true;
            showStatus(status, '⏳ Şəkil yüklənir...', 'loading', 0);
            uploadBtn.disabled = true;

            try {
                // Cloudinary yükləməsi çağırılır
                const uploadResult = await cloudinaryUpload(selectedFile);

                if (uploadResult && uploadResult.secure_url) {
                    const photoData = {
                        name: selectedFile.name,
                        public_id: uploadResult.public_id,
                        download_url: uploadResult.secure_url,
                        created_at: new Date().toISOString()
                    };

                    await updatePhotoMetadata(photoData);

                    showStatus(status, '✅ Şəkil Cloudinary-ə uğurla yükləndi!', 'success');
                    trackAction("Yeni şəkil yüklədi", selectedFile.name);

                    selectedFile = null;
                    if (preview) preview.style.display = 'none';

                    await loadStats();
                    AppState.photos = [];
                    if (AppState.currentSection === 'gallery') loadPhotos();
                } else {
                    throw new Error('Yükləmə uğursuz oldu');
                }
            } catch (error) {
                showStatus(status, '❌ Xəta baş verdi! Yenidən cəhd edin.', 'error');
            } finally {
                isUploading = false;
                uploadBtn.disabled = false;
            }
        });
    }
}

/* ═══════════════════════════════════════════════════════════════════
   MƏKTUB YÜKLƏMƏ (DÜZƏLDİLMİŞ)
   ═══════════════════════════════════════════════════════════════════ */

function initLetterUpload() {
    const titleInput = document.getElementById('letterTitleInput');
    const contentInput = document.getElementById('letterContentInput');
    const uploadBtn = document.getElementById('uploadLetterBtn');
    const status = document.getElementById('letterUploadStatus');

    if (!uploadBtn) return;

    let isUploading = false;

    uploadBtn.addEventListener('click', async () => {
        if (isUploading) return;

        const title = titleInput?.value.trim() || '';
        const content = contentInput?.value.trim() || '';
        const author = document.getElementById('letterAuthorInput')?.value || 'Fidan';

        if (!title) {
            showStatus(status, '⚠️ Məktub başlığı boş ola bilməz!', 'error');
            return;
        }

        if (!content) {
            showStatus(status, '⚠️ Məktub mətni boş ola bilməz!', 'error');
            return;
        }

        isUploading = true;
        showStatus(status, '⏳ Məktub yüklənir...', 'loading', 0);
        uploadBtn.disabled = true;

        try {
            const path = `letters/${title.replace(/\s+/g, '_')}_${Date.now()}.txt`;
            const fullContent = `${content}\n\n---\n💕 Sevgilə, ${author}\n📅 ${new Date().toLocaleDateString('az-AZ')}`;
            const success = await githubUploadFile(path, fullContent, '💌 Yeni məktub əlavə edildi');

            if (success) {
                showStatus(status, '✅ Məktub uğurla yükləndi!', 'success');
                trackAction("Yeni məktub əlavə etdi", title);

                if (titleInput) titleInput.value = '';
                if (contentInput) contentInput.value = '';

                await loadStats();
                AppState.letters = [];
                if (AppState.currentSection === 'letters') {
                    loadLetters();
                }
            } else {
                throw new Error('Yükləmə uğursuz oldu');
            }
        } catch (error) {
            showStatus(status, '❌ Xəta baş verdi! Yenidən cəhd edin.', 'error');
        } finally {
            isUploading = false;
            uploadBtn.disabled = false;
        }
    });
}

/* ═══════════════════════════════════════════════════════════════════
   MUSİQİ YÜKLƏMƏ (DÜZƏLDİLMİŞ)
   ═══════════════════════════════════════════════════════════════════ */

function initMusicUpload() {
    const uploadArea = document.getElementById('musicUploadArea');
    const fileInput = document.getElementById('musicFileInput');
    const preview = document.getElementById('musicPreview');
    const fileName = document.getElementById('musicFileName');
    const fileSize = document.getElementById('musicFileSize');
    const uploadBtn = document.getElementById('uploadMusicBtn');
    const status = document.getElementById('musicUploadStatus');

    let selectedFile = null;
    let isUploading = false;

    if (!uploadArea || !fileInput) return;

    // 🔧 PROBLEM HƏLLİ: fileInput-un öz click hadisəsində bubbling-i dayandır
    fileInput.addEventListener('click', (e) => {
        e.stopPropagation(); // Hadisənin uploadArea-ya qabarcıqlanmasının qarşısını al
    });

    // uploadArea kliklənəndə fileInput-u tətiklə
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Fayl seçildikdə
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('audio/')) {
                handleMusicSelect(file);
            } else {
                showStatus(status, '❌ Zəhmət olmasa musiqi faylı seçin!', 'error');
            }
        }
        fileInput.value = ''; // Eyni faylın təkrar seçilməsi üçün
    });

    // Drag & drop (dəyişməyib)
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e91e63';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            handleMusicSelect(file);
        } else {
            showStatus(status, '❌ Zəhmət olmasa musiqi faylı seçin!', 'error');
        }
    });

    function handleMusicSelect(file) {
        if (file.size > APP_CONFIG.maxFileSize.music) {
            showStatus(status, '❌ Musiqi 30MB-dan böyük ola bilməz!', 'error');
            return;
        }

        selectedFile = file;
        if (preview) preview.style.display = 'flex';
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
    }

    window.cancelMusicSelection = function () {
        selectedFile = null;
        if (preview) preview.style.display = 'none';
    };

    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            if (isUploading) return;

            if (!selectedFile) {
                showStatus(status, '⚠️ Zəhmət olmasa musiqi faylı seçin!', 'error');
                return;
            }

            isUploading = true;
            showStatus(status, '⏳ Musiqi yüklənir...', 'loading', 0);
            uploadBtn.disabled = true;

            try {
                const uploadResult = await cloudinaryUploadAudio(selectedFile);

                if (uploadResult && uploadResult.secure_url) {
                    const songData = {
                        name: selectedFile.name,
                        public_id: uploadResult.public_id,
                        download_url: uploadResult.secure_url,
                        created_at: new Date().toISOString()
                    };

                    await updateMusicMetadata(songData);

                    showStatus(status, '✅ Musiqi uğurla yükləndi!', 'success');
                    trackAction("Yeni musiqi yüklədi", selectedFile.name);
                    selectedFile = null;
                    if (preview) preview.style.display = 'none';

                    await loadStats();
                    AppState.songs = [];
                    if (AppState.currentSection === 'music') loadSongs();
                } else {
                    throw new Error('Yükləmə uğursuz oldu');
                }
            } catch (error) {
                showStatus(status, '❌ Xəta baş verdi! Yenidən cəhd edin.', 'error');
            } finally {
                isUploading = false;
                uploadBtn.disabled = false;
            }
        });
    }
}

/* ═══════════════════════════════════════════════════════════════════
  CANVAS ULDUZ ANİMASİYASI
   ═══════════════════════════════════════════════════════════════════ */

function initStarsCanvas() {
    const container = document.getElementById('universe-bg');
    if (!container) return;

    const existingCanvas = document.getElementById('starsCanvas');
    if (existingCanvas) existingCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'starsCanvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStars();
    }

    function generateStars() {
        const count = Math.floor((canvas.width * canvas.height) / 3000);
        stars = [];

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                opacity: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 0.05 + 0.01,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.8 ? '#e91e63' : '#ffffff'
            });
        }
    }

    function drawStars(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            const twinkle = Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase);
            const opacity = star.opacity * (0.6 + 0.4 * twinkle);

            if (star.color === '#e91e63') {
                ctx.fillStyle = `rgba(233, 30, 99, ${opacity})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(233, 30, 99, 0.6)';
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.shadowBlur = star.size > 1.5 ? 4 : 0;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            star.y -= star.speed;

            if (star.y < -10) {
                star.y = canvas.height + 10;
                star.x = Math.random() * canvas.width;
            }
        });

        ctx.shadowBlur = 0;
        animationFrame = requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', debounce(resizeCanvas, 200));

    resizeCanvas();
    animationFrame = requestAnimationFrame(drawStars);
}

/* ═══════════════════════════════════════════════════════════════════
   AUTO-SAVE VƏZİYYƏTİ
   ═══════════════════════════════════════════════════════════════════ */

function initAutoSave() {
    setInterval(() => {
        if (AppState.isLoggedIn) saveAppState();
    }, 30000);

    window.addEventListener('beforeunload', () => saveAppState());
}

function saveAppState() {
    const state = {
        currentSection: AppState.currentSection,
        player: {
            volume: AppState.player.volume,
            isMuted: AppState.player.isMuted
        },
        lastVisit: new Date().toISOString()
    };

    localStorage.setItem('dunyamiz_app_state', JSON.stringify(state));
}

function loadAppState() {
    try {
        const saved = localStorage.getItem('dunyamiz_app_state');
        if (saved) {
            const state = JSON.parse(saved);
            if (state.player) {
                setVolume(state.player.volume);
                if (state.player.isMuted) toggleMute();
            }
        }
    } catch (e) {
        console.error('Vəziyyət yüklənə bilmədi:', e);
    }
}

/* ═══════════════════════════════════════════════════════════════════
   OFFLİNE DƏSTƏK
   ═══════════════════════════════════════════════════════════════════ */

function initOfflineSupport() {
    window.addEventListener('online', () => {
        showNotification('📡 İnternet bağlantısı bərpa edildi!', 'success', 2000);
        loadSectionData(AppState.currentSection);
    });

    window.addEventListener('offline', () => {
        showNotification('📴 Offline rejimdəsiniz. Bəzi funksiyalar işləməyə bilər.', 'info', 4000);
    });
}

/* ═══════════════════════════════════════════════════════════════════
   SEVGİ GÜCÜ - ÜRƏYƏ BASILI TUT
   ═══════════════════════════════════════════════════════════════════ */

function initLovePower() {
    const heartBtn = document.getElementById('hold-heart');
    const percentText = document.getElementById('power-percent');

    if (!heartBtn || !percentText) return;

    const loveBg = document.createElement('div');
    loveBg.className = 'love-active-bg';
    document.body.appendChild(loveBg);

    let holdTimer = null;
    let drainTimer = null;
    let power = 0;
    let isMaxed = false;

    function clearAllTimers() {
        if (holdTimer) {
            clearInterval(holdTimer);
            holdTimer = null;
        }
        if (drainTimer) {
            clearInterval(drainTimer);
            drainTimer = null;
        }
    }

    function updatePower() {
        if (power >= 100) {
            if (!isMaxed) {
                isMaxed = true;
                percentText.innerText = '💕 Səni Çox Sevirəm 💕';
                percentText.style.fontSize = '1.4rem';
                heartBtn.style.filter = `drop-shadow(0 0 40px var(--primary-pink-glow))`;
                heartBtn.style.animation = 'none';
                heartBtn.style.transform = 'scale(1.15)';
            }
        } else {
            isMaxed = false;
            percentText.innerText = power + '%';
            percentText.style.fontSize = '1.2rem';
            heartBtn.style.transform = `scale(${1 + (power / 150)})`;
            heartBtn.style.filter = `drop-shadow(0 0 ${10 + power / 4}px var(--primary-pink-glow))`;
        }

        loveBg.style.opacity = power / 120;
    }

    function startHolding(e) {
        e.preventDefault();
        clearAllTimers();

        holdTimer = setInterval(() => {
            if (power < 100) {
                power = Math.min(100, power + 2);
                updatePower();
            } else {
                clearInterval(holdTimer);
                holdTimer = null;
            }
        }, 50);
    }

    function stopHolding(e) {
        if (e) e.preventDefault();
        clearAllTimers();

        drainTimer = setInterval(() => {
            if (power > 0) {
                power = Math.max(0, power - 3);
                updatePower();
            } else {
                clearInterval(drainTimer);
                drainTimer = null;
                isMaxed = false;
                percentText.style.fontSize = '1.2rem';
                heartBtn.style.animation = 'heartbeat 2s ease-in-out infinite';
            }
        }, 30);
    }

    heartBtn.addEventListener('mousedown', startHolding);
    heartBtn.addEventListener('mouseup', stopHolding);
    heartBtn.addEventListener('mouseleave', stopHolding);

    heartBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startHolding(e);
    }, { passive: false });

    heartBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopHolding(e);
    });

    heartBtn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        stopHolding(e);
    });

    window.addEventListener('beforeunload', clearAllTimers);
}

/* ═══════════════════════════════════════════════════════════════════
   SƏHİFƏ YÜKLƏNDİKDƏ BAŞLAT
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.setProperty('--progress', '0%');

    initStarsCanvas();
    initLogin();
    loadAppState();
    initOfflineSupport();
    initLovePower();
    initAnalytics();
});

/* ═══════════════════════════════════════════════════════════════════
   TELEGRAM ANALİTİKA
   ═══════════════════════════════════════════════════════════════════ */

let visitStartTime = Date.now();

async function sendTelegramMessage(text, keepalive = false) {
    try {
        await githubRequestProxy('telegram_send', { text });
    } catch (e) {
        console.error('Telegram bildiriş xətası:', e);
    }
}

function trackAction(action, details = '') {
    const ip = AppState.visitorIp || 'Naməlum IP';
    let message = `🔔 Fəaliyyət!\n📍 IP: ${ip}\n🎯 Əməliyyat: ${action}`;
    if (details) {
        message += `\n📝 Detal: ${details}`;
    }
    message += `\n⏰ Vaxt: ${new Date().toLocaleString('az-AZ')}`;
    sendTelegramMessage(message, true); // keepalive = true
}

async function initAnalytics() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        AppState.visitorIp = data.ip || 'Naməlum IP';

        await sendTelegramMessage(`🟢 Sayta giriş oldu!\n📍 IP: ${AppState.visitorIp}\n⏰ Vaxt: ${new Date().toLocaleString('az-AZ')}`);
    } catch (e) {
        console.error('IP alma xətası:', e);
    }

    // Using visibilitychange and pagehide to better capture exits, specially on mobile
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            sendExitNotification();
        }
    });

    window.addEventListener('pagehide', sendExitNotification);
    window.addEventListener('beforeunload', sendExitNotification);
}

let exitNotificationSent = false;
function sendExitNotification() {
    if (exitNotificationSent) return;
    exitNotificationSent = true;

    const duration = Date.now() - visitStartTime;
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let timeString = '';
    if (hours > 0) timeString += `${hours} saat `;
    if (minutes > 0) timeString += `${minutes} dəqiqə `;
    timeString += `${seconds} saniyə`;

    const ip = AppState.visitorIp || 'Naməlum IP';
    sendTelegramMessage(`🔴 Saytdan çıxış!\n📍 IP: ${ip}\n⏳ Keçirilən vaxt: ${timeString}`, true);
}

/* ═══════════════════════════════════════════════════════════════════
   QLOBAL FUNKSİYALAR
   ═══════════════════════════════════════════════════════════════════ */

window.DunyamizApp = {
    navigateTo,
    getState: () => ({ ...AppState }),
    refreshData: loadSectionData,
    version: APP_CONFIG.version,
    cancelPhotoSelection: () => {
        const preview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('photoPreviewImage');
        if (preview) preview.style.display = 'none';
        if (previewImage) previewImage.src = '';
    },
    cancelMusicSelection: () => {
        const preview = document.getElementById('musicPreview');
        if (preview) preview.style.display = 'none';
    }
};

console.log(`
%c💕 Fidan & Təhmaz • Dünyamız 💕
%cVersion: ${APP_CONFIG.version}
%c"Sən mənim ən gözəl xəyalımsan..."
`,
    'font-size: 18px; color: #e91e63; font-family: "Dancing Script", cursive;',
    'font-size: 12px; color: #ff80ab;',
    'font-size: 14px; color: #ffffff; font-style: italic;'
);

/* ═══════════════════════════════════════════════════════════════════
   JAVASCRIPT SONU - v2.1.0
   ═══════════════════════════════════════════════════════════════════ */
