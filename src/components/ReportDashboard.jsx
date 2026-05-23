import React, { useState } from 'react';
import { Download, LayoutDashboard, Table, Calendar, Files, Sparkles, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ReportDashboard({ reportData, onRestart, targetCompany, competitors }) {
  const [activeTab, setActiveTab] = useState('swot');
  const [selectedSwotCompany, setSelectedSwotCompany] = useState(targetCompany);

  const { swot = {}, features = [], timeline = [], summaries = [] } = reportData;
  const allCompanies = [targetCompany, ...competitors];

  // Helper to handle markdown download
  const handleExportMarkdown = () => {
    let md = `# ${targetCompany} vs 竞品商业情报分析报告\n`;
    md += `*生成时间: ${new Date().toLocaleDateString()} | 竞品: ${competitors.join(', ')}*\n\n`;

    // 1. SWOT Section
    md += `## 一、 竞品 SWOT 矩阵分析\n`;
    Object.keys(swot).forEach(company => {
      md += `### 🏢 ${company} SWOT 分析\n`;
      md += `#### 💪 优势 (Strengths)\n`;
      swot[company].strengths.forEach(s => md += `- ${s}\n`);
      md += `#### 🛑 劣势 (Weaknesses)\n`;
      swot[company].weaknesses.forEach(w => md += `- ${w}\n`);
      md += `#### 🌟 机会 (Opportunities)\n`;
      swot[company].opportunities.forEach(o => md += `- ${o}\n`);
      md += `#### ⚡ 威胁 (Threats)\n`;
      swot[company].threats.forEach(t => md += `- ${t}\n`);
      md += `\n`;
    });

    // 2. Feature Matrix Section
    md += `## 二、 核心功能对比矩阵\n\n`;
    md += `| 功能维度 | ` + allCompanies.join(' | ') + ` |\n`;
    md += `| :--- | ` + allCompanies.map(() => ':---').join(' | ') + ` |\n`;
    features.forEach(row => {
      const cols = [row.feature];
      allCompanies.forEach(c => cols.push(row[c] || '未知'));
      md += `| ` + cols.join(' | ') + ` |\n`;
    });
    md += `\n`;

    // 3. Timeline Section
    md += `## 三、 竞品最新发布动态与时间线\n\n`;
    timeline.forEach(item => {
      md += `### 📅 [${item.date}] ${item.company} - ${item.event}\n`;
      md += `- **事件描述**: ${item.desc}\n`;
      md += `- **影响力级别**: ${item.impact}\n\n`;
    });

    // Create blobs and trigger download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${targetCompany}_competitor_analysis_report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeSwot = swot[selectedSwotCompany] || { strengths: [], weaknesses: [], opportunities: [], threats: [] };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>✨ 生成完毕</span>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>
            竞品商业情报看板
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            基于审核的 {summaries.length} 个高相关性网页信源，AI 提炼汇总完成。
          </p>
        </div>
        
        <div style={styles.btnGroup}>
          <button className="btn btn-secondary" onClick={onRestart} style={{ height: '42px' }}>
            <ArrowLeft size={16} /> 重新分析
          </button>
          <button className="btn btn-primary" onClick={handleExportMarkdown} style={{ height: '42px' }}>
            <Download size={16} /> 导出 Markdown
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          className={`tab-trigger ${activeTab === 'swot' ? 'active' : ''}`}
          onClick={() => setActiveTab('swot')}
        >
          <LayoutDashboard size={14} style={{ marginRight: '6px', display: 'inline' }} />
          SWOT 竞争力矩阵
        </button>
        <button
          className={`tab-trigger ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          <Table size={14} style={{ marginRight: '6px', display: 'inline' }} />
          核心功能对比
        </button>
        <button
          className={`tab-trigger ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Calendar size={14} style={{ marginRight: '6px', display: 'inline' }} />
          动态跟踪时间线
        </button>
        <button
          className={`tab-trigger ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          <Files size={14} style={{ marginRight: '6px', display: 'inline' }} />
          信源原文摘要 ({summaries.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div style={styles.panelBody}>
        
        {/* Tab 1: SWOT Matrix */}
        {activeTab === 'swot' && (
          <div>
            <div style={styles.swotHeader}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                选择查看公司 SWOT：
              </span>
              <div style={styles.companySelectors}>
                {allCompanies.map(c => (
                  <button
                    key={c}
                    style={{
                      ...styles.companySelectBtn,
                      ...(selectedSwotCompany === c ? styles.companySelectBtnActive : {})
                    }}
                    onClick={() => setSelectedSwotCompany(c)}
                  >
                    {c} {c === targetCompany && "(主)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="swot-grid">
              {/* Strengths */}
              <div className="swot-box swot-s">
                <h3 style={{ fontSize: '1.1rem' }}>💪 优势 (Strengths)</h3>
                <ul>
                  {activeSwot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="swot-box swot-w">
                <h3 style={{ fontSize: '1.1rem' }}>🛑 劣势 (Weaknesses)</h3>
                <ul>
                  {activeSwot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="swot-box swot-o">
                <h3 style={{ fontSize: '1.1rem' }}>🌟 机会 (Opportunities)</h3>
                <ul>
                  {activeSwot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>

              {/* Threats */}
              <div className="swot-box swot-t">
                <h3 style={{ fontSize: '1.1rem' }}>⚡ 威胁 (Threats)</h3>
                <ul>
                  {activeSwot.threats.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Feature Matrix Table */}
        {activeTab === 'matrix' && (
          <div className="table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>功能维度 (Feature Matrix)</th>
                  {allCompanies.map(c => (
                    <th key={c}>
                      {c} {c === targetCompany && "(主产品)"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((row, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.feature}</td>
                    {allCompanies.map(c => (
                      <td key={c}>{row[c] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 'timeline' && (
          <div style={styles.timelineList}>
            {timeline.length === 0 ? (
              <div style={styles.emptyText}>信源中没有提取到近期的重要版本发布与政策动态。</div>
            ) : (
              timeline.map((item, index) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineMeta}>
                    <span style={styles.timelineDate}>{item.date}</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                      {item.company}
                    </span>
                    <span
                      style={{
                        ...styles.impactBadge,
                        color: item.impact.includes('高') ? 'var(--accent-rose)' : item.impact.includes('中') ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                      }}
                    >
                      🔥 影响力: {item.impact}
                    </span>
                  </div>
                  
                  <h4 style={styles.timelineTitle}>{item.event}</h4>
                  <p style={styles.timelineDesc}>{item.desc}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Raw Sources summaries */}
        {activeTab === 'sources' && (
          <div style={styles.sourcesList}>
            {summaries.map((src, index) => (
              <div key={index} style={styles.sourceItem}>
                <h4 style={styles.sourceItemTitle}>{src.title}</h4>
                <a href={src.url} target="_blank" rel="noopener noreferrer" style={styles.sourceItemUrl}>
                  {src.url}
                </a>
                <div style={styles.sourceItemSummary}>
                  <strong>AI 提炼概要:</strong> {src.summary}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '1.25rem',
    marginBottom: '1.5rem',
  },
  btnGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  panelBody: {
    marginTop: '1.5rem',
  },
  swotHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    background: 'rgba(255, 255, 255, 0.01)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  companySelectors: {
    display: 'flex',
    gap: '0.5rem',
  },
  companySelectBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    padding: '0.4rem 0.85rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: '500',
    fontSize: '0.8rem',
    transition: 'all var(--transition-fast)',
  },
  companySelectBtnActive: {
    background: 'var(--primary)',
    borderColor: 'var(--primary)',
    color: '#fff',
    boxShadow: '0 0 10px var(--primary-glow)',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
    paddingLeft: '1rem',
    borderLeft: '2px solid rgba(147, 51, 234, 0.15)',
  },
  timelineItem: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
  },
  timelineMeta: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  timelineDate: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    fontFamily: 'var(--font-display)',
  },
  impactBadge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  timelineTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '0.35rem',
  },
  timelineDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: '2rem',
  },
  sourcesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sourceItem: {
    background: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    padding: '1rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  sourceItemTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  sourceItemUrl: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    width: 'fit-content',
  },
  sourceItemSummary: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    paddingLeft: '0.5rem',
    borderLeft: '2px solid var(--primary)',
  }
};
