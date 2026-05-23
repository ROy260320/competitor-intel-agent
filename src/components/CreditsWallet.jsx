import React, { useState } from 'react';
import { Wallet, Coins, RefreshCw, ChevronRight, Check } from 'lucide-react';

export default function CreditsWallet({ credits = 1000000, billingLogs = [], onRecharge }) {
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  
  const packages = [
    { id: 'p1', price: 10, credits: 100000, desc: '小型探索包', bonus: '无赠送' },
    { id: 'p2', price: 30, credits: 350000, desc: '中型专业包', bonus: '多送 5 万积分' },
    { id: 'p3', price: 50, credits: 650000, desc: '企业扩容包', bonus: '多送 15 万积分 (首选)' }
  ];

  const handleSelectPack = (pack) => {
    setSelectedPack(pack);
    setShowPayModal(true);
  };

  const confirmPayment = () => {
    if (selectedPack && onRecharge) {
      onRecharge(selectedPack.credits);
      setShowPayModal(false);
      setSelectedPack(null);
      alert(`支付成功！已为您充值 ${selectedPack.credits.toLocaleString()} Token 积分。`);
    }
  };

  // Calculate percentage of credits remaining out of 1,000,000 pts
  const percent = Math.min(100, Math.max(0, (credits / 1000000) * 100)).toFixed(1);
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="glass-panel main-panel-card">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet size={24} style={{ color: 'var(--accent-amber)' }} />
          <h2 className="panel-title">Token 积分中心 & 计费账单</h2>
        </div>
      </div>

      <div className="wallet-card-grid">
        {/* Left Side: Circular Usage Widget */}
        <div className="wallet-sub-panel" style={{ alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>可用 Token 积分余额</h3>
          
          <div className="wallet-circle-progress">
            <svg height={radius * 2} width={radius * 2}>
              <circle
                stroke="rgba(0, 0, 0, 0.06)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="var(--accent-amber)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.35s' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="wallet-circle-center">
              <span className="wallet-balance-num">{credits.toLocaleString()}</span>
              <span className="wallet-balance-label">剩余 pts</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', marginTop: '2px' }}>{percent}% 余量</span>
            </div>
          </div>

          <div style={{ width: '100%', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            <span>会员套餐等级：<strong>专业订阅版 (Pro)</strong></span><br />
            <span>扣减结算规则：按 API 真实 Token 吞吐量换算 (1k token = 1 pts)</span>
          </div>

          <div style={{ width: '100%' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)', textAlign: 'left' }}>积分充值包 (模拟支付)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {packages.map(p => (
                <div 
                  key={p.id}
                  onClick={() => handleSelectPack(p)}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.5rem 0.75rem', 
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="interactive-row-hover"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-primary)' }}>+{p.credits.toLocaleString()} pts</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-amber)' }}>{p.desc} · {p.bonus}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                    ￥{p.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Billing Ledger Log */}
        <div className="wallet-sub-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>实时积分消费对账单 (Billing Ledger)</h3>
            <Coins size={16} style={{ color: 'var(--accent-amber)' }} />
          </div>

          <div className="billing-table-container" style={{ flex: 1 }}>
            <table className="comparison-table" style={{ fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.65rem 0.85rem' }}>时间</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>事件说明</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>估算 Token</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>扣减积分</th>
                </tr>
              </thead>
              <tbody>
                {billingLogs.map((log, index) => (
                  <tr key={index}>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>{log.date}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)' }}>{log.action}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>{log.tokens.toLocaleString()}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--accent-rose)', fontWeight: 'bold' }}>-{log.credits.toFixed(1)} pts</td>
                  </tr>
                ))}
                {billingLogs.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      暂无积分扣减明细。当您在【竞品雷达】启动分析，或在【飞书助理】执行动作后，账单将在此呈现。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Simulated Pay Modal */}
      {showPayModal && (
        <div className="lark-doc-overlay" style={{ background: 'rgba(6, 4, 15, 0.9)', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '320px', padding: '1.5rem', background: 'rgba(15, 8, 30, 0.95)', border: '1px solid rgba(245, 158, 11, 0.4)', textAlign: 'center', boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>微信 / 支付宝模拟收银台</h3>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>您正在充值：{selectedPack?.desc}</span><br />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-amber)' }}>+{selectedPack?.credits.toLocaleString()} pts</span>
              <div style={{ height: '120px', width: '120px', background: '#fff', margin: '0.75rem auto 0', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Simulated QR Code */}
                <div style={{ border: '2px solid var(--bg-main)', height: '100%', width: '100%', display: 'flex', flexWrap: 'wrap', opacity: 0.85 }}>
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} style={{ width: '16.66%', height: '16.66%', background: (i % 3 === 0 || i % 4 === 0 || i < 6 || i % 6 === 0) ? 'var(--bg-main)' : '#fff' }}></div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowPayModal(false)} style={{ flex: 1, padding: '0.55rem' }}>
                取消
              </button>
              <button className="btn btn-primary" onClick={confirmPayment} style={{ flex: 1, padding: '0.55rem', background: 'var(--accent-amber)', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}>
                模拟支付成功
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
