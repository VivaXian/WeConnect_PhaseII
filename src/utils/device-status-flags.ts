import type { Device } from '../types/device';
import { BUSINESS_CONTRACT_LABEL } from '../types/device';

export type ContractStatus = 'good' | 'warning' | 'expired' | 'none';
export type FlagSignal = 'error' | 'warning' | 'caution' | 'information';

export interface DeviceStatusFlag {
  label: string;
  signal: FlagSignal;
}

interface FlagContext {
  isAdmin: boolean;
  hasActiveRepair: boolean;
}

export const daysFromToday = (dateStr: string): number => {
  const today = new Date();
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const contractDaysOf = (device: Device): number | null =>
  device.contractEnd ? daysFromToday(device.contractEnd) : null;

export const contractStatusOf = (device: Device): ContractStatus => {
  const days = contractDaysOf(device);
  if (days === null) return 'none';
  if (days > 120) return 'good';
  if (days > 0) return 'warning';
  return 'expired';
};

export const pmRiskOf = (device: Device): 'ok' | 'high' => {
  const status = contractStatusOf(device);
  const hasActiveContract = status === 'good' || status === 'warning';
  return !device.type.includes('超声') && !hasActiveContract && !device.pmNextDate ? 'high' : 'ok';
};

export const monthsSinceInstall = (device: Device): number | null => {
  if (!device.installDate) return null;
  const install = new Date(device.installDate);
  const today = new Date();
  return (today.getFullYear() - install.getFullYear()) * 12 + today.getMonth() - install.getMonth();
};

export const isContractPending = (device: Device): boolean => {
  const months = monthsSinceInstall(device);
  return !device.acceptancePending && months !== null && months < 6;
};

export const contractSummaryOf = (device: Device): string => {
  if (device.acceptancePending) return '待验收 · 当前无保障';
  if (isContractPending(device)) return '合同信息录入中';

  const status = contractStatusOf(device);
  if (status === 'none') return '暂无合同信息';
  if (status === 'expired') {
    return device.contractEnd ? `已于 ${device.contractEnd} 到期 · 当前无保障` : '当前无保障';
  }
  return `${BUSINESS_CONTRACT_LABEL[device.businessContract ?? 'none']} · 至 ${device.contractEnd}`;
};

export const isPmSoon = (device: Device): boolean => {
  if (!device.pmNextDate) return false;
  const days = daysFromToday(device.pmNextDate);
  return days >= 0 && days <= 30;
};

export const deviceStatusFlags = (
  device: Device,
  { isAdmin, hasActiveRepair }: FlagContext
): DeviceStatusFlag[] => {
  const contractStatus = contractStatusOf(device);
  const isRepairing =
    hasActiveRepair || device.status === 'under-repair' || device.status === 'pending-repair';
  const noContractRecord = contractStatus === 'none' && device.isDistributedDevice !== true;

  return [
    ...(device.status === 'offline' ? [{ label: '停机', signal: 'error' as const }] : []),
    ...(isAdmin && device.acceptancePending ? [{ label: '待验收', signal: 'warning' as const }] : []),
    ...(isRepairing ? [{ label: '报修中', signal: 'information' as const }] : []),
    ...(isAdmin && !device.acceptancePending && contractStatus === 'warning'
      ? [{ label: '即将出保', signal: 'warning' as const }]
      : []),
    ...(isAdmin && !device.acceptancePending && (contractStatus === 'expired' || noContractRecord)
      ? [{ label: '无保', signal: 'error' as const }]
      : []),
    ...(pmRiskOf(device) === 'high'
      ? [{ label: '保养风险', signal: 'caution' as const }]
      : isPmSoon(device)
        ? [{ label: '本月保养', signal: 'information' as const }]
        : []),
  ];
};
