import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { skillsData } from './skillsData.js';

export const maxDuration = 60; // Increase Vercel timeout to 60 seconds for heavy AI generation
export default async function handler(req, res) {
  // CORS configuration for Vercel
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

  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
  
  if (!genAI) {
     return res.status(500).json({ error: "Gemini API Key missing in environment variables" });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    console.log(`Analyzing Domain: ${url}`);
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

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `You are a suite of 15 advanced AI Agents analyzing this scraped URL text:
    ---
    ${textContent}
    ---
    
    CRITICAL INSTRUCTION: You MUST strictly base your analysis, findings, and quickWins on the detailed methodologies, templates, and frameworks provided in these Skill Manuals below:
    
    ${Object.entries(skillsData).map(([name, content]) => `=== SKILL MANUAL: ${name} ===\n${content}\n`).join('\n')}
    
    RETURN ONLY PURE JSON. Do not return markdown blocks like "\`\`\`json".
    You must return EXACTLY this JSON structure containing ALL 15 keys below. Replace the example values with your actual detailed, management-level analysis based on the live data scraped above AND the methodologies defined in the Skill Manuals. Each agent MUST provide deep, professional insights:
    {
      "audit": { "score": 85, "dimensions": [{ "name": "Strategic Alignment", "score": 85, "status": "good" }], "findings": ["..."], "quickWins": ["..."] },
      "brand": { "score": 75, "dimensions": [{ "name": "Brand Consistency", "score": 75, "status": "warning" }], "findings": ["..."], "quickWins": ["..."] },
      "copy": { "score": 90, "dimensions": [{ "name": "Messaging Clarity", "score": 90, "status": "good" }], "findings": ["..."], "quickWins": ["..."] },
      "emails": { "score": 50, "dimensions": [{ "name": "Lead Nurture", "score": 50, "status": "warning" }], "findings": ["..."], "quickWins": ["..."] },
      "social": { "score": 80, "dimensions": [{ "name": "Platform Presence", "score": 80, "status": "good" }], "findings": ["..."], "quickWins": ["..."] },
      "ads": { "score": 40, "dimensions": [{ "name": "Ad Spend ROI", "score": 40, "status": "error" }], "findings": ["..."], "quickWins": ["..."] },
      "funnel": { "score": 70, "dimensions": [{ "name": "Conversion Rate", "score": 70, "status": "warning" }], "findings": ["..."], "quickWins": ["..."] },
      "competitors": { "score": 85, "dimensions": [{ "name": "Market Share", "score": 85, "status": "good" }], "findings": ["..."], "quickWins": ["..."] },
      "landing": { "score": 60, "dimensions": [{ "name": "UX/UI", "score": 60, "status": "warning" }], "findings": ["..."], "quickWins": ["..."] },
      "launch": { "score": 55, "dimensions": [{ "name": "Go-to-Market", "score": 55, "status": "warning" }], "findings": ["..."], "quickWins": ["..."] },
      "proposal": { "score": 80, "dimensions": [{ "name": "Offer Appeal", "score": 80, "status": "good" }], "findings": ["..."], "quickWins": ["..."] },
      "seo": { "score": 45, "dimensions": [{ "name": "Technical SEO", "score": 45, "status": "error" }], "findings": ["..."], "quickWins": ["..."] },
      "reputation": { "score": 95, "dimensions": [{ "name": "Review Sentiment", "score": 95, "status": "good" }], "findings": ["..."], "quickWins": ["..."] },
      "sales": { "score": 85, "dimensions": [{ "name": "Lead Qualification", "score": 85, "status": "good" }], "findings": ["..."], "quickWins": ["..."] },
      "legal": { "score": 30, "dimensions": [{ "name": "GDPR Compliance", "score": 30, "status": "error" }], "findings": ["..."], "quickWins": ["..."] }
    }
    Rules:
    - Score must be an integer between 0 and 100.
    - Status must be exactly one of: "good", "warning", "error".
    - Provide exactly 3 dimensions per category.
    - CRITICAL: Provide exactly 3 findings and 3 quickWins per category. DO NOT use short bullet points. Every single finding and quickWin MUST be a highly detailed, 3-to-4 sentence paragraph. You MUST explicitly apply the specific frameworks, scoring rubrics, copy formulas, ad variations, or email sequence templates defined in the Skill Manuals for that specific agent. The user expects to see the actual deep output (like actual headline variations, actual ad copy, actual email subjects) directly inside the findings and quickWins text.

    const result = await model.generateContent(prompt);
    let outputText = result.response.text();
    
    // Clean up potential markdown formatting
    outputText = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(outputText);
    
    console.log(`Successfully generated JSON for ${url}`);
    res.status(200).json(parsedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
