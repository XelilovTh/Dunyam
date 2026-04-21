const TelegramBot = require('node-telegram-bot-api');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// KONFİQURASİYA
const GITHUB_CONFIG = {
    owner: 'XelilovTh',
    repo: 'Dunyam',
    token: process.env.GH_TOKEN
};

const CLOUDINARY_CONFIG = {
    cloud_name: 'dojz9uzhe',
    api_key: '241982348988817',
    api_secret: process.env.CL_SECRET
};

const TELEGRAM_TOKEN = process.env.TG_TOKEN;

// Cloudinary ayarları
cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.cloud_name,
    api_key: CLOUDINARY_CONFIG.api_key,
    api_secret: CLOUDINARY_CONFIG.api_secret
});

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
            const result = await cloudinary.uploader.upload(fileLink, { folder: 'dunyamiz', tags: 'dunyamiz_gallery' });
            await bot.sendMessage(chatId, `✅ Şəkil yükləndi!`);
        } 
        
        // 2. MUSİQİ (Audio/Document)
        else if (message.audio || (message.document && /\.(mp3|wav|ogg)$/i.test(message.document.file_name))) {
            const file = message.audio || message.document;
            const fileName = file.file_name || `music_${Date.now()}.mp3`;
            const fileLink = await bot.getFileLink(file.file_id);
            const audioRes = await axios.get(fileLink, { responseType: 'arraybuffer' });
            const success = await githubUpload(`music/${fileName}`, Buffer.from(audioRes.data).toString('base64'), `🎵 Bot: ${fileName}`);
            await bot.sendMessage(chatId, success ? `✅ Musiqi yükləndi: ${fileName}` : '❌ GitHub xətası!');
        }

        // 3. KOMANDALAR (Commands)
        else if (text && text.startsWith('/')) {
            if (text.startsWith('/stats')) {
                const cRes = await axios.get(`https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/list/dunyamiz_gallery.json`);
                const songs = (await githubList('music')).length;
                const letters = (await githubList('letters')).length;
                await bot.sendMessage(chatId, `📊 *Statistika:*\n📸 Şəkillər: ${cRes.data.resources.length}\n🎵 Musiqilər: ${songs}\n✉️ Məktublar: ${letters}`, { parse_mode: 'Markdown' });
            } else {
                await bot.sendMessage(chatId, `🌟 *Dünyamız Botu*\n\n📸 Şəkil göndər -> Qalereya\n🎵 Musiqi göndər -> Pleylist\n✉️ Mətn yaz -> Məktublar\n📊 /stats -> Statistika`);
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
            await bot.sendMessage(chatId, success ? `✅ Məktub yükləndi!\n📌 Başlıq: ${title}` : '❌ Xəta baş verdi!');
        }

        res.status(200).send('OK');
    } catch (e) {
        console.error(e);
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
