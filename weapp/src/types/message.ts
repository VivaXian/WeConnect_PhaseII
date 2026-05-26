export type MessageCategory =
  | 'contract-expiry'    // 合同即将出保
  | 'contract-expired'   // 合同出保提醒
  | 'acceptance'         // 设备待验收提醒
  | 'pm-plan'            // PM月度计划提醒
  | 'pm-risk'            // PM风险提醒
  | 'permission-upgrade' // 权限升级审核通过
  | 'order-update';      // 服务关键节点提醒

export type ReadFilter = 'all' | 'unread' | 'read';
export type TypeFilter = MessageCategory | 'all';

export interface DeviceRef {
  id: string;
  name: string;
  department?: string;
  summary?: string;
}

export interface AppMessage {
  id: string;
  category: MessageCategory;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  forAdminOnly: boolean;
  // single message — navigation target
  deviceId?: string;
  deviceName?: string;
  workOrderId?: string;
  // aggregated message — expandable device list
  isAggregated?: boolean;
  devices?: DeviceRef[];
}

export const CATEGORY_LABEL: Record<MessageCategory, string> = {
  'contract-expiry': '合同即将出保',
  'contract-expired': '合同出保提醒',
  'acceptance': '待验收提醒',
  'pm-plan': 'PM 月度计划',
  'pm-risk': 'PM 风险提醒',
  'permission-upgrade': '权限升级',
  'order-update': '服务提醒',
};

export const CATEGORY_FILTER_LABEL: Record<TypeFilter, string> = {
  'all': '全部',
  'contract-expiry': '合同提醒',
  'contract-expired': '合同提醒',
  'acceptance': '验收提醒',
  'pm-plan': 'PM 计划',
  'pm-risk': 'PM 风险',
  'permission-upgrade': '服务提醒',
  'order-update': '服务提醒',
};
