import type { WorkOrderType } from './work-order';

export type RepairStatus = 'in-service' | 'completed-pending' | 'cancelled';
export type ProgressIcon = 'person-headset' | 'checkmark-circle' | 'cross-circle';

export interface Engineer {
  name: string;
  role: string;
  phone?: string;
}

export interface RepairProgress {
  icon: ProgressIcon;
  label: string;
  date: string;
  detail: string;
  engineer?: Engineer;
}

export interface TimelineNode {
  icon: 'check' | 'person' | 'cube' | 'dot';
  label: string;
  date: string;
  detail?: string;
  isCompleted: boolean;
}

export interface LinkedWorkOrder {
  id: string;
  type: WorkOrderType;
  workOrderNo: string;
  status: string;
}

export interface RepairRecord {
  id: string;
  repairId: string;
  deviceName: string;
  hospital: string;
  department?: string;
  eq?: string;
  serialNo?: string;
  contactPerson?: string;
  contactPhone?: string;
  repairTime?: string;
  problemDescription?: string;
  statusTitle?: string;
  tagline?: string;
  status: RepairStatus;
  serviceTag?: string;
  progress: RepairProgress;
  buttons: string[];
  timeline?: TimelineNode[];
  linkedWorkOrders?: LinkedWorkOrder[];
}

export interface MonthGroup {
  month: string;
  records: RepairRecord[];
}
