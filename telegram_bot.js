/**
 * DÜNYAMIZ - Telegram Bot
 * 
 * Bu bot vasitəsilə sayta şəkil, musiqi və məktub yükləyə bilərsiniz.
 * 
 * Quraşdırma:
 * 1. Node.js quraşdırılmış olmalıdır.
 * 2. Terminalda bu əmri işə salın:
 *    npm install node-telegram-bot-api cloudinary axios
 * 3. Botu başladın:
 *    node telegram_bot.js
 */

const TelegramBot = require('node-telegram-bot-api');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// KONFİQURASİYA (script.js-dən götürülüb)
const GITHUB_CONFIG = {
    owner: 'XelilovTh',
    repo: 'Dunyam',
    token: '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'
};

const CLOUDINARY_CONFIG = {
    cloud_name: 'dojz9uzhe',
    api_key: '241982348988817',
    api_secret: 'zmwVpP8tog--CNbggNCX-50QbGI'
};

const TELEGRAM_TOKEN = '6800223810:AAFxY2GC2A6PHl3oquOTDUWQMv-HMBXjdoA';

// Cloudinary ayarları
cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.cloud_name,
    api_key: CLOUDINARY_CONFIG.api_key,
    api_secret: CLOUDINARY_CONFIG.api_secret
});

// Botu başlat
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log('🤖 Bot işə düşdü...');

// ─────────────────────────────────────────────────────────────
// KÖMƏK VƏ START
// ─────────────────────────────────────────────────────────────
bot.onText(/\/start|\/help/, (msg) => {
    const helpText = `
🌟 *Dünyamız Botuna Xoş Gəlmisiniz!* 🌟

Bu bot vasitəsilə sayta asanlıqla məzmun əlavə edə bilərsiniz:

📸 *Şəkil yükləmə:* Sadəcə bota şəkil göndərin.
🎵 *Musiqi yükləmə:* Musiqi faylı (MP3, WAV, OGG) göndərin.
✉️ *Məktub yazma:* 
   \`/upload Mətn\` (Avtomatik başlıqla)
   \`/upload Başlıq: Mətn\` (Xüsusi başlıqla)
📊 *Statistika:* \`/stats\` yazaraq saydakı sayları görün.

_Hər hansı fayl göndərəndə avtomatik lazımi yerə yüklənəcək._
    `;
    bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
});

// ─────────────────────────────────────────────────────────────
// ŞƏKİL YÜKLƏMƏ (Cloudinary)
// ─────────────────────────────────────────────────────────────
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const photo = msg.photo[msg.photo.length - 1]; // Ən böyük ölçülü şəkil
    
    bot.sendMessage(chatId, '⏳ Şəkil Cloudinary-ə yüklənir...');

    try {
        const fileLink = await bot.getFileLink(photo.file_id);
        
        const result = await cloudinary.uploader.upload(fileLink, {
            folder: 'dunyamiz',
            tags: 'dunyamiz_gallery'
        });

        bot.sendMessage(chatId, `✅ Şəkil uğurla yükləndi!\n🔗 Link: ${result.secure_url}`);
    } catch (error) {
        console.error('Cloudinary xətası:', error);
        bot.sendMessage(chatId, '❌ Şəkil yüklənərkən xəta baş verdi.');
    }
});

// ─────────────────────────────────────────────────────────────
// MUSİQİ YÜKLƏMƏ (GitHub)
// ─────────────────────────────────────────────────────────────
bot.on('audio', async (msg) => {
    handleMusicUpload(msg, msg.audio);
});

bot.on('document', async (msg) => {
    const file = msg.document;
    const isAudio = /\.(mp3|wav|ogg|m4a|flac)$/i.test(file.file_name);
    if (isAudio) {
        handleMusicUpload(msg, file);
    }
});

async function handleMusicUpload(msg, file) {
    const chatId = msg.chat.id;
    const fileName = file.file_name || `music_${Date.now()}.mp3`;
    
    bot.sendMessage(chatId, `⏳ "${fileName}" GitHub-a yüklənir...`);

    try {
        const fileLink = await bot.getFileLink(file.file_id);
        const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
        const base64Content = Buffer.from(response.data).toString('base64');

        const success = await githubUpload(`music/${fileName}`, base64Content, `🎵 Bot: ${fileName} əlavə edildi`);

        if (success) {
            bot.sendMessage(chatId, `✅ Musiqi uğurla yükləndi!\n📁 Qovluq: music/${fileName}`);
        } else {
            bot.sendMessage(chatId, '❌ GitHub yükləmə xətası.');
        }
    } catch (error) {
        console.error('GitHub Musiqi xətası:', error);
        bot.sendMessage(chatId, '❌ Musiqi yüklənərkən xəta baş verdi.');
    }
}

// ─────────────────────────────────────────────────────────────
// MƏKTUB YAZMA (GitHub)
// ─────────────────────────────────────────────────────────────
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

    bot.sendMessage(chatId, '⏳ Məktub GitHub-a yüklənir...');

    const fullContent = `${content}\n\n---\n💕 Sevgilə, Təhmaz\n📅 ${new Date().toLocaleDateString('az-AZ')}`;
    const base64Content = Buffer.from(fullContent).toString('base64');
    const path = `letters/${title.replace(/\s+/g, '_')}_${Date.now()}.txt`;

    try {
        const success = await githubUpload(path, base64Content, `✉️ Bot: ${title} məktubu`);
        if (success) {
            bot.sendMessage(chatId, `✅ Məktub uğurla yükləndi!\n📌 Başlıq: ${title}`);
        } else {
            bot.sendMessage(chatId, '❌ GitHub xətası.');
        }
    } catch (error) {
        console.error('Məktub xətası:', error);
        bot.sendMessage(chatId, '❌ Məktub yüklənərkən xəta baş verdi.');
    }
});

// ─────────────────────────────────────────────────────────────
// STATİSTİKA
// ─────────────────────────────────────────────────────────────
bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📊 Statistika toplanır...');

    try {
        // Cloudinary şəkil sayı
        const cloudinaryRes = await axios.get(`https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/list/dunyamiz_gallery.json`);
        const photoCount = cloudinaryRes.data.resources.length;

        // GitHub Musiqi və Məktub sayı
        const musicFiles = await githubList('music');
        const songCount = musicFiles.filter(f => /\.(mp3|wav|ogg|m4a)$/i.test(f.name)).length;

        const letterFiles = await githubList('letters');
        const letterCount = letterFiles.filter(f => /\.(txt|md)$/i.test(f.name)).length;

        const statsMsg = `
📊 *Hazırkı Statistika:*

📸 Şəkillər: *${photoCount}*
🎵 Musiqilər: *${songCount}*
✉️ Məktublar: *${letterCount}*

_Məlumatlar real vaxt rejimində yenilənir._
        `;
        bot.sendMessage(chatId, statsMsg, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Statistika xətası:', error);
        bot.sendMessage(chatId, '❌ Statistika alınarkən xəta baş verdi.');
    }
});

// ─────────────────────────────────────────────────────────────
// YARDIMÇI FUNKSİYALAR
// ─────────────────────────────────────────────────────────────

async function githubUpload(path, base64Content, message) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const response = await axios.put(url, {
            message,
            content: base64Content
        }, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return response.status === 201 || response.status === 200;
    } catch (error) {
        console.error('GitHub Upload Error:', error.response?.data || error.message);
        return false;
    }
}

async function githubList(path) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`
            }
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        return [];
    }
}
