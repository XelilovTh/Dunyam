const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CL_NAME || 'dojz9uzhe',
    api_key: process.env.CL_KEY || '241982348988817',
    api_secret: process.env.CL_SECRET
});

module.exports = async (req, res) => {
    // CORS Ayarları
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(200).send('Proxy is active');
    }

    const { action, ...data } = req.body || {};
    const GITHUB_OWNER = process.env.GH_OWNER || 'XelilovTh';
    const GITHUB_REPO = process.env.GH_REPO || 'Dunyam';
    const token = process.env.GH_TOKEN;

    const ghHeaders = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Dunyamiz-App'
    };

    try {
        switch (action) {
            case 'github_get':
                const getRes = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, { headers: ghHeaders });
                return res.json(getRes.data);

            case 'github_upload':
                const uploadRes = await axios.put(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, {
                    message: data.message,
                    content: data.content,
                    sha: data.sha
                }, { headers: ghHeaders });
                return res.json(uploadRes.data);

            case 'telegram_send':
                // Real IP-ni header-lərdən götürürük (Vercel/Cloudflare üçün)
                const forwarded = req.headers['x-forwarded-for'];
                const realIp = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
                const ipToUse = data.ip || realIp;

                const botToken = process.env.NOTIF_BOT_TOKEN || process.env.TG_TOKEN;
                const payload = {
                    chat_id: '6353022269',
                    text: data.text.replace(/Naməlum IP/g, ipToUse), // Text-dəki Naməlum IP-ni əvəz edirik
                    parse_mode: 'HTML'
                };
                
                if (ipToUse) {
                    payload.reply_markup = { 
                        inline_keyboard: [[
                            { text: "🚫 Blokla", callback_data: `block_${ipToUse}` },
                            { text: "✅ Blokdan çıxar", callback_data: `unblock_${ipToUse}` }
                        ]] 
                    };
                }
                const tgRes = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, payload);
                return res.json(tgRes.data);

            case 'check_password':
                return res.json({ success: data.password === process.env.ADMIN_PASSWORD });

            case 'github_list':
                const listRes = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, { headers: ghHeaders });
                return res.json(listRes.data);

            case 'cloudinary_delete':
                const cloudConfig = {
                    cloud_name: data.cloud_name || process.env.CL_NAME,
                    api_key: data.api_key || process.env.CL_KEY,
                    api_secret: (data.cloud_name === process.env.CL_MUSIC_NAME && process.env.CL_MUSIC_SECRET) ? process.env.CL_MUSIC_SECRET : process.env.CL_SECRET
                };
                const result = await cloudinary.uploader.destroy(data.public_id, { resource_type: data.resource_type || 'image', ...cloudConfig });
                return res.json(result);

            default:
                return res.status(400).json({ error: 'Yanlış əməliyyat' });
        }
    } catch (error) {
        console.error('Proxy Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
};
