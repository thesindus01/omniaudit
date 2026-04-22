import axios from 'axios';
import * as cheerio from 'cheerio';

export const maxDuration = 60; 

export default async function handler(req, res) {
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
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GEMINI_API_KEY) {
     return res.status(500).json({ error: "Gemini API Key missing in environment variables" });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    console.log(`Scraping Domain: ${url}`);
    let textContent = "";
    try {
      const response = await axios.get(url, { headers: { 'User-Agent': 'api/agent' }});
      const $ = cheerio.load(response.data);
      $('script, style, nav, footer, noscript, img').remove();
      textContent = $('body').text().replace(/\s+/g, ' ').substring(0, 15000); 
    } catch (e) {
      console.error("Scraping error:", e.message);
      textContent = "Could not scrape the site directly. Please infer heavily based on the domain name: " + url + " and common patterns for this industry.";
    }

    // Return the scraped text AND the API key to the frontend so the browser can run the heavy 60s AI task
    res.status(200).json({ 
      text: textContent,
      key: process.env.GEMINI_API_KEY
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
