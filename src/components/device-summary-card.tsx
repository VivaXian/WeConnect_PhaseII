import clsx from 'clsx';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { Device } from '../types/device';
import type { RepairRecord } from '../types/repair';
import { useRoleStore } from '../stores/role-store';
import { deviceList } from '../utils/device-data';
import { getModality } from '../utils/device-modality';
import { activeRepairOfDevice, repairById } from '../utils/device-summary';
import type { DeviceStatusFlag } from '../utils/device-status-flags';
import { contractSummaryOf, deviceStatusFlags } from '../utils/device-status-flags';
import { deviceSummaryStyles as s } from './device-summary-card.css';

interface SummaryRow {
  key: string;
  value: string;
}

const repairRows = (repair: RepairRecord): SummaryRow[] => [
  { key: '报修号', value: repair.repairId },
  { key: '当前进度', value: `${repair.progress.label} · ${repair.progress.date.slice(5, 10)}` },
  ...(repair.progress.engineer
    ? [{ key: '服务工程师', value: repair.progress.engineer.name }]
    : []),
  ...(repair.repairTime ? [{ key: '报修时间', value: repair.repairTime.slice(0, 16) }] : []),
];

const deviceRows = (device: Device, repair: RepairRecord | undefined, canSeeContract: boolean): SummaryRow[] => [
  ...(repair ? [{ key: '报修进度', value: `${repair.repairId} · ${repair.progress.label}` }] : []),
  ...(canSeeContract ? [{ key: '服务合同', value: contractSummaryOf(device) }] : []),
  ...(device.pmNextDate ? [{ key: '下次保养', value: device.pmNextDate }] : []),
  { key: '设备编号', value: device.eqNumber ?? device.serialNumber ?? '—' },
];

interface DeviceSummaryCardProps {
  deviceId: string;
  caseId?: string;
  onOpenCase?: (caseId: string) => void;
  onOpenDevice?: (deviceName: string) => void;
}

const CHIP_CLASS: Record<DeviceStatusFlag['signal'], string> = {
  error: s.chipError,
  warning: s.chipWarn,
  caution: s.chipCaution,
  information: s.chipInfo,
};

export const DeviceSummaryCard = ({ deviceId, caseId, onOpenCase, onOpenDevice }: DeviceSummaryCardProps) => {
  const role = useRoleStore((state) => state.role);
  const device = deviceList.find((item) => item.id === deviceId);
  if (!device) return null;

  const repair = caseId ? repairById(caseId) : activeRepairOfDevice(device.name);
  const isRepairView = Boolean(caseId && repair);
  const rows = isRepairView && repair ? repairRows(repair) : deviceRows(device, repair, role === 'admin');
  const flags: DeviceStatusFlag[] =
    isRepairView && repair
      ? [{ label: repair.statusTitle ?? '服务中', signal: 'information' }]
      : deviceStatusFlags(device, { isAdmin: role === 'admin', hasActiveRepair: Boolean(repair) });

  const handlePress = () => {
    if (isRepairView && repair) {
      onOpenCase?.(repair.id);
      return;
    }
    onOpenDevice?.(device.name);
  };

  return (
    <button type="button" className={s.card} onClick={handlePress}>
      <span className={s.head}>
        <span className={s.glyph}>
          <img src={getModality(device.type).icon} width={28} height={28} alt="" aria-hidden="true" />
        </span>
        <span className={s.headText}>
          <span className={s.name}>{device.customName ?? device.name}</span>
          <span className={s.place}>{`${device.department} · ${device.location}`}</span>
          {flags.length > 0 && (
            <span className={s.chipRow}>
              {flags.map((flag) => (
                <span key={flag.label} className={clsx(s.chip, CHIP_CLASS[flag.signal])}>
                  {flag.label}
                </span>
              ))}
            </span>
          )}
        </span>
      </span>

      <span className={s.rows}>
        {rows.map((row) => (
          <span key={row.key} className={s.row}>
            <span className={s.key}>{row.key}</span>
            <span className={s.value}>{row.value}</span>
          </span>
        ))}
      </span>

      <span className={s.footer}>
        {isRepairView ? '查看报修详情' : '查看设备详情'}
        <ChevronRight className={s.chevron} aria-hidden="true" />
      </span>
    </button>
  );
};
