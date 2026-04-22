require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// KONFİQURASİYA
const GITHUB_CONFIG = {
    owner: process.env.GH_OWNER || 'XelilovTh',
    repo: process.env.GH_REPO || 'Dunyam',
    token: process.env.GH_TOKEN
};

const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CL_NAME || 'dojz9uzhe',
    api_key: process.env.CL_KEY || '241982348988817',
    api_secret: process.env.CL_SECRET
};

const CLOUDINARY_MUSIC_CONFIG = {
    cloud_name: process.env.CL_MUSIC_NAME || 'drlzwhblg',
    api_key: process.env.CL_MUSIC_KEY || '583362931417988',
    api_secret: process.env.CL_MUSIC_SECRET
};

const TELEGRAM_TOKEN = process.env.TG_TOKEN;

// Botu başlat
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log('🤖 Bot işə düşdü...');

// ─────────────────────────────────────────────────────────────
// KÖMƏK VƏ START
// ─────────────────────────────────────────────────────────────
bot.onText(/\/start|\/help/, (msg) => {
    const helpText = `
🌟 *Dünyamız Botuna Xoş Gəlmisiniz!* 🌟 (v2.1)

Bu bot vasitəsilə sayta asanlıqla məzmun əlavə edə bilərsiniz:

📸 *Şəkil yükləmə:* Sadəcə bota şəkil göndərin.
🎵 *Musiqi yükləmə:* Musiqi faylı (MP3, WAV, OGG) göndərin.
✉️ *Məktub yazma:* 
   \`/upload Mətn\` (Avtomatik başlıqla)
   \`/upload Başlıq: Mətn\` (Xüsusi başlıqla)
📊 *Statistika:* \`/stats\` yazaraq saydakı sayları görün.

_Versiya: 2.1 (Cloudinary Music Support)_
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
        
        cloudinary.config({
            cloud_name: CLOUDINARY_CONFIG.cloud_name,
            api_key: CLOUDINARY_CONFIG.api_key,
            api_secret: CLOUDINARY_CONFIG.api_secret
        });

        const result = await cloudinary.uploader.upload(fileLink, {
            folder: 'dunyamiz',
            tags: 'dunyamiz_gallery'
        });

        // Add to photos_list.json so the website can see it
        const newPhoto = {
            name: `photo_${Date.now()}.jpg`,
            public_id: result.public_id,
            download_url: result.secure_url,
            created_at: new Date().toISOString()
        };
        const success = await updateJsonList('photos_list.json', newPhoto, '📸 Bot: Yeni şəkil əlavə edildi');
        
        if (success) {
            bot.sendMessage(chatId, `✅ Şəkil uğurla yükləndi və sayta əlavə edildi!\n🔗 Link: ${result.secure_url}`);
        } else {
            bot.sendMessage(chatId, `⚠️ Şəkil yükləndi, amma sayt siyahısına əlavə edilərkən xəta baş verdi.`);
        }
        
    } catch (error) {
        console.error('Cloudinary xətası:', error);
        bot.sendMessage(chatId, `❌ Şəkil yüklənərkən xəta baş verdi: ${error.message}`);
    }
});

// ─────────────────────────────────────────────────────────────
// MUSİQİ YÜKLƏMƏ (Cloudinary Music)
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
    
    bot.sendMessage(chatId, `⏳ "${fileName}" Cloudinary-ə yüklənir...`);

    try {
        const fileLink = await bot.getFileLink(file.file_id);
        
        cloudinary.config({
            cloud_name: CLOUDINARY_MUSIC_CONFIG.cloud_name,
            api_key: CLOUDINARY_MUSIC_CONFIG.api_key,
            api_secret: CLOUDINARY_MUSIC_CONFIG.api_secret
        });

        // Buffer ilə yükləmə (URL-dən daha etibarlıdır)
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
        const success = await updateJsonList('music_list.json', newMusic, `🎵 Bot: ${fileName} siyahıya əlavə edildi`);

        if (success) {
            bot.sendMessage(chatId, `✅ Musiqi uğurla yükləndi!\n🔗 Link: ${result.secure_url}`);
        } else {
            bot.sendMessage(chatId, '❌ Musiqi yükləndi, amma JSON siyahısı yenilənərkən xəta baş verdi.');
        }
    } catch (error) {
        console.error('Cloudinary Musiqi xətası:', error);
        bot.sendMessage(chatId, `❌ Musiqi yüklənərkən xəta baş verdi!\nSəbəb: ${error.message || 'Naməlum xəta'}`);
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
        let photoCount = 0;
        try {
            const pRes = await githubGet('photos_list.json');
            const pContent = Buffer.from(pRes.content, 'base64').toString('utf-8');
            photoCount = JSON.parse(pContent).length;
        } catch(e) {}

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

async function githubGet(path) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}

async function updateJsonList(path, newItem, commitMessage) {
    try {
        const fileData = await githubGet(path);
        let list = [];
        let sha = undefined;
        
        if (fileData) {
            sha = fileData.sha;
            const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
            try {
                list = JSON.parse(decodedContent);
                if (!Array.isArray(list)) list = [];
            } catch (e) {
                list = [];
            }
        }
        
        list.push(newItem);
        
        const newContentBase64 = Buffer.from(JSON.stringify(list, null, 2), 'utf-8').toString('base64');
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
        
        const payload = {
            message: commitMessage,
            content: newContentBase64
        };
        if (sha) payload.sha = sha;
        
        const response = await axios.put(url, payload, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return response.status === 200 || response.status === 201;
    } catch (error) {
        console.error(`Error updating ${path}:`, error.response?.data || error.message);
        return false;
    }
}
