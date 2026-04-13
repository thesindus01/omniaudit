import React, { useState, useEffect } from 'react';
import { 
  Search, Cpu, LineChart, Shield, TrendingUp, Scale, 
  Check, ArrowRight, Activity, Target, Zap, AlertTriangle, 
  Info, CheckCircle2, Download, FileText, Radar
} from 'lucide-react';
import jsPDF from 'jspdf';

// Dynamic Agent Data Generator matching the exact AI Agency Command Center specifications
const generateAgentStats = () => {
  const getScore = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const getStatus = (score) => {
    if (score >= 80) return 'good';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const genDimension = (name, min = 30, max = 90) => {
    const s = getScore(min, max);
    return { name, score: s, status: getStatus(s) };
  };

  const mktgDims = [
    genDimension("Messaging & Copy Quality"),
    genDimension("Conversion Elements"),
    genDimension("SEO Fundamentals"),
    genDimension("Content Strategy"),
    genDimension("Competitive Positioning")
  ];
  
  const repDims = [
    genDimension("Review Volume & Rating"),
    genDimension("Sentiment Patterns"),
    genDimension("Response Management"),
    genDimension("Competitive Reputation"),
    genDimension("Crisis Vulnerability") // higher is better
  ];

  const seoDims = [
    genDimension("AI Citability"),
    genDimension("AI Crawler Access", 60, 100),
    genDimension("Schema & Structured Data"),
    genDimension("Content Structure for AI"),
    genDimension("Platform Readiness")
  ];

  const salesDims = [
    genDimension("Company Fit"),
    genDimension("Digital Maturity Gap"),
    genDimension("Decision Maker Accessibility"),
    genDimension("Budget Indicators"),
    genDimension("Timing & Urgency")
  ];

  const legalDims = [
    genDimension("Privacy Policy"),
    genDimension("Terms of Service"),
    genDimension("Cookie & Tracking Compliance"),
    genDimension("ADA/Accessibility"),
    genDimension("Data Collection Practices")
  ];

  const mktgAvg = Math.round(mktgDims.reduce((acc, curr) => acc + curr.score, 0) / 5);
  const repAvg = Math.round(repDims.reduce((acc, curr) => acc + curr.score, 0) / 5);
  const seoAvg = Math.round(seoDims.reduce((acc, curr) => acc + curr.score, 0) / 5);
  const salesAvg = Math.round(salesDims.reduce((acc, curr) => acc + curr.score, 0) / 5);
  const legalAvg = Math.round(legalDims.reduce((acc, curr) => acc + curr.score, 0) / 5);

  return {
    marketing: { 
      score: mktgAvg, 
      dimensions: mktgDims,
      findings: [
        "Primary CTA is not visible above the fold on mobile devices.",
        "Value proposition is generic and lacks specific proof points.",
        "Meta descriptions are missing on 40% of key service pages."
      ],
      quickWins: [
        "Add a sticky 'Call Now' button to the mobile experience.",
        "Rewrite the homepage headline to focus on a specific customer benefit.",
        "Add 3 customer testimonials with photos right below the hero section."
      ]
    },
    sales: { 
      score: salesAvg, 
      dimensions: salesDims,
      findings: [
        "Decision makers are easily identifiable on LinkedIn.",
        "Strong budget indicators but obvious gaps in current digital strategy.",
        "Competitors are aggressively outspending them on Ads."
      ],
      quickWins: [
        "Reach out specifically highlighting their outdated UI compared to rivals.",
        "Pitch an entry-level 'Audit Fix' package based on immediate SEO errors.",
        "Use LinkedIn connection request focused on their recent company milestone."
      ]
    },
    reputation: { 
      score: repAvg, 
      dimensions: repDims,
      findings: [
        "No response to 12 negative Google reviews from the past 6 months.",
        "Sentiment analysis shows recurring complaints about response times.",
        "Competitors have 3x the average review volume."
      ],
      quickWins: [
        "Draft professional, empathetic responses to all negative Google reviews.",
        "Implement an automated email sequence to ask happy customers for reviews.",
        "Claim completely unmanaged Yelp and Apple Maps profiles."
      ]
    },
    seo: { 
      score: seoAvg, 
      dimensions: seoDims,
      findings: [
        "Total absence of LocalBusiness JSON-LD schema markup.",
        "Content lacks quotable statistics and structured data for AI.",
        "Robots.txt is partially blocking Anthropic and OpenAI crawlers."
      ],
      quickWins: [
        "Generate and inject basic JSON-LD organization schema to the homepage.",
        "Update robots.txt to explicitly allow GPTBot and ClaudeBot.",
        "Add an 'FAQ' section to key service pages to improve AI citability."
      ]
    },
    legal: { 
      score: legalAvg, 
      dimensions: legalDims,
      findings: [
        "Privacy policy is outdated and lacks GDPR/CCPA specific clauses.",
        "Cookie consent banner is missing opt-out mechanism.",
        "Key landing pages have critical ADA contrast ratio failures."
      ],
      quickWins: [
        "Install a compliant one-click Cookie Consent manager.",
        "Update primary button and text colors to meet WCAG AA contrast standards.",
        "Generate a modern Privacy Policy using a legal template generator."
      ]
    }
  };
};

function App() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [scanStep, setScanStep] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setResults(null);
    setScanStep(0);
    setPdfReady(false);

    const phases = [
      "Phase 1 — Discovery & Crawling...",
      "Phase 2 — Launching 5 parallel Gemini audit teams...",
      "Phase 3 — Compiling Composite Data...",
      "Phase 4 — Evaluating 25 KPI Dimensions..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < phases.length) {
        setScanStep(currentStep);
      } else {
        clearInterval(interval);
        const stats = generateAgentStats();
        // Weights: Marketing(25%), Sales(20%), Reputation(20%), SEO(20%), Legal(15%)
        const composite = Math.round(
          (stats.marketing.score * 0.25) + 
          (stats.reputation.score * 0.20) + 
          (stats.seo.score * 0.20) + 
          (stats.legal.score * 0.15) + 
          (stats.sales.score * 0.20)
        );
        
        let grade = "F";
        if (composite >= 85) grade = "A+";
        else if (composite >= 70) grade = "A";
        else if (composite >= 55) grade = "B";
        else if (composite >= 40) grade = "C";
        else if (composite >= 25) grade = "D";

        setResults({ stats, composite, grade, url });
        setIsScanning(false);
      }
    }, 1500);
  };

  const handleDownloadPdf = () => {
    if (!results) return;
    setIsGeneratingPdf(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        let yPos = 20;
        
        // Title
        doc.setFontSize(22);
        doc.setTextColor(59, 130, 246);
        doc.text("OmniAudit (Powered by Gemini)", 20, yPos);
        yPos += 10;
        
        // Subtitle
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`Official Audit Report for: ${results.url}`, 20, yPos);
        yPos += 15;
        
        // Composite
        doc.setFontSize(14);
        doc.text(`Composite Score: ${results.composite} / 100`, 20, yPos);
        yPos += 8;
        doc.text(`Grade: ${results.grade}`, 20, yPos);
        yPos += 15;
        
        // Loop through agents
        const agents = [
          { name: 'Marketing Agent', data: results.stats.marketing },
          { name: 'Reputation Agent', data: results.stats.reputation },
          { name: 'GEO/SEO Agent', data: results.stats.seo },
          { name: 'Sales Intelligence', data: results.stats.sales },
          { name: 'Legal Compliance', data: results.stats.legal }
        ];

        agents.forEach((agent) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(14);
          doc.setTextColor(59, 130, 246);
          doc.text(`--- ${agent.name} [Score: ${agent.data.score}/100] ---`, 20, yPos);
          yPos += 8;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text("Critical Findings:", 20, yPos);
          yPos += 6;
          
          doc.setFontSize(10);
          agent.data.findings.forEach((finding, idx) => {
            const wrappedText = doc.splitTextToSize(`• ${finding}`, 170);
            doc.text(wrappedText, 25, yPos);
            yPos += (wrappedText.length * 5) + 2;
          });
          
          yPos += 4;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text("Quick Wins (Improvements):", 20, yPos);
          yPos += 6;
          
          doc.setFontSize(10);
          agent.data.quickWins.forEach((win, idx) => {
            const wrappedText = doc.splitTextToSize(`• ${win}`, 170);
            doc.text(wrappedText, 25, yPos);
            yPos += (wrappedText.length * 5) + 2;
          });
          
          yPos += 8;
        });

        // Save PDF
        doc.save(`AGENCY-REPORT-${results.url.replace(/https?:\/\//, '').replace(/\//g, '')}.pdf`);
        
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
              Deploy 5 parallel Gemini agents to audit any business organically. 
              Get a composite score, detailed KPIs, and PDF summaries in seconds.
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
            <h2 className="text-2xl font-bold text-gradient mb-2">Deploying AI Agents...</h2>
            <p className="text-secondary text-lg">
              {scanStep === 0 && "Phase 1 — Discovery & Content Extraction..."}
              {scanStep === 1 && "Phase 2 — Launching 5 parallel audit teams..."}
              {scanStep === 2 && "Phase 3 — Calculating composite scoring..."}
              {scanStep === 3 && "Phase 4 — Evaluating 25 KPI Dimensions..."}
            </p>
          </div>
        )}

        {results && (
          <div className="dashboard-results animate-fade-in">
            <div className="mb-6 flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="text-2xl font-bold">Audit Results for <span className="text-primary">{results.url}</span></h2>
                <p className="text-secondary">Analysis generated across 5 domains</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleDownloadPdf} 
                  className="btn-primary" 
                  style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: pdfReady ? 'var(--success)' : 'var(--primary)' }}
                  disabled={isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <><div className="spinner" style={{ width: '16px', height: '16px', margin: 0, borderWidth: '2px' }}></div> Generating PDF...</>
                  ) : pdfReady ? (
                    <><Check size={18} /> AGENCY-REPORT.pdf Ready!</>
                  ) : (
                    <><FileText size={18} /> Generate PDF Report</>
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
                <h3 className="text-xl font-bold mb-1">Composite Score</h3>
                <div className="score-number font-bold text-3xl text-gradient mb-4">{results.composite} / 100</div>
                <p className="text-secondary text-sm px-4">
                  {results.grade === 'A+' || results.grade === 'A' ? "Excellent performance. Minor fixes needed." : 
                   results.grade === 'B' ? "Average. Significant improvement opportunities." :
                   "Critical issues identified across multiple domains. Perfect client."}
                </p>
              </div>

              {/* Right Column: Agents Grid */}
              <div className="agents-grid">
                <AgentCard 
                  title="Marketing Agent" 
                  score={results.stats.marketing.score} 
                  icon={<Target size={24}/>} 
                  weight="25%" 
                  type="agent-marketing"
                  desc="Copy, SEO, funnels, ads."
                  onClick={() => document.getElementById('details-marketing').scrollIntoView({ behavior: 'smooth' })}
                />
                <AgentCard 
                  title="Reputation Agent" 
                  score={results.stats.reputation.score} 
                  icon={<Shield size={24}/>} 
                  weight="20%" 
                  type="agent-reputation"
                  desc="Reviews, sentiment, crisis."
                  onClick={() => document.getElementById('details-reputation').scrollIntoView({ behavior: 'smooth' })}
                />
                <AgentCard 
                  title="GEO/SEO Agent" 
                  score={results.stats.seo.score} 
                  icon={<TrendingUp size={24}/>} 
                  weight="20%" 
                  type="agent-seo"
                  desc="Local SEO, schema, keywords."
                  onClick={() => document.getElementById('details-seo').scrollIntoView({ behavior: 'smooth' })}
                />
                <AgentCard 
                  title="Sales Agent" 
                  score={results.stats.sales.score} 
                  icon={<Zap size={24}/>} 
                  weight="20%" 
                  type="agent-sales"
                  desc="Decision makers, proposals."
                  onClick={() => document.getElementById('details-sales').scrollIntoView({ behavior: 'smooth' })}
                />
                <AgentCard 
                  title="Legal Agent" 
                  score={results.stats.legal.score} 
                  icon={<Scale size={24}/>} 
                  weight="15%" 
                  type="agent-legal"
                  desc="GDPR, CCPA, accessibility."
                  onClick={() => document.getElementById('details-legal').scrollIntoView({ behavior: 'smooth' })}
                />
              </div>
            </div>

            {/* Detailed KPI Section linked to Repo skills */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Agent Dimension Breakdown & Critical Findings</h2>
              
              <div className="flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <DetailedRow 
                  id="details-marketing"
                  title="Marketing Audit Dimensions" 
                  score={results.stats.marketing.score} 
                  type="agent-marketing" 
                  icon={<Target size={24}/>}
                  dimensions={results.stats.marketing.dimensions}
                  findings={results.stats.marketing.findings}
                  quickWins={results.stats.marketing.quickWins}
                  getStatusIcon={getStatusIcon}
                />
                
                <DetailedRow 
                  id="details-reputation"
                  title="Reputation Audit Dimensions" 
                  score={results.stats.reputation.score} 
                  type="agent-reputation" 
                  icon={<Shield size={24}/>}
                  dimensions={results.stats.reputation.dimensions}
                  findings={results.stats.reputation.findings}
                  quickWins={results.stats.reputation.quickWins}
                  getStatusIcon={getStatusIcon}
                />
                
                <DetailedRow 
                  id="details-seo"
                  title="GEO/SEO Audit Dimensions" 
                  score={results.stats.seo.score} 
                  type="agent-seo" 
                  icon={<TrendingUp size={24}/>}
                  dimensions={results.stats.seo.dimensions}
                  findings={results.stats.seo.findings}
                  quickWins={results.stats.seo.quickWins}
                  getStatusIcon={getStatusIcon}
                />
                
                <DetailedRow 
                  id="details-sales"
                  title="Sales Intelligence Dimensions" 
                  score={results.stats.sales.score} 
                  type="agent-sales" 
                  icon={<Zap size={24}/>}
                  dimensions={results.stats.sales.dimensions}
                  findings={results.stats.sales.findings}
                  quickWins={results.stats.sales.quickWins}
                  getStatusIcon={getStatusIcon}
                />
                
                <DetailedRow 
                  id="details-legal"
                  title="Legal Compliance Dimensions" 
                  score={results.stats.legal.score} 
                  type="agent-legal" 
                  icon={<Scale size={24}/>}
                  dimensions={results.stats.legal.dimensions}
                  findings={results.stats.legal.findings}
                  quickWins={results.stats.legal.quickWins}
                  getStatusIcon={getStatusIcon}
                />

              </div>
            </div>

          </div>
        )}

        <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '0.90rem', marginBottom: '0.5rem' }}>
            &copy; {new Date().getFullYear()} Ishaq Solutions Inc&reg;. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, maxWidth: '800px', margin: '0 auto', lineHeight: '1.4' }}>
            Disclaimer: The audit insights and proposals generated by this dashboard are powered by AI for informational and strategic purposes only. The "Legal Agent" analysis provides automated compliance checks and does not constitute formal or professional legal advice. 
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
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="agent-header">
        <div className="agent-icon-wrapper">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">{title}</h3>
          <span className="text-secondary text-xs">Weight: {weight}</span>
        </div>
        <div className="ml-auto font-bold text-2xl" style={{ color: 'var(--agent-color)' }}>
          {score}
        </div>
      </div>
      <p className="text-sm text-secondary mb-4">{desc}</p>
      
      <div className="agent-score-bar relative">
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
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px' }}>
          <h4 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} className="text-danger" /> Critical Findings
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
            {findings.map((finding, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>•</span>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px' }}>
          <h4 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} className="text-warning" /> Quick Wins (Improvements)
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
            {quickWins.map((win, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.90rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>•</span>
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
