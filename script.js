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
        repeatMode: 0, // 0=off, 1=all, 2=one
        queueContext: {
            tab: 'all',
            playlist: null
        }
    },
    lightbox: {
        isOpen: false,
        currentIndex: 0,
        photos: []
    },
    admin: {
        isOpen: false,
        currentTab: 'photos',
        selectedPhotos: [],
        selectedMusic: []
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
    musicData: {
        favorites: [],
        playlists: {}
    },
    currentMusicTab: 'all',
    currentPlaylist: null,
    // Status timer-ları
    statusTimers: {},
    // Toplu seçim vəziyyəti
    selection: {
        galleryMode: false,
        selectedPhotos: [], // indices
        musicMode: false,
        selectedMusic: [] // public_ids
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
    photoPreviewList: document.getElementById('photoPreviewList'),
    musicPreviewList: document.getElementById('musicPreviewList'),
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
    fsPlaylistToggle: document.getElementById('fsPlaylistToggle'),

    // New actions
    letterModalDelete: document.getElementById('letterModalDelete'),
    fsMoreBtn: document.getElementById('fsMoreBtn'),
    fsMoreDropdown: document.getElementById('fsMoreDropdown'),
    fsRenameBtn: document.getElementById('fsRenameBtn'),
    fsDeleteBtn: document.getElementById('fsDeleteBtn'),
    fsHeartBtn: document.getElementById('fsHeartBtn'),
    fsPlaylistAddBtn: document.getElementById('fsPlaylistAddBtn'),
    musicTabs: document.querySelectorAll('.music-tab'),
    playlistModal: document.getElementById('playlistModal'),
    playlistModalClose: document.getElementById('playlistModalClose'),
    createPlaylistBtn: document.getElementById('createPlaylistBtn'),
    newPlaylistForm: document.getElementById('newPlaylistForm'),
    playlistNameInput: document.getElementById('playlistNameInput'),
    savePlaylistBtn: document.getElementById('savePlaylistBtn'),
    existingPlaylistsList: document.getElementById('existingPlaylistsList'),
    toastContainer: document.getElementById('toast-container'),
    // Toplu seçim düymələri
    gallerySelectBtn: document.getElementById('gallerySelectBtn'),
    galleryBulkDeleteBtn: document.getElementById('galleryBulkDeleteBtn'),
    musicSelectBtn: document.getElementById('musicSelectBtn'),
    musicBulkDeleteBtn: document.getElementById('musicBulkDeleteBtn')
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
   MODERN TOAST BİLDİRİŞ SİSTEMİ
   ═══════════════════════════════════════════════════════════════════ */

function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (message.includes('💖') || message.includes('❤️')) icon = 'fa-heart';

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Auto-remove
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('removing');
                setTimeout(() => toast.remove(), 500);
            }
        }, duration);
    }

    // Click to remove
    toast.onclick = () => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 500);
    };
}

function showError(message) {
    showNotification(message, 'error');
}

/* ═══════════════════════════════════════════════════════════════════
   STATUS MESAJLARI (Admin Panel üçün)
   ═══════════════════════════════════════════════════════════════════ */

function showStatus(element, message, type, duration = 2000) {
    if (!element) return;

    element.className = `admin-status ${type}`;
    element.textContent = message;
    element.style.display = ''; // CSS-dəki display-i istifadə et (flex/block)
    element.style.opacity = '1';

    // Əvvəlki timer-i təmizlə
    const timerKey = element.id || 'temp-status';
    if (AppState.statusTimers[timerKey]) {
        clearTimeout(AppState.statusTimers[timerKey]);
    }

    // Əgər duration 0-dırsa, avtomatik silmə (loading üçün)
    if (duration > 0) {
        AppState.statusTimers[timerKey] = setTimeout(() => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
                element.textContent = '';
            }, 400);
        }, duration);
    }
}

function clearStatus(element) {
    if (!element) return;
    element.style.opacity = '0';
    setTimeout(() => {
        element.style.display = 'none';
        element.textContent = '';
    }, 400);
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
    initSelectionSystem(); // Yeni toplu seçim sistemi
    loadInitialData();
    setTimeout(() => Visualizer.init(), 300); // Vizuallaşdırıcı barlarını init et

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

async function updateMusicMetadata(newSongs) {
    try {
        const songsToAdd = Array.isArray(newSongs) ? newSongs : [newSongs];
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

        songs.push(...songsToAdd);

        const success = await githubUploadFile(
            'music_list.json',
            JSON.stringify(songs, null, 2),
            `🎵 Musiqi siyahısı yeniləndi (${songsToAdd.length} yeni)`
        );
        return success;
    } catch (error) {
        console.error('Metadata yeniləmə xətası:', error);
        return false;
    }
}

async function updatePhotoMetadata(newPhotos) {
    try {
        const photosToAdd = Array.isArray(newPhotos) ? newPhotos : [newPhotos];
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

        photos.push(...photosToAdd);

        const success = await githubUploadFile(
            'photos_list.json',
            JSON.stringify(photos, null, 2),
            `📸 Şəkil siyahısı yeniləndi (${photosToAdd.length} yeni)`
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

    const isSelectionMode = AppState.selection.galleryMode;
    
    let html = '';
    AppState.photos.forEach((photo, index) => {
        const isSelected = AppState.selection.selectedPhotos.includes(index);
        html += `
            <div class="gallery-item stagger-item ${isSelected ? 'item-selected' : ''}" 
                 data-index="${index}"
                 data-id="${photo.public_id}"
                 style="animation-delay: ${index * 0.05}s">
                <img src="${photo.download_url}" alt="Xatirə" loading="lazy">
                <div class="item-checkbox">
                    <i class="fas fa-check"></i>
                </div>
                <div class="gallery-item-overlay">
                    <span><i class="fas fa-heart"></i></span>
                </div>
            </div>
        `;
    });

    DOM.galleryGrid.innerHTML = html;
    
    // Grid-ə selection-mode klası əlavə et
    DOM.galleryGrid.classList.toggle('selection-mode', isSelectionMode);

    DOM.galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const index = parseInt(item.dataset.index);
            if (AppState.selection.galleryMode) {
                togglePhotoSelection(index);
            } else {
                openLightbox(index);
            }
        });
    });

    // Animasiya bitdikdən sonra stagger-item klasını silirik ki, seçim zamanı təkrarlanmasın
    setTimeout(() => {
        DOM.galleryGrid.querySelectorAll('.stagger-item').forEach(el => el.classList.remove('stagger-item'));
    }, 1000);
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

            const success = await cloudinaryDelete(photo.public_id || photo.name, 'image');

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

async function cloudinaryDelete(publicId, resourceType = 'image') {
    const config = resourceType === 'video' ? CLOUDINARY_MUSIC_CONFIG : CLOUDINARY_CONFIG;
    try {
        const data = await githubRequestProxy('cloudinary_delete', { 
            public_id: publicId,
            resource_type: resourceType,
            cloud_name: config.cloud_name,
            api_key: config.api_key
        });
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
    AppState.letters.forEach((letter, index) => {
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
            <div class="letter-card-item stagger-item" 
                 data-path="${letter.path}" 
                 data-title="${escapeHtml(title)}"
                 style="animation-delay: ${index * 0.1}s">
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

    if (DOM.letterModalDelete) {
        DOM.letterModalDelete.addEventListener('click', async () => {
            const path = AppState.currentLetterPath;
            if (!path) return;

            const confirmed = confirm('Bu məktubu silmək istədiyinizə əminsiniz?');
            if (!confirmed) return;

            DOM.letterModalDelete.disabled = true;
            DOM.letterModalDelete.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            try {
                // Get SHA first
                const fileData = await githubRequestProxy('github_get', { path });
                if (fileData && fileData.sha) {
                    const res = await githubRequestProxy('github_delete', {
                        path,
                        message: '🗑️ Məktub silindi',
                        sha: fileData.sha
                    });

                    if (res) {
                        showNotification('🗑️ Məktub uğurla silindi!', 'info');
                        closeLetterModal();
                        AppState.letters = [];
                        if (AppState.currentSection === 'letters') loadLetters();
                        await loadStats();
                    } else {
                        showNotification('❌ Məktub silinə bilmədi!', 'error');
                    }
                }
            } catch (err) {
                console.error('Məktub silmə xətası:', err);
                showNotification('❌ Xəta baş verdi!', 'error');
            } finally {
                DOM.letterModalDelete.disabled = false;
                DOM.letterModalDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.letterModal.classList.contains('open')) {
            closeLetterModal();
        }
    });
}

async function openLetter(path, title) {
    AppState.currentLetterPath = path;
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

async function loadMusicData() {
    try {
        const content = await githubGetFile('music_data.json');
        if (content) {
            AppState.musicData = JSON.parse(content);
            // Verify structure
            if (!AppState.musicData.favorites) AppState.musicData.favorites = [];
            if (!AppState.musicData.playlists) AppState.musicData.playlists = {};
        }
    } catch (err) {
        console.warn('Musiqi datası yüklənə bilmədi, yeni data yaradılacaq.');
    }
}

async function saveMusicData() {
    try {
        await githubUploadFile(
            'music_data.json',
            JSON.stringify(AppState.musicData, null, 2),
            '📂 Musiqi datası yeniləndi (favorilər/playlistlər)'
        );
    } catch (err) {
        console.error('Musiqi datası yadda saxlanıla bilmədi:', err);
    }
}

async function loadSongs() {
    if (AppState.isLoading.songs) return;

    AppState.isLoading.songs = true;
    showMusicLoading();

    try {
        // 1. Musiqi siyahısını yüklə
        const content = await githubGetFile('music_list.json');
        if (content) {
            const songs = JSON.parse(content);
            AppState.songs = Array.isArray(songs) ? songs.sort((a, b) => {
                const tsA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const tsB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return tsB - tsA;
            }) : [];
        } else {
            AppState.songs = [];
        }

        // 2. Favorilər və Playlistləri yüklə
        await loadMusicData();

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

    let songsToRender = AppState.songs;
    const tab = AppState.currentMusicTab;

    if (tab === 'favorites') {
        songsToRender = AppState.songs.filter(s => AppState.musicData.favorites.includes(s.public_id));
    } else if (tab === 'custom') {
        if (AppState.currentPlaylist) {
            const playlistIds = AppState.musicData.playlists[AppState.currentPlaylist] || [];
            songsToRender = AppState.songs.filter(s => playlistIds.includes(s.public_id));
        } else {
            renderPlaylistsGrid();
            return;
        }
    }

    if (songsToRender.length === 0) {
        let emptyMsg = 'Hələ musiqi yoxdur';
        if (tab === 'favorites') emptyMsg = 'Hələ heç bir musiqini favorit etməmisiniz';
        if (tab === 'custom') emptyMsg = 'Bu playlist boşdur';
        
        DOM.musicPlaylist.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <h4>${emptyMsg}</h4>
            </div>
        `;
        return;
    }

    let html = '';
    
    // Əgər playlist daxilindəyiksə geri qayıt düyməsi qoyaq
    if (tab === 'custom' && AppState.currentPlaylist) {
        html += `
            <div class="playlist-songs-header">
                <button class="playlist-back-btn" id="playlistBackBtn">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h3>${AppState.currentPlaylist}</h3>
            </div>
        `;
    }

    const isSelectionMode = AppState.selection.musicMode;
    DOM.musicPlaylist.classList.toggle('selection-mode', isSelectionMode);

    songsToRender.forEach((song, index) => {
        const name = cleanFileName(song.name);
        const isPlaying = AppState.player.currentIndex !== -1 && AppState.songs[AppState.player.currentIndex].public_id === song.public_id;
        const isSelected = AppState.selection.selectedMusic.includes(song.public_id);
        
        html += `
            <div class="music-track-item stagger-item ${isPlaying ? 'playing' : ''} ${isSelected ? 'item-selected' : ''}" 
                 data-id="${song.public_id}"
                 style="animation-delay: ${index * 0.1}s">
                <div class="item-checkbox">
                    <i class="fas fa-check"></i>
                </div>
                <div class="track-number">${index + 1}</div>
                <div class="track-info">
                    <div class="track-title">${escapeHtml(name)}</div>
                    <div class="track-artist">Dünyamız • Bizim mahnımız</div>
                </div>
                <div class="track-play-icon">
                    <i class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                </div>
            </div>
        `;
    });

    DOM.musicPlaylist.innerHTML = html;

    // Listeners for track items
    DOM.musicPlaylist.querySelectorAll('.music-track-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const id = item.dataset.id;
            if (AppState.selection.musicMode) {
                toggleMusicSelection(id);
            } else {
                const songIndex = AppState.songs.findIndex(s => s.public_id === id);
                if (songIndex !== -1) {
                    updateQueueContext();
                    playSong(songIndex);
                }
            }
        });
    });

    // Animasiya təmizləmə
    setTimeout(() => {
        DOM.musicPlaylist.querySelectorAll('.stagger-item').forEach(el => el.classList.remove('stagger-item'));
    }, 1000);

    // Back button in playlist
    const backBtn = document.getElementById('playlistBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            AppState.currentPlaylist = null;
            renderMusicPlaylist();
        });
    }
}

function renderPlaylistsGrid() {
    const playlists = Object.keys(AppState.musicData.playlists);
    
    if (playlists.length === 0) {
        DOM.musicPlaylist.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-list-ul"></i>
                <h4>Hələ playlist yaratmamısınız</h4>
                <p>Pleyerdəki 3 nöqtə menyusundan playlist yarada bilərsiniz</p>
            </div>
        `;
        return;
    }

    let html = '<div class="playlists-grid">';
    playlists.forEach((name, index) => {
        const count = AppState.musicData.playlists[name].length;
        html += `
            <div class="playlist-card stagger-item" 
                 data-name="${name}"
                 style="animation-delay: ${index * 0.1}s">
                <div class="playlist-card-icon">
                    <i class="fas fa-music"></i>
                </div>
                <h3>${escapeHtml(name)}</h3>
                <span>${count} mahnı</span>
            </div>
        `;
    });
    html += '</div>';

    DOM.musicPlaylist.innerHTML = html;

    DOM.musicPlaylist.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', () => {
            AppState.currentPlaylist = card.dataset.name;
            renderMusicPlaylist();
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

    initMusicMoreMenu();
}

function initMusicMoreMenu() {
    if (DOM.fsMoreBtn) {
        DOM.fsMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.fsMoreDropdown.classList.toggle('show');
        });
    }

    document.addEventListener('click', () => {
        if (DOM.fsMoreDropdown) DOM.fsMoreDropdown.classList.remove('show');
    });

    if (DOM.fsRenameBtn) {
        DOM.fsRenameBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const song = AppState.songs[AppState.player.currentIndex];
            if (!song) return;

            const oldName = cleanFileName(song.name);
            const newName = prompt('Yeni adı daxil edin:', oldName);
            
            if (newName && newName !== oldName) {
                try {
                    const content = await githubGetFile('music_list.json');
                    let songs = JSON.parse(content);
                    
                    const index = songs.findIndex(s => s.public_id === song.public_id);
                    if (index !== -1) {
                        songs[index].name = newName + (song.name.includes('.') ? song.name.substring(song.name.lastIndexOf('.')) : '');
                        
                        const success = await githubUploadFile(
                            'music_list.json',
                            JSON.stringify(songs, null, 2),
                            `✏️ Musiqi adı dəyişdirildi: ${newName}`
                        );

                        if (success) {
                            showNotification('✅ Ad uğurla dəyişdirildi!', 'success');
                            song.name = songs[index].name;
                            renderMusicPlaylist();
                            showPlayer(song);
                            updateFsPlaylist();
                        }
                    }
                } catch (err) {
                    console.error('Ad dəyişmə xətası:', err);
                    showNotification('❌ Xəta baş verdi!', 'error');
                }
            }
            DOM.fsMoreDropdown.classList.remove('show');
        });
    }

    if (DOM.fsDeleteBtn) {
        DOM.fsDeleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const song = AppState.songs[AppState.player.currentIndex];
            if (!song) return;

            const confirmed = confirm(`"${cleanFileName(song.name)}" musiqisini silmək istədiyinizə əminsiniz?`);
            if (!confirmed) return;

            try {
                // 1. Cloudinary-dən sil
                const cloudSuccess = await cloudinaryDelete(song.public_id, 'video');
                
                // 2. Metadata-dan sil
                const content = await githubGetFile('music_list.json');
                let songs = JSON.parse(content);
                const updatedSongs = songs.filter(s => s.public_id !== song.public_id);
                
                const metaSuccess = await githubUploadFile(
                    'music_list.json',
                    JSON.stringify(updatedSongs, null, 2),
                    `🗑️ Musiqi silindi: ${song.name}`
                );

                if (metaSuccess) {
                    showNotification('🗑️ Musiqi uğurla silindi!', 'info');
                    AppState.songs = updatedSongs;
                    
                    // Favorilərdən və playlistlərdən də təmizlə
                    AppState.musicData.favorites = AppState.musicData.favorites.filter(id => id !== song.public_id);
                    for (const pl in AppState.musicData.playlists) {
                        AppState.musicData.playlists[pl] = AppState.musicData.playlists[pl].filter(id => id !== song.public_id);
                    }
                    saveMusicData();

                    renderMusicPlaylist();
                    updateFsPlaylist();
                    playNext();
                    await loadStats();
                }
            } catch (err) {
                console.error('Musiqi silmə xətası:', err);
                
                showNotification('❌ Xəta baş verdi!', 'error');
            }
            DOM.fsMoreDropdown.classList.remove('show');
        });
    }

    // New Music Features Listeners
    initMusicTabListeners();
    initFavoriteToggle();
    initPlaylistManagement();
}

function getFilteredSongs() {
    const tab = AppState.currentMusicTab;
    if (tab === 'all') return AppState.songs;
    if (tab === 'favorites') {
        return AppState.songs.filter(s => AppState.musicData.favorites.includes(s.public_id));
    }
    if (tab === 'custom' && AppState.currentPlaylist) {
        const playlistIds = AppState.musicData.playlists[AppState.currentPlaylist] || [];
        return AppState.songs.filter(s => playlistIds.includes(s.public_id));
    }
    return AppState.songs;
}

function updateQueueContext() {
    AppState.player.queueContext = {
        tab: AppState.currentMusicTab,
        playlist: AppState.currentPlaylist
    };
}

function getQueueSongs() {
    const ctx = AppState.player.queueContext;
    if (ctx.tab === 'all') return AppState.songs;
    if (ctx.tab === 'favorites') {
        return AppState.songs.filter(s => AppState.musicData.favorites.includes(s.public_id));
    }
    if (ctx.tab === 'custom' && ctx.playlist) {
        const playlistIds = AppState.musicData.playlists[ctx.playlist] || [];
        return AppState.songs.filter(s => playlistIds.includes(s.public_id));
    }
    return AppState.songs;
}

function initMusicTabListeners() {
    DOM.musicTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            DOM.musicTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            AppState.currentMusicTab = tab.dataset.tab;
            AppState.currentPlaylist = null;
            renderMusicPlaylist();
        });
    });
}

function initFavoriteToggle() {
    if (DOM.fsHeartBtn) {
        DOM.fsHeartBtn.addEventListener('click', () => {
            const song = AppState.songs[AppState.player.currentIndex];
            if (!song) return;

            const isFav = AppState.musicData.favorites.includes(song.public_id);
            if (isFav) {
                AppState.musicData.favorites = AppState.musicData.favorites.filter(id => id !== song.public_id);
                DOM.fsHeartBtn.classList.remove('active');
                DOM.fsHeartBtn.innerHTML = '<i class="far fa-heart"></i>';
                showNotification('💔 Favorilərdən çıxarıldı', 'info');
            } else {
                AppState.musicData.favorites.push(song.public_id);
                DOM.fsHeartBtn.classList.add('active');
                DOM.fsHeartBtn.innerHTML = '<i class="fas fa-heart"></i>';
                showNotification('💖 Favorilərə əlavə edildi!', 'success');
            }
            saveMusicData();
            if (AppState.currentMusicTab === 'favorites') renderMusicPlaylist();
        });
    }
}

function initPlaylistManagement() {
    // Playlistə əlavə et düyməsi (3 nöqtə daxilində)
    if (DOM.fsPlaylistAddBtn) {
        DOM.fsPlaylistAddBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.fsMoreDropdown.classList.remove('show');
            openPlaylistModal();
        });
    }

    // Modal bağlama
    if (DOM.playlistModalClose) {
        DOM.playlistModalClose.addEventListener('click', () => {
            DOM.playlistModal.classList.remove('active');
        });
    }

    // "Playlist yarat" düyməsi
    if (DOM.createPlaylistBtn) {
        DOM.createPlaylistBtn.addEventListener('click', () => {
            DOM.newPlaylistForm.style.display = 'flex';
            DOM.playlistNameInput.focus();
        });
    }

    // "Yarat" düyməsi
    if (DOM.savePlaylistBtn) {
        DOM.savePlaylistBtn.addEventListener('click', () => {
            const name = DOM.playlistNameInput.value.trim();
            if (!name) return;

            if (AppState.musicData.playlists[name]) {
                showNotification('❌ Bu adda playlist artıq var!', 'error');
                return;
            }

            AppState.musicData.playlists[name] = [];
            DOM.playlistNameInput.value = '';
            DOM.newPlaylistForm.style.display = 'none';
            renderExistingPlaylists();
            showNotification('✅ Playlist yaradıldı', 'success');
            saveMusicData();
        });
    }
}

function openPlaylistModal() {
    DOM.playlistModal.classList.add('active');
    renderExistingPlaylists();
}

function renderExistingPlaylists() {
    const playlists = Object.keys(AppState.musicData.playlists);
    const song = AppState.songs[AppState.player.currentIndex];

    if (playlists.length === 0) {
        DOM.existingPlaylistsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 20px;">Hələ playlist yoxdur</p>';
        return;
    }

    let html = '';
    playlists.forEach(name => {
        const isIn = AppState.musicData.playlists[name].includes(song.public_id);
        html += `
            <button class="playlist-item-btn" data-name="${name}">
                <i class="fas ${isIn ? 'fa-check-circle' : 'fa-plus-circle'}"></i>
                ${escapeHtml(name)}
            </button>
        `;
    });
    DOM.existingPlaylistsList.innerHTML = html;

    DOM.existingPlaylistsList.querySelectorAll('.playlist-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const isIn = AppState.musicData.playlists[name].includes(song.public_id);
            
            if (isIn) {
                AppState.musicData.playlists[name] = AppState.musicData.playlists[name].filter(id => id !== song.public_id);
                showNotification(`➖ Mahnı "${name}" playlistindən çıxarıldı`, 'info');
            } else {
                AppState.musicData.playlists[name].push(song.public_id);
                showNotification(`➕ Mahnı "${name}" playlistinə əlavə edildi!`, 'success');
            }
            saveMusicData();
            renderExistingPlaylists();
            if (AppState.currentMusicTab === 'custom') renderMusicPlaylist();
        });
    });
}

function updateHeartStatus(song) {
    if (!DOM.fsHeartBtn) return;
    const isFav = AppState.musicData.favorites.includes(song.public_id);
    if (isFav) {
        DOM.fsHeartBtn.classList.add('active');
        DOM.fsHeartBtn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        DOM.fsHeartBtn.classList.remove('active');
        DOM.fsHeartBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
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
        const prevSong = AppState.songs[AppState.player.currentIndex];
        const prevItem = DOM.musicPlaylist.querySelector(`.music-track-item[data-id="${prevSong.public_id}"]`);
        if (prevItem) {
            prevItem.classList.remove('playing');
            const icon = prevItem.querySelector('.track-play-icon i');
            if (icon) icon.className = 'fas fa-play';
        }
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


    const currentItem = DOM.musicPlaylist.querySelector(`.music-track-item[data-id="${song.public_id}"]`);
    if (currentItem) {
        currentItem.classList.add('playing');
        const icon = currentItem.querySelector('.track-play-icon i');
        if (icon) icon.className = 'fas fa-pause';
    }

    showPlayer(song);
}

function showPlayer(song) {
    const name = cleanFileName(song.name);
    if (DOM.currentSongTitle) DOM.currentSongTitle.textContent = name;
    if (DOM.currentSongArtist) DOM.currentSongArtist.textContent = 'Bizim Dünyamız • Sevgimizin musiqisi';

    if (DOM.fsTitle) DOM.fsTitle.textContent = name;

    if (DOM.musicPlayer) DOM.musicPlayer.classList.add('visible');
    AppState.player.isVisible = true;

    updateHeartStatus(song);
    updateFsPlaylist();
}

function hidePlayer() {
    if (DOM.musicPlayer) DOM.musicPlayer.classList.remove('visible');
    AppState.player.isVisible = false;
    audioPlayer.pause();
    AppState.player.isPlaying = false;

    if (AppState.player.currentIndex !== -1) {
        const prevSong = AppState.songs[AppState.player.currentIndex];
        const prevItem = DOM.musicPlaylist.querySelector(`.music-track-item[data-id="${prevSong.public_id}"]`);
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
    const filteredSongs = getQueueSongs();
    if (filteredSongs.length === 0) return;

    const currentSong = AppState.songs[AppState.player.currentIndex];
    const filteredIndex = filteredSongs.findIndex(s => s.public_id === currentSong?.public_id);
    
    const newFilteredIndex = filteredIndex <= 0
        ? filteredSongs.length - 1
        : filteredIndex - 1;
        
    const nextSong = filteredSongs[newFilteredIndex];
    const globalIndex = AppState.songs.findIndex(s => s.public_id === nextSong.public_id);
    if (globalIndex !== -1) playSong(globalIndex);
}

function playNext() {
    const filteredSongs = getQueueSongs();
    if (filteredSongs.length === 0) return;

    const currentSong = AppState.songs[AppState.player.currentIndex];
    const filteredIndex = filteredSongs.findIndex(s => s.public_id === currentSong?.public_id);

    let newFilteredIndex;
    if (AppState.player.shuffle) {
        newFilteredIndex = Math.floor(Math.random() * filteredSongs.length);
    } else {
        newFilteredIndex = (filteredIndex + 1) % filteredSongs.length;
    }
    
    const nextSong = filteredSongs[newFilteredIndex];
    const globalIndex = AppState.songs.findIndex(s => s.public_id === nextSong.public_id);
    if (globalIndex !== -1) playSong(globalIndex);
}

function onSongEnded() {
    if (AppState.player.repeatMode === 1) { // repeat one
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        const filteredSongs = getQueueSongs();
        const currentSong = AppState.songs[AppState.player.currentIndex];
        const filteredIndex = filteredSongs.findIndex(s => s.public_id === currentSong?.public_id);

        if (AppState.player.repeatMode === 2) { // repeat all
            playNext();
        } else { // no repeat
            if (AppState.player.shuffle) {
                playNext();
            } else if (filteredIndex !== -1 && filteredIndex < filteredSongs.length - 1) {
                playNext();
            } else {
                AppState.player.isPlaying = false;
                updatePlayButton(false);
            }
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

    // Vizuallaşdırıcını musiqinin vəziyyətinə uyğun idarə et
    if (typeof Visualizer !== 'undefined') {
        if (isPlaying) {
            Visualizer.start();
        } else {
            Visualizer.pause();
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

    const prevSong = AppState.songs[AppState.player.currentIndex];
    const prevItem = DOM.musicPlaylist.querySelector(`.music-track-item[data-id="${prevSong.public_id}"]`);
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
    const queueSongs = getQueueSongs();
    
    queueSongs.forEach((song) => {
        const name = cleanFileName(song.name);
        const globalIndex = AppState.songs.findIndex(s => s.public_id === song.public_id);
        const isActive = globalIndex === AppState.player.currentIndex;
        
        html += `
            <div class="fs-playlist-item ${isActive ? 'active' : ''}" data-id="${song.public_id}">
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
            const id = item.dataset.id;
            const globalIndex = AppState.songs.findIndex(s => s.public_id === id);
            if (globalIndex !== -1 && globalIndex !== AppState.player.currentIndex) {
                // Burada updateQueueContext() çağırmırıq, çünki onsuz da mövcud queue daxilində keçid edirik
                playSong(globalIndex);
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
    const uploadBtn = document.getElementById('uploadPhotoBtn');
    const status = document.getElementById('photoUploadStatus');

    let isUploading = false;

    if (!uploadArea || !fileInput) return;

    fileInput.addEventListener('click', (e) => e.stopPropagation());

    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handlePhotoSelection(files);
        fileInput.value = ''; 
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e91e63';
    });

    uploadArea.addEventListener('dragleave', () => uploadArea.style.borderColor = '');

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        const files = Array.from(e.dataTransfer.files);
        handlePhotoSelection(files);
    });

    function handlePhotoSelection(files) {
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                showNotification(`❌ "${file.name}" şəkil faylı deyil!`, 'error');
                return false;
            }
            if (file.size > APP_CONFIG.maxFileSize.image) {
                showNotification(`❌ "${file.name}" 10MB-dan böyükdür!`, 'error');
                return false;
            }
            return true;
        });

        AppState.admin.selectedPhotos.push(...validFiles);
        renderPhotoPreviews();
    }

    function renderPhotoPreviews() {
        if (!DOM.photoPreviewList) return;

        const files = AppState.admin.selectedPhotos;
        if (files.length === 0) {
            if (preview) preview.style.display = 'none';
            return;
        }

        if (preview) preview.style.display = 'block';
        
        const countEl = preview.querySelector('.preview-count');
        if (countEl) countEl.textContent = `${files.length} şəkil seçildi`;

        DOM.photoPreviewList.innerHTML = files.map((file, index) => `
            <div class="preview-item">
                <img src="${URL.createObjectURL(file)}" class="preview-item-thumb">
                <div class="preview-item-info">
                    <span class="preview-item-name">${escapeHtml(file.name)}</span>
                    <span class="preview-item-size">${formatFileSize(file.size)}</span>
                </div>
                <button class="preview-item-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        DOM.photoPreviewList.querySelectorAll('.preview-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                AppState.admin.selectedPhotos.splice(index, 1);
                renderPhotoPreviews();
            });
        });
    }

    window.DunyamizApp.cancelPhotoSelection = function () {
        AppState.admin.selectedPhotos = [];
        renderPhotoPreviews();
    };

    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            if (isUploading) return;

            const files = AppState.admin.selectedPhotos;
            if (files.length === 0) {
                showStatus(status, '⚠️ Zəhmət olmasa şəkil seçin!', 'error');
                return;
            }

            isUploading = true;
            uploadBtn.disabled = true;
            
            const results = [];
            const total = files.length;

            for (let i = 0; i < total; i++) {
                const file = files[i];
                showStatus(status, `⏳ Şəkillər yüklənir: ${i + 1} / ${total}...`, 'loading', 0);
                
                try {
                    const uploadResult = await cloudinaryUpload(file);
                    if (uploadResult && uploadResult.secure_url) {
                        results.push({
                            name: file.name,
                            public_id: uploadResult.public_id,
                            download_url: uploadResult.secure_url,
                            created_at: new Date().toISOString()
                        });
                    }
                } catch (err) {
                    console.error(`Upload error for ${file.name}:`, err);
                }
            }

            if (results.length > 0) {
                showStatus(status, '⏳ Metadata yenilənir...', 'loading', 0);
                await updatePhotoMetadata(results);
                
                showStatus(status, `✅ ${results.length} şəkil uğurla yükləndi!`, 'success');
                trackAction("Toplu şəkil yüklədi", `${results.length} ədəd`);

                AppState.admin.selectedPhotos = [];
                renderPhotoPreviews();

                await loadStats();
                AppState.photos = [];
                if (AppState.currentSection === 'gallery') loadPhotos();
            } else {
                showStatus(status, '❌ Yükləmə uğursuz oldu!', 'error');
            }

            isUploading = false;
            uploadBtn.disabled = false;
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
    const uploadBtn = document.getElementById('uploadMusicBtn');
    const status = document.getElementById('musicUploadStatus');

    let isUploading = false;

    if (!uploadArea || !fileInput) return;

    fileInput.addEventListener('click', (e) => e.stopPropagation());

    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleMusicSelection(files);
        fileInput.value = ''; 
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e91e63';
    });

    uploadArea.addEventListener('dragleave', () => uploadArea.style.borderColor = '');

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        const files = Array.from(e.dataTransfer.files);
        handleMusicSelection(files);
    });

    function handleMusicSelection(files) {
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('audio/')) {
                showNotification(`❌ "${file.name}" musiqi faylı deyil!`, 'error');
                return false;
            }
            if (file.size > APP_CONFIG.maxFileSize.music) {
                showNotification(`❌ "${file.name}" 30MB-dan böyükdür!`, 'error');
                return false;
            }
            return true;
        });

        AppState.admin.selectedMusic.push(...validFiles);
        renderMusicPreviews();
    }

    function renderMusicPreviews() {
        if (!DOM.musicPreviewList) return;

        const files = AppState.admin.selectedMusic;
        if (files.length === 0) {
            if (preview) preview.style.display = 'none';
            return;
        }

        if (preview) preview.style.display = 'block';
        
        const countEl = preview.querySelector('.preview-count');
        if (countEl) countEl.textContent = `${files.length} musiqi seçildi`;

        DOM.musicPreviewList.innerHTML = files.map((file, index) => `
            <div class="preview-item">
                <div class="preview-item-thumb">
                    <i class="fas fa-music"></i>
                </div>
                <div class="preview-item-info">
                    <span class="preview-item-name">${escapeHtml(file.name)}</span>
                    <span class="preview-item-size">${formatFileSize(file.size)}</span>
                </div>
                <button class="preview-item-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        DOM.musicPreviewList.querySelectorAll('.preview-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                AppState.admin.selectedMusic.splice(index, 1);
                renderMusicPreviews();
            });
        });
    }

    window.DunyamizApp.cancelMusicSelection = function () {
        AppState.admin.selectedMusic = [];
        renderMusicPreviews();
    };

    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            if (isUploading) return;

            const files = AppState.admin.selectedMusic;
            if (files.length === 0) {
                showStatus(status, '⚠️ Zəhmət olmasa musiqi faylı seçin!', 'error');
                return;
            }

            isUploading = true;
            uploadBtn.disabled = true;
            
            const results = [];
            const total = files.length;

            for (let i = 0; i < total; i++) {
                const file = files[i];
                showStatus(status, `⏳ Musiqilər yüklənir: ${i + 1} / ${total}...`, 'loading', 0);
                
                try {
                    const uploadResult = await cloudinaryUploadAudio(file);
                    if (uploadResult && uploadResult.secure_url) {
                        results.push({
                            name: file.name,
                            public_id: uploadResult.public_id,
                            download_url: uploadResult.secure_url,
                            created_at: new Date().toISOString()
                        });
                    }
                } catch (err) {
                    console.error(`Upload error for ${file.name}:`, err);
                }
            }

            if (results.length > 0) {
                showStatus(status, '⏳ Metadata yenilənir...', 'loading', 0);
                await updateMusicMetadata(results);
                
                showStatus(status, `✅ ${results.length} musiqi uğurla yükləndi!`, 'success');
                trackAction("Toplu musiqi yüklədi", `${results.length} ədəd`);

                AppState.admin.selectedMusic = [];
                renderMusicPreviews();

                await loadStats();
                AppState.songs = [];
                if (AppState.currentSection === 'music') loadSongs();
            } else {
                showStatus(status, '❌ Yükləmə uğursuz oldu!', 'error');
            }

            isUploading = false;
            uploadBtn.disabled = false;
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

async function sendTelegramMessage(text, ip = null) {
    try {
        await githubRequestProxy('telegram_send', { text, ip });
    } catch (e) {
        console.error('Telegram bildiriş xətası:', e);
    }
}

function trackAction(action, details = '') {
    const ip = AppState.visitorIp || 'Naməlum IP';
    const device = getDeviceInfo();
    
    let message = `<b>🔔 Fəaliyyət!</b>\n`;
    message += `👤 <b>IP:</b> <code>${ip}</code>\n`;
    message += `📱 <b>Cihaz:</b> ${device}\n`;
    message += `🎯 <b>Əməliyyat:</b> ${action}\n`;
    
    if (details) {
        message += `📝 <b>Detal:</b> ${details}\n`;
    }
    
    message += `⏰ <b>Vaxt:</b> ${new Date().toLocaleString('az-AZ')}`;
    
    sendTelegramMessage(message, ip);
}

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = "PC / Desktop";
    if (/android/i.test(ua)) device = "Android 📱";
    else if (/iphone|ipad|ipod/i.test(ua)) device = "iOS / Apple 🍏";
    else if (/mobile/i.test(ua)) device = "Mobile (Naməlum)";
    
    let browser = "Naməlum Brauzer";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";
    
    return `${device} (${browser})`;
}

async function initAnalytics() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        AppState.visitorIp = data.ip || 'Naməlum IP';

        const device = getDeviceInfo();
        const msg = `<b>🟢 Sayta giriş oldu!</b>\n` +
                    `👤 <b>IP:</b> <code>${AppState.visitorIp}</code>\n` +
                    `📱 <b>Cihaz:</b> ${device}\n` +
                    `⏰ <b>Vaxt:</b> ${new Date().toLocaleString('az-AZ')}`;

        await sendTelegramMessage(msg, AppState.visitorIp);
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
    const device = getDeviceInfo();
    const msg = `<b>🔴 Saytdan çıxış!</b>\n` +
                `👤 <b>IP:</b> <code>${ip}</code>\n` +
                `📱 <b>Cihaz:</b> ${device}\n` +
                `⏳ <b>Keçirilən vaxt:</b> ${timeString}`;
    
    sendTelegramMessage(msg, ip);
}

/* ═══════════════════════════════════════════════════════════════════
   QLOBAL FUNKSİYALAR
   ═══════════════════════════════════════════════════════════════════ */

window.DunyamizApp = {
    navigateTo,
    getState: () => ({ ...AppState }),
    refreshData: loadSectionData,
    version: APP_CONFIG.version,
    cancelPhotoSelection: () => {}, // Assigned in initPhotoUpload
    cancelMusicSelection: () => {}   // Assigned in initMusicUpload
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
   TOPLU SEÇİM SİSTEMİ MƏNTİQİ
   ═══════════════════════════════════════════════════════════════════ */

function initSelectionSystem() {
    // Qalereya üçün
    if (DOM.gallerySelectBtn) {
        DOM.gallerySelectBtn.addEventListener('click', toggleGallerySelectionMode);
    }
    if (DOM.galleryBulkDeleteBtn) {
        DOM.galleryBulkDeleteBtn.addEventListener('click', bulkDeletePhotos);
    }

    // Musiqi üçün
    if (DOM.musicSelectBtn) {
        DOM.musicSelectBtn.addEventListener('click', toggleMusicSelectionMode);
    }
    if (DOM.musicBulkDeleteBtn) {
        DOM.musicBulkDeleteBtn.addEventListener('click', bulkDeleteMusic);
    }
}

// --- QALEREYA SEÇİMİ ---

function toggleGallerySelectionMode() {
    AppState.selection.galleryMode = !AppState.selection.galleryMode;
    AppState.selection.selectedPhotos = [];
    
    const btn = DOM.gallerySelectBtn;
    if (btn) {
        btn.classList.toggle('active', AppState.selection.galleryMode);
        btn.querySelector('span').textContent = AppState.selection.galleryMode ? 'Seçimi bitir' : 'Seçim et';
    }

    if (DOM.galleryBulkDeleteBtn) {
        DOM.galleryBulkDeleteBtn.style.display = AppState.selection.galleryMode ? 'flex' : 'none';
        updateGalleryDeleteCount();
    }

    // Full render yerinə yalnız class toggling
    if (DOM.galleryGrid) {
        DOM.galleryGrid.classList.toggle('selection-mode', AppState.selection.galleryMode);
        // Bütün seçimləri təmizləyirik (rejimi dəyişəndə)
        DOM.galleryGrid.querySelectorAll('.gallery-item').forEach(el => el.classList.remove('item-selected'));
    }
}

function togglePhotoSelection(index) {
    const idx = AppState.selection.selectedPhotos.indexOf(index);
    let isSelected = false;
    
    if (idx === -1) {
        AppState.selection.selectedPhotos.push(index);
        isSelected = true;
    } else {
        AppState.selection.selectedPhotos.splice(idx, 1);
        isSelected = false;
    }
    
    // DOM-u birbaşa yeniləyirik (animasiya təkrarlanmasın deyə)
    const item = DOM.galleryGrid.querySelector(`.gallery-item[data-index="${index}"]`);
    if (item) {
        item.classList.toggle('item-selected', isSelected);
    }
    
    updateGalleryDeleteCount();
}

function updateGalleryDeleteCount() {
    if (!DOM.galleryBulkDeleteBtn) return;
    const count = AppState.selection.selectedPhotos.length;
    DOM.galleryBulkDeleteBtn.querySelector('span').textContent = count > 0 ? `Sil (${count})` : 'Sil';
    DOM.galleryBulkDeleteBtn.disabled = count === 0;
    DOM.galleryBulkDeleteBtn.style.opacity = count === 0 ? '0.5' : '1';
}

async function bulkDeletePhotos() {
    const selectedIndices = AppState.selection.selectedPhotos;
    if (selectedIndices.length === 0) return;

    if (!confirm(`${selectedIndices.length} şəkili silmək istədiyinizə əminsiniz?`)) return;

    const btn = DOM.galleryBulkDeleteBtn;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Silinir...</span>';

    try {
        const photosToDelete = selectedIndices.map(i => AppState.photos[i]);
        let successCount = 0;

        for (const photo of photosToDelete) {
            const success = await cloudinaryDelete(photo.public_id, 'image');
            if (success) {
                await removePhotoFromMetadata(photo.public_id);
                successCount++;
            }
        }

        showNotification(`✅ ${successCount} şəkil uğurla silindi!`, 'success');
        
        // Reset mode
        AppState.selection.galleryMode = false;
        AppState.selection.selectedPhotos = [];
        toggleGallerySelectionMode(); // UI reset üçün yenidən çağırırıq (amma reallıqda rejimi bağlayırıq)
        
        // Reload
        AppState.photos = [];
        loadPhotos();
        loadStats();

    } catch (err) {
        console.error('Toplu silmə xətası:', err);
        showNotification('❌ Bəzi şəkillər silinə bilmədi.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-trash-alt"></i> <span>Seçilənləri sil</span>';
    }
}

// --- MUSİQİ SEÇİMİ ---

function toggleMusicSelectionMode() {
    AppState.selection.musicMode = !AppState.selection.musicMode;
    AppState.selection.selectedMusic = [];
    
    const btn = DOM.musicSelectBtn;
    if (btn) {
        btn.classList.toggle('active', AppState.selection.musicMode);
        btn.querySelector('span').textContent = AppState.selection.musicMode ? 'Seçimi bitir' : 'Seçim et';
    }

    if (DOM.musicBulkDeleteBtn) {
        DOM.musicBulkDeleteBtn.style.display = AppState.selection.musicMode ? 'flex' : 'none';
        updateMusicDeleteCount();
    }

    if (DOM.musicPlaylist) {
        DOM.musicPlaylist.classList.toggle('selection-mode', AppState.selection.musicMode);
        DOM.musicPlaylist.querySelectorAll('.music-track-item').forEach(el => el.classList.remove('item-selected'));
    }
}

function toggleMusicSelection(id) {
    const idx = AppState.selection.selectedMusic.indexOf(id);
    let isSelected = false;

    if (idx === -1) {
        AppState.selection.selectedMusic.push(id);
        isSelected = true;
    } else {
        AppState.selection.selectedMusic.splice(idx, 1);
        isSelected = false;
    }
    
    const item = DOM.musicPlaylist.querySelector(`.music-track-item[data-id="${id}"]`);
    if (item) {
        item.classList.toggle('item-selected', isSelected);
    }
    
    updateMusicDeleteCount();
}

function updateMusicDeleteCount() {
    if (!DOM.musicBulkDeleteBtn) return;
    const count = AppState.selection.selectedMusic.length;
    DOM.musicBulkDeleteBtn.querySelector('span').textContent = count > 0 ? `Sil (${count})` : 'Sil';
    DOM.musicBulkDeleteBtn.disabled = count === 0;
    DOM.musicBulkDeleteBtn.style.opacity = count === 0 ? '0.5' : '1';
}

async function bulkDeleteMusic() {
    const selectedIds = AppState.selection.selectedMusic;
    if (selectedIds.length === 0) return;

    if (!confirm(`${selectedIds.length} musiqini silmək istədiyinizə əminsiniz?`)) return;

    const btn = DOM.musicBulkDeleteBtn;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Silinir...</span>';

    try {
        let successCount = 0;
        const content = await githubGetFile('music_list.json');
        let songs = JSON.parse(content);

        for (const id of selectedIds) {
            const song = AppState.songs.find(s => s.public_id === id);
            if (song) {
                const cloudSuccess = await cloudinaryDelete(id, 'video');
                if (cloudSuccess) {
                    songs = songs.filter(s => s.public_id !== id);
                    
                    // Favorilərdən və playlistlərdən də təmizlə
                    AppState.musicData.favorites = AppState.musicData.favorites.filter(favId => favId !== id);
                    for (const pl in AppState.musicData.playlists) {
                        AppState.musicData.playlists[pl] = AppState.musicData.playlists[pl].filter(plId => plId !== id);
                    }
                    successCount++;
                }
            }
        }

        if (successCount > 0) {
            await githubUploadFile(
                'music_list.json',
                JSON.stringify(songs, null, 2),
                `🗑️ Toplu musiqi silindi: ${successCount} ədəd`
            );
            await saveMusicData();
            showNotification(`✅ ${successCount} musiqi uğurla silindi!`, 'success');
        }

        // Reset mode
        AppState.selection.musicMode = false;
        AppState.selection.selectedMusic = [];
        toggleMusicSelectionMode();
        
        // Reload
        AppState.songs = [];
        loadSongs();
        loadStats();

    } catch (err) {
        console.error('Toplu musiqi silmə xətası:', err);
        showNotification('❌ Bəzi musiqilər silinə bilmədi.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-trash-alt"></i> <span>Seçilənləri sil</span>';
    }
}


/* ═══════════════════════════════════════════════════════════════════
   JAVASCRIPT SONU - v2.1.0
   ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   WEB AUDIO API VİZUALLAŞDIRICI SİSTEMİ
   ═══════════════════════════════════════════════════════════════════ */

const Visualizer = (() => {
    let audioCtx = null;
    let analyser = null;
    let source = null;
    let animFrameId = null;
    let bars = [];
    let isConnected = false;

    // Tezlik diapazonları (bass → treble) üçün bin indeksləri
    // 9 bar üçün əsas tezlik diapazonları
    const FREQ_BANDS = [
        [0,  2],   // Sub-bass
        [2,  4],   // Bass
        [4,  7],   // Low-mid
        [7,  12],  // Mid
        [12, 18],  // Upper-mid
        [18, 26],  // Presence
        [26, 36],  // Brilliance
        [36, 50],  // High
        [50, 70],  // Air
    ];

    function init() {
        bars = Array.from({ length: 9 }, (_, i) => document.getElementById(`visBar${i}`));
        // idle animasiya üçün CSS custom property
        bars.forEach((bar, i) => {
            if (bar) bar.style.setProperty('--i', i);
        });
    }

    function setupAudio() {
        if (isConnected) return; // artıq qoşulub

        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;

            // audioPlayer elementini AudioContext-ə qoş
            source = audioCtx.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            isConnected = true;
        } catch (e) {
            console.warn('Web Audio API qoşulmadı:', e);
        }
    }

    function getFrequencyAverage(dataArray, startBin, endBin) {
        let sum = 0;
        const count = endBin - startBin;
        for (let i = startBin; i < endBin && i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        return count > 0 ? sum / count : 0;
    }

    function drawBars(dataArray) {
        const visualizer = document.getElementById('fsVisualizer');
        if (!visualizer) return;

        FREQ_BANDS.forEach(([start, end], i) => {
            const bar = bars[i];
            if (!bar) return;

            const avg = getFrequencyAverage(dataArray, start, end);
            // 0-255 arasından 0.07-1.0 aralığına map et (scaleY)
            const scale = 0.07 + (avg / 255) * 0.93;
            bar.style.transform = `scaleY(${scale})`;
        });
    }

    function animate() {
        if (!analyser) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        drawBars(dataArray);

        animFrameId = requestAnimationFrame(animate);
    }

    function start() {
        const visualizer = document.getElementById('fsVisualizer');
        if (!visualizer) return;

        setupAudio();
        visualizer.classList.remove('idle');

        if (animFrameId) cancelAnimationFrame(animFrameId);
        animate();
    }

    function pause() {
        const visualizer = document.getElementById('fsVisualizer');

        // AnimFrame dayandır, barları yavaş-yavaş sıfırla
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }

        // Barları minimal hündürlüyə endirməklə birlikdə idle animasiya başlat
        bars.forEach(bar => {
            if (bar) bar.style.transform = 'scaleY(0.07)';
        });

        if (visualizer) {
            visualizer.classList.add('idle');
        }
    }

    function resume() {
        start();
    }

    return { init, start, pause, resume };
})();
