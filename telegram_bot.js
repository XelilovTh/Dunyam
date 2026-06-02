/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DÜNYAMIZ • TELEGRAM POLLING BOT (lokal/Railway üçün)           ║
 * ║  Bu fayl Vercel-də deyil, lokal/Railway/host-da işləyir         ║
 * ║  Vercel webhook üçün api/bot.js istifadə olunur                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

/* ═══════════════════════════════════════════════════════════════════
   KONFİQURASİYA
   ═══════════════════════════════════════════════════════════════════ */

const CONFIG = {
    github: {
        owner: process.env.GH_OWNER || 'XelilovTh',
        repo: process.env.GH_REPO || 'Dunyam',
        token: process.env.GH_TOKEN
    },
    cloudinary: {
        images: {
            cloud_name: process.env.CL_NAME || 'dojz9uzhe',
            api_key: process.env.CL_KEY,
            api_secret: process.env.CL_SECRET
        },
        music: {
            cloud_name: process.env.CL_MUSIC_NAME || 'drlzwhblg',
            api_key: process.env.CL_MUSIC_KEY,
            api_secret: process.env.CL_MUSIC_SECRET
        }
    },
    telegram: {
        token: process.env.TG_TOKEN,
        adminChatId: process.env.ADMIN_CHAT_ID || '6353022269'
    }
};

/* ═══════════════════════════════════════════════════════════════════
   GITHUB & CLOUDINARY HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function ghHeaders() {
    return {
        'Authorization': `Bearer ${CONFIG.github.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Dunyamiz-Bot/2.3.0'
    };
}

async function githubGetFile(path) {
    const url = `https://api.github.com/repos/${CONFIG.github.owner}/${CONFIG.github.repo}/contents/${path}`;
    const res = await axios.get(url, { headers: ghHeaders(), timeout: 8000 });
    return { content: Buffer.from(res.data.content, 'base64').toString('utf-8'), sha: res.data.sha };
}

async function githubPutFile(path, content, message, sha) {
    const url = `https://api.github.com/repos/${CONFIG.github.owner}/${CONFIG.github.repo}/contents/${path}`;
    const payload = { message, content: Buffer.from(content).toString('base64') };
    if (sha) payload.sha = sha;
    const res = await axios.put(url, payload, { headers: ghHeaders(), timeout: 10000 });
    return res.status === 200 || res.status === 201;
}

async function githubListDir(path) {
    const url = `https://api.github.com/repos/${CONFIG.github.owner}/${CONFIG.github.repo}/contents/${path}`;
    try {
        const res = await axios.get(url, { headers: ghHeaders(), timeout: 8000 });
        return Array.isArray(res.data) ? res.data : [];
    } catch (e) { return []; }
}

async function updateJsonList(path, newItem, commitMessage) {
    try {
        let list = [];
        let sha;
        try {
            const file = await githubGetFile(path);
            sha = file.sha;
            const parsed = JSON.parse(file.content);
            if (Array.isArray(parsed)) list = parsed;
        } catch (e) {}

        list.push(newItem);
        return await githubPutFile(path, JSON.stringify(list, null, 2), commitMessage, sha);
    } catch (e) {
        console.error(`Error updating ${path}:`, e.response?.data || e.message);
        return false;
    }
}

async function githubUpload(path, content, message) {
    return await githubPutFile(path, content, message);
}

/* ═══════════════════════════════════════════════════════════════════
   BOT BAŞLAT
   ═══════════════════════════════════════════════════════════════════ */

if (!CONFIG.telegram.token) {
    console.error('❌ TG_TOKEN təyin edilməyib! .env faylını yoxla.');
    process.exit(1);
}

const bot = new TelegramBot(CONFIG.telegram.token, { polling: true });
console.log('🤖 Dunyamiz Bot işə düşdü (v2.3)...');

/* ═══════════════════════════════════════════════════════════════════
   KOMANDALAR
   ═══════════════════════════════════════════════════════════════════ */

bot.onText(/\/start|\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
        `🌟 *Dünyamız Botuna Xoş Gəldin!* (v2.3)\n\n` +
        `📸 *Şəkil* göndər → Qalereya\n` +
        `🎵 *Musiqi* göndər → Pleylist\n` +
        `✉️ *Mətn* yaz → Məktublar\n` +
        `📊 */stats* → Statistika`,
        { parse_mode: 'Markdown' });
});

/* ═══════════════════════════════════════════════════════════════════
   ŞƏKİL YÜKLƏMƏ
   ═══════════════════════════════════════════════════════════════════ */

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const photo = msg.photo[msg.photo.length - 1];

    await bot.sendMessage(chatId, '⏳ Şəkil Cloudinary-ə yüklənir...');

    try {
        const fileLink = await bot.getFileLink(photo.file_id);
        cloudinary.config(CONFIG.cloudinary.images);

        const result = await cloudinary.uploader.upload(fileLink, {
            folder: 'dunyamiz',
            tags: 'dunyamiz_gallery'
        });

        const newPhoto = {
            name: `photo_${Date.now()}.jpg`,
            public_id: result.public_id,
            download_url: result.secure_url,
            created_at: new Date().toISOString()
        };
        const success = await updateJsonList('photos_list.json', newPhoto, '📸 Bot: Yeni şəkil əlavə edildi');

        if (success) {
            bot.sendMessage(chatId, `✅ Şəkil yükləndi!\n🔗 ${result.secure_url}`);
        } else {
            bot.sendMessage(chatId, '⚠️ Yükləndi, amma JSON siyahısı yenilənmədi.');
        }
    } catch (error) {
        console.error('Photo error:', error);
        bot.sendMessage(chatId, `❌ Xəta: ${error.message}`);
    }
});

/* ═══════════════════════════════════════════════════════════════════
   MUSİQİ YÜKLƏMƏ
   ═══════════════════════════════════════════════════════════════════ */

bot.on('audio', async (msg) => handleMusicUpload(msg, msg.audio));

bot.on('document', async (msg) => {
    const file = msg.document;
    if (file && /\.(mp3|wav|ogg|m4a|flac)$/i.test(file.file_name || '')) {
        handleMusicUpload(msg, file);
    }
});

async function handleMusicUpload(msg, file) {
    const chatId = msg.chat.id;
    const fileName = file.file_name || `music_${Date.now()}.mp3`;

    await bot.sendMessage(chatId, `⏳ "${fileName}" yüklənir...`);

    try {
        const fileLink = await bot.getFileLink(file.file_id);
        cloudinary.config(CONFIG.cloudinary.music);

        const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
        const base64Audio = `data:${file.mime_type || 'audio/mpeg'};base64,${Buffer.from(response.data).toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64Audio, {
            folder: 'dunyamiz_music',
            resource_type: 'video',
            tags: 'dunyamiz_music'
        });

        const newMusic = {
            name: fileName,
            public_id: result.public_id,
            download_url: result.secure_url,
            created_at: new Date().toISOString()
        };
        const success = await updateJsonList('music_list.json', newMusic, `🎵 Bot: ${fileName} əlavə edildi`);

        if (success) {
            bot.sendMessage(chatId, `✅ Musiqi yükləndi!\n🔗 ${result.secure_url}`);
        } else {
            bot.sendMessage(chatId, '❌ Musiqi yükləndi, JSON yenilənmədi.');
        }
    } catch (error) {
        console.error('Music error:', error);
        bot.sendMessage(chatId, `❌ Xəta: ${error.message}`);
    }
}

/* ═══════════════════════════════════════════════════════════════════
   MƏKTUB YAZMA (/upload ilə)
   ═══════════════════════════════════════════════════════════════════ */

bot.onText(/\/upload (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1];

    let title, content;
    if (input.includes(':')) {
        const parts = input.split(':');
        title = parts[0].trim();
        content = parts.slice(1).join(':').trim();
    } else {
        title = `Məktub_${new Date().toLocaleDateString('az-AZ').replace(/\./g, '_')}`;
        content = input.trim();
    }

    const fullContent = `${content}\n\n---\n💕 Sevgilə, Təhmaz\n📅 ${new Date().toLocaleDateString('az-AZ')}`;
    const fileName = `${title.replace(/[^a-zA-Z0-9əüöğıçşƏÜÖĞIÇŞ]/gi, '_')}_${Date.now()}.txt`;

    try {
        const success = await githubUpload(`letters/${fileName}`, fullContent, `✉️ Bot: ${title} məktubu`);
        if (success) {
            bot.sendMessage(chatId, `✅ Məktub yükləndi!\n📌 ${title}`);
        } else {
            bot.sendMessage(chatId, '❌ GitHub xətası.');
        }
    } catch (error) {
        console.error('Letter error:', error);
        bot.sendMessage(chatId, '❌ Məktub yüklənmədi.');
    }
});

/* ═══════════════════════════════════════════════════════════════════
   STATİSTİKA
   ═══════════════════════════════════════════════════════════════════ */

bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    let photoCount = 0, songCount = 0, letterCount = 0;

    try {
        const p = await githubGetFile('photos_list.json');
        photoCount = JSON.parse(p.content).length;
    } catch (e) {}
    try {
        const m = await githubListDir('music');
        songCount = m.filter(f => /\.(mp3|wav|ogg|m4a)$/i.test(f.name)).length;
    } catch (e) {}
    try {
        const l = await githubListDir('letters');
        letterCount = l.filter(f => /\.(txt|md)$/i.test(f.name)).length;
    } catch (e) {}

    bot.sendMessage(chatId,
        `📊 *Statistika*\n\n📸 Şəkillər: *${photoCount}*\n🎵 Musiqilər: *${songCount}*\n✉️ Məktublar: *${letterCount}*`,
        { parse_mode: 'Markdown' });
});

/* ═══════════════════════════════════════════════════════════════════
   SƏHVSİZ MESAJLAR → MƏKTUBLARA ÇEVRİLİR
   ═══════════════════════════════════════════════════════════════════ */

bot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/')) return;
    if (msg.text.length < 3) return;

    const chatId = msg.chat.id;
    const text = msg.text;
    const words = text.trim().split(/\s+/);
    const title = words.length > 1 ? words[0] : 'Məktub';
    const content = words.length > 1 ? words.slice(1).join(' ') : text;
    const fileName = `${title.replace(/[^a-zA-Z0-9əüöğıçşƏÜÖĞIÇŞ]/gi, '_')}_${Date.now()}.txt`;
    const fullContent = `${content}\n\n---\n💕 Sevgilə, Təhmaz\n📅 ${new Date().toLocaleDateString('az-AZ')}`;

    try {
        const success = await githubUpload(`letters/${fileName}`, fullContent, `✉️ Bot: ${title}`);
        if (success) {
            bot.sendMessage(chatId, `✅ Məktub yükləndi: ${title}`);
        }
    } catch (e) { /* səssizcə */ }
});

console.log('✅ Bot hazırdır. Mesaj gözləyir...');
