import { useState } from 'react';
import { Scan } from '@filament/react/icons/scan';
import illustrationSrc from '../assets/icons/工程师资质验证引导插画.png';
import { MiniProgramNav } from '../components/mini-program-nav';
import { engineerVerifyStyles } from './engineer-verify-page.css';

interface EngineerVerifyPageProps {
  onBack: () => void;
}

export const EngineerVerifyPage = ({ onBack }: EngineerVerifyPageProps) => {
  const [scanned, setScanned] = useState(false);

  if (!scanned) {
    return (
      <div className={engineerVerifyStyles.page}>
        <MiniProgramNav variant="back" title="工程师资质查询" onBack={onBack} />

        <div className={engineerVerifyStyles.scrollContent}>
          <div className={engineerVerifyStyles.illustrationWrap}>
            <img
              src={illustrationSrc}
              className={engineerVerifyStyles.illustration}
              alt="扫描工程师卡二维码示意图"
            />
          </div>

          <div className={engineerVerifyStyles.titleSection}>
            <div className={engineerVerifyStyles.brandLabel}>原厂服务 ｜ 安心保障</div>
            <div className={engineerVerifyStyles.mainTitle}>飞利浦客户服务工程师资质查询</div>
            <div className={engineerVerifyStyles.actionDesc}>
              扫描<span className={engineerVerifyStyles.highlight}>工程师卡上的二维码</span>，即可查询该工程师的服务资质详情。
            </div>
            <div className={engineerVerifyStyles.metaNote}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="#8898aa" strokeWidth="1.6"/>
                <path d="M12 8v5M12 16v.5" stroke="#8898aa" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              为保障服务质量，建议在服务前对工程师资质进行查询。
            </div>
            <button
              type="button"
              className={engineerVerifyStyles.scanBtn}
              onClick={() => setScanned(true)}
            >
              <Scan size="small" />
              扫描工程师二维码
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={engineerVerifyStyles.page}>
      <MiniProgramNav variant="back" title="验证结果" onBack={() => setScanned(false)} />

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
