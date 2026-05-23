import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Key, HelpCircle } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, apiKeys, onSave }) {
  const [openai, setOpenai] = useState(apiKeys.openai || '');
  const [openaiModel, setOpenaiModel] = useState(apiKeys.openaiModel || 'gpt-4o-mini');
  const [gemini, setGemini] = useState(apiKeys.gemini || '');
  const [geminiModel, setGeminiModel] = useState(apiKeys.geminiModel || 'gemini-1.5-flash');
  const [tavily, setTavily] = useState(apiKeys.tavily || '');

  useEffect(() => {
    if (isOpen) {
      setOpenai(apiKeys.openai || '');
      setOpenaiModel(apiKeys.openaiModel || 'gpt-4o-mini');
      setGemini(apiKeys.gemini || '');
      setGeminiModel(apiKeys.geminiModel || 'gemini-1.5-flash');
      setTavily(apiKeys.tavily || '');
    }
  }, [isOpen, apiKeys]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ openai, openaiModel, gemini, geminiModel, tavily });
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div className="glass-panel" style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <Key size={18} className="badge-purple" style={{ marginRight: '8px' }} />
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>API 密钥配置</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.warningBox}>
            <ShieldAlert size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              密钥仅安全存储在您的**浏览器本地 (localStorage)**，直接向大模型服务商发起请求，绝不上传至任何第三方服务器。
            </p>
          </div>

          <div style={styles.sectionTitle}>
            <span>1. 搜索 API (用于实时网页检索)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Tavily API Key</label>
            <input
              type="password"
              className="form-input"
              placeholder="tvly-..."
              value={tavily}
              onChange={(e) => setTavily(e.target.value)}
            />
            <span style={styles.helpText}>
              用于实时爬取竞品公开信息，未输入时系统将自动运行仿真数据。
            </span>
          </div>

          <div style={styles.sectionTitle}>
            <span>2. LLM 推理 API (用于情报分析提炼，二选一即可)</span>
          </div>

          <div style={styles.apiGrid}>
            <div style={styles.apiCol}>
              <h4 style={styles.brandTitle}>Google Gemini (推荐，低成本)</h4>
              <div className="form-group">
                <label className="form-label">Gemini API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="AIzaSy..."
                  value={gemini}
                  onChange={(e) => setGemini(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">模型选择</label>
                <select
                  className="form-input"
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  style={styles.select}
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash (极速/推荐)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (强逻辑/高耗)</option>
                </select>
              </div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.apiCol}>
              <h4 style={styles.brandTitle}>OpenAI</h4>
              <div className="form-group">
                <label className="form-label">OpenAI API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="sk-..."
                  value={openai}
                  onChange={(e) => setOpenai(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">模型选择</label>
                <select
                  className="form-input"
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                  style={styles.select}
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (轻量性价比高)</option>
                  <option value="gpt-4o">gpt-4o (完整版推理)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              保存配置
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 3, 10, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: '680px',
    padding: '2rem',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.75rem',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  warningBox: {
    display: 'flex',
    gap: '0.75rem',
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.15)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    borderLeft: '3px solid var(--primary)',
    paddingLeft: '0.5rem',
    marginTop: '0.5rem',
  },
  helpText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'block',
    marginTop: '0.25rem',
  },
  apiGrid: {
    display: 'flex',
    gap: '1.5rem',
    margin: '0.5rem 0',
  },
  apiCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
  },
  divider: {
    width: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'stretch',
  },
  select: {
    appearance: 'none',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1.25rem',
  }
};
