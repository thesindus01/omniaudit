
/**
 * OMNIAUDIT PREMIUM PDF TEMPLATE ENGINE
 * High-fidelity, executive-grade document generation.
 */

const PDF_COLORS = {
  primary: '#0f172a',    // Deep Navy
  secondary: '#2563eb',  // Royal Blue
  accent: '#3b82f6',     // Bright Blue
  success: '#059669',    // Emerald 600
  warning: '#d97706',    // Amber 600
  danger: '#dc2626',     // Rose 600
  text: '#1e293b',       // Slate 800
  textLight: '#475569',  // Slate 600
  border: '#e2e8f0',     // Slate 200
  bg: '#ffffff'          // Pure White
};

const PDF_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  /* Global Reset & Force White Background */
  * { 
    box-sizing: border-box; 
    -webkit-print-color-adjust: exact !important; 
    color-adjust: exact !important;
  }
  
  html, body {
    background: white !important;
    color: ${PDF_COLORS.text} !important;
    font-family: 'Inter', -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    width: 210mm;
  }

  .pdf-container {
    background: white !important;
  }

  .page {
    width: 210mm;
    padding: 20mm 20mm 30mm 20mm; /* Extra bottom padding for footer space */
    position: relative;
    page-break-after: always;
    background: white !important;
    display: block;
    overflow: hidden;
  }

  /* Cover Page Design */
  .cover-page {
    background: ${PDF_COLORS.primary} !important;
    color: white !important;
    padding: 60mm 20mm;
    min-height: 297mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cover-accent {
    width: 60mm;
    height: 4pt;
    background: ${PDF_COLORS.secondary};
    margin-bottom: 20pt;
  }

  .logo-text {
    font-size: 24pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 60pt;
    color: white !important;
  }

  .cover-title {
    font-size: 42pt;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20pt;
    color: white !important;
  }

  .cover-subtitle {
    font-size: 18pt;
    font-weight: 300;
    color: rgba(255,255,255,0.7) !important;
    margin-bottom: 80pt;
    max-width: 85%;
  }

  .cover-footer {
    margin-top: auto;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1pt solid rgba(255,255,255,0.2);
    padding-top: 20pt;
  }

  .cover-domain {
    font-size: 14pt;
    font-weight: 600;
    color: white !important;
  }

  .cover-date {
    font-size: 10pt;
    text-transform: uppercase;
    letter-spacing: 2pt;
    color: rgba(255,255,255,0.5) !important;
  }

  /* Robust Page Break Prevention */
  .section, .finding-box, .score-grid, .summary-table, .agent-header, .kpi-container {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-bottom: 20pt;
  }

  /* Section Headers */
  .section-header {
    margin-bottom: 30pt;
    border-bottom: 2pt solid ${PDF_COLORS.border};
    padding-bottom: 10pt;
    page-break-after: avoid;
  }

  .section-title {
    font-size: 24pt;
    font-weight: 800;
    color: ${PDF_COLORS.primary} !important;
    margin-bottom: 5pt;
  }

  .section-tagline {
    font-size: 11pt;
    color: ${PDF_COLORS.textLight} !important;
  }

  /* Executive Score Grid */
  .score-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 30pt;
    margin-bottom: 40pt;
  }

  .score-card {
    background: #f8fafc !important;
    padding: 30pt;
    border-radius: 12pt;
    border: 1pt solid ${PDF_COLORS.border};
    text-align: center;
  }

  .score-label {
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5pt;
    color: ${PDF_COLORS.textLight} !important;
    margin-bottom: 10pt;
  }

  .score-value {
    font-size: 72pt;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 10pt;
  }

  .grade-badge {
    display: inline-block;
    padding: 6pt 16pt;
    border-radius: 50pt;
    font-weight: 700;
    font-size: 14pt;
  }

  /* Summary Table */
  .summary-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10pt;
  }

  .summary-table th {
    text-align: left;
    padding: 12pt;
    border-bottom: 2pt solid ${PDF_COLORS.primary};
    font-size: 9pt;
    font-weight: 800;
    color: ${PDF_COLORS.primary} !important;
    text-transform: uppercase;
    letter-spacing: 0.5pt;
  }

  .summary-table td {
    padding: 14pt 12pt;
    border-bottom: 1pt solid ${PDF_COLORS.border};
    vertical-align: middle;
    font-size: 10pt;
  }

  .agent-score-bar-bg {
    width: 100pt;
    height: 8pt;
    background: #f1f5f9 !important;
    border-radius: 4pt;
    overflow: hidden;
    display: inline-block;
    margin-right: 10pt;
  }

  .agent-score-bar-fill {
    height: 100%;
    border-radius: 4pt;
  }

  /* Agent Detail Page Header */
  .agent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25pt;
    padding-bottom: 15pt;
    border-bottom: 2pt solid ${PDF_COLORS.secondary};
  }

  .agent-meta h2 {
    font-size: 22pt;
    font-weight: 800;
    color: ${PDF_COLORS.primary} !important;
    margin: 0;
  }

  .agent-meta p {
    font-size: 10pt;
    color: ${PDF_COLORS.textLight} !important;
    margin: 4pt 0 0;
  }

  .agent-score-pill {
    text-align: right;
  }

  .pill-value {
    font-size: 28pt;
    font-weight: 800;
    color: ${PDF_COLORS.primary} !important;
    line-height: 1;
  }

  /* Findings Layout */
  .findings-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15pt;
    margin-bottom: 20pt;
    page-break-inside: avoid;
  }

  .finding-box {
    padding: 15pt;
    border-radius: 10pt;
    border: 1pt solid transparent;
    height: 100%;
  }

  .finding-box.critical {
    background: #fff1f2 !important;
    border-color: #fecaca !important;
  }

  .finding-box.success {
    background: #f0fdf4 !important;
    border-color: #bbf7d0 !important;
  }

  .finding-box h4 {
    font-size: 9pt;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 10pt;
    display: flex;
    align-items: center;
    gap: 6pt;
    color: inherit;
  }

  .finding-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .finding-list li {
    font-size: 10pt;
    margin-bottom: 6pt;
    padding-left: 12pt;
    position: relative;
    line-height: 1.4;
  }

  .finding-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    font-weight: 800;
  }

  /* KPI Box */
  .kpi-container {
    background: #f8fafc !important;
    padding: 20pt;
    border-radius: 12pt;
    border: 1pt solid ${PDF_COLORS.border};
  }

  .kpi-title {
    font-size: 9pt; 
    font-weight: 800; 
    text-transform: uppercase; 
    letter-spacing: 1.5pt; 
    margin-bottom: 15pt; 
    color:${PDF_COLORS.primary} !important;
  }

  .kpi-grid {
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 15pt 30pt;
  }

  .kpi-item {
    display:flex; 
    justify-content:space-between; 
    align-items:center; 
    padding: 6pt 0; 
    border-bottom: 1pt solid ${PDF_COLORS.border};
  }

  /* Footer */
  .page-footer {
    position: absolute;
    bottom: 15mm;
    left: 20mm;
    right: 20mm;
    padding-top: 10pt;
    border-top: 1pt solid ${PDF_COLORS.border};
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: ${PDF_COLORS.textLight} !important;
    text-transform: uppercase;
    letter-spacing: 1pt;
  }

  /* Deep Dive Markdown Styling */
  .markdown-content h1 { font-size: 28pt; font-weight: 800; margin-bottom: 20pt; border-bottom: 3pt solid ${PDF_COLORS.secondary}; padding-bottom: 10pt; page-break-after: avoid; }
  .markdown-content h2 { font-size: 18pt; font-weight: 700; margin: 30pt 0 15pt; color: ${PDF_COLORS.primary} !important; border-left: 4pt solid ${PDF_COLORS.secondary}; padding-left: 15pt; page-break-after: avoid; }
  .markdown-content h3 { font-size: 14pt; font-weight: 700; margin: 20pt 0 10pt; color: ${PDF_COLORS.secondary} !important; page-break-after: avoid; }
  .markdown-content p { margin-bottom: 12pt; font-size: 11pt; line-height: 1.6; }
  .markdown-content ul, .markdown-content ol { margin-bottom: 20pt; padding-left: 20pt; }
  .markdown-content li { margin-bottom: 8pt; font-size: 11pt; page-break-inside: avoid; }
  .markdown-content table { width: 100%; border-collapse: collapse; margin: 25pt 0; page-break-inside: avoid; }
  .markdown-content th { background: ${PDF_COLORS.primary} !important; color: white !important; padding: 10pt; text-align: left; font-size: 9pt; }
  .markdown-content td { padding: 10pt; border-bottom: 1pt solid ${PDF_COLORS.border}; font-size: 10pt; }
  .markdown-content blockquote { background: #f8fafc !important; border-left: 5pt solid ${PDF_COLORS.accent}; padding: 15pt 20pt; margin: 20pt 0; font-style: italic; page-break-inside: avoid; }
  .markdown-content pre { page-break-inside: avoid; }

  /* Utilities */
  .keep-together { page-break-inside: avoid !important; break-inside: avoid !important; }
`;

export function buildExecutivePdfHtml(results, agentsConfig) {
  const domain = results.url.replace(/https?:\/\//, '').replace(/\/$/, '');
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const gradeColor = results.composite >= 85 ? PDF_COLORS.success : 
                     results.composite >= 70 ? PDF_COLORS.secondary :
                     results.composite >= 55 ? PDF_COLORS.warning : PDF_COLORS.danger;

  // 1. Summary Matrix Rows
  const tableRows = agentsConfig.map(agent => {
    const d = results.stats?.[agent.key];
    const score = (d && typeof d.score === 'number') ? d.score : 0;
    const color = score >= 70 ? PDF_COLORS.success : 
                  score >= 50 ? PDF_COLORS.warning : PDF_COLORS.danger;
    
    return `
      <tr>
        <td style="font-weight: 700; color:${PDF_COLORS.primary}">${agent.title}</td>
        <td>
          <div style="display:flex; align-items:center;">
            <div class="agent-score-bar-bg">
              <div class="agent-score-bar-fill" style="width:${score}%; background:${color} !important;"></div>
            </div>
            <span style="font-weight:800; color:${color}">${score}<span style="font-size:8pt; opacity:0.6;">/100</span></span>
          </div>
        </td>
        <td style="text-align:center; color:${PDF_COLORS.textLight}; font-weight:600;">${agent.weight}</td>
      </tr>
    `;
  }).join('');

  // 2. Agent Detail Pages
  const agentDetailPages = agentsConfig.map(agent => {
    const d = results.stats?.[agent.key];
    if (!d) return '';

    const scoreColor = (d.score && typeof d.score === 'number') ? 
                       (d.score >= 70 ? PDF_COLORS.success : d.score >= 50 ? PDF_COLORS.warning : PDF_COLORS.danger) : 
                       PDF_COLORS.textLight;

    const issues = (d.identifiedIssues || []).map(i => `<li>${i}</li>`).join('');
    const solutions = (d.proposedSolutions || []).map(s => `<li>${s}</li>`).join('');

    return `
      <div class="page">
        <div class="agent-header">
          <div class="agent-meta">
            <h2>${agent.title}</h2>
            <p>${agent.desc}</p>
          </div>
          <div class="agent-score-pill">
            <div class="pill-value" style="color:${scoreColor} !important;">${d.score || 0}<span style="font-size:12pt; opacity:0.5;">/100</span></div>
            <div style="font-size:8pt; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:${scoreColor}">${d.score >= 70 ? 'Optimal' : d.score >= 50 ? 'Needs Work' : 'Critical'}</div>
          </div>
        </div>

        <div class="findings-container">
          <div class="finding-box critical">
            <h4 style="color:${PDF_COLORS.danger}"><span style="font-size:14pt;">⚠️</span> Identified Challenges</h4>
            <ul class="finding-list">
              ${issues || '<li>No critical challenges identified.</li>'}
            </ul>
          </div>
          <div class="finding-box success">
            <h4 style="color:${PDF_COLORS.success}"><span style="font-size:14pt;">✅</span> Strategic Remedies</h4>
            <ul class="finding-list">
              ${solutions || '<li>Maintain current operational standards.</li>'}
            </ul>
          </div>
        </div>

        <div class="kpi-container">
          <h4 class="kpi-title">KPI Dimension Analysis</h4>
          <div class="kpi-grid">
            ${(d.dimensions || []).map(dim => `
              <div class="kpi-item">
                <span style="font-size: 10pt; font-weight:500;">${dim.name}</span>
                <span style="font-weight: 800; color:${dim.status === 'good' ? PDF_COLORS.success : dim.status === 'warning' ? PDF_COLORS.warning : PDF_COLORS.danger}">${dim.score}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="page-footer">
          <span>OMNIAUDIT EXECUTIVE REPORT | ${domain}</span>
          <span style="font-weight:800;">Proprietary & Confidential</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${PDF_CSS}</style>
      </head>
      <body>
        <div class="pdf-container">
          <!-- Cover Page -->
          <div class="page cover-page">
            <div class="logo-text">OMNIAUDIT&reg;</div>
            <div class="cover-accent"></div>
            <h1 class="cover-title">Marketing Intelligence<br>Executive Audit</h1>
            <p class="cover-subtitle">A professional 14-dimensional audit of digital performance, strategic alignment, and growth opportunities.</p>
            
            <div class="cover-footer">
              <div class="cover-domain">${domain}</div>
              <div class="cover-date">${today} | Composite Score: ${results.composite}/100</div>
            </div>
          </div>

          <!-- Executive Summary -->
          <div class="page">
            <div class="section-header">
              <h1 class="section-title">Executive Summary</h1>
              <p class="section-tagline">High-level synthesis of systemic performance across all marketing modules.</p>
            </div>
            
            <div class="score-grid">
              <div class="score-card">
                <div class="score-label">Maturity Score</div>
                <div class="score-value" style="color:${gradeColor} !important;">${results.composite}</div>
                <div class="grade-badge" style="background:${gradeColor}20; color:${gradeColor}">GRADE: ${results.grade}</div>
              </div>
              <div style="display: flex; flex-direction: column; justify-content: center; padding-left: 10pt;">
                <h3 style="font-size:14pt; font-weight:800; margin-bottom:10pt; color:${PDF_COLORS.primary}">Strategic Outlook</h3>
                <p style="font-size: 11pt; color: ${PDF_COLORS.text}; line-height: 1.6;">
                  ${results.composite >= 85 ? 
                    'The digital infrastructure is exceptionally mature. Strategic focus should remain on high-level moats and incremental performance gains.' : 
                    results.composite >= 70 ? 
                    'Demonstrated competence with specific scalability gaps. Addressing the identified optimizations will yield immediate ROI improvements.' : 
                    results.composite >= 55 ? 
                    'Median performance with foundational weaknesses. A systematic restructuring of core marketing dimensions is recommended.' : 
                    'Critical operational failures detected. Urgent intervention is required to stabilize market position and prevent further attrition.'}
                </p>
              </div>
            </div>

            <div class="section">
              <h3 style="font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5pt; color:${PDF_COLORS.textLight}; margin-bottom: 15pt;">Performance Matrix</h3>
              <table class="summary-table">
                <thead>
                  <tr>
                    <th>Marketing Dimension</th>
                    <th>Performance Index</th>
                    <th style="text-align:center">Impact Weight</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>

            <div class="page-footer">
              <span>OMNIAUDIT EXECUTIVE REPORT | ${domain}</span>
              <span>Page 2 of ${agentsConfig.length + 2}</span>
            </div>
          </div>

          <!-- Agent Detail Pages -->
          ${agentDetailPages}
        </div>
      </body>
    </html>
  `;
}

export function buildDeepDivePdfHtml(results, agent, content) {
  const domain = results.url.replace(/https?:\/\//, '').replace(/\/$/, '');
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Convert markdown to professional HTML
  const htmlBody = content
    .replace(/```csv\n([\s\S]+?)```/g, (_, csv) => {
      const rows = csv.trim().split('\n').map(r => r.split(',').map(c => c.trim()));
      if (!rows.length) return '';
      const hdr = rows[0].map(h => `<th>${h}</th>`).join('');
      const bdy = rows.slice(1).map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
      return `<div class="section"><table><thead><tr>${hdr}</tr></thead><tbody>${bdy}</tbody></table></div>`;
    })
    .replace(/```[\w]*\n([\s\S]+?)```/g, '<div class="section"><pre style="background:#1e293b; color:#f8fafc; padding:15pt; border-radius:8pt; font-size:9pt; margin:15pt 0;"><code>$1</code></pre></div>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^---+$/gm, '<hr style="border:none; border-top:1pt solid #e2e8f0; margin:30pt 0;">')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0f172a;">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#f1f5f9; padding:2pt 4pt; border-radius:3pt; font-size:9pt;">$1</code>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>')
    .replace(/\n\n(?=[^<])/g, '</p><p>')
    .replace(/  \n/g, '<br>');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${PDF_CSS}</style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="page cover-page">
            <div class="logo-text">OMNIAUDIT&reg;</div>
            <div class="cover-accent" style="background:${PDF_COLORS.accent} !important;"></div>
            <div style="font-size:10pt; font-weight:800; text-transform:uppercase; letter-spacing:2pt; margin-bottom:15pt; color:${PDF_COLORS.accent} !important;">Deep Strategy Deliverable</div>
            <h1 class="cover-title">${agent.title}</h1>
            <p class="cover-subtitle">Detailed implementation framework and tactical roadmap for optimized ${agent.title.toLowerCase()} performance.</p>
            
            <div class="cover-footer">
              <div class="cover-domain">${domain}</div>
              <div class="cover-date">Generated: ${today}</div>
            </div>
          </div>

          <div class="page markdown-content">
            ${htmlBody}
            
            <div class="page-footer">
              <span>${agent.title.toUpperCase()} STRATEGY | ${domain}</span>
              <span style="font-weight:800;">Proprietary Deliverable</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
