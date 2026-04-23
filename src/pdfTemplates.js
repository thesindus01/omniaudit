
/**
 * OMNIAUDIT PREMIUM PDF TEMPLATE ENGINE
 * High-fidelity, executive-grade document generation.
 */

const PDF_COLORS = {
  primary: '#0f172a',    // Deep Navy
  secondary: '#2563eb',  // Royal Blue
  accent: '#3b82f6',     // Bright Blue
  success: '#10b981',    // Emerald
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Rose
  text: '#1e293b',       // Slate 800
  textLight: '#64748b',  // Slate 500
  bg: '#ffffff',         // Pure White
  cardBg: '#f8fafc'      // Slate 50
};

const PDF_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
  
  body {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    color: ${PDF_COLORS.text};
    background: ${PDF_COLORS.bg};
    line-height: 1.6;
    margin: 0;
    padding: 0;
    font-size: 10pt;
  }

  .page {
    padding: 40pt 50pt;
    position: relative;
    page-break-after: always;
    min-height: 100vh;
  }

  /* Cover Page */
  .cover-page {
    background: linear-gradient(135deg, ${PDF_COLORS.primary} 0%, #1e3a8a 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
  }

  .cover-content {
    max-width: 80%;
  }

  .logo-placeholder {
    font-size: 24pt;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 40pt;
    opacity: 0.9;
  }

  .cover-title {
    font-size: 36pt;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 15pt;
  }

  .cover-subtitle {
    font-size: 16pt;
    font-weight: 400;
    color: rgba(255,255,255,0.7);
    margin-bottom: 50pt;
  }

  .cover-domain {
    font-size: 14pt;
    font-weight: 600;
    background: rgba(255,255,255,0.1);
    padding: 10pt 20pt;
    border-radius: 50pt;
    display: inline-block;
    margin-bottom: 20pt;
  }

  .cover-meta {
    font-size: 10pt;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  /* Typography */
  h1, h2, h3, h4 { margin: 0; padding: 0; color: ${PDF_COLORS.primary}; }
  
  .section-title {
    font-size: 22pt;
    font-weight: 800;
    margin-bottom: 8pt;
    border-bottom: 3pt solid ${PDF_COLORS.secondary};
    display: inline-block;
    padding-bottom: 4pt;
  }

  .section-subtitle {
    font-size: 11pt;
    color: ${PDF_COLORS.textLight};
    margin-bottom: 30pt;
  }

  /* Score Dashboard */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20pt;
    margin-bottom: 30pt;
  }

  .main-score-card {
    background: ${PDF_COLORS.cardBg};
    padding: 25pt;
    border-radius: 12pt;
    text-align: center;
    border: 1pt solid #e2e8f0;
  }

  .score-big {
    font-size: 64pt;
    font-weight: 800;
    line-height: 1;
    margin: 10pt 0;
  }

  .grade-badge {
    display: inline-block;
    padding: 4pt 12pt;
    border-radius: 6pt;
    font-weight: 700;
    font-size: 12pt;
    margin-bottom: 10pt;
    text-transform: uppercase;
  }

  /* Summary Table */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20pt;
  }

  th {
    text-align: left;
    padding: 10pt 12pt;
    background: ${PDF_COLORS.primary};
    color: #ffffff;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  td {
    padding: 8pt 12pt;
    border-bottom: 1pt solid #e2e8f0;
    font-size: 10pt;
  }

  tr:nth-child(even) td { background: #fcfcfc; }

  .pill {
    padding: 2pt 8pt;
    border-radius: 4pt;
    font-size: 8pt;
    font-weight: 600;
    display: inline-block;
  }

  /* Agent Section */
  .agent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20pt;
    padding-bottom: 10pt;
    border-bottom: 1pt solid #e2e8f0;
  }

  .agent-info { display: flex; align-items: center; gap: 10pt; }
  
  .agent-icon {
    width: 32pt;
    height: 32pt;
    background: ${PDF_COLORS.primary};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8pt;
    font-size: 16pt;
  }

  .finding-box {
    padding: 15pt;
    border-radius: 8pt;
    margin-bottom: 15pt;
  }

  .finding-box.danger { background: #fef2f2; border: 1pt solid #fecaca; }
  .finding-box.warning { background: #fffbeb; border: 1pt solid #fef3c7; }
  .finding-box.success { background: #f0fdf4; border: 1pt solid #bbf7d0; }

  .finding-title {
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8pt;
    display: flex;
    align-items: center;
    gap: 5pt;
  }

  .finding-list {
    margin: 0;
    padding-left: 15pt;
    list-style-type: square;
  }

  .finding-list li { margin-bottom: 5pt; font-size: 9.5pt; }

  /* Footer */
  .footer {
    position: absolute;
    bottom: 20pt;
    left: 50pt;
    right: 50pt;
    font-size: 8pt;
    color: ${PDF_COLORS.textLight};
    display: flex;
    justify-content: space-between;
    border-top: 1pt solid #e2e8f0;
    padding-top: 10pt;
  }

  /* Deep Dive Styles */
  .markdown-content h1 { font-size: 20pt; margin: 20pt 0 10pt; color: ${PDF_COLORS.primary}; }
  .markdown-content h2 { font-size: 16pt; margin: 18pt 0 8pt; color: ${PDF_COLORS.primary}; border-bottom: 1pt solid #e2e8f0; padding-bottom: 4pt; }
  .markdown-content h3 { font-size: 13pt; margin: 15pt 0 6pt; color: ${PDF_COLORS.secondary}; }
  .markdown-content p { margin-bottom: 10pt; }
  .markdown-content ul, .markdown-content ol { margin-bottom: 15pt; padding-left: 20pt; }
  .markdown-content li { margin-bottom: 5pt; }
  .markdown-content blockquote {
    border-left: 4pt solid ${PDF_COLORS.accent};
    background: ${PDF_COLORS.cardBg};
    padding: 10pt 15pt;
    margin: 15pt 0;
    font-style: italic;
  }
  .markdown-content table { margin: 20pt 0; }
  .markdown-content code { background: #f1f5f9; padding: 2pt 4pt; border-radius: 3pt; font-family: monospace; font-size: 9pt; }
  .markdown-content pre { background: #1e293b; color: #f8fafc; padding: 15pt; border-radius: 8pt; overflow: hidden; margin: 15pt 0; }

  .page-break { page-break-before: always; }
`;

export function buildExecutivePdfHtml(results, agentsConfig) {
  const domain = results.url.replace(/https?:\/\//, '').replace(/\/$/, '');
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const gradeColor = results.composite >= 85 ? PDF_COLORS.success : 
                     results.composite >= 70 ? PDF_COLORS.secondary :
                     results.composite >= 55 ? PDF_COLORS.warning : PDF_COLORS.danger;

  // 1. Summary Table Rows
  const tableRows = agentsConfig.map(agent => {
    const d = results.stats?.[agent.key];
    const score = d?.score ?? 'N/A';
    const color = score >= 70 ? PDF_COLORS.success : 
                  score >= 50 ? PDF_COLORS.warning : PDF_COLORS.danger;
    
    return `
      <tr>
        <td style="font-weight: 600;">${agent.title}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8pt;">
            <div style="width:60pt; height:6pt; background:#e2e8f0; border-radius:3pt; overflow:hidden;">
              <div style="width:${score}%; height:100%; background:${color};"></div>
            </div>
            <span style="font-weight:700; color:${color}">${score}/100</span>
          </div>
        </td>
        <td style="text-align:center; color:${PDF_COLORS.textLight}">${agent.weight}</td>
      </tr>
    `;
  }).join('');

  // 2. Agent Detail Pages
  const agentDetailPages = agentsConfig.map(agent => {
    const d = results.stats?.[agent.key];
    if (!d) return '';

    const scoreColor = d.score >= 70 ? PDF_COLORS.success : 
                       d.score >= 50 ? PDF_COLORS.warning : PDF_COLORS.danger;

    const issues = (d.identifiedIssues || []).map(i => `<li>${i}</li>`).join('');
    const solutions = (d.proposedSolutions || []).map(s => `<li>${s}</li>`).join('');

    return `
      <div class="page">
        <div class="agent-header">
          <div class="agent-info">
            <div class="agent-icon">${agent.title.charAt(0)}</div>
            <div>
              <h2 style="font-size: 18pt;">${agent.title}</h2>
              <p style="font-size: 9pt; color:${PDF_COLORS.textLight}">${agent.desc}</p>
            </div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 24pt; font-weight: 800; color:${scoreColor}">${d.score}<span style="font-size: 12pt; opacity: 0.5;">/100</span></div>
            <div class="pill" style="background:${scoreColor}20; color:${scoreColor}">
              ${d.score >= 70 ? 'Optimal' : d.score >= 50 ? 'Needs Work' : 'Critical'}
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="finding-box danger">
            <div class="finding-title" style="color:${PDF_COLORS.danger}">
              <span>⚠️</span> Identified Issues
            </div>
            <ul class="finding-list">
              ${issues || '<li>No critical issues identified.</li>'}
            </ul>
          </div>
          <div class="finding-box success">
            <div class="finding-title" style="color:${PDF_COLORS.success}">
              <span>✅</span> Strategic Solutions
            </div>
            <ul class="finding-list">
              ${solutions || '<li>Maintain current performance levels.</li>'}
            </ul>
          </div>
        </div>

        <div style="background:${PDF_COLORS.cardBg}; padding: 20pt; border-radius: 12pt; border: 1pt solid #e2e8f0;">
          <h4 style="font-size: 9pt; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10pt;">KPI Dimensions</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10pt;">
            ${(d.dimensions || []).map(dim => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding: 6pt 0; border-bottom: 1pt solid #e2e8f0;">
                <span style="font-size: 9pt;">${dim.name}</span>
                <span style="font-weight: 700; color:${dim.status === 'good' ? PDF_COLORS.success : dim.status === 'warning' ? PDF_COLORS.warning : PDF_COLORS.danger}">${dim.score}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="footer">
          <span>OMNIAUDIT EXECUTIVE REPORT | ${domain}</span>
          <span>PROPRIETARY & CONFIDENTIAL</span>
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
        <!-- Page 1: Cover -->
        <div class="page cover-page">
          <div class="cover-content">
            <div class="logo-placeholder">OMNIAUDIT&reg;</div>
            <h1 class="cover-title">Marketing Intelligence Executive Audit</h1>
            <p class="cover-subtitle">A Comprehensive 14-Dimensional Performance Analysis</p>
            <div class="cover-domain">${domain}</div>
            <div class="cover-meta">${today} | COMPOSITE SCORE: ${results.composite}/100</div>
          </div>
        </div>

        <!-- Page 2: Executive Summary -->
        <div class="page">
          <h1 class="section-title">Executive Summary</h1>
          <p class="section-subtitle">A high-level overview of the digital marketing performance across all analyzed modules.</p>
          
          <div class="dashboard-grid">
            <div class="main-score-card">
              <div class="grade-badge" style="background:${gradeColor}20; color:${gradeColor}">Grade: ${results.grade}</div>
              <div class="score-big" style="color:${gradeColor}">${results.composite}</div>
              <div style="font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color:${PDF_COLORS.textLight}">Composite Score</div>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center;">
              <h3 style="margin-bottom: 10pt;">Strategic Outlook</h3>
              <p style="font-size: 11pt; color: ${PDF_COLORS.text};">
                ${results.composite >= 85 ? 
                  'The digital presence is exceptionally strong. Focus should be on incremental optimizations and maintaining competitive moats.' : 
                  results.composite >= 70 ? 
                  'Solid performance with clear growth opportunities. Addressing the identified gaps could yield significant ROI improvement.' : 
                  results.composite >= 55 ? 
                  'Average performance with significant systemic issues. A strategic shift in several key marketing dimensions is recommended.' : 
                  'Critical failure points detected across multiple marketing channels. Urgent strategic intervention is required to prevent further loss of market share.'}
              </p>
            </div>
          </div>

          <h3 style="margin-bottom: 15pt; text-transform: uppercase; letter-spacing: 1px; font-size: 10pt; color:${PDF_COLORS.textLight}">Agent Performance Matrix</h3>
          <table>
            <thead>
              <tr>
                <th>Marketing Dimension</th>
                <th>Score & Progress</th>
                <th style="text-align:center">Weight</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            <span>OMNIAUDIT EXECUTIVE REPORT | ${domain}</span>
            <span>Page 2 of ${agentsConfig.length + 2}</span>
          </div>
        </div>

        <!-- Agent Detail Pages -->
        ${agentDetailPages}

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
  // Simple regex-based markdown converter for the PDF env
  const htmlBody = content
    .replace(/```csv\n([\s\S]+?)```/g, (_, csv) => {
      const rows = csv.trim().split('\n').map(r => r.split(',').map(c => c.trim()));
      if (!rows.length) return '';
      const hdr = rows[0].map(h => `<th>${h}</th>`).join('');
      const bdy = rows.slice(1).map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
      return `<table><thead><tr>${hdr}</tr></thead><tbody>${bdy}</tbody></table>`;
    })
    .replace(/```[\w]*\n([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^---+$/gm, '<hr>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ol">$2</li>')
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
        <div class="page cover-page">
          <div class="cover-content">
            <div class="logo-placeholder">OMNIAUDIT&reg;</div>
            <div class="pill" style="background:rgba(255,255,255,0.1); color:#fff; margin-bottom:20pt; border: 1pt solid rgba(255,255,255,0.2)">DEEP STRATEGY DELIVERABLE</div>
            <h1 class="cover-title">${agent.title}</h1>
            <p class="cover-subtitle">Detailed Strategic Implementation Framework</p>
            <div class="cover-domain">${domain}</div>
            <div class="cover-meta">Generated: ${today}</div>
          </div>
        </div>

        <div class="page markdown-content">
          ${htmlBody}
          
          <div class="footer">
            <span>${agent.title.toUpperCase()} STRATEGY | ${domain}</span>
            <span>PROPRIETARY DELIVERABLE</span>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function renderPdfInIframe(html, filename) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-9999;opacity:0;border:none;pointer-events:none;';
    document.body.appendChild(iframe);
    
    const iDoc = iframe.contentDocument || iframe.contentWindow.document;
    iDoc.open();
    iDoc.write(html);
    iDoc.close();

    // Ensure resources are loaded
    setTimeout(() => {
      const opt = {
        margin: [0, 0, 0, 0], // Margins handled in CSS .page
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false, 
          backgroundColor: '#ffffff',
          windowWidth: 794 // A4 width in pixels at 96dpi
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      // @ts-ignore
      html2pdf().set(opt).from(iDoc.body).save()
        .then(() => {
          document.body.removeChild(iframe);
          resolve();
        })
        .catch(err => {
          console.error('PDF generation error:', err);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
          reject(err);
        });
    }, 1500); // Give it plenty of time for fonts and layout
  });
}
