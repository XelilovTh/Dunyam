export default async function handler(req, res) {
  const { folder } = req.query; // images, music və ya letters
  const token = process.env.GITHUB_TOKEN; // Vercel-dəki gizli token

  const owner = "XelilovTh";
  const repo = "Dunyam";

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folder}`, {
      headers: { 'Authorization': `token ${token}` }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Məlumat alınmadı" });
  }
}
