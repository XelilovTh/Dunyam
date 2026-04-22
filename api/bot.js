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

// VERCEL HANDLER
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(200).send('Bot is running stable...');
    }

    const body = req.body;
    
    // 1. CALLBACK QUERY (Düymə klikləri)
    if (body.callback_query) {
        const callbackQuery = body.callback_query;
        const data = callbackQuery.data;
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;

        // Müvafiq bot obyektini yarat (Bildiriş botu üçün də işləsin)
        const bot = new TelegramBot(process.env.NOTIF_BOT_TOKEN || process.env.TG_TOKEN);

        if (data.startsWith('block_')) {
            const ipToBlock = data.replace('block_', '');
            const success = await blockIp(ipToBlock);
            
            if (success) {
                await bot.answerCallbackQuery(callbackQuery.id, { text: "IP uğurla bloklandı!" });
                await bot.editMessageText(callbackQuery.message.text + `\n\n🚫 <b>BU IP BLOKLANDI</b>`, {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'HTML'
                });
            } else {
                await bot.answerCallbackQuery(callbackQuery.id, { text: "Xəta baş verdi!", show_alert: true });
            }
        } else if (data.startsWith('unblock_')) {
            const ipToUnblock = data.replace('unblock_', '');
            const success = await unblockIp(ipToUnblock);
            
            if (success) {
                await bot.answerCallbackQuery(callbackQuery.id, { text: "IP blokdan çıxarıldı!" });
                await bot.editMessageText(callbackQuery.message.text.replace(/🚫 <b>BU IP BLOKLANDI<\/b>/g, '') + `\n\n✅ <b>BU IP BLOKDAN ÇIXARILDI</b>`, {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'HTML'
                });
            } else {
                await bot.answerCallbackQuery(callbackQuery.id, { text: "Xəta baş verdi!", show_alert: true });
            }
        }
        return res.status(200).send('OK');
    }

    // 2. ADİ MESAJLAR
    const { message } = body;
    if (!message) return res.status(200).send('No message');

    const chatId = message.chat.id;
    const text = message.text;
    const bot = new TelegramBot(process.env.TG_TOKEN); // Yükləmə botu üçün əsas token

    try {
        // 1. ŞƏKİL (Photo)
        if (message.photo) {
            const photo = message.photo[message.photo.length - 1];
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
            
            cloudinary.config({
                cloud_name: CLOUDINARY_MUSIC_CONFIG.cloud_name,
                api_key: CLOUDINARY_MUSIC_CONFIG.api_key,
                api_secret: CLOUDINARY_MUSIC_CONFIG.api_secret
            });

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
                let photoCount = 0;
                try {
                    const pContent = await githubGetFile('photos_list.json');
                    photoCount = JSON.parse(pContent).length;
                } catch(e) {}

                const songsRes = await githubList('music');
                const lettersRes = await githubList('letters');
                await bot.sendMessage(chatId, `📊 *Statistika:*\n📸 Şəkillər: ${photoCount}\n🎵 Musiqilər: ${songsRes.length}\n✉️ Məktublar: ${lettersRes.length}`, { parse_mode: 'Markdown' });
            } else {
                await bot.sendMessage(chatId, `🌟 *Dünyamız Botu* (v2.2)\n\n📸 Şəkil göndər -> Qalereya\n🎵 Musiqi göndər -> Pleylist\n✉️ Mətn yaz -> Məktublar\n📊 /stats -> Statistika`);
            }
        }

        // 4. ADİ MƏTN (Məktub)
        else if (text) {
            const words = text.trim().split(/\s+/);
            let title = words.length > 1 ? words[0] : "Məktub";
            let content = words.length > 1 ? words.slice(1).join(' ') : text;

            const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.txt`;
            const fullContent = `${content}\n\n---\n💕 Sevgilə, Təhmaz\n📅 ${new Date().toLocaleDateString('az-AZ')}`;
            
            const success = await githubUpload(`letters/${fileName}`, Buffer.from(fullContent).toString('base64'), `✉️ Bot: ${title}`);
            await bot.sendMessage(chatId, success ? `✅ Məktub yükləndi!\n📌 Başlıq: ${title}` : '❌ GitHub xətası!');
        }

        res.status(200).send('OK');
    } catch (e) {
        console.error('Bot Error:', e);
        try { await bot.sendMessage(chatId, `❌ Xəta baş verdi: ${e.message}`); } catch(e2) {}
        res.status(200).send('Error but handled'); 
    }
};

async function blockIp(ip) {
    try {
        const path = 'blocked_ips.json';
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
        
        let blockedIps = [];
        let sha = null;

        try {
            const res = await axios.get(url, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });
            sha = res.data.sha;
            blockedIps = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
        } catch (e) {
            console.log("Creating new blocked_ips.json");
        }

        if (!Array.isArray(blockedIps)) blockedIps = [];
        if (!blockedIps.includes(ip)) {
            blockedIps.push(ip);
        } else {
            return true; // Already blocked
        }

        const putRes = await axios.put(url, {
            message: `🚫 Admin: ${ip} bloklandı`,
            content: Buffer.from(JSON.stringify(blockedIps, null, 2)).toString('base64'),
            sha: sha
        }, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });

        return putRes.status === 200 || putRes.status === 201;
    } catch (e) {
        console.error('Block IP error:', e);
        return false;
    }
}

async function unblockIp(ip) {
    try {
        const path = 'blocked_ips.json';
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
        
        let blockedIps = [];
        let sha = null;

        try {
            const res = await axios.get(url, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });
            sha = res.data.sha;
            blockedIps = JSON.parse(Buffer.from(res.data.content, 'base64').toString());
        } catch (e) {
            return true; // Blok siyahısı yoxdur, deməli onsuz da blokda deyil
        }

        if (!Array.isArray(blockedIps)) return true;
        if (blockedIps.includes(ip)) {
            blockedIps = blockedIps.filter(item => item !== ip);
        } else {
            return true; // Siyahıda yoxdur
        }

        const putRes = await axios.put(url, {
            message: `✅ Admin: ${ip} blokdan çıxarıldı`,
            content: Buffer.from(JSON.stringify(blockedIps, null, 2)).toString('base64'),
            sha: sha
        }, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });

        return putRes.status === 200 || putRes.status === 201;
    } catch (e) {
        console.error('Unblock IP error:', e);
        return false;
    }
}

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
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (e) { return []; }
}

async function githubGetFile(path) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const res = await axios.get(url, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });
        return Buffer.from(res.data.content, 'base64').toString('utf-8');
    } catch (e) { return '[]'; }
}

async function updateJsonList(path, newItem, commitMessage) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        let currentContent = [];
        let sha = null;
        try {
            const res = await axios.get(url, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });
            sha = res.data.sha;
            currentContent = JSON.parse(Buffer.from(res.data.content, 'base64').toString('utf-8'));
            if (!Array.isArray(currentContent)) currentContent = [];
        } catch (e) {}

        currentContent.push(newItem);

        const res = await axios.put(url, {
            message: commitMessage,
            content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
            sha: sha
        }, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });
        return res.status === 200 || res.status === 201;
    } catch (e) { return false; }
}
