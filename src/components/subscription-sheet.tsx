import { Button } from '@filament/react/button';
import { useShallow } from 'zustand/react/shallow';
import type { UserRole } from '../stores/role-store';
import type { SubscriptionKey } from '../stores/subscription-store';
import { useSubscriptionStore } from '../stores/subscription-store';
import { subSheetStyles as s } from './subscription-sheet.css';

interface SubscriptionItem {
  key: SubscriptionKey;
  label: string;
  desc: string;
}

const USER_CATEGORIES: SubscriptionItem[] = [
  { key: 'pm-risk', label: '保养风险', desc: '设备保养风险评估提醒' },
  { key: 'account-notify', label: '账号通知', desc: '账号权限变更通知' },
];

const ADMIN_CATEGORIES: SubscriptionItem[] = [
  { key: 'contract-alert', label: '合同提醒', desc: '合同到期与即将到期提醒' },
  { key: 'acceptance', label: '验收提醒', desc: '设备待验收提醒' },
  { key: 'pm-plan', label: '保养计划', desc: '月度保养计划提醒' },
  { key: 'pm-risk', label: '保养风险', desc: '设备保养风险评估提醒' },
  { key: 'account-notify', label: '账号通知', desc: '账号权限变更通知' },
];

interface SubscriptionSheetProps {
  role: UserRole;
  onClose: () => void;
  filterKeys?: SubscriptionKey[];
}

export const SubscriptionSheet = ({ role, onClose, filterKeys }: SubscriptionSheetProps) => {
  const { subscriptions, toggle } = useSubscriptionStore(
    useShallow((state) => ({
      subscriptions: state.subscriptions,
      toggle: state.toggle,
    }))
  );

  const baseCategories = role === 'admin' ? ADMIN_CATEGORIES : USER_CATEGORIES;
  const categories = filterKeys
    ? baseCategories.filter((item) => filterKeys.includes(item.key))
    : baseCategories;

  return (
    <div className={s.overlay} onClick={onClose} role="presentation">
      <div
        className={s.panel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="消息订阅"
      >
        <div className={s.handle} />
        <div className={s.header}>
          <span className={s.title}>消息订阅</span>
          <button type="button" className={s.closeBtn} onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
        <div className={s.desc}>选择您希望接收的通知类型</div>
        <div className={s.divider} />
        <div className={s.list}>
          {categories.map((item) => (
            <div key={item.key} className={s.row}>
              <div className={s.rowLeft}>
                <span className={s.rowLabel}>{item.label}</span>
                <span className={s.rowDesc}>{item.desc}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={subscriptions[item.key]}
                className={subscriptions[item.key] ? s.switchOn : s.switchOff}
                onClick={() => toggle(item.key)}
                aria-label={`${subscriptions[item.key] ? '关闭' : '开启'}${item.label}通知`}
              />
            </div>
          ))}
        </div>
        <div className={s.footer}>
          <Button variant="primary" shape="square" onPress={onClose}>
            确认
          </Button>
        </div>
      </div>
    </div>
  );
};
