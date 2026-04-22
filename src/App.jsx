import React, { useState, useEffect } from 'react';
import { 
  Search, Cpu, LineChart, Shield, TrendingUp, Scale, 
  Check, ArrowRight, Activity, Target, Zap, AlertTriangle, 
  Info, CheckCircle2, Download, FileText, Radar, LayoutTemplate, 
  Briefcase, Mail, Megaphone, Monitor, Users, BarChart3, Presentation, Globe
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { skillsData } from '../api/skillsData.js';

// 12 Agent Configuration matching SKILL.md files exactly
const AGENTS_CONFIG = [
  { key: 'market-audit', title: 'Market Audit', icon: <Target size={24}/>, weight: '15%', desc: 'Overall marketing health & strategy.' },
  { key: 'market-ads', title: 'Ad Campaigns (Ads)', icon: <Megaphone size={24}/>, weight: '10%', desc: 'Ad structures & copy variations.' },
  { key: 'market-brand', title: 'Brand Identity', icon: <Briefcase size={24}/>, weight: '5%', desc: 'Brand positioning & consistency.' },
  { key: 'market-competitors', title: 'Competitor Intel', icon: <Radar size={24}/>, weight: '10%', desc: 'Market gaps & competitor analysis.' },
  { key: 'market-copy', title: 'Copywriting', icon: <FileText size={24}/>, weight: '10%', desc: 'Value propositions & sales copy.' },
  { key: 'market-emails', title: 'Email Sequences', icon: <Mail size={24}/>, weight: '10%', desc: 'Nurture campaigns & automation.' },
  { key: 'market-funnel', title: 'Sales Funnel', icon: <Activity size={24}/>, weight: '10%', desc: 'Conversion pathway optimization.' },
  { key: 'market-landing', title: 'Landing Pages', icon: <LayoutTemplate size={24}/>, weight: '5%', desc: 'UX/UI & conversion triggers.' },
  { key: 'market-launch', title: 'Campaign Launch', icon: <Zap size={24}/>, weight: '5%', desc: 'Go-to-market rollout plans.' },
  { key: 'market-proposal', title: 'Proposals & Offers', icon: <Presentation size={24}/>, weight: '5%', desc: 'Pricing strategy & offer framing.' },
  { key: 'market-seo', title: 'SEO Strategy', icon: <Globe size={24}/>, weight: '10%', desc: 'Search visibility & keywords.' },
  { key: 'market-social', title: 'Social Media', icon: <Users size={24}/>, weight: '5%', desc: 'Organic social growth tactics.' }
];

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
      "Phase 1 — Discovery & Live Crawling...",
      "Phase 2 — Launching 15 parallel Gemini audit teams...",
      "Phase 3 — Compiling Composite Data...",
      "Phase 4 — Evaluating 45+ KPI Dimensions..."
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

      const prompt = `You are a suite of 12 advanced AI Marketing Agents analyzing this scraped URL text:
      ---
      ${payload.text}
      ---
      
      CRITICAL INSTRUCTION: You MUST strictly base your analysis, identified issues, problems, and full solutions on the methodologies, templates, and frameworks provided in these Skill Manuals below:
      
      ${skillManualsText}
      
      RETURN ONLY PURE JSON. Do not return markdown blocks like "\`\`\`json".
      You must return EXACTLY this JSON structure containing ALL 12 keys representing the 12 agents. 
      For each agent, you must provide 'identifiedIssues' (problems found), 'proposedSolutions' (what needs to be done), and a massive 'fullStrategyDeliverable' which must contain the entire generated output requested by the SKILL.md (e.g., ad variations, email templates, full audit reports) formatted beautifully with newlines.
      
      {
        "market-audit": { "score": 85, "dimensions": [{ "name": "Strategic Alignment", "score": 85, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "The massive, comprehensive output defined in SKILL.md..." },
        "market-ads": { "score": 75, "dimensions": [{ "name": "Ad Spend ROI", "score": 75, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "YOUR FULL AD CAMPAIGN TEXT HERE..." },
        "market-brand": { "score": 90, "dimensions": [{ "name": "Brand Consistency", "score": 90, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-competitors": { "score": 50, "dimensions": [{ "name": "Market Share", "score": 50, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-copy": { "score": 80, "dimensions": [{ "name": "Messaging Clarity", "score": 80, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-emails": { "score": 40, "dimensions": [{ "name": "Lead Nurture", "score": 40, "status": "error" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-funnel": { "score": 70, "dimensions": [{ "name": "Conversion Rate", "score": 70, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-landing": { "score": 85, "dimensions": [{ "name": "UX/UI", "score": 85, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-launch": { "score": 60, "dimensions": [{ "name": "Go-to-Market", "score": 60, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-proposal": { "score": 55, "dimensions": [{ "name": "Offer Appeal", "score": 55, "status": "warning" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-seo": { "score": 80, "dimensions": [{ "name": "Technical SEO", "score": 80, "status": "good" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." },
        "market-social": { "score": 45, "dimensions": [{ "name": "Platform Presence", "score": 45, "status": "error" }], "identifiedIssues": ["..."], "proposedSolutions": ["..."], "fullStrategyDeliverable": "..." }
      }
      Rules:
      - Score must be an integer between 0 and 100.
      - Provide exactly 3 identifiedIssues and 3 proposedSolutions per category.
      - CRITICAL: 'fullStrategyDeliverable' MUST be a massive, multi-paragraph string containing the full, unabridged solution demanded by the SKILL.md. If the skill asks for 3 ad variations, put them here. If it asks for 5 email sequences, put them here. Do not summarize! Provide the actual work.`;

      const result = await model.generateContent(prompt);
      let outputText = result.response.text();
      outputText = outputText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      
      // Clean up any trailing commas that could break JSON.parse()
      outputText = outputText.replace(/,\s*([\]}])/g, '$1');
      
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

      setResults({ stats, composite, grade, url });
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
        // Find the main dashboard container that holds all results
        const element = document.getElementById('report-content');
        if (!element) throw new Error("Report container not found");

        const opt = {
          margin:       [10, 10, 10, 10],
          filename:     `OMNIAUDIT-EXECUTIVE-${results.url.replace(/https?:\/\//, '').replace(/\//g, '')}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            backgroundColor: '#0f172a' // match dark theme
          },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // We temporarily add a class to the element to make it printer friendly if needed
        element.classList.add('pdf-mode');

        html2pdf().set(opt).from(element).save().then(() => {
          element.classList.remove('pdf-mode');
          setIsGeneratingPdf(false);
          setPdfReady(true);
        }).catch(err => {
          console.error("PDF generation failed inside html2pdf:", err);
          element.classList.remove('pdf-mode');
          setIsGeneratingPdf(false);
        });
      } catch (error) {
        console.error("PDF Gen Error:", error);
        setIsGeneratingPdf(false);
      }
    }, 500);
  };

  const getStatusIcon = (status) => {
    if (status === 'good') return <CheckCircle2 className="text-success" size={18} />;
    if (status === 'warning') return <Info className="text-warning" size={18} />;
    return <AlertTriangle className="text-danger" size={18} />;
  }

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
              {scanStep === 0 && "Phase 1 — Discovery & Live Crawling..."}
              {scanStep === 1 && "Phase 2 — Launching 15 parallel audit teams..."}
              {scanStep === 2 && "Phase 3 — Calculating composite scoring..."}
              {scanStep === 3 && "Phase 4 — Evaluating 45+ KPI Dimensions..."}
            </p>
          </div>
        )}

        {results && (
          <div id="report-content" className="dashboard-results animate-fade-in" style={{ background: '#0f172a', padding: '2rem', borderRadius: '12px' }}>
            <div className="mb-6 flex justify-between items-center html2pdf__page-break" style={{ flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h2 className="text-2xl font-bold">Executive Audit: <span className="text-primary">{results.url}</span></h2>
                <p className="text-secondary">Comprehensive 12-dimensional analysis driven by Master Skill Methodologies</p>
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
                      getStatusIcon={getStatusIcon}
                    />
                  )
                })}
              </div>
            </div>

          </div>
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

export function DetailedRow({ id, title, score, type, icon, dimensions, identifiedIssues, proposedSolutions, fullStrategyDeliverable, getStatusIcon }) {
  return (
    <div id={id} className={`glass-card p-6 flex-col ${type}`} style={{ display: 'flex', gap: '1.25rem', borderLeft: '4px solid var(--agent-color)', scrollMarginTop: '20px' }}>
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
            {identifiedIssues.map((finding, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>•</span>
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
            {proposedSolutions.map((win, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>•</span>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Full Deliverable Rendered */}
      {fullStrategyDeliverable && (
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <h4 className="text-md font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Deep Strategy Deliverable
          </h4>
          <ReactMarkdown 
            className="markdown-body" 
            remarkPlugins={[remarkGfm]}
          >
            {fullStrategyDeliverable}
          </ReactMarkdown>
        </div>
      )}

      {/* KPI Scores Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
        {dimensions.map((dim, idx) => (
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
