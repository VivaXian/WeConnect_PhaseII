import type { WorkOrderType } from './work-order';

export type DeviceStatus = 'normal' | 'under-repair' | 'pending-repair' | 'offline';
export type ContractType = 'platinum' | 'gold' | 'basic' | 'none';
export type BusinessContract = 'warranty' | 'csa' | 'pos' | 'none';
export type ContractPeriodType = 'warranty' | 'pos' | 'csa';
// Stat-card filter keys
export type FilterStatus = 'all' | 'contract-risk' | 'pm-risk' | 'in-repair' | 'pm-plan';
export type UserFilterStatus = 'all' | 'pm-risk' | 'in-repair';

export interface ContractPeriod {
  type: ContractPeriodType;
  subType?: string;
  startDate: string;
  endDate: string;
}

export interface PmWorkOrderEntry {
  id: string;
  workOrderNo: string;
  status: string;
  date: string;
}

export interface DeviceWorkOrderEntry {
  id: string;
  type: WorkOrderType;
  workOrderNo: string;
  status: string;
  date?: string;
}

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
  contractHistory?: ContractPeriod[];
  lastRepairDate?: string;
  serialNumber: string;
  eqNumber?: string;
  customName?: string;
  campus?: string;
  pmLastDate?: string;
  pmNextDate?: string;
  pmRisk?: boolean;
  acceptancePending?: boolean;
  installDate?: string;
  isDistributedDevice?: boolean;
  canShowInstallDate?: boolean;
  pmWorkOrders?: PmWorkOrderEntry[];
  deviceWorkOrders?: DeviceWorkOrderEntry[];
}

export const DEVICE_STATUS_LABEL: Record<DeviceStatus, string> = {
  normal: '正常运行',
  'under-repair': '报修中',
  'pending-repair': '报修中',
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
  warranty: 'Warranty 保修期',
  csa: 'CSA 服务合同',
  pos: 'POS 按次计费',
  none: '暂无服务合同',
};

export const CONTRACT_PERIOD_LABEL: Record<ContractPeriodType, string> = {
  warranty: '质保合同',
  pos: '延保合同',
  csa: '维保合同',
};

export const CONTRACT_PERIOD_DESC: Record<ContractPeriodType, string> = {
  warranty: '质保期',
  pos: '延保期',
  csa: '维保',
};
