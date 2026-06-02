import { useState } from 'react';
import { PhilipsShield } from '@filament/react/icons/philips-shield';
import { Scan } from '@filament/react/icons/scan';
import illustrationSrc from '../assets/icons/备件防伪扫描引导插画.png';
import weConnectLogoSrc from '../assets/icons/WeConnect小程序LOGO.svg';
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
          <span className={sparePartsAuthStyles.headerTitle}>备件真伪验证</span>
        </div>

        <div className={sparePartsAuthStyles.scrollContent}>
          <div className={sparePartsAuthStyles.illustrationWrap}>
            <img
              src={illustrationSrc}
              className={sparePartsAuthStyles.illustration}
              alt="扫描备件防伪二维码示意图"
            />
          </div>

          <div className={sparePartsAuthStyles.titleSection}>
            <div className={sparePartsAuthStyles.brandLabel}>正品溯源</div>
            <div className={sparePartsAuthStyles.mainTitle}>飞利浦备件{'​'}真伪验证</div>
            <div className={sparePartsAuthStyles.actionDesc}>
              扫描<span className={sparePartsAuthStyles.highlight}>备件外包装上的防伪码</span>，即可查询正品认证状态，<span className={sparePartsAuthStyles.highlight}>无需注册账号</span>。
            </div>
            <div className={sparePartsAuthStyles.metaNote}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="#8898aa" strokeWidth="1.6"/>
                <path d="M12 8v5M12 16v.5" stroke="#8898aa" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              为保障服务质量，建议在备件更换前进行核验。
            </div>
            <button
              type="button"
              className={sparePartsAuthStyles.scanBtn}
              onClick={() => setScanning(true)}
            >
              <Scan size="small" />
              扫描防伪码
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  return (
    <div className={sparePartsAuthStyles.resultPage}>
      <div className={sparePartsAuthStyles.resultHeader}>
        <button
          type="button"
          className={sparePartsAuthStyles.resultBackBtn}
          onClick={() => setScanning(false)}
          aria-label="返回"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
            <path d="M9 1L1 9L9 17" stroke="rgba(0,0,0,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={sparePartsAuthStyles.resultHeaderTitle}>飞利浦备件防伪系统</span>
        <button
          type="button"
          className={sparePartsAuthStyles.resultCloseBtn}
          onClick={onBack}
          aria-label="关闭"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2L16 16M16 2L2 16" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className={sparePartsAuthStyles.resultContent}>
        <div className={sparePartsAuthStyles.resultIconRow}>
          <PhilipsShield width={64} height={64} />
        </div>

        <div className={sparePartsAuthStyles.resultTitleBlock}>
          <div className={sparePartsAuthStyles.resultInfoTitle}>备件验证信息</div>
          <div className={sparePartsAuthStyles.resultSerialNum}>785021843</div>
        </div>

        <div className={sparePartsAuthStyles.resultDividerLine} />

        <div className={sparePartsAuthStyles.resultDetails}>
          {([
            { label: '扫码时间：', value: '2026-06-01 10:35' },
            { label: '备件描述：', value: 'CT GEN5.3 IQON CIRS MASTER, Z8' },
            { label: '备件编码：', value: '459801498681' },
            { label: '序列号：', value: '4CE325D193' },
            { label: '出库日期：', value: '2026-05-20' },
            { label: '客户名称：', value: 'Jiangsu Cancer Hospital' },
          ] as { label: string; value: string }[]).map(({ label, value }) => (
            <div key={label} className={sparePartsAuthStyles.resultDetailRow}>
              <span className={sparePartsAuthStyles.resultDetailLabel}>{label}</span>
              <span className={sparePartsAuthStyles.resultDetailValue}>{value}</span>
            </div>
          ))}
        </div>

        <div className={sparePartsAuthStyles.resultReferralCard}>
          <div className={sparePartsAuthStyles.resultReferralIcon}>
            <img src={weConnectLogoSrc} alt="WeConnect" width={40} height={40} />
          </div>
          <div className={sparePartsAuthStyles.resultReferralBody}>
            <span className={sparePartsAuthStyles.resultReferralTitle}>飞利浦医疗在线服务小程序</span>
            <span className={sparePartsAuthStyles.resultReferralSub}>设备极速报修 · 服务进度随时查看</span>
          </div>
          <button type="button" className={sparePartsAuthStyles.resultReferralBtn}>
            打开
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="#0161de" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
