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
        return res.status(405).json({ error: 'Yalnız POST sorğuları qəbul edilir' });
    }

    const { action, ...data } = req.body;

    const GITHUB_OWNER = process.env.GH_OWNER || 'XelilovTh';
    const GITHUB_REPO = process.env.GH_REPO || 'Dunyam';

    // 1. IP BLOKLAMA YOXLAMASI
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    try {
        const blockedRes = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blocked_ips.json`, {
            headers: { 'Authorization': `Bearer ${process.env.GH_TOKEN}` }
        }).catch(() => null);

        if (blockedRes) {
            const blockedIps = JSON.parse(Buffer.from(blockedRes.data.content, 'base64').toString());
            if (Array.isArray(blockedIps) && blockedIps.includes(visitorIp)) {
                return res.status(403).json({ error: 'Giriş qadağandır.' });
            }
        }
    } catch (e) {
        console.error('IP check error:', e);
    }

    // YOXLAMA (DEBUG) ƏMƏLİYYATI
    if (action === 'debug_check') {
        return res.json({
            gh_token_exists: !!process.env.GH_TOKEN,
            cl_secret_exists: !!process.env.CL_SECRET,
            notif_bot_token_exists: !!process.env.NOTIF_BOT_TOKEN,
            visitor_ip: visitorIp,
            status: "Proxy is alive and ready!"
        });
    }

    const token = process.env.GH_TOKEN;
    if (!token && action.startsWith('github')) {
        return res.status(500).json({ error: 'Serverdə GH_TOKEN tapılmadı!' });
    }

    const ghHeaders = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Dunyamiz-App'
    };

    try {
        switch (action) {
            case 'github_get':
                try {
                    const getRes = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, {
                        headers: ghHeaders
                    });
                    return res.json(getRes.data);
                } catch (err) {
                    if (err.response && err.response.status === 404) {
                        return res.json({ content: '', encoding: 'base64', sha: null });
                    }
                    throw err;
                }

            case 'github_upload':
                const uploadRes = await axios.put(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, {
                    message: data.message,
                    content: data.content,
                    sha: data.sha
                }, {
                    headers: ghHeaders
                });
                return res.json(uploadRes.data);

            case 'github_list':
                try {
                    const listRes = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, {
                        headers: ghHeaders
                    });
                    return res.json(listRes.data);
                } catch (err) {
                    if (err.response && err.response.status === 404) return res.json([]);
                    throw err;
                }

            case 'github_delete':
                const delRes = await axios.delete(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, {
                    headers: ghHeaders,
                    data: { message: data.message, sha: data.sha }
                });
                return res.json(delRes.data);

            case 'telegram_send':
                const botToken = process.env.NOTIF_BOT_TOKEN || process.env.TG_TOKEN;
                if (!botToken) return res.status(500).json({ error: 'Bildiriş bot tokeni tapılmadı' });
                
                const payload = {
                    chat_id: '635302226',
                    text: data.text,
                    parse_mode: 'HTML'
                };

                if (data.ip) {
                    payload.reply_markup = {
                        inline_keyboard: [[
                            { text: "🚫 Bu IP-ni Blokla", callback_data: `block_${data.ip}` }
                        ]]
                    };
                }

                const tgRes = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, payload);
                return res.json(tgRes.data);

            case 'check_password':
                return res.json({ success: data.password === process.env.ADMIN_PASSWORD });

            case 'cloudinary_delete':
                if (!process.env.CL_SECRET) return res.status(500).json({ error: 'CL_SECRET tapılmadı' });
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
        const status = error.response ? error.response.status : 500;
        console.error('Proxy Error:', error.response?.data || error.message);
        return res.status(status).json(error.response?.data || { error: error.message });
    }
};
