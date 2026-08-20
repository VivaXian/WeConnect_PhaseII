export type WorkOrderType = 'repair' | 'maintenance' | 'fco' | 'install';
export type WorkOrderStatus = 'pending-sign' | 'in-progress' | 'expired' | 'completed';
export type WorkOrderServiceMode = 'onsite' | 'remote';

export const WORK_ORDER_TYPE_LABEL: Record<WorkOrderType, string> = {
  repair: '维修',
  maintenance: '保养',
  fco: 'FCO',
  install: '安装',
};

export const WORK_ORDER_SERVICE_MODE_LABEL: Record<WorkOrderServiceMode, string> = {
  onsite: '现场维修',
  remote: '远程维修',
};

export interface WorkOrder {
  id: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  deviceName: string;
  hospital: string;
  workOrderNo: string;
  requestTime: string;
}

export interface WorkOrderGroup {
  month: string;
  orders: WorkOrder[];
}
