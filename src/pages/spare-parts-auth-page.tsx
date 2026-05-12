import { sparePartsAuthStyles } from './spare-parts-auth-page.css';

interface SparePartsAuthPageProps {
  onBack: () => void;
}

export const SparePartsAuthPage = ({ onBack }: SparePartsAuthPageProps) => {
  return (
    <div className={sparePartsAuthStyles.page}>
      <div className={sparePartsAuthStyles.header}>
        <button className={sparePartsAuthStyles.backBtn} onClick={onBack} aria-label="返回">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className={sparePartsAuthStyles.headerTitle}>备件防伪验证</span>
      </div>

      <div className={sparePartsAuthStyles.content}>
        <div className={sparePartsAuthStyles.icon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="#0161de" strokeWidth="1.8"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="#0161de" strokeWidth="1.8"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="#0161de" strokeWidth="1.8"/>
            <rect x="5" y="5" width="3" height="3" fill="#0161de"/>
            <rect x="5" y="16" width="3" height="3" fill="#0161de"/>
            <rect x="16" y="5" width="3" height="3" fill="#0161de"/>
            <rect x="14" y="14" width="3" height="3" fill="#0161de"/>
            <rect x="17" y="17" width="3" height="3" fill="#0161de"/>
          </svg>
        </div>

        <div className={sparePartsAuthStyles.title}>备件防伪验证</div>
        <div className={sparePartsAuthStyles.desc}>
          对准备件二维码<br />
          可进行正品验证
        </div>

        <div className={sparePartsAuthStyles.statusCard}>
          <div className={sparePartsAuthStyles.statusLabel}>验证状态</div>
          <div className={sparePartsAuthStyles.statusValue}>✓ 正品验证通过</div>
        </div>

        <div className={sparePartsAuthStyles.statusCard}>
          <div className={sparePartsAuthStyles.statusLabel}>备件信息</div>
          <div className={sparePartsAuthStyles.statusValue}>飞利浦原厂认证</div>
        </div>
      </div>
    </div>
  );
};
