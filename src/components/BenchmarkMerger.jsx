import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, CheckSquare, Square, GitMerge } from 'lucide-react';

export default function BenchmarkMerger({ onMerge, currentBaseline = [] }) {
  // Pre-configured AI extracted features for demo
  const [aiFeatures, setAiFeatures] = useState([
    { id: 'ai-1', name: '实时多人协同编辑 (Real-time Collaboration)', selected: true },
    { id: 'ai-2', name: '块级内容架构 (Block-based Editor)', selected: true },
    { id: 'ai-3', name: '双向文档链接 (Bi-directional Linking)', selected: true },
    { id: 'ai-4', name: '数据库与看板视图 (Database Tables & Board)', selected: true },
    { id: 'ai-5', name: 'AI 辅助写作与续写 (AI Writing Copilot)', selected: false },
    { id: 'ai-6', name: '离线离步与本地同步 (Local-first & Offline Sync)', selected: false }
  ]);

  const [customFeatures, setCustomFeatures] = useState([
    '多端即时同步速度 < 1s',
    'PDF 与 Markdown 高度还原导出'
  ]);
  const [newInput, setNewInput] = useState('');

  const toggleAiFeature = (id) => {
    setAiFeatures(aiFeatures.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const addCustomFeature = () => {
    if (newInput.trim() && !customFeatures.includes(newInput.trim())) {
      setCustomFeatures([...customFeatures, newInput.trim()]);
      setNewInput('');
    }
  };

  const removeCustomFeature = (index) => {
    setCustomFeatures(customFeatures.filter((_, i) => i !== index));
  };

  const handleMerge = () => {
    const selectedAi = aiFeatures.filter(f => f.selected).map(f => f.name);
    const merged = [...selectedAi, ...customFeatures];
    onMerge(merged);
    alert(`基准融合成功！共生成 ${merged.length} 项比对指标，已应用到分析矩阵中。`);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <GitMerge size={24} style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>基准图谱融合器 (Benchmark Merger)</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
        AI 将自动提取巨头竞品的功能清单，并与您预设的业务标准指标进行“人机融合”，从而定义出一份独一无二的“行业基准功能对照图谱”。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }} className="pii-grid">
        {/* Left Column: AI Drafts */}
        <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
            <Sparkles size={16} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>AI 提取竞品功能大纲 (Top 3 标配)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {aiFeatures.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleAiFeature(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '0.65rem 0.85rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: item.selected ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                  border: `1px solid ${item.selected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {item.selected ? <CheckSquare size={16} style={{ color: 'var(--accent-cyan)' }} /> : <Square size={16} style={{ color: 'var(--text-muted)' }} />}
                <span style={{ fontSize: '0.85rem', color: item.selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Custom Features */}
        <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Plus size={16} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>PM 手动自定义核心指标</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="例如: 细粒度权限控制 (ACL)"
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomFeature()}
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            />
            <button className="btn btn-primary" onClick={addCustomFeature} style={{ padding: '0.55rem 1rem' }}>
              添加
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto' }}>
            {customFeatures.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.55rem 0.85rem', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)', 
                  borderRadius: 'var(--radius-sm)' 
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item}</span>
                <button 
                  onClick={() => removeCustomFeature(index)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {customFeatures.length === 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                暂未添加自定义指标，请在上方输入添加。
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleMerge} style={{ width: '100%', padding: '0.9rem' }}>
        <GitMerge size={16} /> 融合基准并生成综合对比表
      </button>
    </div>
  );
}
