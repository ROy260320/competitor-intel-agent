import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, Circle, Loader2 } from 'lucide-react';

export default function ThoughtLog({ progress, statusText, logs = [], targetCompany, competitors }) {
  const terminalEndRef = useRef(null);

  // Auto-scroll the terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Define structured steps
  const steps = [
    { id: 1, label: `解析意图并为 [${targetCompany}] 生成搜索关键词`, minProgress: 0, maxProgress: 34 },
    { id: 2, label: `检索网页并抓取竞品 [${competitors.join(', ')}] 的公开内容`, minProgress: 35, maxProgress: 89 },
    { id: 3, label: `汇总数据，准备人机协同（HITL）确认信源`, minProgress: 90, maxProgress: 100 }
  ];

  return (
    <div className="glass-panel" style={styles.container}>
      <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Loader2 className="spinner" size={18} style={{ color: 'var(--accent-cyan)' }} />
        Agent 实时检索与思考中
      </h2>

      {/* Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressText}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            工作流进度: <strong>{statusText}</strong>
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            {progress}%
          </span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Step Checklist */}
      <div style={styles.stepsList}>
        {steps.map((step) => {
          const isCompleted = progress >= step.maxProgress;
          const isActive = progress >= step.minProgress && progress < step.maxProgress;
          
          return (
            <div key={step.id} style={{ ...styles.stepRow, ...(isActive ? styles.activeStep : {}) }}>
              <div style={styles.stepIcon}>
                {isCompleted ? (
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
                ) : isActive ? (
                  <Loader2 size={18} className="spinner" style={{ color: 'var(--accent-cyan)' }} />
                ) : (
                  <Circle size={18} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <div style={{ ...styles.stepLabel, ...(isCompleted ? styles.completedText : isActive ? styles.activeText : {}) }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Log */}
      <div style={styles.terminalContainer}>
        <div style={styles.terminalHeader}>
          <Terminal size={14} style={{ color: 'var(--text-muted)', marginRight: '6px' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>AGENT CONSOLE LOGS</span>
        </div>
        <div style={styles.terminalBody}>
          {logs.length === 0 ? (
            <div style={styles.emptyLog}>等待系统日志输入...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={styles.logLine}>
                <span style={styles.logTimestamp}>[{new Date().toLocaleTimeString()}]</span>
                <span style={styles.logText}>{log}</span>
              </div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
  },
  progressSection: {
    marginBottom: '1.5rem',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent-cyan) 100%)',
    boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
    borderRadius: '3px',
    transition: 'width 0.4s ease-out',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  stepRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    padding: '0.65rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    background: 'rgba(255, 255, 255, 0.01)',
  },
  activeStep: {
    background: 'rgba(6, 182, 212, 0.03)',
    borderColor: 'rgba(6, 182, 212, 0.15)',
    boxShadow: '0 0 10px rgba(6, 182, 212, 0.05)',
  },
  stepIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  completedText: {
    color: 'var(--text-muted)',
    textDecoration: 'line-through',
  },
  activeText: {
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  terminalContainer: {
    background: 'rgba(5, 3, 10, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
  },
  terminalHeader: {
    background: 'rgba(20, 16, 38, 0.5)',
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
  },
  terminalBody: {
    padding: '0.75rem',
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
    fontSize: '0.78rem',
    maxHeight: '180px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  emptyLog: {
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  logLine: {
    lineHeight: '1.4',
    wordBreak: 'break-all',
  },
  logTimestamp: {
    color: 'var(--text-muted)',
    marginRight: '6px',
  },
  logText: {
    color: '#38bdf8',
  }
};
