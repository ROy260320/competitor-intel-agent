import React, { useState } from 'react';
import { Plus, Trash2, Search, Play, Settings, AlertCircle, Cpu } from 'lucide-react';

export default function SetupPanel({ onStart, onOpenSettings, isMockMode }) {
  const [targetCompany, setTargetCompany] = useState('Notion');
  const [competitors, setCompetitors] = useState(['Obsidian', 'Craft']);
  const [focusAreas, setFocusAreas] = useState(['pricing', 'features', 'complaints']);

  const addCompetitor = () => {
    if (competitors.length < 3) {
      setCompetitors([...competitors, '']);
    }
  };

  const removeCompetitor = (index) => {
    if (competitors.length > 1) {
      const updated = competitors.filter((_, i) => i !== index);
      setCompetitors(updated);
    }
  };

  const handleCompetitorChange = (index, value) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const toggleFocusArea = (area) => {
    if (focusAreas.includes(area)) {
      if (focusAreas.length > 1) {
        setFocusAreas(focusAreas.filter(a => a !== area));
      }
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetCompany.trim()) return;
    
    // Filter out empty competitor names
    const activeCompetitors = competitors.filter(c => c.trim() !== '');
    if (activeCompetitors.length === 0) return;

    onStart({
      targetCompany: targetCompany.trim(),
      competitors: activeCompetitors,
      focusAreas
    });
  };

  return (
    <div className="glass-panel" style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>配置 Intelligence Agent</h2>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onOpenSettings} style={styles.settingsBtn}>
          <Settings size={16} />
        </button>
      </div>

      {isMockMode ? (
        <div style={styles.bannerMock}>
          <AlertCircle size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <strong>当前运行：演示/仿真模式</strong><br />
            将通过高逼真 Mock 引擎模拟搜索和提炼。输入 API 密钥可解锁真实检索。
          </div>
        </div>
      ) : (
        <div style={styles.bannerLive}>
          <Cpu size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <strong>当前运行：实时在线模式</strong><br />
            Agent 将调用 Tavily 实时抓取并调用大模型进行提炼。
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Target Company */}
        <div className="form-group">
          <label className="form-label">目标分析公司 (您的产品)</label>
          <input
            type="text"
            className="form-input"
            required
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="例如: Notion"
          />
        </div>

        {/* Competitor list */}
        <div className="form-group">
          <div style={styles.competitorHeader}>
            <label className="form-label" style={{ marginBottom: 0 }}>竞争对手名单 (最多 3 个)</label>
            {competitors.length < 3 && (
              <button type="button" onClick={addCompetitor} style={styles.addBtn}>
                <Plus size={14} /> 增加
              </button>
            )}
          </div>
          
          <div style={styles.competitorList}>
            {competitors.map((competitor, index) => (
              <div key={index} style={styles.competitorRow}>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder={`竞品 #${index + 1}`}
                  value={competitor}
                  onChange={(e) => handleCompetitorChange(index, e.target.value)}
                />
                {competitors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCompetitor(index)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Focus Areas */}
        <div className="form-group">
          <label className="form-label">关注情报领域</label>
          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={focusAreas.includes('pricing')}
                onChange={() => toggleFocusArea('pricing')}
                style={styles.checkbox}
              />
              <div style={{ ...styles.checkboxCustom, ...(focusAreas.includes('pricing') ? styles.checkboxActive : {}) }}>
                <span style={{ fontSize: '0.85rem' }}>💰 价格与订阅变动</span>
              </div>
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={focusAreas.includes('features')}
                onChange={() => toggleFocusArea('features')}
                style={styles.checkbox}
              />
              <div style={{ ...styles.checkboxCustom, ...(focusAreas.includes('features') ? styles.checkboxActive : {}) }}>
                <span style={{ fontSize: '0.85rem' }}>🚀 功能特性/版本日志</span>
              </div>
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={focusAreas.includes('complaints')}
                onChange={() => toggleFocusArea('complaints')}
                style={styles.checkbox}
              />
              <div style={{ ...styles.checkboxCustom, ...(focusAreas.includes('complaints') ? styles.checkboxActive : {}) }}>
                <span style={{ fontSize: '0.85rem' }}>💬 用户痛点与吐槽反馈</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          <Play size={16} /> 启动情报搜集 Agent
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  settingsBtn: {
    padding: '0.4rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerMock: {
    display: 'flex',
    gap: '0.5rem',
    background: 'rgba(6, 182, 212, 0.05)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '1.5rem',
    alignItems: 'flex-start',
  },
  bannerLive: {
    display: 'flex',
    gap: '0.5rem',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '1.5rem',
    alignItems: 'flex-start',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  competitorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  addBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary-hover)',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  competitorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  competitorRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  deleteBtn: {
    background: 'rgba(244, 63, 94, 0.1)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    color: 'var(--accent-rose)',
    padding: '0.65rem',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  checkboxLabel: {
    cursor: 'pointer',
    position: 'relative',
    display: 'block',
  },
  checkbox: {
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
    height: 0,
    width: 0,
  },
  checkboxCustom: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.65rem 0.85rem',
    display: 'flex',
    alignItems: 'center',
    transition: 'all var(--transition-fast)',
  },
  // We use inline JS styles to simulate checkbox :checked state
  checkboxActive: {
    background: 'rgba(147, 51, 234, 0.08)',
    borderColor: 'rgba(147, 51, 234, 0.4)',
  }
};
