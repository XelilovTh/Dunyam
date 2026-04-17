const TelegramBot = require('node-telegram-bot-api');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// KONFİQURASİYA
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

// Botu başlat (Vercel üçün polling: false olmalıdır)
const bot = new TelegramBot(TELEGRAM_TOKEN);

// ─────────────────────────────────────────────────────────────
// BOT MƏNTİQİ
// ─────────────────────────────────────────────────────────────

// Start / Help
bot.onText(/\/start|\/help/, (msg) => {
    const helpText = `🌟 *Dünyamız Botu (Vercel Edition)* 🌟\n\n📸 Şəkil göndərin -> Cloudinary\n🎵 Musiqi göndərin -> GitHub\n✉️ /upload Mətn -> GitHub\n📊 /stats -> Statistika`;
    bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
});

// Photo Upload
bot.on('photo', async (msg) => {
    const photo = msg.photo[msg.photo.length - 1];
    try {
        const fileLink = await bot.getFileLink(photo.file_id);
        const result = await cloudinary.uploader.upload(fileLink, { folder: 'dunyamiz', tags: 'dunyamiz_gallery' });
        bot.sendMessage(msg.chat.id, `✅ Şəkil yükləndi: ${result.secure_url}`);
    } catch (e) { bot.sendMessage(msg.chat.id, '❌ Xəta!'); }
});

// Music Upload
bot.on('audio', async (msg) => handleMusic(msg, msg.audio));
bot.on('document', async (msg) => {
    if (/\.(mp3|wav|ogg)$/i.test(msg.document.file_name)) handleMusic(msg, msg.document);
});

async function handleMusic(msg, file) {
    const fileName = file.file_name || `music_${Date.now()}.mp3`;
    try {
        const fileLink = await bot.getFileLink(file.file_id);
        const res = await axios.get(fileLink, { responseType: 'arraybuffer' });
        const success = await githubUpload(`music/${fileName}`, Buffer.from(res.data).toString('base64'), `🎵 Bot: ${fileName}`);
        bot.sendMessage(msg.chat.id, success ? `✅ Musiqi yükləndi: ${fileName}` : '❌ Xəta!');
    } catch (e) { bot.sendMessage(msg.chat.id, '❌ Xəta!'); }
}

// Letter Upload
bot.onText(/\/upload (.+)/, async (msg, match) => {
    const input = match[1];
    let title = input.includes(':') ? input.split(':')[0].trim() : `Məktub_${Date.now()}`;
    let content = input.includes(':') ? input.split(':').slice(1).join(':').trim() : input.trim();
    
    const fullContent = `${content}\n\n---\n💕 Sevgilə, Təhmaz\n📅 ${new Date().toLocaleDateString('az-AZ')}`;
    const success = await githubUpload(`letters/${title}_${Date.now()}.txt`, Buffer.from(fullContent).toString('base64'), `✉️ Bot: ${title}`);
    bot.sendMessage(msg.chat.id, success ? `✅ Məktub yükləndi: ${title}` : '❌ Xəta!');
});

// Stats
bot.onText(/\/stats/, async (msg) => {
    try {
        const cRes = await axios.get(`https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/list/dunyamiz_gallery.json`);
        const photos = cRes.data.resources.length;
        const songs = (await githubList('music')).length;
        const letters = (await githubList('letters')).length;
        bot.sendMessage(msg.chat.id, `📊 *Statistika:*\n📸 Şəkillər: ${photos}\n🎵 Musiqilər: ${songs}\n✉️ Məktublar: ${letters}`, { parse_mode: 'Markdown' });
    } catch (e) { bot.sendMessage(msg.chat.id, '❌ Statistika alınmadı.'); }
});

// Helper Functions
async function githubUpload(path, content, message) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const res = await axios.put(url, { message, content }, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });
        return res.status === 201 || res.status === 200;
    } catch (e) { return false; }
}

async function githubList(path) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    try {
        const res = await axios.get(url, { headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` } });
        return Array.isArray(res.data) ? res.data : [];
    } catch (e) { return []; }
}

// VERCEL HANDLER
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await bot.processUpdate(req.body);
            res.status(200).send('OK');
        } catch (e) { res.status(500).send('Error'); }
    } else {
        res.status(200).send('Bot is running...');
    }
};
