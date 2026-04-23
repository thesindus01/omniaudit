import React, { useState, useEffect } from 'react';
import { 
  Search, Cpu, LineChart, Shield, TrendingUp, Scale, 
  Check, ArrowRight, Activity, Target, Zap, AlertTriangle, XCircle,
  Info, CheckCircle2, Download, FileText, Radar, LayoutTemplate, 
  Briefcase, Mail, Megaphone, Monitor, Users, BarChart3, Presentation, Globe
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { skillsData } from '../api/skillsData.js';

// 14 Agent Configuration matching SKILL.md files exactly
const AGENTS_CONFIG = [
  { key: 'market-audit', title: 'Market Audit', icon: <Target size={24}/>, weight: '10%', desc: 'Overall marketing health & strategy.' },
  { key: 'market-ads', title: 'Ad Campaigns', icon: <Megaphone size={24}/>, weight: '10%', desc: 'Ad structures & copy variations.' },
  { key: 'market-brand', title: 'Brand Identity', icon: <Briefcase size={24}/>, weight: '5%', desc: 'Brand positioning & consistency.' },
  { key: 'market-competitors', title: 'Competitor Intel', icon: <Radar size={24}/>, weight: '10%', desc: 'Market gaps & competitor analysis.' },
  { key: 'market-copy', title: 'Copywriting', icon: <FileText size={24}/>, weight: '10%', desc: 'Value propositions & sales copy.' },
  { key: 'market-emails', title: 'Email Sequences', icon: <Mail size={24}/>, weight: '10%', desc: 'Nurture campaigns & automation.' },
  { key: 'market-funnel', title: 'Sales Funnel', icon: <Activity size={24}/>, weight: '10%', desc: 'Conversion pathway optimization.' },
  { key: 'market-landing', title: 'Landing Pages', icon: <LayoutTemplate size={24}/>, weight: '5%', desc: 'UX/UI & conversion triggers.' },
  { key: 'market-launch', title: 'Campaign Launch', icon: <Zap size={24}/>, weight: '5%', desc: 'Go-to-market rollout plans.' },
  { key: 'market-proposal', title: 'Proposals & Offers', icon: <Presentation size={24}/>, weight: '5%', desc: 'Pricing strategy & offer framing.' },
  { key: 'market-seo', title: 'SEO Strategy', icon: <Globe size={24}/>, weight: '10%', desc: 'Search visibility & keywords.' },
  { key: 'market-social', title: 'Social Media', icon: <Users size={24}/>, weight: '5%', desc: 'Organic social growth tactics.' },
  { key: 'market-report', title: 'Master Report Strategy', icon: <BarChart3 size={24}/>, weight: '2.5%', desc: 'Executive summary & data synthesis.' },
  { key: 'market-report-pdf', title: 'PDF Layout Design', icon: <Monitor size={24}/>, weight: '2.5%', desc: 'Document structure & visual flow.' }
];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#7f1d1d', color: 'white', borderRadius: '12px', marginTop: '2rem' }}>
          <h2 className="text-2xl font-bold mb-4">Rendering Crash Detected</h2>
          <p>The AI generated invalid or incomplete data that caused the dashboard to crash.</p>
          <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button onClick={() => window.location.reload()} className="btn-primary mt-4" style={{ width: 'auto' }}>Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [scanStep, setScanStep] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setResults(null);
    setScanStep(0);
    setPdfReady(false);

    const phases = [
      "Phase 1 â€” Discovery & Live Crawling...",
      "Phase 2 â€” Launching 15 parallel Gemini audit teams...",
      "Phase 3 â€” Compiling Composite Data...",
      "Phase 4 â€” Evaluating 45+ KPI Dimensions..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < phases.length) {
        setScanStep(currentStep);
      }
    }, 2500);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const payload = await response.json();
      
      if (!response.ok) {
        clearInterval(interval);
        alert("Error scraping URL: " + (payload.error || "Unknown error"));
        setIsScanning(false);
        return;
      }

      setScanStep(2); // Start analyzing
      
      const genAI = new GoogleGenerativeAI(payload.key);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { responseMimeType: "application/json" }
      });

      const skillManualsText = Object.entries(skillsData).map(([name, content]) => "=== SKILL MANUAL: " + name + " ===\n" + content + "\n").join('\n');

      const prompt = `You are a suite of 14 advanced AI Marketing Agents analyzing this scraped URL text:
      ---
      ${payload.text}
      ---
      
      CRITICAL INSTRUCTION: You MUST strictly base your analysis on the methodologies, templates, and frameworks provided in these Skill Manuals below:
      
      ${skillManualsText}
      
      RETURN ONLY PURE JSON. Do not return markdown blocks like "\`\`\`json".
      You must return EXACTLY this JSON structure containing ALL 14 keys representing the 14 agents. 
      For each agent, you must provide 'identifiedIssues' (problems found) and 'proposedSolutions' (what needs to be done).
      NOTE: You do NOT need to generate the massive deep-dive deliverable yet. This is just Phase 1 (Scoring and Executive High-Level).
      
      {
        "market-audit": { "score": 85, "dimensions": [{ "name": "Strategic Alignment", "score": 85, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-ads": { "score": 75, "dimensions": [{ "name": "Ad Spend ROI", "score": 75, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-brand": { "score": 90, "dimensions": [{ "name": "Brand Consistency", "score": 90, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-competitors": { "score": 50, "dimensions": [{ "name": "Market Share", "score": 50, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-copy": { "score": 80, "dimensions": [{ "name": "Messaging Clarity", "score": 80, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-emails": { "score": 40, "dimensions": [{ "name": "Lead Nurture", "score": 40, "status": "error" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-funnel": { "score": 70, "dimensions": [{ "name": "Conversion Rate", "score": 70, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-landing": { "score": 85, "dimensions": [{ "name": "UX/UI", "score": 85, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-launch": { "score": 60, "dimensions": [{ "name": "Go-to-Market", "score": 60, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-proposal": { "score": 55, "dimensions": [{ "name": "Offer Appeal", "score": 55, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-seo": { "score": 80, "dimensions": [{ "name": "Technical SEO", "score": 80, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-social": { "score": 45, "dimensions": [{ "name": "Platform Presence", "score": 45, "status": "error" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-report": { "score": 90, "dimensions": [{ "name": "Data Synthesis", "score": 90, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] },
        "market-report-pdf": { "score": 85, "dimensions": [{ "name": "Visual Hierarchy", "score": 85, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."] }
      }
      Rules:
      - Score must be an integer between 0 and 100.
      - Provide exactly 3 identifiedIssues and 3 proposedSolutions per category.
      - You MUST ensure ALL strings and array items are wrapped in double quotes. Do not leave text unquoted.
      - You MUST return 100% valid, parsable JSON.`;

      const result = await model.generateContent(prompt);
      let outputText = result.response.text();
      
      // Robust extraction: Find the outermost JSON object to ignore any markdown or trailing garbage
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        outputText = jsonMatch[0];
      }
      
      const stats = JSON.parse(outputText);

      clearInterval(interval);
      setScanStep(3);

      let totalScore = 0;
      let validAgents = 0;
      
      AGENTS_CONFIG.forEach(agent => {
        if (stats[agent.key] && typeof stats[agent.key].score === 'number') {
          totalScore += stats[agent.key].score;
          validAgents++;
        }
      });

      const composite = validAgents > 0 ? Math.round(totalScore / validAgents) : 0;
      
      let grade = "F";
      if (composite >= 85) grade = "A+";
      else if (composite >= 70) grade = "A";
      else if (composite >= 55) grade = "B";
      else if (composite >= 40) grade = "C";
      else if (composite >= 25) grade = "D";

      setResults({ stats, composite, grade, url, urlText: payload.text, apiKey: payload.key });
    } catch (err) {
      clearInterval(interval);
      alert("Failed to connect to backend: " + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!results) return;
    setIsGeneratingPdf(true);

    setTimeout(() => {
      try {
        // Build the PDF from Phase 1 scoring data directly — no Deep Dive required
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const domain = results.url.replace(/https?:\/\//, '').replace(/\/$/, '');

        const gradeColor = results.grade === 'A+' || results.grade === 'A' ? '#16a34a' : results.grade === 'B' ? '#2563eb' : results.grade === 'C' ? '#d97706' : '#dc2626';

        const scoreRows = AGENTS_CONFIG.map(agent => {
          const d = results.stats?.[agent.key];
          if (!d) return '';
          const s = d.score ?? 0;
          const c = s >= 70 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';
          return `<tr><td style="font-weight:600">${agent.title}</td><td style="color:${c};font-weight:700;text-align:center">${s}/100</td><td style="text-align:center">${agent.weight}</td></tr>`;
        }).join('');

        const agentSections = AGENTS_CONFIG.map(agent => {
          const d = results.stats?.[agent.key];
          if (!d) return '';
          const s = d.score ?? 0;
          const barColor = s >= 70 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';
          const issues = (d.identifiedIssues || []).map(i => `<li>${i}</li>`).join('') || '<li>No critical issues found.</li>';
          const solutions = (d.proposedSolutions || []).map(sol => `<li>${sol}</li>`).join('') || '<li>Maintain current performance.</li>';
          const ddHtml = d.fullStrategyDeliverable
            ? `<div class="deep-dive"><h4>Deep Strategy Deliverable</h4><div class="dd-body">${d.fullStrategyDeliverable.replace(/^#{1}\s+(.+)$/gm,'<h1>$1</h1>').replace(/^#{2}\s+(.+)$/gm,'<h2>$1</h2>').replace(/^#{3}\s+(.+)$/gm,'<h3>$1</h3>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/^[-•]\s+(.+)$/gm,'<li>$1</li>').replace(/\n\n/g,'</p><p>')}</div></div>`
            : '';
          return `<div class="agent-section">
            <div class="agent-header"><span class="agent-title">${agent.title}</span><span class="agent-score" style="color:${barColor}">${s}/100</span></div>
            <div class="score-bar-bg"><div class="score-bar-fill" style="width:${s}%;background:${barColor}"></div></div>
            <div class="two-col">
              <div class="col-box issues"><div class="col-label">⚠ Identified Issues</div><ul>${issues}</ul></div>
              <div class="col-box solutions"><div class="col-label">✦ Proposed Solutions</div><ul>${solutions}</ul></div>
            </div>${ddHtml}</div>`;
        }).join('');

        const pdfHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
          *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1e293b;background:#fff;font-size:10pt;line-height:1.7}
          .cover{background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);color:#fff;padding:72pt 48pt;min-height:100vh;display:flex;flex-direction:column;justify-content:center;page-break-after:always}
          .cover-badge{display:inline-block;border:1pt solid rgba(255,255,255,.35);padding:4pt 16pt;border-radius:20pt;font-size:7pt;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.7);margin-bottom:32pt}
          .cover h1{font-size:30pt;font-weight:900;color:#fff;margin-bottom:10pt;line-height:1.15}
          .cover .domain{font-size:15pt;color:rgba(255,255,255,.8);margin-bottom:6pt;font-weight:500}
          .cover .meta{font-size:9.5pt;color:rgba(255,255,255,.5);margin-top:6pt}
          .cover-grade{display:flex;align-items:center;gap:20pt;margin-top:40pt;padding-top:28pt;border-top:1pt solid rgba(255,255,255,.15)}
          .grade-badge{font-size:48pt;font-weight:900;line-height:1}
          .grade-info h3{font-size:13pt;font-weight:700;color:#fff;margin-bottom:4pt}
          .grade-info p{font-size:9.5pt;color:rgba(255,255,255,.6)}
          .summary-page{padding:36pt 48pt;page-break-after:always}
          .page-title{font-size:18pt;font-weight:800;color:#0f172a;margin-bottom:6pt}
          .page-subtitle{font-size:10pt;color:#64748b;margin-bottom:24pt}
          table{width:100%;border-collapse:collapse;margin-bottom:20pt}
          th{background:#1e3a8a;color:#fff;padding:8pt 12pt;font-size:8pt;text-transform:uppercase;letter-spacing:.08em;text-align:left}
          td{padding:7pt 12pt;border-bottom:.5pt solid #e2e8f0;font-size:9.5pt}
          tr:nth-child(even) td{background:#f8fafc}
          .agent-section{padding:28pt 48pt;page-break-before:always;border-top:3pt solid #1e3a8a}
          .agent-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6pt}
          .agent-title{font-size:16pt;font-weight:800;color:#0f172a}
          .agent-score{font-size:18pt;font-weight:900}
          .score-bar-bg{height:7pt;background:#e2e8f0;border-radius:4pt;margin-bottom:20pt}
          .score-bar-fill{height:7pt;border-radius:4pt}
          .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16pt;margin-bottom:16pt}
          .col-box{padding:14pt;border-radius:8pt}
          .col-box.issues{background:#fff1f2;border:1pt solid #fecdd3}
          .col-box.solutions{background:#f0fdf4;border:1pt solid #bbf7d0}
          .col-label{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8pt;color:#475569}
          ul{padding-left:14pt}li{font-size:9pt;margin-bottom:5pt;color:#334155;line-height:1.5}
          .deep-dive{margin-top:16pt;background:#f8fafc;border:1pt solid #cbd5e1;border-radius:8pt;padding:16pt}
          .deep-dive h4{font-size:8pt;text-transform:uppercase;letter-spacing:.1em;color:#1e3a8a;font-weight:700;margin-bottom:10pt}
          .dd-body h1{font-size:13pt;font-weight:800;color:#1e3a8a;margin:10pt 0 5pt}
          .dd-body h2{font-size:11pt;font-weight:700;color:#1e40af;margin:8pt 0 4pt}
          .dd-body h3{font-size:10pt;font-weight:700;color:#1e40af;margin:6pt 0 3pt}
          p{font-size:9.5pt;margin-bottom:6pt;color:#334155}
          .pdf-footer{padding:16pt 48pt;border-top:1pt solid #e2e8f0;text-align:center;font-size:7.5pt;color:#94a3b8}
        </style></head><body>
          <div class="cover">
            <div class="cover-badge">Confidential Executive Report</div>
            <h1>OmniAudit Marketing Intelligence</h1>
            <p class="domain">${domain}</p>
            <p class="meta">${today} &nbsp;|&nbsp; 14 Agent Modules &nbsp;|&nbsp; AI-Generated</p>
            <div class="cover-grade">
              <div class="grade-badge" style="color:${gradeColor}">${results.grade}</div>
              <div class="grade-info">
                <h3>Composite Marketing Score: ${results.composite}/100</h3>
                <p>${results.grade === 'A+' || results.grade === 'A' ? 'Strong performance. Minor optimizations needed.' : results.grade === 'B' ? 'Average. Significant growth opportunities identified.' : 'Critical issues found. Urgent strategic action required.'}</p>
              </div>
            </div>
          </div>
          <div class="summary-page">
            <div class="page-title">Executive Score Summary</div>
            <div class="page-subtitle">All 14 marketing dimensions — scored and weighted by AI analysis.</div>
            <table><thead><tr><th>Marketing Dimension</th><th style="text-align:center">Score</th><th style="text-align:center">Weight</th></tr></thead>
            <tbody>${scoreRows}</tbody></table>
          </div>
          ${agentSections}
          <div class="pdf-footer">Generated by OmniAudit · AI-Powered Marketing Intelligence · ${today}</div>
        </body></html>`;

        const opt = {
          margin: [10,14,10,14], filename: `OMNIAUDIT-${domain.replace(/[^a-z0-9]/gi,'-')}.pdf`,
          image: { type:'jpeg', quality:0.98 },
          html2canvas: { scale:2, useCORS:true, logging:false, backgroundColor:'#ffffff', windowWidth:794 },
          jsPDF: { unit:'mm', format:'a4', orientation:'portrait' },
          pagebreak: { mode:['css','legacy'] }
        };

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-9999;opacity:0;border:none;pointer-events:none;';
        document.body.appendChild(iframe);
        const iDoc = iframe.contentDocument || iframe.contentWindow.document;
        iDoc.open(); iDoc.write(pdfHtml); iDoc.close();

        setTimeout(() => {
          html2pdf().set(opt).from(iDoc.body).save()
            .then(() => { document.body.removeChild(iframe); setIsGeneratingPdf(false); setPdfReady(true); })
            .catch(err => { console.error('PDF error:', err); if(document.body.contains(iframe)) document.body.removeChild(iframe); setIsGeneratingPdf(false); });
        }, 800);

      } catch (error) {
        console.error('PDF Gen Error:', error);
        setIsGeneratingPdf(false);
      }
    }, 300);
  };


  const getStatusIcon = (status) => {
    if (status === 'good') return <CheckCircle2 size={16} className="text-success" />;
    if (status === 'warning') return <AlertTriangle size={16} className="text-warning" />;
    return <XCircle size={16} className="text-danger" />;
  };

  const handleDeepDive = async (agentKey) => {
    if (!results || !results.urlText) return;
    
    // Set loading state for this specific agent
    setResults(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [agentKey]: { ...prev.stats[agentKey], isGeneratingDeepDive: true }
      }
    }));

    try {
      const genAI = new GoogleGenerativeAI(results.apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      const skillManual = skillsData[agentKey];
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      const prompt = `You are the ultimate ${agentKey} Marketing Agent.
      You are running a Deep Dive Strategy Execution on the following scraped website data:
      ---
      ${results.urlText}
      ---
      
      CRITICAL INSTRUCTION: You MUST execute the EXACT workflow and provide the EXACT output demanded by your Master Skill Manual below. 
      DO NOT SUMMARIZE. DO NOT SHORTEN. DO NOT OMIT ANYTHING.
      
      === YOUR MASTER SKILL MANUAL ===
      ${skillManual}
      
      === FINAL CRITICAL FORMATTING MANDATES (OVERRIDE ALL SKILL MANUAL TEMPLATES) ===
      You are an expert UI/UX Executive Copywriter producing a premium web-rendered report.
      
      RULE 0 â€” DATE: Today's date is ${today}. Use this EXACT date for any "Date:", "Analysis Date:", or "Report Date:" field. NEVER use a made-up or example date.
      
      RULE 1 â€” TITLE: Your H1 title MUST be a human-readable title like "# Email Sequence Strategy" or "# Copy Analysis Report". NEVER use a filename like "EMAIL-SEQUENCES.md" or "COPY-SUGGESTIONS.md" as the title.
      
      RULE 2 â€” NO TERMINAL OUTPUT: The Skill Manual may reference a "Terminal Output" section (with === markers). You MUST SKIP IT ENTIRELY. Do not output any === ... === terminal summary blocks. This is a web UI, not a CLI.
      
      RULE 3 â€” DATA AS CSV: You MUST NOT use space-aligned text. You MUST NOT use Markdown tables. For ANY metrics, comparisons, timelines, or multi-column data, output a CSV block like this:
      \`\`\`csv
      Framework,Recommendation
      PAS,Stop waiting for slow imports â€” precision fasteners in days
      AIDA,40 years of American precision. One supplier. Zero compromises.
      \`\`\`
      
      RULE 4 â€” EMAIL FIELDS ON SEPARATE LINES: When writing email metadata (Send, Subject Line, Subject Line B, Preview Text, CTA, Goal, Segmentation Notes), EACH field MUST be on its OWN LINE using a markdown line break. Format like this:
      **Send:** Immediate (Day 0)  
      **Subject Line:** Your headline here  
      **Preview Text:** Your preview text here  
      (Then the email body on a new paragraph)
      **CTA:** Button text  
      **Goal:** What this email achieves  
      
      RULE 5 â€” NO 4-SPACE INDENTATION: Never indent text with 4 spaces (it creates unwanted code blocks).
      
      RULE 6 â€” HIERARCHY: Use \`##\` for phases, \`###\` for subsections, \`####\` for sub-subsections. Use \`> blockquotes\` for key insights.
      
      Output ONLY raw markdown. No conversational preamble.
      `;

      const aiResult = await model.generateContent(prompt);
      let outputText = aiResult.response.text();

      // â”€â”€ Post-processing: Clean up AI output artifacts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // 1. Remove .md filename from H1 headings
      outputText = outputText.replace(/^(#{1,2}\s+)([\w-]+\.md)\s*$/gim, (match, hashes, name) => {
        const title = name
          .replace(/\.md$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        return `${hashes}${title}`;
      });

      // 2. Remove inline .md references from headings
      outputText = outputText.replace(/(#{1,6}[^\n]+?)\s+[\w-]+\.md\b/gi, '$1');

      // 3. Strip terminal output code blocks (=== markers)
      outputText = outputText.replace(/```[^\n]*\n?(?:={3,}[\s\S]*?={3,}|[\s\S]*?={3,})[\s\S]*?```/g, '');

      // 4. Strip loose === terminal lines that aren't inside code blocks
      outputText = outputText.replace(/^={3,}.*={3,}\s*$/gm, '');

      // 5. Remove orphaned "Full report saved to: XXX.md" lines
      outputText = outputText.replace(/^Full report saved to:.*\.md.*$/gmi, '');
      
      // 6. Fix wrong dates â€” replace any date that isn't today with today's date
      outputText = outputText.replace(
        /(\*{0,2}(?:Date|Analysis Date|Report Date):\*{0,2}\s*)((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})/gi,
        `$1${today}`
      );
      // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

      setResults(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [agentKey]: { 
            ...prev.stats[agentKey], 
            fullStrategyDeliverable: outputText,
            isGeneratingDeepDive: false 
          }
        }
      }));
    } catch (err) {
      console.error("Deep Dive Error:", err);
      alert("Failed to generate deep dive. Check console.");
      setResults(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [agentKey]: { ...prev.stats[agentKey], isGeneratingDeepDive: false }
        }
      }));
    }
  };

  return (
    <>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>

      <div className="app-container animate-fade-in">
        <header>
          <div className="flex items-center gap-3">
            <div className="glass flex items-center justify-center p-2 rounded-lg text-primary">
              <Radar size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient m-0">OmniAudit</h1>
              <span className="text-secondary text-sm">Powered by Gemini</span>
            </div>
          </div>
          <nav className="flex gap-4">
            <button className="glass px-4 py-2 text-sm font-medium hover:bg-glass-hover transition-colors rounded-full flex items-center gap-2">
              <Activity size={16} /> Pipeline
            </button>
          </nav>
        </header>

        {!results && !isScanning && (
          <main className="search-section animate-float">
            <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
              OmniAudit <br/> 360&deg; Business Intelligence
            </h1>
            <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Deploy 15 parallel Gemini agents to audit any business organically. 
              Get an executive composite score, detailed KPIs, and management PDFs in seconds.
            </p>

            <form onSubmit={handleSearch} className="search-input-group">
              <input 
                type="url" 
                required
                placeholder="Enter client website URL (e.g., https://example-client.com)"
                className="search-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <Search size={18} /> Audit Now
              </button>
            </form>
          </main>
        )}

        {isScanning && (
          <div className="loader-container animate-fade-in">
            <div className="spinner"></div>
            <h2 className="text-2xl font-bold text-gradient mb-2">Deploying 15 AI Agents...</h2>
            <p className="text-secondary text-lg">
              {scanStep === 0 && "Phase 1 â€” Discovery & Live Crawling..."}
              {scanStep === 1 && "Phase 2 â€” Launching 15 parallel audit teams..."}
              {scanStep === 2 && "Phase 3 â€” Calculating composite scoring..."}
              {scanStep === 3 && "Phase 4 â€” Evaluating 45+ KPI Dimensions..."}
            </p>
          </div>
        )}

        {results && (
          <ErrorBoundary>
            <div id="report-content" className="dashboard-results animate-fade-in" style={{ background: '#0f172a', padding: '2rem', borderRadius: '12px' }}>
              <div className="mb-6 flex justify-between items-center html2pdf__page-break" style={{ flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h2 className="text-2xl font-bold">Executive Audit: <span className="text-primary">{results.url}</span></h2>
                <p className="text-secondary">Comprehensive 14-dimensional analysis driven by Master Skill Methodologies</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleDownloadPdf} 
                  className="btn-primary" 
                  style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: pdfReady ? 'var(--success)' : 'var(--primary)' }}
                  disabled={isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <><div className="spinner" style={{ width: '16px', height: '16px', margin: 0, borderWidth: '2px' }}></div> Generating Executive PDF...</>
                  ) : pdfReady ? (
                    <><Check size={18} /> EXECUTIVE-REPORT.pdf Ready!</>
                  ) : (
                    <><FileText size={18} /> Generate Executive PDF</>
                  )}
                </button>
                
                <button onClick={() => setResults(null)} className="btn-outline" style={{width: 'auto', padding: '0.6rem 1.2rem'}}>
                  New Audit
                </button>
              </div>
            </div>

            <div className="grid-dashboard">
              {/* Left Column: Composite Score */}
              <div className="glass-card score-card h-full">
                <div className="score-circle">
                  <div className="score-grade">{results.grade}</div>
                </div>
                <h3 className="text-xl font-bold mb-1">Executive Composite Score</h3>
                <div className="score-number font-bold text-3xl text-gradient mb-4">{results.composite} / 100</div>
                <p className="text-secondary text-sm px-4">
                  {results.grade === 'A+' || results.grade === 'A' ? "Excellent performance. Minor fixes needed." : 
                   results.grade === 'B' ? "Average. Significant improvement opportunities." :
                   "Critical issues identified across multiple domains. Urgent action required."}
                </p>
              </div>

              {/* Right Column: Agents Grid */}
              <div className="agents-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {AGENTS_CONFIG.map(agent => {
                  const data = results.stats[agent.key];
                  if (!data) return null;
                  return (
                    <AgentCard 
                      key={agent.key}
                      title={agent.title} 
                      score={data.score} 
                      icon={agent.icon} 
                      weight={agent.weight} 
                      type={`agent-${agent.key}`}
                      desc={agent.desc}
                      onClick={() => document.getElementById(`details-${agent.key}`).scrollIntoView({ behavior: 'smooth' })}
                    />
                  )
                })}
              </div>
            </div>

            {/* Detailed KPI Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Executive Breakdown & Critical Findings</h2>
              
              <div className="flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {AGENTS_CONFIG.map(agent => {
                  const data = results.stats[agent.key];
                  if (!data) return null;
                  return (
                    <DetailedRow 
                      key={agent.key}
                      id={`details-${agent.key}`}
                      title={agent.title} 
                      score={data.score} 
                      type={`agent-${agent.key}`} 
                      icon={agent.icon}
                      dimensions={data.dimensions}
                      identifiedIssues={data.identifiedIssues || []}
                      proposedSolutions={data.proposedSolutions || []}
                      fullStrategyDeliverable={data.fullStrategyDeliverable}
                      isGeneratingDeepDive={data.isGeneratingDeepDive}
                      onDeepDive={() => handleDeepDive(agent.key)}
                      getStatusIcon={getStatusIcon}
                    />
                  )
                })}
              </div>
            </div>

            </div>
          </ErrorBoundary>
        )}

        <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '0.90rem', marginBottom: '0.5rem' }}>
            &copy; {new Date().getFullYear()} Ishaq Solutions Inc&reg;. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, maxWidth: '800px', margin: '0 auto', lineHeight: '1.4' }}>
            Disclaimer: The audit insights and proposals generated by this dashboard are powered by AI for informational and strategic purposes only. The "Legal & Compliance" analysis provides automated compliance checks and does not constitute formal or professional legal advice. 
          </p>
        </footer>
      </div>
    </>
  );
}

function AgentCard({ title, score, icon, weight, type, desc, onClick }) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div 
      className={`glass-card agent-card ${type}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', padding: '1rem' }}
    >
      <div className="agent-header" style={{ marginBottom: '0.5rem' }}>
        <div className="agent-icon-wrapper" style={{ padding: '0.4rem' }}>
          {icon}
        </div>
        <div className="ml-auto font-bold text-xl" style={{ color: 'var(--agent-color)' }}>
          {score}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm leading-tight mb-1">{title}</h3>
        <span className="text-secondary" style={{ fontSize: '0.7rem' }}>Weight: {weight}</span>
      </div>
      <p className="text-secondary mt-2" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>{desc}</p>
      
      <div className="agent-score-bar relative mt-3">
        <div 
          className="agent-score-fill"
          style={{ width: `${currentScore}%` }}
        ></div>
      </div>
    </div>
  );
}

export function DetailedRow({ id, title, score, type, icon, dimensions, identifiedIssues, proposedSolutions, fullStrategyDeliverable, isGeneratingDeepDive, onDeepDive, getStatusIcon }) {
  return (
    <div id={id} className={`glass-card p-6 flex-col ${type} html2pdf__page-break`} style={{ display: 'flex', gap: '1.25rem', borderLeft: '4px solid var(--agent-color)', scrollMarginTop: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--agent-color)', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="font-bold text-2xl" style={{ color: 'var(--agent-color)' }}>{score}/100</div>
      </div>
      
      {/* Text Insights Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h4 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} className="text-danger" /> Identified Issues
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
            {(Array.isArray(identifiedIssues) ? identifiedIssues : []).map((finding, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>â€¢</span>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
          <h4 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} className="text-warning" /> Proposed Solutions
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
            {(Array.isArray(proposedSolutions) ? proposedSolutions : []).map((win, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>â€¢</span>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Deep Dive Render Section */}
      {!fullStrategyDeliverable && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={onDeepDive}
            disabled={isGeneratingDeepDive}
            className="btn-outline" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem', 
              borderColor: 'var(--agent-color)', 
              color: 'var(--agent-color)',
              maxWidth: '300px'
            }}
          >
            {isGeneratingDeepDive ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderTopColor: 'var(--agent-color)' }}></div>
                Executing Deep Dive...
              </>
            ) : (
              <>
                <Zap size={18} />
                Generate Deep Strategy Deliverable
              </>
            )}
          </button>
        </div>
      )}

      {fullStrategyDeliverable && (
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <h4 className="text-md font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Deep Strategy Deliverable
          </h4>
          <ReactMarkdown 
            className="markdown-body" 
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                if (!inline && language === 'csv') {
                  const csvData = String(children).trim();
                  if (!csvData) return null;
                  
                  // Parse CSV properly handling quotes and commas
                  const rows = csvData.split('\n').filter(r => r.trim()).map(row => {
                    const columns = [];
                    let current = '';
                    let inQuotes = false;
                    for (let i = 0; i < row.length; i++) {
                      if (row[i] === '"') {
                        inQuotes = !inQuotes;
                      } else if (row[i] === ',' && !inQuotes) {
                        columns.push(current.trim());
                        current = '';
                      } else {
                        current += row[i];
                      }
                    }
                    columns.push(current.trim());
                    return columns;
                  });

                  if (rows.length === 0) return null;
                  const headers = rows[0];
                  const bodyRows = rows.slice(1);

                  return (
                    <div style={{ overflowX: 'auto', margin: '2rem 0' }}>
                      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <thead>
                          <tr>
                            {headers.map((h, i) => (
                              <th key={i} style={{ background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.8), rgba(15, 23, 42, 0.8))', color: '#93c5fd', padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '2px solid rgba(59, 130, 246, 0.4)', textTransform: 'uppercase', fontSize: '0.85rem' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bodyRows.map((row, i) => (
                            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(59, 130, 246, 0.05)' }}>
                              {row.map((cell, j) => (
                                <td key={j} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e2e8f0', fontSize: '0.95rem' }}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return !inline ? (
                  <pre className={className} {...props}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {fullStrategyDeliverable}
          </ReactMarkdown>
        </div>
      )}

      {/* KPI Scores Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
        {(Array.isArray(dimensions) ? dimensions : []).map((dim, idx) => (
          <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{dim.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: dim.status === 'good' ? 'var(--success)' : dim.status === 'warning' ? 'var(--warning)' : 'var(--danger)' }}>
                  {dim.score}/100
                </span>
                {getStatusIcon(dim.status)}
              </div>
            </div>
            {/* Progress bar for each dimension */}
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${dim.score}%`, 
                background: dim.status === 'good' ? 'var(--success)' : dim.status === 'warning' ? 'var(--warning)' : 'var(--danger)',
                transition: 'width 1s ease-in-out'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

