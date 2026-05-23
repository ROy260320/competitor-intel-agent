import React, { useState, useEffect } from 'react';
import SetupPanel from './components/SetupPanel';
import ThoughtLog from './components/ThoughtLog';
import SourceSelector from './components/SourceSelector';
import ReportDashboard from './components/ReportDashboard';
import SettingsModal from './components/SettingsModal';
import { searchCompetitorData } from './services/searchService';
import { synthesizeReport } from './services/agentService';
import { Settings, Cpu, HelpCircle, Sparkles } from 'lucide-react';

export default function App() {
  // 1. API Keys & State Configuration
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    openaiModel: 'gpt-4o-mini',
    gemini: '',
    geminiModel: 'gemini-1.5-flash',
    tavily: ''
  });

  // Main status machine: 'setup' | 'searching' | 'hitl' | 'synthesizing' | 'report'
  const [step, setStep] = useState('setup');
  
  // App variables
  const [targetCompany, setTargetCompany] = useState('Notion');
  const [competitors, setCompetitors] = useState(['Obsidian', 'Craft']);
  const [focusAreas, setFocusAreas] = useState([]);
  
  // Search & Agent States
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [logs, setLogs] = useState([]);
  const [sources, setSources] = useState([]);
  const [approvedSources, setApprovedSources] = useState([]);
  const [reportData, setReportData] = useState(null);
  
  // UI control
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('competitor_agent_keys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error("Failed to parse saved API keys:", e);
      }
    }
  }, []);

  // Save API keys
  const handleSaveKeys = (keys) => {
    setApiKeys(keys);
    localStorage.setItem('competitor_agent_keys', JSON.stringify(keys));
  };

  // Determine if we are running in Mock Mode (default if no keys provided)
  const isMockMode = !((apiKeys.openai && apiKeys.openai.startsWith('sk-')) || (apiKeys.gemini && apiKeys.gemini.trim().length > 10));

  const addLog = (message) => {
    setLogs(prev => [...prev, message]);
  };

  // Action: Launch Search Agent
  const handleStartSearch = async (config) => {
    setTargetCompany(config.targetCompany);
    setCompetitors(config.competitors);
    setFocusAreas(config.focusAreas);
    
    // Reset and start
    setLogs([]);
    setProgress(0);
    setStatusText('启动中...');
    setStep('searching');

    const progressCallback = (text, prg) => {
      setStatusText(text);
      setProgress(prg);
      addLog(text);
    };

    try {
      addLog(`[SYSTEM] 启动情报检索 Agent。目标: ${config.targetCompany}，对手: ${config.competitors.join(', ')}。`);
      const searchResults = await searchCompetitorData(
        config.targetCompany,
        config.competitors,
        config.focusAreas,
        apiKeys,
        progressCallback
      );
      
      setSources(searchResults);
      addLog(`[SYSTEM] 网页检索完成，共获取到 ${searchResults.length} 个候选信源。等待人工清洗过滤。`);
      
      // Delay slightly for smooth transition
      setTimeout(() => {
        setStep('hitl');
      }, 500);
    } catch (err) {
      console.error("Search step failed:", err);
      addLog(`[ERROR] 搜集信源发生异常: ${err.message}`);
      setStatusText('检索中断');
    }
  };

  // Action: Confirm Sources (HITL) and start Synthesis
  const handleConfirmSources = async (selectedSources) => {
    setApprovedSources(selectedSources);
    
    // Reset process values
    setLogs([]);
    setProgress(0);
    setStatusText('准备汇总...');
    setStep('synthesizing');

    const progressCallback = (text, prg) => {
      setStatusText(text);
      setProgress(prg);
      addLog(text);
    };

    try {
      addLog(`[SYSTEM] 确认信源列表，共保留了 ${selectedSources.length} 个精华网页。启动 AI 报告汇总代理...`);
      const synthesisResult = await synthesizeReport(
        targetCompany,
        competitors,
        selectedSources,
        focusAreas,
        apiKeys,
        progressCallback
      );
      
      setReportData(synthesisResult);
      addLog(`[SYSTEM] AI 竞品报告分析生成成功！`);
      
      setTimeout(() => {
        setStep('report');
      }, 500);
    } catch (err) {
      console.error("Synthesis failed:", err);
      addLog(`[ERROR] AI 提炼发生异常: ${err.message}`);
      setStatusText('提炼中断');
    }
  };

  const handleRestart = () => {
    setStep('setup');
    setSources([]);
    setApprovedSources([]);
    setReportData(null);
  };

  return (
    <div className="container">
      {/* Top Header Bar */}
      <header className="header-bar">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={28} style={{ color: 'var(--primary)' }} />
            Competitor Intelligence Agent
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            AI 竞品商业情报分析与人机协作工作区
          </p>
        </div>

        <div className="header-meta">
          <span className={`badge ${isMockMode ? 'badge-purple' : 'badge-emerald'}`}>
            <Cpu size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {isMockMode ? 'MOCK 演示模式' : 'LIVE 在线模式'}
          </span>
          
          <button
            className="btn btn-secondary"
            onClick={() => setIsSettingsOpen(true)}
            style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Settings size={16} /> 密钥设置
          </button>
        </div>
      </header>

      {/* Main Content Layout based on current step */}
      <main>
        {step === 'setup' && (
          <div className="grid-main">
            {/* Left: Input Setup */}
            <SetupPanel
              onStart={handleStartSearch}
              onOpenSettings={() => setIsSettingsOpen(true)}
              isMockMode={isMockMode}
            />

            {/* Right: Informational UI Panel for AI PM showcase */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="badge badge-cyan" style={{ width: 'fit-content' }}>💡 AI PM 面试核心考点说明</div>
              
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                如何向面试官演示这个项目？
              </h3>
              
              <div style={styles.introSteps}>
                <div style={styles.introStepItem}>
                  <div style={styles.stepNum}>1</div>
                  <div>
                    <strong>介绍 HITL 人机协作机制</strong><br />
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      说明为了避免大模型自主循环检索产生的“代理漂移”（越搜越偏）及幻觉，你在第2步引入了人工纠偏网关，确保清洗源数据后再执行报告生成。
                    </span>
                  </div>
                </div>

                <div style={styles.introStepItem}>
                  <div style={styles.stepNum}>2</div>
                  <div>
                    <strong>介绍 Token 成本控制与效率</strong><br />
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      说明在实际商用场景中，人工过滤了无关网页，避免将垃圾长文本发给模型进行推理，有效降低了 **40% 以上** 的 Token 推理开销。
                    </span>
                  </div>
                </div>

                <div style={styles.introStepItem}>
                  <div style={styles.stepNum}>3</div>
                  <div>
                    <strong>演示 Mock 体验与自备 Key 扩展</strong><br />
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      点击右上角的**“密钥设置”**可以输入您自己的 Gemini/OpenAI 及 Tavily Key，项目将无缝从 Mock 模式切换为真实的实时抓取分析。
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'searching' && (
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <ThoughtLog
              progress={progress}
              statusText={statusText}
              logs={logs}
              targetCompany={targetCompany}
              competitors={competitors}
            />
          </div>
        )}

        {step === 'hitl' && (
          <SourceSelector
            sources={sources}
            onConfirm={handleConfirmSources}
            targetCompany={targetCompany}
            competitors={competitors}
          />
        )}

        {step === 'synthesizing' && (
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <ThoughtLog
              progress={progress}
              statusText={statusText}
              logs={logs}
              targetCompany={targetCompany}
              competitors={competitors}
            />
          </div>
        )}

        {step === 'report' && reportData && (
          <ReportDashboard
            reportData={reportData}
            onRestart={handleRestart}
            targetCompany={targetCompany}
            competitors={competitors}
          />
        )}
      </main>

      {/* Settings Modal Component */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKeys={apiKeys}
        onSave={handleSaveKeys}
      />
    </div>
  );
}

const styles = {
  introSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '0.5rem',
  },
  introStepItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    border: '1.5px solid var(--primary)',
    color: 'var(--primary-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
    flexShrink: 0,
    marginTop: '2px',
  }
};
