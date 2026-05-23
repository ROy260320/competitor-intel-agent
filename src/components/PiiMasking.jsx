import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function PiiMasking({ roadmapText, onRoadmapChange, maskedWords, onMaskedWordsChange }) {
  const [inputText, setInputText] = useState(
    roadmapText || '计划在 2026年Q3 推出代号为 Ares 的下一代白板协作画布，重点攻克 Temu 海外团队对于多人同屏协同的排版性能痛点，首期销售目标为 1500万。'
  );
  
  const [dictionary, setDictionary] = useState(
    maskedWords && maskedWords.length > 0 ? maskedWords : [
      { raw: 'Ares', masked: '[Project_Beta_A]' },
      { raw: 'Temu', masked: '[Client_Gamma_B]' },
      { raw: '1500万', masked: '[Revenue_Target_C]' }
    ]
  );

  const [newRaw, setNewRaw] = useState('');
  const [newMasked, setNewMasked] = useState('');
  const [maskedText, setMaskedText] = useState('');
  const [restoredText, setRestoredText] = useState('');
  const [hideRaw, setHideRaw] = useState(false);

  // Perform masking and restoring
  useEffect(() => {
    let tempMasked = inputText;
    dictionary.forEach(pair => {
      if (pair.raw && pair.masked) {
        // Simple case-sensitive global replace
        const escapedRaw = pair.raw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedRaw, 'g');
        tempMasked = tempMasked.replace(regex, pair.masked);
      }
    });
    setMaskedText(tempMasked);

    // Restore test
    let tempRestored = tempMasked;
    dictionary.forEach(pair => {
      if (pair.raw && pair.masked) {
        const escapedMasked = pair.masked.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedMasked, 'g');
        tempRestored = tempRestored.replace(regex, pair.raw);
      }
    });
    setRestoredText(tempRestored);

    // Sync up to parent state
    if (onRoadmapChange) onRoadmapChange(inputText);
    if (onMaskedWordsChange) onMaskedWordsChange(dictionary);
  }, [inputText, dictionary]);

  const addPair = () => {
    if (newRaw.trim() && newMasked.trim()) {
      setDictionary([...dictionary, { raw: newRaw.trim(), masked: newMasked.trim() }]);
      setNewRaw('');
      setNewMasked('');
    }
  };

  const removePair = (index) => {
    setDictionary(dictionary.filter((_, i) => i !== index));
  };

  // Helper to render text with highlighted tags
  const renderHighlightedText = (text) => {
    let parts = [text];
    dictionary.forEach(pair => {
      let newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const escapedMasked = pair.masked.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`(${escapedMasked})`, 'g');
          const split = part.split(regex);
          split.forEach((subPart, i) => {
            if (subPart === pair.masked) {
              newParts.push(
                <span key={`${pair.masked}-${i}`} className="masked-highlight" title={`还原值: ${pair.raw}`}>
                  {pair.masked}
                </span>
              );
            } else if (subPart) {
              newParts.push(subPart);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
    return parts;
  };

  return (
    <div className="glass-panel main-panel-card">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={24} style={{ color: 'var(--accent-emerald)' }} />
          <h2 className="panel-title">安全脱敏防泄露引擎 (Roadmap PII Masking)</h2>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => setHideRaw(!hideRaw)}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          {hideRaw ? <Eye size={14} /> : <EyeOff size={14} />} {hideRaw ? '显示明文' : '遮蔽明文'}
        </button>
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong>本地脱敏防护已开启：</strong>机密文本会在本地被脱敏占位符替代，绝不会上传给外部大模型或搜索引擎。
        </span>
      </div>

      <div className="split-grid-responsive">
        {/* Left Side: Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">我方未发布的产品路线图 (Roadmap 明文)</label>
            <textarea
              className="form-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ 
                height: '140px', 
                resize: 'none', 
                fontSize: '0.88rem', 
                filter: hideRaw ? 'blur(5px)' : 'none',
                transition: 'filter var(--transition-fast)'
              }}
              placeholder="请输入您产品敏感的未来规划..."
            />
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--accent-emerald)' }}>本地脱敏替换字典 (PII Dictionary)</h3>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="敏感原词 (如 Ares)"
                value={newRaw}
                onChange={(e) => setNewRaw(e.target.value)}
                style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
              />
              <ArrowRight size={14} style={{ alignSelf: 'center', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="密文占位符 (如 [Project_Beta])"
                value={newMasked}
                onChange={(e) => setNewMasked(e.target.value)}
                style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
              />
              <button className="btn btn-primary" onClick={addPair} style={{ padding: '0.45rem 0.85rem' }}>
                添加
              </button>
            </div>

            <div className="pii-list" style={{ maxHeight: '140px', overflowY: 'auto' }}>
              {dictionary.map((pair, index) => (
                <div key={index} className="pii-item">
                  <span style={{ color: 'var(--text-primary)', filter: hideRaw ? 'blur(4px)' : 'none' }}>{pair.raw}</span>
                  <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                  <span className="pii-badge">{pair.masked}</span>
                  <button 
                    onClick={() => removePair(index)} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Masking Demonstration Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0, 0, 0, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📤</span> 发送至大模型的加密遮蔽文本 (Sent to Cloud LLM)
            </h3>
            <div style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6', 
              fontFamily: 'monospace',
              background: 'rgba(0, 0, 0, 0.02)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              flex: 1,
              overflowY: 'auto'
            }}>
              {renderHighlightedText(maskedText)}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0, 0, 0, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📥</span> 本地解密还原预览 (Restored locally on Client)
            </h3>
            <div style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-primary)', 
              lineHeight: '1.6', 
              background: 'rgba(0, 0, 0, 0.02)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              flex: 1,
              overflowY: 'auto',
              filter: hideRaw ? 'blur(5px)' : 'none',
              transition: 'filter var(--transition-fast)'
            }}>
              {restoredText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
