const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
    cloud_name: 'dojz9uzhe',
    api_key: '241982348988817',
    api_secret: process.env.CL_SECRET
});

module.exports = async (req, res) => {
    // Enable CORS
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
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, ...data } = req.body;

    try {
        switch (action) {
            case 'github_get':
                const getRes = await axios.get(`https://api.github.com/repos/XelilovTh/Dunyam/contents/${data.path}`, {
                    headers: { 
                        'Authorization': `token ${process.env.GH_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                return res.json(getRes.data);

            case 'github_upload':
                const uploadRes = await axios.put(`https://api.github.com/repos/XelilovTh/Dunyam/contents/${data.path}`, {
                    message: data.message,
                    content: data.content,
                    sha: data.sha
                }, {
                    headers: { 
                        'Authorization': `token ${process.env.GH_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                return res.json(uploadRes.data);

            case 'github_list':
                const listRes = await axios.get(`https://api.github.com/repos/XelilovTh/Dunyam/contents/${data.path}`, {
                    headers: { 
                        'Authorization': `token ${process.env.GH_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                return res.json(listRes.data);

            case 'cloudinary_delete':
                const result = await cloudinary.uploader.destroy(data.public_id);
                return res.json(result);

            case 'telegram_send':
                const tgRes = await axios.post(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
                    chat_id: '635302226',
                    text: data.text
                });
                return res.json(tgRes.data);

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Proxy Error:', error.response ? error.response.data : error.message);
        return res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { error: error.message });
    }
};
