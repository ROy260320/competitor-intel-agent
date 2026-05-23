import React, { useState, useEffect } from 'react';
import SetupPanel from './components/SetupPanel';
import ThoughtLog from './components/ThoughtLog';
import SourceSelector from './components/SourceSelector';
import ReportDashboard from './components/ReportDashboard';
import BenchmarkMerger from './components/BenchmarkMerger';
import PiiMasking from './components/PiiMasking';
import LarkBotSim from './components/LarkBotSim';
import CreditsWallet from './components/CreditsWallet';
import { searchCompetitorData } from './services/searchService';
import { synthesizeReport } from './services/agentService';
import { Cpu, HelpCircle, Sparkles } from 'lucide-react';

export default function App() {
  // 1. API Keys configuration (internal mock only for serverless client)
  const apiKeys = {};

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
  


  // Airstack Enterprise Sandbox States
  const [activeTab, setActiveTab] = useState('radar');
  const [credits, setCredits] = useState(980000); // 980,000 pts
  const [billingLogs, setBillingLogs] = useState([
    { date: '2026-05-23 14:12', action: '系统初始可用额度赠送', tokens: 0, credits: -1000000 },
    { date: '2026-05-23 15:20', action: '调试: 并行抓取 Notion 资料', tokens: 12400, credits: 12.4 },
    { date: '2026-05-23 15:22', action: '调试: SWOT 智能提炼生成', tokens: 7600, credits: 7.6 }
  ]);
  const [roadmapText, setRoadmapText] = useState('计划在 2026年Q3 推出代号为 Ares 的下一代白板协作画布，重点攻克 Temu 海外团队对于多人同屏协同的排版性能痛点，首期销售目标为 1500万。');
  const [maskedWords, setMaskedWords] = useState([
    { raw: 'Ares', masked: '[Project_Beta_A]' },
    { raw: 'Temu', masked: '[Client_Gamma_B]' },
    { raw: '1500万', masked: '[Revenue_Target_C]' }
  ]);
  const [customTaxonomy, setCustomTaxonomy] = useState([]);



  const addLog = (message) => {
    setLogs(prev => [...prev, message]);
  };

  // Billing credit deduction
  const handleDeductCredits = (amount, action) => {
    setCredits(prev => Math.max(0, prev - amount));
    setBillingLogs(prev => [
      {
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action: action,
        tokens: Math.round(amount * 1000),
        credits: amount
      },
      ...prev
    ]);
  };

  // Billing recharge
  const handleRecharge = (amount) => {
    setCredits(prev => prev + amount);
    setBillingLogs(prev => [
      {
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action: 'Token 积分充值',
        tokens: 0,
        credits: -amount
      },
      ...prev
    ]);
  };

  // Action: Launch Search Agent
  const handleStartSearch = async (config) => {
    setTargetCompany(config.targetCompany);
    setCompetitors(config.competitors);
    setFocusAreas(config.focusAreas);
    
    // Deduct credits for search initiation
    handleDeductCredits(12.4, 'Radar Agent: 竞品信源并行检索');

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
    
    // Deduct credits for report synthesis
    handleDeductCredits(28.2, 'Radar Agent: SWOT与功能对比分析生成');

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
            Airstack
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            企业级 AI 竞品雷达与人机协同分析工作区
          </p>
        </div>

        <div className="header-meta">
          <span className="badge badge-emerald">
            <Cpu size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Airstack 智能云引擎已就绪
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="workspace-tabs">
        <button 
          className={`workspace-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
        >
          📢 竞品雷达 (Radar)
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'benchmark' ? 'active' : ''}`}
          onClick={() => setActiveTab('benchmark')}
        >
          🛠️ 基准图谱融合 (Merger)
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'masking' ? 'active' : ''}`}
          onClick={() => setActiveTab('masking')}
        >
          🛡️ 数据安全脱敏 (PII)
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'lark' ? 'active' : ''}`}
          onClick={() => setActiveTab('lark')}
        >
          💬 飞书智能助理 (Lark Bot)
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'credits' ? 'active' : ''}`}
          onClick={() => setActiveTab('credits')}
        >
          🪙 积分与钱包 (Wallet)
        </button>
      </div>

      {/* Main Content Layout based on active tab and current step */}
      <main>
        {activeTab === 'radar' && (
          <>
            {step === 'setup' && (
              <div style={{ maxWidth: '580px', margin: '2rem auto 0' }}>
                <SetupPanel
                  onStart={handleStartSearch}
                />
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
          </>
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkMerger
            onMerge={(merged) => setCustomTaxonomy(merged)}
            currentBaseline={customTaxonomy}
          />
        )}

        {activeTab === 'masking' && (
          <PiiMasking
            roadmapText={roadmapText}
            onRoadmapChange={setRoadmapText}
            maskedWords={maskedWords}
            onMaskedWordsChange={setMaskedWords}
          />
        )}

        {activeTab === 'lark' && (
          <LarkBotSim
            roadmapText={roadmapText}
            maskedWords={maskedWords}
            generatedReport={reportData}
            onDeductCredits={handleDeductCredits}
          />
        )}

        {activeTab === 'credits' && (
          <CreditsWallet
            credits={credits}
            billingLogs={billingLogs}
            onRecharge={handleRecharge}
          />
        )}
      </main>


    </div>
  );
}

