import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, AlertTriangle, ShieldCheck, X, FileEdit } from 'lucide-react';

export default function LarkBotSim({ roadmapText, maskedWords, generatedReport, onDeductCredits }) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      time: '昨天 18:32',
      type: 'text',
      content: '您好！我是 Airstack 竞品雷达助手。我会在每天早上 09:00 定时为您监测您在【配置面板】中设定的竞争对手（当前监听：Obsidian, Craft）的动态，并进行智能舆情过滤与 Roadmap 冲突比对。'
    },
    {
      id: 'm2',
      sender: 'bot',
      time: '今天 09:00',
      type: 'card',
      content: {
        title: '📢 Airstack 竞品雷达日报 - 2026.05.24',
        body: '系统昨夜执行了 12 次网络并行检索。监测到竞品 **Obsidian** 发布了全新版本更新，包含【Canvas 原生白板画布】和【局部离线同步协议】。同时，在 Twitter 和 Reddit 社区发现 140+ 条关于该功能的讨论，存在部分性能卡顿吐槽。这次更新对我方未来规划的水位产生了一定冲击。',
        actions: [
          { label: '📄 一键生成飞书文档', value: 'gen_doc' },
          { label: '⚡ 对比我方 Roadmap', value: 'compare_roadmap' }
        ]
      }
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDocOverlay, setShowDocOverlay] = useState(false);
  
  const messageEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Decode masked words back to raw words
  const restoreText = (text) => {
    let result = text;
    if (maskedWords && maskedWords.length > 0) {
      maskedWords.forEach(pair => {
        if (pair.raw && pair.masked) {
          const escapedMasked = pair.masked.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(escapedMasked, 'g');
          result = result.replace(regex, pair.raw);
        }
      });
    }
    return result;
  };

  const handleAction = (actionValue) => {
    if (actionValue === 'gen_doc') {
      // Add user message
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        content: '一键生成现阶段的飞书文档。'
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      
      // Simulate API call and credits subtraction
      if (onDeductCredits) {
        onDeductCredits(15.5, 'Lark OpenAPI: 生成云文档');
      }

      setTimeout(() => {
        setIsTyping(false);
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'doc_link',
          content: '已经为您成功生成了一份 Airstack 竞品情报分析文档，团队成员可在飞书云空间中共同协同批注。请点击 [Airstack 竞品分析文档-当前阶段.md] 打开飞书云文档查看。'
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1200);

    } else if (actionValue === 'compare_roadmap') {
      // Add user message
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        content: '对比我方 Roadmap，进行冲突分析。'
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      // Simulate API call and credits subtraction
      if (onDeductCredits) {
        onDeductCredits(20.0, 'Roadmap Advisor: 执行路线图冲突检测');
      }

      // Read current masked variables
      const rawProjectName = restoreText('[Project_Beta_A]');
      const rawClientName = restoreText('[Client_Gamma_B]');
      const rawTargetMetric = restoreText('[Revenue_Target_C]');

      setTimeout(() => {
        setIsTyping(false);
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          content: `📊 **Airstack 路线图风险比对报告**\n\n- **监测事件**：竞品 Obsidian 昨夜上线 Canvas 原生白板画布。\n- **比对结果**：与您在「安全脱敏」面板配置的内部 Roadmap 进行对比，发现其与您代号为 **\`${rawProjectName}\`**（对应脱敏占位符 \`[Project_Beta_A]\`）的项目重合度高达 **85%**！\n- **商业预警**：Obsidian 此次更新获得了社群 90%+ 的正面评价，仅在『移动端性能』上出现少量吐槽。由于我方 **\`${rawProjectName}\`** 项目计划于 2026年Q3 推出，重点同样是攻克 **\`${rawClientName}\`** 客户的多人同屏协同性能。对手已抢先一步卡位！\n- **建议行动**：\n  1. 建议将 **\`${rawProjectName}\`** 项目的优先级由 Medium 提升至 **High**。\n  2. 针对 Obsidian 白板对 **\`${rawClientName}\`** 用户的排版兼容性做深入调研，力争实现差异化（如提供更快的加载速度，实现首期 **\`${rawTargetMetric}\`** 商业目标）。\n\n您可回复“安排”让我在 Jira 中为研发创建加速工单。`
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1800);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      content: inputValue
    };
    setMessages(prev => [...prev, userMsg]);
    const userText = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = '抱歉，我不明白该指令。您可以回复“一键生成文档”或“对比Roadmap”让我协助您，或者回复“安排”快速创建研发工单。';
      
      if (userText.includes('安排') || userText.toLowerCase() === 'ap') {
        const rawProjectName = restoreText('[Project_Beta_A]');
        reply = `✅ **Jira 工单创建成功！**\n\n- **工单 ID**：\`[JIRA-8932]\`\n- **标题**：\`[Airstack 预警] 加速推进 ${rawProjectName} (多人协同白板项目) 以应对 Obsidian Canvas 竞争\`\n- **责任人**：Rahul\n- **关联组件**：飞书文档 [Airstack 竞品分析文档-当前阶段.md] 已自动作为附件关联至 Jira，研发可随时查看竞品痛点原声。`;
      } else if (userText.includes('生成文档') || userText.includes('飞书文档')) {
        handleAction('gen_doc');
        return;
      } else if (userText.includes('对比') || userText.includes('Roadmap') || userText.includes('路线图')) {
        handleAction('compare_roadmap');
        return;
      }
      
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        content: reply
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="lark-chat-container">
        {/* Chat Header */}
        <div className="lark-chat-header">
          <div className="lark-chat-avatar">A</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="lark-chat-title">Airstack 竞品雷达</span>
            <span className="lark-chat-subtitle">飞书智能助理 · 运行中</span>
          </div>
        </div>

        {/* Message List */}
        <div className="lark-message-list">
          {messages.map(msg => (
            <div key={msg.id} className={`lark-message-wrapper ${msg.sender === 'user' ? 'user' : ''}`}>
              <div className={`lark-chat-avatar ${msg.sender === 'user' ? 'user' : ''}`}>
                {msg.sender === 'bot' ? 'A' : 'PM'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80%' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.time}
                </span>

                {msg.type === 'text' && (
                  <div className="lark-message-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                )}

                {msg.type === 'card' && (
                  <div className="lark-message-card">
                    <div className="lark-card-title">{msg.content.title}</div>
                    <div className="lark-card-body">{msg.content.body}</div>
                    <div className="lark-card-actions">
                      {msg.content.actions.map((act, i) => (
                        <button 
                          key={i} 
                          className="lark-card-btn" 
                          onClick={() => handleAction(act.value)}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {msg.type === 'doc_link' && (
                  <div className="lark-message-bubble">
                    已经为您成功生成了一份 Airstack 竞品情报分析文档，团队成员可在飞书云空间中共同协同批注。请点击{' '}
                    <span 
                      onClick={() => setShowDocOverlay(true)}
                      style={{ 
                        color: 'var(--accent-cyan)', 
                        textDecoration: 'underline', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <FileText size={14} /> [Airstack 竞品分析文档-当前阶段.md]
                    </span>{' '}
                    打开飞书云文档查看。
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="lark-message-wrapper">
              <div className="lark-chat-avatar">A</div>
              <div className="lark-message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.6rem 1rem' }}>
                <div className="pulse-dot"></div>
                <div className="pulse-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="pulse-dot" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>

        {/* Input Area */}
        <div className="lark-chat-input-area">
          <input
            type="text"
            className="lark-chat-input"
            placeholder="向 Airstack 发送指令 (例如: 安排, 生成文档)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSend}
            style={{ padding: '0.5rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Simulated Lark Doc Fullscreen Overlay */}
      {showDocOverlay && (
        <div className="lark-doc-overlay">
          <div className="lark-doc-container">
            {/* Header */}
            <div className="lark-doc-header">
              <div className="lark-doc-title">
                <FileEdit size={18} style={{ color: '#3370ff' }} />
                <span>Airstack 竞品情报分析文档.md</span>
                <span className="lark-doc-meta-badge">协同编辑中</span>
              </div>
              <button className="lark-doc-close" onClick={() => setShowDocOverlay(false)}>
                <X size={18} />
              </button>
            </div>
            
            {/* Body */}
            <div className="lark-doc-body">
              <div className="lark-doc-content">
                <h1>🏆 Airstack 商业竞争情报综合分析报告</h1>
                <p style={{ fontSize: '0.9rem', color: '#646a73', marginBottom: '2rem' }}>
                  生成时间：2026-05-24 09:02 | 分析目标：Notion | 主要竞品：Obsidian, Craft | 提炼源信源：12 个筛选网页
                </p>

                <h2>一、 核心定位与 SWOT 矩阵分析</h2>
                <table>
                  <thead>
                    <tr>
                      <th style={{ color: '#34d399', background: '#e6fcf5' }}>🟢 Strengths (优势)</th>
                      <th style={{ color: '#fb7185', background: '#fff5f5' }}>🔴 Weaknesses (劣势)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <ul>
                          <li>多人实时协作体验极为流畅，支持评论与细粒度权限控制</li>
                          <li>丰富的企业级模板生态和数据库区块关联能力</li>
                        </ul>
                      </td>
                      <td>
                        <ul>
                          <li>**{restoreText('[Project_Beta_A]')}** 白板多人同屏协同在海外 **{restoreText('[Client_Gamma_B]')}** 用户处存在性能排版卡顿</li>
                          <li>国内和跨国离线状态下编辑易出现同步冲突冲突</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th style={{ color: '#22d3ee', background: '#e6fcfc' }}>🔵 Opportunities (机会)</th>
                      <th style={{ color: '#fbbf24', background: '#fffbeb' }}>🟡 Threats (威胁)</th>
                    </tr>
                    <tr>
                      <td>
                        <ul>
                          <li>针对 **{restoreText('[Client_Gamma_B]')}** 电商客户推出高度定制的原生表单和翻译看板</li>
                          <li>实现真正的“本地优先（Local-first）”白板架构以建立性能壁垒</li>
                        </ul>
                      </td>
                      <td>
                        <ul>
                          <li>Obsidian 推出 Canvas 原生画布，正以高性能、离线化不断蚕食我方核心市场</li>
                          <li>小团队和独立开发者正加速流向完全本地同步的工具</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h2>二、 竞品功能矩阵对比 (Feature Matrix)</h2>
                <table>
                  <thead>
                    <tr>
                      <th>对比指标/功能点</th>
                      <th>我方 (Notion)</th>
                      <th>Obsidian</th>
                      <th>Craft</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>实时多人协同编辑</td>
                      <td>支持 (SaaS 级强项)</td>
                      <td>不支持 (主要为本地 MD)</td>
                      <td>支持 (Apple 生态优化)</td>
                    </tr>
                    <tr>
                      <td>块级内容架构</td>
                      <td>支持 (标准 Block)</td>
                      <td>支持 (Canvas 画布整合)</td>
                      <td>支持 (Block级嵌套)</td>
                    </tr>
                    <tr>
                      <td>多人协作白板 (**{restoreText('[Project_Beta_A]')}**)</td>
                      <td>**规划中 (2026年Q3 推出)**</td>
                      <td>**已支持 (Canvas 画布, 性能极高)**</td>
                      <td>支持 (轻量画布)</td>
                    </tr>
                    <tr>
                      <td>海外 **{restoreText('[Client_Gamma_B]')}** 兼容性</td>
                      <td>**存在卡顿摩擦**</td>
                      <td>运行流畅 (本地渲染)</td>
                      <td>一般</td>
                    </tr>
                  </tbody>
                </table>

                <h2>三、 商业预警行动建议</h2>
                <div style={{ background: '#f5f6f7', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #3370ff', marginTop: '1rem' }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1f2329' }}>⚠️ Airstack 核心研判建议：</p>
                  <ol style={{ marginLeft: '1.25rem', fontSize: '0.925rem', lineHeight: '1.6' }}>
                    <li style={{ color: '#1f2329' }}>
                      将 **{restoreText('[Project_Beta_A]')}** 项目提升为优先级 **High**，全力在性能上进行对齐。
                    </li>
                    <li style={{ color: '#1f2329' }}>
                      针对海外 **{restoreText('[Client_Gamma_B]')}** 客户群体展开小范围调研，围绕首期 **{restoreText('[Revenue_Target_C]')}** 的收入目标快速试错。
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
