export type DeviceStatus = 'normal' | 'under-repair' | 'pending-repair' | 'offline';
export type ContractType = 'platinum' | 'gold' | 'basic' | 'none';
export type BusinessContract = 'warranty' | 'csa' | 'pos' | 'none';
// Chip filter keys for Super User device list (P3)
export type FilterStatus = 'all' | 'pm-this-month' | 'expiring-soon' | 'at-risk' | 'in-repair';

export interface Device {
  id: string;
  name: string;
  type: string;
  department: string;
  location: string;
  status: DeviceStatus;
  contract: ContractType;
  businessContract?: BusinessContract;
  contractStart?: string;
  contractEnd?: string;
  lastRepairDate?: string;
  serialNumber: string;
  pmLastDate?: string;
  pmNextDate?: string;
  pmRisk?: boolean;
}

export const DEVICE_STATUS_LABEL: Record<DeviceStatus, string> = {
  normal: '正常运行',
  'under-repair': '维修中',
  'pending-repair': '待维修',
  offline: '停机',
};

export const DEVICE_STATUS_SIGNAL: Record<DeviceStatus, 'success' | 'warning' | 'caution' | 'error'> = {
  normal: 'success',
  'under-repair': 'warning',
  'pending-repair': 'caution',
  offline: 'error',
};

export const CONTRACT_LABEL: Record<ContractType, string> = {
  platinum: '白金保',
  gold: '金保',
  basic: '基础保',
  none: '无合同',
};

export const BUSINESS_CONTRACT_LABEL: Record<BusinessContract, string> = {
  warranty: '白金保',
  csa: '白金保 Plus',
  pos: '按次付费服务',
  none: '暂无服务合同',
};
