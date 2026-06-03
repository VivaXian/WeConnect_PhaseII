import { useState } from 'react';
import { MiniProgramNav } from '../components/mini-program-nav';
import { Button } from '@filament/react/button';
import { LinkAdd } from '@filament/react/icons/link-add';
import { ReportSearch } from '@filament/react/icons/report-search';
import { Wrench } from '@filament/react/icons/wrench';
import type { Device } from '../types/device';
import { deviceList } from '../utils/device-data';
import { scanDeviceInputStyles as s } from './scan-device-input-page.css';

interface ScanDeviceInputPageProps {
  onBack: () => void;
  onScanPress?: () => void;
  onRepairPress?: (device: Device) => void;
  onRepairProgressPress?: (device: Device) => void;
  initialDevice?: Device;
}

type View = 'input' | 'confirm';

const lookupDevice = (input: string): Device | null => {
  const q = input.trim().toUpperCase();
  return (
    deviceList.find(
      (d) => d.eqNumber === q || d.serialNumber.toUpperCase() === q
    ) ??
    deviceList.find(
      (d) => d.eqNumber?.startsWith(q) || d.serialNumber.toUpperCase().startsWith(q)
    ) ??
    null
  );
};

const HISTORY_KEY = 'scan_device_history';
const MAX_HISTORY = 5;

const loadHistory = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const saveHistory = (query: string, prev: string[]): string[] => {
  const next = [query, ...prev.filter((q) => q !== query)].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
};

const CONTRACT_LABEL: Record<string, string> = {
  platinum: '白金保',
  gold: '金保',
  silver: '银保',
  warranty: '质保',
  none: '无合同',
};

const PersonHeadsetIcon = () => (
  <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="96" cy="96.125" r="82" fill="#00438A" fillOpacity="0.06"/>
    <path d="M61.0458 135.286C81.0583 131.899 78.234 116.531 78.234 113H112.869C112.869 116.531 110.942 131.899 130.954 135.286C143.408 137.514 153.405 145.64 157.505 155.297C158.5 157.639 156.602 160 154.057 160H37.9428C35.3979 160 33.4998 157.639 34.4945 155.297C38.5951 145.64 48.5924 137.514 61.0458 135.286Z" fill="#0072DB"/>
    <path d="M112.732 114.199C112.5 124.499 117 128.999 120 130.999L78.0137 120.989C78.0137 120.989 78.5305 117.541 78.2013 113.033L112.732 114.199Z" fill="#0052A3"/>
    <path d="M104 118H114.4C125.667 118 130 110 130 102V100M134 69V67C134 47.1177 116.987 31 96 31C75.0132 31 58 47.1177 58 67V69" stroke="#0052A3" strokeWidth="8"/>
    <path d="M126.118 67.0967L135.052 68.1852C139.438 68.7196 142.56 72.7083 142.026 77.0941L139.849 94.962C139.315 99.3478 135.326 102.47 130.94 101.936L122.006 100.847L126.118 67.0967Z" fill="#0072DB"/>
    <path d="M65.8812 67.0967L56.9473 68.1852C52.5614 68.7196 49.4392 72.7083 49.9736 77.0941L52.1507 94.962C52.6851 99.3478 56.6737 102.47 61.0596 101.936L69.9935 100.847L65.8812 67.0967Z" fill="#0072DB"/>
    <path d="M95.994 40C83.9609 40 65.0006 46.151 65.0006 66.0645C65.0006 83.4117 64.6607 103.846 80.4912 114.936C92.8655 121.688 99.2032 121.688 111.497 114.936C127.327 103.846 126.999 83.4117 126.999 66.0645C126.999 46.151 108.027 40 95.994 40Z" fill="#2E9DFF"/>
    <rect x="95" y="111" width="22" height="14" rx="7" fill="#D1ECFF"/>
  </svg>
);

const CaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12.177 1.95312L20.427 4.99805L20.76 5.12109L20.7542 5.47559L20.6409 12.0078V12.0547C20.6401 12.0876 20.638 12.1348 20.635 12.1943C20.629 12.3135 20.6173 12.4841 20.594 12.6963C20.5475 13.1202 20.4546 13.7133 20.2698 14.3975C19.9008 15.7631 19.1591 17.514 17.6633 19.0059L17.6624 19.0049C16.8919 19.8309 15.8989 20.5897 14.9045 21.1436C13.9179 21.6931 12.8686 22.0771 12.0042 22.0771C11.14 22.0771 10.0885 21.6926 9.08813 21.1445C8.07389 20.5888 7.04803 19.83 6.22388 19.0059L6.21704 18.998C4.78356 17.5051 4.07351 15.7545 3.72095 14.3916C3.54433 13.7088 3.45584 13.1173 3.41138 12.6943C3.38912 12.4826 3.37802 12.3122 3.37231 12.1934C3.36946 12.134 3.36819 12.0874 3.36743 12.0547C3.36705 12.0383 3.36656 12.0249 3.36646 12.0156C3.36643 12.0131 3.36647 12.0108 3.36646 12.0088L3.24634 5.47559L3.2395 5.12109L3.57349 4.99805L11.8313 1.95312L12.0042 1.88867L12.177 1.95312Z" fill="#EB9C00" stroke="#DE7510"/>
    <path d="M20.2538 5.46687L12.0038 2.42188L3.74634 5.46687L3.86634 11.9994C3.86634 11.9994 3.86634 15.8281 6.57759 18.6519C8.15634 20.2306 10.5263 21.5769 12.0038 21.5769C13.4813 21.5769 15.8438 20.2306 17.3101 18.6519C20.1413 15.8281 20.1413 11.9994 20.1413 11.9994L20.2538 5.46687Z" fill="url(#caseIconGrad)"/>
    <path d="M11.999 7.5C12.4132 7.50008 12.749 7.83584 12.749 8.25V11.25H15.749C16.1632 11.2501 16.499 11.5858 16.499 12C16.499 12.4142 16.1632 12.7499 15.749 12.75H12.749V15.75C12.749 16.1642 12.4132 16.4999 11.999 16.5C11.5848 16.5 11.249 16.1642 11.249 15.75V12.75H8.24902C7.83481 12.75 7.49902 12.4142 7.49902 12C7.49902 11.5858 7.83481 11.25 8.24902 11.25H11.249V8.25C11.249 7.83579 11.5848 7.5 11.999 7.5Z" fill="#DE7510"/>
    <defs>
      <linearGradient id="caseIconGrad" x1="12.0001" y1="2.42188" x2="12.0001" y2="21.5769" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD885"/>
        <stop offset="0.485" stopColor="#FFF6E0"/>
        <stop offset="1" stopColor="#FFD885"/>
      </linearGradient>
    </defs>
  </svg>
);

export const ScanDeviceInputPage = ({
  onBack,
  onScanPress,
  onRepairPress,
  onRepairProgressPress,
  initialDevice,
}: ScanDeviceInputPageProps) => {
  const [deviceNumber, setDeviceNumber] = useState('');
  const [view, setView] = useState<View>(initialDevice ? 'confirm' : 'input');
  const [foundDevice, setFoundDevice] = useState<Device | null>(initialDevice ?? null);
  const [bindConfirmed, setBindConfirmed] = useState(false);
  const [history, setHistory] = useState<string[]>(loadHistory);

  const canSubmit = deviceNumber.trim().length >= 4;

  const handleQuery = (query?: string) => {
    const q = query ?? deviceNumber;
    if (q.trim().length < 4) return;
    const device = lookupDevice(q);
    setFoundDevice(device);
    setHistory((prev) => saveHistory(q.trim().toUpperCase(), prev));
    setDeviceNumber(q);
    setView('confirm');
    setBindConfirmed(false);
  };

  const handleBack = () => {
    if (view === 'confirm') {
      setView('input');
    } else {
      onBack();
    }
  };

  const handleBindNext = () => {
    setDeviceNumber('');
    setBindConfirmed(false);
    setFoundDevice(null);
    setView('input');
  };

  if (view === 'confirm') {
    return (
      <div className={s.page}>
        <MiniProgramNav variant="back" title="飞利浦设备报修" onBack={handleBack} />

        <div className={s.confirmContent}>
          <div className={s.pictogramWrap}>
            <PersonHeadsetIcon />
          </div>

          {foundDevice ? (
            <>
              <div className={s.deviceCard}>
                <div className={s.deviceCardTop}>
                  <div className={s.deviceNameRow}>
                    <CaseIcon />
                    <span className={s.deviceName}>{foundDevice.name}</span>
                  </div>
                  <span className={s.deviceCampus}>{foundDevice.campus ?? foundDevice.department}</span>
                </div>
                <div className={s.deviceCardDivider} />
                <div className={s.deviceMetaRow}>
                  <div className={s.deviceMetaItem}>
                    <span className={s.deviceMetaLabel}>EQ</span>
                    <span className={s.deviceMetaValue}>{foundDevice.eqNumber ?? '—'}</span>
                  </div>
                  <div className={s.deviceMetaItem}>
                    <span className={s.deviceMetaLabel}>序列号</span>
                    <span className={s.deviceMetaValue}>{foundDevice.serialNumber}</span>
                  </div>
                </div>
              </div>

              <div className={s.actionButtons}>
                <Button
                  variant="primary"
                  shape="square"
                  onPress={() => onRepairPress?.(foundDevice)}
                >
                  <Wrench />
                  极速报修
                </Button>
                <Button
                  variant="secondary"
                  shape="square"
                  onPress={() => onRepairProgressPress?.(foundDevice)}
                >
                  <ReportSearch />
                  查询报修进展
                </Button>

                {bindConfirmed ? (
                  <div className={s.bindSuccessBlock}>
                    <div className={s.bindSuccessBadge}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      已绑定至设备列表
                    </div>
                    <button type="button" className={s.bindNextBtn} onClick={handleBindNext}>
                      绑定下一台设备 ›
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    shape="square"
                    onPress={() => setBindConfirmed(true)}
                  >
                    <LinkAdd />
                    绑定设备
                  </Button>
                )}

                <p className={s.actionHint}>报修过设备将自动被绑定至设备列表</p>

                {foundDevice.type.includes('超声') && (
                  <button type="button" className={s.ultraBanner}>
                  <div className={s.ultraBannerIcon}>
                    <svg width="20" height="20" viewBox="0 -2.5 24 24" fill="none" aria-hidden="true">
                      <path d="M3 6.5L12 3l9 3.5L12 10 3 6.5z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M7 8.5V13c0 1.66 2.24 3 5 3s5-1.34 5-3V8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 6.5V12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className={s.ultraBannerInfo}>
                    <span className={s.ultraBannerTitle}>飞利浦超声微课堂</span>
                    <span className={s.ultraBannerSub}>仪器操作&临床应用</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={s.ultraBannerChevron}>
                    <path d="M9 6l6 6-6 6" stroke="#8898aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className={s.notFound}>
              <p className={s.notFoundTitle}>未找到该设备</p>
              <p className={s.notFoundDesc}>
                编号「{deviceNumber.trim()}」在系统中暂无记录，请检查编号后重试，或联系飞利浦客服。
              </p>
              <button type="button" className={s.btnOutline} onClick={() => setView('input')}>
                重新输入
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title="输入设备编号" onBack={handleBack} />

      <div className={s.content}>
        <div className={s.inputCard}>
          <div className={s.inputLabel}>设备编号</div>
          <input
            type="text"
            className={s.inputField}
            placeholder="输入设备编号"
            value={deviceNumber}
            onChange={(e) => setDeviceNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            aria-label="设备编号"
            autoFocus
          />
          <div className={s.inputHint}>输入设备编号查询设备，然后选择报修或绑定</div>
        </div>

        <div className={s.actionRow}>
          <button
            type="button"
            className={canSubmit ? s.btnPrimary : s.btnPrimaryDisabled}
            onClick={() => handleQuery()}
            disabled={!canSubmit}
          >
            查询设备
          </button>

          <div className={s.dividerRow}>
            <div className={s.dividerLine} />
            <span className={s.dividerText}>或者</span>
            <div className={s.dividerLine} />
          </div>

          <button type="button" className={s.btnOutline} onClick={onScanPress}>
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

        {history.length > 0 && (
          <div className={s.historySection}>
            <div className={s.historyHeader}>
              <span className={s.historyTitle}>最近查询</span>
              <button
                type="button"
                className={s.historyClear}
                onClick={() => {
                  localStorage.removeItem(HISTORY_KEY);
                  setHistory([]);
                }}
              >
                清除
              </button>
            </div>
            {history.map((item) => (
              <button
                key={item}
                type="button"
                className={s.historyItem}
                onClick={() => handleQuery(item)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="#aab0bc" strokeWidth="1.8"/>
                  <path d="M12 7v5l3 3" stroke="#aab0bc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={s.historyItemText}>{item}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="#c8cdd6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

