import React, { useState, useEffect } from 'react';
import { 
  Search, Cpu, LineChart, Shield, TrendingUp, Scale, 
  Check, ArrowRight, Activity, Target, Zap, AlertTriangle, 
  Info, CheckCircle2, Download, FileText, Radar, LayoutTemplate, 
  Briefcase, Mail, Megaphone, Monitor, Users, BarChart3, Presentation, Globe
} from 'lucide-react';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { skillsData } from '../api/skillsData.js';

// 15 Agent Configuration
const AGENTS_CONFIG = [
  { key: 'audit', title: 'Overall Strategy', icon: <Target size={24}/>, weight: '10%', desc: 'High-level business audit.' },
  { key: 'brand', title: 'Brand & Positioning', icon: <Briefcase size={24}/>, weight: '5%', desc: 'Brand identity & consistency.' },
  { key: 'copy', title: 'Copy & Messaging', icon: <FileText size={24}/>, weight: '10%', desc: 'Value prop & copywriting.' },
  { key: 'emails', title: 'Email Marketing', icon: <Mail size={24}/>, weight: '5%', desc: 'Nurture & automation.' },
  { key: 'social', title: 'Social Media', icon: <Users size={24}/>, weight: '5%', desc: 'Organic social presence.' },
  { key: 'ads', title: 'Paid Acquisition', icon: <Megaphone size={24}/>, weight: '10%', desc: 'ROAS & paid strategies.' },
  { key: 'funnel', title: 'Sales Funnel', icon: <Activity size={24}/>, weight: '10%', desc: 'Conversion pathways.' },
  { key: 'competitors', title: 'Competitor Intel', icon: <Radar size={24}/>, weight: '5%', desc: 'Market share & gaps.' },
  { key: 'landing', title: 'Landing Pages', icon: <LayoutTemplate size={24}/>, weight: '5%', desc: 'UX/UI & conversion.' },
  { key: 'launch', title: 'Campaign Launch', icon: <Zap size={24}/>, weight: '5%', desc: 'Go-to-market strategies.' },
  { key: 'proposal', title: 'Proposal & Pricing', icon: <Presentation size={24}/>, weight: '5%', desc: 'Offer appeal & pricing.' },
  { key: 'seo', title: 'GEO & SEO', icon: <Globe size={24}/>, weight: '10%', desc: 'Search visibility.' },
  { key: 'reputation', title: 'Reputation', icon: <Shield size={24}/>, weight: '5%', desc: 'Reviews & sentiment.' },
  { key: 'sales', title: 'Sales Intel', icon: <BarChart3 size={24}/>, weight: '5%', desc: 'Lead qualification.' },
  { key: 'legal', title: 'Compliance', icon: <Scale size={24}/>, weight: '5%', desc: 'GDPR, CCPA & accessibility.' }
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const skillManualsText = Object.entries(skillsData).map(([name, content]) => "=== SKILL MANUAL: " + name + " ===\n" + content + "\n").join('\n');

      const prompt = `You are a suite of 15 advanced AI Agents analyzing this scraped URL text:
      ---
      ${payload.text}
      ---
      
      CRITICAL INSTRUCTION: You MUST strictly base your analysis, findings, and quickWins on the detailed methodologies, templates, and frameworks provided in these Skill Manuals below:
      
      ${skillManualsText}
      
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
      - CRITICAL: Provide exactly 3 findings and 3 quickWins per category. DO NOT use short bullet points. Every single finding and quickWin MUST be a highly detailed, 3-to-4 sentence paragraph. You MUST explicitly apply the specific frameworks, scoring rubrics, copy formulas, ad variations, or email sequence templates defined in the Skill Manuals for that specific agent. The user expects to see the actual deep output (like actual headline variations, actual ad copy, actual email subjects) directly inside the findings and quickWins text.`;

      const result = await model.generateContent(prompt);
      let outputText = result.response.text();
      outputText = outputText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
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
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // --- COVER PAGE ---
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("OMNIAUDIT AI", pageWidth / 2, 80, { align: 'center' });
        
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(22);
        doc.text("EXECUTIVE INTELLIGENCE REPORT", pageWidth / 2, 100, { align: 'center' });

        doc.setTextColor(200, 200, 200);
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text(`Target Asset: ${results.url}`, pageWidth / 2, 130, { align: 'center' });
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 140, { align: 'center' });

        doc.setFillColor(59, 130, 246);
        doc.rect(pageWidth / 2 - 45, 165, 90, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(`COMPOSITE: ${results.composite}/100`, pageWidth / 2, 188, { align: 'center' });

        // --- EXECUTIVE SUMMARY PAGE ---
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        let yPos = 30;
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        doc.text("Executive Summary", 20, yPos);
        
        doc.setLineWidth(1);
        doc.setDrawColor(59, 130, 246);
        doc.line(20, yPos + 5, 190, yPos + 5);
        
        yPos += 20;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const summaryText = doc.splitTextToSize(`This document contains a comprehensive 15-dimensional AI audit of ${results.url}. It is intended for executive management to review critical business intelligence, identify immediate operational vulnerabilities, and execute on high-ROI strategic improvements across all digital departments.`, 170);
        doc.text(summaryText, 20, yPos);
        yPos += 30;

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Domain Performance Matrix", 20, yPos);
        yPos += 15;
        
        AGENTS_CONFIG.forEach((agent, i) => {
          const data = results.stats[agent.key];
          if (!data) return;
          
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 20 + (col * 85);
          const y = yPos + (row * 15);
          
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(70, 70, 70);
          doc.text(agent.title.toUpperCase(), x, y);
          
          if (data.score >= 80) doc.setTextColor(34, 197, 94);
          else if (data.score >= 50) doc.setTextColor(234, 179, 8);
          else doc.setTextColor(239, 68, 68);
          
          doc.text(`${data.score}/100`, x + 75, y, { align: 'right' });
        });

        // --- DETAILED AGENT PAGES ---
        AGENTS_CONFIG.forEach((agent) => {
          const data = results.stats[agent.key];
          if (!data) return;

          doc.addPage();
          
          // Header Bar
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, pageWidth, 40, 'F');
          
          doc.setFontSize(24);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text(`${agent.title.toUpperCase()}`, 20, 27);
          
          // Score Badge
          if (data.score >= 80) doc.setFillColor(34, 197, 94);
          else if (data.score >= 50) doc.setFillColor(234, 179, 8);
          else doc.setFillColor(239, 68, 68);
          
          doc.rect(160, 10, 35, 20, 'F');
          doc.setFontSize(18);
          doc.setTextColor(255, 255, 255);
          doc.text(`${data.score}/100`, 177.5, 25, { align: 'center' });

          yPos = 55;

          const checkPageBreak = (neededHeight) => {
            if (yPos + neededHeight > 280) {
              doc.addPage();
              yPos = 20;
            }
          };

          // Critical Findings
          checkPageBreak(30);
          doc.setTextColor(220, 38, 38);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("CRITICAL FINDINGS & VULNERABILITIES", 20, yPos);
          yPos += 8;
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          data.findings.forEach(finding => {
            const wrappedText = doc.splitTextToSize(`• ${finding}`, 170);
            const textHeight = wrappedText.length * 5;
            checkPageBreak(textHeight + 5);
            doc.text(wrappedText, 20, yPos);
            yPos += textHeight + 4;
          });

          yPos += 10;

          // Quick Wins
          checkPageBreak(30);
          doc.setTextColor(161, 98, 7);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("STRATEGIC QUICK WINS", 20, yPos);
          yPos += 8;
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          data.quickWins.forEach(win => {
            const wrappedText = doc.splitTextToSize(`• ${win}`, 170);
            const textHeight = wrappedText.length * 5;
            checkPageBreak(textHeight + 5);
            doc.text(wrappedText, 20, yPos);
            yPos += textHeight + 4;
          });

          yPos += 15;

          // Dimensions Matrix
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("KPI DIMENSIONS", 20, yPos);
          yPos += 12;

          data.dimensions.forEach((dim) => {
            if(yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(70, 70, 70);
            doc.text(dim.name, 20, yPos);
            
            if (dim.status === 'good') doc.setTextColor(34, 197, 94);
            else if (dim.status === 'warning') doc.setTextColor(234, 179, 8);
            else doc.setTextColor(239, 68, 68);
            
            doc.text(`${dim.score}/100`, 190, yPos, { align: 'right' });
            
            // Progress bar
            doc.setFillColor(226, 232, 240);
            doc.rect(20, yPos + 3, 170, 4, 'F');
            
            if (dim.status === 'good') doc.setFillColor(34, 197, 94);
            else if (dim.status === 'warning') doc.setFillColor(234, 179, 8);
            else doc.setFillColor(239, 68, 68);
            
            doc.rect(20, yPos + 3, (170 * dim.score) / 100, 4, 'F');
            
            yPos += 15;
          });
        });

        doc.save(`OMNIAUDIT-EXECUTIVE-${results.url.replace(/https?:\/\//, '').replace(/\//g, '')}.pdf`);
        
        setIsGeneratingPdf(false);
        setPdfReady(true);
      } catch (error) {
        console.error("PDF Gen Error:", error);
        setIsGeneratingPdf(false);
      }
    }, 1500);
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
          <div className="dashboard-results animate-fade-in">
            <div className="mb-6 flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="text-2xl font-bold">Audit Results for <span className="text-primary">{results.url}</span></h2>
                <p className="text-secondary">Comprehensive analysis generated across 15 intelligence domains</p>
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
                      findings={data.findings}
                      quickWins={data.quickWins}
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

function DetailedRow({ id, title, score, type, icon, dimensions, findings, quickWins, getStatusIcon }) {
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
            <AlertTriangle size={16} className="text-danger" /> Critical Findings
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
            {findings.map((finding, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>•</span>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
          <h4 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} className="text-warning" /> Strategic Quick Wins
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
            {quickWins.map((win, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>•</span>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
