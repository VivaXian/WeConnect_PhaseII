import { ChevronDown } from '@filament/react/icons/chevron-down';
import { Text } from '@filament/react/text';
import { scanButtonStyles } from './scan-button.css';

const QrCodeIcon = () => (
  <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="12" height="12" rx="1" stroke="white" strokeWidth="2.67" />
    <rect x="5" y="5" width="6" height="6" fill="white" />
    <rect x="18" y="2" width="12" height="12" rx="1" stroke="white" strokeWidth="2.67" />
    <rect x="21" y="5" width="6" height="6" fill="white" />
    <rect x="2" y="18" width="12" height="12" rx="1" stroke="white" strokeWidth="2.67" />
    <rect x="5" y="21" width="6" height="6" fill="white" />
    <rect x="18" y="18" width="5" height="5" fill="white" />
    <rect x="27" y="18" width="3" height="3" fill="white" />
    <rect x="18" y="27" width="3" height="3" fill="white" />
    <rect x="24" y="24" width="6" height="6" fill="white" />
    <rect x="23" y="18" width="2" height="7" fill="white" />
    <rect x="18" y="23" width="5" height="2" fill="white" />
  </svg>
);

export const ScanButton = () => (
  <div className={scanButtonStyles.section}>
    <div className={scanButtonStyles.buttonRow}>
      <button className={scanButtonStyles.scanCard} aria-label="扫码报修">
        <div className={scanButtonStyles.iconContainer}>
          <QrCodeIcon />
        </div>
        <div className={scanButtonStyles.textContainer}>
          <span className={scanButtonStyles.titleText}>扫码报修</span>
          <span className={scanButtonStyles.subtitleText}>扫描设备二维码</span>
        </div>
        <ChevronDown
          aria-hidden="true"
          className={scanButtonStyles.chevron}
          width={20}
          height={20}
        />
      </button>
      <div className={scanButtonStyles.manualSection}>
        <Text elementType="p" variant="body-s" className={scanButtonStyles.manualPrompt}>
          无法扫码？
        </Text>
        <Text elementType="p" variant="body-s" color="primary" className={scanButtonStyles.manualLink}>
          输入设备编号 →
        </Text>
      </div>
    </div>
  </div>
);
