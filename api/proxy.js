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

    // YOXLAMA (DEBUG) ƏMƏLİYYATI
    if (action === 'debug_check') {
        return res.json({
            gh_token_exists: !!process.env.GH_TOKEN,
            cl_secret_exists: !!process.env.CL_SECRET,
            cl_music_secret_exists: !!process.env.CL_MUSIC_SECRET,
            tg_token_exists: !!process.env.TG_TOKEN,
            gh_owner: GITHUB_OWNER,
            gh_repo: GITHUB_REPO,
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

            case 'cloudinary_delete':
                if (!process.env.CL_SECRET) return res.status(500).json({ error: 'CL_SECRET tapılmadı' });
                
                // Dinamik bulud tənzimləmələri
                const cloudConfig = {
                    cloud_name: data.cloud_name || process.env.CL_NAME || 'dojz9uzhe',
                    api_key: data.api_key || process.env.CL_KEY || '241982348988817',
                    api_secret: (data.cloud_name === (process.env.CL_MUSIC_NAME || 'drlzwhblg') && process.env.CL_MUSIC_SECRET) 
                                ? process.env.CL_MUSIC_SECRET 
                                : process.env.CL_SECRET
                };

                const deleteOptions = {
                    resource_type: data.resource_type || 'image',
                    ...cloudConfig
                };

                const result = await cloudinary.uploader.destroy(data.public_id, deleteOptions);
                return res.json(result);

            case 'telegram_send':
                if (!process.env.TG_TOKEN) return res.status(500).json({ error: 'TG_TOKEN tapılmadı' });
                const tgRes = await axios.post(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
                    chat_id: '635302226',
                    text: data.text
                });
                return res.json(tgRes.data);

            case 'check_password':
                return res.json({ success: data.password === process.env.ADMIN_PASSWORD });

            case 'github_delete':
                const deleteRes = await axios.delete(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${data.path}`, {
                    headers: ghHeaders,
                    data: {
                        message: data.message,
                        sha: data.sha
                    }
                });
                return res.json(deleteRes.data);

            default:
                return res.status(400).json({ error: 'Yanlış əməliyyat' });
        }
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const errorData = error.response ? error.response.data : { error: error.message };
        console.error('Proxy Error:', errorData);
        return res.status(status).json(errorData);
    }
};
