import { Text } from '@filament/react/text';
import type { Device } from '../types/device';
import { getModalityLabel } from '../utils/modality';
import { sheetStyles } from './upgrade-form-sheet.css';
import { recentlyUnboundStyles as s } from './recently-unbound-sheet.css';

interface RecentlyUnboundSheetProps {
  devices: Device[];
  retentionDays: number;
  noteOf: (device: Device) => string;
  showCampus?: boolean;
  daysLeft: (device: Device) => number;
  onRestore: (device: Device) => void;
  onClose: () => void;
}

const metaLines = (device: Device, showCampus?: boolean) => {
  const place = [device.department, device.location].filter(Boolean).join(' ');
  const modality = getModalityLabel(device.type);
  const detail = [modality, place].filter(Boolean).join(' · ');
  return showCampus ? [device.campus ?? '', detail] : [detail];
};

const identityLine = (device: Device) =>
  [
    device.eqNumber ? `EQ ${device.eqNumber}` : null,
    device.serialNumber ? `SN ${device.serialNumber}` : null,
  ]
    .filter(Boolean)
    .join('  ·  ');

export const RecentlyUnboundSheet = ({
  devices,
  retentionDays,
  noteOf,
  showCampus,
  daysLeft,
  onRestore,
  onClose,
}: RecentlyUnboundSheetProps) => (
  <div className={sheetStyles.overlay} onClick={onClose} role="presentation">
    <div
      className={sheetStyles.panel}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="最近解绑"
    >
      <div className={sheetStyles.handle} />
      <div className={sheetStyles.header}>
        <Text variant="heading-s">最近解绑</Text>
        <button type="button" className={sheetStyles.closeBtn} onClick={onClose} aria-label="关闭">
          ✕
        </button>
      </div>
      <div className={sheetStyles.divider} />

      <p className={s.hint}>解绑的设备保留 {retentionDays} 天，到期后自动移除。</p>

      {devices.length === 0 ? (
        <p className={s.empty}>暂无最近解绑的设备</p>
      ) : (
        <div className={s.list}>
          {devices.map((device) => {
            const note = noteOf(device);
            const identity = identityLine(device);
            return (
              <div key={device.id} className={s.row}>
                <div className={s.info}>
                  <span className={s.name}>
                    {device.name}
                    {note && <span className={s.note}>（{note}）</span>}
                  </span>
                  {metaLines(device, showCampus)
                    .filter(Boolean)
                    .map((line) => (
                      <span key={line} className={s.meta} title={line}>
                        {line}
                      </span>
                    ))}
                  {identity && <span className={s.meta}>{identity}</span>}
                  <span className={s.countdown}>{daysLeft(device)} 天后自动移除</span>
                </div>
                <button type="button" className={s.restoreBtn} onClick={() => onRestore(device)}>
                  恢复
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
