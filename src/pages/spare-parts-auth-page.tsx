import { useState } from 'react';
import { sparePartsAuthStyles } from './spare-parts-auth-page.css';

interface SparePartsAuthPageProps {
  onBack: () => void;
}

export const SparePartsAuthPage = ({ onBack }: SparePartsAuthPageProps) => {
  const [scanning, setScanning] = useState(false);

  // Guide landing screen (before scan)
  if (!scanning) {
    return (
      <div className={sparePartsAuthStyles.page}>
        <div className={sparePartsAuthStyles.header}>
          <button className={sparePartsAuthStyles.backBtn} onClick={onBack} aria-label="返回">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={sparePartsAuthStyles.headerTitle}>备件防伪验证</span>
        </div>

        <div className={sparePartsAuthStyles.content}>
          <div className={sparePartsAuthStyles.icon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 4.42 3.45 8.56 8 9.56C16.55 20.56 20 16.42 20 12V6l-8-4z"
                stroke="#0161de" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className={sparePartsAuthStyles.title}>飞利浦备件正品验证</div>
          <div className={sparePartsAuthStyles.desc}>
            扫描贴在备件包装或机身上的<br/>
            飞利浦防伪二维码，即可查看正品认证状态
          </div>

          <div className={sparePartsAuthStyles.statusCard}>
            <div className={sparePartsAuthStyles.statusLabel}>二维码通常贴在哪里？</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {['备件纸盒或外包装侧面', '部件本体背面铭牌旁', '随附配件说明卡片上'].map((hint) => (
                <div key={hint} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    backgroundColor: '#0161de', flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: '#555' }}>{hint}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setScanning(true)}
            style={{
              marginTop: 8,
              backgroundColor: '#0161de',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              padding: '14px 0',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
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

  // Mock result screen (after "scanning")
  return (
    <div className={sparePartsAuthStyles.page}>
      <div className={sparePartsAuthStyles.header}>
        <button className={sparePartsAuthStyles.backBtn} onClick={() => setScanning(false)} aria-label="返回">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={sparePartsAuthStyles.headerTitle}>验证结果</span>
      </div>

      <div className={sparePartsAuthStyles.content}>
        <div className={sparePartsAuthStyles.icon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6v6c0 4.42 3.45 8.56 8 9.56C16.55 20.56 20 16.42 20 12V6l-8-4z"
              stroke="#0161de" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className={sparePartsAuthStyles.title}>正品验证通过</div>
        <div className={sparePartsAuthStyles.desc}>
          此备件已通过飞利浦正品认证
        </div>

        <div className={sparePartsAuthStyles.statusCard}>
          <div className={sparePartsAuthStyles.statusLabel}>验证状态</div>
          <div className={sparePartsAuthStyles.statusValue}>✓ 飞利浦原厂正品</div>
        </div>

        <div className={sparePartsAuthStyles.statusCard}>
          <div className={sparePartsAuthStyles.statusLabel}>备件信息</div>
          <div className={sparePartsAuthStyles.statusValue}>飞利浦原厂认证备件</div>
        </div>

        <button
          type="button"
          onClick={() => setScanning(false)}
          style={{
            marginTop: 8,
            backgroundColor: 'transparent',
            color: '#0161de',
            border: '1px solid #0161de',
            borderRadius: 10,
            padding: '12px 0',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            width: '100%',
          }}
        >
          再次扫描
        </button>
      </div>
    </div>
  );
};
