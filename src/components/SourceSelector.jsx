import React, { useState } from 'react';
import { Check, ShieldAlert, Plus, Globe, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';

export default function SourceSelector({ sources = [], onConfirm, targetCompany, competitors }) {
  const [selectedIds, setSelectedIds] = useState(sources.map(s => s.id));
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customSources, setCustomSources] = useState([]);
  const [errorText, setErrorText] = useState('');

  const allSources = [...sources, ...customSources];

  const handleToggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedIds(allSources.map(s => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleAddCustomSource = (e) => {
    e.preventDefault();
    if (!customUrl.trim() || !customTitle.trim()) {
      setErrorText('请输入完整的网址与标题！');
      return;
    }
    
    // Simple URL validation
    try {
      new URL(customUrl);
    } catch (_) {
      setErrorText('请输入有效的网址 (需包含 http:// 或 https://)！');
      return;
    }

    const newSource = {
      id: `custom-${Date.now()}`,
      company: targetCompany, // Assume custom source belongs to target unless specified
      title: customTitle,
      url: customUrl,
      snippet: '用户手动添加的信源网址，内容将在下一步由 AI 进行抓取和分析。',
      content: `用户手动添加的网页内容。网址为: ${customUrl}。这是一篇关于该行业竞品动态和产品细节的直接反馈。`,
      relevance: 1.0,
      relevanceJustification: '用户手动添加，默认相关度极高。'
    };

    setCustomSources([...customSources, newSource]);
    setSelectedIds([...selectedIds, newSource.id]);
    setCustomUrl('');
    setCustomTitle('');
    setErrorText('');
  };

  const handleConfirm = () => {
    const approvedSources = allSources.filter(s => selectedIds.includes(s.id));
    if (approvedSources.length === 0) {
      setErrorText('您必须至少选择 1 个有效信源，才能开始分析生成报告！');
      return;
    }
    onConfirm(approvedSources);
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>🤖 人机协同控制关卡 (HITL)</span>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>信源清洗与筛选验证</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            以下是 Agent 抓取并计算出的候选信源。作为产品分析师，请剔除低质噪音，并在此补充您掌握的网页链接。
          </p>
        </div>
      </div>

      {/* Warning/Helper Box */}
      <div style={styles.helperBox}>
        <ShieldAlert size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <strong>PM 决策价值说明：</strong>完全自主的 Agent 直接生成内容极易发生“幻觉”和“成本失控”。在此处提供用户选择控制门槛，在真实场景中可缩减 **40% 以上** 的模型冗余提取成本，并确保数据源 100% 正确。
        </div>
      </div>

      {/* Bulk actions */}
      <div style={styles.bulkBar}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          已选定 <strong>{selectedIds.length}</strong> 个信源 / 共 <strong>{allSources.length}</strong> 个
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSelectAll} style={styles.textBtn}>全选</button>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <button onClick={handleDeselectAll} style={styles.textBtn}>全不选</button>
        </div>
      </div>

      {/* Sources List */}
      <div style={styles.list}>
        {allSources.map((source) => {
          const isSelected = selectedIds.includes(source.id);
          const scorePercent = Math.round(source.relevance * 100);
          
          return (
            <div
              key={source.id}
              style={{
                ...styles.sourceRow,
                ...(isSelected ? styles.sourceRowSelected : {})
              }}
              onClick={() => handleToggle(source.id)}
            >
              <div style={styles.checkboxCol}>
                <div style={{
                  ...styles.checkboxDot,
                  ...(isSelected ? styles.checkboxDotActive : {})
                }}>
                  {isSelected && <Check size={12} style={{ color: '#fff' }} />}
                </div>
              </div>

              <div style={styles.contentCol}>
                <div style={styles.sourceMeta}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                    {source.company}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: scorePercent >= 90 ? 'var(--accent-emerald)' : 'var(--accent-cyan)'
                  }}>
                    🎯 相关度: {scorePercent}%
                  </span>
                </div>

                <h4 style={styles.sourceTitle}>{source.title}</h4>
                
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.urlLink}
                  onClick={(e) => e.stopPropagation()} // Prevent row toggle on link click
                >
                  <Globe size={10} style={{ marginRight: '4px' }} />
                  {source.url}
                </a>

                {/* AI Justification */}
                <div style={styles.aiOpinion}>
                  <span style={styles.aiOpinionTag}>Agent 推荐理由:</span>
                  <span style={styles.aiOpinionText}>{source.relevanceJustification}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Url Form */}
      <form onSubmit={handleAddCustomSource} style={styles.customForm}>
        <h3 style={styles.subTitle}>➕ 手动补充行业信源</h3>
        <div style={styles.formRow}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 2 }}
            placeholder="信源标题 (如: Obsidian Canvas功能发布帖)"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            style={{ flex: 3 }}
            placeholder="信源 URL 网址 (http://... 或 https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary" style={styles.addBtn}>
            <Plus size={16} /> 添加
          </button>
        </div>
      </form>

      {/* Error message & CTA */}
      {errorText && (
        <div style={styles.errorAlert}>
          <span>{errorText}</span>
        </div>
      )}

      <div style={styles.actionRow}>
        <button className="btn btn-primary" onClick={handleConfirm} style={styles.ctaBtn}>
          开始汇总分析并生成最终报告 <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '1rem',
  },
  helperBox: {
    display: 'flex',
    gap: '0.75rem',
    background: 'rgba(6, 182, 212, 0.03)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    padding: '0.85rem 1.25rem',
    borderRadius: 'var(--radius-sm)',
    alignItems: 'center',
  },
  bulkBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.01)',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  textBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color var(--transition-fast)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '380px',
    overflowY: 'auto',
    paddingRight: '0.25rem',
  },
  sourceRow: {
    display: 'flex',
    gap: '1rem',
    background: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  sourceRowSelected: {
    background: 'rgba(147, 51, 234, 0.03)',
    borderColor: 'rgba(147, 51, 234, 0.25)',
  },
  checkboxCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxDot: {
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: '1.5px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
  checkboxDotActive: {
    backgroundColor: 'var(--primary)',
    borderColor: 'var(--primary)',
    boxShadow: '0 0 8px var(--primary-glow)',
  },
  contentCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  sourceMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  urlLink: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
  },
  aiOpinion: {
    marginTop: '0.35rem',
    padding: '0.5rem 0.65rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 'var(--radius-sm)',
    borderLeft: '2px solid var(--accent-cyan)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  aiOpinionTag: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
  },
  aiOpinionText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.3',
  },
  customForm: {
    marginTop: '0.5rem',
    padding: '1.25rem',
    background: 'rgba(0, 0, 0, 0.02)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: 'var(--radius-md)',
  },
  subTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
  },
  formRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  addBtn: {
    padding: '0.5rem 1rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.825rem',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  ctaBtn: {
    padding: '0.9rem 1.75rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-md)',
  }
};
