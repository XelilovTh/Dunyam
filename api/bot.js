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
const bot = new TelegramBot(TELEGRAM_TOKEN);

// VERCEL HANDLER
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(200).send('Bot is running stable...');
    }

    const { message } = req.body;
    if (!message) return res.status(200).send('No message');

    const chatId = message.chat.id;
    const text = message.text;

    try {
        // 1. ŞƏKİL (Photo)
        if (message.photo) {
            const photo = message.photo[message.photo.length - 1];
            const fileLink = await bot.getFileLink(photo.file_id);
            
            // Cloudinary konfiqurasiyası (Şəkil üçün)
            cloudinary.config({
                cloud_name: CLOUDINARY_CONFIG.cloud_name,
                api_key: CLOUDINARY_CONFIG.api_key,
                api_secret: CLOUDINARY_CONFIG.api_secret
            });

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

            await bot.sendMessage(chatId, success ? `✅ Şəkil yükləndi və sayta əlavə edildi!` : '❌ Şəkil yükləndi, amma JSON siyahısı yenilənmədi.');
        } 
        
        // 2. MUSİQİ (Audio/Document)
        else if (message.audio || (message.document && /\.(mp3|wav|ogg|m4a|flac)$/i.test(message.document.file_name))) {
            const file = message.audio || message.document;
            const fileName = file.file_name || `music_${Date.now()}.mp3`;
            const fileLink = await bot.getFileLink(file.file_id);
            
            // Musiqi üçün Cloudinary konfiqurasiyasını dəyişirik
            cloudinary.config({
                cloud_name: CLOUDINARY_MUSIC_CONFIG.cloud_name,
                api_key: CLOUDINARY_MUSIC_CONFIG.api_key,
                api_secret: CLOUDINARY_MUSIC_CONFIG.api_secret
            });

            // Faylı əvvəlcə bufferə yükləyirik (daha etibarlıdır)
            const audioRes = await axios.get(fileLink, { responseType: 'arraybuffer' });
            const base64Audio = `data:${file.mime_type || 'audio/mpeg'};base64,${Buffer.from(audioRes.data).toString('base64')}`;

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

            await bot.sendMessage(chatId, success ? `✅ Musiqi yükləndi: ${fileName}` : '❌ Musiqi yükləndi, amma JSON yenilənmə xətası!');
        }

        // 3. KOMANDALAR (Commands)
        else if (text && text.startsWith('/')) {
            if (text.startsWith('/stats')) {
                // Şəkil sayını hesabla (Cloudinary-dən və ya JSON-dan)
                let photoCount = 0;
                try {
                    const pContent = await githubGetFile('photos_list.json');
                    photoCount = JSON.parse(pContent).length;
                } catch(e) {}

                const songs = (await githubList('music')).length;
                const letters = (await githubList('letters')).length;
                await bot.sendMessage(chatId, `📊 *Statistika:*\n📸 Şəkillər: ${photoCount}\n🎵 Musiqilər: ${songs}\n✉️ Məktublar: ${letters}`, { parse_mode: 'Markdown' });
            } else {
                await bot.sendMessage(chatId, `🌟 *Dünyamız Botu* (v2.1)\n\n📸 Şəkil göndər -> Qalereya\n🎵 Musiqi göndər -> Pleylist\n✉️ Mətn yaz -> Məktublar\n📊 /stats -> Statistika\n\n_Versiya: 2.1 (Vercel)_`);
            }
        }

        // 4. ADİ MƏTN (Məktub kimi qəbul et)
        else if (text) {
            const words = text.trim().split(/\s+/);
            let title, content;

            if (words.length > 1) {
                title = words[0]; // İlk söz başlıq
                content = words.slice(1).join(' '); // Qalanı mətn
            } else {
                title = "Məktub"; // Tək sözdürsə
                content = text;
            }

            const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.txt`;
            const fullContent = `${content}\n\n---\n💕 Sevgilə, Təhmaz\n📅 ${new Date().toLocaleDateString('az-AZ')}`;
            
            const success = await githubUpload(`letters/${fileName}`, Buffer.from(fullContent).toString('base64'), `✉️ Bot: ${title}`);
            await bot.sendMessage(chatId, success ? `✅ Məktub yükləndi!\n📌 Başlıq: ${title}` : '❌ GitHub xətası!');
        }

        res.status(200).send('OK');
    } catch (e) {
        console.error('Bot Error:', e);
        // Xəta mesajını bota göndərək ki, istifadəçi bilsin nə baş verir
        try {
            await bot.sendMessage(chatId, `❌ Xəta baş verdi: ${e.message}`);
        } catch(e2) {}
        res.status(200).send('Error but handled'); 
    }
};

async function githubUpload(path, content, message) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const res = await axios.put(url, { message, content }, { 
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` },
            timeout: 10000 
        });
        return res.status === 201 || res.status === 200;
    } catch (e) { return false; }
}

async function githubList(path) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const res = await axios.get(url, { 
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` },
            timeout: 5000 
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (e) { return []; }
}

async function githubGetFile(path) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const res = await axios.get(url, { 
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
        });
        return Buffer.from(res.data.content, 'base64').toString('utf-8');
    } catch (e) { return '[]'; }
}

async function updateJsonList(path, newItem, commitMessage) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        // 1. Faylı oxu
        let currentContent = [];
        let sha = null;
        try {
            const res = await axios.get(url, { 
                headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
            });
            sha = res.data.sha;
            currentContent = JSON.parse(Buffer.from(res.data.content, 'base64').toString('utf-8'));
            if (!Array.isArray(currentContent)) currentContent = [];
        } catch (e) {
            console.log(`File ${path} not found or invalid, creating new list.`);
        }

        // 2. Yeni elementi əlavə et
        currentContent.push(newItem);

        // 3. Geri yüklə
        const res = await axios.put(url, {
            message: commitMessage,
            content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
            sha: sha
        }, {
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
        });
        return res.status === 200 || res.status === 201;
    } catch (e) {
        console.error(`Error updating ${path}:`, e.response?.data || e.message);
        return false;
    }
}
