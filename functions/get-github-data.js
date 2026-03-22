const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// netlify/functions/get-github-data.js
const fetch = require('node-fetch'); // Əgər node mühitində fetch yoxdursa lazımdır

exports.handler = async function(event, context) {
  // Tokeni Netlify mühit dəyişənlərindən götürürük
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch('https://api.github.com/repos/XelilovTh/Dunyam/contents/data', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Məlumat alınarkən xəta baş verdi' }),
    };
  }
};
