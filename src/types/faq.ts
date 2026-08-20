export type FaqCategory = 'repair' | 'device' | 'work-order' | 'maintenance' | 'account';

export const FAQ_CATEGORY_LABEL: Record<FaqCategory, string> = {
  repair: '报修',
  device: '设备',
  'work-order': '工单',
  maintenance: '保养',
  account: '账号',
};

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  priority: number;
}
