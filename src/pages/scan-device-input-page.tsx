import { useState } from 'react';
import { scanDeviceInputStyles } from './scan-device-input-page.css';

type InputMode = 'repair' | 'bind';

interface ScanDeviceInputPageProps {
  onBack: () => void;
  onScanPress?: () => void;
}

export const ScanDeviceInputPage = ({ onBack, onScanPress }: ScanDeviceInputPageProps) => {
  const [deviceNumber, setDeviceNumber] = useState('');
  const [mode, setMode] = useState<InputMode>('repair');

  const canSubmit = deviceNumber.trim().length >= 4;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: look up device by number and navigate to device info for confirmation
  };

  return (
    <div className={scanDeviceInputStyles.page}>
      <div className={scanDeviceInputStyles.header}>
        <button className={scanDeviceInputStyles.backBtn} onClick={onBack} aria-label="返回">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={scanDeviceInputStyles.headerTitle}>输入设备编号</span>
      </div>

      <div className={scanDeviceInputStyles.content}>
        <div className={scanDeviceInputStyles.desc}>
          输入设备铭牌上的编号，可快速发起报修或将设备绑定到你的账户。
        </div>

        <div className={scanDeviceInputStyles.inputCard}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            {(['repair', 'bind'] as InputMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: mode === m ? 600 : 400,
                  backgroundColor: mode === m ? '#0161de' : '#f0f2f5',
                  color: mode === m ? '#ffffff' : '#555',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {m === 'repair' ? '报修' : '绑定设备'}
              </button>
            ))}
          </div>
          <div className={scanDeviceInputStyles.inputLabel}>设备编号</div>
          <input
            type="text"
            className={scanDeviceInputStyles.inputField}
            placeholder="例如：EQ-12345 或 SN2024XXXX"
            value={deviceNumber}
            onChange={(e) => setDeviceNumber(e.target.value)}
            aria-label="设备编号"
            autoFocus
          />
          <div className={scanDeviceInputStyles.inputHint}>
            设备编号通常印在设备铭牌或资产标签上
          </div>
        </div>

        <div className={scanDeviceInputStyles.actionRow}>
          <button
            type="button"
            className={canSubmit ? scanDeviceInputStyles.btnPrimary : scanDeviceInputStyles.btnPrimaryDisabled}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {mode === 'repair' ? '查询并报修' : '查询并绑定'}
          </button>

          <div className={scanDeviceInputStyles.dividerRow}>
            <div className={scanDeviceInputStyles.dividerLine} />
            <span className={scanDeviceInputStyles.dividerText}>或者</span>
            <div className={scanDeviceInputStyles.dividerLine} />
          </div>

          <button
            type="button"
            className={scanDeviceInputStyles.btnOutline}
            onClick={onScanPress}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="#0161de" strokeWidth="1.8"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="#0161de" strokeWidth="1.8"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="#0161de" strokeWidth="1.8"/>
              <rect x="5" y="5" width="3" height="3" fill="#0161de"/>
              <rect x="5" y="16" width="3" height="3" fill="#0161de"/>
              <rect x="16" y="5" width="3" height="3" fill="#0161de"/>
              <rect x="14" y="14" width="3" height="3" fill="#0161de"/>
              <rect x="17" y="17" width="3" height="3" fill="#0161de"/>
            </svg>
            扫码代替输入
          </button>
        </div>
      </div>
    </div>
  );
};
