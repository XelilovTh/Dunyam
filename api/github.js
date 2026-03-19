export default async function handler(req, res) {
    const { folder } = req.query;
    const token = process.env.GITHUB_TOKEN;

    try {
        const response = await fetch(`https://api.github.com/repos/XelilovTh/Dunyam/contents/${folder}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
