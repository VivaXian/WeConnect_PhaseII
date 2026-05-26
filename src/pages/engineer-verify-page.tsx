import { useState } from 'react';
import { engineerVerifyStyles } from './engineer-verify-page.css';

interface EngineerVerifyPageProps {
  onBack: () => void;
}

export const EngineerVerifyPage = ({ onBack }: EngineerVerifyPageProps) => {
  const [scanned, setScanned] = useState(false);

  if (!scanned) {
    return (
      <div className={engineerVerifyStyles.page}>
        <div className={engineerVerifyStyles.header}>
          <button className={engineerVerifyStyles.backBtn} onClick={onBack} aria-label="返回">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={engineerVerifyStyles.headerTitle}>工程师资质验证</span>
        </div>

        <div className={engineerVerifyStyles.content}>
          <div className={engineerVerifyStyles.icon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="7" r="3.5" stroke="#0161de" strokeWidth="1.8"/>
              <path d="M3 20c0-3.87 3.13-7 7-7" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M15 13.5l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className={engineerVerifyStyles.title}>飞利浦工程师资质验证</div>
          <div className={engineerVerifyStyles.desc}>
            扫描工程师服务证或名片上的二维码，<br/>
            验证其飞利浦授权工程师资质
          </div>

          <div className={engineerVerifyStyles.statusCard}>
            <div className={engineerVerifyStyles.statusLabel}>二维码在哪里？</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {['工程师服务证正面', '名片右下角或服务单末尾', '飞利浦工程师 App 个人页'].map((hint) => (
                <div key={hint} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#0161de', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#555' }}>{hint}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setScanned(true)}
            style={{
              marginTop: 8, backgroundColor: '#0161de', color: '#ffffff',
              border: 'none', borderRadius: 10, padding: '14px 0',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.8"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="1.8"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.8"/>
              <rect x="5" y="5" width="3" height="3" fill="white"/>
              <rect x="5" y="16" width="3" height="3" fill="white"/>
              <rect x="16" y="5" width="3" height="3" fill="white"/>
              <rect x="14" y="14" width="3" height="3" fill="white"/>
              <rect x="17" y="17" width="3" height="3" fill="white"/>
            </svg>
            开始扫描
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={engineerVerifyStyles.page}>
      <div className={engineerVerifyStyles.header}>
        <button className={engineerVerifyStyles.backBtn} onClick={() => setScanned(false)} aria-label="返回">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={engineerVerifyStyles.headerTitle}>验证结果</span>
      </div>

      <div className={engineerVerifyStyles.content}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          backgroundColor: '#e8f5e9', borderRadius: 20, padding: '8px 20px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#22c55e"/>
            <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#16a34a', fontWeight: 600, fontSize: 15 }}>授权工程师 · 认证有效</span>
        </div>

        <div className={engineerVerifyStyles.statusCard}>
          {([
            { label: '姓名', value: '王 工程师' },
            { label: '工号', value: 'ENG_20241' },
            { label: '资质等级', value: '高级认证工程师' },
            { label: '认证范围', value: '飞利浦医疗设备 · 全线' },
            { label: '有效期', value: '至 2026-12-31' },
          ] as { label: string; value: string }[]).map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              paddingTop: 8, paddingBottom: 8,
              borderBottom: '1px solid #f0f2f5',
            }}>
              <span style={{ fontSize: 13, color: '#888' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1a2234' }}>{value}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onBack}
          style={{
            marginTop: 8, backgroundColor: '#0161de', color: '#ffffff',
            border: 'none', borderRadius: 10, padding: '14px 0',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', width: '100%',
          }}
        >
          完成
        </button>
      </div>
    </div>
  );
};
