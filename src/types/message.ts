export type MessageCategory = 'contract-expiry' | 'contract-expired' | 'pm-plan' | 'pm-risk' | 'order-update';

export interface AppMessage {
  id: string;
  category: MessageCategory;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  deviceId?: string;
  deviceName?: string;
  forAdminOnly: boolean;
}

export const CATEGORY_LABEL: Record<MessageCategory, string> = {
  'contract-expiry': '合同到期提醒',
  'contract-expired': '设备脱保提醒',
  'pm-plan': '月度PM计划',
  'pm-risk': 'PM风险提醒',
  'order-update': '工单状态更新',
};
